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

app.listen(port, () => {
  console.log(`Samtalestøtte kjører på http://localhost:${port}`);
  console.log(client ? `KI aktivert (${model})` : "KI er ikke aktivert: sett OPENAI_API_KEY i .env");
});
