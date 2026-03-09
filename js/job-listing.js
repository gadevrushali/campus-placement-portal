
const jobs = [

{
title:"Software Engineer",
company:"Google",
location:"Bangalore",
salary:"₹24 LPA",
category:"it",
logo:"https://logo.clearbit.com/google.com"
},

{
title:"Investment Banking Analyst",
company:"Goldman Sachs",
location:"Mumbai",
salary:"₹18 LPA",
category:"finance",
logo:"https://logo.clearbit.com/goldmansachs.com"
},

{
title:"Mechanical Engineer",
company:"Tata Motors",
location:"Pune",
salary:"₹9 LPA",
category:"core",
logo:"https://logo.clearbit.com/tatamotors.com"
},

{
title:"Data Scientist",
company:"Microsoft",
location:"Hyderabad",
salary:"₹22 LPA",
category:"it",
logo:"https://logo.clearbit.com/microsoft.com"
}

];


const container = document.getElementById("jobsContainer");

function showJobs(list){

container.innerHTML="";

list.forEach(job=>{

container.innerHTML += `

<div class="job-card">

<img src="${job.logo}" class="company-logo">

<h3>${job.title}</h3>

<p class="company">${job.company}</p>

<div class="tags">
<span>${job.location}</span>
<span>Batch 2025</span>
</div>

<div class="skills">
<span>Skill</span>
<span>Skill</span>
<span>Skill</span>
</div>

<div class="job-footer">
<h4>${job.salary}</h4>
<button class="apply-btn">Apply Now</button>
</div>

</div>

`;

});

}

showJobs(jobs);


/* SEARCH */

document.getElementById("searchInput").addEventListener("keyup",function(){

let value = this.value.toLowerCase();

let filtered = jobs.filter(job =>
job.title.toLowerCase().includes(value) ||
job.company.toLowerCase().includes(value)
);

showJobs(filtered);

});


/* FILTER */

document.querySelectorAll(".filter").forEach(btn=>{

btn.addEventListener("click",function(){

document.querySelector(".filter.active").classList.remove("active");
btn.classList.add("active");

let category = btn.dataset.category;

if(category==="all"){
showJobs(jobs);
}
else{

let filtered = jobs.filter(job=>job.category===category);
showJobs(filtered);

}

});

});


/* APPLY BUTTON */

document.addEventListener("click",function(e){

if(e.target.classList.contains("apply-btn")){
alert("Application Submitted Successfully!");
}

});