package main

import (
	"context"
	"os"
	"os/signal"
	"syscall"

	gcpfirestore "cloud.google.com/go/firestore"

	"github.com/nrisk/backend/internal/engine"
	"github.com/nrisk/backend/internal/parser"
	"github.com/nrisk/backend/internal/repository/firestore"
	"github.com/nrisk/backend/pkg/logger"
)

func main() {
	tenantID := os.Getenv("TENANT_ID")
	scanID := os.Getenv("SCAN_ID")
	domain := os.Getenv("DOMAIN")
	projectID := os.Getenv("GCP_PROJECT_ID")
	if projectID == "" {
		projectID = "nrisk-dev"
	}

	if tenantID == "" || scanID == "" || domain == "" {
		logger.Error("variáveis obrigatórias ausentes", map[string]interface{}{
			"required": "TENANT_ID, SCAN_ID, DOMAIN",
		})
		os.Exit(1)
	}

	logger.Info("scan job iniciando", map[string]interface{}{
		"tenant_id": tenantID,
		"scan_id":   scanID,
		"domain":    domain,
	})

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	sigCh := make(chan os.Signal, 1)
	signal.Notify(sigCh, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigCh
		logger.Info("sinal de término recebido", map[string]interface{}{"tenant_id": tenantID})
		cancel()
	}()

	if err := run(ctx, tenantID, scanID, domain, projectID); err != nil {
		logger.Error("scan job falhou", map[string]interface{}{
			"tenant_id": tenantID,
			"scan_id":   scanID,
			"error":     err.Error(),
		})
		os.Exit(1)
	}

	logger.Info("scan job concluído", map[string]interface{}{
		"tenant_id": tenantID,
		"scan_id":   scanID,
	})
}

func run(ctx context.Context, tenantID, scanID, domain, projectID string) error {
	if err := engine.EnsureTools(); err != nil {
		return err
	}

	fsClient, err := gcpfirestore.NewClient(ctx, projectID)
	if err != nil {
		return err
	}
	defer fsClient.Close()

	p, err := parser.NewParserFromEmbedded()
	if err != nil {
		mappingPath := os.Getenv("MAPPING_LOGIC_PATH")
		if mappingPath == "" {
			mappingPath = "mapping_logic.json"
		}
		p, err = parser.NewParser(mappingPath)
		if err != nil {
			return err
		}
	}

	runner := engine.NewRunner(tenantID)
	outputs := runner.RunAll(ctx, domain)

	rawFindings := engine.ParseOutputs(outputs)
	auditFindings := parser.TranslateToAuditFindings(p, tenantID, scanID, domain, rawFindings)

	findingRepo := firestore.NewFindingRepository(fsClient)
	if err := findingRepo.SaveBatch(ctx, tenantID, scanID, auditFindings); err != nil {
		logger.Error("erro ao salvar findings", map[string]interface{}{
			"tenant_id": tenantID,
			"error":     err.Error(),
		})
		return err
	}

	totalDeduction := 0
	for _, f := range auditFindings {
		totalDeduction += f.ScoreDeduction
		logger.Info("finding persistido", map[string]interface{}{
			"tenant_id":    tenantID,
			"tool_name":    f.ToolName,
			"control_id":   f.ControlID,
			"deduction":    f.ScoreDeduction,
		})
	}

	scoreRepo := firestore.NewScoreRepository(fsClient)
	status := "completed"
	for _, out := range outputs {
		if out.Error != nil {
			status = "completed_with_errors"
			break
		}
	}
	if err := scoreRepo.UpdateScanScore(ctx, tenantID, scanID, totalDeduction, status); err != nil {
		logger.Warn("erro ao atualizar score (scan pode não existir)", map[string]interface{}{
			"tenant_id": tenantID,
			"error":     err.Error(),
		})
	}

	return nil
}
