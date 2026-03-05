
const skillColors = [
    'linear-gradient(90deg,#2563eb,#0d9488)',
    'linear-gradient(90deg,#7c3aed,#a78bfa)',
    'linear-gradient(90deg,#0d9488,#34d399)',
    'linear-gradient(90deg,#f59e0b,#fbbf24)',
    'linear-gradient(90deg,#f43f5e,#fb7185)',
    'linear-gradient(90deg,#10b981,#34d399)',
    'linear-gradient(90deg,#2563eb,#60a5fa)',
    'linear-gradient(90deg,#7c3aed,#c084fc)',
];

const DEFAULT = {
    firstName: '', lastName: '', phone: '', city: '',
    college: '', branch: '', year: '', tenth: '', twelfth: '',
    cgpa: '', backlog: 'None', linkedin: '', skills: '',
    apps: '0', interviews: '0', offers: '0', latestApp: '', about: ''
};


function loadData() {
    try { return JSON.parse(localStorage.getItem('campushire_student')) || { ...DEFAULT }; }
    catch { return { ...DEFAULT }; }
}

function saveData(d) {
    localStorage.setItem('campushire_student', JSON.stringify(d));
}

function toast(msg, color = 'var(--green)') {
    const t = document.getElementById('toastEl');
    t.textContent = msg;
    t.style.borderLeftColor = color;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
}

function initials(first, last) {
    return ((first || '?')[0] + (last || '')[0]).toUpperCase() || '?';
}

function calcCompletion(d) {
    const fields = ['firstName', 'lastName', 'college', 'branch', 'year', 'cgpa', 'tenth', 'twelfth', 'skills', 'apps'];
    const filled = fields.filter(f => d[f] && String(d[f]).trim() !== '' && String(d[f]) !== '0').length;
    return Math.round((filled / fields.length) * 100);
}

function initNavbar() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            const label = this.textContent.trim();
            toast(`Navigating to ${label}...`, 'var(--blue)');
        });
    });

    updateNavbarUser();
}

function updateNavbarUser() {
    const d = loadData();
    const ini = initials(d.firstName, d.lastName);
    const fullName = [d.firstName, d.lastName].filter(Boolean).join(' ') || 'Student';
    
    document.getElementById('navAvatar').textContent = ini;
    document.getElementById('navName').textContent = fullName;
}

