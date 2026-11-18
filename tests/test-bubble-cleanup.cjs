const fs=require('fs'); const assert=require('assert');
const app=fs.readFileSync('app.js','utf8');
const css=[
  fs.readFileSync('styles.css','utf8'),
  fs.readFileSync('styles-core.css','utf8'),
  fs.readFileSync('styles-core-foundation.css', 'utf8'),
  fs.readFileSync('styles-core-dialogue.css', 'utf8'),
  fs.readFileSync('styles-core-simulation.css', 'utf8'),
  fs.readFileSync('styles-core-utilities.css', 'utf8'),
  fs.readFileSync('styles-core-01-shell.css', 'utf8'),
  fs.readFileSync('styles-core-02-forms.css', 'utf8'),
  fs.readFileSync('styles-core-03-situation.css', 'utf8'),
  fs.readFileSync('styles-core-04-topic-layout.css', 'utf8'),
  fs.readFileSync('styles-core-05-guidance.css', 'utf8'),
  fs.readFileSync('styles-core-06-auth-history.css', 'utf8'),
  fs.readFileSync('styles-core-07-reports.css', 'utf8'),
  fs.readFileSync('styles-core-08-simulation-flow.css', 'utf8'),
  fs.readFileSync('styles-core-09-simulation-controls.css', 'utf8'),
  fs.readFileSync('styles-core-10-auth-views.css', 'utf8'),
  fs.readFileSync('styles-core-11-speech-bubbles.css', 'utf8'),
  fs.readFileSync('styles-core-12-admin.css', 'utf8'),
  fs.readFileSync('styles-core-13-survey.css', 'utf8'),
  fs.readFileSync('styles-core-14-final-adjustments.css', 'utf8'),
  fs.readFileSync('styles-responsive.css','utf8'),
  fs.readFileSync('styles-overrides.css','utf8')
].join('\n');

assert(app.includes("function speechBubblePath(width, bodyHeight)"));
assert(app.includes("const attachStart = 30"));
assert(app.includes("const attachEnd = 52"));
assert(app.includes("const tipOffset = 24"));
assert(app.includes("translate(${width} 0) scale(-1 1)"));
assert(app.includes("queueSpeechBubbleRefresh"));
assert(!app.includes("speech-tail-fixed"));

assert(css.includes(".speech-bubble-shape path"));
assert(!css.includes(".speech-tail-fixed"));
assert(!css.includes("-webkit-mask:url(\"snakkeboble.svg\")"));
assert(!css.includes(".leader-bubble::before"));
assert(!css.includes(".employee-bubble::after"));

assert(app.includes("cleanStoredConversationText"));
assert(!app.includes("text:el.innerText.replace("));

console.log("Snakkeboble-regresjonstest OK");



