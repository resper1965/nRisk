package middleware

import (
	"context"
	"net/http"
	"strings"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/nrisk/backend/pkg/logger"

	firebase "firebase.google.com/go/v4"
	"google.golang.org/api/option"
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
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "missing Authorization header"})
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || strings.ToLower(parts[0]) != "bearer" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid Authorization header format"})
			return
		}

		tokenString := parts[1]
		claims, err := verifyIDToken(c.Request.Context(), tokenString)
		if err != nil {
			logger.Warn("jwt verification failed", map[string]interface{}{
				"error": err.Error(),
			})
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid or expired token"})
			return
		}

		// Extrai tenant_id das custom claims (definidas no Firebase Auth / Identity Platform).
		tenantID, _ := claims["tenant_id"].(string)
		if tenantID == "" {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "tenant_id not found in token claims"})
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

// verifyIDToken verifica o ID token do Firebase e retorna as claims.
func verifyIDToken(ctx context.Context, tokenString string) (map[string]interface{}, error) {
	var app *firebase.App
	var err error
	credsPath := os.Getenv("GOOGLE_APPLICATION_CREDENTIALS")
	if credsPath != "" {
		app, err = firebase.NewApp(ctx, nil, option.WithCredentialsFile(credsPath))
	} else {
		app, err = firebase.NewApp(ctx, nil) // usa ADC em Cloud Run
	}
	if err != nil {
		return nil, err
	}

	client, err := app.Auth(ctx)
	if err != nil {
		return nil, err
	}

	token, err := client.VerifyIDToken(ctx, tokenString)
	if err != nil {
		return nil, err
	}

	return token.Claims, nil
}
