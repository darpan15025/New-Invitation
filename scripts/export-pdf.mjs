/**
 * @deprecated Use scripts/build-invitation-pdf.mjs for the print-designed PDF.
 * This script printed the live website; the invitation PDF is now separate.
 */
import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'Tanya-Prabhat-Wedding-Invitation.pdf');
const url = process.env.INVITE_URL || 'http://127.0.0.1:8877/index.html';

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 480, height: 900 },
  deviceScaleFactor: 2,
});
const page = await context.newPage();

await page.goto(url, { waitUntil: 'networkidle', timeout: 180000 });
await page.waitForFunction(() => document.fonts ? document.fonts.ready : true, { timeout: 60000 }).catch(() => {});
await page.waitForTimeout(600);

const open = page.locator('#openInvite');
if (await open.count()) {
  await open.click();
  await page.waitForTimeout(2000);
}

await page.evaluate(() => {
  document.querySelector('.opening')?.remove();
  document.getElementById('fxPanel')?.remove();
  document.getElementById('fireworksCanvas')?.remove();
  document.getElementById('dock')?.remove();
  document.querySelector('.petals')?.remove();
  document.body.classList.remove('locked');
  document.documentElement.classList.remove('locked');

  const invite = document.getElementById('invite');
  if (invite) {
    invite.classList.add('open');
    invite.setAttribute('aria-hidden', 'false');
  }
  document.querySelectorAll('.rv').forEach((el) => el.classList.add('in'));

  const style = document.createElement('style');
  style.id = 'pdf-export';
  style.textContent = `
    @media print {
      html, body { height: auto !important; overflow: visible !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
      body { background: #120208 !important; }
      .app { width: 480px !important; max-width: 480px !important; margin: 0 auto !important; overflow: visible !important; box-shadow: none !important; }
      section, article, .box { break-inside: avoid; page-break-inside: avoid; }
      .hero { break-after: page; page-break-after: always; }
      .event { break-inside: avoid-page; }
    }
  `;
  document.head.appendChild(style);
});

await page.emulateMedia({ media: 'print' });
await page.waitForTimeout(800);

await page.pdf({
  path: out,
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: false,
  scale: 0.62,
  margin: { top: '8mm', bottom: '8mm', left: '6mm', right: '6mm' },
  displayHeaderFooter: false,
});

await browser.close();
console.log('Wrote', out);