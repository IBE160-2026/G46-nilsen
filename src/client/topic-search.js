// Samtalestøtte – lokal reserveklassifisering for temaforslag.
// Ren, deterministisk søkelogikk uten DOM, lagring eller nettverkskall.
(function registerTopicSearch(root) {
  "use strict";
const searchAliases = {
  'fravaer-oppfolging': ['sykemelding','sykmelding','sykemeldt','sykmeldt','sykemeld','sykmeld','sykefravær','fravær','langtidsfravær','langtidssyk','borte fra jobb','mye borte','korttidsfravær','oppmøte','for sent','tilbake etter sykmelding','tilrettelegging'],
  'prestasjon-utvikling': ['prestasjon','leveranse','resultat','måloppnåelse','kvalitet','frister','kompetanse','mestring','arbeidsutførelse','gjør ikke jobben','sitter på internett','internett i arbeidstiden','surfer på nettet','privat surfing','sosiale medier','bruker mye tid på nettet','telefonen i arbeidstiden','mobilen i arbeidstiden','bruker tiden på'],
  'lonn-utvikling': ['lønn','lønnsøkning','opprykk','forfremmelse','ny stilling','karriere','utviklingsmulighet','ansvarstillegg'],
  'samarbeid-kommunikasjon': ['konflikt','samarbeid','kommunikasjon','uenighet','tillit','tone','team','krangel','snakker ikke sammen'],
  'alkohol-rus': ['alkohol','rus','beruset','påvirket','drikking','narkotika','stoff','promille'],
  'avslutning-arbeidsforhold': ['oppsigelse','avslutte arbeidsforhold','prøvetid','nedbemanning','slutte','avskjed'],
  'sikkerhet-ansvar': ['sikkerhet','avvik','hendelse','risiko','prosedyre','rutinebrudd','informasjonssikkerhet'],
  'livssituasjoner': ['sorg','familie','samlivsbrudd','omsorg','privat belastning','stress','utmattelse','vanskelig hjemme']
};

function normalizeSearchText(value) {
  return (value || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

function scoreTopic(topic, query) {
  const q = normalizeSearchText(query);
  if (!q) return 0;
  let score = 0;
  const aliases = searchAliases[topic.id] || [];
  aliases.forEach(alias => { if (q.includes(alias)) score += alias.length > 8 ? 8 : 6; });
  topic.keywords.forEach(keyword => { if (q.includes(keyword.toLowerCase())) score += 5; });
  if (q.includes(topic.title.toLowerCase())) score += 8;
  const words = q.split(/\s+/).filter(word => word.length > 3);
  topic.subtopics.forEach(([title, help]) => {
    const haystack = `${title} ${help}`.toLowerCase();
    words.forEach(word => { if (haystack.includes(word)) score += 1; });
  });
  return score;
}

function suggestTopics(query, topics) {
  return topics
    .map(topic => ({ topic, score: scoreTopic(topic, query) }))
    .sort((a, b) => b.score - a.score);
}

function scoreSubtopicForTopic(topic, [title, help], query) {
  const q = normalizeSearchText(query);
  const haystack = `${title} ${help}`.toLowerCase();
  let score = 0;
  const t = title.toLowerCase();
  const aliasMap = {
    'korttidsfravær': ['ofte borte','mye borte','gjentatt fravær','korttidsfravær','enkeltdager'],
    'langvarig fravær': ['sykemelding','sykmelding','sykemeldt','sykmeldt','langtidssyk','langtidsfravær','lenge borte','måneder','ett år','et år'],
    'oppmøte og punktlighet': ['for sent','forsinket','oppmøte','punktlighet','kommer sent'],
    'tilbakekomst til arbeid': ['tilbake etter sykmelding','kommer tilbake','tilbake i jobb','retur','tilbakekomst'],
    'tilrettelegging': ['tilrettelegging','lettere oppgaver','redusert tid','arbeidstid','justere oppgaver'],
    'arbeidsevne og kapasitet': ['arbeidsevne','kapasitet','orker ikke','funksjon','arbeidsmengde']
  };
  (aliasMap[t] || []).forEach(alias => { if (q.includes(alias)) score += 8; });
  q.split(/\s+/).forEach(word => { if (word.length > 2 && haystack.includes(word)) score += 2; });
  if (q.includes(t)) score += 6;
  if (topic?.id === 'fravaer-oppfolging' && /syk[e]?meld|sykefravær/i.test(q) && t === 'langvarig fravær') score += 5;
  return score;
}



  root.SamtalestotteTopicSearch = Object.freeze({
    normalizeSearchText, scoreTopic, suggestTopics, scoreSubtopicForTopic
  });
})(window);
