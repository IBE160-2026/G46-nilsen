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
