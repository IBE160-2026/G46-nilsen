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
Det ble valgt en todelt teststrategi fordi en full ende-til-ende-benchmark av alle undertemaer på tre modeller ville gi unødvendig API-kostnad i et studentprosjekt. Testbanken dekker i v20.5 alle 56 undertemaer med minst to faste situasjoner per undertema (112 saker totalt), mens den store dekningskontrollen fortsatt kan kjøres uten KI-kall. Prosjektet er tilrettelagt for at ekte modellbenchmark kan kjøres på et kontrollert utvalg av de samme sakene på valgte OpenAI- og OpenRouter-modeller for å sammenligne kvalitet og kostnad. En full fler-modell-sammenligning er ikke dokumentert som fullført.

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


## v20.5–v20.7 – ni temaer, faggrunnlag og kildepresisjon
- Produktet ble utvidet til ni hovedtemaer, inkludert **Mobbing og trakassering**.
- Hvert tema fikk eget faggrunnlag, og SOURCEBANK ble videreutviklet som en kontrollert kunnskapsbase.
- Det ble tydeligere skilt mellom modellens egen syntese og det en kilde faktisk sier.
- Et eksplisitt prinsipp ble innført: en kilde skal ikke brukes som dekorasjon eller autoritetsmarkør; den må faktisk støtte den konkrete påstanden.
- Juridisk sensitive råd skal kvalitetssikres mot relevante myndighets-/lovkilder og ikke fremstilles som sikre juridiske konklusjoner.

### Refleksjon
Dette viste at «har kilder» ikke er det samme som «har gode kilder». Kildekvalitet må vurderes både etter troverdighet og etter om kilden faktisk støtter akkurat det rådet som gis.

## v20.8–v20.10 – opprydding, regresjon og sensor-kjørbarhet
- Repoet ble ryddet slik at aktiv kode, dokumentasjon, tester, bilder og databasefiler fikk tydelige mapper.
- Gamle arkivkopier og historiske testfiler ble fjernet fra aktiv struktur.
- README ble gjort til en konkret sensorinngang med publisert testversjon, lokal oppstart og testkommandoer.
- Deterministiske tester kan kjøres med `npm test` uten OpenAI-/OpenRouter-nøkkel.
- Ekte KI-tester er skilt fra lokale regresjonstester fordi de krever API-konfigurasjon og kan koste penger.
- Testserveren bruker en eksplisitt test-only autentiseringsbypass i stedet for å svekke produksjonsautentisering.

### Refleksjon
Kjørbarhet handler ikke bare om at programmet fungerer på utviklerens maskin. En sensor må kunne forstå hvordan løsningen prøves, hvilke tester som kan kjøres uten hemmeligheter, og hvilke deler som krever et konfigurert driftsmiljø.

## Golden/fasitbasert KI-testing – fra «grønn test» til gyldig test
Golden-testingen ble et av de tydeligste eksemplene på kritisk KI-styring i prosjektet.

Første fasitbank hadde én representativ case per hovedtema og skilte mellom:

- maskinelle kontrollpunkter
- **MÅ**
- **BØR**
- kritiske feil

En første kjøring ga **9/9 OK**, men manuell gjennomgang viste at rapporten ikke viste nok av KI-svaret til å kontrollere hele fasiten. Rapportgeneratoren ble derfor utvidet med blant annet spørsmål, reaksjoner, HR/juridisk merknad og neste steg.

Senere kjøringer avdekket flere typer problemer:

1. **Falsk positiv på «skyld»**  
   Testen markerte samarbeidscasen som kritisk fordi ordet «skyld» forekom, selv om KI-en eksplisitt sa at skyld ikke skulle fastslås. Testregelen ble gjort mer presis.

2. **For rigid avklaringskrav**  
   Prestasjonscasen ble markert fordi modellen ga forsvarlige råd uten først å stoppe for avklaring. Fasiten ble endret slik at avklaring kunne være valgfri når saken likevel kunne håndteres forsvarlig.

