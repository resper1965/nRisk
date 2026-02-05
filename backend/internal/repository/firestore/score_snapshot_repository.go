package firestore

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/nrisk/backend/internal/domain"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

const scoreSnapshotsCollection = "score_snapshots"

// ScoreSnapshotRepository persiste ScoreSnapshot (cross-check + ScoreBreakdown) por scan (P1.2 jornada persistida).
// Caminho: tenants/{tenantId}/scans/{scanId}/score_snapshots/{snapshotId}
type ScoreSnapshotRepository struct {
	client *firestore.Client
}

// NewScoreSnapshotRepository cria um novo ScoreSnapshotRepository.
func NewScoreSnapshotRepository(client *firestore.Client) *ScoreSnapshotRepository {
	return &ScoreSnapshotRepository{client: client}
}

// Save persiste um ScoreSnapshot para o scan.
func (r *ScoreSnapshotRepository) Save(ctx context.Context, tenantID, scanID string, snap *domain.ScoreSnapshot) error {
	snap.TenantID = tenantID
	snap.ScanID = scanID
	if snap.ID == "" {
		snap.ID = uuid.New().String()
	}
	if snap.ComputedAt.IsZero() {
		snap.ComputedAt = time.Now().UTC()
	}

	docPath := "tenants/" + tenantID + "/scans/" + scanID + "/" + scoreSnapshotsCollection + "/" + snap.ID
	_, err := r.client.Doc(docPath).Set(ctx, snap)
	return err
}

// ListByScan retorna snapshots do scan ordenados por computed_at desc (histórico para demandantes, P1.2).
func (r *ScoreSnapshotRepository) ListByScan(ctx context.Context, tenantID, scanID string, limit int) ([]*domain.ScoreSnapshot, error) {
	if limit <= 0 {
		limit = 50
	}
	colPath := "tenants/" + tenantID + "/scans/" + scanID + "/" + scoreSnapshotsCollection
	iter := r.client.Collection(colPath).OrderBy("computed_at", firestore.Desc).Limit(limit).Documents(ctx)
	defer iter.Stop()

	var out []*domain.ScoreSnapshot
	for {
		doc, err := iter.Next()
		if err != nil {
			if err == iterator.Done {
				break
			}
			return nil, err
		}
		var s domain.ScoreSnapshot
		if err := doc.DataTo(&s); err != nil {
			return nil, err
		}
		s.ID = doc.Ref.ID
		out = append(out, &s)
	}
	return out, nil
}
