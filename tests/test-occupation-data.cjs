const fs = require("fs");
const assert = require("assert");

const map = JSON.parse(fs.readFileSync("data/OCCUPATION-SOURCE-MAP.json", "utf8"));
const registry = JSON.parse(fs.readFileSync("data/OCCUPATION-LEGAL-SOURCES.json", "utf8"));
const benchmark = JSON.parse(fs.readFileSync("data/OCCUPATION-BENCHMARK-CASES.json", "utf8"));

const sectorIds = new Set();
const occupationOwners = new Map();

for (const sector of map.sectors || []) {
  assert(sector.id && !sectorIds.has(sector.id), `Duplisert sektor-id: ${sector.id}`);
  sectorIds.add(sector.id);

  if (sector.id !== "other") {
    assert(Array.isArray(sector.occupations) && sector.occupations.length > 0, `${sector.id}: mangler yrker`);
    assert(Array.isArray(sector.primaryAuthorities) && sector.primaryAuthorities.length > 0, `${sector.id}: mangler primærkilder`);
    assert(Array.isArray(sector.legalAreas) && sector.legalAreas.length > 0, `${sector.id}: mangler regelverksområder`);
  } else {
    assert.strictEqual(sector.freeText, true, "Annet skal støtte fritekst");
  }

  for (const occupation of sector.occupations || []) {
    const key = occupation.toLowerCase().trim();
    if (!occupationOwners.has(key)) occupationOwners.set(key, []);
    occupationOwners.get(key).push(sector.id);
  }
}

for (const [occupation, owners] of occupationOwners) {
  assert.strictEqual(owners.length, 1, `Yrket "${occupation}" ligger i flere sektorer: ${owners.join(", ")}`);
}

const sourceIds = new Set();
for (const source of registry.sources || []) {
  assert(source.id && !sourceIds.has(source.id), `Duplisert kilde-id: ${source.id}`);
  sourceIds.add(source.id);
  assert(/^https:\/\//.test(source.url || ""), `${source.id}: URL må være https`);
  assert(source.authority, `${source.id}: mangler authority`);
  assert(Array.isArray(source.sectors) && source.sectors.length > 0, `${source.id}: mangler sectors`);
  assert(Array.isArray(source.useFor) && source.useFor.length > 0, `${source.id}: mangler useFor`);
  assert.strictEqual(typeof source.timeSensitive, "boolean", `${source.id}: timeSensitive må være bool`);
}

for (const source of registry.sources || []) {
  for (const sectorId of source.sectors || []) {
    assert(sectorId === "*" || sectorIds.has(sectorId), `${source.id}: ukjent sektor ${sectorId}`);
  }
}

const caseIds = new Set();
for (const tc of benchmark.cases || []) {
  assert(tc.id && !caseIds.has(tc.id), `Duplisert benchmark-id: ${tc.id}`);
  caseIds.add(tc.id);
  if (tc.sector && tc.sector !== "other") {
    assert(sectorIds.has(tc.sector), `${tc.id}: ukjent sektor ${tc.sector}`);
  }
  assert.strictEqual(typeof tc.occupationRelevant, "boolean", `${tc.id}: occupationRelevant mangler`);
  assert.strictEqual(typeof tc.webRequired, "boolean", `${tc.id}: webRequired mangler`);
  if (!tc.occupationRelevant) {
    assert.strictEqual(tc.webRequired, false, `${tc.id}: irrelevant yrkeskontekst skal ikke kreve web pga yrke`);
  }
}

assert(
  benchmark.cases.some(tc => tc.occupationRelevant === false),
  "Benchmarkbanken må ha negative kontroller"
);
assert(
  benchmark.cases.some(tc => tc.occupationRelevant === true && tc.webRequired === true),
  "Benchmarkbanken må ha sikkerhets-/regelverkssaker"
);

console.log(
  `Yrkesdata OK: ${sectorIds.size} sektorer · ${registry.sources.length} kilder · ${benchmark.cases.length} benchmark-saker`
);
