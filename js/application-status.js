const defaultApps = [
  {id:101, title:'Software Engineer',     co:'Google',   icon:'🔍', status:'Interview', date:'10 Mar 2025', ctc:'₹28 LPA'},
  {id:102, title:'SDE – I',               co:'Amazon',   icon:'📦', status:'In Review',  date:'8 Mar 2025',  ctc:'₹24 LPA'},
  {id:103, title:'Frontend Developer',    co:'Flipkart', icon:'🛒', status:'Applied',    date:'5 Mar 2025',  ctc:'₹18 LPA'},
  {id:104, title:'Data Analyst',          co:'Deloitte', icon:'📊', status:'Offered',    date:'1 Mar 2025',  ctc:'₹12 LPA'},
  {id:105, title:'Consulting Analyst',    co:'PwC',      icon:'💼', status:'Rejected',   date:'28 Feb 2025', ctc:'₹14 LPA'},
  {id:106, title:'ML Engineer Intern',    co:'Zomato',   icon:'🍕', status:'Applied',    date:'2 Mar 2025',  ctc:'₹50k/mo'},
  {id:107, title:'Product Manager',       co:'Meesho',   icon:'🛍️', status:'Interview',  date:'15 Mar 2025', ctc:'₹22 LPA'},
];

const sBadge = {
  'Applied':    'b-applied',
  'In Review':  'b-review',
  'Interview':  'b-interview',
  'Offered':    'b-offered',
  'Rejected':   'b-rejected'
};

let statusTab = 'all';

// ══════════════════════════════════════════
// STORAGE HELPERS
// ══════════════════════════════════════════
function getApps() {
  const stored = JSON.parse(localStorage.getItem('campushire_apps') || '[]');
  return stored.length ? stored : [...defaultApps];
}

function saveApps(apps) {
  localStorage.setItem('campushire_apps', JSON.stringify(apps));
}

// ══════════════════════════════════════════
// FILTER TAB
// ══════════════════════════════════════════
function filterTab(tab, el) {
  statusTab = tab;
  document.querySelectorAll('.stab').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  renderStatusApps();
}


