# CrowdMind Web (20 screens)

```bash
npm install
npm run dev
```

Open http://localhost:5173 — use **Screens** (bottom-right) to jump between all 20 routes.

## Stitch implementation

- **Not iframes** — each page imports verbatim Stitch body HTML into React via `StitchPage`
- Regenerate content from Stitch exports: `npm run stitch:extract` (also strips removed Stitch placeholders such as the landing left-panel background image).
- Reference HTML: `public/stitch-ref/*.html`
- Lumina theme: `public/stitch-tailwind.js` + Tailwind CDN in `index.html`

## Demo auth

| Email | Role |
|-------|------|
| `user@crowdmind.ai` | User → `/home` |
| `admin@crowdmind.ai` | Admin → `/admin` |

Search: `/library?q=consensus` (same screen, no separate search page).

See [`docs/SCREEN_MAP.md`](../docs/SCREEN_MAP.md) for route ↔ Stitch ID mapping.
