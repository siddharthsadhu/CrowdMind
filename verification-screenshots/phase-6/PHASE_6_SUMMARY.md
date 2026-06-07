# Phase 6 — Admin Pages Audit

**Status:** ✅ Complete — no template changes needed
**Build:** 3.71s (unchanged from Phase 5)
**Date:** 2026-06-07

---

## Audit method

For each of the 7 admin pages, I cross-referenced:

1. Every `querySelector` / `getElementById` call in the `.tsx` file
2. The corresponding template `web/public/stitch-ref/*.html`
3. Class-based vs ID-based selectors
4. Existence of the queried classes/IDs in the template

## Findings per page

| Page | `.tsx` file | Selectors used | Template health |
|------|-------------|----------------|-----------------|
| 15 Mission Control | `MissionControlPage.tsx` | `.funnel-step`, `.funnel`, `.glass-card`, `.text-headline-md` | ✅ 23 funnel-step/glass-card matches |
| 16 FAQ Mgmt | `FaqManagementPage.tsx` | `.glass-card`, `.text-headline-md`, `table tbody`, `td:nth-child(N)` | ✅ 16 glass-card matches |
| 17 Moderation | `ModerationPage.tsx` | `.border-l-primary\/40 .text-headline-md`, `table tbody`, `td:nth-child(N)` | ✅ template has classes |
| 18 Analytics | `AnalyticsPage.tsx` | `.glass-card`, `.chart-fill-primary`, `.flex.bg-surface-container`, etc. | ✅ already fixed in Phase 4 |
| 19 Report Investigation | `ReportInvestigationPage.tsx` | `#finalize-btn`, `#resolution-textarea` | ✅ both IDs exist in `19-report.html` |
| 20 Settings | `SettingsPage.tsx` | `#settings-tabs`, `#save-btn`, `#unsaved-toast`, `#success-toast`, `#ai-range`, `#ai-label`, tab content IDs | ✅ all 7 IDs exist in `20-settings.html` |
| 21 FAQ Candidate Review | `FaqCandidateReviewPage.tsx` | `.glass-card`, `table tbody`, `td:nth-child(N)` | ✅ 13 glass-card matches |

## Conclusion

**No template modifications needed for any admin page.** All 7 admin pages
either:
- Use class-based selectors that the templates already have, OR
- Use ID selectors that exist verbatim in the templates

The audit confirms that the admin console is in good shape structurally. The
functional gaps (no real data flowing, no evolution/synthesis engine, etc.) are
in the backend and will be addressed in Phases 6.5–6.7.
