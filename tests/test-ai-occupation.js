import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

dotenv.config();
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const root=path.resolve(__dirname,"..");
const port=3219;
const base=`http://127.0.0.1:${port}`;

if(!process.env.OPENAI_API_KEY && !process.env.OPENROUTER_API_KEY){
  console.error("\nMangler OPENAI_API_KEY eller OPENROUTER_API_KEY i .env. Live-testen er ikke startet.\n");
  process.exit(1);
}

const cases=[
  {id:"OAI-01",label:"Sykepleier + samlivsbrudd",occupation:"sykepleier",sectorId:"health_care",topicId:"Livssituasjoner",subtopic:"Samlivsbrudd",situation:"En medarbeider går gjennom et samlivsbrudd og virker sliten. Jeg vil ta en støttende samtale om hvordan arbeidshverdagen fungerer.",expectRelevant:false,expectEmployer:false,forbid:[/helsedirektorat/iu,/helsepersonellov/iu,/pasientsikker/iu,/autorisasjon/iu]},
  {id:"OAI-02",label:"Tømrer + vanlig oppgavekonflikt",occupation:"tømrer",sectorId:"construction_trades",topicId:"Samarbeid og kommunikasjon",subtopic:"Uenighet",situation:"To tømrere krangler om hvem som skal gjøre hvilke ordinære oppgaver på prosjektet, uten at sikkerhet er tema.",expectRelevant:false,expectEmployer:false,forbid:[/byggteknisk/iu,/forskrift om utførelse/iu,/arbeidstilsynet/iu]},
  {id:"OAI-03",label:"Lærer + vanlig kollegakonflikt",occupation:"lærer",sectorId:"education_childcare",topicId:"Samarbeid og kommunikasjon",subtopic:"Kollegakonflikt",situation:"To lærere samarbeider dårlig om arbeidsdeling og kommunikasjon i teamet. Ingen elevsak er involvert.",expectRelevant:false,expectEmployer:false,forbid:[/opplæringslov/iu,/udir/iu,/elevmiljø/iu]},
  {id:"OAI-04",label:"Sykepleier + påvirket med pasientansvar",occupation:"sykepleier",sectorId:"health_care",topicId:"Sikkerhet og ansvar",subtopic:"Påvirket på jobb",situation:"En sykepleier virker tydelig påvirket under vakt og har pasientansvar. Jeg må håndtere situasjonen nå og deretter ta samtalen.",expectRelevant:true,expectEmployer:false,requireAny:[/sikker/iu,/pasient/iu,/ikke utfør/iu,/tas ut/iu,/avbryt/iu]},
  {id:"OAI-05",label:"Lønn uten arbeidsgivertype",occupation:"sykepleier",sectorId:"health_care",topicId:"Lønn og utvikling",subtopic:"Lønnsutvikling",situation:"En medarbeider ønsker en samtale om lønnsutvikling og hvilke muligheter som finnes.",expectRelevant:false,expectEmployer:true,forbid:[/du følger hovedtariff/iu,/ks-avtalen gjelder/iu,/spekter-avtalen gjelder/iu]},
  {id:"OAI-06",label:"Pilot + samlivsbrudd uten sikkerhetstegn",occupation:"pilot",sectorId:"aviation",topicId:"Livssituasjoner",subtopic:"Samlivsbrudd",situation:"En pilot forteller om et samlivsbrudd og ønsker en støttende samtale. Det er ingen konkrete opplysninger om redusert flysikkerhet eller arbeidsevne.",expectRelevant:false,expectEmployer:false,forbid:[/luftfartstilsynet/iu,/flysikkerhetsregel/iu,/sertifikatkrav/iu]}
];

const server=spawn(process.execPath,[path.join(root,"server.js")],{
  cwd:root,
  env:{...process.env,PORT:String(port),NODE_ENV:"test",TEST_AUTH_BYPASS:"1",OCCUPATION_CONTEXT_ENABLED:"true"},
  stdio:["ignore","pipe","pipe"]
});
let stderr="";
server.stderr.on("data",d=>{stderr+=d.toString();});
const delay=ms=>new Promise(r=>setTimeout(r,ms));

async function waitForServer(){
  for(let i=0;i<40;i++){
    try{const r=await fetch(`${base}/api/status`);if(r.ok)return;}catch{}
    await delay(250);
  }
  throw new Error("Testserveren startet ikke. "+stderr);
}

async function post(body){
  const r=await fetch(`${base}/api/generate-guidance`,{
    method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)
  });
  const p=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(p.message||`HTTP ${r.status}`);
  return p;
}

