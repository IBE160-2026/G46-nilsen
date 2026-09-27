import fs from 'fs';
const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');
const app=fs.readFileSync('app.js','utf8');
const server=fs.readFileSync('server.js','utf8');
const checks=[
 ['version', html.includes('styles.css?v=19.9') && app.includes('19.9.0') && server.includes('19.9.0')],
 ['hybrid theme choice', (html.match(/data-theme="hybrid"/g)||[]).length>=2],
 ['hybrid default', app.includes("|| 'hybrid'")],
 ['hybrid dark sidebar', css.includes(':root[data-theme="hybrid"]') && css.includes('html[data-theme="hybrid"] .sidebar')],
 ['history main nav', html.indexOf('data-view="history"') < html.indexOf('<div class="sidebar-bottom">')],
 ['settings secondary nav', html.indexOf('data-view="settings"') > html.indexOf('<div class="sidebar-bottom">')],
 ['requested contact email', server.includes('const contactEmail = "cecilie.c.nilsen@himolde.no";')],
 ['utility title row', (html.match(/class="utility-title-row"/g)||[]).length>=6],
 ['classic bubble tail override', css.includes('.employee-bubble::after') && css.includes('border-bottom-left-radius:24px 18px')],
];
let fail=0; for(const [name,ok] of checks){console.log(`${ok?'OK':'FAIL'} ${name}`); if(!ok) fail++;}
if(fail) process.exit(1);
