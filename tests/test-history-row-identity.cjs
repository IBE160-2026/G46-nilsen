const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const code = fs.readFileSync('server.js','utf8');
const a = code.indexOf('function rowToHistory(row) {');
const b = code.indexOf('\napp.get("/api/history"',a);
assert(a >= 0 && b > a, 'Historikktransformasjonen finnes ikke');
const scope={};
vm.createContext(scope);
vm.runInContext(code.slice(a,b)+'\nthis.fromRow = rowToHistory;',scope);
const fromRow=scope.fromRow;
const row={
  id:'trusted-database-id',title:'Fra databasen',
  content:JSON.stringify({
    id:'overwritten-from-payload',
    title:'Fra payload',
    createdAt:'fake-created',updatedAt:'fake-updated',
    conversation:[{role:'user',text:'Test'}]
  }),
  created_at:'2026-11-20T12:00:00Z',
  updated_at:'2026-11-20T13:00:00Z'
};
const item=fromRow(row);
assert.equal(item.id,'trusted-database-id', 'Stored content cannot override database ID');
assert.equal(item.title,'Fra databasen');
assert.equal(item.createdAt,row.created_at);
assert.equal(item.updatedAt,row.updated_at);
assert.equal(item.conversation[0].text,'Test', 'Legitimate saved content survives');
for(const invalid of ['null','[]','"text"','invalid JSON']){
  const result=fromRow({...row,content:invalid,title:''});
  assert.equal(result.id,row.id,'Server identity survives invalid legacy JSON');
  assert.equal(result.title,'Samtale uten tittel');
}
console.log('Historikk: Database-ID og tidsstempler overstyrer aldri lagret JSON: OK');
