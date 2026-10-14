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
  "styles.css"
]);
const allowedRootDirs = new Set(["assets", "data", "database", "docs", "scripts", "tests"]);

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
