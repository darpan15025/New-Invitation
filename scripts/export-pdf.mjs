import { chromium } from 'playwright';
import { fileURLToPath } from 'url';
import path from 'path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const out = path.join(root, 'Tanya-Prabhat-Wedding-Invitation.pdf');
const outDocs = path.join(root, 'docs', 'Tanya-Prabhat-Wedding-Invitation.pdf');
const url =
  process.env.INVITE_URL || 'https://prabhatandtanya.vercel.app/';

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width: 430, height: 932 },
  deviceScaleFactor: 2,
});

await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
await page.evaluate(() => document.fonts?.ready);
await page.waitForTimeout(600);

const open = page.locator('#openInvite');
if (await open.count()) {
  await open.click();
  await page.waitForTimeout(1400);
}

const reveal = page.locator('#revealDate');
if (await reveal.isVisible()) {
  await reveal.click();
  await page.waitForTimeout(400);
}

await page.evaluate(() => {
  document.querySelector('.opening')?.remove();
  document.querySelector('.petals')?.remove();
  document.getElementById('fxPanel')?.remove();
  document.getElementById('fireworksCanvas')?.remove();
  document.getElementById('dock')?.remove();
  document.body.classList.remove('locked');
  document.documentElement.classList.remove('locked');
});

await page.waitForTimeout(500);

const height = await page.evaluate(() => {
  const app = document.querySelector('.app') || document.body;
  return Math.ceil(Math.max(app.scrollHeight, document.documentElement.scrollHeight) + 40);
});

await page.pdf({
  path: out,
  width: '430px',
  height: `${height}px`,
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: false,
});

await page.pdf({
  path: outDocs,
  width: '430px',
  height: `${height}px`,
  printBackground: true,
  margin: { top: 0, right: 0, bottom: 0, left: 0 },
  preferCSSPageSize: false,
});

await browser.close();
console.log('Wrote', out, 'and', outDocs, 'height', height);