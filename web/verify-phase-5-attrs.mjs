// Phase 5: verify Library data-cm-* attrs survive stitch:extract and are queryable
import { readFileSync } from "fs";

const ts = readFileSync("src/stitch-content/02-library.ts", "utf8");
const html = readFileSync("public/stitch-ref/02-library.html", "utf8");

const attrs = ["data-cm-pagination", "data-cm-page-prev", "data-cm-page-next"];

console.log("=== src/stitch-content/02-library.ts ===");
for (const a of attrs) {
  const count = (ts.match(new RegExp(a.replace("-", "\\-"), "g")) || []).length;
  console.log(`  ${a}: ${count}`);
}

console.log("\n=== public/stitch-ref/02-library.html ===");
for (const a of attrs) {
  const count = (html.match(new RegExp(a.replace("-", "\\-"), "g")) || []).length;
  console.log(`  ${a}: ${count}`);
}
