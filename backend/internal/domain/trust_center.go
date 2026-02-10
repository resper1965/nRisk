package domain

import "time"

// Badge representa um selo de conformidade (ISO 27001, SOC 2, LGPD, etc.).
type Badge struct {
	Name   string `json:"name" firestore:"name"`     // ex: "ISO 27001"
	Status string `json:"status" firestore:"status"` // certificado, em_progresso, planejado
	Issuer string `json:"issuer,omitempty" firestore:"issuer,omitempty"`
	Date   string `json:"date,omitempty" firestore:"date,omitempty"` // ex: "2025-03"
}

// Document representa um documento publicado no Trust Center.
type Document struct {
	Name string `json:"name" firestore:"name"`
	URL  string `json:"url" firestore:"url"`
	Type string `json:"type,omitempty" firestore:"type,omitempty"` // pdf, link, image
}

// TrustCenterProfile representa o perfil publico do Trust Center de um tenant.
type TrustCenterProfile struct {
	ID               string     `json:"id" firestore:"id"`
	TenantID         string     `json:"tenant_id" firestore:"tenant_id"`
	Slug             string     `json:"slug" firestore:"slug"`
	CompanyName      string     `json:"company_name" firestore:"company_name"`
	Description      string     `json:"description,omitempty" firestore:"description,omitempty"`
	LogoURL          string     `json:"logo_url,omitempty" firestore:"logo_url,omitempty"`
	WebsiteURL       string     `json:"website_url,omitempty" firestore:"website_url,omitempty"`
	ShowScore        bool       `json:"show_score" firestore:"show_score"`
	ShowSpiderChart  bool       `json:"show_spider_chart" firestore:"show_spider_chart"`
	ShowGrade        bool       `json:"show_grade" firestore:"show_grade"`
	RequireNDA       bool       `json:"require_nda" firestore:"require_nda"`
	NDAExpiryDays    int        `json:"nda_expiry_days" firestore:"nda_expiry_days"`
	Badges           []Badge    `json:"badges" firestore:"badges"`
	PublicDocuments  []Document `json:"public_documents" firestore:"public_documents"`
	NDADocuments     []Document `json:"nda_documents" firestore:"nda_documents"`
	ContactEmail     string     `json:"contact_email,omitempty" firestore:"contact_email,omitempty"`
	PrivacyPolicyURL string     `json:"privacy_policy_url,omitempty" firestore:"privacy_policy_url,omitempty"`
	TermsURL         string     `json:"terms_url,omitempty" firestore:"terms_url,omitempty"`
	Status           string     `json:"status" firestore:"status"` // draft, published, archived
	CreatedAt        time.Time  `json:"created_at" firestore:"created_at"`
	UpdatedAt        time.Time  `json:"updated_at" firestore:"updated_at"`
}

// NDARequest representa uma solicitacao de acesso NDA ao Trust Center.
type NDARequest struct {
	ID               string     `json:"id" firestore:"id"`
	TenantID         string     `json:"tenant_id" firestore:"tenant_id"`
	TrustCenterID    string     `json:"trust_center_id" firestore:"trust_center_id"`
	RequesterName    string     `json:"requester_name" firestore:"requester_name"`
	RequesterEmail   string     `json:"requester_email" firestore:"requester_email"`
	RequesterCompany string     `json:"requester_company" firestore:"requester_company"`
	RequesterRole    string     `json:"requester_role,omitempty" firestore:"requester_role,omitempty"`
	Reason           string     `json:"reason,omitempty" firestore:"reason,omitempty"`
	Status           string     `json:"status" firestore:"status"` // pending, approved, rejected, expired
	ReviewedBy       string     `json:"reviewed_by,omitempty" firestore:"reviewed_by,omitempty"`
	ReviewedAt       *time.Time `json:"reviewed_at,omitempty" firestore:"reviewed_at,omitempty"`
	DecisionNote     string     `json:"decision_note,omitempty" firestore:"decision_note,omitempty"`
	ExpiresAt        *time.Time `json:"expires_at,omitempty" firestore:"expires_at,omitempty"`
	CreatedAt        time.Time  `json:"created_at" firestore:"created_at"`
}

// ValidTrustCenterStatuses define os valores validos para status do Trust Center.
var ValidTrustCenterStatuses = map[string]bool{
	"draft":     true,
	"published": true,
	"archived":  true,
}

// ValidBadgeStatuses define os valores validos para status de badge.
var ValidBadgeStatuses = map[string]bool{
	"certificado":  true,
	"em_progresso": true,
	"planejado":    true,
}

// ValidNDAStatuses define os valores validos para status de NDA request.
var ValidNDAStatuses = map[string]bool{
	"pending":  true,
	"approved": true,
	"rejected": true,
	"expired":  true,
}
