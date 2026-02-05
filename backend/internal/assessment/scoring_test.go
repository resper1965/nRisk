package assessment

import (
	"math"
	"testing"

	"github.com/nrisk/backend/internal/domain"
)

// --- Helpers ---

func makeQuestion(id, controlID, category, severity string, deduction, riskWeight int) domain.Question {
	return domain.Question{
		ID:                 id,
		ControlID:          controlID,
		ISODomain:          "A.13.1.1",
		Text:               "Test question " + id,
		Severity:           severity,
		ScoreDeductionIfNo: deduction,
		RiskWeight:         riskWeight,
		Category:           category,
		Track:              "bronze",
	}
}

func makeAnswer(questionID, controlID, status string) *domain.Answer {
	return &domain.Answer{
		QuestionID: questionID,
		ControlID:  controlID,
		Status:     status,
	}
}

// --- ComputeDeclarativeScore Tests ---

func TestComputeDeclarativeScore_AllYes(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
		makeQuestion("Q-02", "C-02", "Cripto", "high", 150, 4),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "sim"),
		"Q-02": makeAnswer("Q-02", "C-02", "sim"),
	}
	score := ComputeDeclarativeScore(questions, answers)
	if score != 1000 {
		t.Errorf("expected 1000, got %d", score)
	}
}

func TestComputeDeclarativeScore_AllNo(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
		makeQuestion("Q-02", "C-02", "Cripto", "high", 150, 4),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "nao"),
		"Q-02": makeAnswer("Q-02", "C-02", "nao"),
	}
	score := ComputeDeclarativeScore(questions, answers)
	expected := 1000 - 300 - 150
	if score != expected {
		t.Errorf("expected %d, got %d", expected, score)
	}
}

func TestComputeDeclarativeScore_FloorAtZero(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 600, 5),
		makeQuestion("Q-02", "C-02", "Cripto", "high", 600, 4),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "nao"),
		"Q-02": makeAnswer("Q-02", "C-02", "nao"),
	}
	score := ComputeDeclarativeScore(questions, answers)
	if score != 0 {
		t.Errorf("expected 0, got %d", score)
	}
}

func TestComputeDeclarativeScore_NoAnswers(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
	}
	answers := map[string]*domain.Answer{}
	score := ComputeDeclarativeScore(questions, answers)
	if score != 1000 {
		t.Errorf("expected 1000 (unanswered don't deduct), got %d", score)
	}
}

func TestComputeDeclarativeScore_NADoesNotDeduct(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "na"),
	}
	score := ComputeDeclarativeScore(questions, answers)
	if score != 1000 {
		t.Errorf("expected 1000 (na should not deduct), got %d", score)
	}
}

// --- ComputeComplianceScoreAdditive Tests ---

func TestComputeComplianceScoreAdditive_AllYes(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
		makeQuestion("Q-02", "C-02", "Cripto", "high", 150, 4),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "sim"),
		"Q-02": makeAnswer("Q-02", "C-02", "sim"),
	}
	score := ComputeComplianceScoreAdditive(questions, answers)
	if score != 1000 {
		t.Errorf("expected 1000, got %d", score)
	}
}

func TestComputeComplianceScoreAdditive_AllNo(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
		makeQuestion("Q-02", "C-02", "Cripto", "high", 150, 4),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "nao"),
		"Q-02": makeAnswer("Q-02", "C-02", "nao"),
	}
	score := ComputeComplianceScoreAdditive(questions, answers)
	if score != 0 {
		t.Errorf("expected 0, got %d", score)
	}
}

func TestComputeComplianceScoreAdditive_Partial(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
		makeQuestion("Q-02", "C-02", "Cripto", "high", 150, 5),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "sim"),
		"Q-02": makeAnswer("Q-02", "C-02", "nao"),
	}
	score := ComputeComplianceScoreAdditive(questions, answers)
	// 5*15 earned out of (5+5)*15 max = 75/150 = 50% = 500
	if score != 500 {
		t.Errorf("expected 500, got %d", score)
	}
}

