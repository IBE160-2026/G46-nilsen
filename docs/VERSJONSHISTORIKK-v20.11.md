# Versjonshistorikk og commitspor – v20.11

**Status:** Produksjonsrelease  
**Produksjonsversjon:** 20.11.0  
**Dato:** 29.10.2026  
**Autoritativ branch:** main  
**Arbeidsgren:** pilot-ux-v20.11  
**Pull request:** #1  
**Merge-commit:** 9ec598d196c02c7f694fa4da2a5619d143d8d9a5

## Formål

v20.11.0 samler pilotdrevne forbedringer i én kontrollert release i stedet for å publisere hver mobil-/UX-endring enkeltvis.

Hovedområdene var:

- mobil-first UX
- tydeligere merkevare
- egen KI-identitet i Samtaleøvelse
- bedre breddeutnyttelse på små skjermer
- installasjon som PWA
- komplett kildevisning i Hjelp
- konsistent mobilnavigasjon
- oppdaterte regresjonstester
- dokumentasjonssynk før produksjon

## Branch- og mergeforløp

Arbeidet ble gjort på pilot-ux-v20.11 med separat Render-preview. Før merge var arbeidsgrenen 0 commits bak main. PR #1 ble brukt for å samle endringene og bevare commit-historikken.

PR-en ble merget med vanlig merge, ikke squash. Det er bevisst: utviklingshistorikken viser de faktiske iterasjonene, regresjonene og korrigeringene som inngår i refleksjonsgrunnlaget.

## Verifisering før produksjon

Fysisk mobiltest ble gjennomført på Samsung/Chrome 29.10.2026. PWA-installasjon og standalone-visning ble bekreftet.

Pilotarbeidet avdekket blant annet:

1. Endringer traff først feil responsivt element fordi desktop-sidefeltet er skjult på mobil.
2. Cache/service worker ble undersøkt, men var ikke hovedårsaken til den manglende visuelle endringen.
3. Samtaleøvelse-identiteten ble i en iterasjon forenklet for langt og måtte gjeninnføres som tydelig, beskåret KI-illustrasjon.
4. Den installerte PWA-en ga ønsket app-lignende visning uten vanlig nettlesergrensesnitt.

## Testspor

v20.11.0 inkluderer:

- tests/test-pilot-ux.cjs
- tests/test-pwa.cjs
- oppdatert tests/test-ui-regression.cjs

Repoet hadde ingen GitHub Actions/status-checks knyttet til release-committen. Det skal derfor ikke hevdes at en ny full npm test-kjøring ble utført av CI for PR #1. Tidligere fullkjøringer og målrettede regresjonskontroller er dokumentert separat.

## Produksjonsmiljø

Produksjonstjenesten på Render følger main og starter med npm start. Pilot-previewen var separat og startet med npm run demo. Merge til main endrer derfor ikke produksjonen til mock-/demomodus.

## Dokumentasjon oppdatert i releasen

- README.md
- product-brief.md
- CHANGELOG.md
- docs/REFLEKSJONSRAPPORT-UTKAST.md
- docs/bmad/PRD.md
- docs/bmad/ARCHITECTURE-BMAD.md
- docs/bmad/UX-DESIGN-BMAD.md
- docs/bmad/EPICS-AND-STORIES-BMAD.md
- docs/bmad/IMPLEMENTATION-PLAN-BMAD.md
- docs/ai/AI-LOGG-SAMTALESTOTTE.md
- docs/ai/AI-TESTPLAN.md
- docs/SIKKERHET-OG-PERSONVERN-v20.4.md
- docs/BRUKERTEST-FUNN-OG-BACKLOG.md
- docs/VERSJONSSTRATEGI.md

Voice er fortsatt videre arbeid og er ikke del av v20.11.0.


## v20.11.1 – desktop/tablet hotfix

Etter produksjonssetting av 20.11.0 ble det oppdaget at Samtaleøvelse-illustrasjonen kunne bli svært stor på maksimerte desktopvinduer, og at eldre temaspesifikke CSS-regler gjorde at mørkt tema kunne vise en annen grafikk enn lys/hybrid. Det ble samtidig observert at overgang til mobilpreget layout skjedde for tidlig på PC.

Rettelsen standardiserer samme `profile-ai.png` i alle temaer, begrenser desktopstørrelsen, beholder to-kolonneoppsett i intervallet 641–900 CSS-piksler og flytter hovedgrensen for mobilmodus fra 700 til 640 CSS-piksler. JavaScript-logikken for mobilnavigasjon bruker samme grense.

Hotfixen er utviklet på `hotfix/v20.11.1-desktop-responsive` og de relevante regresjonsassertene er oppdatert. Lokal full testkjøring kunne ikke gjennomføres i ChatGPTs arbeidsmiljø fordi miljøet ikke kunne nå GitHub for å klone repoet; dette skal ikke fremstilles som en bestått full `npm test`.


