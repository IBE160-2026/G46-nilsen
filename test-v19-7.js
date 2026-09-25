import fs from 'node:fs';
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');
const js=fs.readFileSync('app.js','utf8');
const checks=[
  ['simulator har personvernfelt per melding', html.includes('simulation-turn-privacy')],
  ['simulator bruker samme personverndeteksjon', js.includes('detectSensitiveInfo(text)') && js.includes('updateSimulationTurnPrivacy')],
  ['hard personvernfunn blokkerer sending', js.includes("splitPrivacyFindings(findings).hard.length")],
  ['simulator kan fikse personvern', js.includes('simulation-privacy-fix') && js.includes('autoFixPrivacyText')],
  ['tre simulatorhandlinger deler stil', css.includes('.simulation-expand,.simulation-end-top,.simulation-privacy-link')],
  ['boblehalene har markant lengde', css.includes('width:27px') && css.includes('gap:26px')],
  ['infosidelogo er på høyre side', css.includes('grid-column:2;grid-row:1 / span 3')],
  ['infosidelogo er større', css.includes('width:132px')]
];
let failed=0;
for (const [name,ok] of checks){ console.log(`${ok?'OK':'FEIL'} - ${name}`); if(!ok) failed++; }
if(failed) process.exit(1);
console.log(`\n${checks.length}/${checks.length} kontroller OK`);
