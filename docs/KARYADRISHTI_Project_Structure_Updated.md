KARYADRISHTI — PROJECT STRUCTURE

Production-style monorepo aligned with PRD v2.0

Updated to include the public hero experience, authentication/RBAC, logout/session management, profile/settings, audit logging and the expanded portal feature set.

1. Recommended Repository

karyadrishti/│├── frontend/                              # React + Vite + TypeScript portal│   ├── public/│   │   ├── logo/│   │   ├── icons/│   │   └── assets/│   ││   ├── src/│   │   ├── app/│   │   │   ├── router.tsx│   │   │   ├── providers.tsx│   │   │   ├── config.ts│   │   │   └── routeGuards.tsx             # auth/RBAC protection│   │   ││   │   ├── components/│   │   │   ├── ui/│   │   │   ├── layout/│   │   │   │   ├── PublicNavbar.tsx│   │   │   │   ├── AppShell.tsx│   │   │   │   ├── Sidebar.tsx│   │   │   │   ├── UserMenu.tsx│   │   │   │   └── ProtectedRoute.tsx│   │   │   ├── auth/│   │   │   │   ├── LoginForm.tsx│   │   │   │   ├── SessionGuard.tsx│   │   │   │   └── LogoutButton.tsx│   │   │   ├── hero/│   │   │   │   ├── HeroSection.tsx│   │   │   │   ├── CapabilityCards.tsx│   │   │   │   └── TrustSection.tsx│   │   │   ├── charts/│   │   │   ├── maps/│   │   │   ├── project/│   │   │   ├── risk/│   │   │   ├── alerts/│   │   │   ├── benchmark/│   │   │   ├── scenario/│   │   │   ├── reports/│   │   │   └── assistant/│   │   ││   │   ├── pages/│   │   │   ├── Landing/│   │   │   ├── Login/│   │   │   ├── CommandCenter/│   │   │   ├── ProjectExplorer/│   │   │   ├── ProjectIntelligence/│   │   │   ├── RiskCenter/│   │   │   ├── Alerts/│   │   │   ├── Benchmarking/│   │   │   ├── Analytics/│   │   │   ├── Reports/│   │   │   ├── ScenarioSimulator/│   │   │   ├── Assistant/│   │   │   ├── Profile/│   │   │   ├── Settings/│   │   │   └── Admin/│   │   ││   │   ├── services/│   │   │   ├── api.ts│   │   │   ├── auth.ts│   │   │   ├── portfolio.ts│   │   │   ├── projects.ts│   │   │   ├── predictions.ts│   │   │   ├── risk.ts│   │   │   ├── alerts.ts│   │   │   ├── benchmarks.ts│   │   │   ├── scenarios.ts│   │   │   ├── reports.ts│   │   │   └── assistant.ts│   │   ││   │   ├── hooks/│   │   │   ├── useAuth.ts│   │   │   ├── usePermissions.ts│   │   │   └── useSession.ts│   │   ├── store/│   │   ├── types/│   │   ├── utils/│   │   └── styles/│   ││   ├── package.json│   ├── tsconfig.json│   ├── vite.config.ts│   └── Dockerfile│├── backend/                               # FastAPI application│   ├── app/│   │   ├── main.py│   │   ├── api/v1/│   │   │   ├── auth.py│   │   │   ├── users.py│   │   │   ├── portfolio.py│   │   │   ├── projects.py│   │   │   ├── predictions.py│   │   │   ├── risk.py│   │   │   ├── alerts.py│   │   │   ├── benchmarks.py│   │   │   ├── scenarios.py│   │   │   ├── reports.py│   │   │   ├── assistant.py│   │   │   └── admin.py│   │   ├── core/│   │   │   ├── config.py│   │   │   ├── security.py│   │   │   ├── permissions.py│   │   │   ├── logging.py│   │   │   └── audit.py│   │   ├── database/│   │   │   ├── session.py│   │   │   ├── base.py│   │   │   └── migrations/│   │   ├── models/│   │   │   ├── user.py│   │   │   ├── role.py│   │   │   ├── project.py│   │   │   ├── snapshot.py│   │   │   ├── prediction.py│   │   │   ├── risk_signal.py│   │   │   ├── alert.py│   │   │   ├── benchmark.py│   │   │   ├── scenario.py│   │   │   ├── audit_log.py│   │   │   └── model_version.py│   │   ├── schemas/│   │   ├── services/│   │   │   ├── auth_service.py│   │   │   ├── user_service.py│   │   │   ├── project_service.py│   │   │   ├── portfolio_service.py│   │   │   ├── prediction_service.py│   │   │   ├── risk_service.py│   │   │   ├── alert_service.py│   │   │   ├── benchmark_service.py│   │   │   ├── scenario_service.py│   │   │   ├── report_service.py│   │   │   └── assistant_service.py│   │   └── utils/│   ├── tests/│   │   ├── auth/│   │   ├── api/│   │   ├── security/│   │   └── services/│   ├── requirements.txt│   ├── alembic.ini│   └── Dockerfile│├── ml/│   ├── notebooks/│   ├── src/│   │   ├── preprocessing/│   │   ├── features/│   │   ├── labels/│   │   ├── models/│   │   │   ├── baselines/│   │   │   ├── cost_overrun/│   │   │   ├── schedule_overrun/│   │   │   └── risk/│   │   ├── explainability/│   │   ├── evaluation/│   │   └── inference/│   ├── artifacts/│   │   ├── models/│   │   └── metadata/│   └── requirements.txt│├── data_pipeline/│   ├── sources/paimana/│   ├── extraction/│   │   ├── pdf/│   │   ├── csv/│   │   └── excel/│   ├── cleaning/│   ├── validation/│   ├── transformation/│   ├── loaders/│   └── run_pipeline.py│├── data/│   ├── raw/│   ├── extracted/│   ├── processed/│   ├── features/│   └── sample/│├── scripts/│   ├── seed_database.py│   ├── seed_users.py│   ├── run_predictions.py│   ├── refresh_data.py│   └── generate_demo_data.py│├── tests/│   ├── data/│   ├── ml/│   ├── backend/│   ├── frontend/│   ├── security/│   └── integration/│├── docs/│   ├── PRD/│   ├── architecture/│   ├── design/│   ├── api/│   ├── data_dictionary/│   ├── methodology/│   └── security/│├── infra/│   ├── docker/│   ├── deployment/│   └── monitoring/│├── .env.example├── .gitignore├── docker-compose.yml├── Makefile├── README.md└── LICENSE

