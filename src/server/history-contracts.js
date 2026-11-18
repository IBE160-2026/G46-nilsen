// Samtalestøtte – kontrakter for lagring og visning av samtalehistorikk.
// Ren transformasjon uten database, nettverk eller Express-avhengigheter.
export function historyPayload(body = {}) {
  return {
    title: String(body.title || "Samtale uten tittel").slice(0, 120),
    topic: String(body.topic || "").slice(0, 80),
    subtopic: String(body.subtopic || "").slice(0, 100),
    situation: String(body.situation || "").slice(0, 20000),
    analysis: body.analysis || null,
    guidance: body.guidance || null,
    conversation: Array.isArray(body.conversation) ? body.conversation.slice(-40) : [],
    simulation: body.simulation && typeof body.simulation === "object" ? {
      mode: String(body.simulation.mode || "solo").slice(0, 20),
      style: String(body.simulation.style || "open").slice(0, 30),
      turns: Array.isArray(body.simulation.turns) ? body.simulation.turns.slice(-40).map(turn => ({
        role: turn?.role === "employee" ? "employee" : "leader",
        text: String(turn?.text || "").slice(0, 5000)
      })) : [],
      feedback: body.simulation.feedback || null
    } : null
  };
}

export function rowToHistory(row) {
  let stored = {};
  try { stored = JSON.parse(row.content || "{}"); } catch (_) {}
  return {
    id: String(row.id),
    ...stored,
    title: row.title || stored.title || "Samtale uten tittel",
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

