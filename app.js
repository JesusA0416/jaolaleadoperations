'use strict';
const KEY='jaola_lead_operations_demo_v1';
const STAGES=['Nuevo','Contactado','Visita agendada','Interesado','Cerrado','Descartado'];
const $=id=>document.getElementById(id);
const dateLocal=(offset=0)=>{const d=new Date();d.setHours(12,0,0,0);d.setDate(d.getDate()+offset);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;};
const DEMO=()=>[
{id:'L-001',name:'Cliente A',property:'P-101',source:'WhatsApp',stage:'Nuevo',owner:'Agente 1',due:dateLocal(-1),notes:'Solicita precio y fotos.'},
{id:'L-002',name:'Cliente B',property:'P-102',source:'Sitio web',stage:'Contactado',owner:'Agente 2',due:dateLocal(0),notes:'Pregunta por visita.'},
{id:'L-003',name:'Cliente C',property:'P-101',source:'Instagram',stage:'Nuevo',owner:'Agente 1',due:dateLocal(2),notes:'Busca 3 recámaras.'},
{id:'L-004',name:'Cliente D',property:'P-103',source:'WhatsApp',stage:'Visita agendada',owner:'Agente 2',due:dateLocal(3),notes:'Visita pendiente.'},
{id:'L-005',name:'Cliente E',property:'P-102',source:'Referido',stage:'Cerrado',owner:'Agente 1',due:'',notes:'Caso finalizado.'}
];
let leads;
try{let raw=JSON.parse(localStorage.getItem(KEY));leads=Array.isArray(raw)?raw:DEMO();}catch(e){leads=DEMO();}
const safe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{localStorage.setItem(KEY,JSON.stringify(leads));}catch(e){/* Demo can run in memory only */}}
function isFinal(x){return ['Cerrado','Descartado'].includes(x.stage)}
function dueState(x){if(isFinal(x))return ['Finalizado','done'];if(!x.due)return ['Sin fecha','done'];const today=dateLocal();if(x.due<today)return ['Vencido','overdue'];if(x.due===today)return ['Hoy','today'];return ['Próximo','future']}
function fmtDate(s){if(!s)return t('dateNone');const p=s.split('-');return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:s}
function render(){
  $('statTotal').textContent=leads.length;
  $('statActive').textContent=leads.filter(x=>!isFinal(x)).length;
  $('statLate').textContent=leads.filter(x=>dueState(x)[0]==='Vencido').length;
  $('statToday').textContent=leads.filter(x=>dueState(x)[0]==='Hoy').length;
  let search=$('search').value.trim().toLowerCase(),status=$('stageFilter').value;
  let view=leads.filter(x=>(!status||x.stage===status)&&(!search||[x.id,x.name,x.property,x.owner,x.source,x.notes].join(' ').toLowerCase().includes(search)));
  view.sort((a,b)=>{const order=x=>dueState(x)[0]==='Vencido'?0:dueState(x)[0]==='Hoy'?1:dueState(x)[0]==='Próximo'?2:3;return order(a)-order(b)||String(a.id).localeCompare(String(b.id))});
  $('countLabel').textContent=`${view.length} ${t('countOf')} ${leads.length} ${t('countRecords')}`;
  $('rows').innerHTML=view.length?view.map(x=>{const [state,cls]=dueState(x);return `<tr><td><strong>${safe(x.name)}</strong><div class="sm">${safe(x.id)}</div></td><td><strong>${safe(x.property)}</strong></td><td>${safe(sourceLabel(x.source))}</td><td><select aria-label="${safe(jaolaLanguage==='en'?'Stage of ':'Etapa de ')}${safe(x.id)}" data-stage="${safe(x.id)}">${STAGES.map(s=>`<option value="${safe(s)}" ${s===x.stage?'selected':''}>${safe(stageLabel(s))}</option>`).join('')}</select></td><td>${safe(x.owner||t('noOwner'))}</td><td><span class="tag ${cls}">${safe(t(state==='Vencido'?'followLate':state==='Hoy'?'followToday':state==='Próximo'?'followFuture': 'followFinal'))}</span><div class="sm">${fmtDate(x.due)}</div></td><td><div class="lead-row-actions"><button class="actionLink" data-edit="${safe(x.id)}">${safe(t('edit'))}</button><button class="actionLink" data-history="${safe(x.id)}">${safe(t('history'))}</button></div></td></tr>`}).join(''):`<tr><td colspan="7" class="empty">${safe(t('empty'))}</td></tr>`;
}
function openForm(id){let x=leads.find(t=>t.id===id);$('leadForm').reset();$('editId').value=x?x.id:'';$('formTitle').textContent=x?t('editLead'):t('formNew');for(const k of ['name','property','source','stage','owner','due','notes'])if(x)$(k).value=x[k]||'';$('dialog').showModal();}
$('new').addEventListener('click',()=>openForm(null));$('cancel').addEventListener('click',()=>$('dialog').close());
$('leadForm').addEventListener('submit',e=>{e.preventDefault();const id=$('editId').value;const newRecord={id:id||(function(){let n=1;while(leads.some(x=>x.id===`L-${String(n).padStart(3,'0')}`))n++;return `L-${String(n).padStart(3,'0')}`})()};for(let k of ['name','property','source','stage','owner','due','notes'])newRecord[k]=$(k).value.trim();if(id){let ix=leads.findIndex(x=>x.id===id);if(ix>=0)leads[ix]=newRecord}else leads.push(newRecord);save();render();$('dialog').close();});
$('rows').addEventListener('click',e=>{const b=e.target.closest('[data-edit]');if(b)openForm(b.dataset.edit)});
$('rows').addEventListener('change',e=>{if(!e.target.matches('[data-stage]'))return;let x=leads.find(x=>x.id===e.target.dataset.stage);if(x&&STAGES.includes(e.target.value)){x.stage=e.target.value;save();render()}});
$('search').addEventListener('input',render);$('stageFilter').addEventListener('change',render);
$('reset').addEventListener('click',()=>{if(confirm(t('confirmReset'))){leads=DEMO();save();render();window.dispatchEvent(new Event('jaola:demoreset'))}});
$('export').addEventListener('click',()=>{const headers=t('csvHeaders');const rows=leads.map(x=>[x.id,x.name,x.property,sourceLabel(x.source),stageLabel(x.stage),x.owner,x.due,x.notes]);const cell=x=>{let s=String(x??'');if(/^[\s]*[=+\-@]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'};const csv='\ufeff'+[headers,...rows].map(row=>row.map(cell).join(',')).join('\r\n');const a=document.createElement('a');const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));a.href=url;a.download=jaolaLanguage==='en'?'JAOLA_demo_leads.csv':'JAOLA_demo_prospectos.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
window.addEventListener('jaola:languagechange',render);
render();
