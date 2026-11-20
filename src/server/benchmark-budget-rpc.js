// Server-only adapter for the PRIVATE budget ledger proposal.
// NEVER import into browser code. The RPC client must be a service-role client.
// Normal production benchmark remains fail-closed; this adapter is opt-in for
// isolated, mocked Supabase/PostgREST tests until a real staging environment is validated.
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const reserveErrors = new Set([
  "INVALID_BENCHMARK_BUDGET", "BUDGET_RUN_MISMATCH",
  "BUDGET_DUPLICATE_CASE", "BUDGET_RUN_BUSY", "BUDGET_LIMIT"
]);
const denial = (error, status = 409) => Object.freeze({
  ok: false, status, error, message: "Serverens benchmarkregnskap avviste forespørselen."
});
const validUuid = value => typeof value === "string" && uuidPattern.test(value);
function toBudgetCents(value) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0.10 || value > 5) return null;
  const cents = Math.round(value * 100);
  return Math.abs(cents / 100 - value) <= 1e-8 && cents >= 10 && cents <= 500 ? cents : null;
}
function toCostCents(value) {
  if (value === undefined || value === null) return null;
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) return null;
  const cents = Math.ceil(value * 100 - 1e-8);
  return Number.isSafeInteger(cents) ? cents : null;
}
function unavailable() {
  const error = new Error("Budsjettjenesten kan ikke bekrefte reservasjon eller oppgjør.");
  error.code = "BENCHMARK_LEDGER_UNAVAILABLE";
  return error;
}

export function createBenchmarkRpcBudgetLedger({ rpc } = {}) {
  if (typeof rpc !== "function") throw new TypeError("Krever en injisert tjenesteside-RPC.");
  async function call(name, args) {
    let result;
    try { result = await rpc(name, args); } catch { throw unavailable(); }
    if (result?.error || !result?.data || typeof result.data !== "object" ||
        Array.isArray(result.data)) throw unavailable();
    return result.data;
  }
  async function reserve({ userId, runId, caseId, model, budgetUsd }) {
    const budgetCents = toBudgetCents(budgetUsd);
    if (!validUuid(userId) || !validUuid(runId) ||
        typeof caseId !== "string" || caseId.length < 1 || caseId.length > 80 ||
        typeof model !== "string" || model.length < 1 || model.length > 120 ||
        budgetCents === null) {
      return denial("INVALID_BENCHMARK_BUDGET", 400);
    }
    const data = await call("benchmark_budget_reserve", {
      p_user_id:userId, p_run_id:runId, p_case_id:caseId,
      p_model:model, p_budget_cents:budgetCents
    });
    if (data.ok === false) {
      if (!reserveErrors.has(data.error)) throw unavailable();
      return denial(data.error, data.error === "INVALID_BENCHMARK_BUDGET" ? 400 : 409);
    }
    if (data.ok !== true || !validUuid(data.ticket) ||
        data.reserved_cents !== 10 ||
        !Number.isSafeInteger(data.run_charged_cents) ||
        !Number.isSafeInteger(data.day_charged_cents)) {
      throw unavailable();
    }
    return Object.freeze({
      ok:true,
      ticket:data.ticket,
      runReservedUsd:data.run_charged_cents / 100,
      userDayReservedUsd:data.day_charged_cents / 100
    });
  }
  async function settle(ticket, estimatedCostUsd, { userId, outcome = "success" } = {}) {
    if (!validUuid(userId) || !validUuid(ticket) ||
        !["success", "failed", "uncertain"].includes(outcome)) throw unavailable();
    const actualCents = toCostCents(estimatedCostUsd);
    const data = await call("benchmark_budget_settle", {
      p_user_id:userId, p_ticket:ticket,
      p_actual_cents:actualCents, p_outcome:outcome
    });
    if (data.ok !== true || !Number.isSafeInteger(data.charged_cents) ||
        data.charged_cents < 10 ||
        (data.already_settled !== true &&
         (!Number.isSafeInteger(data.run_charged_cents) ||
          !Number.isSafeInteger(data.day_charged_cents)))) throw unavailable();
    return Object.freeze({
      ok:true, alreadySettled:data.already_settled === true,
      chargedUsd:data.charged_cents / 100,
      runReservedUsd: Number.isSafeInteger(data.run_charged_cents)
        ? data.run_charged_cents / 100 : null,
      userDayReservedUsd: Number.isSafeInteger(data.day_charged_cents)
        ? data.day_charged_cents / 100 : null,
      overBudget:data.over_budget === true
    });
  }
  return Object.freeze({ reserve, settle });
}
