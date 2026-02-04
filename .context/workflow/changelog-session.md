# Changelog — Sessão PREVC nrisk-mvp

**Data:** 2026-02-04

## Resumo

Workflow PREVC executado: Plan → Review → Execute → Validate → Confirm.

## Alterações

### Execute
- **pkg/validator:** Novo pacote com `IsValidHostname` (RFC 1123)
- **controller:** Validação de domain em `StartScan` (400 se inválido)
- **scan-job:** Validação de DOMAIN antes de executar ferramentas

### Validate
- **domain_test.go:** 13 casos de teste (válidos, inválidos, injection)
- **testing-strategy:** Validator adicionado à cobertura priorizada

### Documentação
- **data-flow:** Fluxo atual (manual) vs futuro (Pub/Sub)
- **backend/README:** Estrutura atualizada (cmd/scan-job, pkg/validator)