3. **Kildepresisjon som automatikken overså**  
   En rus-/sikkerhetscase hadde faglig gode råd, men manuell kontroll fant en perifer kilde og en organisasjonsattribusjon som ikke var støttet av riktig kilde. Systeminstruksen og fasiten ble skjerpet for kildepresisjon.

4. **Grønn test som egentlig testet feil tema**  
   `G-LIV-01` var merket som Livssituasjoner, men den opprinnelige situasjonen var så tvetydig at modellen klassifiserte den som prestasjon/sikkerhet. Casen ble gjort tematisk entydig, og forventningen ble strammet til faktisk **Livssituasjoner**.

5. **Delstrengsfeil: «lat» i «arbeidsrelatert»**  
   Testmotoren brukte delstrengsmatching og kunne derfor tolke bokstavene `lat` inne i `arbeidsrelatert` som om modellen hadde kalt medarbeideren «lat». Matcherlogikken ble gjort til helords-/frasematching, og det ble lagt til egen regresjonstest for feilen.

Etter disse endringene ga siste verifiserte golden-kjøring mot **GPT-5.6 Luna**:

- **9/9 OK**
- **0 BØR SJEKKES**
- **0 KRITISK AVVIK**
- **0 TEKNISK FEIL**

### Refleksjon
Det viktigste læringspunktet er at målet ikke er å gjøre testen grønn, men å gjøre testen **gyldig**. En feilende test kan avsløre en produktfeil, men den kan også avsløre en feil i testen. Tilsvarende kan en grønn test gi falsk trygghet dersom casen ikke faktisk tester det kravet den hevder å teste.

Dette ga en mer moden arbeidsmåte:

**KI-svar → automatisk kontroll → menneskelig kontroll → årsaksanalyse → rett riktig lag → regresjonstest → ny verifisering.**

## Verifiserte regresjonsresultater ved sluttkontroll
Siste dokumenterte lokale regresjonspakke omfatter blant annet:

- personvern: **33/33**
- samtalesimulering: **24/24**
- server-personvern: bestått
- UI-regresjon: bestått
- historikk-regresjon: bestått
- snakkeboble-regresjon: bestått
- clipboard-regresjon: bestått
- golden-schema: **9/9 hovedtemaer**
- golden matcher-regresjon: bestått

Disse resultatene brukes som testbevis, men erstatter ikke manuell kvalitetsvurdering av KI-svar.


## 15.10.2026 – Teorikobling og videre arbeidsmetode (arbeidsnotat, ikke sluttrapport)

**Bakgrunn:** Forelesningene i IBE160 (særlig 28.09, 06.10 og 08.10) framhever *Context Engineering* som sentral teori. Vi skal bruke teori i selve utviklingsprosessen, ikke bare omtale den i refleksjonsrapporten. Dette er en plan for videre arbeid og en tolkningsramme for tidligere hendelser – ikke påstand om at alle tiltak allerede er implementert.

| Erfaring dokumentert i prosjektet | Relevant fagbegrep | Hva vi bør etterprøve eller dokumentere |
| --- | --- | --- |
| KI foreslo/utførte designendringer utenfor bestilt område | Prompt Engineering, avgrensning av agentoppgaver | Konkret bestilling, diff, hvilke elementer skulle forbli uendret, test og korrigering |
| Lange og sammensatte KI-dialoger kan føre til at tidligere føringer overses eller blandes | Context Engineering, Context Rot, *lost in the middle*, distraktorer | Sammenlign fokuserte oppgaver mot lange økter; dokumenter hva som faktisk forårsaket feilen |
| Personvernregler kunne stoppe vanlige ord eller nødvendig kontekst | Kravspesifikasjon, kvalitetskontroll og regresjonstesting | Eksempelcase, endret regel og tilhørende personverntest |
| Golden-test kunne gi falske positive eller grønne resultater på feil premiss | Non-determinisme, evalueringsdesign, menneskelig verifikasjon | Vis både opprinnelig testfeil, årsaksanalyse og regresjonstest |
| KI-svar kan støtte et råd med en lite relevant kilde | Knowledge cutoff, retrieval, kildepresisjon | Kontroller om kilden faktisk underbygger den konkrete påstanden |
| KI-genererte endringer kan påvirke fungerende kode | Git, diff-review, regresjonstesting | Avgrens commits, sammenlign endringer og test tilstøtende funksjoner |
| Lange agentøkter og mye verktøyutdata øker kontekstbruk | Statelessness, tokens, compaction, retrieval | Bruk bare relevante filer, korte oppsummeringer og begrenset verktøyutdata; mål når mulig |

