const assert = require("node:assert/strict");
(async () => {
const { normalizeSourceUrl, webSources, markdownWebSources, stripInlineSourceLinks, dedupeEvidenceSources } = await import("../src/server/source-normalization.js");
assert.equal(normalizeSourceUrl("https://example.org/a?utm_source=x&b=2&utm_campaign=y#section"),"https://example.org/a?b=2");
assert.equal(normalizeSourceUrl("not a web address"),"not a web address");
const response = { output: [
  { action: { sources: [
    { type:"url",url:"https://example.org/item?utm_medium=mail",title:"Dokument" },
    { type:"url",url:"https://example.org/item",title:"Samme dokument" },
    { type:"file",url:"https://example.org/private",title:"Ikke webkilde" }
  ] } }
]};
const verified=webSources(response);
assert.equal(verified.size,1);
assert.equal(verified.get("https://example.org/item").title,"Samme dokument");
assert.equal(webSources({output:[]}).size,0);
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
const nestedSources = markdownWebSources(malformed,verifiedNested);
assert.equal(nestedSources.length,1,"Dokumenterte webkilder med doble Markdown-lenker skal samles i kildefeltet");
assert.equal(nestedSources[0].url,"https://www.virke.no/a");
assert.equal(markdownWebSources(malformed,new Map()).length,0,"Uverifiserte lenker skal ikke godkjennes som kilder");
console.log("Kildenormalisering: trackingparametre, dokumenterte URLer, kildeavgrensning og deduplisering OK");
})().catch(e=>{console.error(e);process.exitCode=1});
