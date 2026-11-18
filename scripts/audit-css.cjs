#!/usr/bin/env node
"use strict";
// Non-invasive audit of CSS complexity and cascade candidates.
// Reports identical selectors/properties inside the same at-rule context.
// These are CANDIDATES, not proof that rules can safely be removed.
const fs = require("node:fs");
const coreGroups = {
  "styles-core-foundation.css": [
    "styles-core-01-shell.css",
    "styles-core-02-forms.css",
    "styles-core-03-situation.css",
    "styles-core-04-topic-layout.css"
  ],
  "styles-core-dialogue.css": [
    "styles-core-05-guidance.css",
    "styles-core-06-auth-history.css",
    "styles-core-07-reports.css"
  ],
  "styles-core-simulation.css": [
    "styles-core-08-simulation-flow.css",
    "styles-core-09-simulation-controls.css",
    "styles-core-10-auth-views.css"
  ],
  "styles-core-utilities.css": [
    "styles-core-11-speech-bubbles.css",
    "styles-core-12-admin.css",
    "styles-core-13-survey.css",
    "styles-core-14-final-adjustments.css"
  ]
};
const coreChunks = Object.keys(coreGroups);
const files = [...Object.values(coreGroups).flat(), "styles-responsive.css", "styles-overrides.css"];
const coreIndex = fs.readFileSync("styles-core.css", "utf8");
const actualCoreImports = [...coreIndex.matchAll(/@import\s+url\(["']?([^"')]+)["']?\)/g)].map(x => x[1]);
for (const [group, children] of Object.entries(coreGroups)) {
  const content = fs.readFileSync(group, "utf8");
  const actual = [...content.matchAll(/@import\s+url\(["']?([^"')]+)["']?\)/g)].map(x => x[1]);
  if (JSON.stringify(actual) !== JSON.stringify(children.map(x=>"./"+x))) {
    throw new Error("Uventet CSS-import i "+group+": "+actual.join(", "));
  }
}
const expectedCoreImports = coreChunks.map(x => "./" + x);
if (JSON.stringify(actualCoreImports) !== JSON.stringify(expectedCoreImports)) {
  throw new Error("Uventet rekkefølge på CSS-kjernemodulene: " + actualCoreImports.join(", "));
}
const entry = fs.readFileSync("styles.css", "utf8");
const imports = [...entry.matchAll(/@import\s+url\(["']?([^"')]+)["']?\)/g)].map(x => x[1]);
const expected = ["styles-core.css", "styles-responsive.css", "styles-overrides.css"].map(x => "./" + x);
if (JSON.stringify(imports) !== JSON.stringify(expected)) {
  throw new Error("Uventet importrekkefølge i styles.css: " + imports.join(", "));
}
const normalize = text => text.replace(/\s+/g, " ").trim();
const normSelector = text => normalize(text).replace(/\s*([,:>+~])\s*/g, "$1");
function splitSelectorList(text) {
  let selectors = [], part = "", depthParens = 0, depthBrackets = 0, quote = "";
  for (const c of text) {
    if (quote) { part += c; if (c === quote) quote = ""; continue; }
    if (c === "'" || c === '"') { quote = c; part += c; continue; }
    if (c === "(") depthParens++;
    else if (c === ")") depthParens--;
    else if (c === "[") depthBrackets++;
    else if (c === "]") depthBrackets--;
    if (c === "," && depthParens === 0 && depthBrackets === 0) {
      if (part.trim()) selectors.push(normSelector(part));
      part = "";
    } else part += c;
  }
  if (part.trim()) selectors.push(normSelector(part));
  return selectors;
}
function parseCSS(source, filename) {
  const decls = [], blocks = [];
  const stack = [];
  let buf = "", line = 1, tokenLine = 1, comment = false, quote = "", escaped = false;
  function flush() {
    const top = stack[stack.length - 1];
    const token = buf.trim();
    if (top && top.type === "rule" && token.includes(":")) {
      const colon = token.indexOf(":");
      const prop = token.slice(0, colon).trim().toLowerCase();
      const value = normalize(token.slice(colon + 1));
      if (/^(?:--)?[-_a-z][-_a-z0-9]*$/i.test(prop)) {
        const important = /!important\s*$/i.test(value);
        for (const selector of top.selectors) {
          decls.push({ file: filename, line: tokenLine, scope: top.scope,
            selector, prop, value, important });
        }
        top.declarations.push(prop + ":" + value + ";");
      }
    }
    buf = ""; tokenLine = line;
  }
  for (let i = 0; i < source.length; i++) {
    const c = source[i];
    if (c === "\n") line++;
    if (comment) {
      if (c === "*" && source[i + 1] === "/") { comment = false; i++; }
      continue;
    }
    if (quote) {
      buf += c;
      if (escaped) escaped = false;
      else if (c === "\\") escaped = true;
      else if (c === quote) quote = "";
      continue;
    }
    if (c === "/" && source[i + 1] === "*") { comment = true; i++; continue; }
    if (c === "'" || c === '"') { quote = c; buf += c; continue; }
    if (c === "{") {
      const header = normSelector(buf);
      const scope = stack.filter(x => x.type === "at").map(x => x.header).join(" | ");
      stack.push(header.startsWith("@") ?
        { type: "at", header } :
        { type: "rule", selectors: splitSelectorList(header), header, scope,
          start: tokenLine, declarations: [] });
      buf = ""; tokenLine = line;
      continue;
    }
    if (c === ";") { flush(); continue; }
    if (c === "}") {
      flush();
      const block = stack.pop();
      if (!block) throw new Error("Ubalansert avsluttende } i " + filename + ":" + line);
      if (block.type === "rule") {
        blocks.push({ file: filename, line: block.start, end: line, scope: block.scope,
          selector: block.header, declarations: block.declarations.join("") });
      }
      buf = ""; tokenLine = line;
      continue;
    }
    if (!buf.trim() && !/\s/.test(c)) tokenLine = line;
    buf += c;
  }
  if (stack.length) throw new Error("Ubalansert CSS-blokk i " + filename);
  return { decls, blocks };
}
const measurements = [], decls = [], blocks = [];
for (const file of files) {
  const src = fs.readFileSync(file, "utf8");
  const parsed = parseCSS(src, file);
  measurements.push({ file, lines: src.split("\n").length,
    important: (src.match(/!important\b/gi) || []).length,
    rules: parsed.blocks.length });
  decls.push(...parsed.decls); blocks.push(...parsed.blocks);
}
const groups = new Map();
for (const d of decls) {
  const k = [d.scope, d.selector, d.prop].join(" | ");
  if (!groups.has(k)) groups.set(k, []);
  groups.get(k).push(d);
}
const repeated = [...groups.values()].filter(x => x.length > 1);
const lateImportant = [];
for (const arr of repeated) {
  for (let i = 1; i < arr.length; i++) {
    const d = arr[i];
    if (d.important && arr.slice(0, i).some(prev => prev.important)) lateImportant.push(d);
  }
}
const physicalOverrides = new Set(lateImportant.map(d => [d.file,d.line,d.prop,d.value].join("|")));
const exactGroups = new Map();
for (const b of blocks) {
  const key = [b.scope, b.selector, b.declarations].join("|");
  if (!exactGroups.has(key)) exactGroups.set(key, []);
  exactGroups.get(key).push(b);
}
const exactDuplicates = [...exactGroups.values()].filter(a => a.length > 1 && a[0].declarations);
const sortedConflicts = repeated
  .filter(a => a.some(x => x.important))
  .sort((a,b) => b.length - a.length)
  .slice(0, 12)
  .map(a => ({ selector: a[0].selector, property: a[0].prop, scope: a[0].scope || "global",
    occurrences: a.map(x => x.file + ":" + x.line + " = " + x.value.slice(0, 90)) }));
