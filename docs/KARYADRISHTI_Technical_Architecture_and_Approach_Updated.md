KARYADRISHTI — TECHNICAL ARCHITECTURE & APPROACH

Updated to PRD v2.0

1. Architecture

KARYADRISHTI follows a layered architecture in which the public web experience, secure application layer, project intelligence services, ML layer and PAIMANA data pipeline remain independently testable.

PAIMANA → Ingestion → Extraction/Cleaning → Validation → Historical Store → Feature Engineering → ML Intelligence → Decision Layer → FastAPI → Secure React Portal

Public layer: landing/hero page with no sensitive project data.

Identity layer: authentication, sessions, RBAC and audit events.

Application layer: project, portfolio, risk, alerts, benchmark, report and scenario services.

Intelligence layer: cost/schedule prediction, risk scoring, deterioration detection and explainability.

Data layer: PostgreSQL canonical project history plus source provenance.

Optional assistant layer: grounded natural-language interface over verified structured data.

2. Technology Stack

Layer

Technology

Purpose

Frontend

React + Vite + TypeScript

Portal and public landing experience

UI

Tailwind CSS + shadcn/ui + Lucide

Design system and accessible components

Charts

Recharts or Plotly

Risk, progress, cost and trend visualisation

Routing/Data

React Router + TanStack Query

Routes, protected views and API state

Backend

Python FastAPI + Pydantic

Secure APIs and application orchestration

ORM/DB

SQLAlchemy + PostgreSQL + Alembic

Persistence and migrations

Extraction

PyMuPDF, pdfplumber, Camelot

PAIMANA source extraction

Data

Pandas, NumPy, PyArrow, optional DuckDB

Transformation and analysis

Validation

Pandera + custom checks

Schema/range/continuity/data-quality checks

ML

scikit-learn + XGBoost/LightGBM

Prediction models

Explainability

SHAP

Predictive feature attribution

Testing

Pytest + frontend component/E2E tests

Reliability and regression testing

DevOps

Docker + Docker Compose

Reproducible environments

LLM

Gemini API or approved provider, optional

Grounded project Q&A

3. Authentication & Authorisation Architecture

Login → credential/identity verification → authenticated session → frontend route guard → backend permission check → protected resource.

Authentication should use secure session or short-lived token mechanisms; deployment choice must be documented.

Passwords, when locally managed, must be strongly hashed and never stored in plaintext.

RBAC roles: Administrator, Portfolio/Ministry Officer, Project/Program Officer, Analyst, Viewer.

Backend permissions are authoritative for every protected API.

Logout invalidates the session/refresh credential as applicable and clears client-side auth state.

Session expiry returns the user to login without exposing cached protected information.

Authentication failures should be rate-limited and audit logged.

Audit events should cover login success/failure, logout, role changes, significant configuration actions, report generation and other security-relevant events.

4. Core Data Model

Entity

Key Fields

Purpose

users

id, name, email/username, role_id, status

Authenticated portal users

roles/permissions

role_id, permission

RBAC

projects

project_id, name, ministry, sector, state, agency

Stable project master

project_snapshots

project_id, report_month, progress, expenditure, cost/date fields, source

Historical observations

predictions

project_id, prediction_time, cost_probability, schedule_probability, risk_score, model_version

Model outputs

risk_signals

prediction_id, feature, value, contribution/direction

Explainability

alerts

project_id, type, severity, trigger, timestamps, status

Early warnings

benchmarks

project_id, peer_group, metric, percentile

Peer comparison

scenario_results

project_id, inputs, outputs, model_version

What-if estimates

data_quality_events

source, report_period, rule, severity, details

Data-quality traceability

audit_logs

user_id, action, resource, timestamp, metadata

Security/accountability

model_versions

version, model_type, training_period, artifact_path, metrics

Model provenance

5. ML Approach

Construct prediction-time-safe features from project history.

Cost model: predict a clearly defined future cost-overrun outcome.

