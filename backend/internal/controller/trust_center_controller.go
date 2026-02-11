package controller

import (
	"net/http"
	"regexp"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nrisk/backend/internal/domain"
	"github.com/nrisk/backend/internal/middleware"
	"github.com/nrisk/backend/internal/repository/firestore"
	"github.com/nrisk/backend/pkg/logger"
	"github.com/nrisk/backend/pkg/validator"
)

var slugRegex = regexp.MustCompile(`^[a-z0-9][a-z0-9\-]{2,98}[a-z0-9]$`)

// TrustCenterController trata requisicoes do Trust Center e NDA (TPRA Fase 4).
type TrustCenterController struct {
	trustCenterRepo *firestore.TrustCenterRepository
	ndaRepo         *firestore.NDARepository
	snapshotRepo    *firestore.ScoreSnapshotRepository
	scanRepo        *firestore.ScanRepository
}

// NewTrustCenterController cria um novo TrustCenterController.
func NewTrustCenterController(
	trustCenterRepo *firestore.TrustCenterRepository,
	ndaRepo *firestore.NDARepository,
	snapshotRepo *firestore.ScoreSnapshotRepository,
	scanRepo *firestore.ScanRepository,
) *TrustCenterController {
	return &TrustCenterController{
		trustCenterRepo: trustCenterRepo,
		ndaRepo:         ndaRepo,
		snapshotRepo:    snapshotRepo,
		scanRepo:        scanRepo,
	}
}

// --- Endpoints autenticados (CRUD) ---

// CreateOrUpdateRequest body de POST /api/v1/trust-center.
type CreateOrUpdateTrustCenterRequest struct {
	Slug             string            `json:"slug" binding:"required"`
	CompanyName      string            `json:"company_name" binding:"required"`
	Description      string            `json:"description"`
	LogoURL          string            `json:"logo_url"`
	WebsiteURL       string            `json:"website_url"`
	ShowScore        *bool             `json:"show_score"`
	ShowSpiderChart  *bool             `json:"show_spider_chart"`
	ShowGrade        *bool             `json:"show_grade"`
	RequireNDA       *bool             `json:"require_nda"`
	NDAExpiryDays    *int              `json:"nda_expiry_days"`
	Badges           []domain.Badge    `json:"badges"`
	PublicDocuments  []domain.Document `json:"public_documents"`
	NDADocuments     []domain.Document `json:"nda_documents"`
	ContactEmail     string            `json:"contact_email"`
	PrivacyPolicyURL string            `json:"privacy_policy_url"`
	TermsURL         string            `json:"terms_url"`
	Status           string            `json:"status"`
}

