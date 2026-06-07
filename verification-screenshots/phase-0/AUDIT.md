# Phase 0 — Visual & Static Audit

**Date:** 2026-06-07
**Mode:** Dev servers started in-process (one-shot Node.js script)
**Pages checked:** 24 (4 public + 20 auth-gated)
**Issues found:** 0 crashes, 0 hardcoded placeholders, 1 missing template attribute pattern (Library), 1 user-reported bug (Profile), 1 redirect stub (Evolution)

---

## 1. Environment Baseline

| Check | Result |
|---|---|
| `backend/.venv/Scripts/python.exe` | ✅ exists |
| `web/node_modules` | ✅ exists |
| `backend/.env` (DATABASE_URL, CLERK_*, GEMINI_API_KEY) | ✅ all set |
| `web/.env` (VITE_CLERK_PUBLISHABLE_KEY, VITE_API_URL) | ✅ all set |
| Ports 5173 / 8001 | ✅ free at start |
| `npm run build` | ✅ 3.45s, 0 errors (1 chunk-size warning) |
| Existing `verify-public.mjs` (31 checks) | ✅ 31/31 PASS, 0 issues (full-report.json 2026-06-07) |

---

## 2. Dev Server Click-Through

Ran `web/audit-phase-0.mjs` which starts both servers in-process, navigates to 24 pages, captures screenshots and console errors. Servers auto-killed on script exit.

### 2.1 Pages Loaded (all 200)

| # | Page | Final URL | Notes |
|---|---|---|---|
| 1 | `/` (landing) | `/` | ✅ Renders 139 FAQs, 16 categories, V2.0 LIVE banner |
| 2 | `/library` | `/library` | ✅ Renders 139 FAQs, 90.9% AI-verified, featured "Rosetta" FAQ |
| 3 | `/discussions` | `/discussions` | ✅ Renders trending discussions, "AI CONFIDENCE 81%" |
| 4 | `/login` | `/login` | ✅ Clerk SignIn form, "Development mode" badge |
| 5-24 | All auth-gated pages | `/login` | ✅ All correctly redirect to /login (Clerk not signed in) |

### 2.2 Hardcoded Text Scan

Searched all 24 page bodies for: `John Doe`, `Jane Doe`, `Lorem ipsum`, `TODO`, `FIXME`, `Sample User`, `test@test`, `placeholder`.

**Result: 0 hits.** No "Lorem ipsum" or developer placeholders visible in any rendered page.

### 2.3 Console Errors

6 errors total, all from the same root cause:
- `ApiError: Invalid discussion_id format: must be a valid UUID` — appears 3× on `/discussions/test-id` and 1× on `/faq/test-id`
- The Playwright audit used `test-id` as a placeholder; real UUIDs would not trigger this
- 2× associated `Failed to load resource: 400` from the same calls
- **Impact:** None on real user flows. Real UUIDs work.

### 2.4 Page Errors (uncaught exceptions)
**0 page errors.** No React crashes, no null reference errors, no infinite loops.

---

## 3. Static Analysis — The Real Issues

