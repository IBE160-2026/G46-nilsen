// Håndterer URL-normalisering, etterprøvbare eksterne kilder og deduplisering.
// Ren hjelpefunksjonalitet uten database- eller modellkall.
export function normalizeSourceUrl(value) {
  try {
    const url = new URL(String(value || ""));
    for (const key of [...url.searchParams.keys()]) {
      if (/^utm_/i.test(key)) url.searchParams.delete(key);
    }
    url.hash = "";
    return url.toString();
  } catch (_) {
    return String(value || "").trim();
  }
}

// Responses API kan inneholde delvise/feilede tool calls. Bare fullførte
// tool-/meldingsobjekter kan gi dokumentert provider-proveniens.
// Manglende status godtas for eldre provider-formater og lokale fixtures.
function isCompletedProviderOutput(item) {
  return item?.status == null || item.status === "completed";
}

export function webSources(response) {
  const sources = new Map();
  const remember = (rawUrl, title = "") => {
    if (typeof rawUrl !== "string") return;
    let url;
    try {
      url = new URL(rawUrl);
      if (!["https:","http:"].includes(url.protocol)) return;
    } catch (_) { return; }
    const normalizedUrl = normalizeSourceUrl(url.toString());
    if (!normalizedUrl) return;
    sources.set(normalizedUrl, {
      title: String(title || "").trim().slice(0, 500),
      url: normalizedUrl
    });
  };
  for (const item of response?.output || []) {
    // OpenAI Responses API: source-list som eksplisitt ble hentet med
    // include: ["web_search_call.action.sources"].
    // Bare søkekall kan bekrefte action.sources. Andre tool-calls kan ha
    // samme feltnavn uten å være et dokumentert nettsøk.
    if (item?.type === "web_search_call" && isCompletedProviderOutput(item) && Array.isArray(item?.action?.sources)) {
      for (const source of item.action.sources) {
        if (source?.type !== "url") continue;
        remember(source.url, source.title || source.name);
      }
    }
    // Alternativ provider-proveniens: annotasjoner på selve modellmeldingen.
    // Ikke godta løse lenker skrevet av språkmodellen som dokumentert nettsøk.
    if (item?.type !== "message" || !isCompletedProviderOutput(item)) continue;
    for (const part of item.content || []) {
      for (const annotation of part.annotations || []) {
        // Aksepter Responses-annotasjoner og eldre nestet url_citation-form,
        // men aldri en annen eksplisitt annotasjonstype.
        const hasNestedCitation = annotation?.type == null &&
          annotation?.url_citation && typeof annotation.url_citation === "object";
        if (annotation?.type !== "url_citation" && !hasNestedCitation) continue;
        const citation = annotation.url_citation || annotation;
        remember(citation.url, citation.title);
      }
    }
  }
  return sources;
}


 // Kildemetadatata fra modellen er ikke autoritativ. Velg bare lenker som
 // finnes i søkeresultatet, og foretrekk metadata fra søkeleverandøren.
export function verifiedSupplementarySources(items = [], verifiedSources = new Map(), limit = 2) {
  const result = [];
  if (!Array.isArray(items) || !(verifiedSources instanceof Map)) return result;
  const max = Math.max(0, Math.min(2, Number.isInteger(limit) ? limit : 2));
  if (max === 0) return result;
  const seen = new Set();
  for (const item of items) {
    if (!item || typeof item.url !== "string") continue;
    const url = normalizeSourceUrl(item.url);
    const verified = verifiedSources.get(url);
    if (!verified || seen.has(url)) continue;
    let domain;
    try {
      const parsed = new URL(url);
      if (!["https:", "http:"].includes(parsed.protocol)) continue;
      domain = parsed.hostname.replace(/^www\./, "");
    } catch (_) { continue; }
    seen.add(url);
    result.push({
      title: String(verified.title || domain).trim().slice(0, 500),
      author: domain, year: "", type: "nettkilde", url
    });
    if (result.length >= max) break;
  }
  return result;
}

// Kildeproveniens som kan testes gjennom det faktiske HTTP-svaret.
// Et utført søk eller en URL-annotasjon beviser IKKE at en side er lest,
// eller at den støtter en konkret juridisk/faglig påstand.
export function evidenceProvenance(response, curatedSourceIds = [], evidenceSources = []) {
  const output = Array.isArray(response?.output) ? response.output : [];
  const providerUrls = webSources(response);
  return {
    webSearchPerformed: output.some(item => item?.type === "web_search_call" && isCompletedProviderOutput(item)),
    providerUrlCount: providerUrls.size,
    // Telles bare når modellen selv valgte ID-en. Andre lovkilder blir
    // liggende som kontrollreferanser og telles separat.
    selectedCuratedSourceCount: Array.isArray(curatedSourceIds) ? curatedSourceIds.length : 0,
    scopeReferenceCount: Array.isArray(evidenceSources)
      ? evidenceSources.filter(source => source?.evidenceRole === "scope_reference").length : 0,
    visibleEvidenceCount: Array.isArray(evidenceSources) ? evidenceSources.length : 0,
    contentVerified: false
  };
}