// CreateOrUpdateTrustCenter cria ou atualiza o Trust Center do tenant.
// POST /api/v1/trust-center
func (tc *TrustCenterController) CreateOrUpdateTrustCenter(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	var req CreateOrUpdateTrustCenterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "INVALID_BODY"})
		return
	}

	slug := strings.ToLower(strings.TrimSpace(req.Slug))
	if !slugRegex.MatchString(slug) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "slug must be 4-100 chars, lowercase alphanumeric with hyphens", "code": "INVALID_SLUG"})
		return
	}

	if req.Status != "" && !domain.ValidTrustCenterStatuses[req.Status] {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "status must be draft, published, or archived", "code": "INVALID_STATUS"})
		return
	}

	// Verificar se ja existe perfil para o tenant
	existing, _ := tc.trustCenterRepo.GetByTenant(c.Request.Context(), tenantIDStr)

	if existing != nil {
		// Update
		oldSlug := existing.Slug
		existing.Slug = slug
		existing.CompanyName = req.CompanyName
		existing.Description = req.Description
		existing.LogoURL = req.LogoURL
		existing.WebsiteURL = req.WebsiteURL
		if req.ShowScore != nil {
			existing.ShowScore = *req.ShowScore
		}
		if req.ShowSpiderChart != nil {
			existing.ShowSpiderChart = *req.ShowSpiderChart
		}
		if req.ShowGrade != nil {
			existing.ShowGrade = *req.ShowGrade
		}
		if req.RequireNDA != nil {
			existing.RequireNDA = *req.RequireNDA
		}
		if req.NDAExpiryDays != nil && *req.NDAExpiryDays > 0 {
			existing.NDAExpiryDays = *req.NDAExpiryDays
		}
		if req.Badges != nil {
			existing.Badges = req.Badges
		}
		if req.PublicDocuments != nil {
			existing.PublicDocuments = req.PublicDocuments
		}
		if req.NDADocuments != nil {
			existing.NDADocuments = req.NDADocuments
		}
		existing.ContactEmail = req.ContactEmail
		existing.PrivacyPolicyURL = req.PrivacyPolicyURL
		existing.TermsURL = req.TermsURL
		if req.Status != "" {
			existing.Status = req.Status
		}

		if oldSlug != slug {
			// Verificar se novo slug esta disponivel
			taken, _ := tc.trustCenterRepo.SlugExists(c.Request.Context(), slug)
			if taken {
				c.AbortWithStatusJSON(http.StatusConflict, gin.H{"error": "slug already in use", "code": "SLUG_TAKEN"})
				return
			}
			if err := tc.trustCenterRepo.UpdateSlug(c.Request.Context(), existing, oldSlug); err != nil {
				logger.Error("failed to update trust center slug", map[string]interface{}{"error": err.Error()})
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to update trust center", "code": "UPDATE_FAILED"})
				return
			}
		} else {
			if err := tc.trustCenterRepo.Update(c.Request.Context(), existing); err != nil {
				logger.Error("failed to update trust center", map[string]interface{}{"error": err.Error()})
				c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to update trust center", "code": "UPDATE_FAILED"})
				return
			}
		}
		c.JSON(http.StatusOK, gin.H{"trust_center": existing})
		return
	}

	// Verificar slug disponivel
	taken, _ := tc.trustCenterRepo.SlugExists(c.Request.Context(), slug)
	if taken {
		c.AbortWithStatusJSON(http.StatusConflict, gin.H{"error": "slug already in use", "code": "SLUG_TAKEN"})
		return
	}

	showScore := false
	if req.ShowScore != nil {
		showScore = *req.ShowScore
	}
	showSpider := false
	if req.ShowSpiderChart != nil {
		showSpider = *req.ShowSpiderChart
	}
	showGrade := true
	if req.ShowGrade != nil {
		showGrade = *req.ShowGrade
	}
	requireNDA := false
	if req.RequireNDA != nil {
		requireNDA = *req.RequireNDA
	}
	ndaExpiry := 90
	if req.NDAExpiryDays != nil && *req.NDAExpiryDays > 0 {
		ndaExpiry = *req.NDAExpiryDays
	}

	profile := &domain.TrustCenterProfile{
		TenantID:         tenantIDStr,
		Slug:             slug,
		CompanyName:      req.CompanyName,
		Description:      req.Description,
		LogoURL:          req.LogoURL,
		WebsiteURL:       req.WebsiteURL,
		ShowScore:        showScore,
		ShowSpiderChart:  showSpider,
		ShowGrade:        showGrade,
		RequireNDA:       requireNDA,
		NDAExpiryDays:    ndaExpiry,
		Badges:           req.Badges,
		PublicDocuments:  req.PublicDocuments,
		NDADocuments:     req.NDADocuments,
		ContactEmail:     req.ContactEmail,
		PrivacyPolicyURL: req.PrivacyPolicyURL,
		TermsURL:         req.TermsURL,
		Status:           "draft",
	}
	if req.Status != "" {
		profile.Status = req.Status
	}
	if profile.Badges == nil {
		profile.Badges = []domain.Badge{}
	}
	if profile.PublicDocuments == nil {
		profile.PublicDocuments = []domain.Document{}
	}
	if profile.NDADocuments == nil {
		profile.NDADocuments = []domain.Document{}
	}

	if err := tc.trustCenterRepo.Create(c.Request.Context(), profile); err != nil {
		logger.Error("failed to create trust center", map[string]interface{}{"error": err.Error(), "tenant": tenantIDStr})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to create trust center", "code": "CREATE_FAILED"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"trust_center": profile})
}

