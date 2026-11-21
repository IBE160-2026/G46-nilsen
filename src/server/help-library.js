// Ren, deterministisk kategorisering av kuraterte kilder til Hjelp-visningen.
// API, database, innlogging og nettverk er bevisst holdt utenfor denne modulen.
export function sourceTier(source = {}) {
  const role = source.sourceRole || source.source_role || "";
  const type = String(source.type || source.sourceType || role || "").toLowerCase();
  if (role === "primary_regulation" || /lovverk|law_database|regulation/.test(type)) return "primary_law";
  if (role === "collective_agreement" || /collective_agreement/.test(type)) return "collective_agreement";
  if (role === "official_employer_reference") return "official_employer_reference";
  if (role === "research_communication" || type === "research_communication") return "research_communication";
  if (role === "research_evidence" || type === "research_evidence") return "research_evidence";
  if (role === "authority_index") return "authority_index";
  if (["professional_framework","international_framework"].includes(role)) return "professional_framework";
  if (/myndighet|official_authority|authority_guidance/.test(type)) return "authority_guidance";
  if (/forskningsformidling|forskningsbasert fagressurs/.test(type)) return "research_communication";
  if (/meta-analyse|fagfelle|forskning|evidens/.test(type)) return "research_evidence";
  if (["specialist_guidance","worklife_framework"].includes(role) || /specialist_worklife_guidance|worklife_framework/.test(type)) return "specialist_guidance";
  return "professional_framework";
}

