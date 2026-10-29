const fs=require('fs');
const assert=require('assert');

const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const server=fs.readFileSync('server.js','utf8');
const demo=fs.readFileSync('scripts/sensor-demo.js','utf8');
const sw=fs.readFileSync('sw.js','utf8');
const manifest=JSON.parse(fs.readFileSync('manifest.webmanifest','utf8'));

function pngSize(file){
  const data=fs.readFileSync(file);
  assert(data.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])), file+' er ikke gyldig PNG');
  return {width:data.readUInt32BE(16),height:data.readUInt32BE(20)};
}

assert.equal(manifest.name,'Samtalestøtte');
assert.equal(manifest.display,'standalone');
assert.equal(manifest.start_url,'/');
assert.equal(manifest.scope,'/');

const icon192=manifest.icons.find(x=>x.src==='/assets/icons/app-icon-192.png' && x.sizes==='192x192');
const icon512=manifest.icons.find(x=>x.src==='/assets/icons/app-icon-512.png' && x.sizes==='512x512');
const maskable=manifest.icons.find(x=>x.src==='/assets/icons/app-icon-maskable-512.png' && x.sizes==='512x512' && x.purpose==='maskable');
assert(icon192 && icon512 && maskable,'Manifest mangler eksplisitte 192/512 PWA-ikoner');

assert.deepEqual(pngSize('assets/icons/app-icon-192.png'),{width:192,height:192});
assert.deepEqual(pngSize('assets/icons/app-icon-512.png'),{width:512,height:512});
assert.deepEqual(pngSize('assets/icons/app-icon-maskable-512.png'),{width:512,height:512});

assert(html.includes('rel="manifest"') && html.includes('install-app-button'),'HTML mangler PWA/installasjons-UI');
assert(app.includes('beforeinstallprompt') && app.includes("navigator.serviceWorker.register('/sw.js?"),'Klient mangler installprompt/service worker');
assert(sw.includes("url.pathname.startsWith('/api/')") && sw.includes("if (request.method !== 'GET')"),'Service worker må ignorere API og ikke-GET');
assert(sw.includes('/assets/icons/app-icon-192.png') && sw.includes('/assets/icons/app-icon-512.png'),'Service worker cacher ikke PWA-ikoner');
assert(server.includes('"manifest.webmanifest"') && server.includes('"sw.js"') && server.includes('"assets/icons/app-icon-192.png"'),'Produksjonsserver eksponerer ikke PWA-filene');
assert(demo.includes('"manifest.webmanifest"') && demo.includes('"sw.js"'),'Demo-server eksponerer ikke PWA-filer');

console.log('PWA: standalone-manifest, rasterikoner, installasjon og sikker shell-cache OK');