### Arbeidsregler vi vil prøve i videre utvikling

1. Én tydelig avgrenset endring om gangen, med eksplisitt «skal ikke endres».
2. Les relevante eksisterende prosjektfiler før KI foreslår ny kode. Ikke fyll konteksten med hele repoet hvis bare få filer er relevante.
3. Ved gjentatte feil: stans, undersøk kode og tidligere instrukser, vurder ny kort agentøkt fremfor å gjenta prompten.
4. Inspiser diff og kjør målrettede tester; ved større endringer også relevante regresjonstester.
5. Noter konkrete avvik i eksisterende KI-logg/refleksjonsnotater med dato, kilde (commit/test/prompt der den finnes), årsakshypotese, tiltak og resultat.
6. Skill mellom dokumenterte feilårsaker og mulige forklaringer. Ikke kall enhver misforståelse «Context Rot».
7. La BMAD og refleksjonsrapport være levende fram til senere sluttkontroll; oppdater status ut fra faktisk implementasjon og gjennomførte tester.

### Sporbarhet og vurdering

Det er opplyst som en **sannsynlig, ikke bekreftet**, vurderingsform at KI kan lese hele Git-historikken opp mot sensorveiledningen, mens en menneskelig sensor tester appen. Derfor skal dokumentasjonen være lesbar og kontrollerbar for begge, uten å skrive for en tenkt KI-sensor eller pynte på historikken.

Før innlevering: følg den endelige sensorveiledningen, sjekk at README, Product Brief, BMAD, tester og refleksjonsrapport beskriver samme faktiske versjon. Eldre formuleringer som «status ved levering» og «sluttkontroll» skal kontrolleres på nytt; prosjektet er fortsatt under utvikling per 15.10.2026.


## 15.10.2026 – Beslutning etter realistisk brukertest: støtte til flere roller (planlagt, ikke implementert)

**Observasjon:** Under lokal testing beskrev brukeren en kollega som gjentatte ganger tok fysisk kontakt til tross for kroppslige signaler om at dette var uønsket. Testen avdekket både svakheter i demoens temasortering og en bredere produktbegrensning: Samtalestøtte tar i stor grad utgangspunkt i at den som ber om råd, er leder.

**Produktbeslutning:** Behold ledere med personalansvar som primærmålgruppe, men planlegg støtte også for medarbeidere som skal ha en krevende samtale med en kollega eller egen leder. Unngå at produktet automatisk gir lederråd til en medarbeider.

**Foreslått enkel rollekontekst før veiledning:**
- Jeg er leder og skal snakke med en medarbeider.
- Jeg skal snakke med en kollega.
- Jeg skal ta opp noe med min leder.
- Annen arbeidssituasjon / avklar behov.

**Faglige og etiske grenser:** Samme hendelse kan kreve ulike råd avhengig av rolle, ansvar og maktforhold. Et råd om å «ta det opp direkte først» må aldri brukes som generell regel, spesielt ikke ved utrygghet, mulige krenkelser/trakassering, trusler eller asymmetrisk makt. Verktøyet må gi anledning til å søke støtte fra leder, verneombud, tillitsvalgt, HR eller relevante varslingskanaler, uten å konkludere på skyld eller rettslig klassifisering.

