package controller

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nrisk/backend/internal/domain"
	"github.com/nrisk/backend/internal/middleware"
	"github.com/nrisk/backend/internal/repository/firestore"
	"github.com/nrisk/backend/pkg/logger"
	"github.com/nrisk/backend/pkg/validator"
)

// JustificationController trata submissão e revisão de justificativas de findings (P1.6).
type JustificationController struct {
	justificationRepo *firestore.FindingJustificationRepository
}

// NewJustificationController cria um novo JustificationController.
func NewJustificationController(justificationRepo *firestore.FindingJustificationRepository) *JustificationController {
	return &JustificationController{justificationRepo: justificationRepo}
}

// SubmitJustificationRequest body de POST /scans/:scan_id/findings/:finding_id/justifications.
type SubmitJustificationRequest struct {
	Text        string `json:"text" binding:"required"`
	SubmittedBy string `json:"submitted_by" binding:"required"`
}

// SubmitJustification submete uma justificativa para um finding.
// POST /api/v1/scans/:scan_id/findings/:finding_id/justifications
func (jc *JustificationController) SubmitJustification(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	scanID := c.Param("scan_id")
	if scanID == "" || !validator.IsValidUUID(scanID) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "scan_id required and must be valid UUID", "code": "INVALID_SCAN_ID"})
		return
	}
	findingID := c.Param("finding_id")
	if findingID == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "finding_id required", "code": "INVALID_FINDING_ID"})
		return
	}

	var body SubmitJustificationRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "INVALID_BODY"})
		return
	}

	j := &domain.FindingJustification{
		FindingID:   findingID,
		Status:      "submitted",
		Text:        body.Text,
		SubmittedBy: body.SubmittedBy,
		SubmittedAt: time.Now().UTC(),
	}
	if err := jc.justificationRepo.Save(c.Request.Context(), tenantIDStr, scanID, j); err != nil {
		logger.Error("failed to save justification", map[string]interface{}{"error": err.Error(), "scan_id": scanID, "finding_id": findingID})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to save justification", "code": "SAVE_FAILED"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"justification": j, "scan_id": scanID, "finding_id": findingID})
}

// ListJustifications lista justificativas de um finding.
// GET /api/v1/scans/:scan_id/findings/:finding_id/justifications
func (jc *JustificationController) ListJustifications(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	scanID := c.Param("scan_id")
	if scanID == "" || !validator.IsValidUUID(scanID) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "scan_id required and must be valid UUID", "code": "INVALID_SCAN_ID"})
		return
	}
	findingID := c.Param("finding_id")
	if findingID == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "finding_id required", "code": "INVALID_FINDING_ID"})
		return
	}

	list, err := jc.justificationRepo.ListByFinding(c.Request.Context(), tenantIDStr, scanID, findingID)
	if err != nil {
		logger.Error("failed to list justifications", map[string]interface{}{"error": err.Error(), "scan_id": scanID, "finding_id": findingID})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to list justifications", "code": "LIST_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"justifications": list, "scan_id": scanID, "finding_id": findingID})
}

// ReviewJustificationRequest body de PATCH /scans/:scan_id/justifications/:id/review.
type ReviewJustificationRequest struct {
	ReviewedBy   string `json:"reviewed_by" binding:"required"`
	Decision     string `json:"decision" binding:"required"` // approved, rejected
	DecisionNote string `json:"decision_note"`
}

// ReviewJustification aprova ou rejeita uma justificativa (avaliador).
// PATCH /api/v1/scans/:scan_id/justifications/:id/review
func (jc *JustificationController) ReviewJustification(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	scanID := c.Param("scan_id")
	if scanID == "" || !validator.IsValidUUID(scanID) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "scan_id required and must be valid UUID", "code": "INVALID_SCAN_ID"})
		return
	}
	justificationID := c.Param("id")
	if justificationID == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "justification id required", "code": "INVALID_ID"})
		return
	}

	var body ReviewJustificationRequest
	if err := c.ShouldBindJSON(&body); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "INVALID_BODY"})
		return
	}
	if body.Decision != "approved" && body.Decision != "rejected" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "decision must be approved or rejected", "code": "INVALID_DECISION"})
		return
	}

	_, err := jc.justificationRepo.GetByID(c.Request.Context(), tenantIDStr, scanID, justificationID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "justification not found", "code": "NOT_FOUND"})
		return
	}

	if err := jc.justificationRepo.UpdateReview(c.Request.Context(), tenantIDStr, scanID, justificationID, body.ReviewedBy, body.Decision, body.DecisionNote); err != nil {
		logger.Error("failed to update justification review", map[string]interface{}{"error": err.Error(), "id": justificationID})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to update review", "code": "UPDATE_FAILED"})
		return
	}

	j, _ := jc.justificationRepo.GetByID(c.Request.Context(), tenantIDStr, scanID, justificationID)
	c.JSON(http.StatusOK, gin.H{"justification": j, "scan_id": scanID})
}
