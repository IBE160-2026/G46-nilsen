const fs=require('fs');const assert=require('assert');
const app=fs.readFileSync('app.js','utf8');
const css=fs.readFileSync('styles.css','utf8');
const server=fs.readFileSync('server.js','utf8');

assert(app.includes("function speechBubbleMarkup(side='left')"));
assert(app.includes('speech-bubble-shape'));
assert(!app.includes("speechTailMarkup("));
assert(css.includes('translate(-5px,-62px)'));
assert(css.includes('html[data-theme="dark"] .employee-bubble'));
assert(css.includes('html[data-theme="dark"] .leader-bubble'));
assert(css.includes('.speech-bubble-shape path'));
assert(css.includes('mask:none !important'));
assert(server.includes('Sikt mot ca. 90–160 ord'));
assert(server.includes('høyst 1–2 konkrete formuleringseksempler'));
console.log('v19.12.0 UI/oppfølging-test OK');
