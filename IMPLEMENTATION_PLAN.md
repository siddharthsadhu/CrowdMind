# IMPLEMENTATION_PLAN.md
# CrowdMind — Production SaaS Transformation Plan
# Version: 1.2
# Date: 2026-06-03
# Status: PENDING REVIEW

## 1. Current State Analysis & Gaps

We need to transform the static, template-cloned elements of the frontend screens into a fully interactive, real-time database-driven system.

### Identified Gaps:
- **Landing Page**: Trending FAQs and active peer reviews (discussions) are hardcoded.
- **Library Page**: Search input is UI-only. Filter checkboxes (categories and status) and the sorting dropdown do not filter or sort the FAQs.
- **FAQ Detail Page**:
  - Bookmarking is UI-only and does not persist.
  - Helpful/Not Helpful feedback buttons are non-functional.
  - The "Knowledge Evolution" timeline is static and does not show actual FAQ versions.
- **Saved Knowledge Page**: Displays the first few FAQs from the API instead of user-bookmarked items.
- **Discussion Creation Flow**: Creating a discussion from a question does not carry over the question title or context, and does not link the discussion to the original question.
- **Discussion Thread Page**:
  - Only the first reply is displayed (static template text replacement).
  - Users cannot submit replies (the text input does not trigger any action).
  - Reply upvoting/downvoting is non-functional.
- **Notifications Page**: "Mark all as read" does not update the database status or the UI.

---

## 2. Proposed Changes & Implementation Strategy

### Component 1: `LandingPage.tsx`
- **Path**: [LandingPage.tsx](file:///c:/Users/siddh/Desktop/IIT_Ropar/CrowdMind/web/src/pages/user/LandingPage.tsx)
- **Modifications**:
  - Retrieve the first 3 FAQs from `faqsApi.list` and render them dynamically in the "Trending FAQs" section.
  - Retrieve the first 2 discussions from `discussionsApi.list` and render them dynamically in the "Active Peer Reviews" section.

### Component 2: `LibraryPage.tsx`
- **Path**: [LibraryPage.tsx](file:///c:/Users/siddh/Desktop/IIT_Ropar/CrowdMind/web/src/pages/user/LibraryPage.tsx)
- **Modifications**:
  - Implement dynamic local filtering and sorting.
  - Filter by category checkboxes (Internship, Team Formation, ViBe Protocol, Rosetta Engine) dynamically by mapping check states to API requests or client-side filtering.
  - Wire search input to filter items by keyword matching titles and content.
  - Sort the list client-side based on view count, confidence score, and updated timestamp.

### Component 3: `FaqDetailPage.tsx`
- **Path**: [FaqDetailPage.tsx](file:///c:/Users/siddh/Desktop/IIT_Ropar/CrowdMind/web/src/pages/user/FaqDetailPage.tsx)
- **Modifications**:
  - **Bookmarking**: Load bookmark state from `localStorage`. Wire the bookmark button to toggle saving the FAQ's ID to `localStorage['saved-faqs']` and update the icon dynamically.
  - **Helpful Feedback**: Wire the "Yes" and "No" buttons. Toggling them increments the client-side count, updates UI styling to active state, and updates `localStorage['faq-feedback']`.
  - **Evolution Timeline**: Fetch version history using `faqsApi.getVersions(id)` and dynamically insert timeline nodes.

### Component 4: `SavedKnowledgePage.tsx`
- **Path**: [SavedKnowledgePage.tsx](file:///c:/Users/siddh/Desktop/IIT_Ropar/CrowdMind/web/src/pages/user/SavedKnowledgePage.tsx)
- **Modifications**:
  - Retrieve bookmarked FAQ IDs from `localStorage`.
  - Fetch all corresponding FAQ objects from the database and populate the grid dynamically. Show an empty state if no bookmarks exist.

### Component 5: `AnalysisPage.tsx` & `CreateDiscussionPage.tsx`
- **Paths**: [AnalysisPage.tsx](file:///c:/Users/siddh/Desktop/IIT_Ropar/CrowdMind/web/src/pages/user/AnalysisPage.tsx), [CreateDiscussionPage.tsx](file:///c:/Users/siddh/Desktop/IIT_Ropar/CrowdMind/web/src/pages/user/CreateDiscussionPage.tsx)
- **Modifications**:
  - Wire "Create Discussion Thread" button to navigate to `/discussions/new?question_id=${id}`.
  - In `CreateDiscussionPage.tsx`, parse the `question_id` query parameter. If present, query the question details from the API to pre-fill the discussion Title and Context inputs and pass the `question_id` to `discussionsApi.create`.

### Component 6: `DiscussionThreadPage.tsx`
- **Path**: [DiscussionThreadPage.tsx](file:///c:/Users/siddh/Desktop/IIT_Ropar/CrowdMind/web/src/pages/user/DiscussionThreadPage.tsx)
- **Modifications**:
  - Fetch all replies via `repliesApi.listByDiscussion(id)`.
  - Populate the replies feed dynamically by cloning the reply card template, showing user names, initials, reply timestamps, and contents.
  - Wire up the comment textarea and the "Reply" button to invoke `repliesApi.create` and refresh the list in the UI immediately.
  - Wire up reply voting: clicking upvote/downvote executes `votesApi.createOrUpdate` and updates the counts.

### Component 7: `NotificationsPage.tsx`
- **Path**: [NotificationsPage.tsx](file:///c:/Users/siddh/Desktop/IIT_Ropar/CrowdMind/web/src/pages/user/NotificationsPage.tsx)
- **Modifications**:
  - Wire the "Mark all as read" button to invoke `notificationsApi.markAllRead` and refresh.
  - Add click listeners on each notification to call `notificationsApi.markRead(id)` and visually mark them as read.

---

## 3. Verification Plan

### Automated Verification
- Run frontend build to ensure type checking and asset packaging succeed:
  `npm run build`
- Run backend test suite to ensure API compliance:
  `backend\.venv\Scripts\python -m pytest`

### Manual Verification
1. Verify landing page loads real trending articles and discussions.
2. Verify searching and filtering on the Library Page dynamically adjusts the FAQ list.
3. Verify adding a bookmark on the FAQ Details page correctly updates the Saved Knowledge page.
4. Verify asking a question, viewing the analysis, escalating to a discussion, posting replies, and upvoting replies are fully functional and persist to the database.
