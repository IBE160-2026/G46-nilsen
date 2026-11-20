# Tastaturnavigasjon og grunnleggende tilgjengelighet – 20.11.2026

**Omfang:** Samtalestøtte, kun revisjonsgrenen i draft PR #12. Ikke `main`, produksjon eller separat tale-pilot.

## Konkret forbedring

- Tidligere begynte tastaturflyten direkte i sidemenyen og manglet en snarvei som kunne hoppe over den.
- `index.html` har nå `<a class="skip-link" href="#main-content">` som første interaktive element i appskallet. En fokusbar, navngitt region ligger **etter den klebrige toppmenyen** og før de øvrige visningene. Den har `tabindex="-1"` og ligger ikke i normal Tab-rekkefølge.
- `styles-overrides.css` skjuler snarveien visuelt fram til fokus, viser den tydelig med kontrast og fokusramme, og legger ikke til `!important` eller endrer den tidligere oppdelte CSS-kjernen. Målregionen har null høyde for ikke å flytte eksisterende innhold.
- Samme snarvei gjelder alle visninger. Dette er ikke en fullstendig løsning på skjermleser- eller fokusflyt for dialoger.

## Falskt rødt testresultat og forebygging

Den eldre Chrome/CSS-paritetstesten sammenligner **elementindekser i DOM**, ikke semantiske ID-er. To tilsiktede nye noder forskjøv indeksene, og testens kanonisering feilet med `Cannot read properties of undefined (reading 'replaceAll')`. Testen ble korrigert til å filtrere ut **bare** de to nye elementene fra den historiske indekssammenligningen. Alle de opprinnelige DOM-elementene beholdes i sammenligningen; dette er ikke en tillatelse til å ignorere reelle stilavvik.

## Test og avgrensninger

`tests/test-sensor-journey-browser.cjs` bruker Chromium sin faktiske `Input.dispatchKeyEvent` til Tab og Enter. Den krever at Tab fokuserer den nye lenken, at den er synlig og ikke `inert`, og at Enter flytter aktivt fokus til hovedinnholdsregionen. Deretter kjører den hele eksisterende sensordemo-reisen, inkludert situasjon, råd, oppfølging, simulering, historikk og sletting.

