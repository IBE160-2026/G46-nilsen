const fs=require("fs");
const assert=require("assert");

(async()=>{
  const golden=JSON.parse(fs.readFileSync("tests/AI-GOLDEN-CASES.json","utf8"));
  const registry=JSON.parse(fs.readFileSync("data/OCCUPATION-LEGAL-SOURCES.json","utf8"));
  const occupationSourceIds=new Set((registry.sources||[]).map(s=>s.id));
  const router=await import("../src/server/occupation-router.js");

  const cases=(golden.cases||[]).filter(tc=>tc.golden_group==="occupation_sector");
  assert.strictEqual(cases.length,28,"Forventer 28 sektor-golden-caser");

  let positive=0;
  let negative=0;
  for(const tc of cases){
    const result=router.resolveOccupationContext({
      occupation:tc.occupation,
      sectorId:tc.sectorId,
      employerType:tc.employerType||"",
      topic:tc.theme,
      subtopic:tc.subtopic||"",
      situation:tc.input
    });

    assert.strictEqual(
      result.occupationRelevant,
      tc.occupation_relevant,
      `${tc.id}: feil occupationRelevant; forventet ${tc.occupation_relevant}, fikk ${result.occupationRelevant}`
    );

    const sourceIds=new Set(result.sourceIds||[]);

    if(tc.occupation_relevant){
      positive++;
      const must=(tc.expected_source_ids||[]).filter(id=>occupationSourceIds.has(id));
      const any=(tc.expected_source_ids_any||[]).filter(id=>occupationSourceIds.has(id));

      for(const id of must){
        assert(sourceIds.has(id),`${tc.id}: mangler forventet yrkes-/sektorkilde ${id}; fikk [${[...sourceIds].join(", ")}]`);
      }
      if(any.length){
        assert(any.some(id=>sourceIds.has(id)),`${tc.id}: mangler minst én av [${any.join(", ")}]; fikk [${[...sourceIds].join(", ")}]`);
      }
    }else{
      negative++;
      assert.deepStrictEqual(result.sourceIds,[],`${tc.id}: yrkesnøytral case skal ikke hente yrkeskilder; fikk [${(result.sourceIds||[]).join(", ")}]`);
    }

    for(const id of (tc.forbidden_source_ids||[]).filter(id=>occupationSourceIds.has(id))){
      assert(!sourceIds.has(id),`${tc.id}: forbudt yrkes-/sektorkilde lekket inn: ${id}`);
    }
  }

  console.log(`Yrkes-golden ruting OK: ${cases.length} caser · ${positive} relevante · ${negative} irrelevante · forventede/forbudte yrkeskilder kontrollert`);
})().catch(error=>{
  console.error(error);
  process.exit(1);
});
