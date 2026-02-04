---
type: doc
name: security
description: Políticas de segurança, autenticação e conformidade
category: security
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# Segurança e Conformidade

## Validação de Entrada

| Input | Validação | Risco mitigado |
|-------|-----------|----------------|
| domain (POST /scans) | `IsValidHostname` (RFC 1123) | Command injection em nmap/nuclei |
| scan_id (GET /scans/:id) | `IsValidUUID` | Path traversal em Firestore |
| TENANT_ID, SCAN_ID (Scan Job) | `IsSafePathSegment`, `IsValidUUID` | Path traversal em Firestore |
| JWT | Firebase VerifyIDToken | Token inválido/expirado |

## Security Headers

- **X-Content-Type-Options:** nosniff
- **X-Frame-Options:** DENY
- **X-XSS-Protection:** 1; mode=block
- **Referrer-Policy:** strict-origin-when-cross-origin
- **Permissions-Policy:** geolocation=(), microphone=(), camera=()

Checklist completo: [security-audit-checklist.md](./security-audit-checklist.md)

## Autenticação

- **Identity Platform (Firebase Auth):** MFA obrigatório
- **JWT:** Custom claim `tenant_id` para isolamento
- **Middleware:** Validação de token em rotas protegidas

## Criptografia

- **Trânsito:** TLS 1.3
- **Repouso:** AES-256; CMEK no Cloud Storage (Evidence Vault)

## Segregação Multi-tenant

- Path Firestore: `tenants/{tenantId}/...`
- Queries filtradas por `tenant_id`
- Regras Firestore: `isTenantMember(tenantId)`; validação de score e domain em writes
- Cloud SQL: RLS em `assessments` via `set_tenant_context(tenant_id)` — ver [database.md](./database.md)

## Secrets e API Keys

- **Secret Manager:** Chaves de Threat Intel (Shodan, Censys)
- Nunca em código ou variáveis em texto plano

## WAF

- **Cloud Armor:** Proteção do Dashboard (SQLi, XSS, rate limiting)

## Recomendações Pendentes

| Item | Prioridade | Descrição |
|------|------------|-----------|
| Rate limiting | Média | Proteger POST /scans contra DoS |
| CORS | Média | Configurar ao integrar frontend — ver [frontend.md](./frontend.md) |
| HSTS | Baixa | Header Strict-Transport-Security em produção |
| Cloud Armor | Planejado | WAF para Dashboard |

## LGPD / DPCF

- **PII:** Base legal, finalidade, retenção, direito ao esquecimento
- **Data Inventory:** Públicos (scans), Privados (questionários, evidências), PII (nomes, e-mails)
- **Evidence Vault:** Criptografia, retenção configurável
