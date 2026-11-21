// Bare en gyldighetskontroll mot dokumenterte datoer i vår kuraterte bank.
// Dette BEVISER IKKE at avtalen er forlenget, bindende for brukerens
// arbeidsgiver, eller at sidens innhold er ajourført. Ved ugyldig dato
// vises ikke den tidsavgrensede avtalen som en gjeldende kildekandidat.

function validDateKey(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const time = Date.parse(value + "T00:00:00.000Z");
  return Number.isFinite(time) && new Date(time).toISOString().slice(0,10) === value ? value : null;
}

export function isSourceValidOn(source = {}, asOf = new Date()) {
  if (!source || typeof source !== "object") return false;
  const fromRaw = source.validFrom ?? source.valid_from ?? null;
  const toRaw = source.validTo ?? source.valid_to ?? null;
  if (!fromRaw && !toRaw) return true;
  const from = fromRaw ? validDateKey(fromRaw) : null;
  const to = toRaw ? validDateKey(toRaw) : null;
  if ((fromRaw && !from) || (toRaw && !to) || (from && to && from > to)) return false;
  // Norske arbeids- og tariffavtaler bruker lokal kalenderdato. Render-
  // serveren kan kjøre UTC: i timen rundt midnatt må norsk dato vinne.
  const date = asOf instanceof Date && !Number.isNaN(asOf.getTime())
    ? (() => {
        const parts = new Intl.DateTimeFormat("en-GB", {
          timeZone:"Europe/Oslo",year:"numeric",month:"2-digit",day:"2-digit"
        }).formatToParts(asOf);
        const byType = Object.fromEntries(parts.map(part => [part.type,part.value]));
        return validDateKey(`${byType.year}-${byType.month}-${byType.day}`);
      })()
    : (typeof asOf === "string" ? validDateKey(asOf) : null);
  if (!date) return false;
  return (!from || date >= from) && (!to || date <= to);
}
