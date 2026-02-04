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
```

## 2. Fontes de Dados

| Fonte | Tipo | Destino |
|-------|------|---------|
| Scans (Nuclei, Nmap, Subfinder) | JSON/TXT | Parser → AuditFinding → Firestore `tenants/{tid}/scans/{sid}/findings/{fid}` |
| Questionários (ISO, NIST, LGPD) | Formulário | Cloud SQL `assessments` (Mês 2) |
| Evidence Vault | PDF/imagens | Cloud Storage (CMEK) |

Detalhes de esquemas e hierarquias em [database.md](./database.md).

## 3. Integrações Externas (Planejadas)

- **Threat Intel:** Shodan, Censys, HaveIBeenPwned (Secret Manager)
- **Assinatura Digital:** Provedor externo para NDA
- **Validação SSL/DNS:** APIs públicas