const result = {
  files: measurements,
  totalLines: measurements.reduce((s,x)=>s+x.lines,0),
  important: measurements.reduce((s,x)=>s+x.important,0),
  parsedBlocks: blocks.length,
  selectorPropertyScopeRepetitions: repeated.length,
  extraDeclarationsInRepeatedGroups: repeated.reduce((s,a)=>s+a.length-1,0),
  laterImportantAfterImportantExpanded: lateImportant.length,
  laterImportantAfterImportantPhysical: physicalOverrides.size,
  identicalBlockGroups: exactDuplicates.length,
  identicalPreviousBlocks: exactDuplicates.reduce((s,a)=>s+a.length-1,0),
  topConflicts: sortedConflicts
};
// Gjelder den fysiske CSS-koden, ikke per-komma ekspanderte deklarasjoner.
// Et budsjettoversteg krever bevisst revisjon; grensen låses ved godkjent ryddebaseline.
const IMPORTANT_BUDGET = 711;
if (process.argv.includes("--enforce-budget") && result.important > IMPORTANT_BUDGET) {
  console.error("CSS-gjeld økt: " + result.important + " !important (godkjent maks " + IMPORTANT_BUDGET + ").");
  process.exitCode = 1;
}
if (process.argv.includes("--json")) console.log(JSON.stringify(result,null,2));
else {
  for (const f of measurements) console.log(f.file + ": " + f.lines + " linjer, " + f.important + " !important, " + f.rules + " blokker");
  console.log("Totalt: " + result.totalLines + " linjer; " + result.important + " !important");
  console.log(result.selectorPropertyScopeRepetitions + " grupper med gjentatt selector/egenskap/at-rule-scope");
  console.log(result.extraDeclarationsInRepeatedGroups + " ekstra deklarasjoner i slike grupper (selektorlister utvidet)");
  console.log(result.laterImportantAfterImportantPhysical + " fysiske !important-deklarasjoner etter tidligere !important for samme selector/egenskap/scope");
  console.log(result.identicalBlockGroups + " identiske blokkgrupper (" + result.identicalPreviousBlocks + " tidligere blokker)");
  console.log("MERK: Dette er en statisk gjennomgang, IKKE en bekreftet visuell CSS-kaskade eller en liste over sikre slettinger.");
}
