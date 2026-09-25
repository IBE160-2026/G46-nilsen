import fs from 'node:fs';

const app = fs.readFileSync('app.js', 'utf8');
const server = fs.readFileSync('server.js', 'utf8');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

const checks = [
  ['version 19.10', pkg.version === '19.10.0' && server.includes('19.10.0')],
  ['AI topic endpoint', server.includes('/api/classify-topic') && server.includes('Velg ut fra MENINGEN i hele situasjonen')],
  ['internet context rule', server.includes('privat nettbruk') && server.includes('prestasjon-utvikling')],
  ['privacy before topic AI', app.includes('updateFinderPrivacyCheck') && html.includes('topic-finder-privacy')],
  ['privacy on subtopic finder', html.includes('topic-detail-privacy')],
  ['fewer clicks automatic continue', app.includes("classification.confidence === 'low'") && app.includes('openGuidanceFromSuggestion(topic, subtopic, situation)')],
  ['change AI topic option', html.includes('change-auto-topic') && app.includes('change-auto-topic')],
  ['long simulation tails', css.includes('width:50px') && css.includes('clip-path:path("M 50 2 C 40 8 29 21 3 36')],
  ['utility logo lifted', css.includes('transform:translateY(-8px)')],
  ['hybrid logo lightened', css.includes('brightness(1.24)')]
];

let failed = false;
for (const [name, ok] of checks) {
  console.log(ok ? `OK ${name}` : `FAIL ${name}`);
  if (!ok) failed = true;
}
if (failed) process.exit(1);
