const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const context={window:{}};
vm.runInNewContext(fs.readFileSync("src/client/situation-analysis.js","utf8"),context);
const analysis=context.window.SamtalestotteSituationAnalysis;
assert.ok(analysis && Object.isFrozen(analysis));
const topics=[
 {id:"fravaer-oppfolging",title:"Fravær",keywords:["sykemelding","fravær"],subtopics:[["Langvarig fravær","Sykemelding og tilbakekomst"]]},
 {id:"lonn-utvikling",title:"Lønn",keywords:["opprykk","lønn"],subtopics:[["Karriere","Utviklingsmuligheter"]]}
];
const text="En medarbeider har vært sykemeldt i ett år og vurderes for opprykk. Jeg vil avvente.";
const understanding=analysis.buildDilemmaUnderstanding(text,topics);
assert.equal(understanding.special,true);
assert.equal(understanding.themes.length,2);
assert.ok(understanding.unknowns.length>=2);
assert.equal(analysis.buildDilemmaUnderstanding("Krevende samtale",topics).special,false);
const late=analysis.analyzeSituation("Medarbeideren har kommet for sent flere ganger",topics[0],"Korttidsfravær");
assert.equal(late.classification,"Oppmøte og punktlighet");
const sick=analysis.analyzeSituation("Medarbeideren er sykemeldt i flere måneder",topics[0],"Uavklart");
assert.equal(sick.classification,"Langvarig fravær");
const concern=analysis.analyzeSituation("Jeg tror medarbeideren er lat og har angst",topics[0],"Uavklart");
assert.ok(concern.cautions.length>=2);
assert.equal(analysis.detectConversationThemes("Ingen opplysninger",topics).length,0);
assert.ok(fs.readFileSync("app.js","utf8").includes("situationAnalysis.analyzeSituation"));
console.log("Situasjonsmodul: fler-tema, fravær, punktlighet og forsiktighetssignaler OK");
