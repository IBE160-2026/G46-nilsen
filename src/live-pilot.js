import {
  LIVE_TIMEOUTS,
  appendTranscript,
  employerTypeFromSpeech,
  employerTypeLabel,
  normalizeSpeechText,
  voiceCommand
} from "/src/live-pilot-utils.js";

const state = {
  config: null,
  panel: null,
  draft: "",
  partial: "",
  micActive: false,
  pc: null,
  dc: null,
  stream: null,
  audioContext: null,
  analyser: null,
  vadFrame: null,
  inactivityTimer: null,
  speakingDetected: false,
  speechStartedAt: 0,
  lastSpeechAt: 0,
  lastUserActivity: 0,
  timeoutWarned: false,
  phase: "dictating",
  context: { occupation: "", sectorId: "", employerType: "" },
  pendingOccupation: null,
  pendingEmployerType: "",
  pendingContextResult: null,
  pendingSendText: "",
  occupationSkipped: false,
  employerSkipped: false,
  hasGuidance: false,
  ttsEnabled: true,
  ttsActive: false,
  selectedVoice: "",
  generationPending: false
};

function q(selector) {
  return state.panel ? state.panel.querySelector(selector) : document.querySelector(selector);
}

function setStatus(text, kind) {
  const node = q("#live-pilot-status");
  if (!node) return;
  node.textContent = text;
  node.className = "live-pilot-status" + (kind ? " " + kind : "");
}

function setMessage(text, kind) {
  const node = q("#live-pilot-message");
  if (!node) return;
  node.hidden = !text;
  node.textContent = text || "";
  node.dataset.kind = kind || "";
}

function setContextMessage(text) {
  const node = q("#live-pilot-context");
  if (!node) return;
  node.hidden = !text;
  node.textContent = text || "";
}

function setPrivacy(findings) {
  const box = q("#live-pilot-privacy");
  if (!box) return;
  box.innerHTML = "";
  if (!findings || !findings.length) {
    box.hidden = true;
    return;
  }
  const strong = document.createElement("strong");
  strong.textContent = "Kan ikke sendes ennå";
  box.appendChild(strong);
  const p = document.createElement("p");
  p.textContent = "Jeg fant opplysninger som må anonymiseres før vi kan fortsette:";
  box.appendChild(p);
  const ul = document.createElement("ul");
  findings.slice(0, 5).forEach(function (finding) {
    const li = document.createElement("li");
    li.textContent = finding.label || finding.message || finding.type || "Personvernfunn";
    ul.appendChild(li);
  });
  box.appendChild(ul);
  box.hidden = false;
}

function updateDraftUi() {
  const field = q("#live-pilot-draft");
  if (field && field.value !== state.draft) field.value = state.draft;
  const partial = q("#live-pilot-partial");
  if (partial) partial.textContent = state.partial ? "Hører: " + state.partial : "";
}

function setDraft(value) {
  state.draft = normalizeSpeechText(value);
  updateDraftUi();
  setPrivacy([]);
}

function addDraft(value) {
  state.draft = appendTranscript(state.draft, value);
  state.partial = "";
  updateDraftUi();
}

function touchActivity() {
  state.lastUserActivity = Date.now();
  state.timeoutWarned = false;
}

function setLevel(value) {
  const meter = q("#live-pilot-level-fill");
  if (!meter) return;
  const pct = Math.max(0, Math.min(100, Math.round(value * 900)));
  meter.style.width = pct + "%";
}

function preferredVoices() {
  if (!("speechSynthesis" in window)) return [];
  const voices = window.speechSynthesis.getVoices() || [];
  return voices.filter(function (voice) { return /^(?:nb|nn|no)(?:-|$)/i.test(voice.lang || ""); }).sort(function (a, b) {
    const aNo = /^nb|^no/i.test(a.lang || "") ? 0 : 1;
    const bNo = /^nb|^no/i.test(b.lang || "") ? 0 : 1;
    if (aNo !== bNo) return aNo - bNo;
    return String(a.name).localeCompare(String(b.name), "nb");
  });
}

