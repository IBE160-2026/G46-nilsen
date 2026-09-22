const svgIcons = {
  home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10.5V20h13V10.5"></path></svg>`,
  prepare: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.5h8"></path><path d="M8 8.5h8"></path><path d="M8 12.5h8"></path><path d="M8 16.5h5"></path><path d="M6 3.5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z"></path></svg>`,
  history: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v5l3 2"></path><path d="M12 21a9 9 0 1 0-9-9"></path></svg>`,
  settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"></path><path d="m19.4 15 .8 1.4-1.6 2.8-1.7-.4a7.9 7.9 0 0 1-1.8 1l-.4 1.7H9.3l-.4-1.7a7.9 7.9 0 0 1-1.8-1l-1.7.4-1.6-2.8.8-1.4a8.5 8.5 0 0 1 0-2l-.8-1.4 1.6-2.8 1.7.4a7.9 7.9 0 0 1 1.8-1l.4-1.7h3.4l.4 1.7a7.9 7.9 0 0 1 1.8 1l1.7-.4 1.6 2.8-.8 1.4a8.5 8.5 0 0 1 0 2Z"></path></svg>`,
  team: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M16.5 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M3.5 19c.5-2.2 2.2-3.5 4-3.5s3.5 1.3 4 3.5"></path><path d="M12.5 19c.5-2.2 2.2-3.5 4-3.5s3.5 1.3 4 3.5"></path></svg>`,
  bed: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7v12"></path><path d="M4 13.5h16"></path><path d="M7 13.5v-4h5a2 2 0 0 1 2 2v2"></path><path d="M20 19v-6"></path></svg>`,
  list: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6.5h9"></path><path d="M8 11.5h9"></path><path d="M8 16.5h9"></path><path d="M5 6.5h.01"></path><path d="M5 11.5h.01"></path><path d="M5 16.5h.01"></path><path d="M4 3.5h16v17H4z"></path></svg>`,
  warning: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 14H4L12 4Z"></path><path d="M12 9v4"></path><path d="M12 16.5h.01"></path></svg>`,
  bottle: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3.5h4"></path><path d="M11 3.5v4l-3 3v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-8l-3-3v-4"></path><path d="M8 12.5h8"></path></svg>`,
  people: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M16 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M12 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M3.5 19c.4-2.2 2.2-3.5 4.3-3.5 1 0 1.9.2 2.7.8"></path><path d="M20.5 19c-.4-2.2-2.2-3.5-4.3-3.5-1 0-1.9.2-2.7.8"></path><path d="M8 19c.4-2.4 2-4 4-4s3.6 1.6 4 4"></path></svg>`,
  shirt: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 4 3 2 3-2 4 3-2 3v10H7V10L5 7l4-3Z"></path></svg>`,
  person: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path><path d="M5 20a7 7 0 0 1 14 0"></path></svg>`,
  coins: `<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="9" cy="7" rx="4" ry="2.5"></ellipse><path d="M5 7v6c0 1.4 1.8 2.5 4 2.5s4-1.1 4-2.5V7"></path><ellipse cx="16" cy="12" rx="4" ry="2.5"></ellipse><path d="M12 12v5c0 1.4 1.8 2.5 4 2.5s4-1.1 4-2.5v-5"></path></svg>`,
  scales: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16"></path><path d="M7 7h10"></path><path d="m7 7-3 5h6L7 7Z"></path><path d="m17 7-3 5h6l-3-5Z"></path><path d="M9 20h6"></path></svg>`,
  more: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h.01"></path><path d="M12 12h.01"></path><path d="M18 12h.01"></path></svg>`
};

