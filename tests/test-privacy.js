import fs from 'node:fs';
import vm from 'node:vm';

const source = fs.readFileSync(new URL('../app.js', import.meta.url), 'utf8');
const start = source.indexOf('const COMMON_GIVEN_NAMES');
const end = source.indexOf('function applyPrivacyFix', start);
if (start < 0 || end < 0) throw new Error('Fant ikke personvernfunksjonene i app.js');

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${source.slice(start, end)}\nthis.findLikelyGivenName = findLikelyGivenName; this.detectSensitiveInfo = detectSensitiveInfo; this.autoFixPrivacyText = autoFixPrivacyText;`, sandbox);

const nameCases = [
  ['Personen er delvis tilbake i arbeid.', null],
  ['Samtalen er planlagt neste uke.', null],
  ['Situasjonen er krevende.', null],
  ['knut er delvis tilbake i arbeid.', 'knut'],
  ['Knut er delvis tilbake i arbeid.', 'Knut'],
  ['trude er delvis tilbake i arbeid.', 'trude'],
  ['Trude er delvis tilbake i arbeid.', 'Trude'],
  ['Jeg snakket med trude som ønsker et møte.', 'trude'],
  ['Problemet er at fraværet øker.', null],
  ['Medarbeideren heter knut og jobber i teamet.', 'knut'],
  ['Jeg snakket med Cecilie som ønsker et møte.', 'Cecilie'],
  ['per uke har vi to møter.', null],
  ['Jeg snakket med per som ønsker et møte.', 'per'],
];

const privacyCases = [
  ['Medarbeideren har to døtre på 7 og 9.', 'family_details'],
  ['Medarbeideren har tre barn på 4, 8 og 11 år.', 'family_details'],
  ['Medarbeideren er alenemor til en gutt på 6.', 'family_details'],
  ['Medarbeideren bor med ektefellen og to barn.', 'family_details'],
  ['Medarbeideren er gravid i uke 27.', 'pregnancy_detail'],
  ['Medarbeideren er den eneste elektrikeren på avdelingen.', 'unique_role'],
  ['Medarbeideren har flere barn i småskolealder.', null],
  ['Jeg jobber i Forsvaret og medarbeideren har brutt en sikkerhetsrutine.', 'workplace_detail'],
  ['Jeg jobber i Solsikken barnehage og trenger råd.', 'workplace_detail'],
  ['Jeg jobber i en barnehage og trenger råd.', null],
  ['Jeg jobber i en sikkerhetskritisk virksomhet.', null],
  ['Hun ønsker et møte med lederen.', 'gendered_language'],
  ['Jeg ga beskjed til ham i går.', 'gendered_language'],
];

let failures = 0;
for (const [text, expected] of nameCases) {
  const actual = sandbox.findLikelyGivenName(text);
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? 'OK' : 'FEIL'} navn: ${text} -> ${actual ?? 'ingen'}${ok ? '' : ` (forventet ${expected ?? 'ingen'})`}`);
}
for (const [text, expectedType] of privacyCases) {
  const findings = sandbox.detectSensitiveInfo(text);
  const actual = expectedType ? findings.some(item => item.type === expectedType) : findings.length === 0;
  if (!actual) failures += 1;
  console.log(`${actual ? 'OK' : 'FEIL'} personvern: ${text} -> ${findings.map(x => x.type).join(', ') || 'ingen'}`);
}

const fixInput = 'Medarbeideren har to døtre på 7 og 9.';
const fixFindings = sandbox.detectSensitiveInfo(fixInput);
const fixed = sandbox.autoFixPrivacyText(fixInput, fixFindings);
const fixOk = fixed.includes('flere barn i småskolealder') && !/døtre|\b7\b|\b9\b/i.test(fixed);
if (!fixOk) failures += 1;
console.log(`${fixOk ? 'OK' : 'FEIL'} anonymisering: ${fixInput} -> ${fixed}`);

const workInput='Jeg jobber i Forsvaret og medarbeideren brøt en sikkerhetsrutine.';
const workFixed=sandbox.autoFixPrivacyText(workInput,sandbox.detectSensitiveInfo(workInput));
const workOk=workFixed.includes('sikkerhetskritisk virksomhet') && !workFixed.includes('Forsvaret');
if(!workOk) failures += 1;
console.log(`${workOk ? 'OK' : 'FEIL'} arbeidssted-anonymisering: ${workInput} -> ${workFixed}`);


const pronounInput='Hun sier at hennes opplevelse er annerledes.';
const pronounFixed=sandbox.autoFixPrivacyText(pronounInput,sandbox.detectSensitiveInfo(pronounInput));
const pronounOk=/\bhen\b/i.test(pronounFixed) && /\bhens\b/i.test(pronounFixed) && !/\bhun\b|\bhennes\b/i.test(pronounFixed);
if(!pronounOk) failures += 1;
console.log(`${pronounOk ? 'OK' : 'FEIL'} kjønnsnøytralisering: ${pronounInput} -> ${pronounFixed}`);

if (failures) {
  console.error(`\n${failures} personverntest(er) feilet.`);
  process.exit(1);
}
console.log(`\nAlle ${nameCases.length + privacyCases.length + 3} personverntester OK.`);

