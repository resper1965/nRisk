package assessment

import (
	"math"

	"github.com/nrisk/backend/internal/domain"
)

const (
	baseScore           = 1000
	technicalWeight     = 0.6
	declarativeWeight   = 0.4
	criticalCap         = 500 // penalidade crítica: teto de 500
	pointsPerWeight     = 15  // pontos por unidade de risk_weight (calibrado para 20 perguntas)
)

// ScoreToCategory mapeia score 0–1000 para letra A–F (P1.1 rating por eixo).
func ScoreToCategory(score int) string {
	switch {
	case score >= 900:
		return "A"
	case score >= 750:
		return "B"
	case score >= 600:
		return "C"
	case score >= 400:
		return "D"
	case score >= 250:
		return "E"
	default:
		return "F"
	}
}

// ComputeDomainScores agrega findings por iso_domain e retorna score + grade por eixo (P1.1).
func ComputeDomainScores(findings []*domain.AuditFinding) []domain.DomainScore {
	deductionByDomain := make(map[string]struct {
		deduction int
		label     string
	})
	for _, f := range findings {
		k := f.ISODomain
		if k == "" {
			continue
		}
		v := deductionByDomain[k]
		v.deduction += f.ScoreDeduction
		if f.ISOTitle != "" {
			v.label = f.ISOTitle
		}
		deductionByDomain[k] = v
	}
	out := make([]domain.DomainScore, 0, len(deductionByDomain))
	for domainID, v := range deductionByDomain {
		score := baseScore - v.deduction
		if score < 0 {
			score = 0
		}
		out = append(out, domain.DomainScore{
			DomainID: domainID,
			Label:    v.label,
			Score:    score,
			Grade:    ScoreToCategory(score),
		})
	}
	return out
}

// ComputeDeclarativeScore calcula o score declarativo (base 1000 - deduções por "Não").
// Mantém compatibilidade com o modelo anterior para perguntas sem risk_weight.
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

// ComputeComplianceScoreAdditive calcula o score de compliance usando modelo aditivo.
// Base 0, soma pontos por respostas "sim" baseado em risk_weight.
// Normalizado para escala 0-1000.
func ComputeComplianceScoreAdditive(questions []domain.Question, answersByQuestion map[string]*domain.Answer) int {
	maxPoints := 0
	earnedPoints := 0

	for _, q := range questions {
		weight := q.RiskWeight
		if weight <= 0 {
			weight = 3 // default para perguntas sem risk_weight
		}
		maxPoints += weight * pointsPerWeight

		a, ok := answersByQuestion[q.ID]
		if !ok || a == nil {
			continue
		}
		if a.Status == "sim" {
			earnedPoints += weight * pointsPerWeight
		}
	}

	if maxPoints == 0 {
		return 0
	}

	// Normalizar para escala 0-1000
	normalized := int(math.Round(float64(earnedPoints) / float64(maxPoints) * 1000))
	if normalized > 1000 {
		normalized = 1000
	}
	return normalized
}

// ComputeHybridScore calcula o score final híbrido: (T * 0.6) + (C * 0.4).
func ComputeHybridScore(technicalScore, declarativeScore int) float64 {
	t := clamp(float64(technicalScore), 0, 1000)
	c := clamp(float64(declarativeScore), 0, 1000)
	return t*technicalWeight + c*declarativeWeight
}

