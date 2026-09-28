/* Smart Resume AI - vanilla HTML/CSS/JS front-end
   Demo credentials: admin / admin
   Data is stored locally in the browser. A production deployment should move
   authentication, files, AI processing and database operations to a backend.
*/
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];
const store = {
  get(key, fallback=[]) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } },
  set(key, value) { localStorage.setItem(key, JSON.stringify(value)); },
  push(key, value) { const a=this.get(key,[]); a.push(value); this.set(key,a); return a; }
};

const roles = {
  "Frontend Developer": ["HTML","CSS","JavaScript","React","Angular","Vue.js","UI/UX","Responsive Design"],
  "Backend Developer": ["Python","Java","Node.js","REST API","SQL","Git","Docker","Authentication"],
  "Full Stack Developer": ["HTML","CSS","JavaScript","React","Node.js","REST API","SQL","Git"],
  "Data Analyst": ["Python","SQL","Excel","Power BI","Pandas","Data Visualization","Statistics"],
  "Cloud Engineer": ["AWS","Azure","Linux","Docker","Kubernetes","Networking","Terraform","CI/CD"],
  "AI / ML Engineer": ["Python","Machine Learning","NLP","Pandas","NumPy","Scikit-learn","TensorFlow","SQL"],
  "Cybersecurity Analyst": ["Networking","Linux","SIEM","Python","IAM","Incident Response","Security"],
  "DevOps Engineer": ["Linux","Docker","Kubernetes","AWS","CI/CD","Git","Terraform","Jenkins"]
};

const jobs = [
  {title:"Junior Frontend Developer", company:"TechNova Solutions", loc:"Mumbai, Maharashtra", type:"Full-time", exp:"0–2 years", tags:["HTML","CSS","JavaScript","React"], category:"Software Development"},
  {title:"Graduate Software Engineer", company:"CloudPeak Systems", loc:"Pune, Maharashtra", type:"Full-time", exp:"0–1 years", tags:["Python","SQL","Git","AWS"], category:"Software Development"},
  {title:"Data Analyst Intern", company:"InsightWorks", loc:"Remote — India", type:"Internship", exp:"0–1 years", tags:["Python","Excel","SQL","Power BI"], category:"Data Science"},
  {title:"Cloud Support Associate", company:"SkyStack Technologies", loc:"Bengaluru, Karnataka", type:"Full-time", exp:"0–2 years", tags:["AWS","Linux","Networking"], category:"Cloud Computing"},
  {title:"AI/ML Trainee", company:"NeuralGrid Labs", loc:"Hyderabad, Telangana", type:"Full-time", exp:"0–1 years", tags:["Python","ML","NLP","Pandas"], category:"Artificial Intelligence"},
  {title:"Cybersecurity Associate", company:"SecurePath", loc:"Pune, Maharashtra", type:"Full-time", exp:"0–2 years", tags:["Linux","SIEM","Networking"], category:"Cybersecurity"},
  {title:"DevOps Trainee", company:"DeployCraft", loc:"Mumbai, Maharashtra", type:"Full-time", exp:"0–2 years", tags:["Docker","AWS","Git","CI/CD"], category:"DevOps"},
  {title:"Backend Developer — Node.js", company:"ByteBridge", loc:"Nashik, Maharashtra", type:"Full-time", exp:"1–2 years", tags:["Node.js","REST API","SQL","Git"], category:"Software Development"}
];

const state = {
  view: "home",
  theme: localStorage.getItem("srai-theme") || "light",
  analysis: null,
  rating: 5,
  adminLogged: sessionStorage.getItem("srai-admin") === "1",
  adminTab: "overview",
  builderTemplate: "Modern",
  builder: store.get("srai-builder", {name:"",email:"",phone:"",location:"",linkedin:"",portfolio:"",summary:"",experience:[],projects:[],education:[],skills:"",languages:"",soft:"",tools:""})
};

