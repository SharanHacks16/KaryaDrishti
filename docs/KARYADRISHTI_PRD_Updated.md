KARYADRISHTI

See What’s Ahead. Act Before It’s Late.

Product Requirements Document (PRD)SIH 2026 — SIH26103Web-based Integrated Project-Monitoring PlatformVersion 2.0 — Expanded Product Scope

Version

Date

Change

2.0

September 2026

Added public-facing hero/landing page, authentication, logout/session controls, protected portal routes, user profile, notifications, onboarding, accessibility, audit/security requirements, and expanded UX/product features.

1. Product Overview

KARYADRISHTI is a web-based government project intelligence and early-warning portal designed around PAIMANA project-monitoring data. It transforms historical and current project observations into a unified decision-support experience covering portfolio monitoring, project exploration, predictive risk, explainable signals, benchmarking, alerts, scenario analysis, and project reporting.

The product is intentionally broader than an ML model. The ML layer acts as the analytical engine, while the web application provides the secure, role-aware interface through which authorised users can monitor projects, investigate changes, review predictions, and act on early warnings.

1.1 Product Positioning

PAIMANA: source/monitoring layer containing project observations and reporting information.

KARYADRISHTI: intelligence and decision-support layer built on top of project history.

ML models: predictive engine for cost-overrun and schedule-overrun risk.

Web portal: primary user experience for monitoring, investigation, comparison and reporting.

Optional LLM assistant: natural-language interface over verified structured project intelligence; it is not the core predictor.

2. Goals and Objectives

Provide a single command center for authorised project-monitoring users.

Identify projects showing elevated likelihood of cost or schedule problems before they materialise.

Explain model outputs through transparent predictive signals rather than presenting unexplained scores.

Show project trajectories and meaningful period-to-period changes.

Prioritise attention using an explicit and auditable risk/financial-exposure framework.

Enable comparison against comparable projects and peer groups.

Generate actionable early-warning alerts and project intelligence reports.

Provide secure authentication and protected access to government-oriented project intelligence.

Deliver a polished, responsive, accessible product suitable for a hackathon demonstration and future extensibility.

3. Target Users and Roles

Role

Primary Need

Key Access

Example Actions

Administrator

System and access management

All modules + user controls

Manage users, roles, configuration, data-quality events

Portfolio/Ministry Officer

Monitor portfolio health

Command Center, Explorer, Risk, Alerts, Reports

Review risk, investigate projects, compare periods

Project/Program Officer

Investigate individual projects

Project Intelligence, Timeline, Changes, Benchmark, Reports

Review trajectory, explanations and alerts

Analyst

Deep analysis and benchmarking

Analytics, Explorer, Benchmarking, data-quality views

Compare peer groups, inspect trends and model outputs

Viewer/Read-only User

Consume approved information

Read-only dashboards/reports

View portfolio and project intelligence

4. End-to-End User Experience

Landing/hero page introduces KARYADRISHTI, its purpose, capabilities and evidence-driven approach.

User selects Sign In and authenticates through the approved authentication flow.

After successful authentication, the user enters the Command Center according to their role.

User searches, filters or selects a project from the Project Explorer.

Project Intelligence presents current status, historical trajectory, cost/schedule risk, risk signals, changes and benchmarks.

User can investigate alerts, compare periods/projects, run an optional scenario, or generate a report.

The system records relevant audit events and keeps the user session protected.

User signs out; protected pages become inaccessible until the user authenticates again.

5. Hero / Public Landing Page

The hero page is the first screen for unauthenticated visitors. It should communicate the product clearly without exposing protected project data.

5.1 Hero Content

KARYADRISHTI brand and tagline: “See What’s Ahead. Act Before It’s Late.”

Primary CTA: Sign In.

Secondary CTA: Explore Capabilities / How It Works.

Short value proposition: transform project-monitoring data into foresight, explainable risk signals and early warnings.

Visual: government-infrastructure/project network or dashboard-inspired hero illustration.

Key capability highlights: Predict, Explain, Compare, Alert, Report.

Trust statement: evidence-based intelligence grounded in project observations and historical records.

Footer links: About, Methodology, Security/Privacy, Documentation and Contact (where applicable).

5.2 Hero Page Behaviour

Responsive on desktop, tablet and mobile.

Fast initial load with lightweight assets.

No sensitive project data is displayed before authentication.

Authenticated users selecting Sign In are routed to the login page or directly to the portal if a valid session exists.