func TestComputeComplianceScoreAdditive_NoQuestions(t *testing.T) {
	score := ComputeComplianceScoreAdditive(nil, nil)
	if score != 0 {
		t.Errorf("expected 0 for no questions, got %d", score)
	}
}

func TestComputeComplianceScoreAdditive_DefaultWeight(t *testing.T) {
	questions := []domain.Question{
		{ID: "Q-01", ControlID: "C-01", RiskWeight: 0}, // should default to 3
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "sim"),
	}
	score := ComputeComplianceScoreAdditive(questions, answers)
	if score != 1000 {
		t.Errorf("expected 1000, got %d", score)
	}
}

// --- ComputeHybridScore Tests ---

func TestComputeHybridScore_Perfect(t *testing.T) {
	score := ComputeHybridScore(1000, 1000)
	if score != 1000 {
		t.Errorf("expected 1000, got %f", score)
	}
}

func TestComputeHybridScore_Zero(t *testing.T) {
	score := ComputeHybridScore(0, 0)
	if score != 0 {
		t.Errorf("expected 0, got %f", score)
	}
}

func TestComputeHybridScore_TechOnly(t *testing.T) {
	score := ComputeHybridScore(1000, 0)
	if score != 600 {
		t.Errorf("expected 600, got %f", score)
	}
}

func TestComputeHybridScore_ComplianceOnly(t *testing.T) {
	score := ComputeHybridScore(0, 1000)
	if score != 400 {
		t.Errorf("expected 400, got %f", score)
	}
}

func TestComputeHybridScore_ClampsNegative(t *testing.T) {
	score := ComputeHybridScore(-100, -200)
	if score != 0 {
		t.Errorf("expected 0, got %f", score)
	}
}

func TestComputeHybridScore_ClampsOver1000(t *testing.T) {
	score := ComputeHybridScore(2000, 2000)
	if score != 1000 {
		t.Errorf("expected 1000 (clamped), got %f", score)
	}
}

// --- CrossCheck Tests ---

func TestRunCrossCheck_Validated(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "sim"),
	}
	findings := map[string][]string{} // no findings

	results := RunCrossCheck(CrossCheckInput{
		Questions:         questions,
		AnswersByQuestion: answers,
		FindingsByControl: findings,
	})

	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}
	if results[0].Verdict != "validated" {
		t.Errorf("expected validated, got %s", results[0].Verdict)
	}
}

func TestRunCrossCheck_CriticalInconsistency(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "sim"),
	}
	findings := map[string][]string{
		"C-01": {"critical"},
	}

	results := RunCrossCheck(CrossCheckInput{
		Questions:         questions,
		AnswersByQuestion: answers,
		FindingsByControl: findings,
	})

	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}
	if results[0].Verdict != "inconsistent" {
		t.Errorf("expected inconsistent, got %s", results[0].Verdict)
	}
	if results[0].InconsistencyType != "critical" {
		t.Errorf("expected critical inconsistency, got %s", results[0].InconsistencyType)
	}
}

func TestRunCrossCheck_StandardInconsistency(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-06", "Monitoramento", "medium", 60, 2),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-06", "sim"),
	}
	findings := map[string][]string{
		"C-06": {"medium"},
	}

	results := RunCrossCheck(CrossCheckInput{
		Questions:         questions,
		AnswersByQuestion: answers,
		FindingsByControl: findings,
	})

	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}
	if results[0].InconsistencyType != "standard" {
		t.Errorf("expected standard inconsistency, got %s", results[0].InconsistencyType)
	}
}

func TestRunCrossCheck_AlertForLow(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-03", "Vuln", "low", 20, 1),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-03", "sim"),
	}
	findings := map[string][]string{
		"C-03": {"low"},
	}

	results := RunCrossCheck(CrossCheckInput{
		Questions:         questions,
		AnswersByQuestion: answers,
		FindingsByControl: findings,
	})

	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}
	if results[0].Verdict != "alert" {
		t.Errorf("expected alert, got %s", results[0].Verdict)
	}
}

