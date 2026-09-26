const fs=require('fs');const assert=require('assert');
const app=fs.readFileSync('app.js','utf8');

assert(app.includes("function cleanStoredConversationText(text, role='assistant')"));
assert(app.includes("function getConversationTurnText(element)"));
assert(app.includes("element.dataset.messageText"));
assert(!app.includes("text:el.innerText.replace("));
assert(app.includes("setConversationTurnText(user, 'user', question)"));
assert(app.includes("setConversationTurnText(assistant, 'assistant', assistantReply)"));
assert(app.includes("const cleanText=cleanStoredConversationText(turn.text, role)"));
assert(app.includes("function formatInlineReplyMarkdown(text)"));
assert(app.includes(".replace(/\\\\\\*/g, '*')"));
assert(app.includes("'<strong>$1</strong>'"));

// v19.12.3 har ny, ryddet bobleimplementasjon. Historikk-hotfixen skal fortsatt være intakt.
assert(app.includes("function speechBubblePath(width, bodyHeight)"));
assert(!app.includes("speech-tail-fixed"));

console.log('Historikk/samtale-hotfix OK');
