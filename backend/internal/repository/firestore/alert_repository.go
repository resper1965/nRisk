package firestore

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/nrisk/backend/internal/domain"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

const alertsCollection = "alerts"

// AlertRepository persiste Alert no Firestore.
// Caminho: tenants/{tenantId}/alerts/{alertId}
type AlertRepository struct {
	client *firestore.Client
}

// NewAlertRepository cria um novo AlertRepository.
func NewAlertRepository(client *firestore.Client) *AlertRepository {
	return &AlertRepository{client: client}
}

func (r *AlertRepository) colRef(tenantID string) *firestore.CollectionRef {
	return r.client.Collection("tenants/" + tenantID + "/" + alertsCollection)
}

// Create persiste um novo alerta.
func (r *AlertRepository) Create(ctx context.Context, tenantID string, a *domain.Alert) error {
	a.TenantID = tenantID
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	if a.CreatedAt.IsZero() {
		a.CreatedAt = time.Now().UTC()
	}
	if a.Status == "" {
		a.Status = "open"
	}

	_, err := r.colRef(tenantID).Doc(a.ID).Set(ctx, a)
	return err
}

// GetByID retorna um alerta pelo ID.
func (r *AlertRepository) GetByID(ctx context.Context, tenantID, alertID string) (*domain.Alert, error) {
	doc, err := r.colRef(tenantID).Doc(alertID).Get(ctx)
	if err != nil {
		return nil, err
	}
	var a domain.Alert
	if err := doc.DataTo(&a); err != nil {
		return nil, err
	}
	a.ID = doc.Ref.ID
	return &a, nil
}

// ListByTenant retorna alertas do tenant com filtros opcionais.
func (r *AlertRepository) ListByTenant(ctx context.Context, tenantID string, status string, limit int) ([]*domain.Alert, error) {
	if limit <= 0 {
		limit = 50
	}

	q := r.colRef(tenantID).Query
	if status != "" {
		q = q.Where("status", "==", status)
	}
	q = q.OrderBy("created_at", firestore.Desc).Limit(limit)

	iter := q.Documents(ctx)
	defer iter.Stop()

	var alerts []*domain.Alert
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		var a domain.Alert
		if err := doc.DataTo(&a); err != nil {
			continue
		}
		a.ID = doc.Ref.ID
		alerts = append(alerts, &a)
	}
	return alerts, nil
}

// UpdateStatus atualiza o status de um alerta (acknowledge/resolve).
func (r *AlertRepository) UpdateStatus(ctx context.Context, tenantID, alertID, status string, updatedBy string) error {
	updates := []firestore.Update{
		{Path: "status", Value: status},
	}

	now := time.Now().UTC()
	switch status {
	case "acknowledged":
		updates = append(updates,
			firestore.Update{Path: "acknowledged_at", Value: now},
			firestore.Update{Path: "acknowledged_by", Value: updatedBy},
		)
	case "resolved":
		updates = append(updates,
			firestore.Update{Path: "resolved_at", Value: now},
		)
	}

	_, err := r.colRef(tenantID).Doc(alertID).Update(ctx, updates)
	return err
}

// CountOpen retorna o numero de alertas abertos para o tenant.
func (r *AlertRepository) CountOpen(ctx context.Context, tenantID string) (int, error) {
	iter := r.colRef(tenantID).Where("status", "==", "open").Documents(ctx)
	defer iter.Stop()

	count := 0
	for {
		_, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return 0, err
		}
		count++
	}
	return count, nil
}