// ── RENDER DASHBOARD ──
function renderDashboard() {
    const d = loadData();
    const fullName = [d.firstName, d.lastName].filter(Boolean).join(' ') || 'Your Name';
    const ini = initials(d.firstName, d.lastName);
    const apps = parseInt(d.apps) || 0;
    const interviews = parseInt(d.interviews) || 0;
    const offers = parseInt(d.offers) || 0;
    const cgpa = parseFloat(d.cgpa) || 0;
    const pct = calcCompletion(d);

    // Greeting
    const hr = new Date().getHours();
    const greet = hr < 12 ? 'Good morning' : hr < 17 ? 'Good afternoon' : 'Good evening';
    document.getElementById('greetingName').textContent = `${greet}, ${d.firstName || 'Student'} 👋`;
    document.getElementById('greetingSub').textContent =
        d.college ? `${d.college} · ${d.branch || ''} ${d.year ? '· ' + d.year : ''}`.trim()
            : 'Edit your profile to personalise your dashboard.';

    // Stat cards
    document.getElementById('statApps').textContent = apps;
    document.getElementById('statAppsub').textContent = apps > 0 ? `${apps} companies applied` : 'Add applications';
    document.getElementById('statInterviews').textContent = interviews;
    document.getElementById('statInterviewsub').textContent = interviews > 0 ? 'Scheduled' : 'None yet';
    document.getElementById('statCgpa').textContent = cgpa > 0 ? cgpa.toFixed(1) : '—';
    document.getElementById('statCgpasub').textContent = cgpa > 0 ? (cgpa >= 8 ? 'Excellent 🌟' : cgpa >= 7 ? 'Good 👍' : 'Keep it up') : 'Enter CGPA';
    document.getElementById('statOffers').textContent = offers;
    document.getElementById('statOffersub').textContent = offers > 0 ? `${offers} offer${offers > 1 ? 's' : ''} received 🎉` : 'Keep applying!';

    // Profile card
    document.getElementById('profileAvatar').textContent = ini;
    document.getElementById('profileName').textContent = fullName;
    document.getElementById('profileSub').textContent =
        [d.college, d.branch, d.year].filter(Boolean).join(' · ') || 'Fill in your profile details';

    // Skills tags
    const skillsArr = d.skills ? d.skills.split(',').map(s => s.trim()).filter(Boolean) : [];
    document.getElementById('profileSkills').innerHTML = skillsArr.length
        ? skillsArr.slice(0, 8).map(s => `<span class="ptag">${s}</span>`).join('')
        : `<span class="ptag" style="opacity:0.4">Add Skills</span>`;

    // Profile stats
    document.getElementById('pStatApps').textContent = apps;
    document.getElementById('pStatIntvw').textContent = interviews;
    document.getElementById('pStatOffers').textContent = offers;

    // Completion bar
    document.getElementById('pcPct').textContent = pct + '%';
    setTimeout(() => { document.getElementById('pcFill').style.width = pct + '%'; }, 300);

    // Skills bars
    const skillsList = document.getElementById('skillsList');
    if (skillsArr.length) {
        skillsList.innerHTML = skillsArr.slice(0, 6).map((s, i) => {
            const pct = Math.floor(50 + Math.random() * 45);
            return `<div class="skill-row">
        <div class="skill-head"><span>${s}</span><span>${pct}%</span></div>
        <div class="skill-bar"><div class="skill-fill" style="width:0%;background:${skillColors[i % skillColors.length]}" data-w="${pct}%"></div></div>
      </div>`;
        }).join('');
        setTimeout(() => {
            document.querySelectorAll('.skill-fill[data-w]').forEach(el => {
                el.style.width = el.dataset.w;
            });
        }, 400);
    } else {
        skillsList.innerHTML = '<div style="text-align:center;padding:2rem 1rem;color:var(--muted2);font-size:0.83rem">Add your skills in Edit Profile to see them here.</div>';
    }

    // Academic ring
    const ringPct = cgpa > 0 ? cgpa / 10 : 0;
    const circumference = 219.91;
    document.getElementById('cgpaRing').style.transition = 'stroke-dashoffset 1s ease';
    document.getElementById('cgpaRing').style.strokeDashoffset = circumference - (circumference * ringPct);
    document.getElementById('ringVal').textContent = cgpa > 0 ? cgpa.toFixed(1) : '—';

    // Academic rows
    document.getElementById('ac10th').textContent = d.tenth ? d.tenth + '%' : '—';
    document.getElementById('ac12th').textContent = d.twelfth ? d.twelfth + '%' : '—';
    document.getElementById('acCgpa').textContent = cgpa > 0 ? cgpa.toFixed(2) : '—';
    document.getElementById('acBacklog').textContent = d.backlog || 'None';
    document.getElementById('acBranch').textContent = d.branch || '—';

    // Applications list
    const appsList = document.getElementById('appsList');
    if (d.latestApp) {
        const parts = d.latestApp.split('·').map(s => s.trim());
        const titleCo = (parts[0] || '').split('@').map(s => s.trim());
        const status = parts[1] || 'Applied';
        const badgeClass = {
            'offered': 'b-offered', 'interview': 'b-interview', 'interviews': 'b-interview',
            'review': 'b-review', 'under review': 'b-review', 'rejected': 'b-rejected'
        }[status.toLowerCase()] || 'b-applied';
        appsList.innerHTML = `
      <div class="app-item">
        <div class="app-logo">💼</div>
        <div class="app-info">
          <div class="app-title">${titleCo[0] || 'Position'}</div>
          <div class="app-co">${titleCo[1] || 'Company'}</div>
          <div class="app-dt">Recently applied</div>
        </div>
        <span class="badge ${badgeClass}">${status}</span>
      </div>`;
        if (apps > 1) {
            appsList.innerHTML += `<div style="text-align:center;padding:0.8rem;font-size:0.78rem;color:var(--muted)">+ ${apps - 1} more application${apps - 1 > 1 ? 's' : ''}</div>`;
        }
    } else if (apps === 0) {
        appsList.innerHTML = `<div style="text-align:center;padding:2.5rem 1rem;color:var(--muted2)">
      <div style="font-size:2rem;margin-bottom:0.5rem">📭</div>
      <div style="font-size:0.84rem">No applications yet.<br>Click <strong>Edit My Profile</strong> to add.</div>
    </div>`;
    } else {
        appsList.innerHTML = `<div style="text-align:center;padding:1.5rem;color:var(--muted2);font-size:0.84rem">
      You have ${apps} application${apps > 1 ? 's' : ''} recorded.<br><span style="font-size:0.78rem">Add details in Edit Profile.</span>
    </div>`;
    }

    // Placement tracker
    const hasProfile = d.firstName && d.college;
    const hasApps = apps > 0;
    const hasInterview = interviews > 0;
    const hasOffer = offers > 0;

    setTracker('tj1', hasProfile, 'Profile Complete', hasProfile ? `${fullName} · ${d.branch || ''}` : 'Fill your profile info');
    setTracker('tj2', false, 'Resume Uploaded', 'Upload in Resume Vault', hasProfile ? 'active' : 'pending');
    setTracker('tj3', hasApps, 'First Application', hasApps ? `${apps} applied so far` : 'Apply to your first company');
    setTracker('tj4', hasInterview, 'Interview Stage', hasInterview ? `${interviews} interview${interviews > 1 ? 's' : ''} scheduled` : 'Get shortlisted');
    setTracker('tj5', hasOffer, 'Offer Received', hasOffer ? `${offers} offer${offers > 1 ? 's' : ''} received 🎉` : 'Your dream job awaits!');

    // Last saved
    const ls = localStorage.getItem('campushire_saved_time');
    if (ls) document.getElementById('lastSaved').textContent = 'Saved: ' + ls;
}

