---
type: doc
name: api-design
description: Princípios e convenções de design da API n.Risk
category: api
generated: 2026-02-04
status: filled
scaffoldVersion: "2.0.0"
---

# API Design — n.Risk

## Princípios

| Princípio | Aplicação |
|-----------|-----------|
| **RESTful** | Recursos como substantivos (/scans), verbos HTTP para ações |
| **Versionamento** | Prefixo /api/v1; v2 quebra compatibilidade em path separado |
| **JSON** | Content-Type application/json; snake_case nos campos |
| **Idempotência** | GET seguro; POST cria; evita efeitos colaterais em leituras |

## Formato de Resposta de Erro

Todas as respostas de erro incluem:

```json
{
  "error": "mensagem legível",
  "code": "CODIGO_PROGRAMATICO"
}
```

| Código | HTTP | Descrição |
|--------|------|-----------|
| MISSING_AUTH | 401 | Header Authorization ausente |
| INVALID_AUTH_FORMAT | 401 | Formato Bearer inválido |
| INVALID_TOKEN | 401 | Token expirado ou inválido |
| MISSING_TENANT_ID | 403 | tenant_id ausente nas claims |
| INVALID_REQUEST | 400 | Body JSON inválido |
| INVALID_DOMAIN | 400 | Formato de domain inválido (hostname) |
| INVALID_SCAN_ID | 400 | Formato de scan_id inválido (UUID) |

Erros 404 e 500 não incluem `code` por padrão (opcional em versões futuras).

## Headers

| Response | Header | Uso |
|----------|--------|-----|
| 201 Created | Location | URL do recurso criado (relativa: /api/v1/scans/{id}) |
| Todas | Content-Type | application/json |
| Todas | X-Content-Type-Options | nosniff (SecurityHeaders) |

## Versioning

- **v1:** Estável; mudanças aditivas (novos campos) sem quebrar
- **v2:** Novo path quando houver breaking changes

## Referência

Especificação OpenAPI: [api.openapi.yaml](./api.openapi.yaml)
