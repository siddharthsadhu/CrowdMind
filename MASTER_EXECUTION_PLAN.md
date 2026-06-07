# CrowdMind — Master Execution Plan v2.0

> **Status:** Frozen, ready for execution
> **Date:** 2026-06-07
> **Mode:** Plan → Auto-execute (no further questions expected)
> **Total estimated time:** ~7 hours across 10 phases
> **Outcome:** 14 broken pages fixed + Knowledge Evolution Engine built + backend hardened

---

## 0. Document Control

| Field | Value |
|---|---|
| Plan Owner | CrowdMind Team |
| Plan Type | UI/UX Fix-up + Knowledge Evolution Engine Build |
| Supersedes | `IMPLEMENTATION_PLAN.md` (Handover Phases 1–5 — fully executed) |
| Companion Docs | `context.md`, `PROJECT_STATE.md`, `VERIFICATION_WALKTHROUGH.md` |
| Working Directory | `C:\Users\siddh\Desktop\IIT_Ropar\CrowdMind` |
| Build Mode | Hybrid: pause only for user decisions, show diff + screenshot + test after every change |

---

## 1. Executive Summary

CrowdMind is structurally complete (25 DB models, 13 API routers, 22 Stitch UI templates) but suffers from a systematic gap: **React pages query DOM elements (`data-cm-*` attributes) that do not exist in the generated templates**. This causes 14 pages to render with hardcoded mock data instead of real backend data.

Additionally, the **Knowledge Evolution Engine** — CrowdMind's flagship differentiator per `CONTEXT.md` — has its data models and UI templates built, but the **synthesis, versioning, and event-logging logic is missing**. The Evolution page is a redirect stub.

This plan:
1. **Fixes 14 broken pages** by adding invisible `data-cm-*` attributes to template files
2. **Builds the full Knowledge Evolution Engine** (backend services + frontend UI + tests + seed data)
3. **Hardens the backend** (Gemini cache, hardcoded ViBe fallback removal, error handling)
4. **Preserves all existing functionality** (31/31 Playwright tests must continue to pass)

---

## 2. Locked Decisions (Q1–Q9)

All decisions were made collaboratively with the user. **No further questions expected.**

| # | Decision | Answer | Rationale |
|---|---|---|---|
| **Q1** | Scope of UI fix | **C. All 14 affected pages** | Profile is the canary; same systematic gap affects 14 of 22 templates |
| **Q2** | How to find what to fix | **D. Run dev server, click through, fix what's broken** | Most accurate; catches runtime issues templates alone wouldn't reveal |
| **Q3** | Working style | **B. Plan, then auto-execute with diffs shown** | Maximum autonomy, full transparency |
| **Q4** | Audit depth | **A. Click through every page with real logged-in user** | Highest fidelity; covers guest + auth states |
| **Q5** | Template fix strategy | **A. Edit BOTH `web/public/stitch-ref/*.html` AND `web/src/stitch-content/*.ts`** | Prevents `npm run stitch:extract` from wiping markers |
| **Q6** | Knowledge Evolution Engine | **A. Full build (Phases 6.5–6.7)** | Soul of the product; worth the +3 hours |
| **Q7** | Auto-synthesis behavior | **A. Auto-synthesize quietly; notify only the accepting moderator** | Preserves magic, avoids moderator burnout |
| **Q8** | Evolution page access | **B. Hybrid** — Public sees latest version + simple timeline + summary badge; Admin sees full diffs/rollback/audit in `/admin/evolution` | Best of both worlds: public trust signal + private governance |
| **Q9** | Demo seed data | **A. Seed 1 flagship FAQ with 4 manual versions + 3 evolution events** | Makes the demo immediately impressive |

---

## 3. Project Audit Summary

### 3.1 The Root Cause of the 14 Broken Pages

| Symptom | Root Cause |
|---|---|
| Profile page shows hardcoded data | `data-cm-*` attributes queried by `ProfilePage.tsx` (19 of them) do not exist in `stitch-content/10-profile.ts` |
| 14 of 22 templates have **0 IDs and 0 data attributes** | Systematic extraction gap; `extract-stitch-content.mjs` does not preserve React-expected markers |
| Generated `.ts` files overwritten on every build | `package.json:8` runs `stitch:extract` as pre-step; HTML is source of truth |

