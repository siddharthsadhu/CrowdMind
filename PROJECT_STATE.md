# PROJECT_STATE.md

Version: 1.3

Last Updated: 2026-06-02

Status: Active Development — Phase A (Frontend Polish)

---

# Purpose

This file acts as the single source of truth for project continuity.

Any new developer, AI coding agent, IDE assistant, or contributor should read this file first before continuing development.

---

# Project Overview

Project Name: CrowdMind

Category: AI-Assisted Knowledge Evolution Platform

Core Flow:

Question → Discussion → Consensus → AI Synthesis → FAQ Candidate → Moderator Review → Published FAQ → Knowledge Evolution

---

# Major Product Decisions

## Decision 001 — Public knowledge

Visitors can read FAQs, discussions, and Knowledge Evolution without login.

## Decision 002 — Auth for participation

Login required to ask, discuss, reply, vote, profile, saved, contributions.

## Decision 003 — AI assists, humans govern

AI generates FAQ candidates; admins approve via FAQ Candidate Review.

## Decision 004 — Screen inventory

- **20 frozen screens** (product architecture)  
- **+1 admin drill-down:** FAQ Candidate Review (`21-faq-candidate-review.html`, `/admin/faq-review/:id`)

## Decision 005 — Landing vs login vs evolution (2026-06-01)

| Screen | Stitch title | Route |
|--------|--------------|-------|
| Landing | Transform Questions Into Evolving Knowledge | `/` |
| Login/Register | Join the Collective Intelligence | `/login` |
| Knowledge Evolution | Self-Evolving Knowledge Engine | `/evolution` |

Top nav label **Analytics** on user UI → `/evolution`. Admin **Analytics** → `/admin/analytics`.

---

# Current Development Stage

| Area | Progress |
|------|----------|
| Documentation | 100% |
| UI Design (Stitch) | 100% |
| **Frontend shell** | **~90%** (correct screen HTML mapping, routing, mock auth) |
| Backend | 20% (skeleton + models + core) |
| Git / GitHub | Initial commit pushed |

---

# Last Completed Work

**Date: 2026-06-01**

1. **Fixed Stitch HTML mapping**
   - `01-landing.html` = marketing landing (was wrongly auth or duplicated on 14)
   - `04-auth.html` = Join the Collective Intelligence (login/register)
   - `14-evolution.html` = Knowledge Evolution timeline (Stitch `4f939a86…`)
   - `10-profile.html` refreshed from Stitch profile design
2. **Added FAQ Candidate Review** — `21-faq-candidate-review.html`, route `/admin/faq-review/:id`, page `FaqCandidateReviewPage.tsx`
3. **Navigation maps** — landing CTAs, user Analytics → evolution, admin Analytics → `/admin/analytics`, FAQ Mgmt → review
4. **Docs** — `docs/SCREEN_MAP.md`, `docs/NAVIGATION_AND_SCREENS.md` updated
5. `npm run build` passes

**Date: 2026-06-02**

1. **Project context reviewed** — all architectural docs read, MCQ answers confirmed
2. **Execution plan refined** — replaced old phases with A–J structure in ROADMAP.md
3. **Git initialized** — initial commit `feat: initial project setup with documentation and frontend shell`
4. **Push to GitHub** — `https://github.com/siddharthsadhu/CrowdMind.git` (branch `main`)

**Date: 2026-06-02 (Phase A)**

1. **A1: Visual QA** — verified all 21 routes map to correct stitch content
2. **A2: Avatar dropdown** — replaced sign-in/sign-out with avatar dropdown (profile, contributions, saved, settings, sign out)
3. **A3: State management** — installed Zustand + TanStack Query; created `stores/authStore.ts`, `providers/QueryProvider.tsx`, `services/api/client.ts` + 7 service modules
4. **A4: Form management** — installed React Hook Form + Zod; created `lib/schemas.ts` for questions, discussions, replies
5. `npm run build` passes

**Date: 2026-06-02 (Phase B)**