**Plan for gjennomføring:** Stabiliser eksisterende lederflyt først. Utform deretter et lite rollevalg og test samme situasjon i minst tre perspektiver (leder, kollega, medarbeider som henvender seg til leder). Undersøk nødvendige endringer i prompts, skjema, simulering, personvern og testdata før implementasjon. Ikke endre produktets hovedmålgruppe eller BMAD-krav som om funksjonen er levert.

**Teorikobling:** Brukerrolle som eksplisitt kontekst (*Context Engineering*), presis avgrensning av KI-oppgaven, kravsporing, etisk risikovurdering og differensiert regresjonstesting.

**Status per 15.10.2026:** Idé godkjent for videre planlegging; ikke implementert eller testet som rollebasert funksjon.

---

## 28.–29.10.2026 – produksjonsflyt, personvern og ikke-determinisme

**Utgangspunkt:** Pilotbruk viste at KI-en ofte skrev for lange og formelle åpninger, noen ganger som råd til lederen i stedet for ord lederen faktisk kunne si høyt. Dette ble behandlet som et kvalitetsproblem i selve samtalestøtten, ikke bare som et enkelt dårlig svar.

**Tiltak:** Prompt og schema ble strammet inn til korte, muntlige åpninger (normalt 2–4 korte setninger og 30–65 ord), uten meta-instruksjoner, HR-/rapportstil eller hele samtalen i første replikk. Fem faktiske pilotcaser ble lagt inn i goldenbanken og senere utvidet til en full produksjonsflyt-test med 26 saker.

**Funn:** Første fullkjøring registrerte alle 26 saker, men bare 23 nådde KI-svaret. Tre ble stoppet av personverngatewayen. Det viste at en test av «KI-kvalitet» ikke er nok dersom resten av kjeden kan hindre et ellers korrekt KI-kall.

**Rotårsaker i personverndetektoren:**
- «møtte tydelig påvirket» ble tolket som om ord etter «møtte» var personnavn
- «med hva som har skjedd» ga falskt navnetreff på «hva»
- «Varsleren mener …» ga falskt navnetreff på rolleordet «Varsleren»

Feilene ble rettet i den deterministiske detektoren og låst med regresjonstester. Ny fullkjøring fikk **26/26 helt gjennom til KI-svar**. 25 åpninger besto automatisk kontroll; én var 67 ord mot grensen på 65, men ble manuelt vurdert som god. Jeg valgte å beholde dette som et dokumentert marginalt avvik i stedet for å justere testen bare for å få 26 grønne.

**Læring om ikke-determinisme:** De samme pilotcasene fikk ulike formuleringer mellom kjøringer, men kunne fortsatt oppfylle de samme kvalitetskravene. Dette støtter forelesningens poeng om at generativ KI ikke bør testes som en deterministisk funksjon med forventning om identisk tekst. Testene bør i stedet låse egenskaper som sikkerhet, lengde, rolle, tone og forbudte mønstre, kombinert med menneskelig vurdering.

**Teorikobling:** Context Engineering, non-determinisme, automatisert regresjon, human-in-the-loop og skillet mellom deterministiske kontrollkomponenter og generativ modelladferd.

## 29.10.2026 – undertemaer: fra brukerfunn til enklere taksonomi

Endringen fra 56 til 48 undertemaer startet **ikke** med et mål om å få færre kategorier. Den startet med pilot-/brukertestfunn. I brukertestbackloggen var et gjentakende funn at enkelte undertemabeskrivelser ikke hjalp godt nok med å forstå hvilket valg som passet. Flere tekster var faglig riktige, men ble oppfattet som for abstrakte, overlappende eller mer som definisjoner enn navigasjon. Pilotfeedback viste også at indirekte formuleringer kunne bli for vage; et konkret eksempel var språk rundt «på vei mot en avslutning», som gjorde at ordet **oppsigelse** ble tatt tydeligere inn i taksonomien.

