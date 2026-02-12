package controller

import (
	"fmt"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nrisk/backend/internal/domain"
	"github.com/nrisk/backend/internal/middleware"
	"github.com/nrisk/backend/internal/repository/firestore"
	"github.com/nrisk/backend/pkg/logger"
	"github.com/nrisk/backend/pkg/validator"
)

// MonitoringController gerencia configuracao de monitoramento continuo e alertas (Fase 6 TPRA).
type MonitoringController struct {
	configRepo   *firestore.MonitoringConfigRepository
	alertRepo    *firestore.AlertRepository
	supplierRepo *firestore.SupplierRepository
	scanRepo     *firestore.ScanRepository
	snapshotRepo *firestore.ScoreSnapshotRepository
}

// NewMonitoringController cria um novo MonitoringController.
func NewMonitoringController(
	configRepo *firestore.MonitoringConfigRepository,
	alertRepo *firestore.AlertRepository,
	supplierRepo *firestore.SupplierRepository,
	scanRepo *firestore.ScanRepository,
	snapshotRepo *firestore.ScoreSnapshotRepository,
) *MonitoringController {
	return &MonitoringController{
		configRepo:   configRepo,
		alertRepo:    alertRepo,
		supplierRepo: supplierRepo,
		scanRepo:     scanRepo,
		snapshotRepo: snapshotRepo,
	}
}

// GetMonitoringConfig retorna a configuracao de monitoramento do tenant.
// GET /api/v1/monitoring/config
func (mc *MonitoringController) GetMonitoringConfig(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	cfg, err := mc.configRepo.GetByTenant(c.Request.Context(), tenantIDStr)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to load config", "code": "LOAD_FAILED"})
		return
	}
	if cfg == nil {
		cfg = domain.DefaultMonitoringConfig(tenantIDStr)
	}

	c.JSON(http.StatusOK, gin.H{"config": cfg})
}

// UpdateMonitoringConfigRequest body de POST /api/v1/monitoring/config.
type UpdateMonitoringConfigRequest struct {
	CriticalIntervalDays *int    `json:"critical_interval_days"`
	HighIntervalDays     *int    `json:"high_interval_days"`
	MediumIntervalDays   *int    `json:"medium_interval_days"`
	LowIntervalDays      *int    `json:"low_interval_days"`
	ScoreDropThreshold   *int    `json:"score_drop_threshold"`
	CategoryChangeAlert  *bool   `json:"category_change_alert"`
	WebhookURL           *string `json:"webhook_url"`
	WebhookEnabled       *bool   `json:"webhook_enabled"`
}

