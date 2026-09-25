import fs from 'node:fs';
const app=fs.readFileSync('app.js','utf8');
const server=fs.readFileSync('server.js','utf8');
const css=fs.readFileSync('styles.css','utf8');
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
const checks=[
 ['version 19.11',pkg.version==='19.11.0'&&server.includes('19.11.0')&&app.includes('19.11.0')],
 ['situation carried through subtopic',app.includes('pendingSituationText')&&app.includes("openGuidance(title, help, carriedSituation)")&&app.includes("openGuidance(title, help, query)")],
 ['AI topic plus subtopic',server.includes('primary_subtopic')&&app.includes('KI foreslo ${escapeHtml(topic.title)} → ${escapeHtml(subtopic[0])}')],
 ['protected AI endpoints',server.includes('app.post("/api/analyze-situation", requireUser')&&server.includes('app.post("/api/generate-guidance", requireUser')&&server.includes('app.post("/api/continue-conversation", requireUser')],
 ['protected simulator endpoints',server.includes("app.post('/api/simulation-turn', requireUser")&&server.includes("app.post('/api/simulation-help', requireUser")&&server.includes("app.post('/api/simulation-feedback', requireUser")],
 ['required login gate',app.includes('function requireLogin()')&&css.includes('.auth-dialog.required-auth .dialog-close')],
 ['lighter hybrid logo',css.includes('brightness(1.55)')],
 ['utility logo moved up',css.includes('translateY(-20px)')],
 ['curved speech bubbles no clip triangle',css.includes('border-bottom-left-radius:38px 30px')&&css.includes('conversation-assistant::after')&&css.includes('background:var(--bg)')],
 ['conversation bubbles reuse',css.includes('.conversation-user::before')&&css.includes('.conversation-assistant::before')]
];
let failed=false; for(const [n,ok] of checks){console.log(ok?`OK ${n}`:`FAIL ${n}`);if(!ok)failed=true;} if(failed)process.exit(1);
