package firestore

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/nrisk/backend/internal/domain"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

const invitationsCollection = "supplier_invitations"

// InvitationRepository implementa persistencia de SupplierInvitation no Firestore.
// Path principal: /tenants/{tenant_id}/supplier_invitations/{invitation_id}
// Indice global para lookup por token: /invitation_tokens/{token}
type InvitationRepository struct {
	client *firestore.Client
}

// NewInvitationRepository cria um novo InvitationRepository.
func NewInvitationRepository(client *firestore.Client) *InvitationRepository {
	return &InvitationRepository{client: client}
}

func (r *InvitationRepository) tenantCol(tenantID string) *firestore.CollectionRef {
	return r.client.Collection("tenants/" + tenantID + "/" + invitationsCollection)
}

// GenerateToken gera um token criptograficamente seguro de 32 bytes (64 chars hex).
func GenerateToken() (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return hex.EncodeToString(b), nil
}

// Create persiste um novo convite no Firestore e cria indice de token global.
func (r *InvitationRepository) Create(ctx context.Context, inv *domain.SupplierInvitation) error {
	if inv.ID == "" {
		inv.ID = uuid.New().String()
	}
	if inv.Token == "" {
		token, err := GenerateToken()
		if err != nil {
			return fmt.Errorf("failed to generate token: %w", err)
		}
		inv.Token = token
	}
	inv.CreatedAt = time.Now().UTC()

	batch := r.client.Batch()

	// Doc principal no tenant
	docRef := r.tenantCol(inv.TenantID).Doc(inv.ID)
	batch.Set(docRef, inv)

	// Indice global por token para lookup sem tenant_id (aceite do convite)
	tokenRef := r.client.Collection("invitation_tokens").Doc(inv.Token)
	batch.Set(tokenRef, map[string]interface{}{
		"invitation_id": inv.ID,
		"tenant_id":     inv.TenantID,
		"supplier_id":   inv.SupplierID,
		"status":        inv.Status,
		"expires_at":    inv.ExpiresAt,
	})

	_, err := batch.Commit(ctx)
	return err
}

// GetByID retorna um convite pelo ID, restrito ao tenant.
func (r *InvitationRepository) GetByID(ctx context.Context, tenantID, invitationID string) (*domain.SupplierInvitation, error) {
	doc, err := r.tenantCol(tenantID).Doc(invitationID).Get(ctx)
	if err != nil {
		return nil, fmt.Errorf("invitation not found: %w", err)
	}

	var inv domain.SupplierInvitation
	if err := doc.DataTo(&inv); err != nil {
		return nil, err
	}
	inv.ID = doc.Ref.ID
	return &inv, nil
}

// GetByToken retorna um convite pelo token (lookup global, sem auth).
func (r *InvitationRepository) GetByToken(ctx context.Context, token string) (*domain.SupplierInvitation, error) {
	tokenDoc, err := r.client.Collection("invitation_tokens").Doc(token).Get(ctx)
	if err != nil {
		return nil, fmt.Errorf("token not found: %w", err)
	}

	data := tokenDoc.Data()
	tenantID, _ := data["tenant_id"].(string)
	invitationID, _ := data["invitation_id"].(string)
	if tenantID == "" || invitationID == "" {
		return nil, fmt.Errorf("invalid token index data")
	}

	return r.GetByID(ctx, tenantID, invitationID)
}

// ListByTenant retorna todos os convites de um tenant, com filtro de status opcional.
func (r *InvitationRepository) ListByTenant(ctx context.Context, tenantID, status string) ([]domain.SupplierInvitation, error) {
	q := r.tenantCol(tenantID).Query

	if status != "" {
		q = q.Where("status", "==", status)
	}
	q = q.OrderBy("created_at", firestore.Desc)

	iter := q.Documents(ctx)
	defer iter.Stop()

	var invitations []domain.SupplierInvitation
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		var inv domain.SupplierInvitation
		if err := doc.DataTo(&inv); err != nil {
			continue
		}
		inv.ID = doc.Ref.ID
		invitations = append(invitations, inv)
	}

	if invitations == nil {
		invitations = []domain.SupplierInvitation{}
	}
	return invitations, nil
}

// ListBySupplier retorna convites de um fornecedor especifico.
func (r *InvitationRepository) ListBySupplier(ctx context.Context, tenantID, supplierID string) ([]domain.SupplierInvitation, error) {
	q := r.tenantCol(tenantID).Where("supplier_id", "==", supplierID).OrderBy("created_at", firestore.Desc)

	iter := q.Documents(ctx)
	defer iter.Stop()

	var invitations []domain.SupplierInvitation
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		var inv domain.SupplierInvitation
		if err := doc.DataTo(&inv); err != nil {
			continue
		}
		inv.ID = doc.Ref.ID
		invitations = append(invitations, inv)
	}

	if invitations == nil {
		invitations = []domain.SupplierInvitation{}
	}
	return invitations, nil
}

// UpdateStatus atualiza o status de um convite e sincroniza o indice de token.
func (r *InvitationRepository) UpdateStatus(ctx context.Context, inv *domain.SupplierInvitation) error {
	batch := r.client.Batch()

	docRef := r.tenantCol(inv.TenantID).Doc(inv.ID)
	batch.Set(docRef, inv)

	// Atualizar indice de token
	tokenRef := r.client.Collection("invitation_tokens").Doc(inv.Token)
	batch.Update(tokenRef, []firestore.Update{
		{Path: "status", Value: inv.Status},
	})

	_, err := batch.Commit(ctx)
	return err
}
