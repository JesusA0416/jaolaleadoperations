'use strict';
// Human-readable UI labels are translated; lead stage/source codes stay stable in stored data.
const JAOLA_EN = {
  "navDashboard": "Dashboard",
  "navLeads": "Leads",
  "navProperties": "Properties",
  "sidebarNote": "Sample prototype. This page runs in your browser; it does not connect to WhatsApp or send messages.",
  "eyebrow": "Operations dashboard · Real estate demo",
  "pageTitle": "Leads & follow-ups",
  "pageSubtitle": "Organize property inquiries and see which customers need a reply today. All customers in this demo are fictional.",
  "export": "↓ Export CSV",
  "newLead": "+ New lead",
  "banner": "<strong>How to use this demo:</strong> add a lead, change its stage, and set a follow-up date. The cards above update automatically. Information is stored only in this browser, with no server or shared account. <strong>Do not enter real personal information.</strong>",
  "totalLeads": "Total leads",
  "totalFoot": "Recorded inquiries",
  "activeLeads": "Active leads",
  "activeFoot": "Not closed or discarded",
  "lateLeads": "Overdue follow-ups",
  "lateFoot": "Need attention",
  "todayLeads": "Follow-ups today",
  "todayFoot": "Scheduled for today",
  "listHeading": "Lead registry",
  "serviceHeading": "What does JAOLA do for the agency?",
  "serviceSubtitle": "This is what you could sell as a service",
  "searchAria": "Search",
  "filterAria": "Filter by stage",
  "searchPlaceholder": "Search customer, property, agent...",
  "allStages": "All stages",
  "reset": "Reset demo",
  "resetTitle": "Restore fictional demo data",
  "thLead": "LEAD",
  "thProperty": "PROPERTY",
  "thSource": "SOURCE",
  "thStage": "STAGE",
  "thOwner": "ASSIGNED AGENT",
  "thFollowUp": "FOLLOW-UP",
  "tableFoot": "You can change a lead's stage directly. To change a date, name, or other details, select Edit.",
  "step1": "01 · SETUP",
  "step2": "02 · TRAINING",
  "step3": "03 · MAINTENANCE",
  "serviceTitle1": "Install & customize",
  "serviceTitle2": "Teach the workflow",
  "serviceTitle3": "Optional support",
  "serviceDesc1": "Configure stages, property references, assigned agents, and follow-up structure based on how the agency works.",
  "serviceDesc2": "Show the team how to record inquiries and keep next steps updated. Agents communicate with their own customers.",
  "serviceDesc3": "Resolve system problems and make agreed changes for a monthly fee. This does not include negotiating or selling property.",
  "smallprint": "JAOLA Lead Operations v0.1 · Browser-only prototype. No authentication, multiuser collaboration, client-data encryption, external reminders, official WhatsApp integration, or centralized backup. Not suitable for storing real customer data. Commercial use requires secure implementation and a review of privacy obligations.",
  "formNew": "New lead",
  "modalSubtitle": "Use fictional information in this demo.",
  "formName": "Name / label*",
  "formProperty": "Property*",
  "formSource": "Source",
  "formStage": "Stage",
  "formOwner": "Assigned agent",
  "formDue": "Next follow-up",
  "formNotes": "Notes",
  "namePlaceholder": "Client F",
  "ownerPlaceholder": "Agent 1",
  "notesPlaceholder": "Example: asked for information about the house",
  "cancel": "Cancel",
  "saveLead": "Save lead",
  "stage_Nuevo": "New",
  "stage_Contactado": "Contacted",
  "stage_Visita agendada": "Tour scheduled",
  "stage_Interesado": "Interested",
  "stage_Cerrado": "Closed",
  "stage_Descartado": "Discarded",
  "source_Sitio web": "Website",
  "source_Referido": "Referral",
  "source_Otro": "Other",
  "countOf": "of",
  "countRecords": "records",
  "dateNone": "No date",
  "followFinal": "Completed",
  "followLate": "Overdue",
  "followToday": "Today",
  "followFuture": "Upcoming",
  "noOwner": "Unassigned",
  "edit": "Edit",
  "editLead": "Edit lead",
  "empty": "No leads match your filters.",
  "confirmReset": "Reset all fictional demo data?",
  "csvHeaders": [
    "ID",
    "Customer",
    "Property",
    "Source",
    "Stage",
    "Assigned agent",
    "Follow-up",
    "Notes"
  ]
};
const JAOLA_ES = {
  "countOf": "de",
  "countRecords": "registros",
  "dateNone": "Sin fecha",
  "followFinal": "Finalizado",
  "followLate": "Vencido",
  "followToday": "Hoy",
  "followFuture": "Próximo",
  "noOwner": "Sin asignar",
  "edit": "Editar",
  "editLead": "Editar prospecto",
  "empty": "No hay prospectos que coincidan con los filtros.",
  "confirmReset": "¿Reiniciar todos los datos de esta demostración?",
  "csvHeaders": [
    "ID",
    "Cliente",
    "Inmueble",
    "Origen",
    "Etapa",
    "Responsable",
    "Seguimiento",
    "Notas"
  ]
};
const JAOLA_LANGUAGE_KEY = 'jaola_lead_operations_language';
let jaolaLanguage = 'es';
try { jaolaLanguage = localStorage.getItem(JAOLA_LANGUAGE_KEY) === 'en' ? 'en' : 'es'; } catch (_) {}
function t(key) { const dict = jaolaLanguage === 'en' ? JAOLA_EN : JAOLA_ES; return dict[key] ?? key; }
function stageLabel(value) { return jaolaLanguage === 'en' ? (JAOLA_EN['stage_' + value] ?? value) : value; }
function sourceLabel(value) { return jaolaLanguage === 'en' ? (JAOLA_EN['source_' + value] ?? value) : value; }
function setJaolaLanguage(language) {
  jaolaLanguage = language === 'en' ? 'en' : 'es';
  document.documentElement.lang = jaolaLanguage;
  document.title = jaolaLanguage === 'en' ? 'JAOLA Lead Operations | Public Demo' : 'JAOLA Lead Operations | Demostración pública';
  document.querySelectorAll('[data-i18n]').forEach(el => {
    if (el._jaolaOriginalText === undefined) el._jaolaOriginalText = el.textContent;
    el.textContent = jaolaLanguage === 'en' ? (JAOLA_EN[el.dataset.i18n] ?? el._jaolaOriginalText) : el._jaolaOriginalText;
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    if (el._jaolaOriginalHTML === undefined) el._jaolaOriginalHTML = el.innerHTML;
    el.innerHTML = jaolaLanguage === 'en' ? (JAOLA_EN[el.dataset.i18nHtml] ?? el._jaolaOriginalHTML) : el._jaolaOriginalHTML;
  });
  document.querySelectorAll('[data-i18n-label]').forEach(el => {
    const node = [...el.childNodes].find(n => n.nodeType === Node.TEXT_NODE);
    if (!node) return;
    if (el._jaolaOriginalLabel === undefined) el._jaolaOriginalLabel = node.textContent;
    node.textContent = jaolaLanguage === 'en' ? (JAOLA_EN[el.dataset.i18nLabel] ?? el._jaolaOriginalLabel) : el._jaolaOriginalLabel;
  });
  for (const [attribute, dataName] of [['placeholder','i18nPlaceholder'],['aria-label','i18nAria'],['title','i18nTitle']]) {
    document.querySelectorAll('[data-i18n-' + (attribute === 'aria-label' ? 'aria' : attribute) + ']').forEach(el => {
      const originalName = '_jaola_' + attribute;
      if (el[originalName] === undefined) el[originalName] = el.getAttribute(attribute);
      el.setAttribute(attribute, jaolaLanguage === 'en' ? (JAOLA_EN[el.dataset[dataName]] ?? el[originalName]) : el[originalName]);
    });
  }
  const selector = document.getElementById('languageSelect');
  if (selector) selector.value = jaolaLanguage;
  try { localStorage.setItem(JAOLA_LANGUAGE_KEY, jaolaLanguage); } catch (_) {}
  window.dispatchEvent(new Event('jaola:languagechange'));
}
document.getElementById('languageSelect')?.addEventListener('change', event => setJaolaLanguage(event.target.value));
setJaolaLanguage(jaolaLanguage);
