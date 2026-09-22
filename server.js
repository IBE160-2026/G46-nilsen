import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "1mb" }));
app.use(express.static(__dirname));

const apiKey = process.env.OPENAI_API_KEY;
const model = process.env.OPENAI_MODEL || "gpt-5.6-terra";
const client = apiKey ? new OpenAI({ apiKey }) : null;

const systemPrompt = fs.readFileSync(path.join(__dirname, "AI-SYSTEMPROMPT.md"), "utf8");

const analysisSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    summary: { type: "string" },
    facts: { type: "array", items: { type: "string" }, maxItems: 6 },
    dilemma: { type: "array", items: { type: "string" }, maxItems: 4 },
    relevant_topics: {
      type: "array",
      maxItems: 2,
      items: {
        type: "string",
        enum: [
          "Alkohol og rus",
          "Fravær og oppfølging",
          "Prestasjon og utvikling",
          "Lønn og utvikling",
          "Samarbeid og kommunikasjon",
          "Avslutning av arbeidsforhold",
          "Sikkerhet og ansvar",
          "Livssituasjoner"
        ]
      }
    },
    uncertainties: { type: "array", items: { type: "string" }, maxItems: 4 },
    cautions: { type: "array", items: { type: "string" }, maxItems: 3 },
    needs_clarification: { type: "boolean" },
    clarifications: {
      type: "array",
      maxItems: 3,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          id: { type: "string" },
          question: { type: "string" },
          options: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
          allow_custom: { type: "boolean" },
          custom_label: { type: "string" }
        },
        required: ["id", "question", "options", "allow_custom", "custom_label"]
      }
    }
  },
  required: [
    "confidence",
    "summary",
    "facts",
    "dilemma",
    "relevant_topics",
    "uncertainties",
    "cautions",
    "needs_clarification",
    "clarifications"
  ]
};


const guidanceSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "string" },
    questions: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 5 },
    reactions: {
      type: "array", minItems: 2, maxItems: 4,
      items: {
        type: "object", additionalProperties: false,
        properties: {
          reaction: { type: "string" },
          why_plausible: { type: "string" },
          leader_response: { type: "string" }
        },
        required: ["reaction", "why_plausible", "leader_response"]
      }
    },
    attention: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 5 },
    check_before_meeting: { type: "array", items: { type: "string" }, maxItems: 5 },
    legal_hr_note: { type: "string" },
    next_steps: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 4 }
  },
  required: ["opening", "questions", "reactions", "attention", "check_before_meeting", "legal_hr_note", "next_steps"]
};

app.get("/api/status", (_req, res) => {
  res.json({ aiConfigured: Boolean(client), model: client ? model : null });
});

