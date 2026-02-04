---
type: doc
name: glossary
description: Terminologia, entidades e regras de negócio do n.Risk
category: glossary
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# Glossário e Conceitos de Domínio

## Entidades Principais

| Termo | Definição |
|-------|-----------|
| **Tenant** | Organização isolada (seguradora, empresa ou fornecedor). Identificado por `tenant_id`. |
| **Scan** | Execução de varredura em um domínio. Status: pending, running, completed, completed_with_errors. |
| **AuditFinding** | Achado técnico traduzido para controle ISO 27001 (control_id, score_deduction, recommendation). |
| **Trust Center** | Página pública com selos, documentos e resumo de postura de segurança. |
| **Evidence Vault** | Armazenamento de documentos de evidência (PDFs, imagens) vinculados a respostas de questionário. |

## Termos Técnicos

| Termo | Definição |
|-------|-----------|
| **mapping_logic.json** | Fonte única de verdade para mapear achados (port, template_id, technical_finding) em controles ISO 27001. |
| **RawFinding** | Achado bruto antes da tradução GRC (output do parser por ferramenta). |
| **validator.IsValidHostname** | Validação de hostname (RFC 1123); usada em API e Scan Job para mitigar injeção. |
| **validator.IsValidUUID** | Validação de UUID; evita path traversal em scan_id. |
| **validator.IsSafePathSegment** | Validação de segmento de path; evita "/" e chars de controle em tenant_id. |
| **Score Técnico (T)** | Base 1000; dedução por achados conforme severidade. |
| **Score de Compliance (C)** | Percentual de aderência aos questionários (ISO, NIST, LGPD). |
| **Penalidade Crítica** | Se houver achado Crítico, score final máximo = 500. |

## Severidades

| Severidade | Peso | Exemplos |
|------------|------|----------|
| Crítico | 10 | RDP/SMB expostos, CVE com exploit |
| Alto | 7 | DMARC ausente, SSL expirado |
| Médio | 4 | Headers ausentes, software desatualizado |
| Baixo | 1 | Subdomínios expostos, banners |

## Termos de Persistência

| Termo | Definição |
|-------|-----------|
| **Firestore** | NoSQL; hierarquia `tenants/{tid}/scans/{sid}/findings/{fid}`; scans e findings do MVP |
| **Cloud SQL** | PostgreSQL; GRC, controles, frameworks, assessments (Mês 2) |
| **RLS** | Row Level Security; isolamento por `tenant_id` em `assessments` |
| **Score Category** | A–F; mapeamento A≥900, B≥750, C≥600, D≥400, E≥250, F<250 |
| **mapping_logic (Cloud SQL)** | Tabela que vincula achado técnico a control_id e impact_on_score; equivalente lógico do JSON |
| **Cloud Run Service** | API REST; escala automática; PORT injetado pelo GCP |
| **Cloud Run Job** | Scan Engine; execução batch; env vars TENANT_ID, SCAN_ID, DOMAIN |

## Controles ISO (exemplos)

| ID | Domínio | Descrição |
|----|---------|-----------|
| C-01 | A.13.1.1 | Redes — Controle de acesso (portas críticas) |
| C-02 | A.10.1.1 | Criptografia — Certificados/TLS |
| C-03 | A.12.6.1 | Vulnerabilidades — Patch management |
| C-04 | A.13.2.1 | Comunicações — Anti-phishing (DMARC/SPF) |
