"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const source = fs.readFileSync(path.join(root, "src/client/source-presentation.js"), "utf8");
const app = fs.readFileSync(path.join(root, "app.js"), "utf8");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const sandbox = { window: {}, Date, Intl };
vm.runInNewContext(source, sandbox, { filename: "source-presentation.js" });
const { sortSourcesAlphabetically, compactSourceUsage, readableSourceTier, sourceDateNote } =
  sandbox.window.SamtalestotteSourcePresentation;
assert.ok([sortSourcesAlphabetically, compactSourceUsage, readableSourceTier, sourceDateNote]
  .every(fn => typeof fn === "function"), "Pure source presentation exports must exist");

const originals = [{title:"Økonomi"}, {title:"Arbeid"}, {title:"Åpenhet"}];
const ordered = sortSourcesAlphabetically(originals);
assert.deepEqual(Array.from(ordered, item => item.title), ["Arbeid", "Økonomi", "Åpenhet"]);
assert.equal(originals[0].title,"Økonomi","Sorting must not mutate source array");
assert.equal(compactSourceUsage({useFor:["Lovtolkning", "", "Frister"]}),"Lovtolkning, Frister");
assert.equal(compactSourceUsage({type:"myndighetsveiledning"}),"myndighetsveiledning og praktisk regelverksforståelse");
assert.match(readableSourceTier({sourceTier:"primary_law"}),/bindende/);
assert.match(readableSourceTier({sourceTier:"collective_agreement"}),/Tariffavtale/);
assert.match(readableSourceTier({}),/vurder gyldighet/);
const date = new Date("2026-11-25T12:00:00Z");
assert.equal(sourceDateNote({},date),"");
assert.match(sourceDateNote({validFrom:"2020-01-01",validTo:"2025-12-31"},date),/utløp 2025-12-31/);
assert.match(sourceDateNote({validFrom:"2027-01-01",validTo:"2028-01-01"},date),/ikke gjeldende ennå/);
assert.match(sourceDateNote({validFrom:"2026-01-01",validTo:"2026-12-31"},date),/bekreft avtaledekning/);
assert.match(sourceDateNote({validFrom:"2026-12-31",validTo:"2026-01-01"},date),/må kontrolleres/);
assert.match(sourceDateNote({validFrom:"31-12-2025"},date),/må kontrolleres/);

assert.match(app,/window\.SamtalestotteSourcePresentation/,"Main app must use extracted functions");
assert.ok(!app.includes("function sourceDateNote("), "Old source logic must not remain duplicated");
const sourceIndex=html.indexOf('src/client/source-presentation.js');
const appIndex=html.indexOf('src="app.js');
assert.ok(sourceIndex > 0 && appIndex > sourceIndex,
  "Browser must load source presentation before main app");
console.log("Source presentation contracts and browser loading order: OK");
