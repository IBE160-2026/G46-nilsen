# Refleksjonsnotater – v20.0

Dette dokumentet samler bevisste valg som kan brukes i refleksjonsnotatet senere.

## Admin og roller
- Tre roller: **bruker**, **redaktør** og **admin**.
- Redaktør kan endre utvalgt tekstinnhold; admin kan i tillegg administrere roller.
- Begrunnelse: prinsippet om minste nødvendige tilgang. Innholdsredigering skal ikke automatisk gi rett til å administrere andre brukere.
- Rolle sjekkes på serveren, ikke bare ved å skjule knapper i brukergrensesnittet.
- Prosjekteiers kontaktadresse fungerer som bootstrap-admin, slik at løsningen ikke kan stå uten en kjent administrator.

## Redigerbart innhold
- Utvalgte tekster kan redigeres fra et adminpanel og lagres i Supabase.
- Bare en eksplisitt hviteliste av innholdsnøkler kan lagres.
- KI-logikk, sikkerhetsregler og temaklassifisering er fortsatt kodebasert.
- Begrunnelse: gjøre vanlige tekstendringer enkle uten å gjøre sikkerhetskritisk logikk redigerbar som vanlig sideinnhold.

## Personvern som felles port før KI
- Alle brukerfelter som kan ende i et KI-kall kontrolleres lokalt før sending.
- Kjønnede pronomen (han/hun/ham/henne/hans/hennes) inngår i kontrollen og kan kjønnsnøytraliseres.
- Serveren har i tillegg en siste personvernbarriere for sentrale identifikatorer og kjønnede pronomen før OpenAI-kall.
- Begrunnelse: UI-kontroll alene er sårbar dersom et felt eller en fremtidig kodevei glemmer kontrollen.

## Historikk
- Når en gammel samtale åpnes, skannes situasjonen og brukerens tidligere meldinger på nytt.
- Historikk endres ikke automatisk. Brukeren får eksplisitt valg om å anonymisere og lagre på nytt.
- Begrunnelse: bedre personvern uten å endre brukerens lagrede data uten samtykke.

## Samtalesimulering og konsistens
- Boblegeometrien fra v19.12.3 beholdes, mens hele simulatorboblen flyttes opp for å treffe avataren bedre.
- «Midlertidig øvelse» følger samme visuelle mønster som «Midlertidig samtale».
- Personvernfeltet i simulatoren har en forklarende normaltilstand også når ingen brudd er funnet.
- Begrunnelse: konsistens reduserer behovet for at brukeren må lære samme funksjon flere ganger.

## Feilrapportering
- Feilrapport kan inkludere appversjon, tidspunkt, aktiv visning, skjermstørrelse, nettleser og registrerte JavaScript-feil.
- Samtaletekst tas ikke med automatisk.
- Begrunnelse: gjøre feil lettere å reprodusere uten å øke personvernrisikoen unødvendig.


## v20.1 – nye refleksjonspunkter
- Admininnhold ble organisert i sammenleggbare seksjoner fordi et langt redigeringsskjema ga dårlig navigasjon.
- Visningstekster for tema/undertema ble skilt fra interne klassifiseringsverdier for å gi redigeringsfrihet uten å gjøre KI-logikken ustabil.
- Lagring krever eksplisitt bekreftelse for å redusere risikoen for utilsiktede publiserte tekstendringer.
- Undertema brukes som kontekst, ikke som et hardt regelsett; dette bevarer fleksibilitet og lar situasjonsteksten veie tyngst.
- «Rapporter svar» ble lagt tett på KI-svar for å få kvalitetsfeedback i kontekst. Samtaleteksten lagres ikke automatisk av personvernhensyn.


## v20.2 – driftsstyring, kostnad og læring fra bruk
- Modellvalg ble lagt til i admin for å kunne balansere kvalitet og kostnad uten kodeendring eller redeploy.
- Faktisk tokenbruk og estimert kostnad logges fordi modellvalg er et produkt- og skaleringsvalg, ikke bare et teknisk valg.
- Weboppslag logges som søketema/domene, ikke samtaletekst, for å identifisere hvilke eksterne kunnskapskilder en framtidig offline-/lukket versjon bør inneholde.
- Rapportering av KI-svar kan inkludere samtalen bare etter aktivt samtykke, og personvernsjekken kjøres før vedlegget lagres. Dette balanserer kvalitetsarbeid mot dataminimering.

## v20.3 – teststrategi, kostnad og sammenligning av KI-modeller
Det ble valgt en todelt teststrategi fordi en full ende-til-ende-benchmark av alle undertemaer på tre modeller ville gi unødvendig API-kostnad i et studentprosjekt. Testbanken dekker alle 47 undertemaer med minst to faste situasjoner per undertema (94 saker totalt), men den store dekningskontrollen kan kjøres uten KI-kall. Ekte modellbenchmark kjøres på et kontrollert utvalg av de samme sakene mot Luna, Terra og Sol.

Benchmarken lagrer objektive måledata: tokenbruk, estimert kostnad, responstid, weboppslag, søkestrenger og brukte domener, i tillegg til selve svarene. Dette gjør det mulig å sammenligne modellene på både kvalitet, kildebruk og ressursbruk, samtidig som menneskelig vurdering av svarene fortsatt er nødvendig. Testtrafikk skilles fra reell brukertrafikk, slik at kostnads- og brukstall ikke forurenses.

En eksplisitt budsjettgrense ble valgt som sikkerhetsmekanisme. Dette støtter et viktig prosjektprinsipp: kvalitetsarbeid skal være målbart, men testopplegget må stå i forhold til prosjektets økonomi. De registrerte weboppslagene kan også brukes til å identifisere hvilke kilder som senere bør prioriteres i en lokal SOURCEBANK/RAG-løsning for lukket eller offline drift.

## v20.4 – sikkerhet og personvern som arkitekturvalg
- Personvernsjekk ble flyttet fra å være primært et UI-tiltak til forsvar i dybden: serveren håndhever de harde personvernreglene før ekstern KI kan kalles.
- Teknisk KI-/kildestatistikk ble bevisst frikoblet fra bruker-ID. Dette bevarer nytten for kostnadsanalyse og framtidig offline SOURCEBANK uten å gjøre loggen til et verktøy for overvåking av enkeltbrukere.
- Full URL/sidetittel for webkilder lagres når tilgjengelig, men uten samtaletekst eller brukeridentifikator.
- Retensjon ble gjort eksplisitt og automatisk for å redusere data som blir liggende uten klart behov.
- Offentlig serverflate ble redusert fra hele prosjektmappen til eksplisitt allowlist. Dette viser forskjellen mellom «hemmelig fil» og faktisk tilgangskontroll.
- Rate limiting, same-origin-kontroll og sikkerhetsheadere ble lagt inn som generelle plattformtiltak i stedet for å sikre ett endepunkt av gangen.
- Kontoeksport og mer fullstendig sletting støtter brukerens kontroll over egne data.
- Tiltak som DPIA, databehandleravtaler, behandlingsgrunnlag og MFA for driftskontoer er dokumentert som organisatoriske krav og ikke fremstilt som noe applikasjonskoden alene kan løse.
