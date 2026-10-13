const fs = require('fs');
const assert = require('assert');

const source = fs.readFileSync('app.js', 'utf8');

assert(
  source.includes("document.querySelector('#copy-report-button')?.addEventListener('click',async()=>"),
  'Mangler clipboard-handler for rapport'
);
assert(
  source.includes('navigator.clipboard.writeText(buildFeedbackText())'),
  'Rapporten kopieres ikke til clipboard'
);
assert(
  source.includes("msg.textContent='Rapporten er kopiert.'"),
  'Mangler bekreftelse etter kopiering av rapport'
);
assert(
  source.includes("msg.textContent='Kunne ikke kopiere automatisk.'"),
  'Mangler kontrollert feilmelding hvis rapport ikke kan kopieres'
);
assert(
  source.includes('id="copy-created-invite"'),
  'Mangler Kopier lenke-knapp for invitasjon'
);
assert(
  source.includes("navigator.clipboard.writeText(p.url)"),
  'Invitasjonslenken kopieres ikke til clipboard'
);

console.log('v20.10.3 clipboard-regresjon: OK');
