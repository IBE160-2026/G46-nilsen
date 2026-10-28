// Strukturkontrakter for KI-svar.
export const analysisSchema = {
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
          "Oppsigelse og avslutning av arbeidsforhold",
          "Sikkerhet og ansvar",
          "Livssituasjoner",
          "Mobbing og trakassering"
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
          custom_label: { type: "string" },
          multi_select: { type: "boolean" }
        },
        required: ["id", "question", "options", "allow_custom", "custom_label", "multi_select"]
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

export function createGuidanceSchema(sourceIds) {
  return {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "string", description: "Kun det lederen faktisk kan si høyt som åpning. Muntlig, kort og direkte; ingen instrukser til lederen." },
    questions: { type: "array", items: { type: "string" }, minItems: 2, maxItems: 3 },
    reactions: {
      type: "array", minItems: 2, maxItems: 3,
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
    attention: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 3 },
    check_before_meeting: { type: "array", items: { type: "string" }, maxItems: 3 },
    legal_hr_note: { type: "string" },
    source_ids: { type: "array", maxItems: 4, items: { type: "string", enum: sourceIds } },
    supplementary_sources: {
      type: "array", maxItems: 2,
      items: {
        type: "object", additionalProperties: false,
        properties: {
          title: { type: "string" }, author: { type: "string" }, year: { type: "string" },
          type: { type: "string" }, url: { type: "string" }
        },
        required: ["title", "author", "year", "type", "url"]
      }
    },
    next_steps: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 3 }
  },
  required: ["opening", "questions", "reactions", "attention", "check_before_meeting", "legal_hr_note", "source_ids", "supplementary_sources", "next_steps"]
};
}
