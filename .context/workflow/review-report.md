# Review Phase — n.Risk MVP

**Data:** 2026-02-04  
**Plano:** nrisk-mvp  
**Agentes:** architect-specialist, code-reviewer, security-auditor

---

## 1. Architect Review

### Alinhamento com arquitetura

| Componente | Status | Observação |
|------------|--------|------------|
| API Cloud Run (Go) | ✅ | cmd/api, Gin, Firestore |
| Scan Engine (Cloud Run Jobs) | ✅ | cmd/scan-job, env vars |
| Firestore multi-tenant | ✅ | Path tenants/{tid}/scans/{sid}/findings/{fid} |
| JWT + tenant_id | ✅ | Middleware AuthMiddleware |
| mapping_logic.json | ✅ | Fonte de verdade ISO 27001 |

### Lacunas em relação ao plano

| Lacuna | Impacto | Prioridade |
|--------|---------|------------|
| **Pub/Sub** | API cria scan mas não publica em scan-requests; Scan Job é executado manualmente ou via trigger externo | Média |
| **Cloud SQL** | Apenas Firestore; GRC/controles em migrations mas não integrados | Baixa (Mês 2) |
| **Frontend** | Não implementado | Mês 2–3 |

---

## 2. Code Review

### Pontos positivos

- Estrutura limpa: cmd/, internal/, pkg/
- Logs estruturados JSON (Cloud Logging)
- Graceful shutdown (API e Scan Job)
- Uso correto de gin.Context para tenant_id

### Pontos de atenção

| Arquivo | Issue | Sugestão |
|---------|-------|----------|
| scan_controller.go:61 | TODO Pub/Sub não implementado | Documentar no plano |
| auth.go | Import `os` pode ser reordenado (goimports) | Menor |
| scan-job | EnsureTools falha se nenhuma ferramenta; RunAll executa mesmo assim | Verificar cenário sem ferramentas |

### Padrões

- Conventional structure
- Error handling consistente
- Middleware aplicado corretamente em /api/v1

---

## 3. Security Audit

### Autenticação e autorização

| Item | Status |
|------|--------|
| JWT verificado (Firebase) | ✅ |
| tenant_id obrigatório nas claims | ✅ |
| Rotas protegidas com AuthMiddleware | ✅ |
| /health sem auth (apropriado) | ✅ |

### Multi-tenancy

| Item | Status |
|------|--------|
| Path Firestore por tenant | ✅ |
| Regras isTenantMember(tenantId) | ✅ |
| Scan Job recebe TENANT_ID via env | ✅ |
| Controller usa tenant do token | ✅ |

### Riscos identificados

| Risco | Severidade | Mitigação |
|-------|------------|-----------|
| Scan Job sem auth direta | Baixa | Executado por Cloud Run com service account; IAM controla acesso |
| domain não sanitizado no scan | Média | Validar formato (hostname) antes de executar ferramentas |
| GOOGLE_APPLICATION_CREDENTIALS em texto | Info | Padrão para local; Cloud Run usa ADC |

### Conformidade

- Firestore rules: score 0–1000, domain não vazio
- Sem credenciais hardcoded

---

## 4. Decisões

| ID | Decisão | Alternativa |
|----|---------|-------------|
| D1 | Manter Pub/Sub como TODO — escopo Mês 1 permite execução manual do Scan Job | Implementar Pub/Sub agora |
| D2 | Validar domain (hostname) no StartScan e no scan-job antes de execução | Deixar para fase posterior |

---

## 5. Resultado

**Aprovado para fase Execute**, com as seguintes ações recomendadas (não bloqueantes):

1. Adicionar validação de domain (regex hostname) no controller e no scan-job
2. Documentar fluxo atual (scan manual/via Cloud Run Jobs) até integração Pub/Sub