Schedule model: predict a clearly defined future schedule-overrun outcome.

Begin with interpretable baselines, then compare XGBoost/LightGBM or other suitable tabular models.

Risk engine: combine validated prediction outputs and documented health indicators; do not equate a raw probability with the complete risk framework.

Deterioration: initially use rolling changes/rules; introduce advanced anomaly/change-point methods only when justified by the data.

Explainability: use SHAP for tree models and label results as predictive signals, not causal root causes.

Export versioned model artifacts plus metrics and feature metadata.

6. Leakage & Temporal Validation

Every observation has a prediction cutoff T.

Only fields available at or before T can become features.

Future revised/final costs, completion outcomes or post-T information cannot leak into features.

Use time-based train/validation/test splits.

Maintain a field-availability/data dictionary by reporting period.

Flag uncertain, reclassified or anomalous source records instead of silently overwriting them.

7. Decision Layer

Risk score: documented 0–100 framework derived from validated signals.

Priority: use an explicit framework such as risk × financial exposure × urgency; publish the formula/weights used in the prototype.

Early warnings: thresholded model/rule outputs with deduplication and cooldown logic.

Benchmarking: transparent peer groups and sample sizes.

What Changed: compare selected reporting periods and surface material field changes.

All decision outputs retain project, reporting-period and model/rule provenance.

8. API Surface

POST /api/v1/auth/login

POST /api/v1/auth/logout

POST /api/v1/auth/refresh (if token refresh is used)

GET /api/v1/auth/me

GET /api/v1/users/me

GET /api/v1/portfolio/overview

GET /api/v1/projects

GET /api/v1/projects/{id}

GET /api/v1/projects/{id}/timeline

GET /api/v1/projects/{id}/risk

GET /api/v1/projects/{id}/changes

GET /api/v1/projects/{id}/benchmark

GET /api/v1/risk/ranking

GET /api/v1/alerts

POST /api/v1/alerts/{id}/acknowledge

POST /api/v1/scenarios

POST /api/v1/reports/project/{id}

POST /api/v1/assistant/query (optional)

Admin/user-management endpoints according to role permissions

9. Request Security Flow

Browser → Auth/session → Route guard → HTTPS API → Authentication middleware → RBAC permission check → Service → PostgreSQL/model artifact → Response

Never rely on frontend route hiding as the only security boundary.

Every protected API validates identity and permissions.

Use parameterised queries/ORM operations and schema validation.

Return generic authentication errors where detailed messages could aid account enumeration.

Record security-relevant events without logging passwords, raw tokens or other secrets.

10. Repository Structure

The repository is aligned with the expanded structure document: frontend/, backend/, ml/, data_pipeline/, data/, tests/, docs/ and infra/, with dedicated auth, user, audit and security modules.

11. Development Plan

Week 1: public landing page, auth/RBAC foundation, source acquisition, extraction, canonical schema and historical snapshots.

Week 2: prediction-safe features, labels, baseline/candidate models, temporal evaluation and explainability.

Week 3: FastAPI + PostgreSQL integration, protected portal, Command Center, Project Explorer and Project Intelligence.

Week 4: Risk Center, Alerts, What Changed?, Benchmarking, Reports, Scenario Simulator, optional Assistant, security/testing and demo deployment.

12. Technical Risks & Mitigations

Risk

Mitigation

Sparse history

Use only defensible prediction horizons; clearly state data limits.

Reporting inconsistencies

Track source/report period, validate continuity and surface data-quality events.

Target leakage

Strict cutoff-based features and temporal splits.

Weak labels

Use completed/outcome records where labels are defensible.

Authentication vulnerabilities

Use established security primitives, server-side RBAC, secure sessions and tests.

LLM hallucination

Ground answers in structured database/model outputs and reject unsupported claims.

Alert fatigue

Thresholding, deduplication, cooldowns and evidence links.

Scope creep

Lock the MVP; treat advanced assistant/GIS/notifications as stretch features.