// UpdateMonitoringConfig atualiza a configuracao de monitoramento.
// POST /api/v1/monitoring/config
func (mc *MonitoringController) UpdateMonitoringConfig(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	var req UpdateMonitoringConfigRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "INVALID_BODY"})
		return
	}

	cfg, _ := mc.configRepo.GetByTenant(c.Request.Context(), tenantIDStr)
	if cfg == nil {
		cfg = domain.DefaultMonitoringConfig(tenantIDStr)
	}

	if req.CriticalIntervalDays != nil && *req.CriticalIntervalDays >= 1 {
		cfg.CriticalIntervalDays = *req.CriticalIntervalDays
	}
	if req.HighIntervalDays != nil && *req.HighIntervalDays >= 1 {
		cfg.HighIntervalDays = *req.HighIntervalDays
	}
	if req.MediumIntervalDays != nil && *req.MediumIntervalDays >= 1 {
		cfg.MediumIntervalDays = *req.MediumIntervalDays
	}
	if req.LowIntervalDays != nil && *req.LowIntervalDays >= 1 {
		cfg.LowIntervalDays = *req.LowIntervalDays
	}
	if req.ScoreDropThreshold != nil && *req.ScoreDropThreshold >= 10 {
		cfg.ScoreDropThreshold = *req.ScoreDropThreshold
	}
	if req.CategoryChangeAlert != nil {
		cfg.CategoryChangeAlert = *req.CategoryChangeAlert
	}
	if req.WebhookURL != nil {
		cfg.WebhookURL = *req.WebhookURL
	}
	if req.WebhookEnabled != nil {
		cfg.WebhookEnabled = *req.WebhookEnabled
	}

	if err := mc.configRepo.Save(c.Request.Context(), tenantIDStr, cfg); err != nil {
		logger.Error("failed to save monitoring config", map[string]interface{}{
			"error":  err.Error(),
			"tenant": tenantIDStr,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to save config", "code": "SAVE_FAILED"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"config": cfg})
}

// CheckSupplierDeterioration verifica deterioracao de score de todos os fornecedores e gera alertas.
// POST /api/v1/monitoring/check
func (mc *MonitoringController) CheckSupplierDeterioration(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	cfg, _ := mc.configRepo.GetByTenant(c.Request.Context(), tenantIDStr)
	if cfg == nil {
		cfg = domain.DefaultMonitoringConfig(tenantIDStr)
	}

	suppliers, err := mc.supplierRepo.List(c.Request.Context(), tenantIDStr, "", "")
	if err != nil {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to list suppliers", "code": "LOAD_FAILED"})
		return
	}

	var alertsGenerated []*domain.Alert

	for _, s := range suppliers {
		if mc.scanRepo == nil || mc.snapshotRepo == nil {
			continue
		}

		// Buscar os 2 scans mais recentes para comparar
		scans, err := mc.scanRepo.ListByDomain(c.Request.Context(), tenantIDStr, s.Domain, 2)
		if err != nil || len(scans) < 2 {
			// Verificar scan overdue
			if len(scans) == 1 {
				intervalDays := cfg.IntervalForCriticality(s.Criticality)
				scanAge := time.Since(scans[0].StartedAt).Hours() / 24
				if scanAge > float64(intervalDays) {
					alert := &domain.Alert{
						TenantID:   tenantIDStr,
						SupplierID: s.ID,
						Type:       "scan_overdue",
						Severity:   "medium",
						Title:      "Scan overdue: " + s.Name,
						Detail:     fmt.Sprintf("Ultimo scan ha %s. Intervalo configurado: %d dias.", time.Since(scans[0].StartedAt).Truncate(time.Hour).String(), intervalDays),
						Status:     "open",
						Metadata: map[string]interface{}{
							"supplier_domain":     s.Domain,
							"last_scan_at":        scans[0].StartedAt,
							"interval_days":       intervalDays,
						},
					}
					if err := mc.alertRepo.Create(c.Request.Context(), tenantIDStr, alert); err == nil {
						alertsGenerated = append(alertsGenerated, alert)
					}
				}
			}
			continue
		}

		// Obter snapshots de cada scan
		snap1, _ := mc.snapshotRepo.ListByScan(c.Request.Context(), tenantIDStr, scans[0].ID, 1)
		snap2, _ := mc.snapshotRepo.ListByScan(c.Request.Context(), tenantIDStr, scans[1].ID, 1)

		if len(snap1) == 0 || len(snap2) == 0 {
			continue
		}

		currentScore := snap1[0].ScoreBreakdown.HybridScore
		previousScore := snap2[0].ScoreBreakdown.HybridScore
		currentCat := snap1[0].ScoreBreakdown.ScoreCategory
		previousCat := snap2[0].ScoreBreakdown.ScoreCategory
		scoreDrop := previousScore - currentScore

		// Score drop alert
		if scoreDrop >= float64(cfg.ScoreDropThreshold) {
			alert := &domain.Alert{
				TenantID:   tenantIDStr,
				SupplierID: s.ID,
				Type:       "score_drop",
				Severity:   alertSeverityForDrop(scoreDrop),
				Title:      "Score drop: " + s.Name,
				Detail:     "Score caiu de " + previousCat + " (" + formatScore(previousScore) + ") para " + currentCat + " (" + formatScore(currentScore) + ")",
				Status:     "open",
				Metadata: map[string]interface{}{
					"previous_score":    previousScore,
					"current_score":     currentScore,
					"previous_category": previousCat,
					"current_category":  currentCat,
					"drop":              scoreDrop,
				},
			}
			if err := mc.alertRepo.Create(c.Request.Context(), tenantIDStr, alert); err == nil {
				alertsGenerated = append(alertsGenerated, alert)
			}
		}

		// Category change alert
		if cfg.CategoryChangeAlert && currentCat != previousCat && scoreDrop < float64(cfg.ScoreDropThreshold) {
			alert := &domain.Alert{
				TenantID:   tenantIDStr,
				SupplierID: s.ID,
				Type:       "category_change",
				Severity:   "medium",
				Title:      "Category change: " + s.Name,
				Detail:     "Categoria mudou de " + previousCat + " para " + currentCat,
				Status:     "open",
				Metadata: map[string]interface{}{
					"previous_category": previousCat,
					"current_category":  currentCat,
				},
			}
			if err := mc.alertRepo.Create(c.Request.Context(), tenantIDStr, alert); err == nil {
				alertsGenerated = append(alertsGenerated, alert)
			}
		}

		// Critical finding alert
		if snap1[0].ScoreBreakdown.HasCriticalFinding && !snap2[0].ScoreBreakdown.HasCriticalFinding {
			alert := &domain.Alert{
				TenantID:   tenantIDStr,
				SupplierID: s.ID,
				Type:       "critical_finding",
				Severity:   "critical",
				Title:      "New critical finding: " + s.Name,
				Detail:     "Novo achado critico detectado no dominio " + s.Domain + ". Score limitado a 500.",
				Status:     "open",
				Metadata: map[string]interface{}{
					"supplier_domain": s.Domain,
					"current_score":   currentScore,
				},
			}
			if err := mc.alertRepo.Create(c.Request.Context(), tenantIDStr, alert); err == nil {
				alertsGenerated = append(alertsGenerated, alert)
			}
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"alerts_generated": len(alertsGenerated),
		"alerts":           alertsGenerated,
		"suppliers_checked": len(suppliers),
	})
}

// ListAlerts retorna alertas do tenant.
// GET /api/v1/alerts?status=open&limit=50
func (mc *MonitoringController) ListAlerts(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	status := c.Query("status")
	if status != "" && !domain.ValidAlertStatuses[status] {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "status must be open, acknowledged, or resolved", "code": "INVALID_STATUS"})
		return
	}

	alerts, err := mc.alertRepo.ListByTenant(c.Request.Context(), tenantIDStr, status, 50)
	if err != nil {
		logger.Error("failed to list alerts", map[string]interface{}{
			"error":  err.Error(),
			"tenant": tenantIDStr,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to list alerts", "code": "LOAD_FAILED"})
		return
	}

	if alerts == nil {
		alerts = []*domain.Alert{}
	}

	openCount, _ := mc.alertRepo.CountOpen(c.Request.Context(), tenantIDStr)

	c.JSON(http.StatusOK, gin.H{
		"alerts":     alerts,
		"total":      len(alerts),
		"open_count": openCount,
	})
}

// UpdateAlertRequest body de PATCH /api/v1/alerts/:id.
type UpdateAlertRequest struct {
	Status string `json:"status" binding:"required"`
}

// UpdateAlert atualiza o status de um alerta (acknowledge/resolve).
// PATCH /api/v1/alerts/:id
func (mc *MonitoringController) UpdateAlert(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	alertID := c.Param("id")
	if !validator.IsValidUUID(alertID) {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid alert id format", "code": "INVALID_ID"})
		return
	}

	var req UpdateAlertRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": err.Error(), "code": "INVALID_BODY"})
		return
	}

	if !domain.ValidAlertStatuses[req.Status] {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "status must be open, acknowledged, or resolved", "code": "INVALID_STATUS"})
		return
	}

	existing, err := mc.alertRepo.GetByID(c.Request.Context(), tenantIDStr, alertID)
	if err != nil || existing == nil {
		c.AbortWithStatusJSON(http.StatusNotFound, gin.H{"error": "alert not found", "code": "NOT_FOUND"})
		return
	}

	userID, _ := c.Get(middleware.UserIDKey)
	userIDStr := ""
	if userID != nil {
		userIDStr = userID.(string)
	}

	if err := mc.alertRepo.UpdateStatus(c.Request.Context(), tenantIDStr, alertID, req.Status, userIDStr); err != nil {
		logger.Error("failed to update alert", map[string]interface{}{
			"error":    err.Error(),
			"alert_id": alertID,
			"tenant":   tenantIDStr,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to update alert", "code": "UPDATE_FAILED"})
		return
	}

	// Recarregar para retornar atualizado
	updated, _ := mc.alertRepo.GetByID(c.Request.Context(), tenantIDStr, alertID)
	c.JSON(http.StatusOK, gin.H{"alert": updated})
}

// GetMonitoringStatus retorna um resumo do monitoramento: config + contagem de alertas + suppliers com scan overdue.
// GET /api/v1/monitoring/status
func (mc *MonitoringController) GetMonitoringStatus(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	cfg, _ := mc.configRepo.GetByTenant(c.Request.Context(), tenantIDStr)
	if cfg == nil {
		cfg = domain.DefaultMonitoringConfig(tenantIDStr)
	}

	openAlerts, _ := mc.alertRepo.CountOpen(c.Request.Context(), tenantIDStr)

	// Contar suppliers com scan overdue
	suppliers, _ := mc.supplierRepo.List(c.Request.Context(), tenantIDStr, "", "")
	overdueCount := 0
	for _, s := range suppliers {
		if mc.scanRepo == nil {
			continue
		}
		scan, _ := mc.scanRepo.GetLatestByDomain(c.Request.Context(), tenantIDStr, s.Domain)
		if scan != nil {
			intervalDays := cfg.IntervalForCriticality(s.Criticality)
			scanAge := time.Since(scan.StartedAt).Hours() / 24
			if scanAge > float64(intervalDays) {
				overdueCount++
			}
		} else {
			overdueCount++ // sem scan = overdue
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"config":           cfg,
		"open_alerts":      openAlerts,
		"overdue_scans":    overdueCount,
		"total_suppliers":  len(suppliers),
	})
}

// alertSeverityForDrop retorna a severidade do alerta baseado na queda de score.
func alertSeverityForDrop(drop float64) string {
	switch {
	case drop >= 200:
		return "critical"
	case drop >= 150:
		return "high"
	case drop >= 100:
		return "medium"
	default:
		return "low"
	}
}

// formatScore formata um float para exibicao (ex: "742.5").
func formatScore(score float64) string {
	return fmt.Sprintf("%.0f", score)
}
