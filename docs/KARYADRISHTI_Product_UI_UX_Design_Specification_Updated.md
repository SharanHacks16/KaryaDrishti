KARYADRISHTI — PRODUCT & UI/UX DESIGN SPECIFICATION

Updated to PRD v2.0

1. Design Vision

KARYADRISHTI should feel like a serious government infrastructure command center: information-dense, trustworthy, calm and action-oriented. The experience begins with a polished public hero page, transitions through a secure login, and then provides an authenticated workspace where an officer can move from national portfolio → filtered portfolio → project → evidence → alert/report.

2. Design Principles

Clarity over decoration.

Progressive disclosure.

Evidence before interpretation.

Consistent risk language.

Never rely on colour alone.

Show reporting period, source and last refresh.

Every alert links to the relevant project.

Authentication/security states should be obvious but visually unobtrusive.

AI/ML should expose verified intelligence, not create unsupported facts.

Design for desktop office workflows first, with responsive tablet/mobile support.

3. Public Information Architecture

Landing/Hero.

Capabilities / How It Works.

Trust & Methodology summary.

Sign In.

Footer: About, Methodology, Security/Privacy, Documentation and Contact where applicable.

4. Hero / Landing Page

Top navigation: KARYADRISHTI logo, capabilities/methodology links and prominent Sign In CTA.

Hero headline: “See What’s Ahead. Act Before It’s Late.”

Supporting copy: project-monitoring intelligence for earlier identification, explanation and prioritisation of emerging project risks.

Primary CTA: Sign In.

Secondary CTA: Explore Capabilities.

Visual: infrastructure/project-network illustration or restrained command-center visual.

Capability strip: Predict • Explain • Compare • Alert • Report.

Trust section: evidence-based, historical-project intelligence with visible methodology boundaries.

Footer with non-sensitive informational links.

No project-level sensitive data appears on the public page.

5. Login Experience

Centered institutional login card with KARYADRISHTI identity.

Username/email and password fields.

Show/hide password control.

Optional account recovery flow if local authentication is implemented.

Optional SSO/OIDC entry point if configured.

Clear loading, invalid-credential, locked-account, expired-session and network-error states.

Accessible form labels, keyboard focus and error summaries.

After successful login, route to /app or the authorised landing page for the user's role.

6. Authenticated App Shell

Persistent left sidebar on desktop; collapsible on smaller screens.

Top bar: page title/breadcrumbs, global search, notification indicator and user menu.

User menu: name, role/organisation, profile, settings and Logout.

Logout should be visually discoverable and require no navigation through multiple menus.

Session-expiry banner/modal routes back to Login.

Protected content must never be shown to unauthenticated users.

7. Information Architecture — Authenticated Portal

Command Center.

Project Explorer.

Project Intelligence.

Risk Center.

Alerts / Early Warning Center.

Benchmarking.

Analytics.

Reports.

Scenario Simulator.

Assistant.

Profile.

Settings/Security.

Administration for authorised roles.

8. Command Center

KPI strip: total projects, high-risk projects, deteriorating projects, cost-risk exposure and schedule-risk exposure.

Risk distribution.

Ministry/sector comparison.

Risk trend.

Geographic view where reliable.

Recent priority alerts.

Top priority projects.

Global filters for reporting period, ministry, sector, state and risk.

Last-refresh/source indicator.

9. Project Explorer

Search by project ID/name/agency.

Filters: ministry, sector, state, progress, risk, project size and completion year.

Compact table: project, agency, state, risk, progress, cost, schedule status and latest change.

Sort and pagination.

Empty state when no projects match.

One-click navigation to Project Intelligence.

10. Project Intelligence Page

Project header: name, ID, ministry, agency, state, status and last refresh.

Large risk score card with methodology tooltip.

Cost-risk and schedule-risk cards.

Historical risk/progress/expenditure timeline.

Cost vs progress chart.

Schedule history and original/revised date comparison.

‘What Changed?’ panel.

Top predictive risk signals with contribution/direction.

Peer benchmark with peer-group definition and sample size.

Alert history.

Actions: Compare, Run Scenario, Generate Report.

Data-quality warning if the project has flagged reporting inconsistencies.

11. Risk Center & Early Warning Center

Risk distribution and portfolio exposure.

Priority queue sortable by defined risk/financial-exposure/urgency framework.

Alert cards with severity, project, date, trigger, evidence and status.

Statuses: New, Acknowledged, Under Review, Resolved, Dismissed where permitted.

Alert detail drawer/page links directly to the project evidence.

Use factual language: observed change, estimated probability, predictive signal.

