.PHONY: help dev lint test test-api test-web generate-types

help:
	@echo "DS-Connect Developer CLI"
	@echo "  make dev             - Start local development environment"
	@echo "  make generate-types  - Synchronize FastAPI OpenAPI schema with Next.js TypeScript types"
	@echo "  make test            - Run all test suites (Frontend + Backend)"

dev:
	docker-compose up -d redis
	@echo "Redis running on :6379. Ready to start API and Web apps."

generate-types:
	cmd.exe /c "npx openapi-typescript http://localhost:8000/openapi.json -o apps/web/src/types/api.d.ts"
