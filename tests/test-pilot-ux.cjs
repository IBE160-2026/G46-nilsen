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
assert(html.includes('mobile-nav-ai-glyph') && html.includes('assets/images/profile-ai.png'), 'Samtaleøvelse mangler KI-profil i mobilmenyen');
assert(html.includes('topbar-mobile-theme') && html.includes('mobile-theme-cycle'), 'Mobil temasvitsj mangler i toppfeltet');
assert(/simulation-logo-crop[\s\S]*?assets\/images\/profile-ai\.png/.test(html), 'Samtaleøvelse mangler egen KI-illustrasjon');
assert(!app.includes("'Samtalesimulering'"), 'Appen lagrer fortsatt gammelt brukerbegrep');
assert(app.includes("setBreadcrumb('Samtaleøvelse"), 'Breadcrumb bruker ikke Samtaleøvelse');
assert(css.includes('MOBILE UX PILOT v20.11'), 'Mobile-first CSS mangler');
assert(css.includes('MOBILE UX REFINEMENT 29.10'), 'Siste mobilfinjustering mangler');
assert(css.includes('.mobile-bottom-nav'), 'Mobilnavigasjon mangler CSS');
assert(css.includes('html[data-theme="hybrid"] .mobile-bottom-nav'), 'Hybrid mobilmeny mangler mørk variant');
assert(css.includes('#home-view .hero-visual'), 'Mobilforsiden mangler kompakt hero-bilde');
assert(css.includes('v20.11.1 DESKTOP / TABLET RESPONSIVE NORMALIZATION'), 'Desktop/tablet-normalisering mangler');
assert(css.includes('@media (min-width:641px)'), 'Desktop skal beholdes over 640px');
assert(!css.includes('max-width:700px') && !css.includes('max-width: 700px'), 'Gammel 700px mobilgrense finnes fortsatt');
assert(css.includes('content: normal !important;') && css.includes('#simulation-view .simulation-logo-crop img'), 'Samtaleøvelse skal bruke samme bilde i alle temaer');
assert(css.includes('grid-template-columns: repeat(2,minmax(0,1fr)) !important;'), 'Mellombredde på PC/tablet skal ikke falle til én mobilkolonne');
assert(css.includes('display: none !important;') && css.includes('.sidebar,'), 'Mobil skal skjule desktop-sidefeltet');
assert(backlog.includes('## 12. Voice / tale i samtaleøvelsen'), 'Voice-funn mangler i brukertestbackloggen');
assert(fs.existsSync('docs/VERSJONSSTRATEGI.md'), 'Versjonsstrategi mangler');
assert(fs.existsSync('docs/VOICE-DESIGN.md'), 'Voice-design mangler');

console.log('Produksjons-UX v20.11.2: begreper, mobil, PWA, voice-backlog og versjonsstrategi OK');