**The fix pattern (universal):** Add `data-cm-*` attributes to BOTH the source HTML (`web/public/stitch-ref/*.html`) and the generated TypeScript (`web/src/stitch-content/*.ts`). Keep attribute names lowercase, hyphenated, prefixed with `cm:` (e.g., `data-cm-user-name`, `data-cm-reputation-badge`).

### 3.2 Templates by Health

| Health | Count | Files |
|---|---|---|
| ✅ Healthy (has IDs/attrs) | 8 | `05-ask` (23 IDs), `06-analysis` (14), `13-contributions` (1), `18-analytics` (3), `19-report` (2), `20-settings` (13), plus 2 minor |
| 🟡 Partial (some attrs) | 0 | — |
| 🔴 Broken (0 IDs/attrs) | 14 | All other templates including `01-landing`, `02-faq`, `03-faq-detail`, `07-discussions`, `08-thread`, `09-create-disc`, `10-profile`, `11-notifications`, `12-saved`, `14-evolution`, `15-admin-mission`, `16-faq-mgmt`, `17-moderation`, `21-candidate-review`, `22-profile-settings` |

### 3.3 The Knowledge Evolution Engine — What's There vs. Missing

| Component | Status | Evidence |
|---|---|---|
| `FaqVersion` model | ✅ Schema | `backend/app/models/faq.py:64–76` |
| `FaqCandidate` model | ✅ Schema | `backend/app/models/faq.py:11–22` |
| `PublishedFaq` model | ✅ Schema | `backend/app/models/faq.py:25–41` |
| `EvolutionEvent` model | ✅ Schema | `backend/app/models/faq.py:78–87` — **but never written to** |
| `ConsensusSignal` model | ✅ Schema | `backend/app/models/discussion.py` |
| `consensus_score` field | ✅ Schema | `backend/app/models/discussion.py` — **but never computed** |
| Discussion accept-answer endpoint | ✅ Works | `backend/app/api/discussions.py:62–77` |
| AI duplicate detection | ✅ Works | `backend/app/api/questions.py:77–208` (Gemini 2.5 Flash) |
| Candidate review endpoint | ✅ Works | `backend/app/api/faqs.py:50` |
| **AI Synthesis endpoint** | ❌ **Missing** | No service synthesizes a discussion into a FaqCandidate |
| **Auto-versioning on FAQ update** | ❌ **Missing** | No FaqVersion row created when PublishedFaq is edited |
| **EvolutionEvent triggers** | ❌ **Missing** | Model exists, no service writes to it |
| **Consensus computation** | ❌ **Missing** | Field exists, no job computes it |
| **`/evolution` page** | ❌ **Redirect stub** | `EvolutionPage.tsx` is 34 lines, redirects to `/ask` |
| **`/admin/evolution` page** | ❌ **Missing** | Admin has no governance view of evolution |
| **Rollback feature** | ❌ **Missing** | No endpoint, no UI |
| **Seed data** | ❌ **Missing** | DB has no flagship FAQ with version history |

---

## 4. Execution Protocol

For every file change, I follow this ritual:

### 4.1 Before Each Change
1. Read the target file in full
2. Search for any existing `data-cm-*` attributes in the React page to know what to add
3. Check `stitch-ref/*.html` is in sync with the `.ts` file

### 4.2 During Each Change
1. Edit the `.ts` file (generated) — add `data-cm-*` attributes
2. Edit the `.html` file (source) — mirror the additions exactly
3. Save both

### 4.3 After Each Change
1. Show the **unified diff** in chat
2. Run `npm run build` to confirm no extraction conflict
3. If backend change: run `.venv\Scripts\python.exe -m pytest -x` to confirm no regression
4. Take a **screenshot** of the affected page (using Playwright via the existing `verify-public.mjs` or a custom script) and save to `verification-screenshots/phase-N/`
5. Show the screenshot to the user

### 4.4 Phase Completion Gate
A phase is "done" only when:
- All files in scope are edited
- `npm run build` passes
- All existing tests pass (`verify-public.mjs` 31/31, `verify-ask-flow.mjs` 7/7)
- New tests (if applicable) pass
- Screenshots are captured and shown

