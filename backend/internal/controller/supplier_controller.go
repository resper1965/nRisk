package controller

import (
	"net/http"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nrisk/backend/internal/assessment"
	"github.com/nrisk/backend/internal/domain"
	"github.com/nrisk/backend/internal/middleware"
	"github.com/nrisk/backend/internal/repository/firestore"
	"github.com/nrisk/backend/internal/storage"
	"github.com/nrisk/backend/pkg/logger"
	"github.com/nrisk/backend/pkg/validator"
)

// SupplierController trata requisicoes de CRUD de fornecedores e score TPRA.
type SupplierController struct {
	supplierRepo      *firestore.SupplierRepository
	scanRepo          *firestore.ScanRepository
	answerRepo        *firestore.AnswerRepository
	findingRepo       *firestore.FindingRepository
	snapshotRepo      *firestore.ScoreSnapshotRepository
	justificationRepo *firestore.FindingJustificationRepository
	evidenceStore     *storage.EvidenceStore
	questionsPath     string
}

// NewSupplierController cria um novo SupplierController.
func NewSupplierController(
	supplierRepo *firestore.SupplierRepository,
	scanRepo *firestore.ScanRepository,
	answerRepo *firestore.AnswerRepository,
	findingRepo *firestore.FindingRepository,
	snapshotRepo *firestore.ScoreSnapshotRepository,
	justificationRepo *firestore.FindingJustificationRepository,
	evidenceStore *storage.EvidenceStore,
	questionsPath string,
) *SupplierController {
	if questionsPath == "" {
		questionsPath = "assessment_questions.json"
	}
	return &SupplierController{
		supplierRepo:      supplierRepo,
		scanRepo:          scanRepo,
		answerRepo:        answerRepo,
		findingRepo:       findingRepo,
		snapshotRepo:      snapshotRepo,
		justificationRepo: justificationRepo,
		evidenceStore:     evidenceStore,
		questionsPath:     questionsPath,
	}
}

// CreateSupplierRequest body de POST /api/v1/suppliers.
type CreateSupplierRequest struct {
	Name         string `json:"name" binding:"required"`
	Domain       string `json:"domain" binding:"required"`
	CNPJ         string `json:"cnpj"`
	Criticality  string `json:"criticality" binding:"required"`
	Category     string `json:"category"`
	ContactName  string `json:"contact_name"`
	ContactEmail string `json:"contact_email"`
	Notes        string `json:"notes"`
}

// CreateSupplier cadastra um novo fornecedor.
// POST /api/v1/suppliers
func (sc *SupplierController) CreateSupplier(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	var req CreateSupplierRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "INVALID_BODY"})
		return
	}

	if !validator.IsValidHostname(req.Domain) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid domain format", "code": "INVALID_DOMAIN"})
		return
	}
	if !domain.ValidCriticalities[req.Criticality] {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "criticality must be critical, high, medium, or low", "code": "INVALID_CRITICALITY"})
		return
	}

	supplier := &domain.Supplier{
		TenantID:     tenantIDStr,
		Name:         req.Name,
		Domain:       req.Domain,
		CNPJ:         req.CNPJ,
		Criticality:  req.Criticality,
		Category:     req.Category,
		Status:       "pending_assessment",
		ContactName:  req.ContactName,
		ContactEmail: req.ContactEmail,
		Notes:        req.Notes,
	}

	if err := sc.supplierRepo.Create(c.Request.Context(), supplier); err != nil {
		logger.Error("failed to create supplier", map[string]interface{}{
			"error":  err.Error(),
			"tenant": tenantIDStr,
			"domain": req.Domain,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to create supplier", "code": "CREATE_FAILED"})
		return
	}

	// Disparar scan automatico do dominio do fornecedor
	if sc.scanRepo != nil {
		scan, err := sc.scanRepo.CreatePendingScan(c.Request.Context(), tenantIDStr, req.Domain)
		if err != nil {
			logger.Warn("failed to trigger auto-scan for supplier", map[string]interface{}{
				"error":       err.Error(),
				"supplier_id": supplier.ID,
				"domain":      req.Domain,
			})
		} else {
			logger.Info("auto-scan triggered for new supplier", map[string]interface{}{
				"scan_id":     scan.ID,
				"supplier_id": supplier.ID,
				"domain":      req.Domain,
			})
		}
	}

	c.Header("Location", "/api/v1/suppliers/"+supplier.ID)
	c.JSON(http.StatusCreated, gin.H{"supplier": supplier})
}

// ListSuppliers lista fornecedores do tenant com filtros opcionais.
// GET /api/v1/suppliers?criticality=critical&status=active
func (sc *SupplierController) ListSuppliers(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	criticality := c.Query("criticality")
	status := c.Query("status")

	if criticality != "" && !domain.ValidCriticalities[criticality] {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid criticality filter", "code": "INVALID_CRITICALITY"})
		return
	}
	if status != "" && !domain.ValidSupplierStatuses[status] {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid status filter", "code": "INVALID_STATUS"})
		return
	}

	suppliers, err := sc.supplierRepo.List(c.Request.Context(), tenantIDStr, criticality, status)
	if err != nil {
		logger.Error("failed to list suppliers", map[string]interface{}{
			"error":  err.Error(),
			"tenant": tenantIDStr,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to list suppliers", "code": "LIST_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"suppliers": suppliers, "total": len(suppliers)})
}

// GetSupplier retorna um fornecedor pelo ID.
// GET /api/v1/suppliers/:id
func (sc *SupplierController) GetSupplier(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	supplierID := c.Param("id")
	if !validator.IsValidUUID(supplierID) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid supplier id format", "code": "INVALID_ID"})
		return
	}

	supplier, err := sc.supplierRepo.GetByID(c.Request.Context(), tenantIDStr, supplierID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "supplier not found", "code": "NOT_FOUND"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"supplier": supplier})
}