Use clear navigation and accessible contrast, keyboard focus and semantic headings.

6. Authentication, Login, Logout and Session Management

6.1 Login Page

KARYADRISHTI logo/wordmark.

Official/government-oriented sign-in presentation.

Email/username field.

Password field with show/hide control.

Remember-session option only if permitted by deployment security policy.

Forgot password / account recovery flow if local authentication is used.

Optional SSO/OIDC integration as an extensibility path.

Clear validation messages without revealing sensitive account information.

Loading, invalid-credentials, locked-account and network-error states.

6.2 Authentication Requirements

All protected portal routes require an authenticated session.

Authentication should be implemented using secure session or short-lived token mechanisms.

Passwords, if locally managed, must never be stored in plaintext; use a strong password-hashing mechanism.

Use secure cookies or an equivalent secure token strategy; enable HTTPS in deployment.

Support role-based access control (RBAC).

Rate-limit repeated authentication failures.

Session expiry and explicit logout must invalidate access to protected resources.

Never expose secrets, credentials or tokens in frontend source code.

6.3 Logout

Logout action available from the authenticated user/profile menu.

Confirmation may be used where appropriate, but one-click logout should remain easy to discover.

Clear client-side session state and invalidate server-side session/refresh credentials where applicable.

Redirect to the login page or public hero page after logout.

Browser back navigation must not expose protected data after logout; protected API calls must still require valid authentication.

6.4 User Profile and Account Menu

Display user name, role and organisation/department when available.

Profile settings.

Notification preferences.

Security/session information where appropriate.

Logout.

Administrator-only user-management entry point where permitted.

7. Authenticated Portal Features

Feature

Requirement

Command Center

National/portfolio overview with project counts, risk distribution, cost exposure, schedule exposure, trend indicators, map/sector views and recent alerts.

Project Explorer

Search by project ID/name and filter by ministry, agency, sector, state, risk band, progress, project size and completion period.

Project Intelligence

Unified project profile containing overview, status, cost, progress, dates, timeline, predictions, risk signals, changes, benchmark and actions.

Cost Overrun Prediction

Estimate project-level cost-overrun risk using only features available at prediction time.

Schedule Overrun Prediction

Estimate schedule-delay/overrun risk using historical and current project observations.

Risk Score

Transparent 0–100 decision-support score combining model outputs and defined risk dimensions; methodology must be documented.

Explainability

Show SHAP/model feature contributions or equivalent predictive signals. Clearly label them as predictive signals, not causal proof.

What Changed

Compare selected reporting periods and highlight changes in cost, expenditure, progress, target dates, revised dates and other available fields.

Deterioration Detection

Detect worsening project trajectories using interpretable rules/rolling changes before advanced anomaly methods are introduced.

Risk Center

Portfolio-level risk ranking, risk distribution, financial exposure and projects requiring attention.

Early Warning Center

Alert queue with severity, project, trigger, date, evidence, status and acknowledgement workflow.

Benchmarking

Compare projects against transparent peer groups such as sector, cost band, project stage/age or other documented grouping.

Scenario Simulator

Optional what-if interface for testing defined assumptions such as schedule slippage or expenditure/progress changes; label results as scenario estimates.

Reports

Generate project intelligence summaries/PDF reports with key metrics, risk, explanations, timeline and alerts.

Analytics

Portfolio trends, sector/state/ministry breakdowns, cost escalation patterns and project trajectory analytics.

Optional Project Assistant

Natural-language Q&A grounded in verified structured project data, with source/field references where feasible.

Notifications

In-app notifications for relevant alerts, acknowledgements and system events; email/SMS can be future integrations.

Data Quality

Surface missing, inconsistent, duplicated or suspicious reporting changes without silently altering source data.

8. Project Intelligence Page

Project header: project name, project ID, agency, state, sector and status.

Current KPIs: original cost, revised cost, expenditure, physical progress, target completion and revised completion where available.

Risk overview: overall risk, cost-overrun risk and schedule-overrun risk.

Risk signal panel: top predictive signals with direction and contribution.

Historical timeline: monthly/project snapshots where data exists.

Cost and expenditure trend chart.

Physical-progress trajectory.

Original vs revised date comparison.

What Changed panel with selected-period comparison.

Peer benchmark panel.

Alert history and acknowledgement state.

Actions: compare, run scenario, generate report, view data-quality events.

9. Early Warning and Alerting

Alert types: rising cost risk, rising schedule risk, deteriorating trajectory, significant reported change, benchmark deviation and data-quality warning.

