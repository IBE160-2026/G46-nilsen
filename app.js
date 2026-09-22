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
    id: 'sykefravaer',
    title: 'Høyt sykefravær',
    iconKey: 'bed',
    description: 'Fravær, oppmøte, tilbakekomst og tilrettelegging.',
    keywords: ['sykefravær','fravær','sykmelding','borte','oppmøte','for sent','tilrettelegging','tilbakekomst'],
    subtopics: [
      ['Hyppig korttidsfravær', 'Gjentatte korte fraværsperioder eller mønstre som gir grunnlag for en oppfølgingssamtale.'],
      ['Langvarig fravær', 'Når en medarbeider har vært borte over tid og trenger oppfølging før videre planlegging.'],
      ['Oppmøte og punktlighet', 'Forsinkelser, ustabilt oppmøte eller manglende forutsigbarhet i arbeidshverdagen.'],
      ['Tilbakekomst til jobb', 'Samtaler før eller etter retur til arbeid, og behov for tydelige forventninger.'],
      ['Tilrettelegging', 'Behov for tilpasninger i arbeidstid, oppgaver eller oppfølging.']
    ]
  },
  {
    id: 'arbeidsutforelse',
    title: 'Manglende arbeidsutførelse',
    iconKey: 'list',
    description: 'Prestasjon, kvalitet, ansvar og oppfølging.',
    keywords: ['prestasjon','leveranse','kvalitet','arbeidsutførelse','ansvar','oppgaver','frist','resultat','manglende'],
    subtopics: [
      ['Kvalitet i arbeidet', 'Når kvalitet eller nøyaktighet i arbeidet ikke er som forventet.'],
      ['Frister og leveranser', 'Manglende leveranser, forsinkelser eller behov for tydeligere prioriteringer.'],
      ['Motivasjon og innsats', 'Når engasjement eller arbeidsinnsats har endret seg.'],
      ['Kompetanse og mestring', 'Når manglende opplæring eller ferdigheter kan være en del av forklaringen.'],
      ['Tidligere tilbakemeldinger', 'Når temaet har vært tatt opp før og må følges videre opp.']
    ]
  },
  {
    id: 'kritiske-feil',
    title: 'Kritiske feil',
    iconKey: 'warning',
    description: 'Feil, avvik, konsekvenser og læring.',
    keywords: ['feil','kritisk','avvik','hendelse','brudd','mistake','glipp','konsekvens'],
    subtopics: [
      ['Alvorlig enkelthendelse', 'Når det har skjedd en konkret feil som krever rask og tydelig oppfølging.'],
      ['Gjentatte feil', 'Når lignende feil skjer flere ganger og må adresseres i en samtale.'],
      ['Konsekvenser for drift', 'Når feil påvirker drift, kvalitet eller tillit.'],
      ['Ansvar og læring', 'Hvordan man kan snakke om ansvar uten å miste læringsperspektivet.'],
      ['Videre oppfølging', 'Hva som må avklares videre etter samtalen.']
    ]
  },
  {
    id: 'rus-alkohol',
    title: 'Rus / alkohol',
    iconKey: 'bottle',
    description: 'Bekymring, påvirkning, sikkerhet og oppfølging.',
    keywords: ['rus','alkohol','påvirket','beruset','stoff','narkotika','drikking'],
    subtopics: [
      ['Bekymring knyttet til alkohol', 'Observasjoner eller forhold som gir grunn til å være bekymret.'],
      ['Påvirkning på jobb', 'Situasjoner der en medarbeider kan fremstå påvirket på jobb.'],
      ['Sikkerhet og hendelser', 'Når rus eller alkohol kan ha hatt betydning for en hendelse eller risiko.'],
      ['Bekymring meldt av andre', 'Når kolleger eller andre har sagt fra om noe de reagerer på.'],
      ['Oppfølging og tilbakekomst', 'Når samtalen gjelder videre støtte og oppfølging.']
    ]
  },
  {
    id: 'konflikt-samarbeid',
    title: 'Konflikt og samarbeid',
    iconKey: 'people',
    description: 'Kommunikasjon, samspill, tillit og uenighet.',
    keywords: ['konflikt','samarbeid','uenighet','kollega','kommunikasjon','team','tone','respekt'],
    subtopics: [
      ['Kommunikasjon', 'Misforståelser, tone eller utydelig kommunikasjon.'],
      ['Tillitsbrudd', 'Når tillit mellom personer eller i teamet er svekket.'],
      ['Uenighet i team', 'Når motsetninger eller samarbeidsproblemer påvirker arbeidsmiljøet.'],
      ['Grenser og respekt', 'Oppførsel eller samspill som oppleves som problematisk.'],
      ['Videre prosess', 'Hvordan forberede en konstruktiv samtale om veien videre.']
    ]
  },
  {
    id: 'hygiene-bekledning',
    title: 'Hygiene og bekledning',
    iconKey: 'shirt',
    description: 'Profesjonalitet, krav og ivaretakelse.',
    keywords: ['hygiene','bekledning','uniform','lukt','renhold','klær'],
    subtopics: [
      ['Personlig hygiene', 'Hvordan ta opp hygiene på en respektfull og tydelig måte.'],
      ['Arbeidstøy og bekledning', 'Når bekledning ikke er i tråd med forventninger eller krav.'],
      ['Sikkerhetsrelaterte krav', 'Bekledning eller utstyr som har betydning for sikkerhet.'],
      ['Gjennomføring av samtalen', 'Hvordan balansere hensyn til verdighet, tydelighet og saklighet.']
    ]
  },
  {
    id: 'personlige-utfordringer',
    title: 'Personlige utfordringer',
    iconKey: 'person',
    description: 'Livssituasjoner, belastning og støttebehov.',
    keywords: ['personlige','privat','familie','sorg','stress','økonomi','psykisk','belastning','utfordringer'],
    subtopics: [
      ['Familie eller omsorg', 'Når situasjonen hjemme påvirker arbeidshverdagen.'],
      ['Sorg og tap', 'Når medarbeideren står i en vanskelig periode og trenger støtte.'],
      ['Stress og utmattelse', 'Belastninger som påvirker kapasitet eller fungering.'],
      ['Behov for støtte', 'Hvordan møte personlige utfordringer på en profesjonell måte.'],
      ['Grenser for lederrollen', 'Hva som er hensiktsmessig å gjøre som leder og hva som bør kobles videre.']
    ]
  },
  {
    id: 'lonn-forfremmelse',
    title: 'Lønn / forfremmelse',
    iconKey: 'coins',
    description: 'Forventninger, utvikling og ansvar.',
    keywords: ['lønn','forfremmelse','lønnsøkning','lønnsutvikling','ansvarstillegg','kompensasjon'],
    subtopics: [
      ['Forventninger til lønn', 'Når medarbeiderens forventninger må avklares tydelig og respektfullt.'],
      ['Nye oppgaver og ansvar', 'Samtaler om ansvar, rolleutvidelse og forventninger.'],
      ['Lønnsutvikling', 'Hvordan forberede en ryddig samtale om lønnsutvikling over tid.'],
      ['Forfremmelse eller utvikling', 'Samtaler om hva som kreves videre for å utvikle seg i rollen.']
    ]
  },
  {
    id: 'opplevd-urettferdighet',
    title: 'Opplevd urettferdighet',
    iconKey: 'scales',
    description: 'Forskjellsbehandling, opplevelser og avklaring.',
    keywords: ['urettferdig','urettferdighet','behandling','forskjellsbehandling','favorisering'],
    subtopics: [
      ['Fordeling av oppgaver', 'Når arbeidsbelastning eller oppgaver oppleves skjevt fordelt.'],
      ['Beslutninger og prioriteringer', 'Når medarbeideren reagerer på en avgjørelse eller vurdering.'],
      ['Sammenligning med andre', 'Når forskjeller mellom medarbeidere blir tema.'],
      ['Behov for avklaring', 'Hvordan møte opplevelsen på en rolig og respektfull måte.']
    ]
  },
  {
    id: 'annet',
    title: 'Annet',
    iconKey: 'more',
    description: 'Når situasjonen ikke passer naturlig inn i de andre valgene.',
    keywords: ['annet','usikker','diverse','ulikt'],
    subtopics: [
      ['Usikker på kategori', 'Når du trenger hjelp til å sortere hva samtalen egentlig handler om.'],
      ['Sammensatt situasjon', 'Når flere forhold spiller inn samtidig.'],
      ['Behov for generell samtalestøtte', 'Når du ønsker strukturert hjelp uten å låse deg til ett bestemt tema.']
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
  setSvg('crumb-home-icon', svgIcons.home);
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

function createTopicCard(topic) {
  const button = document.createElement('button');
  button.className = 'topic-card';
  button.dataset.topicId = topic.id;
  button.dataset.searchText = `${topic.title} ${topic.description} ${topic.keywords.join(' ')}`.toLowerCase();
  button.innerHTML = `
    <span class="topic-icon" aria-hidden="true">${svgIcons[topic.iconKey]}</span>
    <strong>${topic.title}</strong>
    <span class="card-arrow" aria-hidden="true">→</span>
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
  setBreadcrumb(`Forbered samtale / ${topic.title}`);

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
initTheme();
applySidebarState();
setBreadcrumb('Hjem');
updateNavState('home');

document.querySelectorAll('[data-theme]').forEach(button => {
  button.addEventListener('click', () => applyTheme(button.dataset.theme));
});

document.querySelectorAll('.nav-item[data-view]').forEach(button => {
  button.addEventListener('click', () => {
    if (button.dataset.view === 'home') {
      setBreadcrumb('Hjem');
      showView('home');
    }
    if (button.dataset.view === 'prepare') {
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
  setBreadcrumb('Hjem');
  showView('home');
});

document.querySelector('#sidebar-toggle').addEventListener('click', toggleSidebar);

document.querySelector('#back-to-home').addEventListener('click', () => {
  setBreadcrumb('Hjem');
  showView('home');
});

document.querySelector('#back-to-topic').addEventListener('click', () => {
  if (currentTopic) openTopic(currentTopic);
});

document.querySelector('#back-from-settings').addEventListener('click', () => {
  setBreadcrumb('Hjem');
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
