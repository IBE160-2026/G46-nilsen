const fs=require('fs'); const assert=require('assert');
const app=fs.readFileSync('app.js','utf8');
const css=fs.readFileSync('styles.css','utf8');

assert(app.includes('function findLikelyGivenNames(source)'));
assert(app.includes('const likelyNames = findLikelyGivenNames(source)'));
assert(app.includes("findings.push({\n      type: 'name'"));
assert(app.includes('function updateContinuePrivacy()'));
assert(app.includes("addEventListener('input', updateContinuePrivacy)"));
assert(app.includes('const privacyFindings = detectSensitiveInfo(question)'));
assert(app.includes('const privacyFindings = detectSensitiveInfo(cleaned)'));
assert(app.includes('updateSimulationTurnPrivacy()'));

assert(css.includes('transform:translateY(20px)'));
assert(css.includes('transform:translateY(16px)'));

assert(app.includes('<rect x="3.5" y="7.5" width="13" height="9" rx="1.5"></rect>'));
assert(app.includes("iconKey: 'coinsUp'"));

console.log('v19.12.4 personvern/ikon-regresjon OK');
