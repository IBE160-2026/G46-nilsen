import fs from "node:fs";

const app = fs.readFileSync("app.js", "utf8");
const server = fs.readFileSync("server.js", "utf8");
const html = fs.readFileSync("index.html", "utf8");
const css = fs.readFileSync("styles.css", "utf8");
const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));

const checks = [
  ["Versjon er 19.2.0", pkg.version === "19.2.0" && html.includes("19.2.0") && server.includes('"19.2.0"')],
  ["Hold deg til saken finnes", html.includes("Hold deg til saken") && app.includes("simulationFidelity")],
  ["Utfordre meg finnes", html.includes("Utfordre meg") && server.includes("FRI TRENINGSMODUS")],
  ["Faktamodus sendes til server", app.includes("fidelity: simulationFidelity")],
  ["Faktamodus lagres separat i simulation", app.includes("simulation:{fidelity:simulationFidelity")],
  ["Server validerer fidelity", server.includes("simulationFidelityInstructions") && server.includes("body.fidelity")],
  ["Faktamodus forbyr nye verifiserbare fakta", server.includes("IKKE etablere nye verifiserbare fakta")],
  ["Faktamodus håndterer ukjent ja/nei", server.includes("ukjent forhold til et sikkert ja/nei-faktum")],
  ["Fri modus merker opplysninger som simulerte", server.includes("kun simulerte rollespillfakta")],
  ["Fri modus skal ikke motsi etablerte fakta", server.includes("Ikke motsi etablerte fakta")],
  ["Emosjonell stil er tydeligere", server.includes("pauser, nøling")],
  ["Overrask meg er styrket", server.includes("genuint mindre forutsigbar")],
  ["Simulator bruker faktisk logo", html.includes('class="simulation-logo-crop"') && html.includes('src="logo.png"')],
  ["Simulatorikon bruker logo", html.includes('nav-logo-glyph')],
  ["Ny samtale bruker snakkebobleikon", app.includes("setSvg('nav-prepare-icon', svgIcons.simulation)")],
  ["Om og Kontakt ligger i sekundær sidemeny", html.includes('class="nav nav-secondary"')],
  ["Mørk OK-status er petrol", css.includes(".privacy-check.ok") && css.includes("var(--accent-soft)")],
  ["Mørk advarsel er dempet", css.includes("#6c4e58") && css.includes("#c69aa7")],
  ["Statuslinjen har eksplisitt mellomrom", css.includes("#simulation-status") && css.includes("margin-right:8px")],
  ["Changelog finnes", fs.existsSync("CHANGELOG.md")],
  ["Live test for v19.2 finnes", fs.existsSync("test-simulation-ai-v19-2.js") && fs.existsSync("SIMULATION-TEST-CASES-V19-2.json")]
];

let failed = 0;
for (const [name, ok] of checks) {
  console.log(`${ok ? "OK" : "FEIL"} - ${name}`);
  if (!ok) failed++;
}
console.log(`\n${checks.length - failed}/${checks.length} kontroller OK`);
if (failed) process.exit(1);
