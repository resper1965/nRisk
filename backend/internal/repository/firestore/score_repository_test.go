package firestore

import (
	"testing"

	"github.com/nrisk/backend/internal/assessment"
)

func TestScoreToCategory(t *testing.T) {
	tests := []struct {
		score int
		want  string
	}{
		{1000, "A"},
		{900, "A"},
		{899, "B"},
		{750, "B"},
		{749, "C"},
		{600, "C"},
		{599, "D"},
		{400, "D"},
		{399, "E"},
		{250, "E"},
		{249, "F"},
		{0, "F"},
	}
	for _, tt := range tests {
		got := assessment.ScoreToCategory(tt.score)
		if got != tt.want {
			t.Errorf("ScoreToCategory(%d) = %s, want %s", tt.score, got, tt.want)
		}
	}
}
