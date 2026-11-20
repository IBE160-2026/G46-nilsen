const assert = require("node:assert/strict");
(async () => {
  const { historyPayload, rowToHistory } = await import("../src/server/history-contracts.js");
  const longText = "X".repeat(21000);
  const turns = Array.from({length:44},(_,i)=>({role:i%2?"employee":"leader",text:"A".repeat(5200)}));
  const item=historyPayload({
    title:"T".repeat(150), topic:"P".repeat(90), subtopic:"S".repeat(120),
    situation:longText,
    analysis:{summary:"bare anonym tekst"}, guidance:{opening:"Hei"},
    conversation:turns, simulation:{mode:"solo",style:"open",turns,feedback:{ok:true}}
  });
  assert.equal(item.title.length,120);
  assert.equal(item.topic.length,80);
  assert.equal(item.subtopic.length,100);
  assert.equal(item.situation.length,20000);
  assert.equal(item.conversation.length,40);
  assert.equal(item.simulation.turns.length,40);
  assert.equal(item.simulation.turns[0].text.length,5000);
  assert.equal(item.simulation.turns[0].role,"leader");
  assert.equal(historyPayload().title,"Samtale uten tittel");
  assert.equal(historyPayload({simulation:null}).simulation,null);
  const restored = rowToHistory({
    id:"00000000-0000-4000-8000-000000000001", title:"", content:JSON.stringify(item),
    created_at:"2026-11-18T00:00:00Z",updated_at:"2026-11-18T01:00:00Z"
  });
  assert.equal(restored.id,"00000000-0000-4000-8000-000000000001");
  assert.equal(restored.title,item.title);
  assert.equal(restored.createdAt,"2026-11-18T00:00:00Z");
  assert.equal(restored.updatedAt,"2026-11-18T01:00:00Z");
  const invalid = rowToHistory({id:3,title:"",content:"{invalid json",created_at:"a",updated_at:"b"});
  assert.equal(invalid.title,"Samtale uten tittel");
  assert.equal(invalid.id,"3");
  console.log("Historikkkontrakter: avgrensning, simulering, JSON-feil og mapping: OK");
})().catch(err=>{ console.error(err);process.exitCode=1 });