function populateVoices() {
  const select = q("#live-pilot-voice");
  if (!select) return;
  const voices = preferredVoices();
  select.innerHTML = "";
  if (!voices.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Ingen norsk stemme tilgjengelig på denne enheten";
    select.appendChild(option);
    return;
  }
  voices.forEach(function (voice) {
    const option = document.createElement("option");
    option.value = voice.name;
    option.textContent = voice.name + (voice.lang ? " · " + voice.lang : "");
    select.appendChild(option);
  });
  const stored = localStorage.getItem("samtalestotte-live-voice") || "";
  const norwegian = voices.find(function (voice) { return /^nb|^no/i.test(voice.lang || ""); });
  const chosen = voices.find(function (voice) { return voice.name === stored; }) || norwegian || voices[0];
  state.selectedVoice = chosen ? chosen.name : "";
  select.value = state.selectedVoice;
}

function selectedSpeechVoice() {
  const voices = preferredVoices();
  return voices.find(function (voice) { return voice.name === state.selectedVoice; })
    || voices.find(function (voice) { return /^nb|^no/i.test(voice.lang || ""); })
    || voices[0]
    || null;
}

function setMicTrackEnabled(enabled) {
  if (!state.stream) return;
  state.stream.getAudioTracks().forEach(function (track) {
    track.enabled = Boolean(enabled);
  });
}

function stopSpeech() {
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  state.ttsActive = false;
  if (state.micActive) setMicTrackEnabled(true);
  const button = q("#live-pilot-stop-speech");
  if (button) button.hidden = true;
}

function speak(text, options) {
  const opts = options || {};
  const clean = normalizeSpeechText(text);
  if (!clean || !state.ttsEnabled || !("speechSynthesis" in window)) return Promise.resolve();
  if (!selectedSpeechVoice()) {
    setMessage("Ingen norsk opplesningsstemme er installert på enheten. Opplesning er deaktivert for å unngå feil språk.");
    return Promise.resolve();
  }

  stopSpeech();
  state.ttsActive = true;
  if (state.micActive) setMicTrackEnabled(false);
  const stopButton = q("#live-pilot-stop-speech");
  if (stopButton) stopButton.hidden = false;

  return new Promise(function (resolve) {
    const utterance = new SpeechSynthesisUtterance(clean);
    const voice = selectedSpeechVoice();
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || "nb-NO";
    } else {
      utterance.lang = "nb-NO";
    }
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    const done = function () {
      state.ttsActive = false;
      if (state.micActive) setMicTrackEnabled(true);
      if (stopButton) stopButton.hidden = true;
      if (opts.resetTimeout !== false) touchActivity();
      resolve();
    };
    utterance.onend = done;
    utterance.onerror = done;
    window.speechSynthesis.speak(utterance);
  });
}

function currentContextText() {
  const parts = [];
  if (state.context.occupation) parts.push("Yrke: " + state.context.occupation);
  if (state.context.employerType) parts.push("Arbeidsgiver: " + employerTypeLabel(state.context.employerType));
  return parts.join(" · ");
}

function refreshContextSummary() {
  setContextMessage(currentContextText());
}

async function fetchJson(url, options) {
  const response = await fetch(url, options || {});
  let payload = {};
  try { payload = await response.json(); } catch (_) {}
  if (!response.ok) {
    const error = new Error(payload.message || "Forespørselen feilet.");
    error.code = payload.error || "HTTP_" + response.status;
    error.status = response.status;
    throw error;
  }
  return payload;
}

async function contextCheck(text) {
  return fetchJson("/api/live/context-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text })
  });
}

function phasePrompt(text, phase) {
  state.phase = phase;
  setStatus("Venter på svar", "warning");
  setMessage(text);
  return speak(text, { resetTimeout: true });
}

