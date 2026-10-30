// Samtalestøtte – statiske klientdata skilt fra UI-logikk.
window.SamtalestotteClientData = Object.freeze({
  svgIcons: Object.freeze({
  home: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11.5 12 4l9 7.5"></path><path d="M5.5 10.5V20h13V10.5"></path></svg>`,
  prepare: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 4.5h8"></path><path d="M8 8.5h8"></path><path d="M8 12.5h8"></path><path d="M8 16.5h5"></path><path d="M6 3.5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2Z"></path></svg>`,
  history: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v5l3 2"></path><path d="M12 21a9 9 0 1 0-9-9"></path></svg>`,
  settings: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21h-4v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H3v-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3h4v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1v4H21a1.7 1.7 0 0 0-1.6 1Z"></path></svg>`,
  clock: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8.5"></circle><path d="M12 7.5V12l3.2 2"></path></svg>`,
  chatBubble: `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5.5h14a2 2 0 0 1 2 2v7.5a2 2 0 0 1-2 2h-7l-4.5 3v-3H5a2 2 0 0 1-2-2V7.5a2 2 0 0 1 2-2Z"></path><path d="M7.5 10h9M7.5 13h6"></path></svg>`,
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
    representations: ['Alkoholbruk og rusmidler', 'Påvirkning og sikkerhet', 'Videre oppfølging'],
    keywords: ['alkohol', 'rus', 'påvirket', 'beruset', 'stoff', 'narkotika', 'promille', 'drikking', 'bekymring'],
    subtopics: [
      ['Alkoholbruk', 'Når det er bekymring for alkoholbruk som kan påvirke arbeid, oppmøte eller fungering. Ta utgangspunkt i det som faktisk er observert, uten å anta avhengighet eller diagnose.'],
      ['Andre rusmidler', 'Når det er bekymring knyttet til andre rusmidler og mulig påvirkning på arbeidssituasjonen. Fokus på observasjoner og konsekvenser, ikke antakelser om hva medarbeideren bruker.'],
      ['Påvirket på jobb', 'Når en medarbeider fremstår påvirket på jobb og lederen må håndtere situasjonen der og da, for eksempel ved å stanse arbeid eller avklare om medarbeideren kan fortsette arbeidsdagen.'],
      ['Fungering på jobb', 'Når det er endringer i prestasjon, oppmøte, konsentrasjon eller adferd som gir grunn til bekymring, men årsaken ikke er kjent.'],
      ['Rus og sikkerhet', 'Når alkohol eller rus kan innebære en sikkerhetsrisiko, for eksempel ved kjøring, maskiner, våpen, utstyr eller andre sikkerhetskritiske oppgaver.'],
      ['Videre oppfølging', 'Oppfølging etter en bekymring, hendelse, fravær eller behandling, og samtaler om tilbakekomst og videre arbeidssituasjon.']
    ]
  },
  {
    id: 'fravaer-oppfolging',
    title: 'Fravær og oppfølging',
    iconKey: 'clock',
    image: 'assets/images/topics/topic-fravaer-oppfolging.png',
    imageAlt: 'Oppfølgingssamtale mellom leder og medarbeider i et lyst kontormiljø',
    description: 'Støtte til gode samtaler om sykefravær, oppmøte, planlagt fravær, tilbakekomst, arbeidsevne og tilrettelegging – med fokus på arbeidssituasjonen fremfor diagnose.',
    representations: ['Fravær og oppmøte', 'Sykefravær og tilbakekomst', 'Tilrettelegging og arbeidsevne'],
    keywords: ['sykefravær','fravær','sykmelding','egenmelding','oppmøte','for sent','punktlighet','planlagt fravær','tilrettelegging','tilbakekomst','arbeidsevne'],
    subtopics: [
      ['Korttidsfravær', 'Når medarbeideren har gjentatte korte fravær eller egenmeldinger og lederen trenger å snakke om fraværsmønster, arbeidssituasjon og mulig oppfølging.'],
      ['Langtidsfravær', 'Samtaler ved lengre sykefravær eller annet langvarig fravær, med fokus på kontakt, arbeidssituasjon og videre oppfølging uten å kreve medisinske detaljer.'],
      ['Oppmøte og punktlighet', 'Når medarbeideren gjentatte ganger kommer for sent, ikke møter som avtalt eller har ustabilt oppmøte.'],
      ['Planlagt fravær', 'Samtaler om permisjon, avtalt fravær eller andre planlagte perioder borte fra arbeidet og hvordan dette håndteres.'],
      ['Tilbake i jobb', 'Når medarbeideren skal tilbake etter lengre fravær og det er behov for å avklare oppstart, forventninger og eventuelle midlertidige behov.'],
      ['Tilrettelegging', 'Når arbeidssituasjonen eller oppgavene kan måtte tilpasses for at medarbeideren skal kunne fungere i arbeid, uten at lederen trenger private eller medisinske detaljer.']
    ]
  },
  {
    id: 'prestasjon-utvikling',
    title: 'Prestasjon og utvikling',
    iconKey: 'trendUp',
    image: 'assets/images/topics/topic-prestasjon-utvikling.png',
    imageAlt: 'Utviklingssamtale med fokus på mål og fremgang ved et skrivebord',
    description: 'Støtte til samtaler om forventninger, kvalitet, mål, kompetanse og utvikling når arbeidshverdagen ikke fungerer helt som ønsket.',
    representations: ['Mål og kvalitet', 'Arbeidsutførelse og ansvar', 'Kompetanse og utvikling'],
    keywords: ['prestasjon', 'leveranse', 'resultat', 'engasjement', 'kvalitet', 'feil', 'frist', 'arbeidsutførelse', 'mestring', 'kompetanse', 'utvikling'],
    subtopics: [
      ['Måloppnåelse', 'Når avtalte mål, frister eller forventede resultater ikke nås, eller det er behov for å avklare hva som forventes fremover.'],
      ['Engasjement', 'Når lederen observerer tydelig endring i innsats, deltakelse eller initiativ og ønsker å forstå situasjonen uten å anta hvorfor endringen har skjedd.'],
      ['Kvalitet', 'Når kvaliteten på det som leveres ikke er som forventet, for eksempel når det gjelder nøyaktighet, grundighet eller faglig standard.'],
      ['Arbeidsutførelse', 'Når utfordringen først og fremst handler om hvordan arbeidet gjennomføres, arbeidsmåte, rutiner eller gjentatte utfordringer i utførelsen.'],
      ['Kompetanse', 'Når medarbeideren trenger mer kunnskap, opplæring, trening eller støtte for å mestre oppgaver og forventninger.'],
      ['Ansvar og initiativ', 'Når det er behov for å snakke om selvstendighet, ansvarstaking, oppfølging av oppgaver eller forventning om å ta mer initiativ.']
    ]
  },
  {
    id: 'lonn-utvikling',
    title: 'Lønn og utvikling',
    iconKey: 'coinsUp',
    image: 'assets/images/topics/topic-lonn-utvikling.png',
    imageAlt: 'Positiv samtale om lønn, utvikling og forventninger i et moderne kontor',
    description: 'Støtte til ryddige samtaler om lønn, forventninger, ansvar, utviklingsmuligheter og hvordan virksomhetens rammer kan forklares tydelig.',
    representations: ['Lønnsutvikling og lønnskrav', 'Lønnsforskjeller', 'Forfremmelse og utvikling'],
    keywords: ['lønn', 'lønnskrav', 'lønnsøkning', 'lønnsutvikling', 'lønnssamtale', 'lønnsforhandling', 'forfremmelse', 'kompensasjon', 'ansvarstillegg', 'utvikling'],
    subtopics: [
      ['Lønnsutvikling', 'Samtaler om medarbeiderens lønnsutvikling over tid, hvordan lønn vurderes og hvilke forhold som kan påvirke utviklingen.'],
      ['Lønnskrav', 'Når medarbeideren ber om høyere lønn eller fremmer et lønnskrav. Kan også dekke samtaler i forbindelse med lønnsforhandlinger og økt ansvar.'],
      ['Lønnsforskjeller', 'Når medarbeideren reagerer på eller ønsker å diskutere forskjeller mellom egen lønn og andres lønn, uten at lederen deler andre medarbeideres personlige lønnsopplysninger.'],
      ['Forfremmelse', 'Når medarbeideren ønsker en høyere stilling, har søkt på en stilling eller trenger tilbakemelding etter ikke å ha blitt valgt.']
    ]
  },
  {
    id: 'samarbeid-kommunikasjon',
    title: 'Samarbeid og kommunikasjon',
    iconKey: 'chatBubble',
    image: 'assets/images/topics/topic-samarbeid-kommunikasjon.png',
    imageAlt: 'Flere kolleger samarbeider rundt en laptop i et moderne kontor',
    description: 'Støtte til samtaler som skal styrke kommunikasjon, tillit, rolleforståelse og samspill når samarbeidet har blitt krevende.',
    representations: ['Samarbeidsutfordringer', 'Konflikt og tillitsbrudd', 'Roller og forventninger'],
    keywords: ['samarbeid', 'samarbeidsutfordring', 'konflikt', 'uenighet', 'kommunikasjon', 'kollega', 'leder', 'tillitsbrudd', 'tillit', 'team', 'samspill'],
    subtopics: [
      ['Samarbeidsutfordringer', 'Når samarbeidet mellom medarbeidere eller i et team ikke fungerer godt, uten at situasjonen nødvendigvis har utviklet seg til en tydelig konflikt.'],
      ['Konflikt med kollega', 'Når medarbeidere står i en tydelig uenighet eller konflikt og lederen må bidra til å forstå situasjonen og finne en vei videre.'],
      ['Konflikt med leder', 'Når konflikten eller den fastlåste uenigheten gjelder forholdet mellom medarbeider og leder, for eksempel beslutninger, oppfølging, kommunikasjon eller opplevd behandling.'],
      ['Tillitsbrudd', 'Når en konkret handling eller hendelse har svekket tilliten mellom personer, for eksempel brudd på avtaler, tilbakeholdelse av viktig informasjon eller handlinger som har skadet samarbeidet.'],
      ['Roller og forventninger', 'Når det er uklarhet eller uenighet om ansvar, oppgaver, myndighet, arbeidsfordeling eller hva som forventes av den enkelte.']
    ]
  },
  {
    id: 'avslutning-arbeidsforhold',
    title: 'Oppsigelse og avslutning av arbeidsforhold',
    iconKey: 'exitDoor',
    image: 'assets/images/topics/topic-avslutning-arbeidsforhold.png',
    imageAlt: 'Alvorlig og profesjonell samtale om oppsigelse eller avslutning av arbeidsforhold',
    description: 'Støtte til samtaler når oppsigelse kan bli aktuelt, når det er alvorlige problemer i arbeidsforholdet, eller når medarbeideren selv vurderer å slutte. Verktøyet hjelper med selve samtalen, men avgjør ikke om vilkårene for oppsigelse er oppfylt.',
    representations: ['Mulig oppsigelse og prøvetid', 'Endret stilling eller tidligere oppfølging', 'Advarsel eller frivillig avslutning'],
    keywords: ['oppsigelse','slutte','avslutte','prøvetid','arbeidsforhold','avskjed','bemanning','nedbemanning','advarsel','formell oppfølging'],
    subtopics: [
      ['Mulig oppsigelse', 'Når arbeidsgiver vurderer om arbeidsforholdet kan fortsette og lederen må gjennomføre en tydelig samtale før eventuell videre prosess.'],
      ['Prøvetid', 'Når medarbeideren er i prøvetid og forventninger, utvikling eller forhold som ikke fungerer må tas opp.'],
      ['Endret stilling', 'Når rolle, arbeidsoppgaver eller virksomhetens bemanningsbehov endres og dette kan få konsekvenser for medarbeiderens stilling.'],
      ['Manglende bedring', 'Når samme forhold er tatt opp tidligere og tiltak er forsøkt, men nødvendig bedring fortsatt ikke har kommet.'],
      ['Ønske om å slutte', 'Når medarbeideren selv vurderer å si opp eller ønsker å snakke om frivillig avslutning av arbeidsforholdet.'],
      ['Advarsel og oppfølging', 'Når et forhold har kommet så langt at lederen må gjennomføre en tydelig samtale før eventuell advarsel eller annen formell oppfølging.']
    ]
  },
  {
    id: 'sikkerhet-ansvar',
    title: 'Sikkerhet og ansvar',
    iconKey: 'shieldCheck',
    image: 'assets/images/topics/topic-sikkerhet-ansvar.png',
    imageAlt: 'Sikkerhetsmøte med planer, sikkerhetsutstyr og tydelig dialog',
    description: 'Støtte til samtaler om sikker praksis, rutiner, risiko, avvik og ansvar – med mål om læring, tydelighet og tryggere arbeid.',
    representations: ['Sikkerhetsrutiner', 'Sikkerhetshendelser', 'Informasjonssikkerhet, vold og trusler'],
    keywords: ['sikkerhet', 'avvik', 'hendelse', 'nestenulykke', 'rutiner', 'prosedyre', 'rapportering', 'risiko', 'informasjonssikkerhet', 'vold', 'trusler', 'ansvar'],
    subtopics: [
      ['Sikkerhetsrutiner', 'Når obligatoriske sikkerhetsrutiner eller arbeidsmåter ikke følges, eller det er behov for å avklare forventninger til forsvarlig arbeid. Kan også dekke uenighet om risiko og nødvendige sikkerhetstiltak.'],
      ['Sikkerhetshendelser', 'Når det har skjedd en hendelse, nestenulykke eller et avvik som må følges opp. Kan også dekke manglende eller sen rapportering og læring etter hendelsen.'],
      ['Informasjonssikkerhet', 'Når saken gjelder behandling, deling eller sikring av informasjon, tilgang, digitale systemer eller andre forhold knyttet til informasjonssikkerhet.'],
      ['Vold og trusler', 'Når en medarbeider har vært utsatt for, involvert i eller skapt en situasjon med vold, trusler eller alvorlig aggressiv adferd, og lederen må håndtere sikkerhet og videre oppfølging.']
    ]
  },
  {
    id: 'livssituasjoner',
    title: 'Livssituasjoner',
    iconKey: 'homeHeart',
    image: 'assets/images/topics/topic-livssituasjoner.png',
    imageAlt: 'Omsorgsfull samtale der en medarbeider sitter med hodet bøyd og blir lyttet til',
    description: 'Støtte til omsorgsfulle og profesjonelle samtaler når personlige belastninger, omsorgsansvar, sorg eller andre livssituasjoner påvirker arbeidshverdagen.',
    representations: ['Familie og omsorg', 'Sorg og psykisk belastning', 'Utmattelse'],
    keywords: ['livssituasjon', 'familie', 'samlivsbrudd', 'sorg', 'omsorg', 'stress', 'psykisk', 'privat', 'utmattelse', 'utbrenthet', 'belastning'],
    subtopics: [
      ['Samliv og familie', 'Når forhold i privatlivet, som samlivsbrudd, familieproblemer eller sykdom i nær familie, påvirker arbeidssituasjonen og medarbeideren trenger støtte eller tilrettelegging.'],
      ['Sorg og tap', 'Når medarbeideren står i sorg etter dødsfall eller annet alvorlig tap, og lederen trenger hjelp til en omsorgsfull samtale om arbeidssituasjonen.'],
      ['Omsorgsansvar', 'Når omsorg for barn, partner, foreldre eller andre nærstående påvirker arbeidshverdagen og det er behov for å snakke om muligheter og begrensninger.'],
      ['Psykisk belastning', 'Når medarbeideren selv forteller om psykiske belastninger eller en vanskelig situasjon og lederen trenger å møte dette på en god måte uten å diagnostisere eller opptre som behandler.'],
      ['Utmattelse', 'Når medarbeideren virker eller beskriver seg som svært sliten, tappet eller overbelastet over tid. Kan dekke høyt press, søvnproblemer og situasjoner der medarbeideren selv bruker begreper som utbrenthet.']
    ]
  },
  {
    id: 'mobbing-trakassering',
    title: 'Mobbing og trakassering',
    iconKey: 'harassment',
    image: 'assets/images/topics/topic-mobbing-trakassering.png',
    imageAlt: 'Profesjonell samtale om arbeidsmiljø, grenser og trygghet',
    description: 'Støtte til varsomme og ryddige samtaler om mobbing, trakassering, utestenging og uønsket seksuell oppmerksomhet. Verktøyet skal ikke avgjøre skyld, men hjelpe lederen å lytte, ivareta involverte og følge riktig prosess.',
    representations: ['Mobbing og utestenging', 'Uønsket adferd og seksuell trakassering', 'Diskriminering og varsling'],
    keywords: ['mobbing', 'trakassering', 'seksuell trakassering', 'uønsket seksuell oppmerksomhet', 'kjønnstrakassering', 'diskriminering', 'forskjellsbehandling', 'utestenging', 'utfrysing', 'uønsket adferd', 'krenkende', 'varsling', 'gjengjeldelse'],
    subtopics: [
      ['Mobbing', 'Når en medarbeider beskriver gjentatte negative handlinger, krenkelser eller behandling over tid som kan være mobbing. Verktøyet skal ikke slå fast at mobbing har skjedd før saken er undersøkt.'],
      ['Utestenging', 'Når en medarbeider opplever å bli holdt utenfor arbeidsrelaterte møter, samarbeid, informasjon eller fellesskap. Skiller mellom arbeidsrelatert utestenging og private sosiale aktiviteter.'],
      ['Uønsket adferd', 'Når en medarbeider opplever kommentarer, fysisk kontakt, grenseoverskridelser eller annen opptreden som uønsket eller ubehagelig, uten at situasjonen på forhånd klassifiseres som mobbing eller trakassering.'],
      ['Seksuell trakassering', 'Når saken gjelder uønsket seksuell oppmerksomhet, seksuelle kommentarer, berøring eller annen adferd av seksuell karakter.'],
      ['Diskriminering', 'Når en medarbeider mener å ha blitt forskjellsbehandlet eller utsatt for krenkende behandling knyttet til for eksempel kjønn, alder, etnisitet, religion, funksjonsnedsettelse eller seksuell orientering. Kan også dekke kjønnstrakassering.'],
      ['Varslingssak', 'Når lederen skal håndtere en sak det er varslet om, enten samtalen er med den som sier fra eller den det er varslet om. Påstander skal ikke behandles som fastslåtte fakta før saken er undersøkt.']
    ]
  }
])
});
