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
- Regras Firestore: `isTenantMember(tenantId)`

## Secrets e API Keys

- **Secret Manager:** Chaves de Threat Intel (Shodan, Censys)
- Nunca em código ou variáveis em texto plano

## WAF

- **Cloud Armor:** Proteção do Dashboard (SQLi, XSS, rate limiting)

## LGPD / DPCF

- **PII:** Base legal, finalidade, retenção, direito ao esquecimento
- **Data Inventory:** Públicos (scans), Privados (questionários, evidências), PII (nomes, e-mails)
- **Evidence Vault:** Criptografia, retenção configurável
