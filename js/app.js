(function () {
  "use strict";
  const body = document.body,
    role = body.dataset.role,
    page = body.dataset.page;
  if (!role) return;
  const title =
    window.PM_CONFIGS[role].nav.find((n) => n.id === page)?.label ||
    "Performance Management";
  document.getElementById("pageTitle").textContent = title;
  document.getElementById("pageSubtitle").textContent =
    role === "hr"
      ? "Organization-wide performance management"
      : role === "manager"
        ? "Manage your performance and support your team"
        : "Track your progress and complete your reviews";
  const key = "pm-demo-settings-v1";
  let state = { cycle: "active", submission: "pending" };
  try {
    state = { ...state, ...JSON.parse(sessionStorage.getItem(key) || "{}") };
  } catch (_) {}
  const demo = document.createElement("section");
  demo.className = "demo-bar";
  demo.setAttribute("aria-label", "Demo settings");
  demo.innerHTML = `<strong>⚙ Demo Settings</strong><div class="field"><label for="roleSelect">Demo as</label><select id="roleSelect"><option value="employee">Employee</option><option value="manager">Manager</option><option value="hr">HR</option></select></div><div class="field"><label for="cycleSelect">Cycle</label><select id="cycleSelect"><option value="active">In Review Cycle</option><option value="none">No Review Cycle</option></select></div><div class="field" id="submissionField"><label for="submissionSelect">Assessment</label><select id="submissionSelect"><option value="pending">Not Submitted</option><option value="submitted">Submitted</option></select></div><a class="btn secondary" href="../../index.html">Home</a>`;
  body.insertBefore(demo, body.firstChild);
  const setDemoHeight = () =>
    document.documentElement.style.setProperty(
      "--demo-height",
      `${demo.getBoundingClientRect().height}px`,
    );
  setDemoHeight();
  if (window.ResizeObserver) new ResizeObserver(setDemoHeight).observe(demo);
  window.addEventListener("resize", setDemoHeight);
  const roleSelect = demo.querySelector("#roleSelect"),
    cycleSelect = demo.querySelector("#cycleSelect"),
    submissionSelect = demo.querySelector("#submissionSelect");
  roleSelect.value = role;
  cycleSelect.value = state.cycle;
  submissionSelect.value = state.submission;
  const save = () => {
    sessionStorage.setItem(key, JSON.stringify(state));
    render();
    window.dispatchEvent(new Event("pm:demo-settings-changed"));
  };
  roleSelect.addEventListener("change", () => {
    const next = roleSelect.value;
    location.href = `../${next}/${next === "hr" ? "dashboard" : "performance"}.html`;
  });
  cycleSelect.addEventListener("change", () => {
    state.cycle = cycleSelect.value;
    save();
  });
  submissionSelect.addEventListener("change", () => {
    state.submission = submissionSelect.value;
    save();
  });
  const descriptions = {
    performance: [
      "Your goals, achievements, performance history, and review-cycle recap.",
      "Current Goals",
      "Achievements",
      "Performance Trends",
      "Review History & Recaps",
    ],
    assessments: [
      "Complete assigned evaluations using shared criteria and supporting evidence.",
      "Self Assessment",
      "Coworker Assessments",
      "Manager Assessment",
      "Organization Evaluation",
    ],
    feedback: [
      "Read the feedback you have received.",
      "Feedback Messages",
      "Filter by Topic",
      "Review Cycle History",
    ],
    "team-performance": [
      "Explore team results, high and low performers, and fair role-based comparisons.",
      "Team Overview",
      "High & Low Performers",
      "Role Comparisons",
      "Individual Performance",
    ],
    dashboard: [
      "Review organization, department, and team performance at a glance.",
      "Organization Performance",
      "Department Performance",
      "Team Performance",
      "High & Low Performers",
    ],
    employees: [
      "Find employees and inspect review-cycle and role histories.",
      "Employee Directory",
      "Performance Records",
      "Role & Team History",
    ],
    "review-cycles": [
      "Review assessments, resolve exceptions, summarize and release all results together.",
      "Cycle List",
      "Assessment Forms",
      "Overdue & Multi-Team Cases",
      "Finalize & Release",
    ],
    reports: [
      "Browse historical generated reports and filter by author, topic, cycle, and employee.",
      "Report History",
      "Advanced Filters",
      "View & Export",
    ],
  };
  function render() {
    const info = descriptions[page] || [title];
    document.getElementById("cycleBadge").textContent =
      state.cycle === "none"
        ? "No Active Cycle"
        : state.submission === "submitted"
          ? "In Review Cycle · Submitted"
          : "In Review Cycle";
    demo
      .querySelector("#submissionField")
      .classList.toggle("hidden", state.cycle === "none" || role === "hr");
    const content = document.getElementById("pageContent");
    content.innerHTML = `<div class="section-stack"><section class="card empty-state"><span class="pill">Shared shell ready</span><h2>${title}</h2><p>${info[0]}</p><div class="notice">This page is a planned implementation placeholder. The shared navigation, responsive layout, and demo settings are functional; assessment and reporting actions will be built page by page.</div></section><section class="card"><h2>Planned sections</h2><div class="feature-row">${info
      .slice(1)
      .map(
        (x) =>
          `<article class="feature"><h3>${x}</h3><p>Coming in the next implementation step.</p></article>`,
      )
      .join("")}</div></section></div>`;
  }
  render();
})();
