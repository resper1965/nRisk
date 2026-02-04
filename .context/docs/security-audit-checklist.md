---
type: doc
name: security-audit-checklist
description: Checklist de auditoria de segurança n.Risk
category: security
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# Checklist de Auditoria de Segurança — n.Risk

Última revisão: 2026-02-04

## 1. Autenticação e Autorização

| Item | Status | Observação |
|------|--------|------------|
| JWT verificado (Firebase) | ✅ | AuthMiddleware |
| tenant_id obrigatório nas claims | ✅ | Retorna 403 se ausente |
| Rotas protegidas com AuthMiddleware | ✅ | /api/v1/* |
| /health sem auth | ✅ | Apropriado |
| Token não logado | ✅ | requestLogger não inclui Authorization |

## 2. Validação de Entrada

| Item | Status | Observação |
|------|--------|------------|
| domain (POST /scans) | ✅ | IsValidHostname |
| scan_id (GET /scans/:id) | ✅ | IsValidUUID |
| TENANT_ID, SCAN_ID (Scan Job) | ✅ | IsSafePathSegment, IsValidUUID |
| Erro genérico (sem leak) | ✅ | "invalid request body" |

## 3. Headers de Segurança

| Header | Status |
|--------|--------|
| X-Content-Type-Options: nosniff | ✅ |
| X-Frame-Options: DENY | ✅ |
| X-XSS-Protection: 1; mode=block | ✅ |
| Referrer-Policy | ✅ |
| Permissions-Policy | ✅ |
| HSTS | ⏳ Produção (configurar no load balancer) |

## 4. Multi-tenancy

| Item | Status |
|------|--------|
| Path Firestore por tenant | ✅ |
| Regras isTenantMember | ✅ |
| Controller usa tenant do token | ✅ |

## 5. Secrets e Dados Sensíveis

| Item | Status |
|------|--------|
| Sem credenciais hardcoded | ✅ |
| GOOGLE_APPLICATION_CREDENTIALS | Info | Local; Cloud Run usa ADC |
| Secret Manager para Threat Intel | Planejado | Shodan, Censys |

## 6. Infraestrutura

| Item | Status |
|------|--------|
| TLS em trânsito | ✅ Cloud Run |
| Scan Job via IAM | ✅ Service account |
| Firestore rules | ✅ |

## 7. Pendentes

| Item | Prioridade |
|------|------------|
| Rate limiting | Média |
| CORS (frontend) | Média |
| Cloud Armor (WAF) | Planejado |