---

## 5. Phase 0 — Setup & Visual Audit (30 min)

### 5.1 Goal
Establish a clean baseline. Click through every page, capture before-screenshots, and confirm the exact state of every broken page.

### 5.2 Tasks

| # | Task | Output |
|---|---|---|
| 0.1 | Start backend: `cd backend && .venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000` | Backend running on `:8000` |
| 0.2 | Start frontend: `cd web && npm run dev` | Frontend running on `:5173` |
| 0.3 | Create folder `verification-screenshots/phase-0/` | Folder ready |
| 0.4 | Use existing test users to log in (or create a Clerk test user) | Session active |
| 0.5 | Click through every page (14 user pages + admin pages + public pages) | Baseline screenshots saved |
| 0.6 | For each page, record: (a) what's broken, (b) which `data-cm-*` attrs are queried but missing | Audit table saved to `verification-screenshots/phase-0/AUDIT.md` |
| 0.7 | Run `node verify-public.mjs` and `node verify-ask-flow.mjs` to establish baseline | Baseline test results recorded |

### 5.3 Deliverable
- `verification-screenshots/phase-0/AUDIT.md` with one row per page
- All baseline tests passing (31/31 + 7/7)
- Confirmation that 14 pages are indeed broken as expected

### 5.4 Pause Point
No pause — proceed to Phase 1.

---

## 6. Phase 1 — Profile Page Fix (15 min)

### 6.1 Goal
The user's reported bug: Profile page shows hardcoded data. Add the 19 missing `data-cm-*` attributes so the page renders real backend data.

### 6.2 Tasks

| # | Task | Files Touched |
|---|---|---|
| 1.1 | Read `web/src/pages/user/ProfilePage.tsx` and extract the 19 `data-cm-*` attribute names it queries | `web/src/pages/user/ProfilePage.tsx` (read only) |
| 1.2 | For each attribute, identify the corresponding HTML element in the template | `web/src/stitch-content/10-profile.ts` (read only) |
| 1.3 | Add the 19 `data-cm-*` attributes to `stitch-content/10-profile.ts` | `web/src/stitch-content/10-profile.ts` |
| 1.4 | Mirror the same 19 attributes in `web/public/stitch-ref/10-profile.html` | `web/public/stitch-ref/10-profile.html` |
| 1.5 | Run `npm run build` to confirm extraction doesn't wipe markers | `web/dist/*` rebuilt |
| 1.6 | Reload `/profile` in browser, capture screenshot | `verification-screenshots/phase-1/profile.png` |
| 1.7 | Run `verify-public.mjs` to confirm no regression | Tests pass |

### 6.3 Expected Outcome
- Profile page renders real user data: name, avatar, reputation, badges, contribution history
- 19 `data-cm-*` attributes correctly bound

### 6.4 Pause Point
Show screenshot. If user confirms, proceed to Phase 2.

---

## 7. Phase 2 — FAQ Detail Page (30 min)

### 7.1 Goal
Fix the FAQ detail page that shows version history, contributors, sources, community confidence. Add 82 `data-cm-*` attributes.

### 7.2 Tasks
- Extract 82 attribute names from `FaqDetailPage.tsx`
- Add to `stitch-content/03-faq-detail.ts` (53.5kB) and `web/public/stitch-ref/03-faq-detail.html`
- Build, screenshot, test

### 7.3 Deliverable
- `verification-screenshots/phase-2/faq-detail.png` showing real FAQ data (title, content, version badge, contributor avatars, "Last updated" timestamp)

---

## 8. Phase 3 — Discussion Thread + Cursor Preservation (30 min)

### 8.1 Goal
Fix the discussion thread page (35 `data-cm-*` attributes) **and** add explicit cursor/text-selection save-restore logic. The plan flagged cursor preservation as **Critical** — without it, every 6-second poll snaps the user's cursor back to the start of the textarea while typing.

### 8.2 Tasks

