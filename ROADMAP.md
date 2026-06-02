# CrowdMind Roadmap

Version: 1.0

Status: Active

Purpose:

This document defines the long-term execution strategy for CrowdMind.

It serves as:

* Product Roadmap
* Development Roadmap
* Feature Planning Guide
* Milestone Tracker

---

# Vision

Build the world's most trusted AI-assisted Knowledge Evolution Platform.

Transform:

```text
Questions
    ↓
Discussions
    ↓
Knowledge
```

into

```text
Questions
    ↓
Discussions
    ↓
Consensus
    ↓
Knowledge
    ↓
Knowledge Evolution
```

---

# Success Metrics

The project succeeds when:

✓ Duplicate Questions Decrease

✓ Knowledge Discovery Improves

✓ FAQ Quality Improves

✓ Community Trust Increases

✓ AI Improves Knowledge Accessibility

✓ Knowledge Evolves Over Time

---

# Development Strategy

CrowdMind will be built in phases.

Each phase delivers usable value.

---

# Phase A — Frontend Polish & Tooling

Status:

```text
CURRENT PHASE — IN PROGRESS
```

Goal:

Stabilize the frontend shell, add professional tooling, and prepare the frontend for backend integration.

---

## A1 — Visual QA

Priority:

High

Tasks:

* Verify all 21 routes render correct Stitch HTML
* Fix broken images, links, or navigation
* Ensure responsive layout consistency

---

## A2 — Custom Avatar Dropdown

Priority:

High

Tasks:

* Replace login/register buttons in AppHeader with avatar dropdown
* Add profile, contributions, settings, saved knowledge links
* Add logout action

---

## A3 — State Management & HTTP Client

Priority:

High

Tasks:

* Install Zustand + TanStack Query
* Create `stores/` directory with auth store skeleton
* Create `providers/` directory
* Install axios or use built-in fetch
* Create `services/api/client.ts` (centralized axios instance)
* Create service modules: `questions.ts`, `discussions.ts`, `faqs.ts`, `auth.ts`, `users.ts`, `notifications.ts`, `moderation.ts`

---

## A4 — Form Management

Priority:

Medium

Tasks:

* Install React Hook Form + Zod
* Create form validation schemas for questions, discussions, replies

---

# Phase B — Backend Skeleton & Core Layer

Goal:

Create the FastAPI backend project structure with all core infrastructure.

---

## B1 — Project Scaffold

Tasks:

* Create `backend/` directory
* Initialize `pyproject.toml` with all dependencies (FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2, psycopg3, pytest, httpx, etc.)
* Create module structure: `app/core/`, `app/models/`, `app/schemas/`, `app/api/`, `app/services/`, `app/repositories/`, `app/infrastructure/`

---

## B2 — Core Layer

Tasks:

* `app/core/config.py` — settings via pydantic-settings + .env
* `app/core/database.py` — async SQLAlchemy engine + session factory
* `app/core/security.py` — JWT verification middleware for Clerk tokens
* `app/core/dependencies.py` — dependency injection (get_db, get_current_user, require_role)

---

## B3 — Database Models

Tasks:

* Create all SQLAlchemy 2.0 models per DATABASE.md: User, Question, Discussion, Reply, Vote, FAQ, FAQCandidate, FAQVersion, Report, ModerationAction, Notification, SavedKnowledge, ReputationHistory, AnalyticsEvent
* Add UUID pk, timestamps, soft delete
* Create `Base` with common columns mixin

---

## B4 — Alembic Setup

Tasks:

* Initialize Alembic
* Create initial migration
* Create seed data script

---

## B5 — Infrastructure Stubs

Tasks:

* Docker Compose for PostgreSQL 16 + pgvector
* `Makefile` or task runner for common commands
* VSCode launch configs

---

# Phase C — Questions Module (API + Frontend)

Goal:

Build the complete Questions feature (CRUD + AI analysis) end-to-end.

---

