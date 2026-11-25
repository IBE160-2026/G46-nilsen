// Streng, deterministisk REGRESJON for advarsel om mulige rettslige påstander.
// Dette er ikke juridisk gjennomgang av kildetekst; ingen eksterne KI-kall.
const assert=require("node:assert/strict");
(async()=>{
  const {reviewLegalClaimSignals}=await import("../src/server/legal-claim-review.js");
  const noSource=reviewLegalClaimSignals([
    "Etter arbeidsmiljøloven har arbeidstaker rett til kompensasjon for overtid."
  ],[]);
  assert.equal(noSource.needsManualReview,true);
  assert.equal(noSource.possibleLegalClaimCount,1);
  assert.equal(noSource.claimToSourceChecked,false);
  assert.equal(noSource.hasOnlyReferenceLinks,false);

  const onlyLink=[{id:"STATE_EMPLOYEE_ACT",evidenceRole:"scope_reference"},
    {url:"https://example.test/a",evidenceRole:"provider_url"}];
  const flagged=reviewLegalClaimSignals([
    "Arbeidsgiver kan kreve at overtid dokumenteres. Lønn må utbetales innen 14 dager."
  ],onlyLink);
  assert.equal(flagged.needsManualReview,true);
  assert.equal(flagged.possibleLegalClaimCount,2);
  assert.equal(flagged.hasModelSelectedReferences,false);
  assert.equal(flagged.hasOnlyReferenceLinks,true,
    "Et systemforslag/nettsøktreff er ikke kildevalgt dokumentasjon");

  const chosen=reviewLegalClaimSignals([
    "Etter statsansatteloven har ansatte rett til å klage."
  ],[{id:"STATE_EMPLOYEE_ACT",evidenceRole:"model_selected"}]);
  assert.equal(chosen.needsManualReview,true);
  assert.equal(chosen.hasModelSelectedReferences,true);
  assert.equal(chosen.claimToSourceChecked,false,
    "Heller ikke KI-valgt lov-ID kan bety at påstanden er kontrollert");

  const ordinary=reviewLegalClaimSignals([
    "Start med å høre begge sider og beskrive det du har observert.",
    "Spør hvordan arbeidshverdagen oppleves og lag en oppfølgingsplan."
  ],[]);
  assert.equal(ordinary.needsManualReview,false);
  assert.equal(ordinary.possibleLegalClaimCount,0);
  assert.equal(ordinary.claimToSourceChecked,false,
    "Ingen signaler er IKKE det samme som en faktasjekket samtale");

  assert.equal(reviewLegalClaimSignals(["Kan jeg kreve overtidstillegg?"],[]).needsManualReview,false,
    "Brukerspørsmål eller hypotetiske spørsmål skal ikke feilmerkes som KI-assertiv lovpåstand");
  assert.equal(reviewLegalClaimSignals(["Du må forberede samtalen."],[]).needsManualReview,false,
    "Generelle samtaleråd er ikke kategoriske rettighetsutsagn");
  const negated=reviewLegalClaimSignals([
    "Etter tariffavtalen har medarbeideren ikke rett til etterbetaling av lønn."
  ],[]);
  assert.equal(negated.needsManualReview,true,
    "Kategorisk avslag på en rettighet krever samme verifisering");
  assert.equal(reviewLegalClaimSignals([undefined,{},42],[]).needsManualReview,false);
  const privacy=reviewLegalClaimSignals([
    "Etter lovverket har arbeidstaker rett til etterbetaling av lønn for en person omtalt i saken."
  ],[]);
  assert.equal(JSON.stringify(privacy).includes("person omtalt"),false,
    "API-metadata må aldri kopiere rå rettighetsutsagn eller personopplysninger");

  // Regresjon fra faktisk anonymisert KI-akseptanse 25.11.2026:
  // Tidligere manglet alle disse juridiske signalene, selv med riktige kilder.
  const sickLeaveFollowup=reviewLegalClaimSignals([
    "Dersom medarbeideren er sykmeldt, skal du normalt ta initiativ til oppfølgingsplan sammen med medarbeideren innen fire uker, med mindre det er åpenbart unødvendig. Ved helt sykefravær skal du normalt innkalle til dialogmøte 1 innen sju uker; ved delvis sykmelding vurderes behovet.",
    "Du kan ikke kreve å få vite diagnosen. Medarbeideren har en medvirkningsplikt og må bidra med arbeidsrelatert informasjon, men trenger ikke oppgi medisinske detaljer. Diagnosen skal ikke være tema i dialogmøtet."
  ],[{id:"NAV_SYKEFRAVAER_OPPFOLGING",evidenceRole:"model_selected"}]);
  assert.equal(sickLeaveFollowup.needsManualReview,true,
    "Frister skrevet med bokstaver og diagnosebegrensning skal varsles");
  assert(sickLeaveFollowup.possibleLegalClaimCount>=3,
    "Frist, diagnose og møteplikt må fanges selv om en kilde er valgt");
  assert.equal(sickLeaveFollowup.claimToSourceChecked,false);

  const shaGuidance=reviewLegalClaimSignals([
    "SHA-planen skal oppdateres fortløpende når det skjer endringer som har betydning for sikkerhet, helse og arbeidsmiljø.",
    "Arbeidsgiver skal også sørge for at arbeidstakerne medvirker i risikovurderingen."
  ],[{id:"AT_BUILDING_SITE_COORDINATION",evidenceRole:"model_selected"}]);
  assert.equal(shaGuidance.needsManualReview,true,
    "Oppdateringsplikt og medvirkningsplikt i SHA-sak krever kildesjekk");
  const shaFollowup=reviewLegalClaimSignals([
    "Byggherren har det overordnede ansvaret for at SHA-arbeidet og planen er ivaretatt, mens koordinatoren følger opp koordineringen i prosjektet."
  ],[]);
  assert.equal(shaFollowup.needsManualReview,true,
    "Bindende rolle- og ansvarsfordeling må få kontrollvarsel");

  assert.equal(reviewLegalClaimSignals([
    "En skriftlig advarsel er en disiplinærreaksjon."
  ],[]).needsManualReview,true,
    "Kategorisk karakterisering av advarsel bør etterprøves");
  assert.equal(reviewLegalClaimSignals([
    "Skriv kort ned hvem som gjør hva, og følg opp om to–fire uker.",
    "Faglig uenighet kan være nødvendig; avklar hvordan den kommuniseres."
  ],[]).needsManualReview,false,
    "Ordinær arbeidsdeling og kollegial samtale skal ikke overjuridifiseres");
  assert.equal(reviewLegalClaimSignals(["Du skal oppdatere møtereferatet."],[]).needsManualReview,false,
    "Vanlige pålegg uten lov- eller fagkontekst skal ikke automatisk merkes");
  console.log("RETTSPÅSTAND-REVISJON OK: kategoriske krav, bare lenker, KI-valgt, negert, vanlige råd og personvern; 0 KI-kall");
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
