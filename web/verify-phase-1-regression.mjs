// One-shot: starts servers, runs verify-public.mjs, kills servers.
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
  console.log(`  [${name}] pid=${p.pid}`);
  return p;
}
async function waitForUrl(url, timeoutMs, label) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      await new Promise((res, rej) => { const req = http.get(url, (r) => { r.resume(); res(r.statusCode); }); req.on('error', rej); req.setTimeout(2000, () => req.destroy(new Error('timeout'))); });
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

  // Save existing report for comparison
  const existingReport = pathModule.join(ROOT, 'verification-screenshots', 'report.json');
  const existingFull = pathModule.join(ROOT, 'verification-screenshots', 'full-report.json');
  let beforeReport = null;
  if (fs.existsSync(existingFull)) {
    beforeReport = JSON.parse(fs.readFileSync(existingFull, 'utf8'));
  }

  console.log('\n▶ Running verify-public.mjs (31 checks)...');
  const verify = spawn('node', ['verify-public.mjs'], { cwd: pathModule.join(ROOT, 'web'), stdio: 'inherit', windowsHide: true });
  await new Promise((res) => verify.on('exit', res));

  // Compare
  const afterReport = fs.existsSync(existingFull) ? JSON.parse(fs.readFileSync(existingFull, 'utf8')) : null;
  if (beforeReport && afterReport) {
    console.log('\n[Comparison]');
    console.log(`  Before: ${beforeReport.summary.passed}/${beforeReport.summary.total} passed, ${beforeReport.summary.issueCount} issues`);
    console.log(`  After:  ${afterReport.summary.passed}/${afterReport.summary.total} passed, ${afterReport.summary.issueCount} issues`);
    if (beforeReport.summary.passed === afterReport.summary.passed && afterReport.summary.issueCount === 0) {
      console.log('  ✓ No regression');
    } else {
      console.log('  ✗ REGRESSION detected!');
    }
  } else if (afterReport) {
    console.log(`\n[Result] ${afterReport.summary.passed}/${afterReport.summary.total} passed, ${afterReport.summary.issueCount} issues`);
  }

  // Copy report to phase-1 folder
  if (fs.existsSync(existingFull)) {
    fs.copyFileSync(existingFull, pathModule.join(LOG_DIR, 'full-report.json'));
  }

  killAll();
  process.exit(0);
})().catch((e) => { console.error('FATAL', e); killAll(); process.exit(1); });
