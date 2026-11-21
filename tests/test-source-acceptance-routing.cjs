// Akseptanse av den FAKTISKE kildekandidatrutingen for fem syntetiske cases.
// Ingen KI-tilgang: tester om relevante kilder faktisk tilbys modellen.
// En kilde-ID som bare finnes i registeret, er ikke tilstrekkelig.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const read = rel => JSON.parse(fs.readFileSync(path.join(root,rel),"utf8"));

(async () => {
  const { sourceTier } = await import("../src/server/help-library.js");
  const { createRelevantSourceSelector } = await import("../src/server/source-ranking.js");
  const { buildOccupationGuidanceContext } = await import("../src/server/occupation-context.js");
  const { getAgreementMap, shouldUseAgreementContext } = await import("../src/server/agreement-router.js");
  const { shouldRetainCuratedSources, isLegalSourceContext, joinSourceContext, employerScopedPrimaryLawBonus } = await import("../src/server/source-retention.js");

  const cases = read("tests/AI-SOURCE-ACCEPTANCE-CASES.json").cases;
  const sourceBank = read("data/SOURCEBANK.json");
  const occupationLegalSourceBank = read("data/OCCUPATION-LEGAL-SOURCES.json");
  // Samme konstruksjon som server.js, også med arbeidsgiverscope på avtaler.
  const agreementCuratedSources = (getAgreementMap().agreementAreas || [])
    .flatMap(area => (area.curatedSources || []).map(source => ({
      ...source,
      employerTypes: area.id === "state" ? ["state"]
        : area.id === "municipal" ? ["municipal"]
        : area.id === "health_enterprise" ? ["health_enterprise"] : [],
      agreementAreaId: area.id,
      sourceType: source.sourceRole || "collective_agreement"
    })));
  const selectRelevantSources = createRelevantSourceSelector({
    sourceBank,occupationLegalSourceBank,agreementCuratedSources,
    shouldUseAgreementContext,isLegalSourceContext,sourceTier,employerScopedPrimaryLawBonus
  });
  const run = (tc, situation) => {
    const topic = tc.topicId, subtopic = tc.subtopic;
    const args = {occupation:tc.occupation,sectorId:tc.sectorId,employerType:tc.employerType,topic,subtopic,situation};
    const ctx = buildOccupationGuidanceContext(args);
    const general = selectRelevantSources({relevant_topics:[topic]},situation,args);
    const prioritized = [];
    if(ctx.occupation?.occupationRelevant)prioritized.push(...(ctx.occupation.legalSources||[]));
    if(ctx.agreement?.relevant && !ctx.agreement?.needsEmployerType &&
       ["state","municipal","health_enterprise"].includes(tc.employerType)){
      for(const area of ctx.agreement.suggestions || [])prioritized.push(...(area.curatedSources||[]));
    }
    prioritized.push(...general);
    const seen = new Set();
    const merged = prioritized.filter(s=>s?.id && !seen.has(s.id) && seen.add(s.id)).slice(0,10);
    const retained = shouldRetainCuratedSources({
      requestedTopic:tc.topicId,resolvedTopic:topic,subtopic,situation,
      employerType:tc.employerType,occupationContext:ctx
    });
    return {retained,candidates:retained?merged:[],occupationRelevant:ctx.occupation?.occupationRelevant||false};
  };

  for(const tc of cases){
    for(const [stage,text] of [["første råd",tc.situation],["oppfølging",joinSourceContext(tc.situation,tc.question)]]){
      const result=run(tc,text);
      const ids=new Set(result.candidates.map(s=>s.id));
      if(tc.expectEvidence){
        assert(result.retained,tc.id+" "+stage+": kildebehov ble mistet før KI-kallet");
        assert(result.candidates.length>0,tc.id+" "+stage+": kildekandidatlisten er tom");
        assert(tc.preferredSourceIds.some(id=>ids.has(id)),
          tc.id+" "+stage+": ingen faglig forventet kilde tilbys modellen; fikk ["+[...ids].join(", ")+"]");
      }else{
        assert.equal(result.retained,false,
          tc.id+" "+stage+": ordinær arbeidsdeling skal ikke utløse kildebelastning");
        assert.deepEqual(result.candidates,[],
          tc.id+" "+stage+": kilder må holdes utenfor modellens råd når de ikke trengs");
      }
      for(const id of tc.forbidSourceIds){
        assert(!ids.has(id),tc.id+" "+stage+": feil sektor tilbys modellen: "+id);
      }
      // En kildeliste som blir lengre enn ti, er avskåret i reell serverkode.
      assert(result.candidates.length<=10,tc.id+" "+stage+": kandidattaket må overholdes");
      console.log(tc.id+" "+stage+": "+(result.retained?"kildevalg ["+[...ids].join(", ")+"]":"ingen kilder"));
    }
  }
  console.log("KILDE-AKSEPTANSE RUTING OK: 5 x 2 faktiske kildekandidatbaner, kilderelevans og sektorsperre; 0 KI-kall");
})().catch(error=>{console.error(error.stack||error);process.exitCode=1;});
