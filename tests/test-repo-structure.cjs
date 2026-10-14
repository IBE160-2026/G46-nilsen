const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

const root = path.resolve(__dirname, "..");
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

const entries = fs.readdirSync(root, { withFileTypes: true });
const unexpected = entries
  .filter(entry => {
    if (entry.name === ".git") return false;
    return entry.isDirectory()
      ? !allowedRootDirs.has(entry.name)
      : !allowedRootFiles.has(entry.name);
  })
  .map(entry => entry.name);

assert.deepEqual(unexpected, [], `Uventede/løse elementer i rotmappen: ${unexpected.join(", ")}`);

const forbiddenPatterns = [
  /^\.env$/i,
  /^\.env\.(?!example$).+/i,
  /\.zip$/i,
  /\.bak$/i,
  /\.tmp$/i,
  /~$/,
  /(?:^|[-_. ])(?:backup|copy|kopi)(?:[-_. ]|$)/i,
  /^test[-_.]/i
];

for (const entry of entries) {
  if (entry.name === ".git") continue;
  assert(
    !forbiddenPatterns.some(pattern => pattern.test(entry.name)),
    `Mistenkelig rotfil/-mappe: ${entry.name}`
  );
}

const gitignore = fs.readFileSync(path.join(root, ".gitignore"), "utf8");
for (const required of [".env", "node_modules"]) {
  assert(gitignore.includes(required), `.gitignore mangler regel for ${required}`);
}

console.log("Repo-struktur: OK");
