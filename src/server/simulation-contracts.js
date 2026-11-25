// Pure, side-effect-free simulation contracts shared by the Express routes.
// Keep persona constraints and sanitization together to make revisions testable.
// No provider or database calls in this module.
export const simulationStyleInstructions = {
  open: 'Medarbeideren er i utgangspunktet åpen, saklig og samarbeidsvillig, men skal fortsatt ha egne perspektiver og kunne stille spørsmål.',
  uncertain: 'Medarbeideren er usikker og noe tilbaketrukket. Tillat korte svar, nøling, forsiktige formuleringer og behov for tid. Ikke gjør personen kunstig vag.',
  defensive: 'Medarbeideren er defensiv og kan være uenig i lederens beskrivelse eller vurdering. Reager realistisk uten å bli karikert eller aggressiv uten grunnlag.',
  emotional: 'Medarbeideren er tydelig følelsesmessig berørt. La reaksjonen merkes i ordvalg, pauser, nøling, kortere setninger eller vansker med å konkretisere. Svarene skal ikke høres ut som ferdigpolerte refleksjoner eller gå for raskt over i ryddig problemløsning. Ikke gjør personen melodramatisk og ikke dikt opp årsaken til følelsene.',
  critical: 'Medarbeideren er frustrert eller kritisk og kan utfordre lederens vurdering, prosess eller formuleringer. Hold reaksjonen realistisk og saklig nok til at øvelsen er nyttig.',
  surprise: 'Gi en tydelig uventet, men plausibel reaksjon som faktisk endrer hva lederen må forholde seg til i neste replikk. Ikke bruk standardsvar om uklare forventninger eller vanlig samarbeidsvilje med mindre samtalen gjør det genuint overraskende. Varier mellom for eksempel et direkte vanskelig spørsmål tilbake, uventet sterk enighet, kort avvisning, taushet/nøling, en annen problemforståelse eller – i fri modus – en relevant ny opplysning. I faktamodus skal overraskelsen ligge i reaksjonen eller perspektivet, ikke i nye fakta.'
};

export const simulationFidelityInstructions = {
  factual: `FAKTABASERT MODUS – «Hold deg til saken»:
- Du kan improvisere følelser, holdninger, uenighet, spørsmål, motstand, usikkerhet og måten medarbeideren uttrykker seg på.
- Du skal IKKE etablere nye verifiserbare fakta som ikke finnes i situasjonen eller tidligere dialog.
- Dette gjelder også tilsynelatende små fakta som «jeg har ikke drukket mer», «vi kommuniserer det vi må», «jeg fikk beskjed forrige uke» eller «jeg har vært mer kort i tonen», dersom dette ikke allerede er oppgitt.
- Når lederen spør om noe som ikke er oppgitt, reager som en medarbeider uten å gjøre et ukjent forhold til et sikkert ja/nei-faktum. Du kan spørre hvorfor lederen spør, avvise premisset, si at du ikke ønsker å gå inn i det, eller formulere deg eksplisitt som en opplevelse når det er naturlig.
- Ikke bruk oppdiktede detaljer som forklaring på følelser eller motstand.`,
  challenge: `FRI TRENINGSMODUS – «Utfordre meg»:
- Du kan introdusere nye, plausible opplysninger, hendelser eller perspektiver for å skape realistiske overraskelser og trene lederen på å håndtere ukjent informasjon.
- Nye opplysninger må være saklig relevante, troverdige og proporsjonale. Ikke lag sensasjonelle eller ekstreme vendinger uten grunn.
- Ikke finn på diagnose, detaljerte familieforhold, ulovlig aktivitet, alvorlige anklager eller andre svært sensitive forhold bare for å gjøre øvelsen vanskeligere, med mindre saken allerede åpner for dette på en tydelig måte.
- Ikke motsi etablerte fakta i saken.
- Opplysninger du finner på er kun simulerte rollespillfakta. De skal aldri presenteres som kjente fakta om den virkelige saken utenfor simulatoren.`
};

export function sanitizeSimulationTurns(turns) {
  if (!Array.isArray(turns)) return [];
  return turns.slice(-24).map(turn => ({
    role: turn?.role === 'employee' ? 'employee' : 'leader',
    text: String(turn?.text || '').trim().slice(0, 4000)
  })).filter(turn => turn.text);
}

export function simulationContextText({ situation = '', analysis = null, followups = {}, guidance = null, fidelity = 'factual', style = 'open', turns = [] }) {
  return `\n\n## Samtalesimulering\nDu spiller KUN medarbeideren i en øvelse for en leder. Brukeren spiller lederen.\n\nViktige grenser:\n- Ikke gi råd til lederen mens du spiller medarbeideren.\n- Ikke fortell hva lederen bør gjøre. Svar bare slik medarbeideren plausibelt kunne svart.\n- Ikke gjør tredjepartsopplysninger om til egne observasjoner.\n- Hold hvert medarbeidersvar naturlig og relativt kort, vanligvis 1–4 setninger.\n- Reaksjonen skal utvikle seg ut fra det lederen faktisk sier, ikke låses mekanisk til én tone.\n- Hold rollespillfakta og den virkelige saken strengt adskilt.\n\nValgt simuleringsmodus: ${fidelity}. ${simulationFidelityInstructions[fidelity] || simulationFidelityInstructions.factual}\n\nValgt reaksjonsstil: ${style}. ${simulationStyleInstructions[style] || simulationStyleInstructions.open}\n\nSituasjon: ${String(situation).slice(0, 12000)}\nAnalyse: ${JSON.stringify(analysis || {})}\nAvklaringssvar: ${JSON.stringify(followups || {})}\nTidligere råd: ${JSON.stringify(guidance || {})}\nSamtalen så langt: ${JSON.stringify(sanitizeSimulationTurns(turns))}\n`;
}
