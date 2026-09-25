import fs from 'fs';

const read = file => fs.readFileSync(file, 'utf8');
const html = read('index.html');
const css = read('styles.css');
const app = read('app.js');
const server = read('server.js');
const changelog = read('CHANGELOG.md');
const pkg = JSON.parse(read('package.json'));

const checks = [
  ['package version 19.3.0', pkg.version === '19.3.0'],
  ['cropped logo symbol exists', fs.existsSync('logo-symbol.png')],
  ['cropped dark logo symbol exists', fs.existsSync('logo-symbol-light.png')],
  ['human profile exists', fs.existsSync('profile-human.png')],
  ['AI profile exists', fs.existsSync('profile-ai.png')],
  ['simulator uses cropped symbol', html.includes('src="logo-symbol.png"')],
  ['sidebar uses AI profile', html.includes('id="nav-simulation-icon"') && html.includes('src="profile-ai.png"')],
  ['leader avatar rendered', app.includes('leader-avatar') && app.includes('profile-human.png')],
  ['employee AI avatar rendered', app.includes('employee-avatar') && app.includes('profile-ai.png')],
  ['dark warning uses rose surface', css.includes('background:#4b333d') && css.includes('border-color:#b97f93')],
  ['dark OK uses lighter petrol', css.includes('background:#244b50') && css.includes('border-color:#73b6ba')],
  ['bubbles have larger tails', css.includes('width:15px;height:15px')],
  ['About page names student CCN', html.includes('studenten CCN')],
  ['About page names ChatGPT/OpenAI', html.includes('ChatGPT fra OpenAI')],
  ['About explains purpose', html.includes('Hvorfor Samtalestøtte?')],
  ['surprise prompt avoids standard generic answer', server.includes('Ikke bruk standardsvar om uklare forventninger')],
  ['emotional prompt avoids polished problem solving', server.includes('ferdigpolerte refleksjoner')],
  ['changelog contains v19.3', changelog.includes('## v19.3')],
  ['changelog still contains v1', changelog.includes('## v1 – Første fungerende prototype')],
];

let ok = 0;
for (const [name, pass] of checks) {
  console.log(`${pass ? 'OK' : 'FEIL'}  ${name}`);
  if (pass) ok++;
}
console.log(`\n${ok}/${checks.length} kontroller bestått.`);
if (ok !== checks.length) process.exit(1);
