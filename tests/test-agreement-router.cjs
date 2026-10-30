const fs=require("fs");
const assert=require("assert");

(async()=>{
  const cases=JSON.parse(fs.readFileSync("data/AGREEMENT-BENCHMARK-CASES.json","utf8"));
  const router=await import("../src/server/agreement-router.js");

  for(const tc of cases.cases || []){
    const result=router.suggestAgreementAreas({
      occupation:tc.occupation,
      employerContext:tc.employerContext,
      topic:tc.topic,
      subtopic:tc.subtopic,
      situation:tc.situation
    });

    assert.strictEqual(result.relevant,tc.agreementRelevant, `${tc.id}: feil relevans`);
    assert.strictEqual(result.confirmationRequired,tc.requireConfirmation, `${tc.id}: feil bekreftelseskrav`);

    const ids=result.suggestions.map(x=>x.id);
    for(const expected of tc.expectedAgreementAreas || []){
      assert(ids.includes(expected), `${tc.id}: mangler forslag ${expected}`);
    }
    if(!tc.agreementRelevant){
      assert.deepStrictEqual(ids,[], `${tc.id}: irrelevante saker skal ikke foreslå avtaleområde`);
    }
  }

  console.log(`Avtaleruter OK: ${cases.cases.length} saker`);
})().catch(err=>{console.error(err);process.exit(1);});
