import fs from 'node:fs';

const html = fs.readFileSync('index.html','utf8');
const css = fs.readFileSync('styles.css','utf8');
const app = fs.readFileSync('app.js','utf8');
const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));

const checks = [
  ['versjon 19.5.0', pkg.version === '19.5.0'],
  ['Ny samtale fjernet fra sidemenyen', !html.includes('data-view="prepare"')],
  ['topplinje bruker kompakt plussknapp', /id="new-conversation-button"[^>]*>＋<\/button>/.test(html)],
  ['plussknapp skjules på hjem', app.includes("newChatButton.hidden = name === 'home'")],
  ['pronomen alene blokkeres ikke', !app.includes("add('gender'")],
  ['personvern har blocking og warning', app.includes("severity = 'warning'") && app.includes("'blocking'")],
  ['myke funn kan sendes', app.includes("privacyFindings.some(item => item.severity === 'blocking')")],
  ['personvernstatus er kompakt', app.includes('Personvernkontroll: ingen tydelige identifikatorer funnet')],
  ['historikk bruker temavariabler', css.includes('.history-item{background:var(--surface)!important')],
  ['utility-logo finnes', (html.match(/class="utility-brand"/g)||[]).length >= 6],
  ['utility-logo følger mørkt tema', css.includes(".utility-brand img{content:url('logo-light.png')}")],
  ['personvern/info bredde redusert', css.includes('max-width:740px')],
  ['tema-kontroll gjort kompakt', css.includes('.theme-switcher{gap:3px;padding:3px')],
];
let failed=0;
for(const [name,ok] of checks){ console.log(`${ok?'OK':'FEIL'}  ${name}`); if(!ok) failed++; }
console.log(`\n${checks.length-failed}/${checks.length} kontroller bestått.`);
process.exitCode=failed?1:0;
