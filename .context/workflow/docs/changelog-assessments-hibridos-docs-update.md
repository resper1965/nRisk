# Changelog — Atualização Docs Assessments Híbridos

**Data:** 2026-02-04

## Resumo

Atualização de todos os documentos contextuais para refletir a nova feature de **Assessments Híbridos** (questionários vinculados ao mapping_logic, Logic Engine Cross-Check, Evidence Vault, API GET/PATCH assessments).

## Documentos Alterados

| Documento | Alterações |
|-----------|------------|
| **architecture.md** | Estrutura de código (assessment/, storage/); módulo Assessments Híbridos; multi-tenancy GCS e Cloud SQL |
| **data-flow.md** | Novo fluxo de Assessments; fontes de dados (assessment_questions, assessment_answers, Evidence Vault) |
| **glossary.md** | Novos termos: Assessment, Assessment Question, Assessment Answer, Logic Engine (Cross-Check), Inconsistent |
| **security.md** | Validação question_id/control_id; segregação GCS e Cloud SQL RLS |
| **project-overview.md** | API Backend com Assessments Híbridos; Painel com questionários e inconsistências; Score C aditivo |
| **api.md** | Endpoints GET /assessments, PATCH /assessments/:id; legado assessment (GET/POST) |
| **api-design.md** | Novos códigos de erro INVALID_QUESTION_ID, FRAMEWORK_NOT_FOUND |
| **api.openapi.yaml** | Paths /api/v1/assessments, /api/v1/assessments/{id}; schema Assessment |
| **database.md** | Tabelas assessment_questions, assessment_answers; RLS; migração 002; coleção Firestore answers |
| **contexto-nrisk.md** | Hierarquia de planos (nrisk-assessment-hibrido, implementacao); regras para agentes |
| **frontend.md** | Chamadas GET/PATCH assessments; CISO com questionários e inconsistências |
| **testing-strategy.md** | Logic Engine e Assessment API como prioridade alta; crosscheck_test.go |
| **security-audit-checklist.md** | question_id/control_id; GCS e Cloud SQL multi-tenancy |
| **devops.md** | Env vars GCS_EVIDENCE_BUCKET, ASSESSMENT_QUESTIONS_PATH |
| **README.md** | Feature em destaque: Assessments Híbridos |

## Agentes Envolvidos (perspectivas)

- **Architect:** Modelagem do módulo e boundaries
- **Backend:** Logic Engine, repositórios, API
- **Database:** Schema Cloud SQL, RLS
- **Security:** Validação, multi-tenancy
- **Documentation:** Consistência entre docs
- **Test Writer:** Casos de teste para Cross-Check
