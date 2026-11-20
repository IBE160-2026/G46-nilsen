// Kostnadsfri runtime-regresjon for ekte benchmark-evaluation.js.
// Ikke live KI, ingen nettverkskall, ingen persondata eller database.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const vm=require("node:vm");

const source=fs.readFileSync("src/client/benchmark-evaluation.js","utf8");
let attempted=0;
const context={
  fetch(){attempted++;throw Error("Benchmark helper must never use network");},
  document:{get(){throw Error("Benchmark helper must not access DOM");}},
  setTimeout(){throw Error("Benchmark helper must not schedule provider calls");}
};
vm.runInNewContext(source,context,{filename:"src/client/benchmark-evaluation.js",timeout:1000});
const {selectCases,evaluateOpening}=context.SamtalestotteBenchmarkEvaluation;
assert.equal(typeof selectCases,"function");
assert.equal(typeof evaluateOpening,"function");

const cases=[
  {id:"a1",topicId:"a"},{id:"a2",topicId:"a"},{id:"a3",topicId:"a"},
  {id:"b1",topicId:"b"},{id:"b2",topicId:"b"},
  {id:"c1",topicId:"c"}
];
const config={cases};
assert.deepEqual(Array.from(selectCases(config,3),x=>x.id),["a1","b1","c1"],"First round must represent each topic");
assert.deepEqual(Array.from(selectCases(config,4),x=>x.id),["a1","b1","c1","a2"],"Additional cases must be distributed round-robin");
assert.deepEqual(Array.from(selectCases(config,6),x=>x.id),["a1","b1","c1","a2","b2","a3"]);
assert.deepEqual(Array.from(selectCases(config,999),x=>x.id),cases.map(x=>x.id),"All cases should keep original order when count exceeds pool");
assert.equal(selectCases({cases:[]},10).length,0);
assert.equal(selectCases(null,10).length,0);
assert.equal(selectCases(config,0).length,0);
assert.equal(cases.length,6,"selection must never mutate the caller's bank");

const good={opening_checks:{
  max_words:22,
  forbidden_patterns:["taushetsbrudd","feil(?:formulering"],
  required_patterns_any:["samarbeid","arbeidshverdagen"]
}};
const valid=evaluateOpening(good,{opening:"Jeg ønsker å snakke om samarbeidet og høre hvordan du opplever arbeidshverdagen."});
assert.equal(valid.ok,true);
assert.equal(valid.issues.length,0);
assert.equal(valid.notes.length,0);
assert.equal(valid.words,13);

const missing=evaluateOpening(good,{});
assert.equal(missing.ok,false);
assert.ok(Array.from(missing.issues).some(x=>x.includes("Mangler forslag")));
assert.ok(Array.from(missing.notes).some(x=>x.includes("menneskelig")));

const tooLong=evaluateOpening({opening_checks:{max_words:3}},{opening:"Jeg vil gjerne høre mer om hvordan du har det."});
assert.equal(tooLong.ok,false);
assert.ok(Array.from(tooLong.issues).some(x=>x.includes("For lang åpning")));

const managerInstruction=evaluateOpening({}, {opening:"Du bør kontakte HR før du gjør noe."});
assert.equal(managerInstruction.ok,false);
assert.ok(Array.from(managerInstruction.issues).some(x=>x.includes("instruksjoner")));

const manySentences=evaluateOpening({},{opening:"Hei. En. To. Tre. Fire."});
assert.equal(manySentences.ok,false);
assert.ok(Array.from(manySentences.issues).some(x=>x.includes("For mange setninger")));

const forbidden=evaluateOpening({opening_checks:{forbidden_patterns:["mekanisk","[ugyldig"],max_words:65}},
  {opening:"Her er en mekanisk åpning."});
assert.equal(forbidden.ok,false);
assert.ok(Array.from(forbidden.issues).some(x=>x.includes("mekanisk")));
const noteOnly=evaluateOpening({opening_checks:{required_patterns_any:["arbeidsmiljø"],max_words:65}},
  {opening:"Jeg lurer på hvordan du opplever situasjonen."});
assert.equal(noteOnly.ok,true,"Missing soft phrase matches should not fail the golden case");
assert.equal(noteOnly.issues.length,0);
assert.equal(noteOnly.notes.length,1);
assert.equal(attempted,0,"Pure benchmark helpers performed an unexpected network call");
console.log("Benchmark evaluation: round-robin, original order, no network, golden opening checks, soft notes: OK");