I første nettleserkjøring ble **Tab → synlig snarvei → Enter → hovedinnhold** bekreftet, og hele senstestbrukerreisen besto. De påfølgende CSS-kjøringene avdekket separat en feil i den historiske indekssammenligningen, samt en senere redigeringsfeil i testfilen som ble korrigert. Den gjennomførte snarveistesten har senere bestått full [Quality Gate #44801877351](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44801877351) på commit `327aff3937`; dette gjaldt **den daværende** revisjonskoden, ikke senere dialogendringer.

Dette verifiserer ikke automatisk:
- fysisk tastaturnavigasjon eller skjermleser med NVDA, VoiceOver eller TalkBack
- korrekt fokusfelle og tilbakeføring av fokus i alle modaler
- WCAG-konformitet, fargekontrast i alle temaer eller helhetlig universell utforming
- betalt KI eller hosted Supabase, som ikke inngår i denne isolerte testen

**Manuell oppfølging:** Tab/Shift+Tab gjennom meny og hovedskjema; åpning/lukking av profilmeny og dialoger med Enter, Space og Escape; fokus når visning byttes; Hjelp/`details`, simulator og utskriftsdialog; reell skjermleser, mobil og kontrast.

## Påfølgende runde: Escape, Tab og fokus i dialoger

**Problem og rettelse:** Den tilpassede innloggingsdialogen var merket `role="dialog"` og `aria-modal="true"`, men hadde ikke en selvstendig Tab-fokusfelle. `openAuth` lagrer nå aktivt element ved **første åpning**, Tab og Shift+Tab omsluttes innen de synlige dialogkontrollene, og `closeAuth` flytter fokus tilbake til opprinnelig element når dette fortsatt finnes og er synlig. Ved bytte mellom innlogging/registrering/glemt passord bevares opprinnelig åpner. Den uinnloggede appen forblir `inert` og obligatorisk innlogging lar seg ikke lukke med Escape.

**Konkrete feilrettinger:** Den tidligere `addEventListener('click', closeAuth)` sendte `MouseEvent` inn som `force`-argument, som feilaktig omgjorde obligatorisk autentisering til en tvungen lukking ved X-knappen. Lukkebehandleren bruker nå `()=>closeAuth()`. Profilmenyen gir tilbake fokus til profilknappen ved Escape, men tar ikke fokus tilbake fra brukerens bevisste klikk utenfor menyen. Dokument-lytter for Escape ignorerer åpne native `<dialog>` slik at andre dialoger ikke lukkes samtidig.

**HTML-dialoger:** Eksisterende native modaler har fått tilgjengelige navn via `aria-labelledby`/etikett uten å endre modalstruktur. `tests/test-admin-browser.cjs` kontrollerer via reelle Chrome-tastaturhendelser: profilmeny Escape, frivillig innlogging Tab/Shift+Tab/Escape, påkrevd innlogging Escape/X/fortsatt låst app, samt billedialogens Escape og fokusretur. To syntetiske roller har også test av admin-lagringsdialogens Escape uten datalagring. Første strenge Chrome-test fant et faktisk fokusavvik ved lagringsdialogens lukking. En avgrenset `close`-hendelse gjenoppretter nå fokus til «Lagre» så lenge knappen fremdeles er aktiv; testen venter på den faktiske fokusendringen. Ingen produksjonsdata eller betalte KI-kall er involvert.

**Begrensning:** Dette er målrettede Chrome-regresjonstester, ikke en full WCAG-sertifisering eller fysisk skjermlesertest. Det er fremdeles behov for manuell testing av alle andre dialoger, Escape under asynkrone operasjoner, fokus etter visningsbytter og skjermleserstøtte. En grønn Quality Gate er kun gyldig for den konkrete SHA-en den kjørte på.

## Visningsbytter, nettleserhistorikk og skjermleserfokus

**Endring på isolert revisjonsgren:** `showView()` etterlater ikke lenger fokus på en knapp i en tidligere, skjult visning. Når visningen faktisk endres, flyttes fokus i neste renderingsramme til den nye visningens første `h1`, med `tabindex="-1"` (ikke et ekstra vanlig Tab-stopp). Fokusoverføringen bruker `preventScroll` og respekterer eksisterende `restoreScroll` ved tilbake-/framover-navigasjon. Den utføres **ikke** mens en modal er åpen, hvis viewet allerede er endret igjen, eller hvis et interaktivt felt i den nye visningen allerede har fått tilsiktet fokus. Dette bevarer for eksempel automatisk fokus i et forhåndsutfylt situasjonsfelt.

**Lagrede samtaler:** Ved åpning fra historikken etter sideoppfriskning fylles `#guidance-title` med faktiske tema-/undertematitler eller en kontrollert reserveoverskrift *før* fokus flyttes. Dette hindrer at skjermleseren kommer til en tom overskrift og unngår gjenbruk av en gammel overskrift fra forrige sak.

**Reell Chrome-regresjon:** `tests/test-sensor-journey-browser.cjs` kontrollerer fokusert temakort aktivert med `Enter` → tematittel, undertemakort → veiledningstittel, `history.back()/forward()` → riktig tittel, en forhåndsutfylt situasjon → beholdt tekstareafokus, simulering → simuleringstittel, sidepanel → historikktittel og åpning av lagret samtale → en fylt veiledningstittel. Dette etterfølges av den komplette deterministiske brukerreisen med råd, simulering, historikk og sletting. Testen bruker Chrome DevTools Protocol for ekte tastetrykk, ikke `.click()` som erstatning for Enter.

**Verifikasjonsnivå:** Første komplette, grønne [Quality Gate #44803922548](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44803922548) bekreftet den nye `showView()`-koden med eksisterende tester på commit `eb5dc03c`. Etter at ny Enter-/navigasjonstest ble lagt til viste [CI #44804357125](https://github.com/IBE160-2026/G46-nilsen/actions/runs/44804357125) uttrykkelig **PASS** for de nye tastaturvisningene og full sensordemo, men **FAIL** senere i emulert mobil-touch. Det røde samletallet må ikke skjules.

**Mobil-testens samtidighetsproblem:** Etter et temabytte kaller `showView()` `scrollTo` i `requestAnimationFrame`. Mobiltestens `touch()` kunne beregne et treffpunkt før denne planlagte scrollingen var ferdig, og neste emulerte trykk traff ikke riktig undertemakort. Testen er justert til å vente på **to renderingsrammer** før den beregner treffpunkt, men bruker fortsatt faktisk `Input.dispatchTouchEvent`, `elementFromPoint` og den samme strenge visnings-/PDF-akseptansen. Dette er en hypotese om årsaken; siste Quality Gate etter justeringen må bekrefte om feilen faktisk er løst.

**Ikke verifisert:** En fysisk bruker med tastatur/skjermleser, NVDA/VoiceOver, fokus i alle dynamiske underkomponenter, full WCAG 2.2-samsvar, live KI og produksjonsmiljø. Ingen merge til `main`, Render-deploy, live databaseendring eller tale-pilotarbeid i denne runden.