// UpdateSupplierRequest body de PATCH /api/v1/suppliers/:id.
type UpdateSupplierRequest struct {
	Name         *string `json:"name"`
	Criticality  *string `json:"criticality"`
	Category     *string `json:"category"`
	Status       *string `json:"status"`
	ContactName  *string `json:"contact_name"`
	ContactEmail *string `json:"contact_email"`
	Notes        *string `json:"notes"`
}

// UpdateSupplier atualiza dados de um fornecedor.
// PATCH /api/v1/suppliers/:id
func (sc *SupplierController) UpdateSupplier(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	supplierID := c.Param("id")
	if !validator.IsValidUUID(supplierID) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid supplier id format", "code": "INVALID_ID"})
		return
	}

	supplier, err := sc.supplierRepo.GetByID(c.Request.Context(), tenantIDStr, supplierID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "supplier not found", "code": "NOT_FOUND"})
		return
	}

	var req UpdateSupplierRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "INVALID_BODY"})
		return
	}

	if req.Name != nil {
		supplier.Name = *req.Name
	}
	if req.Criticality != nil {
		if !domain.ValidCriticalities[*req.Criticality] {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid criticality", "code": "INVALID_CRITICALITY"})
			return
		}
		supplier.Criticality = *req.Criticality
	}
	if req.Category != nil {
		supplier.Category = *req.Category
	}
	if req.Status != nil {
		if !domain.ValidSupplierStatuses[*req.Status] {
			c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid status", "code": "INVALID_STATUS"})
			return
		}
		supplier.Status = *req.Status
	}
	if req.ContactName != nil {
		supplier.ContactName = *req.ContactName
	}
	if req.ContactEmail != nil {
		supplier.ContactEmail = *req.ContactEmail
	}
	if req.Notes != nil {
		supplier.Notes = *req.Notes
	}

	if err := sc.supplierRepo.Update(c.Request.Context(), tenantIDStr, supplier); err != nil {
		logger.Error("failed to update supplier", map[string]interface{}{
			"error":       err.Error(),
			"supplier_id": supplierID,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to update supplier", "code": "UPDATE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"supplier": supplier})
}

// SubmitSupplierAnswerRequest body de POST /api/v1/suppliers/:id/answer.
type SubmitSupplierAnswerRequest struct {
	QuestionID string `form:"question_id" json:"question_id" binding:"required"`
	ControlID  string `form:"control_id" json:"control_id" binding:"required"`
	Status     string `form:"status" json:"status" binding:"required"` // sim, nao, na
	Text       string `form:"text" json:"text"`
}

