const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const app = fs.readFileSync('app.js', 'utf8');
function fragment(begin, end) {
  const a = app.indexOf(begin), b = app.indexOf(end, a);
  assert(a >= 0 && b > a, 'Expected code section not found: ' + begin);
  return app.slice(a, b);
}
const helper = fragment('function escapeHtml(value) {', '\nasync function loadHelpSectorSummary()');
const sourceUsage = fragment('function compactSourceUsage(source){', '\nlet completeSourceLibraryLoaded=');
const sourceItem = fragment('function helpSourceTypeLabel(', '\nfunction renderHelpSourceGroup(');
const history = fragment('function renderHistory(items){', '\nfunction scanHistoryPrivacy(');

const historyList = {
  innerHTML: '',
  actions: new Map(),
  querySelectorAll(selector) {
    return this.actions.get(selector) || [];
  }
};
const count = { textContent:'' };
let fetched = null;
let confirms = 0;
let reopened = 0;
const ctx = {
  URL,
  encodeURIComponent,
  document: {
    querySelector(selector) {
      if (selector === '#history-list') return historyList;
      if (selector === '#history-count') return count;
      throw Error('Unexpected selector: ' + selector);
    }
  },
  fetch: async (url, options) => {
    fetched = { url, options };
    return { ok:true };
  },
  confirm: () => {confirms++; return true;},
  loadHistoryItem() {},
  openHistory() {reopened++;}
};
vm.createContext(ctx);
vm.runInContext(helper + '\n' + sourceUsage + '\n' + sourceItem + '\n' + history +
  '\nthis.safeUrl=safeExternalUrl; this.link=renderSafeSourceLink;' +
  'this.compactSource=compactSourceRow; this.helpSource=renderHelpSourceItem;' +
  'this.renderHistory=renderHistory;', ctx);

const allowed = 'https://www.arbeidstilsynet.no/arbeidsforhold/';
assert.equal(ctx.safeUrl(allowed), allowed);
assert.equal(ctx.safeUrl('http://example.org/path?q=1'), 'http://example.org/path?q=1');
for (const invalid of [
  'javascript:alert(1)', 'data:text/html,<script>alert(1)</script>',
  'file:///etc/passwd', 'ftp://example.org/', '/relative/path',
  '//relative.example.org/path', 'https://user:pass@example.org/path',
  'not a URL', '', null, undefined
]) {
  assert.equal(ctx.safeUrl(invalid), '', 'Must refuse unsafe external URL: ' + invalid);
  assert(!ctx.link(invalid, 'Kilde').includes('href='),
    'Disabled source must never have an href: ' + invalid);
}

const safe = ctx.link(allowed, '<Fagkilde>');
assert(safe.includes('href="https://www.arbeidstilsynet.no/arbeidsforhold/"'));
assert(safe.includes('&lt;Fagkilde&gt;'));
assert(!safe.includes('<Fagkilde>'));
const compact = ctx.compactSource({
  title:'<Kilde>',id:'source-x',url:'javascript:alert(1)',
  author:'Offentlig organ',useFor:['<b>falsk HTML</b>']
});
assert(!compact.includes('href="javascript:'), 'Compact source must not link to javascript:');
assert(compact.includes('&lt;Kilde&gt;'));
assert(compact.includes('&lt;b&gt;falsk HTML&lt;/b&gt;'));
const help = ctx.helpSource({
  title:'& Kilde', id:'source-y',url:'data:text/html,evil',
  type:'Lovverk',useFor:['oppfølging']
});
assert(!help.includes('href="data:'), 'Help source must not link to data:');
assert(help.includes('&amp; Kilde'));

// The ID comes from API data and must not break out of HTML attributes.
const id = 'odd-id" onmouseover="alert(1)<svg>';
const fakeButton = kind => ({
  dataset: { [kind]: id },
  listener: null,
  addEventListener(event, fn) {assert.equal(event,'click');this.listener=fn;}
});
const open = fakeButton('openHistory');
const remove = fakeButton('deleteHistory');
historyList.actions.set('[data-open-history]', [open]);
historyList.actions.set('[data-delete-history]', [remove]);
ctx.renderHistory([{
  id, title:'A "<script>"', topic:'Fravær',
  subtopic:'<script>alert(1)</script>', updatedAt:'2026-11-20T12:00:00.000Z'
}]);
const html = historyList.innerHTML;
assert(html.includes('data-history-id="odd-id&quot; onmouseover=&quot;alert(1)&lt;svg&gt;"'));
assert(html.includes('data-open-history="odd-id&quot;'));
assert(html.includes('data-delete-history="odd-id&quot;'));
assert(!html.includes('<script>') && !html.includes('<svg>'),
  'User/API fields must be escaped inside history markup');
assert.equal(count.textContent,'1 lagrede samtaler');

(async () => {
  await remove.listener();
  assert.equal(confirms,1);
  assert.equal(fetched.url, '/api/history/' + encodeURIComponent(id),
    'History path must encode any reserved characters');
  assert.equal(fetched.options.method,'DELETE');
  assert.equal(fetched.options.credentials,'include');
  assert.equal(reopened,1);

  // The sensitive link sinks must always validate the URL scheme before generating a href.
  assert(!app.includes('href="\${escapeHtml(source.url)}"'),
    'A source link still bypasses scheme validation');
  assert(!app.includes('href="\${escapeHtml(x.url)}"'),
    'Admin source link still bypasses scheme validation');
  assert(app.includes('renderSafeSourceLink(x.url, x.title||x.url)'));
  assert(app.includes('const href = safeExternalUrl(source.url);'));

  console.log('External source URLs, unsafe HTML attributes and encoded history routes: OK');
})().catch(err => {console.error(err);process.exitCode=1;});
