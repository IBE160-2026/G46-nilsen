import fs from "node:fs";

const app = fs.readFileSync("app.js", "utf8");
const server = fs.readFileSync("server.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");

const checks = [
  ["UI har Øv på samtalen", html.includes("Øv på samtalen")],
  ["Simulator har egen hovedvisning", html.includes(`id="simulation-view"`)],
  ["Simulator finnes i sidemenyen", html.includes("Samtalesimulering") && app.includes("openSimulationHub")],
  ["Direkte simulering finnes", html.includes(`id="direct-simulation-form"`) && app.includes("beginDirectSimulation")],
  ["Tidligere øvelser er tilgjengelig", html.includes(`id="simulation-history"`)],
  ["Direkte simulering bruker personvernkontroll", app.includes("detectSensitiveInfo(text)")],
  ["Midlertidig øvelse finnes", html.includes(`id="simulation-temporary"`)],
  ["UI har Øv selv", html.includes("Øv selv")],
  ["UI har KI-støtte", html.includes("Øv med KI-støtte")],
  ["UI har Overrask meg", html.includes("Overrask meg")],
  ["UI har avslutt øvelse", html.includes("Avslutt øvelse")],
  ["Klient kaller simulation-turn", app.includes("/api/simulation-turn")],
  ["Klient kaller simulation-help", app.includes("/api/simulation-help")],
  ["Klient kaller simulation-feedback", app.includes("/api/simulation-feedback")],
  ["Server har simulation-turn", server.includes("app.post('/api/simulation-turn'")],
  ["Server har simulation-help", server.includes("app.post('/api/simulation-help'")],
  ["Server har simulation-feedback", server.includes("app.post('/api/simulation-feedback'")],
  ["Simulator forbyr oppdiktet diagnose", server.includes("Ikke finn på diagnose")],
  ["Simulator forbyr oppdiktet familie", server.includes("familieforhold")],
  ["Ingen poengsum i feedback", server.includes("Ingen poengsum")],
  ["Historikk inkluderer simulation", server.includes("simulation: body.simulation")],
  ["Snakkeboble-stiler finnes", css.includes(".simulation-bubble")],
  ["Visuelt simulatornav finnes", css.includes(".simulation-hub-hero")],
  ["Live testsett finnes", fs.existsSync("SIMULATION-TEST-CASES.json") && fs.existsSync("test-simulation-ai.js")],
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "OK" : "FEIL"} - ${name}`);
  if (!ok) failed++;
}
console.log(`\n${checks.length - failed}/${checks.length} kontroller OK`);
if (failed) process.exit(1);
