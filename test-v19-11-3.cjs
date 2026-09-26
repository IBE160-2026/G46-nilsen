const fs=require('fs');
const app=fs.readFileSync('app.js','utf8');
const html=fs.readFileSync('index.html','utf8');
const server=fs.readFileSync('server.js','utf8');
const checks=[
  ['auth visible initially',html.includes('auth-overlay required-auth')&&!html.includes('auth-overlay required-auth\" hidden')],
  ['app inert initially',html.includes('class=\"app-shell\" inert aria-hidden=\"true\"')],
  ['startup login gate',app.includes("else{openAuth('login',true);}")],
  ['unlock after session',app.includes('setAppLocked(false)')],
  ['registration requires invite',server.includes('INVITE_REQUIRED')&&server.includes('INVALID_INVITE')],
  ['invite one use',server.includes('.is("used_at", null)')],
];
let ok=true; for(const [name,pass] of checks){console.log(`${pass?'PASS':'FAIL'} ${name}`); if(!pass)ok=false;}
process.exit(ok?0:1);
