const topics = [
  {
    id: 'rus',
    title: 'Alkohol og rus',
    icon: '🍷',
    description: 'Bekymring, påvirkning, fungering, oppfølging og sikkerhet.',
    subtopics: [
      ['Bekymring knyttet til alkohol', 'Endringer i atferd, fravær, prestasjon eller andre forhold som skaper bekymring.'],
      ['Bekymring knyttet til rusmidler', 'Når observasjoner eller informasjon gir grunn til bekymring for annen rusmiddelbruk.'],
      ['Påvirkning på jobb', 'Situasjoner der en medarbeider kan fremstå påvirket i arbeidstiden.'],
      ['Arbeidsevne og fungering', 'Når alkohol eller rus kan ha sammenheng med arbeidsutførelse, oppmøte eller samspill.'],
      ['Bekymring fra kolleger', 'Når andre medarbeidere har meldt fra om observasjoner eller uro.'],
      ['Sikkerhet og hendelser', 'Når alkohol eller rus kan ha hatt betydning for sikkerhet, feil eller en hendelse.'],
      ['Oppfølging og tilbakekomst', 'Samtaler etter behandling, fravær eller tidligere oppfølging.'],
      ['Avhengighet og andre vaner', 'For eksempel pengespill eller andre vaner som påvirker arbeidssituasjonen.'],
      ['Annet', 'Når situasjonen ikke passer naturlig inn i de andre valgene.']
    ]
  },
  {
    id: 'fravaer',
    title: 'Fravær og oppmøte',
    icon: '🕒',
    description: 'Fravær, punktlighet, tilbakekomst, tilrettelegging og kommunikasjon.',
    subtopics: [
      ['Korttidsfravær', 'Hyppige eller gjentatte fraværsperioder over kort tid.'],
      ['Langvarig fravær', 'Når medarbeideren har vært borte over en lengre periode og trenger oppfølging.'],
      ['Oppmøte og punktlighet', 'Forsinkelser, ustabilt oppmøte eller andre utfordringer knyttet til tilstedeværelse.'],
      ['Tilbakekomst til arbeid', 'Samtaler etter lengre fravær eller overgang tilbake til vanlig arbeid.'],
      ['Tilrettelegging', 'Behov for justeringer i oppgaver, arbeidstid eller arbeidsmåte.'],
      ['Arbeidsevne og kapasitet', 'Når det er behov for å snakke om hvordan arbeidssituasjonen fungerer i praksis.'],
      ['Påvirkning på drift og kolleger', 'Når fravær eller ustabilt oppmøte får konsekvenser for bemanning eller samarbeid.'],
      ['Kommunikasjon om fravær', 'Når rutiner for beskjed, dokumentasjon eller oppfølging ikke fungerer godt.'],
      ['Annet', 'Når situasjonen ikke passer naturlig inn i de andre valgene.']
    ]
  },
  {
    id: 'prestasjon',
    title: 'Prestasjon',
    icon: '📈',
    description: 'Mål, motivasjon, kvalitet, kompetanse, ansvar og utvikling.',
    subtopics: [
      ['Måloppnåelse', 'Når mål, leveranser eller forventede resultater trenger en nærmere samtale.'],
      ['Motivasjon', 'Når engasjement, driv eller interesse ser ut til å ha endret seg.'],
      ['Kvalitet i arbeidet', 'Når kvalitet, nøyaktighet eller standard på arbeidet bør følges opp.'],
      ['Feil og avvik', 'Når feil, hendelser eller avvik trenger gjennomgang og læring.'],
      ['Oppgaver og tidsfrister', 'Når oppgaver, prioriteringer eller frister trenger tydeligere oppfølging.'],
      ['Kompetanse og mestring', 'Når opplæring, ferdigheter eller trygghet i rollen kan være en del av situasjonen.'],
      ['Ansvar og initiativ', 'Når forventninger til selvstendighet, ansvar eller initiativ trenger avklaring.'],
      ['Endring i prestasjon over tid', 'Når arbeidsprestasjonen har endret seg sammenlignet med tidligere.'],
      ['Forventninger til rollen', 'Når leder og medarbeider kan ha ulik forståelse av rolle eller ansvar.'],
      ['Annet', 'Når situasjonen ikke passer naturlig inn i de andre valgene.']
    ]
  },
  {
    id: 'lonn',
    title: 'Lønn',
    icon: '💬',
    description: 'Lønnsutvikling, forventninger, forskjeller og ansvar.',
    subtopics: [
      ['Lønnsutvikling', 'Samtaler om utviklingen i lønn over tid.'],
      ['Forventninger til lønn', 'Når medarbeiderens forventninger og virksomhetens rammer må avklares.'],
      ['Lønnsforskjeller', 'Når forskjeller mellom roller eller medarbeidere blir tema.'],
      ['Nye oppgaver og ansvar', 'Når endringer i rolle eller ansvar kobles til forventninger om lønn.'],
      ['Lønnsoppgjør', 'Samtaler før eller etter et lønnsoppgjør.'],
      ['Annet', 'Når situasjonen ikke passer naturlig inn i de andre valgene.']
    ]
  },
  {
    id: 'samarbeid',
    title: 'Samarbeid',
    icon: '🤝',
    description: 'Kommunikasjon, tillit, roller, uenighet og samspill.',
    subtopics: [
      ['Kommunikasjon', 'Misforståelser, tone, utydelige beskjeder eller manglende informasjonsdeling.'],
      ['Tillit', 'Når tidligere hendelser eller opplevelser påvirker samarbeidet.'],
      ['Roller og forventninger', 'Uklare ansvarsområder, ulike forventninger eller behov for avklaringer.'],
      ['Uenighet og konflikt', 'Når motsetninger eller uenigheter har blitt vanskelige å håndtere.'],
      ['Samspill i team', 'Hvordan medarbeidere samarbeider, fordeler oppgaver og påvirker arbeidsmiljøet.'],
      ['Tilbakemeldinger', 'Når det er behov for å gi, motta eller følge opp tilbakemeldinger mellom kolleger.'],
      ['Grenser og respekt', 'Situasjoner knyttet til tone, humor, oppførsel eller personlige grenser.'],
      ['Annet', 'Når situasjonen ikke passer naturlig inn i de andre valgene.']
    ]
  },
  {
    id: 'oppsigelse',
    title: 'Oppsigelse',
    icon: '🚪',
    description: 'Avslutning, prøvetid, endringer og samtaler før videre prosess.',
    subtopics: [
      ['Avslutning av arbeidsforhold', 'Samtaler der arbeidsforholdet kan være på vei mot en avslutning.'],
      ['Prøvetid', 'Oppfølging av forventninger, utvikling og vurderinger i prøvetiden.'],
      ['Endringer i stilling eller behov', 'Situasjoner der rolle, oppgaver eller bemanningsbehov endres.'],
      ['Tidligere oppfølging', 'Når medarbeideren allerede har fått tilbakemeldinger, veiledning eller oppfølgingssamtaler.'],
      ['Frivillig avslutning', 'Når medarbeideren selv vurderer å slutte eller ønsker å avslutte arbeidsforholdet.'],
      ['Samtale før videre prosess', 'Når alvorlige forhold må tas opp før saken eventuelt går videre til HR eller formell behandling.'],
      ['Annet', 'Når situasjonen ikke passer naturlig inn i de andre valgene.']
    ]
  },
  {
    id: 'sikkerhet',
    title: 'Sikkerhet',
    icon: '🛡️',
    description: 'Rutiner, avvik, risiko, rapportering og læring.',
    subtopics: [
      ['Sikkerhetsrutiner', 'Etterlevelse av prosedyrer, instrukser og etablerte sikkerhetskrav.'],
      ['Avvik og hendelser', 'Når noe har skjedd som bør gjennomgås, følges opp eller læres av.'],
      ['Risikovurdering', 'Når leder og medarbeider har ulik forståelse av risiko eller forsvarlig praksis.'],
      ['Rapportering', 'Når rapportering av hendelser, feil eller avvik trenger oppfølging.'],
      ['Informasjonssikkerhet', 'Håndtering av informasjon, tilgang, deling eller andre sikkerhetsrelaterte forhold.'],
      ['Arbeidsmåter og prosedyrer', 'Når gjennomføring av arbeid avviker fra avtalte eller pålagte arbeidsmåter.'],
      ['Ansvar og læring etter hendelser', 'Samtaler om hva som skjedde, hva man kan lære og hva som bør endres.'],
      ['Annet', 'Når situasjonen ikke passer naturlig inn i de andre valgene.']
    ]
  },
  {
    id: 'livssituasjoner',
    title: 'Livssituasjoner',
    icon: '🌿',
    description: 'Personlige belastninger, omsorg, livsfaser, sorg og støtte.',
    subtopics: [
      ['Samlivs- og familieforhold', 'Samlivsbrudd, krevende familiesituasjoner eller andre forhold hjemme som påvirker arbeidshverdagen.'],
      ['Sykdom i nær familie', 'Når medarbeideren står i omsorgsbelastning eller alvorlig sykdom hos noen nær.'],
      ['Sorg og tap', 'Dødsfall, alvorlige tap eller andre situasjoner som krever særlig omtanke.'],
      ['Psykisk belastning', 'Når medarbeideren selv forteller om stress, uro, nedstemthet eller andre psykiske belastninger.'],
      ['Økonomiske utfordringer', 'Når privatøkonomi påvirker trivsel, konsentrasjon eller arbeidssituasjon.'],
      ['Omsorgsansvar', 'Barn, foreldre eller andre nærstående som krever mye tid og oppfølging.'],
      ['Belastning og utmattelse', 'Søvnproblemer, høyt press eller andre belastninger som påvirker arbeidshverdagen.'],
      ['Behov for støtte i en vanskelig periode', 'Når medarbeideren åpner seg om noe personlig og lederen er usikker på hvordan det bør møtes.'],
      ['Livsfaser', 'Småbarnsperiode, omsorg for eldre foreldre, senkarriere, overgang mot pensjon eller andre livsfaser.'],
      ['Annet', 'Når situasjonen ikke passer naturlig inn i de andre valgene.']
    ]
  }
];

