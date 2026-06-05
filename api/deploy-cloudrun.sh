#!/bin/bash
# deploy-cloudrun.sh — One-command deployment to Google Cloud Run
# Usage: ./deploy-cloudrun.sh [project-id] [region]
set -euo pipefail

PROJECT_ID=${1:-$(gcloud config get-value project)}
REGION=${2:-us-central1}
SERVICE_NAME="scamshield-le-api"
IMAGE="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "==> Deploying ScamShield LE API"
echo "    Project: ${PROJECT_ID}"
echo "    Region:  ${REGION}"
echo "    Image:   ${IMAGE}"

# Build and push image
echo ""
echo "==> Building Docker image..."
gcloud builds submit --tag "${IMAGE}" .

# Deploy to Cloud Run
echo ""
echo "==> Deploying to Cloud Run..."
gcloud run deploy "${SERVICE_NAME}" \
  --image "${IMAGE}" \
  --platform managed \
  --region "${REGION}" \
  --allow-unauthenticated \
  --port 3000 \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10 \
  --set-env-vars "NODE_ENV=production" \
  --set-secrets "FIREBASE_PROJECT_ID=scamshield-firebase-project-id:latest,FIREBASE_PRIVATE_KEY=scamshield-firebase-private-key:latest,FIREBASE_CLIENT_EMAIL=scamshield-firebase-client-email:latest,LE_API_SECRET=scamshield-le-api-secret:latest,AGENCY_REGISTRATION_SECRET=scamshield-registration-secret:latest" \
  --project "${PROJECT_ID}"

SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" --region "${REGION}" --format "value(status.url)")
echo ""
echo "✅ Deployed successfully!"
echo "   Service URL: ${SERVICE_URL}"
echo "   Health:      ${SERVICE_URL}/health"
echo ""
echo "Next steps:"
echo "  1. Set ALLOWED_ORIGINS in Cloud Run env vars to restrict CORS"
echo "  2. Register your first agency: POST ${SERVICE_URL}/api/v1/agencies/register"
echo "  3. Set up uptime monitoring on ${SERVICE_URL}/health"
