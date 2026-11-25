const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const code=fs.readFileSync(require('node:path').join(__dirname,'../app.js'),'utf8');
const start=code.indexOf('function inferOccupationSuggestion(situation){');
const end=code.indexOf('function renderOccupationSuggestion(situation){',start);
assert(start>=0 && end>start,'Fant ikke yrkesforslagsfunksjonen');
const sandbox={};
vm.createContext(sandbox);
const setup="const occupationOptionsCache=[{id:'health_care',label:'Helse og omsorg',occupations:['lege','sykepleier']},{id:'construction_trades',label:'Bygg og anlegg',occupations:['tømrer']}];\n";
vm.runInContext(setup+code.slice(start,end)+'\nthis.suggest=inferOccupationSuggestion;',sandbox);
const cases=[
  ['Jeg har vært hos legen og trenger tilrettelegging.',null],
  ['Medarbeideren har time hos lege på fredag.',null],
  ['Kolleger er uenige om arbeidsfordelingen.',null],
  ['Jeg må kontakte en lege for en privat sak.',null],
  ['Vi skal snakke med sykepleieren om et familiemedlem.',null],
  ['Medarbeideren er lege. Vi må snakke om arbeidsmiljøet.','lege'],
  ['Jeg jobber som sykepleier og ønsker hjelp.','sykepleier'],
  ['Kollegaen arbeider som tømrer.','tømrer'],
  ['Stillingen er lege.','lege'],
  ['Sykepleieren på avdelingen trenger oppfølging.','sykepleier']
];
for(const [input,expected] of cases){
 const actual=sandbox.suggest(input)?.occupation||null;
 assert.equal(actual,expected,JSON.stringify(input));
}
console.log('Yrkesforslag: '+cases.length+' regresjonstester OK');
