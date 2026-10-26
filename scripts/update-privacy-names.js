import fs from "node:fs";

const GIVEN_URL="https://data.ssb.no/api/v0/no/table/10467";
const SURNAME_URL="https://data.ssb.no/api/v0/no/table/12891";
const OUT=new URL("../src/privacy-name-data.js",import.meta.url);

async function get(url){
  const r=await fetch(url,{headers:{"User-Agent":"Samtalestotte student project"}});
  if(!r.ok) throw new Error("SSB svarte "+r.status+" for "+url);
  return r.json();
}
function variableValues(meta, pattern){
  const variables=Array.isArray(meta?.variables)?meta.variables:[];
  const variable=variables.find(v=>pattern.test(String(v?.text||v?.code||"")));
  if(!variable) throw new Error("Fant ikke forventet navnevariabel i SSB-metadata.");
  const values=Array.isArray(variable.valueTexts)&&variable.valueTexts.length?variable.valueTexts:variable.values;
  return (values||[]).map(String).map(x=>x.trim()).filter(x=>/^[\p{L}][\p{L}'’\- ]{1,80}$/u.test(x));
}
function unique(values){
  const map=new Map();
  for(const v of values){const k=v.normalize("NFC").toLocaleLowerCase("nb-NO");if(!map.has(k))map.set(k,v);}
  return [...map.values()].sort((a,b)=>a.localeCompare(b,"nb-NO"));
}
function readExisting(){
  const text=fs.readFileSync(OUT,"utf8");
  const getList=name=>{
    const marker=name+": Object.freeze(";
    const start=text.indexOf(marker);
    if(start<0)return[];
    const arrStart=text.indexOf("[",start);
    const arrEnd=text.indexOf("])",arrStart);
    return arrStart>=0&&arrEnd>arrStart?JSON.parse(text.slice(arrStart,arrEnd+1)):[];
  };
  return {
    givenNames:getList("givenNames"),
    ambiguousGivenNames:getList("ambiguousGivenNames"),
    falsePositives:getList("falsePositives"),
    contextualNonNames:getList("contextualNonNames")
  };
}
const current=readExisting();
const [givenMeta,surnameMeta]=await Promise.all([get(GIVEN_URL),get(SURNAME_URL)]);
const ssbGiven=variableValues(givenMeta,/jente.*navn|gutte.*navn|fornavn|navn/i);
const ssbSurnames=variableValues(surnameMeta,/etternavn/i);
if(ssbGiven.length<500) throw new Error("SSB ga uventet få fornavn ("+ssbGiven.length+"). Avbryter uten å skrive fil.");
if(ssbSurnames.length<500) throw new Error("SSB ga uventet få etternavn ("+ssbSurnames.length+"). Avbryter uten å skrive fil.");
const givenNames=unique([...current.givenNames,...ssbGiven]);
const surnames=unique(ssbSurnames);
const stamp=new Date().toISOString();
const content=[
  "// Samtalestøtte – felles navnedata for klient og server.",
  "// Kjøres lokalt i nettleseren/serveren; brukertekst sendes ikke til SSB.",
  "// Generert/oppdatert fra SSB Statistikkbanken: "+stamp,
  "(function(root){",
  "  root.SamtalestottePrivacyNames = Object.freeze({",
  "    metadata: Object.freeze({",
  '      source: "SSB Statistikkbanken",',
  '      ssbGivenNamesTable: "10467",',
  '      ssbSurnamesTable: "12891",',
  '      updatedAt: "'+stamp+'",',
  '      note: "Runtime bruker kun lokale data. Ingen brukertekst sendes til SSB."',
  "    }),",
  "    givenNames: Object.freeze("+JSON.stringify(givenNames,null,2)+"),",
  "    surnames: Object.freeze("+JSON.stringify(surnames,null,2)+"),",
  "    ambiguousGivenNames: Object.freeze("+JSON.stringify(current.ambiguousGivenNames,null,2)+"),",
  "    falsePositives: Object.freeze("+JSON.stringify(current.falsePositives,null,2)+"),",
  "    contextualNonNames: Object.freeze("+JSON.stringify(current.contextualNonNames,null,2)+")",
  "  });",
  "})(globalThis);",
  ""
].join("\n");
fs.writeFileSync(OUT,content,"utf8");
console.log("Oppdatert navnedata fra SSB: "+givenNames.length+" fornavn, "+surnames.length+" etternavn.");
