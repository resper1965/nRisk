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

// InvitationController trata requisicoes de convites de assessment (TPRA Fase 1).
type InvitationController struct {
	invitationRepo *firestore.InvitationRepository
	supplierRepo   *firestore.SupplierRepository
}

// NewInvitationController cria um novo InvitationController.
func NewInvitationController(invitationRepo *firestore.InvitationRepository, supplierRepo *firestore.SupplierRepository) *InvitationController {
	return &InvitationController{invitationRepo: invitationRepo, supplierRepo: supplierRepo}
}

// SendInviteRequest body de POST /api/v1/suppliers/:id/invite.
type SendInviteRequest struct {
	Track        string `json:"track" binding:"required"`
	InvitedEmail string `json:"invited_email" binding:"required"`
	FrameworkID  string `json:"framework_id"`
}

const defaultFrameworkID = "a0000000-0000-0000-0000-000000000001" // ISO 27001
const inviteExpiryDays = 30

// SendInvite envia um convite de assessment a um fornecedor.
// POST /api/v1/suppliers/:id/invite
func (ic *InvitationController) SendInvite(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	userID, _ := c.Get(middleware.UserIDKey)
	userIDStr, _ := userID.(string)

	supplierID := c.Param("id")
	if !validator.IsValidUUID(supplierID) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid supplier id format", "code": "INVALID_ID"})
		return
	}

	// Verificar se o fornecedor existe e pertence ao tenant
	supplier, err := ic.supplierRepo.GetByID(c.Request.Context(), tenantIDStr, supplierID)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "supplier not found", "code": "NOT_FOUND"})
		return
	}

	var req SendInviteRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "INVALID_BODY"})
		return
	}

	if !domain.ValidTracks[req.Track] {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "track must be bronze, silver, or gold", "code": "INVALID_TRACK"})
		return
	}

	frameworkID := req.FrameworkID
	if frameworkID == "" {
		frameworkID = defaultFrameworkID
	}

	invitedBy := userIDStr
	if invitedBy == "" {
		invitedBy = "system"
	}

	inv := &domain.SupplierInvitation{
		TenantID:     tenantIDStr,
		SupplierID:   supplierID,
		Track:        req.Track,
		FrameworkID:  frameworkID,
		InvitedEmail: req.InvitedEmail,
		InvitedBy:    invitedBy,
		Status:       "pending",
		ExpiresAt:    time.Now().UTC().AddDate(0, 0, inviteExpiryDays),
	}

	if err := ic.invitationRepo.Create(c.Request.Context(), inv); err != nil {
		logger.Error("failed to create invitation", map[string]interface{}{
			"error":       err.Error(),
			"supplier_id": supplierID,
			"tenant":      tenantIDStr,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to create invitation", "code": "CREATE_FAILED"})
		return
	}

	// Atualizar status do fornecedor para pending_assessment
	if supplier.Status == "active" {
		supplier.Status = "pending_assessment"
		if err := ic.supplierRepo.Update(c.Request.Context(), tenantIDStr, supplier); err != nil {
			logger.Warn("failed to update supplier status after invite", map[string]interface{}{
				"error":       err.Error(),
				"supplier_id": supplierID,
			})
		}
	}

	logger.Info("invitation sent", map[string]interface{}{
		"invitation_id": inv.ID,
		"supplier_id":   supplierID,
		"track":         req.Track,
		"invited_email": req.InvitedEmail,
	})

	c.Header("Location", "/api/v1/invitations/"+inv.ID)
	c.JSON(http.StatusCreated, gin.H{
		"invitation": inv,
		"supplier":   supplier.Name,
	})
}

// ListInvitations lista todos os convites do tenant.
// GET /api/v1/invitations?status=pending
func (ic *InvitationController) ListInvitations(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	status := c.Query("status")
	if status != "" && !domain.ValidInvitationStatuses[status] {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid status filter", "code": "INVALID_STATUS"})
		return
	}

	invitations, err := ic.invitationRepo.ListByTenant(c.Request.Context(), tenantIDStr, status)
	if err != nil {
		logger.Error("failed to list invitations", map[string]interface{}{
			"error":  err.Error(),
			"tenant": tenantIDStr,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to list invitations", "code": "LIST_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"invitations": invitations, "total": len(invitations)})
}

// AcceptInvite permite que um fornecedor aceite um convite via token (sem auth).
// POST /api/v1/invitations/:token/accept
func (ic *InvitationController) AcceptInvite(c *gin.Context) {
	token := c.Param("token")
	if len(token) != 64 {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid token format", "code": "INVALID_TOKEN"})
		return
	}

	inv, err := ic.invitationRepo.GetByToken(c.Request.Context(), token)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "invitation not found or expired", "code": "NOT_FOUND"})
		return
	}

	if inv.Status != "pending" {
		c.AbortWithStatusJSON(http.StatusConflict, gin.H{
			"error":  "invitation already " + inv.Status,
			"code":   "ALREADY_PROCESSED",
			"status": inv.Status,
		})
		return
	}

	if time.Now().UTC().After(inv.ExpiresAt) {
		inv.Status = "expired"
		_ = ic.invitationRepo.UpdateStatus(c.Request.Context(), inv)
		c.AbortWithStatusJSON(http.StatusGone, gin.H{"error": "invitation has expired", "code": "EXPIRED"})
		return
	}

	now := time.Now().UTC()
	inv.Status = "accepted"
	inv.AcceptedAt = &now

	if err := ic.invitationRepo.UpdateStatus(c.Request.Context(), inv); err != nil {
		logger.Error("failed to accept invitation", map[string]interface{}{
			"error":         err.Error(),
			"invitation_id": inv.ID,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to accept invitation", "code": "ACCEPT_FAILED"})
		return
	}

	logger.Info("invitation accepted", map[string]interface{}{
		"invitation_id": inv.ID,
		"supplier_id":   inv.SupplierID,
		"track":         inv.Track,
	})

	c.JSON(http.StatusOK, gin.H{
		"message":       "invitation accepted",
		"invitation_id": inv.ID,
		"track":         inv.Track,
		"framework_id":  inv.FrameworkID,
		"supplier_id":   inv.SupplierID,
	})
}
