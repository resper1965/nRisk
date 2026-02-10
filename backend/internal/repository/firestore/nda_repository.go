package firestore

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/nrisk/backend/internal/domain"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

const ndaRequestsCollection = "nda_requests"

// NDARepository persiste NDARequest no Firestore.
// Path: tenants/{tenantId}/nda_requests/{requestId}
type NDARepository struct {
	client *firestore.Client
}

// NewNDARepository cria um novo NDARepository.
func NewNDARepository(client *firestore.Client) *NDARepository {
	return &NDARepository{client: client}
}

func (r *NDARepository) tenantCol(tenantID string) *firestore.CollectionRef {
	return r.client.Collection("tenants/" + tenantID + "/" + ndaRequestsCollection)
}

// Create persiste uma nova NDARequest.
func (r *NDARepository) Create(ctx context.Context, req *domain.NDARequest) error {
	if req.ID == "" {
		req.ID = uuid.New().String()
	}
	req.CreatedAt = time.Now().UTC()
	if req.Status == "" {
		req.Status = "pending"
	}

	docRef := r.tenantCol(req.TenantID).Doc(req.ID)
	_, err := docRef.Set(ctx, req)
	return err
}

// GetByID retorna uma NDARequest pelo ID.
func (r *NDARepository) GetByID(ctx context.Context, tenantID, requestID string) (*domain.NDARequest, error) {
	doc, err := r.tenantCol(tenantID).Doc(requestID).Get(ctx)
	if err != nil {
		return nil, err
	}
	var req domain.NDARequest
	if err := doc.DataTo(&req); err != nil {
		return nil, err
	}
	req.ID = doc.Ref.ID
	return &req, nil
}

// ListByTenant retorna NDARequests do tenant com filtro opcional de status.
func (r *NDARepository) ListByTenant(ctx context.Context, tenantID, status string) ([]*domain.NDARequest, error) {
	q := r.tenantCol(tenantID).Query
	if status != "" {
		q = q.Where("status", "==", status)
	}
	q = q.OrderBy("created_at", firestore.Desc)

	iter := q.Documents(ctx)
	defer iter.Stop()

	var out []*domain.NDARequest
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		var req domain.NDARequest
		if err := doc.DataTo(&req); err != nil {
			continue
		}
		req.ID = doc.Ref.ID
		out = append(out, &req)
	}
	return out, nil
}

// UpdateStatus atualiza o status de uma NDARequest (aprovar/rejeitar).
func (r *NDARepository) UpdateStatus(ctx context.Context, tenantID, requestID, reviewedBy, status, note string, expiresAt *time.Time) error {
	now := time.Now().UTC()
	updates := []firestore.Update{
		{Path: "status", Value: status},
		{Path: "reviewed_by", Value: reviewedBy},
		{Path: "reviewed_at", Value: now},
		{Path: "decision_note", Value: note},
	}
	if expiresAt != nil {
		updates = append(updates, firestore.Update{Path: "expires_at", Value: *expiresAt})
	}

	docRef := r.tenantCol(tenantID).Doc(requestID)
	_, err := docRef.Update(ctx, updates)
	return err
}

// HasApprovedAccess verifica se um e-mail tem acesso NDA aprovado e nao expirado.
func (r *NDARepository) HasApprovedAccess(ctx context.Context, tenantID, email string) (bool, error) {
	iter := r.tenantCol(tenantID).
		Where("requester_email", "==", email).
		Where("status", "==", "approved").
		Limit(1).
		Documents(ctx)
	defer iter.Stop()

	doc, err := iter.Next()
	if err == iterator.Done {
		return false, nil
	}
	if err != nil {
		return false, err
	}

	var req domain.NDARequest
	if err := doc.DataTo(&req); err != nil {
		return false, err
	}

	// Verificar expiracao
	if req.ExpiresAt != nil && req.ExpiresAt.Before(time.Now().UTC()) {
		return false, nil
	}
	return true, nil
}
