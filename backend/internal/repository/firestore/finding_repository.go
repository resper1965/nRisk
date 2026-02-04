package firestore

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/nrisk/backend/internal/domain"

	"cloud.google.com/go/firestore"
)

const findingsCollection = "findings"

// FindingRepository persiste AuditFindings no Firestore.
// Caminho: tenants/{tenantId}/scans/{scanId}/findings/{findingId}
type FindingRepository struct {
	client *firestore.Client
}

// NewFindingRepository cria um novo FindingRepository.
func NewFindingRepository(client *firestore.Client) *FindingRepository {
	return &FindingRepository{client: client}
}

// Save persiste um AuditFinding.
func (r *FindingRepository) Save(ctx context.Context, tenantID, scanID string, finding *domain.AuditFinding) error {
	finding.TenantID = tenantID
	finding.ScanID = scanID
	if finding.ID == "" {
		finding.ID = uuid.New().String()
	}
	finding.CreatedAt = time.Now().UTC()

	docPath := "tenants/" + tenantID + "/scans/" + scanID + "/" + findingsCollection + "/" + finding.ID
	_, err := r.client.Doc(docPath).Set(ctx, finding)
	return err
}

// SaveBatch persiste múltiplos findings.
func (r *FindingRepository) SaveBatch(ctx context.Context, tenantID, scanID string, findings []*domain.AuditFinding) error {
	for _, f := range findings {
		if err := r.Save(ctx, tenantID, scanID, f); err != nil {
			return err
		}
	}
	return nil
}
