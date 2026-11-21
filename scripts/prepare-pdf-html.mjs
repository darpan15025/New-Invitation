import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const src = path.join(root, 'pdf', 'invitation.html');
const out = path.join(root, 'pdf', 'invitation.embedded.html');

function toDataUrl(file) {
  const abs = path.join(root, file.replace(/^\//, ''));
  if (!fs.existsSync(abs)) throw new Error(`Missing asset: ${abs}`);
  const buf = fs.readFileSync(abs);
  const ext = path.extname(abs).slice(1).toLowerCase();
  const mime =
    ext === 'webp' ? 'image/webp' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
  return `data:${mime};base64,${buf.toString('base64')}`;
}

let html = fs.readFileSync(src, 'utf8');
html = html.replace(/src="\.\.\/([^"]+)"/g, (_, rel) => `src="${toDataUrl(rel)}"`);
fs.writeFileSync(out, html);
console.log('Wrote', out);