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
	Severity           string `json:"severity"` // critical, high, medium, low
	ScoreDeductionIfNo int    `json:"score_deduction_if_no"`
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
