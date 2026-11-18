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
  console.log("Hjelp-kildebank: nivåer, kategorier, felleskilder, dubletter, sektorkilder og DOI OK");
})().catch(err=>{console.error(err);process.exitCode=1});
