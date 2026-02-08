package domain

import "time"

// Questionnaire representa um conjunto de perguntas de um framework.
type Questionnaire struct {
	FrameworkID   string     `json:"framework_id"`
	FrameworkName string     `json:"framework_name"`
	Questions     []Question `json:"questions"`
}

// Question representa uma pergunta do assessment.
type Question struct {
	ID                 string `json:"id"`
	ControlID          string `json:"control_id"`
	ISODomain          string `json:"iso_domain"`
	Text               string `json:"text"`
	Severity           string `json:"severity"`             // critical, high, medium, low
	ScoreDeductionIfNo int    `json:"score_deduction_if_no"`
	RiskWeight         int    `json:"risk_weight"`          // 0-5, pontos aditivos se Sim
	EvidenceType       string `json:"evidence_type"`        // pdf, image, link, none
	Track              string `json:"track"`                // bronze, silver, gold
	Category           string `json:"category"`             // categoria para agrupamento no spider chart
}

// FindingInsight representa uma interpretação humana de um achado técnico.
type FindingInsight struct {
	ID          string `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Impact      string `json:"impact"`
	Remediation string `json:"remediation"`
}

// Answer representa a resposta de um tenant a uma pergunta.
type Answer struct {
	ID          string    `json:"id"`
	TenantID    string    `json:"tenant_id"`
	QuestionID  string    `json:"question_id"`
	ControlID   string    `json:"control_id"`
	Status      string    `json:"status"` // sim, nao, na
	Text        string    `json:"text,omitempty"`
	EvidenceURL string    `json:"evidence_url,omitempty"`
	RespondedAt time.Time `json:"responded_at"`
}

// CrossCheckResult representa o resultado da validação cruzada de um controle.
type CrossCheckResult struct {
	ControlID         string `json:"control_id"`
	ISODomain         string `json:"iso_domain"`
	QuestionID        string `json:"question_id"`
	DeclaredStatus    string `json:"declared_status"`              // sim, nao, na
	ScanStatus        string `json:"scan_status"`                  // clean, finding_found
	Verdict           string `json:"verdict"`                      // validated, inconsistent, alert, not_applicable
	InconsistencyType string `json:"inconsistency_type,omitempty"` // critical, standard, alert
	FindingSeverity   string `json:"finding_severity,omitempty"`
	Detail            string `json:"detail,omitempty"`
}

// ScoreBreakdown contém o detalhamento completo do score híbrido.
type ScoreBreakdown struct {
	TechnicalScore      int                `json:"technical_score"`        // T: 0-1000
	ComplianceScoreRaw  int                `json:"compliance_score_raw"`   // C bruto: 0-1000
	ComplianceScore     float64            `json:"compliance_score"`        // C ajustado por F
	ConfidenceFactor    float64            `json:"confidence_factor"`      // F: 0.5-1.0
	HybridScore         float64            `json:"hybrid_score"`            // S_f
	ScoreCategory      string             `json:"score_category"`         // A-F
	HasCriticalFinding  bool               `json:"has_critical_finding"`
	CriticalPenalty     bool               `json:"critical_penalty_applied"`
	Inconsistencies     []CrossCheckResult `json:"inconsistencies,omitempty"`
	DomainScores       map[string]float64  `json:"domain_scores"`          // para spider chart
	Insights          []FindingInsight    `json:"insights,omitempty"`      // Robo-CISO insights
	FrameworkID        string             `json:"framework_id"`
}

// ScoreSnapshot persiste cross-check + ScoreBreakdown por assessment/scan (P1.2 jornada persistida).
type ScoreSnapshot struct {
	ID             string         `json:"id"`
	TenantID       string         `json:"tenant_id"`
	ScanID         string         `json:"scan_id"`
	Domain         string         `json:"domain"`
	ComputedAt     time.Time      `json:"computed_at"`
	ScoreBreakdown ScoreBreakdown `json:"score_breakdown"`
}

// FindingJustification representa justificativa de finding (P1.6 — cliente submete, avaliador aprova/rejeita).
// Regra: se aprovada, o finding deixa de penalizar o score (ou penaliza menos).
type FindingJustification struct {
	ID           string    `json:"id"`
	TenantID     string    `json:"tenant_id"`
	ScanID       string    `json:"scan_id"`
	FindingID    string    `json:"finding_id"`
	Status       string    `json:"status"` // submitted, approved, rejected
	Text         string    `json:"text"`
	SubmittedBy  string    `json:"submitted_by"`
	SubmittedAt  time.Time `json:"submitted_at"`
	ReviewedBy    string    `json:"reviewed_by,omitempty"`
	ReviewedAt    time.Time `json:"reviewed_at,omitempty"`
	DecisionNote string    `json:"decision_note,omitempty"`
}
