# AGENTS.md

Instruções para agentes e desenvolvedores do n.Risk.

## Base Contextual

- **Documento mestre:** [.context/docs/contexto-nrisk.md](.context/docs/contexto-nrisk.md) — consolida planos e documentação
- **Documentação:** [.context/docs/README.md](.context/docs/README.md)
- **Planos:** [.context/plans/README.md](.context/plans/README.md)
- **Agentes:** [.context/agents/README.md](.context/agents/README.md)

## Regras para Decisões

1. **Arquitetura:** Consultar `nrisk-arquitetura-gcp.md` e `nrisk-mvp.md`
2. **Scoring e GRC:** Consultar `nrisk-scoring-metodologia.md` e `nrisk-matriz-rastreabilidade-grc.md`
3. **Scan Engine:** `mapping_logic.json` é fonte de verdade para mapeamento ISO 27001
4. **Privacidade/LGPD:** Consultar `nrisk-dpcf-privacy-compliance.md`

## Stack

- **Backend:** Go 1.22+, Gin
- **Infra:** GCP (Cloud Run, Firestore, Pub/Sub)
- **Auth:** Identity Platform, JWT com `tenant_id`

## Desenvolvimento

- **API:** `go run ./cmd/api` (em `backend/`)
- **Scan Job:** `TENANT_ID=x SCAN_ID=y DOMAIN=z go run ./cmd/scan-job`
- **Commits:** Conventional Commits (`feat(scope): descrição`)

## AI Context (MCP)

- Use `buildSemantic` antes de gerar código
- Use `fillSingle` para manter docs em `.context/` atualizados
