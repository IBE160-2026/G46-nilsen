const vm = require("node:vm");
const fs = require("node:fs");
const assert = require("node:assert/strict");

const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync("src/client/guidance-fallback.js", "utf8"),ctx);
const mod = ctx.window.SamtalestotteGuidanceFallback;
assert.ok(mod && Object.isFrozen(mod));
const cases = [
  ["Oppmøte og punktlighet","oppmøtet den siste tiden"],
  ["Korttidsfravær","fraværet den siste tiden"],
  ["Langvarig fravær","følge deg opp under fraværet"],
  ["Tilbakekomst til arbeid","tilbakekomsten til arbeid"],
  ["Tilrettelegging","arbeidssituasjonen"],
  ["Arbeidsevne og kapasitet","arbeidssituasjonen fungerer"]
];
for(const [classification,expectedOpening] of cases) {
  const result=mod.buildFravaerGuidance(
    {situation:"En anonym medarbeider trenger oppfølging i jobben.",followups:{}},
    {analyzeSituation:()=>({classification}),currentSubtopic:classification});
  assert.ok(Array.isArray(result)&&result.length===5, classification+" sections");
  assert.ok(result[0][1].includes(expectedOpening), classification+" opening");
  assert.ok(result.find(x=>x[0]==="Vær oppmerksom på")?.[1], "attention missing");
}
const g=mod.buildGenericGuidance();
assert.equal(g.length,5);
assert.ok(g[0][1].includes("Start rolig og konkret"));
assert.equal(mod.buildCrossThemeDilemmaGuidance({situation:"Ingen særskilt dilemma."},()=>({special:false})),null);
const cross=mod.buildCrossThemeDilemmaGuidance({situation:"Anonym medarbeider vurderes for opprykk",followups:{}},()=>({special:true}));
assert.equal(cross.length,6);
assert.ok(cross[0][1].includes("karrieremulighet"));
assert.ok(cross[4][1].includes("fraværet alene"));
const dilemmaQuestions = mod.buildFollowupQuestions("Sykefravær og opprykk", ()=>({special:true}));
assert.deepEqual(Array.from(dilemmaQuestions, x=>x.id),["decision","criteria","expectation"]);
assert.equal(dilemmaQuestions[0].question,"Er beslutningen om å vente med opprykket allerede tatt?");
const briefQuestions = mod.buildFollowupQuestions("Medarbeideren er uenig.",()=>({special:false}));
assert.equal(briefQuestions.length,1);
assert.equal(briefQuestions[0].id,"clarify-situation");
assert.equal(briefQuestions[0].multiSelect,true);
const detailedNoGoal = "Medarbeideren har de siste månedene meldt om vansker med arbeidsmengden og kommunikasjonen med leder og resten av avdelingen og det er uklart hva som er blitt sagt tidligere.";
assert.equal(mod.buildFollowupQuestions(detailedNoGoal,()=>({special:false}))[0].id,"goal");
const detailedWithGoal = detailedNoGoal+" Jeg ønsker hjelp til å forberede samtalen.";
assert.equal(mod.buildFollowupQuestions(detailedWithGoal,()=>({special:false})).length,0);
const root=fs.readFileSync("app.js","utf8");
const html=fs.readFileSync("index.html","utf8");
assert.ok(root.includes("localFallbackGuidance.buildFravaerGuidance"));
assert.ok(html.indexOf("src/client/guidance-fallback.js?v=") < html.indexOf("app.js?v="));
console.log("Modularisert lokal reserveflyt: seks fraværstyper, generisk og krysstemadilemma OK");