function renderStatusApps() {
  const apps = getApps();
  const q = (document.getElementById('appSearch')?.value || '').toLowerCase();

  // filter by tab
  let filtered = statusTab === 'all' ? apps : apps.filter(a => a.status === statusTab);
  // filter by search
  if (q) filtered = filtered.filter(a =>
    a.title.toLowerCase().includes(q) || a.co.toLowerCase().includes(q)
  );

  // update counters
  document.getElementById('st-total').textContent     = apps.length;
  document.getElementById('st-review').textContent    = apps.filter(a => a.status === 'In Review').length;
  document.getElementById('st-interview').textContent = apps.filter(a => a.status === 'Interview').length;
  document.getElementById('st-offer').textContent     = apps.filter(a => a.status === 'Offered').length;
  document.getElementById('st-rejected').textContent  = apps.filter(a => a.status === 'Rejected').length;
  document.getElementById('pc-applied').textContent   = apps.filter(a => a.status === 'Applied').length;
  document.getElementById('pc-review').textContent    = apps.filter(a => a.status === 'In Review').length;
  document.getElementById('pc-interview').textContent = apps.filter(a => a.status === 'Interview').length;
  document.getElementById('pc-offer').textContent     = apps.filter(a => a.status === 'Offered').length;
  document.getElementById('pc-rejected').textContent  = apps.filter(a => a.status === 'Rejected').length;

  const el = document.getElementById('statusAppsList');

  if (!filtered.length) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📭</div>
        <div class="empty-title">No applications found</div>
        <p class="empty-sub">${q ? 'Try a different search term.' : 'Click "+ Add Application" to start tracking your job hunt.'}</p>
        <button class="btn btn-primary btn-lg" onclick="openAddModal()">+ Add Application</button>
      </div>`;
    return;
  }

  el.innerHTML = filtered.map((a, i) => `
    <div class="app-row" style="animation-delay:${i * 0.055}s">
      <div class="app-logo-big">${a.icon || '💼'}</div>
      <div class="app-body">
        <div class="app-title-main">${a.title}</div>
        <div class="app-co-main">${a.co}${a.ctc ? ' · ' + a.ctc : ''}</div>
        <div class="app-tags">
          <span class="badge ${sBadge[a.status] || 'b-applied'}">${a.status}</span>
          <span class="tl-pill">Applied ${a.date || 'Recently'}</span>
        </div>
      </div>
      <div class="app-actions">
        <select class="form-input" style="padding:0.35rem 0.52rem;font-size:0.78rem;width:auto;min-width:130px"
          onchange="updateAppStatus(${a.id}, this.value)">
          <option ${a.status==='Applied'   ?'selected':''}>Applied</option>
          <option ${a.status==='In Review' ?'selected':''}>In Review</option>
          <option ${a.status==='Interview' ?'selected':''}>Interview</option>
          <option ${a.status==='Offered'   ?'selected':''}>Offered</option>
          <option ${a.status==='Rejected'  ?'selected':''}>Rejected</option>
        </select>
        <button class="btn btn-sm"
          style="color:var(--coral);border:1.5px solid var(--coral);background:transparent"
          onclick="removeAppEntry(${a.id})">🗑 Remove</button>
      </div>
    </div>`).join('');
}


function updateAppStatus(id, status) {
  const apps = getApps();
  const idx = apps.findIndex(a => a.id === id);
  if (idx > -1) {
    apps[idx].status = status;
    saveApps(apps);
  }
  renderStatusApps();
  showToast(`✅ Status updated → ${status}`);
}

function removeAppEntry(id) {
  let apps = getApps();
  // If still using defaults, persist them first minus the removed one
  apps = apps.filter(a => a.id !== id);
  saveApps(apps);
  renderStatusApps();
  showToast('🗑️ Application removed');
}


function openAddModal() {
  document.getElementById('modalOverlay').classList.remove('hidden');
  document.getElementById('addTitle').value = '';
  document.getElementById('addCo').value = '';
  document.getElementById('addCtc').value = '';
  document.getElementById('addIcon').value = '';
  document.getElementById('addStatus').value = 'Applied';
  document.getElementById('addErr').style.display = 'none';
}

function closeAddModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
}

function addApplication() {
  const title  = document.getElementById('addTitle').value.trim();
  const co     = document.getElementById('addCo').value.trim();
  const ctc    = document.getElementById('addCtc').value.trim();
  const status = document.getElementById('addStatus').value;
  const icon   = document.getElementById('addIcon').value.trim() || '💼';
  const err    = document.getElementById('addErr');
  err.style.display = 'none';

  if (!title || !co) {
    err.textContent = '⚠️ Please fill in Job Title and Company.';
    err.style.display = 'block';
    return;
  }

  const apps = getApps();
  const newId = Date.now();
  const today = new Date().toLocaleDateString('en-IN', {day:'2-digit', month:'short', year:'numeric'});

  apps.unshift({ id: newId, title, co, icon, status, date: today, ctc });
  saveApps(apps);
  closeAddModal();
  renderStatusApps();
  showToast(`✅ "${title}" at ${co} added!`);
}


function showToast(msg) {
  const box = document.getElementById('toastBox');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

document.addEventListener('DOMContentLoaded', () => renderStatusApps());

let applications = JSON.parse(localStorage.getItem("applications")) || [];

let list = document.getElementById("statusAppsList");

function renderStatusApps(){

if(!list) return;

list.innerHTML="";

applications.forEach((app,index)=>{

let card = document.createElement("div");

card.style.background="white";
card.style.padding="15px";
card.style.marginBottom="10px";
card.style.borderRadius="10px";

card.innerHTML = `
<h3>${app.title}</h3>
<p><b>Company:</b> ${app.company}</p>
<p><b>CTC:</b> ${app.ctc}</p>
<p><b>Status:</b> ${app.status}</p>
`;

list.appendChild(card);

});

updateStats();

}

function addApplication(){

let title=document.getElementById("addTitle").value;
let company=document.getElementById("addCo").value;
let ctc=document.getElementById("addCtc").value;
let status=document.getElementById("addStatus").value;

if(title=="" || company==""){
alert("Please fill required fields");
return;
}

let newApp={
title:title,
company:company,
ctc:ctc,
status:status
};

applications.push(newApp);

localStorage.setItem("applications",JSON.stringify(applications));

closeAddModal();

renderStatusApps();

}

function updateStats(){

let applied=0;
let review=0;
let interview=0;
let offer=0;
let rejected=0;

applications.forEach(app=>{

if(app.status==="Applied") applied++;
if(app.status==="In Review") review++;
if(app.status==="Interview") interview++;
if(app.status==="Offered") offer++;
if(app.status==="Rejected") rejected++;

});

document.getElementById("pc-applied").textContent=applied;
document.getElementById("pc-review").textContent=review;
document.getElementById("pc-interview").textContent=interview;
document.getElementById("pc-offer").textContent=offer;
document.getElementById("pc-rejected").textContent=rejected;

document.getElementById("st-total").textContent=applications.length;
document.getElementById("st-review").textContent=review;
document.getElementById("st-interview").textContent=interview;
document.getElementById("st-offer").textContent=offer;
document.getElementById("st-rejected").textContent=rejected;

}

function openAddModal(){
document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeAddModal(){
document.getElementById("modalOverlay").classList.add("hidden");
}

renderStatusApps();