package parser

import (
	"testing"
)

func TestParseNmapOutput(t *testing.T) {
	tests := []struct {
		name   string
		output string
		want   int
		ports  []int
	}{
		{
			name:   "porta RDP",
			output: "Host: 192.168.1.1 ()	Ports: 3389/open/tcp//ms-wbt-server///",
			want:   1,
			ports:  []int{3389},
		},
		{
			name:   "porta SMB",
			output: "Host: 10.0.0.1 ()	Ports: 445/open/tcp//microsoft-ds///",
			want:   1,
			ports:  []int{445},
		},
		{
			name:   "múltiplas portas",
			output: "Host: 1.2.3.4 ()	Ports: 22/open/tcp//ssh///, 80/open/tcp//http///, 443/open/tcp//https///",
			want:   3,
			ports:  []int{22, 80, 443},
		},
		{
			name:   "output vazio",
			output: "",
			want:   0,
			ports:  nil,
		},
		{
			name:   "sem portas abertas",
			output: "Host: 1.2.3.4 ()	Ports: 22/closed/tcp///",
			want:   0,
			ports:  nil,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := ParseNmapOutput(tt.output)
			if len(got) != tt.want {
				t.Errorf("ParseNmapOutput() retornou %d findings, want %d", len(got), tt.want)
				return
			}
			for i, p := range tt.ports {
				if i >= len(got) {
					break
				}
				if got[i].Port != p {
					t.Errorf("finding[%d].Port = %d, want %d", i, got[i].Port, p)
				}
				if got[i].ToolName != "nmap" {
					t.Errorf("finding[%d].ToolName = %s, want nmap", i, got[i].ToolName)
				}
			}
		})
	}
}

func TestParseNucleiOutput(t *testing.T) {
	validJSONL := `{"template-id":"ssl-expired-cert","template-path":"ssl/expired-cert.yaml","info":{"name":"SSL Certificate Expired","severity":"high"},"host":"https://example.com","matched":"https://example.com"}
{"template-id":"cve-2023-1234","info":{"name":"CVE Test","severity":"critical"},"host":"https://test.com","matched":""}`
	got := ParseNucleiOutput(validJSONL)
	if len(got) != 2 {
		t.Fatalf("ParseNucleiOutput() retornou %d findings, want 2", len(got))
	}
	if got[0].TemplateID != "ssl-expired-cert" || got[0].ToolName != "nuclei" {
		t.Errorf("primeiro finding: TemplateID=%s, ToolName=%s", got[0].TemplateID, got[0].ToolName)
	}
	if got[1].TemplateID != "cve-2023-1234" {
		t.Errorf("segundo finding TemplateID = %s", got[1].TemplateID)
	}

	empty := ParseNucleiOutput("")
	if len(empty) != 0 {
		t.Errorf("output vazio retornou %d findings", len(empty))
	}

	invalidLine := ParseNucleiOutput("not valid json\n")
	if len(invalidLine) != 0 {
		t.Errorf("linha inválida retornou %d findings", len(invalidLine))
	}
}

func TestParseSubfinderOutput(t *testing.T) {
	output := "sub1.example.com\nsub2.example.com\n"
	got := ParseSubfinderOutput(output)
	if len(got) != 2 {
		t.Fatalf("ParseSubfinderOutput() retornou %d findings, want 2", len(got))
	}
	if got[0].Detail != "sub1.example.com" || got[0].TechnicalFinding != "subdomain_exposure" {
		t.Errorf("primeiro finding: Detail=%s, TechnicalFinding=%s", got[0].Detail, got[0].TechnicalFinding)
	}

	empty := ParseSubfinderOutput("")
	if len(empty) != 0 {
		t.Errorf("output vazio retornou %d findings", len(empty))
	}

	jsonLine := ParseSubfinderOutput(`{"type":"subdomain"}`)
	if len(jsonLine) != 0 {
		t.Errorf("linha JSON (ignorada) retornou %d findings", len(jsonLine))
	}
}