function flatten(g){
  return [g.opening,...(g.questions||[]),...(g.attention||[]),...(g.check_before_meeting||[]),g.legal_hr_note,...(g.next_steps||[]),...((g.reactions||[]).flatMap(x=>[x.reaction,x.why_plausible,x.leader_response]))].filter(Boolean).join(" \n ");
}

function evaluate(tc,g){
  const issues=[];
  const meta=g.occupation_context||{};
  if(meta.occupationRelevant!==tc.expectRelevant)issues.push(`occupationRelevant=${meta.occupationRelevant}, forventet ${tc.expectRelevant}`);
  if(meta.needsEmployerType!==tc.expectEmployer)issues.push(`needsEmployerType=${meta.needsEmployerType}, forventet ${tc.expectEmployer}`);
  const text=flatten(g);
  for(const re of tc.forbid||[])if(re.test(text))issues.push(`Irrelevant eller for sikker formulering traff: ${re}`);
  if(tc.requireAny?.length && !tc.requireAny.some(re=>re.test(text)))issues.push("Mangler forventet situasjonsnært sikkerhetsinnhold");
  const opening=String(g.opening||"");
  if(/\b(?:du bør|bør du|kontakt HR|kontakt juridisk|følg prosedyren|kvalitetssikre)\b/iu.test(opening))issues.push("Åpningen instruerer lederen i stedet for å være muntlig replikk");
  if(opening.split(/\s+/u).filter(Boolean).length>110)issues.push("Åpningen er unødvendig lang");
  return {ok:issues.length===0,issues};
}

const results=[];
try{
  await waitForServer();
  console.log("\nLive KI-kvalitetstest – yrke, tariff og naturlig respons\n");
  for(let i=0;i<cases.length;i++){
    const tc=cases[i];
    process.stdout.write(`[${i+1}/${cases.length}] ${tc.id} ${tc.label} ... `);
    try{
      const guidance=await post({situation:tc.situation,topicId:tc.topicId,subtopic:tc.subtopic,occupation:tc.occupation,sectorId:tc.sectorId,employerType:"",employerContext:""});
      const ev=evaluate(tc,guidance);
      results.push({...tc,guidance,...ev});
      console.log(ev.ok?"OK":"SJEKK");
    }catch(error){
      results.push({...tc,ok:false,issues:[error.message],technical:true});
      console.log("TEKNISK FEIL");
    }
    await delay(350);
  }
} finally {
  server.kill("SIGTERM");
}

const outDir=path.join(root,"test-results");
fs.mkdirSync(outDir,{recursive:true});
const stamp=new Date().toISOString().replace(/[:.]/g,"-");
const jsonPath=path.join(outDir,`ai-occupation-${stamp}.json`);
const mdPath=path.join(outDir,`ai-occupation-${stamp}.md`);
fs.writeFileSync(jsonPath,JSON.stringify(results,null,2),"utf8");

const passed=results.filter(r=>r.ok).length;
let md=`# Live KI-kvalitetstest – yrke/tariff\n\nKjørt: ${new Date().toLocaleString("nb-NO")}  \nBestått: ${passed}/${results.length}\n\nFunksjonen er slått på kun i lokal testserver. Produksjonsinnstillingen endres ikke.\n\n`;
for(const r of results){
  md+=`---\n\n## ${r.id} – ${r.ok?"OK":"SJEKK"}\n\n**Formål:** ${r.label}\n\n**Case:** ${r.situation}\n\n`;
  if(r.issues?.length)md+=`**Avvik:**\n${r.issues.map(x=>"- "+x).join("\n")}\n\n`;
  if(r.guidance){
    md+=`**Occupation metadata:** ${JSON.stringify(r.guidance.occupation_context||{})}\n\n`;
    md+=`**Åpning:** ${r.guidance.opening||""}\n\n`;
    md+=`**Spørsmål:**\n${(r.guidance.questions||[]).map(x=>"- "+x).join("\n")}\n\n`;
    md+=`**Faglig/regelverk:** ${r.guidance.legal_hr_note||""}\n\n`;
    md+=`**Neste steg:**\n${(r.guidance.next_steps||[]).map(x=>"- "+x).join("\n")}\n\n`;
  }
}
fs.writeFileSync(mdPath,md,"utf8");

console.log(`\nResultat: ${passed}/${results.length} OK`);
console.log(`Rapport: ${mdPath}`);
console.log(`Detaljer: ${jsonPath}\n`);
process.exit(passed===results.length?0:1);