1. **B1: Project scaffold** — created `backend/` with `pyproject.toml`, module structure (core, models, schemas, api, services, repositories, infrastructure, tests, scripts)
2. **B2: Core layer** — `config.py` (pydantic-settings), `database.py` (async SQLAlchemy), `security.py` (Clerk JWT verification), `dependencies.py` (dependency injection)
3. **B3: Database models** — 25 SQLAlchemy 2.0 models: User, UserProfile, Category, Question, Discussion, Reply, Vote, ConsensusSignal, FaqCandidate, PublishedFaq, FaqContributor, FaqSource, FaqVersion, EvolutionEvent, Collection, CollectionItem, SavedKnowledge, Report, ModerationAction, InvestigationNote, ModerationAuditLog, ReputationHistory, Achievement, UserAchievement, Notification, NotificationPreference, AnalyticsEvent, DailyAnalytics, AiRequest, VectorEmbedding, SearchHistory
4. **B4: Alembic setup** — initialized with async template, configured `env.py` with models metadata
5. **B5: Infrastructure stubs** — Docker Compose, Makefile, .env.example, seed script
6. `pytest tests/test_health.py` passes

**Date: 2026-06-02 (Phase C)**

1. **C1: Questions schemas** — QuestionCreate, QuestionUpdate, QuestionResponse, QuestionListResponse
2. **C2: Questions repository** — SQLAlchemy CRUD with pagination, category/status filters, soft delete
3. **C3: Questions service** — business logic with authorization checks (owner-only update/delete)
4. **C4: Questions API** — `POST /api/v1/questions`, `GET /api/v1/questions`, `GET /api/v1/questions/{id}`, `PATCH /api/v1/questions/{id}`, `DELETE /api/v1/questions/{id}`
5. **C5: Questions tests** — 4 pytest tests pass (health, list, create auth, 404)
6. **Test infrastructure** — SQLite in-memory DB override for tests (avoids PostgreSQL requirement)
7. `npm run build` passes

---

# Execution Plan (Phases A–J)

| Phase | Focus | Status |
|-------|-------|--------|
| A | Frontend Polish & Tooling | **Done** |
| B | Backend Skeleton & Core Layer | **Done** |
| C | Questions Module (API + Frontend) | **Done** |
| D | Clerk Auth + User Module | Pending |
| E | Discussions, Replies & Voting | Pending |
| F | FAQ Module & Knowledge Pipeline | Pending |
| G | Search, Notifications & Saved Knowledge | Pending |
| H | Moderation & Governance | Pending |
| I | AI Integration & Knowledge Evolution | Pending |
| J | Testing, Security & Production Readiness | Pending |

---

# Key files

| Path | Role |
|------|------|
| `web/public/stitch-ref/*.html` | Pixel source HTML |
| `web/src/stitch-content/*.ts` | Generated by `npm run stitch:extract` |
| `web/src/data/navMaps.ts` | Button/link text → routes |
| `docs/NAVIGATION_AND_SCREENS.md` | User/admin flows, Saved Knowledge UX |
| `docs/SCREEN_MAP.md` | Route ↔ Stitch ID table |
| `ROADMAP.md` | Long-term execution strategy (A–J phases) |
| `PROJECT_STATE.md` | Single source of truth for continuity |

---

# Immediate Next Steps (Phase D)

1. **D1: Clerk Frontend Setup** — install @clerk/clerk-react, wrap app, replace AuthContext
2. **D2: Clerk Backend Webhook** — user sync on sign-up, JWT verification
3. **D3: User Module API** — GET /me, GET /users/{id}, PATCH /me

---

# Handover

```bash
cd web && npm install && npm run dev
```

- **Screens** (bottom-right): all routes including **21 FAQ Review**
- After editing `public/stitch-ref/*.html`: `npm run stitch:extract`
- Demo users: `user@crowdmind.ai`, `admin@crowdmind.ai`
- First push done to `origin/main`

---

# Next Milestone

Phase A completion (frontend polish + tooling) → Phase B (backend scaffolding).