Avoid alarmist language.

12. Benchmarking

Show peer-group definition.

Show peer sample size.

Compare progress, expenditure, schedule and cost indicators.

Use percentile/relative positioning.

Explain how peer groups are constructed.

Do not visually imply causation from peer position.

13. Scenario Simulator

Numeric inputs/sliders only for variables supported by the model.

Baseline and scenario side-by-side.

Show changed assumptions explicitly.

Show model-based scenario estimate and uncertainty/context where available.

Never present a scenario as a guaranteed intervention effect.

14. Reports

Project intelligence report action on Project Intelligence page.

Report preview with project identity, current metrics, risk, predictive signals, timeline, changes, benchmark and alerts.

Show report generation/loading state.

Include report period and model version where applicable.

Keep report language factual and decision-support oriented.

15. Assistant

Chat interface with suggested queries such as “What changed for this project?” and “Why is schedule risk elevated?”

Answers must be grounded in verified project/database/model context.

Show project and reporting-period context.

Link answers back to relevant portal views.

If the data does not support the answer, state that clearly.

Do not let the assistant override model outputs or invent missing facts.

16. Profile, Settings & Security UI

Profile: name, role, organisation/department and account status where available.

Preferences: notification settings and display preferences.

Security: session information and password/account actions where supported.

Admin: user/role management for authorised users.

Logout is available from the global user menu and profile/settings.

17. Risk Visualization

Low: healthy/limited signal.

Moderate: monitor.

High: elevated predicted/observed risk.

Critical: highest-priority warning under the defined framework.

Exact thresholds must be documented and validated, not selected only for visual impact.

Always pair colour with text/icon/pattern or numeric value.

18. Core UI Components

HeroSection

CapabilityCard

LoginForm

ProtectedRoute

SessionExpiryDialog

UserMenu

NotificationBell

RiskScoreCard

PredictionCard

ProjectHeader

TimelineChart

RiskTrendChart

CostProgressChart

WhatChangedPanel

RiskSignalsPanel

BenchmarkCard

PriorityTable

AlertCard

FilterBar

ProjectSearch

ScenarioPanel

ReportButton

AssistantPanel

DataQualityBanner

19. UX Copy Rules

Use “Estimated probability of schedule overrun” instead of “Will be delayed.”

Use “Top predictive signals” instead of “Root causes” unless causal evidence exists.

Use “Model-based scenario estimate” instead of “Expected outcome.”

Use “Review recommended” rather than autonomous commands.

Always show the reporting period for time-sensitive values.

Use “Data-quality warning” for source inconsistencies.

Use “Session expired — please sign in again” for authentication expiry.

Use “Signed out successfully” after logout.

Do not expose technical model jargon unless it helps the user interpret the result.

20. Accessibility & Responsive Design

Strong contrast and keyboard-accessible controls.

Visible focus states.

Semantic headings and labels.

Text labels in addition to colour.

Accessible chart summaries/tooltips.

Desktop-first for office users; tablet-friendly for review meetings.

Mobile supports login, alerts, search and summaries; primary analytics remains desktop-oriented.

Respect reduced-motion preferences for animations.

21. UI State Matrix

State

Visual Treatment

Required Behaviour

Loading

Skeleton/spinner

Do not show fabricated values

Empty

Helpful empty-state illustration/text

Explain why there is no result and how to change filters

Permission denied

Clear access message

Do not reveal protected resource details

Session expired

Session dialog/banner

Route to login and preserve safe navigation context

Server error

Error card + retry

Do not mask API failure as zero data

Model unavailable

Neutral warning

Do not fabricate prediction; show available source data

Data-quality issue

Warning banner/panel

Link to affected record/period when possible

Success

Subtle confirmation/toast

Confirm report generation, acknowledgement or logout

22. Demo Flow

Open the KARYADRISHTI Hero page.

Show the purpose and five core capabilities.

Click Sign In and authenticate.

Land on Command Center and show portfolio health.

Filter/search a project in Project Explorer.

Open Project Intelligence.

Show risk score, cost/schedule predictions and historical trajectory.

Open What Changed? and predictive signals.

Open benchmark and an early-warning alert.

Run one scenario estimate if implemented.

Generate a project report.

Open the user menu and demonstrate Logout.

Optionally finish with a grounded Assistant query.

23. Design Guardrails

The interface is decision support, not autonomous project governance.

Predictions are estimates, not guarantees.

Predictive importance is not automatically causal explanation.

Scenario outputs are conditional estimates.

Public pages never expose protected project-level intelligence.

Security controls should remain consistent across every route and API.