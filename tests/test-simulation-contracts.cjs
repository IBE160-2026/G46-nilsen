"use strict";
const assert = require("node:assert/strict");

(async () => {
  const {
    simulationStyleInstructions: styles,
    simulationFidelityInstructions: modes,
    sanitizeSimulationTurns,
    simulationContextText
  } = await import("../src/server/simulation-contracts.js");

  assert.deepEqual(sanitizeSimulationTurns(null), [], "Non-array input is empty");
  assert.deepEqual(sanitizeSimulationTurns({turns:[]}), [], "Object cannot masquerade as turns");
  const all = Array.from({length: 30}, (_,i)=>({role:i%2===0?"leader":"employee",text:" turn "+i+" "}));
  const last = sanitizeSimulationTurns(all);
  assert.equal(last.length,24,"Only the last 24 turns are allowed");
  assert.equal(last[0].text,"turn 6","Earlier context must be discarded");
  assert.equal(last.at(-1).text,"turn 29");
  assert.equal(sanitizeSimulationTurns([{role:"superuser",text:" message " }])[0].role,"leader",
    "Unknown speaker must never gain a third role");
  assert.deepEqual(sanitizeSimulationTurns([{role:"employee",text:"  "},{role:"employee",text:" ok "}]),
    [{role:"employee",text:"ok"}],"Whitespace-only turns are removed");
  assert.equal(sanitizeSimulationTurns([{text:"x".repeat(5000)}])[0].text.length,4000,
    "Turn text must be bounded");
  assert.ok(modes.factual.includes("IKKE etablere nye verifiserbare fakta"),
    "Factual mode must forbid inventing facts");
  assert.ok(modes.challenge.includes("simulerte rollespillfakta"),
    "Challenge mode must clearly distinguish roleplay from facts");
  assert.ok(modes.challenge.includes("Ikke finn på diagnose"),
    "Even challenge mode must constrain sensitive inventions");
  assert.ok(styles.emotional && styles.defensive && styles.surprise,
    "Distinct training personas must remain available");
  const sample = {situation:"Fiktiv utfordring",analysis:{facts:["En opplysning"]},
    followups:{meeting:"unknown"},guidance:{opening:"Hei"},style:"defensive",
    turns:[{role:"leader",text:"Kan vi snakke?"}]};
  const factual = simulationContextText({...sample,fidelity:"factual"});
  const challenge = simulationContextText({...sample,fidelity:"challenge",style:"surprise"});
  assert.ok(factual.includes(modes.factual)&&factual.includes(styles.defensive));
  assert.ok(challenge.includes(modes.challenge)&&challenge.includes(styles.surprise));
  assert.ok(!factual.includes(modes.challenge),"Factual mode must not include challenge rules");
  assert.ok(factual.includes("Kan vi snakke?") && factual.includes("Fiktiv utfordring"),
    "Prompt must include bounded case and conversation context");
  const fallback = simulationContextText({...sample,fidelity:"unknown",style:"unknown"});
  assert.ok(fallback.includes(modes.factual)&&fallback.includes(styles.open),
    "Unknown values must fall back to safe defaults");
  assert.ok(simulationContextText({situation:"x".repeat(13000)}).length < 16000,
    "Situation text is bounded in simulation prompt");
  console.log("Simulation contracts: sanitization, bounded context, persona and fidelity modes OK");
})().catch(error=>{ console.error(error); process.exitCode=1; });