const topics = [
  {
    id: 'alkohol-rus',
    title: 'Alkohol og rus',
    iconKey: 'bottle',
    image: 'topic-alkohol-rus.png',
    imageAlt: 'Alvorlig, men rolig samtale mellom kvinnelig leder og kvinnelig medarbeider i et moderne møterom',
    description: 'Støtte til samtaler der observasjoner, bekymring, påvirkning eller sikkerhet gjør det nødvendig å ta opp alkohol eller rus på en tydelig og respektfull måte.',
    representations: ['Bekymring og endret fungering', 'Påvirkning eller sikkerhet', 'Oppfølging og tilbakekomst'],
    keywords: ['alkohol','rus','påvirket','beruset','stoff','narkotika','promille','drikking','bekymring'],
    subtopics: [
      ['Bekymring knyttet til alkohol', 'Når endringer i atferd, fravær eller fungering skaper bekymring.'],
      ['Bekymring knyttet til rusmidler', 'Når observasjoner eller informasjon gir grunn til bekymring for annen rusmiddelbruk.'],
      ['Påvirkning på jobb', 'Når en medarbeider kan fremstå påvirket i arbeidstiden.'],
      ['Arbeidsevne og fungering', 'Når alkohol eller rus kan ha sammenheng med arbeidsutførelse, oppmøte eller samspill.'],
      ['Sikkerhet og hendelser', 'Når alkohol eller rus kan ha betydning for sikkerhet, feil eller en hendelse.'],
      ['Oppfølging og tilbakekomst', 'Samtaler etter behandling, fravær eller tidligere oppfølging.']
    ]
  },
  {
    id: 'fravaer-oppfolging',
    title: 'Fravær og oppfølging',
    iconKey: 'bed',
    image: 'topic-fravaer-oppfolging.png',
    imageAlt: 'Oppfølgingssamtale mellom leder og medarbeider i et lyst kontormiljø',
    description: 'Støtte til gode samtaler om fravær, oppmøte, tilbakekomst, arbeidsevne og tilrettelegging – med fokus på både medarbeideren og arbeidssituasjonen.',
    representations: ['Fravær og oppmøte', 'Tilbakekomst til arbeid', 'Tilrettelegging og kapasitet'],
    keywords: ['sykefravær','fravær','sykmelding','oppmøte','for sent','punktlighet','tilrettelegging','tilbakekomst','arbeidsevne'],
    subtopics: [
      ['Korttidsfravær', 'Hyppige eller gjentatte fraværsperioder over kort tid.'],
      ['Langvarig fravær', 'Når medarbeideren har vært borte over en lengre periode og trenger oppfølging.'],
      ['Oppmøte og punktlighet', 'Forsinkelser, ustabilt oppmøte eller andre utfordringer knyttet til tilstedeværelse.'],
      ['Tilbakekomst til arbeid', 'Samtaler etter lengre fravær eller overgang tilbake til vanlig arbeid.'],
      ['Tilrettelegging', 'Behov for justeringer i oppgaver, arbeidstid eller arbeidsmåte.'],
      ['Arbeidsevne og kapasitet', 'Når det er behov for å snakke om hvordan arbeidssituasjonen fungerer i praksis.']
    ]
  },
  {
    id: 'prestasjon-utvikling',
    title: 'Prestasjon og utvikling',
    iconKey: 'list',
    image: 'topic-prestasjon-utvikling.png',
    imageAlt: 'Utviklingssamtale med fokus på mål og fremgang ved et skrivebord',
    description: 'Støtte til samtaler om forventninger, kvalitet, mål, kompetanse og utvikling når arbeidshverdagen ikke fungerer helt som ønsket.',
    representations: ['Mål og leveranser', 'Kvalitet og ansvar', 'Kompetanse og utvikling'],
    keywords: ['prestasjon','leveranse','resultat','motivasjon','kvalitet','feil','frist','arbeidsutførelse','mestring','kompetanse','utvikling'],
    subtopics: [
      ['Måloppnåelse', 'Når mål, leveranser eller forventede resultater trenger en nærmere samtale.'],
      ['Motivasjon', 'Når engasjement, driv eller interesse ser ut til å ha endret seg.'],
      ['Kvalitet i arbeidet', 'Når kvalitet, nøyaktighet eller standard på arbeidet bør følges opp.'],
      ['Feil og avvik', 'Når feil, hendelser eller avvik trenger gjennomgang og læring.'],
      ['Kompetanse og mestring', 'Når opplæring, ferdigheter eller trygghet i rollen kan være en del av situasjonen.'],
      ['Ansvar og initiativ', 'Når forventninger til selvstendighet, ansvar eller initiativ trenger avklaring.']
    ]
  },
  {
    id: 'lonn-utvikling',
    title: 'Lønn og utvikling',
    iconKey: 'coins',
    image: 'topic-lonn-utvikling.png',
    imageAlt: 'Positiv samtale om lønn, utvikling og forventninger i et moderne kontor',
    description: 'Støtte til ryddige samtaler om lønn, forventninger, ansvar, utviklingsmuligheter og hvordan virksomhetens rammer kan forklares tydelig.',
    representations: ['Lønnsforventninger', 'Nye oppgaver og ansvar', 'Utvikling og muligheter'],
    keywords: ['lønn','lønnsøkning','lønnsutvikling','lønnssamtale','forfremmelse','kompensasjon','ansvarstillegg','utvikling'],
    subtopics: [
      ['Lønnsutvikling', 'Samtaler om utviklingen i lønn over tid.'],
      ['Forventninger til lønn', 'Når medarbeiderens forventninger og virksomhetens rammer må avklares.'],
      ['Lønnsforskjeller', 'Når forskjeller mellom roller eller medarbeidere blir tema.'],
      ['Nye oppgaver og ansvar', 'Når endringer i rolle eller ansvar kobles til forventninger om lønn.'],
      ['Utvikling og forfremmelse', 'Når samtalen handler om videre utvikling, muligheter eller hva som kreves for neste steg.']
    ]
  },
  {
    id: 'samarbeid-kommunikasjon',
    title: 'Samarbeid og kommunikasjon',
    iconKey: 'people',
    image: 'topic-samarbeid-kommunikasjon.png',
    imageAlt: 'Flere kolleger samarbeider rundt en laptop i et moderne kontor',
    description: 'Støtte til samtaler som skal styrke kommunikasjon, tillit, rolleforståelse og samspill når samarbeidet har blitt krevende.',
    representations: ['Kommunikasjon og tone', 'Uenighet og tillit', 'Roller og samspill i team'],
    keywords: ['samarbeid','konflikt','uenighet','kommunikasjon','tone','kollega','tillit','respekt','team','samspill'],
    subtopics: [
      ['Kommunikasjon', 'Misforståelser, tone, utydelige beskjeder eller manglende informasjonsdeling.'],
      ['Tillit', 'Når tidligere hendelser eller opplevelser påvirker samarbeidet.'],
      ['Roller og forventninger', 'Uklare ansvarsområder, ulike forventninger eller behov for avklaringer.'],
      ['Uenighet og konflikt', 'Når motsetninger eller uenigheter har blitt vanskelige å håndtere.'],
      ['Samspill i team', 'Hvordan medarbeidere samarbeider, fordeler oppgaver og påvirker arbeidsmiljøet.'],
      ['Grenser og respekt', 'Situasjoner knyttet til tone, humor, oppførsel eller personlige grenser.']
    ]
  },
  {
    id: 'avslutning-arbeidsforhold',
    title: 'Avslutning av arbeidsforhold',
    iconKey: 'person',
    image: 'topic-avslutning-arbeidsforhold.png',
    imageAlt: 'Alvorlig og profesjonell samtale om avslutning av arbeidsforhold',
    description: 'Støtte til tydelige og respektfulle samtaler når arbeidsforholdet kan være på vei mot en avslutning eller saken krever en mer formell videre prosess.',
    representations: ['Prøvetid og tidligere oppfølging', 'Endrede behov eller rolle', 'Samtale før videre prosess'],
    keywords: ['oppsigelse','slutte','avslutte','prøvetid','arbeidsforhold','avskjed','bemanning','nedbemanning'],
    subtopics: [
      ['Avslutning av arbeidsforhold', 'Samtaler der arbeidsforholdet kan være på vei mot en avslutning.'],
      ['Prøvetid', 'Oppfølging av forventninger, utvikling og vurderinger i prøvetiden.'],
      ['Endringer i stilling eller behov', 'Situasjoner der rolle, oppgaver eller bemanningsbehov endres.'],
      ['Tidligere oppfølging', 'Når medarbeideren allerede har fått tilbakemeldinger, veiledning eller oppfølgingssamtaler.'],
      ['Frivillig avslutning', 'Når medarbeideren selv vurderer å slutte eller ønsker å avslutte arbeidsforholdet.'],
      ['Samtale før videre prosess', 'Når alvorlige forhold må tas opp før saken eventuelt går videre til HR eller formell behandling.']
    ]
  },
  {
    id: 'sikkerhet-ansvar',
    title: 'Sikkerhet og ansvar',
    iconKey: 'warning',
    image: 'topic-sikkerhet-ansvar.png',
    imageAlt: 'Sikkerhetsmøte med planer, sikkerhetsutstyr og tydelig dialog',
    description: 'Støtte til samtaler om sikker praksis, rutiner, risiko, avvik og ansvar – med mål om læring, tydelighet og tryggere arbeid.',
    representations: ['Rutiner og etterlevelse', 'Avvik og hendelser', 'Risiko, ansvar og læring'],
    keywords: ['sikkerhet','avvik','hendelse','rutiner','prosedyre','rapportering','risiko','informasjonssikkerhet','ansvar'],
    subtopics: [
      ['Sikkerhetsrutiner', 'Etterlevelse av prosedyrer, instrukser og etablerte sikkerhetskrav.'],
      ['Avvik og hendelser', 'Når noe har skjedd som bør gjennomgås, følges opp eller læres av.'],
      ['Risikovurdering', 'Når leder og medarbeider har ulik forståelse av risiko eller forsvarlig praksis.'],
      ['Rapportering', 'Når rapportering av hendelser, feil eller avvik trenger oppfølging.'],
      ['Informasjonssikkerhet', 'Håndtering av informasjon, tilgang, deling eller andre sikkerhetsrelaterte forhold.'],
      ['Ansvar og læring etter hendelser', 'Samtaler om hva som skjedde, hva man kan lære og hva som bør endres.']
    ]
  },
  {
    id: 'livssituasjoner',
    title: 'Livssituasjoner',
    iconKey: 'team',
    image: 'topic-livssituasjoner.png',
    imageAlt: 'Omsorgsfull samtale der en medarbeider sitter med hodet bøyd og blir lyttet til',
    description: 'Støtte til omsorgsfulle og profesjonelle samtaler når personlige belastninger, omsorgsansvar, sorg eller andre livssituasjoner påvirker arbeidshverdagen.',
    representations: ['Familie og omsorg', 'Sorg, stress og belastning', 'Støtte og hensiktsmessige grenser'],
    keywords: ['livssituasjon','familie','sorg','omsorg','stress','psykisk','økonomi','privat','utmattelse','belastning'],
    subtopics: [
      ['Samlivs- og familieforhold', 'Samlivsbrudd, krevende familiesituasjoner eller andre forhold hjemme som påvirker arbeidshverdagen.'],
      ['Sykdom i nær familie', 'Når medarbeideren står i omsorgsbelastning eller alvorlig sykdom hos noen nær.'],
      ['Sorg og tap', 'Dødsfall, alvorlige tap eller andre situasjoner som krever særlig omtanke.'],
      ['Psykisk belastning', 'Når medarbeideren selv forteller om stress, uro, nedstemthet eller andre psykiske belastninger.'],
      ['Omsorgsansvar', 'Barn, foreldre eller andre nærstående som krever mye tid og oppfølging.'],
      ['Belastning og utmattelse', 'Søvnproblemer, høyt press eller andre belastninger som påvirker arbeidshverdagen.']
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

function setSvg(targetId, svg) {
  const el = document.querySelector(`#${targetId}`);
  if (el) el.innerHTML = svg;
}

function renderStaticIcons() {
  setSvg('nav-home-icon', svgIcons.home);
  setSvg('nav-prepare-icon', svgIcons.prepare);
  setSvg('nav-settings-icon', svgIcons.settings);
  setSvg('nav-history-icon', svgIcons.history);
  setSvg('sidebar-message-icon', svgIcons.team);
}

function setBreadcrumb(text) {
  document.querySelector('#breadcrumb').textContent = text;
}

function updateNavState(name) {
  document.querySelectorAll('.nav-item[data-view]').forEach(btn => {
    btn.classList.toggle('active',
      (name === 'home' && btn.dataset.view === 'home') ||
      ((name === 'topic' || name === 'guidance') && btn.dataset.view === 'prepare') ||
      (name === 'settings' && btn.dataset.view === 'settings')
    );
  });
}

function showView(name) {
  Object.values(views).forEach(view => view.classList.remove('active-view'));
  views[name].classList.add('active-view');
  updateNavState(name);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


function resetConversationState() {
  currentTopic = null;
  currentSubtopic = null;

  document.querySelectorAll('.topic-card').forEach(card => {
    card.classList.remove('active-card');
    card.hidden = false;
  });

  const search = document.querySelector('#topic-search');
  if (search) search.value = '';

  const detailSearch = document.querySelector('#topic-detail-search');
  if (detailSearch) detailSearch.value = '';

  const subSuggestion = document.querySelector('#subtopic-suggestion');
  if (subSuggestion) {
    subSuggestion.hidden = true;
    subSuggestion.innerHTML = '';
  }

  const suggestion = document.querySelector('#topic-suggestion');
  if (suggestion) {
    suggestion.hidden = true;
    suggestion.innerHTML = '';
  }

  const form = document.querySelector('#situation-form');
  if (form) form.reset();

  const privacy = document.querySelector('#privacy-check');
  if (privacy) {
    privacy.hidden = true;
    privacy.innerHTML = '';
    privacy.className = 'privacy-check';
  }

  const understanding = document.querySelector('#situation-understanding');
  if (understanding) {
    understanding.hidden = true;
    const understandingContent = document.querySelector('#understanding-content');
    if (understandingContent) understandingContent.innerHTML = '';
  }

  const followup = document.querySelector('#followup-panel');
  if (followup) followup.hidden = true;

  const followupQuestions = document.querySelector('#followup-questions');
  if (followupQuestions) followupQuestions.innerHTML = '';

  const result = document.querySelector('#prototype-result');
  if (result) result.hidden = true;

  const guidance = document.querySelector('#structured-guidance');
  if (guidance) guidance.innerHTML = '';
}

function createTopicCard(topic) {
  const button = document.createElement('button');
  button.className = 'topic-card';
  button.dataset.topicId = topic.id;
  button.dataset.searchText = `${topic.title} ${topic.description} ${topic.keywords.join(' ')}`.toLowerCase();
  button.innerHTML = `
    <span class="topic-icon" aria-hidden="true">${svgIcons[topic.iconKey]}</span>
    <strong>${topic.title}</strong>
  `;
  button.addEventListener('click', () => openTopic(topic));
  return button;
}

function renderTopics() {
  const grid = document.querySelector('#topic-grid');
  grid.innerHTML = '';
  topics.forEach(topic => grid.appendChild(createTopicCard(topic)));
}

function highlightTopicCard(topicId) {
  document.querySelectorAll('.topic-card').forEach(card => {
    card.classList.toggle('active-card', card.dataset.topicId === topicId);
  });
}

function openTopic(topic) {
  currentTopic = topic;
  highlightTopicCard(topic.id);
  document.querySelector('#topic-title').textContent = topic.title;
  document.querySelector('#topic-description').textContent = topic.description;
  document.querySelector('#topic-page-icon').innerHTML = svgIcons[topic.iconKey];
  document.querySelector('#topic-representations').innerHTML = topic.representations
    .map(item => `<span class="representation-chip">${item}</span>`).join('');

  const topicHeroImage = document.querySelector('.topic-hero-visual img');
  if (topicHeroImage) {
    topicHeroImage.src = topic.image || 'hero-conversation-exact.png';
    topicHeroImage.alt = topic.imageAlt || `Illustrasjon for temaet ${topic.title}`;
  }

  setBreadcrumb(`Forbered samtale / ${topic.title}`);

  const detailSearch = document.querySelector('#topic-detail-search');
  if (detailSearch) detailSearch.value = '';
  const subSuggestion = document.querySelector('#subtopic-suggestion');
  if (subSuggestion) {
    subSuggestion.hidden = true;
    subSuggestion.innerHTML = '';
  }

  const grid = document.querySelector('#subtopic-grid');
  grid.innerHTML = '';
  topic.subtopics.forEach(([title, help]) => {
    const button = document.createElement('button');
    button.className = 'subtopic-card';
    button.dataset.searchText = `${title} ${help}`.toLowerCase();
    button.innerHTML = `<strong>${title}</strong><p>${help}</p>`;
    button.addEventListener('click', () => openGuidance(title, help));
    grid.appendChild(button);
  });

  showView('topic');
}

function openGuidance(title, help) {
  currentSubtopic = title;
  document.querySelector('#guidance-title').textContent = `${currentTopic.title}: ${title}`;
  document.querySelector('#guidance-help').textContent = help;
  setBreadcrumb(`Forbered samtale / ${currentTopic.title} / ${title}`);
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


function detectConversationThemes(text) {
  const q = text.toLowerCase();
  const scored = topics.map(topic => {
    let score = 0;
    topic.keywords.forEach(keyword => { if (q.includes(keyword)) score += 4; });
    topic.subtopics.forEach(([title, help]) => {
      const hay = `${title} ${help}`.toLowerCase();
      q.split(/\s+/).forEach(word => { if (word.length > 4 && hay.includes(word)) score += 1; });
    });
    return { topic, score };
  }).filter(item => item.score > 0).sort((a,b) => b.score-a.score);
  return scored.slice(0, 3);
}

function buildDilemmaUnderstanding(text) {
  const q = text.toLowerCase();
  const themes = detectConversationThemes(text);
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
    cautions.push('Sykefraværet bør ikke automatisk behandles som bevis på manglende egnethet eller prestasjon. Vurderingen bør bygge på relevante, saklige forhold og kvalitetssikres dersom den kan få arbeidsrettslige konsekvenser.');
  }

  if (!facts.length) facts.push('Jeg har foreløpig bare den situasjonen du selv har beskrevet å bygge på.');
  if (!tensions.length) tensions.push('Målet er å forstå hva som står på spill for deg og medarbeideren før vi går til konkrete formuleringer.');

  return { themes, facts, tensions, unknowns: unknowns.slice(0,3), cautions, special: hasSickLeave && hasPromotion };
}

function analyzeSituation(text) {
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

function renderSituationUnderstanding(analysis) {
  const panel = document.querySelector('#situation-understanding');
  const content = document.querySelector('#understanding-content');
  const confidence = document.querySelector('#understanding-confidence');
  if (!panel || !content || !confidence) return;

  const originalText = document.querySelector('#situation').value.trim();
  const dilemma = buildDilemmaUnderstanding(originalText);
  const themeLabels = dilemma.themes.length
    ? dilemma.themes.map(item => `<span class="representation-chip">${item.topic.title}</span>`).join('')
    : '<span class="representation-chip">Tema ikke låst ennå</span>';

  confidence.textContent = dilemma.special ? 'Flere hensyn' : 'Foreløpig forståelse';
  confidence.dataset.level = dilemma.special ? 'middels' : 'lav';

  const facts = dilemma.facts.map(item => `<li>${item}</li>`).join('');
  const tensions = dilemma.tensions.map(item => `<li>${item}</li>`).join('');
  const unknowns = dilemma.unknowns.length
    ? dilemma.unknowns.map(item => `<li>${item}</li>`).join('')
    : '<li>Jeg ser ingen åpenbar avklaring som må være på plass før vi kan jobbe videre med samtalen.</li>';
  const cautions = dilemma.cautions.length
    ? `<div class="understanding-caution"><strong>Viktig før du bestemmer hvordan samtalen skal tas</strong><ul>${dilemma.cautions.map(item => `<li>${item}</li>`).join('')}</ul></div>`
    : '';

  content.innerHTML = `
    <div class="understanding-block">
      <strong>Dette ser ut til å berøre</strong>
      <div class="topic-representations">${themeLabels}</div>
    </div>
    <div class="understanding-block">
      <strong>Dette har jeg forstått som fakta fra beskrivelsen din</strong>
      <ul>${facts}</ul>
    </div>
    <div class="understanding-block">
      <strong>Selve dilemmaet</strong>
      <ul>${tensions}</ul>
    </div>
    <div class="understanding-block">
      <strong>Det jeg ville avklart før jeg gir et mer konkret råd</strong>
      <ul>${unknowns}</ul>
    </div>
    ${cautions}
  `;
  panel.hidden = false;
}

function buildFollowupQuestions(text) {
  const questions = [];
  const normalized = text.toLowerCase();

  const dilemma = buildDilemmaUnderstanding(text);
  if (dilemma.special) {
    return [
      { id: 'decision', question: 'Er beslutningen om å vente med opprykket allerede tatt, eller vurderer du fortsatt hva som er riktig?', placeholder: 'Beskriv hvor avklart beslutningen er ...' },
      { id: 'criteria', question: 'Hvilke konkrete krav eller forhold ved den nye stillingen gjør at du mener en periode tilbake i arbeid kan være relevant?', placeholder: 'Hold deg til krav i rollen og konkrete forhold ...' },
      { id: 'expectation', question: 'Vet medarbeideren at stillingen tidligere har vært aktuell for hen, eller vil dette komme som ny informasjon?', placeholder: 'Beskriv hva medarbeideren kjenner til ...' }
    ];
  }

  if (currentTopic?.id === 'fravaer-oppfolging') {
    if (!/gang|uke|måned|dag|periode|siden|ofte|gjentatt|fravær|forsink/i.test(normalized)) {
      questions.push({
        id: 'pattern',
        question: 'Hva er mønsteret du ønsker å ta opp – for eksempel hvor ofte, hvor lenge eller i hvilke situasjoner dette skjer?',
        placeholder: 'Eksempel: Fire korte fravær de siste to månedene ...'
      });
    }
    if (!/påvirk|konsekvens|kollega|drift|bemanning|oppgave|lever|frist/i.test(normalized)) {
      questions.push({
        id: 'impact',
        question: 'Hvordan påvirker situasjonen arbeidet, oppgavene, kollegene eller driften?',
        placeholder: 'Beskriv den konkrete virkningen på arbeidssituasjonen ...'
      });
    }
    if (!/snakk|samtal|fulgt opp|tilbakemeld|tidligere|avklart|avtalt/i.test(normalized)) {
      questions.push({
        id: 'previous',
        question: 'Har dette vært tatt opp tidligere, eller er det allerede gjort noen avtaler eller tiltak?',
        placeholder: 'Eksempel: Vi hadde en kort samtale for tre uker siden ...'
      });
    }
    if (!/tilrette|juster|arbeidstid|oppgave|behov|støtte|tiltak/i.test(normalized) && questions.length < 3) {
      questions.push({
        id: 'support',
        question: 'Er det noe ved arbeidssituasjonen eller organiseringen som allerede er kjent og som kan være relevant å følge opp?',
        placeholder: 'Hold deg til det som er relevant for arbeidssituasjonen ...'
      });
    }
    return questions.slice(0, 3);
  }

  if (text.trim().length < 120) questions.push({ id: 'observation', question: 'Hva har du konkret observert eller fått informasjon om?', placeholder: 'Beskriv konkrete hendelser eller observasjoner ...' });
  if (!/gang|uke|måned|dag|tid|siden|ofte|gjentatt|første/i.test(normalized)) questions.push({ id: 'duration', question: 'Hvor lenge har dette pågått, og er det en enkelt hendelse eller et mønster?', placeholder: 'Beskriv varighet eller mønster ...' });
  if (!/påvirk|konsekvens|arbeid|kollega|drift|sikker|oppgave|lever/i.test(normalized)) questions.push({ id: 'impact', question: 'Hvordan påvirker situasjonen arbeidet, kolleger eller driften?', placeholder: 'Beskriv den konkrete virkningen ...' });
  if (!/snakk|samtal|fulgt opp|tilbakemeld|tidligere|avklart/i.test(normalized)) questions.push({ id: 'previous', question: 'Har dette vært tatt opp tidligere, og i så fall hvordan?', placeholder: 'Beskriv eventuell tidligere oppfølging ...' });
  return questions.slice(0, 3);
}

function renderFollowupQuestions(questions) {
  const container = document.querySelector('#followup-questions');
  container.innerHTML = questions.map((item, index) => `
    <label class="followup-question-field">
      <span><strong>${index + 1}.</strong> ${item.question}</span>
      <textarea rows="3" data-followup-id="${item.id}" autocomplete="off" placeholder="${item.placeholder || ''}"></textarea>
    </label>
  `).join('');
}

function collectFollowupAnswers() {
  const answers = {};
  document.querySelectorAll('[data-followup-id]').forEach(field => {
    answers[field.dataset.followupId] = field.value.trim();
  });
  return answers;
}

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

function buildFravaerGuidance(context) {
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

function buildCrossThemeDilemmaGuidance(context) {
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

  return [
    ['Hva dilemmaet egentlig handler om', 'Dette er ikke bare en fraværssamtale. Det handler om hvordan du håndterer en mulig karrieremulighet samtidig som medarbeideren kommer tilbake etter et langt fravær.'],
    ['Forslag til åpning', opening],
    ['Spørsmål du kan bruke', questions.map(q => `• ${q}`).join('<br>')],
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

function renderStructuredGuidance() {
  const context = {
    situation: document.querySelector('#situation').value.trim(),
    helpRequest: document.querySelector('#help-request').value.trim(),
    followups: collectFollowupAnswers()
  };
  const crossThemeSections = buildCrossThemeDilemmaGuidance(context);
  const sections = crossThemeSections || (currentTopic?.id === 'fravaer-oppfolging'
    ? buildFravaerGuidance(context)
    : buildGenericGuidance(context));

  const grid = document.querySelector('#structured-guidance');
  grid.innerHTML = sections.map(([title, content], index) => `
    <article class="guidance-card">
      <span class="guidance-number">${String(index + 1).padStart(2, '0')}</span>
      <div><h3>${title}</h3><p>${content}</p></div>
    </article>
  `).join('');

  const intro = document.querySelector('#result-intro');
  if (intro) {
    if (crossThemeSections) {
      intro.textContent = 'Lokal prototype: denne saken er behandlet som et dilemma som berører flere tema. Ekte KI er ikke koblet til ennå; denne flyten viser hvordan Samtalestøtte skal arbeide som samtalepartner fremfor å tvinge saken inn i én kategori.';
    } else if (currentTopic?.id === 'fravaer-oppfolging') {
      const localAnalysis = analyzeSituation(context.situation + ' ' + Object.values(context.followups || {}).join(' '));
      intro.textContent = `Lokal prototype: rådet er tilpasset mønstre som er gjenkjent som «${localAnalysis.classification}». Ekte KI er ikke koblet til ennå, så vurder om rådet faktisk passer situasjonen.`;
    } else {
      intro.textContent = 'Dette er foreløpig generell prototypelogikk. Ekte KI er ikke koblet til ennå, så vurder om rådet faktisk passer situasjonen.';
    }
  }
}

function showStructuredGuidance() {
  document.querySelector('#followup-panel').hidden = true;
  document.querySelector('#prototype-result').hidden = false;
  renderStructuredGuidance();
  document.querySelector('#prototype-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scoreTopic(topic, query) {
  const q = query.toLowerCase();
  let score = 0;
  topic.keywords.forEach(keyword => {
    if (q.includes(keyword)) score += 5;
  });
  if (q.includes(topic.title.toLowerCase())) score += 6;
  topic.subtopics.forEach(([title, help]) => {
    const haystack = `${title} ${help}`.toLowerCase();
    q.split(/\s+/).forEach(word => {
      if (word.length > 3 && haystack.includes(word)) score += 1;
    });
  });
  return score;
}

function suggestTopics(query) {
  return topics
    .map(topic => ({ topic, score: scoreTopic(topic, query) }))
    .sort((a, b) => b.score - a.score);
}

function renderSuggestion(query) {
  const box = document.querySelector('#topic-suggestion');
  const results = suggestTopics(query.trim());
  const best = results[0];
  box.hidden = false;

  if (!query.trim()) {
    box.innerHTML = '<strong>Skriv litt om situasjonen.</strong><p>Da kan prototypen foreslå hvilket tema som passer best.</p>';
    return;
  }

  if (!best || best.score <= 0) {
    const fallback = topics.slice(0, 3).map(topic => `<button class="ghost-button" type="button" data-topic-id="${topic.id}">${topic.title}</button>`).join('');
    box.innerHTML = `
      <strong>Jeg er usikker på hvilket tema som passer best.</strong>
      <p>Prøv å beskrive situasjonen litt mer konkret, eller velg ett av temaene under.</p>
      <div class="suggestion-actions">${fallback}</div>
    `;
  } else {
    const alternatives = results.slice(1, 3).filter(item => item.score > 0)
      .map(item => `<span class="mini-chip">Alternativ: ${item.topic.title}</span>`).join('');
    box.innerHTML = `
      <strong>Foreslått tema: ${best.topic.title}</strong>
      <p>${best.topic.description}</p>
      <div class="suggestion-actions">
        <button class="primary-button" type="button" id="open-suggested-topic">Åpne tema</button>
        ${alternatives}
      </div>
    `;
    box.querySelector('#open-suggested-topic').addEventListener('click', () => openTopic(best.topic));
  }

  box.querySelectorAll('[data-topic-id]').forEach(button => {
    button.addEventListener('click', () => {
      const topic = topics.find(item => item.id === button.dataset.topicId);
      if (topic) openTopic(topic);
    });
  });
}

function filterTopicCards(query) {
  const normalized = query.trim().toLowerCase();
  const cards = [...document.querySelectorAll('.topic-card')];
  if (!normalized) {
    cards.forEach(card => card.hidden = false);
    return;
  }
  cards.forEach(card => {
    card.hidden = !card.dataset.searchText.includes(normalized);
  });
}


function scoreSubtopic([title, help], query) {
  const q = query.toLowerCase();
  const haystack = `${title} ${help}`.toLowerCase();
  let score = 0;
  q.split(/\s+/).forEach(word => {
    if (word.length > 2 && haystack.includes(word)) score += 2;
  });
  if (q.includes(title.toLowerCase())) score += 5;
  return score;
}

function renderSubtopicSuggestion(query) {
  const box = document.querySelector('#subtopic-suggestion');
  if (!currentTopic || !query.trim()) {
    box.hidden = true;
    box.innerHTML = '';
    return;
  }

  const ranked = currentTopic.subtopics
    .map(subtopic => ({ subtopic, score: scoreSubtopic(subtopic, query) }))
    .sort((a, b) => b.score - a.score);
  const best = ranked[0];
  box.hidden = false;

  if (!best || best.score <= 0) {
    box.innerHTML = `
      <strong>Jeg finner ikke et tydelig treff ennå.</strong>
      <p>Du kan beskrive situasjonen litt mer konkret, eller velge et av eksempelkortene under.</p>
    `;
    return;
  }

  const [title, help] = best.subtopic;
  box.innerHTML = `
    <strong>Foreslått undertema: ${title}</strong>
    <p>${help}</p>
    <div class="suggestion-actions">
      <button class="primary-button" type="button" id="open-suggested-subtopic">Bruk dette undertemaet</button>
    </div>
  `;
  box.querySelector('#open-suggested-subtopic').addEventListener('click', () => openGuidance(title, help));
}

function filterSubtopicCards(query) {
  const normalized = query.trim().toLowerCase();
  document.querySelectorAll('.subtopic-card').forEach(card => {
    card.hidden = normalized ? !card.dataset.searchText.includes(normalized) : false;
  });
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

function setSidebarCollapsed(collapsed) {
  const sidebar = document.querySelector('#sidebar');
  const shell = document.querySelector('.app-shell');
  const toggle = document.querySelector('#sidebar-toggle');
  sidebar.classList.toggle('sidebar-collapsed', collapsed);
  shell.classList.toggle('sidebar-collapsed-layout', collapsed);
  toggle.setAttribute('aria-label', collapsed ? 'Vis sidemeny' : 'Skjul sidemeny');
  toggle.setAttribute('title', collapsed ? 'Vis sidemeny' : 'Skjul sidemeny');
}

function applySidebarState() {
  const collapsed = localStorage.getItem('samtalestotte-sidebar') === 'collapsed';
  setSidebarCollapsed(collapsed);
}

function toggleSidebar() {
  const sidebar = document.querySelector('#sidebar');
  const collapsed = !sidebar.classList.contains('sidebar-collapsed');
  setSidebarCollapsed(collapsed);
  localStorage.setItem('samtalestotte-sidebar', collapsed ? 'collapsed' : 'expanded');
}

renderStaticIcons();
renderTopics();
resetConversationState();
initTheme();
applySidebarState();
setBreadcrumb('');
updateNavState('home');

document.querySelectorAll('[data-theme]').forEach(button => {
  button.addEventListener('click', () => applyTheme(button.dataset.theme));
});

document.querySelectorAll('.nav-item[data-view]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.view === 'home') {
      resetConversationState();
      setBreadcrumb('');
      showView('home');
    }
    if (button.dataset.view === 'prepare') {
      resetConversationState();
      setBreadcrumb('Forbered samtale');
      showView('home');
      setTimeout(() => document.querySelector('#topics').scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
    if (button.dataset.view === 'settings') {
      setBreadcrumb('Innstillinger');
      showView('settings');
    }
  });
});

document.querySelector('#brand-home-button').addEventListener('click', () => {
  resetConversationState();
  setBreadcrumb('');
  showView('home');
});

document.querySelector('#sidebar-toggle').addEventListener('click', toggleSidebar);

document.querySelector('#back-to-home').addEventListener('click', () => {
  resetConversationState();
  setBreadcrumb('');
  showView('home');
});

document.querySelector('#back-to-topic').addEventListener('click', () => {
  if (currentTopic) openTopic(currentTopic);
});

document.querySelector('#back-from-settings').addEventListener('click', () => {
  setBreadcrumb('');
  showView('home');
});

document.querySelector('#topic-finder-form').addEventListener('submit', event => {
  event.preventDefault();
  const value = document.querySelector('#topic-search').value;
  renderSuggestion(value);
  filterTopicCards(value);
});

document.querySelector('#topic-search').addEventListener('input', event => {
  const value = event.target.value;
  const box = document.querySelector('#topic-suggestion');
  filterTopicCards(value);
  if (!value.trim()) {
    box.hidden = true;
    box.innerHTML = '';
  }
});


document.querySelector('#topic-detail-search-form').addEventListener('submit', event => {
  event.preventDefault();
  const value = document.querySelector('#topic-detail-search').value;
  renderSubtopicSuggestion(value);
  filterSubtopicCards(value);
});

document.querySelector('#topic-detail-search').addEventListener('input', event => {
  const value = event.target.value;
  filterSubtopicCards(value);
  if (!value.trim()) {
    const box = document.querySelector('#subtopic-suggestion');
    box.hidden = true;
    box.innerHTML = '';
  }
});

document.querySelector('#situation').addEventListener('input', updatePrivacyCheck);
document.querySelector('#help-request').addEventListener('input', updatePrivacyCheck);

document.querySelector('#situation-form').addEventListener('submit', event => {
  event.preventDefault();
  updatePrivacyCheck();
  const text = document.querySelector('#situation').value;
  const analysis = analyzeSituation(text);
  const questions = buildFollowupQuestions(text);
  document.querySelector('#prototype-result').hidden = true;
  document.querySelector('#followup-panel').hidden = true;

  renderSituationUnderstanding(analysis);

  if (questions.length) {
    renderFollowupQuestions(questions);
    document.querySelector('#followup-panel').hidden = false;
  } else {
    showStructuredGuidance();
  }

  document.querySelector('#situation-understanding').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#generate-guidance').addEventListener('click', showStructuredGuidance);
document.querySelector('#show-guidance-anyway').addEventListener('click', showStructuredGuidance);


window.addEventListener('resize', () => {
  if (!localStorage.getItem('samtalestotte-sidebar')) applySidebarState();
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((localStorage.getItem('samtalestotte-theme') || 'system') === 'system') applyTheme('system');
});


window.addEventListener('pageshow', () => {
  resetConversationState();
  setBreadcrumb('');
  showView('home');
});
