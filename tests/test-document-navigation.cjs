#!/usr/bin/env node
"use strict";
// Offline integrity check for the sensor navigation. This is intentionally
// scoped to the navigation files, not a claim that all historical links work.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const documents = [
  "docs/OVERSIKT.md",
  "docs/DOKUMENTASJON-SJEKKLISTE.md",
  "docs/PROSJEKTSTATUS.md",
  "docs/DOKUMENTKART.md",
  "docs/TESTBEVIS-OVERSIKT.md",
  "README.md",
];
let checked = 0;
for (const doc of documents) {
  const source = fs.readFileSync(path.join(root, doc), "utf8");
  // Both files are short, canonical navigation documents; check all links.
  const text = source;
  assert.ok(text, doc + ": navigasjonsseksjonen mangler");
  const regex = /\[[^\]\n]+\]\(([^)]+)\)/g;
  let match;
  while ((match = regex.exec(text))) {
    const raw = match[1].trim();
    if (/^(https?:|mailto:)/i.test(raw)) continue;
    const target = decodeURIComponent(raw.split("#")[0].split("?")[0]);
    const hash = raw.includes("#") ? decodeURIComponent(raw.split("#").slice(1).join("#")) : "";
    const relative = target ? path.resolve(root, path.dirname(doc), target) : path.join(root, doc);
    assert.ok(relative === root || relative.startsWith(root + path.sep),
      doc + ": link escapes repository: " + raw);
    assert.ok(fs.existsSync(relative), doc + ": missing link target: " + raw);
    if (hash && relative.endsWith(".md")) {
      const linkedText = fs.readFileSync(relative, "utf8");
      const headings = [...linkedText.matchAll(/^#{1,6}\s+(.+)$/gm)].map(x => x[1]
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/<[^>]+>/g, "")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}\s-]/gu, "")
        .replace(/\s/g, "-"));
      assert.ok(headings.includes(hash.toLowerCase()),
        doc + ": missing Markdown heading anchor: " + raw);
    }
    checked++;
  }
}
assert.ok(checked >= 15, "Too few navigation links were checked: " + checked);
console.log("Sensor navigation links: OK (" + checked + " local targets/anchors checked)");

// README is the sensor quickstart, not a changelog or project status report.
// This test deliberately checks layout/essential commands, not runtime behavior
// (the separate clean-install/demo CI job executes the application).
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const readmeLines = readme.trimEnd().split(/\r?\n/);
assert.ok(readmeLines.length <= 85,
  "README should stay concise for the examiner (" + readmeLines.length + " lines; max 85)");
for (const phrase of [
  "git clone https://github.com/IBE160-2026/G46-nilsen.git",
  "npm ci", "npm run demo", "http://localhost:3000",
  "npm test", "npm run audit:submission",
  "docs/OVERSIKT.md", "docs/PROSJEKTSTATUS.md",
]) {
  assert.ok(readme.includes(phrase), "README is missing sensor quickstart/reference: " + phrase);
}
assert.ok(/fiktiv/i.test(readme), "README must explain that demo responses are fictional");
assert.ok(!/^## .*?(?:versjonshistorikk|changelog|sensorstatus|teknisk gjeld)/im.test(readme),
  "README should link to specialist reports instead of duplicating them");
console.log("README sensor quickstart contract: OK (" + readmeLines.length + " lines)");


const historicalReflectionFiles = [
  "docs/REFLEKSJONSRAPPORT-UTKAST.md",
  "docs/REFLEKSJONSRAPPORT-KONSENTRERT-UTKAST.md",
  "docs/REFLECTION-NOTES-v20.md",
  "docs/REFLEKSJONSADDENDUM-2026-11-02.md",
];
for (const doc of historicalReflectionFiles) {
  const head = fs.readFileSync(path.join(root, doc), "utf8").split(/\r?\n/).slice(0, 6).join("\n");
  assert.ok(head.includes("HISTORISK ARBEIDSDOKUMENT"), doc + ": historical status marker missing");
  assert.ok(head.includes("REFLEKSJONSRAPPORT-MAL-TILPASSET-SOLO.md"),
    doc + ": missing canonical reflection reference");
}
console.log("Historical reflection draft markers: OK");