## v20.11.2 – kompakt desktop og finder-opprydding

Et skjermbilde fra produksjon viste at en halvstor nettleserbredde kunne presse breadcrumb oppå Samtalestøtte-logoen samtidig som profilområdet ble kuttet på høyre side. Dette var en egen mellomtilstand: vinduet var for smalt for full desktop, men skulle fortsatt ikke behandles som mobil.

Løsningen ble en eksplisitt kompakt desktop-topplinje. I 641–1500 CSS-piksler reduseres logo/gap kontrollert og tekst får min-width/overflow-regler; i 641–1100 kan topplinjen bruke to rader for å bevare full funksjonalitet og profilinformasjon uten kollisjon.

I samme patch ble et state-problem i Finn tema-flyten rettet. Når situasjonstekst var brukt til å finne tema og deretter sendt videre til råd, ble teksten liggende i både hovedsøket og undertemasøket fordi pendingSituationText fortsatt levde videre. v20.11.2 tømmer begge finder-feltene og tilhørende forslag/personvernstatus når råd-flyten starter, samtidig som situasjonen beholdes i det egentlige råd-feltet.


## v20.11.3 – profilforankring og luft i kompakt desktop

Etter v20.11.2 ble profilområdet korrekt synlig, men på kompakt desktop ble brukerprofilen visuelt flyttet for langt mot venstre. I tillegg lå temavelgeren for tett på den utstikkende sidefeltknappen. v20.11.3 beholder profilen som siste element helt mot høyre kant, lar profilteksten komprimeres ved behov og reserverer egen venstrebuffersone i høyresiden av topplinjen slik at sidefeltknappen ikke kolliderer visuelt med temavelgeren.


## v20.11.4 – historikklogo og Samtaleøvelse-illustrasjon

Produksjonskontroll av Historikk viste at logoen fortsatt lå som et element i samme rad som overskriften. Det gjorde at den ikke kunne være visuelt sentrert i den store ledige flaten til høyre. I v20.11.4 brukes derfor CSS-grid til å gjøre høyresiden til en faktisk visuell kolonne uten å endre semantisk HTML-struktur. Logoen sentreres i kolonnen og skalerer med `clamp()`, slik at plasseringen følger vindusstørrelsen i stedet for faste pikselforskyvninger.

Samtidig ble kortutseendet rundt KI-illustrasjonen i Samtaleøvelse fjernet. Wrapperen er fortsatt brukt til responsiv størrelse og klikkflate, men border, bakgrunn, skygge og radius er fjernet slik at selve illustrasjonen står fritt.


## v20.11.5 – Historikklogo som egen kolonne og mørk hover

v20.11.4 forsøkte å sentrere Historikk-logoen ved å la elementet bli del av en grid-layout, men logoen lå fortsatt semantisk inne i `utility-title-row`. Ved skalering kunne den derfor fortsatt oppføre seg som del av overskriftsflyten, wrappe og etterlate uønsket tom høyde. I v20.11.5 ble den flyttet ut av tittelraden i selve HTML-strukturen og gjort til en egen søskenkolonne i headeren.

Fra 641 CSS-piksler og opp har Historikk derfor alltid to kolonner. Høyrekolonnen krymper med vinduet, logoen skalerer med `clamp()`, og den plasseres høyere i den opprinnelig ledige flaten uten å påvirke tekstkolonnens høyde. Under 640 px skjules logoen i stedet for å bli en egen rad.

Samme produksjonsrunde avdekket at generelle hover-regler kunne gjøre mørk sidemeny nær hvit ved peker-hover. En eksplisitt sluttregel for mørk/hybrid sidebar låser hover/fokus/aktiv til mørk teal med hvit tekst og synlig ikon.


## Arbeidsrunde 30.10.2026 – pilotdrevet UX-forbedring etter v20.11.5

Etter nye pilotkommentarer ble en samlet forbedringsrunde startet på main.

Endringene omfatter:
- minimert sidebar som standard for nye brukere
- tooltip på ikoner i minimert sidebar
- forbedret kontrast for Samtaleøvelse-profil i mørk/hybrid
- ny ikonretning: klokke for Fravær og oppfølging, snakkeboble for Samarbeid og kommunikasjon og flatt justeringsikon for Innstillinger
- redesign av de to nederste informasjonskortene på forsiden med enkle linjeikoner
- tydelig todeling av Hjelp i brukerveiledning og ressurser/lenker
- utskriftsfunksjon som begrenser utskriften til situasjon, tema/undertema og råd
- dynamiske forslag til videre spørsmål etter hvert KI-svar i oppfølgingsdialogen

Bakgrunnen er dokumentert i docs/BRUKERTEST-FUNN-OG-BACKLOG.md. Denne arbeidsrunden skal ikke regnes som ferdig produksjonsrelease før tester og faktisk deploy er verifisert.