2. Frontend Page & Route Map

Route

Page

Access

/

Landing / Hero

Public

/login

Login

Public

/app

Command Center

Authenticated

/projects

Project Explorer

Authenticated

/projects/:id

Project Intelligence

Authenticated

/risk

Risk Center

Authenticated

/alerts

Early Warning Center

Authenticated

/benchmarking

Benchmarking

Authenticated

/analytics

Analytics

Authenticated

/reports

Reports

Authenticated

/scenarios

Scenario Simulator

Authenticated

/assistant

Project Assistant

Authenticated / optional

/profile

Profile

Authenticated

/settings

Preferences/Security

Authenticated

/admin

Administration

Admin/authorised roles

3. Ownership by Major Folder

frontend/ — Public landing experience plus the authenticated government portal, navigation, auth guards, charts and feature UI.

backend/ — Authentication, authorisation, business logic, API contracts, database access, reports, alerts and orchestration.

ml/ — Prediction-time-safe features, labels, training, evaluation, explainability and versioned inference artifacts.

data_pipeline/ — PAIMANA ingestion, extraction, cleaning, validation, provenance and historical reconstruction.

data/ — Local/dev datasets; sensitive or large source material should not be committed.

tests/ — Data, ML, backend, frontend, security and end-to-end tests.

docs/ — Product, architecture, UX, API, methodology and security source-of-truth.

infra/ — Containerisation, deployment and monitoring configuration.

4. Authentication & Security Structure

Use ProtectedRoute/route guards on every authenticated frontend route.

Backend authorisation is authoritative; hiding a UI element is not sufficient security.

Implement role-based permissions for Administrator, Portfolio/Ministry Officer, Project/Program Officer, Analyst and Viewer.

Support secure login, session expiry, logout, rate limiting and audit logging.

Use secure cookies or an equivalent short-lived access/refresh strategy according to the selected deployment.

Never place database credentials, JWT secrets or provider keys in frontend code.

5. Core Development Rule

Build the product as a vertical slice instead of filling every page with mocks:

Landing → Login → Protected Command Center → Project Explorer → Project Intelligence → Model Output → Explainability → Logout

Then expand into Risk Center, Alerts, What Changed?, Benchmarking, Reports, Scenario Simulator and the optional Assistant.

6. Git Branch Strategy

main — stable/demo-ready.

develop — integration.

feature/landing-auth

feature/data-pipeline

feature/ml-cost-model

feature/ml-schedule-model

feature/backend-api

feature/frontend-command-center

feature/frontend-project-intelligence

feature/alerts-benchmarking

feature/reports-simulator

feature/assistant

7. Environment Variables

Typical variables:

DATABASE_URL=JWT_SECRET=CORS_ORIGINS=GEMINI_API_KEY=MODEL_ARTIFACT_PATH=PAIMANA_DATA_PATH=SESSION_COOKIE_SECURE=true

Only include variables actually required by the implementation. Never commit .env files or API keys.

8. Initial Build Order

Create repository, design tokens and public landing page.

Implement login, session handling, protected routes, RBAC and logout.

Set up PostgreSQL schema, migrations and user/role entities.

Implement PAIMANA extraction/cleaning and project snapshot history.

Build Project Explorer and Project Intelligence vertical slice.

Create feature engineering, labels, temporal validation and leakage checks.

Train baseline/candidate cost and schedule models; add SHAP.

Create risk, deterioration and benchmark services.

Build Command Center, Risk Center and Alerts.

Add What Changed?, Reports and Scenario Simulator.

Add optional grounded Assistant only after core intelligence is stable.

Complete security, data-quality, API, frontend and integration tests.

Containerise and prepare demo deployment.