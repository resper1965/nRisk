package domain

import "time"

// MonitoringConfig define a configuracao de monitoramento continuo para um tenant.
type MonitoringConfig struct {
	ID       string `json:"id" firestore:"id"`
	TenantID string `json:"tenant_id" firestore:"tenant_id"`

	// Frequencia de re-scan por criticidade (em dias)
	CriticalIntervalDays int `json:"critical_interval_days" firestore:"critical_interval_days"` // default: 7
	HighIntervalDays     int `json:"high_interval_days" firestore:"high_interval_days"`         // default: 14
	MediumIntervalDays   int `json:"medium_interval_days" firestore:"medium_interval_days"`     // default: 30
	LowIntervalDays      int `json:"low_interval_days" firestore:"low_interval_days"`           // default: 90

	// Thresholds de alerta
	ScoreDropThreshold    int  `json:"score_drop_threshold" firestore:"score_drop_threshold"`       // pontos de queda para gerar alerta (default: 100)
	CategoryChangeAlert   bool `json:"category_change_alert" firestore:"category_change_alert"`     // alertar quando muda de categoria
	WebhookURL            string `json:"webhook_url,omitempty" firestore:"webhook_url,omitempty"`   // URL para webhook de alertas
	WebhookEnabled        bool `json:"webhook_enabled" firestore:"webhook_enabled"`

	CreatedAt time.Time `json:"created_at" firestore:"created_at"`
	UpdatedAt time.Time `json:"updated_at" firestore:"updated_at"`
}

// DefaultMonitoringConfig retorna config com valores padrao conforme plano TPRA.
func DefaultMonitoringConfig(tenantID string) *MonitoringConfig {
	now := time.Now().UTC()
	return &MonitoringConfig{
		TenantID:             tenantID,
		CriticalIntervalDays: 7,
		HighIntervalDays:     14,
		MediumIntervalDays:   30,
		LowIntervalDays:      90,
		ScoreDropThreshold:   100,
		CategoryChangeAlert:  true,
		WebhookEnabled:       false,
		CreatedAt:            now,
		UpdatedAt:            now,
	}
}

// IntervalForCriticality retorna o intervalo de re-scan em dias para uma criticidade.
func (mc *MonitoringConfig) IntervalForCriticality(criticality string) int {
	switch criticality {
	case "critical":
		return mc.CriticalIntervalDays
	case "high":
		return mc.HighIntervalDays
	case "medium":
		return mc.MediumIntervalDays
	case "low":
		return mc.LowIntervalDays
	default:
		return mc.MediumIntervalDays
	}
}

// Alert representa um alerta gerado pelo sistema de monitoramento continuo.
type Alert struct {
	ID         string    `json:"id" firestore:"id"`
	TenantID   string    `json:"tenant_id" firestore:"tenant_id"`
	SupplierID string    `json:"supplier_id" firestore:"supplier_id"`
	Type       string    `json:"type" firestore:"type"`     // score_drop, category_change, critical_finding, scan_overdue
	Severity   string    `json:"severity" firestore:"severity"` // critical, high, medium, low
	Title      string    `json:"title" firestore:"title"`
	Detail     string    `json:"detail" firestore:"detail"`
	Status     string    `json:"status" firestore:"status"` // open, acknowledged, resolved
	Metadata   map[string]interface{} `json:"metadata,omitempty" firestore:"metadata,omitempty"`

	CreatedAt      time.Time  `json:"created_at" firestore:"created_at"`
	AcknowledgedAt *time.Time `json:"acknowledged_at,omitempty" firestore:"acknowledged_at,omitempty"`
	AcknowledgedBy string     `json:"acknowledged_by,omitempty" firestore:"acknowledged_by,omitempty"`
	ResolvedAt     *time.Time `json:"resolved_at,omitempty" firestore:"resolved_at,omitempty"`
}

// ValidAlertTypes define os tipos validos de alerta.
var ValidAlertTypes = map[string]bool{
	"score_drop":       true,
	"category_change":  true,
	"critical_finding": true,
	"scan_overdue":     true,
}

// ValidAlertStatuses define os status validos de alerta.
var ValidAlertStatuses = map[string]bool{
	"open":         true,
	"acknowledged": true,
	"resolved":     true,
}
