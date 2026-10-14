// --- v19.10: KI-basert temaforståelse ---
export const topicCatalog = [
  {
    id: "alkohol-rus",
    title: "Alkohol og rus",
    description: "Eksplisitte observasjoner eller bekymringer om alkohol, rusmidler eller påvirkning.",
    subtopics: ["Bekymring knyttet til alkohol","Bekymring knyttet til rusmidler","Påvirkning på jobb","Arbeidsevne og fungering","Sikkerhet og hendelser","Oppfølging og tilbakekomst"]
  },
  {
    id: "fravaer-oppfolging",
    title: "Fravær og oppfølging",
    description: "Sykefravær, egenmeldinger, oppmøte, planlagt fravær, tilbakekomst, arbeidsevne eller tilrettelegging.",
    subtopics: ["Hyppig korttidsfravær og egenmeldinger","Langvarig sykefravær","Oppmøte og punktlighet","Planlagt fravær","Tilbakekomst til arbeid","Tilrettelegging og arbeidsevne"]
  },
  {
    id: "prestasjon-utvikling",
    title: "Prestasjon og utvikling",
    description: "Arbeidsutførelse, prioritering, tidsbruk, mål, kvalitet, motivasjon, ansvar, initiativ eller kompetanse.",
    subtopics: ["Måloppnåelse","Motivasjon","Kvalitet i arbeidet","Feil og avvik","Kompetanse og mestring","Ansvar og initiativ"]
  },
  {
    id: "lonn-utvikling",
    title: "Lønn og utvikling",
    description: "Lønn, lønnsforventninger, ansvarstillegg, karriere, forfremmelse eller utviklingsmuligheter.",
    subtopics: ["Lønnsutvikling","Forventninger til lønn","Lønnsforskjeller","Nye oppgaver og ansvar","Utvikling og forfremmelse"]
  },
  {
    id: "samarbeid-kommunikasjon",
    title: "Samarbeid og kommunikasjon",
    description: "Kommunikasjon, tillit, roller, konflikt, teamarbeid, tone, respekt eller personlige grenser.",
    subtopics: ["Kommunikasjon","Tillit","Roller og forventninger","Uenighet og konflikt","Samspill i team","Grenser og respekt"]
  },
  {
    id: "avslutning-arbeidsforhold",
    title: "Avslutning av arbeidsforhold",
    description: "Oppsigelse, prøvetid, avslutning, nedbemanning eller formell videre prosess.",
    subtopics: ["Avslutning av arbeidsforhold","Prøvetid","Endringer i stilling eller behov","Tidligere oppfølging","Frivillig avslutning","Samtale før videre prosess"]
  },
  {
    id: "sikkerhet-ansvar",
    title: "Sikkerhet og ansvar",
    description: "Sikkerhetsrutiner, risiko, avvik, hendelser, rapportering eller informasjonssikkerhet.",
    subtopics: ["Sikkerhetsrutiner","Avvik og hendelser","Risikovurdering","Rapportering","Informasjonssikkerhet","Ansvar og læring etter hendelser","Vold og trusler"]
  },
  {
    id: "livssituasjoner",
    title: "Livssituasjoner",
    description: "Personlige belastninger, familie, sorg, omsorgsansvar, psykisk belastning eller utmattelse som påvirker arbeidshverdagen.",
    subtopics: ["Samlivs- og familieforhold","Sykdom i nær familie","Sorg og tap","Psykisk belastning","Omsorgsansvar","Belastning og utmattelse"]
  },
  {
    id: "mobbing-trakassering",
    title: "Mobbing og trakassering",
    description: "Mobbing, utestenging, trakassering, seksuell trakassering, uønsket seksuell oppmerksomhet eller varsling om slike forhold.",
    subtopics: ["Mobbing","Utestenging og utfrysing","Krenkende eller utilbørlig atferd","Seksuell trakassering","Kjønnstrakassering og uønsket seksuell oppmerksomhet","Varsling om mobbing eller trakassering","Samtale med den som sier ifra","Samtale med den varselet gjelder"]
  }
];

const topicIds = topicCatalog.map(topic => topic.id);
const allSubtopics = [...new Set(topicCatalog.flatMap(topic => topic.subtopics))];

export const topicClassificationSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    primary_topic_id: { type: "string", enum: topicIds },
    primary_subtopic: { type: "string", enum: allSubtopics },
    confidence: { type: "string", enum: ["high","medium","low"] },
    reason: { type: "string" },
    alternative_topic_ids: {
      type: "array",
      maxItems: 2,
      items: { type: "string", enum: topicIds }
    }
  },
  required: ["primary_topic_id","primary_subtopic","confidence","reason","alternative_topic_ids"]
};
