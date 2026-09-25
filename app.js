const svgIcons = {
  home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10.5V20h13V10.5"></path></svg>`,
  prepare: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.5h8"></path><path d="M8 8.5h8"></path><path d="M8 12.5h8"></path><path d="M8 16.5h5"></path><path d="M6 3.5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z"></path></svg>`,
  history: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v5l3 2"></path><path d="M12 21a9 9 0 1 0-9-9"></path></svg>`,
  settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"></path><path d="m19.4 15 .8 1.4-1.6 2.8-1.7-.4a7.9 7.9 0 0 1-1.8 1l-.4 1.7H9.3l-.4-1.7a7.9 7.9 0 0 1-1.8-1l-1.7.4-1.6-2.8.8-1.4a8.5 8.5 0 0 1 0-2l-.8-1.4 1.6-2.8 1.7.4a7.9 7.9 0 0 1 1.8-1l.4-1.7h3.4l.4 1.7a7.9 7.9 0 0 1 1.8 1l1.7-.4 1.6 2.8-.8 1.4a8.5 8.5 0 0 1 0 2Z"></path></svg>`,
  about: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 10.5V17"></path><path d="M12 7h.01"></path></svg>`,
  contact: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v13H4z"></path><path d="m4.5 6 7.5 6 7.5-6"></path></svg>`,
  simulation: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h11a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"></path><path d="M8 9h6M8 12h4"></path></svg>`,
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
  glassOff: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10l-1.4 7.2A3.7 3.7 0 0 1 12 14.2a3.7 3.7 0 0 1-3.6-3L7 4Z"></path><path d="M12 14.2V20"></path><path d="M8.5 20h7"></path><path d="M4 4l16 16"></path></svg>`,
  calendarClock: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="14" height="14" rx="2"></rect><path d="M7 3.5v4M14 3.5v4M3.5 9.5h14"></path><circle cx="17.5" cy="16.5" r="4"></circle><path d="M17.5 14.3v2.4l1.5 1"></path></svg>`,
  trendUp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16"></path><path d="m7 15 4-4 3 2 5-6"></path><path d="M15.5 7H19v3.5"></path></svg>`,
  coinsUp: `<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="8" cy="15.5" rx="4" ry="2"></ellipse><path d="M4 15.5v3c0 1.1 1.8 2 4 2s4-.9 4-2v-3"></path><path d="M13 12l5-5"></path><path d="M14.5 7H18v3.5"></path></svg>`,
  chatPeople: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="2.5"></circle><circle cx="16" cy="8" r="2.5"></circle><path d="M3.5 16c.5-2.2 2.2-3.5 4.5-3.5 1.1 0 2.1.3 2.8.8M20.5 16c-.5-2.2-2.2-3.5-4.5-3.5-1.1 0-2.1.3-2.8.8"></path><path d="M8 17.5h8l2.5-2.2V20H8z"></path></svg>`,
  exitDoor: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 20V4h9v16"></path><path d="M10 12h10"></path><path d="m17 9 3 3-3 3"></path></svg>`,
  shieldCheck: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 19 6v5.2c0 4.3-2.8 7.5-7 9.3-4.2-1.8-7-5-7-9.3V6l7-2.5Z"></path><path d="m8.5 12 2.2 2.2 4.8-5"></path></svg>`,
  homeHeart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10.5V20h13v-9.5"></path><path d="M12 17s-3-1.8-3-4a1.8 1.8 0 0 1 3-1.3 1.8 1.8 0 0 1 3 1.3c0 2.2-3 4-3 4Z"></path></svg>`,
  more: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h.01"></path><path d="M12 12h.01"></path><path d="M18 12h.01"></path></svg>`
};

let lastAiAnalysis = null;
let lastAiGuidance = null;
let currentUser = null;
let currentConversationId = null;
let conversationDirty = false;
let pendingSituationText = '';
let simulationFidelity = "factual";
let simulationMode = "solo";
let simulationStyle = "open";
let simulationTurns = [];
let simulationFeedback = null;
let simulationSource = "current";
let simulationDirectSituation = "";
let legalReturnView = "home";
let infoReturnView = "home";
let publicConfig = { appVersion: "19.11.0", contactEmail: "cecilie.c.nilsen@himolde.no" };

const topics = [
  {
    id: 'alkohol-rus',
    title: 'Alkohol og rus',
    iconKey: 'glassOff',
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
    iconKey: 'calendarClock',
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
    iconKey: 'trendUp',
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
    iconKey: 'coinsUp',
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
    iconKey: 'chatPeople',
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
    iconKey: 'exitDoor',
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
    iconKey: 'shieldCheck',
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
    iconKey: 'homeHeart',
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
  simulation: document.querySelector('#simulation-view'),
  settings: document.querySelector('#settings-view'),
  history: document.querySelector('#history-view'),
  privacy: document.querySelector('#privacy-view'),
  terms: document.querySelector('#terms-view'),
  about: document.querySelector('#about-view'),
  contact: document.querySelector('#contact-view')
};

function setSvg(targetId, svg) {
  const el = document.querySelector(`#${targetId}`);
  if (el) el.innerHTML = svg;
}

function renderStaticIcons() {
  setSvg('nav-home-icon', svgIcons.home);
  setSvg('nav-prepare-icon', svgIcons.simulation);
  setSvg('nav-settings-icon', svgIcons.settings);
  setSvg('nav-history-icon', svgIcons.history);
  setSvg('nav-about-icon', svgIcons.about);
  setSvg('nav-contact-icon', svgIcons.contact);
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
      (name === 'simulation' && btn.dataset.view === 'simulation') ||
      (name === 'settings' && btn.dataset.view === 'settings') ||
      (name === 'history' && btn.dataset.view === 'history') ||
      (name === 'about' && btn.dataset.view === 'about') ||
      (name === 'contact' && btn.dataset.view === 'contact')
    );
  });
}

function showView(name) {
  Object.values(views).forEach(view => view.classList.remove('active-view'));
  views[name].classList.add('active-view');
  updateNavState(name);
  const topNew = document.querySelector('#new-conversation-button');
  if (topNew) topNew.hidden = name === 'home';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


function clearGuidanceSession({ clearInputs = true } = {}) {
  lastAiAnalysis = null;
  lastAiGuidance = null;
  if (clearInputs) { currentConversationId = null; conversationDirty = false; }
  if (clearInputs) {
    const form = document.querySelector('#situation-form');
    if (form) {
      form.reset();
      form.querySelectorAll('textarea, input').forEach(field => {
        if (field.type !== 'checkbox' && field.type !== 'radio') field.value = '';
      });
    }
  }

  const privacy = document.querySelector('#privacy-check');
  if (privacy) {
    privacy.hidden = true;
    privacy.innerHTML = '';
    privacy.className = 'privacy-check';
  }

  const understanding = document.querySelector('#situation-understanding');
  if (understanding) understanding.hidden = true;
  const understandingContent = document.querySelector('#understanding-content');
  if (understandingContent) understandingContent.innerHTML = '';

  const followup = document.querySelector('#followup-panel');
  if (followup) followup.hidden = true;
  const followupQuestions = document.querySelector('#followup-questions');
  if (followupQuestions) followupQuestions.innerHTML = '';

  const result = document.querySelector('#prototype-result');
  if (result) result.hidden = true;
  const guidance = document.querySelector('#structured-guidance');
  if (guidance) guidance.innerHTML = '';

  const thread = document.querySelector('#conversation-thread');
  if (thread) thread.innerHTML = '';
  const continueInput = document.querySelector('#continue-input');
  if (continueInput) continueInput.value = '';

  simulationTurns = [];
  simulationFeedback = null;
  simulationFidelity = 'factual';
  simulationMode = 'solo';
  simulationStyle = 'open';
  simulationSource = 'current';
  simulationDirectSituation = '';
  const simPanel = document.querySelector('#simulation-panel');
  const simSetup = document.querySelector('#simulation-setup');
  const simLive = document.querySelector('#simulation-live');
  const simFeedback = document.querySelector('#simulation-feedback');
  if (simPanel) simPanel.hidden = true;
  if (simSetup) simSetup.hidden = false;
  if (simLive) simLive.hidden = true;
  if (simFeedback) simFeedback.hidden = true;
  const simThread = document.querySelector('#simulation-thread');
  if (simThread) simThread.innerHTML = '<div class="simulation-coach-note">Du starter samtalen. Skriv det du faktisk ville sagt til medarbeideren.</div>';
  const simInput = document.querySelector('#simulation-input');
  if (simInput) simInput.value = '';
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
  if (detailSearch) detailSearch.value = carriedSituation;

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

  ['#topic-finder-privacy', '#topic-detail-privacy'].forEach(selector => {
    const box = document.querySelector(selector);
    if (box) {
      box.hidden = true;
      box.innerHTML = '';
      box.className = 'privacy-check finder-privacy-check';
    }
  });
  hideAutoTopicNote();

  clearGuidanceSession({ clearInputs: true });
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

function openTopic(topic, preservedSituation = '') {
  currentTopic = topic;
  const carriedSituation = String(preservedSituation || pendingSituationText || document.querySelector('#topic-search')?.value || '').trim();
  if (carriedSituation) pendingSituationText = carriedSituation;
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
  if (detailSearch) detailSearch.value = carriedSituation;
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
    button.addEventListener('click', () => openGuidance(title, help, carriedSituation));
    grid.appendChild(button);
  });

  showView('topic');
}

function openGuidance(title, help, initialSituation = '') {
  hideAutoTopicNote();
  const carriedSituation = String(initialSituation || pendingSituationText || '').trim();
  if (carriedSituation) pendingSituationText = carriedSituation;
  currentSubtopic = title;
  document.querySelector('#guidance-title').textContent = `${currentTopic.title}: ${title}`;
  document.querySelector('#guidance-help').textContent = help;
  setBreadcrumb(`Forbered samtale / ${currentTopic.title} / ${title}`);
  clearGuidanceSession({ clearInputs: true });
  const situationField = document.querySelector('#situation');
  if (situationField && carriedSituation) {
    situationField.value = carriedSituation;
    autoGrowTextarea(situationField, 220);
    requestAnimationFrame(() => {
      situationField.focus();
    });
  }
  updatePrivacyCheck();
  showView('guidance');
}

function openGuidanceFromSuggestion(topic, subtopic, originalQuery = '') {
  currentTopic = topic;
  highlightTopicCard(topic.id);
  openGuidance(subtopic[0], subtopic[1], originalQuery);
}


const COMMON_GIVEN_NAMES = new Set(`
Kine Gro Reidun Cecilie Trude Kari Karianne Karina Karoline Kristin Kristine Kristina Anne Anna Annika Anette Anita Ingrid Inger Ida Ine Irene Iselin Hege Hilde Hanne Hanna Helene Henriette Silje Sigrid Synne Siri Sofie Sofia Sara Sarah Emma Emilie Amalie Thea Nora Mia Maja Maya Leah Lea Julie Julia Jenny Josefine Frida Frøya Live Linn Linda Lene Lena Line Lisa Lise Liv Lillian Marianne Maria Marie Marit Marte Martine Mathilde Monica Mona Nina Oda Ragnhild Rikke Silja Solveig Stine Tine Tonje Trine Tuva Victoria Viktoria Åse Åshild Bente Berit Britt Brit Gerd Grete Gry Jorunn Jorun Randi Rita Siv Sissel Tone Torill Tove Unni Vigdis Wenche Åsebjørg Elisabeth Elise Ellen Eva Else Gunn Gunhild Ingeborg Kjersti Merete Mette Renate Solfrid Therese Trude Vibeke
Anders Andreas André Arne Asbjørn Benjamin Bjørn Christian Kristian Christoffer Christopher Daniel David Eirik Erik Espen Even Fredrik Frederik Frode Geir Gunnar Håkon Hans Henrik Jan Jens Joachim Johannes John Jonas Jonathan Jørgen Karl Kenneth Kim Knut Lars Mads Magnus Martin Mathias Mats Morten Nils Ole Pål Per Petter Robert Roger Rune Simen Sindre Stian Thomas Tobias Tommy Tor Trond Vegard Vidar Øivind Øystein Alf Arild Bjarne Dag Einar Erlend Finn Frank Harald Helge Ivar Kjell Kjetil Leif Magne Odd Ove Roar Roy Steinar Svein Terje Tom Tommy Trygve
Aisha Ayesha Fatima Fatma Layla Leila Laila Noor Nour Yasmin Yasmine Zainab Maryam Mariam Amira Samira Nadia Nadiya Hana Huda Rania Salma Sara Omar Ahmed Ahmad Ali Amir Bilal Hassan Hasan Hussein Ibrahim Ismail Khalid Mohammed Mohammad Mohamed Mustafa Yusuf Youssef Adam
Alejandro Carlos Diego Eduardo Fernando Francisco Javier Jorge José Jose Juan Luis Manuel Miguel Pablo Pedro Ricardo Roberto Santiago Sofia Camila Valentina Isabella Gabriela Daniela Mariana Lucia Lucía Elena Carmen Ana María Maria
Giulia Giorgia Francesca Alessandra Martina Chiara Federica Marco Luca Matteo Lorenzo Alessandro Andrea Giovanni Giuseppe Antonio Stefano Davide
Chloe Chloé Emily Olivia Amelia Charlotte Sophie Jessica Rebecca Rachel Megan Lauren Hannah Grace Alice Lucy Eleanor George James William Harry Oliver Jack Charlie Thomas Edward Henry Samuel Alexander Daniel Michael Matthew Joshua
Emma Sophie Anna Lena Laura Julia Sarah Lisa Katharina Hannah Marie Johanna Lea Leon Lukas Luca Finn Felix Paul Jonas Elias Noah Ben Benjamin Maximilian Alexander Niklas
Élodie Camille Manon Juliette Claire Pauline Amélie Cécile Celine Céline Lucie Margaux Louise Marie Jean Pierre Julien Nicolas Antoine François Philippe Alexandre Thomas
Agnieszka Katarzyna Anna Ewa Joanna Magdalena Natalia Aleksandra Marta Piotr Jakub Mateusz Michał Michal Tomasz Krzysztof Paweł Pawel Łukasz Lukasz
Anastasia Ekaterina Elena Irina Natalia Olga Svetlana Tatiana Ivan Dmitri Dmitry Alexei Sergey Sergei Nikolai Mikhail
Priya Pooja Anjali Neha Aditi Riya Kavya Aarav Arjun Rahul Rohit Vikram Raj Amit Anil Deepak Sanjay
Wei Li Ming Jun Chen Ling Mei Xia Yu Yuki Haruka Sakura Aiko Mei Kenji Hiroshi Takashi Akira Satoshi Minjun Jihoon Jisoo Seojun Hyunwoo Minji Yuna
Nguyen Minh Linh Lan Anh Trang Huy Phuong Phương Mai Tuan Tuấn
Kwame Kofi Ama Akosua Chinedu Ngozi Adaeze Amina Nia Zuri Tendai Thabo Sipho Lerato
`.split(/\s+/).filter(Boolean).map(n => n.toLocaleLowerCase('nb-NO')));

