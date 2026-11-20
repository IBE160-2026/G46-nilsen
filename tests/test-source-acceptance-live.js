// Opt-in akseptanseprøve med ekte KI gjennom den faktiske lokale appen.
// Bruker syntetiske saker, dummy-database og egen testserver; aldri Render/produksjon.
// Krever --run-live + SOURCE_ACCEPTANCE_LIVE=I_ACCEPT_API_COSTS + OPENAI_API_KEY.
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const cases=JSON.parse(fs.readFileSync(path.join(root,"tests/AI-SOURCE-ACCEPTANCE-CASES.json"),"utf8")).cases;
const enabled=process.argv.includes("--run-live") &&
  process.env.SOURCE_ACCEPTANCE_LIVE === "I_ACCEPT_API_COSTS";
if(!enabled || !process.env.OPENAI_API_KEY){
  console.error("Ekte KI-test ble IKKE startet. Krever flagget --run-live,");
  console.error("SOURCE_ACCEPTANCE_LIVE=I_ACCEPT_API_COSTS og OPENAI_API_KEY.");
  console.error("Dette er bevisst en betalt, manuell test utenfor CI.");
  process.exit(2);
}
const port=32429;
const base="http://127.0.0.1:"+port;
const sleep=ms=>new Promise(done=>setTimeout(done,ms));
const server=spawn(process.execPath,[path.join(root,"server.js")],{
  cwd:root,
  env:{
    ...process.env,
    PORT:String(port),APP_BASE_URL:base,
    NODE_ENV:"test",TEST_AUTH_BYPASS:"1",
    OCCUPATION_CONTEXT_ENABLED:"true",
    OPENAI_MODEL:"gpt-5.6-luna",OPENROUTER_API_KEY:"",
    SUPABASE_URL:"http://127.0.0.1:9",
    SUPABASE_PUBLISHABLE_KEY:"isolated-local-test-only",
    SUPABASE_SECRET_KEY:"isolated-local-test-only",
    TEST_BENCHMARK_LIVE:"0",TEST_FAKE_OPENAI_PORT:""
  },
  stdio:["ignore","pipe","pipe"]
});
let stderr="";
server.stderr.on("data",d=>{stderr=(stderr+d.toString()).slice(-4000);});

async function waitForServer(){
  for(let i=0;i<90;i++){
    if(server.exitCode!==null)throw Error("Testserver stoppet: "+stderr);
    try{
      const response=await fetch(base+"/api/status",{signal:AbortSignal.timeout(1500)});
      if(response.ok){
        const status=await response.json();
        if(!status.aiConfigured || status.model!=="gpt-5.6-luna"){
          throw Error("Feil KI-konfigurasjon i isolert testserver");
        }
        return;
      }
    }catch(err){
      if(err.message==="Feil KI-konfigurasjon i isolert testserver")throw err;
    }
    await sleep(200);
  }
  throw Error("Lokal testserver startet ikke: "+stderr);
}
async function post(route,body){
  const response=await fetch(base+route,{
    method:"POST",
    headers:{"content-type":"application/json"},
    body:JSON.stringify(body),
    signal:AbortSignal.timeout(105000)
  });
  const data=await response.json().catch(()=>({}));
  if(!response.ok){
    const message=String(data.message||data.error||"HTTP "+response.status);
    throw Error(route+" "+response.status+": "+message);
  }
  return data;
}
function checkOne(tc,guidance,followup){
  const issues=[];
  const initial=Array.isArray(guidance.evidence_sources)?guidance.evidence_sources:[];
  const continued=Array.isArray(followup.evidence_sources)?followup.evidence_sources:[];
  const all=[...initial,...continued];
  const shownIds=new Set([
    ...(Array.isArray(guidance.source_ids)?guidance.source_ids:[]),
    ...all.map(x=>x.id).filter(Boolean)
  ]);
  if(!guidance.opening || !Array.isArray(guidance.questions) || guidance.questions.length<2){
    issues.push("Første råd mangler muntlig åpning eller to situasjonsnære spørsmål");
  }
  if(!String(followup.reply||"").trim())issues.push("Oppfølgingssvaret er tomt");
  if(tc.expectEvidence && (!initial.length || !continued.length)){
    issues.push("Kildekrevende situasjon mangler synlig kildegrunnlag i ett av svarløpene");
  }
  if(!tc.expectEvidence && all.length)issues.push("Ordinær samtale overlesses med kilder");
  if(tc.preferredSourceIds.length &&
     !tc.preferredSourceIds.some(id=>shownIds.has(id))){
    issues.push("Ingen av de forhåndsdefinerte relevante kildekandidatene ble valgt; vurder konkret relevans manuelt");
  }
  for(const id of tc.forbidSourceIds){
    if(shownIds.has(id))issues.push("Utenfor-sektor kilde i svargrunnlaget: "+id);
  }
  for(const [label,result,sources] of [
    ["råd",guidance,initial],["oppfølging",followup,continued]
  ]){
    const p=result.source_provenance;
    if(!p || typeof p.webSearchPerformed!=="boolean" ||
      typeof p.providerUrlCount!=="number" ||
      p.visibleEvidenceCount!==sources.length || p.contentVerified!==false){
      issues.push(label+": kildenes proveniens er mangelfull eller feil");
    }
    for(const source of sources){
      try{
        const url=new URL(source.url);
        if(url.protocol!=="https:" && url.protocol!=="http:")throw Error("ugyldig protokoll");
      }catch{issues.push(label+": kilde med ugyldig URL");}
    }
  }
  return issues;
}
const results=[];
try{
  await waitForServer();
  for(let i=0;i<cases.length;i++){
    const tc=cases[i];
    process.stdout.write("["+(i+1)+"/"+cases.length+"] "+tc.id+" ... ");
    try{
      const analysis=await post("/api/analyze-situation",{
        situation:tc.situation,selectedTopic:tc.topicId,selectedSubtopic:tc.subtopic,
        occupation:tc.occupation,sectorId:tc.sectorId,employerType:tc.employerType
      });
      const input={
        situation:tc.situation,analysis,followups:{},
        topicId:tc.topicId,subtopic:tc.subtopic,
        occupation:tc.occupation,sectorId:tc.sectorId,employerType:tc.employerType
      };
      const guidance=await post("/api/generate-guidance",input);
      const followup=await post("/api/continue-conversation",{
        ...input,guidance,question:tc.question
      });
      const issues=checkOne(tc,guidance,followup);
      results.push({
        id:tc.id,title:tc.title,sectorId:tc.sectorId,
        model:guidance.model||null,issues,
        manualReviewPending:true,manualMust:tc.manualMust,
        manualCritical:tc.manualCritical,
        analysis,guidance,followup
      });
      console.log(issues.length?"SJEKK ("+issues.length+")":"MASKINELT OK; FAGLIG SJEKK GJENSTÅR");
    }catch(err){
      results.push({id:tc.id,title:tc.title,technicalError:String(err.message||err),manualReviewPending:true});
      console.log("TEKNISK FEIL");
    }
  }
}finally{
  server.kill("SIGTERM");
}
const outDir=path.join(root,"test-results");
fs.mkdirSync(outDir,{recursive:true});
const stamp=new Date().toISOString().replace(/[:.]/g,"-");
const jsonPath=path.join(outDir,"source-acceptance-"+stamp+".json");
const mdPath=path.join(outDir,"source-acceptance-"+stamp+".md");
fs.writeFileSync(jsonPath,JSON.stringify({createdAt:new Date().toISOString(),
  model:"gpt-5.6-luna",environment:"isolated-local-test",
  occupationContext:true,provider:"openai",cases:results},null,2),"utf8");
