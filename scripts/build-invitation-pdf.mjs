import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { spawnSync } from 'child_process';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'Tanya-Prabhat-Wedding-Invitation.pdf');
const tmpDir = path.join(root, '.pdf-parts');

spawnSync(process.execPath, [path.join(root, 'scripts/prepare-pdf-html.mjs')], {
  stdio: 'inherit',
});

const embedded = path.join(root, 'pdf', 'invitation.embedded.html');
const url = process.env.INVITE_PDF_URL || `file://${embedded}`;

const W = 794;
const H = 1123;

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: W, height: H },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

await page.goto(url, { waitUntil: 'load', timeout: 120000 });
await page.emulateMedia({ media: 'print' });
await page.waitForFunction(
  () => [...document.images].every((img) => img.complete && img.naturalWidth > 0),
  { timeout: 120000 }
);
await page.waitForTimeout(600);

const slideCount = await page.locator('.slide').count();

fs.mkdirSync(tmpDir, { recursive: true });
/** @type {string[]} */
const partPaths = [];

for (let i = 0; i < slideCount; i++) {
  await page.evaluate((idx) => {
    document.querySelectorAll('.slide').forEach((el, j) => {
      el.style.display = j === idx ? 'block' : 'none';
    });
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
  }, i);

  const part = path.join(tmpDir, `slide-${String(i + 1).padStart(2, '0')}.pdf`);
  await page.pdf({
    path: part,
    width: `${W}px`,
    height: `${H}px`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: false,
    displayHeaderFooter: false,
  });
  partPaths.push(part);
}

await browser.close();

const pyRun = `
import fitz, sys, glob, os
out, tmpdir = sys.argv[1], sys.argv[2]
merged = fitz.open()
for f in sorted(glob.glob(os.path.join(tmpdir, 'slide-*.pdf'))):
    merged.insert_pdf(fitz.open(f))
merged.save(out, deflate=True, garbage=4)
print('pages', merged.page_count)
merged.close()
`;

const merge = spawnSync('python3', ['-c', pyRun, out, tmpDir], { stdio: 'inherit' });
if (merge.status !== 0) process.exit(merge.status || 1);

for (const p of partPaths) fs.unlinkSync(p);

console.log('Wrote', out);