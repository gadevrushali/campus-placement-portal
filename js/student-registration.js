let currentStep = 1;

function updateStepUI(step) {
    for (let i = 1; i <= 3; i++) {
      document.getElementById('panel' + i).classList.toggle('active', i === step);
      const sc = document.getElementById('sc' + i);
      const sl = document.getElementById('sl' + i);
      sc.classList.remove('active', 'done');
      sl.classList.remove('active');
      if (i < step) { sc.classList.add('done'); sc.textContent = '✓'; }
      else if (i === step) { sc.classList.add('active'); sc.textContent = i; sl.classList.add('active'); }
      else { sc.textContent = i; }
      if (i < 3) document.getElementById('line' + i).classList.toggle('done', i < step);
    }
    document.getElementById('progressBar').style.width = (step === 1 ? 33 : step === 2 ? 66 : 100) + '%';
  }

function validateStep1() {
    let ok = true;
    const checks = [
      ['firstName', v => v.trim().length > 0],
      ['lastName',  v => v.trim().length > 0],
      ['dob',       v => v !== ''],
      ['gender',    v => v !== ''],
      ['phone',     v => /^[+\d]{10,13}$/.test(v.replace(/\s/g,''))],
    ];
    checks.forEach(([id, fn]) => {
      const el = document.getElementById(id);
      const err = document.getElementById('err-' + id);
      const valid = fn(el.value);
      el.classList.toggle('error', !valid);
      err.classList.toggle('show', !valid);
      if (!valid) ok = false;
    });
    return ok;
  }

  function validateStep2() {
    let ok = true;
    const checks = [
      ['college',  v => v.trim().length > 0],
      ['branch',   v => v !== ''],
      ['passYear', v => v !== ''],
      ['cgpa',     v => v !== '' && +v >= 0 && +v <= 10],
    ];
    checks.forEach(([id, fn]) => {
      const el = document.getElementById(id);
      const err = document.getElementById('err-' + id);
      const valid = fn(el.value);
      el.classList.toggle('error', !valid);
      err.classList.toggle('show', !valid);
      if (!valid) ok = false;
    });
    return ok;
  }

 function validateStep3() {
    let ok = true;
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(document.getElementById('email').value);
    document.getElementById('email').classList.toggle('error', !emailOk);
    document.getElementById('err-email').classList.toggle('show', !emailOk);
    if (!emailOk) ok = false;

    const pass = document.getElementById('password').value;
    const passOk = pass.length >= 8;
    document.getElementById('password').classList.toggle('error', !passOk);
    document.getElementById('err-password').classList.toggle('show', !passOk);
    if (!passOk) ok = false;

    const conf = document.getElementById('confirmPass').value;
    const confOk = conf === pass && conf.length > 0;
    document.getElementById('confirmPass').classList.toggle('error', !confOk);
    document.getElementById('err-confirmPass').classList.toggle('show', !confOk);
    if (!confOk) ok = false;

    const terms = document.getElementById('terms').checked;
    document.getElementById('err-terms').classList.toggle('show', !terms);
    if (!terms) ok = false;
    return ok;
  }

function nextStep(from) {
    const valid = from === 1 ? validateStep1() : from === 2 ? validateStep2() : true;
    if (!valid) return;
    currentStep = from + 1;
    updateStepUI(currentStep);
  }
  function prevStep(from) {
    currentStep = from - 1;
    updateStepUI(currentStep);
  }
  function submitForm() {
    if (!validateStep3()) return;
    document.getElementById('panel3').classList.remove('active');
    document.getElementById('successBox').classList.add('show');
    showToast(' Registration successful! Welcome to CampusHire.');
  }



  
function toggleMenu(){
  const menu=document.getElementById('mobileMenu');
  const btn=document.getElementById('hamburger');
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}
document.addEventListener('click',function(e){
  const nav=document.getElementById('navbar');
  const menu=document.getElementById('mobileMenu');
  if(!nav.contains(e.target)&&!menu.contains(e.target)){
    menu.classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  }
});
window.addEventListener('scroll',function(){
  document.getElementById('navbar').style.boxShadow=
    window.scrollY>10?'0 4px 20px rgba(26,18,8,0.1)':'none';
});
// Active link on click
document.querySelectorAll('.nav-links a,.mobile-menu a').forEach(function(a){
  a.addEventListener('click',function(){
    document.querySelectorAll('.nav-links a,.mobile-menu a').forEach(function(x){x.classList.remove('active')});
    document.querySelectorAll('.nav-links a[href="'+this.getAttribute('href')+'"],.mobile-menu a[href="'+this.getAttribute('href')+'"]').forEach(function(x){x.classList.add('active')});
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('open');
  });
});

function registerStudent(){

let name = document.getElementById("name").value;
let email = document.getElementById("email").value;
let course = document.getElementById("course").value;

let student = {
name:name,
email:email,
course:course
};

localStorage.setItem("studentData", JSON.stringify(student));

alert("Registration Successful!");

window.location.href="student-dashboard.html";

}

let currentStep = 1;

function nextStep(step) {

  if(step === 1){
    let first = document.getElementById("firstName").value;
    let last = document.getElementById("lastName").value;

    if(first === "" || last === ""){
      alert("Please fill personal details");
      return;
    }
  }

  if(step === 2){
    let college = document.getElementById("college").value;

    if(college === ""){
      alert("Please fill academic details");
      return;
    }
  }

  document.getElementById("panel"+step).classList.remove("active");
  document.getElementById("panel"+(step+1)).classList.add("active");

  currentStep++;
}

function prevStep(step){

  document.getElementById("panel"+step).classList.remove("active");
  document.getElementById("panel"+(step-1)).classList.add("active");

  currentStep--;
}


function registerStudent(){

  let first = document.getElementById("firstName").value;
  let last = document.getElementById("lastName").value;
  let phone = document.getElementById("phone").value;
  let city = document.getElementById("city").value;

  let college = document.getElementById("college").value;
  let branch = document.getElementById("branch").value;
  let cgpa = document.getElementById("cgpa").value;

  let email = document.getElementById("email").value;

  if(first=="" || email==""){
    alert("Please fill required fields");
    return;
  }

  let studentData = {
    firstName:first,
    lastName:last,
    phone:phone,
    city:city,
    college:college,
    branch:branch,
    cgpa:cgpa,
    email:email
  };

  localStorage.setItem("studentData", JSON.stringify(studentData));

  alert("Registration Successful!");

  window.location.href="../pages/student-dashboard.html";

}