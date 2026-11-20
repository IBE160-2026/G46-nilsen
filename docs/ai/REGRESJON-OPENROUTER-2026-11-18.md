# Teststyrt regresjon – feil KI-status med kun OpenRouter

**Dato:** 18.11.2026  
**Arbeidsgren:** `docs/ibe160-helhetlig-revisjon-20261118` fra `main`.  
**Krav:** FR-13 (modellvalg/provider), AI-06 (provideruavhengighet), NFR-04 (forståelig status og håndtering).  
**Produksjon:** IKKE ENDRET. Ingen LIVE-funksjon berørt.

## Observerbar feil før rettelse

`server.js` hadde følgende statusendepunkt:

```js
app.get("/api/status", requireUser, async (_req, res) => {
  res.json({ aiConfigured: Boolean(client), model: client ? await getActiveModel() : null });
});
```

Variabelen `client` representerer kun OpenAI, mens applikasjonens øvrige KI-endepunkter bruker `hasAnyAiClient()` som også omfatter `openRouterClient`. Hvis bare OpenRouter var konfigurert, ville `/api/status` dermed vise `aiConfigured: false`, selv om KI-støtten hadde en provider. Dette er et faktisk brudd på statuskontrakten, men ble avdekket i **isolert test** og ikke bekreftet som en aktuell produksjonsfeil under brukerens nåværende konfigurasjon.

## Rød test før kodeendring

`tests/test-ai-provider-status-http.cjs` starter selve Express-serveren med fiktive nøkler, en lokal ugyldig Supabase-URL (`127.0.0.1:9`) og test-auth-bypass som bare aktiveres ved `NODE_ENV=test`. Ingen produksjonsdata eller eksterne KI-kall brukes.

Testen kontrollerer:

1. Ingen provider: `GET /api/status` rapporterer `aiConfigured: false` / `model: null`.
2. Ingen provider: alle sju AI-endepunktene svarer `503 AI_NOT_CONFIGURED`.
3. Kun dummy OpenRouter-key: `GET /api/status` skal rapportere `aiConfigured: true` og aktiv modell `openrouter/free`.

**Rød kjøring:** [GitHub Actions run 44339406194](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44339406194), commit `218c88286a519cd206376185a1dd4017d4e08757`, **FAILURE**. Loggen viser eksplisitt:

> `AssertionError: OpenRouter-only skal regnes som KI-konfigurert`

Dette dokumenterer at testen fanget en reell feil før rettelsen.

## Minimal kodeendring

Kun `/api/status` ble endret til å bruke den samme providerkontrollen som de øvrige KI-endepunktene:

```js
app.get("/api/status", requireUser, async (_req, res) => {
  const aiConfigured = hasAnyAiClient();
  res.json({ aiConfigured, model: aiConfigured ? await getActiveModel() : null });
});
```

**Fix-commit:** `561da3d4aaa5fc425e4ed991fa93c9ea6b6947ef`.

## Grønn test etter kodeendring

**Grønn kjøring:** [GitHub Actions run 44339569597](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44339569597), commit `561da3d4aaa5fc425e4ed991fa93c9ea6b6947ef`, **SUCCESS**. Alle **33** delkommandoene i deterministisk testkjede ble gjennomført, og `npm audit --omit=dev --audit-level=high` rapporterte **0 sårbarheter**. Testloggen bekrefter:

> `KI-providerstatus: ingen provider 503, OpenRouter-only er aktivert: OK`

## Læring og begrensninger

Dette er et etterprøvbart eksempel på **test → feilfunn → liten rettelse → regresjonstest**, slik forelesningene vektlegger. En test som ikke feiler på den opprinnelige koden, ville gitt svakere bevis på at rettelsen faktisk var nødvendig.

**Begrensning:** Dummy-keyen brukes aldri til ekte OpenRouter-API. Vi har ikke bevist at providerens autentisering, faktisk KI-output eller feil-/timeout-situasjoner i ekstern tjeneste virker. Dette er heller ingen positiv test av innlogget bruker eller Supabase RLS; kun statuskontrakt og fravær av provider. LIVE/tale forblir separat pilot under testing.