app.post("/api/analyze-situation", async (req, res) => {
  if (!client) {
    return res.status(503).json({
      error: "AI_NOT_CONFIGURED",
      message: "OPENAI_API_KEY mangler på serveren."
    });
  }

  const { situation, helpRequest = "", selectedTopic = "", selectedSubtopic = "" } = req.body || {};
  if (typeof situation !== "string" || !situation.trim()) {
    return res.status(400).json({ error: "MISSING_SITUATION", message: "Situasjonsbeskrivelse mangler." });
  }

  const task = `\n\n## Oppgave i denne forespørselen\nAnalyser situasjonen som samtalepartner, ikke som HR-klassifiserer.\n- Gjengi bare fakta som faktisk står i brukerens tekst.\n- Identifiser det menneskelige/praktiske dilemmaet, ikke bare en kategori.\n- Relevante temaer er kun metadata og skal være maks to.\n- Still bare avklaringsspørsmål dersom svarene kan endre rådet vesentlig.\n- Lag korte klikkbare svaralternativer som dekker sannsynlige svar uten å påstå at de er sanne.\n- Spør aldri om diagnose eller unødvendige sensitive opplysninger.\n- Hvis valgt tema/undertema ikke passer teksten, skal friteksten veie tyngst.\n\nValgt tema i grensesnittet: ${selectedTopic || "ikke oppgitt"}\nValgt undertema: ${selectedSubtopic || "ikke oppgitt"}\nHva brukeren ønsker hjelp til: ${helpRequest || "ikke oppgitt"}\n`;

  try {
    const response = await client.responses.create({
      model,
      instructions: systemPrompt + task,
      input: [
        {
          role: "user",
          content: [{ type: "input_text", text: situation.trim() }]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "samtalestotte_situasjonsforstaelse",
          strict: true,
          schema: analysisSchema
        }
      }
    });

    const raw = response.output_text;
    const parsed = JSON.parse(raw);
    return res.json({ ...parsed, ai: true, model });
  } catch (error) {
    console.error("OpenAI analysis failed:", error);
    const status = Number(error?.status) || 500;
    const code = error?.code || error?.error?.code || null;
    const type = error?.type || error?.error?.type || null;
    const rawMessage = error?.message || error?.error?.message || "Ukjent feil fra OpenAI API.";

    let hint = "Se PowerShell-vinduet for detaljer.";
    if (status === 401) hint = "API-nøkkelen ble avvist. Kontroller OPENAI_API_KEY i .env.";
    else if (status === 403) hint = "API-nøkkelen mangler nødvendig tilgang til Responses API eller modellen.";
    else if (status === 404) hint = `Modellen ${model} er ikke tilgjengelig for dette prosjektet, eller modellnavnet er feil.`;
    else if (status === 429) hint = "API-prosjektet har nådd en bruks-/betalingsgrense eller mangler tilgjengelig kreditt.";

    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: "AI_ANALYSIS_FAILED",
      message: "KI-analysen feilet.",
      diagnostic: { status, code, type, apiMessage: rawMessage, model, hint }
    });
  }
});


app.post("/api/generate-guidance", async (req, res) => {
  if (!client) {
    return res.status(503).json({ error: "AI_NOT_CONFIGURED", message: "OPENAI_API_KEY mangler på serveren." });
  }

  const { situation, analysis = null, followups = {} } = req.body || {};
  if (typeof situation !== "string" || !situation.trim()) {
    return res.status(400).json({ error: "MISSING_SITUATION", message: "Situasjonsbeskrivelse mangler." });
  }

  const guidanceTask = `\n\n## Oppgave: lag konkret samtalestøtte\nDu skal nå lage selve samtalestøtten til akkurat denne saken. Ikke bruk standardråd som kunne passet enhver leder.\n- Bruk brukerens situasjon, situasjonsanalysen og avklaringssvarene som én samlet kontekst.\n- Åpningen skal kunne sies høyt i denne konkrete samtalen.\n- Spørsmålene skal være få og målrettede; hvert spørsmål må ha en tydelig funksjon i akkurat saken.\n- Foreslå 2–4 plausible reaksjoner som er SPESIFIKKE for det som står på spill. Ikke bruk «sint, trist, stille» som generiske kategorier med mindre konteksten faktisk gjør dem relevante.\n- For hver reaksjon: forklar kort hvorfor den er plausibel og hvordan lederen kan møte den. Ikke påstå at medarbeideren vil reagere slik.\n- Fang opp HR-/juridisk sensitivitet når beslutningen gjelder f.eks. sykefravær, forfremmelse, lønn, oppsigelse, rus, sikkerhet eller mulig diskriminering.\n- Ved sykefravær + forfremmelse/opprykk: minn om at diskrimineringsforbudet gjelder forfremmelse etter likestillings- og diskrimineringsloven § 29, at redusert arbeidsevne kan utløse tilretteleggingsplikt etter arbeidsmiljøloven § 4-6, og anbefal kvalitetssikring med HR/juridisk kompetanse før sykefravær får betydning for beslutningen. Ikke konkluder med at en konkret beslutning er lovlig eller ulovlig uten tilstrekkelig grunnlag.\n- Skill mellom hva lederen bør AVKLARE før møtet og hva lederen bør SI i møtet.\n- Ikke be om diagnose eller medisinske detaljer.\n- Ikke dikt opp virksomhetens regler, fakta eller tidligere hendelser.\n- Hvis et juridisk spørsmål er relevant, pek på relevant regelverk/HR-kontroll, men ikke gi bastante juridiske konklusjoner.\n\nSituasjonsanalyse fra første KI-steg: ${JSON.stringify(analysis || {})}\nAvklaringssvar: ${JSON.stringify(followups || {})}\n`;

  try {
    const response = await client.responses.create({
      model,
      instructions: systemPrompt + guidanceTask,
      input: [{ role: "user", content: [{ type: "input_text", text: situation.trim() }] }],
      text: {
        format: {
          type: "json_schema",
          name: "samtalestotte_konkret_veiledning",
          strict: true,
          schema: guidanceSchema
        }
      }
    });
    const parsed = JSON.parse(response.output_text);
    return res.json({ ...parsed, ai: true, model });
  } catch (error) {
    console.error("OpenAI guidance failed:", error);
    const status = Number(error?.status) || 500;
    const code = error?.code || error?.error?.code || null;
    const rawMessage = error?.message || error?.error?.message || "Ukjent feil fra OpenAI API.";
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: "AI_GUIDANCE_FAILED", message: "KI-samtalestøtten feilet.",
      diagnostic: { status, code, apiMessage: rawMessage, model }
    });
  }
});


