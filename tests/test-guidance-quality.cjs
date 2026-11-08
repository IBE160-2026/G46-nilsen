const fs = require('fs');
const assert = require('assert');

const server = fs.readFileSync('server.js', 'utf8');
const schema = fs.readFileSync('src/server/ai-schemas.js', 'utf8');

assert(server.includes('## Forslag til åpning – menneskelig lederdialog'), 'Mangler menneskelig åpningskontrakt');
assert(server.includes('opening skal KUN være ord lederen faktisk kan si høyt direkte til medarbeideren'), 'Åpningen er ikke eksplisitt avgrenset til muntlig replikk');
assert(server.includes('60–120 ord') && server.includes('Ikke gjør den kunstig kort'), 'Mangler fleksibel lengdestyring for menneskelig åpning');
assert(server.includes('opening skal aldri inneholde instruksjoner TIL lederen'), 'Mangler vern mot lederinstruksjoner i opening');
assert(server.includes('Det finnes IKKE én fast mal') && server.includes('tilrettelegge en periode') && server.includes('ivaretatt personen'), 'Mangler situasjonstilpasset omsorg og variasjon');
assert(server.includes('Åpningen skal ha menneskelig kontakt') && server.includes('Ikke dikt opp innsats, følelser eller betydning'), 'Mangler eksplisitt medmenneskelighet uten oppdiktet empati');
assert(server.includes('Ved negativt utfall') && server.includes('inviter til spørsmål'), 'Mangler tydelig standard for skuffende utfall');
assert(server.includes('ett eller flere kriterier er ikke oppfylt'), 'Mangler vern mot mekanisk kriteriespråk');
assert(server.includes('Ikke gjenta samme råd i flere seksjoner'), 'Mangler regel mot gjentakelser i veiledningen');

assert(/questions:\s*\{[\s\S]*?minItems:\s*2,\s*maxItems:\s*3[\s\S]*?\},\s*reactions:/.test(schema), 'Spørsmål er ikke begrenset til 2–3');
assert(/reactions:[\s\S]*?minItems:\s*2,\s*maxItems:\s*3/.test(schema), 'Reaksjoner er ikke begrenset til 2–3');
assert(/attention:\s*\{[\s\S]*?minItems:\s*1,\s*maxItems:\s*3[\s\S]*?\},\s*check_before_meeting:/.test(schema), 'Vær særlig oppmerksom på er ikke begrenset til maks 3');
assert(/check_before_meeting:\s*\{[\s\S]*?maxItems:\s*3[\s\S]*?\},\s*legal_hr_note:/.test(schema), 'Sjekk før samtalen er ikke begrenset til maks 3');
assert(/next_steps:\s*\{[\s\S]*?minItems:\s*1,\s*maxItems:\s*3[\s\S]*?\}\s*\n?\s*\},/.test(schema), 'Videre oppfølging er ikke begrenset til maks 3');
assert(schema.includes('"Oppsigelse og avslutning av arbeidsforhold"'), 'Analyse-skjemaet mangler nytt hovedtemanavn');
assert(!schema.includes('"Avslutning av arbeidsforhold",'), 'Analyse-skjemaet inneholder fortsatt gammelt hovedtemanavn');

console.log('Veiledningskvalitet: menneskelig muntlig åpning, omsorg, variasjon og temasynk OK');

assert(server.includes('KILDEHIERARKI FOR RETTSLIGE/FORMELLE PÅSTANDER'), 'Mangler eksplisitt kildehierarki for rettslige råd');
assert(server.includes('AKAN og IA er veiledning/arbeidslivsrammeverk, ikke lov'), 'Mangler vern mot å fremstille AKAN/IA som lov');
assert(server.includes('Tariff/HTA/Hovedavtale gjelder bare når riktig avtaleområde faktisk er relevant'), 'Mangler tariffavgrensning');
assert(server.includes('Forskning og faglige rammeverk skal IKKE brukes som bevis'), 'Mangler skille mellom forskning og rettslig plikt');
