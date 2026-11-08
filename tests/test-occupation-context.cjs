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
  assert(relevant.prompt.includes("[ID:"), "Yrkes-/sektorkilder må ha eksplisitt kilde-ID for source_ids");
  assert(relevant.prompt.includes("praktiske neste steg"));
  assert(/ikke start med paragrafer/i.test(relevant.prompt));

  const tariffWithoutOccupation=buildOccupationGuidanceContext({
    topic:"Lønn og utvikling",subtopic:"Lønnsutvikling",
    situation:"Medarbeideren ønsker å snakke om lønn."
  });
  assert.strictEqual(tariffWithoutOccupation.enabled,true,"Tariffkontekst skal kunne aktiveres uten valgt yrke");
  assert.strictEqual(tariffWithoutOccupation.agreement.needsEmployerType,true);
  assert(tariffWithoutOccupation.prompt.includes("Arbeidsgivertype mangler"));

  const tariff=buildOccupationGuidanceContext({
    occupation:"sykepleier",sectorId:"health_care",
    topic:"Lønn og utvikling",subtopic:"Lønnsutvikling",
    situation:"Medarbeideren ønsker å snakke om lønn."
  });
  assert.strictEqual(tariff.agreement.needsEmployerType,true);
  assert(tariff.prompt.includes("Privat, kommune/fylkeskommune, stat, helseforetak"));

  const stateTariff=buildOccupationGuidanceContext({
    occupation:"rådgiver",sectorId:"public_admin_legal",employerType:"state",
    topic:"Lønn og utvikling",subtopic:"Lønnsutvikling",
    situation:"Lønn og lokale forhandlinger er tema."
  });
  assert(stateTariff.prompt.includes("STATE_HTA_2026_2028"), "Statlig HTA-kilde skal tilbys som kandidat når tariff er relevant");
  assert(stateTariff.prompt.includes("må bekreftes"), "Tariffkilde må ikke presenteres som automatisk gjeldende");

  console.log("Occupation context builder OK");
})().catch(err=>{console.error(err);process.exit(1);});
