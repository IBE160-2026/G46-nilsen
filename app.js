const { svgIcons, topics } = window.SamtalestotteClientData || {};
if (!svgIcons || !topics) throw new Error("Mangler Samtalestøtte-klientdata.");

let lastAiAnalysis = null;
let lastAiGuidance = null;
let currentUser = null;
let deferredInstallPrompt = null;
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
let publicConfig = { appVersion: "20.10.10", contactEmail: "" };
let contentOverrides = {};
let loadedHistoryItem = null;
let surveySubmitting = false;
const clientErrorLog = [];

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
  contact: document.querySelector('#contact-view'),
  help: document.querySelector('#help-view'),
  survey: document.querySelector('#survey-view'),
  admin: document.querySelector('#admin-view')
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
  const adminIcon=document.querySelector('#nav-admin-icon'); if(adminIcon) adminIcon.textContent='A';
  setSvg('sidebar-message-icon', svgIcons.team);
  setSvg('mobile-nav-home-icon', svgIcons.home);
  setSvg('mobile-nav-history-icon', svgIcons.history);
  setSvg('mobile-nav-settings-icon', svgIcons.settings);

  const pageIconMap = {
    settings: svgIcons.settings,
    history: svgIcons.history,
    about: svgIcons.about,
    contact: svgIcons.contact,
    privacy: svgIcons.shieldCheck,
    terms: svgIcons.scales
  };
  document.querySelectorAll('.collapsed-page-icon[data-page-icon]').forEach(icon => {
    const key = icon.dataset.pageIcon;
    if (pageIconMap[key]) icon.innerHTML = pageIconMap[key];
  });
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
      (name === 'contact' && btn.dataset.view === 'contact') ||
      (name === 'help' && btn.dataset.view === 'help') ||
      (name === 'survey' && btn.dataset.view === 'survey') ||
      (name === 'admin' && btn.dataset.view === 'admin')
    );
  });
}

function clearDocumentSelection() {
  const selection = window.getSelection?.();
  if (selection?.rangeCount) selection.removeAllRanges();
}

