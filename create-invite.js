import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
const __dirname=path.dirname(fileURLToPath(import.meta.url));
const dataDir=path.join(__dirname,"data"); const file=path.join(dataDir,"invites.json");
fs.mkdirSync(dataDir,{recursive:true});
let invites=[]; try{invites=JSON.parse(fs.readFileSync(file,"utf8"));}catch(_){}
const count=Math.max(1,Math.min(50,Number(process.argv[2]||1)));
const baseUrl=(process.env.APP_BASE_URL||`http://localhost:${process.env.PORT||3000}`).replace(/\/$/,"");
for(let i=0;i<count;i++){
  const code=crypto.randomBytes(18).toString("base64url");
  invites.push({id:crypto.randomUUID(),codeHash:crypto.createHash("sha256").update(code).digest("hex"),createdAt:new Date().toISOString(),usedAt:null,userId:null});
  console.log(`Invitasjon ${i+1}: ${baseUrl}/?invite=${code}`);
}
fs.writeFileSync(file,JSON.stringify(invites,null,2),"utf8");
