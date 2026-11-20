const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const prd = read("docs/bmad/PRD.md");
const status = read("docs/bmad/PRD-STATUS-OG-TESTBEVIS.md");
const legacy = read("docs/bmad/historikk/PRD-2026-11-12.md");

const expected = [];
for (let n = 1; n <= 23; n += 1) expected.push(String(n).padStart(2, "0"));
expected.splice(15, 0, "15A");

const pattern = /^## FR-(\d{2}[A-Z]?)\s+[–-]\s+(.+)$/gm;
const matches = [...prd.matchAll(pattern)];
const blocks = matches.map((match, i) => ({
  id: match[1],
  title: match[2],
  start: match.index,
  end: matches[i + 1]?.index ?? prd.indexOf("\n## 7. KI- og kildekrav", match.index)
}));
assert.equal(blocks.length, expected.length, "PRD skal ha nøyaktig 24 FR-er");
assert.deepEqual(blocks.map(x => x.id), expected, "FR-ID-er er unike, stabile og i riktig rekkefølge");

for (const item of blocks) {
  assert(item.end > item.start, "FR-" + item.id + ": ugyldig seksjonsgrense");
  const block = prd.slice(item.start, item.end);
  const count = [...block.matchAll(/^\d+\.\s+\S+/gm)].length;
  assert(block.includes("### Akseptansekriterier"),
    "FR-" + item.id + ": mangler testbar akseptanseseksjon");
  assert(count >= 2, "FR-" + item.id + ": færre enn to eksplisitte akseptansekriterier");
  assert(block.includes("**Omfang:**"),
    "FR-" + item.id + ": mangler scope/kjerne-/utvidelsesmerking");
  assert(new RegExp("\\|\\s*\\*\\*FR-" + item.id + "\\b").test(status),
    "FR-" + item.id + ": mangler status/testspor i vedlegget");
  assert(!/^\s*(?:\*\*Status|Status:)/m.test(block),
    "FR-" + item.id + ": leveransebevis skal ikke blandes inn i kravteksten");
}

for (const target of [
  "SM-01", "SM-02", "SM-03", "SM-04", "SM-C1", "SM-C2",
  "UJ-01", "UJ-02", "AI-01", "AI-07", "AI-08",
  "NFR-01", "NFR-06", "NFR-07", "NFR-08"
]) {
  assert(prd.includes(target), "Mangler krav/kriterium: " + target);
}
assert(!/^# (?:Tillegg|Produksjonstillegg|Pilotkrav)/m.test(prd),
  "Gamle daterte tillegg må ligge i historikk, ikke gjeldende PRD");
assert(legacy.includes("## FR-15A") && legacy.includes("# Produksjonstillegg"),
  "Historisk PRD skal bevare de opprinnelige kravene");
assert(status.includes("ikke") && status.includes("testbevis"),
  "Statusvedlegget må beskrive avgrensninger og faktisk testspor");

console.log("PRD: " + blocks.length +
  " funksjonelle krav med testbare akseptansekriterier, scope og statuskoblinger: OK");