function setTracker(id, done, title, sub, forceState) {
    const dot = document.getElementById(id);
    const titleEl = dot.parentElement.querySelector('.t-title');
    const subEl = dot.parentElement.querySelector('.t-sub');
    dot.className = 't-dot ' + (done ? 'done' : (forceState || 'pending'));
    dot.textContent = done ? '✓' : (forceState === 'active' ? '→' : '');
    titleEl.style.color = done ? 'var(--ink)' : (forceState === 'active' ? 'var(--blue)' : 'var(--muted)');
    if (subEl) subEl.textContent = sub;
}

// ── MODAL ──
function openModal() {
    const d = loadData();
    document.getElementById('fFirstName').value = d.firstName || '';
    document.getElementById('fLastName').value = d.lastName || '';
    document.getElementById('fPhone').value = d.phone || '';
    document.getElementById('fCity').value = d.city || '';
    document.getElementById('fCollege').value = d.college || '';
    document.getElementById('fBranch').value = d.branch || '';
    document.getElementById('fYear').value = d.year || '';
    document.getElementById('f10th').value = d.tenth || '';
    document.getElementById('f12th').value = d.twelfth || '';
    document.getElementById('fCgpa').value = d.cgpa || '';
    document.getElementById('fBacklog').value = d.backlog || 'None';
    document.getElementById('fLinkedin').value = d.linkedin || '';
    document.getElementById('fSkills').value = d.skills || '';
    document.getElementById('fApps').value = d.apps || '0';
    document.getElementById('fInterviews').value = d.interviews || '0';
    document.getElementById('fOffers').value = d.offers || '0';
    document.getElementById('fLatestApp').value = d.latestApp || '';
    document.getElementById('fAbout').value = d.about || '';
    document.getElementById('modalOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('open');
    document.body.style.overflow = '';
}

function closeOnBg(e) {
    if (e.target === document.getElementById('modalOverlay')) closeModal();
}

function saveProfile() {
    const d = {
        firstName: document.getElementById('fFirstName').value.trim(),
        lastName: document.getElementById('fLastName').value.trim(),
        phone: document.getElementById('fPhone').value.trim(),
        city: document.getElementById('fCity').value.trim(),
        college: document.getElementById('fCollege').value.trim(),
        branch: document.getElementById('fBranch').value,
        year: document.getElementById('fYear').value,
        tenth: document.getElementById('f10th').value,
        twelfth: document.getElementById('f12th').value,
        cgpa: document.getElementById('fCgpa').value,
        backlog: document.getElementById('fBacklog').value,
        linkedin: document.getElementById('fLinkedin').value.trim(),
        skills: document.getElementById('fSkills').value.trim(),
        apps: document.getElementById('fApps').value || '0',
        interviews: document.getElementById('fInterviews').value || '0',
        offers: document.getElementById('fOffers').value || '0',
        latestApp: document.getElementById('fLatestApp').value.trim(),
        about: document.getElementById('fAbout').value.trim(),
    };
    saveData(d);
    const now = new Date();
    localStorage.setItem('campushire_saved_time',
        now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ' at ' +
        now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }));
    closeModal();
    renderDashboard();
    toast('✅ Profile saved successfully!');
}

// ── INIT ──
window.addEventListener('load', () => {
    // Initialize navbar
    initNavbar();
    
    // Render main dashboard
    renderDashboard();
    
    // Animate CGPA ring after render
    setTimeout(() => {
        const d = loadData();
        const cgpa = parseFloat(d.cgpa) || 0;
        if (cgpa > 0) {
            const circumference = 219.91;
            document.getElementById('cgpaRing').style.strokeDashoffset = circumference - (circumference * cgpa / 10);
        }
    }, 500);
});