async function continueContextFlow() {
  const result = state.pendingContextResult || {};

  if (!state.context.occupation && !state.occupationSkipped && result.occupationRelevant) {
    if (state.pendingOccupation) {
      const text = "Jeg oppfatter at dette gjelder " + state.pendingOccupation.occupation + ". Stemmer det?";
      return phasePrompt(text, "confirmOccupation");
    }
    return phasePrompt(
      "Yrket kan ha betydning for rådet i denne saken. Si yrket eller yrkesgruppen nå, eller si hopp over.",
      "askOccupation"
    );
  }

  if (!state.context.employerType && !state.employerSkipped && result.employerTypeRelevant) {
    if (state.pendingEmployerType) {
      const text = "Jeg oppfatter arbeidsgiver som " + employerTypeLabel(state.pendingEmployerType) + ". Stemmer det?";
      return phasePrompt(text, "confirmEmployer");
    }
    return phasePrompt(
      "Arbeidsgivertype kan ha betydning her. Si stat, kommune eller fylkeskommune, helseforetak, privat, eller usikker.",
      "askEmployer"
    );
  }

  state.phase = "dictating";
  setMessage("");
  await submitPendingText();
}

async function handleContextAnswer(utterance, command) {
  const normalized = normalizeSpeechText(utterance);

  if (state.phase === "confirmOccupation") {
    if (command === "yes") {
      state.context.occupation = state.pendingOccupation.occupation;
      state.context.sectorId = state.pendingOccupation.sectorId || "";
      refreshContextSummary();
      return continueContextFlow();
    }
    if (command === "no") {
      state.pendingOccupation = null;
      return phasePrompt("Greit. Si riktig yrke eller yrkesgruppe, eller si hopp over.", "askOccupation");
    }
    if (command === "skip") {
      state.occupationSkipped = true;
      state.pendingOccupation = null;
      return continueContextFlow();
    }
    setMessage("Svar ja, nei eller hopp over.");
    return speak("Svar ja, nei eller hopp over.");
  }

  if (state.phase === "askOccupation") {
    if (command === "skip") {
      state.occupationSkipped = true;
      return continueContextFlow();
    }
    const detected = await contextCheck(normalized);
    if (detected.occupation) {
      state.context.occupation = detected.occupation.occupation;
      state.context.sectorId = detected.occupation.sectorId || "";
    } else {
      state.context.occupation = normalized;
      state.context.sectorId = "";
    }
    refreshContextSummary();
    return continueContextFlow();
  }

  if (state.phase === "confirmEmployer") {
    if (command === "yes") {
      state.context.employerType = state.pendingEmployerType;
      refreshContextSummary();
      return continueContextFlow();
    }
    if (command === "no") {
      state.pendingEmployerType = "";
      return phasePrompt(
        "Greit. Si stat, kommune eller fylkeskommune, helseforetak, privat, eller usikker.",
        "askEmployer"
      );
    }
    if (command === "skip") {
      state.employerSkipped = true;
      state.pendingEmployerType = "";
      return continueContextFlow();
    }
    setMessage("Svar ja, nei eller hopp over.");
    return speak("Svar ja, nei eller hopp over.");
  }

  if (state.phase === "askEmployer") {
    if (command === "skip") {
      state.employerSkipped = true;
      return continueContextFlow();
    }
    const employer = employerTypeFromSpeech(normalized);
    if (!employer) {
      setMessage("Jeg fikk ikke tak i arbeidsgivertypen. Si stat, kommune, helseforetak, privat, usikker eller hopp over.");
      return speak("Jeg fikk ikke tak i arbeidsgivertypen. Prøv igjen, eller si hopp over.");
    }
    if (employer === "unknown") {
      state.employerSkipped = true;
    } else {
      state.context.employerType = employer;
      refreshContextSummary();
    }
    return continueContextFlow();
  }
}

async function handleUtterance(raw) {
  const utterance = normalizeSpeechText(raw);
  if (!utterance) return;
  touchActivity();

  const command = voiceCommand(utterance);

  if (command === "stopMic") {
    await stopMicrophone(false);
    setMessage("Mikrofonen er slått av. Teksten er beholdt som utkast.");
    return;
  }
  if (command === "stopSpeech") {
    stopSpeech();
    return;
  }
  if (command === "continue") {
    touchActivity();
    setStatus(state.micActive ? "Lytter" : "Mikrofon av", state.micActive ? "listening" : "");
    setMessage(state.micActive ? "Fortsetter å lytte." : "Mikrofonen er av. Trykk Start mikrofon for å fortsette.");
    return;
  }

  if (state.phase !== "dictating") {
    try {
      await handleContextAnswer(utterance, command);
    } catch (error) {
      setStatus("Kontekstfeil", "error");
      setMessage(error.message || "Kunne ikke behandle svaret.");
    }
    return;
  }

  if (command === "clear" || command === "restart") {
    setDraft("");
    state.context = { occupation: "", sectorId: "", employerType: "" };
    state.occupationSkipped = false;
    state.employerSkipped = false;
    state.hasGuidance = false;
    refreshContextSummary();
    setMessage("Utkastet er slettet.");
    return;
  }

  if (command === "send") {
    return beginSend();
  }

  addDraft(utterance);
  setStatus(state.micActive ? "Lytter" : "Mikrofon av", state.micActive ? "listening" : "");
}

