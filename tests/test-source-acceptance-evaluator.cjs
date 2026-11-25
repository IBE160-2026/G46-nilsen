// Kvalitetsregresjon av SELVE akseptanseevaluatoren – 0 KI-kall og nettverk.
// En betalt KI-test skal ikke godkjennes fordi kontrollkoden overser en
// skjult kilde, feil opptelling eller usann påstand om faktasjekk.
const assert=require("node:assert/strict");

(async()=>{
  const {evaluateSourceAcceptanceCase}=await import("./support/source-acceptance-evaluator.mjs");
  const id="AML_4_3_PSYKOSOSIALT";
  const source={id,title:"Arbeidsmiljøloven",url:"https://lovdata.no/lov/2005-06-17-62",
    evidenceRole:"model_selected"};
  const provenance={
    webSearchPerformed:false,providerUrlCount:0,selectedCuratedSourceCount:1,
    scopeReferenceCount:0,visibleEvidenceCount:1,contentVerified:false
  };
  const legalClaimReview={
    needsManualReview:false,possibleLegalClaimCount:0,claimToSourceChecked:false
  };
  const tc={id:"SRC-A-UTESTENGING",expectEvidence:true,
    preferredSourceIds:[id],forbidSourceIds:["STATE_EMPLOYEE_ACT"]};
  const guidance={
    opening:"Jeg vil høre hvordan dette oppleves.",questions:["Hva skjedde?","Hva trenger du?"],
    source_ids:[id],evidence_sources:[source],
    source_provenance:provenance,legal_claim_review:legalClaimReview
  };
  const followup={
    reply:"Undersøk og dokumenter faktum først.",evidence_sources:[source],
    source_provenance:provenance,legal_claim_review:legalClaimReview
  };
  const judge=(g=guidance,f=followup,t=tc)=>evaluateSourceAcceptanceCase(t,g,f);
  const clone=value=>structuredClone(value);
  const needs=(issues,text,label=text)=>{
    assert(issues.some(issue=>issue.includes(text)),label+": "+JSON.stringify(issues));
  };
  assert.deepEqual(judge(),[],"En reell korrekt kontrollkontrakt må passere");

  const mismatched=clone(guidance);
  mismatched.source_provenance.selectedCuratedSourceCount=4;
  needs(judge(mismatched),"KI-valgt kildetall","AI-selected count mismatch");

  const wrongScope=clone(guidance);
  wrongScope.source_provenance.scopeReferenceCount=1;
  needs(judge(wrongScope),"automatisk lovreferanse","scope reference mismatch");

  const wrongVisible=clone(guidance);
  wrongVisible.source_provenance.visibleEvidenceCount=2;
  needs(judge(wrongVisible),"synlig kildetall","visible count mismatch");

  const forgedVerified=clone(guidance);
  forgedVerified.source_provenance.contentVerified=true;
  needs(judge(forgedVerified),"proveniens er mangelfull","no URL can prove content verification");

  const omitted=clone(guidance);
  omitted.source_ids=[id,"STATE_EMPLOYEE_ACT"];
  needs(judge(omitted),"ikke vises","selected ID must be visible");
  needs(judge(omitted),"Forbudt/utenfor-sektor","hidden forbidden ID");

  const removed=clone(guidance);
  removed.source_ids=[];
  removed.evidence_sources=[];
  removed.source_provenance={...provenance,visibleEvidenceCount:0,selectedCuratedSourceCount:0};
  needs(judge(removed),"Kildekrevende situasjon","critical case cannot pass with empty evidence");
  // Ingen foretrukket kilde skal telle som brukt bare fordi den lå i en
  // usynlig model source_ids-liste; heller ikke i neste svar.
  const removedFollowup=clone(followup);
  removedFollowup.evidence_sources=[];
  removedFollowup.source_provenance={...provenance,visibleEvidenceCount:0,selectedCuratedSourceCount:0};
  needs(judge(removed,removedFollowup),"Ingen forhåndsvurdert relevant kilde",
    "check displayed IDs in both responses only");

  const onlyLater=clone(guidance);
  onlyLater.evidence_sources=[];
  onlyLater.source_provenance={...provenance,visibleEvidenceCount:0,selectedCuratedSourceCount:0};
  needs(judge(onlyLater),"ikke vises i første råd",
    "a later follow-up reference cannot retroactively prove first reply source ID");
 
  const duplicate=clone(guidance);
  duplicate.evidence_sources.push({...source,url:source.url+"?utm_source=test"});
  duplicate.source_provenance={...provenance,selectedCuratedSourceCount:2,visibleEvidenceCount:2};
  needs(judge(duplicate),"samme URL","duplicate tracking URLs");

  const malformed=clone(guidance);
  malformed.evidence_sources[0].url="javascript:alert(1)";
  needs(judge(malformed),"ugyldig eller usikker kilde-URL","URL scheme");

  const wrongRole=clone(guidance);
  wrongRole.evidence_sources[0].evidenceRole="verified_legal_fact";
  needs(judge(wrongRole),"ukjent eller manglende kildeproveniens","unsupported fake verification role");

  const fakeProvider=clone(guidance);
  fakeProvider.evidence_sources[0]={url:"https://example.org/found",evidenceRole:"provider_url"};
  fakeProvider.source_ids=[];
  fakeProvider.source_provenance={...provenance,selectedCuratedSourceCount:0,providerUrlCount:0};
  needs(judge(fakeProvider),"uten tilstrekkelig provider-proveniens","no provider proof");

  const absentReview=clone(guidance);
  delete absentReview.legal_claim_review;
  needs(judge(absentReview),"rettspåstandskontroll er feil eller mangler","missing manual review flag");

  const checked=clone(guidance);
  checked.legal_claim_review={...legalClaimReview,claimToSourceChecked:true};
  needs(judge(checked),"rettspåstandskontroll er feil eller mangler","no automatic claim fact check");

  const contradictory=clone(guidance);
  contradictory.legal_claim_review={...legalClaimReview,needsManualReview:true};
  needs(judge(contradictory),"flagg og antall","conflicting claim warning");

  const blank=clone(followup);
  blank.reply="";
  needs(judge(guidance,blank),"Oppfølgingssvaret er tomt","response must be nonempty");

  const neutralTc={...tc,expectEvidence:false,preferredSourceIds:[],forbidSourceIds:[]};
  needs(judge(guidance,followup,neutralTc),"Ordinær samtale overlesses","neutral case with forced citations");

  const neutralG={...guidance,source_ids:[],evidence_sources:[],
    source_provenance:{...provenance,selectedCuratedSourceCount:0,visibleEvidenceCount:0}};
  const neutralF={...followup,evidence_sources:[],source_provenance:{
    ...provenance,selectedCuratedSourceCount:0,visibleEvidenceCount:0}};
  assert.deepEqual(judge(neutralG,neutralF,neutralTc),[],
    "Ukomplisert sak uten kilder skal kunne bestå uten kildeinflasjon");
  assert.deepEqual(judge(guidance,followup,tc),[],
    "Evaluator må ikke mutere input under negative tester");

  const vet={...tc,id:"SRC-C-VETERINAER"};
  const joint={...guidance,opening:"Takk for at dere møter. Jeg vil høre begge to."};
  needs(judge(joint,followup,vet),"SRC-C: Åpningen",
    "Unconfirmed joint meeting must be manually reviewed");
  const actualVetOpening="Jeg vil gjerne snakke med deg om uenigheten rundt den behandlingsfaglige vurderingen, og om hvordan kritikken mellom dere har kommet fram foran klienter. Det er viktig for meg å forstå hva som faktisk skjedde, hvordan du vurderte situasjonen, og hva du mener skal til for at vi kan håndtere faglig uenighet på en trygg og profesjonell måte. Jeg vil også høre hvordan du selv ser på det som ble sagt foran klientene.";
  assert.deepEqual(judge({...guidance,opening:actualVetOpening},followup,vet),[],
    "Ekte KI-åpning adresserer én veterinær selv om den nevner kritikken mellom dere");
  needs(judge({...guidance,opening:"Jeg vil gjerne snakke med dere begge om saken."},followup,vet),
    "SRC-C: Åpningen","Plural invitation must still trigger the meeting-format warning");
  needs(judge({...guidance,opening:"Vi er samlet for å diskutere konflikten."},followup,vet),
    "SRC-C: Åpningen","Assuming everyone is gathered must still trigger warning");
  assert.deepEqual(judge({...guidance,opening:"Takk for at du kom. Jeg vil høre din versjon."},followup,vet),[],
    "Single-person opening must not trigger the joint-meeting alert");

  const office={...neutralTc,id:"SRC-E-ORDINAER"};
  const unauthorized={...neutralG,reactions:[{leader_response:"Før jeg bestemmer, må vi lytte til dere."}]};
  needs(judge(unauthorized,neutralF,office),"SRC-E: Lederen",
    "Manager cannot assume formal decision authority");
  const actualOfficeOpening="Takk for at du kom. Jeg vil gjerne rydde opp i hvem som gjør hva når det gjelder møtereferat og møteinnkallinger. Målet er ikke å plassere skyld, men å få en tydelig og praktisk ordning som fungerer for alle. Jeg vil først høre hvordan du opplever dagens fordeling, hva som har vært uklart, og hva du mener kan være en god løsning. Så ser vi på hva vi kan avklare videre.";
  const actualOfficeReactions=[
    {leader_response:"Jeg hører at du opplever fordelingen slik. La oss gå gjennom hvilke oppgaver det gjelder, og hva som faktisk har vært avtalt eller praktisert."},
    {leader_response:"Jeg skal være tydelig på hva jeg kan beslutte, og hva vi eventuelt må avklare med nærmeste leder. Først vil jeg forstå situasjonen ordentlig."},
    {leader_response:"Jeg noterer meg det du sier, men la oss holde oss til hvilke oppgaver som skal gjøres, hvem som gjør dem, og hvordan vi unngår uklarhet framover."}
  ];
  assert.deepEqual(judge({...neutralG,opening:actualOfficeOpening,reactions:actualOfficeReactions},neutralF,office),[],
    "Ekte KI-åpning og reaksjoner avklarer lederfullmakt uten å forutsette den");
  assert.deepEqual(judge({...neutralG,reactions:[{leader_response:"Jeg avklarer hvem som kan beslutte dette."}]},neutralF,office),[],
    "Clarifying authority must not count as assuming it");

  // Kostnadsfri reanalyse av gammel to-case JSON (ikke ny modellkjøring).
  // Denne testen bekrefter at en opprinnelig falsk alarm for veterinær
  // forsvinner, mens originalfilen og manglende faglig signoff bevares.
  const fs=require("node:fs");
  const os=require("node:os");
  const path=require("node:path");
  const {spawnSync}=require("node:child_process");
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),"samtalestotte-offline-recheck-"));
  try{
    const file=path.join(temp,"source-recheck-2026-11-25T14-32-38-000Z.json");
    const veterinarySource={...source,id:"DNV_VETERINARY_COLLEGIALITY",
      title:"Veterinæren og kollegialitet",
      url:"https://www.vetnett.no/5-3-veterinaeren-og-kollegialitet/category1568.html"};
    const vetGuidance={...guidance,opening:actualVetOpening,reactions:[],
      source_ids:["DNV_VETERINARY_COLLEGIALITY"],evidence_sources:[veterinarySource]};
    const vetFollowup={...followup,evidence_sources:[veterinarySource]};
    const officeGuidance={...neutralG,opening:actualOfficeOpening,reactions:actualOfficeReactions};
    const fileRun={
      createdAt:"2026-11-25T14:32:38.933Z",targeted:true,
      environment:"isolated-local-test",provider:"openai",
      cases:[
        {id:"SRC-C-VETERINAER",issues:["SRC-C: Åpningen forutsetter muligens felles møte"],
          guidance:vetGuidance,followup:vetFollowup},
        {id:"SRC-E-ORDINAER",issues:[],
          guidance:officeGuidance,followup:neutralF}
      ]
    };
    const original=JSON.stringify(fileRun);
    fs.writeFileSync(file,original,"utf8");
    const result=spawnSync(process.execPath,[
      path.join(__dirname,"..","scripts","reassess-source-recheck.mjs"),file
    ],{encoding:"utf8",env:{...process.env,SOURCE_RECHECK_SKIP_CLIPBOARD:"1"}});
    assert.equal(result.status,0,
      "Kostnadsfri reanalyse må bestå uten provider: "+result.stderr+" "+result.stdout);
    assert.match(result.stdout,/SRC-C-VETERINAER: før 1 varsel, nå 0 varsel/);
    assert.match(result.stdout,/SRC-E-ORDINAER: før 0 varsel, nå 0 varsel/);
    assert.equal(fs.readFileSync(file,"utf8"),original,
      "Originalrapporten må bevares uendret");
    const reports=fs.readdirSync(temp).filter(n=>n.startsWith("source-recheck-offline-"));
    assert.equal(reports.length,1,"Reanalyse må opprette én separat kontrollrapport");
    const report=fs.readFileSync(path.join(temp,reports[0]),"utf8");
    assert.match(report,/verken juridisk faktasjekk eller formell faglig godkjenning/i);
    assert.match(report,/2\/2 uten maskinelle signaler/);
    const tampered={...fileRun,targeted:false};
    fs.writeFileSync(file,JSON.stringify(tampered),"utf8");
    const rejected=spawnSync(process.execPath,[
      path.join(__dirname,"..","scripts","reassess-source-recheck.mjs"),file
    ],{encoding:"utf8",env:{...process.env,SOURCE_RECHECK_SKIP_CLIPBOARD:"1"}});
    assert.equal(rejected.status,2,"Verktøyet må avvise full fem-case eller annen feilrapport");
  }finally{
    fs.rmSync(temp,{recursive:true,force:true});
  }

  console.log("KILDEAKSEPTANSE-EVALUATOR OK: 16 positive/negative kontrakter, proveniens, falsk verifikasjon og kildestøy; 0 KI-kall");
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