let currentTopic = null;
let currentSubtopic = null;

const views = {
  home: document.querySelector('#home-view'),
  topic: document.querySelector('#topic-view'),
  guidance: document.querySelector('#guidance-view'),
  settings: document.querySelector('#settings-view')
};

function showView(name) {
  Object.values(views).forEach(view => view.classList.remove('active-view'));
  views[name].classList.add('active-view');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
    btn.classList.toggle('active',
      (name === 'home' && btn.dataset.view === 'home') ||
      (name === 'settings' && btn.dataset.view === 'settings') ||
      ((name === 'topic' || name === 'guidance') && btn.dataset.view === 'prepare')
    );
  });
}

function renderTopics() {
  const grid = document.querySelector('#topic-grid');
  grid.innerHTML = '';
  topics.forEach(topic => {
    const button = document.createElement('button');
    button.className = 'topic-card';
    button.innerHTML = `
      <span class="topic-icon" aria-hidden="true">${topic.icon}</span>
      <strong>${topic.title}</strong>
      <p>${topic.description}</p>
      <span class="card-arrow">→</span>
    `;
    button.addEventListener('click', () => openTopic(topic));
    grid.appendChild(button);
  });
}

function openTopic(topic) {
  currentTopic = topic;
  document.querySelector('#topic-title').textContent = topic.title;
  document.querySelector('#topic-description').textContent = topic.description;
  document.querySelector('#topic-page-icon').textContent = topic.icon;
  document.querySelector('#breadcrumb').textContent = `Forbered samtale / ${topic.title}`;

  const grid = document.querySelector('#subtopic-grid');
  grid.innerHTML = '';
  topic.subtopics.forEach(([title, help]) => {
    const button = document.createElement('button');
    button.className = 'subtopic-card';
    button.innerHTML = `<strong>${title}</strong><p>${help}</p><span class="card-arrow">→</span>`;
    button.addEventListener('click', () => openGuidance(title, help));
    grid.appendChild(button);
  });

  showView('topic');
}

