// Kun isolert test: avled alle forsøk på OpenAI-API til lokal feilsimulator.
// Ingen ekte ekstern trafikk tillates i denne testprosessen.
const originalFetch = globalThis.fetch.bind(globalThis);
globalThis.fetch = (input, options) => {
  const url = typeof input === "string" ? input : input instanceof URL ? String(input) : input?.url;
  const text = String(url || "");
  if (/^https:\/\/api\.openai\.com\/v1\//.test(text)) {
    const target = new URL(text);
    const port = Number(process.env.TEST_FAKE_OPENAI_PORT || 32620);
    return originalFetch(`http://127.0.0.1:${port}${target.pathname}${target.search}`, options);
  }
  if (/^http:\/\/127\.0\.0\.1:\d+\//.test(text) || /^http:\/\/localhost:\d+\//.test(text)) {
    return originalFetch(input, options);
  }
  return Promise.reject(new Error("Blocked external fetch in offline provider failure test"));
};
