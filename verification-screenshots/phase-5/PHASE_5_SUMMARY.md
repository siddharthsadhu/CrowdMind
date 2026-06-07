# Phase 5 — Library Page Pagination Fix

**Status:** ✅ Complete
**Build:** 3.71s (clean)
**Date:** 2026-06-07

---

## What was done

Added 3 missing `data-cm-*` attributes to the pagination block in BOTH the
template source and the extracted module:

| Attribute | Where queried | Purpose |
|-----------|---------------|---------|
| `data-cm-pagination` | `LibraryPage.tsx:328` | Container element for the pagination widget |
| `data-cm-page-prev`   | `LibraryPage.tsx:329` | Previous-page button |
| `data-cm-page-next`   | `LibraryPage.tsx:330` | Next-page button |

The dynamic `data-cm-page={n}` attribute is set at runtime in
`LibraryPage.tsx:129` (one per numeric page button), so no template change
was needed for that.

## Files changed

- `web/src/stitch-content/02-library.ts` — pagination block now carries 3 attrs
- `web/public/stitch-ref/02-library.html` — mirrored exactly to survive `stitch:extract`

## Verification

```
=== src/stitch-content/02-library.ts ===
  data-cm-pagination: 1
  data-cm-page-prev: 1
  data-cm-page-next: 1

=== public/stitch-ref/02-library.html ===
  data-cm-pagination: 1
  data-cm-page-prev: 1
  data-cm-page-next: 1
```

1:1 mirror confirmed. `npm run build` re-ran `stitch:extract` — the attrs were
not stripped. `vite build` succeeded in 3.71s.

## Other pages in scope of Phase 5

| Page | Status |
|------|--------|
| 02-library (pagination) | ✅ Fixed |
| 07-discussions (listing) | ✅ Already healthy (class-based selectors) |
| 08-thread (discussion thread) | ✅ Fixed in Phase 3 (cursor preservation) |
| 11-notifications | ✅ Already healthy (class-based selectors) |
| 12-saved | ✅ Already healthy (class-based selectors) |

## Impact

Before: `querySelector('[data-cm-pagination]')` returned `null`, so prev/next
click handlers were never wired. Library showed the first 12 FAQs and the
user could not navigate to subsequent pages.

After: prev/next click handlers are attached, page clicks fire
`renderCurrentPage()`, and the slice math in `renderCurrentPage` (line 50-54)
correctly maps `pageRef.current` to the `(page-1) * PAGE_SIZE .. page*PAGE_SIZE`
window.