function showView(name) {
  clearDocumentSelection();
  Object.values(views).forEach(view => view.classList.remove('active-view'));
  views[name].classList.add('active-view');
  updateNavState(name);
  const topNew = document.querySelector('#new-conversation-button');
  if (topNew) topNew.hidden = name === 'home';

  // Sekundærsider med accordion skal alltid åpne ryddig, med alle seksjoner lukket.
  if (['settings', 'admin', 'help'].includes(name)) {
    views[name].querySelectorAll('details[open]').forEach(detail => { detail.open = false; });
  }

  requestAnimationFrame(clearDocumentSelection);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


function setHistoryLoadedGuidanceMode(active, situation = '') {
  const view = document.querySelector('#guidance-view');
  const summary = document.querySelector('#history-loaded-situation');
  const text = document.querySelector('#history-loaded-situation-text');
  if (!view || !summary || !text) return;
  view.classList.toggle('history-loaded-mode', Boolean(active));
  summary.hidden = !active;
  text.textContent = active ? String(situation || '').trim() : '';
}

function clearGuidanceSession({ clearInputs = true } = {}) {
  setHistoryLoadedGuidanceMode(false);
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
    const temporaryChat = document.querySelector('#temporary-chat');
    if (temporaryChat) temporaryChat.checked = false;
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
  pendingSituationText = '';

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
    <strong>${escapeHtml(contentValue(`topic.${topic.id}.title`, topic.title))}</strong>
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
  document.querySelector('#topic-title').textContent = contentValue(`topic.${topic.id}.title`, topic.title);
  document.querySelector('#topic-description').textContent = contentValue(`topic.${topic.id}.description`, topic.description);
  document.querySelector('#topic-page-icon').innerHTML = svgIcons[topic.iconKey];
  document.querySelector('#topic-representations').innerHTML = topic.representations
    .map((item,index) => `<span class="representation-chip">${escapeHtml(contentValue(`topic.${topic.id}.representation.${index}`, item))}</span>`).join('');

  const topicHeroImage = document.querySelector('.topic-hero-visual img');
  if (topicHeroImage) {
    topicHeroImage.src = topic.image || 'assets/images/hero-conversation-exact.png';
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
  topic.subtopics.forEach(([title, help], index) => {
    const displayTitle = contentValue(`topic.${topic.id}.subtopic.${index}.title`, title);
    const displayHelp = contentValue(`topic.${topic.id}.subtopic.${index}.help`, help);
    const button = document.createElement('button');
    button.className = 'subtopic-card';
    button.dataset.searchText = `${displayTitle} ${displayHelp}`.toLowerCase();
    button.innerHTML = `<strong>${escapeHtml(displayTitle)}</strong><p>${escapeHtml(displayHelp)}</p>`;
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
  const subIndex=currentTopic?.subtopics?.findIndex(([subTitle])=>subTitle===title) ?? -1;
  const displayTopic=contentValue(`topic.${currentTopic.id}.title`, currentTopic.title);
  const displayTitle=subIndex>=0?contentValue(`topic.${currentTopic.id}.subtopic.${subIndex}.title`,title):title;
  const displayHelp=subIndex>=0?contentValue(`topic.${currentTopic.id}.subtopic.${subIndex}.help`,help):help;
  document.querySelector('#guidance-title').textContent = `${displayTopic}: ${displayTitle}`;
  document.querySelector('#guidance-help').textContent = displayHelp;
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


const privacyNameDetector = window.SamtalestottePrivacyDetector;
if (!privacyNameDetector) throw new Error('Personvernmodulen for navnedeteksjon mangler.');
const { findLikelyGivenName, findLikelyGivenNames } = privacyNameDetector;


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
  const ageNumber = "(?:[1-9]|[1-9]\\d|1[01]\\d|120)";
  const explicitAge = new RegExp(
    "\\b(?:(?:er|var|blir|fyller)\\s+" + ageNumber + "\\s*år(?:\\s+gammel)?|" +
    ageNumber + "\\s*år\\s+gammel|" +
    ageNumber + "[-\\s]?åring(?:en)?|" +
    "alder(?:en)?(?:\\s+er|\\s+på)?\\s*" + ageNumber + "|" +
    "(?:medarbeider(?:en)?|ansatt(?:en)?|person(?:en)?|leder(?:en)?|kollega(?:en)?)\\s+på\\s+" + ageNumber + "\\s*år)\\b",
    "i"
  );
  if (explicitAge.test(source)) {
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

  const likelyNames = findLikelyGivenNames(source);
  likelyNames.forEach(likelyName => {
    findings.push({
      type: 'name',
      label: `Mulig personnavn: «${likelyName}»`,
      message: 'Fjern navnet og bruk for eksempel «medarbeideren», «kollegaen» eller «lederen».'
    });
  });
  if (/\b(?:han|hun|ham|henne|hans|hennes)\b/iu.test(source)) {
    add('gendered_language', 'Kjønnet pronomen', 'Bruk en kjønnsnøytral formulering, for eksempel «hen» eller «medarbeideren».');
  }
  if (/\b[A-ZÆØÅ][a-zæøå]+(?:gate|gata|veien|vegen|allé|stien)\s+\d+[A-Za-z]?\b/.test(source)) {
    add('address', 'Mulig gateadresse', 'Fjern konkret adresse eller stedsopplysning som kan identifisere personen.');
  }

  return findings;
}


const HARD_PRIVACY_TYPES = new Set(['email', 'phone', 'birthdate', 'identifier', 'name', 'address', 'gendered_language']);

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
    fixed = fixed.replace(new RegExp(`(?<![\\p{L}\\p{N}_])${name}(?![\\p{L}\\p{N}_])`, 'giu'), 'medarbeideren');
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


function privacySummaryHtml(findings, { title = 'Personvernsjekk', blocking = true } = {}) {
  const { hard, soft } = splitPrivacyFindings(findings);
  const visible = hard.length ? hard : soft;
  if (!visible.length) return `<strong>${escapeHtml(title)}</strong><span>Ingen tydelige personopplysninger er oppdaget i teksten.</span>`;
  return `<strong>${escapeHtml(title)}</strong><span>${blocking && hard.length ? 'Dette må anonymiseres før teksten sendes til KI:' : 'Vurder om dette kan generaliseres:'}</span><ul class="privacy-findings">${visible.map(item => `<li><b>${escapeHtml(item.label)}:</b> ${escapeHtml(item.message)}</li>`).join('')}</ul>`;
}
function collectFollowupPrivacyFindings() {
  const inputs = [...document.querySelectorAll('[data-followup-custom-input]')].filter(input => !input.hidden && input.value.trim());
  return inputs.flatMap(input => detectSensitiveInfo(input.value).map(item => ({ ...item, input })));
}
function updateFollowupPrivacy() {
  const box = document.querySelector('#followup-privacy');
  if (!box) return [];
  const findings = collectFollowupPrivacyFindings();
  const { hard } = splitPrivacyFindings(findings);
  if (!findings.length) { box.hidden = true; box.innerHTML = ''; return []; }
  box.hidden = false;
  box.className = `privacy-check warning ${hard.length ? 'blocking' : 'advisory'}`;
  box.innerHTML = privacySummaryHtml(findings, { title: 'Personvernsjekk', blocking: true }) + `<div class="privacy-fix-actions"><button type="button" class="secondary-button compact-fix-button" id="followup-privacy-fix">Fiks personvern</button><small>Kontrollen gjelder fritekstsvarene før de sendes til KI.</small></div>`;
  box.querySelector('#followup-privacy-fix')?.addEventListener('click', () => {
    const byInput = new Map();
    findings.forEach(item => { if (item.input) { if (!byInput.has(item.input)) byInput.set(item.input, []); byInput.get(item.input).push(item); } });
    byInput.forEach((items, input) => { input.value = autoFixPrivacyText(input.value, items); });
    updateFollowupPrivacy();
  });
  return findings;
}

async function requestTopicClassification(situation, selectedTopicId = '') {
  const response = await fetch('/api/classify-topic', {
    method: 'POST',
    credentials: 'include',
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
  const sourceLabel = classification?.confidence === 'local' ? 'Samtalestøtte foreslo' : 'KI foreslo';
  text.innerHTML = `<strong>${sourceLabel} ${escapeHtml(topic.title)} → ${escapeHtml(subtopic[0])}</strong><span>${confidenceText}. ${escapeHtml(classification?.reason || '')}</span>`;
  note.hidden = false;
}

function hideAutoTopicNote() {
  const note = document.querySelector('#auto-topic-note');
  if (note) note.hidden = true;
}

function scrollFinderResultIntoView(box, inputSelector = '') {
  const input = inputSelector ? document.querySelector(inputSelector) : null;
  input?.blur();
  requestAnimationFrame(() => {
    box?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function openGuidanceAndGetAdvice(topic, subtopic, situation, classification = null) {
  currentTopic = topic;
  highlightTopicCard(topic.id);
  openGuidance(subtopic[0], subtopic[1], situation);
  if (classification) showAutoTopicNote(topic, subtopic, classification);

  requestAnimationFrame(() => {
    const field = document.querySelector('#situation');
    field?.blur();
    requestAnimationFrame(() => {
      document.querySelector('#situation-form')?.requestSubmit();
    });
  });
}

function renderConfirmedTopicSuggestion(box, topic, subtopic, classification, situation, inputSelector = '') {
  box.hidden = false;
  box.className = 'topic-suggestion ai-topic-suggestion';
  box.innerHTML = `
    <span class="suggestion-kicker">Foreslått tema</span>
    <strong>${escapeHtml(topic.title)} <span aria-hidden="true">→</span> ${escapeHtml(subtopic[0])}</strong>
    <p>${escapeHtml(classification.reason || subtopic[1] || 'Dette ser ut til å passe best med det du beskrev.')}</p>
    <div class="suggestion-actions">
      <button class="primary-button" type="button" data-get-advice-now>Få råd</button>
      <button class="ghost-button" type="button" data-review-topic>Se andre undertemaer</button>
    </div>
  `;

  box.querySelector('[data-get-advice-now]')?.addEventListener('click', () => {
    openGuidanceAndGetAdvice(topic, subtopic, situation, classification);
  });
  box.querySelector('[data-review-topic]')?.addEventListener('click', () => {
    currentTopic = topic;
    highlightTopicCard(topic.id);
    openTopic(topic);
  });
  scrollFinderResultIntoView(box, inputSelector);
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
      openGuidanceAndGetAdvice(topic, subtopic, situation, { ...classification, confidence: 'low', reason: 'Du valgte temaet etter KI-forslaget.' });
    });
  });

  scrollFinderResultIntoView(box);
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
  scrollFinderResultIntoView(box, inputId);

  try {
    const classification = await requestTopicClassification(situation, selectedTopicId);
    const topic = topics.find(item => item.id === classification.primary_topic_id);
    const subtopic = topicSubtopicByTitle(topic, classification.primary_subtopic);
    if (!topic || !subtopic) throw new Error('Ugyldig tema fra KI.');

    if (classification.confidence === 'low') {
      renderLowConfidenceTopicChoice(box, classification, situation);
      return;
    }

    // Høy/middels sikkerhet: vis ett tydelig forslag og la hovedhandlingen gå direkte til rådet.
    renderConfirmedTopicSuggestion(box, topic, subtopic, classification, situation, inputId);
  } catch (error) {
    console.warn('KI-temaforslag feilet, bruker lokal reserve:', error);
    if (selectedTopicId && currentTopic) renderSubtopicSuggestion(situation);
    else renderSuggestion(situation);
    const fallbackBox = document.querySelector(boxId);
    if (fallbackBox) {
      fallbackBox.insertAdjacentHTML('afterbegin', '<span class="suggestion-kicker">Lokal reserve</span>');
      scrollFinderResultIntoView(fallbackBox, inputId);
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
    credentials: 'include',
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
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ situation, analysis, followups, topicId: currentTopic?.id || '', subtopic: currentSubtopic || '' })
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
    ['Faglig / regelverk', String(guidance.legal_hr_note || '').split(/\n+/).filter(Boolean).map(line => `• ${escapeHtml(line.replace(/^[-•]\s*/,''))}`).join('<br>')],
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
  if (intro) intro.textContent = 'KI-rådet er generert fra denne konkrete situasjonen og avklaringssvarene dine. Sensitive eller formelle punkter bør kvalitetssikres mot relevante kilder, virksomhetens rutiner og riktig fagkompetanse før en endelig beslutning tas.';
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
      updateFollowupPrivacy();
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
function speechBubbleMarkup(side='left'){
  return `<svg class="speech-bubble-shape" data-side="${side}" aria-hidden="true" focusable="false"><g><path></path></g></svg>`;
}

function speechBubblePath(width, bodyHeight){
  const r = 26;
  const tailH = 26;
  const attachStart = 30;
  const attachEnd = 52;
  const tipOffset = 24;
  const right = width;
  const bottom = bodyHeight;
  const tipX = tipOffset;

  return [
    `M ${r} 0`,
    `H ${right-r}`,
    `Q ${right} 0 ${right} ${r}`,
    `V ${bottom-r}`,
    `Q ${right} ${bottom} ${right-r} ${bottom}`,
    `H ${attachEnd}`,
    `C ${attachEnd-5} ${bottom+1}, ${tipX+15} ${bottom+15}, ${tipX} ${bottom+tailH}`,
    `C ${tipX+10} ${bottom+15}, ${attachStart+7} ${bottom+2}, ${attachStart} ${bottom}`,
    `H ${r}`,
    `Q 0 ${bottom} 0 ${bottom-r}`,
    `V ${r}`,
    `Q 0 0 ${r} 0`,
    'Z'
  ].join(' ');
}

function layoutSpeechBubble(bubble){
  const svg = bubble?.querySelector(':scope > .speech-bubble-shape');
  if (!svg) return;
  const width = Math.max(120, Math.round(bubble.clientWidth));
  const bodyHeight = Math.max(54, Math.round(bubble.clientHeight));
  const tailH = 26;
  const path = svg.querySelector('path');
  const group = svg.querySelector('g');
  svg.setAttribute('viewBox', `0 0 ${width} ${bodyHeight + tailH}`);
  svg.style.width = `${width}px`;
  svg.style.height = `${bodyHeight + tailH}px`;
  path.setAttribute('d', speechBubblePath(width, bodyHeight));
  group.setAttribute('transform', svg.dataset.side === 'right' ? `translate(${width} 0) scale(-1 1)` : '');
}

function refreshSpeechBubbles(root=document){
  root.querySelectorAll?.('.simulation-bubble,.conversation-turn').forEach(layoutSpeechBubble);
}

function queueSpeechBubbleRefresh(){
  requestAnimationFrame(() => refreshSpeechBubbles(document));
}

window.addEventListener('resize', queueSpeechBubbleRefresh);




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
  const followupPrivacy = updateFollowupPrivacy();
  if (splitPrivacyFindings(followupPrivacy).hard.length) {
    document.querySelector('#followup-privacy')?.scrollIntoView({ behavior:'smooth', block:'center' });
    return;
  }
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
  markGuidanceUsed();
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
    return 'Det kan være en sensitiv vurdering. Jeg kan hjelpe deg med samtaleformen og med å skille fakta fra antakelser, men en konkret juridisk vurdering av beslutningen bør kvalitetssikres mot relevant arbeidsrettslig/juridisk kompetanse og gjeldende regelverk før du kommuniserer en endelig konklusjon.';
  }
  return 'Jeg kan ikke tolke dette oppfølgingsspørsmålet sikkert med den lokale reserveflyten. Jeg vil derfor ikke gjette eller hente inn råd fra en annen type sak. Prøv gjerne et av hurtigvalgene, eller spør mer konkret om reaksjoner, formuleringer, hva du bør unngå å si eller hvordan du kan svare på en bestemt innvending. Når ekte KI kobles på, skal den bruke hele den aktuelle saken og svarene dine som kontekst.';
}


function cleanStoredSituationText(text) {
  let value = String(text || '').replace(/\r/g, '').trim();
  // Enkel bakoverkompatibilitet: enkelte eldre lagringer kunne få med knappeteksten «Få råd».
  value = value.replace(/^(?:Få råd\s*)+/i, '').trim();
  return value;
}

function cleanStoredConversationText(text, role='assistant') {
  let value = String(text || '').replace(/\r/g, '').trim();

  // Historiske lagringer kunne inneholde UI-tekst fra hele boblen.
  // Fjern kun kjente UI-rester i starten, og kun når de står som prefiks.
  value = value.replace(/^(?:svg\s*)+/i, '').trim();

  if (role === 'user') {
    value = value.replace(/^(?:(?:Du)\s*){1,8}/i, '').trim();
  } else {
    value = value.replace(/^(?:(?:Samtalestøtte|SAMTALESTØTTE)\s*){1,8}/i, '').trim();
  }

  value = value.replace(/^(?:svg\s*)+/i, '').trim();
  return value;
}

function setConversationTurnText(element, role, text) {
  if (!element) return;
  element.dataset.messageText = cleanStoredConversationText(text, role);
}

function getConversationTurnText(element) {
  if (!element) return '';
  const role = element.classList.contains('conversation-user') ? 'user' : 'assistant';

  // Ny løsning: bruk eksplisitt råtekst som aldri inneholder etikett/SVG.
  if (typeof element.dataset.messageText === 'string' && element.dataset.messageText.trim()) {
    return cleanStoredConversationText(element.dataset.messageText, role);
  }

  // Bakoverkompatibilitet for gamle DOM-elementer: les bare meldingsnoden.
  const messageNode = role === 'user'
    ? element.querySelector(':scope > p')
    : element.querySelector(':scope > .formatted-reply');

  return cleanStoredConversationText(messageNode?.textContent || '', role);
}

async function appendConversationTurn(question) {
  const privacyFindings = detectSensitiveInfo(question);
  if (splitPrivacyFindings(privacyFindings).hard.length) {
    const input = document.querySelector('#continue-input');
    if (input) {
      input.value = question;
      updateContinuePrivacy();
      input.focus();
    }
    return false;
  }
  const thread = document.querySelector('#conversation-thread');
  if (!thread || !question.trim()) return;
  const user = document.createElement('div');
  user.className = 'conversation-turn conversation-user';
  user.innerHTML = `${speechBubbleMarkup('right')}<span>Du</span><p>${escapeHtml(question)}</p>`;
  setConversationTurnText(user, 'user', question);
  const assistant = document.createElement('div');
  assistant.className = 'conversation-turn conversation-assistant';
  assistant.innerHTML = `${speechBubbleMarkup('left')}<span>Samtalestøtte</span><div class="conversation-thinking"><span class="thinking-spinner" aria-hidden="true"></span><p>Tenker på svaret ditt …</p></div>`;
  thread.append(user, assistant);
  queueSpeechBubbleRefresh();
  assistant.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  try {
    if (!lastAiAnalysis) throw new Error('Ingen aktiv KI-kontekst.');
    const response = await fetch('/api/continue-conversation', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        situation: document.querySelector('#situation')?.value.trim() || '',
        analysis: lastAiAnalysis,
        followups: collectFollowupAnswers(),
        guidance: lastAiGuidance,
        question,
        topicId: currentTopic?.id || '',
        subtopic: currentSubtopic || ''
      })
    });
    if (!response.ok) throw new Error('KI-oppfølgingen kunne ikke gjennomføres.');
    const payload = await response.json();
    const assistantReply = cleanStoredConversationText(payload.reply || '', 'assistant');
    assistant.innerHTML = `${speechBubbleMarkup('left')}<span>Samtalestøtte</span><div class="formatted-reply">${formatContinuationReply(assistantReply)}</div><button type="button" class="ai-report-link" data-report-ai-response="continuation">Rapporter svar</button>`;
    setConversationTurnText(assistant, 'assistant', assistantReply);
    queueSpeechBubbleRefresh();
    conversationDirty = true;
    await saveCurrentConversation();
  } catch (_) {
    const reply = buildContinuationReply(question);
    assistant.innerHTML = `${speechBubbleMarkup('left')}<span>Samtalestøtte</span><div class="formatted-reply">${formatContinuationReply(reply)}</div><small>Lokal reserve</small>`;
    setConversationTurnText(assistant, 'assistant', reply);
    queueSpeechBubbleRefresh();
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
          <button class="primary-button" type="button" id="open-suggested-guidance">Få råd</button>
          <button class="ghost-button" type="button" id="review-suggested-topic">Se andre undertemaer</button>
          ${alternatives}
        </div>
      `;
      box.querySelector('#open-suggested-guidance').addEventListener('click', () => openGuidanceAndGetAdvice(best.topic, bestSubtopic.subtopic, trimmed, { confidence: 'local', reason: 'Temaet er foreslått av reserveflyten.' }));
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

  scrollFinderResultIntoView(box, '#topic-search');
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
      <button class="primary-button" type="button" id="open-suggested-subtopic">Få råd</button>
    </div>
  `;
  box.querySelector('#open-suggested-subtopic').addEventListener('click', () => openGuidanceAndGetAdvice(currentTopic, best.subtopic, query, { confidence: 'local', reason: 'Undertemaet er foreslått av reserveflyten.' }));

  scrollFinderResultIntoView(box, '#topic-detail-search');
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
  const mobileThemeIcon=document.querySelector('#mobile-theme-icon');
  const mobileThemeLabel=document.querySelector('#mobile-theme-label');
  const mobileThemeButton=document.querySelector('#mobile-theme-cycle');
  const themeMeta={
    hybrid:{icon:'◒',label:'Hybrid'},
    dark:{icon:'☾',label:'Mørkt'},
    light:{icon:'☀',label:'Lyst'},
    system:{icon:'◐',label:'System'}
  };
  const meta=themeMeta[theme]||themeMeta.hybrid;
  if(mobileThemeIcon) mobileThemeIcon.textContent=meta.icon;
  if(mobileThemeLabel) mobileThemeLabel.textContent=meta.label;
  if(mobileThemeButton) mobileThemeButton.setAttribute('aria-label', 'Bytt fargetema. Nå: '+meta.label);
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

const sidebarNarrowQuery = window.matchMedia('(max-width: 1100px)');

function applySidebarState() {
  const storedCollapsed = localStorage.getItem('samtalestotte-sidebar') === 'collapsed';

  if (sidebarNarrowQuery.matches) {
    setSidebarCollapsed(true);
    return;
  }

  setSidebarCollapsed(storedCollapsed);
}

function toggleSidebar() {
  const sidebar = document.querySelector('#sidebar');
  const collapsed = !sidebar.classList.contains('sidebar-collapsed');
  setSidebarCollapsed(collapsed);

  if (!sidebarNarrowQuery.matches) {
    localStorage.setItem('samtalestotte-sidebar', collapsed ? 'collapsed' : 'expanded');
  }
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
document.querySelector('#mobile-theme-cycle')?.addEventListener('click', () => {
  const current=localStorage.getItem('samtalestotte-theme') || 'hybrid';
  const order=['hybrid','dark','light'];
  const next=order[(Math.max(0,order.indexOf(current))+1)%order.length];
  applyTheme(next);
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
    if (button.dataset.view === 'help') {
      infoReturnView=Object.entries(views).find(([,el])=>el.classList.contains('active-view'))?.[0]||'home';
      closeProfileMenu();
      setBreadcrumb('Hjelp');
      showView('help');
    }
    if (button.dataset.view === 'survey') {
      openSurvey();
    }
    if (button.dataset.view === 'admin') {
      openAdmin();
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
    const authProblem = error.code === 'AUTH_REQUIRED';
    note.innerHTML = authProblem
      ? `<strong>Innloggingen må fornyes.</strong><span>${escapeHtml(error.message)}</span>${details}`
      : `<strong>KI-kallet kunne ikke gjennomføres.</strong><span>${escapeHtml(error.message)} Den lokale reserveflyten vises midlertidig.</span>${details}`;
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



function ensureContinuePrivacyBox() {
  let box = document.querySelector('#continue-privacy');
  if (box) return box;
  const form = document.querySelector('#continue-form');
  if (!form) return null;
  box = document.createElement('div');
  box.id = 'continue-privacy';
  box.className = 'privacy-check simulation-turn-privacy';
  box.hidden = true;
  form.insertAdjacentElement('beforebegin', box);
  return box;
}

function updateContinuePrivacy() {
  const input = document.querySelector('#continue-input');
  const box = ensureContinuePrivacyBox();
  if (!input || !box) return [];
  const findings = detectSensitiveInfo(input.value);
  const { hard, soft } = splitPrivacyFindings(findings);
  const visible = hard.length ? hard : soft;

  input.setAttribute('aria-invalid', hard.length ? 'true' : 'false');

  if (!input.value.trim() || !visible.length) {
    box.hidden = true;
    box.innerHTML = '';
    return findings;
  }

  box.hidden = false;
  box.className = `privacy-check simulation-turn-privacy warning ${hard.length ? 'blocking' : 'advisory'}`;
  box.innerHTML = hard.length
    ? `<strong>Kan ikke sendes ennå</strong><span>Jeg fant opplysninger som må anonymiseres først:</span><ul class="privacy-findings">${visible.map(item => `<li><b>${escapeHtml(item.label)}:</b> ${escapeHtml(item.message)}</li>`).join('')}</ul><div class="privacy-fix-actions"><button type="button" class="secondary-button compact-fix-button" id="continue-privacy-fix">Fiks personvern</button><small>Les gjennom teksten før du sender.</small></div>`
    : `<strong>Kan dette anonymiseres litt mer?</strong><span>Disse detaljene kan gjøre personen lettere å kjenne igjen. Du kan sende likevel, eller generalisere dem først:</span><ul class="privacy-findings">${visible.map(item => `<li><b>${escapeHtml(item.label)}:</b> ${escapeHtml(item.message)}</li>`).join('')}</ul><div class="privacy-fix-actions"><button type="button" class="secondary-button compact-fix-button" id="continue-privacy-fix">Generaliser forslag</button></div>`;

  box.querySelector('#continue-privacy-fix')?.addEventListener('click', () => {
    input.value = autoFixPrivacyText(input.value, findings);
    updateContinuePrivacy();
    input.focus();
  });
  return findings;
}

document.querySelector('#continue-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const input = document.querySelector('#continue-input');
  const value = input.value.trim();
  if (!value) return;
  const findings = updateContinuePrivacy();
  if (splitPrivacyFindings(findings).hard.length) return;
  appendConversationTurn(value);
  input.value = '';
  updateContinuePrivacy();
  input.focus();
});

document.querySelector('#continue-input')?.addEventListener('input', updateContinuePrivacy);

document.querySelector('#continue-input')?.addEventListener('keydown', event => {
  if (event.key !== 'Enter' || event.shiftKey || event.isComposing) return;
  event.preventDefault();
  document.querySelector('#continue-form')?.requestSubmit();
});

document.querySelectorAll('.continue-chip').forEach(button => {
  button.addEventListener('click', () => appendConversationTurn(button.textContent.trim()));
});



function formatInlineReplyMarkdown(text) {
  let safe = escapeHtml(String(text || ''));

  // Noen KI-svar kan inneholde escapet markdown. Normaliser bare tegnene vi støtter.
  safe = safe
    .replace(/\\\*/g, '*')
    .replace(/\\:/g, ':');

  // Begrenset inline-Markdown: fet tekst.
  safe = safe.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  return safe;
}

function formatContinuationReply(text) {
  const normalized = cleanStoredConversationText(text, 'assistant').replace(/\r/g, '');
  const lines = normalized.split('\n');
  let html = ''; let listOpen = false; let sectionOpen = false;
  const closeList = () => { if (listOpen) { html += '</ul>'; listOpen = false; } };
  const closeSection = () => { closeList(); if (sectionOpen) { html += '</div>'; sectionOpen = false; } };

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { closeList(); continue; }

    const heading = line.match(/^(?:#{1,4}\s*)?(\d+)[.)]?\s*(.+)$/);
    const hashHeading = line.match(/^#{1,4}\s+(.+)$/);

    if (heading || hashHeading) {
      closeSection();
      sectionOpen = true;
      const headingText = heading ? `${heading[1]}. ${heading[2]}` : hashHeading[1];
      html += `<div class="reply-section"><h4>${formatInlineReplyMarkdown(headingText)}</h4>`;
      continue;
    }

    if (/^[-•]\s+/.test(line)) {
      if (!listOpen) { html += '<ul>'; listOpen = true; }
      html += `<li>${formatInlineReplyMarkdown(line.replace(/^[-•]\s+/, ''))}</li>`;
      continue;
    }

    closeList();
    if (/^>\s*/.test(line)) {
      html += `<blockquote>${formatInlineReplyMarkdown(line.replace(/^>\s*/, ''))}</blockquote>`;
    } else {
      html += `<p>${formatInlineReplyMarkdown(line)}</p>`;
    }
  }

  closeSection();
  return html || '<p>Ingen tekst.</p>';
}

function initialsFor(username='') {
  const parts=String(username).trim().split(/\s+/).filter(Boolean); if(!parts.length) return '○';
  return parts.slice(0,2).map(x=>x[0].toUpperCase()).join('');
}
function updateAuthUi() {
  const name=document.querySelector('#profile-name'), note=document.querySelector('#profile-note'), avatar=document.querySelector('#profile-avatar');
  const histNote=document.querySelector('#history-nav-note'), temp=document.querySelector('#temporary-chat-option');
  const status=document.querySelector('#settings-account-status'), del=document.querySelector('#delete-account-button'), exp=document.querySelector('#export-account-data');
  if(currentUser){ name.textContent=currentUser.username; note.textContent=currentUser.role==='admin'?'Administrator':currentUser.role==='editor'?'Redaktør':'Historikk aktiv'; avatar.textContent=initialsFor(currentUser.username); if(histNote) histNote.textContent=''; if(temp) temp.hidden=false; if(status) status.textContent=`Logget inn som ${currentUser.username}.`; if(del) del.hidden=false; if(exp) exp.hidden=false; }
  else { name.textContent='Logg på'; note.textContent='for historikk'; avatar.textContent='○'; if(histNote) histNote.textContent='logg inn'; if(temp) temp.hidden=true; if(status) status.textContent='Du er ikke logget inn. Samtaler lagres ikke permanent.'; if(del) del.hidden=true; if(exp) exp.hidden=true; }
  document.querySelectorAll('.admin-only').forEach(el=>{el.hidden=!['editor','admin'].includes(currentUser?.role||'user');});
}
function setAppLocked(locked){
  const shell=document.querySelector('.app-shell');
  if(!shell) return;
  if(locked){
    shell.setAttribute('inert','');
    shell.setAttribute('aria-hidden','true');
  }else{
    shell.removeAttribute('inert');
    shell.removeAttribute('aria-hidden');
  }
}
async function refreshAuth() {
  try { const r=await fetch('/api/auth/me',{credentials:'include',cache:'no-store'}); const p=await r.json(); currentUser=p.user||null; } catch(_) { currentUser=null; }
  updateAuthUi();
  if(currentUser)setTimeout(ensurePrivacyAcknowledgement,150);
  if(currentUser){
    closeAuth(true);
    setAppLocked(false);
  }else{
    setAppLocked(true);
  }
}
function openAuth(mode='login', required = !currentUser) {
  const dlg=document.querySelector('#auth-dialog'); if(!dlg) return;
  const panels={
    login:document.querySelector('#login-panel'),
    register:document.querySelector('#register-panel'),
    forgot:document.querySelector('#forgot-password-panel'),
    reset:document.querySelector('#reset-password-panel')
  };
  Object.entries(panels).forEach(([key,panel])=>{ if(panel) panel.hidden=key!==mode; });
  const mustLogin=Boolean(required && !currentUser);
  dlg.classList.toggle('required-auth', mustLogin);
  const intro=document.querySelector('#login-intro');
  if(intro && mode==='login') intro.textContent='Logg inn med en eksisterende brukerprofil. Har du en invitasjonskode, kan du opprette konto.';
  dlg.hidden=false;
  document.body.classList.add('auth-open');
  if(mustLogin) setAppLocked(true);
  requestAnimationFrame(()=>{
    const targets={
      login:'#login-email',
      register:'#register-username',
      forgot:'#forgot-password-email',
      reset:'#reset-password'
    };
    document.querySelector(targets[mode]||'#login-email')?.focus();
  });
}
function closeAuth(force=false){
  const dlg=document.querySelector('#auth-dialog');
  if(!dlg || dlg.hidden) return;
  if(!force && !currentUser && dlg.classList.contains('required-auth')) return;
  dlg.hidden=true;
  document.body.classList.remove('auth-open');
  if(currentUser) setAppLocked(false);
}
function requireLogin() {
  if (currentUser) return true;
  openAuth('login', true);
  return false;
}
function getConversationTurns(){
  return [...document.querySelectorAll('#conversation-thread .conversation-turn')]
    .map(el => {
      const role = el.classList.contains('conversation-user') ? 'user' : 'assistant';
      return { role, text: getConversationTurnText(el) };
    })
    .filter(turn => turn.text);
}
async function saveCurrentConversation(){
  const directSimulation = simulationSource === 'direct' && simulationDirectSituation && simulationTurns.length;
  if(!currentUser || document.querySelector('#temporary-chat')?.checked || document.querySelector('#simulation-temporary')?.checked || (!lastAiGuidance && !directSimulation)) return;
  const situation=directSimulation ? simulationDirectSituation : (document.querySelector('#situation')?.value.trim()||''); if(!situation) return;
  try{
    const r=await fetch('/api/history',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({
      id:currentConversationId,title:(directSimulation ? `Samtaleøvelse: ${situation.slice(0,55)}` : (currentSubtopic||currentTopic?.title||situation.slice(0,70))),topic:directSimulation?'Samtaleøvelse':(currentTopic?.title||''),subtopic:directSimulation?'Direkte øvelse':(currentSubtopic||''),situation,analysis:directSimulation?null:lastAiAnalysis,guidance:directSimulation?null:lastAiGuidance,conversation:directSimulation?[]:getConversationTurns(),simulation:{fidelity:simulationFidelity,mode:simulationMode,style:simulationStyle,turns:simulationTurns,feedback:simulationFeedback}
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
  try{ const r=await fetch('/api/history',{credentials:'include',cache:'no-store'}); const p=await r.json(); renderHistory(p.items||[]); }catch(_){ list.innerHTML='<div class="history-empty">Kunne ikke hente historikken.</div>'; }
}
function renderHistory(items){
  const list=document.querySelector('#history-list'); document.querySelector('#history-count').textContent=`${items.length} lagrede samtaler`;
  if(!items.length){ list.innerHTML='<div class="history-empty">Du har ingen lagrede samtaler ennå.</div>'; return; }
  list.innerHTML=items.map(item=>`<article class="history-item" data-history-id="${item.id}"><div class="history-item-top"><div><h3>${escapeHtml(item.title||'Samtale')}</h3><div class="history-meta">${escapeHtml([item.topic,item.subtopic].filter(Boolean).join(' · '))} · ${new Date(item.updatedAt).toLocaleDateString('nb-NO')}</div></div></div><div class="history-actions"><button class="primary-button" data-open-history="${item.id}" type="button">Åpne</button><button class="secondary-button" data-delete-history="${item.id}" type="button">Slett</button></div></article>`).join('');
  list.querySelectorAll('[data-open-history]').forEach(b=>b.addEventListener('click',()=>loadHistoryItem(items.find(x=>x.id===b.dataset.openHistory))));
  list.querySelectorAll('[data-delete-history]').forEach(b=>b.addEventListener('click',async()=>{if(!confirm('Slette denne samtalen?'))return;await fetch(`/api/history/${b.dataset.deleteHistory}`,{method:'DELETE'});openHistory();}));
}

function scanHistoryPrivacy(item) {
  const sources = [];
  if (item?.situation) sources.push({ where:'Situasjonsbeskrivelse', text:item.situation });
  (item?.conversation || []).filter(turn => turn.role === 'user').forEach((turn, index) => sources.push({ where:`Oppfølgingsmelding ${index + 1}`, text:turn.text }));
  (item?.simulation?.turns || []).filter(turn => turn.role === 'leader').forEach((turn, index) => sources.push({ where:`Simulator – ledermelding ${index + 1}`, text:turn.text }));
  return sources.flatMap(source => detectSensitiveInfo(source.text).map(finding => ({ ...finding, where:source.where })));
}
function hideHistoryPrivacyReview() {
  ['#history-privacy-review-guidance','#history-privacy-review-simulation'].forEach(selector => { const box=document.querySelector(selector); if(box){box.hidden=true;box.innerHTML='';} });
}
function renderHistoryPrivacyReview(item, target='guidance') {
  hideHistoryPrivacyReview();
  const findings = scanHistoryPrivacy(item);
  if (!findings.length) return;
  const box = document.querySelector(target === 'simulation' ? '#history-privacy-review-simulation' : '#history-privacy-review-guidance');
  if (!box) return;
  const visible = findings.slice(0,8);
  box.hidden = false;
  box.innerHTML = `<strong>Personvernsjekk av lagret samtale</strong><p>Denne historikken inneholder tekst som bør anonymiseres. Ingenting endres automatisk.</p><ul>${visible.map(item => `<li><b>${escapeHtml(item.where)}:</b> ${escapeHtml(item.label)}</li>`).join('')}</ul>${findings.length > visible.length ? `<p>+ ${findings.length - visible.length} flere funn.</p>` : ''}<div class="history-privacy-actions"><button type="button" class="primary-button" data-fix-history-privacy>Fiks personvern og lagre</button><button type="button" class="secondary-button" data-dismiss-history-privacy>La stå foreløpig</button></div>`;
  box.querySelector('[data-dismiss-history-privacy]')?.addEventListener('click', () => { box.hidden = true; });
  box.querySelector('[data-fix-history-privacy]')?.addEventListener('click', async () => {
    item.situation = autoFixPrivacyText(item.situation || '', detectSensitiveInfo(item.situation || ''));
    (item.conversation || []).forEach(turn => { if(turn.role === 'user') turn.text = autoFixPrivacyText(turn.text || '', detectSensitiveInfo(turn.text || '')); });
    (item.simulation?.turns || []).forEach(turn => { if(turn.role === 'leader') turn.text = autoFixPrivacyText(turn.text || '', detectSensitiveInfo(turn.text || '')); });
    loadHistoryItem(item, { skipPrivacyReview:true });
    conversationDirty = true;
    await saveCurrentConversation();
    hideHistoryPrivacyReview();
  });
}

function loadHistoryItem(item, { skipPrivacyReview = false } = {}){
  if(!item)return;
  clearDocumentSelection(); loadedHistoryItem=item; hideHistoryPrivacyReview(); clearGuidanceSession(); currentConversationId=item.id; lastAiAnalysis=item.analysis; lastAiGuidance=item.guidance; conversationDirty=false;
  currentTopic=topics.find(t=>t.title===item.topic)||currentTopic; currentSubtopic=item.subtopic||null;
  const storedSituation = cleanStoredSituationText(item.situation||'');
  document.querySelector('#situation').value=storedSituation; autoGrowTextarea(document.querySelector('#situation'),220); updatePrivacyCheck();
  if(lastAiAnalysis) renderAiSituationUnderstanding(lastAiAnalysis); if(lastAiGuidance){renderAiGuidance(lastAiGuidance);document.querySelector('#prototype-result').hidden=false;}
  const thread=document.querySelector('#conversation-thread');
  thread.innerHTML='';
  (item.conversation||[]).forEach(turn=>{
    const role=turn.role==='user'?'user':'assistant';
    const cleanText=cleanStoredConversationText(turn.text, role);
    if(!cleanText) return;
    const el=document.createElement('div');
    el.className=`conversation-turn ${role==='user'?'conversation-user':'conversation-assistant'}`;
    el.innerHTML=role==='user'
      ? `${speechBubbleMarkup('right')}<span>Du</span><p>${escapeHtml(cleanText)}</p>`
      : `${speechBubbleMarkup('left')}<span>Samtalestøtte</span><div class="formatted-reply">${formatContinuationReply(cleanText)}</div>`;
    setConversationTurnText(el, role, cleanText);
    thread.appendChild(el);
    queueSpeechBubbleRefresh();
  });
  simulationFidelity=item.simulation?.fidelity||'factual'; simulationMode=item.simulation?.mode||'solo'; simulationStyle=item.simulation?.style||'open'; simulationTurns=Array.isArray(item.simulation?.turns)?item.simulation.turns:[]; simulationFeedback=item.simulation?.feedback||null;
  if(!lastAiGuidance && simulationTurns.length){
    simulationSource='direct'; simulationDirectSituation=item.situation||''; setBreadcrumb('Lagret samtaleøvelse'); showView('simulation'); document.querySelector('#simulation-hub').hidden=true; document.querySelector('#simulation-panel').hidden=false; document.querySelector('#simulation-setup').hidden=true; document.querySelector('#simulation-live').hidden=Boolean(simulationFeedback); document.querySelector('#simulation-feedback').hidden=!simulationFeedback; document.querySelector('#close-simulation').textContent='Tilbake til øvelsen'; if(simulationFeedback) renderSimulationFeedback(simulationFeedback); else renderSimulationThread(); if(!skipPrivacyReview) renderHistoryPrivacyReview(item,'simulation'); return;
  }
  simulationSource='current';
  setHistoryLoadedGuidanceMode(true, storedSituation);
  setBreadcrumb('Lagret samtale'); showView('guidance');
  if(!skipPrivacyReview) renderHistoryPrivacyReview(item,'guidance');
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
  setBreadcrumb(which==='about'?'Om Samtalestøtte':which==='help'?'Hjelp':'Kontakt og tilbakemelding');
  showView(which);
}


const STATIC_CONTENT_SECTIONS = [
  {id:'home',title:'Forside',fields:[
    {key:'home.hero.eyebrow',label:'Overtekst',selector:'#home-view .hero-copy .eyebrow'},
    {key:'home.hero.title',label:'Hovedoverskrift',selector:'#home-view .hero-copy h1'},
    {key:'home.hero.intro',label:'Introduksjon',selector:'#home-view .hero-copy p',multiline:true},
    {key:'home.topics.title',label:'Temaoverskrift',selector:'#home-view .section-heading h2'},
    {key:'home.topics.intro',label:'Temabeskrivelse',selector:'#home-view .section-heading p',multiline:true}
  ]},
  {id:'topic',title:'Temaside',fields:[
    {key:'topic.finder.title',label:'Hva gjelder samtalen? – overskrift',selector:'#topic-view .topic-detail-finder h2'},
    {key:'topic.finder.intro',label:'Hva gjelder samtalen? – beskrivelse',selector:'#topic-view .topic-detail-finder p',multiline:true},
    {key:'topic.examples.title',label:'Eksempler innen temaet',selector:'#topic-view .subtopic-section h2'},
    {key:'topic.examples.intro',label:'Eksempler – beskrivelse',selector:'#topic-view .subtopic-section .section-heading p',multiline:true}
  ]},
  {id:'guidance',title:'Vanlig Samtalestøtte',fields:[
    {key:'guidance.understanding.title',label:'KI-oppsummering – overskrift',selector:'#situation-understanding h2'},
    {key:'guidance.followup.title',label:'Avklaring – overskrift',selector:'#followup-panel h2'},
    {key:'guidance.followup.intro',label:'Avklaring – beskrivelse',selector:'#followup-panel .followup-intro',multiline:true},
    {key:'guidance.result.title',label:'Samtalestøtte – overskrift',selector:'#prototype-result > .section-heading h2'},
    {key:'guidance.simulation.title',label:'Øvelse – overskrift',selector:'#simulation-entry h3'},
    {key:'guidance.simulation.intro',label:'Øvelse – beskrivelse',selector:'#simulation-entry p',multiline:true},
    {key:'guidance.continue.title',label:'Fortsett samtalen – overskrift',selector:'#continue-conversation h3'},
    {key:'guidance.continue.intro',label:'Fortsett samtalen – beskrivelse',selector:'#continue-conversation > p',multiline:true}
  ]},
  {id:'simulation',title:'Samtaleøvelse',fields:[
    {key:'simulation.hero.title',label:'Hovedoverskrift',selector:'#simulation-view .simulation-hero h1'},
    {key:'simulation.hero.intro',label:'Introduksjon',selector:'#simulation-view .simulation-hero p',multiline:true},
    {key:'simulation.hub.title',label:'Hvordan vil du starte?',selector:'#simulation-hub h2'},
    {key:'simulation.hub.intro',label:'Start – beskrivelse',selector:'#simulation-hub > p',multiline:true},
    {key:'simulation.direct.title',label:'Ny øvelse – overskrift',selector:'#direct-simulation-form h3'},
    {key:'simulation.direct.intro',label:'Ny øvelse – beskrivelse',selector:'#direct-simulation-form p',multiline:true},
    {key:'simulation.setup.title',label:'Øv på samtalen',selector:'#simulation-setup h3'},
    {key:'simulation.setup.intro',label:'Øv på samtalen – beskrivelse',selector:'#simulation-setup .simulation-stage-heading p',multiline:true},
    {key:'simulation.privacy.title',label:'Personvernsjekk – overskrift',selector:'#simulation-turn-privacy strong'},
    {key:'simulation.feedback.title',label:'Etter øvelsen – overskrift',selector:'#simulation-feedback h3'},
    {key:'simulation.feedback.intro',label:'Etter øvelsen – beskrivelse',selector:'#simulation-feedback .simulation-feedback-intro',multiline:true}
  ]},
  {id:'history',title:'Historikk',fields:[
    {key:'history.title',label:'Overskrift',selector:'#history-view h1'},
    {key:'history.intro',label:'Beskrivelse',selector:'#history-view .content-header p',multiline:true}
  ]},
  {id:'settings',title:'Innstillinger',fields:[
    {key:'settings.title',label:'Overskrift',selector:'#settings-view h1'},
    {key:'settings.intro',label:'Beskrivelse',selector:'#settings-view .content-header p',multiline:true}
  ]},
  {id:'about',title:'Om Samtalestøtte',fields:[
    {key:'about.title',label:'Overskrift',selector:'#about-view h1'},
    {key:'about.intro',label:'Introduksjon',selector:'#about-view .content-header p',multiline:true},
    {key:'about.project.title',label:'Studieprosjekt – overskrift',selector:'#about-view .about-grid .settings-card:last-child h2'},
    {key:'about.project.text',label:'Studieprosjekt – tekst',selector:'#about-view .about-grid .settings-card:last-child p',multiline:true}
  ]},
  {id:'contact',title:'Kontakt og tilbakemelding',fields:[
    {key:'contact.title',label:'Overskrift',selector:'#contact-view h1'},
    {key:'contact.intro',label:'Introduksjon',selector:'#contact-view .content-header p',multiline:true},
    {key:'contact.report.title',label:'Rapportskjema – overskrift',selector:'#report-form h2'},
    {key:'contact.email.title',label:'E-postkort – overskrift',selector:'#contact-view .contact-card h2'}
  ]},
  {id:'privacy',title:'Personvern og vilkår',fields:[
    {key:'privacy.title',label:'Personvern – overskrift',selector:'#privacy-view h1'},
    {key:'privacy.intro',label:'Personvern – introduksjon',selector:'#privacy-view .content-header p',multiline:true},
    {key:'terms.title',label:'Vilkår – overskrift',selector:'#terms-view h1'},
    {key:'terms.intro',label:'Vilkår – introduksjon',selector:'#terms-view .content-header p',multiline:true}
  ]}
];

function topicContentSections(){
  return topics.map(topic=>({id:`topic-${topic.id}`,title:`Tema: ${topic.title}`,fields:[
    {key:`topic.${topic.id}.title`,label:'Hovedtema – navn',kind:'topic',topicId:topic.id,prop:'title',fallback:topic.title},
    {key:`topic.${topic.id}.description`,label:'Hovedtema – beskrivelse',kind:'topic',topicId:topic.id,prop:'description',fallback:topic.description,multiline:true},
    ...topic.representations.map((value,index)=>({key:`topic.${topic.id}.representation.${index}`,label:`Kort beskrivelse ${index+1}`,kind:'representation',topicId:topic.id,index,fallback:value})),
    ...topic.subtopics.flatMap(([title,help],index)=>[
      {key:`topic.${topic.id}.subtopic.${index}.title`,label:`Undertema ${index+1} – navn`,kind:'subtopic-title',topicId:topic.id,index,fallback:title},
      {key:`topic.${topic.id}.subtopic.${index}.help`,label:`Undertema ${index+1} – beskrivelse`,kind:'subtopic-help',topicId:topic.id,index,fallback:help,multiline:true}
    ])
  ]}));
}
function allContentSections(){return [...STATIC_CONTENT_SECTIONS,...topicContentSections()];}
function allContentFields(){return allContentSections().flatMap(section=>section.fields);}
function contentValue(key,fallback=''){return Object.prototype.hasOwnProperty.call(contentOverrides,key)?contentOverrides[key]:fallback;}
function defaultContentValue(field){if('fallback' in field)return field.fallback;return document.querySelector(field.selector)?.textContent?.trim()||'';}
function applyContentOverrides(){
  STATIC_CONTENT_SECTIONS.flatMap(s=>s.fields).forEach(field=>{const el=document.querySelector(field.selector);if(el&&Object.prototype.hasOwnProperty.call(contentOverrides,field.key))el.textContent=contentOverrides[field.key];});
  renderTopics();
  if(currentTopic && views.topic?.classList.contains('active-view')) openTopic(currentTopic,pendingSituationText);
}
async function loadContentOverrides(){try{const response=await fetch('/api/content',{cache:'no-store'});if(response.ok){const payload=await response.json();contentOverrides=payload.values||{};applyContentOverrides();return payload;}}catch(_){}return{values:{},setupRequired:false};}
function renderAdminContentFields(){
  const host=document.querySelector('#admin-content-fields');if(!host)return;
  host.className='admin-content-fields admin-content-sections';
  host.innerHTML=allContentSections().map((section,sectionIndex)=>`<details class="admin-content-section" ${sectionIndex===0?'open':''}><summary><span>${escapeHtml(section.title)}</span><small>${section.fields.length} tekstfelt</small></summary><div class="admin-section-fields">${section.fields.map(field=>`<label class="admin-edit-field"><span>${escapeHtml(field.label)}</span><small>${escapeHtml(field.key)}</small><textarea data-admin-content-key="${escapeHtml(field.key)}" rows="${field.multiline?4:2}">${escapeHtml(contentValue(field.key,defaultContentValue(field)))}</textarea></label>`).join('')}</div></details>`).join('');
  host.querySelectorAll('[data-admin-content-key]').forEach(input=>input.addEventListener('input',markAdminDirty));
}
let adminContentDirty=false;
function markAdminDirty(){adminContentDirty=true;const badge=document.querySelector('#admin-unsaved-indicator');if(badge)badge.hidden=false;const save=document.querySelector('#admin-save-content');if(save)save.disabled=false;}
function clearAdminDirty(){adminContentDirty=false;const badge=document.querySelector('#admin-unsaved-indicator');if(badge)badge.hidden=true;const save=document.querySelector('#admin-save-content');if(save)save.disabled=true;}
async function saveAdminContent(){const msg=document.querySelector('#admin-content-message'),values={};document.querySelectorAll('[data-admin-content-key]').forEach(input=>{values[input.dataset.adminContentKey]=input.value.trim();});try{const response=await fetch('/api/admin/content',{method:'PUT',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({values})});const payload=await response.json();if(!response.ok)throw new Error(payload.message||'Kunne ikke lagre innholdet.');contentOverrides={...contentOverrides,...values};applyContentOverrides();clearAdminDirty();if(msg){msg.className='auth-message success';msg.textContent='Endringene er lagret og vises med en gang.';}}catch(error){if(msg){msg.className='auth-message error';msg.textContent=error.message;}}}
async function loadAdminUsers(){const card=document.querySelector('#admin-users-card'),list=document.querySelector('#admin-users-list');if(!card||!list)return;const isAdmin=currentUser?.role==='admin';card.hidden=!isAdmin;if(!isAdmin)return;list.innerHTML='<div class="history-empty">Henter brukere …</div>';try{const response=await fetch('/api/admin/users',{credentials:'include',cache:'no-store'});const payload=await response.json();if(!response.ok)throw new Error(payload.message||'Kunne ikke hente brukere.');list.innerHTML=(payload.users||[]).map(user=>`<div class="admin-user-row" data-admin-user="${escapeHtml(user.id)}"><div class="admin-user-copy"><strong>${escapeHtml(user.username||'Bruker')}</strong><small>${escapeHtml(user.email||'')}</small></div><select data-admin-role ${user.id===currentUser.id?'disabled':''}><option value="user" ${user.role==='user'?'selected':''}>Bruker</option><option value="editor" ${user.role==='editor'?'selected':''}>Redaktør</option><option value="admin" ${user.role==='admin'?'selected':''}>Admin</option></select><button class="secondary-button" type="button" data-save-admin-role ${user.id===currentUser.id?'disabled':''}>Lagre rolle</button></div>`).join('')||'<div class="history-empty">Ingen brukere funnet.</div>';list.querySelectorAll('[data-save-admin-role]').forEach(button=>button.addEventListener('click',async()=>{const row=button.closest('[data-admin-user]'),role=row.querySelector('[data-admin-role]').value;button.disabled=true;try{const r=await fetch(`/api/admin/users/${encodeURIComponent(row.dataset.adminUser)}/role`,{method:'PATCH',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({role})});const p=await r.json();if(!r.ok)throw new Error(p.message||'Kunne ikke endre rollen.');const msg=document.querySelector('#admin-users-message');if(msg){msg.className='auth-message success';msg.textContent=`Rollen er endret til ${role}.`;}}catch(error){const msg=document.querySelector('#admin-users-message');if(msg){msg.className='auth-message error';msg.textContent=error.message;}}finally{button.disabled=false;}}));}catch(error){list.innerHTML=`<div class="history-empty">${escapeHtml(error.message)}</div>`;}}
async function loadAdminFeedback(){const card=document.querySelector('#admin-feedback-card'),list=document.querySelector('#admin-feedback-list');if(!card||!list)return;const isAdmin=currentUser?.role==='admin';card.hidden=!isAdmin;if(!isAdmin)return;list.innerHTML='<div class="history-empty">Henter rapporterte svar …</div>';try{const r=await fetch('/api/admin/ai-feedback',{credentials:'include',cache:'no-store'});const p=await r.json();if(!r.ok)throw new Error(p.message||'Kunne ikke hente rapporterte svar.');list.innerHTML=(p.items||[]).map(item=>`<article class="admin-feedback-item"><div><strong>${escapeHtml(item.category||'Tilbakemelding')}</strong><small>${new Date(item.created_at).toLocaleString('nb-NO')} · ${escapeHtml(item.surface||'')}</small></div><p>${escapeHtml(item.comment||'')}</p>${item.include_conversation?`<details><summary>Vedlagt samtale</summary><pre class="admin-feedback-snapshot">${escapeHtml(JSON.stringify(item.conversation_snapshot||{},null,2))}</pre></details>`:'<small>Ingen samtale vedlagt.</small>'}</article>`).join('')||'<div class="history-empty">Ingen rapporterte KI-svar ennå.</div>';}catch(error){list.innerHTML=`<div class="history-empty">${escapeHtml(error.message)}</div>`;}}
async function loadAdminAiSettings(){const card=document.querySelector('#admin-ai-card');if(!card)return;const isAdmin=currentUser?.role==='admin';card.hidden=!isAdmin;if(!isAdmin)return;try{const r=await fetch('/api/admin/ai-settings',{credentials:'include',cache:'no-store'});const p=await r.json();if(!r.ok)throw new Error(p.message||'Kunne ikke hente modellvalg.');const select=document.querySelector('#admin-ai-model');select.innerHTML=(p.models||[]).map(m=>`<option value="${escapeHtml(m.id)}" ${m.id===p.activeModel?'selected':''}>${escapeHtml(m.label)} · ${escapeHtml(m.tier)} · $${m.inputPerMillion}/$${m.outputPerMillion} per 1M tokens</option>`).join('');}catch(error){const msg=document.querySelector('#admin-ai-model-message');msg.className='auth-message error';msg.textContent=error.message;}}
function formatUsd(value){return `$${Number(value||0).toFixed(3)}`;}
async function loadAdminAiUsage(){if(currentUser?.role!=='admin')return;try{const includeTests=Boolean(document.querySelector('#admin-usage-include-tests')?.checked);const r=await fetch(`/api/admin/ai-usage?includeTests=${includeTests?'1':'0'}`,{credentials:'include',cache:'no-store'});const p=await r.json();if(!r.ok)throw new Error(p.message||'Kunne ikke hente KI-bruk.');document.querySelector('#admin-cost-24h').textContent=formatUsd(p.summary?.cost24h);document.querySelector('#admin-cost-7d').textContent=formatUsd(p.summary?.cost7d);document.querySelector('#admin-cost-30d').textContent=formatUsd(p.summary?.cost30d);document.querySelector('#admin-calls-30d').textContent=String(p.summary?.calls30d||0);const domains=document.querySelector('#admin-source-domains');domains.innerHTML=(p.topDomains||[]).map(x=>`<div><span>${escapeHtml(x.name)}</span><strong>${x.count}</strong></div>`).join('')||'<small>Ingen webkilder registrert ennå.</small>';const queries=document.querySelector('#admin-source-queries');queries.innerHTML=(p.topQueries||[]).map(x=>`<div><span>${escapeHtml(x.name)}</span><strong>${x.count}</strong></div>`).join('')||'<small>Ingen søk registrert ennå.</small>';const pages=document.querySelector('#admin-source-pages');if(pages)pages.innerHTML=(p.topPages||[]).map(x=>`<div><span><a href="${escapeHtml(x.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(x.title||x.url)}</a><small>${escapeHtml(x.domain||'')}</small></span><strong>${x.count}</strong></div>`).join('')||'<small>Ingen konkrete kildesider registrert ennå.</small>';const recent=document.querySelector('#admin-ai-recent');recent.innerHTML=(p.recent||[]).slice(0,40).map(x=>`<div class="admin-usage-row"><div><strong>${escapeHtml(x.function_name||'KI-kall')}</strong><small>${new Date(x.created_at).toLocaleString('nb-NO')} · ${escapeHtml(x.model||'')}${x.is_test?' · TEST':''}${x.subtopic?` · ${escapeHtml(x.subtopic)}`:''}</small>${(x.web_search_queries||[]).length?`<small>Søk: ${escapeHtml((x.web_search_queries||[]).join(' | '))}</small>`:''}</div><div><span>${Number(x.total_tokens||0).toLocaleString('nb-NO')} tokens</span><strong>${formatUsd(x.estimated_cost_usd)}</strong>${x.web_search_used?`<small>${Number(x.web_search_call_count||1)} websøk</small>`:''}</div></div>`).join('')||'<small>Ingen KI-kall registrert ennå.</small>';}catch(error){const domains=document.querySelector('#admin-source-domains');if(domains)domains.innerHTML=`<small>${escapeHtml(error.message)}</small>`;}}

let benchmarkConfig=null;
let benchmarkStopRequested=false;
let benchmarkRunning=false;
function benchmarkSelectedModels(){return [...document.querySelectorAll('[data-benchmark-model]:checked')].map(x=>x.value);}
function benchmarkSelectCases(count){
  const all=benchmarkConfig?.cases||[]; if(count>=all.length)return all.slice();
  const grouped=new Map(); for(const c of all){if(!grouped.has(c.topicId))grouped.set(c.topicId,[]);grouped.get(c.topicId).push(c);}
  const selected=[]; let round=0; const groups=[...grouped.values()];
  while(selected.length<count){let added=false;for(const g of groups){if(g[round]&&selected.length<count){selected.push(g[round]);added=true;}}if(!added)break;round++;}
  return selected;
}
function renderBenchmarkSummary(results){
  const host=document.querySelector('#benchmark-summary');if(!host)return;
  const cost=results.reduce((a,r)=>a+Number(r.estimated_cost_usd||0),0),tokens=results.reduce((a,r)=>a+Number(r.input_tokens||0)+Number(r.output_tokens||0),0),web=results.reduce((a,r)=>a+Number(r.web_search_count||0),0),avg=results.length?results.reduce((a,r)=>a+Number(r.latency_ms||0),0)/results.length:0;
  host.innerHTML=`<div><small>Kjørte kall</small><strong>${results.length}</strong></div><div><small>Estimert kostnad</small><strong>${formatUsd(cost)}</strong></div><div><small>Tokens</small><strong>${tokens.toLocaleString('nb-NO')}</strong></div><div><small>Websøk / snittid</small><strong>${web} / ${(avg/1000).toFixed(1)} s</strong></div>`;
}
function renderBenchmarkResults(results){
  const host=document.querySelector('#benchmark-results');if(!host)return;
  const groups=new Map();for(const r of results){if(!groups.has(r.case_id))groups.set(r.case_id,[]);groups.get(r.case_id).push(r);}
  host.innerHTML=[...groups.values()].map(rows=>{const first=rows[0];return `<article class="benchmark-case-result"><h4>${escapeHtml(first.topic)} → ${escapeHtml(first.subtopic)} · ${escapeHtml(first.variant||'')}</h4><div class="benchmark-model-grid">${rows.map(r=>`<div class="benchmark-model-result"><h5>${escapeHtml((benchmarkConfig?.models||[]).find(m=>m.id===r.model)?.label||r.model)}</h5><div class="benchmark-metrics"><span>${Number(r.input_tokens||0)+Number(r.output_tokens||0)} tokens</span><span>${formatUsd(r.estimated_cost_usd)}</span><span>${Number(r.web_search_count||0)} websøk</span><span>${(Number(r.latency_ms||0)/1000).toFixed(1)} s</span></div><p>${escapeHtml(r.response_text||'')}</p>${(r.web_search_queries||[]).length?`<div class="benchmark-source-detail"><strong>Søk:</strong><ul>${(r.web_search_queries||[]).map(q=>`<li>${escapeHtml(q)}</li>`).join('')}</ul></div>`:''}${(r.source_pages||[]).length?`<div class="benchmark-source-detail"><strong>Konkrete kilder:</strong><ul>${(r.source_pages||[]).map(p=>`<li><a href="${escapeHtml(p.url||'')}" target="_blank" rel="noopener noreferrer">${escapeHtml(p.title||p.url||p.domain||'Kilde')}</a></li>`).join('')}</ul></div>`:(r.source_domains||[]).length?`<small>Domener: ${escapeHtml((r.source_domains||[]).join(', '))}</small>`:''}</div>`).join('')}</div></article>`}).join('')||'<small>Ingen benchmark-resultater ennå.</small>';
}

function evaluatePilotOpening(testCase, guidance){
  const opening=String(guidance?.opening||'').trim();
  const issues=[];
  const notes=[];
  const words=opening?opening.split(/\s+/u).filter(Boolean).length:0;
  const checks=testCase?.opening_checks||{};
  const maxWords=Number(checks.max_words||65);
  if(!opening)issues.push('Mangler forslag til åpning');
  if(words>maxWords)issues.push(`For lang åpning: ${words} ord (maks ${maxWords})`);
  if(/\b(?:du bør|bør du|kontakt HR|kontakt juridisk|følg (?:virksomhetens|lokal|intern|gjeldende)?\s*prosedyre|varsle (?:ansvarlig|nærmeste)?\s*leder|kvalitetssikre)\b/iu.test(opening))issues.push('Inneholder instruksjoner til lederen i stedet for bare replikk');
  for(const pattern of checks.forbidden_patterns||[]){
    try{if(new RegExp(pattern,'iu').test(opening))issues.push('Treffer en formulering vi tidligere har identifisert som mekanisk eller uheldig');}catch(_){}
  }
  const required=checks.required_patterns_any||[];
  if(required.length){
    const matched=required.some(pattern=>{try{return new RegExp(pattern,'iu').test(opening);}catch(_){return false;}});
    if(!matched)notes.push('Automatisk ordtreff fant ikke forventet situasjonsspråk – bør vurderes menneskelig, ikke regnes som feil alene');
  }
  const sentences=opening.split(/[.!?]+(?:\s|$)/u).map(x=>x.trim()).filter(Boolean).length;
  if(sentences>4)issues.push(`For mange setninger i åpningen: ${sentences}`);
  return {ok:issues.length===0,opening,words,issues,notes};
}

function renderPilotRegressionResults(results){
  const host=document.querySelector('#pilot-regression-results');if(!host)return;
  host.innerHTML=results.map(result=>{
    const status=result.error?'FEIL':result.evaluation?.ok?'BESTÅTT':'SJEKK';
    const issues=result.error?[result.error]:(result.evaluation?.issues||[]);
    const notes=result.evaluation?.notes||[];
    const topics=(result.analysis?.relevant_topics||[]).join(' · ');
    const pilotBadge=result.testCase?.pilot_regression?' · DIN PILOTCASE':'';
    return `<article class="benchmark-case-result"><h4>${escapeHtml(result.testCase?.id||'Testcase')} · ${escapeHtml(result.testCase?.theme||'')}${pilotBadge} · ${status}</h4><div class="benchmark-model-result"><div class="benchmark-metrics"><span>${result.evaluation?.words||0} ord</span><span>${escapeHtml(result.guidance?.model||result.analysis?.model||'')}</span>${result.analysis?.needs_clarification?'<span>Ville normalt spurt om avklaring</span>':''}</div><p><strong>Åpning:</strong><br>${escapeHtml(result.evaluation?.opening||'–')}</p>${topics?`<small>Tema fra analysen: ${escapeHtml(topics)}</small>`:''}${issues.length?`<div class="benchmark-source-detail"><strong>Avvik:</strong><ul>${issues.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></div>`:'<p><strong>✓ Ingen automatiske åpningsavvik</strong></p>'}${notes.length?`<div class="benchmark-source-detail"><strong>Manuell vurdering:</strong><ul>${notes.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></div>`:''}</div></article>`;
  }).join('')||'<small>Ingen testresultater ennå.</small>';
}

async function runPilotRegression(mode='pilot'){
  const pilotButton=document.querySelector('#pilot-regression-run');
  const fullButton=document.querySelector('#production-regression-run');
  const button=mode==='full'?fullButton:pilotButton;
  const status=document.querySelector('#pilot-regression-status');
  if(!button||button.disabled)return;
  let cases=[];
  try{
    const r=await fetch(`/api/admin/pilot-regression/cases?mode=${mode==='full'?'full':'pilot'}`,{credentials:'include',cache:'no-store'});
    const payload=await r.json();
    if(!r.ok)throw new Error(payload.message||'Kunne ikke hente testcasene.');
    cases=payload.cases||[];
  }catch(error){if(status)status.textContent=error.message;return;}
  if(!cases.length){if(status)status.textContent='Fant ingen testcaser.';return;}
  const label=mode==='full'?'full produksjonsflyt-test':'pilotkontroll';
  if(!confirm(`Kjøre ${label} med ${cases.length} saker?\n\nDette gir ${cases.length*2} KI-kall (analyse + veiledning) og bruker API-penger. Testtrafikken merkes separat. ${mode==='full'?'Dine fem pilotcaser er inkludert.':''}`))return;
  if(pilotButton)pilotButton.disabled=true;
  if(fullButton)fullButton.disabled=true;
  const results=[];
  const runId=crypto.randomUUID();
  const testMode=mode==='full'?'production-regression':'pilot-regression';
  renderPilotRegressionResults(results);
  try{
    for(let i=0;i<cases.length;i++){
      const testCase=cases[i];
      if(status)status.textContent=`${i+1}/${cases.length}: ${testCase.theme} · ${testCase.id}`;
      try{
        const ar=await fetch('/api/analyze-situation',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({situation:testCase.input,testMode})});
        const analysis=await ar.json();
        if(!ar.ok)throw new Error(analysis.message||'Analyse feilet.');
        const gr=await fetch('/api/generate-guidance',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({situation:testCase.input,analysis,followups:{},testMode})});
        const guidance=await gr.json();
        if(!gr.ok)throw new Error(guidance.message||'Veiledning feilet.');
        const evaluation=evaluatePilotOpening(testCase,guidance);
        const result={testCase,analysis,guidance,evaluation};
        results.push(result);
        fetch('/api/admin/pilot-regression/result',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode,runId,caseId:testCase.id,model:guidance.model||analysis.model||'',opening:evaluation.opening,ok:evaluation.ok,issues:evaluation.issues,notes:evaluation.notes})}).catch(()=>{});
      }catch(error){
        const result={testCase,error:error.message||'Ukjent feil',evaluation:{ok:false,opening:'',words:0,issues:[],notes:[]}};
        results.push(result);
        fetch('/api/admin/pilot-regression/result',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({mode,runId,caseId:testCase.id,model:'',opening:'',ok:false,issues:[result.error],notes:[]})}).catch(()=>{});
      }
      renderPilotRegressionResults(results);
      if(mode==='full')await new Promise(resolve=>setTimeout(resolve,500));
    }
    const passed=results.filter(x=>!x.error&&x.evaluation?.ok).length;
    if(status)status.textContent=`Ferdig: ${passed}/${results.length} åpninger uten automatiske avvik. ${mode==='full'?'Resultatene er logget så de kan gjennomgås samlet.':''}`;
  }finally{
    if(pilotButton)pilotButton.disabled=false;
    if(fullButton)fullButton.disabled=false;
    await loadAdminAiUsage();
  }
}
async function loadBenchmarkConfig(){
  if(currentUser?.role!=='admin')return;const coverage=document.querySelector('#benchmark-coverage');
  try{const r=await fetch('/api/admin/benchmark/cases',{credentials:'include',cache:'no-store'});const p=await r.json();if(!r.ok)throw new Error(p.message||'Kunne ikke hente testbanken.');benchmarkConfig=p;if(coverage)coverage.textContent=`${p.totalCases} faste testsaker · ${p.totalSubtopics} undertemaer · minst 2 saker per undertema`;const models=document.querySelector('#benchmark-models');if(models)models.innerHTML=(p.models||[]).map(m=>{const gemmaFree=m.id==='google/gemma-4-26b-a4b-it:free';return `<label class="benchmark-model-option"><input type="checkbox" data-benchmark-model value="${escapeHtml(m.id)}" ${gemmaFree?'':'checked'}><span>${escapeHtml(m.label)}${gemmaFree?' · kan ratebegrenses':''}</span></label>`;}).join('');const run=document.querySelector('#benchmark-run-live');if(run)run.disabled=!p.storageReady;const status=document.querySelector('#benchmark-live-status');if(!p.storageReady&&status)status.textContent='Kjør database/migrations/V20-4-SUPABASE-MIGRATION.sql før ekte benchmark.';try{const rr=await fetch('/api/admin/benchmark/results',{credentials:'include',cache:'no-store'});const rp=await rr.json();if(rr.ok){renderBenchmarkResults((rp.items||[]).slice(0,24));renderBenchmarkSummary((rp.items||[]).slice(0,24));}}catch(_){}}catch(error){if(coverage)coverage.textContent=error.message;}
}
async function runBenchmarkMock(){const button=document.querySelector('#benchmark-run-mock'),status=document.querySelector('#benchmark-mock-result');if(button)button.disabled=true;if(status)status.textContent=`Tester ${benchmarkConfig?.totalCases||'alle'} saker …`;try{const r=await fetch('/api/admin/benchmark/mock',{method:'POST',credentials:'include'});const p=await r.json();if(!r.ok)throw new Error(p.message||'Fulltesten feilet.');if(status)status.textContent=p.ok?`Bestått: ${p.checks.cases} saker / ${p.checks.subtopics} undertemaer · 0 KI-kostnad`:`Feil: ${(p.problems||[]).join('; ')}`;}catch(error){if(status)status.textContent=error.message;}finally{if(button)button.disabled=false;}}
async function runBenchmarkLive(){
  if(benchmarkRunning||!benchmarkConfig)return;const models=benchmarkSelectedModels();if(!models.length){alert('Velg minst én KI-modell.');return;}const count=Math.min(Number(document.querySelector('#benchmark-case-set')?.value||8),benchmarkConfig.totalCases||112);const cases=benchmarkSelectCases(count);const budget=Math.min(5,Math.max(.1,Number(document.querySelector('#benchmark-budget')?.value||2)));const total=cases.length*models.length;
  if(!confirm(`Kjøre ${cases.length} testsaker på ${models.length} modeller = ${total} ekte KI-kall?

Maks budsjett: $${budget.toFixed(2)}. Testen kan stoppes når som helst.`))return;
  benchmarkRunning=true;benchmarkStopRequested=false;const runId=crypto.randomUUID();const results=[];const rateLimitedModels=new Set();let spent=0,done=0;const start=document.querySelector('#benchmark-run-live'),stop=document.querySelector('#benchmark-stop-live'),status=document.querySelector('#benchmark-live-status'),bar=document.querySelector('#benchmark-progress-bar');start.disabled=true;stop.disabled=false;renderBenchmarkResults([]);renderBenchmarkSummary([]);
  outer: for(const c of cases){for(const model of models){if(benchmarkStopRequested)break outer;if(rateLimitedModels.has(model)){results.push({run_id:runId,case_id:c.id,topic_id:c.topicId,topic:c.topic,subtopic:c.subtopic,variant:c.variant,model,response_text:'HOPPET OVER: modellen ble ratebegrenset (429) tidligere i denne kjøringen.',input_tokens:0,output_tokens:0,estimated_cost_usd:0,web_search_count:0,web_search_queries:[],source_domains:[],source_pages:[],latency_ms:0,benchmark_failed:true});done++;if(bar)bar.style.width=`${Math.round(done/total*100)}%`;renderBenchmarkSummary(results);renderBenchmarkResults(results);continue;}if(status)status.textContent=`${done+1}/${total}: ${c.topic} → ${c.subtopic} · ${model.replace('gpt-5.6-','')}`;try{const r=await fetch('/api/admin/benchmark/live',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({caseId:c.id,model,runId,spentSoFar:spent,budgetUsd:budget})});const p=await r.json();if(r.status===409&&p.error==='BUDGET_LIMIT'){if(status)status.textContent=`Stoppet ved budsjettgrensen. Brukt ca. ${formatUsd(spent)}.`;break outer;}if(!r.ok)throw new Error(p.message||'Benchmark-kall feilet.');results.push(p);spent+=Number(p.estimated_cost_usd||0);}catch(error){const rateLimited=/\b429\b|ratebegrenset|rate-limited/i.test(String(error.message||''));if(rateLimited)rateLimitedModels.add(model);if(status)status.textContent=rateLimited?`${model}: 429/ratebegrenset – hopper over resten for denne modellen`:`Feil på ${model}: ${error.message} – fortsetter`;results.push({run_id:runId,case_id:c.id,topic_id:c.topicId,topic:c.topic,subtopic:c.subtopic,variant:c.variant,model,response_text:`FEIL: ${error.message||'Benchmark-kall feilet.'}`,input_tokens:0,output_tokens:0,estimated_cost_usd:0,web_search_count:0,web_search_queries:[],source_domains:[],source_pages:[],latency_ms:0,benchmark_failed:true});}done++;if(bar)bar.style.width=`${Math.round(done/total*100)}%`;renderBenchmarkSummary(results);renderBenchmarkResults(results);if(model.startsWith('openrouter/')||model.includes('gemma')){await new Promise(resolve=>setTimeout(resolve,5000));}}}
  benchmarkRunning=false;start.disabled=!benchmarkConfig.storageReady;stop.disabled=true;if(!benchmarkStopRequested&&done===total&&status)status.textContent=`Ferdig: ${done} kall · ca. ${formatUsd(spent)}.`;else if(benchmarkStopRequested&&status)status.textContent=`Stoppet manuelt etter ${done} kall · ca. ${formatUsd(spent)}.`;await loadAdminAiUsage();
}

async function loadAdminSurvey(){
  const card=document.querySelector('#admin-survey-card'),box=document.querySelector('#admin-survey-summary');
  if(!card||!box)return; const isAdmin=currentUser?.role==='admin'; card.hidden=!isAdmin; if(!isAdmin)return;
  box.innerHTML='<div class="history-empty">Henter brukertest …</div>';
  try{
    const [r,sr]=await Promise.all([fetch('/api/admin/survey',{credentials:'include',cache:'no-store'}),fetch('/api/admin/survey/settings',{credentials:'include',cache:'no-store'})]);
    const p=await r.json(), settings=await sr.json(); if(!r.ok)throw new Error(p.message||'Kunne ikke hente brukertest.');
    const toggle=document.querySelector('#admin-survey-enabled'); if(toggle)toggle.checked=settings.enabled!==false;
    const a=p.averages||{},f=v=>Number.isFinite(Number(v))?Number(v).toFixed(1):'–';
    box.innerHTML=`<div class="admin-cost-grid"><div><small>Svar</small><strong>${p.count||0}</strong></div><div><small>Forståelse</small><strong>${f(a.usability)}</strong></div><div><small>Navigasjon</small><strong>${f(a.navigation)}</strong></div><div><small>KI relevans/balanse</small><strong>${f(a.aiRelevance)}</strong></div><div><small>Praktisk nytte</small><strong>${f(a.practicalUsefulness)}</strong></div><div><small>Simulator</small><strong>${f(a.simulation)}</strong></div><div><small>Personvern</small><strong>${f(a.privacy)}</strong></div><div><small>Ville brukt</small><strong>${f(a.wouldUse)}</strong></div></div>${(p.responses||[]).length?`<div class="survey-response-list">${p.responses.map(x=>`<div class="survey-response-item"><small>${escapeHtml(new Date(x.created_at).toLocaleString('nb-NO'))}</small>${x.improvement_text?`<p><strong>Viktigste forbedring:</strong><br>${escapeHtml(x.improvement_text)}</p>`:''}${x.most_useful_text?`<p><strong>Mest nyttig:</strong><br>${escapeHtml(x.most_useful_text)}</p>`:''}</div>`).join('')}</div>`:'<p class="muted-note">Ingen fritekstsvar ennå.</p>'}`;
  }catch(e){box.innerHTML=`<div class="history-empty">${escapeHtml(e.message)}</div>`;}
}

async function loadAdminInvites(){
  const card=document.querySelector('#admin-invite-card'); if(!card)return; const isAdmin=currentUser?.role==='admin'; card.hidden=!isAdmin;
}

function surveyUsageEligible(){
  try{return Number(localStorage.getItem('samtalestotte_guidance_count')||0)>=1;}catch(_){return true;}
}
function maybeShowSurveyInvite(){
  const box=document.querySelector('#survey-invite'); if(!box)return;
  let done=false,later=false; try{done=localStorage.getItem('samtalestotte_survey_done')==='1';later=localStorage.getItem('samtalestotte_survey_later')==='1';}catch(_){}
  box.hidden=done||later||!surveyUsageEligible();
}
function markGuidanceUsed(){try{localStorage.setItem('samtalestotte_guidance_count',String(Number(localStorage.getItem('samtalestotte_guidance_count')||0)+1));}catch(_){} maybeShowSurveyInvite();}
function updateSurveyPrivacy(){
  const form=document.querySelector('#survey-form');
  const box=document.querySelector('#survey-privacy');
  if(!form||!box)return[];
  const inputs=[...form.querySelectorAll('textarea[name="improvement_text"], textarea[name="most_useful_text"]')];
  const findings=inputs.flatMap(input=>detectSensitiveInfo(input.value).map(item=>({...item,input})));
  const {hard,soft}=splitPrivacyFindings(findings);
  const submit=form.querySelector('button[type="submit"]');
  if(submit) submit.disabled=hard.length>0;
  if(!hard.length&&!soft.length){box.hidden=true;box.innerHTML='';return findings;}
  box.hidden=false;
  box.className=`privacy-check warning ${hard.length?'blocking':'advisory'}`;
  box.innerHTML=privacySummaryHtml(findings,{title:'Personvernsjekk av fritekst',blocking:true});
  return findings;
}

function updateAiFeedbackCommentPrivacy(){
  const input=document.querySelector('#ai-feedback-comment');
  const box=document.querySelector('#ai-feedback-comment-privacy');
  if(!input||!box)return[];
  const findings=detectSensitiveInfo(input.value);
  const {hard,soft}=splitPrivacyFindings(findings);
  if(!input.value.trim()||(!hard.length&&!soft.length)){box.hidden=true;box.innerHTML='';return findings;}
  box.hidden=false;
  box.className=`privacy-check warning ${hard.length?'blocking':'advisory'}`;
  box.innerHTML=privacySummaryHtml(findings,{title:'Personvernsjekk av kommentaren',blocking:true});
  return findings;
}

async function openSurvey(){
  if(!requireLogin())return;
  setBreadcrumb('Gi tilbakemelding');showView('survey');
  const form=document.querySelector('#survey-form'),done=document.querySelector('#survey-completed-message'),closed=document.querySelector('#survey-closed-message');
  if(form)form.hidden=true;if(done)done.hidden=true;if(closed)closed.hidden=true;
  try{const r=await fetch('/api/survey/status',{credentials:'include',cache:'no-store'});const p=await r.json();if(!r.ok)throw new Error(p.message||'Kunne ikke hente status.');
    if(p.completed){if(done)done.hidden=false;}else if(p.enabled===false){if(closed)closed.hidden=false;}else if(form){form.hidden=false;updateSurveyPrivacy();}
  }catch(_){if(form){form.hidden=false;updateSurveyPrivacy();}}
}

async function openAdmin(){if(!requireLogin())return;if(!['editor','admin'].includes(currentUser?.role||'user'))return;setBreadcrumb('Admin');showView('admin');document.querySelector('#admin-current-role').textContent=currentUser.role==='admin'?'Admin':'Redaktør';const payload=await loadContentOverrides();renderAdminContentFields();clearAdminDirty();const msg=document.querySelector('#admin-content-message');if(msg&&payload.setupRequired){msg.className='auth-message error';msg.textContent='Innholdsdatabasen er ikke opprettet ennå. Kjør database/migrations/V20-SUPABASE-MIGRATION.sql i Supabase.';}await loadAdminUsers();await loadAdminInvites();await loadAdminFeedback();await loadAdminSurvey();await loadAdminAiSettings();await loadAdminAiUsage();await loadBenchmarkConfig();}


function isStandaloneApp(){
  return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
}

function isIosDevice(){
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

function updateAppModeMarker(){
  document.documentElement.dataset.appMode=isStandaloneApp() ? 'standalone' : 'browser';
}

function updateInstallAppUi(){
  updateAppModeMarker();
  const button=document.querySelector('#install-app-button');
  const iosHelp=document.querySelector('#install-app-ios-help');
  const manualHelp=document.querySelector('#install-app-manual-help');
  const manualText=document.querySelector('#install-app-manual-text');
  const status=document.querySelector('#install-app-status');
  const description=document.querySelector('#install-app-description');
  if(!button || !status) return;

  if(isStandaloneApp()){
    button.hidden=true;
    if(iosHelp) iosHelp.hidden=true;
    if(manualHelp) manualHelp.hidden=true;
    if(description) description.textContent='Samtalestøtte er installert og kan åpnes som en egen app.';
    status.textContent='Installert som app. Den skal åpnes uten vanlig nettleserlinje.';
    return;
  }

  if(deferredInstallPrompt){
    button.hidden=false;
    button.textContent='Installer Samtalestøtte';
    if(iosHelp) iosHelp.hidden=true;
    if(manualHelp) manualHelp.hidden=true;
    status.textContent='';
    return;
  }

  button.hidden=false;
  button.textContent='Vis hvordan du installerer';
  if(isIosDevice()){
    if(iosHelp) iosHelp.hidden=false;
    if(manualHelp) manualHelp.hidden=true;
    status.textContent='Installeres fra Del-menyen i Safari.';
  }else{
    if(iosHelp) iosHelp.hidden=true;
    if(manualHelp) manualHelp.hidden=true;
    const samsung=/SamsungBrowser/i.test(navigator.userAgent);
    if(manualText) manualText.textContent=samsung
      ? 'I Samsung Internet: bruk PWA-/installasjonsikonet og velg «Installer på appskjermen». Ikke velg bare en vanlig snarvei til startskjermen.'
      : 'Åpne nettlesermenyen og velg «Installer app». En vanlig snarvei kan fortsatt åpnes med nettleserens egne menyer.';
    status.textContent=samsung
      ? 'Du kjører nå i nettleseren. Ekte appmodus skal åpnes uten Samsung Internet-linjen under Samtalestøtte-menyen.'
      : 'Du kjører nå i nettleseren. Installer appen for å åpne den i eget appvindu.';
  }
}

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt=event;
  updateInstallAppUi();
});

window.addEventListener('appinstalled', () => {
  deferredInstallPrompt=null;
  updateInstallAppUi();
});

document.querySelector('#install-app-button')?.addEventListener('click', async () => {
  const status=document.querySelector('#install-app-status');
  const manualHelp=document.querySelector('#install-app-manual-help');
  const iosHelp=document.querySelector('#install-app-ios-help');
  if(!deferredInstallPrompt){
    if(isIosDevice()){
      if(iosHelp) iosHelp.hidden=false;
    }else if(manualHelp){
      manualHelp.hidden=!manualHelp.hidden;
    }
    return;
  }
  deferredInstallPrompt.prompt();
  const choice=await deferredInstallPrompt.userChoice;
  deferredInstallPrompt=null;
  if(status) status.textContent=choice.outcome==='accepted' ? 'Installeringen er startet.' : 'Installeringen ble avbrutt.';
  updateInstallAppUi();
});

const imagePreviewDialog=document.querySelector('#image-preview-dialog');
const imagePreviewDialogImage=document.querySelector('#image-preview-dialog-image');

function openImagePreview(sourceImage){
  if(!imagePreviewDialog || !imagePreviewDialogImage || !sourceImage) return;
  let src=sourceImage.getAttribute('src') || sourceImage.currentSrc || '';
  if(sourceImage.classList.contains('topbar-brand-logo') && document.documentElement.dataset.theme==='dark'){
    src='assets/images/logo-light.png';
  }
  imagePreviewDialogImage.src=src;
  imagePreviewDialogImage.alt=sourceImage.alt || 'Forstørret bilde';
  imagePreviewDialog.showModal();
}

document.querySelectorAll('.image-preview-trigger').forEach(trigger => {
  trigger.addEventListener('click', () => openImagePreview(trigger.querySelector('img')));
  trigger.addEventListener('keydown', event => {
    if((event.key==='Enter' || event.key===' ') && trigger.tagName!=='BUTTON'){
      event.preventDefault();
      openImagePreview(trigger.querySelector('img'));
    }
  });
});

document.querySelectorAll('.expandable-content-image').forEach(image => {
  image.addEventListener('click', () => openImagePreview(image));
  image.addEventListener('keydown', event => {
    if(event.key==='Enter' || event.key===' '){
      event.preventDefault();
      openImagePreview(image);
    }
  });
});

document.querySelector('#image-preview-dialog-close')?.addEventListener('click', () => imagePreviewDialog?.close());
imagePreviewDialog?.addEventListener('click', event => {
  if(event.target===imagePreviewDialog) imagePreviewDialog.close();
});

if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js?v=20.11.8', { updateViaCache: 'none' }).catch(error => {
      console.warn('[pwa] Service worker kunne ikke registreres:', error?.message || error);
    });
  });
}

window.matchMedia('(display-mode: standalone)').addEventListener?.('change', updateInstallAppUi);
setTimeout(updateInstallAppUi,0);

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

function pushClientError(entry){clientErrorLog.push({time:new Date().toISOString(),...entry});if(clientErrorLog.length>12)clientErrorLog.shift();}
window.addEventListener('error',event=>pushClientError({type:'window.error',message:String(event.message||'Ukjent feil'),source:String(event.filename||'').split('/').pop(),line:event.lineno||null}));
window.addEventListener('unhandledrejection',event=>pushClientError({type:'unhandledrejection',message:String(event.reason?.message||event.reason||'Ukjent promise-feil')}));
function currentViewName(){return Object.entries(views).find(([,el])=>el?.classList.contains('active-view'))?.[0]||'ukjent';}
function buildFeedbackText(){
  const category=document.querySelector('#report-category')?.value||'Tilbakemelding';
  const description=document.querySelector('#report-description')?.value.trim()||'';
  const includeLog=document.querySelector('#report-include-log')?.checked!==false;
  const technical=includeLog?`\n\nTeknisk logg (uten samtaletekst):\nTid: ${new Date().toISOString()}\nVisning: ${currentViewName()}\nSkjerm: ${window.innerWidth}x${window.innerHeight}\nNettleser: ${navigator.userAgent}\nFeil siste økt: ${clientErrorLog.length?JSON.stringify(clientErrorLog,null,2):'Ingen registrerte nettleserfeil.'}`:'';
  return `Samtalestøtte – ${category}\nVersjon: ${publicConfig.appVersion||'20.0.0'}\n\nBeskrivelse:\n${description}${technical}`;
}
function closeProfileMenu(){
  const menu=document.querySelector('#profile-menu');
  const button=document.querySelector('#profile-button');
  if(menu) menu.hidden=true;
  if(button) button.setAttribute('aria-expanded','false');
}

document.querySelector('#profile-button')?.addEventListener('click',(event)=>{
  event.stopPropagation();
  if(!currentUser) return openAuth('login', true);
  const m=document.querySelector('#profile-menu');
  m.hidden=!m.hidden;
  document.querySelector('#profile-button').setAttribute('aria-expanded',String(!m.hidden));
});
document.querySelector('#profile-menu')?.addEventListener('click',event=>event.stopPropagation());
document.addEventListener('click',()=>closeProfileMenu());
document.addEventListener('keydown',event=>{if(event.key==='Escape') closeProfileMenu();});

async function ensurePrivacyAcknowledgement(){
  if(!currentUser)return;
  try{
    const r=await fetch('/api/privacy-ack',{credentials:'include',cache:'no-store'}); const p=await r.json();
    if(r.ok&&!p.acknowledged){document.querySelector('#privacy-ack-dialog')?.showModal();}
  }catch(_){/* Ikke blokker appen hvis statuskallet feiler. */}
}

document.querySelector('[data-profile-action="history"]')?.addEventListener('click',()=>{closeProfileMenu();openHistory();});
document.querySelector('[data-profile-action="about"]')?.addEventListener('click',()=>openInfoView('about'));
document.querySelector('[data-profile-action="contact"]')?.addEventListener('click',()=>openInfoView('contact'));
document.querySelector('[data-profile-action="survey"]')?.addEventListener('click',()=>{closeProfileMenu();openSurvey();});
document.querySelector('[data-profile-action="admin"]')?.addEventListener('click',()=>{closeProfileMenu();openAdmin();});
document.querySelector('[data-profile-action="logout"]')?.addEventListener('click',async()=>{await fetch('/api/auth/logout',{method:'POST',credentials:'include'});currentUser=null;currentConversationId=null;updateAuthUi();closeProfileMenu();showView('home');openAuth('login',true);});
document.querySelector('#auth-close')?.addEventListener('click',closeAuth); document.querySelector('#show-register')?.addEventListener('click',()=>openAuth('register',true)); document.querySelector('#show-login')?.addEventListener('click',()=>openAuth('login',true));
document.querySelector('#auth-dialog')?.addEventListener('click',event=>{if(event.target===event.currentTarget) closeAuth();});
document.addEventListener('keydown',event=>{if(event.key==='Escape') closeAuth();});
document.querySelector('#history-login-button')?.addEventListener('click',()=>openAuth('login')); document.querySelector('#back-from-history')?.addEventListener('click',()=>showView('home'));
document.querySelectorAll('[data-open-legal]').forEach(b=>b.addEventListener('click',()=>openLegal(b.dataset.openLegal))); document.querySelectorAll('.legal-back').forEach(b=>b.addEventListener('click',()=>showView(legalReturnView)));
document.querySelectorAll('[data-open-info]').forEach(b=>b.addEventListener('click',()=>openInfoView(b.dataset.openInfo)));
document.querySelectorAll('[data-open-help]').forEach(b=>b.addEventListener('click',()=>{infoReturnView='settings';setBreadcrumb('Hjelp');showView('help');}));
document.querySelectorAll('.info-back').forEach(b=>b.addEventListener('click',()=>showView(infoReturnView)));
document.querySelector('#report-from-conversation')?.addEventListener('click',()=>openAiFeedback('main-guidance'));



let pendingAiFeedback={surface:'general',turnIndex:null};
function buildFeedbackConversationSnapshot(surface,turnIndex=null){
  const situation=simulationSource==='direct'&&simulationDirectSituation?simulationDirectSituation:(document.querySelector('#situation')?.value.trim()||'');
  if(surface==='simulation'){
    const maxIndex=turnIndex===null||turnIndex===''?simulationTurns.length-1:Number(turnIndex);
    return {surface:'simulation',situation,topic:currentTopic?.title||'',subtopic:currentSubtopic||'',turns:simulationTurns.slice(0,Math.max(0,maxIndex)+1).map(t=>({role:t.role,text:t.text}))};
  }
  return {surface,situation,topic:currentTopic?.title||'',subtopic:currentSubtopic||'',analysis:lastAiAnalysis||null,guidance:lastAiGuidance||null,conversation:getConversationTurns()};
}
function feedbackSnapshotFindings(snapshot){return detectSensitiveInfo(flattenFeedbackSnapshotText(snapshot));}
function flattenFeedbackSnapshotText(value){if(typeof value==='string')return value;if(Array.isArray(value))return value.map(flattenFeedbackSnapshotText).join(' ');if(value&&typeof value==='object')return Object.values(value).map(flattenFeedbackSnapshotText).join(' ');return '';}
function updateFeedbackAttachmentPrivacy(){const checked=document.querySelector('#ai-feedback-include-conversation')?.checked;const box=document.querySelector('#ai-feedback-privacy');if(!box)return[];if(!checked){box.hidden=true;box.innerHTML='';return[];}const snapshot=buildFeedbackConversationSnapshot(pendingAiFeedback.surface,pendingAiFeedback.turnIndex);const findings=feedbackSnapshotFindings(snapshot);const {hard,soft}=splitPrivacyFindings(findings);box.hidden=false;box.className=`privacy-check ${hard.length?'warning blocking':soft.length?'warning advisory':'ok'}`;box.innerHTML=hard.length?`<strong>Samtalen kan ikke legges ved ennå</strong><span>Personvernsjekken fant opplysninger som må anonymiseres først.</span><ul>${hard.map(x=>`<li>${escapeHtml(x.label)}</li>`).join('')}</ul>`:soft.length?`<strong>Sjekk samtalen før du legger den ved</strong><span>${soft.map(x=>escapeHtml(x.label)).join(', ')}</span>`:`<strong>Personvernsjekk</strong><span>Ingen tydelige personopplysninger er oppdaget i samtalen.</span>`;return findings;}
function openAiFeedback(surface='general',turnIndex=null){pendingAiFeedback={surface,turnIndex};const dialog=document.querySelector('#ai-feedback-dialog');const comment=document.querySelector('#ai-feedback-comment');const message=document.querySelector('#ai-feedback-message');const include=document.querySelector('#ai-feedback-include-conversation');if(comment)comment.value='';if(include)include.checked=false;if(message){message.textContent='';message.className='auth-message';}updateAiFeedbackCommentPrivacy();updateFeedbackAttachmentPrivacy();dialog?.showModal();}
function closeAiFeedback(){document.querySelector('#ai-feedback-dialog')?.close();}
document.addEventListener('click',event=>{const button=event.target.closest('[data-report-ai-response]');if(!button)return;openAiFeedback(button.dataset.reportAiResponse||'general',button.dataset.turnIndex??null);});
document.querySelector('#ai-feedback-cancel')?.addEventListener('click',closeAiFeedback);
document.querySelector('#ai-feedback-include-conversation')?.addEventListener('change',updateFeedbackAttachmentPrivacy);
document.querySelector('#ai-feedback-comment')?.addEventListener('input',updateAiFeedbackCommentPrivacy);
document.querySelector('#ai-feedback-form')?.addEventListener('submit',async event=>{event.preventDefault();const category=document.querySelector('#ai-feedback-category')?.value||'Annet';const comment=document.querySelector('#ai-feedback-comment')?.value.trim()||'';const message=document.querySelector('#ai-feedback-message');const findings=detectSensitiveInfo(comment);if(splitPrivacyFindings(findings).hard.length){message.className='auth-message error';message.textContent='Fjern navn eller andre tydelige personopplysninger før tilbakemeldingen sendes.';return;}if(comment.length<3){message.className='auth-message error';message.textContent='Skriv kort hva som var problemet.';return;}const includeConversation=Boolean(document.querySelector('#ai-feedback-include-conversation')?.checked);let conversationSnapshot=null;if(includeConversation){const attachmentFindings=updateFeedbackAttachmentPrivacy();if(splitPrivacyFindings(attachmentFindings).hard.length){message.className='auth-message error';message.textContent='Samtalen må anonymiseres før den kan legges ved.';return;}conversationSnapshot=buildFeedbackConversationSnapshot(pendingAiFeedback.surface,pendingAiFeedback.turnIndex);}try{const r=await fetch('/api/ai-feedback',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({category,comment,surface:pendingAiFeedback.surface,turnIndex:pendingAiFeedback.turnIndex,conversationId:currentConversationId||null,topicId:currentTopic?.id||null,subtopic:currentSubtopic||null,includeConversation,conversationSnapshot})});const p=await r.json();if(!r.ok)throw new Error(p.message||'Kunne ikke sende tilbakemeldingen.');message.className='auth-message success';message.textContent=includeConversation?'Takk. Tilbakemeldingen og samtalen er lagret.':'Takk. Tilbakemeldingen er lagret uten samtaleteksten.';setTimeout(closeAiFeedback,800);}catch(error){message.className='auth-message error';message.textContent=error.message;}});

document.querySelector('#back-from-admin')?.addEventListener('click',()=>showView('home'));
document.querySelector('#admin-reload-content')?.addEventListener('click',async()=>{if(adminContentDirty&&!confirm('Du har ulagrede endringer. Vil du forkaste dem og laste inn på nytt?'))return;await loadContentOverrides();renderAdminContentFields();clearAdminDirty();});
document.querySelector('#admin-content-form')?.addEventListener('submit',event=>{event.preventDefault();if(!adminContentDirty)return;document.querySelector('#admin-save-dialog')?.showModal();});
document.querySelector('#admin-save-cancel')?.addEventListener('click',()=>document.querySelector('#admin-save-dialog')?.close());
document.querySelector('#admin-save-confirm')?.addEventListener('click',async()=>{document.querySelector('#admin-save-dialog')?.close();await saveAdminContent();});
document.querySelector('#admin-save-ai-model')?.addEventListener('click',async()=>{const model=document.querySelector('#admin-ai-model')?.value;const option=document.querySelector('#admin-ai-model')?.selectedOptions?.[0]?.textContent||model;if(!model)return;if(!confirm(`Bytte KI-modell til ${option}?\n\nEn dyrere modell kan øke API-kostnadene for alle nye KI-kall.`))return;const msg=document.querySelector('#admin-ai-model-message');msg.className='auth-message';msg.textContent='Lagrer …';try{const r=await fetch('/api/admin/ai-settings',{method:'PUT',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({model})});const p=await r.json();if(!r.ok)throw new Error(p.message||'Kunne ikke lagre modellvalget.');msg.className='auth-message success';msg.textContent='KI-modellen er endret. Nye KI-kall bruker dette valget.';}catch(error){msg.className='auth-message error';msg.textContent=error.message;}});
document.querySelector('#admin-usage-include-tests')?.addEventListener('change',loadAdminAiUsage);
document.querySelector('#pilot-regression-run')?.addEventListener('click',()=>runPilotRegression('pilot'));
document.querySelector('#production-regression-run')?.addEventListener('click',()=>runPilotRegression('full'));
document.querySelector('#benchmark-run-mock')?.addEventListener('click',runBenchmarkMock);
document.querySelector('#benchmark-run-live')?.addEventListener('click',runBenchmarkLive);
document.querySelector('#benchmark-stop-live')?.addEventListener('click',()=>{benchmarkStopRequested=true;});

let passwordRecoveryTokens = null;

function readPasswordRecoveryFromUrl(){
  const hash = new URLSearchParams(location.hash.replace(/^#/,''));
  const type = hash.get('type');
  const accessToken = hash.get('access_token');
  const refreshToken = hash.get('refresh_token');
  if(type==='recovery' && accessToken && refreshToken){
    passwordRecoveryTokens={accessToken,refreshToken};
    history.replaceState(null,'',location.pathname+location.search);
    openAuth('reset',true);
    return true;
  }
  return false;
}

document.querySelector('#show-forgot-password')?.addEventListener('click',()=>{
  const loginValue=document.querySelector('#login-email')?.value.trim()||'';
  const email=document.querySelector('#forgot-password-email');
  if(email && loginValue.includes('@')) email.value=loginValue;
  openAuth('forgot',true);
});
document.querySelector('#back-to-login')?.addEventListener('click',()=>openAuth('login',true));

document.querySelector('#forgot-password-form')?.addEventListener('submit',async event=>{
  event.preventDefault();
  const msg=document.querySelector('#forgot-password-message');
  const email=document.querySelector('#forgot-password-email')?.value.trim()||'';
  msg.className='auth-message';
  msg.textContent='Sender lenke …';
  try{
    const response=await fetch('/api/auth/password-reset-request',{
      method:'POST',credentials:'include',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({email})
    });
    const payload=await response.json();
    if(!response.ok){
      msg.className='auth-message error';
      msg.textContent=payload.message||'Kunne ikke sende lenken.';
      return;
    }
    msg.className='auth-message success';
    msg.textContent='Hvis e-postadressen tilhører en brukerprofil, er en lenke sendt. Sjekk også søppelpost.';
  }catch(_){
    msg.className='auth-message error';
    msg.textContent='Kunne ikke kontakte tjenesten. Prøv igjen.';
  }
});

document.querySelector('#reset-password-form')?.addEventListener('submit',async event=>{
  event.preventDefault();
  const msg=document.querySelector('#reset-password-message');
  const password=document.querySelector('#reset-password')?.value||'';
  const confirmPassword=document.querySelector('#reset-password-confirm')?.value||'';
  if(password.length<10){
    msg.className='auth-message error'; msg.textContent='Passordet må ha minst 10 tegn.'; return;
  }
  if(password!==confirmPassword){
    msg.className='auth-message error'; msg.textContent='Passordene er ikke like.'; return;
  }
  if(!passwordRecoveryTokens){
    msg.className='auth-message error'; msg.textContent='Tilbakestillingslenken mangler eller er utløpt. Be om en ny lenke.'; return;
  }
  msg.className='auth-message';
  msg.textContent='Lagrer nytt passord …';
  try{
    const response=await fetch('/api/auth/password-reset-complete',{
      method:'POST',credentials:'include',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({...passwordRecoveryTokens,password})
    });
    const payload=await response.json();
    if(!response.ok){
      msg.className='auth-message error';
      msg.textContent=payload.message||'Kunne ikke endre passordet.';
      return;
    }
    passwordRecoveryTokens=null;
    currentUser=payload.user||null;
    updateAuthUi();
    msg.className='auth-message success';
    msg.textContent='Passordet er endret.';
    setTimeout(()=>closeAuth(true),450);
  }catch(_){
    msg.className='auth-message error';
    msg.textContent='Kunne ikke kontakte tjenesten. Prøv igjen.';
  }
});

document.querySelector('#login-form')?.addEventListener('submit',async e=>{e.preventDefault();const msg=document.querySelector('#login-message');msg.textContent='';const r=await fetch('/api/auth/login',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({identifier:document.querySelector('#login-email').value,password:document.querySelector('#login-password').value})});const p=await r.json();if(!r.ok){msg.className='auth-message error';msg.textContent=p.message||'Innlogging feilet.';return;}currentUser=p.user;updateAuthUi();closeAuth();setTimeout(ensurePrivacyAcknowledgement,150);await saveCurrentConversation();});
document.querySelector('#register-form')?.addEventListener('submit',async e=>{e.preventDefault();const msg=document.querySelector('#register-message');msg.textContent='';const pw=document.querySelector('#register-password').value;if(pw!==document.querySelector('#register-password-confirm').value){msg.className='auth-message error';msg.textContent='Passordene er ikke like.';return;}const r=await fetch('/api/auth/register',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:document.querySelector('#register-username').value,email:document.querySelector('#register-email').value,password:pw,inviteCode:document.querySelector('#register-invite').value})});const p=await r.json();if(!r.ok){msg.className='auth-message error';msg.textContent=p.message||'Kunne ikke opprette konto.';return;}currentUser=p.user;updateAuthUi();closeAuth();setTimeout(ensurePrivacyAcknowledgement,150);await saveCurrentConversation();});
document.querySelector('#new-conversation-button')?.addEventListener('click',()=>startNewConversation());
document.querySelector('#result-new-conversation')?.addEventListener('click',()=>startNewConversation());
document.querySelector('#bottom-new-conversation')?.addEventListener('click',()=>startNewConversation());
document.querySelector('#history-new-conversation')?.addEventListener('click',()=>startNewConversation()); document.querySelector('#cancel-new-chat')?.addEventListener('click',()=>document.querySelector('#discard-dialog').close()); document.querySelector('#confirm-new-chat')?.addEventListener('click',()=>{document.querySelector('#discard-dialog').close();startNewConversation(true);});
document.querySelector('#export-account-data')?.addEventListener('click',async()=>{try{const r=await fetch('/api/account/export',{credentials:'include',cache:'no-store'});if(!r.ok){const p=await r.json().catch(()=>({}));throw new Error(p.message||'Kunne ikke hente dataene.');}const blob=await r.blob();const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`samtalestotte-data-${new Date().toISOString().slice(0,10)}.json`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(error){alert(error.message);}});
document.querySelector('#delete-account-button')?.addEventListener('click',async()=>{if(!confirm('Slette kontoen og all lagret historikk? Dette kan ikke angres.'))return;const r=await fetch('/api/account',{method:'DELETE',credentials:'include'});if(r.ok){currentUser=null;currentConversationId=null;updateAuthUi();startNewConversation(true);}});
document.querySelector('#delete-all-history')?.addEventListener('click',async()=>{if(!confirm('Slette all samtalehistorikk?'))return;await fetch('/api/history',{method:'DELETE',credentials:'include'});openHistory();});
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
  setBreadcrumb('Samtaleøvelse');
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
  setBreadcrumb('Samtaleøvelse · eksisterende samtale');
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
  const visible = hard.length ? hard : soft;
  if (hard.length) {
    box.className = 'privacy-check warning blocking';
    box.innerHTML = `<strong>Fjern dette før øvelsen:</strong><ul>${visible.map(item => `<li><b>${escapeHtml(item.label)}</b> – ${escapeHtml(item.message)}</li>`).join('')}</ul><div class="privacy-fix-actions"><button type="button" class="secondary-button compact-fix-button" data-direct-privacy-fix>Fiks personvern</button><small>Les gjennom teksten før du fortsetter.</small></div>`;
  } else {
    box.className = 'privacy-check warning advisory';
    box.innerHTML = `<strong>Vurder å generalisere litt mer</strong><ul>${visible.map(item => `<li><b>${escapeHtml(item.label)}</b> – ${escapeHtml(item.message)}</li>`).join('')}</ul><div class="privacy-fix-actions"><button type="button" class="secondary-button compact-fix-button" data-direct-privacy-fix>Generaliser forslag</button><small>Dette er en anbefaling og hindrer ikke at du starter øvelsen.</small></div>`;
  }
  box.querySelector('[data-direct-privacy-fix]')?.addEventListener('click', () => {
    const input = document.querySelector('#direct-simulation-situation');
    if (!input) return;
    input.value = autoFixPrivacyText(input.value, findings);
    showDirectSimulationPrivacy(detectSensitiveInfo(input.value));
    input.focus();
  });
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
  document.querySelector('#close-simulation').textContent = 'Tilbake til øvelsen';
  setBreadcrumb('Samtaleøvelse · ny øvelse');
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
    topicId: direct ? '' : (currentTopic?.id || ''),
    subtopic: direct ? 'Direkte øvelse' : (currentSubtopic || ''),
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
      ${leader ? '' : '<div class="simulation-avatar employee-avatar" aria-hidden="true"><img src="assets/images/profile-ai.png" alt="" /></div>'}
      <div class="simulation-bubble ${leader ? 'leader-bubble' : 'employee-bubble'}">
        ${speechBubbleMarkup(leader ? 'right' : 'left')}
        <span>${leader ? 'Du · leder' : 'Medarbeider · KI'}</span>
        <p>${escapeHtml(turn.text)}</p>
        ${leader ? '' : `<button type="button" class="ai-report-link" data-report-ai-response="simulation" data-turn-index="${simulationTurns.indexOf(turn)}">Rapporter svar</button>`}
      </div>
      ${leader ? '<div class="simulation-avatar leader-avatar" aria-hidden="true"><img src="assets/images/profile-human.png" alt="" /></div>' : ''}
    </div>`;
  }).join('');
  thread.innerHTML = intro + turns;
  queueSpeechBubbleRefresh();
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
  const topic = simulationSource === 'direct' ? 'Ny øvelse' : (currentSubtopic || currentTopic?.title || 'Samtale');
  document.querySelector('#simulation-status').textContent = `${topic} · ${simulationFidelityLabels[simulationFidelity]} · ${simulationStyleLabels[simulationStyle]}`;
  renderSimulationThread();
  updateSimulationTurnPrivacy();
  document.querySelector('#simulation-input')?.focus();
  conversationDirty = true;
}

async function readJsonResponse(response) {
  const contentType = response.headers.get('content-type') || '';
  const raw = await response.text();
  if (!contentType.includes('application/json')) {
    throw new Error(response.status === 404
      ? 'Øvelsesfunksjonen finnes ikke på serveren. Start serveren på nytt etter oppdateringen.'
      : 'Serveren svarte i feil format. Prøv å starte serveren på nytt.');
  }
  try { return raw ? JSON.parse(raw) : {}; }
  catch (_) { throw new Error('Serveren returnerte et ugyldig svar.'); }
}

async function submitSimulationTurn(text) {
  const cleaned = text.trim();
  if (!cleaned) return;
  const privacyFindings = detectSensitiveInfo(cleaned);
  if (splitPrivacyFindings(privacyFindings).hard.length) {
    const input = document.querySelector('#simulation-input');
    if (input) {
      input.value = cleaned;
      updateSimulationTurnPrivacy();
      input.focus();
    }
    return false;
  }
  simulationTurns.push({ role: 'leader', text: cleaned });
  renderSimulationThread();
  const thread = document.querySelector('#simulation-thread');
  const waiting = document.createElement('div');
  waiting.className = 'simulation-bubble-row employee-row simulation-waiting';
  waiting.innerHTML = `<div class="simulation-avatar employee-avatar" aria-hidden="true"><img src="assets/images/profile-ai.png" alt="" /></div><div class="simulation-bubble employee-bubble">${speechBubbleMarkup('left')}<span>Medarbeider · KI</span><div class="conversation-thinking"><span class="thinking-spinner" aria-hidden="true"></span><p>Tenker …</p></div></div>`;
  thread.appendChild(waiting);
  queueSpeechBubbleRefresh();
  waiting.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  try {
    const response = await fetch('/api/simulation-turn', {
      method: 'POST',
      credentials: 'include', headers: { 'Content-Type': 'application/json' },
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
      method: 'POST',
      credentials: 'include', headers: { 'Content-Type': 'application/json' },
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
      method: 'POST',
      credentials: 'include', headers: { 'Content-Type': 'application/json' },
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
document.querySelector('#open-simulation-bottom')?.addEventListener('click', openSimulation);
document.querySelector('#simulation-new-direct')?.addEventListener('click', openDirectSimulationSetup);
document.querySelector('#simulation-history')?.addEventListener('click', openHistory);
document.querySelector('#cancel-direct-simulation')?.addEventListener('click', () => { document.querySelector('#direct-simulation-form').hidden = true; showDirectSimulationPrivacy([]); });
document.querySelector('#direct-simulation-form')?.addEventListener('submit', event => { event.preventDefault(); beginDirectSimulation(); });
document.querySelector('#direct-simulation-situation')?.addEventListener('input', event => showDirectSimulationPrivacy(detectSensitiveInfo(event.currentTarget.value)));
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
    box.hidden = false;
    box.className = 'privacy-check simulation-turn-privacy privacy-idle';
    box.innerHTML = '<strong>Personvernsjekk</strong><span>Ingen tydelige personopplysninger er oppdaget i teksten.</span>';
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

const inviteFromUrl=new URLSearchParams(location.search).get('invite');

(async function initialiseAuthGate(){
  // Recovery-lenke og invitasjonslenke skal åpne riktig panel med én gang.
  if(readPasswordRecoveryFromUrl()) return;

  if(inviteFromUrl){
    const inviteInput=document.querySelector('#register-invite');
    if(inviteInput) inviteInput.value=inviteFromUrl;
    openAuth('register',true);
    history.replaceState(null,'',location.pathname);
    return;
  }

  // Ved vanlig åpning: sjekk eksisterende session før login-vinduet vises.
  // App-skallet er inert fra HTML mens denne kontrollen pågår.
  await refreshAuth();
  if(!currentUser) openAuth('login',true);
})();

loadPublicConfig();
loadContentOverrides();

sidebarNarrowQuery.addEventListener('change', event => {
  if (event.matches) {
    setSidebarCollapsed(true);
  } else {
    const storedCollapsed = localStorage.getItem('samtalestotte-sidebar') === 'collapsed';
    setSidebarCollapsed(storedCollapsed);
  }
});
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if ((localStorage.getItem('samtalestotte-theme') || 'hybrid') === 'system') applyTheme('system');
});


window.addEventListener('pageshow', () => {
  resetConversationState();
  setBreadcrumb('');
  showView('home');
});



document.querySelector('#survey-now')?.addEventListener('click',openSurvey);
document.querySelector('#survey-later')?.addEventListener('click',()=>{try{localStorage.setItem('samtalestotte_survey_later','1')}catch(_){} const box=document.querySelector('#survey-invite');if(box)box.hidden=true;});
document.querySelector('#survey-form')?.addEventListener('submit',async event=>{
  event.preventDefault();
  if(surveySubmitting)return;
  const msg=document.querySelector('#survey-message');
  const form=event.currentTarget;
  const submit=form.querySelector('button[type="submit"]');
  const privacyFindings=updateSurveyPrivacy();
  if(splitPrivacyFindings(privacyFindings).hard.length){msg.className='auth-message error';msg.textContent='Fjern navn eller andre tydelige personopplysninger fra friteksten før du sender.';return;}
  const body={}; new FormData(form).forEach((v,k)=>body[k]=v);
  for(const key of ['usability','navigation','ai_relevance','practical_usefulness','simulation','privacy','would_use']) if(body[key]!==undefined&&body[key]!=='') body[key]=Number(body[key]);
  surveySubmitting=true;
  if(submit){submit.disabled=true;submit.dataset.originalText=submit.textContent;submit.textContent='Sender …';}
  try{
    const r=await fetch('/api/survey',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
    const p=await r.json();
    if(!r.ok){
      if(p.error==='SURVEY_ALREADY_COMPLETED'){
        form.hidden=true;
        const done=document.querySelector('#survey-completed-message');
        if(done)done.hidden=false;
        return;
      }
      throw new Error(p.message||'Kunne ikke lagre tilbakemeldingen.');
    }
    form.reset();
    try{localStorage.setItem('samtalestotte_survey_done','1')}catch(_){}
    form.hidden=true;
    const done=document.querySelector('#survey-completed-message');
    if(done)done.hidden=false;
    msg.className='auth-message success';
    msg.textContent='Takk! Tilbakemeldingen er registrert.';
  }
  catch(e){msg.className='auth-message error';msg.textContent=e.message;}
  finally{
    surveySubmitting=false;
    if(submit){submit.disabled=false;submit.textContent=submit.dataset.originalText||'Send tilbakemelding';delete submit.dataset.originalText;}
  }
});

document.querySelectorAll('#survey-form textarea[name="improvement_text"], #survey-form textarea[name="most_useful_text"]').forEach(input=>input.addEventListener('input',updateSurveyPrivacy));

document.querySelector('#admin-survey-enabled')?.addEventListener('change',async event=>{
  const msg=document.querySelector('#admin-survey-toggle-message'); if(msg){msg.className='auth-message';msg.textContent='Lagrer …';}
  try{const r=await fetch('/api/admin/survey/settings',{method:'PUT',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({enabled:event.target.checked})});const p=await r.json();if(!r.ok)throw new Error(p.message||'Kunne ikke endre brukertest.');if(msg){msg.className='auth-message success';msg.textContent=event.target.checked?'Brukertesten er aktiv.':'Brukertesten er slått av. Eksisterende svar er beholdt.';} }
  catch(e){event.target.checked=!event.target.checked;if(msg){msg.className='auth-message error';msg.textContent=e.message;}}
});

document.querySelector('#admin-create-invite')?.addEventListener('click',async()=>{
  const role=document.querySelector('#admin-invite-role')?.value||'user'; const expiry=document.querySelector('#admin-invite-expiry')?.value||'2026-12-31'; const msg=document.querySelector('#admin-invite-message');
  if(role==='admin'&&!confirm('Denne invitasjonen gir full administratortilgang. Opprette den?'))return;
  try{const r=await fetch('/api/admin/invites',{method:'POST',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({role,expiresAt:`${expiry}T23:59:59+01:00`})});const p=await r.json();if(!r.ok)throw new Error(p.message||'Kunne ikke opprette invitasjon.');msg.className='auth-message success';msg.innerHTML=`Invitasjon opprettet. <button type="button" class="text-button" id="copy-created-invite">Kopier lenke</button><br><small>${escapeHtml(p.url)}</small>`;document.querySelector('#copy-created-invite')?.addEventListener('click',()=>navigator.clipboard.writeText(p.url));}
  catch(e){msg.className='auth-message error';msg.textContent=e.message;}
});


// v20.6 – førstegangsbekreftelse på lest personverninformasjon. Dette er informasjon, ikke GDPR-samtykke.
document.querySelector('#privacy-ack-confirm')?.addEventListener('click',async()=>{try{const r=await fetch('/api/privacy-ack',{method:'POST',credentials:'include'});if(r.ok)document.querySelector('#privacy-ack-dialog')?.close();}catch(_){}});
document.querySelector('#privacy-ack-read-more')?.addEventListener('click',()=>{document.querySelector('#privacy-ack-dialog')?.close();openLegal('privacy');});