function esc(v="") {
  return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function toast(message, type="success") {
  const el=document.createElement("div"); el.className=`toast ${type}`;
  el.innerHTML=`<i data-lucide="${type==="error"?"circle-alert":"circle-check"}"></i><span>${esc(message)}</span>`;
  $("#toast-root").appendChild(el); lucide.createIcons();
  setTimeout(()=>el.remove(),3500);
}
function setTheme(theme) {
  state.theme=theme; document.documentElement.dataset.theme=theme; localStorage.setItem("srai-theme",theme);
  $("#themeText").textContent=theme==="dark"?"Dark mode":"Light mode";
  lucide.createIcons();
}
function icon(name) { return `<i data-lucide="${name}"></i>`; }
function sectionHead(title, text="") {
  return `<div class="section-title"><div><h2>${title}</h2>${text?`<p>${text}</p>`:""}</div></div>`;
}
function navTo(view) {
  state.view=view;
  $$(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  $$(".view").forEach(v=>v.classList.remove("active-view"));
  $(`#view-${view}`).classList.add("active-view");
  const label = {home:"Home", analyzer:"Resume Analyzer", builder:"Resume Builder", dashboard:"Dashboard", jobs:"Job Search", feedback:"Feedback", about:"About"}[view];
  $("#pageLabel").textContent=label;
  renderView(view);
  window.scrollTo({top:0,behavior:"smooth"});
  if (innerWidth<=820) $("#sidebar").classList.remove("open");
}
function renderView(view) {
  const map={home:renderHome, analyzer:renderAnalyzer, builder:renderBuilder, dashboard:renderDashboard, jobs:renderJobs, feedback:renderFeedback, about:renderAbout};
  map[view](); lucide.createIcons();
}
function renderHome() {
  $("#view-home").innerHTML=`
    <div class="hero">
      <div class="hero-copy">
        <span class="eyebrow">${icon("sparkles")} AI-Powered Career Workspace</span>
        <h1>Build a resume that gets <span class="gradient-text">noticed.</span></h1>
        <p>Analyze your resume against a target role, discover missing skills, build an ATS-friendly resume, explore career opportunities and track your progress — all in one professional workspace.</p>
        <div class="hero-actions">
          <button class="btn primary" data-go="analyzer">${icon("file-search-2")} Analyze my resume</button>
          <button class="btn" data-go="builder">${icon("file-pen-line")} Build a resume</button>
        </div>
      </div>
    </div>
    ${sectionHead("Everything you need","A cleaner and more practical version of your original Streamlit modules.")}
    <div class="grid-3">
      ${feature("file-search-2","AI Resume Analysis","Get a role-specific ATS score, keyword match, missing skills and actionable improvement suggestions.","analyzer")}
      ${feature("file-pen-line","Smart Resume Builder","Create a clean professional resume with multiple templates and print/download support.","builder")}
      ${feature("bar-chart-3","Career Dashboard","Track analyses, average ATS performance, skill demand and your recent activity.","dashboard")}
      ${feature("briefcase-business","Smart Job Search","Search sample opportunities by title, skill, location and category.","jobs")}
      ${feature("message-square-heart","Feedback Center","Rate your experience and send product feedback. Saved locally for admin review.","feedback")}
      ${feature("shield-check","Admin Control Center","Review stored analyses and feedback, export data and reset local demo data.","admin")}
    </div>
    <div class="card" style="margin-top:18px">
      <div class="toolbar"><div><b>How it works</b><div class="helper">A simple three-step career workflow.</div></div></div>
      <div class="grid-3">
        ${step("01","Upload","Add a PDF, DOCX or text resume and select your target role.")}
        ${step("02","Analyze","The browser extracts text and calculates role-specific keyword coverage.")}
        ${step("03","Improve","Use the missing-skill list, builder and dashboard to iterate.")}
      </div>
    </div>`;
  $$("[data-go]").forEach(b=>b.onclick=()=> b.dataset.go==="admin"?openAdmin():navTo(b.dataset.go));
}
function feature(ic,title,desc,go) {
  return `<button class="card feature-card" style="text-align:left;border:1px solid var(--border)" data-go="${go}">
    <div class="card-icon">${icon(ic)}</div><h3>${title}</h3><p>${desc}</p>
  </button>`;
}
function step(n,t,d) {
  return `<div style="display:flex;gap:12px"><b style="color:var(--primary);font-size:12px">${n}</b><div><b style="font-size:12px">${t}</b><p class="helper" style="margin:5px 0 0">${d}</p></div></div>`;
}

function renderAnalyzer() {
  $("#view-analyzer").innerHTML=`
    <div class="page-head"><span class="eyebrow">${icon("scan-search")} Resume Intelligence</span><h1>Resume Analyzer</h1><p>Compare your resume with a target role and receive a practical ATS-style analysis.</p></div>
    <div class="analyzer-layout">
      <div class="card">
        <div class="form-grid">
          <label>Job Category<select id="jobCategory">
            <option>Software Development</option><option>Data Science</option><option>Cloud Computing</option><option>Artificial Intelligence</option><option>Cybersecurity</option><option>DevOps</option>
          </select></label>
          <label>Specific Role<select id="roleSelect">${Object.keys(roles).map(r=>`<option>${r}</option>`).join("")}</select></label>
        </div>
        <div class="card" style="margin-top:15px;background:var(--surface-2);box-shadow:none">
          <b id="requiredRoleTitle">Required Skills</b>
          <div class="chips" id="requiredSkills" style="margin-top:10px"></div>
        </div>
        <div class="upload-zone" id="uploadZone" style="margin-top:15px">
          ${icon("cloud-upload")}
          <h3>Upload your resume</h3>
          <p>PDF, DOCX or TXT • Text extraction happens in your browser.</p>
          <input id="resumeFile" type="file" accept=".pdf,.docx,.txt" hidden>
          <button class="btn primary" id="chooseResume">${icon("upload")} Choose resume</button>
          <div id="fileName" class="helper" style="margin-top:9px">No file selected</div>
        </div>
        <div style="margin-top:15px">
          <label>Or paste resume text<textarea id="resumeText" placeholder="Paste your resume text here..."></textarea></label>
        </div>
        <div class="toolbar" style="margin-top:15px">
          <span class="helper">Demo analysis is deterministic and works offline after the page loads.</span>
          <button class="btn primary" id="analyzeBtn">${icon("sparkles")} Analyze Resume</button>
        </div>
      </div>
      <div class="card sticky-card" id="analysisResult">
        ${analysisEmpty()}
      </div>
    </div>`;
  const roleSelect=$("#roleSelect"), skills=$("#requiredSkills");
  function refreshRole() {
    const role=roleSelect.value;
    $("#requiredRoleTitle").textContent=`Required Skills — ${role}`;
    skills.innerHTML=roles[role].map(s=>`<span class="chip">${esc(s)}</span>`).join("");
  }
  roleSelect.onchange=refreshRole; refreshRole();
  $("#chooseResume").onclick=()=>$("#resumeFile").click();
  const zone=$("#uploadZone");
  $("#resumeFile").onchange=async e=>{ if(e.target.files[0]) await loadResumeFile(e.target.files[0]); };
  ["dragenter","dragover"].forEach(ev=>zone.addEventListener(ev,e=>{e.preventDefault();zone.classList.add("dragover")}));
  ["dragleave","drop"].forEach(ev=>zone.addEventListener(ev,e=>{e.preventDefault();zone.classList.remove("dragover")}));
  zone.addEventListener("drop",async e=>{const f=e.dataTransfer.files[0]; if(f) await loadResumeFile(f);});
  $("#analyzeBtn").onclick=runAnalysis;
  if(state.analysis) showAnalysis(state.analysis);
}
function analysisEmpty() {
  return `<div style="text-align:center;padding:50px 15px">${icon("radar")}<h3>Analysis appears here</h3><p class="helper">Choose a target role and upload or paste your resume, then click Analyze Resume.</p></div>`;
}
async function loadResumeFile(file) {
  $("#fileName").textContent=`Reading ${file.name}...`;
  try {
    let text="";
    if(file.type==="text/plain" || file.name.toLowerCase().endsWith(".txt")) text=await file.text();
    else if(file.name.toLowerCase().endsWith(".docx")) {
      const buf=await file.arrayBuffer();
      const result=await window.mammoth.extractRawText({arrayBuffer:buf}); text=result.value;
    } else if(file.name.toLowerCase().endsWith(".pdf")) {
      const pdfjs=window.pdfjsLib;
      if(!pdfjs) throw new Error("PDF engine is still loading. Please try again in a moment or paste the text.");
      const buf=await file.arrayBuffer();
      const pdf=await pdfjs.getDocument({data:buf}).promise;
      const pages=[];
      for(let i=1;i<=pdf.numPages;i++){const page=await pdf.getPage(i);const content=await page.getTextContent();pages.push(content.items.map(x=>x.str).join(" "));}
      text=pages.join("\n");
    } else throw new Error("Unsupported file type.");
    $("#resumeText").value=text.trim();
    $("#fileName").textContent=`✓ ${file.name} loaded`;
    toast("Resume text extracted successfully.");
  } catch(err) { $("#fileName").textContent="Could not extract this file"; toast(err.message||"File extraction failed.","error"); }
}
function normalize(s) { return s.toLowerCase().replace(/[^a-z0-9+#./ -]/g," "); }
function hasSkill(text, skill) {
  const t=normalize(text), s=normalize(skill);
  return t.includes(s);
}
function calculateAnalysis(text, role) {
  const req=roles[role];
  const found=req.filter(s=>hasSkill(text,s));
  const missing=req.filter(s=>!found.includes(s));
  const keyword=Math.round(found.length/req.length*100);
  const wordCount=text.trim().split(/\s+/).filter(Boolean).length;
  const sections=["experience","education","skills","projects","summary","objective"];
  const sectionHits=sections.filter(s=>normalize(text).includes(s)).length;
  const format=Math.min(100,Math.round(48+sectionHits*8+(wordCount>250?8:0)));
  const actionWords=["developed","built","implemented","designed","created","improved","optimized","automated","managed","analyzed"];
  const actionHits=actionWords.filter(w=>normalize(text).includes(w)).length;
  const impact=Math.min(100,45+actionHits*6);
  const ats=Math.round(keyword*.55+format*.25+impact*.2);
  const summary = wordCount<70 ? "Add a concise 2–4 line professional summary tailored to the target role." :
    !normalize(text).includes("summary") ? "Add a clearly labelled professional summary near the top." :
    "Keep the summary focused on role, strongest skills and measurable value.";
  const suggestions=[
    missing.length ? `Add evidence for ${missing.slice(0,4).join(", ")} where you genuinely have those skills.` : "Your core role keywords are well represented.",
    actionHits<4 ? "Start experience bullets with strong action verbs and include measurable outcomes." : "Your experience uses action-oriented language; add numbers where possible.",
    sectionHits<4 ? "Use clear ATS-readable headings such as Summary, Skills, Experience, Projects and Education." : "Your resume contains several standard ATS-friendly sections.",
    wordCount<180 ? "Add relevant project or experience detail so recruiters can understand your practical work." : "Keep the document concise and remove repetitive content."
  ];
  return {role, ats, keyword, format, impact, found, missing, wordCount, suggestions, summary, createdAt:new Date().toISOString()};
}
function runAnalysis() {
  const text=$("#resumeText").value.trim(), role=$("#roleSelect").value;
  if(text.length<25){toast("Please upload a resume or paste at least a little resume text.","error");return;}
  const result=calculateAnalysis(text,role); state.analysis=result;
  store.push("srai-analyses",result);
  showAnalysis(result); toast(`Analysis complete — ATS-style score ${result.ats}/100`);
}
function showAnalysis(r) {
  $("#analysisResult").innerHTML=`
    <div style="text-align:center"><span class="eyebrow">${icon("activity")} Analysis result</span>
      <div class="score-ring" style="--score:${r.ats}"><div><div class="score-number">${r.ats}</div><div class="score-caption">ATS-style score</div></div></div>
      <b>${r.ats>=80?"Strong match":r.ats>=65?"Good foundation":"Needs improvement"}</b>
      <p class="helper">${r.wordCount} words • ${esc(r.role)}</p>
    </div>
    <div class="metric-row"><span class="label">Keyword match</span><span class="value">${r.keyword}%</span><div class="progress"><span style="width:${r.keyword}%"></span></div><span></span></div>
    <div class="metric-row"><span class="label">Format & sections</span><span class="value">${r.format}%</span><div class="progress"><span style="width:${r.format}%"></span></div><span></span></div>
    <div class="metric-row"><span class="label">Impact language</span><span class="value">${r.impact}%</span><div class="progress"><span style="width:${r.impact}%"></span></div><span></span></div>
    <div class="divider"></div>
    <b>Matched skills</b><div class="chips" style="margin-top:10px">${r.found.length?r.found.map(s=>`<span class="chip good">✓ ${esc(s)}</span>`).join(""):`<span class="helper">No target skills detected.</span>`}</div>
    <div style="margin-top:17px"><b>Missing / not detected</b><div class="chips" style="margin-top:10px">${r.missing.length?r.missing.map(s=>`<span class="chip bad">+ ${esc(s)}</span>`).join(""):`<span class="chip good">All target skills detected</span>`}</div></div>
    <div class="divider"></div><b>Improvement suggestions</b>
    <ul class="insight-list" style="margin-top:12px">${r.suggestions.map(s=>`<li>${icon("circle-check")}<span>${esc(s)}</span></li>`).join("")}</ul>
    <div class="callout" style="margin-top:14px"><b>Professional summary:</b> ${esc(r.summary)}</div>`;
  lucide.createIcons();
}

function renderBuilder() {
  const b=state.builder;
  $("#view-builder").innerHTML=`
    <div class="page-head"><span class="eyebrow">${icon("file-pen-line")} Resume Studio</span><h1>Resume Builder</h1><p>Create a structured, ATS-friendly resume and print it directly from your browser.</p></div>
    <div class="builder-layout">
      <div class="card">
        <div class="toolbar"><div><b>Choose a template</b><div class="helper">Select a visual style for the live preview.</div></div></div>
        <div class="template-row">
          ${["Modern","Classic","Minimal"].map(t=>`<div class="template-card ${state.builderTemplate===t?"active":""}" data-template="${t}">
            <div class="template-preview"><i></i><b></b><span></span><span style="width:70%"></span></div><strong>${t}</strong>
          </div>`).join("")}
        </div>
        <div class="divider"></div>
        <form id="builderForm" class="stack-form">
          <b>Personal Information</b>
          <div class="form-grid">
            <label>Full name<input name="name" value="${esc(b.name)}" placeholder="Your full name"></label>
            <label>Email<input name="email" value="${esc(b.email)}" placeholder="you@example.com"></label>
            <label>Phone<input name="phone" value="${esc(b.phone)}" placeholder="+91 98765 43210"></label>
            <label>Location<input name="location" value="${esc(b.location)}" placeholder="City, State"></label>
            <label>LinkedIn<input name="linkedin" value="${esc(b.linkedin)}" placeholder="linkedin.com/in/username"></label>
            <label>Portfolio<input name="portfolio" value="${esc(b.portfolio)}" placeholder="yourportfolio.com"></label>
          </div>
          <label>Professional Summary<textarea name="summary" placeholder="2–4 lines describing your profile, strengths and career direction.">${esc(b.summary)}</textarea></label>
          <b>Experience</b>
          <div id="experienceList">${builderExperience(b.experience)}</div>
          <button type="button" class="btn small" id="addExperience">${icon("plus")} Add experience</button>
          <b>Projects</b>
          <div id="projectsList">${builderProjects(b.projects)}</div>
          <button type="button" class="btn small" id="addProject">${icon("plus")} Add project</button>
          <b>Education</b>
          <div id="educationList">${builderEducation(b.education)}</div>
          <button type="button" class="btn small" id="addEducation">${icon("plus")} Add education</button>
          <b>Skills & Additional</b>
          <div class="form-grid">
            <label>Technical skills<input name="skills" value="${esc(b.skills)}" placeholder="Python, JavaScript, SQL, AWS"></label>
            <label>Languages<input name="languages" value="${esc(b.languages)}" placeholder="English, Hindi, Marathi"></label>
            <label>Soft skills<input name="soft" value="${esc(b.soft)}" placeholder="Communication, teamwork, problem solving"></label>
            <label>Tools / technologies<input name="tools" value="${esc(b.tools)}" placeholder="Git, VS Code, Docker"></label>
          </div>
          <div class="toolbar"><span class="helper">Your draft is saved locally as you generate.</span><div class="toolbar-actions"><button type="button" class="btn" id="printResume">${icon("printer")} Print / Save PDF</button><button class="btn primary" type="submit">${icon("wand-sparkles")} Generate Resume</button></div></div>
        </form>
      </div>
      <div class="preview-shell"><div id="resumePreview"></div></div>
    </div>`;
  $$(".template-card").forEach(x=>x.onclick=()=>{state.builderTemplate=x.dataset.template;renderBuilder();});
  $("#addExperience").onclick=()=>{state.builder.experience.push({role:"",company:"",dates:"",details:""});renderBuilder();};
  $("#addProject").onclick=()=>{state.builder.projects.push({name:"",details:""});renderBuilder();};
  $("#addEducation").onclick=()=>{state.builder.education.push({degree:"",college:"",year:""});renderBuilder();};
  $("#builderForm").onsubmit=e=>{e.preventDefault();saveBuilderForm();toast("Resume generated and saved locally.");};
  $("#printResume").onclick=()=>printResume();
  $("#resumePreview").innerHTML=resumePreview();
  lucide.createIcons();
}
function builderExperience(arr){return arr.length?arr.map((x,i)=>`<div class="card" style="padding:13px;margin-bottom:8px;box-shadow:none">
  <div class="form-grid"><label>Role<input data-btype="experience" data-i="${i}" data-k="role" value="${esc(x.role)}"></label><label>Company<input data-btype="experience" data-i="${i}" data-k="company" value="${esc(x.company)}"></label><label>Dates<input data-btype="experience" data-i="${i}" data-k="dates" value="${esc(x.dates)}"></label><label>Details<input data-btype="experience" data-i="${i}" data-k="details" value="${esc(x.details)}"></label></div>
  <button type="button" class="btn small danger" style="margin-top:8px" data-remove="experience" data-i="${i}">${icon("trash-2")} Remove</button></div>`).join(""):`<div class="helper">No experience added yet. You can add internships, training or work experience.</div>`;}
function builderProjects(arr){return arr.length?arr.map((x,i)=>`<div class="card" style="padding:13px;margin-bottom:8px;box-shadow:none"><div class="form-grid"><label>Project name<input data-btype="projects" data-i="${i}" data-k="name" value="${esc(x.name)}"></label><label>Description<input data-btype="projects" data-i="${i}" data-k="details" value="${esc(x.details)}"></label></div><button type="button" class="btn small danger" style="margin-top:8px" data-remove="projects" data-i="${i}">${icon("trash-2")} Remove</button></div>`).join(""):`<div class="helper">Add academic, personal or professional projects.</div>`;}
function builderEducation(arr){return arr.length?arr.map((x,i)=>`<div class="card" style="padding:13px;margin-bottom:8px;box-shadow:none"><div class="form-grid"><label>Degree<input data-btype="education" data-i="${i}" data-k="degree" value="${esc(x.degree)}"></label><label>College / University<input data-btype="education" data-i="${i}" data-k="college" value="${esc(x.college)}"></label><label>Year<input data-btype="education" data-i="${i}" data-k="year" value="${esc(x.year)}"></label></div><button type="button" class="btn small danger" style="margin-top:8px" data-remove="education" data-i="${i}">${icon("trash-2")} Remove</button></div>`).join(""):`<div class="helper">Add your highest or most relevant education.</div>`;}
function saveBuilderForm(){
  const form=$("#builderForm"), fd=new FormData(form);
  for(const k of ["name","email","phone","location","linkedin","portfolio","summary","skills","languages","soft","tools"]) state.builder[k]=fd.get(k)||"";
  $$("[data-btype]").forEach(el=>{state.builder[el.dataset.btype][+el.dataset.i][el.dataset.k]=el.value;});
  store.set("srai-builder",state.builder); renderBuilder();
}
function printResume(){
  const paper=resumePreview();
  const w=window.open("","_blank","width=1000,height=800");
  if(!w){toast("Please allow pop-ups to print the resume.","error");return;}
  w.document.write(`<!doctype html><html><head><title>Resume - ${esc(state.builder.name||"Candidate")}</title><style>body{margin:0;background:#eef2f7;font-family:Arial,sans-serif}.resume-paper{max-width:760px;min-height:680px;margin:25px auto;background:white;color:#111827;padding:38px;box-shadow:0 0 15px rgba(0,0,0,.12)}.resume-paper h1{font-size:26px;margin:0}.resume-contact{color:#64748b;font-size:10px;margin:6px 0 18px}.resume-paper h2{font-size:11px;color:#2563eb;text-transform:uppercase;letter-spacing:1px;margin:17px 0 7px;padding-bottom:4px;border-bottom:1px solid #dbe4ee}.resume-paper p{font-size:9px;line-height:1.55;margin:3px 0}@media print{body{background:white}.resume-paper{margin:0;box-shadow:none}}</style></head><body>${paper}</body></html>`);
  w.document.close(); w.focus(); setTimeout(()=>w.print(),350);
}
function resumePreview(){
  const b=state.builder;
  return `<div class="resume-paper ${state.builderTemplate.toLowerCase()}">
    <h1>${esc(b.name||"Your Name")}</h1><div class="resume-contact">${[b.email,b.phone,b.location,b.linkedin,b.portfolio].filter(Boolean).map(esc).join(" • ")||"email@example.com • +91 XXXXX XXXXX • City, India"}</div>
    ${b.summary?`<h2>Professional Summary</h2><p>${esc(b.summary)}</p>`:""}
    ${b.skills?`<h2>Skills</h2><p><b>Technical:</b> ${esc(b.skills)}</p>`:""}
    ${b.experience.length?`<h2>Experience</h2>${b.experience.map(x=>`<p><b>${esc(x.role||"Role")}</b> — ${esc(x.company||"Company")} <span style="float:right">${esc(x.dates)}</span><br>${esc(x.details)}</p>`).join("")}`:""}
    ${b.projects.length?`<h2>Projects</h2>${b.projects.map(x=>`<p><b>${esc(x.name||"Project")}</b><br>${esc(x.details)}</p>`).join("")}`:""}
    ${b.education.length?`<h2>Education</h2>${b.education.map(x=>`<p><b>${esc(x.degree||"Degree")}</b> — ${esc(x.college||"College")} <span style="float:right">${esc(x.year)}</span></p>`).join("")}`:""}
    ${b.languages?`<h2>Languages</h2><p>${esc(b.languages)}</p>`:""}
    ${b.soft?`<h2>Soft Skills</h2><p>${esc(b.soft)}</p>`:""}
    ${b.tools?`<h2>Tools & Technologies</h2><p>${esc(b.tools)}</p>`:""}
  </div>`;
}

function renderDashboard(){
  const analyses=store.get("srai-analyses",[]);
  const feedback=store.get("srai-feedback",[]);
  const avg=analyses.length?Math.round(analyses.reduce((a,b)=>a+b.ats,0)/analyses.length):0;
  const strong=analyses.filter(a=>a.ats>=75).length;
  $("#view-dashboard").innerHTML=`
    <div class="page-head"><span class="eyebrow">${icon("bar-chart-3")} Career Analytics</span><h1>Resume Analytics Dashboard</h1><p>Local performance data from your browser sessions.</p></div>
    <div class="kpi-row">
      ${stat("Total Analyses",analyses.length,"Your saved resume checks")}
      ${stat("Average ATS",avg?avg+"%":"—",avg?"Across all analyses":"Analyze a resume to start")}
      ${stat("Strong Matches",strong,"Score of 75+")}
      ${stat("Feedback",feedback.length,"Responses collected")}
    </div>
    <div class="chart-grid">
      <div class="card chart-box"><b>ATS Score Performance</b><p class="helper">Your latest analysis scores.</p><canvas id="atsChart"></canvas></div>
      <div class="card chart-box"><b>Skill Coverage</b><p class="helper">Matched vs missing target skills.</p><canvas id="skillChart"></canvas></div>
    </div>
    <div class="grid-3" style="margin-top:18px">
      <div class="card"><div class="card-icon">${icon("trophy")}</div><h3>Top role</h3><p class="helper">${topRole(analyses)}</p></div>
      <div class="card"><div class="card-icon">${icon("trending-up")}</div><h3>Latest trend</h3><p class="helper">${trend(analyses)}</p></div>
      <div class="card"><div class="card-icon">${icon("lightbulb")}</div><h3>Next action</h3><p class="helper">${nextAction(analyses)}</p></div>
    </div>`;
  lucide.createIcons();
  const labels=analyses.slice(-8).map((a,i)=>a.role.split(" ")[0]+" "+(i+1));
  const vals=analyses.slice(-8).map(a=>a.ats);
  new Chart($("#atsChart"),{type:"line",data:{labels,datasets:[{label:"ATS score",data:vals,tension:.35,borderWidth:3,pointRadius:4}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{min:0,max:100,grid:{color:getComputedStyle(document.documentElement).getPropertyValue("--border")}},x:{grid:{display:false}}}}});
  const found=analyses.reduce((n,a)=>n+a.found.length,0), miss=analyses.reduce((n,a)=>n+a.missing.length,0);
  new Chart($("#skillChart"),{type:"doughnut",data:{labels:["Matched","Not detected"],datasets:[{data:[found,miss],borderWidth:0}]},options:{responsive:true,plugins:{legend:{position:"bottom"}}}});
}
function stat(label,value,trend){return `<div class="card stat-card"><span class="stat-label">${label}</span><div class="stat-value">${value}</div><span class="stat-trend">${trend}</span></div>`;}
function topRole(a){if(!a.length)return"No analyses yet.";const m={};a.forEach(x=>m[x.role]=(m[x.role]||0)+1);return Object.entries(m).sort((x,y)=>y[1]-x[1])[0][0];}
function trend(a){if(a.length<2)return"Complete at least two analyses to see your score trend.";const x=a.at(-2).ats,y=a.at(-1).ats;return y>x?`Your latest score improved by ${y-x} points.`:y<x?`Your latest score is ${x-y} points below the previous one.`:"Your latest score is unchanged.";}
function nextAction(a){if(!a.length)return"Start with Resume Analyzer.";const x=a.at(-1);return x.missing.length?`Work on ${x.missing.slice(0,3).join(", ")}.`:"Polish impact statements and quantify achievements.";}

function renderJobs(){
  $("#view-jobs").innerHTML=`
    <div class="page-head"><span class="eyebrow">${icon("briefcase-business")} Opportunity Finder</span><h1>Smart Job Search</h1><p>Search the included job catalogue by role, skill, location or category. Connect real APIs later without changing the UI.</p></div>
    <div class="card" style="margin-bottom:16px">
      <div class="toolbar">
        <div class="searchbar">${icon("search")}<input id="jobQuery" placeholder="Search jobs, skills or companies..."></div>
        <select id="jobCategoryFilter"><option>All categories</option><option>Software Development</option><option>Data Science</option><option>Cloud Computing</option><option>Artificial Intelligence</option><option>Cybersecurity</option><option>DevOps</option></select>
        <select id="jobTypeFilter"><option>All types</option><option>Full-time</option><option>Internship</option></select>
      </div>
    </div>
    <div class="toolbar"><b id="jobCount">${jobs.length} opportunities</b><span class="helper">Demo catalogue • replace with an API/backend for live jobs</span></div>
    <div class="jobs-grid" id="jobsGrid"></div>`;
  const render=()=>{
    const q=$("#jobQuery").value.toLowerCase(), cat=$("#jobCategoryFilter").value, type=$("#jobTypeFilter").value;
    const filtered=jobs.filter(j=>(!q||[j.title,j.company,j.loc,j.category,...j.tags].join(" ").toLowerCase().includes(q))&&(cat==="All categories"||j.category===cat)&&(type==="All types"||j.type===type));
    $("#jobCount").textContent=`${filtered.length} opportunities`;
    $("#jobsGrid").innerHTML=filtered.length?filtered.map(jobCard).join(""):`<div class="card empty" style="grid-column:1/-1">No matching opportunities. Try another keyword or category.</div>`;
    lucide.createIcons();
  };
  ["input","change"].forEach(ev=>{["jobQuery","jobCategoryFilter","jobTypeFilter"].forEach(id=>$("#"+id).addEventListener(ev,render))}); render();
}
function jobCard(j){return `<article class="card job-card"><span class="job-company">${esc(j.company)}</span><h3>${esc(j.title)}</h3><div class="job-meta"><span>${icon("map-pin")} ${esc(j.loc)}</span><span>${icon("clock-3")} ${esc(j.type)}</span><span>${icon("graduation-cap")} ${esc(j.exp)}</span></div><div class="job-tags">${j.tags.map(t=>`<span class="job-tag">${esc(t)}</span>`).join("")}</div><button class="btn primary small" onclick="toast('Demo application flow — connect your backend or careers URL here.')">${icon("external-link")} View opportunity</button></article>`;}

function renderFeedback(){
  const feedback=store.get("srai-feedback",[]);
  $("#view-feedback").innerHTML=`
    <div class="page-head"><span class="eyebrow">${icon("message-square-heart")} Product Feedback</span><h1>Feedback & Suggestions</h1><p>Help improve Smart Resume AI with your experience and ideas.</p></div>
    <div class="grid-3">
      <div class="card" style="grid-column:span 2">
        <form id="feedbackForm" class="stack-form">
          <label>Your rating</label>
          <div class="feedback-rating">${[1,2,3,4,5].map(n=>`<button type="button" class="star ${n<=state.rating?"active":""}" data-rating="${n}">${icon("star")}</button>`).join("")}</div>
          <label>What features would you like to see?<textarea name="feature" placeholder="Share your feature requests..."></textarea></label>
          <label>How can we improve?<textarea name="improve" placeholder="Your suggestions for improvement..."></textarea></label>
          <label>Tell us about your experience<textarea name="experience" placeholder="Share your experience with the app..."></textarea></label>
          <button class="btn primary" type="submit">${icon("send")} Submit feedback</button>
        </form>
      </div>
      <div class="card">
        <div class="card-icon">${icon("heart-handshake")}</div><h3>Thank you</h3>
        <p class="helper">Your feedback is saved locally in this demo and can be reviewed from the Admin Panel.</p>
        <div class="divider"></div><b>${feedback.length}</b><div class="helper">feedback responses stored</div>
      </div>
    </div>`;
  $$(".star").forEach(s=>s.onclick=()=>{state.rating=+s.dataset.rating;renderFeedback();});
  $("#feedbackForm").onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);store.push("srai-feedback",{rating:state.rating,feature:fd.get("feature"),improve:fd.get("improve"),experience:fd.get("experience"),createdAt:new Date().toISOString()});toast("Thank you — feedback saved.");renderFeedback();};
  lucide.createIcons();
}
function renderAbout(){
  $("#view-about").innerHTML=`
    <div class="page-head"><span class="eyebrow">${icon("circle-help")} About the platform</span><h1>Smart Resume AI</h1><p>A front-end-first career toolkit inspired by your original Streamlit application.</p></div>
    <div class="card" style="padding:30px;background:linear-gradient(135deg,var(--surface),var(--primary-soft));">
      <span class="eyebrow">${icon("target")} Vision</span><h2 style="font-family:'Plus Jakarta Sans';font-size:24px;margin:12px 0">Make professional career preparation more practical, measurable and accessible.</h2>
      <p class="muted" style="max-width:800px;line-height:1.8">The application combines resume analysis, resume creation, analytics, job discovery and feedback into one workspace. This version uses browser-side processing and local storage so it can run as a simple HTML/CSS/JS project without a Python server.</p>
    </div>
    ${sectionHead("Core capabilities","Built to mirror and extend the modules shown in your current website.")}
    <div class="about-grid">
      <div class="card"><div class="card-icon">${icon("brain-circuit")}</div><h3>Resume intelligence</h3><p class="helper">Role-specific keyword coverage, missing skills, ATS-style scoring and suggestions.</p></div>
      <div class="card"><div class="card-icon">${icon("layout-template")}</div><h3>Professional builder</h3><p class="helper">Live resume preview, templates, repeatable experience/projects/education sections and print.</p></div>
      <div class="card"><div class="card-icon">${icon("database")}</div><h3>Local data layer</h3><p class="helper">Analyses, feedback, builder drafts and theme preference persist in localStorage.</p></div>
    </div>
    ${sectionHead("Technology","No framework required.")}
    <div class="card"><div class="timeline">
      ${["HTML5 — semantic application structure","CSS3 — responsive design, theme variables, animations and component system","Vanilla JavaScript — SPA navigation, analysis engine, builder and admin workflows","Chart.js — analytics visualizations","PDF.js + Mammoth — browser-side PDF/DOCX text extraction","localStorage — demo persistence without a backend"].map((x,i)=>`<div class="timeline-item"><span class="timeline-dot"></span><div><h4>${esc(x.split(" — ")[0])}</h4><p>${esc(x.split(" — ")[1]||"")}</p></div></div>`).join("")}
    </div></div>`;
  lucide.createIcons();
}

function openAdmin(){
  $("#adminModal").classList.remove("hidden");
  if(state.adminLogged){$("#adminLoginView").classList.add("hidden");$("#adminPanelView").classList.remove("hidden");renderAdmin();}
  else {$("#adminLoginView").classList.remove("hidden");$("#adminPanelView").classList.add("hidden");}
  lucide.createIcons();
}
function renderAdmin(){
  const a=store.get("srai-analyses",[]), f=store.get("srai-feedback",[]), b=state.builder;
  $("#adminStats").innerHTML=[["Analyses",a.length],["Feedback",f.length],["Avg ATS",a.length?Math.round(a.reduce((x,y)=>x+y.ats,0)/a.length)+"%":"—"],["Builder","Saved"]].map(x=>`<div class="admin-stat"><span class="helper">${x[0]}</span><b>${x[1]}</b></div>`).join("");
  $$(".mini-tab").forEach(t=>t.classList.toggle("active",t.dataset.adminTab===state.adminTab));
  const c=$("#adminTabContent");
  if(state.adminTab==="overview") c.innerHTML=`<div class="callout">This admin panel is intentionally browser-only. For production, replace the demo login and localStorage with secure server-side authentication and a database.</div><div class="toolbar" style="margin-top:15px"><b>Data controls</b><div class="toolbar-actions"><button class="btn small" id="exportData">${icon("download")} Export JSON</button><button class="btn small danger" id="resetData">${icon("trash-2")} Reset demo data</button></div></div>`;
  if(state.adminTab==="feedback") c.innerHTML=adminFeedback(f);
  if(state.adminTab==="analyses") c.innerHTML=adminAnalyses(a);
  if(state.adminTab==="settings") c.innerHTML=`<div class="stack-form"><label>Demo admin ID<input value="admin" disabled></label><label>Demo password<input value="admin" disabled></label><p class="helper">These credentials are client-side and are not secure authentication. Use a backend for real admin access.</p></div>`;
  $("#exportData")?.addEventListener("click",exportData); $("#resetData")?.addEventListener("click",resetData);
  lucide.createIcons();
}
function adminFeedback(f){return `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Rating</th><th>Feature request</th><th>Improvement</th></tr></thead><tbody>${f.length?f.slice().reverse().map(x=>`<tr><td>${new Date(x.createdAt).toLocaleString()}</td><td>★ ${x.rating}</td><td>${esc(x.feature||"—")}</td><td>${esc(x.improve||"—")}</td></tr>`).join(""):`<tr><td colspan="4" class="empty">No feedback yet.</td></tr>`}</tbody></table></div>`;}
function adminAnalyses(a){return `<div class="table-wrap"><table><thead><tr><th>Date</th><th>Role</th><th>ATS</th><th>Keyword</th><th>Matched</th><th>Missing</th></tr></thead><tbody>${a.length?a.slice().reverse().map(x=>`<tr><td>${new Date(x.createdAt).toLocaleString()}</td><td>${esc(x.role)}</td><td><b>${x.ats}%</b></td><td>${x.keyword}%</td><td>${x.found.length}</td><td>${x.missing.length}</td></tr>`).join(""):`<tr><td colspan="6" class="empty">No analyses yet.</td></tr>`}</tbody></table></div>`;}
function exportData(){const data={analyses:store.get("srai-analyses",[]),feedback:store.get("srai-feedback",[]),builder:state.builder,exportedAt:new Date().toISOString()};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="smart-resume-ai-data.json";a.click();URL.revokeObjectURL(a.href);toast("Admin data exported.");}
function resetData(){if(!confirm("Reset all demo analyses, feedback and builder data?"))return;["srai-analyses","srai-feedback","srai-builder"].forEach(k=>localStorage.removeItem(k));state.builder={name:"",email:"",phone:"",location:"",linkedin:"",portfolio:"",summary:"",experience:[],projects:[],education:[],skills:"",languages:"",soft:"",tools:""};toast("Demo data reset.");renderAdmin();}
function closeModal(id){$("#"+id).classList.add("hidden");}

document.addEventListener("click",e=>{
  const nav=e.target.closest("[data-view]"); if(nav) navTo(nav.dataset.view);
  const close=e.target.closest("[data-close-modal]"); if(close) closeModal(close.dataset.closeModal);
  const adminTab=e.target.closest("[data-admin-tab]"); if(adminTab){state.adminTab=adminTab.dataset.adminTab;renderAdmin();}
  const remove=e.target.closest("[data-remove]"); if(remove){state.builder[remove.dataset.remove].splice(+remove.dataset.i,1);store.set("srai-builder",state.builder);renderBuilder();}
});
$("#adminLoginForm").addEventListener("submit",e=>{
  e.preventDefault();
  if($("#adminId").value==="admin" && $("#adminPassword").value==="admin"){state.adminLogged=true;sessionStorage.setItem("srai-admin","1");toast("Admin login successful.");openAdmin();}
  else toast("Invalid admin ID or password.","error");
});
$("#adminOpenBtn").onclick=openAdmin;
$("#adminLogout").onclick=()=>{state.adminLogged=false;sessionStorage.removeItem("srai-admin");$("#adminPanelView").classList.add("hidden");$("#adminLoginView").classList.remove("hidden");toast("Logged out.");};
$("#themeToggle").onclick=()=>setTheme(state.theme==="dark"?"light":"dark");
$("#topTheme").onclick=()=>setTheme(state.theme==="dark"?"light":"dark");
$("#mobileTheme").onclick=()=>setTheme(state.theme==="dark"?"light":"dark");
$("#mobileMenu").onclick=()=>$("#sidebar").classList.toggle("open");
$("#adminModal").addEventListener("click",e=>{if(e.target.id==="adminModal")closeModal("adminModal");});
document.addEventListener("keydown",e=>{if(e.key==="Escape") $$(".modal-backdrop").forEach(x=>x.classList.add("hidden"));});

window.addEventListener("DOMContentLoaded",()=>{
  setTheme(state.theme);
  navTo("home");
  // pdf.js v4 exposes the module globally in some browsers only after import;
  // configure it when available.
  setTimeout(()=>{ if(window.pdfjsLib && window.pdfjsLib.GlobalWorkerOptions) window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs"; },1000);
});
