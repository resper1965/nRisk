---
type: doc
name: data-flow
description: Fluxo de dados e integrações do n.Risk
category: data-flow
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# Fluxo de Dados e Integrações

## 1. Fluxo de Scan

### Fluxo atual (MVP — sem Pub/Sub)

1. **API:** Cliente chama `POST /api/v1/scans` com `{"domain":"example.com"}`; `validator.IsValidHostname` rejeita formatos inválidos
2. **API:** Cria documento pending em Firestore (`tenants/{tid}/scans/{sid}`)
3. **Disparo manual:** Cloud Run Job é executado com env vars `TENANT_ID`, `SCAN_ID`, `DOMAIN` (via console, gcloud ou scheduler)
4. **Scan Job:** Valida domain com `validator.IsValidHostname`; executa Nuclei, Nmap, Subfinder; persiste findings e score

### Fluxo futuro (com Pub/Sub)

```
1. Cliente (ou API) solicita scan para domínio
   ↓
2. API cria documento pending em Firestore (tenants/{tid}/scans/{sid})
   ↓
3. API publica mensagem em Pub/Sub (topic: scan-requests)
   payload: { tenant_id, scan_id, domain }
   ↓
4. Cloud Run Job é disparado (consumidor Pub/Sub)
   Env vars: TENANT_ID, SCAN_ID, DOMAIN
   ↓
5. Scan Job executa Nuclei, Nmap, Subfinder
   ↓
6. Parser traduz outputs via mapping_logic.json → AuditFinding
   ↓
7. Findings salvos em tenants/{tid}/scans/{sid}/findings/{fid}
   ↓
8. Score calculado (base 1000 - deduções) e atualizado no documento scan
   ↓
9. GET /api/v1/scans/:id: carrega findings do scan, agrega por iso_domain (ComputeDomainScores), retorna domain_scores (score + grade A–F por eixo) — P1.1 rating por eixo
```

## 2. Fluxo de Assessments Híbridos

1. **API:** Cliente chama `GET /api/v1/assessments` para listar progresso; `PATCH /api/v1/assessments/:id` para atualizar respostas
2. **Cloud SQL:** `assessments` (sessão), `assessment_answers` (respostas com answer_status, evidence_storage_path), `assessment_questions` (catálogo vinculado a control_id)
3. **Logic Engine:** `MarkInconsistentAnswers(findings, answers, mapping)` — compara respostas "Sim" com findings do scan; marca como "Inconsistent" quando contraditadas
4. **Storage:** Upload de evidência → GCS path `tenants/{tid}/assessments/{aid}/evidence/{file}`
5. **Multi-tenancy:** `tenant_id` do JWT em todas as queries e paths

## 3. Fontes de Dados

| Fonte | Tipo | Destino |
|-------|------|---------|
| Scans (Nuclei, Nmap, Subfinder) | JSON/TXT | Parser → AuditFinding → Firestore `tenants/{tid}/scans/{sid}/findings/{fid}` |
| Questionários (assessment_questions) | Cloud SQL | Catálogo vinculado a mapping_logic (control_id) |
| Respostas (assessment_answers) | API PATCH | Cloud SQL `assessment_answers`; RLS por tenant |
| Evidence Vault | PDF/imagens | Cloud Storage `tenants/{tid}/assessments/{aid}/evidence/` (CMEK) |

Detalhes de esquemas e hierarquias em [database.md](./database.md).

## 4. Fluxo TPRA (Gestao de Fornecedores)

### 4.1 Cadastro e Scan Automatico

```
1. Gestor GRC chama POST /api/v1/suppliers
   body: { name, domain, criticality, contact_email }
   ↓
2. API cria registro em Cloud SQL (suppliers)
   ↓
3. API dispara scan automatico: POST /api/v1/scans { domain }
   → Firestore (pending) + Pub/Sub (scan-request)
   ↓
4. Scan Job executa → findings → score tecnico (T)
```

### 4.2 Convite e Assessment

```
1. Gestor chama POST /api/v1/suppliers/:id/invite
   body: { track: "silver", invited_email, framework_id: "ISO27001" }
   ↓
2. API cria invitation com token unico (validade 30 dias)
   ↓
3. Fornecedor recebe e-mail com link /invitations/:token/accept
   ↓
4. Fornecedor aceita → cria assessment vinculado ao supplier
   ↓
5. Fornecedor responde questionario (filtrado por trilha)
   → Upload de evidencias para GCS (Evidence Vault)
   ↓
6. CISO submete → Cross-Check Engine compara respostas vs scan
   → Score hibrido calculado e snapshot persistido
```

### 4.3 Portfolio e Monitoramento

```
1. Gestor chama GET /api/v1/portfolio/summary
   → Metricas: cobertura, score medio, distribuicao A-F, inconsistencias
   ↓
2. Cloud Scheduler dispara re-scans conforme criticidade:
   - Critico: semanal
   - Alto: quinzenal
   - Medio: mensal
   - Baixo: trimestral
   ↓
3. Score comparado com snapshot anterior
   → Se deteriorou: alerta ao gestor (webhook/in-app)
```

### 4.4 Trust Center (Publico)

```
1. CISO configura Trust Center (POST /api/v1/trust-center)
   → slug, selos, documentos publicos, NDA config
   ↓
2. Visitante acessa GET /trust/:slug (sem auth)
   → Ve score A-F, selos, docs publicos
   ↓
3. Se NDA necessario: POST /trust/:slug/nda-request
   → CISO aprova/rejeita → acesso a docs sensiveis
```

---

## 5. Integrações Externas (Planejadas)

- **Threat Intel:** Shodan, Censys, HaveIBeenPwned (Secret Manager)
- **Assinatura Digital:** Provedor externo para NDA
- **Validação SSL/DNS:** APIs públicas