async function beginSend() {
  const text = normalizeSpeechText(state.draft);
  if (!text) {
    setMessage("Det er ingen tekst å sende ennå.");
    return speak("Det er ingen tekst å sende ennå.");
  }
  if (state.generationPending) return;

  const bridge = window.SamtalestotteLiveBridge;
  if (!bridge) {
    setStatus("LIVE-bro mangler", "error");
    setMessage("Pilotgrensesnittet finner ikke Samtalestøtte-motoren.");
    return;
  }

  const privacy = bridge.privacyCheck(text);
  if (privacy.blocked) {
    setPrivacy(privacy.hard);
    setStatus("Personvern må fikses", "error");
    setMessage("Teksten er ikke sendt.");
    await speak("Jeg fant opplysninger som må anonymiseres før vi kan fortsette. Se teksten på skjermen.");
    return;
  }
  setPrivacy([]);

  if (state.hasGuidance) {
    state.generationPending = true;
    setStatus("Sender oppfølging …", "warning");
    setMessage("Oppfølgingsspørsmålet sendes til den aktive samtalen.");
    try {
      const result = await bridge.continueConversation(text);
      if (!result.ok) throw new Error("Oppfølgingen kunne ikke sendes.");
    } catch (error) {
      state.generationPending = false;
      setStatus("Kunne ikke sende", "error");
      setMessage(error.message || "Oppfølgingen feilet.");
    }
    return;
  }

  state.pendingSendText = text;
  state.pendingContextResult = await contextCheck(text);
  state.pendingOccupation = state.pendingContextResult.occupation || null;
  state.pendingEmployerType = state.pendingContextResult.employerType || "";
  state.occupationSkipped = false;
  state.employerSkipped = false;

  await continueContextFlow();
}

async function submitPendingText() {
  const text = state.pendingSendText;
  if (!text || state.generationPending) return;
  const bridge = window.SamtalestotteLiveBridge;
  state.generationPending = true;
  setStatus("Sender …", "warning");
  setMessage("Teksten er personvernsjekket og sendes til Samtalestøtte.");

  try {
    const result = await bridge.submitSituation(text, state.context);
    if (!result.ok) {
      state.generationPending = false;
      if (result.reason === "privacy") {
        setPrivacy(result.hard || result.findings || []);
        setStatus("Personvern må fikses", "error");
        await speak("Jeg fant opplysninger som må anonymiseres før vi kan fortsette. Se teksten på skjermen.");
        return;
      }
      throw new Error("Situasjonen kunne ikke sendes.");
    }
  } catch (error) {
    state.generationPending = false;
    setStatus("Kunne ikke sende", "error");
    setMessage(error.message || "LIVE-sendingen feilet.");
  }
}

function shortGuidanceSummary(guidance) {
  if (!guidance) return "Rådet er klart og vises på skjermen.";
  const point = Array.isArray(guidance.attention) && guidance.attention[0]
    ? guidance.attention[0]
    : guidance.opening || "";
  const clean = normalizeSpeechText(point);
  const trimmed = clean.length > 190 ? clean.slice(0, 187).replace(/\s+\S*$/, "") + " …" : clean;
  return trimmed
    ? "Rådet er klart. Hovedpoenget er: " + trimmed
    : "Rådet er klart og vises på skjermen.";
}

function shortReplySummary(reply) {
  const clean = normalizeSpeechText(reply);
  if (!clean) return "Svaret er klart og vises på skjermen.";
  const first = clean.split(/(?<=[.!?])\s+/u)[0] || clean;
  const trimmed = first.length > 200 ? first.slice(0, 197).replace(/\s+\S*$/, "") + " …" : first;
  return "Svaret er klart. " + trimmed;
}

