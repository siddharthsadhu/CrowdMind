# CrowdMind — Page Navigation Map (Phase 7 source of truth)

**Created:** Phase 7 (manual E2E) — replaces the partial `docs/NAVIGATION_AND_SCREENS.md`.
**Use this as the contract** for every page's wiring. If a CTA is not listed here, it shouldn't exist.

---

## 0. Conventions

- `auth: guest | user | admin` — who can see this page
- `→ /path` — exact destination of the clickable element
- **Status**: `OK` (verified), `BUG` (reported, not fixed), `TODO` (planned)
- Stitch IDs (`S##`) reference the original 21 design screens; new screens get new IDs

### Top-level navigation (header, every page)

| Label | Guest | User | Admin | Notes |
|-------|:-----:|:----:|:-----:|-------|
| CrowdMind (logo) | → `/` | → `/` | → `/` | Always |
| FAQs | → `/library` | → `/library` | → `/library` | |
| Discussions | → `/discussions` | → `/discussions` | → `/discussions` | |
| Ask Question | → `/login` | → `/ask` | → `/ask` | Guard redirect for guests |
| Analytics | → `/evolution` | → `/evolution` | → `/evolution` | User-facing; admin has separate dashboard |
| (search box) | → `/library?q=…` | → `/library?q=…` | → `/library?q=…` | Debounced submit |
| (bell) | hidden | → `/notifications` | → `/notifications` | |
| (avatar dropdown) | n/a (Sign In/Sign Up shown) | → `/home` (menu opens) | → `/home` (menu opens) | Floating React UserMenu, NOT Stitch static avatar |

### Floating user menu (signed-in only)

| Item | → |
|------|---|
| View profile | `/home` |
| My contributions | `/contributions` |
| Saved | `/saved` |
| Notifications | `/notifications` |
| Settings | `/settings` (user) / `/admin/settings` (admin) |
| (admin only) Mission Control | `/admin` |
| Sign out | `/login` (after Clerk signOut) |

### Footer (every page, except `/login`, `/register`)

| Column | Guest | User | Admin | Notes |
|--------|:-----:|:----:|:-----:|-------|
| Product (Library, Discussions, Ask Question, Knowledge Evolution) | ✓ | ✓ | ✓ | |
| Account (Profile, Saved, Notifications, Settings) | hidden | ✓ | ✓ | Hide for guest |
| **Admin** (Mission Control, FAQ Management, Moderation, Analytics) | **hidden** | **hidden** | ✓ | **BUG fix Phase 7** — currently visible to all signed-in users |
| Resources (About, Methodology, Status, Privacy, Terms) | ✓ | ✓ | ✓ | Methodology = new page (Phase 7) |

---

## 1. Public / guest pages (no login)

### 1.1 Landing `/`  — S01 — `pages/user/LandingPage.tsx` + `stitch-content/01-landing.ts`

| Element | Current | Target | Status |
|---------|---------|--------|--------|
| Hero "Explore FAQs" | → `/library` | → `/library` | OK |
| Hero "Ask a Question" | → `/login` (guest) / `/ask` (signed) | same | OK |
| **Hero "Get Started Now"** | → `/login` (even when signed in) | → `/home` (signed) / `/login` (guest) | **BUG** — should redirect to profile when signed in |
| **Hero "Learn Our Methodology"** | → `/admin/analytics` | → `/methodology` (NEW page) | **BUG** — wrong destination |
| **Hero stats (4 numbers)** | Hardcoded `12.4k+ / 45k / 98.2% / 3.1k` | Real from `/api/stats/summary` (FAQs total, discussions, resolution %, contributors) | **BUG** — hardcoded |
| **"Trending FAQs" cards (4)** | Static HTML, no source | From `/api/faqs/trending` (top 4 by views+recency) | **BUG** — needs backend |
| **"Active peer reviews" cards** | Static HTML | Same `/api/faqs/trending` (filtered to candidate/review status) or new endpoint | **BUG** — needs backend |
| Trending FAQ card click | `href="#"` (Stitch) | → `/faq/{id}` | TODO — wire via StitchPage navMap |
| Footer (see above) | Admin col visible to all | Hidden for non-admins | **BUG** |
| Avatar/header alignment | Static avatar hidden (Phase 5.1), floating React menu overlay | OK once floating menu is positioned outside header flow | **BUG** — overlap reported |

