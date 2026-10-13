const fs = require('fs');
const assert = require('assert');

const data = JSON.parse(fs.readFileSync('tests/AI-GOLDEN-CASES.json', 'utf8'));
const cases = data.cases || [];
const expectedThemes = [
  'Alkohol og rus',
  'Fravær og oppfølging',
  'Prestasjon og utvikling',
  'Lønn og utvikling',
  'Samarbeid og kommunikasjon',
  'Avslutning av arbeidsforhold',
  'Sikkerhet og ansvar',
  'Livssituasjoner',
  'Mobbing og trakassering'
];

assert(cases.length >= expectedThemes.length, 'Fasitbanken må ha minst én representativ case per hovedtema');

const ids = new Set();
const themes = new Set();
for (const tc of cases) {
  assert(tc.id && !ids.has(tc.id), `Ugyldig eller duplisert case-id: ${tc.id}`);
  ids.add(tc.id);
  themes.add(tc.theme);

  assert(Array.isArray(tc.requirement_refs) && tc.requirement_refs.length > 0, `${tc.id}: mangler kravreferanser`);
  for (const ref of tc.requirement_refs) {
    assert(/^(?:FR|AI|NFR)-\d+$/.test(ref), `${tc.id}: ugyldig kravreferanse ${ref}`);
  }

  assert(typeof tc.input === 'string' && tc.input.trim().length > 30, `${tc.id}: mangler reell testcase`);
  assert(Array.isArray(tc.expected_topics_any) && tc.expected_topics_any.length > 0, `${tc.id}: mangler forventet tema`);
  assert(['required','optional','none'].includes(tc.followup), `${tc.id}: ugyldig followup-verdi`);
  assert(Array.isArray(tc.auto_checks) && tc.auto_checks.length > 0, `${tc.id}: mangler maskinelle fasitpunkter`);
  for (const check of tc.auto_checks) {
    assert(check.description, `${tc.id}: auto_check mangler beskrivelse`);
    assert(Array.isArray(check.patterns_any) && check.patterns_any.length > 0, `${tc.id}: auto_check mangler mønstre`);
    for (const p of check.patterns_any) new RegExp(p, 'iu');
  }

  assert(Array.isArray(tc.must_not_adopt), `${tc.id}: must_not_adopt må være liste`);
  assert(tc.manual_fasit && Array.isArray(tc.manual_fasit.must) && tc.manual_fasit.must.length >= 2, `${tc.id}: mangler MUST-fasit`);
  assert(Array.isArray(tc.manual_fasit.should), `${tc.id}: mangler SHOULD-fasit`);
  assert(Array.isArray(tc.manual_fasit.critical_fail) && tc.manual_fasit.critical_fail.length >= 2, `${tc.id}: mangler kritiske feil`);
}

for (const theme of expectedThemes) {
  assert(themes.has(theme), `Fasitbanken mangler hovedtema: ${theme}`);
}

console.log(`Golden/fasit-schema OK: ${cases.length} caser · ${themes.size}/9 hovedtemaer dekket`);