const NAME_FALSE_POSITIVES = new Set(`
Jeg Vi Det Den Dette En Et Når Hvis På I Som Med Men Og Eller For Til Fra Av Etter Før Under Over Ikke Ja Nei Usikker
Person Personen Vedkommende Hen Medarbeideren Medarbeider Kollegaen Kollega Lederen Leder Arbeidsgiver Arbeidstaker Ansatt Ansatte Teamet Team HR NAV BHT
Fravær Sykefravær Sykmelding Arbeid Arbeidet Stillingen Samtalen Situasjonen Oppfølging Tilrettelegging Mandag Tirsdag Onsdag Torsdag Fredag Lørdag Søndag Januar Februar Mars April Mai Juni Juli August September Oktober November Desember
`.split(/\s+/).filter(Boolean).map(n => n.toLocaleLowerCase('nb-NO')));

// Fornavn som også kan være vanlige ord i arbeidsrelatert tekst.
// Disse krever tydelig personkontekst dersom de er skrevet med liten bokstav.
const AMBIGUOUS_GIVEN_NAMES = new Set(`
per liv live line ben even
`.split(/\s+/).filter(Boolean));

function normalizeNameToken(value) {
  return String(value || '').toLocaleLowerCase('nb-NO');
}

function isKnownGivenName(value) {
  const normalized = normalizeNameToken(value);
  return COMMON_GIVEN_NAMES.has(normalized) && !NAME_FALSE_POSITIVES.has(normalized);
}

