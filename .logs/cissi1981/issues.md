# Åpne punkter – IBE160 Samtalestøtte

Oppdatert 18.11.2026. Dette er en aktiv arbeidsliste, ikke en påstand om at punktene er ferdig.

- [ ] P0: Verifiser full Quality Gate på endelig branch/commit. Siste `main`-CI 12.11 feilet på .docs; smal testrettelse ligger bare i dokumentasjonsgrenen. `npm audit` ble hoppet over i feilet run.
- [ ] P0: Bearbeid kanonisk `docs/bmad/PRD.md` mot faglærers formative tilbakemelding 12.11: målbare akseptanser, stabil ID-struktur, v1-kjerne/utvidelser, brukerreiser, glossar, mål og motmål.
- [ ] P1: Verifiser 34 kanoniske krav (og FR-15A/NFR-QA-01/krav uten ID) mot faktisk kode, observerbare tester, status, commit og miljø. Bruk `docs/bmad/KRAVSPORING-KONTROLL-2026-11-18.md`.
- [ ] P1: Koble PRD-krav eksplisitt til Architecture (mangler eksakte ID-er) og til alle Epics/stories; vurder avhengigheter, integrasjon og NFR-feilmodi.
- [ ] P1: Kontroller sikkerhet/RLS/autentisering, feil ved API-timeout, kildevalg, negativ fasit, og skill strukturelle tester fra runtime/live-/manuelle tester.
- [ ] P1: Legg fram samlet, datert testbevisregister uten å kalle historisk 40/40 live-golden et nytt resultat.
- [ ] P1: Oppdater implementeringsplan og versjonsstatus uten å tilsløre at prototypen kom før fullt BMAD-arbeid.
- [ ] P1: Rediger refleksjonsrapporten mot pensum og faktisk KI-/Git-prosess, kontroller ordkrav og endelige leveringskrav i Canvas.
- [ ] P1: Verifiser sentrale brukerreiser på desktop/mobil og sensorsti, inkludert demomodus, personvern, utskrift og PWA.
- [ ] P1: Hold LIVE/transkripsjon og tale i separat pilot. Ingen produksjonsmerge eller ferdigstatus uten egne akseptansetester og uttrykkelig beslutning.
- [ ] P2: Avklar hvilke sesjonslogger som faktisk finnes lokalt, og hva som ble rekonstruert fra Git/chat. Ikke etterkonstruer historie.