func TestRunCrossCheck_NoAnswerNoResult(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
	}
	answers := map[string]*domain.Answer{} // no answers

	results := RunCrossCheck(CrossCheckInput{
		Questions:         questions,
		AnswersByQuestion: answers,
		FindingsByControl: map[string][]string{},
	})

	if len(results) != 0 {
		t.Errorf("expected 0 results for unanswered, got %d", len(results))
	}
}

func TestRunCrossCheck_NaoNotInconsistent(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "nao"),
	}
	findings := map[string][]string{
		"C-01": {"critical"},
	}

	results := RunCrossCheck(CrossCheckInput{
		Questions:         questions,
		AnswersByQuestion: answers,
		FindingsByControl: findings,
	})

	if len(results) != 1 {
		t.Fatalf("expected 1 result, got %d", len(results))
	}
	if results[0].Verdict != "validated" {
		t.Errorf("expected validated (admitted no), got %s", results[0].Verdict)
	}
}

func TestRunCrossCheck_NAIsNotApplicable(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "na"),
	}
	findings := map[string][]string{
		"C-01": {"critical"},
	}

	results := RunCrossCheck(CrossCheckInput{
		Questions:         questions,
		AnswersByQuestion: answers,
		FindingsByControl: findings,
	})

	if results[0].Verdict != "not_applicable" {
		t.Errorf("expected not_applicable, got %s", results[0].Verdict)
	}
}

// --- ComputeConfidenceFactor Tests ---

func TestComputeConfidenceFactor_NoInconsistencies(t *testing.T) {
	results := []domain.CrossCheckResult{
		{Verdict: "validated"},
	}
	f := ComputeConfidenceFactor(results)
	if f != 1.0 {
		t.Errorf("expected 1.0, got %f", f)
	}
}

func TestComputeConfidenceFactor_OneCritical(t *testing.T) {
	results := []domain.CrossCheckResult{
		{Verdict: "inconsistent", InconsistencyType: "critical"},
	}
	f := ComputeConfidenceFactor(results)
	if f != 0.85 {
		t.Errorf("expected 0.85, got %f", f)
	}
}

func TestComputeConfidenceFactor_MultipleInconsistencies(t *testing.T) {
	results := []domain.CrossCheckResult{
		{InconsistencyType: "critical"},
		{InconsistencyType: "standard"},
		{InconsistencyType: "alert"},
	}
	f := ComputeConfidenceFactor(results)
	expected := 1.0 - 0.15 - 0.10 - 0.05 // 0.70
	if math.Abs(f-expected) > 0.001 {
		t.Errorf("expected %f, got %f", expected, f)
	}
}

func TestComputeConfidenceFactor_MinimumIs05(t *testing.T) {
	results := []domain.CrossCheckResult{
		{InconsistencyType: "critical"},
		{InconsistencyType: "critical"},
		{InconsistencyType: "critical"},
		{InconsistencyType: "critical"},
		{InconsistencyType: "critical"},
	}
	f := ComputeConfidenceFactor(results)
	if f != 0.5 {
		t.Errorf("expected minimum 0.5, got %f", f)
	}
}

// --- ScoreCategory Tests (float64 para ComputeFullScore) ---

func TestScoreCategory(t *testing.T) {
	tests := []struct {
		score    float64
		expected string
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
	for _, tc := range tests {
		got := ScoreCategory(tc.score)
		if got != tc.expected {
			t.Errorf("ScoreCategory(%f) = %s, want %s", tc.score, got, tc.expected)
		}
	}
}

// --- ScoreToCategory Tests (int para P1.1 domain_scores / score_repository) ---

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
		if got := ScoreToCategory(tt.score); got != tt.want {
			t.Errorf("ScoreToCategory(%d) = %q, want %q", tt.score, got, tt.want)
		}
	}
}

// --- ComputeFullScore Integration Tests ---

