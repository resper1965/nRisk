package firestore

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/nrisk/backend/internal/domain"

	"cloud.google.com/go/firestore"
)

const scansCollection = "scans"

// ScanRepository implementa persistência de ScanResult no Firestore.
// Isolamento multi-tenant via path: /tenants/{tenant_id}/scans/{scan_id}
type ScanRepository struct {
	client *firestore.Client
}

// NewScanRepository cria um novo ScanRepository.
func NewScanRepository(client *firestore.Client) *ScanRepository {
	return &ScanRepository{client: client}
}

// Save persiste um ScanResult no Firestore.
// Caminho: tenants/{tenant_id}/scans/{scan_id} — garante isolamento lógico por tenant.
func (r *ScanRepository) Save(ctx context.Context, tenantID string, scan *domain.ScanResult) error {
	scan.TenantID = tenantID
	if scan.ID == "" {
		scan.ID = uuid.New().String()
	}

	docPath := "tenants/" + tenantID + "/" + scansCollection + "/" + scan.ID
	docRef := r.client.Doc(docPath)

	_, err := docRef.Set(ctx, scan)
	return err
}

// GetByID retorna um ScanResult pelo ID, restrito ao tenant.
func (r *ScanRepository) GetByID(ctx context.Context, tenantID, scanID string) (*domain.ScanResult, error) {
	docPath := "tenants/" + tenantID + "/" + scansCollection + "/" + scanID
	docRef := r.client.Doc(docPath)

	doc, err := docRef.Get(ctx)
	if err != nil {
		return nil, err
	}

	var scan domain.ScanResult
	if err := doc.DataTo(&scan); err != nil {
		return nil, err
	}
	scan.ID = doc.Ref.ID
	return &scan, nil
}

// CreatePendingScan cria um scan com status "pending" e retorna o ID.
func (r *ScanRepository) CreatePendingScan(ctx context.Context, tenantID, domain string) (*domain.ScanResult, error) {
	scan := &domain.ScanResult{
		ID:        uuid.New().String(),
		TenantID:  tenantID,
		Domain:    domain,
		Status:    "pending",
		Score:     0,
		StartedAt: time.Now().UTC(),
	}
	if err := r.Save(ctx, tenantID, scan); err != nil {
		return nil, err
	}
	return scan, nil
}
