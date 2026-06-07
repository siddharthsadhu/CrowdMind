// One-shot final verify: starts both servers, runs verify-public.mjs and
// verify-ask-flow.mjs, kills servers, writes report.

import { spawn, execSync } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import fs from 'node:fs';
import pathModule from 'node:path';
import http from 'node:http';

const ROOT = 'C:\\Users\\siddh\\Desktop\\IIT_Ropar\\CrowdMind';
const LOG_DIR = pathModule.join(ROOT, 'verification-screenshots', 'final');
const FRONTEND = 'http://localhost:5173';
const BACKEND = 'http://localhost:8001';

if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

const procs = [];
function startProc(name, cmd, cwd, args, logBase) {
  const out = fs.openSync(pathModule.join(LOG_DIR, `${logBase}.out.log`), 'a');
  const err = fs.openSync(pathModule.join(LOG_DIR, `${logBase}.err.log`), 'a');
  const p = spawn(cmd, args, { cwd, cwd, windowsHide: true, stdio: ['ignore', out, err], detached: false });
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
  throw new Error(`Timed out waiting for ${url}`);
}

async function killAll() {
  for (const { name, p } of procs) {
    try {
      p.kill('SIGTERM');
      console.log(`  [${name}] killed`);
    } catch {}
  }
  await wait(500);
  for (const { name, p } of procs) {
    try { p.kill('SIGKILL'); } catch {}
  }
}

process.on('uncaughtException', async (err) => {
  console.error('  [main] uncaught:', err);
  await killAll();
  process.exit(1);
});

async function main() {
  console.log('[final-verify] starting servers…');
  startProc('backend', 'C:\\Users\\siddh\\Desktop\\IIT_Ropar\\CrowdMind\\backend\\.venv\\Scripts\\python.exe', pathModule.join(ROOT, 'backend'), ['-m', 'uvicorn', 'app.main:app', '--host', '0.0.0.0', '--port', '8001', '--log-level', 'warning'], 'backend');
  startProc('frontend', 'C:\\Program Files\\nodejs\\node.exe', pathModule.join(ROOT, 'web'), ['./node_modules/vite/bin/vite.js', '--host', '0.0.0.0', '--port', '5173'], 'frontend');

  try {
    await waitForUrl(BACKEND + '/health', 30000, 'backend');
    await waitForUrl(FRONTEND, 30000, 'frontend');
  } catch (err) {
    console.error('  [main] server startup failed:', err.message);
    await killAll();
    process.exit(2);
  }

  await wait(2000);

  console.log('[final-verify] running verify-public.mjs…');
  let pubOut = '';
  try {
    pubOut = execSync('node verify-public.mjs 2>&1', {
      cwd: pathModule.join(ROOT, 'web'),
      stdio: 'pipe',
      encoding: 'utf-8',
      timeout: 120000,
    });
  } catch (err) {
    pubOut = (err.stdout || '') + '\n' + (err.stderr || '');
  }
  console.log(pubOut.split('\n').filter(l => l.includes('PASS') || l.includes('FAIL') || l.includes('Total') || l.includes('Issue')).join('\n'));

  console.log('[final-verify] running verify-ask-flow.mjs…');
  let askOut = '';
  try {
    askOut = execSync('node verify-ask-flow.mjs 2>&1', {
      cwd: pathModule.join(ROOT, 'web'),
      stdio: 'pipe',
      encoding: 'utf-8',
      timeout: 120000,
    });
  } catch (err) {
    askOut = (err.stdout || '') + '\n' + (err.stderr || '');
  }
  console.log(askOut.split('\n').filter(l => l.trim()).slice(0, 40).join('\n'));

  const report = {
    timestamp: new Date().toISOString(),
    public_section: pubOut.split('\n').filter(l => l.match(/Total|PASS|FAIL|✓|✗/)).join('\n'),
    ask_section: askOut.split('\n').filter(l => l.match(/Total|PASS|FAIL|✓|✗/)).join('\n'),
  };
  fs.writeFileSync(pathModule.join(LOG_DIR, 'final-report.json'), JSON.stringify(report, null, 2));
  console.log('[final-verify] report written to', pathModule.join(LOG_DIR, 'final-report.json'));

  await killAll();
  process.exit(0);
}

main();