function openGuidance(title, help) {
  currentSubtopic = title;
  document.querySelector('#guidance-title').textContent = `${currentTopic.title}: ${title}`;
  document.querySelector('#guidance-help').textContent = help;
  document.querySelector('#breadcrumb').textContent = `Forbered samtale / ${currentTopic.title} / ${title}`;
  document.querySelector('#prototype-result').hidden = true;
  document.querySelector('#followup-panel').hidden = true;
  document.querySelector('#situation-form').reset();
  updatePrivacyCheck();
  showView('guidance');
}

function detectSensitiveInfo(text) {
  const findings = [];
  const email = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i;
  const phone = /(?:\+47\s?)?(?:\d[\s-]?){8}\b/;
  const gendered = /\b(han|hun|ham|henne|hans|hennes)\b/i;
  const likelyName = /(?:^|[.!?]\s+|\n)\s*(?:Jeg|Vi|Det|En|Et|Når|Hvis|I|På|Som|Medarbeideren|Kollegaen|Lederen|Hen)?\s*([A-ZÆØÅ][a-zæøå]{2,}\s+[A-ZÆØÅ][a-zæøå]{2,})\b/m;

  if (email.test(text)) findings.push('mulig e-postadresse');
  if (phone.test(text)) findings.push('mulig telefonnummer');
  if (gendered.test(text)) findings.push('kjønnet pronomen');
  if (likelyName.test(text)) findings.push('mulig personnavn');
  return findings;
}

