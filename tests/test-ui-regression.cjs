const fs = require('fs');
const assert = require('assert');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const app = fs.readFileSync('app.js', 'utf8');

for (const page of ['admin', 'help', 'survey']) {
  assert(html.includes(`data-page-icon="${page}"`), `${page}: mangler minimert sideikon`);
}
assert(html.includes('id="admin-view"') && /id="admin-view"[\s\S]*?utility-page-logo/.test(html), 'Admin mangler logo ved overskrift');
assert(html.includes('id="help-view"') && /id="help-view"[\s\S]*?utility-page-logo/.test(html), 'Hjelp mangler logo ved overskrift');
assert(html.includes('id="survey-view"') && /id="survey-view"[\s\S]*?utility-page-logo/.test(html), 'Brukertest mangler logo ved overskrift');
assert(/width:\s*42px\s*!important/.test(css), 'Minimert ikon er ikke gjort større');
assert(/transform:\s*translateY\(-4px\)/.test(css), 'Minimert ikon er ikke hevet');
assert(/font-weight:\s*600\s*!important/.test(css), 'Accordion-overskrifter er ikke tonet ned');
assert(!/<details[^>]*\sopen(?:\s|>|=)/.test(html), 'En eller flere details er åpne som standard');
console.log('v20.10.3 UI-kontroll: OK');




function assertUi(condition, message) {
  if (!condition) {
    console.error("FEIL - " + message);
    process.exitCode = 1;
  }
}

assertUi(/id=["']continue-input["'][^>]*aria-label=["'][^"']+["']/i.test(html), "UU: continue-input mangler aria-label");
assertUi(/id=["']direct-simulation-situation["'][^>]*aria-label=["'][^"']+["']/i.test(html), "UU: direct-simulation-situation mangler aria-label");
assertUi(/id=["']simulation-input["'][^>]*aria-label=["'][^"']+["']/i.test(html), "UU: simulation-input mangler aria-label");
if (!process.exitCode) console.log("UU: sentrale fritekstfelt har programmatisk etikett");

assert(/styles\.css\?v=20\.10\.3/.test(html), "CSS cache-versjon er ikke 20.10.3");
assert(/id=["']about-app-version["']>20\.10\.3</.test(html), "Fallback-appversjon i Om-siden er ikke 20.10.3");
if (!process.exitCode) console.log("Versjonskonsistens i HTML: OK");

assert(/id=["']report-meta["']>Versjon 20\.10\.3</.test(html), "Fallback-versjon i Kontakt er ikke 20.10.3");
if (!process.exitCode) console.log("Kontakt-versjon: OK");

assert(/<script src=["']src\/privacy-name-data\.js\?v=20\.10\.3["']><\/script>[\s\S]*<script src=["']src\/privacy-detector\.js\?v=20\.10\.3["']><\/script>[\s\S]*<script src=["']src\/client-data\.js\?v=20\.10\.3["']><\/script>[\s\S]*<script src=["']app\.js\?v=20\.10\.3["']><\/script>/.test(html), "Personvernmodul og klientdata lastes ikke før app.js med riktig versjon");
console.log("Klientmodul-innlasting: OK");

// Ansvarlig bruk: brukergrensesnittet skal tydelig vise at KI-råd er veiledning og ikke faglig fasit.
assert(html.includes('Veiledning – ikke faglig fasit'), 'Mangler synlig advarsel om at KI-råd ikke er faglig fasit');
assert(html.includes('KI-råd kan være ufullstendige eller feil') || html.includes('KI-rådene er veiledning, ikke en faglig fasit'), 'Mangler tydelig begrensning om KI-rådenes usikkerhet');

// Brukertest-personvern skal være synlig i personvernerklæringen.
assert(html.includes('Svar i den korte brukertesten lagres separat uten navn, e-post eller bruker-ID'), 'Mangler personverninformasjon om brukertest');
assert(html.includes('deltakelsesmarkering'), 'Mangler forklaring av separat deltakelsesmarkering');

// Runtime-UI skal ikke fremstille HR som universell fasit.
assert(app.includes("['Faglig / regelverk'"), 'Mangler flerfaglig overskrift i veiledningen');
assert(!app.includes("['HR / regelverk'"), 'Gammel HR-sentrert overskrift finnes fortsatt i veiledningen');

assert(html.includes('id="survey-privacy"'), 'Brukertestens fritekst mangler live personvernsjekk');
assert(html.includes('id="ai-feedback-comment-privacy"'), 'KI-tilbakemeldingskommentar mangler live personvernsjekk');
assert(html.includes('<strong>Personvern:</strong> Ikke skriv navn'), 'Kontaktskjemaet mangler personvernpåminnelse');
assert(app.includes("updateSurveyPrivacy"), 'Brukertestens live personvernsjekk er ikke koblet i app.js');
assert(app.includes("updateAiFeedbackCommentPrivacy"), 'KI-feedback live personvernsjekk er ikke koblet i app.js');
console.log("Personvernflater: OK");


assert(index.includes('id="survey-completed-message"') && index.includes('Brukertesten er sendt inn'), 'Brukertest skal vise tydelig bekreftelse etter innsending');
assert(!app.includes('setTimeout(()=>openSurvey(),250)'), 'Brukertest skal ikke åpnes på nytt rett etter vellykket innsending');
assert(app.includes("pendingSituationText = '';"), 'Ny/full reset skal nullstille bevart situasjonstekst');
assert(app.includes("if (detailSearch) detailSearch.value = '';"), 'Temadetaljfelt skal være tomt etter full reset');
console.log('Brukertest/reset-regresjon: OK');

assert(app.includes('if(surveySubmitting)return;'), 'Brukertest skal blokkere dobbel innsending mens POST pågår');
assert(app.includes("submit.textContent='Sender …'"), 'Brukertest skal vise at innsending pågår');
assert(!app.includes("document.querySelector('[data-view=\"survey\"]')?.addEventListener('click',openSurvey);"), 'Survey-nav skal ikke ha duplisert openSurvey-listener');
console.log('Brukertest dobbel-submit-regresjon: OK');
