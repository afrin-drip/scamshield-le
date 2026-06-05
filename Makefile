.PHONY: help dev build lint test seed deploy-api deploy-le-portal deploy-retirement-portal deploy-web
DC := $(shell docker compose version > /dev/null 2>&1 && echo "docker compose" || echo "docker-compose")
-include .env
export

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-28s\033[0m %s\n", $$1, $$2}'

dev: ## Start all services via Docker Compose
	$(DC) up --build

build: ## Build all modules
	cd api && npm run build
	cd le-portal && npm run build
	cd retirement-portal && npm run build
	cd web && npm run build
	cd landing && npm run build

lint: ## Run linters across all modules
	cd api && npm run lint
	cd le-portal && npm run lint
	cd retirement-portal && npm run lint

test: ## Run all tests
	cd app && ./gradlew test
	cd api && npm test

seed: ## Seed Firestore with sample data
	cd api && npx ts-node src/scripts/seed.ts

deploy-api: ## Deploy API to Cloud Run
	gcloud builds submit ./api --tag gcr.io/$(GCP_PROJECT)/scamshield-api
	gcloud run deploy scamshield-api --image gcr.io/$(GCP_PROJECT)/scamshield-api --region us-central1 --platform managed --allow-unauthenticated

deploy-le-portal: ## Deploy LE Portal to Vercel
	cd le-portal && npx vercel --prod

deploy-retirement-portal: ## Deploy Retirement Portal to Vercel
	cd retirement-portal && npx vercel --prod

deploy-web: ## Deploy Family Web Dashboard to Vercel
	cd web && npx vercel --prod