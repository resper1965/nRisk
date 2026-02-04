# Validation Phase — n.Risk MVP

**Data:** 2026-02-04  
**Fase:** V (Validation)

---

## 1. Testes

| Componente | Arquivo | Casos |
|------------|---------|-------|
| **validator** | `pkg/validator/domain_test.go` | 13 casos (válidos, inválidos, edge cases) |

**Casos cobertos:** example.com, subdomínios, hífen, vazio, espaços, hífen inicial, ponto final, caracteres inválidos, script injection, length > 253.

---

## 2. Code Review (validator + integrações)

- **validator/domain.go:** Regex RFC 1123; length check 1–253
- **controller:** Validação antes de CreatePendingScan; 400 em domain inválido
- **scan-job:** Validação após env vars; exit 1 em domain inválido

---

## 3. Security Audit

- **Mitigação de injeção:** Domain validado antes de uso em comandos (nmap, nuclei, subfinder)
- **Formato:** Apenas alfanumérico, hífen, ponto; sem shell metacharacters

---

## 4. Resultado

**Validado.** Pronto para fase Complete.
