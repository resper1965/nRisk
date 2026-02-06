#!/usr/bin/env bash
# Deploy da landing n.Risk no Cloud Run (projeto nrisk-486513).
# Pré-requisito: faturamento ativo no projeto (Console GCP → Billing → vincular conta).
set -e
PROJECT=nrisk-486513
REGION=us-central1
SERVICE=nrisk-landing
echo "Deploy: $SERVICE em $REGION (projeto $PROJECT)..."
gcloud config set project "$PROJECT"
gcloud run deploy "$SERVICE" \
  --source . \
  --region "$REGION" \
  --allow-unauthenticated \
  --project "$PROJECT"
echo ""
echo "--- URL do serviço (.run.app): ---"
gcloud run services describe "$SERVICE" --region "$REGION" --project "$PROJECT" --format='value(status.url)' | sed 's|https://||'
echo ""
echo "--- Domínio nrisk.ness.com.br: CNAME nrisk -> ghs.googlehosted.com. (ver README) ---"
echo "---"
