// One-shot audit script: starts both servers, runs checks, kills servers, writes report.
// Avoids the opencode bash "kill children on return" problem by managing lifecycle in-process.

import { spawn, execSync } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import fs from 'node:fs';
import pathModule from 'node:path';
import http from 'node:http';

const ROOT = 'C:\\Users\\siddh\\Desktop\\IIT_Ropar\\CrowdMind';
const LOG_DIR = pathModule.join(ROOT, 'verification-screenshots', 'phase-0');
const FRONTEND = 'http://localhost:5173';
const BACKEND = 'http://localhost:8001';

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const procs = [];
function startProc(name, cmd, cwd, args, logBase) {
  const out = fs.openSync(pathModule.join(LOG_DIR, `${logBase}.out.log`), 'a');
  const err = fs.openSync(pathModule.join(LOG_DIR, `${logBase}.err.log`), 'a');
  const p = spawn(cmd, args, { cwd, windowsHide: true, stdio: ['ignore', out, err], detached: false });
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
      return true;
    } catch {
      await wait(500);
    }
  }
  throw new Error(`${label} not ready after ${timeoutMs}ms`);
}

function killAll() {
  for (const { name, p } of procs) {
    try { p.kill('SIGTERM'); } catch {}
    console.log(`  [${name}] SIGTERM sent`);
  }
}

process.on('exit', killAll);
process.on('SIGINT', () => { killAll(); process.exit(1); });
process.on('uncaughtException', (e) => { console.error('UNCAUGHT', e); killAll(); process.exit(1); });

(async () => {
  console.log('▶ Starting backend (uvicorn)...');
  startProc(
    'backend',
    pathModule.join(ROOT, 'backend', '.venv', 'Scripts', 'python.exe'),
    pathModule.join(ROOT, 'backend'),
    ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8001'],
    'backend-server'
  );

  console.log('▶ Starting frontend (vite)...');
  startProc(
    'frontend',
    'node',
    pathModule.join(ROOT, 'web'),
    [pathModule.join(ROOT, 'web', 'node_modules', 'vite', 'bin', 'vite.js'), '--port', '5173', '--host', '127.0.0.1'],
    'frontend-server'
  );

  await waitForUrl(`${BACKEND}/health`, 30000, 'backend');
  await waitForUrl(`${FRONTEND}/`, 30000, 'frontend');

  console.log('▶ Both servers ready. Running Playwright audit...');
  const { chromium } = await import('playwright');

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('console', m => { if (m.type() === 'error' && !m.text().includes('Clerk')) consoleErrors.push(m.text().slice(0, 200)); });

  const findings = [];
  async function checkPage(name, urlPath, opts = {}) {
    const url = `${FRONTEND}${urlPath}`;
    const shotPath = pathModule.join(LOG_DIR, `${name}.png`);
    try {
      const resp = await page.goto(url, { waitUntil: 'networkidle', timeout: 25000 });
      await page.waitForTimeout(2500);
      await page.screenshot({ path: shotPath, fullPage: true });
      const status = resp?.status() ?? 0;
      const finalUrl = page.url();
      const title = await page.title();
      const bodyText = (await page.locator('body').innerText().catch(() => '')).slice(0, 400);
      const hardcodedMarkers = (bodyText.match(/\b(John Doe|Jane Doe|Lorem ipsum|TODO|FIXME|Sample User|test@test|placeholder)\b/gi) || []);
      const finding = { page: name, url: urlPath, status, finalUrl, title, hardcoded: hardcodedMarkers.length, bodyTextSnippet: bodyText };
      if (opts.querySelector) finding.queriedExists = await page.locator(opts.querySelector).count();
      if (opts.expectSelector) finding.expectedExists = await page.locator(opts.expectSelector).count();
      findings.push(finding);
      console.log(`  ✓ ${name}: status=${status} hardcoded=${hardcodedMarkers.length} shot=${pathModule.basename(shotPath)}`);
    } catch (e) {
      findings.push({ page: name, url: urlPath, error: e.message });
      console.log(`  ✗ ${name}: ${e.message}`);
    }
  }

  // Public pages
  await checkPage('A1_landing', '/', { querySelector: '[data-cm-], [id]' });
  await checkPage('A2_library', '/library', { querySelector: '[data-cm-pagination]' });
  await checkPage('A3_discussions', '/discussions');
  await checkPage('A4_login', '/login');
  // Auth-gated pages — will redirect to /login since we're not authed
  for (const [name, p] of [
    ['01_home', '/home'],
    ['02_ask', '/ask'],
    ['03_analysis', '/analysis/test-id'],
    ['04_evolution', '/evolution'],
    ['05_notifications', '/notifications'],
    ['06_saved', '/saved'],
    ['07_profile', '/profile'],
    ['08_contributions', '/contributions'],
    ['09_mission', '/mission-control'],
    ['10_analytics', '/admin/analytics'],
    ['11_faq_mgmt', '/admin/faq-management'],
    ['12_moderation', '/admin/moderation'],
    ['13_settings', '/admin/settings'],
    ['14_settings_user', '/settings'],
    ['15_methodology', '/methodology'],
    ['16_candidate_review', '/admin/faq-candidates'],
    ['17_report_investigation', '/admin/reports/test-id'],
    ['18_discussion_thread', '/discussions/test-id'],
    ['19_create_discussion', '/discussions/new'],
    ['20_faq_detail', '/faq/test-id'],
  ]) {
    await checkPage(name, p);
  }

  await browser.close();

  const report = {
    timestamp: new Date().toISOString(),
    pagesChecked: findings.length,
    consoleErrors,
    pageErrors,
    findings,
  };
  fs.writeFileSync(pathModule.join(LOG_DIR, 'audit-report.json'), JSON.stringify(report, null, 2));
  console.log(`\n✓ Audit complete. ${findings.length} pages checked. ${consoleErrors.length} console errors. ${pageErrors.length} page errors.`);
  console.log(`Report: ${pathModule.join(LOG_DIR, 'audit-report.json')}`);

  killAll();
  process.exit(0);
})().catch((e) => { console.error('FATAL', e); killAll(); process.exit(1); });
