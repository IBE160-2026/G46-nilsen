const fs = require('fs');
const assert = require('assert');

const app = fs.readFileSync('app.js','utf8');
const server = fs.readFileSync('server.js','utf8');
const html = fs.readFileSync('index.html','utf8');
const migration = fs.readFileSync('V20-3-SUPABASE-MIGRATION.sql','utf8');
const bank = JSON.parse(fs.readFileSync('BENCHMARK-CASES.json','utf8'));

assert.equal(bank.version, '20.3.0');
assert.equal(bank.cases.length, 94, 'Testbanken skal ha 94 saker');
const groups = new Map();
for (const c of bank.cases) {
  const key = `${c.topicId}|${c.subtopic}`;
  groups.set(key, (groups.get(key) || 0) + 1);
  assert(c.situation && c.situation.length > 80, `Manglende testsituasjon: ${c.id}`);
}
assert.equal(groups.size, 47, 'Det skal være 47 undertemaer');
assert([...groups.values()].every(n => n >= 2), 'Hvert undertema må ha minst to tester');
assert(server.includes("/api/admin/benchmark/mock"));
assert(server.includes("/api/admin/benchmark/live"));
assert(server.includes("/api/admin/benchmark/results"));
assert(server.includes("_modelOverride"));
assert(server.includes("_isTest"));
assert(server.includes("WEB_SEARCH_CALL_USD"));
assert(html.includes('Automatisk test og modellbenchmark'));
assert(html.includes('Maks budsjett (USD)'));
assert(app.includes('runBenchmarkLive'));
assert(app.includes('benchmarkStopRequested'));
assert(migration.includes('benchmark_results'));
assert(migration.includes('is_test'));
console.log('v20.3 benchmark test: OK');