Each alert must include project, severity, trigger, timestamp/reporting period and supporting evidence.

Alert statuses: New, Acknowledged, Under Review, Resolved, Dismissed (subject to role permissions).

Avoid alert spam through thresholding, deduplication and cooldown logic.

Alerts should be traceable to a model output, rule or data-quality event.

10. Security, Privacy and Auditability

Role-based access control for portal modules and administrative actions.

Secure authentication and session management.

TLS/HTTPS in deployed environments.

Server-side authorisation on every protected API endpoint.

Input validation using Pydantic/backend schemas.

Protection against common web threats such as injection, XSS, CSRF where applicable, insecure direct object references and broken access control.

Audit log for login, logout, role changes, configuration changes, report generation and significant user actions.

No sensitive credentials or secrets in source control.

Data minimisation and retention rules should follow the deployment authority’s requirements.

Model and data outputs should be traceable to the relevant data snapshot/model version.

11. Functional Requirements

FR-01: Unauthenticated users can view the public hero/landing page.

FR-02: Users can authenticate through the configured login mechanism.

FR-03: The application enforces RBAC for protected routes and APIs.

FR-04: Users can log out and protected resources remain inaccessible without a valid session.

FR-05: Authorised users can access the Command Center.

FR-06: Users can search and filter projects.

FR-07: Users can open a project intelligence page using a project identifier.

FR-08: The system can display historical project snapshots where available.

FR-09: The system can calculate/display cost-overrun and schedule-overrun predictions.

FR-10: The system can display an overall risk score and its methodology.

FR-11: The system can display predictive risk signals/explanations.

FR-12: Users can compare reporting periods.

FR-13: The system can generate early-warning alerts.

FR-14: Users can acknowledge and track alerts according to their role.

FR-15: Users can compare projects against defined peer groups.

FR-16: Users can generate a project intelligence report.

FR-17: Optional scenario simulation can return clearly labelled scenario estimates.

FR-18: Optional assistant responses must be grounded in verified project data.

FR-19: The system records key audit/security events.

FR-20: The application provides meaningful loading, empty, error, permission and offline/network states.

12. Non-Functional Requirements

Responsive UI across modern desktop browsers and usable tablet layouts.

Accessible navigation, labels, keyboard focus and readable charts.

Modular React/TypeScript frontend and FastAPI backend.

API response and page interactions should feel responsive for normal dashboard operations; heavy ML/report jobs may be asynchronous.

Database-backed historical project records with reliable project ID + reporting-period keys.

Time-based ML validation and leakage checks.

Reproducible model artifacts and version metadata.

Containerised development/deployment through Docker where appropriate.

Observability through structured logs and health endpoints.

Graceful degradation when optional modules such as the LLM assistant are unavailable.

13. Data and ML Requirements

Canonical project history should use project_id + reporting period as a core historical key.

Preserve raw source files separately from cleaned/processed data.

Validate missingness, type consistency, duplicate records and unexpected month-to-month changes.

Prediction features must exclude future information unavailable at the prediction timestamp.

Completed-project records can support historical labels for cost and schedule outcomes where the required fields exist.

Use time-based train/validation/test splits rather than random splits for temporal prediction.

Baseline models should be retained for comparison with stronger tree-based models.

SHAP or an equivalent method should provide interpretable predictive signals.

Model output, model version, feature snapshot and timestamp should be traceable.

Do not describe SHAP features as causal root causes unless separately established.

14. Technical Architecture

High-level flow:

PAIMANA → Ingestion → Extraction/Cleaning → Validation → Historical Project Store → Feature Engineering → ML Intelligence → Decision Layer → FastAPI → React Portal

Frontend: React + Vite + TypeScript, Tailwind CSS, shadcn/ui, Lucide, Recharts/Plotly, React Router, TanStack Query.

Backend: Python FastAPI, Pydantic, SQLAlchemy, Alembic.

Database: PostgreSQL.

Data pipeline: Pandas, NumPy, PyArrow; PyMuPDF/pdfplumber/Camelot as required for source extraction.

ML: scikit-learn, XGBoost/LightGBM, SHAP; MLflow optional.

Infrastructure: Docker/Docker Compose; cloud deployment optional.

Optional LLM: Gemini API or another approved provider, strictly grounded on verified structured data.

15. Core Navigation / Route Map

Route

Purpose

/

Public hero / landing page

/login

Login

/app

