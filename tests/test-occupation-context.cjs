const assert=require("assert");
(async()=>{
  const { buildOccupationGuidanceContext }=await import("../src/server/occupation-context.js");

  const none=buildOccupationGuidanceContext({topic:"Livssituasjoner",situation:"Samlivsbrudd"});
  assert.strictEqual(none.enabled,false);
  assert.strictEqual(none.prompt,"");

  const irrelevant=buildOccupationGuidanceContext({
    occupation:"sykepleier",sectorId:"health_care",
    topic:"Livssituasjoner",subtopic:"Samlivsbrudd",
    situation:"Medarbeideren har samlivsbrudd."
  });
  assert.strictEqual(irrelevant.enabled,true);
  assert.strictEqual(irrelevant.occupation.occupationRelevant,false);
  assert(irrelevant.prompt.includes("ikke materiell"));
  assert(!irrelevant.prompt.includes("Helsedirektoratet:"));

  const relevant=buildOccupationGuidanceContext({
    occupation:"sykepleier",sectorId:"health_care",
    topic:"Sikkerhet og ansvar",subtopic:"Påvirket på jobb",
    situation:"Sykepleieren virker påvirket under vakt med pasientansvar."
  });
  assert.strictEqual(relevant.occupation.occupationRelevant,true);
  assert(relevant.prompt.includes("Helsedirektoratet"));
  assert(relevant.prompt.includes("praktiske neste steg"));
  assert(relevant.prompt.includes("ikke start med paragrafer"));

  const tariff=buildOccupationGuidanceContext({
    occupation:"sykepleier",sectorId:"health_care",
    topic:"Lønn og utvikling",subtopic:"Lønnsutvikling",
    situation:"Medarbeideren ønsker å snakke om lønn."
  });
  assert.strictEqual(tariff.agreement.needsEmployerType,true);
  assert(tariff.prompt.includes("Privat, kommune/fylkeskommune, stat, helseforetak"));

  console.log("Occupation context builder OK");
})().catch(err=>{console.error(err);process.exit(1);});
