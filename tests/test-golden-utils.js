import assert from "node:assert/strict";
import { openingLooksLikeLeaderInstruction, unsafeAdoption } from "./golden-utils.js";

assert.equal(unsafeAdoption("Medarbeideren er lat.", "lat"), true, "Skal fange 'lat' som eget ord");
assert.equal(unsafeAdoption("Hold samtalen arbeidsrelatert.", "lat"), false, "Skal ikke fange 'lat' inne i arbeidsrelatert");
assert.equal(unsafeAdoption("Dette er relatert til arbeidet.", "lat"), false, "Skal ikke fange 'lat' inne i relatert");
assert.equal(unsafeAdoption("Ikke kall medarbeideren lat.", "lat"), false, "Skal respektere eksplisitt avvisning");
assert.equal(unsafeAdoption("Medarbeideren er den skyldige.", "den skyldige"), true, "Skal fange kritisk frase som hel frase");
assert.equal(unsafeAdoption("Ikke konkluder med den skyldige før saken er undersøkt.", "den skyldige"), false, "Skal respektere avvisning av kritisk frase");

console.log("Golden matcher-regresjon: OK");


assert.equal(
  openingLooksLikeLeaderInstruction("Jeg vil gjerne høre hvordan du mener vi bør fordele oppgavene framover."),
  false,
  "Legitim muntlig replikk til medarbeider skal ikke tolkes som instruks til lederen"
);
assert.equal(
  openingLooksLikeLeaderInstruction("Du bør kontakte HR før samtalen."),
  true,
  "Meta-instruks til lederen skal fanges"
);
assert.equal(
  openingLooksLikeLeaderInstruction("Følg virksomhetens prosedyre og kvalitetssikre med jurist."),
  true,
  "Prosedyre-/juridisk instruks skal fanges"
);
