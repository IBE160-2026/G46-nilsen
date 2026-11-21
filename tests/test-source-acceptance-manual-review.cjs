// Sjekk at manuelt faglig godkjenningsskjema ikke kan «rubber-stampes».
// Alle data er fiktive. Ingen KI, nettverk eller ekte personopplysninger.
const assert=require("node:assert/strict");
(async()=>{
  const {createManualSourceReview,evaluateManualSourceReview}=await import(
    "./support/source-acceptance-manual-review.mjs"
  );
  const tc={
    id:"SRC-MANUAL",
    manualMust:["Hør begge parter og dokumenter hendelsen","Bruk riktig rettskilde"],
    manualCritical:["Konkluderer med skyld uten faktagrunnlag","Påstår feil tariffdekning"]
  };
  const sourceUrl="https://www.arbeidstilsynet.no/tema/arbeidsmiljo/";
  const record={
    issues:[],
    guidance:{
      opening:"Arbeidstakeren har rett til dialog om dette.",
      legal_hr_note:"Etter arbeidsmiljøloven kan arbeidstaker kreve drøfting.",
      evidence_sources:[{id:"AT",url:sourceUrl,evidenceRole:"model_selected"}],
      legal_claim_review:{needsManualReview:true}
    },
    followup:{
      reply:"Arbeidstakeren har rett til tilrettelegging etter lovverket.",
      evidence_sources:[{id:"AT",url:sourceUrl,evidenceRole:"provider_url"}],
      legal_claim_review:{needsManualReview:true}
    }
  };
  const template=createManualSourceReview(tc,record);
  const judge=(r=template,run=record)=>evaluateManualSourceReview(tc,run,r);
  const clone=x=>structuredClone(x);
  const has=(result,part)=>assert(result.problems.some(x=>x.includes(part)),
    part+": "+JSON.stringify(result));
  assert.equal(template.caseId,tc.id);
  assert.equal(template.machineStatus,"MACHINE_CHECKED");
  assert.equal(template.must.length,tc.manualMust.length);
  assert.equal(template.critical.length,tc.manualCritical.length);
  assert.equal(judge().state,"PENDING_REVIEW",
    "Uutfylt rapport må aldri kunne bli godkjent");

  const ready=clone(template);
  ready.reviewer="kontrollør A";
  ready.reviewedAt="2026-11-21";
  ready.claimInventoryComplete=true;
  ready.must.forEach(x=>{x.status="met";x.reason="Kontrollert mot situasjonen og svarets faktiske formuleringer";});
  ready.critical.forEach(x=>{x.status="absent";x.reason="Undersøkt hele svarteksten, ingen kritisk feil funnet";});
  ready.finalNotes="Begge svar er vurdert mot rubrikken, og det faglige grunnlaget er dokumentert.";
  ready.claims=[{
    answerPart:"first",
    claimText:"Etter arbeidsmiljøloven kan arbeidstaker kreve drøfting.",
    sourceUrl,
    sourceExcerpt:"Dette er en fiktiv kildepassasje på mer enn tjue tegn for å prøve kontrollen.",
    sourceCheckedAt:"2026-11-21",periodVerified:true,employerScopeVerified:true,
    verdict:"supported",reason:"Det siterte avsnittet er manuelt vurdert opp mot akkurat denne påstanden."
  }];
  assert.equal(judge(ready).state,"REVIEWED_OK",
    "Kun fullt dokumentert og kildekontrollert vurdering kan oppnå reviewed-ok");
  const change=fn=>{const item=clone(ready);fn(item);return judge(item);};
  const empty=change(x=>{x.claims=[];});
  assert.equal(empty.state,"PENDING_REVIEW");
  has(empty,"Registrer hver konkret rettspåstand");

  const noEvidence=change(x=>{x.claims[0].sourceExcerpt="";});
  assert.equal(noEvidence.state,"PENDING_REVIEW");
  has(noEvidence,"oppgi konkret utdrag");

  const wrongPart=change(x=>{x.claims[0].answerPart="followup";});
  assert.equal(wrongPart.state,"PENDING_REVIEW");
  has(wrongPart,"nøyaktig utsagn");

  const newSource=change(x=>{x.claims[0].sourceUrl="https://example.com/annan";});
  assert.equal(newSource.state,"PENDING_REVIEW");
  has(newSource,"eksakt synlig kilde-URL");

  const unverifiedPeriod=change(x=>{x.claims[0].periodVerified=false;});
  assert.equal(unverifiedPeriod.state,"PENDING_REVIEW");
  has(unverifiedPeriod,"kontroller dokumentperiode");

  const unclear=change(x=>{x.claims[0].verdict="unclear";});
  assert.equal(unclear.state,"REJECTED");
  has(unclear,"originalkilden støtter ikke");

  const unsupported=change(x=>{x.claims[0].verdict="unsupported";});
  assert.equal(unsupported.state,"REJECTED");

  const critical=change(x=>{x.critical[0].status="present";});
  assert.equal(critical.state,"REJECTED");
  has(critical,"Kritisk faglig feil");

  const mandatory=change(x=>{x.must[0].status="not_met";});
  assert.equal(mandatory.state,"REJECTED");
  has(mandatory,"Obligatorisk fagkriterium");

  const blocked=judge(ready,{...record,issues:["Feil kildeproveniens"]});
  assert.equal(blocked.state,"REJECTED");
  has(blocked,"Maskinelle avvik");

  const tamper=change(x=>{x.must[0].criterion="Noe helt annet";});
  assert.equal(tamper.state,"PENDING_REVIEW");
  has(tamper,"Fagkriterier kan ikke endres");

  const noClaims=change(x=>{
    x.claims=[];x.noMaterialClaims=true;
  });
  assert.equal(noClaims.state,"PENDING_REVIEW");
  has(noClaims,"KI-varslet rettspåstander");

  const clearFalseAlarm=change(x=>{
    x.claims=[];x.noMaterialClaims=true;
    x.falsePositiveExplanation="Ingen av utsagnene er faktisk kategoriske juridiske påstander; det er formulert som åpne samtalespørsmål.";
  });
  assert.equal(clearFalseAlarm.state,"REVIEWED_OK",
    "Ved dokumentert manuell gjennomgang må falske positive signaler kunne avklares");

  const invalidTime=change(x=>{x.reviewedAt="2026-02-30";});
  assert.equal(invalidTime.state,"PENDING_REVIEW");
  has(invalidTime,"gyldig kontroll-dato");

  const incomplete=change(x=>{x.claimInventoryComplete=false;});
  assert.equal(incomplete.state,"PENDING_REVIEW");
  has(incomplete,"ALLE konkrete");

  const wrongId=change(x=>{x.caseId="SRC-NOT-OUR-CASE";});
  assert.equal(wrongId.state,"PENDING_REVIEW");
  has(wrongId,"Ugyldig skjema");

  assert.deepEqual(template,createManualSourceReview(tc,record),
    "Evalueringen får aldri mutere eller forhåndsgodkjenne en blank rapport");
  // Prøv også kommandolinje-kontrollen på fem falske, syntetiske saker.
  // Ingen faktisk kontrollør eller originalkilde er benyttet i testen.
  const fs=require("node:fs");
  const path=require("node:path");
  const os=require("node:os");
  const {spawnSync}=require("node:child_process");
  const root=path.resolve(__dirname,"..");
  const allCases=JSON.parse(fs.readFileSync(
    path.join(root,"tests/AI-SOURCE-ACCEPTANCE-CASES.json"),"utf8"
  )).cases;
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),"source-review-"));
  try {
    const createdAt="2026-11-21T01:01:01.000Z";
    const run={createdAt,cases:allCases.map(tc=>({...clone(record),id:tc.id,issues:[]}))};
    const reviewSet={
      schemaVersion:1,sourceRunCreatedAt:createdAt,caseCount:allCases.length,
      cases:allCases.map(tc=>createManualSourceReview(tc,run.cases.find(c=>c.id===tc.id)))
    };
    const runFile=path.join(temp,"run.json");
    const reviewFile=path.join(temp,"review.json");
    const script=path.join(root,"tests/check-source-acceptance-review.mjs");
    const write=()=>{fs.writeFileSync(runFile,JSON.stringify(run));fs.writeFileSync(reviewFile,JSON.stringify(reviewSet));};
    const invoke=()=>spawnSync(process.execPath,[script,runFile,reviewFile],{encoding:"utf8"});
    write();
    let proc=invoke();
    assert.equal(proc.status,1,
      "Ikke utfylt rapport må returnere exit 1 selv når automatiske kildetester var grønne");
    assert.match(proc.stdout,/PENDING_REVIEW/);

    for(const form of reviewSet.cases) {
      form.reviewer="syntetisk-kontrollør";
      form.reviewedAt="2026-11-21";
      form.claimInventoryComplete=true;
      form.noMaterialClaims=true;
      form.falsePositiveExplanation="Dette er en syntetisk CLI-test; faglig kontroll er ikke utført og data er fiktive.";
      form.finalNotes="Dette er en syntetisk enhetstest av fullstendighetskontrakten, ikke virkelig kvalitetssikring.";
      for(const item of form.must) {
        item.status="met";item.reason="Syntetisk bekreftelse brukt kun for å teste formelle krav";
      }
      for(const item of form.critical) {
        item.status="absent";item.reason="Syntetisk bekreftelse brukt kun for å teste formelle krav";
      }
    }
    write();proc=invoke();
    assert.equal(proc.status,0,
      "Komplett syntetisk skjema må bestå formell vurdering: "+proc.stderr+" "+proc.stdout);
    assert.match(proc.stdout,/5\/5 faglig dokumenterte/);

    reviewSet.sourceRunCreatedAt="2026-11-22T01:01:01.000Z";
    write();proc=invoke();
    assert.equal(proc.status,2,"Et skjema fra feil testkjøring kan ikke godkjennes");
    assert.match(proc.stderr,/samme testkjøring/);
  } finally {
    fs.rmSync(temp,{recursive:true,force:true});
  }

  console.log("MANUELL KILDEAKSEPTANSE OK: krav, belegg, periode, kilde per svar, kritiske feil, uavklart og falsk positiv – 0 KI-kall");
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
