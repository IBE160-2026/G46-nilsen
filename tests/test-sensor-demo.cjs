const { spawn } = require("node:child_process");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const port = 3217;
const child = spawn(process.execPath, [path.join(root, "scripts/sensor-demo.js")], {
  cwd: root,
  env: { ...process.env, PORT: String(port) },
  stdio: ["ignore", "pipe", "pipe"]
});

let stderr = "";
child.stderr.on("data", chunk => { stderr += chunk.toString(); });

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

async function jsonRequest(url, options) {
  const response = await fetch(`http://127.0.0.1:${port}${url}`, options);
  const payload = await response.json().catch(() => null);
  return { response, payload };
}

(async () => {
  try {
    let ready = false;
    for (let i = 0; i < 30; i += 1) {
      try {
        const response = await fetch(`http://127.0.0.1:${port}/api/public-config`);
        if (response.ok) { ready = true; break; }
      } catch {}
      await wait(100);
    }
    if (!ready) throw new Error(`Demo-server startet ikke. ${stderr}`);

    const config = await jsonRequest("/api/public-config");
    const expectedVersion = require("../package.json").version;
    if (!config.response.ok || config.payload?.appVersion !== expectedVersion || config.payload?.demoMode !== true) {
      throw new Error("Demoens publiserte versjon/mode samsvarer ikke med package.json og sensordemo");
    }

    const home = await fetch(`http://127.0.0.1:${port}/`);
    if (!home.ok || !(await home.text()).includes("Samtalestøtte")) {
      throw new Error("Demo-forsiden feilet");
    }

    const auth = await jsonRequest("/api/auth/me");
    if (!auth.response.ok || auth.payload?.user?.username !== "Sensor demo") {
      throw new Error("Demo-bruker mangler");
    }

    // Regresjon: uønsket berøring uten seksuell motivasjon skal ikke bli alkohol/rus.
    const physicalContact = await jsonRequest("/api/classify-topic", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ situation: "En kollega skal hele tiden ta på meg, ikke seksuelt, men stryker meg på ryggen, armene og skuldrene. Jeg liker det ikke og prøver hver gang å komme meg unna. Hvordan skal jeg ta det opp med hen?" })
    });
    if (!physicalContact.response.ok || physicalContact.payload?.primary_topic_id !== "mobbing-trakassering" || physicalContact.payload?.primary_subtopic !== "Krenkende eller utilbørlig atferd") {
      throw new Error("Demo-temasortering feilet for uønsket fysisk kontakt");
    }

    const physicalContactVariant = await jsonRequest("/api/classify-topic", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ situation: "En kollega har begynt å bli veldig nærgående på jobb. Vedkommende legger ofte hånden på skulderen min, stryker meg over ryggen og tar meg på armen når vi snakker sammen. Jeg har flere ganger trukket meg unna, men kollegaen fortsetter. Jeg oppfatter ikke dette som seksuelt, men synes det er ubehagelig og gruer meg til å være alene med personen. Hvordan kan jeg ta dette opp på en tydelig måte uten å skape unødvendig konflikt?" })
    });
    if (!physicalContactVariant.response.ok ||
        physicalContactVariant.payload?.primary_topic_id !== "mobbing-trakassering" ||
        physicalContactVariant.payload?.primary_subtopic !== "Krenkende eller utilbørlig atferd") {
      throw new Error("Demo-temasortering eller undertema feilet for alternativ beskrivelse av uønsket fysisk kontakt");
    }

    const analysis = await jsonRequest("/api/analyze-situation", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ situation: "En medarbeider har mange korte fravær." })
    });
    if (!analysis.response.ok || !analysis.payload?.summary) {
      throw new Error("Demo-analyse feilet");
    }

    const guidance = await jsonRequest("/api/generate-guidance", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        situation: "En medarbeider har mange korte fravær.",
        analysis: analysis.payload
      })
    });
    if (!guidance.response.ok || !Array.isArray(guidance.payload?.questions) || guidance.payload.questions.length < 2) {
      throw new Error("Demo-veiledning feilet");
    }

    const saved = await jsonRequest("/api/history", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Demo", situation: "Test" })
    });
    if (!saved.response.ok || !saved.payload?.item?.id) {
      throw new Error("Demo-historikk feilet");
    }

    const simulation = await jsonRequest("/api/simulation-turn", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ turns: [{ role: "leader", text: "Hvordan ser du på dette?" }] })
    });
    if (!simulation.response.ok || !simulation.payload?.reply) {
      throw new Error("Demo-simulator feilet");
    }

    // Integrert sensorflyt: analyse -> råd -> oppfølging -> øving -> feedback -> historikk.
    // Dette er en deterministisk mock, ikke live KI eller en autentisert produksjonstest.
    const followup = await jsonRequest("/api/continue-conversation", {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ question: "Hvordan følger jeg opp en medarbeider som er uenig?" })
    });
    if (!followup.response.ok || !followup.payload?.reply?.includes("uenig") || followup.payload?.ai !== false) {
      throw new Error("Demo-oppfølgingsflyt feilet");
    }

    const help = await jsonRequest("/api/simulation-help", {
      method: "POST", headers: { "content-type": "application/json" }, body: "{}"
    });
    if (!help.response.ok || !help.payload?.help || help.payload?.ai !== false) {
      throw new Error("Demo-simulatorhjelp feilet");
    }

    const feedback = await jsonRequest("/api/simulation-feedback", {
      method: "POST", headers: { "content-type": "application/json" }, body: "{}"
    });
    if (!feedback.response.ok || !Array.isArray(feedback.payload?.worked_well) || feedback.payload?.ai !== false) {
      throw new Error("Demo-refleksjon etter simulering feilet");
    }

    const storedHistory = await jsonRequest("/api/history");
    if (!storedHistory.response.ok ||
        !storedHistory.payload?.items?.some(item => item.id === saved.payload.item.id)) {
      throw new Error("Demo-historikk kunne ikke hentes etter lagring");
    }

    const dataExport = await jsonRequest("/api/account/export");
    if (!dataExport.response.ok ||
        !dataExport.payload?.conversations?.some(item => item.id === saved.payload.item.id)) {
      throw new Error("Demo-eksport manglet lagret samtale");
    }

    const deleted = await jsonRequest(`/api/history/${saved.payload.item.id}`, { method: "DELETE" });
    if (!deleted.response.ok || deleted.payload?.ok !== true) {
      throw new Error("Demo-historikk kunne ikke slettes");
    }

    const afterDelete = await jsonRequest("/api/history");
    if (afterDelete.payload?.items?.some(item => item.id === saved.payload.item.id)) {
      throw new Error("Slettet demo-historikk var fortsatt synlig");
    }

    const secondDelete = await jsonRequest(`/api/history/${saved.payload.item.id}`, { method: "DELETE" });
    if (secondDelete.response.status !== 404 || secondDelete.payload?.error !== "NOT_FOUND") {
      throw new Error("Forventet 404 ved ny sletting av samme demo-samtale");
    }

    const noQuestion = await jsonRequest("/api/continue-conversation", {
      method: "POST", headers: { "content-type": "application/json" }, body: "{}"
    });
    if (noQuestion.response.status !== 400 || noQuestion.payload?.error !== "MISSING_QUESTION") {
      throw new Error("Tomt demo-oppfølgingsspørsmål skulle vært avvist");
    }

    const noSituation = await jsonRequest("/api/generate-guidance", {
      method: "POST", headers: { "content-type": "application/json" }, body: "{}"
    });
    if (noSituation.response.status !== 400 || noSituation.payload?.error !== "MISSING_SITUATION") {
      throw new Error("Tom demo-situasjon skulle vært avvist");
    }

    console.log("Sensor-demo-regresjon: OK");
  } finally {
    child.kill("SIGTERM");
  }
})().catch(error => {
  console.error(error.message);
  child.kill("SIGTERM");
  process.exit(1);
});
