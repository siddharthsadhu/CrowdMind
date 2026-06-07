// Phase 2 verification: check that FaqDetailPage's class selectors all exist in the template
import fs from 'node:fs';
import pathModule from 'node:path';

const ROOT = 'C:\\Users\\siddh\\Desktop\\IIT_Ropar\\CrowdMind';
const pagePath = pathModule.join(ROOT, 'web', 'src', 'pages', 'user', 'FaqDetailPage.tsx');
const tmplPath = pathModule.join(ROOT, 'web', 'src', 'stitch-content', '03-faq-detail.ts');

const pageContent = fs.readFileSync(pagePath, 'utf8');
const tmplContent = fs.readFileSync(tmplPath, 'utf8');

// Extract all class-based selectors (those starting with .)
const classSelectors = new Set();
const re = /root\.querySelector(?:All)?\(\s*['"]([^'"]+)['"]/g;
let m;
while ((m = re.exec(pageContent))) {
  const sel = m[1];
  // Extract class-based selectors (start with .)
  if (sel.startsWith('.')) classSelectors.add(sel);
  // Extract tag-based selectors (h1, h2, h3, section, footer, etc.)
  else if (/^[a-z]+/.test(sel)) classSelectors.add(sel);
  // Title= attributes
  else if (sel.startsWith('button[title')) classSelectors.add(sel);
  // #id selectors
  else if (sel.startsWith('#')) classSelectors.add(sel);
}

const results = [];
for (const sel of classSelectors) {
  // Normalize the selector to check against the template
  // The template has the same Tailwind classes; just check if any of the classes appear
  const classes = sel.replace(/^[.#]?/, '').split(/[\s.\[\]=">~+]+/).filter(c => c && c.length > 1 && !/^[:\[\]"=]$/.test(c));
  const allPresent = classes.every(cls => tmplContent.includes(cls));
  const partialPresent = classes.some(cls => tmplContent.includes(cls));
  results.push({ selector: sel, classes, allPresent, partialPresent });
}

const total = results.length;
const allOk = results.filter(r => r.allPresent).length;
const partialOk = results.filter(r => !r.allPresent && r.partialPresent).length;
const missing = results.filter(r => !r.partialPresent);

console.log(`[FaqDetail selector check]`);
console.log(`  Total unique selectors: ${total}`);
console.log(`  All classes present: ${allOk}/${total}`);
console.log(`  Partial match: ${partialOk}`);
console.log(`  Not found: ${missing.length}`);
if (missing.length) {
  console.log('  Missing selectors:');
  missing.forEach(m => console.log(`    ✗ ${m.selector}`));
}

if (partialOk > 0) {
  console.log('\n  Partial matches (some classes present):');
  results.filter(r => !r.allPresent && r.partialPresent).forEach(r => {
    console.log(`    ⚠ ${r.selector}`);
    console.log(`      Found: ${r.classes.filter(c => tmplContent.includes(c)).join(', ')}`);
    console.log(`      Missing: ${r.classes.filter(c => !tmplContent.includes(c)).join(', ')}`);
  });
}
