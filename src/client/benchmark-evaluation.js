// Kostnadsfrie og deterministiske benchmarkhjelpere.
// Ingen fetch, DOM, klokke eller KI-provider – kan testes offline.
// Endringer i formuleringer/terskler skal etterfølges av egne golden-caser.
(function registerBenchmarkEvaluation(root) {
  "use strict";
  function selectCases(config,count){
    const all=config?.cases||[]; if(count>=all.length)return all.slice();
    const grouped=new Map(); for(const c of all){if(!grouped.has(c.topicId))grouped.set(c.topicId,[]);grouped.get(c.topicId).push(c);}
    const selected=[]; let round=0; const groups=[...grouped.values()];
    while(selected.length<count){let added=false;for(const g of groups){if(g[round]&&selected.length<count){selected.push(g[round]);added=true;}}if(!added)break;round++;}
    return selected;
  }

  function evaluateOpening(testCase, guidance){
    const opening=String(guidance?.opening||'').trim();
    const issues=[];
    const notes=[];
    const words=opening?opening.split(/\s+/u).filter(Boolean).length:0;
    const checks=testCase?.opening_checks||{};
    const maxWords=Number(checks.max_words||65);
    if(!opening)issues.push('Mangler forslag til åpning');
    if(words>maxWords)issues.push(`For lang åpning: ${words} ord (maks ${maxWords})`);
    if(/\b(?:du bør|bør du|kontakt HR|kontakt juridisk|følg (?:virksomhetens|lokal|intern|gjeldende)?\s*prosedyre|varsle (?:ansvarlig|nærmeste)?\s*leder|kvalitetssikre)\b/iu.test(opening))issues.push('Inneholder instruksjoner til lederen i stedet for bare replikk');
    for(const pattern of checks.forbidden_patterns||[]){
      try{if(new RegExp(pattern,'iu').test(opening))issues.push('Treffer en formulering vi tidligere har identifisert som mekanisk eller uheldig');}catch(_){}
    }
    const required=checks.required_patterns_any||[];
    if(required.length){
      const matched=required.some(pattern=>{try{return new RegExp(pattern,'iu').test(opening);}catch(_){return false;}});
      if(!matched)notes.push('Automatisk ordtreff fant ikke forventet situasjonsspråk – bør vurderes menneskelig, ikke regnes som feil alene');
    }
    const sentences=opening.split(/[.!?]+(?:\s|$)/u).map(x=>x.trim()).filter(Boolean).length;
    if(sentences>4)issues.push(`For mange setninger i åpningen: ${sentences}`);
    return {ok:issues.length===0,opening,words,issues,notes};
  }

  root.SamtalestotteBenchmarkEvaluation = Object.freeze({ selectCases, evaluateOpening });
})(typeof window === "undefined" ? globalThis : window);