function updatePrivacyCheck() {
  const box = document.querySelector('#privacy-check');
  const text = document.querySelector('#situation').value;
  const help = document.querySelector('#help-request').value;
  const findings = detectSensitiveInfo(`${text}\n${help}`);

  if (!text.trim() && !help.trim()) {
    box.hidden = true;
    box.innerHTML = '';
    return;
  }

  box.hidden = false;
  if (findings.length) {
    box.className = 'privacy-check warning';
    box.innerHTML = `<strong>Sjekk anonymiseringen før du går videre.</strong><span>Jeg fant ${findings.join(', ')}. Bytt gjerne til roller som «medarbeideren» og bruk «hen» der kjønn ikke er relevant.</span>`;
  } else {
    box.className = 'privacy-check ok';
    box.innerHTML = `<strong>Ingen åpenbare personopplysninger funnet.</strong><span>Automatisk kontroll kan likevel ikke garantere full anonymisering.</span>`;
  }
}

function buildFollowupQuestions(text) {
  const questions = [];
  if (text.trim().length < 120) questions.push('Hva har du konkret observert eller fått informasjon om?');
  if (!/gang|uke|måned|dag|tid|siden|ofte|gjentatt|første/i.test(text)) questions.push('Hvor lenge har dette pågått, og er det en enkelt hendelse eller et mønster?');
  if (!/påvirk|konsekvens|arbeid|kollega|drift|sikker|oppgave|lever/i.test(text)) questions.push('Hvordan påvirker situasjonen arbeidet, kolleger eller driften?');
  if (!/snakk|samtal|fulgt opp|tilbakemeld|tidligere|avklart/i.test(text)) questions.push('Har dette vært tatt opp tidligere, og i så fall hvordan?');
  return questions.slice(0, 3);
}

