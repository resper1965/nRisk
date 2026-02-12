package firestore

import (
	"context"
	"time"

	"github.com/nrisk/backend/internal/domain"

	"cloud.google.com/go/firestore"
)

const monitoringConfigCollection = "monitoring_config"

// MonitoringConfigRepository persiste MonitoringConfig no Firestore.
// Caminho: tenants/{tenantId}/monitoring_config/{configId}
// Cada tenant tem apenas um documento de config (upsert por tenantId).
type MonitoringConfigRepository struct {
	client *firestore.Client
}

// NewMonitoringConfigRepository cria um novo MonitoringConfigRepository.
func NewMonitoringConfigRepository(client *firestore.Client) *MonitoringConfigRepository {
	return &MonitoringConfigRepository{client: client}
}

func (r *MonitoringConfigRepository) colRef(tenantID string) *firestore.CollectionRef {
	return r.client.Collection("tenants/" + tenantID + "/" + monitoringConfigCollection)
}

// GetByTenant retorna a config de monitoramento do tenant (ou nil se nao existir).
func (r *MonitoringConfigRepository) GetByTenant(ctx context.Context, tenantID string) (*domain.MonitoringConfig, error) {
	// Usa o tenantID como doc ID para garantir unicidade.
	doc, err := r.colRef(tenantID).Doc("default").Get(ctx)
	if err != nil {
		return nil, nil // nao encontrado
	}
	var cfg domain.MonitoringConfig
	if err := doc.DataTo(&cfg); err != nil {
		return nil, err
	}
	cfg.ID = doc.Ref.ID
	return &cfg, nil
}

// Save cria ou atualiza a config de monitoramento do tenant.
func (r *MonitoringConfigRepository) Save(ctx context.Context, tenantID string, cfg *domain.MonitoringConfig) error {
	cfg.TenantID = tenantID
	if cfg.ID == "" {
		cfg.ID = "default"
	}
	cfg.UpdatedAt = time.Now().UTC()
	if cfg.CreatedAt.IsZero() {
		cfg.CreatedAt = cfg.UpdatedAt
	}

	_, err := r.colRef(tenantID).Doc("default").Set(ctx, cfg)
	return err
}
