package validator

import (
	"regexp"

	"github.com/google/uuid"
)

// hostnameRegex valida formato de hostname (RFC 1123).
// Labels: 1-63 chars, alfanumérico e hífen; separados por ponto.
var hostnameRegex = regexp.MustCompile(`^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$`)

// IsValidHostname retorna true se domain é um hostname válido.
// Evita injeção em comandos (nmap, nuclei, etc.).
func IsValidHostname(domain string) bool {
	if len(domain) == 0 || len(domain) > 253 {
		return false
	}
	return hostnameRegex.MatchString(domain)
}

// IsValidUUID retorna true se s é um UUID válido (v4 ou compatível).
// Evita path traversal em Firestore (scan_id, finding_id).
func IsValidUUID(s string) bool {
	_, err := uuid.Parse(s)
	return err == nil
}

// IsSafePathSegment retorna true se s é seguro para uso em path (tenant_id, etc.).
// Bloqueia "/" e caracteres de controle para evitar path traversal.
func IsSafePathSegment(s string) bool {
	if len(s) == 0 || len(s) > 128 {
		return false
	}
	for _, r := range s {
		if r == '/' || r == ' ' || r < 32 {
			return false
		}
	}
	return true
}
