import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'Tanya-Prabhat-Wedding-Invitation.pdf');
const url = process.env.INVITE_PDF_URL || 'http://127.0.0.1:8877/pdf/invitation.html';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 794, height: 1123 },
  deviceScaleFactor: 2,
});

await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
await page.waitForTimeout(1200);

await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: true,
  displayHeaderFooter: false,
});

await browser.close();
console.log('Wrote', out);