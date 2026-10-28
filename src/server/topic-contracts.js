// --- v19.10: KI-basert temaforståelse ---
export const topicCatalog = [
  {
    id: "alkohol-rus",
    title: "Alkohol og rus",
    description: "Bekymring for alkohol eller andre rusmidler, påvirkning på jobb, endret fungering, sikkerhetsrisiko eller videre oppfølging.",
    subtopics: ["Alkoholbruk","Andre rusmidler","Påvirket på jobb","Fungering på jobb","Rus og sikkerhet","Videre oppfølging"]
  },
  {
    id: "fravaer-oppfolging",
    title: "Fravær og oppfølging",
    description: "Kort- eller langtidsfravær, oppmøte, planlagt fravær, tilbakekomst eller tilrettelegging med fokus på arbeidssituasjonen.",
    subtopics: ["Korttidsfravær","Langtidsfravær","Oppmøte og punktlighet","Planlagt fravær","Tilbake i jobb","Tilrettelegging"]
  },
  {
    id: "prestasjon-utvikling",
    title: "Prestasjon og utvikling",
    description: "Måloppnåelse, engasjement, kvalitet, arbeidsutførelse, kompetanse, ansvar eller initiativ.",
    subtopics: ["Måloppnåelse","Engasjement","Kvalitet","Arbeidsutførelse","Kompetanse","Ansvar og initiativ"]
  },
  {
    id: "lonn-utvikling",
    title: "Lønn og utvikling",
    description: "Lønnsutvikling, lønnskrav, lønnsforskjeller eller forfremmelse og videre utvikling.",
    subtopics: ["Lønnsutvikling","Lønnskrav","Lønnsforskjeller","Forfremmelse"]
  },
  {
    id: "samarbeid-kommunikasjon",
    title: "Samarbeid og kommunikasjon",
    description: "Samarbeidsutfordringer, konflikt med kollega eller leder, tillitsbrudd eller uklarhet om roller og forventninger.",
    subtopics: ["Samarbeidsutfordringer","Konflikt med kollega","Konflikt med leder","Tillitsbrudd","Roller og forventninger"]
  },
  {
    id: "avslutning-arbeidsforhold",
    title: "Oppsigelse og avslutning av arbeidsforhold",
    description: "Mulig oppsigelse, prøvetid, endret stilling eller bemanningsbehov, manglende bedring etter tidligere oppfølging, frivillig avslutning, advarsel eller annen formell oppfølging.",
    subtopics: ["Mulig oppsigelse","Prøvetid","Endret stilling","Manglende bedring","Ønske om å slutte","Advarsel og oppfølging"]
  },
  {
    id: "sikkerhet-ansvar",
    title: "Sikkerhet og ansvar",
    description: "Sikkerhetsrutiner, sikkerhetshendelser og avvik, informasjonssikkerhet eller vold og trusler. Risiko, rapportering og læring håndteres i de relevante undertemaene.",
    subtopics: ["Sikkerhetsrutiner","Sikkerhetshendelser","Informasjonssikkerhet","Vold og trusler"]
  },
  {
    id: "livssituasjoner",
    title: "Livssituasjoner",
    description: "Samliv og familie, sorg og tap, omsorgsansvar, psykisk belastning eller utmattelse som påvirker arbeidshverdagen.",
    subtopics: ["Samliv og familie","Sorg og tap","Omsorgsansvar","Psykisk belastning","Utmattelse"]
  },
  {
    id: "mobbing-trakassering",
    title: "Mobbing og trakassering",
    description: "Mobbing, utestenging, uønsket adferd, seksuell trakassering, diskriminering eller varsling om slike forhold.",
    subtopics: ["Mobbing","Utestenging","Uønsket adferd","Seksuell trakassering","Diskriminering","Varslingssak"]
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