let md="# Kildepresisjon – ekte KI, fem anonymiserte saker\n\n";
md+="Dato: "+new Date().toISOString()+"\n\n";
md+="Testmetode: lokal Node-server, ekte OpenAI, fiktiv Supabase-URL og yrkeskontekst PÅ bare i testprosessen.\n\n";
md+="Ingen prod-/Render-innstillinger er lest eller endret. Dette må ikke omtales som en produksjonsverifisering.\n\n";
md+="**Viktig:** Et web_search_call eller URL-annotasjon er ikke bevis for at kilden støtter hver enkelt påstand. Kildetekst må manuelt leses opp mot påstanden.\n\n";
for(const r of results){
  const tc=cases.find(x=>x.id===r.id);
  md+="## "+r.id+" – "+r.title+"\n\n";
  md+="Case: "+tc.situation+"\n\nOppfølging: "+tc.question+"\n\n";
  if(r.technicalError)md+="**Teknisk feil:** "+r.technicalError+"\n\n";
  if(r.issues?.length)md+="**Maskinelle kontrollpunkter:**\n"+r.issues.map(x=>"- "+x).join("\n")+"\n\n";
  if(r.guidance){
    md+="**Første åpning:** "+(r.guidance.opening||"")+"\n\n";
    md+="**Fag-/rettsmerknad:** "+(r.guidance.legal_hr_note||"")+"\n\n";
    md+="**Første kilder:** "+JSON.stringify(r.guidance.evidence_sources||[])+"\n\n";
    md+="**Første proveniens:** "+JSON.stringify(r.guidance.source_provenance||null)+"\n\n";
  }
  if(r.followup){
    md+="**Oppfølgingssvar:** "+(r.followup.reply||"")+"\n\n";
    md+="**Oppfølgingskilder:** "+JSON.stringify(r.followup.evidence_sources||[])+"\n\n";
    md+="**Oppfølgingsproveniens:** "+JSON.stringify(r.followup.source_provenance||null)+"\n\n";
  }
  md+="**Faglig fasit – manuelt:**\n";
  md+=tc.manualMust.map(x=>"- [ ] "+x).join("\n")+"\n\n";
  md+="**Kritisk feil dersom:**\n";
  md+=tc.manualCritical.map(x=>"- [ ] "+x).join("\n")+"\n\n";
  md+="- [ ] Hver konkret kildehenvisning er manuelt sammenholdt med aktuell kildetekst\n";
  md+="- [ ] Ingen juridiske påstander bruker feil paragraf eller uavklart tariffområde\n";
  md+="- [ ] Konklusjon dokumentert av faglig ansvarlig: GODKJENT / AVVIK / IKKE VURDERT\n\n";
}
fs.writeFileSync(mdPath,md,"utf8");
const critical=results.filter(x=>x.technicalError||(x.issues||[]).length).length;
console.log("Ferdig med provider-test. Faglig kildekontroll er IKKE utført automatisk.");
console.log("Maskinelle avvik eller teknisk feil: "+critical+"/"+cases.length);
console.log("Rapporter: "+mdPath+" og "+jsonPath);
if(critical)process.exitCode=1;
