// Samtalestøtte – administrasjonsdata: brukere, tilbakemeldinger, modeller og KI-forbruk.
// Faktiske DOM- og API-funksjoner; avhengigheter injiseres fra app.js.
// Rolleregler her er kun brukergrensesnitt. Express-serveren håndhever tilgang.
(function registerAdminData(root) {
  "use strict";

  function create({ document, fetch, escapeHtml, getCurrentUser }) {
    if (!document || typeof fetch !== "function" || typeof escapeHtml !== "function" || typeof getCurrentUser !== "function") {
      throw new TypeError("AdminData mangler nødvendige avhengigheter.");
    }

  async function loadAdminUsers(){
    const card=document.querySelector('#admin-users-card'),list=document.querySelector('#admin-users-list');
    if(!card||!list)return;
    const isAdmin=getCurrentUser()?.role==='admin';
    card.hidden=!isAdmin;
    if(!isAdmin)return;
    list.innerHTML='<div class="history-empty">Henter brukere …</div>';
    try{
      const response=await fetch('/api/admin/users',{credentials:'include',cache:'no-store'});
      const payload=await response.json();
      if(!response.ok)throw new Error(payload.message||'Kunne ikke hente brukere.');
      list.innerHTML=(payload.users||[]).map(user=>`<div class="admin-user-row" data-admin-user="${escapeHtml(user.id)}"><div class="admin-user-copy"><strong>${escapeHtml(user.username||'Bruker')}</strong><small>${escapeHtml(user.email||'')}</small></div><select data-admin-role ${user.id===getCurrentUser().id?'disabled':''}><option value="user" ${user.role==='user'?'selected':''}>Bruker</option><option value="editor" ${user.role==='editor'?'selected':''}>Redaktør</option><option value="admin" ${user.role==='admin'?'selected':''}>Admin</option></select><button class="secondary-button" type="button" data-save-admin-role ${user.id===getCurrentUser().id?'disabled':''}>Lagre rolle</button></div>`).join('')||'<div class="history-empty">Ingen brukere funnet.</div>';
      list.querySelectorAll('[data-save-admin-role]').forEach(button=>button.addEventListener('click',async()=>{
        const row=button.closest('[data-admin-user]'),role=row.querySelector('[data-admin-role]').value;
        button.disabled=true;
        try{
          const r=await fetch(`/api/admin/users/${encodeURIComponent(row.dataset.adminUser)}/role`,{method:'PATCH',credentials:'include',headers:{'Content-Type':'application/json'},body:JSON.stringify({role})});
          const p=await r.json();
          if(!r.ok)throw new Error(p.message||'Kunne ikke endre rollen.');
          const msg=document.querySelector('#admin-users-message');
          if(msg){
            msg.className='auth-message success';
            msg.textContent=`Rollen er endret til ${role}.`;
          }
        }
        catch(error){
          const msg=document.querySelector('#admin-users-message');
          if(msg){
            msg.className='auth-message error';
            msg.textContent=error.message;
          }
        }
        finally{
          button.disabled=false;
        }
      }));
    }
    catch(error){
      list.innerHTML=`<div class="history-empty">${escapeHtml(error.message)}</div>`;
    }
  }
  async function loadAdminFeedback(){
    const card=document.querySelector('#admin-feedback-card'),list=document.querySelector('#admin-feedback-list');
    if(!card||!list)return;
    const isAdmin=getCurrentUser()?.role==='admin';
    card.hidden=!isAdmin;
    if(!isAdmin)return;
    list.innerHTML='<div class="history-empty">Henter rapporterte svar …</div>';
    try{
      const r=await fetch('/api/admin/ai-feedback',{credentials:'include',cache:'no-store'});
      const p=await r.json();
      if(!r.ok)throw new Error(p.message||'Kunne ikke hente rapporterte svar.');
      list.innerHTML=(p.items||[]).map(item=>`<article class="admin-feedback-item"><div><strong>${escapeHtml(item.category||'Tilbakemelding')}</strong><small>${new Date(item.created_at).toLocaleString('nb-NO')} · ${escapeHtml(item.surface||'')}</small></div><p>${escapeHtml(item.comment||'')}</p>${item.include_conversation?`<details><summary>Vedlagt samtale</summary><pre class="admin-feedback-snapshot">${escapeHtml(JSON.stringify(item.conversation_snapshot||{},null,2))}</pre></details>`:'<small>Ingen samtale vedlagt.</small>'}</article>`).join('')||'<div class="history-empty">Ingen rapporterte KI-svar ennå.</div>';
    }
    catch(error){
      list.innerHTML=`<div class="history-empty">${escapeHtml(error.message)}</div>`;
    }
  }
  async function loadAdminAiSettings(){const card=document.querySelector('#admin-ai-card');if(!card)return;const isAdmin=getCurrentUser()?.role==='admin';card.hidden=!isAdmin;if(!isAdmin)return;try{const r=await fetch('/api/admin/ai-settings',{credentials:'include',cache:'no-store'});const p=await r.json();if(!r.ok)throw new Error(p.message||'Kunne ikke hente modellvalg.');const select=document.querySelector('#admin-ai-model');select.innerHTML=(p.models||[]).map(m=>`<option value="${escapeHtml(m.id)}" ${m.id===p.activeModel?'selected':''}>${escapeHtml(m.label)} · ${escapeHtml(m.tier)} · $${m.inputPerMillion}/$${m.outputPerMillion} per 1M tokens</option>`).join('');}catch(error){const msg=document.querySelector('#admin-ai-model-message');msg.className='auth-message error';msg.textContent=error.message;}}
  function formatUsd(value){return `$${Number(value||0).toFixed(3)}`;}
  async function loadAdminAiUsage(){
    if(getCurrentUser()?.role!=='admin')return;
    try{
      const includeTests=Boolean(document.querySelector('#admin-usage-include-tests')?.checked);
      const r=await fetch(`/api/admin/ai-usage?includeTests=${includeTests?'1':'0'}`,{credentials:'include',cache:'no-store'});
      const p=await r.json();
      if(!r.ok)throw new Error(p.message||'Kunne ikke hente KI-bruk.');
      document.querySelector('#admin-cost-24h').textContent=formatUsd(p.summary?.cost24h);
      document.querySelector('#admin-cost-7d').textContent=formatUsd(p.summary?.cost7d);
      document.querySelector('#admin-cost-30d').textContent=formatUsd(p.summary?.cost30d);
      document.querySelector('#admin-calls-30d').textContent=String(p.summary?.calls30d||0);
      const domains=document.querySelector('#admin-source-domains');
      domains.innerHTML=(p.topDomains||[]).map(x=>`<div><span>${escapeHtml(x.name)}</span><strong>${x.count}</strong></div>`).join('')||'<small>Ingen webkilder registrert ennå.</small>';
      const queries=document.querySelector('#admin-source-queries');
      queries.innerHTML=(p.topQueries||[]).map(x=>`<div><span>${escapeHtml(x.name)}</span><strong>${x.count}</strong></div>`).join('')||'<small>Ingen søk registrert ennå.</small>';
      const pages=document.querySelector('#admin-source-pages');
      if(pages)pages.innerHTML=(p.topPages||[]).map(x=>`<div><span><a href="${escapeHtml(x.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(x.title||x.url)}</a><small>${escapeHtml(x.domain||'')}</small></span><strong>${x.count}</strong></div>`).join('')||'<small>Ingen konkrete kildesider registrert ennå.</small>';
      const recent=document.querySelector('#admin-ai-recent');
      recent.innerHTML=(p.recent||[]).slice(0,40).map(x=>`<div class="admin-usage-row"><div><strong>${escapeHtml(x.function_name||'KI-kall')}</strong><small>${new Date(x.created_at).toLocaleString('nb-NO')} · ${escapeHtml(x.model||'')}${x.is_test?' · TEST':''}${x.subtopic?` · ${escapeHtml(x.subtopic)}`:''}</small>${(x.web_search_queries||[]).length?`<small>Søk: ${escapeHtml((x.web_search_queries||[]).join(' | '))}</small>`:''}</div><div><span>${Number(x.total_tokens||0).toLocaleString('nb-NO')} tokens</span><strong>${formatUsd(x.estimated_cost_usd)}</strong>${x.web_search_used?`<small>${Number(x.web_search_call_count||1)} websøk</small>`:''}</div></div>`).join('')||'<small>Ingen KI-kall registrert ennå.</small>';
    }
    catch(error){
      const domains=document.querySelector('#admin-source-domains');
      if(domains)domains.innerHTML=`<small>${escapeHtml(error.message)}</small>`;
    }
  }

    return { loadAdminUsers, loadAdminFeedback, loadAdminAiSettings, loadAdminAiUsage, formatUsd };
  }

  root.SamtalestotteAdminData = Object.freeze({ create });
})(typeof window === "undefined" ? globalThis : window);
