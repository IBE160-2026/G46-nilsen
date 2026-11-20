// Kontrollerer det viktige skillet mellom eksplisitt avkreftet risiko
// og faktisk risiko i en SENERE setning / etter en kontrast.
const assert=require("node:assert/strict");
(async()=>{
  const {containsNonNegatedContextTerm}=await import("../src/server/negation-context.js");
  const {shouldRetainCuratedSources}=await import("../src/server/source-retention.js");
  const {resolveOccupationContext}=await import("../src/server/occupation-router.js");

  const cases=[
    {
      id:"separate-sentences",
      situation:"Det var ingen sikkerhetshendelse i går. I dag skal en tømrer arbeide i høyden uten verneutstyr.",
      retain:true,occupation:true,term:"sikkerhetshendelse",termPresent:false
    },
    {
      id:"contrasting-clause",
      situation:"Ingen sikkerhetshendelser er registrert, men nå er det oppdaget en maskin med ødelagt vern.",
      retain:true,occupation:true,term:"maskin",termPresent:true
    },
    {
      id:"ignored-safety-rule",
      situation:"Medarbeideren har ikke fulgt sikkerhetsrutinen ved arbeid i høyden.",
      retain:true,occupation:true,term:"sikkerhet",termPresent:true
    },
    {
      id:"missing-ppe",
      situation:"Det finnes ikke verneutstyr tilgjengelig på byggeplassen.",
      retain:true,occupation:true,term:"verneutstyr",termPresent:true
    },
    {
      id:"no-incident",
      situation:"Det foreligger ingen sikkerhetshendelse eller maskinproblemer. Vi skal bare avklare arbeidsdeling.",
      retain:false,occupation:false,term:"sikkerhetshendelse",termPresent:false
    },
    {
      id:"negated-topic",
      situation:"To tømrere diskuterer oppgavefordeling, uten at sikkerhet er tema.",
      retain:false,occupation:false,term:"sikkerhet",termPresent:false
    },
    {
      id:"not-about-risks",
      situation:"Det er ikke snakk om sikkerhet, verneutstyr, høydearbeid eller andre HMS-forhold. Kun kommunikasjon.",
      retain:false,occupation:false,term:"verneutstyr",termPresent:false
    },
    {
      id:"compound-no-problem",
      situation:"En utvikler leverer gjentatte ganger senere enn avtalt, uten sikkerhets- eller personvernproblem.",
      retain:false,occupation:false,term:"sikkerhet",termPresent:false
    },
    {
      id:"risk-not-relevant",
      situation:"Vi avklarer hvem som bestiller materiell. Sikkerhet er ikke et tema i denne saken.",
      retain:false,occupation:false,term:"sikkerhet",termPresent:false
    }
  ];
  const neutralContext={occupation:{occupationRelevant:false},agreement:{relevant:false,suggestions:[]}};
  for(const tc of cases){
    const retained=shouldRetainCuratedSources({
      requestedTopic:"Samarbeid og kommunikasjon",resolvedTopic:"Samarbeid og kommunikasjon",
      subtopic:"Arbeidsdeling",situation:tc.situation,occupationContext:neutralContext
    });
    const routed=resolveOccupationContext({
      occupation:"tømrer",sectorId:"construction_trades",employerType:"private",
      topic:"Samarbeid og kommunikasjon",subtopic:"Arbeidsdeling",situation:tc.situation
    });
    assert.equal(retained,tc.retain,tc.id+": feil kildebehov");
    assert.equal(routed.occupationRelevant,tc.occupation,tc.id+": feil yrkesrelevans");
    assert.equal(containsNonNegatedContextTerm(tc.situation,tc.term),tc.termPresent,
      tc.id+": feil semantisk scope for "+tc.term);
  }
  assert.equal(containsNonNegatedContextTerm(
    "Det var ingen sikkerhetshendelse. Nå er det en alvorlig sikkerhetshendelse.",
    "sikkerhetshendelse"
  ),true,"En ny hendelse må ikke nøytraliseres av gammel negasjon");
  assert.equal(containsNonNegatedContextTerm(
    "Ingen personvernbrudd i forrige måned; nå er personvern faktisk brutt.",
    "personvern"
  ),true,"Semikolon må skille konkrete hendelser");
  console.log("KILDE/SEKTOR-NEGASJON OK: "+cases.length+
    " grense-/kontrastcaser, 2 gjentatt-risiko-tester; ingen KI-kall");
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
