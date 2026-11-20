const assert = require("node:assert/strict");
const fs = require("node:fs");

(async () => {
  const { resolveOccupationContext, getOccupationLegalRegistry } = await import("../src/server/occupation-router.js");
  const { sourceTier } = await import("../src/server/help-library.js");
  const map = JSON.parse(fs.readFileSync("data/OCCUPATION-SOURCE-MAP.json", "utf8"));
  const legal = getOccupationLegalRegistry().sources;
  const sectors = map.sectors.filter(s => s.id !== "other");
  assert.equal(sectors.length, 14, "14 fagsektorer pluss «Annet» forventes");
  const ids = new Set(legal.map(s => s.id));

  const scenarios = [
    ["education_childcare","lærer","skolemiljø og aktivitetsplikt","LOVDATA_OPPLAERINGSLOVA_2023"],
    ["health_care","sykepleier","journalplikt og pasientsikkerhet","LOVDATA_HELSEPERSONELLOVEN"],
    ["public_admin_legal","saksbehandler","habilitet ved behandling av en sak","FORVALTNINGSLOVEN"],
    ["defence_police_emergency","politi","integritet og politiansattes yrkesetikk","POLITI_ETHICAL_GUIDELINES"],
    ["industry_production","maskinoperatør","opplæring på arbeidsutstyr og maskin","AT_WORK_EQUIPMENT_REGULATION"],
    ["construction_trades","tømrer","byggherreforskriften og sikkerhet på byggeplass","AT_BUILDING_SITE_COORDINATION"],
    ["aquaculture_fisheries_maritime","oppdrettsoperatør","internkontroll og avvik i havbruk","FISKERIDIR_IK_AQUACULTURE"],
    ["transport_logistics","lastebilsjåfør","kjøre- og hviletid og fartsskriver","VEGVESEN_DRIVING_REST"],
    ["retail_hospitality_service","kokk","mattrygghet og mathygiene på kjøkkenet","FOOD_SERVICE_RULES"],
    ["office_finance_it","utvikler","IKT-sikkerhet og tilgangsstyring","NSM_IKT_GRUNNPRINSIPPER"],
    ["veterinary_animal_health","veterinær","faglig uenighet med kollega, kollegialitet","DNV_VETERINARY_COLLEGIALITY"],
    ["offshore_energy","offshorearbeider","hviletid og fatigue på plattformen","HAVTIL_REST"],
    ["agriculture_nature","bonde","sprøyting med plantevernmidler og opplæring","PLANT_PROTECTION_AUTH"],
    ["aviation","pilot","arbeidstid, hviletid og fatigue i flyging","LUFTFART_FTL"]
  ];
  assert.equal(scenarios.length,sectors.length);
  assert.deepEqual(new Set(scenarios.map(c=>c[0])),new Set(sectors.map(s=>s.id)),
    "Det må finnes en positiv test for hver av de 14 navngitte sektorene");

  for (const [sectorId,occupation,situation,expected] of scenarios) {
    assert(ids.has(expected), sectorId + ": forventet kilde mangler i registeret: " + expected);
    const result = resolveOccupationContext({
      sectorId,occupation,topic:"Sikkerhet og ansvar",situation
    });
    assert(result.occupationRelevant, sectorId + ": fagkontekst ble ikke aktivert");
    assert(result.sourceIds.includes(expected),
      sectorId + ": mangler " + expected + "; valgte " + result.sourceIds.join(", "));

    // Kilder fra en annen sektor må aldri slippe gjennom i valgt fagsektor.
    for (const src of result.legalSources) {
      assert(src.sectors.includes(sectorId) || src.sectors.includes("*"),
        sectorId + ": kildelekkasje fra " + src.id);
    }
  }

  // Negative caser: samme yrker, men en helt ordinær kollegadialog.
  for (const [sectorId,occupation] of scenarios) {
    const result = resolveOccupationContext({
      sectorId,occupation,topic:"Samarbeid og kommunikasjon",
      situation:"To kollegaer skal bli enige om kaffebestilling til et vanlig møte."
    });
    assert.equal(result.occupationRelevant,false,
      sectorId + ": ordinær medarbeidersamtale skal ikke utløse yrkesregelverk");
    assert.deepEqual(result.sourceIds,[]);
  }

  const vet=legal.filter(s=>(s.sectors||[]).includes("veterinary_animal_health"));
  assert(new Set(vet.map(s=>s.authority)).size>=5,
    "Veterinærsektoren må ikke være avhengig av bare Mattilsynet");
  assert(vet.some(s=>s.sourceRole==="primary_law" && s.authority==="Lovdata"));
  assert(vet.some(s=>sourceTier(s)==="professional_framework"));
  assert(vet.some(s=>sourceTier(s)==="research_communication"));

  for (const src of legal) {
    assert(/^https:\/\//.test(src.url||""),src.id+": kilden trenger HTTPS");
    if(src.timeSensitive) assert(/^\d{4}-\d{2}-\d{2}$/.test(src.lastVerified||""),
      src.id+": tidskritiske kilder må ha dokumentert kontrolltidspunkt");
  }

  console.log("Sektordekning OK: 14 positive fagcaser, 14 negative hverdagscaser, kildeavgrensning, veterinærmangfold");
})().catch(error=>{console.error(error);process.exitCode=1});
