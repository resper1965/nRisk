package firestore

import (
	"context"
	"time"

	"github.com/nrisk/backend/internal/assessment"

	"cloud.google.com/go/firestore"
)

const baseScore = 1000

// ScoreRepository atualiza o score final do scan no Firestore.
type ScoreRepository struct {
	client *firestore.Client
}

// NewScoreRepository cria um novo ScoreRepository.
func NewScoreRepository(client *firestore.Client) *ScoreRepository {
	return &ScoreRepository{client: client}
}

// UpdateScanScore calcula e persiste o score após deduções.
// Caminho: tenants/{tenantId}/scans/{scanId}
func (r *ScoreRepository) UpdateScanScore(ctx context.Context, tenantID, scanID string, totalDeduction int, status string) error {
	score := baseScore - totalDeduction
	if score < 0 {
		score = 0
	}
	category := assessment.ScoreToCategory(score)
	now := time.Now().UTC()

	docPath := "tenants/" + tenantID + "/scans/" + scanID
	docRef := r.client.Doc(docPath)
	_, err := docRef.Update(ctx, []firestore.Update{
		{Path: "score", Value: score},
		{Path: "score_category", Value: category},
		{Path: "status", Value: status},
		{Path: "finished_at", Value: now},
	})
	return err
}

