package controller

import (
	"net/http"
	"sort"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nrisk/backend/internal/assessment"
	"github.com/nrisk/backend/internal/domain"
	"github.com/nrisk/backend/internal/middleware"
	"github.com/nrisk/backend/internal/repository/firestore"
	"github.com/nrisk/backend/pkg/logger"
)

// PortfolioController fornece visao consolidada do portfolio de fornecedores (Fase 5 TPRA).
type PortfolioController struct {
	supplierRepo *firestore.SupplierRepository
	scanRepo     *firestore.ScanRepository
	snapshotRepo *firestore.ScoreSnapshotRepository
	answerRepo   *firestore.AnswerRepository
}

// NewPortfolioController cria um novo PortfolioController.
func NewPortfolioController(
	supplierRepo *firestore.SupplierRepository,
	scanRepo *firestore.ScanRepository,
	snapshotRepo *firestore.ScoreSnapshotRepository,
	answerRepo *firestore.AnswerRepository,
) *PortfolioController {
	return &PortfolioController{
		supplierRepo: supplierRepo,
		scanRepo:     scanRepo,
		snapshotRepo: snapshotRepo,
		answerRepo:   answerRepo,
	}
}

// supplierScoreInfo agrega dados de score de um supplier para uso interno.
type supplierScoreInfo struct {
	Supplier       domain.Supplier
	LatestScore    *domain.ScoreBreakdown
	ScoreComputedAt *time.Time
	HasAssessment  bool
	AnswerCount    int
}

// getSupplierScores carrega suppliers e seus scores mais recentes.
func (pc *PortfolioController) getSupplierScores(c *gin.Context, tenantID string) ([]supplierScoreInfo, error) {
	suppliers, err := pc.supplierRepo.List(c.Request.Context(), tenantID, "", "")
	if err != nil {
		return nil, err
	}

	var results []supplierScoreInfo
	for _, s := range suppliers {
		info := supplierScoreInfo{Supplier: s}

		// Buscar ultimo scan do dominio
		if pc.scanRepo != nil {
			scan, _ := pc.scanRepo.GetLatestByDomain(c.Request.Context(), tenantID, s.Domain)
			if scan != nil && pc.snapshotRepo != nil {
				snapshots, _ := pc.snapshotRepo.ListByScan(c.Request.Context(), tenantID, scan.ID, 1)
				if len(snapshots) > 0 {
					info.LatestScore = &snapshots[0].ScoreBreakdown
					info.ScoreComputedAt = &snapshots[0].ComputedAt
					info.HasAssessment = true
				}
			}
		}

		// Contar respostas do supplier
		if pc.answerRepo != nil {
			answers, _ := pc.answerRepo.ListBySupplier(c.Request.Context(), tenantID, s.ID)
			info.AnswerCount = len(answers)
			if len(answers) > 0 {
				info.HasAssessment = true
			}
		}

		results = append(results, info)
	}
	return results, nil
}

