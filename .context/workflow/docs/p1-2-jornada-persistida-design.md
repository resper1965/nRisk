# P1.2 Jornada persistida — design

**Workflow:** solve-p1-2-jornada  
**Plano:** solve-p1-gaps (item 2)

## Objetivo

Persistir cross-check + ScoreBreakdown por assessment/scan; API para demandantes consultarem histórico (por tenant/domínio/data).

## Implementado

1. **Modelo:** `domain.ScoreSnapshot` (ID, TenantID, ScanID, Domain, ComputedAt, ScoreBreakdown).
2. **Repositório:** `ScoreSnapshotRepository` — Firestore `tenants/{tid}/scans/{scanId}/score_snapshots/{snapshotId}`. `Save`, `ListByScan(tenantID, scanID, limit)` ordenado por `computed_at` desc.
3. **API:**
   - **GET /api/v1/scans/:id/score-history?limit=50** — retorna lista de snapshots do scan (jornada no tempo).
   - **GET /api/v1/assessment/score/full?scan_id=uuid** — calcula `ComputeFullScore` (cross-check, F, penalidade, domain_scores), persiste snapshot, retorna breakdown.
4. **Documentação:** api.md atualizado com os dois endpoints.

## Uso

- Demandante (cliente, seguradora, corretora) chama **GET /scans/:id/score-history** para ver evolução do score ao longo do tempo.
- Para gerar um novo ponto na jornada: chamar **GET /assessment/score/full?scan_id=...** (ex.: após atualizar respostas ou após novo scan).

## Firestore

- Índice: se necessário, criar índice composto em `score_snapshots` com `computed_at` (Desc). O Firestore pode solicitar o link de criação na primeira query.
