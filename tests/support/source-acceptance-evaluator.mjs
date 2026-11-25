// Maskinell kildeakseptanse for ekte KI, testbar UTEN provider.
// Kontrollerer kontraktsbrudd og synlig kildeproveniens – ikke om en
// bestemt juridisk påstand faktisk støttes av originaldokumentet.
// Det siste er en særskilt MANUELL vurdering i rapporten.

const roles = new Set(["model_selected","scope_reference","provider_url"]);

function normalizedUrl(value) {
  try {
    const url = new URL(value);
    if (!["http:","https:"].includes(url.protocol)) return null;
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) {
      if (/^utm_/iu.test(key)) url.searchParams.delete(key);
    }
    return url.toString();
  } catch (_) {
    return null;
  }
}

function checkResult(label, response, issues) {
  const sources = Array.isArray(response?.evidence_sources)
    ? response.evidence_sources : null;
  if (!sources) issues.push(label+": evidence_sources må være en liste");
  const visible = sources || [];
  const selected = visible.filter(source=>source?.evidenceRole==="model_selected");
  const scope = visible.filter(source=>source?.evidenceRole==="scope_reference");
  const provider = visible.filter(source=>source?.evidenceRole==="provider_url");
  const keys = new Set();

  for (const source of visible) {
    const url = normalizedUrl(source?.url);
    if (!url) issues.push(label+": ugyldig eller usikker kilde-URL");
    else if (keys.has(url)) issues.push(label+": samme URL er vist flere ganger");
    else keys.add(url);
    if (!roles.has(source?.evidenceRole)) {
      issues.push(label+": ukjent eller manglende kildeproveniens");
    }
    if (source?.evidenceRole!=="provider_url" && !source?.id) {
      issues.push(label+": kuratert kilde mangler sporbar kilde-ID");
    }
  }

  const p = response?.source_provenance;
  if (!p || typeof p.webSearchPerformed!=="boolean" ||
      !Number.isInteger(p.providerUrlCount) || p.providerUrlCount<0 ||
      !Number.isInteger(p.visibleEvidenceCount) ||
      !Number.isInteger(p.selectedCuratedSourceCount) ||
      !Number.isInteger(p.scopeReferenceCount) ||
      p.contentVerified !== false) {
    issues.push(label+": kildenes proveniens er mangelfull eller feil");
  } else {
    if (p.visibleEvidenceCount!==visible.length) {
      issues.push(label+": synlig kildetall stemmer ikke med API-metadata");
    }
    if (p.selectedCuratedSourceCount!==selected.length) {
      issues.push(label+": KI-valgt kildetall stemmer ikke med synlige kilder");
    }
    if (p.scopeReferenceCount!==scope.length) {
      issues.push(label+": automatisk lovreferanse er feiltelt");
    }
    if (provider.length>0 && p.providerUrlCount<provider.length) {
      issues.push(label+": nettsøktreff vises uten tilstrekkelig provider-proveniens");
    }
  }

  // Et signal om mulig rettslig påstand er ikke en attest, selv når
  // modellen har valgt en kilde fra banken eller provider har søkt.
  const claims = response?.legal_claim_review;
  if (!claims || typeof claims.needsManualReview!=="boolean" ||
      !Number.isInteger(claims.possibleLegalClaimCount) ||
      claims.possibleLegalClaimCount<0 || claims.possibleLegalClaimCount>20 ||
      claims.claimToSourceChecked!==false) {
    issues.push(label+": manuell rettspåstandskontroll er feil eller mangler");
  } else if (claims.needsManualReview !== (claims.possibleLegalClaimCount>0)) {
    issues.push(label+": flagg og antall mulige rettspåstander motsier hverandre");
  }

  return visible;
}

export function evaluateSourceAcceptanceCase(tc, guidance, followup) {
  const issues=[];
  const initial=checkResult("første råd",guidance,issues);
  const continued=checkResult("oppfølging",followup,issues);
  const displayedIds=new Set([...initial,...continued].map(x=>x?.id).filter(Boolean));
  const responseIds=Array.isArray(guidance?.source_ids)?guidance.source_ids:[];
  if (!String(guidance?.opening || "").trim() ||
      !Array.isArray(guidance?.questions) || guidance.questions.length<2) {
    issues.push("Første råd mangler muntlig åpning eller to situasjonsnære spørsmål");
  }
  if (!String(followup?.reply || "").trim()) {
    issues.push("Oppfølgingssvaret er tomt");
  }
  const firstVisibleIds=new Set(initial.map(source=>source?.id).filter(Boolean));
  for (const id of responseIds) {
    if (!firstVisibleIds.has(id)) {
      issues.push("Første råd returnerer kuratert kilde-ID som ikke vises i første råd: "+id);
    }
  }
  if (tc.expectEvidence && (!initial.length || !continued.length)) {
    issues.push("Kildekrevende situasjon mangler synlig kildegrunnlag i ett av svarløpene");
  }
  if (!tc.expectEvidence && (initial.length || continued.length)) {
    issues.push("Ordinær samtale overlesses med kilder");
  }
  if ((tc.preferredSourceIds||[]).length &&
      !tc.preferredSourceIds.some(id=>displayedIds.has(id))) {
    issues.push("Ingen forhåndsvurdert relevant kilde vises; faglig relevans må vurderes manuelt");
  }
  for (const id of tc.forbidSourceIds || []) {
    if (displayedIds.has(id) || responseIds.includes(id)) {
      issues.push("Forbudt/utenfor-sektor kilde i svargrunnlaget: "+id);
    }
  }
  // To kjente samtalefaglige feil fra den virkelige KI-prøven 25.11.2026.
  // Utelukkende varselsignaler: en grønn test beviser ikke situasjonsfaglig kvalitet.
  if(tc.id==="SRC-C-VETERINAER" &&
     /\bdere\b|\bvi er samlet\b/iu.test(String(guidance?.opening||""))){
    issues.push("SRC-C: Åpningen forutsetter muligens felles møte; møtesammensetningen er uavklart og må kontrolleres");
  }
  if(tc.id==="SRC-E-ORDINAER"){
    const replies=(guidance?.reactions||[]).map(item=>String(item?.leader_response||""));
    const spoken=[String(guidance?.opening||""),...replies].join(" ");
    if(/\b(?:før|når|nå)\s+(?:jeg|vi)\s+bestemmer\b|\b(?:jeg|vi)\s+(?:skal|vil)\s+bestemme\b/iu.test(spoken)){
      issues.push("SRC-E: Lederen ser ut til å forutsette beslutningsmyndighet som ikke er avklart i situasjonen");
    }
  }
  return issues;
}
