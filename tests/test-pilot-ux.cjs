const fs = require('fs');
const assert = require('assert');

const html = fs.readFileSync('index.html','utf8');
const app = fs.readFileSync('app.js','utf8');
const css = fs.readFileSync('styles.css','utf8');
const backlog = fs.readFileSync('docs/BRUKERTEST-FUNN-OG-BACKLOG.md','utf8');

assert(!html.includes('SAMTALELAB'), 'Samtalelab skal ikke være et brukerbegrep');
assert(!html.includes('Samtalesimulering'), 'Samtalesimulering skal ikke være et brukerbegrep i HTML');
assert(html.includes('Samtaleøvelse'), 'Samtaleøvelse mangler i UI');
assert(html.includes('mobile-bottom-nav'), 'Mobil bunnnavigasjon mangler');
assert(html.includes('mobile-chat-glyph'), 'Samtaleøvelse mangler snakkebobleikon i mobilmenyen');
assert(html.includes('topbar-mobile-theme') && html.includes('mobile-theme-cycle'), 'Mobil temasvitsj mangler i toppfeltet');
assert(html.includes('assets/images/logo.png') && html.includes('simulation-logo-crop'), 'Samtaleøvelse mangler full logo');
assert(!app.includes("'Samtalesimulering'"), 'Appen lagrer fortsatt gammelt brukerbegrep');
assert(app.includes("setBreadcrumb('Samtaleøvelse"), 'Breadcrumb bruker ikke Samtaleøvelse');
assert(css.includes('MOBILE UX PILOT v20.11'), 'Mobile-first CSS mangler');
assert(css.includes('MOBILE UX REFINEMENT 29.10'), 'Siste mobilfinjustering mangler');
assert(css.includes('.mobile-bottom-nav'), 'Mobilnavigasjon mangler CSS');
assert(css.includes('html[data-theme="hybrid"] .mobile-bottom-nav'), 'Hybrid mobilmeny mangler mørk variant');
assert(css.includes('#home-view .hero-visual'), 'Mobilforsiden mangler kompakt hero-bilde');
assert(css.includes('display: none !important;') && css.includes('.sidebar,'), 'Mobil skal skjule desktop-sidefeltet');
assert(backlog.includes('## 12. Voice / tale i samtaleøvelsen'), 'Voice-funn mangler i brukertestbackloggen');
assert(fs.existsSync('docs/VERSJONSSTRATEGI.md'), 'Versjonsstrategi mangler');
assert(fs.existsSync('docs/VOICE-DESIGN.md'), 'Voice-design mangler');

console.log('Pilot UX v20.11: begreper, mobil, voice-backlog og versjonsstrategi OK');
