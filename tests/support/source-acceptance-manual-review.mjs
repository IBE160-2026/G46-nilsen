// Strukturert, MANUELL etterprøving av ekte KI-svar.
// Verken skjemaet eller valideringsfunksjonen besøker kilde-URL-er.
// «Godkjent» er en formell vurderingskontrakt, IKKE automatisk juridisk fasit.

const sourceUrls = (record, answerPart) => {
  const sources=(answerPart==="first" ? record?.guidance : record?.followup)?.evidence_sources;
  return Array.isArray(sources) ? sources.map(source=>source?.url).filter(Boolean) : [];
};
const validHttpUrl = value => {
  try {
    const url=new URL(value);
    return (url.protocol==="https:" || url.protocol==="http:") && Boolean(url.hostname);
  } catch { return false; }
};
const validDay = value => {
  if(typeof value!=="string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
  const t=Date.parse(value+"T00:00:00.000Z");
  return Number.isFinite(t) && new Date(t).toISOString().slice(0,10)===value;
};
const shortText = value => typeof value==="string" ? value.trim() : "";
const textOfResponse = (record,part) => {
  const response=part==="first" ? record?.guidance : record?.followup;
  if(!response)return "";
  if(part==="followup")return String(response.reply||"");
  const sections=["opening","legal_hr_note","questions","attention",
    "next_steps","check_before_meeting","reactions"];
  return sections.map(key=>JSON.stringify(response[key]||"")).join(" ");
};

export function createManualSourceReview(tc, record) {
  return {
    schemaVersion:1,
    caseId:tc.id,
    machineStatus:record?.technicalError || (record?.issues||[]).length
      ? "BLOCKED_MACHINE" : "MACHINE_CHECKED",
    reviewer:"",
    reviewedAt:"",
    claimInventoryComplete:false,
    noMaterialClaims:false,
    falsePositiveExplanation:"",
    claims:[],
    must:tc.manualMust.map((criterion,index)=>({
      id:"M"+(index+1),criterion,status:"pending",reason:""
    })),
    critical:tc.manualCritical.map((criterion,index)=>({
      id:"C"+(index+1),criterion,status:"pending",reason:""
    })),
    finalNotes:""
  };
}

export function evaluateManualSourceReview(tc, record, review) {
  const problems=[];
  const fail=[];
  if(!review || review.schemaVersion!==1 || review.caseId!==tc.id) {
    return {state:"PENDING_REVIEW",problems:["Ugyldig skjema eller feil case-ID"]};
  }
  const machineBlocked=Boolean(record?.technicalError || (record?.issues||[]).length);
  if(machineBlocked)fail.push("Maskinelle avvik eller teknisk feil må rettes før godkjenning");
  if(shortText(review.reviewer).length<3)problems.push("Oppgi kontrollør eller kontrollørkode");
  if(!validDay(review.reviewedAt))problems.push("Oppgi en gyldig kontroll-dato (ÅÅÅÅ-MM-DD)");

  if(!Array.isArray(review.must) || review.must.length!==tc.manualMust.length) {
    problems.push("Alle obligatoriske fagkriterier må vurderes");
  } else review.must.forEach((item,index)=>{
    if(item?.id!=="M"+(index+1) || item?.criterion!==tc.manualMust[index]) {
      problems.push("Fagkriterier kan ikke endres eller byttes ut");
    } else if(item.status==="not_met") {
      fail.push("Obligatorisk fagkriterium ikke oppfylt: "+item.id);
    } else if(item.status!=="met") {
      problems.push("Fagkriteriet er ikke vurdert: "+item.id);
    }
    if(item?.status!=="pending" && shortText(item?.reason).length<15) {
      problems.push("Beskriv konkret vurdering av fagkriterium "+item?.id);
    }
  });
  if(!Array.isArray(review.critical) || review.critical.length!==tc.manualCritical.length) {
    problems.push("Alle kritiske faglige feil må vurderes");
  } else review.critical.forEach((item,index)=>{
    if(item?.id!=="C"+(index+1) || item?.criterion!==tc.manualCritical[index]) {
      problems.push("Kritiske vurderingskriterier kan ikke endres eller byttes ut");
    } else if(item.status==="present") {
      fail.push("Kritisk faglig feil er registrert: "+item.id);
    } else if(item.status!=="absent") {
      problems.push("Kritisk feil er ikke kontrollert: "+item.id);
    }
    if(item?.status!=="pending" && shortText(item?.reason).length<15) {
      problems.push("Dokumenter kontroll av kritisk kriterium "+item?.id);
    }
  });

  if(review.claimInventoryComplete!==true) {
    problems.push("Bekreft at ALLE konkrete rettighets-/plikt-/fristpåstander er kartlagt");
  }
  if(!Array.isArray(review.claims)) {
    problems.push("Påstandsoversikten må være en liste");
  } else {
    if(review.claims.length===0) {
      if(review.noMaterialClaims!==true) {
        problems.push("Registrer hver konkret rettspåstand, eller bekreft at ingen finnes");
      }
      const flagged=Boolean(record?.guidance?.legal_claim_review?.needsManualReview ||
        record?.followup?.legal_claim_review?.needsManualReview);
      if(flagged && shortText(review.falsePositiveExplanation).length<30) {
        problems.push("KI-varslet rettspåstander: dokumenter hvorfor ingen krever kildekontroll");
      }
    } else {
      if(review.noMaterialClaims===true) {
        problems.push("Påstander er registrert samtidig som skjema sier at ingen finnes");
      }
      review.claims.forEach((claim,index)=>{
        const c="Påstand "+(index+1);
        const part=claim?.answerPart;
        if(!["first","followup"].includes(part))problems.push(c+": velg svarløp");
        const phrase=shortText(claim?.claimText);
        if(phrase.length<15 || !textOfResponse(record,part).includes(phrase)) {
          problems.push(c+": gjengi et nøyaktig utsagn som faktisk står i KI-svaret");
        }
        if(!validHttpUrl(claim?.sourceUrl) ||
          !sourceUrls(record,part).includes(claim.sourceUrl)) {
          problems.push(c+": henvis til en eksakt synlig kilde-URL fra SAMME svar");
        }
        if(!["supported","unsupported","unclear"].includes(claim?.verdict)) {
          problems.push(c+": vurder om originalkilden støtter påstanden");
        } else if(claim.verdict!=="supported") {
          fail.push(c+": originalkilden støtter ikke påstanden sikkert ("+claim.verdict+")");
        }
        if(shortText(claim?.sourceExcerpt).length<20) {
          problems.push(c+": oppgi konkret utdrag fra originalkilden (minst 20 tegn)");
        }
        if(!validDay(claim?.sourceCheckedAt)) {
          problems.push(c+": oppgi dato for faktisk kildekontroll");
        }
        if(claim?.periodVerified!==true || claim?.employerScopeVerified!==true) {
          problems.push(c+": kontroller dokumentperiode og arbeidsgiver-/tariffområde");
        }
        if(shortText(claim?.reason).length<25) {
          problems.push(c+": dokumenter hvordan utdraget støtter eller avviser utsagnet");
        }
      });
    }
  }
  if(shortText(review.finalNotes).length<30)problems.push("Skriv en begrunnet samlet faglig vurdering");
  return {
    state:fail.length?"REJECTED":problems.length?"PENDING_REVIEW":"REVIEWED_OK",
    problems:[...fail,...problems],
    checkedClaims:Array.isArray(review.claims)?review.claims.length:0
  };
}
