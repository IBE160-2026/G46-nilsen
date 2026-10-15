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
    if (!physicalContact.response.ok || physicalContact.payload?.primary_topic_id !== "mobbing-trakassering") {
      throw new Error("Demo-temasortering feilet for uønsket fysisk kontakt");
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

    console.log("Sensor-demo-regresjon: OK");
  } finally {
    child.kill("SIGTERM");
  }
})().catch(error => {
  console.error(error.message);
  child.kill("SIGTERM");
  process.exit(1);
});
