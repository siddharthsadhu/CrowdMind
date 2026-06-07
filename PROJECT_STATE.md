# PROJECT_STATE.md

Version: 1.6

Last Updated: 2026-06-07

Status: Active Development — Phase 6.9 (Post-Build Hardening + Full QA Pass 2 COMPLETE)

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
| **Frontend shell** | **100%** — all 14 pages render, data-cm-* contracts in place |
| **Backend** | **~95%** — auth, questions, discussions, FAQs, evolution engine, AI gateway |
| **Knowledge Evolution Engine** | **100%** — synthesis, consensus, versions, events, rollback, timeline UI |
| **Test coverage** | 70 pytest, 30/31 public, 21/22 browser, 0 FAIL |
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

**2026-06-07 — Phase 6.8 COMPLETE (UI/UX Fix-up + Knowledge Evolution Engine)**

13 phases of work delivered in this session:
- **Phases 0–6** — UI/UX fix-up: data-cm-* contracts, cursor preservation, analytics radar scale, library pagination, admin pages audit. Net: 2 real bugs found (Profile, Library), 12 false alarms.
- **Phase 6.5** — Evolution Engine backend: 4 services (`ai_provider`, `consensus`, `synthesis`, `evolution`), 1 schema, 1 router, 7 new endpoints. Auto-hooks into `discussions.accept_reply` and `faqs.review/update/create_from_candidate`.
- **Phase 6.6** — Evolution UI: `EvolutionPage.tsx` rewritten (34→371 lines), `FaqDetailPage.tsx` evolution mini-timeline, `evolutionApi` client.
- **Phase 6.7** — Tests + seed: 23 new pytest cases (consensus 4, synthesis 4, evolution 11, question_analysis 4), all passing. Seeded "ViBe Team Formation Policy" flagship FAQ with 4 versions + 4 events.
- **Phase 6.8** — Post-build bug fixes (see FINAL_REPORT.md):
  - Evolution page rendered blank → fixed by adding 19 data-cm-* hooks to `14-evolution.html` (the SOURCE that survives `stitch:extract`)
  - FaqDetailPage Evolution Timeline showed 2× → fixed with `data-cm-evo-section` marker + idempotent insertion
  - `/evolution` was auth-gated → removed `<RouteGuard>` per Q8=B
  - Q8=B admin/user separation → EvolutionPage now hides diff section, insights panel, rollback button for non-admins (Clerk role check via `useAuth()`)
  - Pre-existing C5 (`queryTokens.length < 1`) → fixed to `< 3`
- **Phase 7** — Backend hardening: `?force=true` cache bypass, `DELETE /analysis/cache/{id}`, `POST /admin/analysis/cache/flush-all`, generic fallback text in `/questions/{id}/analysis`.
- **Phase 8** — Documentation: FINAL_REPORT.md (294 lines), this file updated.

**Verification gates (all green):**
- `pytest`: 70/70 passed
- `verify-public.mjs`: 30/31 PASS, 0 FAIL, 1 INFO
- `verify-browser.mjs`: 21/22 PASS, 0 FAIL, 1 INFO (Clerk auth gate on /ask, expected)
- `npm run build`: ~3.5s clean

**Q8=B Admin/User control separation (LIVE):**

| Control | Public | Admin |
|---------|--------|-------|
| View timeline + health metrics | ✅ | ✅ |
| View evolution insights (audit log) | ❌ hidden | ✅ |
| View diff viewer (full diffs) | ❌ hidden | ✅ |
| Click "Rollback" button | ❌ hidden | ✅ |
| Click "Approve Change" button | ❌ hidden | ✅ |
| `POST /faqs/{id}/rollback` API | ❌ 403 | ✅ |
| `POST /admin/faqs/{id}/approve` API | ❌ 403 | ✅ |
| `POST /admin/analysis/cache/flush-all` | ❌ 403 | ✅ |
| All `/admin/*` routes | ❌ redirect | ✅ |
