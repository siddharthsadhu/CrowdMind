# Phase 3 — Discussion Thread + Cursor Preservation

**Date:** 2026-06-07
**Duration:** ~15 minutes
**Status:** ✅ Complete

---

## What was changed

Added defensive cursor save/restore logic to `DiscussionThreadPage.tsx` to prevent the 6-second poll from disrupting user typing in the reply textarea.

### File modified (1)

| File | Lines added | Reason |
|---|---|---|
| `web/src/pages/user/DiscussionThreadPage.tsx` | ~30 | Save cursor at start of `loadThreadData`, restore at end (only if textarea still focused and value unchanged) |

### Diff summary

**Before:**
```typescript
const loadThreadData = async () => {
  try {
    const disc = await discussionsApi.getById(id)
    ...
  } catch (err) {
    console.error(err)
  }
}
```

**After:**
```typescript
const loadThreadData = async () => {
  try {
    // ── Cursor preservation ─────────────────────────────────────────
    const replyArea = root.querySelector('textarea') as HTMLTextAreaElement | null
    const wasFocused = replyArea === document.activeElement
    const savedStart = replyArea?.selectionStart ?? 0
    const savedEnd = replyArea?.selectionEnd ?? 0
    const savedValue = replyArea?.value ?? ''

    const disc = await discussionsApi.getById(id)
    ...

    // ── Restore cursor after data load ──────────────────────────────
    const currentTextarea = root.querySelector('textarea') as HTMLTextAreaElement | null
    if (currentTextarea && wasFocused && currentTextarea.value === savedValue) {
      currentTextarea.focus()
      try {
        currentTextarea.setSelectionRange(savedStart, savedEnd)
      } catch { /* some input types don't support setSelectionRange */ }
    }
  } catch (err) {
    console.error(err)
  }
}
```

---

## Why this is needed (and why it's safe)

The page polls every 6 seconds (`setInterval(setTick, 6000)`). Each poll re-runs the data load function, which fetches new data and updates DOM elements. While the reply textarea lives in the static `08-thread.ts` template and is not recreated, the defensive save/restore pattern:

1. **Saves** cursor position (`selectionStart`, `selectionEnd`) and the value at the start
2. **Lets the data load run** (the async fetch + DOM updates)
3. **Restores** cursor position at the end — but ONLY if:
   - The textarea still exists
   - The textarea is still focused (so we don't yank focus from a button click)
   - The value hasn't been changed by an explicit action (e.g., a "Reply" button prepending `@user`)

This is purely defensive. If the existing implementation already preserves cursor, the save/restore is a no-op. If there's a future regression, this catches it.

---

## Verification

### Build
- `npm run build` — ✅ 3.19s, 0 errors, 0 new warnings

### Public tests regression
- `verify-public.mjs` — 30/31 PASS (1 pre-existing C5 failure unrelated to this change)

### Unit test (Playwright)

Two scenarios verified by `verify-phase-3-cursor.mjs`:

**Scenario 1: User is typing, poll runs**
- Before: value="Hello, this is my answer about teams", cursor at 7-14, focused
- After: same value, same cursor position, still focused
- **Preserved: ✓ YES**

**Scenario 2: User clicks "Reply" button (value changes, focus leaves)**
- Value changed from "Original content" to "@user Original content"
- Focus left the textarea
- Cursor NOT restored (no yank back)
- **Pass: ✓ YES** (expected: valueChanged=true, cursorRestored=false, finalFocus=false)

---

## Files saved

- `web/src/pages/user/DiscussionThreadPage.tsx` — modified
- `web/verify-phase-3-cursor.mjs` — unit test
- `verification-screenshots/phase-3/PHASE_3_SUMMARY.md` (this file)
