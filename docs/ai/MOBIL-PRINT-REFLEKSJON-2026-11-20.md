# Sensorrevisjon: mobil, faktisk PDF-utskrift og refleksjonsrapport

**Dato:** 20. november 2026  
**Avgrensning:** Kun draft PR #12, revisjonsgren `docs/ibe160-helhetlig-revisjon-20261118`. Ingen fysiske brukerenheter, live KI, ekte brukere eller produksjonsendringer.  
**Teknisk test:** `tests/test-mobile-print-browser.cjs`, obligatorisk i `.github/workflows/quality-gate.yml`.
**Verifisert testkjøring:** [Quality Gate #44794218055](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44794218055) – **SUCCESS alle tre jobber**. Loggen bekrefter tre mobile bredder, touch-navigasjon, og en **2-siders PDF** med verifisert uttrekk av både hovedråd og «Videre råd», pluss 52 ordinære teststeg, 99/99 CSS-paritet, Auth/PostgREST og PostgreSQL/RLS.

## 1. Hva tidligere grønne tester ikke beviste

- De **99 CSS-paritetscasene** sammenlignet layout mot en eldre referanse med `mobile:false` og kontrollerte skjerm- og print-medie-CSS. De beviste ikke faktisk mobilenhetsmodus, berøringshendelser, eller at den ferdige responsen er brukbar på en mobilskjerm.
- Den tidligere brukerreisetesten kontrollerte HTML-en som `printCurrentGuidance()` skrev til utskriftsvinduet. Den validerte **ikke** en generert PDF med Chromium. Dermed kunne utdrag mangle eller bli borte i selve utskriftsrenderingen uten at testen oppdaget det.
- Å kjøre emulering eller produsere PDF er fremdeles **ikke** det samme som å se appen på en fysisk Android-enhet, bruke en skjermleser, inspisere hver side i print-dialog eller skrive ut på en faktisk skriver.

## 2. Ny faktisk Chrome-test

`tests/test-mobile-print-browser.cjs` starter lokal deterministisk sensordemo og **ekte prosjektfrontend** i headless Chrome, med ingen nettverkskall til produksjon.

**Mobil:**
- Setter `Emulation.setDeviceMetricsOverride` med **`mobile:true`**, deviceScaleFactor 2 og touch-emulering, ikke bare en smal desktop-browser.
- Tester **320 × 700**, **390 × 844** og **768 × 1024**, med korrekt visual viewport, maks **2 px** horisontal dokumentoverflyt, synlig profilkontroll innenfor skjermen og ingen ufangede feil ved innlasting.
- Sender faktiske `Input.dispatchTouchEvent` touchStart/touchEnd til tema- og undertemakort etter hit-test med `document.elementFromPoint`. Slik oppdager testen om en faktisk fingerposisjon er blokkert av skjulte/overlappende lag.
- Kjører veiledning og oppfølgingsspørsmål i **390 px mobilvisning** og verifiserer at resultatet ikke tvinger fram horisontal sideveis scrolling.

**PDF/utskrift:**
- Klikker den **reelle** «Skriv ut råd»-knappen etter å ha generert råd og et faktisk oppfølgingssvar i mobilvisningen.
- Fanger akkurat HTML-innholdet applikasjonen sender til utskriftspopupen; dette er ikke en separat konstruert testmal.
- Laster inn samme HTML i Chromium, aktiverer `print`-medie-CSS og krever minst fem rådseksjoner og en `Videre råd`-seksjon uten horisontal overflow.
- Kaller **Chromium `Page.printToPDF`** med A4-oppsett; sjekker gyldig og ikke-tom PDF, antall sider via `pdfinfo` og at de faktiske printede ordene «Forslag til samtalen», «Forslag til åpning», «Videre råd», situasjonsbeskrivelsen og videre spørsmål kan leses ut av PDF med **`pdftotext`**.
- Stopper ved manglende tekst eller serialiseringsfeil (`undefined`, `[object Object]`). Dette kontrollerer *faktisk print-rendering og innhold*, men ikke estetikk, linjebrudd på alle enheter eller utskrift fra fysisk printer.
- PDF-en inneholder kun syntetisk testtekst og ligger midlertidig i CI, ikke i brukerens dokumentarkiv eller i git.

### Reell feil i første testkjøring

Første mobile touch-kjøring ga **godkjent layout i alle tre bredder**, men stoppet på et temakort med finger-koordinaten ved bunnen av skjermen. Testen hadde brukt `scrollIntoView` og hit-test i samme browser-evaluering mens appens scrolling ennå ikke hadde stabilisert seg. Korrigert ved eksplisitt `behavior:'instant'`, en kort stabiliseringsperiode og ny uavhengig hit-test umiddelbart før faktisk touch. **Ingen CSS-endring eller svekking av at elementet faktisk må ligge under fingerposisjonen.**

## 3. Refleksjonsrapport kontrollert mot kjent faggrunnlag

Arbeidsutkast: `docs/REFLEKSJONSRAPPORT-KONSENTRERT-UTKAST.md`, oppdatert 20.11.2026, ca. **3036 ord** i nåværende Markdown-tekst (enkel whitespace-opptelling, inklusive overskrifter og lenker). Dette er **ikke en godkjent ordgrense**.

Kjent undervisnings- og sensorgrunnlag: applikasjon/prosess omtales som **70 %** av vurderingen og refleksjonsrapport som **30 %**; sensorveiledningen for applikasjon/prosess vekter **prosess/KI-styring 30 %, funksjon 20 %, testing 15 %, design/UX 10 %, arkitektur 10 %, README/kjørbarhet 10 %, repo 5 %** *innenfor del 1*. Dette er veiledende vurdering, ikke automatisk karakter eller bekreftede sluttkrav for selve refleksjonsrapporten.

**Vurdering av utkastet:**

| Tema | Nå dokumentert | Gjenstående kontroll |
|---|---|---|
| Egen rolle og KI-styring | Klart skille mellom kravstiller, KI-generert kode og kritisk menneskelig godkjenning | Kontroller eksempelprompter og sesjonslogger mot reelle commits |
| BMAD og utviklingsrekkefølge | Erkjenner at formaliseringen skjedde etter prototyping, ikke før | Behold ærligheten; ikke framstill prosessen som fullstendig planstyrt fra start |
| Negative tester og læring | Konkrete feil fra navnefilter, 500/404, kildetest, CSS og testtiming | Unngå at refleksjonen blir en lang teknisk endringslogg |
| Personvern og autentisering | Rette opp tidligere uttrykk om bare lokal fake Auth: ekte **lokal** GoTrue/PostgREST/RLS bestått | Testen beviser fortsatt ikke hosted Supabase-konfigurasjon eller personvern i faktisk drift |
| Mobil og utskrift | Mer presist nivå: ekte Chrome med mobile:true/touch og PDF-generering/tekstvalidering | Fysisk mobil, reell printdialog, tilgjengelighet og visuell kvalitetsvurdering må fortsatt gjennomføres |
| Leveranseversjon | Arbeid på skole-repo og isolert PR, ikke produksjon | **Det som leveres må være tydelig identifisert**, ikke som en uslått sammenblanding av branch og main |
| Innleveringsformalia | Emne, gruppe, prosjekt, tittel og status finnes | **Studentnummer er en plassholder**; ordgrense, mal, filformat, frist, regler for KI-bruk og vedlegg må kontrolleres mot faktisk Canvas-oppgavetekst |

Det konsentrerte refleksjonsutkastet er **redigert**, ikke erklært ferdig: ny tekst forklarer hvorfor etterligningsbasert Auth-test og statisk testbevis ikke var nok, hvordan lokal GoTrue/PostgREST og en faktisk Chrome-reise lukket bestemte hull, og hvordan asynkron testtiming kunne gi et falskt rødt resultat. Utdatert konklusjon om at isolert ekte Supabase-test fortsatt *gjenstår* er presisert til at **lokal** test er utført, mens hosted paritet ikke er kontrollert.

## 4. Beslutning og resterende risikobilde

**Dette er utvidet automatisk teknisk bevis, ikke full fysisk/menneskelig UX-akseptanse.** Testene dokumenterer en teknisk brukbar mobil og PDF-generert utskrift med den valgte fiktive saken. Før endelig skoleinnlevering bør én faktisk Android-enhet, en faktisk desktop-print-preview og gjerne en keyboard-/skjermleserrunde kontrolleres manuelt. Tidligere faglige review-/KI- og hosted Supabase-forbehold står uendret.

**Ikke gjort:** Ingen merge til `main`, ingen Render-publisering, ingen live Supabase-mutasjon, ingen reelle brukerdata, ingen betalt KI-leverandørtrafikk, ingen endring på LIVE/tale-grenen.

**Kilder internt:** [36-kravs sensormatrise](SENSOR-KJERNEFLYT-E2E-2026-11-20.md), [testbevisregister](TESTBEVIS-OG-DEKNING-2026-11-18.md), [lokal Supabase-akseptanse](SUPABASE-LOCAL-AUTH-E2E-2026-11-20.md), [refleksjonsrapport-utkast](../REFLEKSJONSRAPPORT-KONSENTRERT-UTKAST.md).
