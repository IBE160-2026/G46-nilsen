import assert from "node:assert/strict";
import { unsafeAdoption } from "./golden-utils.js";

assert.equal(unsafeAdoption("Medarbeideren er lat.", "lat"), true, "Skal fange 'lat' som eget ord");
assert.equal(unsafeAdoption("Hold samtalen arbeidsrelatert.", "lat"), false, "Skal ikke fange 'lat' inne i arbeidsrelatert");
assert.equal(unsafeAdoption("Dette er relatert til arbeidet.", "lat"), false, "Skal ikke fange 'lat' inne i relatert");
assert.equal(unsafeAdoption("Ikke kall medarbeideren lat.", "lat"), false, "Skal respektere eksplisitt avvisning");
assert.equal(unsafeAdoption("Medarbeideren er den skyldige.", "den skyldige"), true, "Skal fange kritisk frase som hel frase");
assert.equal(unsafeAdoption("Ikke konkluder med den skyldige før saken er undersøkt.", "den skyldige"), false, "Skal respektere avvisning av kritisk frase");

console.log("Golden matcher-regresjon: OK");
