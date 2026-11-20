// Faktisk Express + OpenAI SDK, men alle KI-kall rutes til lokal simulator.
// Tester kildeproveniens i første råd OG oppfølging uten API-nøkkel, ekstern KI
// eller produksjonsdatabase. Feiler hardt ved manglende kildekontroll.
const assert = require("node:assert/strict");
const http = require("node:http");
const path = require("node:path");
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
  const text = JSON.stringify(modelContent);
  reply(res,200,{
    id:"resp_source_fake",object:"response",model:"gpt-5.6-luna",status:"completed",
    output_text:text,
    output:[
      {id:"search_fake",type:"web_search_call",status:"completed",action:{
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
    "--import",path.join(root,"tests/support/offline-openai-fetch.mjs"),
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
    assert(!continuation.reply.includes("oppdiktet.example.test"),"Bogus inline source URL visible in follow-up");
    assert(!JSON.stringify(continuation.suggestions).includes("oppdiktet.example.test"),
      "Bogus URL visible in follow-up suggested questions");
    assert.equal(providerRequests.length,2,"Both endpoints must reach only local fake provider");
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
