const fs = require('fs');
const assert = require('assert');

const data = JSON.parse(fs.readFileSync('tests/AI-GOLDEN-CASES.json', 'utf8'));
const cases = data.cases || [];
const occupationMap = JSON.parse(fs.readFileSync('data/OCCUPATION-SOURCE-MAP.json','utf8'));
const sourceBank = JSON.parse(fs.readFileSync('data/SOURCEBANK.json','utf8'));
const occupationSources = JSON.parse(fs.readFileSync('data/OCCUPATION-LEGAL-SOURCES.json','utf8'));
const agreementMap = JSON.parse(fs.readFileSync('data/AGREEMENT-SOURCE-MAP.json','utf8'));
const validSourceIds = new Set([
  ...(sourceBank.sources||[]).map(s=>s.id),
  ...(occupationSources.sources||[]).map(s=>s.id),
  ...(agreementMap.agreementAreas||[]).flatMap(a=>(a.curatedSources||[]).map(s=>s.id))
]);
const expectedThemes = [
  'Alkohol og rus',
  'Fravær og oppfølging',
  'Prestasjon og utvikling',
  'Lønn og utvikling',
  'Samarbeid og kommunikasjon',
  'Oppsigelse og avslutning av arbeidsforhold',
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

  if (tc.golden_group) {
    assert(['occupation_sector','employer_tariff','source_leakage'].includes(tc.golden_group), `${tc.id}: ugyldig golden_group`);
    assert(typeof tc.occupation === 'string' && tc.occupation.trim(), `${tc.id}: yrkesgolden mangler occupation`);
    assert(typeof tc.sectorId === 'string' && tc.sectorId.trim(), `${tc.id}: yrkesgolden mangler sectorId`);
    assert(typeof tc.occupation_relevant === 'boolean' || tc.golden_group === 'employer_tariff', `${tc.id}: mangler occupation_relevant`);
    for (const field of ['expected_source_ids','expected_source_ids_any','forbidden_source_ids']) {
      if (tc[field] !== undefined) {
        assert(Array.isArray(tc[field]), `${tc.id}: ${field} må være liste`);
        for (const id of tc[field]) assert(validSourceIds.has(id), `${tc.id}: ukjent kilde-ID i ${field}: ${id}`);
      }
    }
    if (tc.source_not_required === true) {
      assert(!(tc.expected_source_ids||[]).length && !(tc.expected_source_ids_any||[]).length, `${tc.id}: source_not_required kan ikke kombineres med forventet kilde`);
    }

    if (tc.golden_group === 'occupation_sector') {
      if (tc.occupation_relevant === true) {
        assert((tc.expected_source_ids||[]).length || (tc.expected_source_ids_any||[]).length, `${tc.id}: relevant yrkescase mangler eksplisitt forventet kildefasit`);
      } else {
        assert(tc.source_not_required === true || (tc.forbidden_source_ids||[]).length > 0, `${tc.id}: irrelevant yrkescase mangler negativ kildefasit`);
      }
    }
    if (tc.golden_group === 'source_leakage') {
      assert((tc.forbidden_source_ids||[]).length > 0, `${tc.id}: lekkasjecase mangler forbidden_source_ids`);
    }
  }

  assert(tc.manual_fasit && Array.isArray(tc.manual_fasit.must) && tc.manual_fasit.must.length >= 2, `${tc.id}: mangler MUST-fasit`);
  assert(Array.isArray(tc.manual_fasit.should), `${tc.id}: mangler SHOULD-fasit`);
  assert(Array.isArray(tc.manual_fasit.critical_fail) && tc.manual_fasit.critical_fail.length >= 2, `${tc.id}: mangler kritiske feil`);
}

for (const theme of expectedThemes) {
  assert(themes.has(theme), `Fasitbanken mangler hovedtema: ${theme}`);
}

for (const theme of expectedThemes) {
  const count = cases.filter(tc => tc.theme === theme).length;
  assert(count >= 2, `Fasitbanken må ha minst 2 caser per hovedtema; ${theme} har ${count}`);
}

const minimumRiskCoverage = {
  'Mobbing og trakassering': 3,
  'Oppsigelse og avslutning av arbeidsforhold': 3
};
for (const [theme, minimum] of Object.entries(minimumRiskCoverage)) {
  const count = cases.filter(tc => tc.theme === theme).length;
  assert(count >= minimum, `Fasitbanken må ha minst ${minimum} caser for risikotemaet ${theme}; fant ${count}`);
}

const occupationGolden = cases.filter(tc => tc.golden_group === 'occupation_sector');
const tariffGolden = cases.filter(tc => tc.golden_group === 'employer_tariff');
const leakageGolden = cases.filter(tc => tc.golden_group === 'source_leakage');
assert(occupationGolden.length >= 28, `Yrkesgolden må ha minst 28 sektorcaser; fant ${occupationGolden.length}`);
assert(tariffGolden.length >= 8, `Arbeidsgiver/tariff-golden må ha minst 8 caser; fant ${tariffGolden.length}`);
assert(leakageGolden.length >= 4, `Kildelekkasje-golden må ha minst 4 caser; fant ${leakageGolden.length}`);

const expectedSectorIds=(occupationMap.sectors||[]).filter(s=>s.id!=='other').map(s=>s.id);
for(const sectorId of expectedSectorIds){
  const sectorCases=occupationGolden.filter(tc=>tc.sectorId===sectorId);
  assert(sectorCases.length>=2, `Yrkesgolden mangler positiv/negativ dekning for sektor ${sectorId}`);
  assert(sectorCases.some(tc=>tc.occupation_relevant===true), `Yrkesgolden mangler relevant-case for ${sectorId}`);
  assert(sectorCases.some(tc=>tc.occupation_relevant===false), `Yrkesgolden mangler irrelevant-case for ${sectorId}`);
}
assert(cases.length >= 66, `Golden-banken skal ha minst 66 caser etter yrkesutvidelsen; fant ${cases.length}`);

assert(data.review_provenance?.prepared_by, 'Fasitbanken mangler dokumentasjon av hvem som har utarbeidet fasiten');
assert(data.review_provenance?.external_expert_validation === false, 'Fasitbanken skal eksplisitt dokumentere at ekstern ekspertvalidering ikke er gjennomført');

console.log(`Golden/fasit-schema OK: ${cases.length} caser · ${occupationGolden.length} sektorcaser · ${tariffGolden.length} tariff/arbeidsgiver · ${leakageGolden.length} lekkasje · alle 14 sektorer positiv/negativt dekket`);
