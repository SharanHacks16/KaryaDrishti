# KARYADRISHTI ( कार्यदृष्टि )
> **"See What’s Ahead. Act Before It’s Late."**  
> *SIH 2026 — SIH26103 Web-Based Integrated Project-Monitoring Platform*

KARYADRISHTI is an institutional decision-support and early-warning portal designed around PAIMANA government infrastructure project observations. It transforms historical and current project observations into a unified intelligence experience covering portfolio monitoring, project exploration, predictive risk, explainable SHAP signals, benchmarking, alerts, scenario analysis, and auditable reporting.

---

## Technical Architecture Overview

```
PAIMANA Files → Raw Storage → Ingestion/Validation → PostgreSQL Data Model → Feature Engine → ML Engine  → FastAPI Services → React Command Center
```

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Recharts, React Router v6, TanStack Query.
- **Backend**: Python 3.11+, FastAPI, Pydantic v2, SQLAlchemy 2.0, Alembic, PBKDF2 Password Hashing, JWT Sessions.
- **Database**: PostgreSQL (production-ready) / SQLite (development default).
- **ML / Intelligence**: XGBoost/LightGBM risk estimators, SHAP feature attributions for explainable risk signals, temporal ordering & leakage checks.

---

## Directory Blueprint

```
karyadrishti/
├── docs/                                  # Source-of-truth specification documents
├── frontend/                              # React + Vite + TypeScript application
│   ├── src/
│   │   ├── app/                           # Router configuration
│   │   ├── components/layout/             # Public & Portal AppShell, Sidebar, UserMenu, Guards
│   │   ├── context/                       # AuthContext & Session management
│   │   ├── pages/                         # Landing, Login, CommandCenter, ProjectExplorer, ProjectIntelligence, etc.
│   │   ├── services/                      # API client & offline resilience layer
│   │   ├── types/                         # TypeScript interface schemas
│   │   └── index.css                      # Command center CSS design system
│   ├── package.json
│   └── vite.config.ts
├── backend/                               # FastAPI application
│   ├── app/
│   │   ├── api/v1/                        # Auth, Users, Portfolio, Projects, Risk, Alerts endpoints
│   │   ├── core/                          # Security, Config, RBAC Permissions, Audit logging
│   │   ├── database/                      # SQLAlchemy Engine, Session, Base
│   │   ├── models/                        # Domain models (User, Project, Snapshot, Prediction, Alert, etc.)
│   │   ├── schemas/                       # Pydantic request/response schemas
│   │   └── services/                      # Business logic layer
│   └── alembic.ini                        # Database migration configuration
├── ml/                                    # ML models, feature engineering & SHAP explainability
├── data_pipeline/                         # PAIMANA ingestion & extraction pipeline
├── data/                                  # Development dataset storage
├── scripts/                               # Database seeding (`seed_database.py`)
├── docker-compose.yml                     # Docker orchestrator
├── Makefile                               # Developer shortcut commands
└── README.md
```

---

## Getting Started

### 1. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 2. Backend Setup & Seeding
```bash
# Install backend requirements
cd backend
python -m pip install -r requirements.txt

# Run Database Seed Script (Populates SQLite / PostgreSQL with PAIMANA sample data)
python ../scripts/seed_database.py

# Start FastAPI Backend Server
uvicorn app.main:app --reload --port 8000
```
*API Swagger Documentation will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Application will be available at: [http://localhost:5173](http://localhost:5173)*

---

## Default Development Credentials

| Role | Username | Password | Email |
| :--- | :--- | :--- | :--- |
| **Portfolio/Ministry Officer** | `officer` | `password123` | `officer@morth.gov.in` |
| **Analyst** | `analyst` | `password123` | `analyst@niti.gov.in` |
| **Administrator** | `admin` | `password123` | `admin@karyadrishti.gov.in` |

---

## Development & Verification Commands

- **Run Frontend Production Build**: `cd frontend && npm run build`
- **Run TypeScript Type Verification**: `cd frontend && npx tsc --noEmit`
- **Seed Database**: `python scripts/seed_database.py`
- **Run Docker Environment**: `docker-compose up --build`
