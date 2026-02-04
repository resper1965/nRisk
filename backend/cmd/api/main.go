package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"path/filepath"
	"syscall"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/nrisk/backend/internal/controller"
	"github.com/nrisk/backend/internal/middleware"
	firestore "github.com/nrisk/backend/internal/repository/firestore"
	"github.com/nrisk/backend/internal/storage"
	"github.com/nrisk/backend/pkg/logger"

	gcpfirestore "cloud.google.com/go/firestore"
	gcpstorage "cloud.google.com/go/storage"
)

func main() {
	// Logs estruturados em JSON para Cloud Logging
	logger.Info("n.Risk API starting", map[string]interface{}{
		"service": "nrisk-api",
		"env":     os.Getenv("ENV"),
	})

	ctx := context.Background()
	projectID := os.Getenv("GCP_PROJECT_ID")
	if projectID == "" {
		projectID = "nrisk-dev"
	}
	fsClient, err := gcpfirestore.NewClient(ctx, projectID)
	if err != nil {
		logger.Error("failed to create Firestore client", map[string]interface{}{"error": err.Error()})
		os.Exit(1)
	}
	defer fsClient.Close()

	scanRepo := firestore.NewScanRepository(fsClient)
	scanCtrl := controller.NewScanController(scanRepo)

	answerRepo := firestore.NewAnswerRepository(fsClient)
	var evidenceStore *storage.EvidenceStore
	if bucket := os.Getenv("GCS_EVIDENCE_BUCKET"); bucket != "" {
		sc, err := gcpstorage.NewClient(ctx)
		if err != nil {
			logger.Warn("GCS client init failed, evidence upload disabled", map[string]interface{}{"error": err.Error()})
		} else {
			defer sc.Close()
			evidenceStore = storage.NewEvidenceStore(sc, bucket)
		}
	}
	questionsPath := os.Getenv("ASSESSMENT_QUESTIONS_PATH")
	if questionsPath == "" {
		questionsPath = filepath.Join(".", "assessment_questions.json")
	}
	assessmentCtrl := controller.NewAssessmentController(answerRepo, scanRepo, evidenceStore, questionsPath)

	router := gin.New()
	router.Use(gin.Recovery())
	router.Use(middleware.SecurityHeaders())
	router.Use(requestLogger())

	// Health check (sem auth)
	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// API v1 (com auth e tenant)
	v1 := router.Group("/api/v1")
	v1.Use(middleware.AuthMiddleware())
	{
		v1.POST("/scans", scanCtrl.StartScan)
		v1.GET("/scans/:id", scanCtrl.GetScan)

		v1.GET("/assessment", assessmentCtrl.ListQuestions)
		v1.POST("/assessment/answer", assessmentCtrl.SubmitAnswer)
		v1.GET("/assessment/score", assessmentCtrl.GetHybridScore)
	}

	srv := &http.Server{
		Addr:         ":" + getPort(),
		Handler:      router,
		ReadTimeout:  15 * time.Second,
		WriteTimeout: 15 * time.Second,
		IdleTimeout:  60 * time.Second,
	}

	go func() {
		logger.Info("server listening", map[string]interface{}{"addr": srv.Addr})
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			logger.Error("server error", map[string]interface{}{"error": err.Error()})
			os.Exit(1)
		}
	}()

	// Graceful Shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	logger.Info("shutting down server", nil)
	shutdownCtx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	if err := srv.Shutdown(shutdownCtx); err != nil {
		logger.Error("server forced to shutdown", map[string]interface{}{"error": err.Error()})
		os.Exit(1)
	}
	logger.Info("server stopped", nil)
}

func getPort() string {
	if p := os.Getenv("PORT"); p != "" {
		return p
	}
	return "8080"
}

// requestLogger registra requisições em JSON para Cloud Logging.
func requestLogger() gin.HandlerFunc {
	return func(c *gin.Context) {
		start := time.Now()
		path := c.Request.URL.Path
		clientIP := c.ClientIP()
		method := c.Request.Method

		c.Next()

		latency := time.Since(start)
		status := c.Writer.Status()

		logger.Info("request", map[string]interface{}{
			"method":     method,
			"path":       path,
			"status":     status,
			"latency_ms": latency.Milliseconds(),
			"client_ip":  clientIP,
		})
	}
}
