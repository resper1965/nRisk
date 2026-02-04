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
