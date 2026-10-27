// Samtalestøtte – delt lokal navnedetektor for klient og server.
(function(root){
  const data = root.SamtalestottePrivacyNames || {};
  const normalizeNameToken = value => String(value || "").normalize("NFC").toLocaleLowerCase("nb-NO");
  const toSet = values => new Set((values || []).map(normalizeNameToken));
  const GIVEN = toSet(data.givenNames);
  const SURNAMES = toSet(data.surnames);
  const AMBIGUOUS = toSet(data.ambiguousGivenNames);
  const FALSE_POSITIVES = toSet(data.falsePositives);
  const CONTEXT_NON_NAMES = toSet(data.contextualNonNames);
  // Vanlige norske pronomen/funksjonsord kan opptre i "person-lignende" kontekst
  // (f.eks. "til dem som er ny") og skal aldri tolkes som ukjente navn.
  const GRAMMAR_NON_NAMES = toSet([
    "jeg","vi","du","dere","de","dem","oss","meg","deg","seg",
    "han","hun","hen","ham","henne","den","det","dette","disse",
    "man","noen","noe","alle","andre","hverandre","en","et"
  ]);

  const TOKEN = "[\\p{L}][\\p{L}'’\\-]{1,39}";
  const TITLE_TOKEN = "[\\p{Lu}][\\p{L}'’\\-]{1,39}";
  const PERSON_ACTION = "(?:sier|sa|mener|mente|ønsker|ønsket|kommer|kom|møter|møtte|jobber|arbeider|jobbet|arbeidet|nekter|nektet|hevder|forteller|fortalte|opplever|opplevde|trenger|trengte|ber|ba|klager|klaget|spør|spurte|svarer|svarte|gråter|gråt|smiler|slutter|sluttet|begynner|begynte|forlater|forlot|ankommer|ankom)";
  const PERSON_AUX = "(?:har\\s+(?:kommet|sagt|vært|jobbet|arbeidet|møtt|nektet|fortalt|klaget|spurt|svart|sluttet|begynt)|er\\s+(?:uenig|enig|syk|frustrert|sint|forsinket|borte|ansatt|leder|medarbeider)|var\\s+(?:uenig|enig|syk|frustrert|sint|forsinket|borte|ansatt|leder|medarbeider)|(?:har|hadde|er|var|ble|blir|skal|vil|kan|må))";
  const ACTION = "(?:" + PERSON_ACTION + "|" + PERSON_AUX + ")";
  const ROLE = "(?:medarbeider(?:en)?|kollega(?:en)?|leder(?:en)?|ansatt(?:en)?|personen)";
  const RELATION = "(?:snakket\\s+med|møte\\s+med|samtale\\s+med|med|til|fra|hos)";

  function isKnownGivenName(value){
    const n=normalizeNameToken(value);
    return GIVEN.has(n) && !FALSE_POSITIVES.has(n) && !GRAMMAR_NON_NAMES.has(n);
  }
  function isKnownSurname(value){
    const n=normalizeNameToken(value);
    return SURNAMES.has(n) && !FALSE_POSITIVES.has(n) && !GRAMMAR_NON_NAMES.has(n);
  }
  function candidateAllowed(value){
    const n=normalizeNameToken(value);
    return n.length >= 2 && !FALSE_POSITIVES.has(n) && !CONTEXT_NON_NAMES.has(n) && !GRAMMAR_NON_NAMES.has(n);
  }
  function isAmbiguous(value){ return AMBIGUOUS.has(normalizeNameToken(value)); }
  function looksTitleCased(value){ return /^\p{Lu}/u.test(String(value || "")); }
  function escaped(value){ return String(value).replace(/[.*+?^$()|[\]\\{}]/g, "\\$&"); }

  function strongContextFor(text, candidate){
    const c=escaped(candidate);
    const directRelation=new RegExp("\\b(?:snakket\\s+med|møte\\s+med|samtale\\s+med|møtte|ringte|kontaktet)\\s+" + c + "(?=\\s|[.,!?;:]|$)","iu");
    const genericRelation=new RegExp("\\b(?:med|til|fra|hos)\\s+" + c + "(?=\\s|[.,!?;:]|$)","iu");
    const actionAfter=new RegExp("(?<![\\p{L}\\p{N}_])" + c + "\\s+" + ACTION + "\\b","iu");
    const roleWithAction=new RegExp("\\b" + ROLE + "\\s+" + c + "\\s+" + ACTION + "\\b","iu");
    return directRelation.test(text) || actionAfter.test(text) || roleWithAction.test(text) ||
      (genericRelation.test(text) && (looksTitleCased(candidate) || (isKnownGivenName(candidate) && !isAmbiguous(candidate))));
  }

  function explicitName(text){
    const full=new RegExp("\\b(?:heter|navn(?:et)?\\s+er|kalles|" + ROLE + "\\s+heter)\\s+(" + TOKEN + ")\\s+(" + TOKEN + ")(?![\\p{L}'’\\-])","iu");
    const fm=text.match(full);
    if(fm && candidateAllowed(fm[1]) && candidateAllowed(fm[2])) return fm[1] + " " + fm[2];
    const single=new RegExp("\\b(?:heter|navn(?:et)?\\s+er|kalles|" + ROLE + "\\s+heter)\\s+(" + TOKEN + ")(?![\\p{L}'’\\-])","iu");
    const sm=text.match(single);
    if(sm && candidateAllowed(sm[1])) return sm[1];
    return null;
  }

  function contextualFullName(text){
    const re=new RegExp("(?<![\\p{L}\\p{N}_])(" + TITLE_TOKEN + ")\\s+(" + TITLE_TOKEN + ")(?![\\p{L}\\p{N}_])","gu");
    for(const m of text.matchAll(re)){
      const a=m[1], b=m[2];
      if(!candidateAllowed(a) || !candidateAllowed(b)) continue;
      const phrase=a+" "+b;
      const known=isKnownGivenName(a) || isKnownGivenName(b) || isKnownSurname(b);
      if(known || strongContextFor(text,phrase) || strongContextFor(text,a)) return phrase;
    }
    return null;
  }

  function relationalUnknown(text){
    const direct=new RegExp("\\b(?:snakket\\s+med|møte\\s+med|samtale\\s+med|møtte|ringte|kontaktet)\\s+(" + TOKEN + ")(?:\\s+(" + TOKEN + "))?","giu");
    for(const m of text.matchAll(direct)){
      const a=m[1], b=m[2];
      if(!candidateAllowed(a)) continue;
      if(b && candidateAllowed(b) && (isKnownSurname(b) || looksTitleCased(b))) return a+" "+b;
      return a;
    }

    const roleName=new RegExp("\\b" + ROLE + "\\s+(" + TOKEN + ")(?:\\s+(" + TOKEN + "))?","giu");
    for(const m of text.matchAll(roleName)){
      const a=m[1], b=m[2];
      if(!candidateAllowed(a)) continue;
      const tail=text.slice((m.index||0)+m[0].length);
      const personAfter=new RegExp("^\\s*(?:som\\s+)?(?:" + ACTION + ")\\b","iu").test(tail);
      if(!(looksTitleCased(a) || (isKnownGivenName(a) && personAfter))) continue;
      if(b && candidateAllowed(b) && (isKnownSurname(b) || looksTitleCased(b))) return a+" "+b;
      return a;
    }

    const generic=new RegExp("\\b(?:med|til|fra|hos)\\s+(" + TOKEN + ")(?:\\s+(" + TOKEN + "))?","giu");
    for(const m of text.matchAll(generic)){
      const a=m[1], b=m[2];
      if(!candidateAllowed(a)) continue;
      const tail=text.slice((m.index||0)+m[0].length);
      const personAfter=new RegExp("^\\s*(?:som\\s+)?(?:" + ACTION + ")\\b","iu").test(tail);
      if(!(looksTitleCased(a) || (isKnownGivenName(a) && !isAmbiguous(a)) || personAfter)) continue;
      if(b && candidateAllowed(b) && (isKnownSurname(b) || looksTitleCased(b))) return a+" "+b;
      return a;
    }
    return null;
  }

  function subjectUnknown(text){
    const re=new RegExp("(?:^|[.!?]\\s+|\\n\\s*)(" + TOKEN + ")\\s+" + PERSON_ACTION + "\\b","giu");
    for(const m of text.matchAll(re)){
      const candidate=m[1];
      if(!candidateAllowed(candidate)) continue;
      return candidate;
    }
    return null;
  }

  function findLikelyGivenName(source){
    const text=String(source || "");
    if(!text.trim()) return null;

    const explicit=explicitName(text);
    if(explicit) return explicit;

    const full=contextualFullName(text);
    if(full) return full;

    const tokens=text.match(new RegExp("(?<![\\p{L}\\p{N}_])" + TOKEN + "(?![\\p{L}\\p{N}_])","gu")) || [];
    for(const token of tokens){
      if(!isKnownGivenName(token)) continue;
      if(isAmbiguous(token) && !looksTitleCased(token)) continue;
      if(strongContextFor(text,token)) return token;
    }

    const relational=relationalUnknown(text);
    if(relational) return relational;

    const subject=subjectUnknown(text);
    if(subject) return subject;

    return null;
  }

  function findLikelyGivenNames(source){
    const names=[];
    let working=String(source || "");
    for(let i=0;i<20;i+=1){
      const hit=findLikelyGivenName(working);
      if(!hit) break;
      if(!names.some(n=>normalizeNameToken(n)===normalizeNameToken(hit))) names.push(hit);
      const pattern=new RegExp("(?<![\\p{L}\\p{N}_])"+escaped(hit)+"(?![\\p{L}\\p{N}_])","iu");
      working=working.replace(pattern," ");
    }
    return names;
  }

  root.SamtalestottePrivacyDetector=Object.freeze({
    normalizeNameToken,
    isKnownGivenName,
    isKnownSurname,
    findLikelyGivenName,
    findLikelyGivenNames
  });
})(globalThis);
