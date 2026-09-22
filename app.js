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
    id: 'naervaer-oppfolging',
    title: 'Nærvær og oppfølging',
    iconKey: 'bed',
    image: 'topic-naervaer-oppfolging.png',
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
