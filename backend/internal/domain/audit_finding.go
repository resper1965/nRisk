package domain

import "time"

// AuditFinding representa um achado de auditoria vinculado a controle ISO 27001.
type AuditFinding struct {
	ID              string    `json:"id"`
	TenantID        string    `json:"tenant_id"`
	ScanID          string    `json:"scan_id"`
	Domain          string    `json:"domain"`
	ToolName        string    `json:"tool_name"`
	TechnicalFinding string   `json:"technical_finding"`
	TemplateID      string    `json:"template_id,omitempty"`
	Port            int       `json:"port,omitempty"`
	ControlID       string    `json:"control_id"`
	ISODomain       string    `json:"iso_domain"`
	ISOTitle        string    `json:"iso_title"`
	ScoreDeduction  int       `json:"score_deduction"`
	Severity        string    `json:"severity"`
	Title           string    `json:"title"`
	Detail          string    `json:"detail,omitempty"`
	Recommendation  string    `json:"recommendation,omitempty"`
	RawOutput       string    `json:"raw_output,omitempty"`
	CreatedAt       time.Time `json:"created_at"`
}