func TestComputeFullScore_PerfectScore(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
		makeQuestion("Q-02", "C-02", "Cripto", "high", 150, 4),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "sim"),
		"Q-02": makeAnswer("Q-02", "C-02", "sim"),
	}

	result := ComputeFullScore(ScoreInput{
		TechnicalScore:     1000,
		HasCriticalFinding: false,
		Questions:          questions,
		AnswersByQuestion:  answers,
		FindingsByControl:  map[string][]string{},
		FrameworkID:        "ISO27001",
	})

	if result.HybridScore != 1000 {
		t.Errorf("expected 1000, got %f", result.HybridScore)
	}
	if result.ScoreCategory != "A" {
		t.Errorf("expected A, got %s", result.ScoreCategory)
	}
	if result.ConfidenceFactor != 1.0 {
		t.Errorf("expected F=1.0, got %f", result.ConfidenceFactor)
	}
	if len(result.Inconsistencies) != 0 {
		t.Errorf("expected 0 inconsistencies, got %d", len(result.Inconsistencies))
	}
}

func TestComputeFullScore_CriticalPenaltyCap(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "sim"),
	}

	result := ComputeFullScore(ScoreInput{
		TechnicalScore:     800,
		HasCriticalFinding: true,
		Questions:          questions,
		AnswersByQuestion:  answers,
		FindingsByControl:  map[string][]string{},
		FrameworkID:        "ISO27001",
	})

	if result.HybridScore > 500 {
		t.Errorf("expected <= 500 (critical cap), got %f", result.HybridScore)
	}
	if !result.CriticalPenalty {
		t.Error("expected critical penalty to be applied")
	}
}

func TestComputeFullScore_InconsistencyReducesScore(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
		makeQuestion("Q-02", "C-02", "Cripto", "high", 150, 4),
	}
	// Tudo "sim" mas scan encontrou problemas no C-01
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "sim"),
		"Q-02": makeAnswer("Q-02", "C-02", "sim"),
	}
	findings := map[string][]string{
		"C-01": {"critical"},
	}

	result := ComputeFullScore(ScoreInput{
		TechnicalScore:     700,
		HasCriticalFinding: false,
		Questions:          questions,
		AnswersByQuestion:  answers,
		FindingsByControl:  findings,
		FrameworkID:        "ISO27001",
	})

	if result.ConfidenceFactor >= 1.0 {
		t.Errorf("expected F < 1.0 due to inconsistency, got %f", result.ConfidenceFactor)
	}
	if len(result.Inconsistencies) == 0 {
		t.Error("expected at least 1 inconsistency")
	}
}

func TestComputeFullScore_DomainScoresPopulated(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Segurança de Rede", "critical", 300, 5),
		makeQuestion("Q-02", "C-02", "Criptografia", "high", 150, 4),
		makeQuestion("Q-03", "C-06", "Monitoramento", "medium", 60, 2),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "sim"),
		"Q-02": makeAnswer("Q-02", "C-02", "sim"),
		"Q-03": makeAnswer("Q-03", "C-06", "nao"),
	}

	result := ComputeFullScore(ScoreInput{
		TechnicalScore:     900,
		HasCriticalFinding: false,
		Questions:          questions,
		AnswersByQuestion:  answers,
		FindingsByControl:  map[string][]string{},
		FrameworkID:        "ISO27001",
	})

	if len(result.DomainScores) != 3 {
		t.Errorf("expected 3 domain scores, got %d", len(result.DomainScores))
	}
	if result.DomainScores["Segurança de Rede"] != 100 {
		t.Errorf("expected 100%% for Rede, got %f", result.DomainScores["Segurança de Rede"])
	}
	if result.DomainScores["Monitoramento"] != 0 {
		t.Errorf("expected 0%% for Monitoramento, got %f", result.DomainScores["Monitoramento"])
	}
}