function findLikelyGivenName(source) {
  const text = String(source || '');

  // 1. Eksplisitte navneformuleringer er sterke signaler og skal virke uavhengig av stor/liten bokstav.
  // Eksempel: "han heter knut", "navnet er Cecilie".
  const explicit = text.match(/\b(?:heter|navn(?:et)?\s+er|kalles|medarbeider(?:en)?\s+heter|kollega(?:en)?\s+heter|leder(?:en)?\s+heter)\s+([\p{L}][\p{L}'’-]{1,30})\b/iu);
  if (explicit) {
    const normalized = normalizeNameToken(explicit[1]);
    if (!NAME_FALSE_POSITIVES.has(normalized)) return explicit[1];
  }

  // 2. Kjente navn fra navnelisten fanges case-insensitivt, også "knut" med liten k.
  // Ambivalente ord som "per" og "liv" krever ekstra personkontekst.
  const tokens = text.match(/\b[\p{L}][\p{L}'’-]{1,30}\b/gu) || [];
  for (const token of tokens) {
    const normalized = normalizeNameToken(token);
    if (!isKnownGivenName(token)) continue;
    if (!AMBIGUOUS_GIVEN_NAMES.has(normalized)) return token;

    const escaped = token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const personUse = new RegExp(`(?:\\b(?:heter|med|til|fra|hos|snakket\\s+med|møte\\s+med)\\s+${escaped}\\b|\\b${escaped}\\s+(?:har|hadde|er|var|ble|blir|skal|vil|kan|må|sier|sa|jobber|møter|kommer|ønsker|mener)\\b)`, 'iu');
    if (personUse.test(text)) return token;
  }

  // 3. Ukjente navn kan fortsatt oppdages i tydelig personkontekst, men vi bruker ikke
  // "stor bokstav ved setningsstart" som signal alene. Det var årsaken til at "Personen" ble flagget.
  const personContext = text.match(/\b(?:med|til|fra|hos|snakket\s+med|møte\s+med)\s+([\p{Lu}][\p{L}'’-]{1,30})(?=\s+(?:har|hadde|er|var|ble|blir|skal|vil|kan|må|sier|sa|jobber|møter|kommer|ønsker|mener)\b)/u);
  if (personContext && !NAME_FALSE_POSITIVES.has(normalizeNameToken(personContext[1]))) return personContext[1];

  // 4. To navn med stor forbokstav ved siden av hverandre er et sterkt signal om fullt navn.
  // Begge ordene må enten finnes i navnelisten, eller minst ett må være et kjent fornavn.
  const fullName = text.match(/\b([\p{Lu}][\p{L}'’-]{1,30})\s+([\p{Lu}][\p{L}'’-]{1,30})\b/u);
  if (fullName) {
    const a = normalizeNameToken(fullName[1]);
    const b = normalizeNameToken(fullName[2]);
    if (!NAME_FALSE_POSITIVES.has(a) && !NAME_FALSE_POSITIVES.has(b) && (isKnownGivenName(fullName[1]) || isKnownGivenName(fullName[2]))) {
      return `${fullName[1]} ${fullName[2]}`;
    }
  }

  // 5. Ekstra lokal kontekstsjekk for navn skrevet med små bokstaver.
  // Vi sender ikke teksten til ekstern KI for å avgjøre dette, fordi personvernkontrollen skal skje før KI-kallet.
  // Kandidaten må stå i en tydelig personsetning, og vanlige arbeidsord filtreres bort.
  const contextualNonNames = new Set(`
  situasjonen samtalen medarbeider medarbeideren kollega kollegaen leder lederen person personen team teamet
  arbeidet arbeid stilling stillingen fravær sykefravær oppfølging utvikling prestasjon lønn samarbeid sikkerhet ansvar
  mandag tirsdag onsdag torsdag fredag lørdag søndag uke uken måned måneden dag dagen år tiden perioden
  dette det den en et jeg vi du de hen han hun noen ingen alle flere mye lite kanskje derfor fordi dersom
  `.split(/\s+/).filter(Boolean));
  const contextualPattern = /(?:^|[.!?]\s+|\b(?:med|til|fra|hos|om)\s+)([\p{L}][\p{L}'’-]{2,30})\s+(?:er|var|har|hadde|ble|blir|skal|vil|kan|må|sier|sa|jobber|arbeider|ønsker|mener|kommer|møter|trenger|opplever)\b/giu;
  for (const match of text.matchAll(contextualPattern)) {
    const candidate = match[1];
    const normalized = normalizeNameToken(candidate);
    if (NAME_FALSE_POSITIVES.has(normalized) || contextualNonNames.has(normalized)) continue;
    if (isKnownGivenName(candidate)) return candidate;
    // Ukjente småbokstav-kandidater flagges bare etter en sterk relasjonspreposisjon, ikke bare fordi et vanlig ord står først i en setning.
    if (/^(?:med|til|fra|hos|om)\s+/iu.test(match[0]) && /^[\p{L}]{3,16}$/u.test(candidate)) return candidate;
  }

  return null;
}

function detectSensitiveInfo(text) {
  const findings = [];
  const source = text || '';
  const add = (type, label, message) => {
    if (!findings.some(item => item.type === type)) findings.push({ type, label, message });
  };

  if (/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/i.test(source)) {
    add('email', 'E-postadresse', 'Fjern e-postadresse og beskriv personen med rolle i stedet.');
  }
  if (/(?:\+47\s?)?(?:\d[\s-]?){8}\b/.test(source)) {
    add('phone', 'Telefonnummer', 'Fjern telefonnummeret før du sender teksten.');
  }
  if (/\b(?:\d{1,2}[.\/-]\d{1,2}[.\/-](?:19|20)?\d{2})\b/.test(source) || /\b(?:født|fødselsdato)\s+(?:i\s+)?(?:19|20)\d{2}\b/i.test(source)) {
    add('birthdate', 'Fødselsdato eller fødselsår', 'Fjern fødselsdato eller fødselsår.');
  }
  if (/\b(?:[1-9]|[1-9]\d|1[01]\d|120)\s*år(?:\s+gammel)?\b/i.test(source)) {
    add('age', 'Alder', 'Fjern konkret alder. Skriv heller bare det som er relevant for arbeidssituasjonen.');
  }
  if (/\b(?:fødselsnummer|personnummer|ansattnummer|ansattnr\.?|employee\s*id)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/i.test(source) || /\b\d{11}\b/.test(source)) {
    add('identifier', 'Person- eller ansattnummer', 'Fjern identifikasjonsnummer før teksten sendes.');
  }
  // Kombinasjoner av indirekte personopplysninger kan gjøre en medarbeider gjenkjennelig.
  const familyAgeCombo = /\b(?:har|med|til)\s+(?:(?:ett|to|tre|fire|fem|seks|\d+)\s+)?(?:barn|datter|døtre|sønn|sønner|gutt|gutter|jente|jenter)\b[^.!?]{0,55}\b(?:på\s+)?\d{1,2}(?:\s*(?:,|og)\s*\d{1,2})+(?:\s*år)?\b/iu;
  const singleChildAge = /\b(?:barn|datter|sønn|gutt|jente)\s+(?:som\s+er\s+|på\s+)\d{1,2}\s*år\b/iu;
  const soloParentAge = /\b(?:alenemor|alenefar|enslig\s+(?:mor|far))\b[^.!?]{0,60}\b(?:barn|datter|sønn|gutt|jente)\b[^.!?]{0,35}\b\d{1,2}\b/iu;
  const householdCombo = /\b(?:bor|lever)\s+med\s+(?:mannen|kona|ektefellen|samboeren|partneren)\b[^.!?]{0,70}\b(?:barn|datter|døtre|sønn|sønner)\b/iu;
  const pregnancyDetail = /\bgravid\b[^.!?]{0,30}\b(?:uke|svangerskapsuke)\s*\d{1,2}\b/iu;
  const uniquenessCombo = /\b(?:den\s+eneste|en\s+av\s+(?:to|tre|fire|\d+))\b[^.!?]{0,70}\b(?:ansatt(?:e|en)?|medarbeider(?:e|en)?|leder(?:e|en)?|ingeniør(?:er|en)?|sykepleier(?:e|en)?|lærer(?:e|en)?|rådgiver(?:e|en)?|tekniker(?:e|en)?|operatør(?:er|en)?|elektriker(?:e|en)?|lege(?:r|n)?|psykolog(?:er|en)?|jurist(?:er|en)?)\b/iu;
  if (familyAgeCombo.test(source) || singleChildAge.test(source) || soloParentAge.test(source) || householdCombo.test(source)) {
    add('family_details', 'Detaljerte familieopplysninger', 'Generaliser familieforhold, antall, kjønn og eksakte aldre slik at personen ikke blir lett gjenkjennelig.');
  }
  if (pregnancyDetail.test(source)) {
    add('pregnancy_detail', 'Detaljert livsfaseopplysning', 'Fjern eksakt svangerskapsuke dersom den ikke er nødvendig.');
  }
  if (uniquenessCombo.test(source)) {
    add('unique_role', 'Mulig indirekte identifisering', 'Unngå kombinasjoner som beskriver en unik eller svært liten gruppe i virksomheten.');
  }
  const exactWorkplace = /\b(?:jobber|arbeider|ansatt|tjenestegjør)\s+(?:i|på|ved|hos)\s+(?:Forsvaret|[A-ZÆØÅ][\p{L}.-]+(?:\s+[A-ZÆØÅ][\p{L}.-]+){0,3}(?:\s+(?:AS|ASA|kommune|sykehus|barnehage|skole|etat|avdeling|kontor))?)\b/u;
  const namedUnit = /\b(?:ved|på|i)\s+(?:[A-ZÆØÅ][\p{L}.-]+\s+){1,3}(?:avdeling|seksjon|kontor|barnehage|skole|sykehus)\b/u;
  if (exactWorkplace.test(source) || namedUnit.test(source)) {
    add('workplace_detail', 'Konkret arbeidssted eller enhet', 'Generaliser virksomhetsnavn, avdeling eller lokasjon dersom den konkrete identiteten ikke er nødvendig for rådet. Behold relevant arbeidskontekst.');
  }

  const likelyName = findLikelyGivenName(source);
  if (likelyName) {
    add('name', `Mulig personnavn: «${likelyName}»`, 'Fjern navnet og bruk for eksempel «medarbeideren», «kollegaen» eller «lederen».');
  }
  if (/\b[A-ZÆØÅ][a-zæøå]+(?:gate|gata|veien|vegen|allé|stien)\s+\d+[A-Za-z]?\b/.test(source)) {
    add('address', 'Mulig gateadresse', 'Fjern konkret adresse eller stedsopplysning som kan identifisere personen.');
  }

  return findings;
}


const HARD_PRIVACY_TYPES = new Set(['email', 'phone', 'birthdate', 'identifier', 'name', 'address']);

function splitPrivacyFindings(findings = []) {
  return {
    hard: findings.filter(item => HARD_PRIVACY_TYPES.has(item.type)),
    soft: findings.filter(item => !HARD_PRIVACY_TYPES.has(item.type))
  };
}


function autoFixPrivacyText(text, findings) {
  let fixed = text;

  // E-post, telefon og tydelige identifikatorer fjernes helt.
  fixed = fixed.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[fjernet e-post]');
  fixed = fixed.replace(/(?:\+47\s?)?(?:\d[\s-]?){8}\b/g, '[fjernet telefonnummer]');
  fixed = fixed.replace(/\b(?:fødselsnummer|personnummer|ansattnummer|ansattnr\.?|employee\s*id)\s*[:#-]?\s*[A-Z0-9-]{4,}\b/gi, '[fjernet identifikator]');
  fixed = fixed.replace(/\b\d{11}\b/g, '[fjernet identifikator]');

  // Generaliser familie- og livsfasedetaljer før enkeltaldre håndteres.
  fixed = fixed.replace(/\bhar\s+(?:to|2)\s+(?:døtre|sønner)\s+på\s+(?:[6-9]|1[0-2])\s*(?:,|og)\s*(?:[6-9]|1[0-2])(?:\s*år)?\b/giu, 'har flere barn i småskolealder');
  fixed = fixed.replace(/\bhar\s+(?:ett|to|tre|fire|fem|seks|\d+)\s+(?:barn|døtre|sønner)\s+på\s+\d{1,2}(?:\s*(?:,|og)\s*\d{1,2})+(?:\s*år)?\b/giu, 'har flere barn i ulike aldre');
  fixed = fixed.replace(/\b(?:datter|sønn|barn|gutt|jente)\s+(?:som\s+er\s+|på\s+)(?:1[3-9])\s*år\b/giu, 'barn i tenårene');
  fixed = fixed.replace(/\b(?:datter|sønn|barn|gutt|jente)\s+(?:som\s+er\s+|på\s+)(?:[6-9]|1[0-2])\s*år\b/giu, 'barn i småskolealder');
  fixed = fixed.replace(/\bgravid(?:\s+i)?\s+(?:uke|svangerskapsuke)\s*\d{1,2}\b/giu, 'gravid');

  fixed = fixed.replace(/\b(?:er\s+)?(?:alenemor|alenefar|enslig\s+(?:mor|far))\b[^.!?]{0,60}\b(?:til\s+)?(?:ett|to|tre|fire|fem|seks|\d+)?\s*(?:barn|datter|sønn|gutt|jente)\b[^.!?]{0,35}/giu, 'har omsorgsansvar for barn');
  fixed = fixed.replace(/\b(?:bor|lever)\s+med\s+(?:mannen|kona|ektefellen|samboeren|partneren)\b[^.!?]{0,70}\b(?:og\s+)?(?:ett|to|tre|fire|fem|seks|\d+)?\s*(?:barn|datter|døtre|sønn|sønner)\b/giu, 'har familieforhold som påvirker situasjonen');
  fixed = fixed.replace(/\b(?:den\s+eneste|en\s+av\s+(?:to|tre|fire|\d+))\s+((?:ansatt|medarbeider|leder|ingeniør|sykepleier|lærer|rådgiver|tekniker|operatør|elektriker|lege|psykolog|jurist)[\p{L}-]*)\b/giu, 'en medarbeider i en liten faggruppe');

  // Bevar relevant arbeidskontekst, men fjern konkrete virksomhets-/stedsnavn når de er flagget.
  if ((findings || []).some(item => item.type === 'workplace_detail')) {
    fixed = fixed.replace(/\b(?:jobber|arbeider|ansatt|tjenestegjør)\s+(?:i|på|ved|hos)\s+Forsvaret\b/giu, 'jobber i en sikkerhetskritisk virksomhet');
    fixed = fixed.replace(/\b(?:jobber|arbeider|ansatt|tjenestegjør)\s+(?:i|på|ved|hos)\s+[A-ZÆØÅ][\p{L}.-]+(?:\s+[A-ZÆØÅ][\p{L}.-]+){0,3}\s+barnehage\b/gu, 'jobber i en barnehage');
    fixed = fixed.replace(/\b(?:jobber|arbeider|ansatt|tjenestegjør)\s+(?:i|på|ved|hos)\s+[A-ZÆØÅ][\p{L}.-]+(?:\s+[A-ZÆØÅ][\p{L}.-]+){0,3}\s+skole\b/gu, 'jobber i en skole');
    fixed = fixed.replace(/\b(?:jobber|arbeider|ansatt|tjenestegjør)\s+(?:i|på|ved|hos)\s+[A-ZÆØÅ][\p{L}.-]+(?:\s+[A-ZÆØÅ][\p{L}.-]+){0,3}\s+sykehus\b/gu, 'jobber i helsetjenesten');
    fixed = fixed.replace(/\b(?:jobber|arbeider|ansatt|tjenestegjør)\s+(?:i|på|ved|hos)\s+[A-ZÆØÅ][\p{L}.-]+(?:\s+[A-ZÆØÅ][\p{L}.-]+){0,3}\s+kommune\b/gu, 'jobber i en offentlig virksomhet');
    fixed = fixed.replace(/\b(?:jobber|arbeider|ansatt|tjenestegjør)\s+(?:i|på|ved|hos)\s+[A-ZÆØÅ][\p{L}.-]+(?:\s+[A-ZÆØÅ][\p{L}.-]+){0,3}\s+(?:AS|ASA)\b/gu, 'jobber i en virksomhet');
  }

  // Konkret alder/fødselsdata generaliseres uten å endre resten av setningen.
  fixed = fixed.replace(/\b(?:[1-9]|[1-9]\d|1[01]\d|120)\s*år(?:\s+gammel)?\b/gi, '[alder fjernet]');
  fixed = fixed.replace(/\b(?:\d{1,2}[.\/-]\d{1,2}[.\/-](?:19|20)?\d{2})\b/g, '[fødselsdato fjernet]');
  fixed = fixed.replace(/\b(?:født|fødselsdato)\s+(?:i\s+)?(?:19|20)\d{2}\b/gi, '[fødselsopplysning fjernet]');

  // Kjønnede pronomen erstattes med kjønnsnøytrale alternativer.
  const pronouns = [
    [/\bhan\b/gi, 'hen'], [/\bhun\b/gi, 'hen'], [/\bham\b/gi, 'hen'], [/\bhenne\b/gi, 'hen'],
    [/\bhans\b/gi, 'hens'], [/\bhennes\b/gi, 'hens']
  ];
  pronouns.forEach(([pattern, replacement]) => { fixed = fixed.replace(pattern, replacement); });

  // Navn som faktisk er flagget erstattes med et rolleord. Vi omskriver ikke andre ord.
  (findings || []).filter(item => item.type === 'name').forEach(item => {
    const match = item.label.match(/«([^»]+)»/);
    if (!match) return;
    const name = match[1].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    fixed = fixed.replace(new RegExp(`\\b${name}\\b`, 'gi'), 'medarbeideren');
  });

  return fixed.replace(/\s{2,}/g, ' ').trim();
}

function applyPrivacyFix() {
  const field = document.querySelector('#situation');
  if (!field) return;
  const findings = detectSensitiveInfo(field.value);
  if (!findings.length) return;
  field.value = autoFixPrivacyText(field.value, findings);
  autoGrowTextarea(field, 220);
  updatePrivacyCheck();
  field.focus();
}

function updatePrivacyCheck() {
  const box = document.querySelector('#privacy-check');
  const text = document.querySelector('#situation').value;
  const findings = detectSensitiveInfo(text);
  const { hard, soft } = splitPrivacyFindings(findings);
  const submitButton = document.querySelector('#understand-submit');
  const note = document.querySelector('#privacy-submit-note');
  const hasText = Boolean(text.trim());
  const blocked = hard.length > 0;

  document.querySelector('#situation')?.setAttribute('aria-invalid', blocked ? 'true' : 'false');

  if (submitButton && submitButton.dataset.loading !== 'true') {
    submitButton.disabled = blocked || !hasText;
  }
  if (note) {
    note.textContent = blocked
      ? 'Tydelige identifikatorer må fjernes før teksten kan sendes.'
      : soft.length
        ? 'Personvernkontroll: vurder om de markerte detaljene kan generaliseres.'
        : (hasText ? '🛡 Personvernkontroll: ingen tydelige identifikatorer funnet.' : 'Beskriv situasjonen for å gå videre.');
    note.classList.toggle('ok', hasText && !blocked && !soft.length);
    note.classList.toggle('soft-warning', Boolean(soft.length) && !blocked);
  }

  if (!hasText || (!blocked && !soft.length)) {
    box.hidden = true;
    box.innerHTML = '';
    return findings;
  }

  box.hidden = false;
  const visible = blocked ? hard : soft;
  if (blocked) {
    box.className = 'privacy-check warning blocking';
    box.innerHTML = `
      <strong>Kan ikke sendes ennå</strong>
      <span>Jeg fant tydelige identifikatorer som må fjernes:</span>
      <ul class="privacy-findings">${visible.map(item => `<li><b>${escapeHtml(item.label)}:</b> ${escapeHtml(item.message)}</li>`).join('')}</ul>
      <div class="privacy-fix-actions">
        <button type="button" class="secondary-button compact-fix-button" id="privacy-fix-button">Fiks personvern</button>
        <small>Erstatter bare opplysninger kontrollen har flagget. Les gjennom teksten før du sender.</small>
      </div>
    `;
  } else {
    box.className = 'privacy-check warning advisory';
    box.innerHTML = `
      <strong>Kan dette anonymiseres litt mer?</strong>
      <span>Disse detaljene kan gjøre personen lettere å kjenne igjen. Du kan sende likevel, eller generalisere dem først:</span>
      <ul class="privacy-findings">${visible.map(item => `<li><b>${escapeHtml(item.label)}:</b> ${escapeHtml(item.message)}</li>`).join('')}</ul>
      <div class="privacy-fix-actions">
        <button type="button" class="secondary-button compact-fix-button" id="privacy-fix-button">Generaliser forslag</button>
        <small>Dette er en anbefaling, ikke en blokkering.</small>
      </div>
    `;
  }
  box.querySelector('#privacy-fix-button')?.addEventListener('click', applyPrivacyFix);
  return findings;
}


function updateFinderPrivacyCheck(inputId, boxId) {
  const input = document.querySelector(inputId);
  const box = document.querySelector(boxId);
  if (!input || !box) return { findings: [], hard: [], soft: [], blocked: false };

  const findings = detectSensitiveInfo(input.value);
  const { hard, soft } = splitPrivacyFindings(findings);
  const blocked = hard.length > 0;
  input.setAttribute('aria-invalid', blocked ? 'true' : 'false');

  if (!input.value.trim() || (!hard.length && !soft.length)) {
    box.hidden = true;
    box.innerHTML = '';
    box.className = 'privacy-check finder-privacy-check';
    return { findings, hard, soft, blocked };
  }

  const visible = blocked ? hard : soft;
  box.hidden = false;
  box.className = blocked
    ? 'privacy-check finder-privacy-check warning blocking'
    : 'privacy-check finder-privacy-check warning advisory';
  box.innerHTML = blocked ? `
    <strong>Kan ikke brukes til temaforslag ennå</strong>
    <span>Fjern tydelige identifikatorer før teksten sendes til KI:</span>
    <ul class="privacy-findings">${visible.map(item => `<li><b>${escapeHtml(item.label)}:</b> ${escapeHtml(item.message)}</li>`).join('')}</ul>
    <div class="privacy-fix-actions">
      <button type="button" class="secondary-button compact-fix-button" data-finder-privacy-fix>Fiks personvern</button>
      <small>Temaforslaget kjøres først etter at tydelige identifikatorer er fjernet.</small>
    </div>
  ` : `
    <strong>Kan dette anonymiseres litt mer?</strong>
    <span>Du kan gå videre, men disse detaljene kan med fordel generaliseres:</span>
    <ul class="privacy-findings">${visible.map(item => `<li><b>${escapeHtml(item.label)}:</b> ${escapeHtml(item.message)}</li>`).join('')}</ul>
    <div class="privacy-fix-actions">
      <button type="button" class="secondary-button compact-fix-button" data-finder-privacy-fix>Generaliser forslag</button>
      <small>Dette er en anbefaling, ikke en blokkering.</small>
    </div>
  `;

  box.querySelector('[data-finder-privacy-fix]')?.addEventListener('click', () => {
    input.value = autoFixPrivacyText(input.value, findings);
    updateFinderPrivacyCheck(inputId, boxId);
    input.focus();
  });

  return { findings, hard, soft, blocked };
}

async function requestTopicClassification(situation, selectedTopicId = '') {
  const response = await fetch('/api/classify-topic', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ situation, selectedTopicId })
  });
  if (!response.ok) {
    let payload = {};
    try { payload = await response.json(); } catch (_) {}
    const error = new Error(payload.message || 'KI-temaforslaget kunne ikke gjennomføres.');
    error.code = payload.error || 'AI_TOPIC_ERROR';
    throw error;
  }
  return response.json();
}

function topicSubtopicByTitle(topic, title) {
  return topic?.subtopics?.find(([subTitle]) => subTitle === title) || null;
}

function showAutoTopicNote(topic, subtopic, classification) {
  const note = document.querySelector('#auto-topic-note');
  const text = document.querySelector('#auto-topic-text');
  if (!note || !text || !topic || !subtopic) return;
  const confidenceText = classification?.confidence === 'high'
    ? 'tydelig treff'
    : classification?.confidence === 'medium'
      ? 'sannsynlig treff'
      : 'foreløpig forslag';
  text.innerHTML = `<strong>KI foreslo ${escapeHtml(topic.title)} → ${escapeHtml(subtopic[0])}</strong><span>${confidenceText}. ${escapeHtml(classification?.reason || '')}</span>`;
  note.hidden = false;
}

function hideAutoTopicNote() {
  const note = document.querySelector('#auto-topic-note');
  if (note) note.hidden = true;
}

function renderLowConfidenceTopicChoice(box, classification, situation) {
  const ids = [classification.primary_topic_id, ...(classification.alternative_topic_ids || [])]
    .filter((id, index, all) => id && all.indexOf(id) === index)
    .slice(0, 3);
  const choices = ids.map(id => {
    const topic = topics.find(item => item.id === id);
    if (!topic) return '';
    const preferred = id === classification.primary_topic_id
      ? topicSubtopicByTitle(topic, classification.primary_subtopic)
      : null;
    return `<button type="button" class="secondary-button topic-choice-button" data-ai-topic="${escapeHtml(id)}" data-ai-subtopic="${escapeHtml(preferred?.[0] || '')}"><strong>${escapeHtml(topic.title)}</strong>${preferred ? `<span>${escapeHtml(preferred[0])}</span>` : ''}</button>`;
  }).join('');

  box.hidden = false;
  box.className = 'topic-suggestion ai-topic-suggestion';
  box.innerHTML = `
    <span class="suggestion-kicker">KI er usikker</span>
    <strong>Velg temaet som ligger nærmest</strong>
    <p>${escapeHtml(classification.reason || 'Beskrivelsen kan passe flere steder.')}</p>
    <div class="suggestion-actions">${choices}</div>
  `;

  box.querySelectorAll('[data-ai-topic]').forEach(button => {
    button.addEventListener('click', () => {
      const topic = topics.find(item => item.id === button.dataset.aiTopic);
      if (!topic) return;
      const subtopic = topicSubtopicByTitle(topic, button.dataset.aiSubtopic) || topic.subtopics[0];
      openGuidanceFromSuggestion(topic, subtopic, situation);
      showAutoTopicNote(topic, subtopic, { ...classification, confidence: 'low', reason: 'Du valgte temaet etter KI-forslaget.' });
    });
  });
}

async function classifyAndContinueFromFinder({ value, boxId, inputId, privacyBoxId, selectedTopicId = '' }) {
  const situation = String(value || '').trim();
  if (situation) pendingSituationText = situation;
  const box = document.querySelector(boxId);
  if (!box || situation.length < 4) {
    if (box) {
      box.hidden = false;
      box.className = 'topic-suggestion';
      box.innerHTML = '<strong>Beskriv situasjonen litt mer.</strong><p>En kort setning eller to gjør temaforslaget mer presist.</p>';
    }
    return;
  }

  const privacy = updateFinderPrivacyCheck(inputId, privacyBoxId);
  if (privacy.blocked) return;

  box.hidden = false;
  box.className = 'topic-suggestion ai-topic-suggestion loading';
  box.innerHTML = '<div class="topic-thinking"><span class="thinking-spinner" aria-hidden="true"></span><div><strong>Forstår situasjonen …</strong><p>KI vurderer hele konteksten og finner mest sannsynlige tema.</p></div></div>';

  try {
    const classification = await requestTopicClassification(situation, selectedTopicId);
    const topic = topics.find(item => item.id === classification.primary_topic_id);
    const subtopic = topicSubtopicByTitle(topic, classification.primary_subtopic);
    if (!topic || !subtopic) throw new Error('Ugyldig tema fra KI.');

    if (classification.confidence === 'low') {
      renderLowConfidenceTopicChoice(box, classification, situation);
      return;
    }

    // Høy/middels sikkerhet: færre klikk. Gå direkte videre og la brukeren endre tema ved behov.
    openGuidanceFromSuggestion(topic, subtopic, situation);
    showAutoTopicNote(topic, subtopic, classification);
  } catch (error) {
    console.warn('KI-temaforslag feilet, bruker lokal reserve:', error);
    if (selectedTopicId && currentTopic) renderSubtopicSuggestion(situation);
    else renderSuggestion(situation);
    const fallbackBox = document.querySelector(boxId);
    if (fallbackBox) {
      fallbackBox.insertAdjacentHTML('afterbegin', '<span class="suggestion-kicker">Lokal reserve</span>');
    }
  }
}


function detectConversationThemes(text) {
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
    // Eventuelle juridiske eller prinsipielle varsler vises først når begrunnelsen er bedre avklart.
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
  const cautions = dilemma.cautions.length
    ? `<div class="understanding-caution"><strong>Viktig før du bestemmer hvordan samtalen skal tas</strong><ul>${dilemma.cautions.map(item => `<li>${item}</li>`).join('')}</ul></div>`
    : '';

  content.innerHTML = `
    <div class="understanding-block">
      <strong>Dette ser ut til å berøre</strong>
      <div class="topic-representations">${themeLabels}</div>
    </div>
    <div class="understanding-block">
      <strong>Dette har jeg forstått fra beskrivelsen din</strong>
      <ul>${facts}</ul>
    </div>
    <div class="understanding-block">
      <strong>Selve dilemmaet</strong>
      <ul>${tensions}</ul>
    </div>
    ${cautions}
  `;
  panel.hidden = false;
}


async function requestAiSituationAnalysis(situation, helpRequest) {
  const response = await fetch('/api/analyze-situation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      situation,
      helpRequest,
      selectedTopic: currentTopic?.title || '',
      selectedSubtopic: currentSubtopic || ''
    })
  });

  if (!response.ok) {
    let payload = {};
    try { payload = await response.json(); } catch (_) {}
    const error = new Error(payload.message || 'KI-analysen kunne ikke gjennomføres.');
    error.code = payload.error || 'AI_ERROR';
    error.diagnostic = payload.diagnostic || null;
    throw error;
  }
  return response.json();
}

async function requestAiGuidance(situation, analysis, followups) {
  const response = await fetch('/api/generate-guidance', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ situation, analysis, followups })
  });
  if (!response.ok) {
    let payload = {};
    try { payload = await response.json(); } catch (_) {}
    const error = new Error(payload.message || 'KI-samtalestøtten kunne ikke gjennomføres.');
    error.code = payload.error || 'AI_ERROR';
    error.diagnostic = payload.diagnostic || null;
    throw error;
  }
  return response.json();
}

function renderAiGuidance(guidance) {
  const grid = document.querySelector('#structured-guidance');
  const reactionHtml = (guidance.reactions || []).map(item => `
    <div class="reaction-pair">
      <strong>${escapeHtml(item.reaction)}</strong>
      <p>${escapeHtml(item.why_plausible)}</p>
      <p><b>Slik kan du møte det:</b> ${escapeHtml(item.leader_response)}</p>
    </div>`).join('');
  const list = items => (items || []).map(item => `• ${escapeHtml(item)}`).join('<br>');
  const evidence = (guidance.evidence_sources || []).length
    ? `<details class="evidence-details"><summary>Faglig grunnlag</summary><div class="evidence-list">${guidance.evidence_sources.map(source => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer"><strong>${escapeHtml(source.title)}</strong><span>${escapeHtml(source.author)}${source.year ? ` (${escapeHtml(String(source.year))})` : ''} · ${escapeHtml(source.type)}</span></a>`).join('')}</div></details>`
    : '';

  const sections = [
    ['Forslag til åpning', escapeHtml(guidance.opening || '')],
    ['Spørsmål som passer denne saken', list(guidance.questions)],
    ['Mulige reaksjoner – og hvordan du kan møte dem', reactionHtml],
    ['Sjekk før samtalen', list(guidance.check_before_meeting)],
    ['HR / regelverk', escapeHtml(guidance.legal_hr_note || '')],
    ['Vær særlig oppmerksom på', list(guidance.attention)],
    ['Videre oppfølging', list(guidance.next_steps)],
    ['Dokumentert grunnlag', evidence]
  ].filter(([,content]) => content);
  grid.innerHTML = sections.map(([title, content], index) => `
    <article class="guidance-card">
      <span class="guidance-number">${String(index + 1).padStart(2, '0')}</span>
      <div><h3>${title}</h3><div class="guidance-copy">${content}</div></div>
    </article>`).join('');
  const intro = document.querySelector('#result-intro');
  if (intro) intro.textContent = 'KI-rådet er generert fra denne konkrete situasjonen og avklaringssvarene dine. Juridisk sensitive punkter bør kvalitetssikres med HR/juridisk kompetanse før en endelig beslutning tas.';
}

function renderAiSituationUnderstanding(analysis) {
  const panel = document.querySelector('#situation-understanding');
  const content = document.querySelector('#understanding-content');
  const confidence = document.querySelector('#understanding-confidence');
  if (!panel || !content || !confidence) return;

  const labels = { low: 'Foreløpig', medium: 'Forstått', high: 'Forstått' };
  confidence.textContent = labels[analysis.confidence] || 'Forstått';
  confidence.dataset.level = analysis.confidence || 'medium';

  const topics = (analysis.relevant_topics || []).length
    ? analysis.relevant_topics.map(item => `<span class="representation-chip">${escapeHtml(item)}</span>`).join('')
    : '';
  const caution = (analysis.cautions || [])[0];

  content.innerHTML = `
    <div class="understanding-summary compact"><p>${escapeHtml(analysis.summary || '')}</p></div>
    ${topics ? `<div class="topic-representations compact-topics">${topics}</div>` : ''}
    ${caution ? `<div class="understanding-caution compact-caution"><strong>Viktig:</strong> ${escapeHtml(caution)}</div>` : ''}
  `;
  panel.hidden = false;
}

function normalizeAiClarifications(items) {
  return (items || []).slice(0, 3).map((item, index) => ({
    id: item.id || `ai-${index + 1}`,
    question: item.question,
    options: Array.isArray(item.options) ? item.options.slice(0, 5) : [],
    customLabel: item.allow_custom === false ? null : (item.custom_label || 'Annet / skriv selv'),
    allowCustom: item.allow_custom !== false,
    multiSelect: item.multi_select === true
  })).filter(item => item.question && item.options.length >= 2);
}

function renderAiFollowupQuestions(items) {
  const normalized = normalizeAiClarifications(items);
  const container = document.querySelector('#followup-questions');
  container.innerHTML = normalized.map((item, index) => `
    <div class="followup-question-field" data-followup-question="${escapeHtml(item.id)}" data-multi-select="${item.multiSelect ? 'true' : 'false'}">
      <span class="followup-number">${index + 1}</span>
      <span class="followup-question-copy">${escapeHtml(item.question)}${item.multiSelect ? '<small class="multi-select-hint">Du kan velge flere</small>' : ''}</span>
      <div class="followup-choice-row" role="group" aria-label="Svaralternativer">
        ${item.options.map(option => `<button type="button" class="followup-choice" data-followup-choice="${escapeHtml(item.id)}" data-value="${escapeHtml(option)}">${escapeHtml(option)}</button>`).join('')}
        ${item.allowCustom ? `<button type="button" class="followup-choice followup-choice-custom" data-followup-custom="${escapeHtml(item.id)}">${escapeHtml(item.customLabel || 'Annet / skriv selv')}</button>` : ''}
      </div>
      ${item.allowCustom ? `<textarea class="followup-custom-input" rows="2" data-followup-custom-input="${escapeHtml(item.id)}" autocomplete="off" placeholder="Skriv kort med egne ord …" hidden></textarea>` : ''}
    </div>
  `).join('');

  wireFollowupControls(container);
  return normalized.length;
}

function wireFollowupControls(container) {
  container.querySelectorAll('[data-followup-choice]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.followupChoice;
      const field = container.querySelector(`[data-followup-question="${CSS.escape(id)}"]`);
      const multiSelect = field?.dataset.multiSelect === 'true';
      if (!field) return;

      if (multiSelect) {
        button.classList.toggle('selected');
      } else {
        field.querySelectorAll('.followup-choice').forEach(choice => choice.classList.remove('selected'));
        button.classList.add('selected');
      }

      const custom = field.querySelector(`[data-followup-custom-input="${CSS.escape(id)}"]`);
      if (!multiSelect && custom) { custom.hidden = true; custom.value = ''; }
      field.dataset.answer = '';
    });
  });

  container.querySelectorAll('[data-followup-custom]').forEach(button => {
    button.addEventListener('click', () => {
      const id = button.dataset.followupCustom;
      const field = container.querySelector(`[data-followup-question="${CSS.escape(id)}"]`);
      const multiSelect = field?.dataset.multiSelect === 'true';
      if (!field) return;

      if (multiSelect) {
        button.classList.toggle('selected');
      } else {
        field.querySelectorAll('.followup-choice').forEach(choice => choice.classList.remove('selected'));
        button.classList.add('selected');
      }

      const custom = field.querySelector(`[data-followup-custom-input="${CSS.escape(id)}"]`);
      if (custom) {
        custom.hidden = !button.classList.contains('selected');
        if (!custom.hidden) custom.focus();
        if (custom.hidden) custom.value = '';
      }
      field.dataset.answer = '';
    });
  });

  container.querySelectorAll('[data-followup-custom-input]').forEach(input => {
    input.addEventListener('input', () => {
      const id = input.dataset.followupCustomInput;
      const field = container.querySelector(`[data-followup-question="${CSS.escape(id)}"]`);
      if (field) field.dataset.answer = '';
    });
  });
}

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function buildFollowupQuestions(text) {
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

function renderFollowupQuestions(questions) {
  const container = document.querySelector('#followup-questions');
  container.innerHTML = questions.map((item, index) => `
    <div class="followup-question-field" data-followup-question="${item.id}" data-multi-select="${item.multiSelect ? 'true' : 'false'}">
      <span class="followup-number">${index + 1}</span>
      <span class="followup-question-copy">${item.question}${item.multiSelect ? '<small class="multi-select-hint">Du kan velge flere</small>' : ''}</span>
      <div class="followup-choice-row" role="group" aria-label="Svaralternativer">
        ${(item.options || []).map(option => `<button type="button" class="followup-choice" data-followup-choice="${item.id}" data-value="${option}">${option}</button>`).join('')}
        <button type="button" class="followup-choice followup-choice-custom" data-followup-custom="${item.id}">${item.customLabel || 'Annet / skriv selv'}</button>
      </div>
      <textarea class="followup-custom-input" rows="2" data-followup-custom-input="${item.id}" autocomplete="off" placeholder="Skriv kort med egne ord …" hidden></textarea>
    </div>
  `).join('');
  wireFollowupControls(container);
}

function collectFollowupAnswers() {
  const answers = {};
  document.querySelectorAll('[data-followup-question]').forEach(field => {
    const id = field.dataset.followupQuestion;
    const multiSelect = field.dataset.multiSelect === 'true';
    const selectedValues = [...field.querySelectorAll('[data-followup-choice].selected')]
      .map(button => button.dataset.value)
      .filter(Boolean);
    const customButton = field.querySelector('[data-followup-custom].selected');
    const custom = field.querySelector(`[data-followup-custom-input="${CSS.escape(id)}"]`);
    const customValue = customButton && custom && !custom.hidden ? custom.value.trim() : '';

    if (multiSelect) {
      const values = [...selectedValues];
      if (customValue) values.push(customValue);
      if (values.length) answers[id] = values;
    } else {
      const value = selectedValues[0] || customValue || '';
      if (value) answers[id] = value;
    }
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

function renderStructuredGuidance() {
  const context = {
    situation: document.querySelector('#situation').value.trim(),
    helpRequest: '',
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
      intro.textContent = 'Lokal reserveflyt: saken er behandlet som et dilemma som berører flere tema. Denne vises bare dersom KI-tjenesten ikke er tilgjengelig.';
    } else if (currentTopic?.id === 'fravaer-oppfolging') {
      const localAnalysis = analyzeSituation(context.situation + ' ' + Object.values(context.followups || {}).join(' '));
      intro.textContent = `Lokal reserveflyt: rådet er tilpasset mønstre som er gjenkjent som «${localAnalysis.classification}». Vurder om rådet faktisk passer situasjonen.`;
    } else {
      intro.textContent = 'Dette er en lokal reserveflyt. Vurder om rådet faktisk passer situasjonen.';
    }
  }
}

async function showStructuredGuidance() {
  const button = document.querySelector('#generate-guidance');
  const situation = document.querySelector('#situation')?.value.trim() || '';
  const followups = collectFollowupAnswers();
  const original = button?.textContent || 'Lag samtalestøtte';
  if (button) { button.disabled = true; button.textContent = 'Lager samtalestøtte …'; }
  document.querySelector('#followup-panel').hidden = true;
  document.querySelector('#prototype-result').hidden = true;
  setAiThinking(true, 'Samtalestøtte jobber …', 'Bruker situasjonen og svarene dine til å lage konkrete råd.');
  try {
    if (!lastAiAnalysis) throw new Error('Ingen aktiv KI-analyse finnes for denne saken.');
    const guidance = await requestAiGuidance(situation, lastAiAnalysis, followups);
    lastAiGuidance = guidance;
    conversationDirty = true;
    renderAiGuidance(guidance);
    await saveCurrentConversation();
  } catch (error) {
    renderStructuredGuidance();
    const intro = document.querySelector('#result-intro');
    if (intro) intro.textContent = `KI-samtalestøtten feilet (${error.diagnostic?.status || error.code || 'ukjent'}). Lokal reserve vises bare for testing.`;
  } finally {
    setAiThinking(false);
    document.querySelector('#prototype-result').hidden = false;
    if (button) { button.disabled = false; button.textContent = original; }
  }
  document.querySelector('#prototype-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function buildContinuationReply(question) {
  const q = question.trim().toLowerCase();
  const situation = document.querySelector('#situation')?.value.trim() || '';
  const crossTheme = buildDilemmaUnderstanding(situation).special;

  if (/sint|irritert|forbanna|provosert|urettferdig/.test(q)) {
    return 'Hvis medarbeideren blir sint, prøv først å finne ut hva reaksjonen gjelder. Du kan for eksempel si: «Jeg hører at dette oppleves sterkt. Hva er det i det jeg har sagt som kjennes mest urimelig?» Unngå å forsvare beslutningen med en gang. Lytt først, korriger eventuelle misforståelser og gå deretter tilbake til de konkrete forholdene vurderingen bygger på.';
  }
  if (/lei seg|trist|gråt|gråter|skuffet/.test(q)) {
    return 'Hvis medarbeideren blir lei seg eller skuffet, trenger du ikke fylle stillheten med flere argumenter. Anerkjenn reaksjonen, for eksempel: «Jeg ser at dette er vanskelig å høre.» Gi litt tid, og spør deretter hva medarbeideren trenger å få avklart. Det går an å være empatisk uten å trekke tilbake eller forskuttere en beslutning.';
  }
  if (/hva bør jeg ikke si|ikke si|unngå/.test(q)) {
    return crossTheme
      ? 'Unngå formuleringer som kobler opprykket direkte til sykefraværet, som «du har vært borte for lenge til at vi kan stole på deg i rollen». Unngå også å fremstille antakelser om kapasitet som fakta. Hold deg til det som faktisk er besluttet, hvilke krav rollen har, og hvilke vurderinger som fortsatt er åpne.'
      : 'Unngå merkelapper, antakelser om motiv og formuleringer du ikke kan underbygge. Hold deg til konkrete observasjoner, konsekvenser og hva du ønsker å avklare sammen.';
  }
  if (/formuler|si det|åpne|ordlegge|tydelig/.test(q)) {
    return crossTheme
      ? 'En mulig formulering er: «Jeg vil være åpen med deg om at stillingen fortsatt er relevant i vurderingen, men jeg ønsker å være tydelig på hva vi trenger å avklare før vi tar en endelig beslutning. Jeg vil gjerne høre hvordan du selv ser på tidspunktet og kravene i rollen.» Tilpass dette til om beslutningen faktisk er tatt eller ikke.'
      : 'Prøv en kort struktur: hva du vil snakke om, hva du konkret har observert, hvorfor det er viktig å avklare, og så et åpent spørsmål. For eksempel: «Jeg ønsker å ta opp … Jeg har observert … Jeg vil gjerne forstå hvordan du ser på dette.»';
  }
  if (/uenig|uenighet|enig/.test(q)) {
    return 'Hvis medarbeideren er uenig, skill mellom uenighet om fakta og uenighet om vurderingen. Spør: «Hva i beskrivelsen min mener du ikke stemmer?» og deretter «Hva er du uenig i når det gjelder vurderingen eller veien videre?» Det gjør det lettere å unngå at hele samtalen blir én stor konflikt.';
  }
  if (/rettferdig|diskrimin|lovlig|juss|juridisk/.test(q)) {
    return 'Det kan være en sensitiv vurdering. Jeg kan hjelpe deg med samtaleformen og med å skille fakta fra antakelser, men en konkret juridisk vurdering av beslutningen bør kvalitetssikres mot virksomhetens HR-/juridiske kompetanse og relevant regelverk før du kommuniserer en endelig konklusjon.';
  }
  return 'Jeg kan ikke tolke dette oppfølgingsspørsmålet sikkert med den lokale reserveflyten. Jeg vil derfor ikke gjette eller hente inn råd fra en annen type sak. Prøv gjerne et av hurtigvalgene, eller spør mer konkret om reaksjoner, formuleringer, hva du bør unngå å si eller hvordan du kan svare på en bestemt innvending. Når ekte KI kobles på, skal den bruke hele den aktuelle saken og svarene dine som kontekst.';
}

async function appendConversationTurn(question) {
  const thread = document.querySelector('#conversation-thread');
  if (!thread || !question.trim()) return;
  const user = document.createElement('div');
  user.className = 'conversation-turn conversation-user';
  user.innerHTML = `<span>Du</span><p>${escapeHtml(question)}</p>`;
  const assistant = document.createElement('div');
  assistant.className = 'conversation-turn conversation-assistant';
  assistant.innerHTML = `<span>Samtalestøtte</span><div class="conversation-thinking"><span class="thinking-spinner" aria-hidden="true"></span><p>Tenker på svaret ditt …</p></div>`;
  thread.append(user, assistant);
  assistant.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  try {
    if (!lastAiAnalysis) throw new Error('Ingen aktiv KI-kontekst.');
    const response = await fetch('/api/continue-conversation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        situation: document.querySelector('#situation')?.value.trim() || '',
        analysis: lastAiAnalysis,
        followups: collectFollowupAnswers(),
        guidance: lastAiGuidance,
        question
      })
    });
    if (!response.ok) throw new Error('KI-oppfølgingen kunne ikke gjennomføres.');
    const payload = await response.json();
    assistant.innerHTML = `<span>Samtalestøtte</span><div class="formatted-reply">${formatContinuationReply(payload.reply || '')}</div>`;
    conversationDirty = true;
    await saveCurrentConversation();
  } catch (_) {
    const reply = buildContinuationReply(question);
    assistant.innerHTML = `<span>Samtalestøtte</span><div class="formatted-reply">${formatContinuationReply(reply)}</div><small>Lokal reserve</small>`;
  }
}

const searchAliases = {
  'fravaer-oppfolging': ['sykemelding','sykmelding','sykemeldt','sykmeldt','sykemeld','sykmeld','sykefravær','fravær','langtidsfravær','langtidssyk','borte fra jobb','mye borte','korttidsfravær','oppmøte','for sent','tilbake etter sykmelding','tilrettelegging'],
  'prestasjon-utvikling': ['prestasjon','leveranse','resultat','måloppnåelse','kvalitet','frister','kompetanse','mestring','arbeidsutførelse','gjør ikke jobben','sitter på internett','internett i arbeidstiden','surfer på nettet','privat surfing','sosiale medier','bruker mye tid på nettet','telefonen i arbeidstiden','mobilen i arbeidstiden','bruker tiden på'],
  'lonn-utvikling': ['lønn','lønnsøkning','opprykk','forfremmelse','ny stilling','karriere','utviklingsmulighet','ansvarstillegg'],
  'samarbeid-kommunikasjon': ['konflikt','samarbeid','kommunikasjon','uenighet','tillit','tone','team','krangel','snakker ikke sammen'],
  'alkohol-rus': ['alkohol','rus','beruset','påvirket','drikking','narkotika','stoff','promille'],
  'avslutning-arbeidsforhold': ['oppsigelse','avslutte arbeidsforhold','prøvetid','nedbemanning','slutte','avskjed'],
  'sikkerhet-ansvar': ['sikkerhet','avvik','hendelse','risiko','prosedyre','rutinebrudd','informasjonssikkerhet'],
  'livssituasjoner': ['sorg','familie','samlivsbrudd','omsorg','privat belastning','stress','utmattelse','vanskelig hjemme']
};

function normalizeSearchText(value) {
  return (value || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

function scoreTopic(topic, query) {
  const q = normalizeSearchText(query);
  if (!q) return 0;
  let score = 0;
  const aliases = searchAliases[topic.id] || [];
  aliases.forEach(alias => { if (q.includes(alias)) score += alias.length > 8 ? 8 : 6; });
  topic.keywords.forEach(keyword => { if (q.includes(keyword.toLowerCase())) score += 5; });
  if (q.includes(topic.title.toLowerCase())) score += 8;
  const words = q.split(/\s+/).filter(word => word.length > 3);
  topic.subtopics.forEach(([title, help]) => {
    const haystack = `${title} ${help}`.toLowerCase();
    words.forEach(word => { if (haystack.includes(word)) score += 1; });
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
  const trimmed = query.trim();
  const results = suggestTopics(trimmed);
  const best = results[0];
  box.hidden = false;

  if (!trimmed) {
    box.innerHTML = '<strong>Skriv litt om situasjonen.</strong><p>Da kan Samtalestøtte foreslå både hovedtema og undertema.</p>';
    return;
  }

  if (!best || best.score <= 0) {
    const fallback = topics.slice(0, 3).map(topic => `<button class="ghost-button" type="button" data-topic-id="${topic.id}">${topic.title}</button>`).join('');
    box.innerHTML = `
      <strong>Jeg er usikker på hva som passer best.</strong>
      <p>Prøv å beskrive situasjonen litt mer konkret, eller velg ett av temaene under.</p>
      <div class="suggestion-actions">${fallback}</div>
    `;
  } else {
    const rankedSubtopics = best.topic.subtopics
      .map(subtopic => ({ subtopic, score: scoreSubtopicForTopic(best.topic, subtopic, trimmed) }))
      .sort((a, b) => b.score - a.score);
    const bestSubtopic = rankedSubtopics[0];
    const alternatives = results.slice(1, 3).filter(item => item.score > 0)
      .map(item => `<span class="mini-chip">Alternativt hovedtema: ${item.topic.title}</span>`).join('');

    if (bestSubtopic && bestSubtopic.score > 0) {
      const [subTitle, subHelp] = bestSubtopic.subtopic;
      box.innerHTML = `
        <span class="suggestion-kicker">Foreslått vei</span>
        <strong>${best.topic.title} <span aria-hidden="true">→</span> ${subTitle}</strong>
        <p>${subHelp}</p>
        <div class="suggestion-actions">
          <button class="primary-button" type="button" id="open-suggested-guidance">Bruk forslag</button>
          <button class="ghost-button" type="button" id="review-suggested-topic">Se andre undertemaer</button>
          ${alternatives}
        </div>
      `;
      box.querySelector('#open-suggested-guidance').addEventListener('click', () => openGuidanceFromSuggestion(best.topic, bestSubtopic.subtopic, trimmed));
      box.querySelector('#review-suggested-topic').addEventListener('click', () => openTopic(best.topic));
    } else {
      box.innerHTML = `
        <strong>Foreslått hovedtema: ${best.topic.title}</strong>
        <p>${best.topic.description}</p>
        <div class="suggestion-actions">
          <button class="primary-button" type="button" id="open-suggested-topic">Se undertemaer</button>
          ${alternatives}
        </div>
      `;
      box.querySelector('#open-suggested-topic').addEventListener('click', () => openTopic(best.topic));
    }
  }

  box.querySelectorAll('[data-topic-id]').forEach(button => {
    button.addEventListener('click', () => {
      const topic = topics.find(item => item.id === button.dataset.topicId);
      if (topic) openTopic(topic);
    });
  });
}

function filterTopicCards(query) {
  const normalized = normalizeSearchText(query);
  const scores = new Map(suggestTopics(normalized).map(item => [item.topic.id, item.score]));
  document.querySelectorAll('.topic-card').forEach(card => {
    card.hidden = false;
    card.classList.toggle('search-match', normalized.length > 1 && (scores.get(card.dataset.topicId) || 0) > 0);
  });
}


function scoreSubtopicForTopic(topic, [title, help], query) {
  const q = normalizeSearchText(query);
  const haystack = `${title} ${help}`.toLowerCase();
  let score = 0;
  const t = title.toLowerCase();
  const aliasMap = {
    'korttidsfravær': ['ofte borte','mye borte','gjentatt fravær','korttidsfravær','enkeltdager'],
    'langvarig fravær': ['sykemelding','sykmelding','sykemeldt','sykmeldt','langtidssyk','langtidsfravær','lenge borte','måneder','ett år','et år'],
    'oppmøte og punktlighet': ['for sent','forsinket','oppmøte','punktlighet','kommer sent'],
    'tilbakekomst til arbeid': ['tilbake etter sykmelding','kommer tilbake','tilbake i jobb','retur','tilbakekomst'],
    'tilrettelegging': ['tilrettelegging','lettere oppgaver','redusert tid','arbeidstid','justere oppgaver'],
    'arbeidsevne og kapasitet': ['arbeidsevne','kapasitet','orker ikke','funksjon','arbeidsmengde']
  };
  (aliasMap[t] || []).forEach(alias => { if (q.includes(alias)) score += 8; });
  q.split(/\s+/).forEach(word => { if (word.length > 2 && haystack.includes(word)) score += 2; });
  if (q.includes(t)) score += 6;
  if (topic?.id === 'fravaer-oppfolging' && /syk[e]?meld|sykefravær/i.test(q) && t === 'langvarig fravær') score += 5;
  return score;
}


function scoreSubtopic(subtopic, query) {
  return scoreSubtopicForTopic(currentTopic, subtopic, query);
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
  box.querySelector('#open-suggested-subtopic').addEventListener('click', () => openGuidance(title, help, query));
}

function filterSubtopicCards(query) {
  const normalized = normalizeSearchText(query);
  document.querySelectorAll('.subtopic-card').forEach(card => {
    card.hidden = false;
    const cardText = card.dataset.searchText || '';
    const words = normalized.split(/\s+/).filter(Boolean);
    card.classList.toggle('search-match', normalized.length > 1 && words.some(word => word.length > 2 && cardText.includes(word)));
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
  applyTheme(localStorage.getItem('samtalestotte-theme') || 'hybrid');
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
      startNewConversation();
    }
    if (button.dataset.view === 'simulation') {
      openSimulationHub();
    }
    if (button.dataset.view === 'settings') {
      setBreadcrumb('Innstillinger');
      showView('settings');
    }
    if (button.dataset.view === 'history') {
      openHistory();
    }
    if (button.dataset.view === 'about') {
      openInfoView('about');
    }
    if (button.dataset.view === 'contact') {
      openInfoView('contact');
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

document.querySelector('#change-auto-topic')?.addEventListener('click', () => {
  const situation = document.querySelector('#situation')?.value || '';
  const finder = document.querySelector('#topic-search');
  if (finder) finder.value = situation;
  setBreadcrumb('');
  showView('home');
  requestAnimationFrame(() => finder?.focus());
});

document.querySelector('#back-from-settings').addEventListener('click', () => {
  setBreadcrumb('');
  showView('home');
});

document.querySelector('#topic-finder-form').addEventListener('submit', async event => {
  event.preventDefault();
  if(!requireLogin()) return;
  const value = document.querySelector('#topic-search').value;
  await classifyAndContinueFromFinder({
    value,
    boxId: '#topic-suggestion',
    inputId: '#topic-search',
    privacyBoxId: '#topic-finder-privacy'
  });
});

document.querySelector('#topic-search').addEventListener('input', event => {
  const value = event.target.value;
  const box = document.querySelector('#topic-suggestion');
  updateFinderPrivacyCheck('#topic-search', '#topic-finder-privacy');
  // Ikke prøv å "gjette" tema mens brukeren fortsatt skriver. KI vurderer hele setningen ved innsending.
  document.querySelectorAll('.topic-card').forEach(card => {
    card.hidden = false;
    card.classList.remove('search-match');
  });
  if (!value.trim()) {
    box.hidden = true;
    box.innerHTML = '';
  }
});


document.querySelector('#topic-detail-search-form').addEventListener('submit', async event => {
  event.preventDefault();
  const value = document.querySelector('#topic-detail-search').value;
  await classifyAndContinueFromFinder({
    value,
    boxId: '#subtopic-suggestion',
    inputId: '#topic-detail-search',
    privacyBoxId: '#topic-detail-privacy',
    selectedTopicId: currentTopic?.id || ''
  });
});

document.querySelector('#topic-detail-search').addEventListener('input', event => {
  const value = event.target.value;
  updateFinderPrivacyCheck('#topic-detail-search', '#topic-detail-privacy');
  document.querySelectorAll('.subtopic-card').forEach(card => {
    card.hidden = false;
    card.classList.remove('search-match');
  });
  const box = document.querySelector('#subtopic-suggestion');
  if (!value.trim()) {
    box.hidden = true;
    box.innerHTML = '';
  }
});

function setAiThinking(active, title = 'Samtalestøtte jobber …', detail = 'Leser situasjonen og finner relevante hensyn.') {
  const box = document.querySelector('#ai-thinking');
  if (!box) return;
  const titleEl = box.querySelector('[data-thinking-title]');
  const detailEl = box.querySelector('[data-thinking-detail]');
  if (titleEl) titleEl.textContent = title;
  if (detailEl) detailEl.textContent = detail;
  box.hidden = !active;
  if (active) {
    requestAnimationFrame(() => {
      box.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
}

function autoGrowTextarea(textarea, maxHeight = 220) {
  if (!textarea) return;
  textarea.style.height = 'auto';
  const next = Math.min(textarea.scrollHeight, maxHeight);
  textarea.style.height = `${next}px`;
  textarea.style.overflowY = textarea.scrollHeight > maxHeight ? 'auto' : 'hidden';
}

function handleSituationInput(event) {
  conversationDirty = true;
  autoGrowTextarea(event.target, event.target.id === 'situation' ? 220 : 150);
  updatePrivacyCheck();
}

['situation'].forEach(id => {
  const field = document.querySelector(`#${id}`);
  field?.addEventListener('input', handleSituationInput);
  autoGrowTextarea(field, 220);
});


