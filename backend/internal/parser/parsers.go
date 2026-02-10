package parser

import (
	"encoding/json"
	"regexp"
	"strconv"
	"strings"

	"github.com/nrisk/backend/internal/domain"
)

var portRe = regexp.MustCompile(`(\d+)/open/`)

// RawFinding representa um achado bruto antes da tradução GRC.
type RawFinding struct {
	ToolName         string
	TechnicalFinding string
	TemplateID       string
	Port             int
	Title            string
	Detail           string
	RawOutput        string
}

// ParseNmapOutput extrai portas abertas do output grepable do Nmap.
func ParseNmapOutput(output string) []RawFinding {
	var findings []RawFinding
	// Formato: Host: 1.2.3.4 ()	Ports: 3389/open/tcp//ms-wbt-server///
	matches := portRe.FindAllStringSubmatch(output, -1)
	for _, m := range matches {
		if len(m) < 2 {
			continue
		}
		port, _ := strconv.Atoi(m[1])
		tf := "open_port_" + m[1]
		if port == 3389 {
			tf = "open_rdp_port"
		} else if port == 445 {
			tf = "open_smb_port"
		}
		findings = append(findings, RawFinding{
			ToolName:         "nmap",
			TechnicalFinding: tf,
			Port:             port,
			Title:            "Porta " + m[1] + " aberta",
			Detail:           "Porta detectada como aberta",
			RawOutput:        output,
		})
	}
	return findings
}

// NucleiResult representa uma linha JSON do Nuclei (-jsonl).
type NucleiResult struct {
	TemplateID   string `json:"template-id"`
	TemplatePath string `json:"template-path"`
	Info         struct {
		Name     string `json:"name"`
		Severity string `json:"severity"`
	} `json:"info"`
	Host     string `json:"host"`
	Matched  string `json:"matched"`
}

// ParseNucleiOutput extrai achados do output JSON do Nuclei.
func ParseNucleiOutput(output string) []RawFinding {
	var findings []RawFinding
	lines := strings.Split(output, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line == "" {
			continue
		}
		var r NucleiResult
		if err := json.Unmarshal([]byte(line), &r); err != nil {
			continue
		}
		findings = append(findings, RawFinding{
			ToolName:         "nuclei",
			TechnicalFinding: "nuclei_" + r.TemplateID,
			TemplateID:       r.TemplateID,
			Title:            r.Info.Name,
			Detail:           r.Matched,
			RawOutput:        line,
		})
	}
	return findings
}

// ParseSubfinderOutput extrai subdomínios (achados de exposição).
func ParseSubfinderOutput(output string) []RawFinding {
	var findings []RawFinding
	lines := strings.Split(output, "\n")
	for _, line := range lines {
		line = strings.TrimSpace(line)
		if line != "" && !strings.HasPrefix(line, "{") {
			findings = append(findings, RawFinding{
				ToolName:         "subfinder",
				TechnicalFinding: "subdomain_exposure",
				Title:            "Subdomínio descoberto",
				Detail:           line,
				RawOutput:        output,
			})
		}
	}
	return findings
}

// TranslateToAuditFindings converte RawFindings em AuditFindings usando o Parser.
func TranslateToAuditFindings(p *Parser, tenantID, scanID, domainName string, raw []RawFinding) []*domain.AuditFinding {
	var result []*domain.AuditFinding
	for _, r := range raw {
		af, err := p.ToAuditFinding(
			tenantID, scanID, domainName,
			r.ToolName, r.TechnicalFinding,
			r.Title, r.Detail, r.RawOutput,
			r.Port, r.TemplateID,
		)
		if err != nil {
			continue
		}
		result = append(result, af)
	}
	return result
}
