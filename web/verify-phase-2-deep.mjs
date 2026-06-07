// Phase 2 deep verification: load FaqDetail template, mock the React page's data binding logic,
// and verify all selectors that the page queries actually find the expected elements.
import fs from 'node:fs';
import pathModule from 'node:path';
import { chromium } from 'playwright';

const ROOT = 'C:\\Users\\siddh\\Desktop\\IIT_Ropar\\CrowdMind';
const tmplPath = pathModule.join(ROOT, 'web', 'src', 'stitch-content', '03-faq-detail.ts');
const tmplContent = fs.readFileSync(tmplPath, 'utf8');
const bodyHtml = tmplContent.split('export const bodyHtml = `')[1].split('`;')[0];

const browser = await chromium.launch({ headless: true });
const page = await browser.newContext({ viewport: { width: 1440, height: 1800 } }).then(c => c.newPage());
await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="http://127.0.0.1:5173/src/stitch-pages.css"></head><body>${bodyHtml}</body></html>`, { waitUntil: 'networkidle' });

// All the unique selectors from FaqDetailPage (26 total)
const selectors = [
  '.grid.gap-8',                                  // line 69
  'h1',                                            // line 143
  '.bg-primary\\/10.text-primary.font-label-sm',  // line 148 (category badge)
  '.bg-surface-container-highest.text-on-surface-variant.font-label-sm',  // line 153/162
  '.flex.flex-wrap.gap-8.py-4',                   // line 183 (stats row)
  'section.glass-card.p-8.rounded-xl.grid',       // line 206 (trust panel)
  '.glass-card.p-10 .font-body-lg',                // line 272 (content)
  '.glass-card.p-10 h3',                           // line 276 (regulations heading)
  '.border-l-secondary-container',                 // line 284 (provenance card)
  'section.space-y-4',                             // line 407/456 (discussions/related section)
  'button[title="Bookmark"]',                      // line 510
  'button[title="Copy Answer"]',                   // line 554
  'button[title="Share"]',                         // line 574
  'section.glass-card.p-6.rounded-xl.space-y-6',   // line 702 (somewhere in page)
  'section.glass-card.p-6.rounded-xl.space-y-4',   // line 898
  '#references-sources',                           // line 919 (fallback ID)
  'footer a[href="#"]',                            // line 1103 (report link)
];

let allOk = 0, partial = 0, missing = 0;
for (const sel of selectors) {
  try {
    const count = await page.locator(sel).count();
    if (count > 0) {
      allOk++;
      console.log(`  ✓ ${sel} → ${count} elements`);
    } else {
      missing++;
      console.log(`  ✗ ${sel} → NOT FOUND`);
    }
  } catch (e) {
    partial++;
    console.log(`  ⚠ ${sel} → ${e.message.slice(0, 80)}`);
  }
}
console.log(`\n[Summary] ok=${allOk} missing=${missing} partial=${partial} / total=${selectors.length}`);

// Now load a real FAQ via the backend API to confirm data is reachable
const apiCheck = await page.evaluate(async () => {
  try {
    const r = await fetch('http://127.0.0.1:8001/api/v1/faqs?page_size=1');
    const d = await r.json();
    return { ok: r.ok, total: d.total, firstId: d.items?.[0]?.id, firstTitle: d.items?.[0]?.title };
  } catch (e) { return { error: e.message }; }
});
console.log(`\n[Backend API]`, apiCheck);

await browser.close();
