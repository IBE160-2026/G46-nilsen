// Isolated runtime regression for real admin-client functions.
// No production calls, external accounts, credentials, or test-user database.
// This is not a real browser login or end-to-end authorization test.
const fs = require("node:fs");
const vm = require("node:vm");
const assert = require("node:assert/strict");

const source = fs.readFileSync("app.js", "utf8");
const start = source.indexOf("async function loadAdminUsers(){");
const end = source.indexOf("\nlet benchmarkConfig=null;", start);
assert(start >= 0 && end > start, "Expected admin function block could not be located");
const code = source.slice(start, end)
  + "\nthis.adminApi={loadAdminUsers,loadAdminFeedback,loadAdminAiSettings,loadAdminAiUsage};";

function htmlEscape(value) {
  return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;")
    .replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function reply(payload, status = 200) {
  return { ok: status >= 200 && status < 300, json: async () => payload };
}
function harness() {
  const nodes = new Map();
  const calls = [];
  let implementation = async () => { throw new Error("Unexpected HTTP request"); };
  function node(selector) {
    if (!nodes.has(selector)) {
      nodes.set(selector, {
        hidden: false, disabled: false, checked: false,
        innerHTML: "", textContent: "", className: "", value: "",
        querySelectorAll() { return []; }
      });
    }
    return nodes.get(selector);
  }
  const sandbox = {
    currentUser: { id: "current-admin", role: "admin" },
    document: { querySelector: node },
    escapeHtml: htmlEscape,
    fetch: async (url, opts) => {
      calls.push({ url, opts });
      return implementation(url, opts);
    }
  };
  vm.runInNewContext(code, sandbox, { filename: "app.js admin runtime slice", timeout: 1500 });
  return {
    api: sandbox.adminApi, user: sandbox.currentUser, node, calls,
    mock(fn) { implementation = fn; }
  };
}

(async () => {
  // Fail-closed rendering on the client. The server must independently enforce roles.
  {
    const t = harness();
    t.user.role = "user";
    await t.api.loadAdminUsers();
    await t.api.loadAdminFeedback();
    await t.api.loadAdminAiSettings();
    await t.api.loadAdminAiUsage();
    assert.equal(t.calls.length, 0, "Non-admin attempted an admin HTTP request");
    for (const id of ["#admin-users-card", "#admin-feedback-card", "#admin-ai-card"]) {
      assert.equal(t.node(id).hidden, true, id + " should be hidden");
    }
    t.user.role = "editor";
    await t.api.loadAdminUsers();
    assert.equal(t.calls.length, 0, "Editor attempted admin-only user list");
  }

  // Admin may load users, escape user-controlled fields, and save a role.
  {
    const t = harness();
    const row = {
      dataset: { adminUser: "user/id-2" },
      querySelector(selector) {
        assert.equal(selector, "[data-admin-role]");
        return { value: "editor" };
      }
    };
    let click;
    const button = {
      disabled: false,
      closest(selector) {
        assert.equal(selector, "[data-admin-user]");
        return row;
      },
      addEventListener(event, handler) {
        assert.equal(event, "click");
        click = handler;
      }
    };
    t.node("#admin-users-list").querySelectorAll = selector => {
      assert.equal(selector, "[data-save-admin-role]");
      return [button];
    };
    t.mock(async (url, opts) => {
      if (url === "/api/admin/users") {
        assert.equal(opts.credentials, "include");
        assert.equal(opts.cache, "no-store");
        return reply({ users: [
          { id: "current-admin", username: "Egen", email: "", role: "admin" },
          { id: "user/id-2", username: "<script>Hei</script>", email: "a&b@example.invalid", role: "user" }
        ] });
      }
      if (url === "/api/admin/users/user%2Fid-2/role") {
        assert.equal(opts.method, "PATCH");
        assert.equal(opts.credentials, "include");
        assert.equal(opts.headers["Content-Type"], "application/json");
        assert.equal(JSON.parse(opts.body).role, "editor");
        return reply({ ok: true });
      }
      throw new Error("Unexpected HTTP endpoint: " + url);
    });
    await t.api.loadAdminUsers();
    const markup = t.node("#admin-users-list").innerHTML;
    assert.match(markup, /&lt;script&gt;Hei&lt;\/script&gt;/);
    assert.ok(!markup.includes("<script>"));
    assert.ok(markup.includes("a&amp;b@example.invalid"));
    assert.ok(markup.includes("data-admin-role disabled"), "Current admin's role selector must be disabled");
    assert.equal(typeof click, "function", "Role save click handler was not attached");
    await click();
    assert.equal(t.calls.length, 2);
    assert.equal(button.disabled, false, "Button should be re-enabled after save");
    assert.equal(t.node("#admin-users-message").className, "auth-message success");
    assert.match(t.node("#admin-users-message").textContent, /editor/);
  }

  // Role API failures must be visible and never leave a save button disabled.
  {
    const t = harness();
    let click;
    const button = {
      disabled: false, closest: () => ({
        dataset: { adminUser: "user-3" },
        querySelector: () => ({ value: "admin" })
      }),
      addEventListener: (_type, cb) => { click = cb; }
    };
    t.node("#admin-users-list").querySelectorAll = () => [button];
    t.mock(async url => url === "/api/admin/users"
      ? reply({ users: [{ id: "user-3", username: "Test", role: "user" }] })
      : reply({ message: "Rolleendring avvist" }, 403));
    await t.api.loadAdminUsers();
    await click();
    assert.equal(button.disabled, false);
    assert.equal(t.node("#admin-users-message").className, "auth-message error");
    assert.equal(t.node("#admin-users-message").textContent, "Rolleendring avvist");
  }

  // Escaping and absence of optional conversation attachments in AI feedback.
  {
    const t = harness();
    t.mock(async (url, opts) => {
      assert.equal(url, "/api/admin/ai-feedback");
      assert.equal(opts.credentials, "include");
      return reply({ items: [
        { category: "<b>Feil</b>", created_at: "2026-11-18T10:00:00Z",
          surface: "råd", comment: "<img src=x onerror=alert(1)>",
          include_conversation: true, conversation_snapshot: { note: "<private>" } },
        { category: "Annet", created_at: "2026-11-18T10:00:00Z",
          comment: "Ingen vedlegg", include_conversation: false }
      ] });
    });
    await t.api.loadAdminFeedback();
    const html = t.node("#admin-feedback-list").innerHTML;
    assert.ok(html.includes("&lt;b&gt;Feil&lt;/b&gt;"));
    assert.ok(html.includes("&lt;img src=x onerror=alert(1)&gt;"));
    assert.ok(html.includes("&lt;private&gt;"));
    assert.ok(!html.includes("<img src=x"));
    assert.ok(html.includes("Vedlagt samtale"));
    assert.ok(html.includes("Ingen samtale vedlagt."));
    t.mock(async () => reply({ message: "<server error>" }, 403));
    await t.api.loadAdminFeedback();
    assert.ok(t.node("#admin-feedback-list").innerHTML.includes("&lt;server error&gt;"));
    assert.ok(!t.node("#admin-feedback-list").innerHTML.includes("<server error>"));
  }

  // Settings show provider list only to admins and mark active model.
  {
    const t = harness();
    t.mock(async (url, opts) => {
      assert.equal(url, "/api/admin/ai-settings");
      assert.equal(opts.credentials, "include");
      return reply({ activeModel: "model-a", models: [
        { id: "model-a", label: "<Example>", tier: "standard", inputPerMillion: 1, outputPerMillion: 2 }
      ] });
    });
    await t.api.loadAdminAiSettings();
    assert.equal(t.node("#admin-ai-card").hidden, false);
    assert.ok(t.node("#admin-ai-model").innerHTML.includes("&lt;Example&gt;"));
    assert.ok(t.node("#admin-ai-model").innerHTML.includes("selected"));
    t.mock(async () => reply({ message: "Ingen tilgang" }, 403));
    await t.api.loadAdminAiSettings();
    assert.equal(t.node("#admin-ai-model-message").className, "auth-message error");
    assert.equal(t.node("#admin-ai-model-message").textContent, "Ingen tilgang");
  }

  // Usage filter, numeric rendering, escaped rows, and graceful API errors.
  {
    const t = harness();
    t.node("#admin-usage-include-tests").checked = true;
    t.mock(async (url, opts) => {
      assert.equal(url, "/api/admin/ai-usage?includeTests=1");
      assert.equal(opts.credentials, "include");
      assert.equal(opts.cache, "no-store");
      return reply({
        summary: { cost24h: 0.1, cost7d: 1.2, cost30d: 2.3, calls30d: 17 },
        topDomains: [{ name: "<unsafe>", count: 2 }],
        topQueries: [{ name: "samspill&fravær", count: 3 }],
        topPages: [{ url: "https://example.invalid/ref", domain: "example.invalid", title: "<title>", count: 4 }],
        recent: [{ function_name: "<analyse>", created_at: "2026-11-18T10:00:00Z",
          model: "modell", is_test: true, subtopic: "<fravær>",
          total_tokens: 2100, estimated_cost_usd: 0.12, web_search_used: true,
          web_search_call_count: 2, web_search_queries: ["arbeidsmiljø"] }]
      });
    });
    await t.api.loadAdminAiUsage();
    assert.equal(t.node("#admin-cost-24h").textContent, "$0.100");
    assert.equal(t.node("#admin-cost-7d").textContent, "$1.200");
    assert.equal(t.node("#admin-calls-30d").textContent, "17");
    assert.ok(t.node("#admin-source-domains").innerHTML.includes("&lt;unsafe&gt;"));
    assert.ok(t.node("#admin-source-queries").innerHTML.includes("samspill&amp;fravær"));
    assert.ok(t.node("#admin-source-pages").innerHTML.includes("&lt;title&gt;"));
    assert.ok(t.node("#admin-ai-recent").innerHTML.includes("TEST"));
    assert.ok(t.node("#admin-ai-recent").innerHTML.includes("&lt;analyse&gt;"));
    t.node("#admin-usage-include-tests").checked = false;
    t.mock(async url => {
      assert.equal(url, "/api/admin/ai-usage?includeTests=0");
      return reply({ message: "<utilgjengelig>" }, 503);
    });
    await t.api.loadAdminAiUsage();
    assert.ok(t.node("#admin-source-domains").innerHTML.includes("&lt;utilgjengelig&gt;"));
  }
  console.log("Admin runtime: role gating, role patch success/failure, escaping, feedback, model settings, usage filter/errors: OK");
})().catch(error => { console.error(error); process.exitCode = 1; });
