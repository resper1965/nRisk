# Avaliação do Produto n.Risk — Compliance Scoring Framework

> Avaliação técnica com nota 5.98/10 e resolução dos gaps funcionais identificados.

---

## Nota Final do Produto: 5.98/10

### O que está bom

- **Visão de produto sólida** — scan passivo + compliance + trust center para seguros cibernéticos resolve uma dor real do mercado brasileiro
- **Arquitetura multi-tenancy bem desenhada (7.5/10)** — isolamento em todas as camadas (JWT, Firestore, RLS), serverless GCP acertado para startup
- **Pipeline de scan funcional** — ferramentas em paralelo (Nuclei, Nmap, Subfinder), parsing, mapeamento ISO, persistência

---

## Gaps Identificados e Resolução

### Gap 1: Banco de Perguntas Insuficiente

| Antes | Depois |
|-------|--------|
| 5 perguntas (Q-01 a Q-05) | **20 perguntas (Q-01 a Q-20)** |
| 4 controles (C-01 a C-04) | **15 controles (C-01 a C-15)** |
| Sem campos de trilha/peso | Campos `risk_weight`, `evidence_type`, `track`, `category` |

**Arquivo:** `backend/assessment_questions.json` (v2.0)

**Controles cobertos (15 domínios ISO 27001):**

| Controle | Domínio ISO | Categoria (Spider Chart) |
|----------|-------------|--------------------------|
| C-01 | A.13.1.1 | Segurança de Rede |
| C-02 | A.10.1.1 | Criptografia |
| C-03 | A.12.6.1 | Gestão de Vulnerabilidades |
| C-04 | A.13.2.1 | Segurança de E-mail |
| C-05 | A.9.4.1 | Controle de Acesso |
| C-06 | A.12.4.1 | Monitoramento |
| C-07 | A.12.3.1 | Backup e Recuperação |
| C-08 | A.5.1.1 | Políticas |
| C-09 | A.7.2.2 | Pessoas |
| C-10 | A.16.1.1 | Resposta a Incidentes |
| C-11 | A.17.1.1 | Continuidade |
| C-12 | A.15.1.1 | Fornecedores |
| C-13 | A.14.2.1 | Desenvolvimento Seguro |
| C-14 | A.18.1.1 | Compliance e Privacidade |
| C-15 | A.11.1.1 | Segurança Física |

**Impacto:** Spider chart agora tem 15 eixos (vs 4 antes). Score de compliance agora é calculável com 20 perguntas cobrindo todos os domínios relevantes para subscrição de seguros.

---

### Gap 2: Mapeamentos ISO Expandidos

| Antes | Depois |
|-------|--------|
| 11 achados técnicos | **31 achados técnicos** |
| 4 controles mapeados | **10 controles com achados técnicos** |
| 2 portas no port_map | **8 portas no port_map** |
| 2 prefixos template_id | **4 prefixos template_id** |

**Arquivo:** `backend/mapping_logic.json` (v2.0)

**Novos achados técnicos adicionados:**

| Achado | Controle | Severidade | Dedução |
|--------|----------|------------|---------|
| open_database_port_mysql (3306) | C-01 | critical | 350 |
| open_database_port_postgres (5432) | C-01 | critical | 350 |
| open_database_port_mongo (27017) | C-01 | critical | 350 |
| self_signed_cert | C-02 | medium | 100 |
| known_cve | C-03 | high | 150 |
| critical_cve | C-03 | critical | 350 |
| missing_dkim | C-04 | medium | 80 |
| open_ssh_port (22) | C-05 | medium | 60 |
| open_telnet_port (23) | C-05 | critical | 300 |
| open_ftp_port (21) | C-05 | high | 150 |
| missing_hsts | C-06 | medium | 50 |
| missing_csp | C-06 | medium | 50 |
| missing_x_frame_options | C-06 | medium | 40 |
| server_version_exposed | C-06 | low | 20 |
| leaked_credentials | C-10 | critical | 400 |
| exposed_admin_panel | C-13 | high | 120 |
| directory_listing | C-13 | medium | 80 |
| information_disclosure | C-13 | medium | 60 |
| missing_privacy_policy | C-14 | medium | 80 |
| cookies_without_consent | C-14 | medium | 60 |

**Calibração dos pesos:** Deduções recalibradas para distribuição mais realista (máximo individual 400pts para critical, escala proporcional por severidade).

---

### Gap 3: Lógica de Inconsistência Implementada

**Arquivo:** `backend/internal/assessment/crosscheck.go`

**Motor de Cross-Check implementado:**

O Cross-Check Engine compara respostas declarativas com achados técnicos do scan por `control_id`.

| Cenário | Declaração | Scan | Resultado |
|---------|------------|------|-----------|
| Disse "sim" + scan limpo | sim | clean | **Validado** |
| Disse "sim" + finding critical/high | sim | finding_found | **Inconsistência Crítica** |
| Disse "sim" + finding medium | sim | finding_found | **Inconsistência** |
| Disse "sim" + finding low | sim | finding_found | **Alerta** |
| Disse "não" + finding | nao | finding_found | **Validado** (admitiu) |
| Disse "N/A" | na | qualquer | **Não Aplicável** |

