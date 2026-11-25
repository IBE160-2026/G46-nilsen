// Test brukergrensesnittets faktiske kilde-merking og historikk-normalisering.
// Kjører utvalgte rene klientfunksjoner i isolert VM, uten DOM/nettverk/KI.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const vm=require("node:vm");

const code=fs.readFileSync(path.resolve(__dirname,"../app.js"),"utf8");
const getFn=name=>{
  const anchor="function "+name+"(";
  const from=code.indexOf(anchor);
  assert(from>=0,"Klientfunksjon mangler: "+name);
  const next=code.indexOf("\nfunction ",from+anchor.length);
  assert(next>from,"Finner ikke slutt på klientfunksjon: "+name);
  return code.slice(from,next);
};
const functions=[
  getFn("evidenceRoleLabel"),
  getFn("normalizeLegalClaimReview"),
  getFn("legalClaimReviewNote"),
  getFn("normalizeContinuationSources"),
  getFn("renderContinuationEvidence")
].join("\n");
const htmlEscape=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;")
  .replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
const ctx=vm.createContext({ URL,escapeHtml:htmlEscape });
vm.runInContext(functions,ctx);
const {evidenceRoleLabel,normalizeLegalClaimReview,legalClaimReviewNote,normalizeContinuationSources,renderContinuationEvidence}=ctx;
const src=[
  {title:"Statsansatteloven",author:"Lovdata",url:"https://lovdata.no/lov/2017-06-16-67",evidenceRole:"scope_reference"},
  {title:"Arbeidsmiljøloven",author:"Lovdata",url:"https://lovdata.no/lov/2005-06-17-62",evidenceRole:"model_selected"},
  {title:"NAV fra nettsøk",author:"nav.no",url:"https://nav.no/arbeidsgiver",evidenceRole:"provider_url"}
];
const stored=normalizeContinuationSources(src);
assert.equal(stored.length,3);
assert.deepEqual(Array.from(stored.map(s=>s.evidenceRole)),
  ["scope_reference","model_selected","provider_url"],
  "Proveniens skal bevares gjennom lagring og historikk");
assert.match(evidenceRoleLabel(stored[0]),/ikke valgt av KI/);
assert.match(evidenceRoleLabel(stored[1]),/Valgt fra kildebanken av KI/);
assert.match(evidenceRoleLabel(stored[2]),/Nettsøktreff/);
const rendered=renderContinuationEvidence(stored);
assert.match(rendered,/ikke bekreftelse på at alle påstander/);
assert.match(rendered,/Til kontroll – lagt til av systemet/);
assert.match(rendered,/Valgt fra kildebanken av KI/);
assert.match(rendered,/Nettsøktreff – innhold ikke faktasjekket/);
assert(!rendered.includes('faktasjekket kildegrunnlag'),'Påstand om gjennomført faktasjekk er ikke tillatt');
assert.match(evidenceRoleLabel({}),/ikke faktasjekket/,"Eldre lagrede samtaler må ikke fremstå som verifisert");
assert.equal(normalizeContinuationSources([{url:"javascript:alert(1)",title:"X"}]).length,0,
  "Utrygge lenkeskjema må ikke slippes inn i kildelisten");
const unsafe=renderContinuationEvidence([
  {url:"https://example.org/valid",title:"<script>alert(1)</script>",evidenceRole:"model_selected"}
]);
assert(!unsafe.includes("<script>"),"Kildetittel skal escapes");
assert(code.includes("Kilder til kontroll (ikke faktasjekket)"),
  "Utskrift av oppfølgingsråd skal vise kildeforbehold");
assert(code.includes("source-verification-note") &&
  code.includes("Kilder å kontrollere:"),
  "Hovedrådet må vise tydelig forklaring av kildegrunnlagets begrensning");
const unreviewed={
  needsManualReview:true,possibleLegalClaimCount:1,claimToSourceChecked:false
};
assert.match(legalClaimReviewNote(unreviewed),/Kontroller rettslige påstander/);
assert.match(renderContinuationEvidence([],unreviewed),/Kontroller rettslige påstander/,
  "Også et oppfølgingssvar uten kilder må vise klar kildekontrolladvarsel");
assert.match(renderContinuationEvidence(src,unreviewed),/Kontroller rettslige påstander/,
  "Også et oppfølgingssvar MED kilder må vise samme forbehold");
assert.equal(legalClaimReviewNote({needsManualReview:false}),"",
  "Vanlig samtalestøtte skal ikke få ekstra alarmtekst");
assert.equal(normalizeLegalClaimReview({needsManualReview:true,possibleLegalClaimCount:99,
  claimToSourceChecked:true}).claimToSourceChecked,false,
  "Ingen klientdata kan gjøre uverifisert kilde til faktasjekket");
assert.equal(normalizeLegalClaimReview({needsManualReview:true,possibleLegalClaimCount:99})
  .possibleLegalClaimCount,20,"Klienten skal beholde avgrensede metadatastørrelser");
assert(code.includes("intro.textContent = guidance.legal_claim_review?.needsManualReview"),
  "Rettslig kontrollvarsel må også vises over alle sammenfoldede rådseksjoner");
assert(code.includes("legalReviewNote + String(guidance.legal_hr_note"),
  "Første råd må vise en eksplisitt varseltekst rett over faglig regelverk");
assert(code.includes("setConversationTurnClaimReview(assistant, payload.legal_claim_review)") &&
  code.includes("turn.claimReview = normalizeLegalClaimReview(") &&
  code.includes("renderContinuationEvidence(turn.sources, turn.claimReview)"),
  "Oppfølgingsvarsel skal lagres og vises igjen etter historikkinnlasting");
console.log("KILDEPROVENIENS UI OK: modellvalgt, regeltilføyd, nettsøk, lagret historikk, utskrift og XSS; 0 KI-kall");
