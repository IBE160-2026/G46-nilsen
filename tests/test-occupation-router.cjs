const fs = require("fs");
const assert = require("assert");

(async () => {
  const benchmark = JSON.parse(fs.readFileSync("data/OCCUPATION-BENCHMARK-CASES.json", "utf8"));
  const map = JSON.parse(fs.readFileSync("data/OCCUPATION-SOURCE-MAP.json", "utf8"));
  const registry = JSON.parse(fs.readFileSync("data/OCCUPATION-LEGAL-SOURCES.json", "utf8"));
  const router = await import("../src/server/occupation-router.js");

  assert.strictEqual(map.selectionPolicy.occupationOptional, true, "Yrke skal være valgfritt");
  assert(map.sectors.some(s => s.id === "other" && s.freeText), "Annet med fritekst mangler");
  assert(registry.sources.length >= 10, "For få autoritative regelverkskilder");

  const noSelection = router.resolveOccupationContext({
    topic: "Livssituasjoner",
    subtopic: "Samlivsbrudd",
    situation: "En medarbeider går gjennom et samlivsbrudd."
  });
  assert.strictEqual(noSelection.selected, false);
  assert.strictEqual(noSelection.occupationRelevant, false);
  assert.deepStrictEqual(noSelection.sourceIds, []);

  const salmon = router.classifyOccupationLocally("lakseoppdrett");
  assert.strictEqual(salmon.matched, true);
  assert.strictEqual(salmon.ambiguous, false);
  assert.strictEqual(salmon.sectorId, "aquaculture_fisheries_maritime");

  const workshop = router.classifyOccupationLocally("verksted");
  assert.strictEqual(workshop.matched, false);
  assert.strictEqual(workshop.ambiguous, true, "Tvetydige aliases skal ikke rutest vilkårlig");
  assert(workshop.candidates.length >= 2);

  const unknown = router.classifyOccupationLocally("bibliotekar");
  assert.strictEqual(unknown.matched, false);

  const irrelevantUnknown = router.resolveOccupationContext({
    occupation: "bibliotekar",
    topic: "Livssituasjoner",
    subtopic: "Samlivsbrudd",
    situation: "Medarbeideren står i et samlivsbrudd."
  });
  assert.strictEqual(irrelevantUnknown.occupationRelevant, false);
  assert.strictEqual(irrelevantUnknown.classificationNeeded, false, "Irrelevant fritekstyrke skal ikke utløse KI-klassifisering");
  assert.strictEqual(irrelevantUnknown.localClassification, null);

  let checked = 0;
  for (const tc of benchmark.cases || []) {
    const result = router.resolveOccupationContext({
      occupation: tc.occupation,
      sectorId: tc.sector === "other" ? null : tc.sector,
      topic: tc.topic,
      subtopic: tc.subtopic,
      situation: tc.situation
    });

    assert.strictEqual(
      result.occupationRelevant,
      tc.occupationRelevant,
      `${tc.id}: feil vurdering av om yrke er relevant`
    );

    if (tc.expectedRouting?.sector) {
      assert.strictEqual(result.sectorId, tc.expectedRouting.sector, `${tc.id}: feil lokal sektor-ruting`);
    }

    if (!tc.occupationRelevant) {
      assert.deepStrictEqual(result.sourceIds, [], `${tc.id}: irrelevante saker skal ikke hente yrkeskilder`);
    }

    if (tc.occupationRelevant && tc.sector && tc.sector !== "other") {
      assert(result.sectorId, `${tc.id}: relevant sak mangler sektor`);
    }

    checked += 1;
  }

  console.log(`Yrkesruter OK: ${checked} benchmark-saker · yrke er valgfritt · negative kontroller består`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
