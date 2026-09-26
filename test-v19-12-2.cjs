const fs=require('fs');const assert=require('assert');
const app=fs.readFileSync('app.js','utf8');
const css=fs.readFileSync('styles.css','utf8');

assert(app.includes('function speechBubblePath(width, bodyHeight)'));
assert(app.includes('const attachStart = 30'));
assert(app.includes('const attachEnd = 52'));
assert(app.includes('const tipOffset = 24'));
assert(app.includes("translate(${width} 0) scale(-1 1)"));
assert(app.includes('new ResizeObserver'));
assert(app.includes('new MutationObserver'));
assert(css.includes('.speech-bubble-shape path'));
assert(css.includes('transform:translateY(14px)'));
assert(css.includes('margin-bottom:26px'));
assert(css.includes('content:none !important'));
console.log('v19.12.2 preview9-boble-test OK');
