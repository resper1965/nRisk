package engine

import (
	"bytes"
	"context"
	"fmt"
	"os/exec"
	"strings"
	"sync"
	"time"

	"github.com/nrisk/backend/internal/parser"
	"github.com/nrisk/backend/pkg/logger"
	"golang.org/x/sync/errgroup"
)

const defaultTimeout = 4 * time.Minute

// ToolConfig define um comando de ferramenta.
type ToolConfig struct {
	Name    string
	Command string
	Args    []string
	Timeout time.Duration
}

// Runner executa ferramentas de scan de forma isolada.
type Runner struct {
	tenantID string
	tools    []ToolConfig
}

// NewRunner cria um Runner para o tenant (apenas ferramentas disponíveis no PATH).
func NewRunner(tenantID string) *Runner {
	all := []ToolConfig{
			{Name: "nmap", Command: "nmap", Args: []string{"-sV", "-Pn", "-p", "22,80,443,3389,445", "--open", "-oG", "-", "{{domain}}"}, Timeout: 2 * time.Minute},
			{Name: "nuclei", Command: "nuclei", Args: []string{"-u", "https://{{domain}}", "-jsonl", "-silent"}, Timeout: 3 * time.Minute},
			{Name: "subfinder", Command: "subfinder", Args: []string{"-d", "{{domain}}", "-silent"}, Timeout: 1 * time.Minute},
	}
	var tools []ToolConfig
	for _, t := range all {
		if _, err := exec.LookPath(t.Command); err == nil {
			tools = append(tools, t)
		}
	}
	return &Runner{tenantID: tenantID, tools: tools}
}

// Run executa um comando e retorna stdout, stderr e erro.
func (r *Runner) Run(ctx context.Context, tool ToolConfig, domain string) (stdout, stderr string, err error) {
	timeout := tool.Timeout
	if timeout == 0 {
		timeout = defaultTimeout
	}
	runCtx, cancel := context.WithTimeout(ctx, timeout)
	defer cancel()

	args := make([]string, len(tool.Args))
	for i, a := range tool.Args {
		args[i] = strings.ReplaceAll(a, "{{domain}}", domain)
	}

	cmd := exec.CommandContext(runCtx, tool.Command, args...)
	var outBuf, errBuf bytes.Buffer
	cmd.Stdout = &outBuf
	cmd.Stderr = &errBuf

	logger.Info("executing tool", map[string]interface{}{
		"tenant_id": r.tenantID,
		"tool_name": tool.Name,
		"domain":    domain,
	})

	err = cmd.Run()
	stdout = outBuf.String()
	stderr = errBuf.String()

	if err != nil {
		logger.Warn("tool execution failed", map[string]interface{}{
			"tenant_id": r.tenantID,
			"tool_name": tool.Name,
			"error":     err.Error(),
			"stderr":    stderr,
		})
		return stdout, stderr, fmt.Errorf("%s: %w", tool.Name, err)
	}
	return stdout, stderr, nil
}

// RunAll executa todas as ferramentas em paralelo e retorna outputs por tool.
func (r *Runner) RunAll(ctx context.Context, domain string) map[string]ToolOutput {
	outputs := make(map[string]ToolOutput)
	var mu sync.Mutex
	g, gctx := errgroup.WithContext(ctx)
	for _, tool := range r.tools {
		tool := tool // capture loop variable
		g.Go(func() error {
			stdout, stderr, err := r.Run(gctx, tool, domain)
			mu.Lock()
			outputs[tool.Name] = ToolOutput{Stdout: stdout, Stderr: stderr, Error: err}
			mu.Unlock()
			return nil
		})
	}
	_ = g.Wait()
	return outputs
}

// ToolOutput contém o resultado da execução.
type ToolOutput struct {
	Stdout string
	Stderr string
	Error  error
}

// ParseOutputs converte outputs em RawFindings usando os parsers.
func ParseOutputs(outputs map[string]ToolOutput) []parser.RawFinding {
	var all []parser.RawFinding
	for tool, out := range outputs {
		if out.Error != nil && out.Stdout == "" {
			continue
		}
		switch tool {
		case "nmap":
			all = append(all, parser.ParseNmapOutput(out.Stdout)...)
		case "nuclei":
			all = append(all, parser.ParseNucleiOutput(out.Stdout)...)
		case "subfinder":
			all = append(all, parser.ParseSubfinderOutput(out.Stdout)...)
		}
	}
	return all
}

// GetToolsAvailable retorna ferramentas disponíveis (presença no PATH).
func GetToolsAvailable() []string {
	var available []string
	tools := []string{"nmap", "nuclei", "subfinder"}
	for _, t := range tools {
		if _, err := exec.LookPath(t); err == nil {
			available = append(available, t)
		}
	}
	return available
}

// EnsureTools verifica se as ferramentas estão instaladas.
func EnsureTools() error {
	available := GetToolsAvailable()
	if len(available) < 1 {
		return fmt.Errorf("nenhuma ferramenta de scan encontrada no PATH; espere: nmap, nuclei, subfinder")
	}
	return nil
}
