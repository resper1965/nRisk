package firestore

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/nrisk/backend/internal/domain"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

const justificationsCollection = "justifications"

// FindingJustificationRepository persiste justificativas de findings (P1.6).
// Caminho: tenants/{tenantId}/scans/{scanId}/justifications/{justificationId}
type FindingJustificationRepository struct {
	client *firestore.Client
}

// NewFindingJustificationRepository cria um novo FindingJustificationRepository.
func NewFindingJustificationRepository(client *firestore.Client) *FindingJustificationRepository {
	return &FindingJustificationRepository{client: client}
}

// Save persiste uma justificativa (submitted).
func (r *FindingJustificationRepository) Save(ctx context.Context, tenantID, scanID string, j *domain.FindingJustification) error {
	j.TenantID = tenantID
	j.ScanID = scanID
	if j.ID == "" {
		j.ID = uuid.New().String()
	}
	if j.SubmittedAt.IsZero() {
		j.SubmittedAt = time.Now().UTC()
	}
	if j.Status == "" {
		j.Status = "submitted"
	}

	docPath := "tenants/" + tenantID + "/scans/" + scanID + "/" + justificationsCollection + "/" + j.ID
	_, err := r.client.Doc(docPath).Set(ctx, j)
	return err
}

// GetByID retorna uma justificativa pelo ID (busca em tenants/{tid}/scans/{sid}/justifications/{id}).
func (r *FindingJustificationRepository) GetByID(ctx context.Context, tenantID, scanID, justificationID string) (*domain.FindingJustification, error) {
	docPath := "tenants/" + tenantID + "/scans/" + scanID + "/" + justificationsCollection + "/" + justificationID
	doc, err := r.client.Doc(docPath).Get(ctx)
	if err != nil {
		return nil, err
	}
	var j domain.FindingJustification
	if err := doc.DataTo(&j); err != nil {
		return nil, err
	}
	j.ID = doc.Ref.ID
	return &j, nil
}

// ListByFinding retorna justificativas de um finding (para listagem no cliente/avaliador).
func (r *FindingJustificationRepository) ListByFinding(ctx context.Context, tenantID, scanID, findingID string) ([]*domain.FindingJustification, error) {
	colPath := "tenants/" + tenantID + "/scans/" + scanID + "/" + justificationsCollection
	iter := r.client.Collection(colPath).Where("finding_id", "==", findingID).OrderBy("submitted_at", firestore.Desc).Documents(ctx)
	defer iter.Stop()

	var out []*domain.FindingJustification
	for {
		doc, err := iter.Next()
		if err != nil {
			if err == iterator.Done {
				break
			}
			return nil, err
		}
		var j domain.FindingJustification
		if err := doc.DataTo(&j); err != nil {
			return nil, err
		}
		j.ID = doc.Ref.ID
		out = append(out, &j)
	}
	return out, nil
}

// ListApprovedFindingIDs retorna IDs de findings com justificativa aprovada no scan (para exclusão do score, P1.6).
func (r *FindingJustificationRepository) ListApprovedFindingIDs(ctx context.Context, tenantID, scanID string) ([]string, error) {
	colPath := "tenants/" + tenantID + "/scans/" + scanID + "/" + justificationsCollection
	iter := r.client.Collection(colPath).Where("status", "==", "approved").Documents(ctx)
	defer iter.Stop()

	seen := make(map[string]bool)
	var out []string
	for {
		doc, err := iter.Next()
		if err != nil {
			if err == iterator.Done {
				break
			}
			return nil, err
		}
		var j domain.FindingJustification
		if err := doc.DataTo(&j); err != nil {
			return nil, err
		}
		if j.FindingID != "" && !seen[j.FindingID] {
			seen[j.FindingID] = true
			out = append(out, j.FindingID)
		}
	}
	return out, nil
}

// UpdateReview atualiza status e dados da revisão (avaliador aprova/rejeita).
func (r *FindingJustificationRepository) UpdateReview(ctx context.Context, tenantID, scanID, justificationID, reviewedBy, decision, note string) error {
	docPath := "tenants/" + tenantID + "/scans/" + scanID + "/" + justificationsCollection + "/" + justificationID
	now := time.Now().UTC()
	_, err := r.client.Doc(docPath).Update(ctx, []firestore.Update{
		{Path: "status", Value: decision},
		{Path: "reviewed_by", Value: reviewedBy},
		{Path: "reviewed_at", Value: now},
		{Path: "decision_note", Value: note},
	})
	return err
}
