package controller

import (
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"github.com/nrisk/backend/internal/assessment"
	"github.com/nrisk/backend/internal/domain"
	"github.com/nrisk/backend/internal/middleware"
	"github.com/nrisk/backend/internal/repository/firestore"
	"github.com/nrisk/backend/internal/storage"
	"github.com/nrisk/backend/pkg/logger"
	"github.com/nrisk/backend/pkg/validator"
)

// AssessmentController trata requisições de assessment declarativo.
type AssessmentController struct {
	answerRepo    *firestore.AnswerRepository
	scanRepo      *firestore.ScanRepository
	evidenceStore *storage.EvidenceStore
	questionsPath string
}

// NewAssessmentController cria um novo AssessmentController.
func NewAssessmentController(answerRepo *firestore.AnswerRepository, scanRepo *firestore.ScanRepository, evidenceStore *storage.EvidenceStore, questionsPath string) *AssessmentController {
	if questionsPath == "" {
		questionsPath = "assessment_questions.json"
	}
	return &AssessmentController{
		answerRepo:    answerRepo,
		scanRepo:      scanRepo,
		evidenceStore: evidenceStore,
		questionsPath: questionsPath,
	}
}

// ListQuestions retorna as perguntas do framework.
// GET /api/v1/assessment?framework=ISO27001
func (ac *AssessmentController) ListQuestions(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	_ = tenantID // isolamento: perguntas são globais; respostas filtradas por tenant

	frameworkID := c.Query("framework")
	if frameworkID == "" {
		frameworkID = "ISO27001"
	}
	q, err := assessment.LoadQuestionnaire(ac.questionsPath, frameworkID)
	if err != nil {
		logger.Warn("failed to load questionnaire", map[string]interface{}{"error": err.Error(), "framework": frameworkID})
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "framework not found", "code": "FRAMEWORK_NOT_FOUND"})
		return
	}
	c.JSON(http.StatusOK, q)
}

// SubmitAnswerRequest representa o body de POST /assessment/answer.
type SubmitAnswerRequest struct {
	QuestionID string `form:"question_id" json:"question_id" binding:"required"`
	ControlID  string `form:"control_id" json:"control_id" binding:"required"`
	Status     string `form:"status" json:"status" binding:"required"` // sim, nao, na
	Text       string `form:"text" json:"text"`
}

// SubmitAnswer salva uma resposta e opcionalmente faz upload da evidência.
// POST /api/v1/assessment/answer
// Form: question_id, control_id, status, text, evidence (file opcional)
func (ac *AssessmentController) SubmitAnswer(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	var req SubmitAnswerRequest
	if err := c.ShouldBind(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid request body", "code": "INVALID_REQUEST"})
		return
	}
	if req.Status != "sim" && req.Status != "nao" && req.Status != "na" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "status must be sim, nao or na", "code": "INVALID_STATUS"})
		return
	}
	if !validator.IsSafePathSegment(req.QuestionID) || !validator.IsSafePathSegment(req.ControlID) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid question_id or control_id format", "code": "INVALID_ID"})
		return
	}

	evidenceURL := ""
	if ac.evidenceStore != nil {
		file, err := c.FormFile("evidence")
		if err == nil && file != nil {
			f, err := file.Open()
			if err == nil {
				defer f.Close()
				evidenceURL, err = ac.evidenceStore.UploadEvidence(c.Request.Context(), tenantIDStr, req.QuestionID, filepath.Base(file.Filename), f)
				if err != nil {
					logger.Warn("evidence upload failed", map[string]interface{}{"error": err.Error(), "question_id": req.QuestionID})
				}
			}
		}
	}

	a := &domain.Answer{
		QuestionID:  req.QuestionID,
		ControlID:   req.ControlID,
		Status:      req.Status,
		Text:        req.Text,
		EvidenceURL: evidenceURL,
	}
	if err := ac.answerRepo.Save(c.Request.Context(), tenantIDStr, a); err != nil {
		logger.Error("failed to save answer", map[string]interface{}{
			"error":      err.Error(),
			"tenant":     tenantIDStr,
			"question":   req.QuestionID,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to save answer", "code": "SAVE_FAILED"})
		return
	}

	c.JSON(http.StatusCreated, a)
}

// GetHybridScore calcula e retorna o score híbrido: (T * 0.6) + (C * 0.4).
// GET /api/v1/assessment/score?framework=ISO27001&scan_id=opcional
func (ac *AssessmentController) GetHybridScore(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	frameworkID := c.Query("framework")
	if frameworkID == "" {
		frameworkID = "ISO27001"
	}
	scanID := c.Query("scan_id")

	// Score técnico: do scan ou 1000 (base) se não houver scan
	technicalScore := 1000
	if scanID != "" && ac.scanRepo != nil {
		if validator.IsSafePathSegment(scanID) {
			scan, err := ac.scanRepo.GetByID(c.Request.Context(), tenantIDStr, scanID)
			if err == nil && scan != nil {
				technicalScore = scan.Score
			}
		}
	}

	// Score declarativo: das respostas
	q, err := assessment.LoadQuestionnaire(ac.questionsPath, frameworkID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "framework not found", "code": "FRAMEWORK_NOT_FOUND"})
		return
	}

	answers, err := ac.answerRepo.ListByTenant(c.Request.Context(), tenantIDStr)
	if err != nil {
		logger.Error("failed to list answers", map[string]interface{}{"error": err.Error(), "tenant": tenantIDStr})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to load answers", "code": "LOAD_FAILED"})
		return
	}

	answersByQuestion := make(map[string]*domain.Answer)
	for _, a := range answers {
		answersByQuestion[a.QuestionID] = a
	}

	declarativeScore := assessment.ComputeDeclarativeScore(q.Questions, answersByQuestion)
	hybrid := assessment.ComputeHybridScore(technicalScore, declarativeScore)

	c.JSON(http.StatusOK, gin.H{
		"technical_score":    technicalScore,
		"declarative_score":  declarativeScore,
		"hybrid_score":       hybrid,
		"framework_id":       frameworkID,
	})
}
