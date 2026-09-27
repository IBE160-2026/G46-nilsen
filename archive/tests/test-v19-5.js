import fs from 'node:fs';
const html=fs.readFileSync('index.html','utf8');
const js=fs.readFileSync('app.js','utf8');
const css=fs.readFileSync('styles.css','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const tests=[
 ['v19.5 package',pkg.version==='19.5.0'],
 ['Ny samtale fjernet fra sidemeny',!html.includes('data-view="prepare"')],
 ['Toppknapp har pluss',html.includes('id="new-conversation-button" type="button">＋ Ny samtale</button>')],
 ['Toppknapp skjules på hjem',js.includes("topNew.hidden = name === 'home'")],
 ['Pronomen alene flagges ikke',!js.includes("add('gender'")],
 ['Hard privacy typer finnes',js.includes("HARD_PRIVACY_TYPES")],
 ['Soft privacy advisory finnes',js.includes('Dette er en anbefaling, ikke en blokkering.')],
 ['Klar status er kompakt',js.includes('ingen tydelige identifikatorer funnet')],
 ['Historikk bruker surface',css.includes('.history-item{') && css.includes('background:var(--surface)')],
 ['Utility logo finnes',html.includes('utility-page-brand')],
 ['Privacy max width 720',css.includes('max-width:720px')],
 ['Changelog v19.5 finnes',fs.readFileSync('CHANGELOG.md','utf8').includes('## v19.5')]
];
let ok=0;
for(const [name,pass] of tests){ console.log(`${pass?'OK':'FEIL'} - ${name}`); if(pass)ok++; }
console.log(`\n${ok}/${tests.length} kontroller OK`);
if(ok!==tests.length) process.exit(1);