// GetTrustCenter retorna o Trust Center do tenant autenticado.
// GET /api/v1/trust-center
func (tc *TrustCenterController) GetTrustCenter(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	profile, err := tc.trustCenterRepo.GetByTenant(c.Request.Context(), tenantIDStr)
	if err != nil || profile == nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "trust center not found", "code": "NOT_FOUND"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"trust_center": profile})
}

// --- Endpoint publico ---

// GetPublicTrustCenter retorna o Trust Center publico pelo slug.
// GET /trust/:slug
func (tc *TrustCenterController) GetPublicTrustCenter(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" || !slugRegex.MatchString(slug) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid slug", "code": "INVALID_SLUG"})
		return
	}

	profile, err := tc.trustCenterRepo.GetBySlug(c.Request.Context(), slug)
	if err != nil || profile == nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "trust center not found", "code": "NOT_FOUND"})
		return
	}

	if profile.Status != "published" {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "trust center not found", "code": "NOT_FOUND"})
		return
	}

	// Montar resposta publica (sem dados NDA)
	resp := gin.H{
		"company_name":       profile.CompanyName,
		"description":        profile.Description,
		"logo_url":           profile.LogoURL,
		"website_url":        profile.WebsiteURL,
		"badges":             profile.Badges,
		"public_documents":   profile.PublicDocuments,
		"contact_email":      profile.ContactEmail,
		"privacy_policy_url": profile.PrivacyPolicyURL,
		"terms_url":          profile.TermsURL,
		"require_nda":        profile.RequireNDA,
		"has_nda_documents":  len(profile.NDADocuments) > 0,
	}

	if profile.ShowGrade || profile.ShowScore || profile.ShowSpiderChart {
		resp["show_score"] = profile.ShowScore
		resp["show_grade"] = profile.ShowGrade
		resp["show_spider_chart"] = profile.ShowSpiderChart
	}

	// Verificar se quem acessa tem NDA aprovado (via query param ?email=)
	email := c.Query("email")
	if email != "" && profile.RequireNDA {
		hasAccess, _ := tc.ndaRepo.HasApprovedAccess(c.Request.Context(), profile.TenantID, email)
		resp["nda_access"] = hasAccess
		if hasAccess {
			resp["nda_documents"] = profile.NDADocuments
		}
	}

	c.JSON(http.StatusOK, gin.H{"trust_center": resp})
}

// --- NDA Workflow ---

// NDARequestBody body de POST /trust/:slug/nda-request.
type NDARequestBody struct {
	RequesterName    string `json:"requester_name" binding:"required"`
	RequesterEmail   string `json:"requester_email" binding:"required"`
	RequesterCompany string `json:"requester_company" binding:"required"`
	RequesterRole    string `json:"requester_role"`
	Reason           string `json:"reason"`
}

// SubmitNDARequest cria uma solicitacao de NDA (endpoint publico).
// POST /trust/:slug/nda-request
func (tc *TrustCenterController) SubmitNDARequest(c *gin.Context) {
	slug := c.Param("slug")
	if slug == "" || !slugRegex.MatchString(slug) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid slug", "code": "INVALID_SLUG"})
		return
	}

	profile, err := tc.trustCenterRepo.GetBySlug(c.Request.Context(), slug)
	if err != nil || profile == nil || profile.Status != "published" {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "trust center not found", "code": "NOT_FOUND"})
		return
	}

	if !profile.RequireNDA {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "this trust center does not require NDA", "code": "NDA_NOT_REQUIRED"})
		return
	}

	var req NDARequestBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "INVALID_BODY"})
		return
	}

	if !validator.IsValidEmail(req.RequesterEmail) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid email format", "code": "INVALID_EMAIL"})
		return
	}

	// Verificar se ja tem acesso
	hasAccess, _ := tc.ndaRepo.HasApprovedAccess(c.Request.Context(), profile.TenantID, req.RequesterEmail)
	if hasAccess {
		c.JSON(http.StatusOK, gin.H{"message": "you already have NDA access", "status": "approved"})
		return
	}

	ndaReq := &domain.NDARequest{
		TenantID:         profile.TenantID,
		TrustCenterID:    profile.ID,
		RequesterName:    req.RequesterName,
		RequesterEmail:   req.RequesterEmail,
		RequesterCompany: req.RequesterCompany,
		RequesterRole:    req.RequesterRole,
		Reason:           req.Reason,
		Status:           "pending",
	}

	if err := tc.ndaRepo.Create(c.Request.Context(), ndaReq); err != nil {
		logger.Error("failed to create nda request", map[string]interface{}{"error": err.Error(), "slug": slug})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to submit nda request", "code": "CREATE_FAILED"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"nda_request": ndaReq})
}