| # | Task | Files Touched |
|---|---|---|
| 3.1 | Extract 35 attribute names from `DiscussionThreadPage.tsx` | (read only) |
| 3.2 | Add to `stitch-content/08-thread.ts` and `web/public/stitch-ref/08-thread.html` | 2 files |
| 3.3 | Refactor the reply textarea to save selectionStart/selectionEnd before each poll, restore after re-render | `web/src/pages/user/DiscussionThreadPage.tsx` |
| 3.4 | Add a `useRef` for the textarea element, plus `useEffect` to restore cursor after each poll cycle | `web/src/pages/user/DiscussionThreadPage.tsx` |
| 3.5 | Build, screenshot mid-reply (with a half-typed message), test | 1 screenshot |

### 8.3 Deliverable
- `verification-screenshots/phase-3/thread-typing.png` showing cursor preserved while typing through poll cycles

---

## 9. Phase 4 — Analytics Page + Scale Fix (20 min)

### 9.1 Goal
Fix 50 `data-cm-*` attributes **and** correct the radar chart scale values.

### 9.2 Bug
`web/src/pages/admin/AnalyticsPage.tsx:327–330` uses scale values `0.4 / 1.0 / 2.2 / 6.5` but the design spec calls for `0.5 / 1.0 / 1.5 / 2.0`. The current values are over-aggressive and make the chart unreadable.

### 9.3 Tasks
- Extract 50 attribute names
- Add to `stitch-content/18-analytics.ts` and `web/public/stitch-ref/18-analytics.html`
- Fix scale values to spec
- Build, screenshot, test

### 9.4 Deliverable
- `verification-screenshots/phase-4/analytics.png` showing readable radar chart with correct scale

---

## 10. Phase 5 — Library, Notifications, Discussions, Saved (45 min)

### 10.1 Goal
Fix 4 mid-risk pages.

| Page | Approx. qSel Count | Special Concerns |
|---|---|---|
| LibraryPage | ~25 | Saved FAQs, collections, filter chips |
| NotificationsPage | ~22 | Polling preservation, mark-as-read buttons |
| DiscussionsPage | ~20 | Filter chips, search, sort |
| SavedKnowledgePage | ~18 | Bookmark list, remove actions |

### 10.2 Tasks
- Extract attributes per page
- Add to each `stitch-content/*.ts` and matching `web/public/stitch-ref/*.html`
- Build, screenshot, test

### 10.3 Deliverable
- 4 screenshots showing real data on all 4 pages

---

## 11. Phase 6 — Admin Pages (60 min)

### 11.1 Goal
Fix 5 admin pages.

| Page | Screen # | Concerns |
|---|---|---|
| MissionControl | 15 | Stats cards, health indicators, quick actions |
| FaqManagement | 16 | 4 tabs (Candidates / Published / Versions / Archive) — most complex |
| ModerationQueue | 17 | Report list, status filters |
| ReportDetail | 19 | Evidence review, user history, enforcement actions |
| AdminSettings | 20 | Profile, security, integrations |

### 11.2 Tasks
- Extract attributes per page
- Add to templates
- Build, screenshot, test

### 11.3 Deliverable
- 5 screenshots showing all admin pages rendering real data

---

## 12. Phase 6.5 — Knowledge Evolution Engine — Backend (90 min)

> **This is the soul of the product. Take time. Be careful.**

### 12.1 Goal
Build the four backend services and endpoints that make knowledge actually evolve.

### 12.2 New Files to Create

| File | Purpose |
|---|---|
| `backend/app/services/synthesis.py` | `SynthesisService.synthesize_discussion(discussion_id, user_id) -> FaqCandidate` |
| `backend/app/services/evolution.py` | `EvolutionService.record_event()`, `create_version()`, `compute_diff()` |
| `backend/app/services/consensus.py` | `ConsensusService.compute_score(discussion_id) -> float` |
| `backend/app/api/evolution.py` | New router: `/evolution/*` endpoints |
| `backend/app/api/synthesis.py` | New router: `/synthesis/*` endpoint |
| `backend/tests/test_synthesis.py` | Mocked Gemini tests |
| `backend/tests/test_evolution.py` | Event + version + diff tests |
| `backend/tests/test_consensus.py` | Consensus scoring edge cases |
| `backend/tests/test_rollback.py` | Rollback creates new version (preserves history) |

### 12.3 Synthesis Service Spec

