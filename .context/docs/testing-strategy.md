---
type: doc
name: testing-strategy
description: Estratégia de testes e qualidade
category: testing
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# Estratégia de Testes

## Cobertura Priorizada

| Área | Prioridade | Tipo |
|------|------------|------|
| Validator (domain, uuid, path) | Alta | Unit |
| Parser (mapping_logic) | Alta | Unit |
| Motor de scoring | Alta | Unit + integração |
| **Logic Engine (MarkInconsistentAnswers)** | **Alta** | **Unit** — findings vs answers, status Inconsistent |
| **Assessment API (GET/PATCH)** | **Alta** | Integração — tenant isolation, Cross-Check |
| API (endpoints) | Média | Integração |
| Scan Engine (orquestração) | Média | Integração (mock de ferramentas) |

## Casos Críticos

- **Algoritmo de score:** Fórmula $S_f$, penalidade crítica, deduções por severidade
- **Lógica de inconsistência (Cross-Check):** Resposta "Sim" vs achado de scan (ex: MFA declarado vs porta RDP aberta); `MarkInconsistentAnswers` deve marcar status `Inconsistent`
- **Parser:** Achados técnicos mapeados corretamente para controles ISO

## Ferramentas

- **Go:** `testing` padrão
- **Coverage:** `go test -cover ./...`
- **Executar:** `cd backend && go test ./... -v`

## Arquivos de Teste

| Pacote | Arquivo | Cobertura |
|--------|---------|-----------|
| pkg/validator | domain_test.go | IsValidHostname, IsValidUUID, IsSafePathSegment |
| internal/parser | parsers_test.go | ParseNmapOutput, ParseNucleiOutput, ParseSubfinderOutput |
| internal/parser | mapping_test.go | ToAuditFinding, TranslateToAuditFindings (requer mapping_logic.json) |
| internal/repository/firestore | score_repository_test.go | scoreToCategory (A–F) |
| internal/assessment | crosscheck_test.go | MarkInconsistentAnswers (findings + answers → Inconsistent) |

## Performance

Otimizações e benchmarks: [performance.md](./performance.md)
