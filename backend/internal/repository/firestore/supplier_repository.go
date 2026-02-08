package firestore

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"github.com/nrisk/backend/internal/domain"

	"cloud.google.com/go/firestore"
	"google.golang.org/api/iterator"
)

const suppliersCollection = "suppliers"

// SupplierRepository implementa persistencia de Supplier no Firestore.
// Isolamento multi-tenant via path: /tenants/{tenant_id}/suppliers/{supplier_id}
type SupplierRepository struct {
	client *firestore.Client
}

// NewSupplierRepository cria um novo SupplierRepository.
func NewSupplierRepository(client *firestore.Client) *SupplierRepository {
	return &SupplierRepository{client: client}
}

func (r *SupplierRepository) tenantCol(tenantID string) *firestore.CollectionRef {
	return r.client.Collection("tenants/" + tenantID + "/" + suppliersCollection)
}

// Create persiste um novo Supplier no Firestore.
func (r *SupplierRepository) Create(ctx context.Context, s *domain.Supplier) error {
	if s.ID == "" {
		s.ID = uuid.New().String()
	}
	now := time.Now().UTC()
	s.CreatedAt = now
	s.UpdatedAt = now

	docRef := r.tenantCol(s.TenantID).Doc(s.ID)
	_, err := docRef.Set(ctx, s)
	return err
}

// GetByID retorna um Supplier pelo ID, restrito ao tenant.
func (r *SupplierRepository) GetByID(ctx context.Context, tenantID, supplierID string) (*domain.Supplier, error) {
	doc, err := r.tenantCol(tenantID).Doc(supplierID).Get(ctx)
	if err != nil {
		return nil, fmt.Errorf("supplier not found: %w", err)
	}

	var s domain.Supplier
	if err := doc.DataTo(&s); err != nil {
		return nil, err
	}
	s.ID = doc.Ref.ID
	return &s, nil
}

// List retorna todos os suppliers de um tenant, com filtros opcionais.
func (r *SupplierRepository) List(ctx context.Context, tenantID string, criticality, status string) ([]domain.Supplier, error) {
	q := r.tenantCol(tenantID).Query

	if criticality != "" {
		q = q.Where("criticality", "==", criticality)
	}
	if status != "" {
		q = q.Where("status", "==", status)
	}
	q = q.OrderBy("created_at", firestore.Desc)

	iter := q.Documents(ctx)
	defer iter.Stop()

	var suppliers []domain.Supplier
	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			return nil, err
		}
		var s domain.Supplier
		if err := doc.DataTo(&s); err != nil {
			continue
		}
		s.ID = doc.Ref.ID
		suppliers = append(suppliers, s)
	}

	if suppliers == nil {
		suppliers = []domain.Supplier{}
	}
	return suppliers, nil
}

// Update atualiza campos de um Supplier existente.
func (r *SupplierRepository) Update(ctx context.Context, tenantID string, s *domain.Supplier) error {
	s.UpdatedAt = time.Now().UTC()
	docRef := r.tenantCol(tenantID).Doc(s.ID)
	_, err := docRef.Set(ctx, s)
	return err
}

// Delete remove um Supplier (soft delete nao implementado — usar Update com status=inactive).
func (r *SupplierRepository) Delete(ctx context.Context, tenantID, supplierID string) error {
	_, err := r.tenantCol(tenantID).Doc(supplierID).Delete(ctx)
	return err
}

// CountByTenant retorna o total de suppliers de um tenant.
func (r *SupplierRepository) CountByTenant(ctx context.Context, tenantID string) (int, error) {
	iter := r.tenantCol(tenantID).Documents(ctx)
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
