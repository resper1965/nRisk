package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/nrisk/backend/internal/domain"
	"github.com/nrisk/backend/internal/middleware"
	"github.com/nrisk/backend/internal/repository/firestore"
	"github.com/nrisk/backend/pkg/logger"
	"github.com/nrisk/backend/pkg/validator"
)

// SupplierController trata requisicoes de CRUD de fornecedores (TPRA Fase 1).
type SupplierController struct {
	supplierRepo *firestore.SupplierRepository
	scanRepo     *firestore.ScanRepository
}

// NewSupplierController cria um novo SupplierController.
func NewSupplierController(supplierRepo *firestore.SupplierRepository, scanRepo *firestore.ScanRepository) *SupplierController {
	return &SupplierController{supplierRepo: supplierRepo, scanRepo: scanRepo}
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
