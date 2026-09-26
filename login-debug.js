(() => {
  const VERSION = '19.11.5-hotfix';
  const startedAt = new Date();
  const lines = [];
  const stamp = () => new Date().toLocaleTimeString('nb-NO', { hour12: false });
  const output = () => document.querySelector('#login-debug-output');
  function log(message, extra) {
    const suffix = extra === undefined ? '' : ` ${typeof extra === 'string' ? extra : JSON.stringify(extra)}`;
    lines.push(`[${stamp()}] ${message}${suffix}`);
    const el = output();
    if (el) el.textContent = lines.join('\n');
  }
  async function safeJson(response) {
    const raw = await response.text();
    try { return { parsed: JSON.parse(raw), raw }; }
    catch { return { parsed: null, raw: raw.slice(0, 600) }; }
  }
  async function serverProbe() {
    try {
      log('Steg 1/7: Feilsøker lastet.', { version: VERSION, path: location.pathname });
      const r = await fetch('/api/auth/diagnostic', { cache: 'no-store', credentials: 'same-origin' });
      const body = await safeJson(r);
      log(`Steg 2/7: Serverkontakt ${r.ok ? 'OK' : 'FEIL'} (HTTP ${r.status}).`, body.parsed || body.raw);
    } catch (error) {
      log('Steg 2/7: Serverkontakt FEILET.', { name: error?.name, message: error?.message });
    }
  }
  document.addEventListener('DOMContentLoaded', () => {
    log('DOM klar. Innloggingsskjema leter etter hendelseslytter.');
    serverProbe();
    const form = document.querySelector('#login-form');
    const copy = document.querySelector('#copy-login-debug');
    if (!form) {
      log('KRITISK: Fant ikke #login-form.');
      return;
    }
    log('Steg 3/7: #login-form funnet og diagnose-lytter aktiv.');
    copy?.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(lines.join('\n'));
        copy.textContent = 'Kopiert';
      } catch {
        copy.textContent = 'Kunne ikke kopiere';
      }
    });
    form.addEventListener('submit', async (event) => {
      // Diagnoseversjonen tar kontroll over submit for å unngå at en eventuell gammel handler skjuler feilen.
      event.preventDefault();
      event.stopImmediatePropagation();
      const msg = document.querySelector('#login-message');
      if (msg) { msg.className = 'auth-message'; msg.textContent = 'Tester innlogging …'; }
      const identifier = document.querySelector('#login-email')?.value?.trim() || '';
      const password = document.querySelector('#login-password')?.value || '';
      log('Steg 4/7: Klikk/submit registrert.', {
        identifierType: identifier.includes('@') ? 'e-post' : 'brukernavn',
        identifierLength: identifier.length,
        passwordLength: password.length
      });
      if (!identifier || !password) {
        log('STOPP: Mangler identifikator eller passord.');
        if (msg) { msg.className = 'auth-message error'; msg.textContent = 'Fyll inn både e-post/brukernavn og passord.'; }
        return;
      }
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 15000);
      try {
        log('Steg 5/7: Sender POST /api/auth/login …');
        const r = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-Login-Debug': VERSION },
          credentials: 'same-origin',
          cache: 'no-store',
          signal: controller.signal,
          body: JSON.stringify({ identifier, password })
        });
        clearTimeout(timer);
        const requestId = r.headers.get('X-Debug-Request-Id') || '(mangler)';
        const body = await safeJson(r);
        const safeBody = body.parsed ? {
          error: body.parsed.error || null,
          message: body.parsed.message || null,
          debugStage: body.parsed.debugStage || null,
          hasUser: Boolean(body.parsed.user),
          username: body.parsed.user?.username || null
        } : { raw: body.raw };
        log(`Steg 6/7: Login-svar HTTP ${r.status}.`, { requestId, ...safeBody });
        if (!r.ok) {
          if (msg) { msg.className = 'auth-message error'; msg.textContent = body.parsed?.message || `Innlogging feilet (HTTP ${r.status}).`; }
          return;
        }
        const me = await fetch('/api/auth/me', { cache: 'no-store', credentials: 'same-origin' });
        const meBody = await safeJson(me);
        log(`Steg 7/7: Session-kontroll HTTP ${me.status}.`, {
          hasUser: Boolean(meBody.parsed?.user),
          username: meBody.parsed?.user?.username || null
        });
        if (me.ok && meBody.parsed?.user) {
          if (msg) { msg.className = 'auth-message ok'; msg.textContent = 'Innlogging godkjent. Laster appen …'; }
          setTimeout(() => location.reload(), 700);
        } else {
          if (msg) { msg.className = 'auth-message error'; msg.textContent = 'Passordet ble godkjent, men session ble ikke funnet etterpå.'; }
        }
      } catch (error) {
        clearTimeout(timer);
        const info = { name: error?.name || 'Error', message: error?.message || String(error) };
        log(error?.name === 'AbortError' ? 'STOPP: Login-kallet fikk timeout etter 15 sekunder.' : 'STOPP: Fetch kastet feil.', info);
        if (msg) { msg.className = 'auth-message error'; msg.textContent = error?.name === 'AbortError' ? 'Innloggingen svarte ikke innen 15 sekunder.' : `Teknisk feil: ${info.message}`; }
      }
    }, true);
  });
  window.addEventListener('error', (event) => log('JavaScript-feil på siden.', { message: event.message, file: event.filename?.split('/').pop(), line: event.lineno }));
  window.addEventListener('unhandledrejection', (event) => log('Ubehandlet Promise-feil.', { reason: String(event.reason?.message || event.reason) }));
})();