app.post("/api/continue-conversation", async (req, res) => {
  if (!client) {
    return res.status(503).json({ error: "AI_NOT_CONFIGURED", message: "OPENAI_API_KEY mangler på serveren." });
  }
  const { situation, analysis = null, followups = {}, guidance = null, question = "" } = req.body || {};
  if (typeof question !== "string" || !question.trim()) {
    return res.status(400).json({ error: "MISSING_QUESTION", message: "Oppfølgingsspørsmål mangler." });
  }
  const continueTask = `\n\n## Oppgave: svar på oppfølgingsspørsmål i samme sak\nSvar som en konkret samtalepartner. Bruk samme situasjon, analyse, avklaringssvar og tidligere KI-råd.\n- Svar direkte på det brukeren spør om.\n- Unngå generelle standardråd hvis du kan være mer konkret ut fra saken.\n- Ikke dikt opp fakta, motiv eller virksomhetsregler.\n- Ved juridisk sensitivitet: pek på relevant kontrollpunkt og anbefal HR/juridisk kvalitetssikring, uten å konkludere definitivt.\n- Ikke be om diagnose eller unødvendige sensitive opplysninger.\n- Hold svaret kort og praktisk, helst 1–4 avsnitt.\n\nSituasjon: ${situation || ""}\nAnalyse: ${JSON.stringify(analysis || {})}\nAvklaringssvar: ${JSON.stringify(followups || {})}\nTidligere råd: ${JSON.stringify(guidance || {})}\n`;
  try {
    const response = await client.responses.create({
      model,
      instructions: systemPrompt + continueTask,
      input: [{ role: "user", content: [{ type: "input_text", text: question.trim() }] }]
    });
    return res.json({ reply: response.output_text, ai: true, model });
  } catch (error) {
    console.error("OpenAI continuation failed:", error);
    const status = Number(error?.status) || 500;
    const code = error?.code || error?.error?.code || null;
    const rawMessage = error?.message || error?.error?.message || "Ukjent feil fra OpenAI API.";
    return res.status(status >= 400 && status < 600 ? status : 500).json({
      error: "AI_CONTINUATION_FAILED", message: "KI-oppfølgingen feilet.",
      diagnostic: { status, code, apiMessage: rawMessage, model }
    });
  }
});

app.listen(port, () => {
  console.log(`Samtalestøtte kjører på http://localhost:${port}`);
  console.log(client ? `KI aktivert (${model})` : "KI er ikke aktivert: sett OPENAI_API_KEY i .env");
});
