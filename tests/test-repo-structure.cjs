const { execFileSync } = require("node:child_process");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
const tracked = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" })
  .split(/\r?\n/)
  .map(line => line.trim())
  .filter(Boolean);

const allowedRootFiles = new Set([
  ".env.example",
  ".gitignore",
  "app.js",
  "CHANGELOG.md",
  "index.html",
  "package-lock.json",
  "package.json",
  "product-brief.md",
  "README.md",
  "server.js",
  "styles.css",
  "tilbakemelding-product-brief.md"
]);
const allowedRootDirs = new Set(["assets", "data", "database", "docs", "scripts", "src", "tests"]);

const trackedRootItems = [...new Set(tracked.map(file => file.split("/")[0]))].sort();
const unexpected = trackedRootItems.filter(item =>
  !allowedRootFiles.has(item) && !allowedRootDirs.has(item)
);
assert.deepEqual(unexpected, [], `Uventede/løse elementer spores i repo-roten: ${unexpected.join(", ")}`);

const forbiddenTracked = tracked.filter(file =>
  /(^|\/)\.env$/i.test(file) ||
  /(^|\/)\.env\.(?!example$)[^/]+$/i.test(file) ||
  /(^|\/)node_modules\//i.test(file) ||
  /(^|\/)(?:dist|build|coverage)\//i.test(file) ||
  /\.(?:zip|bak|tmp)$/i.test(file) ||
  /~$/i.test(file)
);
assert.deepEqual(forbiddenTracked, [], `Forbudte genererte/hemmelige filer spores i Git: ${forbiddenTracked.join(", ")}`);

const looseRootTests = tracked.filter(file => !file.includes("/") && /^test[-_.]/i.test(file));
assert.deepEqual(looseRootTests, [], `Løse testfiler i rotmappen: ${looseRootTests.join(", ")}`);

const gitignore = require("node:fs").readFileSync(path.join(root, ".gitignore"), "utf8");
for (const required of [".env", "node_modules"]) {
  assert(gitignore.includes(required), `.gitignore mangler regel for ${required}`);
}

console.log("Repo-struktur: OK");


const packageJson = JSON.parse(require("node:fs").readFileSync(path.join(root, "package.json"), "utf8"));
const packageLock = JSON.parse(require("node:fs").readFileSync(path.join(root, "package-lock.json"), "utf8"));
assert.equal(packageLock.name, packageJson.name, "package-lock.json har annet pakkenavn enn package.json");
assert.equal(packageLock.version, packageJson.version, "package-lock.json er ikke synkronisert med package.json-versjonen");
assert.equal(packageLock.packages?.[""]?.version, packageJson.version, "Rotpakken i package-lock.json har feil versjon");
assert.deepEqual(packageLock.packages?.[""]?.dependencies || {}, packageJson.dependencies || {}, "Rotavhengighetene i package-lock.json er ikke synkronisert");
console.log("Package-lock-konsistens: OK");


assert.equal(packageJson.engines?.node, ">=26.12.1 <27", "Node-runtimekrav i package.json er ikke sikkerhetsintervallet >=26.12.1 <27");
assert.equal(packageLock.packages?.[""]?.engines?.node, packageJson.engines?.node, "package-lock.json har annet Node-runtimekrav enn package.json");
console.log("Node-runtimekrav: OK");