## C1 — Questions Schemas

Tasks:

* Pydantic models: QuestionCreate, QuestionUpdate, QuestionResponse, QuestionList
* Category enum

---

## C2 — Questions Repository

Tasks:

* SQLAlchemy repository pattern: create, get_by_id, list (paginated), update, soft_delete
* Category filter support

---

## C3 — Questions Service

Tasks:

* Business logic: create question, duplicate check, similar FAQ lookup
* Service → Repository pattern

---

## C4 — Questions API

Tasks:

* `POST /api/v1/questions`
* `GET /api/v1/questions`
* `GET /api/v1/questions/{id}`
* `PATCH /api/v1/questions/{id}`
* `DELETE /api/v1/questions/{id}` (soft delete)
* Standard error handling with HTTPException

---

## C5 — Questions Tests

Tasks:

* Unit tests for service
* Integration tests for API with httpx.AsyncClient
* Mock DB test fixtures

---

## C6 — Questions Frontend

Tasks:

* Create API service module `services/api/questions.ts`
* Wire AskQuestionPage to real API
* Wire questions listing to mock (wait for discussions endpoint)

---

# Phase D — Clerk Auth + User Module

Goal:

Replace mock auth with real Clerk authentication across frontend and backend.

---

## D1 — Clerk Frontend Setup

Tasks:

* Install `@clerk/clerk-react`
* Wrap app with ClerkProvider
* Replace AuthContext with Clerk hooks
* Update RouteGuard to use Clerk
* Update AppHeader to use Clerk UserButton + avatar dropdown

---

## D2 — Clerk Backend Verification

Tasks:

* Create Clerk webhook endpoint for user sync (`POST /api/v1/webhooks/clerk`)
* Implement JWT verification middleware
* Create User repository and service
* Sync Clerk users to local database

---

## D3 — User Module API

Tasks:

* `GET /api/v1/users/me`
* `GET /api/v1/users/{id}`
* `PATCH /api/v1/users/me`
* Reputation integration

---

# Phase E — Discussions, Replies & Voting

Goal:

Build the complete discussion system with voting.

---

## E1 — Discussions Module

Tasks:

* Create schemas, repository, service, API endpoints
* `POST /api/v1/discussions`
* `GET /api/v1/discussions`
* `GET /api/v1/discussions/{id}`
* `PATCH /api/v1/discussions/{id}`
* `DELETE /api/v1/discussions/{id}`

---

## E2 — Replies Module

Tasks:

* Create schemas, repository, service, API endpoints
* `POST /api/v1/discussions/{id}/replies`
* `GET /api/v1/discussions/{id}/replies`
* `PATCH /api/v1/replies/{id}`
* `DELETE /api/v1/replies/{id}`

---

## E3 — Voting Module

Tasks:

* Create schemas, repository, service, API endpoints
* `POST /api/v1/votes` (upvote/downvote on questions, discussions, replies)
* `DELETE /api/v1/votes/{id}`
* Aggregate vote counts

---

## E4 — Frontend Wire-Up

Tasks:

* Wire DiscussionThreadPage to real API
* Wire CreateDiscussionPage to real API
* Wire DiscussionsPage listing
* Wire voting buttons to API
* Replace all mock data with API calls

---

# Phase F — FAQ Module & Knowledge Pipeline

Goal:

Build the complete FAQ lifecycle: candidate generation → review → publish → versioning.

---

## F1 — FAQ Candidates

Tasks:

* Create schemas, repository, service, API
* `POST /api/v1/faq-candidates` (AI-generated)
* `GET /api/v1/faq-candidates`
* `GET /api/v1/faq-candidates/{id}`
* `PATCH /api/v1/faq-candidates/{id}` (moderator review)

---

## F2 — Published FAQs

Tasks:

* Create schemas, repository, service, API
* `POST /api/v1/faqs` (publish from candidate)
* `GET /api/v1/faqs`
* `GET /api/v1/faqs/{id}`
* `PATCH /api/v1/faqs/{id}`
* `DELETE /api/v1/faqs/{id}` (archive)

