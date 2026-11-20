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
  for (const item of response?.output || []) {
    const actionSources = item?.action?.sources;
    if (!Array.isArray(actionSources)) continue;
    for (const source of actionSources) {
      if (source?.type !== "url" || typeof source.url !== "string") continue;
      const normalizedUrl = normalizeSourceUrl(source.url);
      if (!normalizedUrl) continue;
      sources.set(normalizedUrl, {
        title: source.title || source.name || "",
        url: normalizedUrl
      });
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

