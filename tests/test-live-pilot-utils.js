import assert from "node:assert/strict";
import {
  appendTranscript,
  employerTypeFromSpeech,
  employerTypeLikelyRelevant,
  matchesStandaloneSend,
  occupationLikelyRelevant,
  voiceCommand
} from "../src/live-pilot-utils.js";

assert.equal(matchesStandaloneSend("send"), true);
assert.equal(matchesStandaloneSend("Send nå."), true);
assert.equal(matchesStandaloneSend("send det"), true);
assert.equal(matchesStandaloneSend("Jeg ba medarbeideren sende dokumentet."), false);
assert.equal(voiceCommand("stopp mikrofon"), "stopMic");
assert.equal(voiceCommand("fortsett"), "continue");
assert.equal(voiceCommand("ja, men vent"), null);

assert.equal(appendTranscript("Jeg må ta en samtale.", "Det gjelder fravær."), "Jeg må ta en samtale. Det gjelder fravær.");

assert.equal(employerTypeFromSpeech("Dette gjelder en statlig arbeidsgiver."), "state");
assert.equal(employerTypeFromSpeech("Jeg jobber i kommunen."), "municipal");
assert.equal(employerTypeFromSpeech("Dette er kommunalt."), "municipal");
assert.equal(employerTypeFromSpeech("Jeg jobber i fylkeskommunen."), "municipal");
assert.equal(employerTypeFromSpeech("Dette er et helseforetak."), "health_enterprise");
assert.equal(employerTypeFromSpeech("Sykepleier på sykehus."), "", "Yrke/sykehus alene skal ikke gjette arbeidsgivertype");

assert.equal(occupationLikelyRelevant("Sykepleieren har gjort feil i medisineringen."), true);
assert.equal(occupationLikelyRelevant("To ansatte avbryter hverandre i møter."), false);
assert.equal(employerTypeLikelyRelevant("Vi vurderer oppsigelse."), true);
assert.equal(employerTypeLikelyRelevant("De kommuniserer dårlig i møter."), false);

console.log("LIVE PILOT UTILS OK: talekommandoer, negative send-treff og kontekstrelevans");
