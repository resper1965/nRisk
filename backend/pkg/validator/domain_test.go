package validator

import "testing"

func TestIsValidHostname(t *testing.T) {
	tests := []struct {
		name   string
		domain string
		want   bool
	}{
		{"válido simples", "example.com", true},
		{"válido subdomínio", "api.example.com", true},
		{"válido múltiplos subdomínios", "a.b.c.example.com", true},
		{"válido com hífen", "my-domain.com", true},
		{"válido label único", "localhost", true},
		{"válido com números", "123.example.com", true},
		{"vazio", "", false},
		{"com espaços", "example .com", false},
		{"inicia com hífen", "-example.com", false},
		{"termina com ponto", "example.com.", false},
		{"caracteres inválidos", "example.com;rm", false},
		{"script injection", "example.com$(whoami)", false},
		{"muito longo", string(make([]byte, 254)), false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := IsValidHostname(tt.domain); got != tt.want {
				t.Errorf("IsValidHostname(%q) = %v, want %v", tt.domain, got, tt.want)
			}
		})
	}
}

func TestIsValidUUID(t *testing.T) {
	tests := []struct {
		name string
		s    string
		want bool
	}{
		{"uuid v4 válido", "550e8400-e29b-41d4-a716-446655440000", true},
		{"uuid v4 válido minúsculo", "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", true},
		{"vazio", "", false},
		{"path traversal", "../../other/scan", false},
		{"caracteres inválidos", "not-a-uuid", false},
		{"parcial", "550e8400-e29b-41d4", false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := IsValidUUID(tt.s); got != tt.want {
				t.Errorf("IsValidUUID(%q) = %v, want %v", tt.s, got, tt.want)
			}
		})
	}
}

func TestIsSafePathSegment(t *testing.T) {
	tests := []struct {
		name string
		s    string
		want bool
	}{
		{"válido", "org-123", true},
		{"com ponto", "org.example", true},
		{"vazio", "", false},
		{"path traversal", "a/b", false},
		{"com espaço", "org 123", false},
		{"muito longo", string(make([]byte, 129)), false},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := IsSafePathSegment(tt.s); got != tt.want {
				t.Errorf("IsSafePathSegment(%q) = %v, want %v", tt.s, got, tt.want)
			}
		})
	}
}
