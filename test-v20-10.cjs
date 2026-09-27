const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('styles.css', 'utf8');
const js = fs.readFileSync('app.js', 'utf8');
const server = fs.readFileSync('server.js', 'utf8');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));

assert.equal(pkg.version, '20.10.0');

// 1: startkort i simulatoren er like – ingen featured-variant på ny simulering.
assert(html.includes('class="simulation-launch-card" id="simulation-new-direct"'));
assert(!html.includes('class="simulation-launch-card featured" id="simulation-new-direct"'));
assert(css.includes('.simulation-launch-grid.two-options .simulation-launch-card'));

// 2: samme midlertidig-toggle finnes utenfor situation-form og kan vises i historikkmodus.
const formEnd = html.indexOf('</form>', html.indexOf('id="situation-form"'));
const togglePos = html.indexOf('id="temporary-chat-option"');
assert(togglePos > formEnd, 'temporary-chat-option skal ligge utenfor situation-form');
assert(css.includes('#guidance-view.history-loaded-mode #temporary-chat-option{display:flex!important;}'));
assert(js.includes("const temporaryChat = document.querySelector('#temporary-chat');"));

// 3: accordion-overskrifter har én eksplisitt felles typografiregel.
assert(css.includes('.utility-accordion>summary,\n.admin-panel>summary,\n.admin-content-section>summary'));
assert(css.includes('font-size:1.18rem!important;'));

// 4: mobbingbildet bruker riktig fil og er eksponert av serveren.
assert(js.includes("image: './topic-mobbing-trakassering.png'"));
assert(server.includes('"topic-mobbing-trakassering.png"'));
assert(fs.existsSync('topic-mobbing-trakassering.png'));

// 5: nye fagressurser finnes samlet under egen seksjon.
assert(html.includes('<summary>Andre relevante fagsider</summary>'));
assert(html.includes('Helsedirektoratet – motiverende intervju og samtaleteknikk'));
assert(html.includes('BI – relasjonsledelse og leder–medarbeider-relasjonen'));
assert(html.includes('BI – tilbakemeldinger og feedback'));
assert(html.includes('STAMI – psykologisk trygghet og arbeidsmiljø'));
assert(html.includes('Arbeidstilsynet – håndtering av krevende personalsaker og konflikter'));
assert(html.includes('Statens arbeidsgiverportal – gjennomføring av møte'));

console.log('v20.10: alle kontroller bestått');
