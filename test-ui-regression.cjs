const fs = require('fs');
const assert = require('assert');
const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');

for (const page of ['admin', 'help', 'survey']) {
  assert(html.includes(`data-page-icon="${page}"`), `${page}: mangler minimert sideikon`);
}
assert(html.includes('id="admin-view"') && /id="admin-view"[\s\S]*?utility-page-logo/.test(html), 'Admin mangler logo ved overskrift');
assert(html.includes('id="help-view"') && /id="help-view"[\s\S]*?utility-page-logo/.test(html), 'Hjelp mangler logo ved overskrift');
assert(html.includes('id="survey-view"') && /id="survey-view"[\s\S]*?utility-page-logo/.test(html), 'Brukertest mangler logo ved overskrift');
assert(css.includes('width:42px!important'), 'Minimert ikon er ikke gjort større');
assert(css.includes('transform:translateY(-4px)'), 'Minimert ikon er ikke hevet');
assert(css.includes('font-weight:700!important'), 'Accordion-overskrifter er ikke tonet ned');
assert(!/<details[^>]*\sopen(?:\s|>|=)/.test(html), 'En eller flere details er åpne som standard');
console.log('v20.10.3 UI-kontroll: OK');
