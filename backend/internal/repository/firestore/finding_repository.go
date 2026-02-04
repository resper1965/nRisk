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

// SaveBatch persiste múltiplos findings usando Firestore WriteBatch (até 500 por batch).
func (r *FindingRepository) SaveBatch(ctx context.Context, tenantID, scanID string, findings []*domain.AuditFinding) error {
	const maxBatchSize = 500
	for i := 0; i < len(findings); i += maxBatchSize {
		end := i + maxBatchSize
		if end > len(findings) {
			end = len(findings)
		}
		batch := r.client.Batch()
		for _, f := range findings[i:end] {
			f.TenantID = tenantID
			f.ScanID = scanID
			if f.ID == "" {
				f.ID = uuid.New().String()
			}
			f.CreatedAt = time.Now().UTC()
			docPath := "tenants/" + tenantID + "/scans/" + scanID + "/" + findingsCollection + "/" + f.ID
			batch.Set(r.client.Doc(docPath), f)
		}
		if _, err := batch.Commit(ctx); err != nil {
			return err
		}
	}
	return nil
}
