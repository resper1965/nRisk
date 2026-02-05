package assessment

import (
	"fmt"

	"github.com/nrisk/backend/internal/domain"
)

// CrossCheckInput contém os dados necessários para validação cruzada.
type CrossCheckInput struct {
	Questions        []domain.Question
	AnswersByQuestion map[string]*domain.Answer
	// FindingsByControl mapeia control_id -> lista de severidades dos findings do scan.
	FindingsByControl map[string][]string
}

// RunCrossCheck executa a validação cruzada entre respostas declarativas e achados do scan.
// Para cada controle com pergunta e achados técnicos mapeados:
//   - "sim" + finding critical/high → Inconsistência Crítica
//   - "sim" + finding medium → Inconsistência
//   - "sim" + finding low → Alerta
//   - "sim" + sem finding → Validado
//   - "nao" ou "na" → não gera inconsistência
func RunCrossCheck(input CrossCheckInput) []domain.CrossCheckResult {
	var results []domain.CrossCheckResult

	for _, q := range input.Questions {
		answer, hasAnswer := input.AnswersByQuestion[q.ID]
		if !hasAnswer || answer == nil {
			continue
		}

		scanFindings, hasScanData := input.FindingsByControl[q.ControlID]
		scanStatus := "clean"
		if hasScanData && len(scanFindings) > 0 {
			scanStatus = "finding_found"
		}

		result := domain.CrossCheckResult{
			ControlID:      q.ControlID,
			ISODomain:      q.ISODomain,
			QuestionID:     q.ID,
			DeclaredStatus: answer.Status,
			ScanStatus:     scanStatus,
		}

		switch {
		case answer.Status == "na":
			result.Verdict = "not_applicable"

		case answer.Status == "nao":
			// Cliente admitiu a falha - não é inconsistência
			if scanStatus == "finding_found" {
				result.Verdict = "validated"
				result.Detail = "Declaração negativa confirmada pelo scan"
			} else {
				result.Verdict = "validated"
			}

		case answer.Status == "sim" && scanStatus == "finding_found":
			// INCONSISTÊNCIA: disse que sim mas scan encontrou problemas
			highestSev := highestSeverityFromList(scanFindings)
			result.FindingSeverity = highestSev

			switch highestSev {
			case "critical":
				result.Verdict = "inconsistent"
				result.InconsistencyType = "critical"
				result.Detail = fmt.Sprintf("Declarou conformidade no controle %s mas scan encontrou achado CRÍTICO", q.ControlID)
			case "high":
				result.Verdict = "inconsistent"
				result.InconsistencyType = "critical"
				result.Detail = fmt.Sprintf("Declarou conformidade no controle %s mas scan encontrou achado de alta severidade", q.ControlID)
			case "medium":
				result.Verdict = "inconsistent"
				result.InconsistencyType = "standard"
				result.Detail = fmt.Sprintf("Declarou conformidade no controle %s mas scan encontrou achado de média severidade", q.ControlID)
			case "low":
				result.Verdict = "alert"
				result.InconsistencyType = "alert"
				result.Detail = fmt.Sprintf("Declarou conformidade no controle %s; scan encontrou achado de baixa severidade", q.ControlID)
			default:
				result.Verdict = "alert"
				result.InconsistencyType = "alert"
			}

		case answer.Status == "sim" && scanStatus == "clean":
			result.Verdict = "validated"
			result.Detail = "Declaração positiva sem achados contrários no scan"

		default:
			result.Verdict = "validated"
		}

		results = append(results, result)
	}

	return results
}

// ComputeConfidenceFactor calcula o Fator de Confiança (F) baseado nas inconsistências.
// F começa em 1.0 e é reduzido por inconsistências:
//   - Inconsistência crítica: -0.15 por ocorrência
//   - Inconsistência padrão: -0.10 por ocorrência
//   - Alerta: -0.05 por ocorrência
//
// Mínimo: 0.5 (para não anular completamente o score de compliance)
func ComputeConfidenceFactor(crossCheckResults []domain.CrossCheckResult) float64 {
	f := 1.0

	for _, r := range crossCheckResults {
		switch r.InconsistencyType {
		case "critical":
			f -= 0.15
		case "standard":
			f -= 0.10
		case "alert":
			f -= 0.05
		}
	}

	if f < 0.5 {
		f = 0.5
	}
	return f
}

// highestSeverityFromList retorna a maior severidade de uma lista de strings.
func highestSeverityFromList(severities []string) string {
	order := map[string]int{"critical": 4, "high": 3, "medium": 2, "low": 1}
	best := ""
	bestVal := 0
	for _, s := range severities {
		if v, ok := order[s]; ok && v > bestVal {
			bestVal = v
			best = s
		}
	}
	return best
}
