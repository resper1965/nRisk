package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nrisk/backend/internal/middleware"
	"github.com/nrisk/backend/internal/repository/firestore"
	"github.com/nrisk/backend/pkg/logger"
	"github.com/nrisk/backend/pkg/validator"
)

// ScanController trata requisições relacionadas a scans.
type ScanController struct {
	scanRepo *firestore.ScanRepository
}

// NewScanController cria um novo ScanController.
func NewScanController(scanRepo *firestore.ScanRepository) *ScanController {
	return &ScanController{scanRepo: scanRepo}
}

// StartScanRequest representa o body da requisição para iniciar um scan.
type StartScanRequest struct {
	Domain string `json:"domain" binding:"required"`
}

// StartScan inicia um novo scan para o domínio informado.
// POST /api/v1/scans
// Requer: Authorization: Bearer <token> com tenant_id nas claims.
func (sc *ScanController) StartScan(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context"})
		return
	}
	tenantIDStr := tenantID.(string)

	var req StartScanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid request body", "code": "INVALID_REQUEST"})
		return
	}
	if !validator.IsValidHostname(req.Domain) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid domain format", "code": "INVALID_DOMAIN"})
		return
	}

	scan, err := sc.scanRepo.CreatePendingScan(c.Request.Context(), tenantIDStr, req.Domain)
	if err != nil {
		logger.Error("failed to create pending scan", map[string]interface{}{
			"error":    err.Error(),
			"tenant":   tenantIDStr,
			"domain":   req.Domain,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to create scan"})
		return
	}

	logger.Info("scan created", map[string]interface{}{
		"scan_id":  scan.ID,
		"tenant":   tenantIDStr,
		"domain":   req.Domain,
	})

	// TODO: Publicar mensagem no Pub/Sub para o worker processar o scan.
	c.Header("Location", "/api/v1/scans/"+scan.ID)
	c.JSON(http.StatusCreated, gin.H{
		"scan_id":   scan.ID,
		"domain":    scan.Domain,
		"status":    scan.Status,
		"tenant_id": scan.TenantID,
	})
}

// GetScan retorna um scan pelo ID.
// GET /api/v1/scans/:id
func (sc *ScanController) GetScan(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context"})
		return
	}
	tenantIDStr := tenantID.(string)
	scanID := c.Param("id")
	if !validator.IsValidUUID(scanID) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid scan id format", "code": "INVALID_SCAN_ID"})
		return
	}

	scan, err := sc.scanRepo.GetByID(c.Request.Context(), tenantIDStr, scanID)
	if err != nil {
		logger.Warn("scan not found", map[string]interface{}{
			"scan_id": scanID,
			"tenant":  tenantIDStr,
		})
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "scan not found"})
		return
	}

	c.JSON(http.StatusOK, scan)
}
