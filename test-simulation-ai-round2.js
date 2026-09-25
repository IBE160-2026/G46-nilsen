import fs from "node:fs";

const baseUrl = process.env.SIMULATION_TEST_URL || "http://localhost:3000";
const cases = JSON.parse(fs.readFileSync("SIMULATION-TEST-CASES-ROUND2.json", "utf8"));

const metaPhrases = [
  /som medarbeider/i,
  /i denne øvelsen/i,
  /rollespill/i,
  /som KI/i,
  /jeg kan hjelpe deg som leder/i
];

const coachPhrases = [
  /du bør/i,
  /jeg anbefaler at du/i,
  /som leder kan du/i,
  /et godt spørsmål er/i
];

async function call(path, body) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
  });

  const raw = await res.text();
  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`${path} svarte ikke med JSON (${res.status}): ${raw.slice(0, 160)}`);
  }

  if (!res.ok) throw new Error(data.message || `${path} feilet (${res.status})`);
  return data;
}

function evaluate(reply, tc) {
  const lower = reply.toLowerCase();
  const flags = [];

  if (reply.length > 700) flags.push(`langt svar (${reply.length} tegn)`);
  if (reply.length < 6) flags.push("svært kort svar");
  if (metaPhrases.some(r => r.test(reply))) flags.push("bryter rolle / omtaler øvelsen");
  if (coachPhrases.some(r => r.test(reply))) flags.push("gir lederråd i medarbeiderrollen");

  const invented = (tc.watch_for || []).filter(x => lower.includes(x.toLowerCase()));
  if (invented.length) flags.push(`mulig oppdiktet detalj: ${invented.join(", ")}`);

  return flags;
}

const lines = [
  "# Live-test av samtalesimulator – runde 2",
  `Kjørt: ${new Date().toLocaleString("nb-NO")}`,
  `Base URL: ${baseUrl}`,
  ""
];

let ok = 0;
let flagged = 0;
let failed = 0;

for (const tc of cases) {
  process.stdout.write(`${tc.id} ... `);

  try {
    const turns = [{role: "leader", text: tc.leader}];

    const first = await call("/api/simulation-turn", {
      situation: tc.situation,
      analysis: null,
      followups: {},
      guidance: null,
      mode: "solo",
      style: tc.style,
      turns
    });

    turns.push(
      {role: "employee", text: first.reply},
      {role: "leader", text: tc.followup}
    );

    const second = await call("/api/simulation-turn", {
      situation: tc.situation,
      analysis: null,
      followups: {},
      guidance: null,
      mode: "solo",
      style: tc.style,
      turns
    });

    const flags = [...evaluate(first.reply, tc), ...evaluate(second.reply, tc)]
      .filter((v, i, a) => a.indexOf(v) === i);

    if (flags.length) {
      flagged++;
      console.log("BØR SJEKKES");
    } else {
      ok++;
      console.log("OK");
    }

    lines.push(
      `## ${tc.id} – ${flags.length ? "Bør sjekkes" : "OK"}`,
      `**Stil:** ${tc.style}`,
      `**Situasjon:** ${tc.situation}`,
      `**Leder 1:** ${tc.leader}`,
      `**Medarbeider 1:** ${first.reply}`,
      `**Leder 2:** ${tc.followup}`,
      `**Medarbeider 2:** ${second.reply}`,
      flags.length ? `**Automatiske flagg:** ${flags.join("; ")}` : "**Automatiske flagg:** Ingen",
      `**Se spesielt etter:** ${tc.manual_focus}`,
      "",
      "**Menneskelig vurdering:** Realisme: ___  Relevans: ___  Naturlig reaksjon: ___  Holder seg til fakta: ___",
      "",
      "---",
      ""
    );
  } catch (err) {
    failed++;
    console.log("TEKNISK FEIL");
    lines.push(
      `## ${tc.id} – Teknisk feil`,
      `**Feil:** ${err.message}`,
      "",
      "---",
      ""
    );
  }
}

lines.splice(
  3,
  0,
  `Resultat: ${ok} OK · ${flagged} bør sjekkes · ${failed} tekniske feil`,
  "",
  "> Runde 2 presser simulatoren med klønete lederformuleringer, emosjoner, motstand, ledende spørsmål og 'Overrask meg'. Automatiske kontroller er bare et filter; les svarene manuelt.",
  ""
);

fs.mkdirSync("test-results", {recursive: true});
const out = `test-results/simulation-live-round2-${new Date().toISOString().replace(/[:.]/g, "-")}.md`;
fs.writeFileSync(out, lines.join("\n"));
console.log(`\nRapport: ${out}`);

if (failed) process.exitCode = 2;
else if (flagged) process.exitCode = 1;
