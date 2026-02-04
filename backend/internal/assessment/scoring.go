package assessment

import (
	"github.com/nrisk/backend/internal/domain"
)

const (
	baseScore       = 1000
	technicalWeight = 0.6
	declarativeWeight = 0.4
)

// ComputeDeclarativeScore calcula o score declarativo (base 1000 - deduções por "Não").
func ComputeDeclarativeScore(questions []domain.Question, answersByQuestion map[string]*domain.Answer) int {
	score := baseScore
	for _, q := range questions {
		a, ok := answersByQuestion[q.ID]
		if !ok || a == nil {
			continue
		}
		if a.Status == "nao" {
			score -= q.ScoreDeductionIfNo
		}
	}
	if score < 0 {
		score = 0
	}
	return score
}

// ComputeHybridScore calcula o score final híbrido: (T * 0.6) + (C * 0.4).
func ComputeHybridScore(technicalScore, declarativeScore int) float64 {
	t := float64(technicalScore)
	if t > 1000 {
		t = 1000
	}
	if t < 0 {
		t = 0
	}
	c := float64(declarativeScore)
	if c > 1000 {
		c = 1000
	}
	if c < 0 {
		c = 0
	}
	return t*technicalWeight + c*declarativeWeight
}
