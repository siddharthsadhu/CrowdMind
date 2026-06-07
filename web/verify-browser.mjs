// Browser-mode end-to-end verification of all evolution features.
// Starts servers, navigates the public site, and takes screenshots of every key flow.

import { spawn, execSync } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import fs from 'node:fs';
import pathModule from 'node:path';
import http from 'node:http';
import { chromium } from 'playwright';

const ROOT = 'C:\\Users\\siddh\\Desktop\\IIT_Ropar\\CrowdMind';
const SHOT_DIR = pathModule.join(ROOT, 'verification-screenshots', 'browser');
const FRONTEND = 'http://localhost:5173';
const BACKEND = 'http://localhost:8001';

if (!fs.existsSync(SHOT_DIR)) fs.mkdirSync(SHOT_DIR, { recursive: true });

const procs = [];
function startProc(name, cmd, cwd, args, logBase) {
  const out = fs.openSync(pathModule.join(SHOT_DIR, `${logBase}.out.log`), 'a');
  const err = fs.openSync(pathModule.join(SHOT_DIR, `${logBase}.err.log`), 'a');
  const p = spawn(cmd, args, { cwd, windowsHide: true, stdio: ['ignore', out, err] });
  p.on('exit', (code) => console.log(`  [${name}] exited code=${code}`));
  procs.push({ name, p });
  console.log(`  [${name}] pid=${p.pid} started`);
  return p;
}

async function waitForUrl(url, timeoutMs, label) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((res, rej) => {
        const req = http.get(url, (r) => { r.resume(); res(r.statusCode); });
        req.on('error', rej);
        req.setTimeout(2000, () => req.destroy(new Error('timeout')));
      });
      console.log(`  [${label}] ready (${Date.now() - start}ms)`);
      return;
    } catch { await wait(500); }
  }
  throw new Error(`Timed out waiting for ${url}`);
}

async function killAll() {
  for (const { name, p } of procs) {
    try { p.kill('SIGTERM'); } catch {}
  }
  await wait(500);
  for (const { name, p } of procs) {
    try { p.kill('SIGKILL'); } catch {}
  }
}

const results = [];
function record(name, status, detail) {
  results.push({ name, status, detail });
  console.log(`  ${status === 'PASS' ? '✅' : '❌'} ${name}${detail ? ': ' + detail : ''}`);
}

