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
    periodEvidence:"Kilden er manuelt kontrollert mot den aktuelle lovperioden for hendelsen.",
    scopeEvidence:"Virksomhetens juridiske virkeområde er kontrollert opp mot den navngitte bestemmelsen.",
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
  has(unverifiedPeriod,"dokumenter konkret avtale-/lovperiode");

  const noPeriodDetails=change(x=>{x.claims[0].periodEvidence="";});
  assert.equal(noPeriodDetails.state,"PENDING_REVIEW");
  has(noPeriodDetails,"dokumenter konkret avtale-/lovperiode");
  const noScopeDetails=change(x=>{x.claims[0].scopeEvidence="";});
  assert.equal(noScopeDetails.state,"PENDING_REVIEW");
  has(noScopeDetails,"dokumenter konkret arbeidsgiver-/tariffdekning");

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


  // Historisk ekte KI-run ble laget FØR nye menneskelige kriterier for
  // veterinær-/kontorcase. Migrasjon skal bevare gamle vurderinger,
  // etterspørre nye vurderinger og aldri endre originalfilen.
  const sourceCases=JSON.parse(fs.readFileSync(
    path.join(root,"tests/AI-SOURCE-ACCEPTANCE-CASES.json"),"utf8"
  )).cases;
  const tempSync=fs.mkdtempSync(path.join(os.tmpdir(),"source-review-sync-"));
  try {
    const runDate="2026-11-25T13:47:13.670Z";
    const oldCases=sourceCases.map(tc=>({
      ...tc,
      manualMust:["SRC-C-VETERINAER","SRC-E-ORDINAER"].includes(tc.id)
        ? tc.manualMust.slice(0,-1) : tc.manualMust
    }));
    const run={createdAt:runDate,cases:oldCases.map(tc=>({
      id:tc.id,manualMust:tc.manualMust,manualCritical:tc.manualCritical,issues:[]
    }))};
    const originalReview={
      schemaVersion:1,sourceRunCreatedAt:runDate,caseCount:sourceCases.length,
      cases:oldCases.map(tc=>createManualSourceReview(tc,run.cases.find(item=>item.id===tc.id)))
    };
    originalReview.cases[0].must[0].status="met";
    originalReview.cases[0].must[0].reason="Eksisterende vurdering skal ikke forsvinne ved synkronisering.";
    const runFile=path.join(tempSync,"run.json");
    const reviewFile=path.join(tempSync,"manual-review.json");
    const preparedFile=path.join(tempSync,"manual-review-aligned.json");
    fs.writeFileSync(runFile,JSON.stringify(run),"utf8");
    const originalText=JSON.stringify(originalReview);
    fs.writeFileSync(reviewFile,originalText,"utf8");
    const prepare=()=>spawnSync(process.execPath,[
      path.join(root,"scripts/prepare-source-review.mjs"),runFile,reviewFile
    ],{encoding:"utf8"});
    let prep=prepare();
    assert.equal(prep.status,0,"Forberedelse av gammelt skjema feilet: "+prep.stderr);
    assert(fs.existsSync(preparedFile),"Forberedt vurderingsskjema mangler");
    assert.equal(fs.readFileSync(reviewFile,"utf8"),originalText,
      "Original manuell vurdering maa vaere uendret");
    const aligned=JSON.parse(fs.readFileSync(preparedFile,"utf8"));
    for(const caseId of ["SRC-C-VETERINAER","SRC-E-ORDINAER"]){
      const item=aligned.cases.find(c=>c.caseId===caseId);
      assert.equal(item.must.length,4,"Nytt fagkriterium maa legges til "+caseId);
      assert.equal(item.must[3].status,"pending","Nytt fagkriterium maa ikke forhåndsgodkjennes");
      assert.equal(item.must[3].reason,"");
    }
    assert.equal(aligned.cases[0].must[0].status,"met",
      "Eksisterende kontrollstatus maa bevares");
    assert.equal(aligned.cases[0].must[0].reason,originalReview.cases[0].must[0].reason);
    const pendingCheck=spawnSync(process.execPath,[
      path.join(root,"tests/check-source-acceptance-review.mjs"),runFile,preparedFile
    ],{encoding:"utf8"});
    assert.equal(pendingCheck.status,1,"Synkronisert, uferdig fil maa fremdeles vaere PENDING");
    assert.match(pendingCheck.stdout,/0\/5 faglig dokumenterte/);
    prep=prepare();
    assert.notEqual(prep.status,0,"Forberedelse maa ikke overskrive tidligere generert vurdering");
    // Det historiske rapportkravet maa aldri kunne fjernes eller omrokkeres.
    const invalid=structuredClone(run);
    invalid.cases.find(c=>c.id==="SRC-C-VETERINAER").manualMust[0]="Ukjent nytt krav";
    fs.writeFileSync(runFile,JSON.stringify(invalid),"utf8");
    fs.rmSync(preparedFile);
    prep=prepare();
    assert.notEqual(prep.status,0,"Historisk rapport med endrede kriterier maa avvises");
  } finally {
    fs.rmSync(tempSync,{recursive:true,force:true});
  }

  // Registrer dokumenterte feil fra 25.11.2026 som NOT_MET, men uten
  // å røre originalen eller forhåndsgodkjenne kildekrav.
  const findingsDir=fs.mkdtempSync(path.join(os.tmpdir(),"source-findings-"));
  try{
    const cases=JSON.parse(fs.readFileSync(path.join(root,"tests/AI-SOURCE-ACCEPTANCE-CASES.json"),"utf8")).cases;
    const date="2026-11-25T13:47:13.670Z";
    const syntheticRun={createdAt:date,cases:cases.map(x=>({
      id:x.id,guidance:{opening:x.id==="SRC-C-VETERINAER"?"Takk for at dere møter.":"",
        reactions:x.id==="SRC-E-ORDINAER"?[{leader_response:"Før jeg bestemmer vil jeg høre dere."}]:[]},
      followup:{reply:""},issues:[]
    }))};
    const aligned={
      schemaVersion:1,sourceRunCreatedAt:date,caseCount:5,
      cases:cases.map(tc=>createManualSourceReview(tc,syntheticRun.cases.find(x=>x.id===tc.id)))
    };
    const runFile=path.join(findingsDir,"run.json");
    const reviewFile=path.join(findingsDir,"manual-review-aligned.json");
    const outFile=path.join(findingsDir,"manual-review-aligned-findings.json");
    fs.writeFileSync(runFile,JSON.stringify(syntheticRun));
    const before=JSON.stringify(aligned,null,2);
    fs.writeFileSync(reviewFile,before);
    const tool=path.join(root,"scripts/record-source-review-findings.mjs");
    const p=spawnSync(process.execPath,[tool,runFile,reviewFile],{encoding:"utf8"});
    assert.equal(p.status,0,"Fagavvikskladd feilet: "+p.stderr);
    assert.equal(fs.readFileSync(reviewFile,"utf8"),before,
      "Opprinnelig aligned-skjema må ikke endres");
    const after=JSON.parse(fs.readFileSync(outFile,"utf8"));
    for(const id of ["SRC-C-VETERINAER","SRC-E-ORDINAER"]){
      const record=after.cases.find(x=>x.caseId===id);
      assert.equal(record.must[3].status,"not_met","Faktisk observert feil må markeres");
      assert(record.must[3].reason.length>=15);
      assert.equal(record.claimInventoryComplete,false,"Kildekontroll må ikke auto-godkjennes");
      assert.equal(record.reviewer,"","Kontrollør skal ikke forfalskes");
    }
    assert.equal(after.cases.find(x=>x.caseId==="SRC-A-UTESTENGING").must[0].status,"pending");
    assert.equal(spawnSync(process.execPath,[tool,runFile,reviewFile],{encoding:"utf8"}).status===0,false,
      "Fagavviksverktøy må nekte å overskrive ferdig utfil");
  }finally{
    fs.rmSync(findingsDir,{recursive:true,force:true});
  }

  console.log("MANUELL KILDEAKSEPTANSE OK: krav, belegg, periode, kilde per svar, kritiske feil, uavklart og falsk positiv – 0 KI-kall");
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