document.querySelector('#situation-form').addEventListener('submit', async event => {
  event.preventDefault();
  const privacyFindings = updatePrivacyCheck() || [];
  const situationText = document.querySelector('#situation').value;
  const helpRequest = '';
  const submitButton = event.currentTarget.querySelector('button[type="submit"]');

  if (privacyFindings.length) {
    document.querySelector('#privacy-check')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  clearGuidanceSession({ clearInputs: false });
  document.querySelector('#situation').value = situationText;
  updatePrivacyCheck();

  const originalLabel = submitButton?.textContent || 'Få råd';
  if (submitButton) {
    submitButton.dataset.loading = 'true';
    submitButton.disabled = true;
    submitButton.textContent = 'Jobber …';
  }
  setAiThinking(true, 'Samtalestøtte jobber …', 'Leser situasjonen og finner relevante hensyn.');
  let directGuidance = false;

  try {
    const aiAnalysis = await requestAiSituationAnalysis(situationText, helpRequest);
    lastAiAnalysis = aiAnalysis;
    renderAiSituationUnderstanding(aiAnalysis);
    const count = aiAnalysis.needs_clarification
      ? renderAiFollowupQuestions(aiAnalysis.clarifications)
      : 0;

    if (count > 0) {
      document.querySelector('#followup-panel').hidden = false;
    } else {
      // Ingen nødvendige avklaringer: hopp over avklaringsseksjonen og gå rett til rådet.
      document.querySelector('#followup-panel').hidden = true;
      directGuidance = true;
      await showStructuredGuidance();
    }
  } catch (error) {
    lastAiAnalysis = null;
    const localAnalysis = analyzeSituation(situationText);
    const localQuestions = buildFollowupQuestions(situationText);
    renderSituationUnderstanding(localAnalysis);
    const followupContainer = document.querySelector('#followup-questions');
    if (localQuestions.length) {
      renderFollowupQuestions(localQuestions);
      document.querySelector('#followup-panel').hidden = false;
    } else {
      followupContainer.innerHTML = '';
      document.querySelector('#followup-panel').hidden = true;
    }

    const note = document.createElement('div');
    note.className = 'privacy-check warning ai-fallback-note';
    const diagnostic = error.diagnostic;
    const details = diagnostic
      ? `<span><strong>Feilkode:</strong> ${escapeHtml(String(diagnostic.status || 'ukjent'))}${diagnostic.code ? ` / ${escapeHtml(String(diagnostic.code))}` : ''}</span>
         <span>${escapeHtml(diagnostic.hint || '')}</span>
         <details><summary>Teknisk detalj</summary><small>${escapeHtml(diagnostic.apiMessage || 'Ingen detalj tilgjengelig.')} · Modell: ${escapeHtml(diagnostic.model || 'ukjent')}</small></details>`
      : '<span>Se PowerShell-vinduet for den konkrete API-feilen.</span>';
    note.innerHTML = `<strong>Ekte KI er ikke tilgjengelig akkurat nå.</strong><span>${escapeHtml(error.message)} Den lokale reserveflyten vises kun dersom KI-tjenesten ikke er tilgjengelig.</span>${details}`;
    document.querySelector('#situation-understanding').prepend(note);
  } finally {
    setAiThinking(false);
    if (submitButton) {
      submitButton.dataset.loading = 'false';
      submitButton.textContent = originalLabel;
    }
    updatePrivacyCheck();
  }

  if (!directGuidance) document.querySelector('#situation-understanding').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('#generate-guidance').addEventListener('click', showStructuredGuidance);
document.querySelector('#show-guidance-anyway').addEventListener('click', showStructuredGuidance);


document.querySelector('#continue-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#continue-input');
  const value = input.value.trim();
  if (!value) return;
  appendConversationTurn(value);
  input.value = '';
  input.focus();
});

document.querySelectorAll('.continue-chip').forEach(button => {
  button.addEventListener('click', () => appendConversationTurn(button.textContent.trim()));
});



function formatContinuationReply(text) {
  const safe = escapeHtml(String(text || '')).replace(/\r/g, '');
  const lines = safe.split('\n');
  let html = ''; let listOpen = false; let sectionOpen = false;
  const closeList = () => { if (listOpen) { html += '</ul>'; listOpen = false; } };
  const closeSection = () => { closeList(); if (sectionOpen) { html += '</div>'; sectionOpen = false; } };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }
    const heading = line.match(/^(?:#{1,4}\s*)?(\d+)[.)]?\s*(.+)$/);
    const hashHeading = line.match(/^#{1,4}\s+(.+)$/);
    if (heading || hashHeading) {
      closeSection(); sectionOpen = true; html += `<div class="reply-section"><h4>${heading ? `${heading[1]}. ${heading[2]}` : hashHeading[1]}</h4>`; continue;
    }
    if (/^[-•]\s+/.test(line)) { if (!listOpen) { html += '<ul>'; listOpen = true; } html += `<li>${line.replace(/^[-•]\s+/, '')}</li>`; continue; }
    closeList();
    if (/^&gt;\s*/.test(line)) html += `<blockquote>${line.replace(/^&gt;\s*/, '')}</blockquote>`;
    else html += `<p>${line}</p>`;
  }
  closeSection(); return html || '<p>Ingen tekst.</p>';
}

function initialsFor(username='') {
  const parts=String(username).trim().split(/\s+/).filter(Boolean); if(!parts.length) return '○';
  return parts.slice(0,2).map(x=>x[0].toUpperCase()).join('');
}
function updateAuthUi() {
  const name=document.querySelector('#profile-name'), note=document.querySelector('#profile-note'), avatar=document.querySelector('#profile-avatar');
  const histNote=document.querySelector('#history-nav-note'), temp=document.querySelector('#temporary-chat-option');
  const status=document.querySelector('#settings-account-status'), del=document.querySelector('#delete-account-button');
  if(currentUser){ name.textContent=currentUser.username; note.textContent='Historikk aktiv'; avatar.textContent=initialsFor(currentUser.username); if(histNote) histNote.textContent=''; if(temp) temp.hidden=false; if(status) status.textContent=`Logget inn som ${currentUser.username}.`; if(del) del.hidden=false; }
  else { name.textContent='Logg på'; note.textContent='for historikk'; avatar.textContent='○'; if(histNote) histNote.textContent='logg inn'; if(temp) temp.hidden=true; if(status) status.textContent='Du er ikke logget inn. Samtaler lagres ikke permanent.'; if(del) del.hidden=true; }
}
async function refreshAuth() {
  try { const r=await fetch('/api/auth/me'); const p=await r.json(); currentUser=p.user||null; } catch(_) { currentUser=null; }
  updateAuthUi();
  if (!currentUser && !new URLSearchParams(location.search).get('invite')) openAuth('login', true);
}
function openAuth(mode='login', required = !currentUser) {
  const dlg=document.querySelector('#auth-dialog'); if(!dlg) return;
  document.querySelector('#login-panel').hidden=mode!=='login'; document.querySelector('#register-panel').hidden=mode!=='register';
  dlg.classList.toggle('required-auth', Boolean(required && !currentUser));
  if(!dlg.open) dlg.showModal();
}
function closeAuth(){
  const dlg=document.querySelector('#auth-dialog');
  if(!dlg?.open) return;
  if(!currentUser && dlg.classList.contains('required-auth')) return;
  dlg.close();
}
function requireLogin() {
  if (currentUser) return true;
  openAuth('login', true);
  return false;
}
function getConversationTurns(){
  return [...document.querySelectorAll('#conversation-thread .conversation-turn')].map(el=>({role:el.classList.contains('conversation-user')?'user':'assistant',text:el.innerText.replace(/^Du\s*|^Samtalestøtte\s*/,'').trim()}));
}
async function saveCurrentConversation(){
  const directSimulation = simulationSource === 'direct' && simulationDirectSituation && simulationTurns.length;
  if(!currentUser || document.querySelector('#temporary-chat')?.checked || document.querySelector('#simulation-temporary')?.checked || (!lastAiGuidance && !directSimulation)) return;
  const situation=directSimulation ? simulationDirectSituation : (document.querySelector('#situation')?.value.trim()||''); if(!situation) return;
  try{
    const r=await fetch('/api/history',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      id:currentConversationId,title:(directSimulation ? `Samtaleøvelse: ${situation.slice(0,55)}` : (currentSubtopic||currentTopic?.title||situation.slice(0,70))),topic:directSimulation?'Samtalesimulering':(currentTopic?.title||''),subtopic:directSimulation?'Direkte øvelse':(currentSubtopic||''),situation,analysis:directSimulation?null:lastAiAnalysis,guidance:directSimulation?null:lastAiGuidance,conversation:directSimulation?[]:getConversationTurns(),simulation:{fidelity:simulationFidelity,mode:simulationMode,style:simulationStyle,turns:simulationTurns,feedback:simulationFeedback}
    })});
    if(r.ok){ const p=await r.json(); currentConversationId=p.item?.id||currentConversationId; conversationDirty=false; }
  }catch(_){}
}
async function openHistory(){
  setBreadcrumb('Historikk'); showView('history');
  const loggedOut=document.querySelector('#history-logged-out'), loggedIn=document.querySelector('#history-logged-in');
  if(!currentUser){ loggedOut.hidden=false; loggedIn.hidden=true; return; }
  loggedOut.hidden=true; loggedIn.hidden=false;
  const list=document.querySelector('#history-list'); list.innerHTML='<div class="history-empty">Henter historikk …</div>';
  try{ const r=await fetch('/api/history'); const p=await r.json(); renderHistory(p.items||[]); }catch(_){ list.innerHTML='<div class="history-empty">Kunne ikke hente historikken.</div>'; }
}
function renderHistory(items){
  const list=document.querySelector('#history-list'); document.querySelector('#history-count').textContent=`${items.length} lagrede samtaler`;
  if(!items.length){ list.innerHTML='<div class="history-empty">Du har ingen lagrede samtaler ennå.</div>'; return; }
  list.innerHTML=items.map(item=>`<article class="history-item" data-history-id="${item.id}"><div class="history-item-top"><div><h3>${escapeHtml(item.title||'Samtale')}</h3><div class="history-meta">${escapeHtml([item.topic,item.subtopic].filter(Boolean).join(' · '))} · ${new Date(item.updatedAt).toLocaleDateString('nb-NO')}</div></div></div><div class="history-actions"><button class="primary-button" data-open-history="${item.id}" type="button">Åpne</button><button class="secondary-button" data-delete-history="${item.id}" type="button">Slett</button></div></article>`).join('');
  list.querySelectorAll('[data-open-history]').forEach(b=>b.addEventListener('click',()=>loadHistoryItem(items.find(x=>x.id===b.dataset.openHistory))));
  list.querySelectorAll('[data-delete-history]').forEach(b=>b.addEventListener('click',async()=>{if(!confirm('Slette denne samtalen?'))return;await fetch(`/api/history/${b.dataset.deleteHistory}`,{method:'DELETE'});openHistory();}));
}
function loadHistoryItem(item){
  if(!item)return; clearGuidanceSession(); currentConversationId=item.id; lastAiAnalysis=item.analysis; lastAiGuidance=item.guidance; conversationDirty=false;
  currentTopic=topics.find(t=>t.title===item.topic)||currentTopic; currentSubtopic=item.subtopic||null;
  document.querySelector('#situation').value=item.situation||''; autoGrowTextarea(document.querySelector('#situation'),220); updatePrivacyCheck();
  if(lastAiAnalysis) renderAiSituationUnderstanding(lastAiAnalysis); if(lastAiGuidance){renderAiGuidance(lastAiGuidance);document.querySelector('#prototype-result').hidden=false;}
  const thread=document.querySelector('#conversation-thread'); thread.innerHTML=''; (item.conversation||[]).forEach(turn=>{const el=document.createElement('div');el.className=`conversation-turn ${turn.role==='user'?'conversation-user':'conversation-assistant'}`;el.innerHTML=turn.role==='user'?`<span>Du</span><p>${escapeHtml(turn.text)}</p>`:`<span>Samtalestøtte</span><div class="formatted-reply">${formatContinuationReply(turn.text)}</div>`;thread.appendChild(el);});
  simulationFidelity=item.simulation?.fidelity||'factual'; simulationMode=item.simulation?.mode||'solo'; simulationStyle=item.simulation?.style||'open'; simulationTurns=Array.isArray(item.simulation?.turns)?item.simulation.turns:[]; simulationFeedback=item.simulation?.feedback||null;
  if(!lastAiGuidance && simulationTurns.length){
    simulationSource='direct'; simulationDirectSituation=item.situation||''; setBreadcrumb('Lagret samtaleøvelse'); showView('simulation'); document.querySelector('#simulation-hub').hidden=true; document.querySelector('#simulation-panel').hidden=false; document.querySelector('#simulation-setup').hidden=true; document.querySelector('#simulation-live').hidden=Boolean(simulationFeedback); document.querySelector('#simulation-feedback').hidden=!simulationFeedback; document.querySelector('#close-simulation').textContent='Tilbake til simulatoren'; if(simulationFeedback) renderSimulationFeedback(simulationFeedback); else renderSimulationThread(); return;
  }
  simulationSource='current';
  setBreadcrumb('Lagret samtale'); showView('guidance');
}
function startNewConversation(force=false){
  if(!requireLogin()) return;
  const hasContent=Boolean(document.querySelector('#situation')?.value.trim());
  const unsaved=hasContent && (!currentUser || document.querySelector('#temporary-chat')?.checked || conversationDirty);
  if(unsaved && !force){ const msg=document.querySelector('#discard-message'); msg.textContent=currentUser?'Denne samtalen er ikke lagret. Hvis du fortsetter, kan den ikke gjenopprettes.':'Denne samtalen er ikke lagret og kan ikke gjenopprettes. Logg inn dersom du vil lagre historikk.'; document.querySelector('#discard-dialog').showModal(); return; }
  resetConversationState(); currentConversationId=null; conversationDirty=false; setBreadcrumb(''); showView('home');
}
function openLegal(which){ legalReturnView=Object.entries(views).find(([,el])=>el.classList.contains('active-view'))?.[0]||'home'; closeAuth(); setBreadcrumb(which==='privacy'?'Personvern':'Bruksvilkår'); showView(which); }

