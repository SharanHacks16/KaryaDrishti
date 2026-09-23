.PHONY: help install dev backend frontend seed test migrate clean

help:
	@echo "KARYADRISHTI Development Commands:"
	@echo "  make install     - Install backend & frontend dependencies"
	@echo "  make seed        - Populate database with seed development data"
	@echo "  make backend     - Run FastAPI backend server"
	@echo "  make frontend    - Run Vite React frontend app"
	@echo "  make test        - Run backend and frontend tests"
	@echo "  make migrate     - Run database migrations"

install:
	cd backend && python -m pip install -r requirements.txt
	cd frontend && npm install

seed:
	python scripts/seed_database.py

backend:
	cd backend && uvicorn app.main:app --reload --port 8000

frontend:
	cd frontend && npm run dev

test:
	cd backend && pytest
	cd frontend && npm test

migrate:
	cd backend && alembic upgrade head
