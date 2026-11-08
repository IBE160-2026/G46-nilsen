const fs=require("fs");
const path=require("path");
const {spawnSync}=require("child_process");

function collect(dir){
  const out=[];
  for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
    const full=path.join(dir,entry.name);
    if(entry.isDirectory()) out.push(...collect(full));
    else if(/\.(?:c?js|mjs)$/i.test(entry.name)) out.push(full);
  }
  return out;
}

const files=collect("tests").sort();
let failed=0;
for(const file of files){
  const r=spawnSync(process.execPath,["--check",file],{encoding:"utf8"});
  if(r.status!==0){
    failed++;
    console.error("SYNTAX FEIL:",file);
    console.error((r.stderr||r.stdout||"").trim());
  }
}
if(failed){
  console.error(`\n${failed}/${files.length} testfiler har syntaksfeil`);
  process.exit(1);
}
console.log(`Testsyntaks OK: ${files.length} JS/CJS/MJS-filer`);
