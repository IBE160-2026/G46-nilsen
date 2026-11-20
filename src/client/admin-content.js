// Samtalestøtte – redigerbar tekst i Admin (ikke sikkerhetsgrensen for API-et).
// Avhengigheter injiseres eksplisitt fra app.js. Tilganger håndheves også i Express.
(function registerAdminContent(root) {
  "use strict";

  function create({
    document, fetch, escapeHtml, allContentSections,
    contentValue, defaultContentValue, persistContentOverrides, getCurrentUser
  }) {
    if (!document || typeof fetch !== "function" || typeof escapeHtml !== "function" ||
        typeof allContentSections !== "function" || typeof contentValue !== "function" ||
        typeof defaultContentValue !== "function" ||
        typeof persistContentOverrides !== "function" || typeof getCurrentUser !== "function") {
      throw new TypeError("AdminContent mangler nødvendige avhengigheter.");
    }

    let dirty = false;
    function mayEdit() {
      return ["editor", "admin"].includes(getCurrentUser()?.role);
    }
    function isAdminContentDirty() {
      return dirty;
    }
    function markAdminDirty() {
      if (!mayEdit()) return;
      dirty = true;
      const badge = document.querySelector("#admin-unsaved-indicator");
      if (badge) badge.hidden = false;
      const save = document.querySelector("#admin-save-content");
      if (save) save.disabled = false;
    }
    function clearAdminDirty() {
      dirty = false;
      const badge = document.querySelector("#admin-unsaved-indicator");
      if (badge) badge.hidden = true;
      const save = document.querySelector("#admin-save-content");
      if (save) save.disabled = true;
    }
    function renderAdminContentFields() {
      if (!mayEdit()) return;
      const host = document.querySelector("#admin-content-fields");
      if (!host) return;
      host.className = "admin-content-fields admin-content-sections";
      host.innerHTML = allContentSections().map((section, index) =>
        '<details class="admin-content-section" ' + (index === 0 ? "open" : "") + '>' +
        '<summary><span>' + escapeHtml(section.title) + '</span><small>' +
        section.fields.length + ' tekstfelt</small></summary><div class="admin-section-fields">' +
        section.fields.map(field =>
          '<label class="admin-edit-field"><span>' + escapeHtml(field.label) +
          '</span><small>' + escapeHtml(field.key) +
          '</small><textarea data-admin-content-key="' + escapeHtml(field.key) +
          '" rows="' + (field.multiline ? 4 : 2) + '">' +
          escapeHtml(contentValue(field.key, defaultContentValue(field))) +
          '</textarea></label>'
        ).join("") + '</div></details>'
      ).join("");
      host.querySelectorAll("[data-admin-content-key]").forEach(
        input => input.addEventListener("input", markAdminDirty)
      );
    }
    async function saveAdminContent() {
      const msg = document.querySelector("#admin-content-message");
      if (!mayEdit()) {
        if (msg) {
          msg.className = "auth-message error";
          msg.textContent = "Kun redaktører og administratorer kan endre innhold.";
        }
        return;
      }
      const values = {};
      document.querySelectorAll("[data-admin-content-key]").forEach(input => {
        values[input.dataset.adminContentKey] = input.value.trim();
      });
      try {
        const response = await fetch("/api/admin/content", {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ values })
        });
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.message || "Kunne ikke lagre innholdet.");
        persistContentOverrides(values);
        clearAdminDirty();
        if (msg) {
          msg.className = "auth-message success";
          msg.textContent = "Endringene er lagret og vises med en gang.";
        }
      } catch (error) {
        if (msg) {
          msg.className = "auth-message error";
          msg.textContent = error.message;
        }
      }
    }

    return Object.freeze({
      renderAdminContentFields, markAdminDirty, clearAdminDirty,
      isAdminContentDirty, saveAdminContent
    });
  }

  root.SamtalestotteAdminContent = Object.freeze({ create });
})(typeof window === "undefined" ? globalThis : window);