function handleRealtimeEvent(event) {
  if (!event || !event.type) return;
  if (event.type === "conversation.item.input_audio_transcription.delta") {
    state.partial += event.delta || "";
    updateDraftUi();
    return;
  }
  if (event.type === "conversation.item.input_audio_transcription.completed") {
    const transcript = event.transcript || state.partial;
    state.partial = "";
    updateDraftUi();
    handleUtterance(transcript).catch(function (error) {
      setStatus("Tale kunne ikke behandles", "error");
      setMessage(error.message || "Ukjent feil.");
    });
    return;
  }
  if (event.type === "error") {
    setStatus("Transkripsjonsfeil", "error");
    setMessage(event.error && event.error.message ? event.error.message : "Transkripsjonstjenesten meldte en feil.");
  }
}

function commitAudioTurn() {
  if (!state.dc || state.dc.readyState !== "open") return;
  try {
    state.dc.send(JSON.stringify({ type: "input_audio_buffer.commit" }));
  } catch (_) {}
}

function vadLoop() {
  if (!state.micActive || !state.analyser) return;
  const data = new Uint8Array(state.analyser.fftSize);
  state.analyser.getByteTimeDomainData(data);
  let sum = 0;
  for (let i = 0; i < data.length; i += 1) {
    const centered = (data[i] - 128) / 128;
    sum += centered * centered;
  }
  const rms = Math.sqrt(sum / data.length);
  setLevel(rms);

  const now = Date.now();
  const threshold = 0.018;

  if (!state.ttsActive && rms > threshold) {
    touchActivity();
    if (!state.speakingDetected) {
      state.speakingDetected = true;
      state.speechStartedAt = now;
    }
    state.lastSpeechAt = now;
  } else if (
    state.speakingDetected
    && !state.ttsActive
    && now - state.lastSpeechAt >= LIVE_TIMEOUTS.utteranceSilenceMs
    && now - state.speechStartedAt >= LIVE_TIMEOUTS.minimumSpeechMs
  ) {
    state.speakingDetected = false;
    commitAudioTurn();
  }

  state.vadFrame = requestAnimationFrame(vadLoop);
}

function startInactivityWatch() {
  clearInterval(state.inactivityTimer);
  state.lastUserActivity = Date.now();
  state.timeoutWarned = false;
  state.inactivityTimer = setInterval(async function () {
    if (!state.micActive) return;
    const elapsed = Date.now() - state.lastUserActivity;
    if (elapsed >= LIVE_TIMEOUTS.stopMs) {
      clearInterval(state.inactivityTimer);
      await stopMicrophone(false);
      setStatus("Mikrofon av", "");
      setMessage("Mikrofonen ble slått av etter ett minutt uten registrert tale. Utkastet er beholdt.");
      await speak("Mikrofonen er nå slått av. Trykk på mikrofonen når du vil fortsette.", { resetTimeout: false });
      return;
    }
    if (elapsed >= LIVE_TIMEOUTS.warningMs && !state.timeoutWarned) {
      state.timeoutWarned = true;
      setStatus("Snart av", "warning");
      setMessage("Ingen tale på en stund. Si «fortsett» innen 15 sekunder for å beholde mikrofonen på.");
      await speak(
        "Jeg har ikke hørt noe på en stund. Mikrofonen slås av om 15 sekunder. Si fortsett hvis du vil beholde den på.",
        { resetTimeout: false }
      );
    }
  }, 1000);
}

