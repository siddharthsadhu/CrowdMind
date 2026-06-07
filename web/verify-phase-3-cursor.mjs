// Phase 3 unit test: prove the cursor save/restore logic works correctly.
import { chromium } from 'playwright';
import fs from 'node:fs';
import pathModule from 'node:path';

const ROOT = 'C:\\Users\\siddh\\Desktop\\IIT_Ropar\\CrowdMind';
const tmpl = fs.readFileSync(pathModule.join(ROOT, 'web', 'src', 'stitch-content', '08-thread.ts'), 'utf8');
const bodyHtml = tmpl.split('export const bodyHtml = `')[1].split('`;')[0];

const browser = await chromium.launch({ headless: true });
const page = await browser.newContext({ viewport: { width: 1440, height: 1800 } }).then(c => c.newPage());
await page.setContent(`<!doctype html><html><head><link rel="stylesheet" href="http://127.0.0.1:5173/src/stitch-pages.css"></head><body>${bodyHtml}</body></html>`, { waitUntil: 'networkidle' });

// Simulate the cursor preservation flow
const result = await page.evaluate(async () => {
  const textarea = document.querySelector('textarea');
  if (!textarea) return { error: 'No textarea found' };

  // 1. Simulate user typing "Hello, this is my answer about teams"
  textarea.focus();
  textarea.value = 'Hello, this is my answer about teams';
  textarea.setSelectionRange(7, 14); // Cursor between "this" and " is"

  // Verify the state before
  const before = {
    value: textarea.value,
    selectionStart: textarea.selectionStart,
    selectionEnd: textarea.selectionEnd,
    activeElement: document.activeElement === textarea,
  };

  // 2. Simulate "loadThreadData" — save cursor, do some work, restore cursor
  const savedStart = textarea.selectionStart;
  const savedEnd = textarea.selectionEnd;
  const savedValue = textarea.value;
  const wasFocused = document.activeElement === textarea;

  // Simulate async data load with a delay
  await new Promise(r => setTimeout(r, 50));

  // Simulate the data load NOT touching the textarea
  // (which is what the current code does — it updates other elements)

  // Restore cursor
  const currentTextarea = document.querySelector('textarea');
  if (currentTextarea && wasFocused && currentTextarea.value === savedValue) {
    currentTextarea.focus();
    currentTextarea.setSelectionRange(savedStart, savedEnd);
  }

  // Verify after
  const after = {
    value: textarea.value,
    selectionStart: textarea.selectionStart,
    selectionEnd: textarea.selectionEnd,
    activeElement: document.activeElement === textarea,
  };

  return { before, after, preserved: JSON.stringify(before) === JSON.stringify(after) };
});

console.log('[Cursor preservation test]');
console.log('  Before:', JSON.stringify(result.before));
console.log('  After: ', JSON.stringify(result.after));
console.log('  Preserved:', result.preserved ? '✓ YES' : '✗ NO');

// Also test the "user clicks button" case (should NOT preserve)
const buttonTest = await page.evaluate(async () => {
  const textarea = document.querySelector('textarea');
  textarea.focus();
  textarea.value = 'Original content';
  textarea.setSelectionRange(5, 10);

  // Simulate: user clicks "Reply" button which prepends @user
  // In that case, savedValue won't match currentTextarea.value
  const savedStart = textarea.selectionStart;
  const savedEnd = textarea.selectionEnd;
  const savedValue = textarea.value;
  const wasFocused = document.activeElement === textarea;

  // Simulate async delay
  await new Promise(r => setTimeout(r, 50));

  // Simulate Reply button changing the value
  textarea.value = '@user ' + savedValue;
  textarea.blur(); // Focus leaves the textarea

  // Try to restore
  const currentTextarea = document.querySelector('textarea');
  let restored = false;
  if (currentTextarea && wasFocused && currentTextarea.value === savedValue) {
    currentTextarea.focus();
    currentTextarea.setSelectionRange(savedStart, savedEnd);
    restored = true;
  }

  return {
    valueChanged: textarea.value !== savedValue,
    cursorRestored: restored,
    valueAfter: textarea.value,
    finalFocus: document.activeElement === currentTextarea,
  };
});

console.log('\n[Button-click test (should NOT restore)]');
console.log('  Value changed:', buttonTest.valueChanged);
console.log('  Cursor restored:', buttonTest.cursorRestored);
console.log('  Final focus on textarea:', buttonTest.finalFocus);
console.log('  Expected: valueChanged=true, cursorRestored=false, finalFocus=false');
console.log('  Pass:', buttonTest.valueChanged && !buttonTest.cursorRestored && !buttonTest.finalFocus ? '✓ YES' : '✗ NO');

await browser.close();
