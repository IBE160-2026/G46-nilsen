// Samtalestøtte – deterministiske lokalreserve-råd, uten DOM, nettverk eller lagring.
// Avhengigheter injiseres eksplisitt for å holde modulen isolert og testbar.
(function registerFallbackGuidance(root) {
  "use strict";
function getFravaerSubject(classification) {
  const map = {
    'Korttidsfravær': 'fraværet den siste tiden',
    'Langvarig fravær': 'oppfølgingen under det lengre fraværet og veien videre',
    'Oppmøte og punktlighet': 'oppmøtet og punktligheten den siste tiden',
    'Tilbakekomst til arbeid': 'tilbakekomsten til arbeid',
    'Tilrettelegging': 'arbeidssituasjonen og mulig tilrettelegging',
    'Arbeidsevne og kapasitet': 'hvordan arbeidssituasjonen og kapasiteten fungerer i praksis'
  };
  return map[classification] || 'fraværet og arbeidssituasjonen';
}

function buildFravaerGuidance(context, { analyzeSituation, currentSubtopic }) {
  const combined = [context.situation, ...Object.values(context.followups || {})].filter(Boolean).join(' ');
  const analysis = analyzeSituation(combined);
  const classification = analysis.classification || currentSubtopic || 'Uavklart';
  const subject = getFravaerSubject(classification);
  const normalized = combined.toLowerCase();
  const previousKnown = /snakk|samtal|fulgt opp|tilbakemeld|tidligere|avklart|avtalt/i.test(normalized);
  const impactKnown = /påvirk|konsekvens|kollega|drift|bemanning|oppgave|lever|frist/i.test(normalized);

  let opening;
  let questions;
  let attentionParts = [
    'Skill tydelig mellom det du har observert, det du vet og det du antar.'
  ];
  let followup;

  if (classification === 'Oppmøte og punktlighet') {
    opening = '«Jeg ønsker å snakke med deg om oppmøtet den siste tiden. Jeg vil være konkret på det jeg har observert og høre hvordan du opplever situasjonen, slik at vi kan avklare forventninger og hva som skal til for at oppmøtet blir mer forutsigbart.»';
    questions = [
      'Hvordan opplever du selv oppmøtet ditt den siste tiden?',
      'Er det noe ved arbeidssituasjonen eller organiseringen som påvirker muligheten til å møte som avtalt?',
      'Hva mener du er realistisk å gjøre for at oppmøtet blir mer forutsigbart fremover?'
    ];
    attentionParts.push('Hold deg til konkrete tidspunkter, hendelser eller mønstre – ikke antakelser om motiv eller holdning.');
    attentionParts.push('Vær tydelig på hvilke forventninger som gjelder for oppmøte og hvordan avvik påvirker arbeidssituasjonen.');
    followup = 'Oppsummer hva som forventes fremover, eventuelle tiltak dere er enige om, og når dere skal følge opp om oppmøtet har blitt mer stabilt.';
  } else if (classification === 'Korttidsfravær') {
    opening = '«Jeg ønsker å snakke med deg om fraværet den siste tiden. Jeg ser et mønster jeg ønsker å forstå bedre, og vil høre hvordan du opplever arbeidssituasjonen og om det er noe vi bør følge opp.»';
    questions = [
      'Hvordan opplever du selv fraværet den siste tiden?',
      'Er det noe ved arbeidssituasjonen som er relevant for oss å se nærmere på?',
      'Er det noe vi kan gjøre på jobb som kan bidra til en mer stabil arbeidshverdag?'
    ];
    attentionParts.push('Ikke anta at gjentatt fravær skyldes sykdom, motivasjon eller private forhold dersom dette ikke er kjent.');
    attentionParts.push('Fokuser på fraværsmønsteret, arbeidssituasjonen og hva som kan følges opp på arbeidsplassen.');
    followup = 'Avtal hva dere eventuelt skal prøve ut, hva som forventes fremover og et konkret tidspunkt for ny oppfølging dersom fraværsmønsteret fortsetter.';
  } else if (classification === 'Langvarig fravær') {
    opening = '«Jeg ønsker å snakke om hvordan vi best kan følge deg opp under fraværet og planlegge veien videre. Jeg vil gjerne høre hva som er relevant for arbeidssituasjonen, og hva vi eventuelt kan tilrettelegge for.»';
    questions = [
      'Hva er viktig for oss å vite om arbeidsevnen din i forhold til arbeidsoppgavene?',
      'Er det oppgaver, arbeidstid eller andre forhold på jobben som kan tilpasses?',
      'Hva vil være et realistisk neste steg i oppfølgingen?'
    ];
    attentionParts.push('Hold samtalen til arbeidsfunksjon, muligheter og tilrettelegging – ikke be om diagnose eller unødvendige medisinske opplysninger.');
    attentionParts.push('Hvis dette er formell sykefraværsoppfølging, må virksomhetens rutiner og gjeldende krav til oppfølging følges.');
    followup = 'Oppsummer aktuelle tiltak, ansvar og tidspunkt for ny vurdering. Dersom dette er formell sykefraværsoppfølging, må oppfølgingsplan og eventuelle dialogmøter håndteres etter gjeldende rutiner.';
  } else if (classification === 'Tilbakekomst til arbeid') {
    opening = '«Jeg ønsker å snakke om tilbakekomsten til arbeid og hva som skal til for at den fungerer best mulig i praksis. Målet er å avklare forventninger, arbeidsoppgaver og eventuell støtte underveis.»';
    questions = [
      'Hvordan oppleves det å være tilbake i arbeid nå?',
      'Er det bestemte arbeidsoppgaver eller deler av arbeidshverdagen som fungerer godt eller mindre godt?',
      'Hva bør vi avtale for den første tiden fremover?'
    ];
    attentionParts.push('Unngå å gjøre medisinske årsaker til tema hvis de ikke er nødvendige for å tilrettelegge arbeidssituasjonen.');
    attentionParts.push('Vær konkret på hva som skal prøves ut og hvor lenge før dere vurderer løsningen på nytt.');
    followup = 'Lag en konkret plan for den første perioden tilbake: oppgaver, eventuelle justeringer, ansvar og dato for ny samtale.';
  } else if (classification === 'Tilrettelegging') {
    opening = '«Jeg ønsker å se nærmere på arbeidssituasjonen og om det er justeringer som kan gjøre det lettere å fungere godt i jobben. Jeg vil gjerne høre hva som fungerer, hva som er krevende og hvilke løsninger som kan være realistiske.»';
    questions = [
      'Hvilke deler av arbeidet fungerer godt nå, og hvilke er mest krevende?',
      'Er det konkrete oppgaver, arbeidstid eller organisering vi bør vurdere å justere?',
      'Hvilke tiltak tror du selv vil være realistiske å prøve ut?'
    ];
    attentionParts.push('Tilrettelegging bør knyttes til arbeidsoppgaver og funksjon, ikke til antakelser om diagnose eller privatliv.');
    attentionParts.push('Vær tydelig på at mulige tiltak må vurderes opp mot hva virksomheten faktisk kan gjennomføre.');
    followup = 'Avtal ett eller noen få konkrete tiltak, hvem som følger dem opp, hvor lenge de skal prøves og når effekten skal vurderes.';
  } else if (classification === 'Arbeidsevne og kapasitet') {
    opening = '«Jeg ønsker å snakke om hvordan arbeidssituasjonen fungerer i praksis akkurat nå. Målet er å forstå hvilke deler av arbeidet som fungerer, hvor det oppstår utfordringer og hva vi eventuelt bør justere.»';
    questions = [
      'Hvilke arbeidsoppgaver opplever du at fungerer godt nå?',
      'Hvor i arbeidshverdagen opplever du at kapasiteten ikke strekker til?',
      'Hva kan være et realistisk tiltak eller neste steg?'
    ];
    attentionParts.push('Snakk om konkret funksjon i arbeidet fremfor medisinske forklaringer.');
    followup = 'Oppsummer hvilke oppgaver eller rammer dere eventuelt skal justere, og sett en dato for å evaluere hvordan det fungerer.';
  } else {
    opening = `«Jeg ønsker å snakke med deg om ${subject}. Jeg vil være konkret på det jeg har observert og høre hvordan du opplever situasjonen før vi blir enige om veien videre.»`;
    questions = [
      'Hvordan opplever du situasjonen?',
      'Hva mener du er viktig at jeg forstår om arbeidssituasjonen?',
      'Hva kan være et realistisk neste steg?'
    ];
    attentionParts.push('Beskriv situasjonen mer konkret før du trekker konklusjoner eller foreslår omfattende tiltak.');
    followup = 'Avslutt med en konkret oppsummering av hva dere vet, hva som eventuelt må avklares og når dere følger opp igjen.';
  }

  if (!impactKnown) attentionParts.push('Avklar hvilken konkret betydning situasjonen har for arbeid, oppgaver, kolleger eller drift dersom dette er relevant.');
  if (!previousKnown) attentionParts.push('Avklar om temaet er tatt opp tidligere før du legger til grunn at medarbeideren kjenner forventningene.');

  let reactions;
  if (/uenig|konflikt|sint|irritert|forsvar/i.test(normalized)) {
    reactions = 'Det kan være uenighet om selve beskrivelsen. Hold deg til konkrete observasjoner, la medarbeideren korrigere faktiske feil og skill mellom uenighet om fakta og uenighet om forventninger.';
  } else if (/lei seg|gråt|trist|bekymr|stress|press/i.test(normalized)) {
    reactions = 'Samtalen kan vekke sterke følelser. Gi rom for reaksjonen og vis forståelse, men unngå å tolke årsaken på medarbeiderens vegne. Gå tilbake til det konkrete temaet når det er naturlig.';
  } else {
    reactions = 'Medarbeideren kan bli overrasket, bekymret, stille eller uenig. Gi rom for perspektivet deres, og gå tilbake til konkrete observasjoner og formålet med samtalen dersom dialogen glir over i antakelser.';
  }

  return [
    ['Forslag til åpning', opening],
    ['Forslag til spørsmål', questions.map(q => `• ${q}`).join('<br>')],
    ['Mulige reaksjoner', reactions],
    ['Vær oppmerksom på', attentionParts.map(item => `• ${item}`).join('<br>')],
    ['Videre oppfølging', followup]
  ];
}

function buildCrossThemeDilemmaGuidance(context, buildDilemmaUnderstanding) {
  const situation = context.situation || '';
  const dilemma = buildDilemmaUnderstanding(situation);
  if (!dilemma.special) return null;

  const answers = context.followups || {};
  const decisionKnown = answers.decision || '';
  const criteriaKnown = answers.criteria || '';
  const expectationKnown = answers.expectation || '';

  const opening = '«Jeg ønsker å snakke med deg om utviklingsmuligheten som har vært aktuell, og om hvordan vi skal vurdere veien videre nå som du er på vei tilbake. Jeg vil være åpen om hvilke vurderinger som ligger på bordet, og jeg vil gjerne høre hvordan du ser på situasjonen.»';

  const questions = [
    'Hvordan ser du selv på tidspunktet for et eventuelt opprykk eller nye oppgaver?',
    'Hva tenker du er viktig for at en overgang til en ny rolle skal fungere godt?',
    'Er det noe ved forventningene til den nye rollen du ønsker at vi avklarer nærmere?'
  ];

  const attention = [
    'Ikke begrunn en beslutning med sykefraværet alene. Skill mellom fraværet som faktum og konkrete, relevante krav i den nye rollen.',
    'Hvis beslutningen ikke er tatt, unngå å presentere den som avgjort i samtalen.',
    'Hvis beslutningen kan få arbeidsrettslige eller diskrimineringsrettslige konsekvenser, bør vurderingsgrunnlaget kvalitetssikres før du kommuniserer en endelig beslutning.'
  ];

  if (!decisionKnown) attention.push('Det er fortsatt uklart om du ønsker hjelp til selve vurderingen eller bare til hvordan en allerede tatt beslutning skal kommuniseres.');
  if (!criteriaKnown) attention.push('Gjør eventuelle krav til den nye rollen konkrete før du bruker dem som begrunnelse.');
  if (!expectationKnown) attention.push('Avklar hva medarbeideren allerede har fått signaler om, fordi det påvirker hvordan samtalen bør åpnes.');

  const reactions = [
    ['«Dette føles urettferdig – jeg blir straffet for å ha vært syk.»', 'Ikke gå i forsvar. Anerkjenn opplevelsen og forklar hvilke konkrete forhold du faktisk legger til grunn. Hvis vurderingen i realiteten bygger på fraværet alene, bør beslutningen kvalitetssikres før du argumenterer videre.'],
    ['«Betyr dette at dere ikke har tro på meg lenger?»', 'Skill mellom personens verdi og tidspunktet eller kravene i rollen. Vær konkret på hva som er avklart, og hva som fortsatt vurderes.'],
    ['Medarbeideren blir stille eller tydelig skuffet.', 'Gi litt rom. Du kan si at du ser at dette treffer, og spørre hva medarbeideren trenger å få avklart før dere går videre.'],
    ['Medarbeideren blir sint eller utfordrer begrunnelsen.', 'Hold deg til saklige forhold og unngå å diskutere motiv. Be gjerne medarbeideren si hva de opplever som feil eller urimelig i vurderingen.']
  ];
  const reactionHtml = reactions.map(([reaction, response]) => `<strong>${reaction}</strong><br>${response}`).join('<br><br>');

  return [
    ['Hva dilemmaet egentlig handler om', 'Dette er ikke bare en fraværssamtale. Det handler om hvordan du håndterer en mulig karrieremulighet samtidig som medarbeideren kommer tilbake etter et langt fravær.'],
    ['Forslag til åpning', opening],
    ['Spørsmål du kan bruke', questions.map(q => `• ${q}`).join('<br>')],
    ['Mulige reaksjoner – og hvordan du kan møte dem', reactionHtml],
    ['Vær særlig oppmerksom på', attention.map(item => `• ${item}`).join('<br>')],
    ['Neste steg', 'Avklar først om du trenger hjelp til å vurdere selve beslutningen, eller til å kommunisere en beslutning som allerede er tatt. De to samtalene bør ikke blandes sammen.']
  ];
}

function buildGenericGuidance() {
  return [
    ['Forslag til åpning', 'Start rolig og konkret. Beskriv hva samtalen gjelder uten å legge til antakelser om årsak eller motiv. Forklar hensikten og inviter medarbeideren inn i samtalen.'],
    ['Forslag til spørsmål', '• Hvordan opplever du situasjonen? <br>• Hva mener du er viktig at jeg forstår? <br>• Hva tenker du kan være en god vei videre?'],
    ['Mulige reaksjoner', 'Vær forberedt på stillhet, overraskelse, uenighet eller sterke følelser. Gi rom for reaksjonen uten å miste retningen i samtalen.'],
    ['Vær oppmerksom på', 'Skill mellom det du vet, det du har observert og det du antar. Unngå diagnostisering, merkelapper og unødvendige personopplysninger.'],
    ['Videre oppfølging', 'Avslutt med tydelige avtaler: hva som skal skje, hvem som har ansvar og når dere følger opp igjen.']
  ];
}


function buildFollowupQuestions(text, buildDilemmaUnderstanding) {
  const normalized = String(text || '').toLowerCase();
  const dilemma = buildDilemmaUnderstanding(text);

  // A clearly identified multi-theme dilemma gets only questions that materially change the advice.
  if (dilemma.special) {
    return [
      {
        id: 'decision',
        question: 'Er beslutningen om å vente med opprykket allerede tatt?',
        options: ['Ja, beslutningen er tatt', 'Nei, jeg vurderer fortsatt', 'Jeg heller mot å vente, men har ikke bestemt meg', 'Usikker'],
        customLabel: 'Annet / skriv selv'
      },
      {
        id: 'criteria',
        question: 'Hva er hovedgrunnen til at du vurderer å vente?',
        options: ['Jeg vil se hvordan tilbakekomsten fungerer', 'Den nye stillingen har andre eller større krav', 'Jeg er usikker på kapasiteten i den nye rollen', 'Det handler om flere forhold'],
        customLabel: 'Annen grunn / skriv selv'
      },
      {
        id: 'expectation',
        question: 'Vet medarbeideren at stillingen har vært aktuell for hen?',
        options: ['Ja', 'Nei', 'Usikker'],
        customLabel: 'Det er mer nyansert'
      }
    ];
  }

  // Local fallback should not behave like an HR questionnaire. Ask only when the
  // description is genuinely too thin to understand what the user wants help with.
  const meaningfulWords = normalized.match(/[a-zæøåéèáàíìóòúùüöäçñ]{3,}/gi) || [];
  const hasConcreteSituation = meaningfulWords.length >= 12;
  const hasExplicitGoal = /ønsker|vil|trenger hjelp|hvordan|bør jeg|skal jeg|samtale|ta opp|si til|formulere/i.test(normalized);

  if (!hasConcreteSituation) {
    return [{
      id: 'clarify-situation',
      question: 'Hva er det viktigste du ønsker hjelp til i denne situasjonen?',
      multiSelect: true,
      options: ['Forstå dilemmaet', 'Forberede hva jeg skal si', 'Håndtere en mulig reaksjon', 'Vurdere hva jeg bør gjøre først'],
      customLabel: 'Noe annet / skriv selv'
    }];
  }

  if (!hasExplicitGoal) {
    return [{
      id: 'goal',
      question: 'Hva ønsker du mest hjelp til akkurat nå?',
      multiSelect: true,
      options: ['Hvordan åpne samtalen', 'Hvilke spørsmål jeg bør stille', 'Hvordan håndtere reaksjoner', 'Hvordan vurdere veien videre'],
      customLabel: 'Noe annet / skriv selv'
    }];
  }

  // If the user has supplied a reasonably detailed situation and a goal, do not
  // manufacture standard follow-up questions in local fallback mode.
  return [];
}


  root.SamtalestotteGuidanceFallback = Object.freeze({
    getFravaerSubject,
    buildFravaerGuidance,
    buildCrossThemeDilemmaGuidance,
    buildGenericGuidance,
    buildFollowupQuestions
  });
})(window);