**Fator de Confiança (F):**

$$F = 1.0 - \sum penalidades$$

| Tipo | Penalidade por ocorrência |
|------|---------------------------|
| Inconsistência Crítica | -0.15 |
| Inconsistência Padrão | -0.10 |
| Alerta | -0.05 |

Mínimo: F = 0.5 (nunca anula completamente o compliance)

---

### Gap 4: Scoring Calibrado

**Arquivo:** `backend/internal/assessment/scoring.go`

**Antes:** Apenas `ComputeDeclarativeScore` (dedutivo) e `ComputeHybridScore` simples.

**Depois:** Motor completo com 3 modos de cálculo:

#### 1. Score Declarativo (compatibilidade)
```
C_declarativo = 1000 - Σ(deduções por "não")
```

#### 2. Score de Compliance Aditivo (novo)
```
C_aditivo = (Σ pontos_ganhos / Σ pontos_possíveis) × 1000
pontos_ganhos = risk_weight × 15 (por resposta "sim")
```

#### 3. Score Completo (ComputeFullScore)
```
C_bruto = ComputeComplianceScoreAdditive(questions, answers)
F = ComputeConfidenceFactor(crossCheckResults)
C_ajustado = C_bruto × F

S_f = (T × 0.6) + (C_ajustado × 0.4)

Se achado crítico: S_f = min(S_f, 500)
```

**ScoreBreakdown retornado:**
- `technical_score`: T (0-1000)
- `compliance_score_raw`: C bruto
- `compliance_score`: C ajustado por F
- `confidence_factor`: F (0.5-1.0)
- `hybrid_score`: S_f final
- `score_category`: A-F
- `has_critical_finding`: bool
- `critical_penalty_applied`: bool
- `inconsistencies`: lista de flags
- `domain_scores`: mapa categoria → % (para spider chart com 15 eixos)

**Categorias de Score:**

| Categoria | Score | Interpretação |
|-----------|-------|---------------|
| A | ≥ 900 | Baixo risco |
| B | ≥ 750 | Risco moderado-baixo |
| C | ≥ 600 | Risco moderado |
| D | ≥ 400 | Risco elevado |
| E | ≥ 250 | Risco alto |
| F | < 250 | Risco crítico |

---

### Gap 5: Testes Unitários

**Arquivo:** `backend/internal/assessment/scoring_test.go`

**34 testes cobrindo:**

| Área | Testes | Status |
|------|--------|--------|
| ComputeDeclarativeScore | 5 testes (all yes, all no, floor, no answers, NA) | ✓ PASS |
| ComputeComplianceScoreAdditive | 5 testes (all yes, all no, partial, no questions, default weight) | ✓ PASS |
| ComputeHybridScore | 6 testes (perfect, zero, tech only, compliance only, clamp neg, clamp over) | ✓ PASS |
| RunCrossCheck | 7 testes (validated, critical, standard, alert, no answer, nao, NA) | ✓ PASS |
| ComputeConfidenceFactor | 4 testes (none, one critical, multiple, minimum 0.5) | ✓ PASS |
| ScoreCategory | 1 teste (table-driven com 12 casos) | ✓ PASS |
| ComputeFullScore (integração) | 6 testes (perfect, critical cap, inconsistency, domain scores, penalized, zero, below cap) | ✓ PASS |

---

## Modelo de Domínio Atualizado

**Arquivo:** `backend/internal/domain/assessment.go`

**Novos tipos:**

- `CrossCheckResult` — resultado da validação cruzada por controle
- `ScoreBreakdown` — detalhamento completo do score híbrido com todos os componentes

**Question expandido com:**
- `RiskWeight` (0-5) — peso aditivo para modelo de compliance
- `EvidenceType` (pdf/image/link/none) — tipo de evidência requerida
- `Track` (bronze/silver/gold) — trilha de maturidade
- `Category` — agrupamento para spider chart

---

## O que ainda falta (Roadmap)

| Item | Prioridade | Esforço Estimado |
|------|-----------|------------------|
| Frontend (dashboards, formulários, spider chart) | P0 | Fase 3 do MVP |
| Endpoint `GET /api/v1/assessment/cross-check` | P1 | 1 sprint |
| Endpoint `GET /api/v1/assessment/score/full` (ScoreBreakdown) | P1 | 1 sprint |
| Trilhas Silver/Gold (evidência obrigatória, validação) | P2 | 2 sprints |
| RBAC (operator vs CISO) | P2 | 1 sprint |
| Análise competitiva documentada (vs SecurityScorecard, BitSight) | P2 | Documento |
| Benchmarking setorial (média por setor) | P3 | Pós-MVP |
| Relatório PDF de subscrição (FR4) | P2 | 2 sprints |