```python
# Pseudo-code for synthesis
async def synthesize_discussion(discussion_id: UUID, user_id: UUID) -> FaqCandidate:
    # 1. Fetch discussion + all replies with vote_score >= 2
    # 2. Sort by score DESC, take top 5
    # 3. Build Gemini prompt:
    #    "You are a knowledge curator for CrowdMind.
    #     Synthesize these community replies into a verified FAQ entry.
    #     Cite the reply IDs you used.
    #     Return JSON: {title, content, category, confidence_breakdown, source_reply_ids}"
    # 4. Call Gemini 2.5 Flash via app.services.gemini
    # 5. Validate response has source_reply_ids
    # 6. Create FaqCandidate with:
    #    - title = ai_title
    #    - content = ai_content
    #    - category_id = ai_category or fallback
    #    - source_reply_ids = [...] (CRITICAL: traceability per Principle 5)
    #    - confidence_score = ai_confidence_breakdown.coverage
    #    - generated_by = "ai"
    #    - synthesis_metadata = {model, prompt_version, response_time_ms, token_usage}
    #    - status = PENDING
    # 7. Create EvolutionEvent of type CANDIDATE_GENERATED
    # 8. Create Notification for the accepting moderator (per Q7=A)
    # 9. Return candidate ID
```

### 12.4 Evolution Service Spec

```python
async def record_event(faq_id: UUID, event_type: str, description: str, triggered_by: UUID):
    # Inserts row into evolution_events table
    # Event types: CANDIDATE_GENERATED, CANDIDATE_APPROVED, CANDIDATE_REJECTED,
    #              VERSION_CREATED, VERSION_EDITED, ROLLBACK, CONSENSUS_MILESTONE

async def create_version(
    faq_id: UUID,
    title: str,
    content: str,
    change_summary: str,
    created_by: UUID
) -> FaqVersion:
    # 1. Fetch current PublishedFaq
    # 2. Compute diff between old content and new content
    # 3. Insert FaqVersion row with diff_data
    # 4. Update PublishedFaq.version_number += 1
    # 5. Create EvolutionEvent of type VERSION_CREATED
    # 6. Return FaqVersion

async def compute_diff(old: str, new: str) -> list[dict]:
    # Word-level Myers-style diff
    # Returns: [{"type": "unchanged|removed|added", "text": "..."}]
    # 80 lines of pure Python, no dependencies
```

### 12.5 Consensus Service Spec

```python
async def compute_score(discussion_id: UUID) -> float:
    # score = (top_reply_score * 0.5) + (avg_reputation * 0.3) + (vote_ratio * 0.2)
    # Clamp to [0.0, 1.0]
    # Persist in Discussion.consensus_score
    # Returns float
```

### 12.6 New API Endpoints

| Method | Path | Auth | Purpose |
|---|---|---|---|
| `POST` | `/api/v1/discussions/{id}/synthesize` | Moderator+ | Trigger AI synthesis → creates FaqCandidate |
| `GET` | `/api/v1/evolution/events` | Public | List recent evolution events (paginated) |
| `GET` | `/api/v1/evolution/events/{faq_id}` | Public | List events for a specific FAQ |
| `GET` | `/api/v1/evolution/timeline/{faq_id}` | Public | Version chain for a FAQ (summary data only) |
| `GET` | `/api/v1/evolution/admin/timeline/{faq_id}` | Admin | Full version chain with diff data |
| `GET` | `/api/v1/evolution/admin/events` | Admin | Full audit log |
| `POST` | `/api/v1/faqs/{id}/rollback/{version_id}` | Admin | Rollback creates new version (preserves history) |
| `GET` | `/api/v1/faqs/{id}/diff/{v1}/{v2}` | Public | Diff between two versions (word-level) |

### 12.7 Auto-Trigger Hooks

| Hook Location | Behavior |
|---|---|
| `DiscussionService.accept_reply()` | After flipping status to ANSWERED, **auto-call `SynthesisService.synthesize_discussion()`** in the background (asyncio.create_task). Notify only the accepting moderator. |
| `FaqService.update_published_faq()` | After updating content, **auto-call `EvolutionService.create_version()`** with computed diff. |
| `FaqService.publish_from_candidate()` | After creating PublishedFaq, **call `EvolutionService.create_version()`** for v1.0, **call `EvolutionService.record_event(CANDIDATE_APPROVED)`**. |

