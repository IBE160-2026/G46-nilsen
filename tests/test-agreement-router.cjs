const fs=require("fs");
const assert=require("assert");

(async()=>{
  const cases=JSON.parse(fs.readFileSync("data/AGREEMENT-BENCHMARK-CASES.json","utf8"));
  const router=await import("../src/server/agreement-router.js");

  const irrelevant=router.suggestAgreementAreas({
    occupation:"sykepleier",
    topic:"Livssituasjoner",
    subtopic:"Samlivsbrudd",
    situation:"En medarbeider står i et samlivsbrudd."
  });
  assert.strictEqual(irrelevant.relevant,false);
  assert.strictEqual(irrelevant.needsEmployerType,false);
  assert.deepStrictEqual(irrelevant.suggestions,[]);

  const relevantMissingEmployer=router.suggestAgreementAreas({
    occupation:"sykepleier",
    topic:"Lønn og utvikling",
    subtopic:"Lønnsutvikling",
    situation:"Medarbeideren ønsker å snakke om lønn."
  });
  assert.strictEqual(relevantMissingEmployer.relevant,true);
  assert.strictEqual(relevantMissingEmployer.needsEmployerType,true);
  assert.deepStrictEqual(relevantMissingEmployer.suggestions,[]);
  assert(relevantMissingEmployer.employerTypeOptions.some(x=>x.id==="private"));
  assert(relevantMissingEmployer.employerTypeOptions.some(x=>x.id==="municipal"));
  assert(relevantMissingEmployer.employerTypeOptions.some(x=>x.id==="state"));
  assert(relevantMissingEmployer.employerTypeOptions.some(x=>x.id==="health_enterprise"));

  const municipal=router.suggestAgreementAreas({
    occupation:"sykepleier",
    employerType:"municipal",
    topic:"Lønn og utvikling",
    subtopic:"Lønnsutvikling",
    situation:"Medarbeideren ønsker å snakke om lønn."
  });
  assert.strictEqual(municipal.needsEmployerType,false);
  assert(municipal.suggestions.some(x=>x.id==="municipal"));
  const municipalArea=municipal.suggestions.find(x=>x.id==="municipal");
  assert(municipalArea.curatedSources.some(x=>x.id==="KS_HTA_2026_2028"), "KS HTA 2026-2028 mangler");
  assert(municipalArea.curatedSources.some(x=>x.id==="KS_HA_2026_2029"), "KS Hovedavtale 2026-2029 mangler");
  assert.strictEqual(municipal.confirmationRequired,true);

  const healthEnterprise=router.suggestAgreementAreas({
    occupation:"sykepleier",
    employerType:"health_enterprise",
    topic:"Lønn og utvikling",
    subtopic:"Lønnsutvikling",
    situation:"Medarbeideren ønsker å snakke om lønn."
  });
  assert(healthEnterprise.suggestions.some(x=>x.id==="health_enterprise"));
  const healthArea=healthEnterprise.suggestions.find(x=>x.id==="health_enterprise");
  assert(healthArea.curatedSources.some(x=>x.id==="SPEKTER_HEALTH_NEGOTIATION_2026_2029"), "Spekter helseforetakskilde mangler");

  const state=router.suggestAgreementAreas({
    occupation:"rådgiver",
    employerType:"state",
    topic:"Lønn og utvikling",
    subtopic:"Lønnsutvikling"
  });
  assert(state.suggestions.some(x=>x.id==="state"));
  const stateArea=state.suggestions.find(x=>x.id==="state");
  assert(stateArea.curatedSources.some(x=>x.id==="STATE_HTA_2026_2028"), "Statlig HTA 2026-2028 mangler i avtalekartet");
  assert(stateArea.curatedSources.some(x=>x.id==="STATE_HA_2023_2026"), "Hovedavtalen i staten mangler i avtalekartet");
  assert(stateArea.curatedSources.some(x=>x.id==="STATE_PERSONNEL_HANDBOOK"), "Statens personalhåndbok mangler i avtalekartet");

  const unknown=router.suggestAgreementAreas({
    occupation:"elektriker",
    employerType:"unknown",
    topic:"Prestasjon og utvikling",
    subtopic:"Arbeidstid",
    situation:"Arbeidstid og overtid er tema."
  });
  assert.strictEqual(unknown.relevant,true);
  assert.strictEqual(unknown.unresolved,true);
  assert.deepStrictEqual(unknown.suggestions,[]);

  const incidentalDuty=router.suggestAgreementAreas({
    occupation:"sykepleier",
    topic:"Sikkerhet og ansvar",
    subtopic:"Påvirket på jobb",
    situation:"Sykepleieren virker påvirket under vakt med pasientansvar."
  });
  assert.strictEqual(incidentalDuty.relevant,false, "Vanlig omtale av å være under vakt skal ikke utløse tariffspørsmål");
  assert.strictEqual(incidentalDuty.needsEmployerType,false);

  const dutyArrangement=router.suggestAgreementAreas({
    occupation:"sykepleier",
    topic:"Prestasjon og utvikling",
    subtopic:"Arbeidstid",
    situation:"Medarbeideren vil diskutere vaktplan og vakttillegg."
  });
  assert.strictEqual(dutyArrangement.relevant,true, "Vaktplan/vakttillegg skal fortsatt være avtale-relevant");
  assert.strictEqual(dutyArrangement.needsEmployerType,true);

  console.log("Avtaleruter OK: oppfølgingsspørsmål om arbeidsgivertype brukes bare når relevant");
})().catch(err=>{console.error(err);process.exit(1);});
