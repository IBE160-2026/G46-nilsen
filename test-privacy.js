import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('./app.js', import.meta.url), 'utf8');
const start = source.indexOf('const COMMON_GIVEN_NAMES');
const end = source.indexOf('function detectSensitiveInfo', start);
if (start < 0 || end < 0) throw new Error('Fant ikke navnedeteksjonen i app.js');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${source.slice(start, end)}\nthis.findLikelyGivenName = findLikelyGivenName;`, sandbox);

const cases = [
  ['Personen er delvis tilbake i arbeid.', null],
  ['Samtalen er planlagt neste uke.', null],
  ['Situasjonen er krevende.', null],
  ['knut er delvis tilbake i arbeid.', 'knut'],
  ['Knut er delvis tilbake i arbeid.', 'Knut'],
  ['Medarbeideren heter knut og jobber i teamet.', 'knut'],
  ['Jeg snakket med Cecilie som ønsker et møte.', 'Cecilie'],
  ['per uke har vi to møter.', null],
  ['Jeg snakket med per som ønsker et møte.', 'per'],
];

let failures = 0;
for (const [text, expected] of cases) {
  const actual = sandbox.findLikelyGivenName(text);
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? 'OK' : 'FEIL'}: ${text} -> ${actual ?? 'ingen'}${ok ? '' : ` (forventet ${expected ?? 'ingen'})`}`);
}

if (failures) {
  console.error(`\n${failures} personverntest(er) feilet.`);
  process.exit(1);
}
console.log(`\nAlle ${cases.length} personverntester OK.`);
