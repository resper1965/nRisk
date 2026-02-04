package parser

import (
	"os"
	"path/filepath"
	"testing"
)

func TestToAuditFinding_WithMappingFile(t *testing.T) {
	path := "mapping_logic.json"
	if _, err := os.Stat(path); err != nil {
		path = filepath.Join("..", "..", "mapping_logic.json")
	}
	if _, err := os.Stat(path); err != nil {
		t.Skip("mapping_logic.json não encontrado, pulando testes de mapeamento")
		return
	}
	p, err := NewParser(path)
	if err != nil {
		t.Fatalf("NewParser: %v", err)
	}

	tests := []struct {
		name             string
		port             int
		templateID       string
		technicalFinding string
		wantControl      string
		wantDeduction    int
	}{
		{
			name:             "porta 3389 -> C-01",
			port:             3389,
			templateID:       "",
			technicalFinding: "open_rdp_port",
			wantControl:      "C-01",
			wantDeduction:    500,
		},
		{
			name:             "porta 445 -> C-01",
			port:             445,
			templateID:       "",
			technicalFinding: "open_smb_port",
			wantControl:      "C-01",
			wantDeduction:    500,
		},
		{
			name:             "subdomain_exposure -> C-03",
			port:             0,
			templateID:       "",
			technicalFinding: "subdomain_exposure",
			wantControl:      "C-03",
			wantDeduction:    20,
		},
		{
			name:             "missing_dmarc -> C-04",
			port:             0,
			templateID:       "",
			technicalFinding: "missing_dmarc",
			wantControl:      "C-04",
			wantDeduction:    200,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			af, err := p.ToAuditFinding("tenant-1", "scan-1", "example.com", "nmap",
				tt.technicalFinding, "", "detail", "raw", tt.port, tt.templateID)
			if err != nil {
				t.Fatalf("ToAuditFinding: %v", err)
			}
			if af.ControlID != tt.wantControl {
				t.Errorf("ControlID = %s, want %s", af.ControlID, tt.wantControl)
			}
			if af.ScoreDeduction != tt.wantDeduction {
				t.Errorf("ScoreDeduction = %d, want %d", af.ScoreDeduction, tt.wantDeduction)
			}
		})
	}
}

func TestToAuditFinding_NaoMapeado(t *testing.T) {
	path := "mapping_logic.json"
	if _, err := os.Stat(path); err != nil {
		path = filepath.Join("..", "..", "mapping_logic.json")
	}
	if _, err := os.Stat(path); err != nil {
		t.Skip("mapping_logic.json não encontrado")
		return
	}
	p, _ := NewParser(path)
	_, err := p.ToAuditFinding("t", "s", "d.com", "nmap", "finding_inexistente", "", "", "", 0, "")
	if err == nil {
		t.Error("ToAuditFinding deveria retornar erro para technical_finding não mapeado")
	}
}

func TestTranslateToAuditFindings(t *testing.T) {
	path := "mapping_logic.json"
	if _, err := os.Stat(path); err != nil {
		path = filepath.Join("..", "..", "mapping_logic.json")
	}
	if _, err := os.Stat(path); err != nil {
		t.Skip("mapping_logic.json não encontrado")
		return
	}
	p, _ := NewParser(path)
	raw := []RawFinding{
		{ToolName: "nmap", TechnicalFinding: "open_rdp_port", Port: 3389},
		{ToolName: "nuclei", TechnicalFinding: "nuclei_xyz", TemplateID: "ssl-expired-cert"},
		{ToolName: "subfinder", TechnicalFinding: "subdomain_exposure", Detail: "x.example.com"},
	}
	got := TranslateToAuditFindings(p, "tenant", "scan", "example.com", raw)
	if len(got) < 2 {
		t.Errorf("TranslateToAuditFindings retornou %d, esperava pelo menos 2", len(got))
	}
}
