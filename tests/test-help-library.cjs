const assert = require("node:assert/strict");
(async()=>{
  const { sourceTier, buildHelpSourceLibrary } = await import("../src/server/help-library.js");
  assert.equal(sourceTier({sourceRole:"primary_regulation"}),"primary_law");
  assert.equal(sourceTier({sourceRole:"collective_agreement"}),"collective_agreement");
  assert.equal(sourceTier({type:"fagfellevurdert forskning"}),"research_evidence");
  assert.equal(sourceTier({sourceRole:"authority_index"}),"authority_index");
  assert.equal(sourceTier({sourceRole:"official_employer_reference"}),"official_employer_reference");
  assert.equal(sourceTier({sourceRole:"professional_framework"}),"professional_framework");
  const data = buildHelpSourceLibrary({
    sourceBank: {sources: [
      {id:"LAW",title:"Lov",url:"https://example.org/law",sourceRole:"primary_regulation"},
      {id:"STUDY",title:"Forskning",url:"https://example.org/study",type:"fagfellevurdert forskning"},
      {id:"METHOD",title:"Metode",url:"https://example.org/method",sourceRole:"professional_framework"},
      {id:"EMPTY",title:"Uten URL",url:""}
    ]},
    occupationLegalSourceBank: {sources: [
      {id:"LAW",title:"Dublett",url:"https://example.org/law",sourceRole:"primary_regulation",sectors:["*"]},
      {id:"GLOBAL",title:"Felles myndighet",url:"https://example.org/global",sourceRole:"primary_regulation",sectors:["*"]},
      {id:"NURSE",title:"Sykepleierlov",url:"https://example.org/nurse",sourceRole:"primary_regulation",sectors:["health"]},
      {id:"NOGROUP",title:"Annet",url:"https://example.org/other",sectors:["other"]},
      {id:"DOI",title:"DOI-rapport",doi:"10.1000/a1",type:"forskning",sectors:["health"]}
    ]},
    agreementCuratedSources: [{id:"AGREE",title:"Avtale",url:"https://example.org/agree",sourceRole:"collective_agreement"}],
    occupationSourceMap: {sectors:[
      {id:"health",label:"Helse",occupations:["sykepleier"]},
      {id:"other",label:"Øvrige",occupations:[]}
    ]}
  });
  assert.deepEqual(Object.keys(data.categories),["rules","research","frameworks","occupations"]);
  const rules=data.categories.rules.groups[0].sources;
  assert.deepEqual(rules.map(x=>x.id),["LAW","GLOBAL","AGREE"]);
  assert.equal(data.categories.research.groups[0].sources[0].id,"STUDY");
  assert.equal(data.categories.frameworks.groups[0].sources[0].id,"METHOD");
  const occupations=data.categories.occupations.groups;
  assert.equal(occupations.length,1);
  assert.equal(occupations[0].id,"health");
  assert.equal(occupations[0].sources.length,2);
  assert.equal(occupations[0].sources[1].url,"https://doi.org/10.1000/a1");
  assert.deepEqual(data.categories.rules.groups[0].sources.find(x=>x.id==="GLOBAL").occupations,[]);
  const blank=buildHelpSourceLibrary({
    sourceBank:{sources:[]},occupationLegalSourceBank:{sources:[]},
    agreementCuratedSources:[],occupationSourceMap:{sectors:[]}
  });
  assert.deepEqual(blank.categories.occupations.groups,[]);
  const quickRefs=buildHelpSourceLibrary({
    sourceBank:{sources:[
      {id:"NAV_SYKEFRAVAER_OPPFOLGING",title:"NAV",url:"https://www.nav.no/arbeidsgiver/oppfolging-sykmeldte"},
      {id:"AT_PERSONALSAKER",title:"Personalsaker",url:"https://www.arbeidstilsynet.no/arbeidsmiljo/organisatorisk-arbeidsmiljo/personalsaker/"},
      {id:"DFO_PERSONALSAKER_FORBEREDELSE_2026",title:"Statlig personalsak",url:"https://arbeidsgiver.dfo.no/personaloppfolging/personalsaker/personalsaker-prosess/forberedelse-til-mote"},
      {id:"STAMI_PSYKOSOSIALT_ARBEIDSMILJO_2026",title:"STAMI",url:"https://stami.no/tema/psykososialt-arbeidsmiljo/"}
    ]},
    occupationLegalSourceBank:{sources:[
      {id:"LOVDATA_AML",url:"https://lovdata.no/NL/lov/2005-06-17-62",sectors:["*"]},
      {id:"AT_EMPLOYER_DUTIES",url:"https://www.arbeidstilsynet.no/hms/roller-i-hms-arbeidet/arbeidsgiver/",sectors:["*"]},
      {id:"DATATILSYNET_WORKPLACE_PRIVACY",url:"https://www.datatilsynet.no/personvern-pa-ulike-omrader/personvern-pa-arbeidsplassen/",sectors:["*"]},
      {id:"AKAN_MODEL",url:"https://www.akan.no/akan-modellen/forebyggende-arbeid-og-tiltak-etter-akan-modellen",sectors:["*"]}
    ]},
    agreementCuratedSources:[],occupationSourceMap:{sectors:[]}
  }).leaderQuickReferences;
  assert.deepEqual(quickRefs.map(x=>x.id),[
    "LOVDATA_AML","AT_EMPLOYER_DUTIES","NAV_SYKEFRAVAER_OPPFOLGING",
    "AT_PERSONALSAKER","DATATILSYNET_WORKPLACE_PRIVACY","AKAN_MODEL",
    "DFO_PERSONALSAKER_FORBEREDELSE_2026","STAMI_PSYKOSOSIALT_ARBEIDSMILJO_2026"
  ],"Hurtigoppslag må ha stabile, kuraterte referanser i prioritert rekkefølge");
  assert.equal(quickRefs.find(x=>x.id==="AKAN_MODEL").category,"Faglig veiledning – ikke lov");
  assert.equal(quickRefs.find(x=>x.id==="LOVDATA_AML").category,"Lovverk");
  assert.equal(quickRefs.find(x=>x.id==="STAMI_PSYKOSOSIALT_ARBEIDSMILJO_2026").category,"Forskning – ikke lov");
  assert.deepEqual(blank.leaderQuickReferences,[],"Hurtigoppslag må aldri finne på lenker ved manglende kildebank");
  const html=require("node:fs").readFileSync("index.html","utf8");
  const ui=require("node:fs").readFileSync("app.js","utf8");
  assert(html.indexOf('id="leader-reference-title"')<html.indexOf('id="complete-source-library"'),"Lederoppslag må komme øverst");
  assert(ui.includes("payload.leaderQuickReferences") && ui.includes("escapeHtml(item.description)"),"Hurtigoppslag må komme fra API og escape HTML");
  console.log("Hjelp-kildebank: nivåer, kategorier, felleskilder, dubletter, sektorkilder og DOI OK");
})().catch(err=>{console.error(err);process.exitCode=1});
