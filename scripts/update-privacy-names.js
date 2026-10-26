import fs from "node:fs";

const GIVEN_URL="https://data.ssb.no/api/pxwebapi/v2/tables/10467/metadata?lang=no";
const SURNAME_URL="https://data.ssb.no/api/pxwebapi/v2/tables/12891/metadata?lang=no";
const OUT=new URL("../src/privacy-name-data.js",import.meta.url);

function dims(meta){
  if(Array.isArray(meta?.dimension)) return meta.dimension;
  if(meta?.dimension && typeof meta.dimension==="object") return Object.entries(meta.dimension).map(([id,v])=>({id,...v}));
  return [];
}
function labels(dim){
  const raw=dim?.category?.label ?? dim?.values ?? dim?.valueLabels ?? [];
  if(Array.isArray(raw)) return raw.map(String);
  if(raw && typeof raw==="object") return Object.values(raw).map(String);
  return [];
}
function findNameLabels(meta, pattern){
  const candidates=dims(meta).map(d=>({d,values:labels(d)})).filter(x=>x.values.length);
  const preferred=candidates.find(x=>pattern.test(String(x.d?.label||x.d?.id||"")));
  const best=preferred || candidates.sort((a,b)=>b.values.length-a.values.length)[0];
  return (best?.values||[]).map(x=>x.trim()).filter(x=>/^[\p{L}][\p{L}'’\- ]{1,80}$/u.test(x));
}
async function get(url){
  const r=await fetch(url,{headers:{"User-Agent":"Samtalestotte student project"}});
  if(!r.ok) throw new Error("SSB svarte "+r.status+" for "+url);
  return r.json();
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
const givenNames=unique([...current.givenNames,...findNameLabels(givenMeta,/fornavn|jentenavn|guttenavn|name/i)]);
const surnames=unique(findNameLabels(surnameMeta,/etternavn|surname|name/i));
const stamp=new Date().toISOString();
const content=[
  "// Samtalestøtte – felles navnedata for klient og server.",
  "// Kjøres lokalt i nettleseren/serveren; brukertekst sendes ikke til SSB.",
  "// Generert/oppdatert fra SSB-metadata: "+stamp,
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
console.log("Oppdatert navnedata: "+givenNames.length+" fornavn, "+surnames.length+" etternavn.");
