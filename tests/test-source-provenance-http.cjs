// Faktisk Express + OpenAI SDK, men alle KI-kall rutes til lokal simulator.
// Tester kildeproveniens i første råd OG oppfølging uten API-nøkkel, ekstern KI
// eller produksjonsdatabase. Feiler hardt ved manglende kildekontroll.
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
const {pathToFileURL} = require("node:url");
const { spawn } = require("node:child_process");
const root = path.resolve(__dirname, "..");
const appPort = 33741, mockPort = 33742;
const base = "http://127.0.0.1:" + appPort;
const expectedUrl = "https://fagkilde.example.test/veileder";
const forgedUrl = "https://oppdiktet.example.test/lov";
const providerRequests = [];
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
function reply(res, status, body) {
  res.writeHead(status, {"content-type":"application/json"});
  res.end(JSON.stringify(body));
}
const fakeProvider = http.createServer(async(req,res)=>{
  let raw = "";
  for await(const chunk of req) raw += chunk.toString();
  let request;
  try { request = JSON.parse(raw); } catch { return reply(res,400,{error:{message:"Bad synthetic JSON"}}); }
  providerRequests.push(request);
  const simulateFailedSearch = raw.includes("simulert-feilet-nettsok");
  const simulateSourceCap = raw.includes("simulert-kildetak");
  const simulateLegalClaim = raw.includes("simulert-juridisk-krav");
  const continuation = request?.text?.format?.name === "samtalestotte_oppfolging";
  const modelContent = continuation
    ? {
        reply:"Be om fakta og hør begge sider. Les [kilde](" + expectedUrl + ") før du vurderer videre reaksjon. En oppdiktet nettside " + forgedUrl + " må ikke stå i svaret.",
        suggestions:["Hvordan dokumenterer jeg saken?","Hva bør jeg spørre om? Se www.oppdiktet.example.test/tiltak"],
        source_ids:[],
        supplementary_sources:[
          {title:"FALSK LOV",author:"Lovdata",year:"2026",type:"bindende lov",url:expectedUrl+"?utm_source=modell"},
          {title:"Oppdiktet lov",author:"Lovdata",year:"2026",type:"bindende lov",url:forgedUrl}
        ]
      }
    : {
        opening:"Jeg vil gjerne forstå hva som har skjedd og høre din opplevelse før vi bestemmer oss. Se " + forgedUrl,
        questions:["Hva skjedde konkret?","Hvem bør vi snakke med? Se <" + forgedUrl + ">."],
        reactions:[{reaction:"Se " + forgedUrl,why_plausible:"Fordi se " + forgedUrl,leader_response:"Avklar før du bruker ( " + forgedUrl + " )"}],check_before_meeting:["Bruk " + forgedUrl],attention:["Ikke kopier " + forgedUrl],next_steps:["Kontroller www.oppdiktet.example.test/tiltak"],
        legal_hr_note:"Se [kilde](" + expectedUrl + ") og [oppdiktet](" + forgedUrl + "). Besøk " + forgedUrl,
        source_ids:[],
        supplementary_sources:[
          {title:"FALSK LOV",author:"Lovdata",year:"2026",type:"bindende lov",url:expectedUrl+"?utm_campaign=test"},
          {title:"Oppdiktet lov",author:"Lovdata",year:"2026",type:"bindende lov",url:forgedUrl}
        ]
      };
  if(simulateLegalClaim){
    if(continuation)modelContent.reply="Etter arbeidsmiljøloven har arbeidstaker rett til overtidstillegg.";
    else modelContent.legal_hr_note="Etter arbeidsmiljøloven har arbeidstaker rett til overtidstillegg.";
    modelContent.source_ids=[];
  }
  if(simulateSourceCap){
    const candidateIds=[...new Set(
      [...String(request.instructions || "").matchAll(/"id":"([^"]+)"/g)]
        .map(match=>match[1])
    )].filter(id=>id!=="STATE_EMPLOYEE_ACT");
    assert(candidateIds.length>=4,
      "Syntetisk kombinasjon av statlig oppsigelse/fravær/advarsel må gi fire mulige KI-valgte kilde-ID-er");
    modelContent.source_ids=candidateIds.slice(0,4);
  }
  const text = JSON.stringify(modelContent);
  reply(res,200,{
    id:"resp_source_fake",object:"response",model:"gpt-5.6-luna",status:"completed",
    output_text:text,
    output:[
      {id:"search_fake",type:"web_search_call",status:simulateFailedSearch ? "failed" : "completed",action:{
        type:"search",sources:[{type:"url",url:expectedUrl,title:"Dokumentert nettsøktreff"}]
      }},
      {id:"message_fake",type:"message",role:"assistant",status:"completed",
        content:[{type:"output_text",text,annotations:[]}]}
    ],
    usage:{input_tokens:60,output_tokens:80,total_tokens:140}
  });
});
let app,logs="";
async function call(route,body) {
  const r=await fetch(base+route,{
    method:"POST",headers:{"content-type":"application/json",origin:base},
    body:JSON.stringify(body),signal:AbortSignal.timeout(16000)
  });
  const data=await r.json().catch(()=>({}));
  assert.equal(r.status,200,route+" rejected: "+JSON.stringify(data));
  return data;
}
function checkResult(result,label) {
  const evidence=result.evidence_sources || [];
  const source=evidence.find(x=>x.url===expectedUrl);
  assert(source,label+": documented web URL did not survive the HTTP response");
  assert.equal(source.title,"Dokumentert nettsøktreff",
    label+": model must not forge source title");
  assert.equal(source.author,"fagkilde.example.test",
    label+": source author must be provider domain, not model claim");
  assert.equal(source.type,"nettkilde",
    label+": model must not claim binding legal status");
  assert.equal(source.year,"",
    label+": model must not invent publication date");
  assert.equal(source.evidenceRole,"provider_url",
    label+": web-search result must not be presented as KI-selected or checked legal source");
  assert(!evidence.some(x=>x.url===forgedUrl),
    label+": hallucinated source URL leaked into visible evidence");
  assert(result.source_provenance,label+": no provenance summary");
  assert.equal(result.source_provenance.webSearchPerformed,true,
    label+": missing web search provenance");
  assert.equal(result.source_provenance.providerUrlCount,1);
  assert.equal(result.source_provenance.visibleEvidenceCount,evidence.length);
  assert.equal(result.source_provenance.contentVerified,false,
    label+": provider URL is not proof of verified claim content");
}
(async()=>{
  await new Promise(resolve=>fakeProvider.listen(mockPort,"127.0.0.1",resolve));
  app=spawn(process.execPath,[
    "--import",pathToFileURL(path.join(root,"tests/support/offline-openai-fetch.mjs")).href,
    path.join(root,"server.js")
  ],{
    cwd:root,stdio:["ignore","pipe","pipe"],
    env:{
      ...process.env,
      NODE_ENV:"test",TEST_AUTH_BYPASS:"1",PORT:String(appPort),APP_BASE_URL:base,
      SUPABASE_URL:"http://127.0.0.1:9",
      SUPABASE_PUBLISHABLE_KEY:"isolated-test",
      SUPABASE_SECRET_KEY:"isolated-test",
      OPENAI_API_KEY:"synthetic-local-key",OPENROUTER_API_KEY:"",
      OPENAI_MODEL:"gpt-5.6-luna",
      TEST_FAKE_OPENAI_PORT:String(mockPort),TEST_BENCHMARK_LIVE:"0",
      OCCUPATION_CONTEXT_ENABLED:"false",ADMIN_EMAILS:""
    }
  });
  app.stderr.on("data",chunk=>logs=(logs+chunk.toString()).slice(-3500));
  try {
    let ready=false;
    for(let i=0;i<100;i++){
      if(app.exitCode!==null)throw Error("Local server exited: "+logs);
      try{
        const r=await fetch(base+"/api/public-config",{signal:AbortSignal.timeout(500)});
        if(r.ok){ready=true;break;}
      }catch{}
      await sleep(100);
    }
    assert(ready,"Local server not ready: "+logs);
    const situation="En medarbeider er gjentatte ganger holdt utenfor arbeidsinformasjon. Kan jeg gi skriftlig advarsel?";
    const data={situation,analysis:{primary_topic:"Samarbeid og kommunikasjon"},followups:{},
      topicId:"Samarbeid og kommunikasjon",subtopic:"Utestenging",employerType:"private"};
    const guidance=await call("/api/generate-guidance",data);
    checkResult(guidance,"Første råd");
    for(const field of ["opening","questions","reactions","check_before_meeting","attention","next_steps","legal_hr_note"]){
      assert(!JSON.stringify(guidance[field]).includes("oppdiktet.example.test"),
        "Forged URL in guidance display field: "+field);
    }
    const continuation=await call("/api/continue-conversation",{
      ...data,guidance,question:"Kan jeg gi en skriftlig advarsel med en gang?"
    });
    checkResult(continuation,"Oppfølging");
    // Samme ekte Express/SDK-sti: brukerens faktiske avklaringssvar må
    // beholdes i både første råd og videre samtale, ikke bare i browser-UI.
    // All KI er lokal simulator; ingen betalte kall eller eksterne tjenester.
    const clarified={
      situation:"To medarbeidere er uenige om arbeidsdeling. Jeg leder samtalen, men har ikke personalansvar.",
      analysis:{primary_topic:"Samarbeid og kommunikasjon",
        needs_clarification:true,clarifications:[]},
      followups:{meeting_format:"Separate samtaler",
        leader_authority:"Ingen personalmyndighet"},
      topicId:"Samarbeid og kommunikasjon",subtopic:"Arbeidsfordeling",
      employerType:"private"
    };
    const beforeClarified=providerRequests.length;
    const clarifiedGuidance=await call("/api/generate-guidance",clarified);
    const firstInstruction=providerRequests.slice(beforeClarified)
      .find(item=>item?.text?.format?.name==="samtalestotte_konkret_veiledning")?.instructions||"";
    assert(firstInstruction.includes('Avklaringssvar: {"meeting_format":"Separate samtaler","leader_authority":"Ingen personalmyndighet"}'),
      "Express må sende alle valgte avklaringssvar til modellens første råd");
    const beforeFollowup=providerRequests.length;
    await call("/api/continue-conversation",{
      ...clarified,guidance:clarifiedGuidance,
      question:"Hvordan avtaler vi arbeidsfordelingen uten at jeg overtar personalansvaret?"
    });
    const continueInstruction=providerRequests.slice(beforeFollowup)
      .find(item=>item?.text?.format?.name==="samtalestotte_oppfolging")?.instructions||"";
    assert(continueInstruction.includes('Avklaringssvar: {"meeting_format":"Separate samtaler","leader_authority":"Ingen personalmyndighet"}'),
      "Express må bevare de samme avklaringssvarene i påfølgende KI-dialog");

    assert(!continuation.reply.includes("oppdiktet.example.test"),"Bogus inline source URL visible in follow-up");
    assert(!JSON.stringify(continuation.suggestions).includes("oppdiktet.example.test"),
      "Bogus URL visible in follow-up suggested questions");
    // Ekte serverruting: statlig lovkilde legges automatisk til i en
    // konkret oppsigelsessak, selv om modellen returnerer source_ids=[].
    // Den skal IKKE fremstilles som KI-valgt dokumentasjon.
    const stateGuidance=await call("/api/generate-guidance",{
      situation:"En statsansatt i en statlig virksomhet har fått varsel om mulig oppsigelse. Jeg må forberede en saklig samtale om prosess og rettigheter.",
      analysis:{primary_topic:"Oppsigelse og avslutning av arbeidsforhold"},
      followups:{},topicId:"Oppsigelse og avslutning av arbeidsforhold",
      subtopic:"Oppsigelse",employerType:"state"
    });
    const scoped=stateGuidance.evidence_sources.find(x=>x.id==="STATE_EMPLOYEE_ACT");
    assert(scoped,"Statlig primærlov må være tilgjengelig som kontrollgrunnlag");
    assert.equal(scoped.evidenceRole,"scope_reference",
      "Automatisk statlig lovhenvisning må ikke fremstå som KI-valgt kilde");
    assert.equal(stateGuidance.source_provenance.selectedCuratedSourceCount,0,
      "Modellen valgte ingen kuratert kilde i state-mocksvar");
    assert(stateGuidance.source_provenance.scopeReferenceCount>=1,
      "Systemets egne lovhenvisninger må telles separat");
    assert.equal(stateGuidance.source_provenance.contentVerified,false);
    // Ekte HTTP-grense: et mislykket web_search_call kan fremdeles ha
    // action.sources i syntetiske provider-data. Disse må aldri bli
    // synlige kilder eller telles som et fullført søk.
    const failed=await call("/api/generate-guidance",{
      ...data,
      situation:situation+" simulert-feilet-nettsok"
    });
    assert.equal(failed.source_provenance.webSearchPerformed,false,
      "Feilet nettsøk må ikke rapporteres som fullført");
    assert.equal(failed.source_provenance.providerUrlCount,0,
      "URL-er fra feilet nettsøk må aldri telles som dokumenterte treff");
    assert(!failed.evidence_sources.some(source=>source.url===expectedUrl),
      "Feilet provider-søk må ikke slippe kilde-URL inn i API-responsen");
    assert.equal(failed.source_provenance.contentVerified,false,
      "Feilet nettsøk må aldri løfte innholdsstatus til verifisert");
    // Full serverrute: tidligere er en trussel uttrykkelig avkreftet.
    // Første svar bør derfor ikke aktivere trusselkilder. En ny ytring
    // uten tegnsetting i den gamle teksten introduserer en faktisk trussel.
    const previouslyNoThreat="Det har ikke vært noen trussel";
    const newThreat="Nå har medarbeideren uttalt en konkret trussel mot en kollega";
    const neutralData={
      situation:previouslyNoThreat,
      analysis:{primary_topic:"Samarbeid og kommunikasjon"},
      followups:{},topicId:"Samarbeid og kommunikasjon",
      subtopic:"Arbeidsdeling",employerType:"private"
    };
    const neutralGuidance=await call("/api/generate-guidance",neutralData);
    assert.equal(neutralGuidance.evidence_sources.length,0,
      "Avkreftet trussel i opprinnelig sak skal ikke skape kildestøy");
    assert(!providerRequests.at(-1).instructions.includes('"id":"AT_VOLD_TRUSLER"'),
      "KI skal ikke se voldskilder før en faktisk risiko er opplyst");
    await call("/api/continue-conversation",{
      ...neutralData,guidance:neutralGuidance,question:newThreat
    });
    const followUpPrompt=providerRequests.at(-1).instructions;
    assert(followUpPrompt.includes('"id":"AT_VOLD_TRUSLER"'),
      "Ny oppfølgingsytring med faktisk trussel må tilby relevant myndighetskilde");
    const capped=await call("/api/generate-guidance",{
      situation:"Statlig oppsigelse med spørsmål om advarsel, mobbing, trakassering, sykefravær og tilrettelegging. simulert-kildetak",
      analysis:{primary_topic:"Oppsigelse og avslutning av arbeidsforhold"},
      followups:{},topicId:"Oppsigelse og avslutning av arbeidsforhold",
      subtopic:"Oppsigelse",employerType:"state"
    });
    assert.equal(capped.source_ids.length,4,"API-kildegrensen skal være fire");
    assert(capped.evidence_sources.some(x=>x.id==="STATE_EMPLOYEE_ACT" && x.evidenceRole==="scope_reference"),
      "Automatisk statsansattelov skal merkes som kontrollreferanse");
    const displayedSelected=capped.evidence_sources.filter(x=>x.evidenceRole==="model_selected");
    assert.equal(displayedSelected.length,3,
      "Med én automatisk lov skal bare tre av fire KI-valgte kilde-ID-er være synlige");
    assert.equal(capped.source_provenance.selectedCuratedSourceCount,displayedSelected.length,
      "API-et skal telle bare KI-valgte kilder som faktisk vises");
    assert.equal(capped.source_provenance.scopeReferenceCount,1,
      "Auto-lov skal telles separat fra KI-valgte kilder");
    // Historiske rettsspørsmål må ikke få 2026-tariff presentert som om
    // dokumentet alene beviser hva som gjaldt for opptjening i 2024.
    const historicalData={
      situation:"Hvilken tariffavtale gjaldt for overtid i staten i 2024?",
      analysis:{primary_topic:"Lønn og utvikling"},followups:{},
      topicId:"Lønn og utvikling",subtopic:"Lønnsutvikling",employerType:"state"
    };
    const historicalGuidance=await call("/api/generate-guidance",historicalData);
    const historicalInstructions=providerRequests.at(-1).instructions;
    assert(historicalInstructions.includes("Historisk regelverk eller tariffperiode"),
      "Første råd om tidligere tariffperiode må kreve dokumentkontroll");
    assert(historicalInstructions.includes("2024"),
      "Historisk kildemodell må få riktig år å kontrollere");
    assert(!historicalInstructions.includes('"id":"STATE_HTA_2026_2028"'),
      "Hovedtariffavtale fra 2026 kan ikke tilbys som rettskilde for 2024");

    // Funksjonell E2E: kort oppfolging ma beholde 2024 fra opprinnelig
    // situasjon, selv om selve sporsmalet ikke gjentar ar eller tariff.
    await call("/api/continue-conversation",{
      ...historicalData,guidance:historicalGuidance,
      question:"Hva med kravfristene?"
    });
    const inheritedInstructions=providerRequests.at(-1).instructions;
    assert(inheritedInstructions.includes("Historisk regelverk eller tariffperiode") &&
      inheritedInstructions.includes("Brukeren spør om hva som gjaldt i 2024."),
      "Kort oppfolging ma arve riktig historisk ar og forsiktighetsinstruks");
    assert(!inheritedInstructions.includes('"id":"STATE_HTA_2026_2028"'),
      "Kort oppfolging om 2024 ma aldri vise hovedtariff fra 2026 som historisk kandidat");
    await call("/api/continue-conversation",{
      ...historicalData,guidance:historicalGuidance,
      question:"Hvilken tariffavtale gjaldt da?"
    });
    const inheritedUndatedInstructions=providerRequests.at(-1).instructions;
    assert(inheritedUndatedInstructions.includes("Brukeren spør om hva som gjaldt i 2024."),
      "Oppfolging med 'da' skal bruke opprinnelig periodisering, ikke ukjent ar");
    assert(!inheritedUndatedInstructions.includes('"id":"STATE_HTA_2026_2028"'),
      "Udatert oppfolging i kjent historisk sak ma holde 2026-kilder ute");
    await call("/api/continue-conversation",{
      ...historicalData,guidance:historicalGuidance,
      question:"Hva gjelder nå?"
    });
    const resetInstructions=providerRequests.at(-1).instructions;
    assert(!resetInstructions.includes("Historisk regelverk eller tariffperiode"),
      "Eksplisitt 'na' ma respektere at bruker byttet til dagens rettstilstand");

    const presentDayData={
      ...historicalData,
      situation:"En medarbeider ble ansatt i 2024 og ønsker lønnssamtale nå. Hvordan forbereder jeg den?"
    };
    const presentGuidance=await call("/api/generate-guidance",presentDayData);
    const presentInstructions=providerRequests.at(-1).instructions;
    assert(!presentInstructions.includes("Historisk regelverk eller tariffperiode"),
      "Ansettelsesår i 2024 alene skal ikke gjøre dagens lønnssamtale til historisk tvist");
    await call("/api/continue-conversation",{
      ...presentDayData,guidance:presentGuidance,
      question:"Hvilken tariffavtale gjaldt for overtid i 2024?"
    });
    const followHistoricalInstructions=providerRequests.at(-1).instructions;
    assert(followHistoricalInstructions.includes("Historisk regelverk eller tariffperiode"),
      "Nytt historisk spørsmål i oppfølging må få riktig kildeforbehold");
    assert(!followHistoricalInstructions.includes('"id":"STATE_HTA_2026_2028"'),
      "Historisk oppfølging må ikke få etterfølgende tariffavtale som kildekandidat");
    await call("/api/continue-conversation",{
      ...presentDayData,guidance:presentGuidance,
      question:"Hvilken tariffavtale gjaldt da?"
    });
    const noYearInstructions=providerRequests.at(-1).instructions;
    assert(noYearInstructions.includes("en tidligere periode som ikke er datofestet"),
      "Udatert historisk spørsmål må kreve periodeavklaring, ikke bruke dagens tariff");
    assert(!noYearInstructions.includes('"id":"STATE_HTA_2026_2028"') &&
           !noYearInstructions.includes('"id":"STATE_HA_2023_2026"'),
      "Ukjent historisk periode må ikke få automatisk avtalevalg");
    await call("/api/continue-conversation",{
      ...presentDayData,guidance:presentGuidance,
      question:"Hvilken tariffavtale gjaldt i 2023 og 2024?"
    });
    const manyYearsInstructions=providerRequests.at(-1).instructions;
    assert(manyYearsInstructions.includes("de nevnte tidligere årene"),
      "Flere historiske år skal ikke reduseres til én vilkårlig periode");
    assert(!manyYearsInstructions.includes('"id":"STATE_HTA_2026_2028"') &&
           !manyYearsInstructions.includes('"id":"STATE_HA_2023_2026"'),
      "Flere uavklarte år må kreve avklaring før avtalevalg");
    const claimData={
      situation:"Vi skal diskutere overtid, kompensasjon og arbeidstid. simulert-juridisk-krav",
      analysis:{primary_topic:"Lønn og utvikling"},followups:{},
      topicId:"Lønn og utvikling",subtopic:"Arbeidstid",employerType:"private"
    };
    const claimFirst=await call("/api/generate-guidance",claimData);
    assert.equal(claimFirst.legal_claim_review.needsManualReview,true,
      "Kategorisk juridisk påstand må få eksplisitt krav om menneskelig kontroll");
    assert.equal(claimFirst.legal_claim_review.possibleLegalClaimCount,1);
    assert.equal(claimFirst.legal_claim_review.claimToSourceChecked,false,
      "Nettsøktreff eller kilde-ID skal aldri utgjøre påstandsverifisering");
    assert.equal(claimFirst.legal_claim_review.hasModelSelectedReferences,false,
      "Syntetisk KI ga ikke source_ids, og skal ikke tilordnes systemets referanser");
    const claimFollow=await call("/api/continue-conversation",{
      ...claimData,guidance:claimFirst,question:"Har vedkommende krav på overtidstillegg?"
    });
    assert.equal(claimFollow.legal_claim_review.needsManualReview,true,
      "Oppfølgingssvar med lovrettigheter må synliggjøre manuelt kildebehov");
    assert.equal(claimFollow.legal_claim_review.claimToSourceChecked,false);
    assert.equal(providerRequests.length,17,
      "Sytten Express-kall skal kun bruke lokal falsk provider, aldri betalt KI");
    for(const req of providerRequests) {
      assert(req.tools?.some(x=>x.type==="web_search"),"Expected web search tool");
      assert(req.include?.includes("web_search_call.action.sources"),
        "Request must ask OpenAI for actual source metadata");
    }
    console.log("SOURCE HTTP CONTRACT OK: initial and follow-up source metadata, forgery rejection, provenance");
    console.log("External API calls: 0. Only fake provider and synthetic data.");
  } finally {
    app.kill("SIGTERM");
    await new Promise(resolve=>fakeProvider.close(resolve));
  }
})().catch(err=>{console.error("SOURCE HTTP CONTRACT FAILED:",err.stack||err);process.exitCode=1;});
