package middleware

import (
	"context"
	"net/http"
	"os"
	"strings"
	"sync"

	"github.com/gin-gonic/gin"
	"github.com/nrisk/backend/pkg/logger"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"google.golang.org/api/option"
)

var (
	authClient *auth.Client
	authOnce   sync.Once
	authErr    error
)

const (
	// TenantIDKey é a chave usada no gin.Context para o tenant_id.
	TenantIDKey = "tenant_id"
	// UserIDKey é a chave usada no gin.Context para o user_id (uid do Firebase).
	UserIDKey = "user_id"
)

// AuthMiddleware valida o JWT do GCP Identity Platform (Firebase Auth),
// extrai tenant_id das custom claims e injeta no gin.Context.
func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing Authorization header", "code": "MISSING_AUTH"})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid Authorization header format", "code": "INVALID_AUTH_FORMAT"})
			return
		}

		tokenString := parts[1]
		claims, err := verifyIDToken(c.Request.Context(), tokenString)
		if err != nil {
			logger.Warn("jwt verification failed", map[string]interface{}{
				"error": err.Error(),
			})
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token", "code": "INVALID_TOKEN"})
			return
		}

		// Extrai tenant_id das custom claims (definidas no Firebase Auth / Identity Platform).
		tenantID, _ := claims["tenant_id"].(string)
		if tenantID == "" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "tenant_id not found in token claims", "code": "MISSING_TENANT_ID"})
			return
		}

		userID, _ := claims["uid"].(string)
		if userID == "" {
			userID, _ = claims["user_id"].(string)
		}
		c.Set(TenantIDKey, tenantID)
		c.Set(UserIDKey, userID)
		c.Next()
	}
}

// initAuthClient inicializa o cliente Firebase Auth uma única vez (singleton).
func initAuthClient(ctx context.Context) (*auth.Client, error) {
	authOnce.Do(func() {
		var app *firebase.App
		credsPath := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
		if credsPath != "" {
			app, authErr = firebase.NewApp(ctx, nil, option.WithCredentialsFile(credsPath))
		} else {
			app, authErr = firebase.NewApp(ctx, nil) // ADC em Cloud Run
		}
		if authErr != nil {
			return
		}
		authClient, authErr = app.Auth(ctx)
	})
	return authClient, authErr
}

// verifyIDToken verifica o ID token do Firebase e retorna as claims.
// Reutiliza o cliente Auth (singleton) para evitar init por request.
func verifyIDToken(ctx context.Context, tokenString string) (map[string]interface{}, error) {
	client, err := initAuthClient(ctx)
	if err != nil {
		return nil, err
	}
	token, err := client.VerifyIDToken(ctx, tokenString)
	if err != nil {
		return nil, err
	}
	return token.Claims, nil
}
