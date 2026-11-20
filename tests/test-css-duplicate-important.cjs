const fs = require("node:fs");
const assert = require("node:assert/strict");

const files = [
  ["styles-core.css", 80],
  ["styles-responsive.css", 279],
  ["styles-overrides.css", 378]
];

function findDuplicateImportant(css) {
  const rules = [];
  const stack = [];
  let last = 0;
  let quote = null, inComment = false, escaped = false;
  for (let i = 0; i < css.length; i += 1) {
    const char = css[i], next = css[i + 1];
    if (inComment) {
      if (char === "*" && next === "/") { i += 1; inComment = false; }
      continue;
    }
    if (quote) {
      if (escaped) { escaped = false; continue; }
      if (char === "\\") { escaped = true; continue; }
      if (char === quote) quote = null;
      continue;
    }
    if (char === "/" && next === "*") { inComment = true; i += 1; continue; }
    if (char === "'" || char === '"') { quote = char; continue; }

    if (char === "{") {
      const selector = css.slice(last, i)
        .replace(/\/\*[\s\S]*?\*\//g, "")
        .trim().replace(/\s+/g, " ");
      const scope = stack.filter(x => x.selector.startsWith("@"))
        .map(x => x.selector).join("|");
      stack.push({ selector, scope, open: i });
      last = i + 1;
    } else if (char === "}") {
      const rule = stack.pop();
      assert(rule, "CSS inneholder en uventet avsluttende klamme");
      if (!rule.selector.startsWith("@")) {
        const body = css.slice(rule.open + 1, i)
          .replace(/\/\*[\s\S]*?\*\//g, " ");
        if (!/[{}]/.test(body)) rules.push({ ...rule, body });
      }
      last = i + 1;
    }
  }
  assert.equal(stack.length, 0, "CSS inneholder åpne klammer");

  const seen = new Map();
  const duplicates = [];
  for (const rule of rules) {
    const pattern = /([-\w]+)\s*:\s*([^;{}]*?!important)\s*;/g;
    let match;
    while ((match = pattern.exec(rule.body)) !== null) {
      const key = [
        rule.scope,
        rule.selector,
        match[1].toLowerCase()
      ].join("\0");
      if (seen.has(key)) {
        duplicates.push({
          first: seen.get(key),
          duplicate: rule.selector + " / " + match[1]
        });
      }
      seen.set(key, rule.selector + " / " + match[1]);
    }
  }
  return duplicates;
}

const imports = fs.readFileSync("styles.css", "utf8");
const order = ["styles-core.css", "styles-responsive.css", "styles-overrides.css"];
assert(order.every(x => imports.includes(x)), "CSS-inngangspunktet mangler en stilfil");
assert(imports.indexOf(order[0]) < imports.indexOf(order[1])
  && imports.indexOf(order[1]) < imports.indexOf(order[2]),
  "Endring i CSS-importrekkefølge må vurderes separat");

let total = 0;
for (const [filename, limit] of files) {
  const css = fs.readFileSync(filename, "utf8");
  const important = (css.match(/!important\b/g) || []).length;
  assert(important <= limit,
    filename + ": økt !important-antall fra kontrollert baseline " + limit);
  const duplicate = findDuplicateImportant(css);
  assert.deepEqual(duplicate, [],
    filename + ": eldre !important overstyrt av samme selektor/egenskap/mediekontekst");
  assert(!/(?:^|\n)[^{}]*\{[\t\r\n ]*\}/m.test(css),
    filename + ": tom CSS-regel etter opprydding");
  total += important;
}
assert(total <= 737, "CSS-overskridelser skal begrunnes og audit-baseline oppdateres");
console.log("CSS: " + total + " !important (før 845), ingen overstyrte identiske selektor-/egenskapspar i samme mediekontekst: OK");
