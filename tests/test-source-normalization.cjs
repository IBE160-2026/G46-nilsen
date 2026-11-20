const assert = require("node:assert/strict");
(async () => {
const { normalizeSourceUrl, webSources, verifiedSupplementarySources, evidenceProvenance, markdownWebSources, stripInlineSourceLinks, stripGuidanceInlineLinks, dedupeEvidenceSources } = await import("../src/server/source-normalization.js");
assert.equal(normalizeSourceUrl("https://example.org/a?utm_source=x&b=2&utm_campaign=y#section"),"https://example.org/a?b=2");
assert.equal(normalizeSourceUrl("not a web address"),"not a web address");
const response = { output: [
  { type:"web_search_call", action: { sources: [
    { type:"url",url:"https://example.org/item?utm_medium=mail",title:"Dokument" },
    { type:"url",url:"https://example.org/item",title:"Samme dokument" },
    { type:"file",url:"https://example.org/private",title:"Ikke webkilde" }
  ] } }
]};
const verified=webSources(response);
assert.equal(verified.size,1);
assert.equal(verified.get("https://example.org/item").title,"Samme dokument");
assert.equal(webSources({output:[]}).size,0);
assert.equal(webSources({output:[{type:"function_call",action:{sources:[
  {type:"url",url:"https://fabricated.example/authority",title:"Ikke nettsøk"}
]}}]}).size,0,
  "Kildeobjekter fra andre verktøykall må aldri telles som søkebekreftelser");
assert.equal(webSources({output:[{type:"web_search_call",action:{sources:{url:"https://fake.example"}}}]}).size,0,
  "Feilformet kildeliste skal ikke bli godkjente kilder");
const message="Se [myndighetskilde](https://example.org/item?utm_medium=mail) og [annen](https://notverified.example/x).";
const sources=markdownWebSources(message,verified);
assert.equal(sources.length,1,"Kun verifisert URL skal følge med");
assert.equal(sources[0].url,"https://example.org/item");
assert.equal(stripInlineSourceLinks("Les https://falsk.example/lov og gå videre."),
  "Les og gå videre.","Rå URL-er må aldri slippe gjennom kilderensingen");
assert.equal(stripInlineSourceLinks("Se (https://falsk.example/lov) og <https://falsk.example/anna>."),
  "Se og .","Rå URL-er i parentes eller autolenker skal fjernes");
assert.equal(stripInlineSourceLinks("Ikke stol på www.falsk.example/guide."),
  "Ikke stol på","www-lenker er også uverifiserte kildehenvisninger");
const sourceText = "Se https://falsk.example/lov for flere råd.";
const cleanGuidance=stripGuidanceInlineLinks({
  opening:sourceText,
  questions:["Hva tenker du?",sourceText],
  reactions:[{reaction:sourceText,why_plausible:sourceText,leader_response:sourceText}],
  attention:[sourceText],check_before_meeting:[sourceText],next_steps:[sourceText],
  legal_hr_note:sourceText,
  source_ids:["VALID_ID"],
  supplementary_sources:[{url:"https://valid.example/law"}]
});
for(const key of ["opening","questions","reactions","attention","check_before_meeting","next_steps","legal_hr_note"]){
  assert(!JSON.stringify(cleanGuidance[key]).includes("falsk.example"),key+": modellen fikk bevare URL i visningsfeltet");
}
assert.deepEqual(cleanGuidance.source_ids,["VALID_ID"],"Kilde-ID-er skal ikke renses vekk");
assert.equal(cleanGuidance.supplementary_sources[0].url,"https://valid.example/law",
  "Strukturerte kilder skal fortsatt vises separat");
const stripped=stripInlineSourceLinks(message);
assert.ok(!stripped.includes("](http"),"Lenker er ikke fjernet fra visningsteksten");
assert.ok(stripped.includes("myndighetskilde"));
assert.equal(dedupeEvidenceSources([
 {url:"https://example.org/item?utm_source=test"},{url:"https://example.org/item#fragment"},{id:"NOE",title:"Uten URL"},
 {id:"NOE",title:"Uten URL"}
]).length,2);
const malformed = "Først hør begge sider. ([virke.no]([https://www.virke.no/a?utm_source=openai](https://www.virke.no/a?utm_source=openai)))";
assert.equal(stripInlineSourceLinks(malformed),"Først hør begge sider.","Modellens doble Markdown-lenker skal fjernes fra svarteksten");
const verifiedNested = new Map([["https://www.virke.no/a", {title:"Arbeidsgiverveiledning",url:"https://www.virke.no/a"}]]);
const escapedMalformed = "Sjekk dette. ([virke.no]\\([https://www.virke.no/a?utm_source=openai](https://www.virke.no/a?utm_source=openai)))";
assert.equal(stripInlineSourceLinks(escapedMalformed),"Sjekk dette.","Backslash i doble kildehenvisninger må fjernes sammen med lenken");
assert.equal(markdownWebSources(escapedMalformed,verifiedNested).length,1,"Ekte kilde i escaped dobbel Markdown må gjenkjennes");
const nestedSources = markdownWebSources(malformed,verifiedNested);
assert.equal(nestedSources.length,1,"Dokumenterte webkilder med doble Markdown-lenker skal samles i kildefeltet");
assert.equal(nestedSources[0].url,"https://www.virke.no/a");
assert.equal(markdownWebSources(malformed,new Map()).length,0,"Uverifiserte lenker skal ikke godkjennes som kilder");
const providerAnnotations = webSources({ output:[
  {type:"web_search_call", action:{sources:[
    {type:"url",url:"https://www.dmp.no/veterinermedisin?utm_source=ai",title:"Veterinærmedisin"},
    {type:"file",url:"https://example.com/private",title:"Ikke nettkilde"},
    {type:"url",url:"javascript:alert(1)",title:"Ikke trygt"}
  ]}},
  {type:"message", content:[{type:"output_text",annotations:[
    {type:"url_citation",url:"https://www.vetinst.no/fagomrader#smitte",title:"Fagområder"},
    {type:"file_citation",url:"https://not-verified.example/no"},
    {type:"file_citation",url_citation:{url:"https://not-verified.example/fake",title:"Feil type"}},
    {type:"url_citation",url:"file:///etc/passwd",title:"Ikke nettlenke"}
  ]}]}
]});
assert.deepEqual([...providerAnnotations.keys()], [
  "https://www.dmp.no/veterinermedisin",
  "https://www.vetinst.no/fagomrader"
],"Bare offisielle søkekildeobjekter og URL-annotasjoner skal bli kildegrunnlag");
assert.equal(markdownWebSources("Kilde [ukjent](https://ikke-verifisert.example) og [DMP](https://www.dmp.no/veterinermedisin)",providerAnnotations).length,1);

const suggested = verifiedSupplementarySources([
  {url:"https://www.dmp.no/veterinermedisin?utm_source=untrusted",title:"FALSK LOV",author:"Regjeringen",year:"2027",type:"bindende lov"},
  {url:"https://www.dmp.no/veterinermedisin",title:"Duplikat"},
  {url:"https://unverified.example/law",title:"Oppdiktet lov",author:"Lovdata"},
  {url:"https://www.vetinst.no/fagomrader#details",title:"Feilaktig etikett"},
  {url:"javascript:alert(1)",title:"Skadelig"}
],providerAnnotations);
assert.equal(suggested.length,2,"Bare dokumenterte unike nettsøk kan supplere kildelisten");
const provenance = evidenceProvenance({output:[
  {type:"web_search_call",action:{sources:[{type:"url",url:"https://www.dmp.no/veterinermedisin",title:"Veterinærmedisin"}]}},
  {type:"message",content:[{annotations:[{type:"url_citation",url:"https://www.vetinst.no/fagomrader",title:"Fagområder"}]}]}
]},["DNV_VETERINARY_COLLEGIALITY"],suggested);
assert.deepEqual(provenance,{
  webSearchPerformed:true,providerUrlCount:2,selectedCuratedSourceCount:1,visibleEvidenceCount:2,contentVerified:false
},"Søk og synlige kilder må rapporteres uten å påstå at innholdet er fagkontrollert");
assert.equal(evidenceProvenance({output:[]}).webSearchPerformed,false,
  "Et vanlig KI-svar er ikke bevis for faktisk nettsøk");

assert.deepEqual(suggested[0],{
  title:"Veterinærmedisin",author:"dmp.no",year:"",type:"nettkilde",
  url:"https://www.dmp.no/veterinermedisin"
},"Språkmodellen må ikke kunne oppgradere et søkeresultat til bindende lov eller dikte opp forfatter");
assert.deepEqual(suggested[1],{
  title:"Fagområder",author:"vetinst.no",year:"",type:"nettkilde",
  url:"https://www.vetinst.no/fagomrader"
});
assert.deepEqual(verifiedSupplementarySources([{url:"https://unverified.example"}],providerAnnotations),[]);
assert.deepEqual(verifiedSupplementarySources([{url:"https://www.dmp.no/veterinermedisin"}],providerAnnotations,0),[]);
assert.deepEqual(verifiedSupplementarySources(null,providerAnnotations),[]);
const nestedCitation = webSources({output:[{type:"message",content:[{annotations:[
  {url_citation:{url:"https://example.org/godkjent",title:"Eldre format"}}
]}]}]});
assert.equal(nestedCitation.size,1,"Nestet URL-annotasjon uten type beholdes for kompatibilitet");
const server = require("node:fs").readFileSync("server.js","utf8");
assert(server.includes('"web_search_call.action.sources"'),"Responses-kall må eksplisitt be om søkekilder");
assert(server.includes('AI_MODELS[modelUsed]?.provider === "openai"'),"Provider-spesifikke kildeparametre må avgrenses til OpenAI");
assert(server.includes('evidence_sources: evidenceSources'),"Kilder fra oppfølging må faktisk returneres til klienten");
console.log("Kildenormalisering: trackingparametre, dokumenterte URLer, kildeavgrensning og deduplisering OK");
})().catch(e=>{console.error(e);process.exitCode=1});
