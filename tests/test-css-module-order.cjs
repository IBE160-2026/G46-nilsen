// Beviser at moduldelingen 18.11 ikke endret én byte i den opprinnelige CSS-kjernen.
// Denne SHA-1 er Git blob-SHA til styles-core.css fra commit 3676885e (før oppdelingen).
const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const groups = {
  "styles-core-foundation.css": [
    "styles-core-01-shell.css",
    "styles-core-02-forms.css",
    "styles-core-03-situation.css",
    "styles-core-04-topic-layout.css"
  ],
  "styles-core-dialogue.css": [
    "styles-core-05-guidance.css",
    "styles-core-06-auth-history.css",
    "styles-core-07-reports.css"
  ],
  "styles-core-simulation.css": [
    "styles-core-08-simulation-flow.css",
    "styles-core-09-simulation-controls.css",
    "styles-core-10-auth-views.css"
  ],
  "styles-core-utilities.css": [
    "styles-core-11-speech-bubbles.css",
    "styles-core-12-admin.css",
    "styles-core-13-survey.css",
    "styles-core-14-final-adjustments.css"
  ]
};
const chunks = Object.values(groups).flat();
const rootImports = ["styles-core.css", "styles-responsive.css", "styles-overrides.css"];
const imports = src => [...src.matchAll(/@import\s+url\(["']?([^"')]+)["']?\)/g)]
  .map(x => x[1].replace(/^\.\//, ""));
assert.deepEqual(imports(fs.readFileSync("styles.css", "utf8")), rootImports, "CSS-importrekkefølge endret");
assert.deepEqual(imports(fs.readFileSync("styles-core.css", "utf8")),Object.keys(groups),"Kjernegruppenes rekkefølge endret");
for (const [parent, children] of Object.entries(groups)) {
  assert.deepEqual(imports(fs.readFileSync(parent,"utf8")),children,"Feil funksjonsdelrekkefølge i "+parent);
}
const combined = Buffer.concat(chunks.map(name => fs.readFileSync(name)));
const gitSha = crypto.createHash("sha1")
  .update("blob " + combined.length + "\0")
  .update(combined).digest("hex");
assert.equal(gitSha, "28de97a17d2d5f8dad1265c51b5ec123b49fcadd",
  "Moduldelingen endret bytes i selve CSS-reglene: sammenlign mot original commit");
for (const n of chunks) {
  for (const f of ["server.js", "scripts/sensor-demo.js", "sw.js", "tests/test-public-assets.cjs"]) {
    assert.ok(fs.readFileSync(f, "utf8").includes(n), n + " mangler i " + f);
  }
}
console.log("CSS-modulering: korrekt importrekkefølge, uendret Git-blob og alle assets eksponert: OK");
