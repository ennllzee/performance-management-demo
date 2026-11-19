(function () {
  "use strict";
  if (document.body.dataset.role !== "hr") return;
  const page = document.body.dataset.page,
    root = document.getElementById("pageContent");
  if (!root) return;
  const icon = (n) => `<i data-lucide="${n}"></i>`;
  const people = [
    {
      name: "Emma Wilson",
      team: "Product Design",
      department: "Design",
      role: "UX Designer",
      score: 4.7,
      previous: 4.2,
      goals: "4/4",
      type: "High Performer",
      manager: "James Wilson",
      note: "Mentoring and research handoffs exceed expectations.",
    },
    {
      name: "David Kim",
      team: "Product Design",
      department: "Design",
      role: "UX Designer",
      score: 2.7,
      previous: 2.9,
      goals: "1/3",
      type: "Low Performer",
      manager: "James Wilson",
      note: "Two goals incomplete; evidence flags missed delivery commitments.",
    },
    {
      name: "Sophia Chen",
      team: "Product Design",
      department: "Design",
      role: "UX Designer",
      score: 3.9,
      previous: null,
      goals: "3/4",
      type: "On Track",
      manager: "James Wilson",
      note: "New employee; no comparable previous cycle.",
    },
    {
      name: "Noah Patel",
      team: "Platform",
      department: "Engineering",
      role: "Software Engineer",
      score: 4.4,
      previous: 4.0,
      goals: "5/5",
      type: "High Performer",
      manager: "Olivia Brown",
      note: "Strong ownership and consistent engineering delivery.",
    },
    {
      name: "Alex Morgan",
      team: "Platform",
      department: "Engineering",
      role: "Software Engineer",
      score: 4.2,
      previous: 3.8,
      goals: "3/5",
      type: "On Track",
      manager: "Olivia Brown",
      note: "Collaboration and communication improved.",
    },
    {
      name: "Mia Garcia",
      team: "Platform",
      department: "Engineering",
      role: "Software Engineer",
      score: 3.5,
      previous: 3.7,
      goals: "2/4",
      type: "On Track",
      manager: "Olivia Brown",
      note: "Quality consistent; predictability needs support.",
    },
  ];
  const baseReports = [
    {
      title: "2025 Organization Performance Summary",
      author: "Olivia Brown",
      cycle: "2025",
      tags: ["Overview", "High Performers", "Low Performers"],
      scope: "Organization",
      date: "2026-01-15",
    },
    {
      title: "2025 Product Design Performance",
      author: "James Wilson",
      cycle: "2025",
      tags: ["Team Performance", "Skills"],
      scope: "Product Design",
      date: "2026-01-16",
    },
    {
      title: "2025 David Kim — Performance",
      author: "Olivia Brown",
      cycle: "2025",
      tags: ["Individual Performance", "Development"],
      scope: "David Kim",
      date: "2026-01-17",
    },
  ];
  const key = "pm-hr-workflow-v1";
  const read = () => {
    try {
      return JSON.parse(sessionStorage.getItem(key) || "{}");
    } catch {
      return {};
    }
  };
  const save = (s) => {
    sessionStorage.setItem(key, JSON.stringify(s));
    render();
  };
  let s = {
    ...{
      stage: "review",
      reminded: [],
      extended: [],
      resolved: false,
      calibrated: false,
      selected: "all",
      dashboardCycle: "2025",
      dashboardSkill: "Overall", orgCompare: "2024", orgTopic: "Overall",
      dashboardCompare: "2024",
      dashboardMode: "active",
      compareScope: "employees", compareFilter: "all", compareDepartment: "all", compareTeam: "all", compareRole: "all", compareYear: "none", compareSelection: [],
      orgRecap: 0,
      employeeCycle: "2025",
      employeeSkill: "Overall",
      cycleTab: "active",
      cycleYear: "all",
      cycleStatus: "all",
      cycleAction: "",
      department: "all",
      team: "all",
      employee: "",
      year: "2025",
      reportFilter: "",
      reportTag: "all",
      reportCycle: "all",
      reportAuthor: "all",
      reports: [],
      view: "",
      scope: "Organization",
    },
    ...read(),
  };
  const safe = (t) =>
    String(t ?? "").replace(
      /[&<>"']/g,
      (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c],
    );
  const av = (p) =>
    `<span class="hr-avatar">${p.name
      .split(" ")
      .map((n) => n[0])
      .join("")}</span>`;
  const cls = (p) =>
    `<span class="hr-chip ${p.type === "High Performer" ? "high" : p.type === "Low Performer" ? "low" : ""}">${p.type}</span>`;
  const button = (text, action, style = "") =>
    `<button type="button" class="hr-button ${style}" data-action="${action}">${text}</button>`;
  const select = (id, label, options, val) =>
    `<label class="hr-filter">${label}<select data-filter="${id}">${options.map(([v, t]) => `<option value="${safe(v)}" ${v === val ? "selected" : ""}>${safe(t)}</option>`).join("")}</select></label>`;
  const skillNames = ["Quality", "Communication", "Collaboration", "Ownership"];
  const skillScore = (p, skill, previous = false) => {
    const score = previous ? p.previous : p.score;
    if (score == null) return null;
    const offsets = {
      Quality: 0.15,
      Communication: -0.12,
      Collaboration: 0.22,
      Ownership: -0.25,
    };
    return Math.min(5, Math.max(1, score + (offsets[skill] || 0)));
  };
  const cyclePeriod = "January 1 – December 31, 2026";
  const demo = () => {
    try {
      return JSON.parse(sessionStorage.getItem("pm-demo-settings-v1") || "{}");
    } catch {
      return {};
    }
  };
  const isActive = () => demo().cycle !== "none";
  const periodBanner = (title, description, action = "") =>
    `<section class="hr-cycle-banner"><div><small>${isActive() ? "ACTIVE REVIEW CYCLE" : "LAST FINALIZED CYCLE"} · ${cyclePeriod}</small><h3>${title}</h3><p>${description}</p></div>${action}</section>`;
  const avg = (arr) =>
    arr.length
      ? (arr.reduce((n, p) => n + p.score, 0) / arr.length).toFixed(2)
      : "—";
  const header = (title, desc) => ""; // Page title already supplied by the shared app shell
  const personRow = (p) =>
    `<div class="hr-person">${av(p)}<div><strong>${p.name}</strong><small>${p.team} · ${p.role}</small></div><strong>${p.score.toFixed(1)} / 5</strong>${cls(p)}${button("Details", "person:" + p.name)}</div>`;
  const cards = (arr) =>
    `<div class="hr-grid">${arr.map(([title, value, desc]) => `<article class="hr-panel hr-stat"><small>${title}</small><strong>${value}</strong><span>${desc}</span></article>`).join("")}</div>`;
  function chartRows(data, skill = "Overall", comparison = false) {
    const benchmark = Number(avg(people));
    return `<div class="hr-chart-key">Employee average benchmark: <strong>${benchmark.toFixed(2)} / 5</strong>${comparison ? " · muted bar: previous year" : ""}</div>${data
      .map((p) => {
        const value = skillScore(p, skill),
          old = comparison ? skillScore(p, skill, true) : null;
        return `<div class="hr-score-row"><div class="hr-score-label"><strong>${p.name}</strong><small>${p.team}</small></div><div class="hr-score-track">${old != null ? `<span class="hr-score-previous" style="width:${old * 20}%"></span>` : ""}<span class="hr-score-current" style="width:${value * 20}%"></span><i style="left:${benchmark * 20}%" title="Organization employee average"></i></div><strong>${value.toFixed(2)}</strong>${old != null ? `<small class="${value - old >= 0 ? "hr-up" : "hr-down"}">${value - old >= 0 ? "+" : ""}${(value - old).toFixed(2)}</small>` : ""}</div>`;
      })
      .join("")}`;
  }
  function organizationRecap() {
    const slideData = [
      ['sparkles','A Year of Growth','2025 ORGANIZATION RECAP','Six colleagues across Design and Engineering. A year of learning, delivery and stronger collaboration.'],
      ['chart-no-axes-combined','Our Performance','PEOPLE & PROGRESS','Average employee performance: '+avg(people)+' / 5. Two high performers, three on track, and one colleague requiring focused support.'],
      ['trophy','What Went Well','OUR STRENGTHS','Cross-team delivery improved. Platform achieved 4.03 / 5; Product Design achieved 3.77 / 5. Peer mentoring was repeatedly recognized.'],
      ['messages-square','What People Told Us','FEEDBACK & REQUESTS','Most requested: AI productivity tools, UX and research courses, mentorship opportunities, clearer career progression, and predictable planning.'],
      ['heart-handshake','Where We Can Improve','SUPPORT & DEVELOPMENT','Product Design needs delivery coaching and workload support. Engineering requested more documentation and sustainable release planning.'],
      ['target','Our Next Chapter','2026 PRIORITIES','Invest in learning budgets, introduce AI-tool pilots, improve manager check-ins, and monitor progress with consistent evidence.'],
      ['party-popper','Thank You','ONE TEAM, SHARED PROGRESS','Great work comes from listening, learning and improving together. Share this recap with your team.']
    ];
    const i=Math.max(0,Math.min(s.orgRecap,slideData.length-1));
    const [ic,title,kicker,description]=slideData[i];
    const html=`<div class="hr-recap-story theme-${i%4}"><div class="hr-story-top"><span>EMPEO · ORGANIZATION RECAP</span><span>${i+1} / ${slideData.length}</span></div><div class="hr-story-progress">${slideData.map((_,j)=>`<span class="${j<=i?'active':''}"></span>`).join('')}</div><div class="hr-story-main"><div class="hr-story-icon">${icon(ic)}</div><span class="hr-story-kicker">${kicker}</span><h2>${title}</h2><p>${description}</p></div><div class="hr-story-footer">${button('Previous','recap-prev',i===0?'disabled':'')}${i===slideData.length-1?button('Share recap','share-recap'):button('Next story','recap-next')}</div></div>`;
    document.querySelectorAll('.hr-modal-wrap').forEach(el=>el.remove());
    modal(html,'recap');
  }
  function dashboard() {
    const skill=s.dashboardSkill||'Overall',mode=s.compareScope||'employees';
    const teams=[...new Set(people.map(p=>p.team))],departments=[...new Set(people.map(p=>p.department))],roles=[...new Set(people.map(p=>p.role))];
    const average=(arr)=>arr.length?arr.reduce((n,p)=>n+skillScore(p,skill),0)/arr.length:0;
    const org=average(people),department=s.compareDepartment||'all',team=s.compareTeam||'all';
    const scope=mode==='departments'?departments.map(name=>({name,subtitle:'Department',members:people.filter(p=>p.department===name)})):mode==='teams'?teams.filter(t=>department==='all'||people.some(p=>p.team===t&&p.department===department)).map(name=>({name,subtitle:people.find(p=>p.team===name).department,members:people.filter(p=>p.team===name)})):people.filter(p=>(department==='all'||p.department===department)&&(team==='all'||p.team===team)&&((s.compareRole||'all')==='all'||p.role===s.compareRole)).map(p=>({name:p.name,subtitle:p.team+' · '+p.role,members:[p],person:p}));
    const selected=(s.compareSelection||[]);const rows=scope.filter(x=>!selected.length||selected.includes(x.name));
    const refs=[{label:'All employees average',value:org,cls:'org'}];
    if(s.compareFilter==='department'&&department!=='all')refs.push({label:`${department} average`,value:average(people.filter(p=>p.department===department)),cls:'department'});
    if(s.compareFilter==='team'&&team!=='all')refs.push({label:`${team} average`,value:average(people.filter(p=>p.team===team)),cls:'team'});
    const compare=`<div class="pm-manager-chart hr-reused-employee-chart"><div class="pm-manager-benchmark">${safe(skill)} · Comparison for Annual Review ${safe(s.dashboardCycle)}</div><div class="hr-comparison-legend">${refs.map(x=>`<span class="hr-legend-item ${x.cls}"><i></i>${safe(x.label)}: ${x.value.toFixed(2)} / 5</span>`).join('')}${s.compareYear!=='none'?'<span class="hr-legend-item previous"><i></i>Previous cycle</span>':''}</div>${rows.map(x=>{const v=average(x.members),prior=x.members.filter(p=>p.previous!=null),old=prior.length?prior.reduce((n,p)=>n+skillScore(p,skill,true),0)/prior.length:null;return `<div class="pm-compare-employee"><div class="pm-compare-name"><strong>${safe(x.name)}</strong><small>${safe(x.subtitle)}</small></div><div class="pm-compare-track-wrap"><div class="pm-manager-track">${s.compareYear!=='none'&&old!=null?`<div class="pm-compare-old" style="width:${old*20}%"></div>`:''}<div class="pm-manager-fill ${v<3?'low':v>=4.3?'high':''}" style="width:${v*20}%"></div>${refs.map(ref=>`<span class="pm-manager-ref hr-ref-${ref.cls}" style="left:${ref.value*20}%" title="${safe(ref.label)}: ${ref.value.toFixed(2)}"></span>`).join('')}</div><div class="pm-compare-metrics"><strong>${v.toFixed(2)}</strong>${s.compareYear!=='none'&&old!=null?`<small class="${v>=old?'pm-positive':'pm-negative'}">${v>=old?'+':''}${(v-old).toFixed(2)}</small>`:''}</div></div><span class="pm-compare-end-avatar ${v<3?'low':v>=4.3?'high':''}" title="${safe(x.name)}">${safe(x.name.split(' ').map(w=>w[0]).join('').slice(0,2))}</span></div>`}).join('')||'<p>No matching results. Adjust the selection.</p>'}</div>`;
    const options=(id,label,items,current)=>select(id,label,items.map(x=>[x,x]),current);
    const highlights=(kind)=>teams.map(t=>{const members=people.filter(p=>p.team===t&&p.type===kind);return members.length?`<div class="hr-performer-group"><h4>${safe(t)}</h4><div class="pm-performer-avatars">${members.map(p=>`<button type="button" class="pm-performer-avatar ${kind==='High Performer'?'high':'low'} hr-performer-avatar" data-action="employee:${safe(p.id)}" title="${safe(p.name)} · ${safe(p.team)} · ${safe(p.role)}" aria-label="View ${safe(p.name)} details"><span class="pm-avatar">${safe(p.name.split(' ').map(w=>w[0]).join('').slice(0,2))}</span><span class="pm-performer-info"><strong>${safe(p.name)}</strong><small>${safe(p.team)} · ${safe(p.role)}</small></span></button>`).join('')}</div></div>`:''}).join('');
    const skillTags=`<div class="hr-skill-picker hr-chart-tags"><small>Score / Skill</small><div class="hr-skill-tags">${['Overall',...skillNames].map(n=>`<button type="button" data-action="skill:${n}" class="${skill===n?'active':''}">${n}</button>`).join('')}</div></div>`;

    return `${isActive()?periodBanner('Annual Performance Review 2026','4 of 6 employees completed all required assessments.',button('Review submissions','goto:review-cycles.html')):periodBanner('2025 Organization Recap','Organization-wide results, feedback themes and development opportunities.',button('Watch Recap','org-recap'))}
    <section class="hr-panel pm-cycle-selector">${select('dashboardCycle','Finalized Review Cycle',[['2025','Annual Review 2025'],['2024','Annual Review 2024']],s.dashboardCycle)}</section>
    <section class="hr-panel hr-overview-panel"><h3>Overview</h3><div class="pm-team-overview"><div class="pm-team-overall"><small>Average overall employee score</small><strong>${avg(people)} / 5</strong><span>${people.length} employees · ${safe(s.dashboardCycle)}</span></div><div class="pm-team-strength"><small>High performers</small><strong>${people.filter(p=>p.type==='High Performer').length} employees</strong><span>Across all departments</span><small>Low performers</small><strong>${people.filter(p=>p.type==='Low Performer').length} employees</strong><span>Need focused support</span></div><div class="pm-team-skill-scores">${skillNames.map(n=>`<div><span>${safe(n)}</span><strong>${(people.reduce((sum,p)=>sum+skillScore(p,n),0)/people.length).toFixed(2)} / 5</strong></div>`).join('')}</div></div></section>
    <section class="hr-panel hr-highlight-panel"><h3>Performance Highlights</h3><div class="pm-performer-columns"><section><h3>High Performers</h3>${highlights('High Performer')}</section><section><h3>Low Performers</h3>${highlights('Low Performer')}</section></div></section>
    <section class="hr-panel"><h3>Performance Comparison</h3><div class="hr-toolbar">${select('compareScope','Compare',[['departments','Departments'],['teams','Teams'],['employees','Employees']],mode)}${select('compareYear','Compare with',[['none','Current cycle only'],['previous','Previous review cycle']],s.compareYear||'none')}</div><div class="hr-toolbar">${mode!=='departments'?select('compareDepartment','Department',[['all','All Departments'],...departments.map(x=>[x,x])],department):''}${mode==='employees'?select('compareTeam','Team',[['all','All Teams'],...teams.filter(t=>department==='all'||people.some(p=>p.team===t&&p.department===department)).map(x=>[x,x])],team):''}${mode==='employees'?select('compareRole','Role',[['all','All Roles'],...roles.map(x=>[x,x])],s.compareRole||'all'):''}${mode!=='departments'?select('compareFilter','Benchmark',[['all','All employees average'],...(department!=='all'?[['department','All employees + department average']]:[]),...(mode==='employees'&&team!=='all'?[['team','All employees + team average']]:[])],s.compareFilter||'all'):''}</div><div class="hr-comparison-select"><strong>Select ${mode}</strong><div>${scope.map(x=>`<label><input type="checkbox" data-compare-member="${safe(x.name)}" ${!selected.length||selected.includes(x.name)?'checked':''}> ${safe(x.name)}</label>`).join('')}</div></div>${compare}${skillTags}</section>
    <section class="hr-panel hr-organization-evaluation"><h3>Organization Evaluation</h3><p class="hr-muted">Organization-wide practices and employee feedback, independent of individual performance ratings.</p><div class="pm-two-col"><section class="pm-panel"><div class="hr-org-head"><div><h3>Organization Evaluation Dashboard</h3><p class="hr-muted">Topic scores from organization assessments</p></div>${select('orgCompare','Compare across review cycles',[['none','No comparison'],['2024','Annual Review 2024'],['2023','Annual Review 2023']],s.orgCompare||'2024')}</div><div class="hr-org-chart">${[['Collaboration',4.1,3.8,3.6],['Learning & Development',3.4,3.6,3.2],['Tools & Resources',3.1,3.3,3.0],['Leadership & Communication',3.9,3.7,3.5]].filter(([n])=>s.orgTopic==='Overall'||!s.orgTopic||s.orgTopic===n).map(([n,v,y24,y23])=>{const old=s.orgCompare==='2023'?y23:y24;return `<div class="hr-org-row"><div class="hr-org-label"><strong>${n}</strong><span>${v.toFixed(1)} / 5 ${s.orgCompare!=='none'?`<em class="${v>=old?'hr-up':'hr-down'}">${v>=old?'+':''}${(v-old).toFixed(1)}</em>`:''}</span></div><div class="hr-org-track">${s.orgCompare!=='none'?`<span class="hr-org-old" style="width:${old*20}%"></span>`:''}<span class="hr-org-now" style="width:${v*20}%"></span></div></div>`}).join('')}</div><div class="hr-skill-tags hr-org-tags">${['Overall','Collaboration','Learning & Development','Tools & Resources','Leadership & Communication'].map(n=>`<button type="button" class="${(s.orgTopic||'Overall')===n?'active':''}" data-action="org-topic:${n}">${n}</button>`).join('')}</div><div class="hr-comparison-legend"><span class="hr-legend-item"><i></i>2025 evaluation</span>${s.orgCompare!=='none'?`<span class="hr-legend-item previous"><i></i>${s.orgCompare} evaluation</span>`:''}</div></section><section class="pm-panel"><h3>Feedback & Requests</h3><div class="hr-feedback-themes"><article><strong>Tools & Resources</strong><p>Requests for AI productivity tools, better documentation and workflow automation.</p></article><article><strong>Learning & Growth</strong><p>UX courses, learning budgets, mentorship and clearer career progression.</p></article><article><strong>Working Practices</strong><p>More predictable cross-team planning and transparent communication.</p></article></div></section></div></section>`;
  }

  function employees() {
    let data = people.filter(
      (p) =>
        (s.department === "all" || p.department === s.department) &&
        (s.team === "all" || p.team === s.team) &&
        `${p.name} ${p.role}`.toLowerCase().includes(s.employee.toLowerCase()),
    );
    const sorter = {
      all: () => 0,
      "score-desc": (a, b) => b.score - a.score,
      "score-asc": (a, b) => a.score - b.score,
      name: (a, b) => a.name.localeCompare(b.name),
      trend: (a, b) =>
        b.score - (b.previous ?? b.score) - (a.score - (a.previous ?? a.score)),
    };
    data.sort(sorter[s.selected] || sorter["all"]);
    return `${header("Employees", "Search and compare employees; open a profile to inspect historical evidence and development.")}
<div class="hr-toolbar"><label class="hr-filter">Search<input data-filter="employee" value="${safe(s.employee)}" placeholder="Name or role"></label>${select(
      "department",
      "Department",
      [
        ["all", "All Departments"],
        ["Design", "Design"],
        ["Engineering", "Engineering"],
      ],
      s.department,
    )}${select(
      "team",
      "Team",
      [
        ["all", "All Teams"],
        ["Product Design", "Product Design"],
        ["Platform", "Platform"],
      ],
      s.team,
    )}${select(
      "selected",
      "Sort by",
      [
        ["score-desc", "Score: High to Low"],
        ["score-asc", "Score: Low to High"],
        ["trend", "Largest Improvement"],
        ["name", "Name: A–Z"],
      ],
      s.selected,
    )}</div>
<section class="hr-panel"><h3>Employee Directory · ${data.length} results</h3><div class="hr-table-scroll"><table class="hr-table"><thead><tr><th>Employee</th><th>Department / Team</th><th>Role</th><th>Score</th><th>Trend</th><th>Action</th></tr></thead><tbody>${data.map((p) => `<tr><td><span class="hr-inline-profile">${av(p)}<strong>${p.name}</strong></span></td><td>${p.department}<small>${p.team}</small></td><td>${p.role}</td><td>${p.score.toFixed(1)} / 5</td><td>${p.previous == null ? "New" : (p.score - p.previous >= 0 ? "+" : "") + (p.score - p.previous).toFixed(1)}</td><td>${button("Details", "person:" + p.name)}</td></tr>`).join("")}</tbody></table></div></section>`;
  }
  const overdue = [
    { id: "self", name: "Sarah Lee", task: "Self Assessment", days: 2 },
    {
      id: "manager",
      name: "James Wilson",
      task: "Manager Assessment",
      days: 5,
    },
  ];
  const historyCycles = [
    {
      name: "Annual Performance Review 2026",
      year: "2026",
      status: "In progress",
      date: "Jan 1 – Dec 31, 2026",
    },
    {
      name: "Annual Performance Review 2025",
      year: "2025",
      status: "Finalized",
      date: "Jan 1 – Dec 31, 2025",
    },
    {
      name: "Midyear Review 2026",
      year: "2026",
      status: "Completed",
      date: "Jan 1 – Jun 30, 2026",
    },
    {
      name: "Leadership Review 2027",
      year: "2027",
      status: "Draft",
      date: "Jan 1 – Dec 31, 2027",
    },
    {
      name: "Development Review 2027",
      year: "2027",
      status: "Pending",
      date: "Jul 1 – Dec 31, 2027",
    },
    {
      name: "Canceled Review 2024",
      year: "2024",
      status: "Canceled",
      date: "Jan 1 – Dec 31, 2024",
    },
  ];
  function cycleHistory() {
    const records = historyCycles.filter(
      (c) =>
        (s.cycleYear === "all" || s.cycleYear === c.year) &&
        (s.cycleStatus === "all" || s.cycleStatus === c.status),
    );
    return `<section class="hr-panel"><div class="hr-row"><h3>Cycle History</h3>${button("Create Cycle", "create-cycle")}</div><div class="hr-toolbar">${select("cycleYear", "Year", [["all", "All Years"], ...["2027", "2026", "2025", "2024"].map((y) => [y, y])], s.cycleYear)}${select("cycleStatus", "Status", [["all", "All Statuses"], ...["Canceled", "Draft", "Pending", "In progress", "Completed", "Finalized"].map((x) => [x, x])], s.cycleStatus)}</div>${records.map((c) => `<div class="hr-row"><div><strong>${c.name}</strong><p>${c.date.replace(/January 1 – December 31/g, "October 1 – November 15").replace(/Jan 1 – Dec 31/g, "Oct 1 – Nov 15")} · ${c.status}</p></div><div class="hr-actions">${c.status === "Canceled" ? button("Reactivate", "cycle-reactivate:" + c.name) : c.status === "Draft" ? button("Edit", "cycle-edit:" + c.name) + button("Remove", "cycle-remove:" + c.name) : c.status === "Pending" ? button("Cancel", "cycle-cancel:" + c.name) : c.status === "In progress" ? button("Manage", "cycle-manage") : c.status === "Completed" ? button("Finalize", "cycle-manage") : button("Generate Report", "cycle-generate:" + c.name) + button("Release Results", "cycle-release:" + c.name)}</div></div>`).join("") || "<p>No matching cycles.</p>"}</section>`;
  }
  function cycleActive() {
    const missing = overdue.filter((x) => !s.extended.includes(x.id));
    const canFinalize = missing.length === 0 && s.resolved;
    const stage = s.stage;
    return `${periodBanner("Annual Performance Review 2026", "4 of 6 employees have submitted all required assessments · active period " + cyclePeriod)}<section class="hr-panel"><h3>Employee Submission Progress</h3><div class="hr-progress"><div style="width:66.7%"></div></div><p>4 / 6 employees completed · 2 employees have outstanding tasks</p><p class="hr-muted">Progress counts employees who have completed every required assessment, not individual forms.</p></section>${stage === "review" ? `<section class="hr-panel"><h3>Outstanding Employee Submissions</h3>${overdue.map((x) => `<div class="hr-row"><div><strong>${x.name}</strong><p>Remaining: ${x.task} · ${x.days} days overdue</p></div><div class="hr-actions">${s.extended.includes(x.id) ? '<span class="hr-chip high">Extension approved</span>' : `${button(s.reminded.includes(x.id) ? "Reminder sent" : "Send reminder", "remind:" + x.id, s.reminded.includes(x.id) ? "disabled" : "")}${button("Approve extension", "extend:" + x.id)}`}</div></div>`).join("")}<h4>Assessment change requests</h4><p>Managers can request a correction. HR reviews evidence before rejecting or reopening an assessment.</p>${button("Review change requests", "change-request")}</section><section class="hr-panel"><h3>Close Assessment Collection</h3><p>Resolve outstanding tasks and transfer cases before finalization.</p><div class="hr-warning">${icon("users")} Multi-team case: David Kim · Product Design → Platform</div>${s.resolved ? '<p class="hr-success">Consolidation confirmed.</p>' : button("Resolve multi-team evaluation", "resolve")}<h4>Rating consistency & optional calibration</h4><p>Compare manager averages against shared behavioral criteria. Calibration is optional and does not force a bell curve.</p><div class="hr-meter"><span>Design</span><div><b style="width:75.4%"></b></div><strong>3.77</strong></div><div class="hr-meter"><span>Engineering</span><div><b style="width:80.6%"></b></div><strong>4.03</strong></div>${s.calibrated ? '<p class="hr-success">Calibration reviewed and documented.</p>' : button("Record calibration review", "calibrate")}<h4>Finalize and generate recaps</h4><p>Generate employee, team and organization recap previews from finalized evidence (AI generation is simulated in this prototype).</p>${button("Preview generated recaps", "org-recap")}${!canFinalize ? `<p class="hr-muted">Resolve ${missing.length} overdue tasks and ${s.resolved ? 0 : 1} consolidation case(s) first.</p>` : ""}${button("Finalize & Summarize", "summarize", canFinalize ? "" : "disabled")}</section>` : `<section class="hr-panel"><h3>${stage === "summarized" ? "Finalized · Ready for Release" : "Released to All Employees"}</h3><p>${stage === "summarized" ? "All eligible employee results remain restricted until one cycle-wide release." : "All eligible employees received access simultaneously."}</p><div class="hr-actions">${button("Preview recap", "org-recap")}${button("Generate Report", "generate-report")}${button("Export CSV", "export")}${stage === "summarized" ? button("Release All Results", "release") : ""}</div></section>`}`;
  }
  function cycles() {
    const active = isActive();
    return `${header("Review Cycles", "Manage assessment collection, exceptions, finalization and simultaneous release.")}${active ? `<nav class="hr-tabs"><button data-action="cycle-tab:active" class="${s.cycleTab === "active" ? "active" : ""}">Annual Review 2026</button><button data-action="cycle-tab:history" class="${s.cycleTab === "history" ? "active" : ""}">Review Cycles</button></nav>${s.cycleTab === "history" ? cycleHistory() : cycleActive()}` : cycleHistory()}`;
  }
  function reports() {
    const reports = [...s.reports, ...baseReports];
    let data = reports.filter(
      (r) =>
        (s.reportCycle === "all" || r.cycle === s.reportCycle) &&
        (s.reportAuthor === "all" || r.author === s.reportAuthor) &&
        (s.reportTag === "all" || r.tags.includes(s.reportTag)) &&
        `${r.title} ${r.scope} ${r.tags.join(" ")}`
          .toLowerCase()
          .includes(s.reportFilter.toLowerCase()),
    );
    return `${header("Report History", "Saved report snapshots, including their author, topics, cycle, and covered scope.")}
<div class="hr-toolbar"><label class="hr-filter">Search report, employee, team, department<input data-filter="reportFilter" value="${safe(s.reportFilter)}" placeholder="Search reports"></label>${select(
      "reportAuthor",
      "Author",
      [
        ["all", "All Authors"],
        ["Olivia Brown", "Olivia Brown"],
        ["James Wilson", "James Wilson"],
      ],
      s.reportAuthor,
    )}${select(
      "reportCycle",
      "Cycle",
      [
        ["all", "All Cycles"],
        ["2026", "2026"],
        ["2025", "2025"],
      ],
      s.reportCycle,
    )}${select("reportTag", "Topic", [["all", "All Topics"], ...["Overview", "High Performers", "Low Performers", "Team Performance", "Skills", "Individual Performance", "Development", "Calibration"].map((t) => [t, t])], s.reportTag)}</div>
<section class="hr-panel"><h3>Generated reports · ${data.length}</h3>${data.map((r, i) => `<div class="hr-row"><div><strong>${safe(r.title)}</strong><p>${r.date} · ${r.author} · ${r.cycle} · ${r.scope}</p><div class="hr-tags">${r.tags.map((t) => `<span class="hr-chip">${t}</span>`).join("")}</div></div><div class="hr-actions">${button("View", "report:" + i)}${button("Export CSV", "report-export:" + i)}</div></div>`).join("") || "<p>No reports match the selected filters.</p>"}</section>`;
  }
  function modal(html, kind = "generic") {
    document.querySelector(".hr-modal-wrap")?.remove();
    document.querySelectorAll('.hr-modal-wrap').forEach(el=>el.remove());
    const d = document.createElement("div");
    d.className = "hr-modal-wrap";
    d.innerHTML = `<div class="hr-modal ${kind === "person" ? "hr-employee-detail" : kind === "recap" ? "hr-recap-modal" : ""}" role="dialog" aria-modal="true" aria-label="${kind === "person" ? "Employee performance details" : "Details"}"><button type="button" class="hr-close" aria-label="Close details">×</button><div class="hr-modal-body">${html}</div></div>`;
    document.body.appendChild(d);
    d.addEventListener("click", (e) => {
      if (e.target === d || e.target.closest(".hr-close")) d.remove();
    });
    d.addEventListener("change", (e) => {
      const k = e.target.dataset.filter;
      if (
        kind === "person" &&
        (k === "employeeSkill" || k === "employeeCycle")
      ) {
        s[k] = e.target.value;
        const y = d.querySelector(".hr-modal").scrollTop;
        const name = d.dataset.person;
        personDetail(name);
        const current = document.querySelector(".hr-modal");
        if (current) current.scrollTop = y;
      }
    });
    window.lucide?.createIcons();
    return d;
  }
  function personDetail(name) {
    const p=people.find(x=>x.name===name);if(!p)return;
    const skill=s.employeeSkill||'Overall',cycle=s.employeeCycle||'2025';
    const historical=[{year:'2023',score:p.previous==null?null:Math.max(1,p.previous-.25),team:p.team,role:p.role},{year:'2024',score:p.previous,team:p.team,role:p.role},{year:'2025',score:p.score,team:p.team,role:p.role}];
    const current=historical.find(h=>h.year===cycle)||historical[2];
    const latest=current.score;
    const values=historical.map(h=>h.score==null?null:skillScore({...p,score:h.score},skill));
    const x=i=>56+i*142,y=v=>200-(v-1)*39;
    const dots=values.map((v,i)=>v==null?'':`<circle cx="${x(i)}" cy="${y(v)}" r="6" fill="#f47735"><title>${historical[i].year}: ${v.toFixed(2)} / 5 · ${historical[i].team} · ${historical[i].role}</title></circle><text x="${x(i)}" y="228" text-anchor="middle" font-size="12" fill="#747d89">${historical[i].year}</text>`).join('');
    const path=values.map((v,i)=>v==null?'':`${i===0?'M':'L'} ${x(i)} ${y(v)}`).filter(Boolean).join(' ');
    const trend=latest==null||p.previous==null?'<span class="hr-trend neutral">New employee · no previous record</span>':`<span class="hr-trend ${latest>=p.previous?'up':'down'}">${latest>=p.previous?'↗ +':'↘ '}${(latest-p.previous).toFixed(2)} vs previous cycle</span>`;
    const count=parseInt(p.goals.split('/')[0],10),total=parseInt(p.goals.split('/')[1],10);
    const goalNames=p.department==='Design'?['Improve user research handoffs','Deliver accessible design improvements','Run usability testing sessions','Share design system knowledge']:['Improve release reliability','Document technical decisions','Support cross-team delivery','Improve automated test coverage','Mentor team members'];
    const goals=Array.from({length:total},(_,i)=>({name:goalNames[i%goalNames.length],done:i<count}));
    const content=`<div class="hr-person-header">${av(p)}<div><h2>${safe(p.name)}</h2><p>${safe(p.role)} · ${safe(p.team)} · ${safe(p.department)}</p><small>Manager: ${safe(p.manager)}</small></div></div>
    <section class="hr-detail-section hr-growth-detail"><h3>Growth by Skill</h3><p class="hr-muted">Scores across review cycles · hover over each point for role and team.</p><div class="hr-skill-tags hr-employee-skill-tags">${['Overall',...skillNames].map(n=>`<button type="button" data-employee-skill="${n}" class="${skill===n?'active':''}">${n}</button>`).join('')}</div><div class="hr-growth-chart"><svg viewBox="0 0 380 250" role="img" aria-label="${safe(skill)} score growth over time">${[1,2,3,4,5].map(v=>`<line x1="45" x2="355" y1="${y(v)}" y2="${y(v)}" stroke="#e7e9ed"/><text x="30" y="${y(v)+4}" text-anchor="end" font-size="11" fill="#747d89">${v}</text>`).join('')}${path?`<path d="${path}" fill="none" stroke="#f47735" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`:''}${dots}</svg></div><div class="hr-growth">${historical.map((h,i)=>`<div><strong>${h.year} · ${values[i]==null?'No record':values[i].toFixed(2)+' / 5'}</strong><span>${safe(h.team)}</span><small>${safe(h.role)}</small></div>`).join('')}</div></section>
    <section class="hr-detail-section hr-history-detail"><h3>Performance History</h3><div class="hr-full-cycle">${select('employeeCycle','Review Cycle',[['2025','Annual Review 2025'],['2024','Annual Review 2024'],['2023','Annual Review 2023']],cycle)}</div><div class="hr-detail-metrics"><article><small>Classification</small><strong>${cls({...p,type:latest==null?'New Employee':latest>=4.3?'High Performer':latest<3?'Low Performer':'On Track'})}</strong></article><article><small>Overall Score</small><strong>${latest==null?'No record':latest.toFixed(2)+' / 5'}</strong>${trend}</article><article><small>Strongest Skill</small><strong>Collaboration</strong></article><article><small>Growth Area</small><strong>Ownership</strong></article></div><div class="hr-history-scores"><h3>All Skill Scores</h3><div class="pm-detail-rows">${skillNames.map(n=>`<div><span>${n}</span><strong>${latest==null?'No record':skillScore({...p,score:latest},n).toFixed(2)+' / 5'}</strong></div>`).join('')}</div></div><div class="hr-history-goals"><h3>Goals</h3><div class="hr-goal-list">${goals.map(g=>`<div><span class="hr-goal-icon ${g.done?'complete':'pending'}">${g.done?'✓':'◷'}</span><span>${safe(g.name)}</span><strong class="${g.done?'hr-goal-done':'hr-goal-pending'}">${g.done?'Completed':'In progress'}</strong></div>`).join('')}</div></div></section>`;
    const d=modal(content,'person');d.dataset.person=name;
    d.addEventListener('click',e=>{const b=e.target.closest('[data-employee-skill]');if(!b)return;s.employeeSkill=b.dataset.employeeSkill;const y=d.querySelector('.hr-modal').scrollTop;personDetail(name);const next=document.querySelector('.hr-modal');if(next)next.scrollTop=y;});
  }
  function reportView(i) {
    const r = [...s.reports, ...baseReports][i];
    if (!r) return;
    modal(
      `<h2>${safe(r.title)}</h2><p>Generated ${r.date} by ${r.author}</p><p><strong>Cycle:</strong> ${r.cycle} · <strong>Scope:</strong> ${r.scope}</p><p><strong>Included topics:</strong> ${r.tags.join(", ")}</p><p>Historical snapshot. Later changes require a new version; existing reports are not silently overwritten.</p>`,
    );
  }
  function csv(name, rows) {
    const str = rows
      .map((r) =>
        r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(","),
      )
      .join("\r\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(
      new Blob([str], { type: "text/csv;charset=utf-8" }),
    );
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
  }
  function render() {
    root.innerHTML =
      page === "dashboard"
        ? dashboard()
        : page === "employees"
          ? employees()
          : page === "review-cycles"
            ? cycles()
            : reports();
    document.getElementById("cycleBadge")?.remove();
    window.lucide?.createIcons();
  }
  root.addEventListener("change", (e) => {
    const k = e.target.dataset.filter;
    if (k) {
      s[k] = e.target.value;
      if (k === "department") s.team = "all";
      if (k === "compareDepartment") {s.compareTeam="all";s.compareFilter="all";s.compareSelection=[];}
      if (k === "compareTeam") {s.compareFilter="all";s.compareSelection=[];}
      if (k === "compareScope") {s.compareFilter="all";s.compareSelection=[];}
      save(s);
    }
  });
  root.addEventListener("input", (e) => {
    const k = e.target.dataset.filter;
    if (k === "employee" || k === "reportFilter") {
      const pos = e.target.selectionStart;
      s[k] = e.target.value;
      save(s);
      const el = root.querySelector(`[data-filter="${k}"]`);
      el?.focus();
      el?.setSelectionRange(pos, pos);
    }
  });
  root.addEventListener("change",e=>{const box=e.target.closest('[data-compare-member]');if(!box)return;const all=[...root.querySelectorAll('[data-compare-member]')];s.compareSelection=all.filter(x=>x.checked).map(x=>x.dataset.compareMember);if(s.compareSelection.length===all.length)s.compareSelection=[];save(s);});
  // Recap controls live in a modal attached to document.body, outside #pageContent.
  // Delegate them here so Next, Previous and Share work in the open story.
  document.addEventListener("click", (e) => {
    const button = e.target.closest('.hr-modal-wrap [data-action]');
    if (!button || button.disabled || button.classList.contains('disabled')) return;
    const action = button.dataset.action;
    if (action === 'recap-next') { s.orgRecap = Math.min(6, s.orgRecap + 1); organizationRecap(); }
    else if (action === 'recap-prev') { s.orgRecap = Math.max(0, s.orgRecap - 1); organizationRecap(); }
    else if (action === 'share-recap') {
      const url = location.href;
      if (navigator.share) navigator.share({title:'Organization performance recap',url}).catch(()=>{});
      else if (navigator.clipboard) navigator.clipboard.writeText(url).then(()=>alert('Demo link copied.')).catch(()=>window.prompt('Copy this demo link:',url));
      else window.prompt('Copy this demo link:',url);
    }
  });
  root.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b || b.classList.contains("disabled")) return;
    const [action, arg] = b.dataset.action.split(":");
    if (action === 'skill') { s.dashboardSkill=arg; save(s); }
    else if (action === 'org-topic') { s.orgTopic=arg; save(s); }
    else if (action === "org-recap") {
      s.orgRecap = 0;
      organizationRecap();
    } else if (action === "recap-next") {
      s.orgRecap++;
      organizationRecap();
    } else if (action === "recap-prev") {
      s.orgRecap--;
      organizationRecap();
    } else if (action === "share-recap") {
      const url = location.href;
      if (navigator.share)
        navigator
          .share({ title: "Organization performance recap", url })
          .catch(() => {});
      else if (navigator.clipboard)
        navigator.clipboard
          .writeText(url)
          .then(() =>
            alert("Link copied. Demo recap requires access to this prototype."),
          );
      else alert(url);
    } else if (action === "cycle-tab") {
      s.cycleTab = arg;
      save(s);
    } else if (action === "goto") location.href = arg;
    else if (action === "person") personDetail(arg);
    else if (action === "close")
      document.querySelector(".hr-modal-wrap")?.remove();
    else if (action === "remind") {
      s.reminded = [...new Set([...s.reminded, arg])];
      save(s);
    } else if (action === "extend") {
      if (
        confirm(
          "Approve an exception for this overdue assessment? This will be recorded for audit.",
        )
      ) {
        s.extended = [...new Set([...s.extended, arg])];
        save(s);
      }
    } else if (action === "resolve") {
      if (
        confirm(
          "Confirm one consolidated score using both team-period evaluations?",
        )
      ) {
        s.resolved = true;
        save(s);
      }
    } else if (action === "calibrate") {
      s.calibrated = true;
      save(s);
    } else if (action === "summarize") {
      if (s.extended.length === overdue.length && s.resolved) {
        s.stage = "summarized";
        s.reports.unshift({
          title: "2026 Organization Performance Summary",
          author: "Olivia Brown",
          cycle: "2026",
          tags: [
            "Overview",
            "High Performers",
            "Low Performers",
            ...(s.calibrated ? ["Calibration"] : []),
          ],
          scope: "Organization",
          date: "2026-11-19",
        });
        save(s);
      }
    } else if (action === "release") {
      if (
        confirm(
          "Release ALL employee results and recaps at the same time? This cannot be undone in this demo.",
        )
      ) {
        s.stage = "released";
        save(s);
      }
    } else if (action === "preview") reportView(0);
    else if (action === "export")
      csv("organization-performance-2026.csv", [
        ["Employee", "Team", "Department", "Score", "Classification"],
        ...people.map((p) => [p.name, p.team, p.department, p.score, p.type]),
      ]);
    else if (action === "report") reportView(Number(arg));
    else if (
      [
        "create-cycle",
        "cycle-reactivate",
        "cycle-edit",
        "cycle-remove",
        "cycle-cancel",
        "cycle-manage",
        "cycle-generate",
        "cycle-release",
        "change-request",
        "generate-report",
      ].includes(action)
    ) {
      modal(
        '<div class="hr-tbd"><h2>TBD</h2><p>This action is planned but not implemented in the demo.</p></div>',
      );
    } else if (action === "report-export")
      csv("performance-report-" + arg + ".csv", [
        ["Report", "Cycle", "Author", "Scope"],
        ...[[...s.reports, ...baseReports][Number(arg)]].map((r) => [
          r.title,
          r.cycle,
          r.author,
          r.scope,
        ]),
      ]);
  });
  window.addEventListener("pm:demo-settings-changed", render);
  render();
})();
