(() => {
  const KEY = "empeoEmployeeDemo_v3";
  const CYCLE_NAME = "Annual Performance Review 2026";
  const CYCLE_YEAR = "2026";
  const defaultState = {
    scenario: "active",
    activeTab: "performance",
    assessment: {},
    reflection: { achievements: "", challenges: "" },
    submitted: false,
    feedbackSeen: false,
    recapSeen: false,
    selectedCycle: "all",
  };
  let state = loadState();
  const $ = (id) => document.getElementById(id);
  const escapeHtml = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
      // Migrate the previous demo version without losing an employee's saved form.
      const old = JSON.parse(
        localStorage.getItem("empeoEmployeeDemo_v2") || "{}",
      );
      return {
        ...defaultState,
        ...old,
        ...saved,
        assessment: saved.assessment || old.assessment || {},
        reflection:
          saved.reflection || old.reflection || defaultState.reflection,
      };
    } catch {
      return { ...defaultState };
    }
  }
  function saveState() {
    localStorage.setItem(KEY, JSON.stringify(state));
  }
  function toast(message) {
    const el = $("toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove("show"), 2400);
  }
  const isCycleActive = () =>
    state.scenario === "active" || state.scenario === "submitted";
  const isSubmitted = () => isCycleActive() && state.submitted;
  const cycleLabel = () => CYCLE_NAME;
  function setPageHeading(title, subtitle, eyebrow = "EMPLOYEE WORKSPACE") {
    $("pageTitle").textContent = title;
    $("pageSubtitle").textContent = subtitle;
    $("pageEyebrow").textContent = eyebrow;
    $("breadcrumbCurrent").textContent = title;
  }
  function switchTab(tab) {
    state.activeTab = tab;
    if (tab === "feedback" && state.scenario === "ended")
      state.feedbackSeen = true;
    saveState();
    render();
  }

  function updateNav() {
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.tab === state.activeTab);
    });
    const assessmentBtn = $("assessmentNavItem");
    const assessmentIcon = $("assessmentNavIcon");
    assessmentBtn.classList.remove("state-pending", "state-submitted");
    assessmentIcon.classList.remove("icon-pending", "icon-submitted");
    if (isCycleActive()) {
      if (isSubmitted()) {
        assessmentIcon.textContent = "☑";
        assessmentIcon.classList.add("icon-submitted");
      } else {
        assessmentBtn.classList.add("state-pending");
        assessmentIcon.textContent = "⏳";
        assessmentIcon.classList.add("icon-pending");
      }
    } else {
      assessmentIcon.textContent = "☑";
      assessmentIcon.classList.add("icon-submitted");
    }
    $("feedbackNewBadge").hidden = !(
      state.scenario === "ended" && !state.feedbackSeen
    );
  }

  function render() {
    $("scenarioSelect").value = state.scenario;
    $("performanceTab").hidden = state.activeTab !== "performance";
    $("assessmentTab").hidden = state.activeTab !== "assessment";
    $("feedbackTab").hidden = state.activeTab !== "feedback";
    updateNav();
    if (state.activeTab === "performance") {
      setPageHeading(
        "My Performance",
        "Stay on top of your goals, progress, and performance reviews.",
      );
      renderPerformance();
    }
    if (state.activeTab === "assessment") {
      setPageHeading(
        "Self-assessment",
        "Reflect on your contributions and share evidence of your work.",
      );
      renderAssessment();
    }
    if (state.activeTab === "feedback") {
      setPageHeading(
        "Feedback",
        "Review your performance feedback and results by cycle.",
      );
      renderFeedback();
    }
    $("headingActions").innerHTML =
      state.scenario === "ended" && state.activeTab === "performance"
        ? `<button class="button button-secondary button-small" id="rewatchRecap">↻ Rewatch ${CYCLE_NAME} recap</button>`
        : "";
    $("rewatchRecap")?.addEventListener("click", openRecap);
  }

  function renderPerformance() {
    if (isCycleActive()) {
      const submitted = isSubmitted();
      $("performanceContent").innerHTML = `
        <div class="notice ${submitted ? "notice-success" : ""}"><div class="notice-icon">${submitted ? "✓" : "!"}</div><div><strong>${submitted ? "Your self-assessment has been submitted" : "Your performance review is in progress"}</strong><p>${submitted ? "Your submission is complete. The review cycle is still ongoing while your manager and HR continue their review." : "There are assessments waiting for your input. Complete them before <b>15 December 2026</b> to help your manager understand your contributions."}</p></div></div>
        <div class="cycle-hero"><div><span class="status-pill status-orange">In review cycle</span><h2>${CYCLE_NAME}</h2><p>Your review period and assigned activities are shown below.</p></div><div class="cycle-date"><strong>1 Jan – 31 Dec 2026</strong><span>Review cycle period</span></div></div>
        <div class="grid grid-3">
          <div class="card metric-card"><div class="metric-icon">◷</div><div><div class="metric-label">Review cycle status</div><div class="metric-value" style="font-size:15px">Ongoing</div></div></div>
          <div class="card metric-card"><div class="metric-icon">▣</div><div><div class="metric-label">Self-assessment</div><div class="metric-value" style="font-size:15px">${submitted ? "Submitted" : "Not submitted"}</div></div></div>
          <div class="card metric-card"><div class="metric-icon">◷</div><div><div class="metric-label">Submission deadline</div><div class="metric-value" style="font-size:15px">15 Dec 2026</div></div></div>
        </div>
        <div class="section-heading"><div><h2>My required assessments</h2><p>Complete the activities assigned to you for this review cycle.</p></div></div>
        <div class="card"><div class="assessment-list">
          <div class="assessment-row"><div class="task-icon ${submitted ? "task-icon-submitted" : "task-icon-pending"}">${submitted ? "☑" : "⏳"}</div><div class="task-main"><strong>Self-assessment</strong><span>Reflect on your performance and provide supporting examples.</span></div><span class="status-pill ${submitted ? "status-green" : "status-orange"}">${submitted ? "Submitted" : "To do"}</span><a class="task-action" href="#" data-goto="assessment">${submitted ? "View submission" : "Start"} →</a></div>
          <div class="assessment-row"><div class="task-icon">◎</div><div class="task-main"><strong>Goal reflection</strong><span>Review progress against your goals and key outcomes.</span></div><span class="status-pill status-gray">Included in form</span><a class="task-action" href="#" data-goto="assessment">View →</a></div>
        </div></div>
        ${previousPerformanceSection()}`;
    } else if (state.scenario === "none") {
      $("performanceContent").innerHTML = `
        <div class="notice"><div class="notice-icon">✧</div><div><strong>Keep your progress moving</strong><p>No review cycle is currently active. Use this time to reflect on your goals, capture achievements, and prepare for your next conversation with your manager.</p></div></div>
        ${performanceSummary()}
        ${goalsAndAchievements("Achievements & goal progress", "A snapshot of your progress from the latest review cycle.", "On track")}
        <div class="section-heading"><div><h2>Performance history</h2><p>Explore your finalized results from previous review cycles.</p></div><button class="button button-secondary button-small" data-goto="assessment">View assessments</button></div>
        <div class="card"><div class="cycle-history">${historyRows(true)}</div></div>`;
    } else {
      $("performanceContent").innerHTML = `
        <div class="notice"><div class="notice-icon">✧</div><div><strong>Your 2026 review cycle has ended</strong><p>Your assessment has been finalized. Explore your performance results and feedback, or revisit your year-end recap.</p></div></div>
        ${performanceSummary()}
        ${goalsAndAchievements("Achievements & goal progress", "Your contributions and outcomes during the review period.", "Completed")}
        <div class="section-heading"><div><h2>Performance history</h2><p>Review your results across cycles.</p></div></div><div class="card"><div class="cycle-history">${historyRows(true)}</div></div>`;
    }
    bindGoto();
  }

  function performanceSummary() {
    return `<div class="grid grid-3"><div class="card metric-card"><div class="metric-icon">★</div><div><div class="metric-label">Overall rating · 2026</div><div class="metric-value">4.2 <span class="muted small">/ 5</span></div></div></div><div class="card metric-card"><div class="metric-icon">◎</div><div><div class="metric-label">Goals achieved</div><div class="metric-value">80%</div></div></div><div class="card metric-card"><div class="metric-icon">✓</div><div><div class="metric-label">Review cycle</div><div class="metric-value" style="font-size:15px">Finalized</div></div></div></div>`;
  }
  function goalsAndAchievements(title, description, status) {
    return `<div class="section-heading"><div><h2>${title}</h2><p>${description}</p></div></div>
      <div class="grid grid-2"><div class="card"><div class="card-title-row"><h3>Goal achievement</h3><span class="status-pill status-green">${status}</span></div><div class="goal-list">
        <div class="goal-item"><strong>Improve product onboarding</strong><span>100%</span><div class="progress-track"><div class="progress-fill" style="width:100%"></div></div></div>
        <div class="goal-item"><strong>Reduce support handoff time</strong><span>75%</span><div class="progress-track"><div class="progress-fill" style="width:75%"></div></div></div>
        <div class="goal-item"><strong>Document key workflows</strong><span>65%</span><div class="progress-track"><div class="progress-fill" style="width:65%"></div></div></div>
      </div></div><div class="card"><div class="card-title-row"><h3>Key achievements</h3><span class="muted small">2026</span></div><div class="achievement-list">
        <div class="achievement"><div class="achievement-mark">✓</div><div><strong>Improved onboarding flow</strong><p>Helped simplify the user journey and reduce repeated questions.</p></div></div>
        <div class="achievement"><div class="achievement-mark">✓</div><div><strong>Cross-team collaboration</strong><p>Worked with design and engineering to deliver a shared initiative.</p></div></div>
        <div class="achievement"><div class="achievement-mark">✓</div><div><strong>Knowledge sharing</strong><p>Created workflow documentation for the wider team.</p></div></div>
      </div></div></div>`;
  }
  function historyRows(include2026 = false) {
    const rows = [
      ...(include2026
        ? [
            [
              "2026",
              "Annual Performance Review 2026",
              "1 Jan – 31 Dec 2026",
              "4.2",
              "Finalized",
            ],
          ]
        : []),
      [
        "2025",
        "Annual Performance Review 2025",
        "1 Jan – 31 Dec 2025",
        "3.9",
        "Finalized",
      ],
      [
        "2025",
        "Mid-year Check-in 2025",
        "1 Jan – 30 Jun 2025",
        "3.8",
        "Completed",
      ],
    ];
    return rows
      .map(
        (r) =>
          `<div class="history-row"><div><strong>${r[1]}</strong><span>${r[2]} · ${r[4]}</span></div><div class="history-row-actions"><span class="history-rating">${r[3]} <small>/ 5</small></span>${r[0] === "2026" ? '<button class="button button-secondary button-small" data-rewatch-cycle="2026">Rewatch recap</button>' : ""}</div></div>`,
      )
      .join("");
  }
  function previousPerformanceSection() {
    return `<div class="section-heading"><div><h2>Previous performance</h2><p>Your finalized results remain available during the current review cycle.</p></div><button class="button button-secondary button-small" data-goto="assessment">View all assessments</button></div><div class="card"><div class="cycle-history">${historyRows(false)}</div></div>`;
  }

  const criteria = [
    [
      "quality",
      "Quality of Work",
      "Accuracy, completeness, and consistency of your work.",
    ],
    [
      "ownership",
      "Ownership & Accountability",
      "How you take responsibility and follow through on commitments.",
    ],
    [
      "collaboration",
      "Collaboration",
      "How you communicate, share knowledge, and work with others.",
    ],
  ];
  function renderAssessment() {
    if (!isCycleActive()) {
      $("assessmentContent").innerHTML =
        `${assessmentHistoryMarkup("Previous assessments", "View your submitted assessments by review cycle.")}`;
      bindAssessmentHistory();
      return;
    }
    const locked = isSubmitted();
    $("assessmentContent").innerHTML = `
      <div class="notice"><div class="notice-icon">!</div><div><strong>Self-assessment · ${CYCLE_NAME}</strong><p>Share an honest reflection of your work from 1 January to 31 December 2026. Use specific examples to support your ratings. Deadline: <b>15 December 2026</b>.</p></div></div>
      ${locked ? '<div class="notice notice-success"><div class="notice-icon">✓</div><div><strong>Assessment submitted</strong><p>Your self-assessment is submitted and locked. The overall review cycle is still ongoing; your manager and HR may continue their review.</p></div></div>' : ""}
      <div class="card"><div class="form-section"><h3>Performance criteria</h3><p>Choose a rating for each area and provide examples that explain your selection.</p></div>
      ${criteria.map(([id, title, desc]) => `<div class="criteria-card"><div class="criteria-top"><div><strong>${title}</strong><p>${desc}</p></div><span class="status-pill ${state.assessment[id] ? "status-green" : "status-gray"}">${state.assessment[id] ? "Rated" : "Not rated"}</span></div><div class="rating-options" role="group" aria-label="${title} rating">${[1, 2, 3, 4, 5].map((n) => `<button class="rating-option ${Number(state.assessment[id]) === n ? "selected" : ""}" data-rating="${id}" data-value="${n}" ${locked ? "disabled" : ""}>${n}</button>`).join("")}</div><div class="rating-hint"><span>1 · Needs improvement</span><span>5 · Outstanding</span></div><textarea data-evidence="${id}" placeholder="Add an example or evidence to support your rating..." ${locked ? "disabled" : ""}>${escapeHtml(state.assessment[id + "_evidence"] || "")}</textarea></div>`).join("")}
      <div class="form-section" style="margin-top:20px"><h3>Reflection</h3><p>Tell us more about your contributions and what you learned.</p></div>
      <div class="reflection-card"><label for="achievements">Key achievements</label><p>What are you most proud of during this review period?</p><textarea id="achievements" placeholder="Describe your key achievements..." ${locked ? "disabled" : ""}>${escapeHtml(state.reflection.achievements)}</textarea></div>
      <div class="reflection-card"><label for="challenges">Challenges & learning</label><p>What challenges did you face, and what support would help you move forward?</p><textarea id="challenges" placeholder="Share your challenges and learning..." ${locked ? "disabled" : ""}>${escapeHtml(state.reflection.challenges)}</textarea></div>
      <div class="form-actions">${locked ? '<span class="muted small">Submitted · 17 November 2026</span>' : '<button class="button button-secondary" id="saveDraft">Save draft</button><button class="button button-primary" id="submitAssessment">Submit assessment</button>'}</div></div>
      ${assessmentHistoryMarkup("Previous performance", "You can still view previous review cycles while this review is in progress.")}`;

    document.querySelectorAll("[data-rating]").forEach((btn) =>
      btn.addEventListener("click", () => {
        const id = btn.dataset.rating;
        state.assessment[id] = Number(btn.dataset.value);
        saveState();
        renderAssessment();
      }),
    );
    document.querySelectorAll("[data-evidence]").forEach((el) =>
      el.addEventListener("input", () => {
        state.assessment[el.dataset.evidence + "_evidence"] = el.value;
        saveState();
      }),
    );
    $("achievements")?.addEventListener("input", (e) => {
      state.reflection.achievements = e.target.value;
      saveState();
    });
    $("challenges")?.addEventListener("input", (e) => {
      state.reflection.challenges = e.target.value;
      saveState();
    });
    $("saveDraft")?.addEventListener("click", () => {
      saveState();
      toast("Draft saved on this browser.");
    });
    $("submitAssessment")?.addEventListener("click", () => {
      if (criteria.some(([id]) => !state.assessment[id])) {
        toast("Please select a rating for all three criteria.");
        return;
      }
      if (
        !confirm(
          "Submit your self-assessment? You will not be able to edit it afterwards.",
        )
      )
        return;
      state.submitted = true;
      state.scenario = "submitted";
      saveState();
      render();
      toast(
        "Your self-assessment has been submitted. The review cycle remains ongoing.",
      );
    });
    bindAssessmentHistory();
  }
  function assessmentHistoryMarkup(title, description) {
    return `<div class="section-heading"><div><h2>${title}</h2><p>${description}</p></div></div>
      <div class="filter-row"><div class="muted small">Select a review cycle to filter your history.</div><select id="assessmentCycle"><option value="all">All previous cycles</option><option value="2025">2025</option></select></div>
      <div id="assessmentHistory" class="card"><div class="cycle-history"></div></div>`;
  }
  function bindAssessmentHistory() {
    const select = $("assessmentCycle");
    if (!select) return;
    select.value = state.selectedCycle === "2026" ? "all" : state.selectedCycle;
    select.addEventListener("change", (e) => {
      state.selectedCycle = e.target.value;
      saveState();
      renderAssessmentHistory();
    });
    renderAssessmentHistory();
  }
  function renderAssessmentHistory() {
    const target = $("assessmentHistory");
    if (!target) return;
    const rows = [
      ["2025", "Annual Performance Review 2025", "1 Jan – 31 Dec 2025", "3.9"],
      ["2025", "Mid-year Check-in 2025", "1 Jan – 30 Jun 2025", "3.8"],
    ].filter(
      (r) => state.selectedCycle === "all" || r[0] === state.selectedCycle,
    );
    target.innerHTML = rows.length
      ? `<div class="cycle-history">${rows.map((r) => `<div class="history-row"><div><strong>${r[1]}</strong><span>${r[2]} · Finalized</span></div><div class="history-row-actions"><span class="history-rating">${r[3]} <small>/ 5</small></span><button class="button button-secondary button-small" data-view-cycle="${r[1]}">View assessment</button></div></div>`).join("")}</div><div id="assessmentDetail"></div>`
      : '<div class="empty-state"><div class="empty-icon">▤</div><h3>No assessments found</h3><p>There are no assessments for the selected review cycle.</p></div>';
    target
      .querySelectorAll("[data-view-cycle]")
      .forEach((button) =>
        button.addEventListener("click", () =>
          showPreviousAssessment(button.dataset.viewCycle),
        ),
      );
  }

  function showPreviousAssessment(cycleName) {
    const detail = $("assessmentDetail");
    if (!detail) return;
    const isAnnual = cycleName.includes("Annual");
    const period = isAnnual ? "1 Jan – 31 Dec 2025" : "1 Jan – 30 Jun 2025";
    detail.innerHTML = `<div class="previous-detail"><div class="card-title-row"><div><h3>${escapeHtml(cycleName)}</h3><span class="muted small">${period} · Finalized assessment</span></div><span class="status-pill status-green">Finalized</span></div>
      <div class="grid grid-3"><div class="metric-card"><div><div class="metric-label">Overall rating</div><div class="metric-value">${isAnnual ? "3.9" : "3.8"} <span class="muted small">/ 5</span></div></div></div><div class="metric-card"><div><div class="metric-label">Goals achieved</div><div class="metric-value">${isAnnual ? "76%" : "70%"}</div></div></div><div class="metric-card"><div><div class="metric-label">Status</div><div class="metric-value" style="font-size:14px">Completed</div></div></div></div>
      <div class="previous-detail-grid"><div><strong>Key strengths</strong><p>Reliable delivery, ownership, and positive collaboration with the team.</p></div><div><strong>Development focus</strong><p>Continue strengthening proactive communication and defining measurable outcomes.</p></div></div></div>`;
    detail.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function renderFeedback() {
    $("feedbackContent").innerHTML =
      `<div class="filter-row"><div><strong style="font-size:12px">Manager feedback</strong><div class="muted small" style="margin-top:4px">Feedback shared with you after each review cycle.</div></div><select id="feedbackCycle"><option value="all">All review cycles</option><option value="2026">2026</option><option value="2025">2025</option></select></div><div id="feedbackList"></div>`;
    $("feedbackCycle").value = state.selectedCycle;
    $("feedbackCycle").addEventListener("change", (e) => {
      state.selectedCycle = e.target.value;
      saveState();
      renderFeedbackList();
    });
    renderFeedbackList();
  }
  function renderFeedbackList() {
    const target = $("feedbackList");
    if (!target) return;
    if (state.scenario !== "ended") {
      target.innerHTML = `<div class="card empty-state"><div class="empty-icon">▤</div><h3>No new feedback available yet</h3><p>${isCycleActive() ? "Your self-assessment has been submitted, but the review cycle is still ongoing. Manager feedback will appear here after the cycle is finalized and released." : "There is no newly released feedback. Your previous feedback will appear here when available."}</p></div>`;
      return;
    }
    const items = [
      {
        year: "2026",
        cycle: CYCLE_NAME,
        date: "18 December 2026",
        name: "Alex Morgan",
        role: "Manager · Product Team",
        tag: "Final feedback",
        body: "You consistently demonstrated ownership and collaboration throughout the review cycle. Your work on improving the onboarding experience had a positive impact on the team. For the next cycle, consider taking a more active role in defining success measures earlier in the project.",
      },
      {
        year: "2025",
        cycle: "Annual Performance Review 2025",
        date: "20 December 2025",
        name: "Alex Morgan",
        role: "Manager · Product Team",
        tag: "Final feedback",
        body: "You delivered reliable work and showed a strong willingness to learn. Continue building confidence in cross-functional discussions and sharing your recommendations proactively.",
      },
    ].filter(
      (x) => state.selectedCycle === "all" || x.year === state.selectedCycle,
    );
    target.innerHTML = items.length
      ? items
          .map(
            (x) =>
              `<article class="card feedback-card"><div class="feedback-head"><div class="feedback-author"><div class="avatar">AM</div><div><strong>${x.name}</strong><span>${x.role} · ${x.date}</span></div></div><span class="feedback-tag">${x.tag}</span></div><div class="section-heading" style="margin:15px 0 0"><div><h2 style="font-size:12px">${x.cycle}</h2></div><span class="status-pill status-green">Finalized</span></div><p>${x.body}</p></article>`,
          )
          .join("")
      : '<div class="card empty-state"><div class="empty-icon">▤</div><h3>No feedback found</h3><p>There is no feedback for the selected review cycle.</p></div>';
  }

  function bindGoto() {
    document.querySelectorAll("[data-goto]").forEach((el) =>
      el.addEventListener("click", (e) => {
        e.preventDefault();
        switchTab(el.dataset.goto);
      }),
    );
    document
      .querySelectorAll("[data-rewatch-cycle]")
      .forEach((el) => el.addEventListener("click", openRecap));
  }
  function openRecap() {
    $("recapTitle").textContent =
      `Your ${CYCLE_YEAR} ${CYCLE_NAME.replace(CYCLE_YEAR, "").trim()} Recap`;
    $("recapModal").hidden = false;
  }
  function closeRecap() {
    $("recapModal").hidden = true;
    state.recapSeen = true;
    saveState();
  }

  document
    .querySelectorAll(".nav-item")
    .forEach((btn) =>
      btn.addEventListener("click", () => switchTab(btn.dataset.tab)),
    );
  function seedSubmittedAssessmentIfEmpty() {
    if (criteria.some(([id]) => state.assessment[id])) return;
    state.assessment = {
      quality: 4,
      ownership: 4,
      collaboration: 5,
      quality_evidence:
        "Delivered accurate work and improved the consistency of the onboarding flow.",
      ownership_evidence:
        "Followed through on assigned improvements and documented key workflows.",
      collaboration_evidence:
        "Partnered with design and engineering to deliver a shared initiative.",
    };
    state.reflection = {
      achievements:
        "Improved the onboarding flow, supported cross-team delivery, and documented key workflows.",
      challenges:
        "I would like to improve how success measures are defined earlier and get more opportunities to contribute to product planning.",
    };
  }

  $("scenarioSelect").addEventListener("change", (e) => {
    state.scenario = e.target.value;
    state.submitted =
      state.scenario === "submitted" || state.scenario === "ended";
    if (state.submitted) seedSubmittedAssessmentIfEmpty();
    state.activeTab = "performance";
    if (state.scenario === "ended") state.feedbackSeen = false;
    saveState();
    render();
    if (state.scenario === "ended" && !state.recapSeen) openRecap();
  });
  $("resetDemo").addEventListener("click", () => {
    if (!confirm("Reset demo data and return to Active Review Cycle?")) return;
    state = {
      ...defaultState,
      assessment: {},
      reflection: { achievements: "", challenges: "" },
    };
    saveState();
    render();
    $("recapModal").hidden = true;
    toast("Demo has been reset.");
  });
  $("closeRecap").addEventListener("click", closeRecap);
  $("dismissRecap").addEventListener("click", closeRecap);
  $("viewRecapDetails").addEventListener("click", () => {
    closeRecap();
    switchTab("performance");
  });
  $("recapModal").addEventListener("click", (e) => {
    if (e.target === $("recapModal")) closeRecap();
  });

  // Keep scenario semantics consistent when loading a saved state from the previous build.
  if (state.scenario === "submitted") state.submitted = true;
  render();
  if (state.scenario === "ended" && !state.recapSeen) openRecap();
})();
