package parser

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"

	"github.com/nrisk/backend/internal/domain"
)

// MappingEntry representa uma entrada do mapping_logic.json.
type MappingEntry struct {
	TechnicalFinding string  `json:"technical_finding"`
	TemplateID       *string `json:"template_id"`
	Port             *int   `json:"port"`
	ControlID        string `json:"control_id"`
	ISODomain        string `json:"iso_domain"`
	ISOTitle         string `json:"iso_title"`
	ScoreDeduction   int    `json:"score_deduction"`
	Severity         string `json:"severity"`
	Recommendation   string `json:"recommendation"`
}

// MappingLogic é a estrutura do arquivo mapping_logic.json.
type MappingLogic struct {
	Version   string         `json:"version"`
	Mappings  []MappingEntry `json:"mappings"`
	PortMap   map[string]string `json:"port_map"`
	TemplateIDPrefixMap map[string]string `json:"template_id_prefix_map"`
}

// Parser utiliza mapping_logic.json como única fonte de verdade.
type Parser struct {
	mapping *MappingLogic
}

// NewParser carrega o mapping_logic.json do caminho informado.
func NewParser(path string) (*Parser, error) {
	if path == "" {
		path = "mapping_logic.json"
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("erro ao ler mapping_logic: %w", err)
	}
	var m MappingLogic
	if err := json.Unmarshal(data, &m); err != nil {
		return nil, fmt.Errorf("erro ao parsear mapping_logic: %w", err)
	}
	return &Parser{mapping: &m}, nil
}

// NewParserFromEmbedded tenta carregar de caminhos relativos ao binário.
func NewParserFromEmbedded() (*Parser, error) {
	candidates := []string{
		"mapping_logic.json",
		"config/mapping_logic.json",
		filepath.Join(filepath.Dir(os.Args[0]), "mapping_logic.json"),
	}
	for _, p := range candidates {
		if _, err := os.Stat(p); err == nil {
			return NewParser(p)
		}
	}
	return nil, fmt.Errorf("mapping_logic.json não encontrado em %v", candidates)
}

// FindByTechnicalFinding retorna o mapeamento para o technical_finding.
func (p *Parser) FindByTechnicalFinding(technicalFinding string) (*MappingEntry, bool) {
	for i := range p.mapping.Mappings {
		if p.mapping.Mappings[i].TechnicalFinding == technicalFinding {
			return &p.mapping.Mappings[i], true
		}
	}
	return nil, false
}

// FindByPort retorna o mapeamento para a porta (ex: 3389 -> open_rdp_port).
func (p *Parser) FindByPort(port int) (*MappingEntry, bool) {
	portStr := fmt.Sprintf("%d", port)
	tf, ok := p.mapping.PortMap[portStr]
	if !ok {
		return nil, false
	}
	return p.FindByTechnicalFinding(tf)
}

// FindByTemplateID retorna o mapeamento para o template_id do Nuclei.
func (p *Parser) FindByTemplateID(templateID string) (*MappingEntry, bool) {
	// Match exato por template_id
	for i := range p.mapping.Mappings {
		if p.mapping.Mappings[i].TemplateID != nil && *p.mapping.Mappings[i].TemplateID == templateID {
			return &p.mapping.Mappings[i], true
		}
	}
	// Match por prefixo (ex: ssl- -> C-02)
	for prefix, controlID := range p.mapping.TemplateIDPrefixMap {
		if strings.HasPrefix(strings.ToLower(templateID), prefix) {
			for i := range p.mapping.Mappings {
				if p.mapping.Mappings[i].ControlID == controlID {
					return &p.mapping.Mappings[i], true
				}
			}
		}
	}
	// Fallback: nuclea_generic
	return p.FindByTechnicalFinding("nuclei_generic")
}

// ToAuditFinding converte um achado técnico em AuditFinding.
func (p *Parser) ToAuditFinding(tenantID, scanID, domain, toolName, technicalFinding, title, detail, rawOutput string, port int, templateID string) (*domain.AuditFinding, error) {
	var entry *MappingEntry
	var ok bool

	if port > 0 {
		entry, ok = p.FindByPort(port)
	}
	if !ok && templateID != "" {
		entry, ok = p.FindByTemplateID(templateID)
	}
	if !ok {
		entry, ok = p.FindByTechnicalFinding(technicalFinding)
	}
	if !ok {
		return nil, fmt.Errorf("technical_finding não mapeado: %s", technicalFinding)
	}

	return &domain.AuditFinding{
		TenantID:         tenantID,
		ScanID:           scanID,
		Domain:           domain,
		ToolName:         toolName,
		TechnicalFinding: entry.TechnicalFinding,
		TemplateID:       templateID,
		Port:             port,
		ControlID:        entry.ControlID,
		ISODomain:        entry.ISODomain,
		ISOTitle:         entry.ISOTitle,
		ScoreDeduction:   entry.ScoreDeduction,
		Severity:         entry.Severity,
		Title:            coalesce(title, entry.ISOTitle),
		Detail:           detail,
		Recommendation:   entry.Recommendation,
		RawOutput:        rawOutput,
	}, nil
}

func coalesce(a, b string) string {
	if a != "" {
		return a
	}
	return b
}
