package assessment

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/nrisk/backend/internal/domain"
)

// QuestionsFile representa o arquivo assessment_questions.json.
type QuestionsFile struct {
	Version   string `json:"version"`
	Frameworks []struct {
		ID        string           `json:"id"`
		Name      string           `json:"name"`
		Questions []domain.Question `json:"questions"`
	} `json:"frameworks"`
}

// trackOrder define a hierarquia de trilhas: bronze < silver < gold.
var trackOrder = map[string]int{"bronze": 1, "silver": 2, "gold": 3}

// LoadQuestionnaire carrega perguntas do framework informado.
func LoadQuestionnaire(path, frameworkID string) (*domain.Questionnaire, error) {
	if path == "" {
		path = "assessment_questions.json"
	}
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, fmt.Errorf("erro ao ler assessment_questions: %w", err)
	}
	var qf QuestionsFile
	if err := json.Unmarshal(data, &qf); err != nil {
		return nil, fmt.Errorf("erro ao parsear assessment_questions: %w", err)
	}
	for _, f := range qf.Frameworks {
		if f.ID == frameworkID {
			return &domain.Questionnaire{
				FrameworkID:   f.ID,
				FrameworkName: f.Name,
				Questions:     f.Questions,
			}, nil
		}
	}
	return nil, fmt.Errorf("framework %s não encontrado", frameworkID)
}

// LoadQuestionnaireByTrack carrega perguntas filtradas por trilha de maturidade.
// Bronze: apenas perguntas bronze. Silver: bronze + silver. Gold: todas.
func LoadQuestionnaireByTrack(path, frameworkID, track string) (*domain.Questionnaire, error) {
	q, err := LoadQuestionnaire(path, frameworkID)
	if err != nil {
		return nil, err
	}

	if track == "" || track == "gold" {
		return q, nil
	}

	maxLevel, ok := trackOrder[track]
	if !ok {
		maxLevel = 1
	}

	filtered := make([]domain.Question, 0, len(q.Questions))
	for _, question := range q.Questions {
		questionLevel := trackOrder[question.Track]
		if questionLevel == 0 {
			questionLevel = 1
		}
		if questionLevel <= maxLevel {
			filtered = append(filtered, question)
		}
	}

	return &domain.Questionnaire{
		FrameworkID:   q.FrameworkID,
		FrameworkName: q.FrameworkName,
		Questions:     filtered,
	}, nil
}