### 12.8 Deliverable
- All new service files created
- All new endpoints tested via `test_synthesis.py`, `test_evolution.py`, `test_consensus.py`, `test_rollback.py`
- `pytest` passes (existing + new tests)

---

## 13. Phase 6.6 — Knowledge Evolution Engine — Frontend (60 min)

### 13.1 Goal
Build the public + admin Evolution UIs using the existing 14-evolution.ts template, plus embed evolution in the FAQ detail page.

### 13.2 Tasks

| # | Task | Files |
|---|---|---|
| 6.6.1 | Refactor `web/src/pages/user/EvolutionPage.tsx` to render the full template, not redirect | `web/src/pages/user/EvolutionPage.tsx` (full rewrite) |
| 6.6.2 | Wire it to `GET /api/v1/evolution/events` (public summary) | New service: `web/src/services/evolution.ts` |
| 6.6.3 | Build `web/src/pages/admin/EvolutionAdminPage.tsx` (new file) — full diff viewer, rollback buttons, audit log | `web/src/pages/admin/EvolutionAdminPage.tsx` |
| 6.6.4 | Update `web/src/pages/user/FaqDetailPage.tsx` — replace the stub "Knowledge Evolution" section with real data from `/evolution/timeline/{faq_id}` | `web/src/pages/user/FaqDetailPage.tsx` |
| 6.6.5 | Add "Synthesize FAQ" button (moderator-only) in `web/src/pages/user/DiscussionThreadPage.tsx` | `web/src/pages/user/DiscussionThreadPage.tsx` |
| 6.6.6 | Add new admin route: `/admin/evolution` in `web/src/App.tsx` | `web/src/App.tsx` |
| 6.6.7 | Add `data-cm-*` attributes to `stitch-content/14-evolution.ts` and `web/public/stitch-ref/14-evolution.html` | 2 files |

### 13.3 Hybrid Access Model (per Q8=B)

| Component | Public | Admin |
|---|---|---|
| Latest version content | ✅ | ✅ |
| Summary badge: "✨ Refined 4 times · Last updated 2 days ago" | ✅ | ✅ |
| Clickable timeline of version dates + contributor counts | ✅ | ✅ |
| Word-level diff viewer (red/green highlights) | ❌ | ✅ |
| "View full version history" link | ✅ (links to admin) | — |
| Rollback buttons | ❌ | ✅ |
| Pending candidates panel | ❌ | ✅ |
| Evolution event audit log | ❌ | ✅ |
| Approve / Reject candidate buttons | ❌ | ✅ |

### 13.4 Knowledge Diff Viewer Spec

A panel with three sections:
1. **Top:** "Comparing v{N-1} → v{N}" header with timestamps
2. **Middle:** Two-column diff
   - Left column: removed text with red strikethrough
   - Right column: added text with green highlight
3. **Bottom:** Action buttons (admin only)
   - "↩ Rollback to v{N-1}" → calls `POST /faqs/{id}/rollback/{version_id}`
   - "✓ Approve change" → already done on publish
   - "📋 Copy diff as markdown" → for sharing

### 13.5 Deliverable
- `/evolution` renders real data (latest version, summary badge, public timeline)
- `/admin/evolution` renders full data (diffs, rollback, audit)
- FAQ detail page shows real version history
- Discussion thread has "Synthesize FAQ" button for mods

---

## 14. Phase 6.7 — Evolution Engine Tests + Seed Data (30 min)

### 14.1 Goal
Test the engine end-to-end and seed demo data so the platform looks alive on first run.

### 14.2 New Test Files

| File | Coverage |
|---|---|
| `backend/tests/test_synthesis.py` | SynthesisService with mocked Gemini; verifies source_reply_ids persisted |
| `backend/tests/test_evolution.py` | record_event, create_version, compute_diff (word-level) |
| `backend/tests/test_consensus.py` | Consensus scoring with mocked reply data |
| `backend/tests/test_rollback.py` | Rollback creates v(N+1) with old content; doesn't delete v(N) |

### 14.3 Seed Script

