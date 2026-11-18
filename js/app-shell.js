(function () {
  "use strict";
  const body = document.body,
    role = body.dataset.role,
    page = body.dataset.page,
    config = window.PM_CONFIGS?.[role];
  if (!config) return;
  const root = document.querySelector("#app");
  if (!root) return;
  const path = (id) => `../${role}/${id}.html`;
  const icon = (name) => `<i data-lucide="${name}" aria-hidden="true"></i>`;
  const links = () =>
    config.nav
      .map(
        (item) =>
          `<a class="nav-link ${page === item.id ? "active" : ""}" href="${path(item.id)}" ${page === item.id ? 'aria-current="page"' : ""} title="${item.label}"><span class="nav-icon">${icon(item.icon)}</span><span class="nav-label">${item.label}</span></a>`,
      )
      .join("");
  const profile = `<span class="avatar">${config.profile.initials}</span><span class="profile-copy"><strong>${config.profile.name}</strong><span>${config.profile.team}</span><span>${config.profile.role}</span></span>`;
  const mobileProfile = `<span class="avatar">${config.profile.initials}</span><span class="profile-copy"><strong>${config.profile.name}</strong><span>${config.profile.team}</span><span>${config.profile.role}</span></span>`;
  const evalHref = path("assessments");
  const cycleName = "Annual Performance Review 2026";
  const evalText = `<span class="evaluation-icon">${icon("clipboard-check")}</span><span class="evaluation-copy"><strong>Evaluation</strong><small class="evaluation-cycle-name">${cycleName}</small></span>`;
  const evaluation =
    role === "hr"
      ? ""
      : `<a class="evaluation-link evaluation-outside" href="${evalHref}">${evalText}</a>`;
  const innerEvaluation =
    role === "hr"
      ? ""
      : `<a class="evaluation-link evaluation-inside" href="${evalHref}">${evalText}</a>`;
  const mobileEvaluation =
    role === "hr"
      ? ""
      : `<a class="mobile-evaluation" href="${evalHref}" aria-label="${cycleName}" title="${cycleName}">${icon("clipboard-check")}<span>${cycleName}</span></a>`;
  root.innerHTML = `<div class="app"><aside class="sidebar" aria-label="Primary navigation"><a href="../../index.html" class="side-logo" aria-label="empeo home"><span>empeo</span></a><nav class="side-nav">${links()}</nav><div class="side-footer">${innerEvaluation}<div class="profile">${profile}</div></div></aside>${evaluation}<header class="mobile-header" id="mobileHeader"><div class="mobile-top"><a href="../../index.html" class="mobile-brand">empeo</a>${mobileEvaluation}</div><div class="mobile-profile"><div class="profile">${mobileProfile}</div></div><nav class="mobile-nav" aria-label="Mobile navigation">${links()}</nav></header><main class="content" id="mainContent"><header class="page-header"><div><h1 id="pageTitle"></h1><p id="pageSubtitle"></p></div><span class="pill" id="cycleBadge"></span></header><div id="pageContent"></div></main></div>`;
  const header = document.getElementById("mobileHeader");
  const update = () => header.classList.toggle("compact", window.scrollY > 95);
  window.addEventListener("scroll", update, { passive: true });
  update();
  const sidebar = document.querySelector(".sidebar");
  const outside = document.querySelector(".evaluation-outside");
  if (outside) {
    const sync = () =>
      outside.classList.toggle(
        "is-hidden",
        sidebar.matches(":hover") || sidebar.matches(":focus-within"),
      );
    sidebar.addEventListener("mouseenter", sync);
    sidebar.addEventListener("mouseleave", sync);
    sidebar.addEventListener("focusin", sync);
    sidebar.addEventListener("focusout", () => requestAnimationFrame(sync));
  }
  const syncEvaluation = () => {
    let state = {};
    try {
      state = JSON.parse(sessionStorage.getItem("pm-demo-settings-v1") || "{}");
    } catch (_) {}
    const hidden = state.cycle === "none" || state.submission === "submitted";
    root
      .querySelectorAll(".evaluation-link,.mobile-evaluation")
      .forEach((el) => el.classList.toggle("evaluation-completed", hidden));
  };
  window.addEventListener("pm:demo-settings-changed", syncEvaluation);
  syncEvaluation();
  if (window.lucide?.createIcons) window.lucide.createIcons();
})();
