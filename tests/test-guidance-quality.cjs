const fs = require('fs');
const assert = require('assert');

const server = fs.readFileSync('server.js', 'utf8');
const schema = fs.readFileSync('src/server/ai-schemas.js', 'utf8');

assert(server.includes('## Forslag til åpning – menneskelig lederdialog'), 'Mangler menneskelig åpningskontrakt');
assert(server.includes('opening skal KUN være ord lederen faktisk kan si høyt direkte til medarbeideren'), 'Åpningen er ikke eksplisitt avgrenset til muntlig replikk');
assert(server.includes('50–100 ord') && server.includes('Ikke gjør den kunstig kort'), 'Mangler fleksibel lengdestyring for menneskelig åpning');
assert(server.includes('opening skal aldri inneholde instruksjoner TIL lederen'), 'Mangler vern mot lederinstruksjoner i opening');
assert(server.includes('Det finnes IKKE én fast mal') && server.includes('Hvordan har du det?') && server.includes('tilrettelegge en periode'), 'Mangler situasjonstilpasset omsorg og variasjon');
assert(server.includes('Ikke gjenta samme råd i flere seksjoner'), 'Mangler regel mot gjentakelser i veiledningen');

assert(/questions:\s*\{[^}]*minItems:\s*2,\s*maxItems:\s*3/s.test(schema), 'Spørsmål er ikke begrenset til 2–3');
assert(/reactions:[\s\S]*?minItems:\s*2,\s*maxItems:\s*3/.test(schema), 'Reaksjoner er ikke begrenset til 2–3');
assert(/attention:\s*\{[^}]*minItems:\s*1,\s*maxItems:\s*3/s.test(schema), 'Vær særlig oppmerksom på er ikke begrenset til maks 3');
assert(/check_before_meeting:\s*\{[^}]*maxItems:\s*3/s.test(schema), 'Sjekk før samtalen er ikke begrenset til maks 3');
assert(/next_steps:\s*\{[^}]*minItems:\s*1,\s*maxItems:\s*3/s.test(schema), 'Videre oppfølging er ikke begrenset til maks 3');
assert(schema.includes('"Oppsigelse og avslutning av arbeidsforhold"'), 'Analyse-skjemaet mangler nytt hovedtemanavn');
assert(!schema.includes('"Avslutning av arbeidsforhold",'), 'Analyse-skjemaet inneholder fortsatt gammelt hovedtemanavn');

console.log('Veiledningskvalitet: menneskelig muntlig åpning, omsorg, variasjon og temasynk OK');
