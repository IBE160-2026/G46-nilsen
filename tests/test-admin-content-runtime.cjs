// Regression for real src/client/admin-content.js, not a hand-copied implementation.
// Isolated fake DOM, API and role. No production data or requests.
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync("src/client/admin-content.js", "utf8");
const app = fs.readFileSync("app.js", "utf8");
assert(app.includes("window.SamtalestotteAdminContent.create("), "App must instantiate the extracted editor");

const escapeHtml = v => String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
  .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

function reply(payload, status = 200) {
  return { ok: status >= 200 && status < 300, json: async () => payload };
}
function harness(role = "editor") {
  const calls = [], persisted = [];
  const currentUser = { id: "synthetic-user", role };
  const nodes = new Map();
  const inputs = [
    { dataset: { adminContentKey: "home.title" }, value: "  Ny tittel  ", handlers: {} },
    { dataset: { adminContentKey: "privacy.intro" }, value: "  <unsafe> tekst  ", handlers: {} }
  ];
  for (const input of inputs) {
    input.addEventListener = (name, cb) => { input.handlers[name] = cb; };
  }
  function node(selector) {
    if (!nodes.has(selector)) nodes.set(selector, {
      innerHTML: "", textContent: "", hidden: false, disabled: true, className: "",
      querySelectorAll: () => selector === "#admin-content-fields" ? inputs : []
    });
    return nodes.get(selector);
  }
  const document = {
    querySelector: node,
    querySelectorAll: selector => selector === "[data-admin-content-key]" ? inputs : []
  };
  let api = async () => { throw Error("No mock response"); };
  const context = { document, escapeHtml };
  vm.runInNewContext(source, context, { filename: "src/client/admin-content.js", timeout: 1500 });
  assert.equal(typeof context.SamtalestotteAdminContent?.create, "function");
  const editor = context.SamtalestotteAdminContent.create({
    document,
    escapeHtml,
    fetch: async (url, options) => { calls.push({ url, options }); return api(url, options); },
    allContentSections: () => [
      { title: 'Hoveddel <script>', fields: [
        { key: "home.title", label: "Tittel <img>", multiline: false, fallback: "Nåværende & før" },
        { key: "privacy.intro", label: "Personvern", multiline: true, fallback: "Hei" }
      ] },
      { title: "Andre del", fields: [{ key: "contact.intro", label: "Kontakt", fallback: "ok" }] }
    ],
    contentValue: (key, fallback) => key === "privacy.intro" && persisted.length ? persisted.at(-1)[key] : fallback,
    defaultContentValue: field => field.fallback,
    persistContentOverrides: values => { persisted.push(values); },
    getCurrentUser: () => currentUser
  });
  return { editor, currentUser, calls, persisted, node, inputs, mock: fn => { api = fn; } };
}

