// Samtalestøtte – lokal situasjonsforståelse og temaoverlapp, uten UI og nettverk.
// Prosjektkontekst injiseres for deterministisk testing av reservemodell.
(function registerSituationAnalysis(root) {
  'use strict';
function detectConversationThemes(text, topics) {
  const q = text.toLowerCase();
  const hasSickLeave = /sykmeld|sykemeld|sykefravær|langtidssyk/i.test(q);
  const hasPromotion = /opprykk|forfremm|karriere|utviklingsmulighet|ny stilling/i.test(q);

  // Tydelig fler-tema-dilemma: unngå støy fra tilfeldige nøkkelord.
  if (hasSickLeave && hasPromotion) {
    return ['fravaer-oppfolging', 'lonn-utvikling']
      .map(id => ({ topic: topics.find(topic => topic.id === id), score: 100 }))
      .filter(item => item.topic);
  }

  const scored = topics.map(topic => {
    let score = 0;
    topic.keywords.forEach(keyword => { if (q.includes(keyword)) score += 4; });
    topic.subtopics.forEach(([title, help]) => {
      const hay = `${title} ${help}`.toLowerCase();
      q.split(/\s+/).forEach(word => {
        if (word.length > 5 && hay.includes(word)) score += 1;
      });
    });
    return { topic, score };
  }).filter(item => item.score > 0).sort((a,b) => b.score-a.score);

  if (!scored.length) return [];
  const best = scored[0].score;
  return scored.filter(item => item.score >= Math.max(4, best * 0.6)).slice(0, 2);
}

function buildDilemmaUnderstanding(text, topics) {
  const q = text.toLowerCase();
  const themes = detectConversationThemes(text, topics);
  const hasSickLeave = /sykmeld|sykemeld|sykefravær|langtidssyk/i.test(q);
  const hasLongAbsence = hasSickLeave && /(år|måned|lenge|langvar)/i.test(q);
  const hasPromotion = /opprykk|forfremm|stilling|karriere|utviklingsmulighet/i.test(q);
  const wantsDelay = /avvente|vente|utsette|ikke ennå|først.*tilbake|vært tilbake/i.test(q);
  const facts = [];
  const tensions = [];
  const unknowns = [];
  const cautions = [];

  if (hasLongAbsence) facts.push('Medarbeideren har vært borte fra arbeid over en lengre periode.');
  else if (hasSickLeave) facts.push('Du beskriver et sykefravær.');
  if (hasPromotion) facts.push('Det finnes en utviklings- eller opprykksmulighet som er relevant for medarbeideren.');
  if (wantsDelay) facts.push('Du vurderer å vente med opprykk eller videre utvikling til medarbeideren har vært tilbake i arbeid en periode.');

  if (hasSickLeave && hasPromotion) {
    tensions.push('Du forsøker å balansere hensynet til en reell utviklingsmulighet mot usikkerhet knyttet til tilbakekomst etter et langt fravær.');
    tensions.push('Hvordan beslutningen begrunnes og kommuniseres kan være like viktig som selve samtaleformen.');
    unknowns.push('Er beslutningen om å vente allerede tatt, eller vurderer du fortsatt hva som er riktig?');
    unknowns.push('Hvilke konkrete krav i den nye stillingen gjør at en periode tilbake i arbeid eventuelt er relevant?');
    unknowns.push('Vet medarbeideren at stillingen tidligere har vært aktuell for hen?');
    // Eventuelle juridiske eller prinsipielle varsler vises først når begrunnelsen er bedre avklart.
  }

  if (!facts.length) facts.push('Jeg har foreløpig bare den situasjonen du selv har beskrevet å bygge på.');
  if (!tensions.length) tensions.push('Målet er å forstå hva som står på spill for deg og medarbeideren før vi går til konkrete formuleringer.');

  return { themes, facts, tensions, unknowns: unknowns.slice(0,3), cautions, special: hasSickLeave && hasPromotion };
}

function analyzeSituation(text, currentTopic, currentSubtopic) {
  const normalized = text.toLowerCase();
  const signals = [];
  const unknowns = [];
  const cautions = [];

  const hasRepeatedAbsence = /ofte borte|mye borte|gjentatt|flere fravær|korttidsfravær|stadig borte|fravær/i.test(normalized);
  const hasLateness = /for sent|forsink|sen til jobb|punktlig|oppmøte/i.test(normalized);
  const hasSickLeave = /sykmeld|sykemeld|langtidssyk|gradert|sykefravær/i.test(normalized);
  const hasReturn = /tilbake etter|tilbakekomst|kommer tilbake|returnerer|begynner igjen/i.test(normalized);
  const hasAccommodation = /tilrette|lettere oppgaver|redusert arbeidstid|juster.*oppgave|arbeidstid|kapasitet/i.test(normalized);
  const hasImpact = /påvirk|konsekvens|kollega|drift|bemanning|oppgave|lever|frist/i.test(normalized);
  const hasPattern = /\b\d+\b|uke|måned|dag|periode|siden|ofte|gjentatt|hver/i.test(normalized);
  const hasPrevious = /snakk|samtal|fulgt opp|tilbakemeld|tidligere|avklart|avtalt/i.test(normalized);

  let classification = currentSubtopic || 'Uavklart';
  if (currentTopic?.id === 'fravaer-oppfolging') {
    if (hasLateness) classification = 'Oppmøte og punktlighet';
    else if (hasReturn) classification = 'Tilbakekomst til arbeid';
    else if (hasAccommodation) classification = 'Tilrettelegging';
    else if (hasSickLeave && /lang|lenge|måned/i.test(normalized)) classification = 'Langvarig fravær';
    else if (hasRepeatedAbsence) classification = 'Korttidsfravær';
  }

  if (hasLateness) signals.push('Du beskriver utfordringer knyttet til oppmøte eller punktlighet.');
  if (hasSickLeave) signals.push('Du beskriver sykefravær eller sykmelding.');
  if (hasRepeatedAbsence && !hasSickLeave) signals.push('Du beskriver et fraværsmønster, men årsaken er ikke fastslått.');
  if (hasReturn) signals.push('Tilbakekomst til arbeid ser ut til å være en del av situasjonen.');
  if (hasAccommodation) signals.push('Tilrettelegging eller kapasitet ser ut til å være relevant.');
  if (hasImpact) signals.push('Du har beskrevet en konsekvens for arbeid, kolleger eller drift.');

  if (!hasPattern) unknowns.push('Hvor ofte eller hvor lenge dette har pågått.');
  if (!hasImpact) unknowns.push('Hvordan dette konkret påvirker arbeidssituasjonen.');
  if (!hasPrevious) unknowns.push('Om temaet er tatt opp tidligere eller om noe allerede er avtalt.');

  if (/lat|skulker|gidder ikke|uansvarlig|upålitelig|bryr seg ikke/i.test(normalized)) {
    cautions.push('Beskrivelsen inneholder en tolkning eller merkelapp. Rådene bør i stedet bygge på konkrete observasjoner.');
  }
  if (/depres|angst|alkoholiker|misbruker|diagnose|psykisk syk/i.test(normalized)) {
    cautions.push('Beskrivelsen kan inneholde en antakelse om helse eller årsak. Dette skal ikke behandles som et faktum uten dokumentert grunnlag.');
  }

  const evidenceCount = [hasRepeatedAbsence, hasLateness, hasSickLeave, hasReturn, hasAccommodation, hasImpact, hasPattern, hasPrevious].filter(Boolean).length;
  const confidence = evidenceCount >= 5 ? 'Høy' : evidenceCount >= 2 ? 'Middels' : 'Lav';

  return { classification, signals, unknowns, cautions, confidence };
}


  root.SamtalestotteSituationAnalysis = Object.freeze({
    detectConversationThemes, buildDilemmaUnderstanding, analyzeSituation
  });
})(window);
