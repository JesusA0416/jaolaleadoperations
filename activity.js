'use strict';
/* Local-only fictional lead activity log. Do not store real client information. */
(() => {
  const STORE = 'jaola_lead_activity_demo_v1';
  const TYPES = ['note', 'message', 'call', 'viewing', 'followup'];
  const language = () => jaolaLanguage === 'en' ? 'en' : 'es';
  const words = {
    en: {
      title: 'Lead activity',sub: 'Activity history for this fictional lead.',close: 'Close',
      history: 'Timeline',addTitle: 'Log an interaction',kind: 'Interaction type',
      detail: 'What happened?*',hint: 'Add a fictional note about the conversation or next step.',
      save: 'Add activity',empty: 'No activities yet. Add an interaction to see the history.',
      delete: 'Delete',confirm: 'Delete this fictional activity?',warning: 'Public demo only. Entries stay in this browser and are not shared. Do not add real customer information.',
      types: {note: 'Note',message: 'Message',call: 'Call',viewing: 'Property viewing',followup: 'Follow-up'}
    },
    es: {
      title: 'Actividad del prospecto',sub: 'Historial de este prospecto ficticio.',close: 'Cerrar',
      history: 'Historial',addTitle: 'Registrar una interacción',kind: 'Tipo de interacción',
      detail: '¿Qué ocurrió?*',hint: 'Agrega una nota ficticia sobre la conversación o el siguiente paso.',
      save: 'Agregar actividad',empty: 'Todavía no hay actividades. Registra una interacción para ver el historial.',
      delete: 'Eliminar',confirm: '¿Eliminar esta actividad ficticia?',warning: 'Solo demostración pública. La información se guarda en este navegador y no se comparte. No ingreses información real de clientes.',
      types: {note: 'Nota',message: 'Mensaje',call: 'Llamada',viewing: 'Visita al inmueble',followup: 'Seguimiento'}
    }
  };
  const w = () => words[language()];
  const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, character => (
    {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]
  ));
  const starter = () => [
    {id:'A-001',leadId:'L-001',type:'message',text:'Cliente ficticio pidió fotografías del inmueble.',at:new Date().toISOString()},
    {id:'A-002',leadId:'L-002',type:'call',text:'Llamada de demostración para coordinar una visita.',at:new Date().toISOString()}
  ];
  let entries;
  try {
    const saved = localStorage.getItem(STORE);
    const parsed = saved === null ? null : JSON.parse(saved);
    entries = Array.isArray(parsed) ? parsed : starter();
  } catch (_) {
    entries = starter();
  }
  function save() {
    try { localStorage.setItem(STORE,JSON.stringify(entries)); } catch (_) { /* Demo can run in memory */ }
  }
  const dialog = document.createElement('dialog');
  dialog.id = 'leadActivityDialog';
  dialog.className = 'modal activity-dialog';
  document.body.append(dialog);
  let selectedLeadId = null;
  const findLead = id => leads.find(lead => lead.id === id);
  const formatted = iso => {
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) return '';
    return new Intl.DateTimeFormat(language() === 'en' ? 'en-US' : 'es-MX',{
      dateStyle:'medium',timeStyle:'short'
    }).format(parsed);
  };
  function drawDialog() {
    const lead = findLead(selectedLeadId);
    if (!lead) { if (dialog.open) dialog.close(); return; }
    const text = w();
    const list = entries.filter(entry => entry.leadId === lead.id).sort((a,b) =>
      String(b.at).localeCompare(String(a.at))
    );
    dialog.innerHTML = `
      <header class="activity-header">
        <div><div class="eyebrow">${escapeHTML(text.title)}</div>
          <h2>${escapeHTML(lead.name)} · ${escapeHTML(lead.property)}</h2>
          <p>${escapeHTML(text.sub)}</p></div>
        <button class="activity-dismiss" id="activityClose" type="button">${escapeHTML(text.close)}</button>
      </header>
      <div class="activity-content">
        <h3 class="activity-caption">${escapeHTML(text.history)} (${list.length})</h3>
        ${list.length ? '<ul class="activity-list">' + list.map(entry => `
          <li class="activity-entry">
            <div class="activity-entry-top">
              <span class="activity-entry-type">${escapeHTML(text.types[entry.type] || entry.type)}</span>
              <time class="activity-entry-date">${escapeHTML(formatted(entry.at))}</time>
            </div>
            <p class="activity-entry-note">${escapeHTML(entry.text)}</p>
            <div class="activity-entry-footer">
              <button class="activity-delete" type="button" data-remove-activity="${escapeHTML(entry.id)}">${escapeHTML(text.delete)}</button>
            </div>
          </li>`).join('')+'</ul>' : '<div class="activity-empty">'+escapeHTML(text.empty)+'</div>'}
        <form id="activityForm" class="activity-create">
          <h3>${escapeHTML(text.addTitle)}</h3>
          <label>${escapeHTML(text.kind)}
            <select id="activityType" required>
              ${TYPES.map(type=>'<option value="'+type+'">'+escapeHTML(text.types[type])+'</option>').join('')}
            </select>
          </label>
          <label>${escapeHTML(text.detail)}
            <textarea id="activityText" minlength="2" maxlength="500" placeholder="${escapeHTML(text.hint)}" required></textarea>
          </label>
          <div class="modalactions"><button class="btn primary" type="submit">${escapeHTML(text.save)}</button></div>
        </form>
        <p class="activity-warning">${escapeHTML(text.warning)}</p>
      </div>
    `;
    document.getElementById('activityClose').addEventListener('click',() => dialog.close());
    document.getElementById('activityForm').addEventListener('submit',event=>{
      event.preventDefault();
      const kind=document.getElementById('activityType').value;
      const detail=document.getElementById('activityText').value.trim();
      if (!TYPES.includes(kind) || detail.length < 2 || detail.length > 500) return;
      entries.push({
        id:'A-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8),
        leadId:selectedLeadId,type:kind,text:detail,at:new Date().toISOString()
      });
      save();
      drawDialog();
    });
  }
  document.getElementById('rows').addEventListener('click',event=>{
    const button=event.target.closest('[data-history]');
    if (!button) return;
    selectedLeadId=button.dataset.history;
    if (!findLead(selectedLeadId)) return;
    drawDialog();
    dialog.showModal();
  });
  dialog.addEventListener('click',event=>{
    const button=event.target.closest('[data-remove-activity]');
    if (!button) return;
    if (!confirm(w().confirm)) return;
    entries=entries.filter(entry=>!(entry.id===button.dataset.removeActivity && entry.leadId===selectedLeadId));
    save();
    drawDialog();
  });
  window.addEventListener('jaola:languagechange',()=>{
    if(dialog.open)drawDialog();
  });
  window.addEventListener('jaola:demoreset',()=>{
    entries=starter();
    save();
    if(dialog.open)dialog.close();
  });
})();
