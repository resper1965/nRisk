---
type: skill
name: Api Design
description: Design RESTful APIs following best practices
skillSlug: api-design
phases: [P, R]
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# API Design — n.Risk

## Referências

- [api-design.md](../../docs/api-design.md) — Princípios e convenções
- [api.md](../../docs/api.md) — Referência de endpoints
- [api.openapi.yaml](../../docs/api.openapi.yaml) — Especificação OpenAPI

## Convenções Aplicadas

1. **RESTful:** Recursos como substantivos, verbos HTTP
2. **Versionamento:** /api/v1
3. **Erros:** `{ "error": "...", "code": "CODIGO" }`
4. **201 Created:** Header Location com URL do recurso
5. **JSON:** snake_case nos campos