// ListNDARequests lista NDA requests do tenant.
// GET /api/v1/nda-requests?status=pending
func (tc *TrustCenterController) ListNDARequests(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	status := c.Query("status")
	if status != "" && !domain.ValidNDAStatuses[status] {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid status filter", "code": "INVALID_STATUS"})
		return
	}

	requests, err := tc.ndaRepo.ListByTenant(c.Request.Context(), tenantIDStr, status)
	if err != nil {
		logger.Error("failed to list nda requests", map[string]interface{}{"error": err.Error(), "tenant": tenantIDStr})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to list nda requests", "code": "LIST_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"nda_requests": requests, "total": len(requests)})
}

// ReviewNDARequestBody body de PATCH /api/v1/nda-requests/:id.
type ReviewNDARequestBody struct {
	Status       string `json:"status" binding:"required"` // approved, rejected
	DecisionNote string `json:"decision_note"`
}

// ReviewNDARequest aprova ou rejeita uma solicitacao NDA.
// PATCH /api/v1/nda-requests/:id
func (tc *TrustCenterController) ReviewNDARequest(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	requestID := c.Param("id")
	if !validator.IsValidUUID(requestID) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid request id", "code": "INVALID_ID"})
		return
	}

	var req ReviewNDARequestBody
	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "INVALID_BODY"})
		return
	}

	if req.Status != "approved" && req.Status != "rejected" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "status must be approved or rejected", "code": "INVALID_STATUS"})
		return
	}

	// Buscar request para validar existencia
	ndaReq, err := tc.ndaRepo.GetByID(c.Request.Context(), tenantIDStr, requestID)
	if err != nil || ndaReq == nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "nda request not found", "code": "NOT_FOUND"})
		return
	}

	// Calcular expiracao se aprovado
	var expiresAt *time.Time
	if req.Status == "approved" {
		// Buscar Trust Center para obter nda_expiry_days
		profile, _ := tc.trustCenterRepo.GetByID(c.Request.Context(), tenantIDStr, ndaReq.TrustCenterID)
		days := 90
		if profile != nil && profile.NDAExpiryDays > 0 {
			days = profile.NDAExpiryDays
		}
		exp := time.Now().UTC().AddDate(0, 0, days)
		expiresAt = &exp
	}

	// Usar user_id do contexto como reviewer (se disponivel)
	reviewerID := "system"
	if uid, ok := c.Get(middleware.UserIDKey); ok {
		reviewerID = uid.(string)
	}

	if err := tc.ndaRepo.UpdateStatus(c.Request.Context(), tenantIDStr, requestID, reviewerID, req.Status, req.DecisionNote, expiresAt); err != nil {
		logger.Error("failed to review nda request", map[string]interface{}{"error": err.Error(), "request_id": requestID})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to update nda request", "code": "UPDATE_FAILED"})
		return
	}

	// Recarregar para retornar atualizado
	ndaReq, _ = tc.ndaRepo.GetByID(c.Request.Context(), tenantIDStr, requestID)
	c.JSON(http.StatusOK, gin.H{"nda_request": ndaReq})
}
