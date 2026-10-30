const fs=require("fs");const assert=require("assert");
const s=JSON.parse(fs.readFileSync("data/NATURAL-RESPONSE-STANDARD.json","utf8"));
assert.strictEqual(s.version,1);
assert(Array.isArray(s.rules)&&s.rules.length>=10);
const ids=new Set();
for(const r of s.rules){assert(r.id&&!ids.has(r.id),`duplisert id: ${r.id}`);ids.add(r.id);assert(r.rule);}
for(const id of ["NRS01","NRS02","NRS03","NRS05","NRS07","NRS08","NRS10"]){assert(ids.has(id),`mangler ${id}`);}
assert(s.qualityFailures.includes("robotaktig fast svarmal"));
assert(s.qualityFailures.includes("juridisk korrekt svar uten praktisk lederstøtte"));
console.log(`Natural Response Standard OK: ${s.rules.length} regler`);
