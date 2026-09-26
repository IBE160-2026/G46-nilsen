const fs=require('fs'); const assert=require('assert');
const app=fs.readFileSync('app.js','utf8');
const css=fs.readFileSync('styles.css','utf8');

assert(app.includes("function speechBubblePath(width, bodyHeight)"));
assert(app.includes("const attachStart = 30"));
assert(app.includes("const attachEnd = 52"));
assert(app.includes("const tipOffset = 24"));
assert(app.includes("translate(${width} 0) scale(-1 1)"));
assert(app.includes("queueSpeechBubbleRefresh"));
assert(!app.includes("speech-tail-fixed"));

assert(css.includes("v19.12.3 – ENESTE aktive snakkebobleimplementasjon"));
assert(css.includes(".speech-bubble-shape path"));
assert(!css.includes(".speech-tail-fixed"));
assert(!css.includes("-webkit-mask:url(\"snakkeboble.svg\")"));
assert(!css.includes(".leader-bubble::before"));
assert(!css.includes(".employee-bubble::after"));

assert(app.includes("cleanStoredConversationText"));
assert(!app.includes("text:el.innerText.replace("));

console.log("v19.12.3 bobleopprydding OK");