### 1.2 Library `/library`  — S02 — `pages/user/LibraryPage.tsx` + `stitch-content/02-library.ts`

| Element | Current | Target | Status |
|---------|---------|--------|--------|
| Search box | Live search (Phase 5.3) | same | OK |
| Category filter chips | Wired | same | OK |
| FAQ card click | → `/faq/{id}` | same | OK |
| Pagination (1-5, prev/next) | Wired (Phase 5.3b) | same | OK |
| "Save" button on card | n/a | n/a | n/a (saved is on detail page) |
| "Ask Question" CTA | → `/ask` (guard) | same | OK |

### 1.3 FAQ Detail `/faq/:id`  — S03 — `pages/user/FaqDetailPage.tsx` + `stitch-content/03-faq-detail.ts`

| Element | Current | Target | Status |
|---------|---------|--------|--------|
| "Save" | → `/api/saved` POST | same | OK |
| "Share" | `navigator.clipboard` | same | OK |
| "Related Discussions" | List, clickable | same | OK |
| Upvote/downvote | Wired | same | OK |
| "Suggest edit" | → `/ask` with prefill | same | OK |
| "View Evolution" | → `/evolution` | same | OK |

### 1.4 Discussions `/discussions`  — S07 — `pages/user/DiscussionsPage.tsx` + `stitch-content/07-discussions.ts`

| Element | Current | Target | Status |
|---------|---------|--------|--------|
| Thread card | → `/discussions/{id}` | same | OK |
| "New Discussion" | → `/discussions/new` (guard) | same | OK |
| Tag filter | Wired | same | OK |

### 1.5 Discussion Thread `/discussions/:id`  — S08 — `pages/user/DiscussionThreadPage.tsx` + `stitch-content/08-discussion-thread.ts`

| Element | Current | Target | Status |
|---------|---------|--------|--------|
| Reply | POST (login) | same | OK |
| Accept reply | POST (creator only) | same | OK |
| "Report" | POST `/api/reports` | same | OK |

### 1.6 Knowledge Evolution `/evolution`  — S10 — `pages/user/EvolutionPage.tsx` + `stitch-content/10-evolution.ts`

| Element | Current | Target | Status |
|---------|---------|--------|--------|
| Version timeline | Wired | same | OK |
| Diff viewer | Wired | same | OK |
| FAQ link from event | → `/faq/{id}` | same | OK |

### 1.7 Methodology `/methodology`  — S26 (NEW) — `pages/user/MethodologyPage.tsx` + `stitch-content/26-methodology.ts`  (Phase 7)

Sections: (1) Hero with "Cognitive clarity, crowd-validated" headline; (2) Four pillars (Crowdsourced intelligence, Peer-reviewed, Full audit trail, Live consensus); (3) 5-step lifecycle (Ask → Discuss → Review → Publish → Evolve); (4) "From question to consensus" deep dive with checklist; (5) "Try it" CTA card.

| Element | Destination | Notes |
|---------|-------------|-------|
| "Explore Library" | → `/library` | |
| "Join the Community" | → `/register` (guest) / `/home` (signed) | |
| "Learn about Knowledge Evolution" | → `/evolution` | |

**Design source**: build a 3-section Stitch-style page: (1) How CrowdMind Works (crowdsourcing + peer review), (2) The Knowledge Lifecycle (Ask → Discuss → Review → Publish → Evolve), (3) Why it Matters (quality, transparency, audit trail). Same theme, color, typography as Landing.

### 1.8 Login `/login`  — S20 — `pages/user/LoginPage.tsx`

| Element | Destination | Status |
|---------|-------------|--------|
| Clerk SignIn component | (Clerk hosted) | OK |
| "Sign up" link | → `/register` | OK |
| Footer hidden | yes | OK |

### 1.9 Register `/register`  — S21 — `pages/user/RegisterPage.tsx`

| Element | Destination | Status |
|---------|-------------|--------|
| Clerk SignUp component | (Clerk hosted) | OK |
| "Sign in" link | → `/login` | OK |
| Footer hidden | yes | OK |

### 1.10 404 `/*`  — `pages/NotFoundPage.tsx` (Phase 5.6)

| Element | Destination | Status |
|---------|-------------|--------|
| "Go home" | → `/` | OK |
| "Browse library" | → `/library` | OK |