function openInfoView(which){
  infoReturnView=Object.entries(views).find(([,el])=>el.classList.contains('active-view'))?.[0]||'home';
  if(which==='contact' && infoReturnView==='contact') infoReturnView='home';
  if(which==='about' && infoReturnView==='about') infoReturnView='home';
  closeProfileMenu();
  setBreadcrumb(which==='about'?'Om Samtalestøtte':'Kontakt og tilbakemelding');
  showView(which);
}

async function loadPublicConfig(){
  try{
    const r=await fetch('/api/public-config');
    if(r.ok) publicConfig={...publicConfig,...await r.json()};
  }catch(_){}
  const version=publicConfig.appVersion||'19.1.0';
  const v1=document.querySelector('#about-app-version'), meta=document.querySelector('#report-meta');
  if(v1) v1.textContent=version; if(meta) meta.textContent=`Versjon ${version}`;
  const status=document.querySelector('#contact-email-status'), link=document.querySelector('#contact-email-link');
  if(publicConfig.contactEmail){
    status.innerHTML=`E-post: <strong>${escapeHtml(publicConfig.contactEmail)}</strong>`;
    link.href=`mailto:${encodeURIComponent(publicConfig.contactEmail)}`; link.hidden=false;
  }else{
    status.textContent='Kontaktadresse er ikke konfigurert ennå. Prosjekteier kan legge CONTACT_EMAIL i .env.';
    if(link) link.hidden=true;
  }
}

