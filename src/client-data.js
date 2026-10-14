// Samtalestøtte – statiske klientdata skilt fra UI-logikk.
window.SamtalestotteClientData = Object.freeze({
  svgIcons: Object.freeze({
  home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10.5V20h13V10.5"></path></svg>`,
  prepare: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.5h8"></path><path d="M8 8.5h8"></path><path d="M8 12.5h8"></path><path d="M8 16.5h5"></path><path d="M6 3.5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z"></path></svg>`,
  history: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v5l3 2"></path><path d="M12 21a9 9 0 1 0-9-9"></path></svg>`,
  settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7Z"></path><path d="m19.4 15 .8 1.4-1.6 2.8-1.7-.4a7.9 7.9 0 0 1-1.8 1l-.4 1.7H9.3l-.4-1.7a7.9 7.9 0 0 1-1.8-1l-1.7.4-1.6-2.8.8-1.4a8.5 8.5 0 0 1 0-2l-.8-1.4 1.6-2.8 1.7.4a7.9 7.9 0 0 1 1.8-1l.4-1.7h3.4l.4 1.7a7.9 7.9 0 0 1 1.8 1l1.7-.4 1.6 2.8-.8 1.4a8.5 8.5 0 0 1 0 2Z"></path></svg>`,
  about: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 10.5V17"></path><path d="M12 7h.01"></path></svg>`,
  contact: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5h16v13H4z"></path><path d="m4.5 6 7.5 6 7.5-6"></path></svg>`,
  simulation: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h11a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3H9l-4 3v-3H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"></path><path d="M8 9h6M8 12h4"></path></svg>`,
  team: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.5 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M16.5 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M3.5 19c.5-2.2 2.2-3.5 4-3.5s3.5 1.3 4 3.5"></path><path d="M12.5 19c.5-2.2 2.2-3.5 4-3.5s3.5 1.3 4 3.5"></path></svg>`,
  bed: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7v12"></path><path d="M4 13.5h16"></path><path d="M7 13.5v-4h5a2 2 0 0 1 2 2v2"></path><path d="M20 19v-6"></path></svg>`,
  list: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6.5h9"></path><path d="M8 11.5h9"></path><path d="M8 16.5h9"></path><path d="M5 6.5h.01"></path><path d="M5 11.5h.01"></path><path d="M5 16.5h.01"></path><path d="M4 3.5h16v17H4z"></path></svg>`,
  warning: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 14H4L12 4Z"></path><path d="M12 9v4"></path><path d="M12 16.5h.01"></path></svg>`,
  bottle: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 3.5h4"></path><path d="M11 3.5v4l-3 3v8a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-8l-3-3v-4"></path><path d="M8 12.5h8"></path></svg>`,
  people: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M16 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M12 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z"></path><path d="M3.5 19c.4-2.2 2.2-3.5 4.3-3.5 1 0 1.9.2 2.7.8"></path><path d="M20.5 19c-.4-2.2-2.2-3.5-4.3-3.5-1 0-1.9.2-2.7.8"></path><path d="M8 19c.4-2.4 2-4 4-4s3.6 1.6 4 4"></path></svg>`,
  shirt: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 4 3 2 3-2 4 3-2 3v10H7V10L5 7l4-3Z"></path></svg>`,
  person: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path><path d="M5 20a7 7 0 0 1 14 0"></path></svg>`,
  coins: `<svg viewBox="0 0 24 24" aria-hidden="true"><ellipse cx="9" cy="7" rx="4" ry="2.5"></ellipse><path d="M5 7v6c0 1.4 1.8 2.5 4 2.5s4-1.1 4-2.5V7"></path><ellipse cx="16" cy="12" rx="4" ry="2.5"></ellipse><path d="M12 12v5c0 1.4 1.8 2.5 4 2.5s4-1.1 4-2.5v-5"></path></svg>`,
  scales: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16"></path><path d="M7 7h10"></path><path d="m7 7-3 5h6L7 7Z"></path><path d="m17 7-3 5h6l-3-5Z"></path><path d="M9 20h6"></path></svg>`,
  glassOff: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 4h10l-1.4 7.2A3.7 3.7 0 0 1 12 14.2a3.7 3.7 0 0 1-3.6-3L7 4Z"></path><path d="M12 14.2V20"></path><path d="M8.5 20h7"></path><path d="M4 4l16 16"></path></svg>`,
  calendarClock: `<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="5.5" width="14" height="14" rx="2"></rect><path d="M7 3.5v4M14 3.5v4M3.5 9.5h14"></path><circle cx="17.5" cy="16.5" r="4"></circle><path d="M17.5 14.3v2.4l1.5 1"></path></svg>`,
  trendUp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19V5M4 19h16"></path><path d="m7 15 4-4 3 2 5-6"></path><path d="M15.5 7H19v3.5"></path></svg>`,
  coinsUp: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10.5 4.2v15.6"></path><path d="M14.3 7.2c-.7-1.2-2-2-3.8-2-2.3 0-4 1.2-4 3 0 1.9 1.6 2.7 4.2 3.3 2.7.6 4.2 1.5 4.2 3.5 0 2.1-1.9 3.5-4.5 3.5-2 0-3.7-.8-4.5-2.2"></path><path d="M15.5 9.5 20 5"></path><path d="M16.7 5H20v3.3"></path></svg>`,
  chatPeople: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="8" r="2.5"></circle><circle cx="16" cy="8" r="2.5"></circle><path d="M3.5 16c.5-2.2 2.2-3.5 4.5-3.5 1.1 0 2.1.3 2.8.8M20.5 16c-.5-2.2-2.2-3.5-4.5-3.5-1.1 0-2.1.3-2.8.8"></path><path d="M8 17.5h8l2.5-2.2V20H8z"></path></svg>`,
  exitDoor: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 20V4h9v16"></path><path d="M10 12h10"></path><path d="m17 9 3 3-3 3"></path></svg>`,
  shieldCheck: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 19 6v5.2c0 4.3-2.8 7.5-7 9.3-4.2-1.8-7-5-7-9.3V6l7-2.5Z"></path><path d="m8.5 12 2.2 2.2 4.8-5"></path></svg>`,
  homeHeart: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10.5V20h13v-9.5"></path><path d="M12 17s-3-1.8-3-4a1.8 1.8 0 0 1 3-1.3 1.8 1.8 0 0 1 3 1.3c0 2.2-3 4-3 4Z"></path></svg>`,
  harassment: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 11V6.5a1.25 1.25 0 0 1 2.5 0V10"></path><path d="M11 10V5.5a1.25 1.25 0 0 1 2.5 0V10"></path><path d="M13.5 10V6.5a1.25 1.25 0 0 1 2.5 0V12"></path><path d="M16 11.5V9a1.25 1.25 0 0 1 2.5 0v5.2c0 3.8-2.6 6.3-6.3 6.3h-.4c-2.5 0-4.2-1.1-5.4-3.1L4.8 14.8a1.35 1.35 0 0 1 2.2-1.55L8.5 15V11Z"></path></svg>`,
  more: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 12h.01"></path><path d="M12 12h.01"></path><path d="M18 12h.01"></path></svg>`
}),
  topics: Object.freeze([
  {
    id: 'alkohol-rus',
    title: 'Alkohol og rus',
    iconKey: 'glassOff',
    image: 'assets/images/topics/topic-alkohol-rus.png',
    imageAlt: 'Alvorlig, men rolig samtale mellom kvinnelig leder og kvinnelig medarbeider i et moderne møterom',
    description: 'Støtte til samtaler der observasjoner, bekymring, påvirkning eller sikkerhet gjør det nødvendig å ta opp alkohol eller rus på en tydelig og respektfull måte.',
    representations: ['Bekymring og endret fungering', 'Påvirkning eller sikkerhet', 'Oppfølging og tilbakekomst'],
    keywords: ['alkohol','rus','påvirket','beruset','stoff','narkotika','promille','drikking','bekymring'],
    subtopics: [
      ['Bekymring knyttet til alkohol', 'Når endringer i atferd, fravær eller fungering skaper bekymring.'],
      ['Bekymring knyttet til rusmidler', 'Når observasjoner eller informasjon gir grunn til bekymring for annen rusmiddelbruk.'],
      ['Påvirkning på jobb', 'Når en medarbeider kan fremstå påvirket i arbeidstiden.'],
      ['Arbeidsevne og fungering', 'Når alkohol eller rus kan ha sammenheng med arbeidsutførelse, oppmøte eller samspill.'],
      ['Sikkerhet og hendelser', 'Når alkohol eller rus kan ha betydning for sikkerhet, feil eller en hendelse.'],
      ['Oppfølging og tilbakekomst', 'Samtaler etter behandling, fravær eller tidligere oppfølging.']
    ]
  },
  {
    id: 'fravaer-oppfolging',
    title: 'Fravær og oppfølging',
    iconKey: 'calendarClock',
    image: 'assets/images/topics/topic-fravaer-oppfolging.png',
    imageAlt: 'Oppfølgingssamtale mellom leder og medarbeider i et lyst kontormiljø',
    description: 'Støtte til gode samtaler om sykefravær, oppmøte, planlagt fravær, tilbakekomst, arbeidsevne og tilrettelegging – med fokus på arbeidssituasjonen fremfor diagnose.',
    representations: ['Fravær og oppmøte', 'Sykefravær og tilbakekomst', 'Tilrettelegging og arbeidsevne'],
    keywords: ['sykefravær','fravær','sykmelding','egenmelding','oppmøte','for sent','punktlighet','planlagt fravær','tilrettelegging','tilbakekomst','arbeidsevne'],
    subtopics: [
      ['Hyppig korttidsfravær og egenmeldinger', 'Når gjentatte korte fravær eller egenmeldinger gjør det naturlig med en oppfølgingssamtale.'],
      ['Langvarig sykefravær', 'Når medarbeideren har vært borte over en lengre periode og trenger strukturert oppfølging.'],
      ['Oppmøte og punktlighet', 'Forsinkelser, ustabilt oppmøte eller andre utfordringer knyttet til tilstedeværelse.'],
      ['Planlagt fravær', 'Når planlagt fravær, permisjon eller forutsigbarhet rundt fravær trenger avklaring.'],
      ['Tilbakekomst til arbeid', 'Samtaler etter lengre fravær eller overgang tilbake til vanlig arbeid.'],
      ['Tilrettelegging og arbeidsevne', 'Når dere trenger å utforske hvilke arbeidsoppgaver, arbeidstid eller andre tiltak som kan gjøre arbeidssituasjonen gjennomførbar – uten å etterspørre diagnose.']
    ]
  },
  {
    id: 'prestasjon-utvikling',
    title: 'Prestasjon og utvikling',
    iconKey: 'trendUp',
    image: 'assets/images/topics/topic-prestasjon-utvikling.png',
    imageAlt: 'Utviklingssamtale med fokus på mål og fremgang ved et skrivebord',
    description: 'Støtte til samtaler om forventninger, kvalitet, mål, kompetanse og utvikling når arbeidshverdagen ikke fungerer helt som ønsket.',
    representations: ['Mål og leveranser', 'Kvalitet og ansvar', 'Kompetanse og utvikling'],
    keywords: ['prestasjon','leveranse','resultat','motivasjon','kvalitet','feil','frist','arbeidsutførelse','mestring','kompetanse','utvikling'],
    subtopics: [
      ['Måloppnåelse', 'Når mål, leveranser eller forventede resultater trenger en nærmere samtale.'],
      ['Motivasjon', 'Når engasjement, driv eller interesse ser ut til å ha endret seg.'],
      ['Kvalitet i arbeidet', 'Når kvalitet, nøyaktighet eller standard på arbeidet bør følges opp.'],
      ['Feil og avvik', 'Når feil, hendelser eller avvik trenger gjennomgang og læring.'],
      ['Kompetanse og mestring', 'Når opplæring, ferdigheter eller trygghet i rollen kan være en del av situasjonen.'],
      ['Ansvar og initiativ', 'Når forventninger til selvstendighet, ansvar eller initiativ trenger avklaring.']
    ]
  },
  {
    id: 'lonn-utvikling',
    title: 'Lønn og utvikling',
    iconKey: 'coinsUp',
    image: 'assets/images/topics/topic-lonn-utvikling.png',
    imageAlt: 'Positiv samtale om lønn, utvikling og forventninger i et moderne kontor',
    description: 'Støtte til ryddige samtaler om lønn, forventninger, ansvar, utviklingsmuligheter og hvordan virksomhetens rammer kan forklares tydelig.',
    representations: ['Lønnsforventninger', 'Nye oppgaver og ansvar', 'Utvikling og muligheter'],
    keywords: ['lønn','lønnsøkning','lønnsutvikling','lønnssamtale','forfremmelse','kompensasjon','ansvarstillegg','utvikling'],
    subtopics: [
      ['Lønnsutvikling', 'Samtaler om utviklingen i lønn over tid.'],
      ['Forventninger til lønn', 'Når medarbeiderens forventninger og virksomhetens rammer må avklares.'],
      ['Lønnsforskjeller', 'Når forskjeller mellom roller eller medarbeidere blir tema.'],
      ['Nye oppgaver og ansvar', 'Når endringer i rolle eller ansvar kobles til forventninger om lønn.'],
      ['Utvikling og forfremmelse', 'Når samtalen handler om videre utvikling, muligheter eller hva som kreves for neste steg.']
    ]
  },
  {
    id: 'samarbeid-kommunikasjon',
    title: 'Samarbeid og kommunikasjon',
    iconKey: 'chatPeople',
    image: 'assets/images/topics/topic-samarbeid-kommunikasjon.png',
    imageAlt: 'Flere kolleger samarbeider rundt en laptop i et moderne kontor',
    description: 'Støtte til samtaler som skal styrke kommunikasjon, tillit, rolleforståelse og samspill når samarbeidet har blitt krevende.',
    representations: ['Kommunikasjon og tone', 'Uenighet og tillit', 'Roller og samspill i team'],
    keywords: ['samarbeid','konflikt','uenighet','kommunikasjon','tone','kollega','tillit','respekt','team','samspill'],
    subtopics: [
      ['Kommunikasjon', 'Misforståelser, tone, utydelige beskjeder eller manglende informasjonsdeling.'],
      ['Tillit', 'Når tidligere hendelser eller opplevelser påvirker samarbeidet.'],
      ['Roller og forventninger', 'Uklare ansvarsområder, ulike forventninger eller behov for avklaringer.'],
      ['Uenighet og konflikt', 'Når motsetninger eller uenigheter har blitt vanskelige å håndtere.'],
      ['Samspill i team', 'Hvordan medarbeidere samarbeider, fordeler oppgaver og påvirker arbeidsmiljøet.'],
      ['Grenser og respekt', 'Situasjoner knyttet til tone, humor, oppførsel eller personlige grenser.']
    ]
  },
  {
    id: 'avslutning-arbeidsforhold',
    title: 'Avslutning av arbeidsforhold',
    iconKey: 'exitDoor',
    image: 'assets/images/topics/topic-avslutning-arbeidsforhold.png',
    imageAlt: 'Alvorlig og profesjonell samtale om avslutning av arbeidsforhold',
    description: 'Støtte til tydelige og respektfulle samtaler når arbeidsforholdet kan være på vei mot en avslutning eller saken krever en mer formell videre prosess.',
    representations: ['Prøvetid og tidligere oppfølging', 'Endrede behov eller rolle', 'Samtale før videre prosess'],
    keywords: ['oppsigelse','slutte','avslutte','prøvetid','arbeidsforhold','avskjed','bemanning','nedbemanning'],
    subtopics: [
      ['Avslutning av arbeidsforhold', 'Samtaler der arbeidsforholdet kan være på vei mot en avslutning.'],
      ['Prøvetid', 'Oppfølging av forventninger, utvikling og vurderinger i prøvetiden.'],
      ['Endringer i stilling eller behov', 'Situasjoner der rolle, oppgaver eller bemanningsbehov endres.'],
      ['Tidligere oppfølging', 'Når medarbeideren allerede har fått tilbakemeldinger, veiledning eller oppfølgingssamtaler.'],
      ['Frivillig avslutning', 'Når medarbeideren selv vurderer å slutte eller ønsker å avslutte arbeidsforholdet.'],
      ['Samtale før videre prosess', 'Når alvorlige forhold må tas opp før saken eventuelt går videre til HR eller formell behandling.']
    ]
  },
  {
    id: 'sikkerhet-ansvar',
    title: 'Sikkerhet og ansvar',
    iconKey: 'shieldCheck',
    image: 'assets/images/topics/topic-sikkerhet-ansvar.png',
    imageAlt: 'Sikkerhetsmøte med planer, sikkerhetsutstyr og tydelig dialog',
    description: 'Støtte til samtaler om sikker praksis, rutiner, risiko, avvik og ansvar – med mål om læring, tydelighet og tryggere arbeid.',
    representations: ['Rutiner og etterlevelse', 'Avvik og hendelser', 'Risiko, ansvar og læring'],
    keywords: ['sikkerhet','avvik','hendelse','rutiner','prosedyre','rapportering','risiko','informasjonssikkerhet','ansvar'],
    subtopics: [
      ['Sikkerhetsrutiner', 'Etterlevelse av prosedyrer, instrukser og etablerte sikkerhetskrav.'],
      ['Avvik og hendelser', 'Når noe har skjedd som bør gjennomgås, følges opp eller læres av.'],
      ['Risikovurdering', 'Når leder og medarbeider har ulik forståelse av risiko eller forsvarlig praksis.'],
      ['Rapportering', 'Når rapportering av hendelser, feil eller avvik trenger oppfølging.'],
      ['Informasjonssikkerhet', 'Håndtering av informasjon, tilgang, deling eller andre sikkerhetsrelaterte forhold.'],
      ['Ansvar og læring etter hendelser', 'Samtaler om hva som skjedde, hva man kan lære og hva som bør endres.'],
      ['Vold og trusler', 'Når en arbeidstaker har vært utsatt for, eller det er risiko for, vold, trusler eller truende atferd i arbeidssammenheng.']
    ]
  },
  {
    id: 'livssituasjoner',
    title: 'Livssituasjoner',
    iconKey: 'homeHeart',
    image: 'assets/images/topics/topic-livssituasjoner.png',
    imageAlt: 'Omsorgsfull samtale der en medarbeider sitter med hodet bøyd og blir lyttet til',
    description: 'Støtte til omsorgsfulle og profesjonelle samtaler når personlige belastninger, omsorgsansvar, sorg eller andre livssituasjoner påvirker arbeidshverdagen.',
    representations: ['Familie og omsorg', 'Sorg, stress og belastning', 'Støtte og hensiktsmessige grenser'],
    keywords: ['livssituasjon','familie','sorg','omsorg','stress','psykisk','økonomi','privat','utmattelse','belastning'],
    subtopics: [
      ['Samlivs- og familieforhold', 'Samlivsbrudd, krevende familiesituasjoner eller andre forhold hjemme som påvirker arbeidshverdagen.'],
      ['Sykdom i nær familie', 'Når medarbeideren står i omsorgsbelastning eller alvorlig sykdom hos noen nær.'],
      ['Sorg og tap', 'Dødsfall, alvorlige tap eller andre situasjoner som krever særlig omtanke.'],
      ['Psykisk belastning', 'Når medarbeideren selv forteller om stress, uro, nedstemthet eller andre psykiske belastninger.'],
      ['Omsorgsansvar', 'Barn, foreldre eller andre nærstående som krever mye tid og oppfølging.'],
      ['Belastning og utmattelse', 'Søvnproblemer, høyt press eller andre belastninger som påvirker arbeidshverdagen.']
    ]
  },
  {
    id: 'mobbing-trakassering',
    title: 'Mobbing og trakassering',
    iconKey: 'harassment',
    image: 'assets/images/topics/topic-mobbing-trakassering.png',
    imageAlt: 'Profesjonell samtale om arbeidsmiljø, grenser og trygghet',
    description: 'Støtte til varsomme og ryddige samtaler om mobbing, trakassering, utestenging og uønsket seksuell oppmerksomhet. Verktøyet skal ikke avgjøre skyld, men hjelpe lederen å lytte, ivareta involverte og følge riktig prosess.',
    representations: ['Mobbing og utestenging', 'Trakassering og seksuell oppmerksomhet', 'Varsling og forsvarlig oppfølging'],
    keywords: ['mobbing','trakassering','seksuell trakassering','uønsket seksuell oppmerksomhet','kjønnstrakassering','utestenging','utfrysing','krenkende','utilbørlig','varsling','gjengjeldelse','most'],
    subtopics: [
      ['Mobbing', 'Når en medarbeider beskriver gjentatte negative handlinger, systematisk belastning eller en opplevelse av å være vanskelig i stand til å forsvare seg.'],
      ['Utestenging og utfrysing', 'Når en medarbeider opplever å bli holdt utenfor faglige eller sosiale fellesskap på arbeidsplassen.'],
      ['Krenkende eller utilbørlig atferd', 'Når ord, handlinger eller unnlatelser kan oppleves krenkende, skremmende, fiendtlige, nedverdigende eller ydmykende.'],
      ['Seksuell trakassering', 'Når det meldes om uønsket seksuell oppmerksomhet eller handlinger som kan være seksuelt trakasserende.'],
      ['Kjønnstrakassering og uønsket seksuell oppmerksomhet', 'Når kjønnede kommentarer, seksualisert språk, oppmerksomhet eller andre grenseoverskridelser tas opp.'],
      ['Varsling om mobbing eller trakassering', 'Når en medarbeider sier fra om et mulig kritikkverdig forhold og saken må håndteres etter virksomhetens varslingsrutiner.'],
      ['Samtale med den som sier ifra', 'Når lederen skal ta imot informasjon, lytte og avklare videre prosess uten å love et bestemt utfall.'],
      ['Samtale med den varselet gjelder', 'Når lederen skal informere og høre den det varsles om, uten å konkludere på forhånd eller gjøre samtalen til en skyldavgjørelse.']
    ]
  }
])
});