func TestComputeFullScore_DomainScoresPenalizedByFindings(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Segurança de Rede", "critical", 300, 5),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "sim"),
	}
	findings := map[string][]string{
		"C-01": {"critical"},
	}

	result := ComputeFullScore(ScoreInput{
		TechnicalScore:     600,
		HasCriticalFinding: false,
		Questions:          questions,
		AnswersByQuestion:  answers,
		FindingsByControl:  findings,
		FrameworkID:        "ISO27001",
	})

	// Deve ser 100% * 0.3 = 30% (penalidade por critical finding)
	if result.DomainScores["Segurança de Rede"] != 30 {
		t.Errorf("expected 30%% (penalized), got %f", result.DomainScores["Segurança de Rede"])
	}
}

// --- Edge Cases ---

func TestComputeFullScore_ZeroEverything(t *testing.T) {
	result := ComputeFullScore(ScoreInput{
		TechnicalScore:     0,
		HasCriticalFinding: false,
		Questions:          nil,
		AnswersByQuestion:  nil,
		FindingsByControl:  nil,
		FrameworkID:        "ISO27001",
	})

	if result.HybridScore != 0 {
		t.Errorf("expected 0, got %f", result.HybridScore)
	}
	if result.ScoreCategory != "F" {
		t.Errorf("expected F, got %s", result.ScoreCategory)
	}
}

func TestComputeFullScore_NoCriticalPenaltyWhenBelowCap(t *testing.T) {
	questions := []domain.Question{
		makeQuestion("Q-01", "C-01", "Rede", "critical", 300, 5),
	}
	answers := map[string]*domain.Answer{
		"Q-01": makeAnswer("Q-01", "C-01", "nao"),
	}

	result := ComputeFullScore(ScoreInput{
		TechnicalScore:     300,
		HasCriticalFinding: true,
		Questions:          questions,
		AnswersByQuestion:  answers,
		FindingsByControl:  map[string][]string{},
		FrameworkID:        "ISO27001",
	})

	// Score already below 500, so penalty should not be applied
	if result.CriticalPenalty {
		t.Error("critical penalty should not apply when score is already below cap")
	}
}

// --- ComputeDomainScores (P1.1 rating por eixo a partir de AuditFindings) ---

func TestComputeDomainScores(t *testing.T) {
	findings := []*domain.AuditFinding{
		{ISODomain: "A.10.1.1", ISOTitle: "Criptografia", ScoreDeduction: 100},
		{ISODomain: "A.10.1.1", ISOTitle: "Criptografia", ScoreDeduction: 50},
		{ISODomain: "A.13.2.1", ISOTitle: "Comunicações", ScoreDeduction: 200},
	}
	got := ComputeDomainScores(findings)
	if len(got) != 2 {
		t.Fatalf("ComputeDomainScores: got %d domains, want 2", len(got))
	}
	byDomain := make(map[string]domain.DomainScore)
	for _, d := range got {
		byDomain[d.DomainID] = d
	}
	// A.10.1.1: 1000 - 150 = 850 -> B
	if d, ok := byDomain["A.10.1.1"]; !ok {
		t.Error("missing domain A.10.1.1")
	} else if d.Score != 850 || d.Grade != "B" {
		t.Errorf("A.10.1.1: score=%d grade=%s, want 850 B", d.Score, d.Grade)
	}
	// A.13.2.1: 1000 - 200 = 800 -> B
	if d, ok := byDomain["A.13.2.1"]; !ok {
		t.Error("missing domain A.13.2.1")
	} else if d.Score != 800 || d.Grade != "B" {
		t.Errorf("A.13.2.1: score=%d grade=%s, want 800 B", d.Score, d.Grade)
	}
}

func TestComputeDomainScores_Empty(t *testing.T) {
	got := ComputeDomainScores(nil)
	if len(got) != 0 {
		t.Errorf("ComputeDomainScores(nil): got %d, want 0", len(got))
	}
	got = ComputeDomainScores([]*domain.AuditFinding{})
	if len(got) != 0 {
		t.Errorf("ComputeDomainScores([]): got %d, want 0", len(got))
	}
}