`backend/scripts/seed_evolution_demo.py`:
1. Create 1 PublishedFaq: "ViBe Team Formation Policy"
2. Manually create 4 FaqVersion rows representing v1.0 → v4.0
3. Each version has progressively improved content (e.g., v1: short, v4: comprehensive)
4. Each version has a `change_summary` explaining what changed
5. Create 3 EvolutionEvent rows:
   - `CANDIDATE_APPROVED` at v1.0 creation
   - `VERSION_CREATED` at v2.0
   - `CONSENSUS_MILESTONE` at v4.0 (e.g., 50+ upvotes)
6. The Evolution page immediately shows:
   - "VERSION 4.0" badge glowing
   - Knowledge Diff Viewer with red/green highlights
   - "98% accuracy · 89% agreement · 3.2 versions/month" health metrics
   - 3+ colored event types in the timeline

### 14.4 Deliverable
- All new tests pass
- `seed_evolution_demo.py` runs successfully
- `/evolution` and `/admin/evolution` look demo-ready

---

## 15. Phase 7 — Backend Hardening (20 min)

### 15.1 Goal
Address 4 backend issues identified in the audit.

### 15.2 Tasks

| # | Issue | Location | Fix |
|---|---|---|---|
| 7.1 | No Gemini cache invalidation | `backend/app/api/questions.py:77-208` | Add `?force=true` query param to bypass cache |
| 7.2 | ViBe-specific hardcoded fallback | `backend/app/api/questions.py:184` | Replace with generic: "Based on community discussion, this requires approval from the appropriate coordinator." |
| 7.3 | No admin endpoint to flush cache | (missing) | Add `POST /api/v1/admin/questions/cache/flush` |
| 7.4 | Gemini endpoint has no dedicated test | `backend/tests/test_questions.py` | Create `test_question_analysis.py` covering: success, fallback, cache hit, cache invalidation, error handling |

### 15.3 Deliverable
- `pytest` passes
- Manual test of cache flush

---

## 16. Phase 8 — Final Verification & Documentation (20 min)

### 16.1 Goal
Confirm everything works, document the changes, and update stale docs.

### 16.2 Tasks

| # | Task | Output |
|---|---|---|
| 8.1 | Run `node verify-public.mjs` | 31/31 PASS |
| 8.2 | Run `node verify-ask-flow.mjs` | 7/7 PASS |
| 8.3 | Run `.venv\Scripts\python.exe -m pytest` | All tests pass |
| 8.4 | Run `npm run build` | Build succeeds |
| 8.5 | Click through all 14 pages + admin pages, capture final screenshots | `verification-screenshots/phase-8/` |
| 8.6 | Write `verification-screenshots/phase-8/FINAL_REPORT.md` summarizing all changes | Report saved |
| 8.7 | Update `PROJECT_STATE.md` to v1.4 with all completed phases | Updated |
| 8.8 | Update `IMPLEMENTATION_PLAN.md` to mark Handover Phases 1–5 as DONE with date | Updated |
| 8.9 | Update `CHANGELOG.md` with v2.0.0 entry | Updated |
| 8.10 | Update `VERIFICATION_WALKTHROUGH.md` with latest results | Updated |

### 16.3 Deliverable
- All 4 verification commands pass
- All 4 docs updated
- `FINAL_REPORT.md` saved

---

## 17. Verification Gates

A phase is **only complete** when ALL of the following pass:

| Gate | Command | Expected |
|---|---|---|
| Backend tests | `.venv\Scripts\python.exe -m pytest` | All PASS |
| Public UI tests | `node verify-public.mjs` | 31/31 PASS |
| Ask flow tests | `node verify-ask-flow.mjs` | 7/7 PASS |
| TypeScript build | `npm run build` | Success, no errors |
| Stitch extraction | `npm run stitch:extract` | Preserves all `data-cm-*` markers |
| Visual diff | Manual click-through | All pages render real data |

If any gate fails, I stop, fix, and re-run.

---