// GetPortfolioSummary retorna metricas agregadas do portfolio de fornecedores.
// GET /api/v1/portfolio/summary
func (pc *PortfolioController) GetPortfolioSummary(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	infos, err := pc.getSupplierScores(c, tenantIDStr)
	if err != nil {
		logger.Error("failed to load portfolio data", map[string]interface{}{
			"error":  err.Error(),
			"tenant": tenantIDStr,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to load portfolio", "code": "LOAD_FAILED"})
		return
	}

	totalSuppliers := len(infos)
	assessedCount := 0
	scoredCount := 0
	totalScore := 0.0
	atRiskCount := 0
	totalInconsistencyRate := 0.0
	inconsistencySuppliers := 0

	criticalityBreakdown := map[string]int{
		"critical": 0, "high": 0, "medium": 0, "low": 0,
	}

	for _, info := range infos {
		criticalityBreakdown[info.Supplier.Criticality]++

		if info.HasAssessment {
			assessedCount++
		}

		if info.LatestScore != nil {
			scoredCount++
			totalScore += info.LatestScore.HybridScore

			cat := info.LatestScore.ScoreCategory
			if cat == "D" || cat == "E" || cat == "F" {
				atRiskCount++
			}

			// Taxa de inconsistencia por supplier
			if len(info.LatestScore.Inconsistencies) > 0 {
				inconsistencySuppliers++
				totalInconsistencyRate += float64(len(info.LatestScore.Inconsistencies))
			}
		}
	}

	avgScore := 0.0
	if scoredCount > 0 {
		avgScore = totalScore / float64(scoredCount)
	}

	coverageRate := 0.0
	if totalSuppliers > 0 {
		coverageRate = float64(assessedCount) / float64(totalSuppliers) * 100
	}

	avgInconsistencyRate := 0.0
	if inconsistencySuppliers > 0 {
		avgInconsistencyRate = totalInconsistencyRate / float64(inconsistencySuppliers)
	}

	avgCategory := "N/A"
	if scoredCount > 0 {
		avgCategory = assessment.ScoreCategory(avgScore)
	}

	c.JSON(http.StatusOK, gin.H{
		"total_suppliers":       totalSuppliers,
		"assessed_suppliers":    assessedCount,
		"scored_suppliers":      scoredCount,
		"coverage_rate":         coverageRate,
		"average_score":         avgScore,
		"average_category":      avgCategory,
		"at_risk_count":         atRiskCount,
		"avg_inconsistencies":   avgInconsistencyRate,
		"criticality_breakdown": criticalityBreakdown,
	})
}

// SupplierListItem representa um fornecedor na listagem do portfolio.
type SupplierListItem struct {
	ID           string   `json:"id"`
	Name         string   `json:"name"`
	Domain       string   `json:"domain"`
	Criticality  string   `json:"criticality"`
	Status       string   `json:"status"`
	Category     string   `json:"category,omitempty"`
	Score        *float64 `json:"score"`
	ScoreCategory *string `json:"score_category"`
	AnswerCount  int      `json:"answer_count"`
	HasAssessment bool    `json:"has_assessment"`
	LastScored   *time.Time `json:"last_scored,omitempty"`
}

// GetPortfolioSuppliers retorna lista de fornecedores com score, tendencia e criticidade.
// GET /api/v1/portfolio/suppliers?criticality=critical&sort=score_asc
func (pc *PortfolioController) GetPortfolioSuppliers(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	critFilter := c.Query("criticality")
	sortParam := c.Query("sort")

	infos, err := pc.getSupplierScores(c, tenantIDStr)
	if err != nil {
		logger.Error("failed to load portfolio suppliers", map[string]interface{}{
			"error":  err.Error(),
			"tenant": tenantIDStr,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to load portfolio", "code": "LOAD_FAILED"})
		return
	}

	var items []SupplierListItem
	for _, info := range infos {
		if critFilter != "" && info.Supplier.Criticality != critFilter {
			continue
		}

		item := SupplierListItem{
			ID:            info.Supplier.ID,
			Name:          info.Supplier.Name,
			Domain:        info.Supplier.Domain,
			Criticality:   info.Supplier.Criticality,
			Status:        info.Supplier.Status,
			Category:      info.Supplier.Category,
			AnswerCount:   info.AnswerCount,
			HasAssessment: info.HasAssessment,
			LastScored:    info.ScoreComputedAt,
		}

		if info.LatestScore != nil {
			score := info.LatestScore.HybridScore
			cat := info.LatestScore.ScoreCategory
			item.Score = &score
			item.ScoreCategory = &cat
		}

		items = append(items, item)
	}

	// Ordenacao
	switch sortParam {
	case "score_asc":
		sort.Slice(items, func(i, j int) bool {
			si, sj := scoreVal(items[i].Score), scoreVal(items[j].Score)
			return si < sj
		})
	case "score_desc":
		sort.Slice(items, func(i, j int) bool {
			si, sj := scoreVal(items[i].Score), scoreVal(items[j].Score)
			return si > sj
		})
	case "name":
		sort.Slice(items, func(i, j int) bool {
			return items[i].Name < items[j].Name
		})
	case "criticality":
		critOrder := map[string]int{"critical": 0, "high": 1, "medium": 2, "low": 3}
		sort.Slice(items, func(i, j int) bool {
			return critOrder[items[i].Criticality] < critOrder[items[j].Criticality]
		})
	default:
		// Default: criticality desc then score asc (pior primeiro)
		critOrder := map[string]int{"critical": 0, "high": 1, "medium": 2, "low": 3}
		sort.Slice(items, func(i, j int) bool {
			ci, cj := critOrder[items[i].Criticality], critOrder[items[j].Criticality]
			if ci != cj {
				return ci < cj
			}
			return scoreVal(items[i].Score) < scoreVal(items[j].Score)
		})
	}

	if items == nil {
		items = []SupplierListItem{}
	}

	c.JSON(http.StatusOK, gin.H{
		"suppliers": items,
		"total":     len(items),
	})
}

// GetRiskDistribution retorna a distribuicao de scores A-F do portfolio.
// GET /api/v1/portfolio/risk-distribution
func (pc *PortfolioController) GetRiskDistribution(c *gin.Context) {
	tenantID, exists := c.Get(middleware.TenantIDKey)
	if !exists {
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "tenant_id not in context", "code": "INTERNAL"})
		return
	}
	tenantIDStr := tenantID.(string)

	infos, err := pc.getSupplierScores(c, tenantIDStr)
	if err != nil {
		logger.Error("failed to load risk distribution", map[string]interface{}{
			"error":  err.Error(),
			"tenant": tenantIDStr,
		})
		c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{"error": "failed to load distribution", "code": "LOAD_FAILED"})
		return
	}

	distribution := map[string]int{
		"A": 0, "B": 0, "C": 0, "D": 0, "E": 0, "F": 0,
	}
	unscored := 0

	// Distribuicao por criticidade x categoria
	heatmap := make(map[string]map[string]int)
	for _, crit := range []string{"critical", "high", "medium", "low"} {
		heatmap[crit] = map[string]int{
			"A": 0, "B": 0, "C": 0, "D": 0, "E": 0, "F": 0, "unscored": 0,
		}
	}

	for _, info := range infos {
		if info.LatestScore != nil {
			cat := info.LatestScore.ScoreCategory
			distribution[cat]++
			heatmap[info.Supplier.Criticality][cat]++
		} else {
			unscored++
			heatmap[info.Supplier.Criticality]["unscored"]++
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"distribution":    distribution,
		"unscored":        unscored,
		"total":           len(infos),
		"criticality_heatmap": heatmap,
	})
}

// scoreVal retorna 0 se nil, senao o valor.
func scoreVal(s *float64) float64 {
	if s == nil {
		return -1 // sem score vai pro topo (pior caso)
	}
	return *s
}