async function startMicrophone() {
  if (state.micActive) return;
  if (!state.config || !state.config.liveTranscriptionConfigured) {
    setStatus("Ikke konfigurert", "error");
    setMessage("Transkripsjonsnøkkel er ikke konfigurert i pilot-Render. Vanlig tekstmodus fungerer fortsatt.");
    return;
  }
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    setStatus("Mikrofon støttes ikke", "error");
    setMessage("Denne nettleseren støtter ikke mikrofontilgang.");
    return;
  }

  setStatus("Kobler til …", "warning");
  setMessage("Ber om mikrofontillatelse og oppretter en kortlivet transkripsjonsøkt.");

  try {
    // Be om mikrofon direkte fra brukerklikket. Mobilnettlesere kan kreve
    // brukeraktivering før første await/nettverkskall.
    setMessage("Ber nettleseren om mikrofontilgang …");
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });
    state.stream = stream;
    setMessage("Mikrofon åpnet. Oppretter transkripsjonsøkt …");
    const token = await fetchJson("/api/live/transcription-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}"
    });

    const pc = new RTCPeerConnection();
    const dc = pc.createDataChannel("oai-events");
    state.pc = pc;
    state.dc = dc;
    state.stream = stream;

    stream.getTracks().forEach(function (track) {
      pc.addTrack(track, stream);
    });

    dc.addEventListener("message", function (event) {
      try { handleRealtimeEvent(JSON.parse(event.data)); } catch (_) {}
    });

    dc.addEventListener("open", function () {
      setStatus("Lytter", "listening");
      setMessage("Snakk normalt. Si «send» som egen ytring når teksten er klar.");
    });

    pc.addEventListener("connectionstatechange", function () {
      if (["failed", "disconnected", "closed"].includes(pc.connectionState) && state.micActive) {
        setStatus("Forbindelsen ble brutt", "error");
        setMessage("LIVE-transkripsjonen mistet forbindelsen. Utkastet er beholdt.");
      }
    });

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    const sdpResponse = await fetch("https://api.openai.com/v1/realtime/calls", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + token.clientSecret,
        "Content-Type": "application/sdp"
      },
      body: offer.sdp
    });
    if (!sdpResponse.ok) {
      let detail = "";
      try { const payload = await sdpResponse.json(); detail = payload?.error?.message || payload?.error?.code || ""; } catch (_) {}
      throw new Error("OpenAI Realtime avviste tilkoblingen (HTTP " + sdpResponse.status + ")." + (detail ? " " + String(detail).slice(0, 240) : ""));
    }
    const answerSdp = await sdpResponse.text();
    await pc.setRemoteDescription({ type: "answer", sdp: answerSdp });

    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const source = state.audioContext.createMediaStreamSource(stream);
    state.analyser = state.audioContext.createAnalyser();
    state.analyser.fftSize = 1024;
    source.connect(state.analyser);

    state.micActive = true;
    state.speakingDetected = false;
    state.lastSpeechAt = 0;
    state.speechStartedAt = 0;
    touchActivity();
    startInactivityWatch();
    state.vadFrame = requestAnimationFrame(vadLoop);

    q("#live-pilot-start").textContent = "Mikrofon på";
    q("#live-pilot-start").disabled = true;
    q("#live-pilot-stop").disabled = false;
    setStatus("Lytter", "listening");
  } catch (error) {
    const reason = error && error.message ? error.message : "Ukjent oppstartsfeil";
    console.error("[live-pilot] Mikrofonstart feilet:", error);
    await stopMicrophone(true);
    setStatus("Kunne ikke starte", "error");
    if (error && error.name === "NotAllowedError") {
      setMessage("Mikrofontillatelsen ble avslått. Du kan fortsatt bruke vanlig tekstmodus.");
    } else {
      setMessage("Mikrofonen ble slått av fordi oppstarten feilet: " + reason);
    }
  }
}

async function stopMicrophone(silent) {
  if (state.vadFrame) cancelAnimationFrame(state.vadFrame);
  state.vadFrame = null;
  clearInterval(state.inactivityTimer);
  state.inactivityTimer = null;
  state.speakingDetected = false;
  setLevel(0);

  if (state.stream) {
    state.stream.getTracks().forEach(function (track) { track.stop(); });
  }
  if (state.dc) {
    try { state.dc.close(); } catch (_) {}
  }
  if (state.pc) {
    try { state.pc.close(); } catch (_) {}
  }
  if (state.audioContext) {
    try { await state.audioContext.close(); } catch (_) {}
  }

  state.stream = null;
  state.dc = null;
  state.pc = null;
  state.audioContext = null;
  state.analyser = null;
  state.micActive = false;

  const start = q("#live-pilot-start");
  const stop = q("#live-pilot-stop");
  if (start) {
    start.disabled = !(state.config && state.config.liveTranscriptionConfigured);
    start.textContent = "Start mikrofon";
  }
  if (stop) stop.disabled = true;
  if (!silent) setStatus("Mikrofon av", "");
}