---

## 2. Authenticated user pages (login required)

### 2.1 Profile `/home`  — S04 — `pages/user/ProfilePage.tsx` + `stitch-content/04-profile.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| Tab "Questions" | (in-page) | OK |
| Tab "Answers" | (in-page) | OK |
| Tab "FAQs" | (in-page) | OK |
| Tab "Discussions" | (in-page) | OK |
| Tab "Achievements" | (in-page) | OK |
| "Edit profile" | (modal/in-page) | OK |
| "View contributions" | → `/contributions` | OK |

### 2.2 Ask Question `/ask`  — S05 — `pages/user/AskQuestionPage.tsx` + `stitch-content/05-ask.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| Submit | → `/analysis/{newId}` | OK |
| "Cancel" | → `/library` | OK |

### 2.3 AI Analysis `/analysis/:id`  — S06 — `pages/user/AnalysisPage.tsx` + `stitch-content/06-analysis.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| "Submit as candidate" | POST + → `/library` | OK |
| "Edit question" | → `/ask?prefill=…` | OK |
| "View discussion" | → `/discussions/{id}` | OK |

### 2.4 Create Discussion `/discussions/new`  — S09 — `pages/user/CreateDiscussionPage.tsx` + `stitch-content/09-create-discussion.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| Submit | → `/discussions/{newId}` | OK |
| "Cancel" | → `/discussions` | OK |

### 2.5 Saved Knowledge `/saved`  — S11 — `pages/user/SavedKnowledgePage.tsx` + `stitch-content/11-saved.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| Card | → `/faq/{id}` | OK |
| "Unsave" | DELETE `/api/saved/{id}` | OK |
| Collection filter | (in-page) | OK |

### 2.6 Notifications `/notifications`  — S12 — `pages/user/NotificationsPage.tsx` + `stitch-content/12-notifications.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| Notification link | depends on type (FAQ / discussion / mention) | OK |
| "Mark all read" | POST | OK |
| "Archive" | POST | OK |
| Filter tabs (all/unread/archived) | (in-page) | OK |

### 2.7 My Contributions `/contributions`  — S13 — `pages/user/ContributionsPage.tsx` + `stitch-content/13-contributions.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| Activity item | (links out by type) | OK |
| "View profile" | → `/home` | OK |

### 2.8 Settings `/settings`  — S14 — `pages/user/UserSettingsPage.tsx` (user-only)

| Element | Destination | Status |
|---------|-------------|--------|
| Tab "Account" | (in-page) | OK |
| Tab "Preferences" | (in-page) | OK |
| Tab "Security" | (Clerk UserProfile) | OK |
| "Back to app" | → `/home` | OK |

---

## 3. Admin pages (admin only)

### 3.1 Mission Control `/admin`  — S15 — `pages/admin/MissionControlPage.tsx` + `stitch-content/15-mission-control.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| Metric cards (KPIs) | (in-page) | OK |
| "View pending reviews" | → `/admin/faq-review` | OK |
| "Open moderation queue" | → `/admin/moderation` | OK |
| "Platform Intelligence" | → `/admin/analytics` | OK |

### 3.2 FAQ Management `/admin/faq`  — S16 — `pages/admin/FaqManagementPage.tsx` + `stitch-content/16-faq-management.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| Row "Review" | → `/admin/faq-review/{id}` | OK |
| "Edit" | (in-page modal) | OK |
| "Archive" | POST | OK |
| "Add FAQ" | (in-page modal) | OK |

### 3.3 FAQ Candidate Review `/admin/faq-review/:id?`  — S17 — `pages/admin/FaqCandidateReviewPage.tsx` + `stitch-content/17-faq-review.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| "Approve" | POST + back to `/admin/faq` | OK |
| "Reject" | POST + back to `/admin/faq` | OK |
| "Request changes" | POST + back to `/admin/faq` | OK |
| "View source discussion" | → `/discussions/{id}` (if linked) | OK |

### 3.4 Moderation Queue `/admin/moderation`  — S17 (alt) — `pages/admin/ModerationPage.tsx` + `stitch-content/17-moderation.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| Report row "Investigate" | → `/admin/reports/{id}` | OK |
| "Dismiss" | POST | OK |
| "Take down" | POST | OK |

