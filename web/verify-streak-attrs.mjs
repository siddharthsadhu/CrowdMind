// Verify the 4 streak attrs are correctly queryable (different selector syntax)
import fs from 'node:fs';
import pathModule from 'node:path';
import { chromium } from 'playwright';

const ROOT = 'C:\\Users\\siddh\\Desktop\\IIT_Ropar\\CrowdMind';
const profileTs = pathModule.join(ROOT, 'web', 'src', 'stitch-content', '10-profile.ts');
const tsContent = fs.readFileSync(profileTs, 'utf8');
const bodyHtml = tsContent.split('export const bodyHtml = `')[1].split('`;')[0];

const browser = await chromium.launch({ headless: true });
const page = await browser.newContext({ viewport: { width: 1440, height: 1800 } }).then(c => c.newPage());
await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="http://127.0.0.1:5173/src/stitch-pages.css"></head><body>${bodyHtml}</body></html>`, { waitUntil: 'networkidle' });

// Use the EXACT selector syntax from ProfilePage.tsx (line 904-907)
// The selectors are: '[data-cm-streak="current"]', '[data-cm-streak="longest"]', etc.
const streakResults = await page.evaluate(() => {
  const out = {};
  for (const v of ['current', 'longest', 'monthly', 'impact']) {
    const sel = `[data-cm-streak="${v}"]`;
    const el = document.querySelector(sel);
    out[v] = el ? { found: true, html: el.outerHTML.slice(0, 200), text: el.textContent } : { found: false };
  }
  return out;
});
console.log('[Streak attribute query results]');
for (const [v, r] of Object.entries(streakResults)) {
  console.log(`  data-cm-streak="${v}":`, r.found ? `✓ found → "${r.text}"` : '✗ NOT FOUND');
}
await page.screenshot({ path: pathModule.join(ROOT, 'verification-screenshots', 'phase-1', 'profile-template-streak-check.png'), fullPage: true });
await browser.close();
