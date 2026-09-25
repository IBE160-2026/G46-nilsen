import fs from 'fs';

const html = fs.readFileSync('index.html','utf8');
const css = fs.readFileSync('styles.css','utf8');
const js = fs.readFileSync('app.js','utf8');

const checks = [
  ['Navnet «Øv på denne samtalen» brukes', html.includes('Øv på denne samtalen')],
  ['Utvid samtalen-knapp finnes', html.includes('id="toggle-simulation-size"')],
  ['Statuslinjen bruker logosymbol', html.includes('simulation-status-logo') && html.includes('logo-symbol.png')],
  ['Si dette står før KI-hjelp i skjemaet', html.indexOf('>Si dette</button>') < html.indexOf('id="toggle-simulation-help"')],
  ['Avataren viser hele bildet med contain', /\.simulation-avatar img\{[^}]*object-fit:contain/.test(css)],
  ['Avatarer speilvendes bare under simulatorstilene', /\.simulation-avatar img\{[^}]*transform:scaleX\(-1\)/.test(css)],
  ['Avatarene er større enn i v19.3', css.includes('width:58px;height:58px;flex:0 0 58px')],
  ['Snakkeboblehalene er forlenget', css.includes('width:22px;height:22px')],
  ['Chatten er høyere', css.includes('min-height:330px;max-height:66vh')],
  ['Utvidet chat har egen høyde', css.includes('.simulation-live.expanded .simulation-thread')],
  ['Eksisterende samtale skjules uten kontekst', js.includes('currentButton.hidden = !available')],
  ['Startgrid går over til to valg', js.includes("launchGrid?.classList.toggle('two-options', !available)")],
  ['Utvid/normal størrelse toggles', js.includes("button.textContent = expanded ? 'Normal størrelse' : 'Utvid samtalen'")],
  ['Øv-kortet bruker logosymbol', html.includes('simulation-entry-icon') && html.includes('<img src="logo-symbol.png" alt="" />')],
  ['Primærhandlinger er venstrejustert i simulator', css.includes('.simulation-form-actions{justify-content:flex-start}')],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? 'OK' : 'FEIL'} - ${name}`);
  if (!ok) failed++;
}
console.log(`\nResultat: ${checks.length-failed}/${checks.length} OK`);
if (failed) process.exit(1);
