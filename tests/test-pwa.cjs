const fs=require('fs');
const assert=require('assert');

const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const server=fs.readFileSync('server.js','utf8');
const demo=fs.readFileSync('scripts/sensor-demo.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));

assert.equal(manifest.name,'Samtalestøtte');
assert.equal(manifest.display,'standalone');
assert.equal(manifest.start_url,'/');
assert(Array.isArray(manifest.icons) && manifest.icons.some(x=>x.src==='/assets/icons/app-icon.svg'),'Manifest mangler appikon');
assert(html.includes('rel="manifest"') && html.includes('install-app-button'),'HTML mangler PWA/installasjons-UI');
assert(app.includes("beforeinstallprompt") && app.includes("navigator.serviceWorker.register('/sw.js')"),'Klient mangler installprompt/service worker');
assert(sw.includes("url.pathname.startsWith('/api/')") && sw.includes("if (request.method !== 'GET')"),'Service worker må ignorere API og ikke-GET');
assert(server.includes('"manifest.webmanifest"') && server.includes('"sw.js"') && server.includes('"assets/icons/app-icon.svg"'),'Produksjonsserver eksponerer ikke PWA-filer');
assert(demo.includes('"manifest.webmanifest"') && demo.includes('"sw.js"'),'Demo-server eksponerer ikke PWA-filer');
assert(fs.existsSync('assets/icons/app-icon.svg'),'Appikon mangler');

console.log('PWA: manifest, installasjon, appikon og sikker shell-cache OK');