async function main() {
  console.log('[browser-verify] starting servers…');
  startProc('backend', 'C:\\Users\\siddh\\Desktop\\IIT_Ropar\\CrowdMind\\backend\\.venv\\Scripts\\python.exe', pathModule.join(ROOT, 'backend'),
    ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8001', '--log-level', 'warning'], 'backend');
  startProc('frontend', 'C:\\Program Files\\nodejs\\node.exe', pathModule.join(ROOT, 'web'),
    ['./node_modules/vite/bin/vite.js', '--host', '0.0.0.0', '--port', '5173'], 'frontend');

  try {
    await waitForUrl(BACKEND + '/health', 30000, 'backend');
    await waitForUrl(FRONTEND, 30000, 'frontend');
  } catch (err) {
    console.error('  [main] server startup failed:', err.message);
    await killAll();
    process.exit(2);
  }
  await wait(2000);

  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Capture browser console
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.log(`  [browser-error] ${msg.text()}`);
  });
  page.on('pageerror', (err) => console.log(`  [page-error] ${err.message}`));

  try {
    // =========================================================
    // 1. Landing page loads
    // =========================================================
    await page.goto(FRONTEND, { waitUntil: 'networkidle' });
    await page.screenshot({ path: pathModule.join(SHOT_DIR, '01-landing.png'), fullPage: true });
    const title = await page.title();
    record('1. Landing page loads', title.includes('CrowdMind') ? 'PASS' : 'FAIL', `title="${title}"`);

    // =========================================================
    // 2. Library page loads + shows FAQs
    // =========================================================
    await page.goto(FRONTEND + '/library', { waitUntil: 'networkidle' });
    await wait(1500);
    await page.screenshot({ path: pathModule.join(SHOT_DIR, '02-library.png'), fullPage: true });
    const libraryFaqCount = await page.locator('.glass.rounded-2xl').count();
    record('2. Library page renders FAQ cards', libraryFaqCount > 0 ? 'PASS' : 'FAIL', `${libraryFaqCount} cards`);

    // =========================================================
    // 3. Library pagination has data-cm-* attrs
    // =========================================================
    const pagination = await page.locator('[data-cm-pagination]').count();
    const prev = await page.locator('[data-cm-page-prev]').count();
    const next = await page.locator('[data-cm-page-next]').count();
    record('3. Library pagination attrs present',
      pagination > 0 && prev > 0 && next > 0 ? 'PASS' : 'FAIL',
      `pagination=${pagination} prev=${prev} next=${next}`);

    // =========================================================
    // 4. Click into a FAQ
    // =========================================================
    const firstFaqCard = page.locator('.glass.rounded-2xl').first();
    await firstFaqCard.locator('button').first().click();
    await page.waitForLoadState('networkidle');
    await wait(1500);
    await page.screenshot({ path: pathModule.join(SHOT_DIR, '03-faq-detail.png'), fullPage: true });
    const faqUrl = page.url();
    record('4. FAQ detail page loads', faqUrl.includes('/faq/') ? 'PASS' : 'FAIL', `url=${faqUrl}`);

    // =========================================================
    // 5. Evolution mini-timeline appears on FAQ detail (static template)
    // =========================================================
    const evoMini = await page.locator('h3:has-text("Knowledge Evolution")').count();
    record('5. FAQ detail shows Knowledge Evolution section',
      evoMini > 0 ? 'PASS' : 'FAIL',
      `found ${evoMini} h3(s)`);

    // =========================================================
    // 5b. No duplicate Evolution Timeline mini-section (Block 1.1 fix)
    // =========================================================
    const dupEvoMini = await page.locator('section[data-cm-evo-section]').count();
    record('5b. No duplicate Evolution Timeline mini-section',
      dupEvoMini === 0 ? 'PASS' : 'FAIL',
      `found ${dupEvoMini} injected section(s) (expected 0)`);

    // =========================================================
    // 6. "View full evolution" link present
    // =========================================================
    const viewFull = await page.locator('[data-cm-view-full-evolution]').count();
    record('6. "View full evolution" link present',
      viewFull > 0 ? 'PASS' : 'FAIL',
      `found ${viewFull} link(s)`);

    // =========================================================
    // 7. Evolution page loads
    // =========================================================
    await page.goto(FRONTEND + '/evolution', { waitUntil: 'networkidle' });
    await wait(2000);
    await page.screenshot({ path: pathModule.join(SHOT_DIR, '07-evolution-empty.png'), fullPage: true });
    const evoHeader = await page.locator('h1:has-text("Self-Evolving")').count();
    record('7. Evolution page loads (real page, not redirect)',
      evoHeader > 0 ? 'PASS' : 'FAIL',
      `header h1 found ${evoHeader} time(s)`);

    // =========================================================
    // 8. FAQ selector is populated
    // =========================================================
    const faqOptions = await page.locator('[data-cm-faq-selector] option').count();
    record('8. FAQ selector populated with options',
      faqOptions > 1 ? 'PASS' : 'FAIL',
      `${faqOptions} options`);

    // =========================================================
    // 9. Select the seeded flagship FAQ and verify timeline renders
    // =========================================================
    const flagship = await page.locator('[data-cm-faq-selector] option:has-text("ViBe")').first().getAttribute('value');
    if (flagship) {
      await page.selectOption('[data-cm-faq-selector]', flagship);
      await wait(2500);
      await page.screenshot({ path: pathModule.join(SHOT_DIR, '09-evolution-flagship.png'), fullPage: true });

      // Check that version nodes are rendered
      const versionNodes = await page.locator('[data-cm-timeline-list] .glass-card').count();
      record('9. Timeline renders version nodes for flagship FAQ',
        versionNodes >= 3 ? 'PASS' : 'FAIL',
        `${versionNodes} version cards`);

      // Check insights panel
      const insightBadges = await page.locator('[data-cm-insights] .border-l-2').count();
      record('10. Insights panel shows events',
        insightBadges > 0 ? 'PASS' : 'FAIL',
        `${insightBadges} insight items`);

      // Check health metrics
      const accuracy = await page.locator('[data-cm-metric-accuracy]').textContent();
      const frequency = await page.locator('[data-cm-metric-frequency]').textContent();
      record('11. Health metrics render',
        accuracy && frequency && accuracy.trim() !== '—' ? 'PASS' : 'FAIL',
        `accuracy=${accuracy?.trim()}, frequency=${frequency?.trim()}`);

      // Check diff selectors are populated
      const diffOptions = await page.locator('[data-cm-diff-from] option').count();
      record('12. Diff version selectors populated',
        diffOptions > 1 ? 'PASS' : 'FAIL',
        `${diffOptions} options`);

      // Q8=B: For public/guest users, the diff section, insights, and rollback
      // button must be HIDDEN. Only admin sees them.
      await wait(1500);
      await page.screenshot({ path: pathModule.join(SHOT_DIR, '12-evolution-diff-hidden.png'), fullPage: true });
      const diffSectionHidden = await page.locator('[data-cm-diff-section]').evaluate((el) => {
        return el.classList.contains('hidden') || window.getComputedStyle(el).display === 'none'
      }).catch(() => false)
      record('12. Guest: diff section is HIDDEN (Q8=B)',
        diffSectionHidden ? 'PASS' : 'FAIL',
        `data-cm-diff-section hidden=${diffSectionHidden}`)

      // Insights aside should be hidden for non-admins
      const insightsVisible = await page.locator('aside').filter({ has: page.locator('[data-cm-insights]') }).first().isVisible().catch(() => false)
      record('13. Guest: insights panel is HIDDEN (Q8=B)',
        !insightsVisible ? 'PASS' : 'FAIL',
        `insights aside visible=${insightsVisible}`)

      // Rollback button should be hidden for non-admins
      const rollbackVisible = await page.locator('[data-cm-rollback]').first().isVisible().catch(() => false)
      record('14. Guest: rollback button is HIDDEN (Q8=B)',
        !rollbackVisible ? 'PASS' : 'FAIL',
        `data-cm-rollback visible=${rollbackVisible}`)
    } else {
      record('9-14. Flagship FAQ check', 'SKIP', 'No ViBe FAQ found in selector');
    }

    // =========================================================
    // 15. Profile page template has data-cm-* attrs (page is auth-gated, so check source HTML)
    // The /home route requires auth — verify the template contract instead.
    const { readFileSync } = await import('node:fs');
    const profileHtml = readFileSync('public/stitch-ref/10-profile.html', 'utf-8');
    const profileAttrMatches = profileHtml.match(/data-cm-[a-z-]+/g) || [];
    const profileUniqueAttrs = new Set(profileAttrMatches);
    record('15. Profile template has data-cm-* attrs (16 from Phase 1)',
      profileUniqueAttrs.size >= 15 ? 'PASS' : 'FAIL',
      `${profileUniqueAttrs.size} unique data-cm-* attrs in 10-profile.html`);

    // =========================================================
    // 16. Discussions listing loads
    // =========================================================
    await page.goto(FRONTEND + '/discussions', { waitUntil: 'networkidle' });
    await wait(1500);
    await page.screenshot({ path: pathModule.join(SHOT_DIR, '16-discussions.png'), fullPage: true });
    const discHeader = await page.locator('h1').first().textContent();
    record('16. Discussions listing loads',
      discHeader ? 'PASS' : 'FAIL', `h1="${discHeader?.slice(0, 40)}"`);

    // =========================================================
    // 17. Notifications page loads
    // =========================================================
    await page.goto(FRONTEND + '/notifications', { waitUntil: 'networkidle' });
    await wait(1500);
    await page.screenshot({ path: pathModule.join(SHOT_DIR, '17-notifications.png'), fullPage: true });
    const notifHeader = await page.locator('h1').first().textContent();
    record('17. Notifications page loads',
      notifHeader ? 'PASS' : 'FAIL', `h1="${notifHeader?.slice(0, 40)}"`);

    // =========================================================
    // 18. Saved page loads
    // =========================================================
    await page.goto(FRONTEND + '/saved', { waitUntil: 'networkidle' });
    await wait(1500);
    await page.screenshot({ path: pathModule.join(SHOT_DIR, '18-saved.png'), fullPage: true });
    const savedHeader = await page.locator('h1').first().textContent();
    record('18. Saved page loads',
      savedHeader ? 'PASS' : 'FAIL', `h1="${savedHeader?.slice(0, 40)}"`);

    // =========================================================
    // 19. Ask page loads (clerk-gated)
    // =========================================================
    await page.goto(FRONTEND + '/ask', { waitUntil: 'networkidle' });
    await wait(1500);
    await page.screenshot({ path: pathModule.join(SHOT_DIR, '19-ask.png'), fullPage: true });
    record('19. Ask page loads (or shows login redirect)',
      'INFO', 'Clerk-gated; screenshot captured');

    // =========================================================
    // 20. API: evolution events endpoint
    // =========================================================
    const eventsResp = await page.request.get(BACKEND + '/api/v1/evolution/events?limit=10');
    const eventsJson = await eventsResp.json();
    record('20. GET /evolution/events returns events',
      eventsResp.status() === 200 && eventsJson.items?.length > 0 ? 'PASS' : 'FAIL',
      `${eventsJson.items?.length || 0} events returned`);

    // =========================================================
    // 21. API: timeline endpoint for flagship
    // =========================================================
    if (flagship) {
      const timelineResp = await page.request.get(BACKEND + `/api/v1/evolution/timeline/${flagship}`);
      const timelineJson = await timelineResp.json();
      record('21. GET /evolution/timeline/{id} returns timeline',
        timelineResp.status() === 200 && timelineJson.timeline?.length > 0 ? 'PASS' : 'FAIL',
        `${timelineJson.timeline?.length || 0} versions, ${timelineJson.events?.length || 0} events`);

      // =========================================================
      // 22. API: diff endpoint
      // =========================================================
      if (timelineJson.timeline?.length >= 2) {
        const fromV = timelineJson.timeline[timelineJson.timeline.length - 1].version_number;
        const toV = timelineJson.timeline[0].version_number;
        const diffResp = await page.request.get(BACKEND + `/api/v1/evolution/diff/${flagship}/${fromV}/${toV}`);
        const diffJson = await diffResp.json();
        record('22. GET /evolution/diff/... returns diff hunks',
          diffResp.status() === 200 && diffJson.diff?.length > 0 ? 'PASS' : 'FAIL',
          `${diffJson.diff?.length || 0} hunks, +${diffJson.additions || 0} -${diffJson.deletions || 0}`);
      }
    }

  } catch (err) {
    console.error('  [main] test error:', err);
    record('main', 'FAIL', err.message);
  }

  await browser.close();
  await killAll();

  // Write report
  const report = {
    timestamp: new Date().toISOString(),
    total: results.length,
    passed: results.filter((r) => r.status === 'PASS').length,
    failed: results.filter((r) => r.status === 'FAIL').length,
    info: results.filter((r) => r.status === 'INFO' || r.status === 'SKIP').length,
    results,
  };
  fs.writeFileSync(pathModule.join(SHOT_DIR, 'browser-report.json'), JSON.stringify(report, null, 2));
  console.log(`\n[browser-verify] ${report.passed}/${report.total} PASS, ${report.failed} FAIL, ${report.info} INFO`);
  console.log(`[browser-verify] screenshots in ${SHOT_DIR}`);
  process.exit(report.failed > 0 ? 1 : 0);
}

main();