export function buildHelpSourceLibrary({ sourceBank, occupationLegalSourceBank, agreementCuratedSources, occupationSourceMap }) {
  const normalizePublicSource = source => ({
    id: source.id,
    title: source.title || source.id || "Kilde",
    author: source.author || source.authority || "",
    year: source.year || "",
    type: source.type || source.sourceType || "fagkilde",
    url: source.url || (source.doi ? `https://doi.org/${source.doi}` : ""),
    lastVerified: source.last_verified || source.lastVerified || null,
    timeSensitive: Boolean(source.time_sensitive || source.timeSensitive),
    // Behold datoperioden i Hjelp, også når avtalen vises som historisk
    // oppslagskilde. Klienten viser status ut fra norsk lokal dato.
    validFrom: source.validFrom || source.valid_from || null,
    validTo: source.validTo || source.valid_to || null,
    useFor: source.use_when || source.useFor || [],
    occupations: Array.isArray(source.occupations) ? source.occupations : [],
    sourceTier: sourceTier(source),
    bindingStatus: source.bindingStatus || null
  });

  const all = (sourceBank.sources || []).map(normalizePublicSource).filter(source => source.url);
  const generalRules = all.filter(source =>
    ["primary_law","authority_guidance","official_employer_reference","collective_agreement","authority_index"].includes(source.sourceTier)
  );
  const research = all.filter(source => ["research_evidence","research_communication"].includes(source.sourceTier));
  const generalFrameworks = all.filter(source => !generalRules.includes(source) && !research.includes(source));
  const globalEmployer = (occupationLegalSourceBank.sources || [])
    .filter(source => (source.sectors || []).includes("*"))
    .map(normalizePublicSource)
    .filter(source => source.url);
  const agreementSources = agreementCuratedSources.map(normalizePublicSource).filter(source => source.url);
  const dedupePublic = items => {
    const seen = new Set();
    return items.filter(source => source.id && !seen.has(source.id) && seen.add(source.id));
  };
  const globalRules = globalEmployer.filter(source =>
    ["primary_law","authority_guidance","official_employer_reference","collective_agreement"].includes(source.sourceTier)
  );
  const globalFrameworks = globalEmployer.filter(source => !globalRules.includes(source));
  const authorityAndLaw = dedupePublic([
    ...generalRules,
    ...globalRules,
    ...agreementSources
  ]);
  const frameworks = dedupePublic([
    ...generalFrameworks,
    ...globalFrameworks
  ]);

  const occupationGroups = (occupationSourceMap.sectors || [])
    .filter(sector => sector.id !== "other")
    .map(sector => {
      const sources = (occupationLegalSourceBank.sources || [])
        .filter(source => (source.sectors || []).includes(sector.id))
        .map(normalizePublicSource);
      return {
        id: sector.id,
        label: sector.label,
        occupations: sector.occupations || [],
        sources
      };
    })
    .filter(group => group.sources.length);

  // Et fast, lite oppslagsverk med faktisk kuraterte kilder.
  // Kildene hentes fra samme bank som fagbankvisningen, aldri som dupliserte URL-er.
  // Rolle skiller bindende lovverk fra myndighetsveiledning og faglig støtte.
  const quickReferenceSpecs = [
    { id:"LOVDATA_AML", label:"Arbeidsmiljøloven (AML)", category:"Lovverk", description:"Rettigheter og plikter i arbeidsforhold" },
    { id:"AT_EMPLOYER_DUTIES", label:"Arbeidstilsynet", category:"Myndighetsveiledning", description:"HMS, arbeidsmiljø og arbeidsgiveransvar" },
    { id:"NAV_SYKEFRAVAER_OPPFOLGING", label:"NAV", category:"Myndighetsveiledning", description:"Sykefravær, tilrettelegging og oppfølging" },
    { id:"AT_PERSONALSAKER", label:"Personalsaker", category:"Myndighetsveiledning", description:"Saksgang, dokumentasjon og kontradiksjon" },
    { id:"DATATILSYNET_WORKPLACE_PRIVACY", label:"Datatilsynet", category:"Myndighetsveiledning", description:"Personvern og ansattopplysninger" },
    { id:"AKAN_MODEL", label:"Akan", category:"Faglig veiledning – ikke lov", description:"Rus, spill, bekymringssamtaler og oppfølging" },
    { id:"DFO_PERSONALSAKER_FORBEREDELSE_2026", label:"Statens arbeidsgiverportal", category:"Offisiell veiledning · statlig sektor", description:"Forberedelse og gjennomføring av statlige personalsaker" },
    { id:"STAMI_PSYKOSOSIALT_ARBEIDSMILJO_2026", label:"STAMI", category:"Forskning – ikke lov", description:"Psykososialt og organisatorisk arbeidsmiljø" }
  ];
  const quickSourceById = new Map(
    [...all, ...globalEmployer].map(source => [source.id, source])
  );
  const leaderQuickReferences = quickReferenceSpecs.flatMap(spec => {
    const source = quickSourceById.get(spec.id);
    return source?.url ? [{
      id: spec.id,
      label: spec.label,
      category: spec.category,
      description: spec.description,
      url: source.url
    }] : [];
  });

  return {
    leaderQuickReferences,
    categories: {
      rules: {
        label: "Lovverk og myndigheter",
        description: "Norske lover, forskrifter, myndighetsveiledning og offentlige arbeidsgiverressurser.",
        groups: [{ id:"rules", label:"Lovverk og myndigheter", sources: authorityAndLaw }]
      },
      research: {
        label: "Forskning og evidens",
        description: "Fagfellevurdert forskning, meta-analyser, evidensgjennomganger og forskningsbaserte fagressurser.",
        groups: [{ id:"research", label:"Forskning og evidens", sources: research }]
      },
      frameworks: {
        label: "Faglig rammeverk",
        description: "Praktiske fagveiledere, profesjonsressurser og ledelses-/samtalerammeverk.",
        groups: [{ id:"frameworks", label:"Faglig rammeverk", sources: frameworks }]
      },
      occupations: {
        label: "Yrkes- og sektorkilder",
        description: "Sektorspesifikke myndighets- og regelverkskilder sortert etter arbeidsområde.",
        groups: occupationGroups
      }
    }
  };
}
