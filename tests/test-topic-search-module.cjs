const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const ctx = { window: {} };
vm.runInNewContext(fs.readFileSync("src/client/topic-search.js","utf8"),ctx);
const search = ctx.window.SamtalestotteTopicSearch;
assert.ok(search && Object.isFrozen(search));
assert.equal(search.normalizeSearchText("  Sykefravær   og    oppmøte  "),"sykefravær og oppmøte");
const data = [
  { id:"fravaer-oppfolging",title:"Fravær og oppfølging",keywords:["fravær","oppmøte"],subtopics:[["Oppmøte og punktlighet","Avklar forventning om tidspunkt"],["Langvarig fravær","Oppfølging av sykefravær"]]},
  { id:"prestasjon-utvikling",title:"Prestasjon og utvikling",keywords:["resultat"],subtopics:[["Måloppnåelse","Resultater og kvalitet"]]},
  { id:"samarbeid-kommunikasjon",title:"Samarbeid og kommunikasjon",keywords:["kommunikasjon"],subtopics:[["Samarbeid","Konflikt og dialog"]]}
];
let found=search.suggestTopics("Medarbeideren kommer for sent til jobb",data);
assert.equal(found[0].topic.id,"fravaer-oppfolging");
found=search.suggestTopics("En sak med lønnsoppgjør og prestasjon",data);
assert.equal(found[0].topic.id,"prestasjon-utvikling");
const topic=data[0];
assert.ok(search.scoreSubtopicForTopic(topic,topic.subtopics[0],"kommer for sent") > search.scoreSubtopicForTopic(topic,topic.subtopics[1],"kommer for sent"));
assert.ok(search.scoreSubtopicForTopic(topic,topic.subtopics[1],"sykmeldt i måneder") > search.scoreSubtopicForTopic(topic,topic.subtopics[0],"sykmeldt i måneder"));
assert.equal(search.scoreTopic(topic,""),0);
assert.equal(search.scoreTopic(topic,"for sent"),search.scoreTopic(topic,"  FOR  SENT "));
const app = fs.readFileSync("app.js","utf8");
assert.ok(app.includes("topicSearch.suggestTopics(query, topics)"),"Modulen er ikke koblet til eksisterende brukervalg");
console.log("Lokal temasøkmodul: aliaser, fravær, prestasjon og undertemarangering OK");
