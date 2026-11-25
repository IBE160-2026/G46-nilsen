// Deterministic formatting and validity labels for the Help/source library.
// Kept independent of DOM, network, and application state.
(function registerSourcePresentation(root) {
  "use strict";
function sortSourcesAlphabetically(items=[]){
  return [...items].sort((a,b)=>
    String(a?.title||a?.author||a?.id||'').localeCompare(
      String(b?.title||b?.author||b?.id||''),
      'nb',
      { sensitivity:'base' }
    )
  );
}

function compactSourceUsage(source){
  const use=Array.isArray(source?.useFor) ? source.useFor.filter(Boolean) : [];
  if(use.length) return use.slice(0,6).join(', ');
  const type=String(source?.type||'').toLowerCase();
  if(type.includes('lovverk')) return 'kontroll av rettslige rammer og plikter';
  if(type.includes('myndighet')) return 'myndighetsveiledning og praktisk regelverksforståelse';
  if(type.includes('forskning') || type.includes('fagfelle') || type.includes('evidens')) return 'faglig begrunnelse for samtaleteknikk, ledelse og arbeidsmiljø';
  return 'faglig støtte når temaet er relevant';
}

function readableSourceTier(source = {}) {
  const tiers = {
    primary_law: 'Lov eller forskrift – bindende der den gjelder',
    authority_guidance: 'Offentlig myndighetsveiledning – ikke lovtekst',
    authority_index: 'Offentlig oppslagsinngang – kontroller den konkrete regelen',
    official_employer_reference: 'Offisiell arbeidsgiverveiledning',
    collective_agreement: 'Tariffavtale – bare når avtaledekningen er relevant',
    research_evidence: 'Forskning/evidens – ikke rettslig hjemmel',
    research_communication: 'Forskningsbasert fagkunnskap – ikke lov',
    professional_framework: 'Faglig/profesjonsetisk rammeverk – ikke lov',
    specialist_guidance: 'Praktisk fagveiledning – ikke lov'
  };
  return tiers[source.sourceTier] || 'Faglig kildemateriale – vurder gyldighet og relevans';
}

// Hjelp viser også historiske referanser. Datoperioden kommer fra bankens
// metadata; den må ikke forveksles med verifisering av faktisk tariffdekning.
function sourceDateNote(source={}, asOf=new Date()){
  const from=source?.validFrom || '';
  const to=source?.validTo || '';
  if(!from && !to)return '';
  const valid=value=>/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(value);
  if((from && !valid(from)) || (to && !valid(to)) ||
     (from && to && from>to))return 'Registrert avtaleperiode må kontrolleres.';
  const parts=new Intl.DateTimeFormat('en-GB',{
    timeZone:'Europe/Oslo',year:'numeric',month:'2-digit',day:'2-digit'
  }).formatToParts(asOf);
  const dateParts=Object.fromEntries(parts.map(item=>[item.type,item.value]));
  const today=`${dateParts.year}-${dateParts.month}-${dateParts.day}`;
  if(to && today>to)return `Registrert avtaleperiode utløp ${to} – kontroller nyere avtale før bruk.`;
  if(from && today<from)return `Avtaleperioden starter ${from} – ikke gjeldende ennå.`;
  return `Registrert avtaleperiode ${from || 'ukjent start'} til ${to || 'ukjent slutt'} – bekreft avtaledekning.`;
}

  root.SamtalestotteSourcePresentation = Object.freeze({
    sortSourcesAlphabetically, compactSourceUsage, readableSourceTier, sourceDateNote
  });
})(window);
