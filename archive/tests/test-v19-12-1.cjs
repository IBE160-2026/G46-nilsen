const fs=require('fs');const assert=require('assert');
const app=fs.readFileSync('app.js','utf8');
const css=fs.readFileSync('styles.css','utf8');

assert(app.includes('speech-tail-fixed'));
assert(app.includes('viewBox="180 470 315 105"'));
assert(app.includes('M480.833 479 L190.678 567.008 L309.333 479 Z'));
assert(css.includes('width:34px'));
assert(css.includes('height:23px'));
assert(css.includes('width:25px'));
assert(css.includes('height:17px'));
assert(css.includes('translate(-5px,-67px)'));
assert(css.includes('border-radius:22px'));
console.log('v19.12.1 fast-hale/logo-test OK');