function buildFeedbackText(){
  const category=document.querySelector('#report-category')?.value||'Tilbakemelding';
  const description=document.querySelector('#report-description')?.value.trim()||'';
  return `Samtalestøtte – ${category}\nVersjon: ${publicConfig.appVersion||'19.1.0'}\nNettleser: ${navigator.userAgent}\n\nBeskrivelse:\n${description}`;
}

function closeProfileMenu(){
  const menu=document.querySelector('#profile-menu');
  const button=document.querySelector('#profile-button');
  if(menu) menu.hidden=true;
  if(button) button.setAttribute('aria-expanded','false');
}

document.querySelector('#profile-button')?.addEventListener('click',(event)=>{
  event.stopPropagation();
  if(!currentUser) return openAuth('login');
  const m=document.querySelector('#profile-menu');
  m.hidden=!m.hidden;
  document.querySelector('#profile-button').setAttribute('aria-expanded',String(!m.hidden));
});
document.querySelector('#profile-menu')?.addEventListener('click',event=>event.stopPropagation());
document.addEventListener('click',()=>closeProfileMenu());
document.addEventListener('keydown',event=>{if(event.key==='Escape') closeProfileMenu();});
document.querySelector('[data-profile-action="history"]')?.addEventListener('click',()=>{closeProfileMenu();openHistory();});
document.querySelector('[data-profile-action="about"]')?.addEventListener('click',()=>openInfoView('about'));
document.querySelector('[data-profile-action="contact"]')?.addEventListener('click',()=>openInfoView('contact'));
document.querySelector('[data-profile-action="logout"]')?.addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST'});currentUser=null;currentConversationId=null;updateAuthUi();closeProfileMenu();showView('home');openAuth('login',true);});
document.querySelector('#auth-close')?.addEventListener('click',closeAuth); document.querySelector('#show-register')?.addEventListener('click',()=>openAuth('register')); document.querySelector('#show-login')?.addEventListener('click',()=>openAuth('login'));
document.querySelector('#auth-dialog')?.addEventListener('click',event=>{if(event.target===event.currentTarget) closeAuth();});
document.querySelector('#auth-dialog')?.addEventListener('cancel',event=>{if(!currentUser){event.preventDefault();openAuth('login',true);}});
document.querySelector('#history-login-button')?.addEventListener('click',()=>openAuth('login')); document.querySelector('#back-from-history')?.addEventListener('click',()=>showView('home'));
document.querySelectorAll('[data-open-legal]').forEach(b=>b.addEventListener('click',()=>openLegal(b.dataset.openLegal))); document.querySelectorAll('.legal-back').forEach(b=>b.addEventListener('click',()=>showView(legalReturnView)));
document.querySelectorAll('[data-open-info]').forEach(b=>b.addEventListener('click',()=>openInfoView(b.dataset.openInfo)));
document.querySelectorAll('.info-back').forEach(b=>b.addEventListener('click',()=>showView(infoReturnView)));
document.querySelector('#report-from-conversation')?.addEventListener('click',()=>{openInfoView('contact'); const c=document.querySelector('#report-category'); if(c)c.value='Uklart eller dårlig KI-svar';});
document.querySelector('#login-form')?.addEventListener('submit',async e=>{e.preventDefault();const msg=document.querySelector('#login-message');msg.textContent='';const r=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:document.querySelector('#login-email').value,password:document.querySelector('#login-password').value})});const p=await r.json();if(!r.ok){msg.className='auth-message error';msg.textContent=p.message||'Innlogging feilet.';return;}currentUser=p.user;updateAuthUi();closeAuth();await saveCurrentConversation();});
document.querySelector('#register-form')?.addEventListener('submit',async e=>{e.preventDefault();const msg=document.querySelector('#register-message');msg.textContent='';const pw=document.querySelector('#register-password').value;if(pw!==document.querySelector('#register-password-confirm').value){msg.className='auth-message error';msg.textContent='Passordene er ikke like.';return;}const r=await fetch('/api/auth/register',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:document.querySelector('#register-username').value,email:document.querySelector('#register-email').value,password:pw,inviteCode:document.querySelector('#register-invite').value})});const p=await r.json();if(!r.ok){msg.className='auth-message error';msg.textContent=p.message||'Kunne ikke opprette konto.';return;}currentUser=p.user;updateAuthUi();closeAuth();await saveCurrentConversation();});
document.querySelector('#new-conversation-button')?.addEventListener('click',()=>startNewConversation());
document.querySelector('#result-new-conversation')?.addEventListener('click',()=>startNewConversation());
document.querySelector('#bottom-new-conversation')?.addEventListener('click',()=>startNewConversation());
document.querySelector('#history-new-conversation')?.addEventListener('click',()=>startNewConversation()); document.querySelector('#cancel-new-chat')?.addEventListener('click',()=>document.querySelector('#discard-dialog').close()); document.querySelector('#confirm-new-chat')?.addEventListener('click',()=>{document.querySelector('#discard-dialog').close();startNewConversation(true);});
document.querySelector('#delete-account-button')?.addEventListener('click',async()=>{if(!confirm('Slette kontoen og all lagret historikk? Dette kan ikke angres.'))return;const r=await fetch('/api/account',{method:'DELETE'});if(r.ok){currentUser=null;currentConversationId=null;updateAuthUi();startNewConversation(true);}});
document.querySelector('#delete-all-history')?.addEventListener('click',async()=>{if(!confirm('Slette all samtalehistorikk?'))return;await fetch('/api/history',{method:'DELETE'});openHistory();});
document.querySelector('#temporary-chat')?.addEventListener('change',e=>{conversationDirty=true;if(!e.target.checked) saveCurrentConversation();});
document.querySelector('#report-form')?.addEventListener('submit',e=>{
  e.preventDefault(); const msg=document.querySelector('#report-message');
  if(!document.querySelector('#report-description')?.value.trim()){msg.className='auth-message error';msg.textContent='Beskriv kort hva som skjedde først.';return;}
  if(!publicConfig.contactEmail){msg.className='auth-message error';msg.textContent='Kontaktadresse er ikke konfigurert ennå.';return;}
  const subject=`Samtalestøtte: ${document.querySelector('#report-category').value}`;
  location.href=`mailto:${encodeURIComponent(publicConfig.contactEmail)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildFeedbackText())}`;
});
document.querySelector('#copy-report-button')?.addEventListener('click',async()=>{
  const msg=document.querySelector('#report-message');
  try{await navigator.clipboard.writeText(buildFeedbackText());msg.className='auth-message ok';msg.textContent='Rapporten er kopiert.';}catch(_){msg.className='auth-message error';msg.textContent='Kunne ikke kopiere automatisk.';}
});


