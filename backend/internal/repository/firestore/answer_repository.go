package firestore

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/nrisk/backend/internal/domain"

	"cloud.google.com/go/firestore"
)

const answersCollection = "answers"

// AnswerRepository persiste Answer no Firestore.
// Path: tenants/{tenantId}/answers/{answerId}
type AnswerRepository struct {
	client *firestore.Client
}

// NewAnswerRepository cria um novo AnswerRepository.
func NewAnswerRepository(client *firestore.Client) *AnswerRepository {
	return &AnswerRepository{client: client}
}

// Save persiste ou atualiza uma Answer.
func (r *AnswerRepository) Save(ctx context.Context, tenantID string, a *domain.Answer) error {
	a.TenantID = tenantID
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	if a.RespondedAt.IsZero() {
		a.RespondedAt = time.Now().UTC()
	}
	colRef := r.client.Collection("tenants").Doc(tenantID).Collection(answersCollection)
	_, err := colRef.Doc(a.QuestionID).Set(ctx, a)
	return err
}

// GetByQuestionID retorna a Answer de uma pergunta para o tenant.
func (r *AnswerRepository) GetByQuestionID(ctx context.Context, tenantID, questionID string) (*domain.Answer, error) {
	docRef := r.client.Collection("tenants").Doc(tenantID).Collection(answersCollection).Doc(questionID)
	doc, err := docRef.Get(ctx)
	if err != nil {
		return nil, err
	}
	var a domain.Answer
	if err := doc.DataTo(&a); err != nil {
		return nil, err
	}
	a.ID = doc.Ref.ID
	return &a, nil
}

// ListByTenant retorna todas as respostas do tenant.
func (r *AnswerRepository) ListByTenant(ctx context.Context, tenantID string) ([]*domain.Answer, error) {
	iter := r.client.Collection("tenants").Doc(tenantID).Collection(answersCollection).Documents(ctx)
	defer iter.Stop()
	var out []*domain.Answer
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}
		var a domain.Answer
		if err := doc.DataTo(&a); err != nil {
			continue
		}
		a.ID = doc.Ref.ID
		out = append(out, &a)
	}
	return out, nil
}

// SaveForSupplier persiste uma resposta no escopo de um fornecedor.
// Path: tenants/{tenantId}/suppliers/{supplierId}/answers/{questionId}
func (r *AnswerRepository) SaveForSupplier(ctx context.Context, tenantID, supplierID string, a *domain.Answer) error {
	a.TenantID = tenantID
	if a.ID == "" {
		a.ID = uuid.New().String()
	}
	if a.RespondedAt.IsZero() {
		a.RespondedAt = time.Now().UTC()
	}
	colRef := r.client.Collection("tenants").Doc(tenantID).Collection(suppliersCollection).Doc(supplierID).Collection(answersCollection)
	_, err := colRef.Doc(a.QuestionID).Set(ctx, a)
	return err
}

// ListBySupplier retorna todas as respostas do assessment de um fornecedor.
// Path: tenants/{tenantId}/suppliers/{supplierId}/answers/*
func (r *AnswerRepository) ListBySupplier(ctx context.Context, tenantID, supplierID string) ([]*domain.Answer, error) {
	colRef := r.client.Collection("tenants").Doc(tenantID).Collection(suppliersCollection).Doc(supplierID).Collection(answersCollection)
	iter := colRef.Documents(ctx)
	defer iter.Stop()
	var out []*domain.Answer
	for {
		doc, err := iter.Next()
		if err != nil {
			break
		}
		var a domain.Answer
		if err := doc.DataTo(&a); err != nil {
			continue
		}
		a.ID = doc.Ref.ID
		out = append(out, &a)
	}
	return out, nil
}
