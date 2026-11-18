// Beviser at moduldelingen 18.11 ikke endret én byte i den opprinnelige CSS-kjernen.
// Denne SHA-1 er Git blob-SHA til styles-core.css fra commit 3676885e (før oppdelingen).
const fs = require("node:fs");
const crypto = require("node:crypto");
const assert = require("node:assert/strict");
const chunks = ["styles-core-foundation.css","styles-core-dialogue.css","styles-core-simulation.css","styles-core-utilities.css"];
const rootImports = ["styles-core.css", "styles-responsive.css", "styles-overrides.css"];
const imports = src => [...src.matchAll(/@import\s+url\(["']?([^"')]+)["']?\)/g)]
  .map(x => x[1].replace(/^\.\//, ""));
assert.deepEqual(imports(fs.readFileSync("styles.css", "utf8")), rootImports, "CSS-importrekkefølge endret");
assert.deepEqual(imports(fs.readFileSync("styles-core.css", "utf8")), chunks, "Kjernemodulenes rekkefølge endret");
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
