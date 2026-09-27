const fs=require('fs');const assert=require('assert');
const html=fs.readFileSync('index.html','utf8');
const app=fs.readFileSync('app.js','utf8');
const server=fs.readFileSync('server.js','utf8');
const css=fs.readFileSync('styles.css','utf8');

assert(!html.includes('login-debug.js'));
assert(!html.includes('login-debug-panel'));
assert(html.includes('show-forgot-password'));
assert(html.includes('forgot-password-form'));
assert(html.includes('reset-password-form'));
assert(server.includes('/api/auth/password-reset-request'));
assert(server.includes('/api/auth/password-reset-complete'));
assert(server.includes('resetPasswordForEmail'));
assert(server.includes('auth.updateUser({ password })'));
assert(app.includes("event.key !== 'Enter' || event.shiftKey"));
assert(css.includes('translate(-3px,-38px)'));
assert(css.includes('width:24px; height:20px'));
assert(css.includes('width:19px; height:16px'));

const contact=html.slice(html.indexOf('<section id="contact-view"'),html.indexOf('</section>',html.indexOf('<section id="contact-view"')));
assert(contact.indexOf('id="report-form"') < contact.indexOf('Foretrekker du e-post?'));

console.log('v19.11.8 UI/passordreset-test OK');
