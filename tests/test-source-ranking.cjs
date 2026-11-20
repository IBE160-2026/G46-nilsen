const assert = require("node:assert/strict");
(async()=>{
  const { sourceTier } = await import("../src/server/help-library.js");
  const { createRelevantSourceSelector } = await import("../src/server/source-ranking.js");
  const sources = [
    {id:"BASE_LAW",title:"Arbeidsrettslig lov",sourceRole:"primary_regulation",topics:["fravaer-oppfolging"]},
    {id:"RESEARCH",title:"Empirisk studie",type:"forskning",topics:["fravaer-oppfolging"],authority:"high"},
    {id:"HEALTH",title:"Sykepleierveileder",sourceRole:"specialist_guidance",topics:["fravaer-oppfolging"],occupations:["sykepleier"]},
    {id:"NURSE_OTHER",title:"Privat sykepleier",topics:["fravaer-oppfolging"],occupations:["sykepleier"],employerTypes:["private"]},
    {id:"SECTOR",title:"Helsespesifikk kilde",topics:["fravaer-oppfolging"],sectors:["health"]},
    {id:"DUP",title:"Første variant",topics:["fravaer-oppfolging"]},
    {id:"DUP",title:"Andre variant",topics:["fravaer-oppfolging"]},
    {id:"IRRELEVANT",title:"Urelatert",topics:["sikkerhet-ansvar"]}
  ];
  const glob = [
    {id:"STATE_LAW",title:"Statlig kilde",sourceRole:"primary_regulation",topics:["fravaer-oppfolging"],sectors:["*"],employerTypes:["state"]}
  ];
  const agreement = [
    {id:"STATE_AGREEMENT",title:"Statlig HTA",sourceRole:"collective_agreement",employerTypes:["state"],topics:["fravaer-oppfolging"]},
    {id:"STATE_PERSONNEL_HANDBOOK",title:"Håndbok",sourceRole:"official_employer_reference",topics:["fravaer-oppfolging"],employerTypes:["state"]},
    {id:"PRIVATE_AGREEMENT",title:"Privat HTA",sourceRole:"collective_agreement",employerTypes:["private"],topics:["fravaer-oppfolging"]}
  ];
  const select=createRelevantSourceSelector({
    sourceBank:{sources},
    occupationLegalSourceBank:{sources:glob},
    agreementCuratedSources:agreement,
    shouldUseAgreementContext:({situation})=>situation.includes("lønn"),
    isLegalSourceContext:q=>q.includes("oppsigelse"),
    sourceTier,
    employerScopedPrimaryLawBonus:(source,employerType)=>
      source.id==="STATE_LAW"&&employerType==="state"?10:0
  });
  const initial=select({relevant_topics:["fravaer-oppfolging"]},"Samtale om oppmøte",{
    employerType:"state",sectorId:"health",occupation:"sykepleier"
  });
  assert.ok(initial.some(x=>x.id==="BASE_LAW"));
  assert.ok(initial.some(x=>x.id==="STATE_LAW"));
  assert.ok(initial.some(x=>x.id==="HEALTH"));
  assert.ok(initial.some(x=>x.id==="SECTOR"));
  assert.equal(initial.filter(x=>x.id==="DUP").length,1);
  assert.equal(initial.find(x=>x.id==="DUP").title,"Første variant");
  assert.ok(!initial.some(x=>x.id==="STATE_AGREEMENT"),"Tariff ikke relevant uten tariffsignal");
  assert.ok(!initial.some(x=>x.id==="STATE_PERSONNEL_HANDBOOK"),"Håndbok krever juridisk kontekst");
  assert.ok(!initial.some(x=>x.id==="PRIVATE_AGREEMENT"||x.id==="NURSE_OTHER"||x.id==="IRRELEVANT"));
  assert.equal(initial[0].id,"STATE_LAW","Statlig primærlov skal prioriteres i relevant kontekst");
  const law=select({relevant_topics:["fravaer-oppfolging"]},"Uenighet om oppsigelse og lønn",{
    employerType:"state",sectorId:"health",occupation:"sykepleier"
  });
  assert.ok(law.some(x=>x.id==="STATE_AGREEMENT"));
  assert.ok(law.some(x=>x.id==="STATE_PERSONNEL_HANDBOOK"));
  assert.ok(!law.some(x=>x.id==="PRIVATE_AGREEMENT"));
  const unscoped=select({relevant_topics:["fravaer-oppfolging"]},"Samtale om oppmøte",{
    employerType:"private",sectorId:"",occupation:""
  });
  assert.ok(!unscoped.some(x=>["STATE_LAW","HEALTH","SECTOR","STATE_AGREEMENT"].includes(x.id)));
  const alone=select({},"Urelatert situasjon",{});
  assert.deepEqual(alone,[],"Urelevante kilder skal ikke inkluderes bare på grunn av fritekst");
  assert.ok(law.length<=10);
  assert.ok(initial.every(x=>typeof x.sourceTier==="string"));
  console.log("Kilderangering: krav, arbeidsgivertype, sektor, yrke, tariff, juridisk kontekst og deduplisering OK");
})().catch(err=>{console.error(err);process.exitCode=1});