const guidanceSections = [
  ['Åpning', 'Start rolig og konkret. Beskriv hva samtalen gjelder uten å legge til antakelser om årsak eller motiv.'],
  ['Struktur', 'Forklar hensikten, legg frem konkrete observasjoner, lytt til medarbeiderens perspektiv og avklar hva dere skal gjøre videre.'],
  ['Spørsmål', 'Bruk åpne spørsmål som «Hvordan opplever du situasjonen?» og «Hva tenker du kan være en god vei videre?»'],
  ['Mulige reaksjoner', 'Vær forberedt på stillhet, overraskelse, uenighet eller sterke følelser. Gi rom for reaksjonen uten å miste retningen i samtalen.'],
  ['Vær oppmerksom på', 'Skill mellom det du vet, det du har observert og det du antar. Unngå diagnostisering, merkelapper og unødvendige personopplysninger.'],
  ['Oppfølging', 'Avslutt med tydelige avtaler: hva som skal skje, hvem som har ansvar og når dere følger opp igjen.']
];

function renderStructuredGuidance() {
  const grid = document.querySelector('#structured-guidance');
  grid.innerHTML = guidanceSections.map(([title, text], index) => `
    <article class="guidance-card">
      <span class="guidance-number">${String(index + 1).padStart(2, '0')}</span>
      <div><h3>${title}</h3><p>${text}</p></div>
    </article>
  `).join('');
}

function showStructuredGuidance() {
  document.querySelector('#followup-panel').hidden = true;
  document.querySelector('#prototype-result').hidden = false;
  renderStructuredGuidance();
  document.querySelector('#prototype-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function applyTheme(theme) {
  localStorage.setItem('samtalestotte-theme', theme);
  const actualTheme = theme === 'system'
    ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    : theme;
  document.documentElement.dataset.theme = actualTheme;
  document.querySelectorAll('[data-theme]').forEach(button => {
    button.classList.toggle('active', button.dataset.theme === theme);
  });
}

function initTheme() {
  applyTheme(localStorage.getItem('samtalestotte-theme') || 'system');
}

document.querySelectorAll('[data-theme]').forEach(button => {
  button.addEventListener('click', () => applyTheme(button.dataset.theme));
});

document.querySelectorAll('.nav-item[data-view]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.view === 'home') {
      document.querySelector('#breadcrumb').textContent = 'Hjem';
      showView('home');
    }
    if (button.dataset.view === 'prepare') {
      document.querySelector('#breadcrumb').textContent = 'Forbered samtale';
      showView('home');
      setTimeout(() => document.querySelector('#topics').scrollIntoView({ behavior: 'smooth' }), 50);
    }
    if (button.dataset.view === 'settings') {
      document.querySelector('#breadcrumb').textContent = 'Innstillinger';
      showView('settings');
    }
  });
});

document.querySelector('#start-button').addEventListener('click', () => {
  document.querySelector('#topics').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('#back-to-topics').addEventListener('click', () => {
  document.querySelector('#breadcrumb').textContent = 'Forbered samtale';
  showView('home');
  setTimeout(() => document.querySelector('#topics').scrollIntoView({ behavior: 'smooth' }), 50);
});

document.querySelector('#back-to-subtopics').addEventListener('click', () => {
  if (currentTopic) openTopic(currentTopic);
});

document.querySelector('#situation').addEventListener('input', updatePrivacyCheck);
document.querySelector('#help-request').addEventListener('input', updatePrivacyCheck);

document.querySelector('#situation-form').addEventListener('submit', event => {
  event.preventDefault();
  updatePrivacyCheck();
  const text = document.querySelector('#situation').value;
  const questions = buildFollowupQuestions(text);
  document.querySelector('#prototype-result').hidden = true;

  if (questions.length >= 2) {
    const container = document.querySelector('#followup-questions');
    container.innerHTML = questions.map(q => `<div class="followup-question">${q}</div>`).join('');
    document.querySelector('#followup-panel').hidden = false;
    document.querySelector('#followup-panel').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    showStructuredGuidance();
  }
});

document.querySelector('#show-guidance-anyway').addEventListener('click', showStructuredGuidance);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((localStorage.getItem('samtalestotte-theme') || 'system') === 'system') applyTheme('system');
});

renderTopics();
initTheme();