// ComputeFullScore calcula o ScoreBreakdown completo com:
// - Score técnico (T)
// - Score de compliance bruto e ajustado por F
// - Fator de confiança (F) baseado em inconsistências
// - Penalidade crítica
// - Scores por domínio para spider chart
func ComputeFullScore(input ScoreInput) domain.ScoreBreakdown {
	// 1. Score de compliance bruto (modelo aditivo)
	complianceRaw := ComputeComplianceScoreAdditive(input.Questions, input.AnswersByQuestion)

	// 2. Cross-check e fator de confiança
	crossCheckResults := RunCrossCheck(CrossCheckInput{
		Questions:         input.Questions,
		AnswersByQuestion: input.AnswersByQuestion,
		FindingsByControl: input.FindingsByControl,
	})
	confidenceFactor := ComputeConfidenceFactor(crossCheckResults)

	// 3. Score de compliance ajustado
	complianceAdjusted := float64(complianceRaw) * confidenceFactor

	// 4. Score híbrido
	t := clamp(float64(input.TechnicalScore), 0, 1000)
	hybrid := t*technicalWeight + complianceAdjusted*declarativeWeight

	// 5. Penalidade crítica
	hasCritical := input.HasCriticalFinding
	criticalApplied := false
	if hasCritical && hybrid > criticalCap {
		hybrid = criticalCap
		criticalApplied = true
	}

	// 6. Scores por domínio (para spider chart)
	domainScores := computeDomainScores(input.Questions, input.AnswersByQuestion, input.FindingsByControl)

	// 7. Filtrar apenas inconsistências para o resultado
	var inconsistencies []domain.CrossCheckResult
	for _, r := range crossCheckResults {
		if r.Verdict == "inconsistent" || r.Verdict == "alert" {
			inconsistencies = append(inconsistencies, r)
		}
	}

	return domain.ScoreBreakdown{
		TechnicalScore:     input.TechnicalScore,
		ComplianceScoreRaw: complianceRaw,
		ComplianceScore:    math.Round(complianceAdjusted*100) / 100,
		ConfidenceFactor:   math.Round(confidenceFactor*100) / 100,
		HybridScore:        math.Round(hybrid*100) / 100,
		ScoreCategory:      ScoreCategory(hybrid),
		HasCriticalFinding: hasCritical,
		CriticalPenalty:    criticalApplied,
		Inconsistencies:    inconsistencies,
		DomainScores:       domainScores,
		FrameworkID:        input.FrameworkID,
	}
}

// TechnicalScoreFromFindings calcula o score técnico (0–1000) a partir dos findings (base 1000 - deduções).
// Usado em GetFullScore quando há justificativas aprovadas (P1.6) para recalcular T excluindo findings aprovados.
func TechnicalScoreFromFindings(findings []*domain.AuditFinding) int {
	score := baseScore
	for _, f := range findings {
		score -= f.ScoreDeduction
	}
	if score < 0 {
		score = 0
	}
	return score
}

// ScoreInput contém todos os dados necessários para cálculo completo do score.
type ScoreInput struct {
	TechnicalScore     int
	HasCriticalFinding bool
	Questions          []domain.Question
	AnswersByQuestion  map[string]*domain.Answer
	FindingsByControl  map[string][]string // control_id -> lista de severidades
	FrameworkID        string
}

// ScoreCategory retorna a categoria (A-F) para um score.
func ScoreCategory(score float64) string {
	switch {
	case score >= 900:
		return "A"
	case score >= 750:
		return "B"
	case score >= 600:
		return "C"
	case score >= 400:
		return "D"
	case score >= 250:
		return "E"
	default:
		return "F"
	}
}

// computeDomainScores calcula a aderência % por categoria/domínio para o spider chart.
// Combina dados do questionário e do scan para cada categoria.
func computeDomainScores(questions []domain.Question, answersByQuestion map[string]*domain.Answer, findingsByControl map[string][]string) map[string]float64 {
	type domainData struct {
		totalQuestions   int
		positiveAnswers  int
		hasFindings      bool
		findingSeverity  string
	}

	domains := make(map[string]*domainData)

	for _, q := range questions {
		cat := q.Category
		if cat == "" {
			cat = q.ISODomain
		}
		if _, ok := domains[cat]; !ok {
			domains[cat] = &domainData{}
		}
		d := domains[cat]
		d.totalQuestions++

		a, hasAnswer := answersByQuestion[q.ID]
		if hasAnswer && a != nil && a.Status == "sim" {
			d.positiveAnswers++
		}

		if severities, ok := findingsByControl[q.ControlID]; ok && len(severities) > 0 {
			d.hasFindings = true
			sev := highestSeverityFromList(severities)
			if severityOrder(sev) > severityOrder(d.findingSeverity) {
				d.findingSeverity = sev
			}
		}
	}

	scores := make(map[string]float64)
	for cat, d := range domains {
		if d.totalQuestions == 0 {
			scores[cat] = 0
			continue
		}

		base := float64(d.positiveAnswers) / float64(d.totalQuestions) * 100

		if d.hasFindings {
			switch d.findingSeverity {
			case "critical":
				base *= 0.3
			case "high":
				base *= 0.5
			case "medium":
				base *= 0.7
			case "low":
				base *= 0.9
			}
		}

		scores[cat] = math.Round(base*100) / 100
	}

	return scores
}

func severityOrder(s string) int {
	switch s {
	case "critical":
		return 4
	case "high":
		return 3
	case "medium":
		return 2
	case "low":
		return 1
	default:
		return 0
	}
}

func clamp(v, min, max float64) float64 {
	if v < min {
		return min
	}
	if v > max {
		return max
	}
	return v
}