export function markdownWebSources(text = "", verifiedSources = new Map()) {
  const found = [];
  const regex = /\[([^\]]+)\]\((https?:\/\/[^)]+)\)/g;
  let match;
  // Enkelte modellversjoner lager nestede lenker: [navn]([url](url)).
  // Normaliser formatet før vi slår opp URL mot faktisk dokumenterte webkilder.
  const normalizedText = String(text || "")
    .replace(/\\\((?=\[https?:\/\/)/g, "(")
    .replace(
    /\[([^\]]+)\]\(\[https?:\/\/[^\]]+\]\((https?:\/\/[^)]+)\)\)/g,
    "[$1]($2)"
  );
  while ((match = regex.exec(normalizedText))) {
    const normalizedUrl = normalizeSourceUrl(match[2]);
    const verified = verifiedSources.get(normalizedUrl);
    if (!verified) continue;
    found.push({
      title: verified.title || match[1] || "Kilde",
      author: (() => { try { return new URL(normalizedUrl).hostname.replace(/^www\./,""); } catch (_) { return ""; } })(),
      year: "",
      type: "nettkilde",
      url: normalizedUrl
    });
  }
  return found;
}

export function stripInlineSourceLinks(text = "") {
  return String(text || "")
    .replace(/\\\((?=\[https?:\/\/)/g, "(")
    // KI kan lage dobbel Markdown: ([virke.no]([https://...](https://...))).
    // Fjern hele henvisningen når den strukturerte kildelisten skal være fasit.
    .replace(/\s*\(\s*\[[^\]]+\]\(\s*\[https?:\/\/[^\]]+\]\(https?:\/\/[^)]+\)\s*\)\s*\)/g, "")
    .replace(/\s*\(\s*\[[^\]]+\]\(https?:\/\/[^)]+\)\s*\)/g, "")
    .replace(/\[([^\]]+)\]\(https?:\/\/[^)]+\)/g, "$1")
    // Kilden skal stå i strukturert kildeliste. Ikke vis rå URL-er,
    // autolenker eller domener fra modellens fritekst som bevis.
    .replace(/\(\s*<?(?:https?:\/\/|www\.)[^\s<>()\[\]]+>?\s*\)/gi, "")
    .replace(/<(?:https?:\/\/|www\.)[^\s<>]+>/gi, "")
    .replace(/\b(?:https?:\/\/|www\.)[^\s<>()\[\]{}"'\x60]+/gi, "")
    .replace(/\(\s*\)/g, "")
    .replace(/[ \t]+([,.;:!?])/g, "$1")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .trim();
}


/**
 * Rens KUN modellens brukerrettede rådtekst, ikke den separate
 * strukturerte kildelisten. Holder kilde-ID og søkeresultat intakte.
 * Ingen mutasjon av responsobjektet.
 */
export function stripGuidanceInlineLinks(guidance = {}) {
  const clean = value => typeof value === "string" ? stripInlineSourceLinks(value) : value;
  const cleanList = value => Array.isArray(value) ? value.map(clean) : value;
  return {
    ...guidance,
    opening: clean(guidance.opening),
    questions: cleanList(guidance.questions),
    reactions: Array.isArray(guidance.reactions)
      ? guidance.reactions.map(reaction => ({
          ...reaction,
          reaction: clean(reaction.reaction),
          why_plausible: clean(reaction.why_plausible),
          leader_response: clean(reaction.leader_response)
        }))
      : guidance.reactions,
    attention: cleanList(guidance.attention),
    check_before_meeting: cleanList(guidance.check_before_meeting),
    legal_hr_note: clean(guidance.legal_hr_note),
    next_steps: cleanList(guidance.next_steps)
  };
}


/**
 * Rollen beskriver HVORDAN URL-en kom på listen, ikke om innholdet er
 * lest eller underbygger en bestemt påstand. En kilde kan være juridisk
 * bindende uten å være brukt av modellen i dette rådet.
 *
 * Scope-kilder legges inn av appens egen regel for arbeidsgivertype,
 * og må derfor skilles fra source_ids modellen selv valgte.
 */
export function annotateCuratedEvidence(sources = [], modelSelectedIds = []) {
  const selected = new Set(Array.isArray(modelSelectedIds) ? modelSelectedIds : []);
  return (Array.isArray(sources) ? sources : []).map(source => ({
    ...source,
    evidenceRole: selected.has(source?.id) ? "model_selected" : "scope_reference"
  }));
}

export function annotateProviderEvidence(sources = []) {
  return (Array.isArray(sources) ? sources : []).map(source => ({
    ...source,
    evidenceRole: "provider_url"
  }));
}

export function dedupeEvidenceSources(items = []) {
  const seen = new Set();
  return items.filter(source => {
    const key = normalizeSourceUrl(source?.url || source?.doi || "") || String(source?.id || source?.title || "");
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