---

## F3 — FAQ Versioning

Tasks:

* Version tracking on publish/update
* `GET /api/v1/faqs/{id}/versions`
* `GET /api/v1/faqs/{id}/versions/{version_id}`

---

## F4 — Frontend Wire-Up

Tasks:

* Wire LibraryPage to real FAQ API
* Wire FaqDetailPage
* Wire FaqManagementPage (admin)
* Wire FaqCandidateReviewPage (admin)

---

# Phase G — Search, Notifications & Saved Knowledge

Goal:

Add search (keyword + vector), notifications, and personal knowledge management.

---

## G1 — Search Module

Tasks:

* Keyword search on FAQs and discussions
* pgvector setup for semantic search
* `GET /api/v1/search?q=...`

---

## G2 — Notifications Module

Tasks:

* Create notification on reply, vote, FAQ publish
* `GET /api/v1/notifications`
* `PATCH /api/v1/notifications/{id}/read`
* Frontend: NotificationsPage, notification badge

---

## G3 — Saved Knowledge Module

Tasks:

* `POST /api/v1/saved` (save FAQ/discussion)
* `DELETE /api/v1/saved/{id}`
* `GET /api/v1/saved`
* Frontend: SavedKnowledgePage

---

# Phase H — Moderation & Governance

Goal:

Build the moderation and trust layer.

---

## H1 — Reports & Moderation

Tasks:

* `POST /api/v1/reports`
* `GET /api/v1/reports` (admin)
* Moderation repository and API
* ModerationPage, ReportInvestigationPage frontend wire-up

---

## H2 — Admin Console Wire-Up

Tasks:

* MissionControlPage
* SettingsPage
* AnalyticsPage (basic stats)

---

# Phase I — AI Integration & Knowledge Evolution

Goal:

Integrate AI providers and knowledge evolution tracking.

---

## I1 — AI Gateway

Tasks:

* Create AI provider abstraction (Gemini, Groq)
* Provider adapter pattern per ADR-002
* AI analysis endpoint for questions

---

## I2 — FAQ Candidate Generation

Tasks:

* AI synthesis from discussion
* Generate FAQ candidate content
* Store candidate for moderator review

---

## I3 — Knowledge Evolution

Tasks:

* Version history tracking
* Evolution timeline visualization
* Frontend: EvolutionPage

---

# Phase J — Testing, Security & Production Readiness

Goal:

Harden the platform for production deployment.

---

## J1 — Security Audit

Tasks:

* Rate limiting
* Input validation pass
* RBAC verification
* CORS configuration
* Audit logging

---

## J2 — Performance

Tasks:

* Query optimization (N+1 fixes)
* API pagination pass
* Response caching strategy

---

## J3 — CI/CD

Tasks:

* GitHub Actions: lint, typecheck, test
* Docker build for backend + frontend
* Production deployment config

---

# Phase 1 Deliverable (MVP)

Working Platform With:

```text
Authentication (Clerk)
Questions + AI Analysis
Discussions + Replies + Voting
FAQs (Candidates → Published → Versioned)
Search (Keyword + Semantic)
Notifications
Saved Knowledge
Moderation
```

---

# Phase 2 — Governance Layer

Goal:

Establish trust and moderation.

---

## Moderation Queue

Features:

* Reports
* Review Workflow
* Enforcement Actions

---

## Report Detail Center

Features:

* Investigation Notes
* User History
* Resolution Tracking

---

## FAQ Management

Features:

* Candidate Review
* Publish Workflow
* FAQ Archiving

---

## Role Management

Features:

* Moderator Roles
* Trusted Contributors

---

## Reputation Engine

Features:

* Reputation History
* Trust Signals
* Contributor Recognition

---

# Phase 2 Deliverable

Trusted Community Governance.

---

