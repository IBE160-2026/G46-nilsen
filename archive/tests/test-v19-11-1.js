import fs from "node:fs";
const html=fs.readFileSync("index.html","utf8");
const css=fs.readFileSync("styles.css","utf8");
const app=fs.readFileSync("app.js","utf8");
const pkg=JSON.parse(fs.readFileSync("package.json","utf8"));
const checks=[
  [pkg.version==="19.11.1","package version"],
  [html.includes("app.js?v=19.11.1"),"app cache bust"],
  [html.includes("styles.css?v=19.11.1"),"css cache bust"],
  [app.includes("Du må være logget inn for å bruke Samtalestøtte."),"required login copy"],
  [app.includes("openAuth('login', true)"),"profile opens required auth"],
  [css.includes("profil/logg-på skal ikke få en firkantet hoverflate"),"clean profile hover"]
];
let bad=0; for(const [ok,name] of checks){console.log(`${ok?'✓':'✗'} ${name}`); if(!ok) bad++;}
if(bad) process.exit(1);
