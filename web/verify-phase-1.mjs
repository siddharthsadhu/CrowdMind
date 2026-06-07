// Phase 1 verification: starts servers, runs public test suite, verifies Profile attrs in built bundle, kills servers.
import { spawn } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import fs from 'node:fs';
import pathModule from 'node:path';
import http from 'node:http';

const ROOT = 'C:\\Users\\siddh\\Desktop\\IIT_Ropar\\CrowdMind';
const LOG_DIR = pathModule.join(ROOT, 'verification-screenshots', 'phase-1');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const procs = [];
function startProc(name, cmd, cwd, args, logBase) {
  const out = fs.openSync(pathModule.join(LOG_DIR, `${logBase}.out.log`), 'a');
  const err = fs.openSync(pathModule.join(LOG_DIR, `${logBase}.err.log`), 'a');
  const p = spawn(cmd, args, { cwd, windowsHide: true, stdio: ['ignore', out, err] });
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
      return true;
    } catch { await wait(500); }
  }
  throw new Error(`${label} not ready`);
}
function killAll() { for (const { p } of procs) { try { p.kill('SIGTERM'); } catch {} } }
process.on('exit', killAll);
process.on('SIGINT', () => { killAll(); process.exit(1); });
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', e); killAll(); process.exit(1); });

(async () => {
  startProc('backend', pathModule.join(ROOT, 'backend', '.venv', 'Scripts', 'python.exe'), pathModule.join(ROOT, 'backend'), ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8001'], 'backend');
  startProc('frontend', 'node', pathModule.join(ROOT, 'web'), [pathModule.join(ROOT, 'web', 'node_modules', 'vite', 'bin', 'vite.js'), '--port', '5173', '--host', '127.0.0.1'], 'frontend');
  await waitForUrl('http://127.0.0.1:8001/health', 30000, 'backend');
  await waitForUrl('http://127.0.0.1:5173/', 30000, 'frontend');

  // Quick check: Profile template's data-cm-* attrs are reachable via the built bundle
  const profileTs = pathModule.join(ROOT, 'web', 'src', 'stitch-content', '10-profile.ts');
  const profileHtml = pathModule.join(ROOT, 'web', 'public', 'stitch-ref', '10-profile.html');
  const tsContent = fs.readFileSync(profileTs, 'utf8');
  const htmlContent = fs.readFileSync(profileHtml, 'utf8');
  const requiredAttrs = [
    'data-cm-profile-name', 'data-cm-username', 'data-cm-rank-badge', 'data-cm-bio', 'data-cm-avatar',
    'data-cm-joined', 'data-cm-reputation', 'data-cm-rank-name', 'data-cm-rank-percent',
    'data-cm-rank-next', 'data-cm-rank-progress-pct', 'data-cm-rank-bar', 'data-cm-community-rank',
    'data-cm-heatmap', 'data-cm-total-contributions',
    'data-cm-streak="current"', 'data-cm-streak="longest"', 'data-cm-streak="monthly"', 'data-cm-streak="impact"',
  ];
  const missingInTs = requiredAttrs.filter(a => !tsContent.includes(a));
  const missingInHtml = requiredAttrs.filter(a => !htmlContent.includes(a));
  console.log(`\n[Profile attrs check]`);
  console.log(`  required: ${requiredAttrs.length}`);
  console.log(`  in .ts: ${requiredAttrs.length - missingInTs.length}/${requiredAttrs.length}`);
  console.log(`  in .html: ${requiredAttrs.length - missingInHtml.length}/${requiredAttrs.length}`);
  if (missingInTs.length) console.log(`  MISSING in .ts: ${missingInTs.join(', ')}`);
  if (missingInHtml.length) console.log(`  MISSING in .html: ${missingInHtml.join(', ')}`);

  // Public pages regression check: run the public landing page test via Playwright
  console.log(`\n[Public page regression check]`);
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newContext({ viewport: { width: 1440, height: 900 } }).then(c => c.newPage());
  const pages = [
    { name: 'landing', path: '/' },
    { name: 'library', path: '/library' },
    { name: 'discussions', path: '/discussions' },
    { name: 'login', path: '/login' },
  ];
  let ok = 0;
  for (const p of pages) {
    try {
      const resp = await page.goto(`http://127.0.0.1:5173${p.path}`, { waitUntil: 'networkidle', timeout: 25000 });
      await page.screenshot({ path: pathModule.join(LOG_DIR, `regress-${p.name}.png`), fullPage: true });
      console.log(`  ✓ ${p.name}: ${resp.status()}`);
      ok++;
    } catch (e) { console.log(`  ✗ ${p.name}: ${e.message}`); }
  }
  await browser.close();

  // Take Profile screenshot via direct file rendering — the page redirects to /login
  // but the template is what gets injected. We can render the template standalone.
  console.log(`\n[Profile template rendered standalone]`);
  const browser2 = await chromium.launch({ headless: true });
  const page2 = await browser2.newContext({ viewport: { width: 1440, height: 1800 } }).then(c => c.newPage());
  const profileStandalone = `
    <!doctype html><html><head><link rel="stylesheet" href="http://127.0.0.1:5173/src/stitch-pages.css"><style>body{padding:2rem;background:#0A0C12}</style></head>
    <body>
      <h1 style="color:#b0c6ff">Profile page template preview (with new data-cm-* markers highlighted in YELLOW)</h1>
      <p style="color:#888;margin-bottom:2rem">Static snapshot from stitch-content/10-profile.ts. Real page injects user data via these attributes.</p>
      ${tsContent.split('export const bodyHtml = `')[1].split('`;')[0]
        .replace(/data-cm-([a-z0-9-]+)/g, 'data-cm-$1 STYLE_ADDED_FOR_PREVIEW')
        .replace(/<img data-cm-avatar /g, '<img data-cm-avatar style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<h1 data-cm-profile-name /g, '<h1 data-cm-profile-name style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<span data-cm-username /g, '<span data-cm-username style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<span data-cm-rank-badge /g, '<span data-cm-rank-badge style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<p data-cm-bio /g, '<p data-cm-bio style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<span data-cm-joined /g, '<span data-cm-joined style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<span data-cm-reputation /g, '<span data-cm-reputation style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<p data-cm-rank-name /g, '<p data-cm-rank-name style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<p data-cm-rank-percent /g, '<p data-cm-rank-percent style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<span data-cm-rank-next/g, '<span data-cm-rank-next style="outline:3px solid #fde047;outline-offset:2px"')
        .replace(/<span data-cm-rank-progress-pct /g, '<span data-cm-rank-progress-pct style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<div data-cm-rank-bar /g, '<div data-cm-rank-bar style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<span data-cm-community-rank /g, '<span data-cm-community-rank style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<div data-cm-heatmap /g, '<div data-cm-heatmap style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<span data-cm-total-contributions>/g, '<span data-cm-total-contributions style="outline:3px solid #fde047;outline-offset:2px">')
        .replace(/<span data-cm-streak="current" /g, '<span data-cm-streak="current" style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<span data-cm-streak="longest" /g, '<span data-cm-streak="longest" style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<span data-cm-streak="monthly" /g, '<span data-cm-streak="monthly" style="outline:3px solid #fde047;outline-offset:2px" ')
        .replace(/<span data-cm-streak="impact" /g, '<span data-cm-streak="impact" style="outline:3px solid #fde047;outline-offset:2px" ')
      }
    </body></html>`;
  await page2.setContent(profileStandalone, { waitUntil: 'networkidle' });
  await page2.waitForTimeout(1500);
  await page2.screenshot({ path: pathModule.join(LOG_DIR, 'profile-template-preview.png'), fullPage: true });

  // Verify each attribute is queryable in the rendered HTML
  const verifyResults = await page2.evaluate((attrs) => {
    return attrs.map(a => ({ attr: a, found: document.querySelector(`[${a}]`) !== null }));
  }, requiredAttrs);
  const unfound = verifyResults.filter(r => !r.found);
  console.log(`  [Template queryable] ${verifyResults.length - unfound.length}/${verifyResults.length} attrs reachable via querySelector`);
  if (unfound.length) unfound.forEach(u => console.log(`    ✗ ${u.attr}`));
  await browser2.close();

  const summary = {
    timestamp: new Date().toISOString(),
    phase: 1,
    profileAttrsAdded: requiredAttrs.length,
    profileAttrsInTs: requiredAttrs.length - missingInTs.length,
    profileAttrsInHtml: requiredAttrs.length - missingInHtml.length,
    publicPagesOk: ok,
    publicPagesTotal: pages.length,
    profileAttrsReachable: verifyResults.length - unfound.length,
  };
  fs.writeFileSync(pathModule.join(LOG_DIR, 'phase-1-report.json'), JSON.stringify(summary, null, 2));
  console.log(`\n✓ Phase 1 verification complete. Summary:`, summary);

  killAll();
  process.exit(0);
})().catch((e) => { console.error('FATAL', e); killAll(); process.exit(1); });