## 18. Risk Register

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Gemini returns malformed JSON in synthesis | Medium | High | Wrap call in try/except; fallback to deterministic extraction from top reply; never silently fail |
| R2 | Moderator burnout from auto-synthesis flood | Low (per Q7=A) | Medium | Auto-synthesis is quiet; only the accepting mod sees it; they can promote to review with one click |
| R3 | Diff algorithm produces ugly output | Low | Low | Word-level Myers-style; test with 10+ sample diffs |
| R4 | `stitch:extract` overwrites our `data-cm-*` markers | Low (per Q5=A) | High | Mirror changes in BOTH `.html` and `.ts`; verify after every build |
| R5 | Consensus score formula doesn't match real data | Medium | Medium | Add admin endpoint to recompute; log when score is recomputed; allow formula in config |
| R6 | Rollback accidentally deletes versions | Low | Critical | Code review: rollback creates a NEW version, never deletes; tests assert this |
| R7 | Seed data conflicts with real user data | Low | Low | Use `if not exists` checks; idempotent script |
| R8 | Evolution page slow with many events | Low | Medium | Pagination on `/evolution/events`; default page size 20 |

---

## 19. Appendix — File Reference

### 19.1 Critical Files to Edit

| File | Lines | Purpose |
|---|---|---|
| `web/src/stitch-content/10-profile.ts` | 424 | Add 19 `data-cm-*` attrs |
| `web/src/stitch-content/03-faq-detail.ts` | ~2000 | Add 82 `data-cm-*` attrs |
| `web/src/stitch-content/08-thread.ts` | ~1500 | Add 35 `data-cm-*` attrs |
| `web/src/stitch-content/14-evolution.ts` | ~300 | Will be fully wired to real data |
| `web/src/stitch-content/18-analytics.ts` | ~800 | Fix scale values + add 50 attrs |
| `web/src/pages/user/ProfilePage.tsx` | 57.4kB | The bug source |
| `web/src/pages/user/EvolutionPage.tsx` | 34 | Full rewrite (no more redirect) |
| `web/src/pages/user/FaqDetailPage.tsx` | 53.5kB | Wire to `/evolution/timeline/{id}` |
| `web/src/pages/user/DiscussionThreadPage.tsx` | 35 qSel | Add cursor preservation + Synthesize button |
| `web/src/pages/admin/AnalyticsPage.tsx` | 50 qSel | Fix radar scale values |

### 19.2 New Files to Create (Phase 6.5+)

**Backend:**
- `backend/app/services/synthesis.py`
- `backend/app/services/evolution.py`
- `backend/app/services/consensus.py`
- `backend/app/api/evolution.py`
- `backend/app/api/synthesis.py`
- `backend/tests/test_synthesis.py`
- `backend/tests/test_evolution.py`
- `backend/tests/test_consensus.py`
- `backend/tests/test_rollback.py`
- `backend/scripts/seed_evolution_demo.py`

**Frontend:**
- `web/src/pages/admin/EvolutionAdminPage.tsx`
- `web/src/services/evolution.ts`

### 19.3 Critical Environment

| File | Value |
|---|---|
| `backend/.env` | `GEMINI_API_KEY` set |
| `web/.env` | `VITE_GEMINI_API_KEY` set (if used by frontend) |
| Backend port | 8000 |
| Frontend port | 5173 |
| DB | PostgreSQL (Neon) via asyncpg |
| Test users | See `verify-public.mjs` for credentials |

### 19.4 Existing Test Infrastructure

- `web/verify-public.mjs` — 31-check Playwright suite
- `web/verify-ask-flow.mjs` — 7-check ask flow suite
- `backend/tests/` — 16 pytest files
- `verification-screenshots/` — current screenshots, will gain `phase-0/` through `phase-8/`

---

## 20. Final Statement

This plan is **frozen and ready to execute**. The user has locked all 9 decisions. The next step is to begin **Phase 0: Setup & Visual Audit** — start the dev server, click through every page, capture baseline screenshots, and confirm the 14 broken pages are exactly as the audit suggests.

If during execution we discover a previously-unknown issue (e.g., a 15th page is broken, or a model is missing), I will:
1. Stop and report the new finding
2. Propose a fix
3. Get the user's go-ahead before proceeding

Otherwise, the build proceeds phase by phase, with diffs + screenshots + test results shown after every change.

**Total estimated time: 7 hours.**
**Outcome: 14 broken pages fixed + Knowledge Evolution Engine built + backend hardened + docs updated.**

---

*End of Master Execution Plan v2.0*
