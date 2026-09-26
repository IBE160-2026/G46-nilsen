const fs=require('fs');const assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const css=fs.readFileSync('styles.css','utf8');

assert(html.includes('id="auth-dialog"') && html.includes('aria-labelledby="auth-title" hidden'));
assert(app.includes("function speechTailMarkup(side='left')"));
assert(app.includes("speechTailMarkup(leader ? 'right' : 'left')"));
assert(app.includes("await refreshAuth();"));
assert(!app.includes("else{openAuth('login',true);}\\nrefreshAuth().finally"));
assert(css.includes('translate(-5px,-82px)'));
assert(css.includes('.simulation-bubble .speech-tail'));
assert(css.includes('content:none !important'));
assert(css.includes('width:42px'));
assert(css.includes('width:29px'));
console.log('v19.11.9 boble/logo/auth-test OK');
