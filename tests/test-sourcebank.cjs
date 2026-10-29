const fs = require('fs');
const assert = require('assert');

(async () => {
  const sourceBank = JSON.parse(fs.readFileSync('data/SOURCEBANK.json', 'utf8'));
  const html = fs.readFileSync('index.html', 'utf8');
  const { topicCatalog } = await import('../src/server/topic-contracts.js');

  assert(Number(sourceBank.version) >= 6, 'SOURCEBANK skal være minst versjon 6');
  assert(Array.isArray(sourceBank.sources) && sourceBank.sources.length > 0, 'SOURCEBANK mangler sources');

  const validTopics = new Set(topicCatalog.map(topic => topic.title));
  const ids = new Set();

  for (const source of sourceBank.sources) {
    assert(source.id && !ids.has(source.id), 'Ugyldig eller duplisert kilde-ID: ' + source.id);
    ids.add(source.id);
    assert(source.title && source.author && source.year, source.id + ': mangler grunnleggende metadata');
    assert(Array.isArray(source.topics) && source.topics.length, source.id + ': mangler topics');
    assert(Array.isArray(source.principles) && source.principles.length, source.id + ': mangler lokale fagprinsipper');
    assert(source.last_verified, source.id + ': mangler last_verified');
    for (const topic of source.topics) {
      assert(validTopics.has(topic), source.id + ': gammelt eller ukjent hovedtema "' + topic + '"');
    }
  }

  const required = [
    'DFO_PERSONALSAKER_FORBEREDELSE_2026',
    'DFO_PERSONALSAKER_GJENNOMFORING_2026',
    'BI_KUVAAS_AUTONOMISTOTTE_2026',
    'BI_LAI_FEEDBACK_2026',
    'BI_LAI_RELASJON_2022',
    'STAMI_MUST_ARBEIDSMILJO_2026',
    'HELSEDIR_MI_METHOD'
  ];

  for (const id of required) {
    assert(ids.has(id), 'SOURCEBANK mangler ny samtalefaglig kilde: ' + id);
    const source = sourceBank.sources.find(item => item.id === id);
    assert(source.url && html.includes(source.url), 'Hjelp-siden mangler lenken for ' + id);
  }

  assert(fs.existsSync('docs/faggrunnlag/FAGGRUNNLAG-SAMTALETEKNIKK-RELASJONSLEDELSE.md'),
    'Lokalt tverrgående faggrunnlag for samtaleteknikk/relasjonsledelse mangler');

  console.log('SOURCEBANK OK: v' + sourceBank.version + ' · ' + sourceBank.sources.length + ' kilder · temaer og Hjelp-lenker synkronisert');
})().catch(error => {
  console.error(error);
  process.exit(1);
});
