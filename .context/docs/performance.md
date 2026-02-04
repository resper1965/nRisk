---
type: doc
name: performance
description: Otimizações e considerações de performance n.Risk
category: performance
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# Performance — n.Risk

## Otimizações Implementadas

| Área | Melhoria | Impacto |
|------|----------|---------|
| **Auth (API)** | Firebase App e Auth client singleton (`sync.Once`) | Evita init por request; reduz latência em rotas protegidas |
| **Scan Job** | Ferramentas (nmap, nuclei, subfinder) em paralelo (`errgroup`) | Scan total ≈ tempo da ferramenta mais lenta, não soma sequencial |
| **Firestore** | `SaveBatch` com `WriteBatch` (até 500 ops) | Reduz round-trips; escrita em lote |
| **Parser** | Regex Nmap compilado uma vez (package-level) | Evita recompilação em cada chamada |

## Considerações

### API

- **Cold start:** Cloud Run escala a zero; primeira requisição pode ter latência maior
- **Firebase VerifyIDToken:** Chamada de rede ao backend do Firebase; singleton reduz overhead de init
- **Timeouts:** ReadTimeout 15s, WriteTimeout 15s; adequado para APIs REST

### Scan Job

- **Paralelização:** nmap, nuclei e subfinder rodam simultaneamente; cada um tem timeout próprio (2–3 min)
- **WriteBatch:** Firestore limita 500 operações por batch; `SaveBatch` faz chunking automático
- **Ferramentas bloqueantes:** Nuclei e Nmap são I/O bound; paralelismo não sobrecarrega CPU

### Parser

- **Lookup O(n):** `FindByTechnicalFinding` e `FindByTemplateID` fazem scan linear; OK para dezenas de mapeamentos
- **Escala futura:** Se `mapping_logic` crescer muito, considerar mapas indexados (O(1))

## Benchmarks (Sugeridos)

```bash
# Testes de carga na API (ex: hey, k6)
hey -n 1000 -c 10 -H "Authorization: Bearer $TOKEN" https://api.../api/v1/scans
```

## Pontos de Atenção

- **Logs em loop:** Scan Job loga por finding; muitos findings podem gerar muitas linhas
- **Subfinder:** Pode retornar dezenas de subdomínios; cada um vira finding; WriteBatch mitiga
