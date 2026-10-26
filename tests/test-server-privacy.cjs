const fs=require('fs');
const vm=require('vm');
const assert=require('assert');
const source=fs.readFileSync('server.js','utf8');
const nameData=fs.readFileSync('src/privacy-name-data.js','utf8');
const detector=fs.readFileSync('src/privacy-detector.js','utf8');
const start=source.indexOf('const SERVER_HARD_PRIVACY_TYPES');
const end=source.indexOf('\nfunction flattenTextValues',start);
assert(start>=0&&end>start,'Fant ikke server-personvernblokken');
const ctx={};vm.createContext(ctx);vm.runInContext(nameData,ctx);vm.runInContext(detector,ctx);
const block=source.slice(start,end)+"\nthis._findings=serverPrivacyFindings; this._hard=SERVER_HARD_PRIVACY_TYPES;";
vm.runInContext(block,ctx);
const findings=ctx._findings;
const hard=ctx._hard;
const cases=[
  ['Medarbeideren heter Knut og kommer for sent.','name'],
  ['Knut Hansen kommer for sent.','name'],
  ['Kontakt er kari@example.no.','email'],
  ['Telefon 999 88 777.','phone'],
  ['Fødselsdato 12.04.1984.','birthdate'],
  ['Ansattnummer ABC-1234.','identifier'],
  ['Hun ønsker et møte.','gendered_language'],
  ['Bor i Storgata 14.','address'],
  ['Medarbeideren er 47 år gammel.','age'],
  ['Medarbeideren har to døtre på 7 og 9.','family_details'],
  ['Medarbeideren er den eneste elektrikeren på avdelingen.','unique_role'],
  ['Jeg jobber i Forsvaret og trenger råd.','workplace_detail']
];
for(const [text,type] of cases){
  const got=findings(text).map(x=>x.type);
  assert(got.includes(type),`${type} ikke oppdaget i: ${text}; fikk ${got.join(',')}`);
}
const ambiguousNameCases=[
  ['Dette skjer hver dag.',false],
  ['Hver dag har vi møte.',false],
  ['Dag har kommet for sent.',true],
  ['Jeg snakket med Dag i går.',true],
  ['Ronny kommer for sent.',true],
  ['ronny kommer for sent.',true],
  ['RONNY kommer for sent.',true],
  ['Zehra sier at dette er urettferdig.',true],
  ['zehra sier at dette er urettferdig.',true],
  ['Jeg snakket med abdirizak i går.',true],
  ['Arbeidet blir mer krevende.',false],
  ['Fraværet har økt.',false],
  ['Sikkerhet må prioriteres.',false],
  ['Vi skal til møte neste uke.',false],
  ['Medarbeideren skal til lege i morgen.',false],
  ['Løsningen kommer senere.',false],
  ['Kunden sier at leveransen er forsinket.',false]
];
for(const [text,expectedName] of ambiguousNameCases){
  const got=findings(text).map(x=>x.type);
  assert.strictEqual(got.includes('name'),expectedName,`Tvetydig navn feil i: ${text}; fikk ${got.join(',') || 'ingen'}`);
}
for(const t of ['email','phone','birthdate','identifier','name','address','gendered_language']) assert(hard.has(t),`${t} skal være hard blokkering`);
for(const t of ['age','family_details','unique_role','workplace_detail']) assert(!hard.has(t),`${t} skal være rådgivende, ikke hard blokkering`);
console.log('v20.4 server privacy: OK');



// Brukertest-retensjon er en del av dataminimeringen.
assert(/surveyDays:\s*365/.test(source),'Brukertest-retensjon på 365 dager mangler');
assert(/survey_responses'\)\.delete\(\)\.lt\('created_at',\s*isoDaysAgo\(RETENTION\.surveyDays\)\)/.test(source),'Automatisk sletting av survey_responses mangler');
assert(/survey_participation'\)\.delete\(\)\.lt\('completed_at',\s*isoDaysAgo\(RETENTION\.surveyDays\)\)/.test(source),'Automatisk sletting av survey_participation mangler');
console.log('Brukertest-retensjon: OK');

// Brukertestsvar skal ikke lagre user_id sammen med svarene.
const surveyStart=source.indexOf('app.post("/api/survey"');
const surveyEnd=source.indexOf('app.get("/api/admin/survey"',surveyStart);
assert(surveyStart>=0&&surveyEnd>surveyStart,'Fant ikke brukertest-endepunktet');
const surveyBlock=source.slice(surveyStart,surveyEnd);
const rowStart=surveyBlock.indexOf('const row=');
const rowEnd=surveyBlock.indexOf(';',rowStart);
assert(rowStart>=0&&rowEnd>rowStart,'Fant ikke survey response-row');
const surveyRowDefinition=surveyBlock.slice(rowStart,rowEnd);
assert(!/user_id/i.test(surveyRowDefinition),'Brukertestsvar skal ikke lagre user_id');
assert(/survey_participation'\)\.insert\(\{user_id:req\.user\.id\}\)/.test(surveyBlock),'Separat deltakelsesmarkering mangler');
console.log('Brukertest uten direkte bruker-ID: OK');
