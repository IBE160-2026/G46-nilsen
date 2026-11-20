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
    if (item?.type === "web_search_call" && Array.isArray(item?.action?.sources)) {
      for (const source of item.action.sources) {
        if (source?.type !== "url") continue;
        remember(source.url, source.title || source.name);
      }
    }
    // Alternativ provider-proveniens: annotasjoner på selve modellmeldingen.
    // Ikke godta løse lenker skrevet av språkmodellen som dokumentert nettsøk.
    if (item?.type !== "message") continue;
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
    .replace(/[ \t]+\n/g, "\n")
    .trim();
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

