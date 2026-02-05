package domain

import "time"

// Company representa uma empresa cadastrada (multi-tenant).
type Company struct {
	ID        string    `json:"id"`
	TenantID  string    `json:"tenant_id"`
	Domain    string    `json:"domain"`
	CNPJ      string    `json:"cnpj,omitempty"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

// DNSInfo contém resultados de verificação DNS.
type DNSInfo struct {
	Records    []DNSRecord `json:"records"`
	SPF        string      `json:"spf,omitempty"`
	DMARC      string      `json:"dmarc,omitempty"`
	DMARCPolicy string     `json:"dmarc_policy,omitempty"`
}

// DNSRecord representa um registro DNS (A, MX, TXT, etc.).
type DNSRecord struct {
	Type  string   `json:"type"`
	Value []string `json:"value"`
}

// SSLInfo contém resultados de verificação de certificado SSL.
type SSLInfo struct {
	Valid       bool      `json:"valid"`
	ExpiresAt   time.Time `json:"expires_at"`
	Issuer      string    `json:"issuer,omitempty"`
	Subject     string    `json:"subject,omitempty"`
	DaysToExpiry int      `json:"days_to_expiry"`
}

// ScanResult representa o resultado de um scan passivo.
// Persistido no Firestore em /tenants/{tenant_id}/scans/{scan_id}
type ScanResult struct {
	ID         string    `json:"id"`
	TenantID   string    `json:"tenant_id"`
	Domain     string    `json:"domain"`
	Status     string    `json:"status"` // pending, running, completed, failed
	DNS        *DNSInfo  `json:"dns,omitempty"`
	SSL        *SSLInfo  `json:"ssl,omitempty"`
	Score      int       `json:"score"`       // 0-1000
	ScoreCategory string `json:"score_category"` // A-F
	Findings   []Finding `json:"findings,omitempty"`
	StartedAt  time.Time `json:"started_at"`
	FinishedAt *time.Time `json:"finished_at,omitempty"`
}

// Finding representa um achado técnico do scan.
type Finding struct {
	ControlID string `json:"control_id"`
	Severity  string `json:"severity"` // critical, high, medium, low
	Title     string `json:"title"`
	Detail    string `json:"detail,omitempty"`
}

// DomainScore representa o score e a nota (A–F) por eixo/domínio ISO (P1.1 rating por eixo).
type DomainScore struct {
	DomainID string `json:"domain_id"` // ex.: A.10.1.1
	Label    string `json:"label"`     // ex.: Criptografia - Certificados
	Score    int    `json:"score"`     // 0–1000
	Grade    string `json:"grade"`     // A–F
}

// AssessmentResponse representa a resposta a uma pergunta do questionário.
type AssessmentResponse struct {
	ID             string    `json:"id"`
	TenantID       string    `json:"tenant_id"`
	AssessmentID   string    `json:"assessment_id"`
	QuestionID     string    `json:"question_id"`
	ControlID      string    `json:"control_id"`
	Answer         string    `json:"answer"`  // yes, no, na
	EvidenceURL    string    `json:"evidence_url,omitempty"`
	RespondedBy    string    `json:"responded_by"`
	RespondedAt    time.Time `json:"responded_at"`
}
