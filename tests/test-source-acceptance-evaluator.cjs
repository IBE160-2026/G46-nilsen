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
  // usynlig model source_ids-liste.
  needs(judge(removed),"Ingen forhåndsvurdert relevant kilde","check displayed IDs only");

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

  console.log("KILDEAKSEPTANSE-EVALUATOR OK: 16 positive/negative kontrakter, proveniens, falsk verifikasjon og kildestøy; 0 KI-kall");
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
