const fs = require('fs');
const assert = require('assert');

(async () => {
  const benchmark = JSON.parse(fs.readFileSync('data/BENCHMARK-CASES.json', 'utf8'));
  const { topicCatalog } = await import('../src/server/topic-contracts.js');

  const byTopic = new Map(topicCatalog.map(topic => [topic.id, topic]));
  const ids = new Set();
  const pairCounts = new Map();

  for (const tc of benchmark.cases || []) {
    assert(tc.id && !ids.has(tc.id), `Ugyldig eller duplisert benchmark-id: ${tc.id}`);
    ids.add(tc.id);

    const topic = byTopic.get(tc.topicId);
    assert(topic, `${tc.id}: ukjent topicId ${tc.topicId}`);
    assert.strictEqual(tc.topic, topic.title, `${tc.id}: topic-tittel er ikke synkron med topic-contracts`);
    assert(topic.subtopics.includes(tc.subtopic), `${tc.id}: undertemaet "${tc.subtopic}" finnes ikke under ${topic.title}`);

    const key = `${tc.topicId}|${tc.subtopic}`;
    pairCounts.set(key, (pairCounts.get(key) || 0) + 1);
  }

  for (const topic of topicCatalog) {
    for (const subtopic of topic.subtopics) {
      const key = `${topic.id}|${subtopic}`;
      assert((pairCounts.get(key) || 0) >= 2, `Benchmarkbanken mangler minst to saker for ${topic.title} / ${subtopic}`);
    }
  }

  const expectedPairs = topicCatalog.reduce((sum, topic) => sum + topic.subtopics.length, 0);
  assert.strictEqual(expectedPairs, 48, 'Gjeldende taksonomi skal ha 48 undertemaer');
  assert.strictEqual(pairCounts.size, expectedPairs, 'Benchmarkbanken skal bare bruke gjeldende tema/undertema-par');

  console.log(`Benchmark/taksonomi OK: ${benchmark.cases.length} saker · ${pairCounts.size} undertemaer · minst 2 per undertema`);
})().catch(error => {
  console.error(error);
  process.exit(1);
});
