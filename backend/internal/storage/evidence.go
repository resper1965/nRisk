package storage

import (
	"context"
	"fmt"
	"io"
	"path"

	"cloud.google.com/go/storage"
)

// EvidenceStore faz upload de evidências para o Cloud Storage.
type EvidenceStore struct {
	client *storage.Client
	bucket string
}

// NewEvidenceStore cria um EvidenceStore.
func NewEvidenceStore(client *storage.Client, bucket string) *EvidenceStore {
	return &EvidenceStore{client: client, bucket: bucket}
}

// UploadEvidence envia o arquivo para tenants/{tenantID}/evidence/{objectName} e retorna a URL gs://.
func (e *EvidenceStore) UploadEvidence(ctx context.Context, tenantID, questionID, filename string, r io.Reader) (string, error) {
	if e.bucket == "" {
		return "", fmt.Errorf("bucket não configurado")
	}
	objectName := path.Join("tenants", tenantID, "evidence", questionID+"_"+filename)
	w := e.client.Bucket(e.bucket).Object(objectName).NewWriter(ctx)
	defer w.Close()
	if _, err := io.Copy(w, r); err != nil {
		return "", err
	}
	return "gs://" + e.bucket + "/" + objectName, nil
}