function injectStylesheet() {
  if (document.querySelector('link[data-live-pilot-style]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "/assets/live-pilot.css";
  link.dataset.livePilotStyle = "true";
  document.head.appendChild(link);
}

function createUi() {
  injectStylesheet();

  const launch = document.createElement("button");
  launch.id = "live-pilot-launch";
  launch.className = "live-pilot-launch";
  launch.type = "button";
  launch.setAttribute("aria-controls", "live-pilot-panel");
  launch.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"></rect><path d="M5 10a7 7 0 0 0 14 0M12 17v5m-4 0h8"></path></svg><span>LIVE mikrofon</span><small>Pilot</small>';
  launch.setAttribute("aria-label", "Åpne LIVE-mikrofon");
  document.body.appendChild(launch);

  const panel = document.createElement("aside");
  panel.id = "live-pilot-panel";
  panel.className = "live-pilot-panel";
  panel.hidden = true;
  panel.setAttribute("aria-label", "LIVE-pilot");
  panel.innerHTML =
    '<div class="live-pilot-inner">' +
      '<div class="live-pilot-header">' +
        '<div class="live-pilot-title-wrap"><span class="live-pilot-kicker">Eksperimentell pilot</span><h2>LIVE Samtalestøtte</h2></div>' +
        '<button class="live-pilot-close" id="live-pilot-close" type="button" aria-label="Lukk LIVE">×</button>' +
      '</div>' +
      '<div class="live-pilot-notice"><strong>Lyd lagres ikke av Samtalestøtte.</strong><br>Det du sier transkriberes til tekst. Teksten personvernsjekkes før den sendes videre. Opplesning bruker en syntetisk nettleserstemme i denne piloten.</div>' +
      '<div class="live-pilot-status-row"><span id="live-pilot-status" class="live-pilot-status">Mikrofon av</span><span class="live-pilot-level" aria-hidden="true"><span id="live-pilot-level-fill"></span></span></div>' +
      '<label class="live-pilot-label" for="live-pilot-draft">Transkripsjon / utkast</label>' +
      '<textarea id="live-pilot-draft" class="live-pilot-draft" placeholder="Det du sier vises her. Du kan også redigere teksten manuelt."></textarea>' +
      '<div id="live-pilot-partial" class="live-pilot-partial" aria-live="polite"></div>' +
      '<div class="live-pilot-actions">' +
        '<button id="live-pilot-start" class="live-pilot-primary" type="button">Start mikrofon</button>' +
        '<button id="live-pilot-stop" class="live-pilot-secondary" type="button" disabled>Stopp mikrofon</button>' +
        '<button id="live-pilot-send" class="live-pilot-primary" type="button">Få råd / send</button>' +
        '<button id="live-pilot-clear" class="live-pilot-danger" type="button">Slett</button>' +
        '<button id="live-pilot-stop-speech" class="live-pilot-secondary" type="button" hidden>Stopp opplesning</button>' +
      '</div>' +
      '<div id="live-pilot-context" class="live-pilot-context" hidden></div>' +
      '<div id="live-pilot-privacy" class="live-pilot-privacy" hidden></div>' +
      '<div id="live-pilot-message" class="live-pilot-message" hidden aria-live="polite"></div>' +
      '<div class="live-pilot-options">' +
        '<label><input id="live-pilot-tts" type="checkbox" checked> Les korte systemmeldinger høyt</label>' +
        '<label for="live-pilot-voice">Stemme <select id="live-pilot-voice"></select></label>' +
      '</div>' +
      '<p class="live-pilot-help"><strong>Talekommandoer:</strong> «send», «slett», «start på nytt», «hopp over», «fortsett», «stopp mikrofon», «ja» og «nei». Si «send», «ferdig» eller «få råd» som en egen ytring. Mikrofonen varsler etter 45 sekunder uten tale og slås av etter 60 sekunder.</p>' +
    '</div>';
  document.body.appendChild(panel);
  state.panel = panel;

  launch.addEventListener("click", function () {
    panel.hidden = false;
    launch.hidden = true;
    populateVoices();
    if (!state.config.liveTranscriptionConfigured) {
      setStatus("Transkripsjon ikke konfigurert", "error");
      setMessage("Pilotgrensesnittet er klart, men transkripsjonsnøkkel mangler i pilot-Render. Vanlig tekstmodus er fortsatt tilgjengelig.");
      q("#live-pilot-start").disabled = true;
    }
  });

  q("#live-pilot-close").addEventListener("click", async function () {
    await stopMicrophone(true);
    stopSpeech();
    panel.hidden = true;
    launch.hidden = false;
  });

  q("#live-pilot-start").addEventListener("click", startMicrophone);
  q("#live-pilot-stop").addEventListener("click", function () { stopMicrophone(false); });
  q("#live-pilot-send").addEventListener("click", function () {
    if (state.micActive && state.speakingDetected) {
      state.speakingDetected = false;
      commitAudioTurn();
      setMessage("Avslutter siste lydsegment. Trykk «Få råd» igjen når teksten vises.");
      return;
    }
    beginSend().catch(function (error) {
      setStatus("Kunne ikke sende", "error");
      setMessage(error.message || "Sendingen feilet.");
    });
  });
  q("#live-pilot-stop-speech").addEventListener("click", stopSpeech);

  q("#live-pilot-clear").addEventListener("click", function () {
    setDraft("");
    state.context = { occupation: "", sectorId: "", employerType: "" };
    state.hasGuidance = false;
    state.phase = "dictating";
    state.generationPending = false;
    refreshContextSummary();
    setMessage("Utkastet er slettet.");
  });

  q("#live-pilot-draft").addEventListener("input", function (event) {
    state.draft = event.currentTarget.value;
    setPrivacy([]);
    touchActivity();
  });

  q("#live-pilot-tts").addEventListener("change", function (event) {
    state.ttsEnabled = event.currentTarget.checked;
    if (!state.ttsEnabled) stopSpeech();
  });

  q("#live-pilot-voice").addEventListener("change", function (event) {
    state.selectedVoice = event.currentTarget.value;
    try { localStorage.setItem("samtalestotte-live-voice", state.selectedVoice); } catch (_) {}
  });

  if ("speechSynthesis" in window) {
    window.speechSynthesis.onvoiceschanged = populateVoices;
  }
  populateVoices();
}

window.addEventListener("samtalestotte:guidance-ready", async function (event) {
  state.generationPending = false;
  state.hasGuidance = true;
  state.phase = "dictating";
  setDraft("");
  setStatus(state.micActive ? "Lytter" : "Mikrofon av", state.micActive ? "listening" : "");
  setMessage("Rådet er klart på skjermen. LIVE kan åpnes igjen for oppfølgingsspørsmål.");
  const panel = q("#live-pilot-panel");
  const launch = q("#live-pilot-launch");
  if (panel && launch) {
    panel.hidden = true;
    launch.hidden = false;
    launch.setAttribute("aria-label", state.micActive ? "LIVE lytter – åpne mikrofonkontroller" : "Åpne LIVE-kontroller");
  }
  await speak(shortGuidanceSummary(event.detail && event.detail.guidance));
});

window.addEventListener("samtalestotte:guidance-error", function (event) {
  state.generationPending = false;
  setStatus("Råd feilet", "error");
  setMessage((event.detail && event.detail.message) || "Kunne ikke lage rådet.");
});

window.addEventListener("samtalestotte:continuation-ready", async function (event) {
  state.generationPending = false;
  setDraft("");
  setStatus(state.micActive ? "Lytter" : "Mikrofon av", state.micActive ? "listening" : "");
  setMessage("Oppfølgingssvaret er klart på skjermen.");
  await speak(shortReplySummary(event.detail && event.detail.reply));
});

async function init() {
  try {
    state.config = await fetchJson("/api/public-config", { cache: "no-store" });
  } catch (_) {
    return;
  }
  if (!state.config.liveVoicePilotEnabled) return;
  createUi();
}

init();
