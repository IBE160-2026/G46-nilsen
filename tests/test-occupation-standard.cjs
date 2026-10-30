const fs=require("fs"); const assert=require("assert");
const s=JSON.parse(fs.readFileSync("data/OCCUPATION-RESPONSE-STANDARD.json","utf8"));
assert.strictEqual(s.version,1);
assert(Array.isArray(s.principles) && s.principles.length>=12);
const ids=new Set();
for(const p of s.principles){assert(p.id && !ids.has(p.id),`duplisert standard-id: ${p.id}`);ids.add(p.id);assert(p.name&&p.rule);}
for(const required of ["ORS01","ORS02","ORS03","ORS05","ORS06","ORS08","ORS09","ORS11","ORS14"]){assert(ids.has(required),`mangler ${required}`);}
assert(s.responseContract?.whenOccupationIrrelevant?.exclude?.includes("tariffspørsmål"));
assert(s.evaluationSeverities?.critical?.includes("påstått tariffavtale uten bekreftelse"));
console.log(`Occupation Response Standard OK: ${s.principles.length} prinsipper`);