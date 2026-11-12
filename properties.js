'use strict';
(function () {
  const STORE = 'jaola_properties_demo_v1';
  const STATUS = ['Disponible', 'Reservado', 'Vendido', 'Rentado'];
  const TYPES = ['Casa', 'Departamento', 'Terreno', 'Local comercial', 'Otro'];
  const TEXT = {
    es: {
      eyebrow:'JAOLA · Catálogo inmobiliario',title:'Inmuebles',subtitle:'Organiza propiedades ficticias y relaciónalas con los prospectos. No introduzcas datos personales reales.',
      add:'+ Nuevo inmueble',total:'Inmuebles registrados',available:'Disponibles',linked:'Consultas vinculadas',
      search:'Buscar nombre, ubicación, código...',all:'Todos los estados',empty:'No hay inmuebles que coincidan con los filtros.',
      price:'Precio de referencia',leads:'Consultas',edit:'Editar',delete:'Eliminar',view:'Ver prospectos',id:'Código',type:'Tipo',status:'Estado',location:'Ciudad / ubicación',
      note:'Los datos se guardan únicamente en este navegador. No hay almacenamiento compartido ni acceso seguro de agencia. Usa solo datos ficticios.',
      newTitle:'Nuevo inmueble',editTitle:'Editar inmueble',demoOnly:'Utiliza información ficticia para probar el producto.',name:'Nombre del inmueble*',
      loc:'Ciudad / ubicación*',priceField:'Precio*',currency:'Moneda',notes:'Descripción / notas',cancel:'Cancelar',save:'Guardar inmueble',
      namePH:'Casa Jardín',locationPH:'Zamora, Michoacán',notesPH:'Descripción de ejemplo (sin datos personales reales)',
      confirm:'¿Eliminar este inmueble ficticio?',blocked:'No se puede eliminar: existen prospectos asociados. Cambia primero su inmueble.',
      pick:'Selecciona un inmueble',unlisted:'No está en el catálogo',availableStatus:'Disponible',
      types:{'Casa':'Casa','Departamento':'Departamento','Terreno':'Terreno','Local comercial':'Local comercial','Otro':'Otro'},
      statuses:{'Disponible':'Disponible','Reservado':'Reservado','Vendido':'Vendido','Rentado':'Rentado'}
    },
    en: {
      eyebrow:'JAOLA · Real estate inventory',title:'Properties',subtitle:'Organize fictional properties and link them to leads. Do not enter real personal information.',
      add:'+ New property',total:'Total properties',available:'Available',linked:'Linked inquiries',
      search:'Search name, location, ID...',all:'All statuses',empty:'No properties match your filters.',
      price:'Asking price',leads:'Inquiries',edit:'Edit',delete:'Delete',view:'View leads',id:'ID',type:'Type',status:'Status',location:'City / location',
      note:'Data is saved only in this browser. There is no shared database or secure agency access. Use fictional data only.',
      newTitle:'New property',editTitle:'Edit property',demoOnly:'Use fictional information to test this product.',name:'Property name*',
      loc:'City / location*',priceField:'Asking price*',currency:'Currency',notes:'Description / notes',cancel:'Cancel',save:'Save property',
      namePH:'Garden House',locationPH:'Zamora, Michoacán',notesPH:'Example description (no real personal information)',
      confirm:'Delete this fictional property?',blocked:'Cannot delete: this property has linked leads. Reassign those leads first.',
      pick:'Select a property',unlisted:'Not in inventory',availableStatus:'Available',
      types:{'Casa':'House','Departamento':'Apartment','Terreno':'Land','Local comercial':'Commercial space','Otro':'Other'},
      statuses:{'Disponible':'Available','Reservado':'Reserved','Vendido':'Sold','Rentado':'Rented'}
    }
  };
  const $p = id => document.getElementById(id);
  const lang = () => typeof jaolaLanguage === 'string' && jaolaLanguage === 'en' ? 'en' : 'es';
  const d = () => TEXT[lang()];
  const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const sample = () => [
    {id:'P-101',title:'Casa Jardín',type:'Casa',location:'Zamora, Michoacán',price:2950000,currency:'MXN',status:'Disponible',notes:'Inmueble ficticio para demostración.'},
    {id:'P-102',title:'Departamento Centro',type:'Departamento',location:'Morelia, Michoacán',price:1450000,currency:'MXN',status:'Disponible',notes:'Propiedad de ejemplo.'},
    {id:'P-103',title:'Terreno del Sol',type:'Terreno',location:'Guadalajara, Jalisco',price:850000,currency:'MXN',status:'Reservado',notes:'Ficha de prueba.'}
  ];
  let properties;
  try { const raw = localStorage.getItem(STORE); const parsed = raw === null ? null : JSON.parse(raw); properties = Array.isArray(parsed) ? parsed : sample(); }
  catch (_) { properties = sample(); }
  const persist = () => { try { localStorage.setItem(STORE, JSON.stringify(properties)); } catch (_) { /* memory-only fallback */ } };
  const priceText = p => new Intl.NumberFormat(lang() === 'en' ? 'en-US' : 'es-MX', {style:'currency',currency:p.currency==='USD'?'USD':'MXN',maximumFractionDigits:0}).format(Number(p.price)||0);
  const assigned = id => leads.filter(lead => lead.property === id).length;
  const main = document.querySelector('.main');
  const mobileNav = main.querySelector('.mobile-tabs');
  const leadWorkspace = document.createElement('section');
  leadWorkspace.id = 'leadWorkspace';
  while (mobileNav.nextSibling) leadWorkspace.append(mobileNav.nextSibling);
  main.append(leadWorkspace);
  const page = document.createElement('section');
  page.id = 'propertiesPage';
  page.hidden = true;
  main.append(page);
  const dialog = document.createElement('dialog');
  dialog.id = 'propertyDialog';
  dialog.className = 'modal property-dialog';
  document.body.append(dialog);
  let currentPage = 'dashboard';
  function showPage(view) {
    currentPage = view;
    page.hidden = view !== 'properties';
    leadWorkspace.hidden = view === 'properties';
    document.querySelectorAll('[data-view]').forEach(button => {
      const active = button.dataset.view === view;
      button.classList.toggle('active', active);
      button.setAttribute('aria-current', active ? 'page' : 'false');
    });
    if (view === 'properties') drawGrid();
    else if (view === 'leads') document.querySelector('.panel')?.scrollIntoView({block:'start',behavior:'smooth'});
    else window.scrollTo({top:0,behavior:'smooth'});
  }
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => showPage(button.dataset.view)));
  function fillLeadPropertySelect() {
    const select = $p('property');
    if (!select) return;
    const chosen = select.value;
    const options = ['<option value="">'+escapeHtml(d().pick)+'</option>'];
    for (const p of properties) options.push('<option value="'+escapeHtml(p.id)+'">'+escapeHtml(p.id+' · '+p.title)+'</option>');
    const orphans = [...new Set(leads.map(item=>item.property).filter(Boolean))].filter(id=>!properties.some(p=>p.id===id));
    for (const id of orphans) options.push('<option value="'+escapeHtml(id)+'">'+escapeHtml(id+' · '+d().unlisted)+'</option>');
    select.innerHTML = options.join('');
    if ([...select.options].some(option => option.value === chosen)) select.value = chosen;
  }
  function drawShell() {
    const q = $p('propSearch')?.value || '';
    const status = $p('propFilter')?.value || '';
    const text=d();
    page.innerHTML = `
      <div class="property-head">
        <div><div class="eyebrow">${text.eyebrow}</div><h1>${text.title}</h1><p>${text.subtitle}</p></div>
        <div class="property-actions">
          <label class="small" for="propertiesLanguage">Idioma / Language</label>
          <select id="propertiesLanguage" aria-label="Idioma / Language"><option value="es">Español</option><option value="en">English</option></select>
          <button type="button" class="btn primary" id="propAdd">${text.add}</button>
        </div>
      </div>
      <div class="property-stats">
        <div class="property-stat"><span>${text.total}</span><strong id="propTotal">0</strong></div>
        <div class="property-stat"><span>${text.available}</span><strong id="propAvailable">0</strong></div>
        <div class="property-stat"><span>${text.linked}</span><strong id="propLinked">0</strong></div>
      </div>
      <div class="property-filters">
        <input id="propSearch" aria-label="${text.search}" placeholder="${text.search}" value="${escapeHtml(q)}" />
        <select id="propFilter" aria-label="${text.status}"><option value="">${text.all}</option>${STATUS.map(s=>'<option value="'+escapeHtml(s)+'"'+(s===status?' selected':'')+'>'+text.statuses[s]+'</option>').join('')}</select>
      </div>
      <div id="propertyResults" class="property-grid"></div>
      <p class="property-note">${text.note}</p>
    `;
    $p('propertiesLanguage').value = lang();
    $p('propertiesLanguage').addEventListener('change',event => setJaolaLanguage(event.target.value));
    $p('propAdd').addEventListener('click',()=>openPropertyForm(null));
    $p('propSearch').addEventListener('input',drawGrid);
    $p('propFilter').addEventListener('change',drawGrid);
    drawGrid();
  }
  function drawGrid() {
    if (!$p('propertyResults')) return;
    const text=d();
    const filter=$p('propSearch').value.toLowerCase().trim(), status=$p('propFilter').value;
    const matches=properties.filter(p=>(!status||p.status===status)&&(!filter||[p.id,p.title,p.type,p.location,p.notes].join(' ').toLowerCase().includes(filter)));
    $p('propTotal').textContent=properties.length;
    $p('propAvailable').textContent=properties.filter(p=>p.status==='Disponible').length;
    $p('propLinked').textContent=leads.filter(x=>properties.some(p=>p.id===x.property)).length;
    $p('propertyResults').innerHTML=matches.length?matches.map(p=>{
      const n=assigned(p.id);
      const pill=p.status==='Disponible'?'':' '+(p.status==='Reservado'?'reserved':'closed');
      return `<article class="property-card">
        <div class="property-cardhead"><div class="small">${escapeHtml(p.id)} · ${escapeHtml(text.types[p.type] || p.type)}</div><span class="property-pill${pill}">${escapeHtml(text.statuses[p.status] || p.status)}</span></div>
        <h3>${escapeHtml(p.title)}</h3><div class="muted">${escapeHtml(p.location)}</div>
        <div class="price">${escapeHtml(priceText(p))}</div>
        <div class="muted">${escapeHtml(p.notes||'')}</div>
        <div class="meta"><span>${escapeHtml(text.leads)}: <strong>${n}</strong></span><span>${escapeHtml(text.id)}: ${escapeHtml(p.id)}</span></div>
        <div class="tools"><button type="button" data-prop-leads="${escapeHtml(p.id)}">${text.view}</button><button type="button" data-prop-edit="${escapeHtml(p.id)}">${text.edit}</button><button type="button" class="danger-link" data-prop-delete="${escapeHtml(p.id)}">${text.delete}</button></div>
      </article>`;
    }).join(''):'<div class="property-empty">'+escapeHtml(text.empty)+'</div>';
  }
  function nextId(){
    let id=104;
    while(properties.some(p=>p.id==='P-'+id)||leads.some(x=>x.property==='P-'+id))id++;
    return 'P-'+id;
  }
  function openPropertyForm(id) {
    const p=properties.find(row=>row.id===id), text=d();
    dialog.innerHTML=`<div class="modalhead"><h2>${p?text.editTitle:text.newTitle}</h2><p>${text.demoOnly}</p></div>
      <form class="form" id="propertyForm"><input type="hidden" id="propertyEditId" value="${escapeHtml(p?.id||'')}" />
        <div class="formgrid"><label>${text.name}<input id="propertyName" maxlength="90" required placeholder="${text.namePH}" /></label>
        <label>${text.loc}<input id="propertyLocation" maxlength="100" required placeholder="${text.locationPH}" /></label></div>
        <div class="formgrid"><label>${text.type}<select id="propertyType">${TYPES.map(v=>'<option value="'+escapeHtml(v)+'">'+text.types[v]+'</option>').join('')}</select></label>
        <label>${text.status}<select id="propertyStatus">${STATUS.map(v=>'<option value="'+escapeHtml(v)+'">'+text.statuses[v]+'</option>').join('')}</select></label></div>
        <div class="formgrid"><label>${text.priceField}<input type="number" id="propertyPrice" min="0" max="999999999999" step="1" required /></label>
        <label>${text.currency}<select id="propertyCurrency"><option value="MXN">MXN</option><option value="USD">USD</option></select></label></div>
        <label>${text.notes}<textarea id="propertyNotes" maxlength="500" placeholder="${text.notesPH}"></textarea></label>
        <div class="modalactions"><button type="button" class="btn" id="propertyCancel">${text.cancel}</button><button type="submit" class="btn primary">${text.save}</button></div>
      </form>`;
    if(p) {
      $p('propertyName').value=p.title;
      $p('propertyLocation').value=p.location;
      $p('propertyType').value=p.type;
      $p('propertyStatus').value=p.status;
      $p('propertyPrice').value=p.price;
      $p('propertyCurrency').value=p.currency;
      $p('propertyNotes').value=p.notes;
    }
    $p('propertyCancel').addEventListener('click',()=>dialog.close());
    $p('propertyForm').addEventListener('submit',event=>{
      event.preventDefault();
      const price=Number($p('propertyPrice').value);
      if (!Number.isFinite(price)||price<0||price>999999999999) return;
      const record={
        id:p?.id||nextId(),
        title:$p('propertyName').value.trim(),
        type:$p('propertyType').value,
        location:$p('propertyLocation').value.trim(),
        status:$p('propertyStatus').value,
        price,
        currency:$p('propertyCurrency').value,
        notes:$p('propertyNotes').value.trim()
      };
      if(!record.title||!record.location||!STATUS.includes(record.status)||!TYPES.includes(record.type)||!['MXN','USD'].includes(record.currency))return;
      if(p){const ix=properties.findIndex(row=>row.id===p.id); if(ix>=0)properties[ix]=record;}
      else properties.push(record);
      persist();fillLeadPropertySelect();drawGrid();dialog.close();
    });
    dialog.showModal();
  }
  $p('propertiesPage').addEventListener('click',event=>{
    const edit=event.target.closest('[data-prop-edit]');
    const del=event.target.closest('[data-prop-delete]');
    const view=event.target.closest('[data-prop-leads]');
    if(edit)return openPropertyForm(edit.dataset.propEdit);
    if(del){
      const id=del.dataset.propDelete;
      if(assigned(id)){alert(d().blocked);return;}
      if(confirm(d().confirm)){properties=properties.filter(p=>p.id!==id);persist();fillLeadPropertySelect();drawGrid();}
      return;
    }
    if(view){
      const id=view.dataset.propLeads;
      $p('search').value=id;
      $p('stageFilter').value='';
      render();
      showPage('leads');
    }
  });
  window.addEventListener('jaola:languagechange',()=>{fillLeadPropertySelect();drawShell();});
  fillLeadPropertySelect();
  drawShell();
})();