const simulationStyleLabels = {
  open: 'Åpen og samarbeidsvillig',
  uncertain: 'Usikker og tilbaketrukket',
  defensive: 'Defensiv og uenig',
  emotional: 'Følelsesmessig berørt',
  critical: 'Frustrert og kritisk',
  surprise: 'Overrask meg'
};

const simulationFidelityLabels = {
  factual: 'Hold deg til saken',
  challenge: 'Utfordre meg'
};

function updateSimulationFidelityNote() {
  const note = document.querySelector('#simulation-fidelity-note');
  if (!note) return;
  note.innerHTML = simulationFidelity === 'challenge'
    ? '<strong>Utfordre meg:</strong> Nye opplysninger er en del av rollespillet og skal behandles som simulerte – ikke som fakta om den virkelige saken.'
    : '<strong>Hold deg til saken:</strong> Medarbeideren kan være uenig, følelsesmessig, kritisk eller stille, men skal markere usikkerhet når et faktum ikke finnes i saken.';
}

function setSimulationChoice(groupSelector, attr, value) {
  document.querySelectorAll(groupSelector).forEach(button => {
    button.classList.toggle('selected', button.dataset[attr] === value);
  });
}

function hasCurrentSimulationContext() {
  return Boolean((document.querySelector('#situation')?.value.trim()) && (lastAiGuidance || lastAiAnalysis));
}

function refreshSimulationHub() {
  // v19.8: Simulatorhuben har to faste innganger.
  // Øving fra en eksisterende samtale startes fortsatt via «Øv på samtalen» i rådsvisningen.
  document.querySelector('.simulation-launch-grid')?.classList.add('two-options');
}

function resetSimulationPanel() {
  simulationTurns = [];
  simulationFeedback = null;
  simulationFidelity = 'factual';
  simulationMode = 'solo';
  simulationStyle = 'open';
  const simTemporary = document.querySelector('#simulation-temporary');
  if (simTemporary) simTemporary.checked = false;
  const panel = document.querySelector('#simulation-panel');
  const setup = document.querySelector('#simulation-setup');
  const live = document.querySelector('#simulation-live');
  const feedback = document.querySelector('#simulation-feedback');
  if (panel) panel.hidden = false;
  if (setup) setup.hidden = false;
  if (live) live.hidden = true;
  if (feedback) feedback.hidden = true;
  document.querySelector('#simulation-help')?.setAttribute('hidden','');
  document.querySelector('#simulation-help-result')?.setAttribute('hidden','');
  document.querySelector('#simulation-live')?.classList.remove('expanded');
  const expandButton = document.querySelector('#toggle-simulation-size');
  if (expandButton) { expandButton.textContent = 'Utvid samtalen'; expandButton.setAttribute('aria-pressed','false'); }
  const simInput = document.querySelector('#simulation-input');
  if (simInput) simInput.value = '';
  document.querySelector('#simulation-turn-privacy')?.setAttribute('hidden','');
  setSimulationChoice('[data-sim-fidelity]', 'simFidelity', simulationFidelity);
  setSimulationChoice('[data-sim-mode]', 'simMode', simulationMode);
  updateSimulationFidelityNote();
  setSimulationChoice('[data-sim-style]', 'simStyle', simulationStyle);
  renderSimulationThread();
}

function openSimulationHub() {
  if(!requireLogin()) return;
  setBreadcrumb('Samtalesimulering');
  showView('simulation');
  const hub = document.querySelector('#simulation-hub');
  const panel = document.querySelector('#simulation-panel');
  if (hub) hub.hidden = false;
  if (panel) panel.hidden = true;
  const directForm = document.querySelector('#direct-simulation-form');
  if (directForm) directForm.hidden = true;
  refreshSimulationHub();
}

function openSimulation() {
  if(!requireLogin()) return;
  if (!hasCurrentSimulationContext()) return;
  simulationSource = 'current';
  simulationDirectSituation = '';
  setBreadcrumb('Samtalesimulering · eksisterende samtale');
  showView('simulation');
  const hub = document.querySelector('#simulation-hub');
  if (hub) hub.hidden = true;
  const panel = document.querySelector('#simulation-panel');
  if (panel) panel.hidden = false;
  const close = document.querySelector('#close-simulation');
  if (close) close.textContent = 'Tilbake til rådene';
  const setup = document.querySelector('#simulation-setup');
  const live = document.querySelector('#simulation-live');
  const feedback = document.querySelector('#simulation-feedback');
  setup.hidden = Boolean(simulationTurns.length || simulationFeedback);
  live.hidden = true;
  feedback.hidden = !simulationFeedback;
  if (simulationFeedback) renderSimulationFeedback(simulationFeedback);
  else if (simulationTurns.length) {
    live.hidden = false;
    document.querySelector('#toggle-simulation-help').hidden = simulationMode !== 'assisted';
    const topic = currentSubtopic || currentTopic?.title || 'Samtale';
    document.querySelector('#simulation-status').textContent = `${topic} · ${simulationFidelityLabels[simulationFidelity]} · ${simulationStyleLabels[simulationStyle]}`;
    renderSimulationThread();
  }
  setSimulationChoice('[data-sim-fidelity]', 'simFidelity', simulationFidelity);
  setSimulationChoice('[data-sim-mode]', 'simMode', simulationMode);
  updateSimulationFidelityNote();
  setSimulationChoice('[data-sim-style]', 'simStyle', simulationStyle);
}

