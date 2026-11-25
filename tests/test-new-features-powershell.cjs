// Contract for Windows clipboard test runner; static (PowerShell cannot run on every machine).
// Real execution is on the user's local Windows PowerShell with npm installed.
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const root=path.resolve(__dirname,"..");
const script=fs.readFileSync(path.join(root,"scripts/test-new-features.ps1"),"utf8");
const scripts=JSON.parse(fs.readFileSync(path.join(root,"package.json"),"utf8")).scripts;
const testList=script.split("$tests = @(")[1]?.split("\n    )")[0];
assert(testList,"PowerShell runner must have an explicit test list");
const tests=[...testList.matchAll(/"([^"]+)"/g)].map(match=>match[1]);
assert(tests.length>=20,"New-features test runner must cover the expanded QA suite");
assert.equal(new Set(tests).size,tests.length,"Do not run same test twice");
for(const name of tests)assert(scripts[name],"Unknown npm test script: "+name);
assert.match(script,/param\(\[switch\]\$Full\)/u,"Must offer optional full regression suite");
assert.match(script,/fix\/evidence-sources-20261120/u,"Must guard against testing stale main");
assert.match(script,/test-results/u,"Must keep full output out of Git");
assert.match(script,/Set-Clipboard -Value \$summary/u,"Short report must be copied to clipboard");
assert.match(script,/\$summary \| clip\.exe/u,"Windows clipboard fallback must exist");
assert.match(script,/\$output \| Out-File -FilePath \$log/u,"Detailed output must be logged locally");
assert(!/OPENAI_API_KEY|OPENROUTER_API_KEY|\b--run-live\b/u.test(script),
  "Offline runner must never require or activate live KI provider credentials");
console.log("POWERSHELL CLIPBOARD CONTRACT OK: "+tests.length+
  " defined npm checks, git branch guard, local log, compact clipboard summary; 0 KI calls");
