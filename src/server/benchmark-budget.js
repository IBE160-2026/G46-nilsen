// Samtalestøtte: konservativ benchmark-budsjettreservering per Node-prosess.
// Dette er IKKE en distribuert kostnadsgaranti. Produksjonsruten er sperret til
// en delt, varig, atomisk server-/databaseregnskap er implementert.
const cents = value => Math.ceil(Number(value) * 100 - 1e-8);
const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function createBenchmarkBudgetLedger({
  reservationUsd = 0.10, dailyLimitUsd = 5, clock = () => new Date()
} = {}) {
  const runs = new Map();
  const days = new Map();
  const reserveCents = cents(reservationUsd);
  const dailyCents = cents(dailyLimitUsd);
  if (!Number.isSafeInteger(reserveCents) || reserveCents <= 0 ||
      !Number.isSafeInteger(dailyCents) || dailyCents < reserveCents) {
    throw new TypeError("Ugyldig serverkonfigurert benchmarkreserve.");
  }

  const denied = (error, message, status = 409) => ({ ok:false, status, error, message });
  function reserve({ userId, runId, caseId, model, budgetUsd }) {
    const selected = Number(budgetUsd);
    if (typeof userId !== "string" || !userId.trim() ||
        typeof runId !== "string" || !uuid.test(runId) ||
        typeof caseId !== "string" || !caseId || typeof model !== "string" || !model ||
        typeof budgetUsd !== "number" || !Number.isFinite(selected) ||
        selected < 0.1 || selected > 5 || Math.abs(Math.round(selected * 100) - selected * 100) > 1e-8) {
      return denied("INVALID_BENCHMARK_BUDGET", "Ugyldig kjørenøkkel eller budsjett.", 400);
    }
    const day = clock().toISOString().slice(0, 10);
    const accountKey = userId + "|" + day;
    const runKey = userId + "|" + runId;
    const limitCents = cents(selected);
    const seenKey = caseId + "\u0000" + model;
    const existing = runs.get(runKey);
    if (existing && (existing.day !== day || existing.limitCents !== limitCents)) {
      return denied("BUDGET_RUN_MISMATCH", "Budsjettet eller dagen kan ikke endres midt i kjøringen.");
    }
    const account = days.get(accountKey) || { allocated:0, pending:false };
    if (account.pending) return denied("BUDGET_RUN_BUSY", "Et benchmark-kall pågår allerede for denne brukeren.");
    const run = existing || { day, limitCents, allocated:0, used:new Set() };
    if (run.used.has(seenKey)) return denied("BUDGET_DUPLICATE_CASE", "Testsaken er allerede forsøkt med denne modellen i denne kjøringen.");
    if (run.allocated + reserveCents > run.limitCents ||
        account.allocated + reserveCents > dailyCents) {
      return denied("BUDGET_LIMIT", "Serverens benchmarkbudsjett er brukt opp.");
    }
    // Synchronous mutation before the first await: two concurrent HTTP requests cannot both reserve.
    run.used.add(seenKey);
    run.allocated += reserveCents;
    account.allocated += reserveCents;
    account.pending = true;
    runs.set(runKey, run);
    days.set(accountKey, account);
    const ticket = { active:true, run, account, reservedCents:reserveCents };
    return {
      ok:true, ticket,
      runReservedUsd:run.allocated / 100,
      userDayReservedUsd:account.allocated / 100
    };
  }

  function settle(ticket, estimatedCostUsd) {
    if (!ticket?.active) throw new TypeError("Benchmarkreservasjonen er ukjent eller allerede avsluttet.");
    ticket.active = false;
    const cost = Number(estimatedCostUsd);
    // Errors, invalid/missing usage and failures to write results keep the reserved amount charged.
    // A higher reported actual estimate is charged in full; future calls will then be blocked.
    const totalCents = Number.isFinite(cost) && cost >= 0
      ? Math.max(ticket.reservedCents, cents(cost))
      : ticket.reservedCents;
    const extra = totalCents - ticket.reservedCents;
    ticket.run.allocated += extra;
    ticket.account.allocated += extra;
    ticket.account.pending = false;
    return {
      chargedUsd:totalCents / 100,
      runReservedUsd:ticket.run.allocated / 100,
      userDayReservedUsd:ticket.account.allocated / 100,
      overBudget:ticket.run.allocated > ticket.run.limitCents ||
        ticket.account.allocated > dailyCents
    };
  }

  return Object.freeze({ reserve, settle });
}