### 3.5 Platform Intelligence `/admin/analytics`  — S18 — `pages/admin/AnalyticsPage.tsx` + `stitch-content/18-analytics.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| "Export CSV" | download | OK |
| Date range filter | (in-page) | OK |
| "View FAQ" (in chart tooltip) | → `/faq/{id}` | OK |

### 3.6 Report Investigation `/admin/reports/:id`  — S19 — `pages/admin/ReportInvestigationPage.tsx` + `stitch-content/19-report-investigation.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| "Warn author" | POST | OK |
| "Hide content" | POST | OK |
| "Delete content" | POST | OK |
| "Escalate" | POST | OK |
| "Dismiss" | POST + back to `/admin/moderation` | OK |

### 3.7 Admin Settings `/admin/settings`  — S20 (alt) — `pages/admin/SettingsPage.tsx` + `stitch-content/20-admin-settings.ts`

| Element | Destination | Status |
|---------|-------------|--------|
| Platform toggles | (in-page) | OK |
| Role management | (in-page) | OK |
| "Back to Mission Control" | → `/admin` | OK |

---

## 4. Cross-cutting: Stitch page wiring

`StitchPage.tsx` is the bridge between static HTML and React. It:
1. Injects `<style>` and `<div ref=rootRef dangerouslySetInnerHTML>` (memoized)
2. Wires every `<a href>` and `<button>` whose text matches a key in `navMap`
3. Hides Stitch static avatar, appends floating React UserMenu
4. For guests, appends Sign In / Sign Up buttons
5. For signed-in users, hides guest buttons

**navMap convention** (additive per page):

```ts
const navMap = {
  'explore faqs': '/library',
  'ask a question': '/ask',
  'get started now': '/home',     // signed-in only; /login for guest (handled in handler)
  'learn our methodology': '/methodology',
  // etc.
}
```

`StitchPage` always wins over `<a href>`; `e.preventDefault()` is called when a navMap match is found.

---

## 5. Phase 7 backlog (landing + cross-cutting)

| # | Page | Bug | Fix | Status |
|---|------|-----|-----|--------|
| 1 | `/` | Hardcoded hero stats (12.4k+/45k/98.2%/3.1k) | New `GET /api/v1/stats/summary` returns `total_faqs=139, total_discussions=12, resolution_rate=25, total_users=30`; landing wires to `[data-stat="…"]` elements | **DONE** (e2e verified) |
| 2 | `/` | "Trending FAQs" cards static | New `GET /api/v1/stats/trending-faqs?limit=4` (top by views+recency); landing replaces 4 cards with real FAQ titles, categories, AI confidence | **DONE** (e2e verified) |
| 3 | `/` | "Active peer reviews" cards static | Reuses `/api/v1/discussions?page_size=2` (most recent with reply_count > 0); renders title, reply count, consensus bar | **DONE** (e2e verified) |
| 4 | `/` | "Get Started Now" → `/login` always | LandingPage branches on `useAuth().role`: guest → `/login`, signed-in → `/home`; override placed AFTER `...commonUserNav` spread (last-write-wins) | **DONE** |
| 5 | `/` | "Learn Our Methodology" → `/admin/analytics` | New `/methodology` page (`stitch-content/26-methodology.ts` + `pages/user/MethodologyPage.tsx`); landing wires button to it; same theme, color, typography as Landing | **DONE** (e2e verified) |
| 6 | `/` | Footer Admin col visible to non-admins | `PageFooter` reads `role` from `useAuth()`; Admin col only when `isAdmin`, Account col only when `isSignedIn` | **DONE** (e2e verified for guest) |
| 7 | `/` | Avatar/header overlap | Floating React UserMenu moved from `top-3 right-24` → `top-16 right-4` (below the Stitch header); Stitch header's bell+settings buttons hidden to avoid duplication; only the floating menu + footer for signed-in nav | **DONE** |

## 6. Phase 7 backlog (other pages)

- (to be filled as user reports and we walk page-by-page)

---

## 7. Open questions

- Q: Should "Knowledge Evolution" appear in top nav for all roles, or only signed-in? — **defer to user**
- Q: Should the new `/methodology` page be a full Stitch screen (S26) or a custom page? — **Stitch-style, in-house content (per user)**
- Q: Is `/admin/analytics` still called "Platform Intelligence" everywhere, or just on the screen? — **header says "Analytics"** per Stitch, page title says "Platform Intelligence"
