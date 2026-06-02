/**
 * Extracts <style> and <body> from Stitch HTML into TS modules for StitchPage.
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const refDir = path.join(__dirname, '../public/stitch-ref')
const outDir = path.join(__dirname, '../src/stitch-content')

const files = fs.readdirSync(refDir).filter((f) => f.endsWith('.html')).sort()

const stylesDir = path.join(__dirname, '../src/styles')
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true })
if (!fs.existsSync(stylesDir)) fs.mkdirSync(stylesDir, { recursive: true })

let mergedStyles = ''

/** Remove Stitch left-panel background image placeholder (commented or active). */
function stripDynamicDataPlaceholder(html) {
  return html
    .replace(
      /\s*<!--\s*Dynamic Data Image Placeholder for Left Background\s*-->[\s\S]*?(?=\s*<\/section>|\s*<!-- RIGHT SIDE)/gi,
      '',
    )
    .replace(
      /\s*<!--\s*Dynamic Data Image Placeholder for Left Background\s*-->[\s\S]*?<\/div>\s*(?:-->\s*)?/gi,
      '',
    )
    .replace(/<!--\s*Dynamic Data Image Placeholder for Left Background\s*-->\s*/gi, '')
}

for (const file of files) {
  let html = fs.readFileSync(path.join(refDir, file), 'utf8')
  html = stripDynamicDataPlaceholder(html)
  fs.writeFileSync(path.join(refDir, file), html)
  const key = file.replace('.html', '')

  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi)
  const styles = styleMatch
    ? styleMatch.map((s) => s.replace(/<\/?style[^>]*>/gi, '')).join('\n')
    : ''

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)
  const body = bodyMatch ? bodyMatch[1].trim() : ''
  const bodyWithoutScripts = body.replace(/<script[\s\S]*?<\/script>/gi, '').trim()

  mergedStyles += `\n/* ${key} */\n${styles}\n`

  const esc = (s) => s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')
  const ts = `// Auto-generated from public/stitch-ref/${file} — do not edit by hand
export const pageStyles = \`${esc(styles)}\`
export const bodyHtml = \`${esc(bodyWithoutScripts)}\`
`
  fs.writeFileSync(path.join(outDir, `${key}.ts`), ts)
  console.log('Wrote', key)
}

fs.writeFileSync(path.join(__dirname, '../src/styles/stitch-pages.css'), mergedStyles)
console.log('Wrote stitch-pages.css')
