package domain

import "time"

// Supplier representa um fornecedor cadastrado por um tenant (Gestor GRC).
type Supplier struct {
	ID               string    `json:"id" firestore:"id"`
	TenantID         string    `json:"tenant_id" firestore:"tenant_id"`
	Name             string    `json:"name" firestore:"name"`
	Domain           string    `json:"domain" firestore:"domain"`
	CNPJ             string    `json:"cnpj,omitempty" firestore:"cnpj,omitempty"`
	Criticality      string    `json:"criticality" firestore:"criticality"`
	Category         string    `json:"category,omitempty" firestore:"category,omitempty"`
	Status           string    `json:"status" firestore:"status"`
	SupplierTenantID string    `json:"supplier_tenant_id,omitempty" firestore:"supplier_tenant_id,omitempty"`
	ContactName      string    `json:"contact_name,omitempty" firestore:"contact_name,omitempty"`
	ContactEmail     string    `json:"contact_email,omitempty" firestore:"contact_email,omitempty"`
	Notes            string    `json:"notes,omitempty" firestore:"notes,omitempty"`
	CreatedAt        time.Time `json:"created_at" firestore:"created_at"`
	UpdatedAt        time.Time `json:"updated_at" firestore:"updated_at"`
}

// SupplierInvitation representa um convite de assessment enviado a um fornecedor.
type SupplierInvitation struct {
	ID           string     `json:"id" firestore:"id"`
	TenantID     string     `json:"tenant_id" firestore:"tenant_id"`
	SupplierID   string     `json:"supplier_id" firestore:"supplier_id"`
	Track        string     `json:"track" firestore:"track"`
	FrameworkID  string     `json:"framework_id" firestore:"framework_id"`
	InvitedEmail string     `json:"invited_email" firestore:"invited_email"`
	InvitedBy    string     `json:"invited_by" firestore:"invited_by"`
	Status       string     `json:"status" firestore:"status"`
	Token        string     `json:"token" firestore:"token"`
	ExpiresAt    time.Time  `json:"expires_at" firestore:"expires_at"`
	AcceptedAt   *time.Time `json:"accepted_at,omitempty" firestore:"accepted_at,omitempty"`
	CompletedAt  *time.Time `json:"completed_at,omitempty" firestore:"completed_at,omitempty"`
	CreatedAt    time.Time  `json:"created_at" firestore:"created_at"`
}

// ValidCriticalities define os valores validos para criticality.
var ValidCriticalities = map[string]bool{
	"critical": true,
	"high":     true,
	"medium":   true,
	"low":      true,
}

// ValidSupplierStatuses define os valores validos para status do supplier.
var ValidSupplierStatuses = map[string]bool{
	"active":             true,
	"inactive":           true,
	"pending_assessment": true,
	"blocked":            true,
}

// ValidTracks define os valores validos para trilha de maturidade.
var ValidTracks = map[string]bool{
	"bronze": true,
	"silver": true,
	"gold":   true,
}

// ValidInvitationStatuses define os valores validos para status do convite.
var ValidInvitationStatuses = map[string]bool{
	"pending":     true,
	"accepted":    true,
	"in_progress": true,
	"completed":   true,
	"expired":     true,
}