Authenticated Command Center

/projects

Project Explorer

/projects/:id

Project Intelligence

/projects/:id/timeline

Project timeline

/projects/:id/changes

What Changed

/projects/:id/benchmark

Benchmark

/risk

Risk Center

/alerts

Early Warning Center

/analytics

Analytics

/reports

Reports

/scenarios

Scenario Simulator

/assistant

Optional Project Assistant

/profile

User profile/settings

/admin

Admin/user management — authorised roles only

16. Core API Surface

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

Authentication/session endpoints according to the selected auth mechanism.

17. Core Data Entities

users

roles / permissions

projects

project_snapshots

predictions

risk_signals

alerts

benchmarks

scenario_results

data_quality_events

audit_logs

model_versions

18. UI States and Error Handling

Loading skeletons for dashboards, tables and project pages.

Empty states when no projects match filters.

Permission-denied page for unauthorised access.

Session-expired state with a clear route back to login.

API/server-error state with retry action.

Data unavailable state that distinguishes missing source data from zero values.

Model unavailable state that does not fabricate a prediction.

Data-quality warning banners for suspicious or inconsistent reporting changes.

19. MVP vs Stretch Scope

MVP

Hero page + Login + Logout + protected routes.

Command Center.

Project Explorer.

Project Intelligence page.

Historical project timeline.

Cost and schedule prediction.

Risk score and explainability.

What Changed.

Risk ranking and early-warning alerts.

Basic benchmarking.

Role-aware user profile.

Audit/security basics.

Stretch

Scenario simulator.

PDF intelligence reports.

LLM Project Assistant.

Advanced GIS/map layers.

Email/SMS notification integrations.

Advanced anomaly/deterioration detection.

SSO/OIDC integration.

Advanced administrator console and model monitoring.

20. Acceptance Criteria

A visitor can open the hero page and understand the product purpose without accessing sensitive project data.

A valid user can sign in and reach the role-appropriate portal.

An unauthenticated user cannot access protected project/risk APIs or pages.

A signed-in user can log out and cannot continue using protected data without re-authentication.

A user can search for a project and open its intelligence page.

The project page displays current and historical information where available.

Risk predictions are generated only from prediction-time-available features.

Risk explanations are shown as predictive signals and are traceable to the model output.

The user can see what changed between selected reporting periods.

The system can surface early warnings with evidence and severity.

The system can compare a project with a documented peer group.

Security and data-quality errors are represented explicitly rather than hidden or fabricated.

Core flows work on desktop and responsive layouts.

21. Development Priorities

Create the public hero page and design system.

Implement authentication, protected routes, RBAC and logout/session handling.

Build PAIMANA ingestion and canonical project-history tables.

Build Project Explorer and Project Intelligence vertical slice.

Implement baseline and main cost/schedule models with time-based validation.

Add risk scoring and explainability.

Build Command Center, Risk Center and Alerts.

Add What Changed, deterioration detection and benchmarking.

Add reports and scenario simulation.

Add optional grounded assistant and advanced integrations only after the core intelligence flow is stable.

Complete security testing, data-quality testing, API testing and demo deployment.

22. Product Success Metrics

Percentage of projects with valid historical continuity.

Prediction performance measured using appropriate time-aware validation metrics.

Calibration/reliability of risk estimates where feasible.

Percentage of high-risk alerts with traceable evidence.

Dashboard/project-page response time for standard queries.

Authentication success/error rates and session-security events.

Number of projects successfully searchable and inspectable.

Report generation success rate.

Reduction in duplicate/unactionable alerts through alert deduplication.

23. Product Guardrails

KARYADRISHTI provides decision support; it does not replace official project governance or human judgement.

Predictions are estimates, not guarantees.

Predictive feature importance is not automatically causal explanation.

Data anomalies should be surfaced for review rather than silently corrected.

Scenario outputs are conditional estimates and must not be represented as official forecasts.

The demo should clearly distinguish prototype functionality from production government integration.

24. Summary

KARYADRISHTI should feel like a complete, secure government project-intelligence portal rather than a model wrapped in a dashboard. The public hero page establishes the product identity and purpose; authentication and RBAC protect project intelligence; the authenticated portal provides monitoring, prediction, explanation, comparison, prioritisation, alerts and reporting. The core development principle is to build a reliable vertical slice from PAIMANA snapshot → cleaned project history → model output → FastAPI → Project Intelligence UI, then expand into the Command Center and advanced decision-support features.