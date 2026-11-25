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
  "README.md",
];
let checked = 0;
for (const doc of documents) {
  const source = fs.readFileSync(path.join(root, doc), "utf8");
  // README's full historical reference section is outside this navigation audit.
  const text = doc === "README.md"
    ? source.split("## Start her – snarveier for sensor")[1]?.split("## Sensorstatus")[0]
    : source;
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