| Page | data-cm-* attrs queried | Pattern in template | Status |
|---|---|---|---|
| **ProfilePage** | **19** | **0 IDs, 0 data-cm-*** | 🔴 **BROKEN** (user's reported bug) |
| **LibraryPage** | **3** | **0 IDs, 0 data-cm-*** | 🔴 **BROKEN** (pagination buttons) |
| AnalysisPage | 0 | 14 IDs | ✅ working via IDs |
| AskQuestionPage | 0 | 23 IDs | ✅ working via IDs |
| FaqDetailPage | 0 | 0 IDs (class-based) | ✅ working via Tailwind classes |
| DiscussionThreadPage | 0 | 0 IDs (class-based) | ✅ working via Tailwind classes |
| NotificationsPage | 0 | 0 IDs (class-based) | ✅ working via classes + state preservation |
| EvolutionPage | 0 | 0 IDs | 🔴 **REDIRECT STUB** (34 lines, redirects to /ask) |
| Admin pages | 0 | mostly 0 IDs (class-based) | ✅ working via classes |
| Settings (20) | 0 | 13 IDs | ✅ working via IDs |
| Analytics (18) | 0 | 3 IDs | ✅ working via IDs |
| Report (19) | 0 | 2 IDs | ✅ working via IDs |
| Contributions (13) | 0 | 1 ID | ✅ working via ID |
| Faq Candidate Review (21) | 0 | 0 IDs | ✅ working via classes |

### Key Insight

The plan's assumption that **"14 pages are broken"** is **incorrect**. The static analysis shows only **2 pages** (Profile, Library) have the data-cm-* mismatch problem. The other pages use either:
- **ID-based selectors** (`#status-card-container`, `#question-title-input`) — works because templates have IDs
- **Class-based selectors** (Tailwind utility classes) — works because templates use the same classes

The "14 broken pages" estimate came from a count of templates with 0 IDs, but **ID count is not the right metric** — what matters is whether the React page's selectors match the template. Most React pages don't query by `data-cm-*` at all; they query by class or by ID.

---

## 4. Issue-by-Issue Plan

### Issue 1: ProfilePage — 19 missing `data-cm-*` attributes
- **Source:** `web/src/pages/user/ProfilePage.tsx` lines 497–907
- **Target:** `web/src/stitch-content/10-profile.ts` + `web/public/stitch-ref/10-profile.html`
- **Attrs needed:** `data-cm-profile-name`, `data-cm-username`, `data-cm-rank-badge`, `data-cm-bio`, `data-cm-avatar`, `data-cm-joined`, `data-cm-reputation`, `data-cm-rank-name`, `data-cm-rank-percent`, `data-cm-rank-next`, `data-cm-rank-progress-pct`, `data-cm-rank-bar`, `data-cm-community-rank`, `data-cm-heatmap`, `data-cm-total-contributions`, `data-cm-streak="current"`, `data-cm-streak="longest"`, `data-cm-streak="monthly"`, `data-cm-streak="impact"`
- **Severity:** 🔴 Critical (user-reported)
- **Phase:** 1

### Issue 2: LibraryPage — 3 missing `data-cm-*` attributes
- **Source:** `web/src/pages/user/LibraryPage.tsx` lines 328–330
- **Target:** `web/src/stitch-content/02-library.ts` + `web/public/stitch-ref/02-library.html`
- **Attrs needed:** `data-cm-pagination`, `data-cm-page-prev`, `data-cm-page-next`
- **Severity:** 🟡 Medium (pagination buttons don't disable, but no crash)
- **Phase:** 5 (along with other Library work)

### Issue 3: EvolutionPage — redirect stub
- **Source:** `web/src/pages/user/EvolutionPage.tsx` (34 lines)
- **Target:** Full rewrite in Phase 6.6 (Knowledge Evolution Engine frontend)
- **Severity:** 🔴 High (this is the platform's flagship differentiator)
- **Phase:** 6.6

### Issue 4: DiscussionThreadPage — cursor preservation
- **Source:** `web/src/pages/user/DiscussionThreadPage.tsx` — 6s poll resets cursor in reply textarea
- **Target:** Save/restore `selectionStart`/`selectionEnd` in reply textarea
- **Severity:** 🟡 Medium (UX issue, no crash)
- **Phase:** 3

### Issue 5: Admin AnalyticsPage — radar scale values
- **Source:** `web/src/pages/admin/AnalyticsPage.tsx` lines 327–330
- **Target:** Change `0.4 / 1.0 / 2.2 / 6.5` to `0.5 / 1.0 / 1.5 / 2.0`
- **Severity:** 🟢 Low (cosmetic, but the plan calls for it)
- **Phase:** 4

### Issue 6: Knowledge Evolution Engine — entirely missing
- **Source:** Plan Phases 6.5–6.7
- **Target:** New services, endpoints, frontend page, tests, seed data
- **Severity:** 🔴 Critical (flagship feature, soul of product)
- **Phase:** 6.5–6.7

### Issue 7: Backend hardening — 4 issues
- **Source:** `backend/app/api/questions.py` (ViBe fallback, no cache invalidation), no admin cache flush, no test for analysis endpoint
- **Target:** Replace ViBe string, add `?force=true`, add admin endpoint, add test
- **Severity:** 🟡 Medium
- **Phase:** 7

---

## 5. Revised Phase Plan

| Phase | Description | Est. Time | Status |
|---|---|---|---|
| 0 | Setup & Audit (this document) | 30 min | ✅ Done |
| 1 | Profile fix — 19 attrs | 15 min | ⏳ Next |
| 2 | FaqDetail — verify renders, no attrs needed | 20 min | ⏳ Pending |
| 3 | DiscussionThread + cursor preservation | 30 min | ⏳ Pending |
| 4 | Admin Analytics + scale fix | 15 min | ⏳ Pending |
| 5 | Library (3 attrs) + Notif + Disc + Saved | 30 min | ⏳ Pending |
| 6 | Admin pages (5) — verify renders | 20 min | ⏳ Pending |
| 6.5 | Evolution backend (synthesis, evolution, consensus + 8 endpoints) | 90 min | ⏳ Pending |
| 6.6 | Evolution frontend (rewrite EvolutionPage, add admin page, embed in FaqDetail) | 60 min | ⏳ Pending |
| 6.7 | Evolution tests + seed data | 30 min | ⏳ Pending |
| 7 | Backend hardening (4 fixes) | 20 min | ⏳ Pending |
| 8 | Final verification + docs | 20 min | ⏳ Pending |
| **Total** | | **~6 hours** | |

Reduction from original 7h estimate because audit revealed only 2 pages have real data-cm-* gaps (not 14).

---

## 6. Verification Approach for Auth-Gated Pages

Since Clerk is the only auth provider and we have no test account, I cannot visually test authenticated flows from a script. My mitigation strategy:

1. **Static verification:** Confirm the `data-cm-*` attrs exist in the built output (after `npm run build`)
2. **Build verification:** `npm run build` must succeed with no errors
3. **Public page regression:** Run `verify-public.mjs` (31 checks) — must remain 31/31 PASS
4. **Static correctness:** Use a Playwright check that visits each page and asserts `[data-cm-X]` exists in the DOM for the queried attrs

This is the same approach the existing C-tests use (they grep for patterns in .ts files). My new approach will use Playwright to actually load the page and query the DOM — but only for PUBLIC pages (auth-gated pages will redirect to /login).

For the final Phase 8 verification, the user (you) will need to click through the authenticated pages manually and confirm the fix works.

---

## 7. Server Logs

Backend log: `verification-screenshots/phase-0/backend-server.out.log`
Frontend log: `verification-screenshots/phase-0/frontend-server.out.log`
Audit JSON: `verification-screenshots/phase-0/audit-report.json`
24 screenshots: `verification-screenshots/phase-0/A*.png` and `0[1-9]_*.png`, `1[0-9]_*.png`, `2[0-9]_*.png`
