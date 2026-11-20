const assert = require("node:assert/strict");
(async () => {
const { normalizeSourceUrl, webSources, markdownWebSources, stripInlineSourceLinks, dedupeEvidenceSources } = await import("../src/server/source-normalization.js");
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