function closeSimulation() {
  if (simulationSource === 'current' && hasCurrentSimulationContext()) {
    setBreadcrumb(currentSubtopic || currentTopic?.title || 'Samtale');
    showView('guidance');
    document.querySelector('#simulation-entry')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  openSimulationHub();
}

function openDirectSimulationSetup() {
  simulationSource = 'direct';
  simulationDirectSituation = '';
  const form = document.querySelector('#direct-simulation-form');
  if (!form) return;
  form.hidden = false;
  document.querySelector('#direct-simulation-situation')?.focus();
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showDirectSimulationPrivacy(findings) {
  const box = document.querySelector('#direct-simulation-privacy');
  if (!box) return;
  const { hard, soft } = splitPrivacyFindings(findings);
  if (!hard.length && !soft.length) {
    box.hidden = true;
    box.innerHTML = '';
    return;
  }
  box.hidden = false;
  if (hard.length) {
    box.className = 'privacy-check warning blocking';
    box.innerHTML = `<strong>Fjern dette før øvelsen:</strong><ul>${hard.map(item => `<li><b>${escapeHtml(item.label)}</b> – ${escapeHtml(item.message)}</li>`).join('')}</ul>`;
  } else {
    box.className = 'privacy-check warning advisory';
    box.innerHTML = `<strong>Vurder å generalisere litt mer</strong><ul>${soft.map(item => `<li><b>${escapeHtml(item.label)}</b> – ${escapeHtml(item.message)}</li>`).join('')}</ul><small>Dette er en anbefaling og hindrer ikke at du starter øvelsen.</small>`;
  }
}

function beginDirectSimulation() {
  if(!requireLogin()) return;
  const input = document.querySelector('#direct-simulation-situation');
  const text = input?.value.trim() || '';
  if (!text) return;
  const findings = detectSensitiveInfo(text);
  showDirectSimulationPrivacy(findings);
  if (splitPrivacyFindings(findings).hard.length) return;
  simulationSource = 'direct';
  simulationDirectSituation = text;
  currentConversationId = null;
  resetSimulationPanel();
  document.querySelector('#simulation-hub').hidden = true;
  document.querySelector('#close-simulation').textContent = 'Tilbake til simulatoren';
  setBreadcrumb('Samtalesimulering · ny øvelse');
  document.querySelector('#simulation-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function simulationContext() {
  const direct = simulationSource === 'direct';
  return {
    situation: direct ? simulationDirectSituation : (document.querySelector('#situation')?.value.trim() || ''),
    analysis: direct ? null : lastAiAnalysis,
    followups: direct ? {} : collectFollowupAnswers(),
    guidance: direct ? null : lastAiGuidance,
    fidelity: simulationFidelity,
    mode: simulationMode,
    style: simulationStyle,
    turns: simulationTurns
  };
}

function renderSimulationThread() {
  const thread = document.querySelector('#simulation-thread');
  if (!thread) return;
  const intro = '<div class="simulation-coach-note">Du starter samtalen. Skriv det du faktisk ville sagt til medarbeideren.</div>';
  const turns = simulationTurns.map(turn => {
    const leader = turn.role === 'leader';
    return `<div class="simulation-bubble-row ${leader ? 'leader-row' : 'employee-row'}">
      ${leader ? '' : '<div class="simulation-avatar employee-avatar" aria-hidden="true"><img src="profile-ai.png" alt="" /></div>'}
      <div class="simulation-bubble ${leader ? 'leader-bubble' : 'employee-bubble'}">
        <span>${leader ? 'Du · leder' : 'Medarbeider · KI'}</span>
        <p>${escapeHtml(turn.text)}</p>
      </div>
      ${leader ? '<div class="simulation-avatar leader-avatar" aria-hidden="true"><img src="profile-human.png" alt="" /></div>' : ''}
    </div>`;
  }).join('');
  thread.innerHTML = intro + turns;
  thread.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function startSimulation() {
  simulationTurns = [];
  simulationFeedback = null;
  document.querySelector('#simulation-setup').hidden = true;
  document.querySelector('#simulation-feedback').hidden = true;
  document.querySelector('#simulation-live').hidden = false;
  document.querySelector('#simulation-help').hidden = true;
  document.querySelector('#simulation-help-result').hidden = true;
  const helpButton = document.querySelector('#toggle-simulation-help');
  helpButton.hidden = simulationMode !== 'assisted';
  const topic = simulationSource === 'direct' ? 'Ny simulering' : (currentSubtopic || currentTopic?.title || 'Samtale');
  document.querySelector('#simulation-status').textContent = `${topic} · ${simulationFidelityLabels[simulationFidelity]} · ${simulationStyleLabels[simulationStyle]}`;
  renderSimulationThread();
  document.querySelector('#simulation-input')?.focus();
  conversationDirty = true;
}

async function readJsonResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const raw = await response.text();
  if (!contentType.includes('application/json')) {
    throw new Error(response.status === 404
      ? 'Simulator-ruten finnes ikke på serveren. Start serveren på nytt etter oppdateringen.'
      : 'Serveren svarte i feil format. Prøv å starte serveren på nytt.');
  }
  try { return raw ? JSON.parse(raw) : {}; }
  catch (_) { throw new Error('Serveren returnerte et ugyldig svar.'); }
}

async function submitSimulationTurn(text) {
  const cleaned = text.trim();
  if (!cleaned) return;
  simulationTurns.push({ role: 'leader', text: cleaned });
  renderSimulationThread();
  const thread = document.querySelector('#simulation-thread');
  const waiting = document.createElement('div');
  waiting.className = 'simulation-bubble-row employee-row simulation-waiting';
  waiting.innerHTML = '<div class="simulation-avatar employee-avatar" aria-hidden="true"><img src="profile-ai.png" alt="" /></div><div class="simulation-bubble employee-bubble"><span>Medarbeider · KI</span><div class="conversation-thinking"><span class="thinking-spinner" aria-hidden="true"></span><p>Tenker …</p></div></div>';
  thread.appendChild(waiting);
  waiting.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  try {
    const response = await fetch('/api/simulation-turn', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simulationContext())
    });
    const payload = await readJsonResponse(response);
    if (!response.ok) throw new Error(payload.message || 'Simulatoren kunne ikke svare.');
    simulationTurns.push({ role: 'employee', text: payload.reply || '' });
    conversationDirty = true;
    renderSimulationThread();
    await saveCurrentConversation();
  } catch (error) {
    waiting.remove();
    const note = document.createElement('div');
    note.className = 'simulation-coach-note error-note';
    note.textContent = error.message || 'Simulatoren kunne ikke svare akkurat nå.';
    thread.appendChild(note);
  }
}

async function requestSimulationHelp(kind) {
  const result = document.querySelector('#simulation-help-result');
  result.hidden = false;
  result.innerHTML = '<div class="conversation-thinking"><span class="thinking-spinner" aria-hidden="true"></span><p>Finner et kort forslag …</p></div>';
  try {
    const response = await fetch('/api/simulation-help', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...simulationContext(), kind })
    });
    const payload = await readJsonResponse(response);
    if (!response.ok) throw new Error(payload.message || 'Kunne ikke hente hjelp.');
    result.innerHTML = `<p>${escapeHtml(payload.help || '')}</p>`;
  } catch (error) {
    result.textContent = error.message || 'Kunne ikke hente hjelp akkurat nå.';
  }
}

function renderSimulationFeedback(feedback) {
  const content = document.querySelector('#simulation-feedback-content');
  const list = items => (items || []).map(item => `<li>${escapeHtml(item)}</li>`).join('');
  content.innerHTML = `
    <article><h4>Dette fungerte godt</h4><ul>${list(feedback.worked_well)}</ul></article>
    <article><h4>Dette kunne vært tydeligere</h4><ul>${list(feedback.could_be_clearer)}</ul></article>
    <article><h4>En formulering du kan prøve</h4><p>${escapeHtml(feedback.alternative_phrase || '')}</p></article>
    <article><h4>Ta med deg dette</h4><p>${escapeHtml(feedback.takeaway || '')}</p></article>`;
}

async function endSimulation() {
  if (!simulationTurns.some(turn => turn.role === 'leader')) {
    document.querySelector('#simulation-input')?.focus();
    return;
  }
  const live = document.querySelector('#simulation-live');
  const feedbackPanel = document.querySelector('#simulation-feedback');
  live.hidden = true;
  feedbackPanel.hidden = false;
  const content = document.querySelector('#simulation-feedback-content');
  content.innerHTML = '<div class="conversation-thinking"><span class="thinking-spinner" aria-hidden="true"></span><p>Ser gjennom øvelsen …</p></div>';
  try {
    const response = await fetch('/api/simulation-feedback', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(simulationContext())
    });
    const payload = await readJsonResponse(response);
    if (!response.ok) throw new Error(payload.message || 'Kunne ikke lage tilbakemelding.');
    simulationFeedback = payload;
    renderSimulationFeedback(payload);
    conversationDirty = true;
    await saveCurrentConversation();
  } catch (error) {
    content.innerHTML = `<div class="simulation-coach-note error-note">${escapeHtml(error.message || 'Kunne ikke lage tilbakemelding akkurat nå.')}</div>`;
  }
}

document.querySelector('#open-simulation')?.addEventListener('click', openSimulation);
document.querySelector('#simulation-new-direct')?.addEventListener('click', openDirectSimulationSetup);
document.querySelector('#simulation-history')?.addEventListener('click', openHistory);
document.querySelector('#cancel-direct-simulation')?.addEventListener('click', () => { document.querySelector('#direct-simulation-form').hidden = true; showDirectSimulationPrivacy([]); });
document.querySelector('#direct-simulation-form')?.addEventListener('submit', event => { event.preventDefault(); beginDirectSimulation(); });
document.querySelector('#close-simulation')?.addEventListener('click', closeSimulation);
document.querySelectorAll('[data-sim-fidelity]').forEach(button => button.addEventListener('click', () => {
  simulationFidelity = button.dataset.simFidelity;
  setSimulationChoice('[data-sim-fidelity]', 'simFidelity', simulationFidelity);
  updateSimulationFidelityNote();
}));
document.querySelectorAll('[data-sim-mode]').forEach(button => button.addEventListener('click', () => {
  simulationMode = button.dataset.simMode;
  setSimulationChoice('[data-sim-fidelity]', 'simFidelity', simulationFidelity);
  setSimulationChoice('[data-sim-mode]', 'simMode', simulationMode);
  updateSimulationFidelityNote();
}));
document.querySelectorAll('[data-sim-style]').forEach(button => button.addEventListener('click', () => {
  simulationStyle = button.dataset.simStyle;
  setSimulationChoice('[data-sim-style]', 'simStyle', simulationStyle);
}));
document.querySelector('#start-simulation')?.addEventListener('click', startSimulation);
function updateSimulationTurnPrivacy() {
  const input = document.querySelector('#simulation-input');
  const box = document.querySelector('#simulation-turn-privacy');
  const submit = document.querySelector('#simulation-submit');
  if (!input || !box) return [];
  const text = input.value;
  const findings = detectSensitiveInfo(text);
  const { hard, soft } = splitPrivacyFindings(findings);
  const hasText = Boolean(text.trim());
  input.setAttribute('aria-invalid', hard.length ? 'true' : 'false');
  if (submit) submit.disabled = !hasText || hard.length > 0;
  if (!hasText || (!hard.length && !soft.length)) {
    box.hidden = true;
    box.innerHTML = '';
    return findings;
  }
  const visible = hard.length ? hard : soft;
  box.hidden = false;
  box.className = `privacy-check simulation-turn-privacy warning ${hard.length ? 'blocking' : 'advisory'}`;
  box.innerHTML = hard.length
    ? `<strong>Kan ikke sendes ennå</strong><span>Jeg fant opplysninger som må anonymiseres først:</span><ul class="privacy-findings">${visible.map(item => `<li><b>${escapeHtml(item.label)}:</b> ${escapeHtml(item.message)}</li>`).join('')}</ul><div class="privacy-fix-actions"><button type="button" class="secondary-button compact-fix-button" id="simulation-privacy-fix">Fiks personvern</button><small>Les gjennom teksten før du sender.</small></div>`
    : `<strong>Kan dette anonymiseres litt mer?</strong><span>Disse detaljene kan gjøre personen lettere å kjenne igjen. Du kan sende likevel, eller generalisere dem først:</span><ul class="privacy-findings">${visible.map(item => `<li><b>${escapeHtml(item.label)}:</b> ${escapeHtml(item.message)}</li>`).join('')}</ul><div class="privacy-fix-actions"><button type="button" class="secondary-button compact-fix-button" id="simulation-privacy-fix">Generaliser forslag</button><small>Dette er en anbefaling, ikke en blokkering.</small></div>`;
  box.querySelector('#simulation-privacy-fix')?.addEventListener('click', () => {
    input.value = autoFixPrivacyText(input.value, findings);
    updateSimulationTurnPrivacy();
    input.focus();
  });
  return findings;
}

document.querySelector('#simulation-form')?.addEventListener('submit', async event => {
  event.preventDefault();
  if(!requireLogin()) return;
  const input = document.querySelector('#simulation-input');
  const text = input.value;
  const findings = updateSimulationTurnPrivacy();
  if (splitPrivacyFindings(findings).hard.length || !text.trim()) return;
  input.value = '';
  updateSimulationTurnPrivacy();
  await submitSimulationTurn(text);
});
document.querySelector('#simulation-input')?.addEventListener('input', updateSimulationTurnPrivacy);
document.querySelector('#simulation-input')?.addEventListener('keydown', event => {
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
  event.preventDefault();
  const input = event.currentTarget;
  if (!input.value.trim()) return;
  const findings = updateSimulationTurnPrivacy();
  if (splitPrivacyFindings(findings).hard.length) return;
  input.form?.requestSubmit();
});
document.querySelector('#toggle-simulation-help')?.addEventListener('click', () => {
  const help = document.querySelector('#simulation-help');
  help.hidden = !help.hidden;
});
document.querySelectorAll('[data-sim-help]').forEach(button => button.addEventListener('click', () => requestSimulationHelp(button.dataset.simHelp)));
document.querySelector('#toggle-simulation-size')?.addEventListener('click', () => {
  const live = document.querySelector('#simulation-live');
  const button = document.querySelector('#toggle-simulation-size');
  if (!live || !button) return;
  const expanded = live.classList.toggle('expanded');
  button.textContent = expanded ? 'Normal størrelse' : 'Utvid samtalen';
  button.setAttribute('aria-pressed', String(expanded));
});
document.querySelector('#end-simulation')?.addEventListener('click', endSimulation);
document.querySelector('#end-simulation-top')?.addEventListener('click', endSimulation);
document.querySelector('#retry-simulation')?.addEventListener('click', startSimulation);
document.querySelector('#simulation-new-conversation')?.addEventListener('click', () => startNewConversation());

const inviteFromUrl=new URLSearchParams(location.search).get('invite'); if(inviteFromUrl){document.querySelector('#register-invite').value=inviteFromUrl;openAuth('register',true);}
refreshAuth().finally(()=>{ if(inviteFromUrl) history.replaceState(null,'',location.pathname); });
loadPublicConfig();

window.addEventListener('resize', () => {
  if (!localStorage.getItem('samtalestotte-sidebar')) applySidebarState();
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((localStorage.getItem('samtalestotte-theme') || 'hybrid') === 'system') applyTheme('system');
});


window.addEventListener('pageshow', () => {
  resetConversationState();
  setBreadcrumb('');
  showView('home');
});