# Phase 3 — Knowledge Evolution Engine

Goal:

Enable knowledge growth over time.

---

## FAQ Versioning

Features:

* Version History
* Change Tracking
* Version Comparison

---

## Knowledge Evolution Timeline

Features:

* Evolution Events
* Historical Changes
* Knowledge Journey

---

## Contributor Attribution

Features:

* Source Tracking
* Contribution Recognition

---

## Consensus Engine

Features:

* Agreement Scoring
* Trust Weighting
* Knowledge Readiness

---

# Phase 3 Deliverable

Living Knowledge System.

---

# Phase 4 — Intelligence Layer

Goal:

Make knowledge discoverable and intelligent.

---

## Semantic Search

Features:

* Vector Search
* Similar Content Discovery
* Related Knowledge

---

## AI Knowledge Synthesis

Features:

* FAQ Candidate Generation
* Structured Knowledge Drafting

---

## AI Discussion Summaries

Features:

* Key Insights
* Consensus Extraction
* Summary Generation

---

## Recommendation Engine

Features:

* Related FAQs
* Related Discussions
* Knowledge Suggestions

---

# Phase 4 Deliverable

AI-Assisted Knowledge Discovery.

---

# Phase 5 — Platform Intelligence

Goal:

Provide deep platform insights.

---

## Analytics Dashboard

Features:

* Growth Metrics
* Engagement Metrics
* Knowledge Metrics

---

## AI Analytics

Features:

* AI Accuracy
* Acceptance Rate
* Usage Metrics

---

## Community Intelligence

Features:

* Health Scores
* Contributor Analysis
* Category Insights

---

## Strategic Recommendations

Features:

* Knowledge Gaps
* Community Opportunities
* Growth Suggestions

---

# Phase 5 Deliverable

Data-Driven Governance.

---

# Phase 6 — Ecosystem Expansion

Goal:

Integrate CrowdMind into external systems.

---

## Discourse Integration

Features:

* Topic Import
* FAQ Generation
* Community Synchronization

---

## GitHub Integration

Features:

* Issue Discussions
* Knowledge Extraction
* Documentation Insights

---

## Slack Integration

Features:

* Knowledge Discovery
* Discussion Sync

---

## Microsoft Teams Integration

Features:

* Enterprise Collaboration

---

## LMS Integration

Features:

* Educational Knowledge Management

---

# Phase 6 Deliverable

Knowledge Ecosystem Platform.

---

# Future Research Areas

Potential Future Features:

---

## Knowledge Graph

Visual relationship mapping between knowledge artifacts.

---

## AI Fact Verification

Automatic evidence validation.

---

## Knowledge Quality Scoring

Evaluate trustworthiness of knowledge.

---

## Expert Verification System

Subject matter expert validation.

---

## Community Mentorship Layer

Expert-guided discussions.

---

# MVP Definition

CrowdMind MVP includes:

```text
Authentication

Questions

AI Question Analysis

Discussions

Replies

Voting

FAQ Repository

Search

Notifications

Saved Knowledge

Basic Moderation
```

Anything outside this list is not required for MVP launch.

---

# Release Strategy

## Alpha

Internal Team Testing

---

## Beta

Limited User Access

---

## Public Launch

Open Community Access

---

## Growth Phase

Analytics Driven Improvements

---

# Success Milestones

Milestone 1

```text
100 Users
```

---

Milestone 2

```text
1,000 Discussions
```

---

Milestone 3

```text
500 FAQs
```

---

Milestone 4

```text
10,000 Users
```

---

Milestone 5

```text
100,000 Knowledge Interactions
```

---

# Final Roadmap Statement

CrowdMind is not being built as a discussion platform.

CrowdMind is being built as a:

```text
Knowledge Evolution Platform
```

Every phase of development should move the platform closer to:

* Better Knowledge
* Better Discovery
* Better Trust
* Better Community Intelligence

while preserving transparency, traceability, and human governance.
