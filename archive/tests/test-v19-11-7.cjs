const fs=require('fs'); const assert=require('assert');
const server=fs.readFileSync('server.js','utf8');
const app=fs.readFileSync('app.js','utf8');
assert(server.includes('supabaseAdmin.auth.getUser(accessToken)'));
assert(server.includes('auth.refreshSession'));
assert(server.includes('authenticatedUserClient(accessToken)'));
for (const ep of ['classify-topic','analyze-situation','generate-guidance','continue-conversation','simulation-turn','simulation-help','simulation-feedback']) {
  const i=app.indexOf(`/api/${ep}`);
  assert(i>=0, `missing ${ep}`);
  const chunk=app.slice(i,i+260);
  assert(chunk.includes("credentials: 'include'"), `credentials missing for ${ep}`);
}
console.log('v19.11.7 auth/KI-test OK');
