import fs from 'node:fs';

const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('./styles.css', import.meta.url), 'utf8');
const app = fs.readFileSync(new URL('./app.js', import.meta.url), 'utf8');
const server = fs.readFileSync(new URL('./server.js', import.meta.url), 'utf8');
const pkg = JSON.parse(fs.readFileSync(new URL('./package.json', import.meta.url), 'utf8'));

const checks = [
  ['version 19.9.0', pkg.version === '19.9.0'],
  ['old simulator hub card removed', !html.includes('Øv på denne samtalen')],
  ['two simulator hub choices', html.includes('simulation-launch-grid two-options')],
  ['reflection section exists', html.includes('Kort refleksjon før du går videre')],
  ['utility header grouping exists', html.includes('utility-header-copy')],
  ['cookie/localStorage privacy text exists', html.includes('Nødvendig lokal lagring')],
  ['contact email fallback set', server.includes('cecilie.c.nilsen@himolde.no')],
  ['privacy banner uses warning token', css.includes('.simulation-privacy-banner{') && css.includes('background:var(--warning)')],
  ['smooth logo-like tail rule present', css.includes('clip-path:path("M 38 1 C 30 8 22 19 2 29 C 17 25 30 20 38 12 Z")')],
  ['stale current simulator card listener removed', !app.includes("#simulation-use-current')?.addEventListener")],
  ['keyboard focus styling present', css.includes('button:focus-visible')]
];

let failed = 0;
for (const [label, ok] of checks) {
  console.log(`${ok ? 'OK' : 'FEIL'}: ${label}`);
  if (!ok) failed++;
}
if (failed) process.exit(1);
