package firestore

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/nrisk/backend/internal/domain"

	"cloud.google.com/go/firestore"
)

const trustCenterCollection = "trust_center_profiles"

// TrustCenterRepository persiste TrustCenterProfile no Firestore.
// Path: tenants/{tenantId}/trust_center_profiles/{profileId}
// Indice global: trust_center_slugs/{slug} -> {tenant_id, profile_id} (lookup publico)
type TrustCenterRepository struct {
	client *firestore.Client
}

// NewTrustCenterRepository cria um novo TrustCenterRepository.
func NewTrustCenterRepository(client *firestore.Client) *TrustCenterRepository {
	return &TrustCenterRepository{client: client}
}

func (r *TrustCenterRepository) tenantCol(tenantID string) *firestore.CollectionRef {
	return r.client.Collection("tenants/" + tenantID + "/" + trustCenterCollection)
}

// Create persiste um novo TrustCenterProfile.
func (r *TrustCenterRepository) Create(ctx context.Context, p *domain.TrustCenterProfile) error {
	if p.ID == "" {
		p.ID = uuid.New().String()
	}
	now := time.Now().UTC()
	p.CreatedAt = now
	p.UpdatedAt = now
	if p.Status == "" {
		p.Status = "draft"
	}
	if p.NDAExpiryDays == 0 {
		p.NDAExpiryDays = 90
	}

	// Batch: criar perfil + indice de slug
	batch := r.client.Batch()
	docRef := r.tenantCol(p.TenantID).Doc(p.ID)
	batch.Set(docRef, p)

	slugRef := r.client.Collection("trust_center_slugs").Doc(p.Slug)
	batch.Set(slugRef, map[string]interface{}{
		"tenant_id":  p.TenantID,
		"profile_id": p.ID,
		"created_at": now,
	})

	_, err := batch.Commit(ctx)
	return err
}

// GetByID retorna um perfil pelo ID, restrito ao tenant.
func (r *TrustCenterRepository) GetByID(ctx context.Context, tenantID, profileID string) (*domain.TrustCenterProfile, error) {
	doc, err := r.tenantCol(tenantID).Doc(profileID).Get(ctx)
	if err != nil {
		return nil, fmt.Errorf("trust center profile not found: %w", err)
	}
	var p domain.TrustCenterProfile
	if err := doc.DataTo(&p); err != nil {
		return nil, err
	}
	p.ID = doc.Ref.ID
	return &p, nil
}

// GetByTenant retorna o perfil do Trust Center do tenant (espera-se um por tenant).
func (r *TrustCenterRepository) GetByTenant(ctx context.Context, tenantID string) (*domain.TrustCenterProfile, error) {
	iter := r.tenantCol(tenantID).Limit(1).Documents(ctx)
	defer iter.Stop()

	doc, err := iter.Next()
	if err != nil {
		return nil, nil // nenhum perfil criado
	}
	var p domain.TrustCenterProfile
	if err := doc.DataTo(&p); err != nil {
		return nil, err
	}
	p.ID = doc.Ref.ID
	return &p, nil
}

// GetBySlug retorna o perfil pelo slug (lookup publico via indice global).
func (r *TrustCenterRepository) GetBySlug(ctx context.Context, slug string) (*domain.TrustCenterProfile, error) {
	slugDoc, err := r.client.Collection("trust_center_slugs").Doc(slug).Get(ctx)
	if err != nil {
		return nil, fmt.Errorf("slug not found: %w", err)
	}

	data := slugDoc.Data()
	tenantID, _ := data["tenant_id"].(string)
	profileID, _ := data["profile_id"].(string)
	if tenantID == "" || profileID == "" {
		return nil, fmt.Errorf("invalid slug index data")
	}

	return r.GetByID(ctx, tenantID, profileID)
}

// Update atualiza um TrustCenterProfile existente.
func (r *TrustCenterRepository) Update(ctx context.Context, p *domain.TrustCenterProfile) error {
	p.UpdatedAt = time.Now().UTC()
	docRef := r.tenantCol(p.TenantID).Doc(p.ID)
	_, err := docRef.Set(ctx, p)
	return err
}

// UpdateSlug atualiza o slug (remove antigo, cria novo no indice).
func (r *TrustCenterRepository) UpdateSlug(ctx context.Context, p *domain.TrustCenterProfile, oldSlug string) error {
	p.UpdatedAt = time.Now().UTC()
	batch := r.client.Batch()

	docRef := r.tenantCol(p.TenantID).Doc(p.ID)
	batch.Set(docRef, p)

	if oldSlug != "" && oldSlug != p.Slug {
		batch.Delete(r.client.Collection("trust_center_slugs").Doc(oldSlug))
	}
	batch.Set(r.client.Collection("trust_center_slugs").Doc(p.Slug), map[string]interface{}{
		"tenant_id":  p.TenantID,
		"profile_id": p.ID,
		"created_at": time.Now().UTC(),
	})

	_, err := batch.Commit(ctx)
	return err
}

// SlugExists verifica se um slug ja esta em uso.
func (r *TrustCenterRepository) SlugExists(ctx context.Context, slug string) (bool, error) {
	_, err := r.client.Collection("trust_center_slugs").Doc(slug).Get(ctx)
	if err != nil {
		return false, nil
	}
	return true, nil
}