Først ble alle 56 undertemaene derfor gjennomgått språklig. Deretter ble selve strukturen vurdert strengere: Bruker vi ordene en leder faktisk vil lete etter? Er forskjellen mellom nabokort tydelig? Er noen kategorier så like eller smale at valget blir tilfeldig?

Denne gjennomgangen viste at flere undertematitler forsøkte å romme både situasjon, prosess og forklaring samtidig. Andre kategorier overlappet eller beskrev et prosess-steg som like gjerne kunne ligge i beskrivelsen til et bredere undertema. Beslutningen ble derfor å bruke korte, skannbare titler og la beskrivelsen forklare nyansen.

Eksempler på beslutninger:
- «Forventninger til lønn» og «Nye oppgaver og ansvar» ble samlet under **Lønnskrav**
- generelle samarbeidskategorier ble spisset til blant annet **Samarbeidsutfordringer**, **Konflikt med kollega**, **Konflikt med leder** og **Tillitsbrudd**
- smale sikkerhetskategorier som egen «Rapportering» og «Risikovurdering» ble tatt inn i beskrivelsene til bredere sikkerhetstemaer
- livssituasjoner ble forenklet til fem undertemaer, blant annet **Utmattelse**
- mobbing/trakassering fikk blant annet **Uønsket adferd**, **Diskriminering** og **Varslingssak**

Taksonomien gikk som konsekvens av denne gjennomgangen fra 56 til **48 undertemaer**. Tallet 48 var altså ikke et mål i seg selv; reduksjonen kom av at overlappende, svært smale eller prosessorienterte kategorier ble slått sammen eller flyttet inn i beskrivelser, samtidig som enkelte områder ble tydeligere skilt. Klient og serverkontrakt ble oppdatert samtidig, og en regresjonstest låser navnelikheten. Den eldre benchmarkbanken ble deretter remappet til den nye strukturen. Tidligere caser ble beholdt som testbevis, og to nye saker ble lagt til for «Konflikt med leder».

**Læring:** En god informasjonsarkitektur trenger ikke flest mulig kategorier. Kategorioverskriften skal hjelpe brukeren å velge raskt; beskrivelsen kan bære presisjon og avgrensning. Samtidig må en taksonomiendring behandles som en systemendring fordi UI, klassifiseringskontrakt, benchmark, tester og dokumentasjon må holdes synkron.

## 29.10.2026 – Git-sporbarhet fremfor pen historikk

Versjonsløft via GitHub-tilkoblingen oppdaterer enkelte filer sekvensielt og gir derfor flere små `chore: bump versjon`-commits for samme versjon. Jeg valgte **ikke** å omskrive eller squash'e historikken i etterkant bare for at grafen skulle se penere ut. Det ville redusert sporbarheten og endret historisk bevis.

I stedet er CHANGELOG oppdatert og `docs/VERSJONSHISTORIKK-v20.10.md` kobler versjonene 20.10.4–20.10.9 til commitrekkefølgen og forklarer hvorfor ett versjonsløft kan bestå av flere commits.

**Læring:** «Ryddig Git» betyr ikke nødvendigvis færrest commits. For dette prosjektet er det viktigere at historikken er ærlig, at `main` er autoritativ, at versjoner kan spores, og at dokumentasjonen forklarer automatiserte/sekvensielle commits.

## Åpent sikkerhetspunkt etter v20.10.9

Render sitt `npm ci` rapporterer fortsatt **2 avhengighetssårbarheter (1 moderat og 1 høy)**. Dette er registrert som et åpent punkt. `npm audit fix` skal ikke kjøres blindt; avhengighetene må identifiseres og konsekvensene av eventuell oppgradering vurderes før endring.