// SubmitSupplierAnswer salva uma resposta do assessment de um fornecedor.
// POST /api/v1/suppliers/:id/answer
func (sc *SupplierController) SubmitSupplierAnswer(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	supplierID := c.Param("id")
	if !validator.IsValidUUID(supplierID) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid supplier id format", "code": "INVALID_ID"})
		return
	}

	// Verificar se o supplier existe
	supplier, err := sc.supplierRepo.GetByID(c.Request.Context(), tenantIDStr, supplierID)
	if err != nil || supplier == nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "supplier not found", "code": "NOT_FOUND"})
		return
	}

	var req SubmitSupplierAnswerRequest
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
	if sc.evidenceStore != nil {
		file, err := c.FormFile("evidence")
		if err == nil && file != nil {
			f, err := file.Open()
			if err == nil {
				defer f.Close()
				evidenceURL, err = sc.evidenceStore.UploadEvidence(c.Request.Context(), tenantIDStr, req.QuestionID, filepath.Base(file.Filename), f)
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
	if err := sc.answerRepo.SaveForSupplier(c.Request.Context(), tenantIDStr, supplierID, a); err != nil {
		logger.Error("failed to save supplier answer", map[string]interface{}{
			"error":       err.Error(),
			"tenant":      tenantIDStr,
			"supplier_id": supplierID,
			"question":    req.QuestionID,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to save answer", "code": "SAVE_FAILED"})
		return
	}

	c.JSON(http.StatusCreated, a)
}

// GetSupplierScore calcula o score TPRA completo para um fornecedor.
// Combina: scan tecnico do dominio + respostas declarativas do supplier + cross-check.
// GET /api/v1/suppliers/:id/score?framework=ISO27001&track=silver
func (sc *SupplierController) GetSupplierScore(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	supplierID := c.Param("id")
	if !validator.IsValidUUID(supplierID) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid supplier id format", "code": "INVALID_ID"})
		return
	}

	supplier, err := sc.supplierRepo.GetByID(c.Request.Context(), tenantIDStr, supplierID)
	if err != nil || supplier == nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "supplier not found", "code": "NOT_FOUND"})
		return
	}

	frameworkID := c.Query("framework")
	if frameworkID == "" {
		frameworkID = "ISO27001"
	}
	track := c.Query("track")
	if track != "" && !domain.ValidTracks[track] {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "track must be bronze, silver, or gold", "code": "INVALID_TRACK"})
		return
	}

	// 1. Buscar o scan mais recente do dominio do fornecedor
	var scan *domain.ScanResult
	var scanID string
	technicalScore := 0 // sem scan = 0 (conservador para TPRA)
	if sc.scanRepo != nil {
		scan, _ = sc.scanRepo.GetLatestByDomain(c.Request.Context(), tenantIDStr, supplier.Domain)
		if scan != nil {
			technicalScore = scan.Score
			scanID = scan.ID
		}
	}

	// 2. Findings do scan (se houver)
	findingsByControl := make(map[string][]string)
	hasCritical := false
	var findings []*domain.AuditFinding

	if scan != nil && sc.findingRepo != nil {
		allFindings, _ := sc.findingRepo.ListByScan(c.Request.Context(), tenantIDStr, scanID)

		// Excluir findings com justificativa aprovada
		var approvedFindingIDs map[string]bool
		if sc.justificationRepo != nil {
			ids, _ := sc.justificationRepo.ListApprovedFindingIDs(c.Request.Context(), tenantIDStr, scanID)
			approvedFindingIDs = make(map[string]bool)
			for _, id := range ids {
				approvedFindingIDs[id] = true
			}
		}

		for _, f := range allFindings {
			if approvedFindingIDs != nil && approvedFindingIDs[f.ID] {
				continue
			}
			findings = append(findings, f)
			findingsByControl[f.ControlID] = append(findingsByControl[f.ControlID], f.Severity)
		}

		// Recalcular score tecnico se houve exclusoes
		if len(approvedFindingIDs) > 0 {
			technicalScore = assessment.TechnicalScoreFromFindings(findings)
		}

		for _, sevs := range findingsByControl {
			for _, s := range sevs {
				if s == "critical" {
					hasCritical = true
					break
				}
			}
			if hasCritical {
				break
			}
		}
	}

	// 3. Carregar questionnaire filtrado por track
	q, err := assessment.LoadQuestionnaireByTrack(sc.questionsPath, frameworkID, track)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "framework not found", "code": "FRAMEWORK_NOT_FOUND"})
		return
	}

	// 4. Respostas do supplier
	answers, err := sc.answerRepo.ListBySupplier(c.Request.Context(), tenantIDStr, supplierID)
	if err != nil {
		logger.Error("failed to list supplier answers", map[string]interface{}{
			"error":       err.Error(),
			"tenant":      tenantIDStr,
			"supplier_id": supplierID,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to load answers", "code": "LOAD_FAILED"})
		return
	}
	answersByQuestion := make(map[string]*domain.Answer)
	for _, a := range answers {
		answersByQuestion[a.QuestionID] = a
	}

	// 5. Calcular score completo com cross-check
	input := assessment.ScoreInput{
		TechnicalScore:     technicalScore,
		HasCriticalFinding: hasCritical,
		Questions:          q.Questions,
		AnswersByQuestion:  answersByQuestion,
		FindingsByControl:  findingsByControl,
		FrameworkID:        frameworkID,
		Track:              track,
	}
	breakdown := assessment.ComputeFullScore(input)

	// 6. Persistir snapshot vinculado ao supplier
	if sc.snapshotRepo != nil && scanID != "" {
		snap := &domain.ScoreSnapshot{
			ScanID:         scanID,
			Domain:         supplier.Domain,
			ComputedAt:     time.Now().UTC(),
			ScoreBreakdown: breakdown,
		}
		if err := sc.snapshotRepo.Save(c.Request.Context(), tenantIDStr, scanID, snap); err != nil {
			logger.Warn("failed to persist supplier score snapshot", map[string]interface{}{
				"scan_id":     scanID,
				"supplier_id": supplierID,
				"error":       err.Error(),
			})
		}
	}

	// Contagem de progresso do assessment
	totalQuestions := len(q.Questions)
	answeredQuestions := len(answersByQuestion)

	c.JSON(http.StatusOK, gin.H{
		"supplier_id":        supplierID,
		"supplier_name":      supplier.Name,
		"supplier_domain":    supplier.Domain,
		"criticality":        supplier.Criticality,
		"scan_id":            scanID,
		"framework_id":       frameworkID,
		"track":              track,
		"total_questions":    totalQuestions,
		"answered_questions": answeredQuestions,
		"score_breakdown":    breakdown,
	})
}

// GetSupplierScoreHistory retorna o historico de scores de um fornecedor.
// GET /api/v1/suppliers/:id/score-history?limit=20
func (sc *SupplierController) GetSupplierScoreHistory(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	supplierID := c.Param("id")
	if !validator.IsValidUUID(supplierID) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid supplier id format", "code": "INVALID_ID"})
		return
	}

	supplier, err := sc.supplierRepo.GetByID(c.Request.Context(), tenantIDStr, supplierID)
	if err != nil || supplier == nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "supplier not found", "code": "NOT_FOUND"})
		return
	}

	if sc.scanRepo == nil || sc.snapshotRepo == nil {
		c.JSON(http.StatusOK, gin.H{"supplier_id": supplierID, "history": []interface{}{}, "total": 0})
		return
	}

	// Buscar scans do dominio do fornecedor
	scans, err := sc.scanRepo.ListByDomain(c.Request.Context(), tenantIDStr, supplier.Domain, 20)
	if err != nil {
		logger.Error("failed to list scans for supplier domain", map[string]interface{}{
			"error":       err.Error(),
			"supplier_id": supplierID,
			"domain":      supplier.Domain,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to load scan history", "code": "LOAD_FAILED"})
		return
	}

	type scoreEntry struct {
		ScanID     string                `json:"scan_id"`
		ComputedAt time.Time             `json:"computed_at"`
		Breakdown  domain.ScoreBreakdown `json:"score_breakdown"`
	}

	var history []scoreEntry
	for _, scan := range scans {
		snapshots, err := sc.snapshotRepo.ListByScan(c.Request.Context(), tenantIDStr, scan.ID, 1)
		if err != nil || len(snapshots) == 0 {
			continue
		}
		history = append(history, scoreEntry{
			ScanID:     scan.ID,
			ComputedAt: snapshots[0].ComputedAt,
			Breakdown:  snapshots[0].ScoreBreakdown,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"supplier_id":   supplierID,
		"supplier_name": supplier.Name,
		"domain":        supplier.Domain,
		"history":       history,
		"total":         len(history),
	})
}
