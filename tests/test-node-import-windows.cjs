// Windows regression: Node.js --import requires file:///C:/... rather than C:\\...
// Must work on Linux CI AND on Windows PowerShell. No external calls or secrets.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const {pathToFileURL} = require("node:url");
const {spawnSync} = require("node:child_process");

const root=path.resolve(__dirname,"..");
const preload=path.join(root,"tests","support","offline-openai-fetch.mjs");
const preloadUrl=pathToFileURL(preload).href;
assert(preloadUrl.startsWith("file:"),"Preload argument must be a file: URL");
assert(fs.existsSync(preload),"Local fake-provider preload must exist");

const tests=[
  "tests/test-source-provenance-http.cjs",
  "tests/test-benchmark-live-http.cjs",
  "tests/test-benchmark-rpc-http.cjs"
];
for(const file of tests){
  const source=fs.readFileSync(path.join(root,file),"utf8");
  assert(source.includes('require("node:url")'),file+": must import URL utility");
  assert(source.includes('"--import",pathToFileURL(path.join(root,"tests/support/offline-openai-fetch.mjs")).href'),
    file+": must normalize the exact --import preload path as a file: URL");
  assert(!source.includes('"--import",path.join(root,"tests/support/offline-openai-fetch.mjs")'),
    file+": raw OS-specific path is not safe on Windows");
}

// Exercise the real ESM loader with the file URL and no mocked provider call.
const probe=spawnSync(process.execPath,[
  "--import",preloadUrl,"-e",'process.stdout.write("ESM_PRELOAD_OK")'
],{cwd:root,encoding:"utf8",timeout:10000,env:{...process.env,
  TEST_FAKE_OPENAI_PORT:"32620"}});
assert.equal(probe.status,0,"Node ESM preload failed: "+String(probe.stderr||probe.error));
assert.equal(probe.stdout,"ESM_PRELOAD_OK");
console.log("NODE --IMPORT WINDOWS OK: three simulated HTTP test runners use file URL; actual ESM preload succeeded; 0 AI calls");