(async () => {
  // No role -> no editing, marking dirty or API calls. Client restriction is not a server boundary.
  {
    const t = harness("user");
    t.editor.renderAdminContentFields();
    assert.equal(t.node("#admin-content-fields").innerHTML, "");
    t.editor.markAdminDirty();
    assert.equal(t.editor.isAdminContentDirty(), false);
    await t.editor.saveAdminContent();
    assert.equal(t.calls.length, 0);
    assert.equal(t.node("#admin-content-message").className, "auth-message error");
  }

  // Editor: real rendering, correct escaping, default section and textarea attributes.
  {
    const t = harness("editor");
    t.editor.renderAdminContentFields();
    const markup = t.node("#admin-content-fields").innerHTML;
    assert.match(markup, /Hoveddel &lt;script&gt;/);
    assert.match(markup, /Tittel &lt;img&gt;/);
    assert.match(markup, /Nåværende &amp; før/);
    assert.ok(!markup.includes("<script>") && !markup.includes("<img>"));
    assert.match(markup, /rows="4"/);
    assert.equal((markup.match(/<details /g) || []).length, 2);
    assert.equal((markup.match(/<details class="admin-content-section" open/g) || []).length, 1);
    assert.equal(typeof t.inputs[0].handlers.input, "function");
    assert.equal(t.editor.isAdminContentDirty(), false);
    t.inputs[0].handlers.input();
    assert.equal(t.editor.isAdminContentDirty(), true);
    assert.equal(t.node("#admin-unsaved-indicator").hidden, false);
    assert.equal(t.node("#admin-save-content").disabled, false);

    // Actual request contract and trimming, without storing any content before success.
    t.mock(async (url, options) => {
      assert.equal(url, "/api/admin/content");
      assert.equal(options.method, "PUT");
      assert.equal(options.credentials, "include");
      assert.equal(options.headers["Content-Type"], "application/json");
      const payload = JSON.parse(options.body);
      assert.deepEqual(Object.keys(payload.values).sort(), ["home.title", "privacy.intro"]);
      assert.equal(payload.values["home.title"], "Ny tittel");
      assert.equal(payload.values["privacy.intro"], "<unsafe> tekst");
      assert.equal(t.persisted.length, 0);
      return reply({ ok: true, saved: 2 });
    });
    await t.editor.saveAdminContent();
    assert.equal(t.calls.length, 1);
    assert.equal(t.persisted.length, 1);
    assert.equal(t.persisted[0]["home.title"], "Ny tittel");
    assert.equal(t.editor.isAdminContentDirty(), false);
    assert.equal(t.node("#admin-unsaved-indicator").hidden, true);
    assert.equal(t.node("#admin-save-content").disabled, true);
    assert.equal(t.node("#admin-content-message").className, "auth-message success");
    t.editor.renderAdminContentFields();
    assert.ok(t.node("#admin-content-fields").innerHTML.includes("&lt;unsafe&gt; tekst"));
  }

  // Editor and administrator are both allowed; role is read on every action.
  {
    const t = harness("editor");
    t.editor.markAdminDirty();
    t.currentUser.role = "admin";
    t.mock(async () => reply({ ok: true, saved: 2 }));
    await t.editor.saveAdminContent();
    assert.equal(t.calls.length, 1);
    t.currentUser.role = "user";
    t.editor.markAdminDirty();
    assert.equal(t.editor.isAdminContentDirty(), false);
    await t.editor.saveAdminContent();
    assert.equal(t.calls.length, 1, "A demoted editor must not submit another write");
    assert.equal(t.persisted.length, 1);
  }

  // HTTP 403/503, and offline exceptions preserve unsaved work for retry.
  for (const [label, mock, expected] of [
    ["forbidden", async () => reply({ message: "Du har ikke tilgang." }, 403), "Du har ikke tilgang."],
    ["missing table", async () => reply({ message: "Databasen er ikke klar." }, 503), "Databasen er ikke klar."],
    ["network", async () => { throw Error("Nettverket er nede"); }, "Nettverket er nede"]
  ]) {
    const t = harness("editor");
    t.editor.renderAdminContentFields();
    t.editor.markAdminDirty();
    t.mock(mock);
    await t.editor.saveAdminContent();
    assert.equal(t.calls.length, 1, label);
    assert.equal(t.persisted.length, 0, label);
    assert.equal(t.editor.isAdminContentDirty(), true, label);
    assert.equal(t.node("#admin-unsaved-indicator").hidden, false, label);
    assert.equal(t.node("#admin-save-content").disabled, false, label);
    assert.equal(t.node("#admin-content-message").className, "auth-message error", label);
    assert.equal(t.node("#admin-content-message").textContent, expected, label);
    // The same editable state must be usable for a later successful retry.
    t.mock(async () => reply({ ok: true, saved: 2 }));
    await t.editor.saveAdminContent();
    assert.equal(t.editor.isAdminContentDirty(), false, label + " retry");
    assert.equal(t.persisted.length, 1, label + " retry");
  }

  // One-way dirty-state reset for successful reload; no dirty loss on permission changes.
  {
    const t = harness("admin");
    t.editor.markAdminDirty();
    t.currentUser.role = "user";
    await t.editor.saveAdminContent();
    assert.equal(t.editor.isAdminContentDirty(), true);
    assert.equal(t.calls.length, 0);
    t.editor.clearAdminDirty();
    assert.equal(t.editor.isAdminContentDirty(), false);
    assert.equal(t.node("#admin-save-content").disabled, true);
  }
  console.log("Admin content runtime: role, DOM escaping, dirty state, save contract, 403/503/offline, retry, role change: OK");
})().catch(error => { console.error(error); process.exitCode = 1; });
