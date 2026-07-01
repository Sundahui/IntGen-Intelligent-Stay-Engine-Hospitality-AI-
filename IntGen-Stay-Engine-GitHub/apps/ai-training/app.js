const employees = [
  { name: "Alicia Tan", role: "Guest Services L&D", img: "https://i.pravatar.cc/80?img=5" },
  { name: "Brian Lee", role: "Front Desk Manager", img: "https://i.pravatar.cc/80?img=12" },
  { name: "Mei Wong", role: "L&D Partner", img: "https://i.pravatar.cc/80?img=32" },
  { name: "John Smith", role: "Front Desk Training Manager", img: "https://i.pravatar.cc/80?img=15" },
  { name: "Farah Aziz", role: "F&B Training Owner", img: "https://i.pravatar.cc/80?img=44" },
  { name: "Marcus Chen", role: "Security Trainer", img: "https://i.pravatar.cc/80?img=59" },
  { name: "Olivia Park", role: "HR Operations", img: "https://i.pravatar.cc/80?img=20" },
  { name: "David Kumar", role: "IT Enablement", img: "https://i.pravatar.cc/80?img=52" }
];

const pipeline = [
  {
    title: "New Assignments",
    status: "Draft",
    items: [
      { title: "Front Office SOP Refresh", meta: "Guest Services - 48 learners", owner: 0, risk: "On Track" },
      { title: "Safety Briefing Basics", meta: "Front Desk - due in 5 days", owner: 1, risk: "Overdue" },
      { title: "Data Privacy Drill", meta: "Management - 18 learners", owner: 2, risk: "On Track" },
      { title: "Guest Intake Protocol", meta: "Contact Centre - 31 learners", owner: 3, risk: "On Track" }
    ]
  },
  {
    title: "In Progress",
    status: "In Progress",
    items: [
      { title: "Guest Service Playbook", meta: "68% completion - 22h left", owner: 4, risk: "On Track" },
      { title: "Concierge Service Scripts", meta: "Practical simulation", owner: 5, risk: "On Track" },
      { title: "Manager Coaching Path", meta: "Reviewer checkpoint", owner: 6, risk: "On Track" }
    ]
  },
  {
    title: "Pending Assessment",
    status: "Pending Assessment",
    items: [
      { title: "Guest Recovery Practical", meta: "Projected pass rate 84%", owner: 3, risk: "On Track" },
      { title: "Safety Compliance Attestation", meta: "12 learners pending", owner: 0, risk: "Overdue" },
      { title: "Property System Walkthrough", meta: "Expected completion Friday", owner: 7, risk: "On Track" }
    ]
  },
  {
    title: "Certified",
    status: "Certified",
    items: [
      { title: "Frontline Service Certified", meta: "92 employees certified", owner: 4, risk: "Certified" }
    ]
  }
];

const departments = [
  ["Front Desk Ops", "22,500", 4, 142.3, 57, "#ee787d", "frontline"],
  ["Guest Services", "12,310", 5, 89.4, 45, "#8aa7df", "frontline"],
  ["Housekeeping Ops", "9,874", 2, 92.5, 50, "#f3dc6c", "operations"],
  ["F&B Service", "15,642", 3, 256.7, 73, "#ee787d", "frontline"],
  ["Management", "10,200", 5, 101.2, 68, "#8fc4aa", "leadership"],
  ["Security & Safety", "23,000", 6, 325.4, 65, "#ee787d", "operations"],
  ["IT Enablement", "9,874", 5, 92.5, 50, "#f3dc6c", "enablement"],
  ["Data & Systems", "15,642", 4, 260.1, 75, "#8aa7df", "enablement"]
];

const courses = [
  ["Check-in for Walk-in Guests", "Service workflow, PMS steps, and escalation protocol.", "assets/check-in-walk-in-guests.jpg", "65%"],
  ["Safe Box Procedures", "Security, privacy, and incident handling attestation.", "assets/safe-box-procedures.jpg", "38%"],
  ["Housekeeping Best Practices", "Room readiness, QA checklist, and service simulation.", "assets/housekeeping-best-practices.jpg", "82%"]
];

let pipelineFilter = "all";
let departmentFilter = "all";
let activeJourneyDepartment = "Front Desk Ops";
let dragGhost = null;
let activeDraggedTask = null;

const departmentLibraries = {
  "Front Desk Ops": {
    summary: "Front office SOPs, guest handling standards, PMS walkthroughs, and service recovery practice content.",
    items: [
      ["PDF", "Check-in SOP Pack", "Walk-in, OTA, group arrival steps", "file-text"],
      ["Manual", "Front Office Handbook", "Guest greeting, ID checks, cashiering", "book-open"],
      ["Video", "PMS Check-in Demo", "3 short modules - placeholder", "video"],
      ["Simulation", "Guest Complaint Recovery", "Voice / text / video scenario", "messages-square"],
      ["Quiz", "Front Desk Knowledge Check", "20 questions - passing 80%", "clipboard-check"],
      ["Certificate", "Front Office Readiness", "Badge and renewal settings", "badge-check"]
    ]
  },
  "Guest Services": {
    summary: "Concierge, guest request routing, loyalty recognition, transport desk, and service etiquette content.",
    items: [
      ["PDF", "Guest Request Matrix", "Escalation and ownership rules", "file-text"],
      ["Manual", "Concierge Playbook", "Local recommendations and handover", "book-open"],
      ["Video", "Guest Welcome Standards", "Lobby interaction examples", "video"],
      ["Simulation", "VIP Arrival Scenario", "Role-play with supervisor scoring", "messages-square"],
      ["Quiz", "Service Promise Check", "Department quiz bank", "clipboard-check"],
      ["Certificate", "Guest Services Certified", "Issue and renewal workflow", "badge-check"]
    ]
  },
  "Housekeeping Ops": {
    summary: "Room readiness, inspection standards, lost-and-found, linen handling, and supervisor QA materials.",
    items: [
      ["PDF", "Room Readiness Checklist", "Daily operating checklist", "file-text"],
      ["Manual", "Housekeeping Handbook", "Cleaning sequence and standards", "book-open"],
      ["Video", "Inspection Walkthrough", "Supervisor review placeholder", "video"],
      ["Simulation", "Room Defect Reporting", "Photo-based practice flow", "image"],
      ["Quiz", "Safety Chemical Handling", "Compliance knowledge check", "clipboard-check"],
      ["Certificate", "Room Readiness Badge", "Valid for 12 months", "badge-check"]
    ]
  },
  "F&B Service": {
    summary: "Restaurant service flow, allergen protocols, cashiering, banquet setup, and service recovery content.",
    items: [
      ["PDF", "Allergen Response Guide", "Guest safety reference", "file-text"],
      ["Manual", "F&B Service Handbook", "Sequence of service and setup", "book-open"],
      ["Video", "Table Service Demo", "Three training clips", "video"],
      ["Simulation", "Allergen Guest Request", "Scenario assessment", "messages-square"],
      ["Quiz", "Menu & Safety Quiz", "Knowledge bank", "clipboard-check"],
      ["Certificate", "F&B Service Badge", "Badge issue flow", "badge-check"]
    ]
  },
  "Management": {
    summary: "Manager onboarding, coaching routines, review approval, remediation actions, and compliance dashboards.",
    items: [
      ["PDF", "Manager Review Guide", "Practical scoring rubric", "file-text"],
      ["Manual", "Coaching Handbook", "Feedback and remediation playbook", "book-open"],
      ["Video", "Review Calibration", "Placeholder coaching videos", "video"],
      ["Simulation", "Performance Conversation", "Manager role-play", "messages-square"],
      ["Quiz", "Policy Sign-off", "Leadership attestation", "clipboard-check"],
      ["Certificate", "Reviewer Authorization", "Approver permissions", "badge-check"]
    ]
  },
  "Security & Safety": {
    summary: "Emergency response, visitor handling, incident reporting, safe box, and annual safety recertification.",
    items: [
      ["PDF", "Emergency Response SOP", "Fire, medical, evacuation", "file-text"],
      ["Manual", "Security Operations Manual", "Access control and reporting", "book-open"],
      ["Video", "Incident Response Demo", "Scenario video placeholder", "video"],
      ["Simulation", "Safe Box Incident", "Branching assessment", "shield-alert"],
      ["Quiz", "Safety Compliance Quiz", "Annual recertification", "clipboard-check"],
      ["Certificate", "Safety Certified", "Expiry and renewal rules", "badge-check"]
    ]
  },
  "IT Enablement": {
    summary: "Property system access, cyber awareness, device onboarding, helpdesk routing, and system walkthroughs.",
    items: [
      ["PDF", "System Access Guide", "PMS, POS, HRIS access", "file-text"],
      ["Manual", "IT Onboarding Handbook", "Device and account setup", "book-open"],
      ["Video", "PMS Navigation", "Screen-recording placeholder", "video"],
      ["Simulation", "Access Request Flow", "Practice ticket routing", "workflow"],
      ["Quiz", "Cyber Hygiene Quiz", "Security baseline", "clipboard-check"],
      ["Certificate", "System Access Cleared", "Access readiness badge", "badge-check"]
    ]
  },
  "Data & Systems": {
    summary: "Data privacy, reporting accuracy, dashboard literacy, record quality, and systems governance content.",
    items: [
      ["PDF", "Data Privacy SOP", "Guest record handling", "file-text"],
      ["Manual", "Reporting Handbook", "Data definitions and checks", "book-open"],
      ["Video", "Dashboard Walkthrough", "Analytics video placeholder", "video"],
      ["Simulation", "Incorrect Record Fix", "Data quality practice", "database"],
      ["Quiz", "Privacy Knowledge Check", "Compliance quiz", "clipboard-check"],
      ["Certificate", "Data Handling Certified", "Annual renewal", "badge-check"]
    ]
  }
};

const journeyBlueprints = {
  "Front Desk Ops": ["Front Desk batch A - 24 learners", "Guest Services line - 18 learners", "Front Desk check-in SOP", "PMS walkthrough and cashiering", "Scenario simulation: voice / text / video", "Learner quiz: SOP and safety", "Review practical result", "Approve certification readiness", "Issue Front Office badge", "Record certificate", "90-day SOP refresher", "Auto-reassign expired badges"],
  "Guest Services": ["Concierge cohort - 18 learners", "VIP arrival line - 12 learners", "Guest request routing", "Local knowledge handbook", "VIP arrival simulation", "Service promise quiz", "Review lobby interaction", "Approve concierge readiness", "Issue Guest Services badge", "Record service certificate", "Quarterly etiquette refresher", "Renew loyalty protocol sign-off"],
  "Housekeeping Ops": ["Room attendant batch - 30 learners", "Supervisor QA group - 8 learners", "Room readiness checklist", "Lost-and-found procedure", "Room defect simulation", "Chemical safety quiz", "Review inspection result", "Approve room readiness", "Issue Housekeeping badge", "Record QA certificate", "Monthly room standard refresher", "Renew safety handling record"],
  "F&B Service": ["Restaurant service batch - 22 learners", "Banquet support line - 14 learners", "Sequence of service", "Allergen response guide", "Allergen request simulation", "Menu and safety quiz", "Review practical service", "Approve floor readiness", "Issue F&B badge", "Record service certificate", "Seasonal menu refresher", "Renew allergen compliance"],
  "Management": ["Manager onboarding cohort - 10 learners", "Duty manager line - 6 learners", "Manager review guide", "Coaching handbook", "Performance conversation simulation", "Policy sign-off quiz", "Review scoring quality", "Approve reviewer access", "Issue Reviewer badge", "Record authorization", "Quarterly calibration refresher", "Renew approval permission"],
  "Security & Safety": ["Security team batch - 16 learners", "Night shift line - 9 learners", "Emergency response SOP", "Safe box procedures", "Incident response simulation", "Safety compliance quiz", "Review incident log", "Approve safety readiness", "Issue Safety badge", "Record safety certificate", "Monthly emergency drill", "Renew annual safety certificate"],
  "IT Enablement": ["New system users - 28 learners", "Helpdesk support line - 7 learners", "System access guide", "PMS navigation walkthrough", "Access request simulation", "Cyber hygiene quiz", "Review system task result", "Approve access readiness", "Issue System Access badge", "Record access certificate", "60-day cyber refresher", "Renew access attestation"],
  "Data & Systems": ["Reporting users - 20 learners", "Data steward line - 8 learners", "Data privacy SOP", "Reporting handbook", "Record correction simulation", "Privacy knowledge check", "Review data quality task", "Approve data handling readiness", "Issue Data Handling badge", "Record privacy certificate", "Quarterly data quality refresher", "Renew privacy attestation"]
};

function icon(name) {
  return `<i data-lucide="${name}"></i>`;
}

function getVisiblePipelineColumns() {
  if (pipelineFilter === "all") return pipeline;
  if (pipelineFilter === "Overdue") {
    return pipeline.map((column) => ({
      ...column,
      items: column.items.filter((item) => item.risk === "Overdue")
    }));
  }
  return pipeline.filter((column) => column.status === pipelineFilter);
}

function renderKanban() {
  const kanban = document.querySelector("#kanban");
  const columns = getVisiblePipelineColumns();
  kanban.innerHTML = columns.map((column) => {
    const realColumnIndex = pipeline.findIndex((item) => item.title === column.title);
    return `
      <div class="kanban-column">
        <div class="column-title">${column.title}</div>
        <div class="dropzone" data-column="${realColumnIndex}">
          ${column.items.map((item) => {
            const realItemIndex = pipeline[realColumnIndex].items.indexOf(item);
            const person = employees[item.owner];
            return `
              <button class="assignment-chip" draggable="true" data-column="${realColumnIndex}" data-index="${realItemIndex}" data-risk="${item.risk}">
                <img src="${person.img}" alt="${person.name}">
                <span><strong>${item.title}</strong>${item.meta}</span>
                ${realColumnIndex === 3 ? icon("check-check") : icon("ellipsis")}
              </button>
            `;
          }).join("")}
        </div>
      </div>
    `;
  }).join("");
  wireAssignmentDrag();
  lucide.createIcons();
}

function createDragGhost(source, x, y) {
  removeDragGhost();
  dragGhost = source.cloneNode(true);
  dragGhost.classList.add("drag-ghost");
  dragGhost.style.width = `${source.offsetWidth}px`;
  document.body.appendChild(dragGhost);
  moveDragGhost(x, y);
}

function moveDragGhost(x, y) {
  if (!dragGhost || !x || !y) return;
  dragGhost.style.left = `${x}px`;
  dragGhost.style.top = `${y}px`;
}

function removeDragGhost() {
  dragGhost?.remove();
  dragGhost = null;
}

function wireAssignmentDrag() {
  let dragged = null;
  document.querySelectorAll(".assignment-chip").forEach((chip) => {
    chip.addEventListener("dragstart", (event) => {
      dragged = chip;
      chip.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", chip.querySelector("strong")?.textContent || "assignment");
      createDragGhost(chip, event.clientX, event.clientY);
    });
    chip.addEventListener("drag", (event) => moveDragGhost(event.clientX, event.clientY));
    chip.addEventListener("dragend", () => {
      chip.classList.remove("dragging");
      removeDragGhost();
    });
    chip.addEventListener("click", openModal);
  });

  document.querySelectorAll(".dropzone").forEach((zone) => {
    zone.addEventListener("dragover", (event) => {
      event.preventDefault();
      zone.classList.add("over");
    });
    zone.addEventListener("dragleave", () => zone.classList.remove("over"));
    zone.addEventListener("drop", () => {
      zone.classList.remove("over");
      if (!dragged) return;
      const fromColumn = Number(dragged.dataset.column);
      const fromIndex = Number(dragged.dataset.index);
      const toColumn = Number(zone.dataset.column);
      const [item] = pipeline[fromColumn].items.splice(fromIndex, 1);
      item.risk = pipeline[toColumn].status === "Certified" ? "Certified" : item.risk;
      pipeline[toColumn].items.push(item);
      renderKanban();
      document.querySelector(`.dropzone[data-column="${toColumn}"] .assignment-chip:last-child`)?.classList.add("added");
      showToast(`${item.title} moved to ${pipeline[toColumn].title}`);
      removeDragGhost();
    });
  });
}

function renderDepartments() {
  const grid = document.querySelector("#departmentGrid");
  grid.innerHTML = departments.map((dept, index) => {
    const people = employees.slice(index % 4, index % 4 + 4);
    const hidden = departmentFilter !== "all" && dept[6] !== departmentFilter;
    return `
      <article class="department-card ${hidden ? "hidden" : ""}" data-category="${dept[6]}" data-department="${dept[0]}">
        <header>
          <h3>${dept[0]}</h3>
          <button class="round-button small" aria-label="Edit training cohort">${icon("pencil")}</button>
        </header>
        <div class="money">${dept[1]}<small>h</small></div>
        <div class="card-meta"><span>Allocated learning hours</span><span>${dept[2]} roles</span></div>
        <div class="mini-rings">
          <div class="mini-ring" style="--value:${Math.min(dept[3] / 4, 96)}; --accent:${dept[5]}">${dept[3]}</div>
          <div class="mini-ring" style="--value:${dept[4]}; --accent:#8aa7df">${dept[4]}%</div>
        </div>
        <div class="card-meta"><span>Hours completed</span><span>Certification rate</span></div>
        <div class="people-row">
          ${people.map((person) => `<img src="${person.img}" alt="${person.name}">`).join("")}
          <span>${dept[2]}</span>
        </div>
      </article>
    `;
  }).join("");
  document.querySelectorAll(".department-card").forEach((card) => {
    card.addEventListener("click", (event) => {
      if (event.target.closest("button")) return;
      openDepartmentDetail(card.dataset.department);
    });
  });
  lucide.createIcons();
}

function openDepartmentDetail(name) {
  const library = departmentLibraries[name] || departmentLibraries["Front Desk Ops"];
  document.querySelector("#departmentDetailTitle").textContent = `${name} Content`;
  document.querySelector("#departmentDetailName").textContent = name;
  document.querySelector("#departmentDetailSummary").textContent = library.summary;
  document.querySelector("#contentLibraryGrid").innerHTML = library.items.map((item) => `
    <article class="content-asset-card" data-type="${item[0]}" data-title="${item[1]}" data-desc="${item[2]}">
      <div class="content-asset-icon">${icon(item[3])}</div>
      <span>${item[0]}</span>
      <h3>${item[1]}</h3>
      <p>${item[2]}</p>
      <button class="round-button small" aria-label="Open ${item[1]}">${icon("arrow-up-right")}</button>
    </article>
  `).join("");
  switchView("departmentDetail");
  lucide.createIcons();
}

function renderAvatars() {
  const strip = document.querySelector("#avatarStrip");
  strip.innerHTML = employees.map((person, index) => `
    <div>
      <img src="${person.img}" alt="${person.name}">
      <span style="background:${index % 3 === 0 ? "#ee787d" : "#8aa7df"}">${index < 4 ? index + 1 : "+"}</span>
    </div>
  `).join("");
}

function renderJourneySwitcher() {
  const switcher = document.querySelector("#journeyDepartmentSwitcher");
  if (!switcher) return;
  switcher.innerHTML = departments.map((dept) => `
    <button class="${dept[0] === activeJourneyDepartment ? "active" : ""}" data-journey-department="${dept[0]}">${dept[0]}</button>
  `).join("");
  switcher.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", () => {
      activeJourneyDepartment = button.dataset.journeyDepartment;
      renderJourneySwitcher();
      renderJourneyBuilder();
      showToast(`${activeJourneyDepartment} journey loaded`);
    });
  });
}

function taskMarkup(text, index, options = {}) {
  if (options.cohort) {
    const people = employees.slice(index, index + 3);
    return `
      <div class="task-card">
        <span class="cohort-stack">${people.map((person) => `<img src="${person.img}" alt="${person.name}">`).join("")}</span>
        ${text}${icon(options.icon || "check-check")}
      </div>
    `;
  }
  if (options.add) {
    return `<div class="task-card ${options.muted ? "muted-task" : "ghost"}"><span class="plus-bubble">+</span>${text}${icon(options.icon || "ellipsis")}</div>`;
  }
  const person = employees[index % employees.length];
  return `<div class="task-card ${options.strong ? "strong" : ""}"><img src="${person.img}" alt="${person.name}">${text}${icon(options.icon || "check-check")}</div>`;
}

function journeyStage(title, tasks) {
  return `
    <div class="journey-stage tall" data-stage="${title}">
      <h3>${title}</h3>
      ${tasks.join("")}
    </div>
  `;
}

function renderJourneyBuilder() {
  const canvas = document.querySelector("#journeyCanvas");
  const title = document.querySelector("#journeyPanelTitle");
  if (!canvas || !title) return;
  const items = journeyBlueprints[activeJourneyDepartment] || journeyBlueprints["Front Desk Ops"];
  title.textContent = `${activeJourneyDepartment} Training Journey`;
  canvas.innerHTML = `
    ${journeyStage("Audience Allocation", [
      taskMarkup(items[0], 0, { cohort: true }),
      taskMarkup(items[1], 2, { cohort: true, icon: "calendar" }),
      taskMarkup("Link department, role, shift, and assignment rules", 0, { add: true, muted: true })
    ])}
    <div class="connector blue"></div>
    ${journeyStage("Foundation Training", [
      taskMarkup(items[2], 1),
      taskMarkup(items[3], 6, { icon: "book-open" }),
      taskMarkup("Pull content from Department Content Management", 0, { add: true, muted: true })
    ])}
    <div class="connector blue"></div>
    ${journeyStage("Practice & Assessment", [
      taskMarkup(items[4], 0, { add: true, icon: "video" }),
      taskMarkup(items[5], 0, { add: true, icon: "clipboard-check" }),
      taskMarkup("Assessment result feeds assignment status", 3, { icon: "ellipsis", strong: true })
    ])}
    <div class="connector mixed"></div>
    ${journeyStage("Manager Review", [
      taskMarkup(items[6], 2, { icon: "check-check" }),
      taskMarkup(items[7], 1, { icon: "calendar" }),
      taskMarkup("Request remediation if needed", 0, { add: true, muted: true })
    ])}
    <div class="connector blue"></div>
    ${journeyStage("Certification", [
      taskMarkup(items[8], 5, { icon: "badge-check" }),
      taskMarkup(items[9], 6, { icon: "database" }),
      taskMarkup("Schedule renewal reminder", 0, { add: true, muted: true })
    ])}
    <div class="connector mixed"></div>
    ${journeyStage("Renewal Reminder", [
      taskMarkup(items[10], 7, { icon: "calendar" }),
      taskMarkup(items[11], 0, { add: true, icon: "refresh-cw" }),
      taskMarkup("Escalate overdue renewal to HR inbox", 0, { add: true, muted: true })
    ])}
    <div class="new-task-bank">
      <span class="task-bank-title">Training Blocks</span>
      <button class="bank-card active" draggable="true" data-template="Department Course">Department Course</button>
      <button class="bank-card" draggable="true" data-template="Scenario Simulation">Scenario Simulation</button>
      <button class="bank-card" draggable="true" data-template="Learner Quiz">Learner Quiz</button>
      <button class="bank-card" draggable="true" data-template="Manager Review">Manager Review</button>
      <button class="bank-card" draggable="true" data-template="Certificate Issue">Certificate Issue</button>
      <button class="bank-card" draggable="true" data-template="Renewal Reminder">Renewal Reminder</button>
    </div>
  `;
  setupJourneyBuilder();
  lucide.createIcons();
}

function renderCourses() {
  const lane = document.querySelector("#courseLane");
  lane.innerHTML = courses.map((course, index) => {
    const slug = course[0] === "Check-in for Walk-in Guests" ? "course-001" : "";
    return `
    <article class="course-card ${slug ? "is-launchable" : ""}" data-course="${slug}">
      <img src="${course[2]}" alt="${course[0]}">
      <div>
        <h3>${course[0]}</h3>
        <p>${course[1]}</p>
        <div class="progress-line"><span style="--value:${course[3]}"></span></div>
        <button class="course-open-btn">
          ${icon(slug ? "play" : "lock")}${slug ? "Open Course" : "Resume"}
        </button>
      </div>
    </article>
  `;
  }).join("");
  lane.querySelectorAll(".course-card").forEach((card) => {
    card.addEventListener("click", () => {
      const slug = card.dataset.course;
      if (slug === "course-001") {
        openCourseModal();
      } else {
        showToast(`${card.querySelector("h3").textContent} resumes where you left off`);
      }
    });
  });
  lucide.createIcons();
}

function switchView(id) {
  document.querySelectorAll(".view").forEach((view) => view.classList.toggle("active", view.id === id));
  const activeNav = id === "departmentDetail" ? "assignments" : id;
  document.querySelectorAll(".rail-nav").forEach((button) => button.classList.toggle("active", button.dataset.view === activeNav));
}

function typeIntoInput(input, value) {
  if (!input || !value) return;
  clearInterval(input.typeTimer);
  input.value = "";
  let index = 0;
  input.typeTimer = setInterval(() => {
    input.value = value.slice(0, index + 1);
    index += 1;
    if (index >= value.length) clearInterval(input.typeTimer);
  }, 13);
}

function openModal(event) {
  const modal = document.querySelector("#assignmentModal");
  const sourceChip = event?.currentTarget?.classList?.contains("assignment-chip") ? event.currentTarget : null;
  const sourceTitle = sourceChip?.querySelector("strong")?.textContent;
  const sourceMeta = sourceChip?.querySelector("span")?.childNodes?.[1]?.textContent;
  const assignmentName = document.querySelector("#assignmentName");
  const assignmentAudience = document.querySelector("#assignmentAudience");
  if (sourceTitle) typeIntoInput(assignmentName, sourceTitle);
  if (sourceMeta && assignmentAudience) {
    const matchingOption = [...assignmentAudience.options].find((option) => sourceMeta.includes(option.value.split(" - ")[0]));
    if (matchingOption) assignmentAudience.value = matchingOption.value;
  }
  modal.classList.remove("closing");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-focus");
  setTimeout(() => (sourceTitle ? assignmentName?.focus() : document.querySelector("#assignmentModal .select-row")?.focus()), 80);
}

function closeModal() {
  const modal = document.querySelector("#assignmentModal");
  if (!modal.classList.contains("open")) return;
  modal.classList.add("closing");
  document.body.classList.remove("modal-focus");
  setTimeout(() => {
    modal.classList.remove("open", "closing");
    modal.setAttribute("aria-hidden", "true");
  }, 190);
}

function createAssignment() {
  const name = document.querySelector("#assignmentName")?.value.trim() || "New Training Assignment";
  const audience = document.querySelector("#assignmentAudience")?.value || "Selected cohort";
  pipeline[0].items.unshift({
    title: name,
    meta: audience,
    owner: 6,
    risk: "On Track"
  });
  renderKanban();
  closeModal();
  showToast(`${name} created for ${audience}`);
}

function setupFilters() {
  document.querySelectorAll("#pipelineFilters button").forEach((button) => {
    button.addEventListener("click", () => {
      pipelineFilter = button.dataset.filter;
      document.querySelectorAll("#pipelineFilters button").forEach((item) => item.classList.toggle("active", item === button));
      renderKanban();
    });
  });

  document.querySelectorAll("[data-department-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      departmentFilter = button.dataset.departmentFilter;
      document.querySelectorAll("[data-department-filter]").forEach((item) => item.classList.toggle("active", item === button));
      renderDepartments();
      showToast(`${button.textContent} training cohorts`);
    });
  });
}

function setupJourneyBuilder() {
  let template = "";
  document.querySelectorAll(".bank-card").forEach((card) => {
    if (card.dataset.dragReady) return;
    card.dataset.dragReady = "true";
    card.addEventListener("dragstart", (event) => {
      template = card.dataset.template;
      card.classList.add("active");
      event.dataTransfer.effectAllowed = "copy";
      event.dataTransfer.setData("text/plain", template);
      createDragGhost(card, event.clientX, event.clientY);
    });
    card.addEventListener("drag", (event) => moveDragGhost(event.clientX, event.clientY));
    card.addEventListener("dragend", () => {
      card.classList.remove("active");
      removeDragGhost();
    });
  });

  document.querySelectorAll(".journey-stage .task-card").forEach((task) => {
    if (task.dataset.dragReady) return;
    task.dataset.dragReady = "true";
    task.draggable = true;
    task.addEventListener("dragstart", (event) => {
      activeDraggedTask = task;
      template = "";
      task.classList.add("dragging");
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.setData("text/plain", task.textContent.trim());
      createDragGhost(task, event.clientX, event.clientY);
    });
    task.addEventListener("drag", (event) => moveDragGhost(event.clientX, event.clientY));
    task.addEventListener("dragend", () => {
      task.classList.remove("dragging");
      activeDraggedTask = null;
      removeDragGhost();
    });
  });

  wirePointerJourneyDrag();

  document.querySelectorAll(".journey-stage").forEach((stage) => {
    if (stage.dataset.dropReady) return;
    stage.dataset.dropReady = "true";
    stage.addEventListener("dragover", (event) => {
      event.preventDefault();
      stage.classList.add("over");
    });
    stage.addEventListener("dragleave", () => stage.classList.remove("over"));
    stage.addEventListener("drop", () => {
      stage.classList.remove("over");
      if (activeDraggedTask) {
        stage.appendChild(activeDraggedTask);
        activeDraggedTask.classList.add("added");
        showToast(`Training block moved to ${stage.dataset.stage}`);
        activeDraggedTask = null;
        removeDragGhost();
        return;
      }
      if (!template) return;
      const task = document.createElement("div");
      task.className = "task-card ghost added";
      task.draggable = true;
      task.innerHTML = `<span class="plus-bubble">+</span>${template}${icon("ellipsis")}`;
      stage.appendChild(task);
      lucide.createIcons();
      setupJourneyBuilder();
      showToast(`${template} added to ${stage.dataset.stage}`);
      template = "";
      removeDragGhost();
    });
  });

  const scrollArea = document.querySelector(".journey-scroll");
  if (scrollArea && !scrollArea.dataset.wheelBound) {
    scrollArea.dataset.wheelBound = "true";
    scrollArea.addEventListener("wheel", (event) => {
      if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
      scrollArea.scrollLeft += event.deltaY;
      event.preventDefault();
    }, { passive: false });
  }
  setupJourneyPanning();
}

function wirePointerJourneyDrag() {
  document.querySelectorAll(".journey-stage .task-card, .bank-card").forEach((source) => {
    if (source.dataset.pointerDragReady) return;
    source.dataset.pointerDragReady = "true";
    source.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      event.preventDefault();
      const isBankCard = source.classList.contains("bank-card");
      const template = source.dataset.template;
      source.classList.add(isBankCard ? "active" : "dragging");
      createDragGhost(source, event.clientX, event.clientY);

      const move = (moveEvent) => {
        moveDragGhost(moveEvent.clientX, moveEvent.clientY);
        document.querySelectorAll(".journey-stage.over").forEach((stage) => stage.classList.remove("over"));
        const stage = document.elementFromPoint(moveEvent.clientX, moveEvent.clientY)?.closest(".journey-stage");
        stage?.classList.add("over");
      };

      const finish = (upEvent) => {
        document.removeEventListener("pointermove", move);
        document.removeEventListener("pointerup", finish);
        document.querySelectorAll(".journey-stage.over").forEach((stage) => stage.classList.remove("over"));
        source.classList.remove(isBankCard ? "active" : "dragging");
        const stage = document.elementFromPoint(upEvent.clientX, upEvent.clientY)?.closest(".journey-stage");
        if (stage) {
          if (isBankCard && template) {
            const task = document.createElement("div");
            task.className = "task-card ghost added";
            task.draggable = true;
            task.innerHTML = `<span class="plus-bubble">+</span>${template}${icon("ellipsis")}`;
            stage.appendChild(task);
            lucide.createIcons();
            setupJourneyBuilder();
            showToast(`${template} added to ${stage.dataset.stage}`);
          } else {
            stage.appendChild(source);
            source.classList.add("added");
            showToast(`Training block moved to ${stage.dataset.stage}`);
          }
        }
        removeDragGhost();
      };

      document.addEventListener("pointermove", move);
      document.addEventListener("pointerup", finish);
    });
  });
}

function setupJourneyPanning() {
  const scrollArea = document.querySelector(".journey-scroll");
  if (!scrollArea || scrollArea.dataset.panBound) return;
  scrollArea.dataset.panBound = "true";
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  scrollArea.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 || event.target.closest("button, .task-card, .bank-card")) return;
    isDown = true;
    startX = event.clientX;
    scrollLeft = scrollArea.scrollLeft;
    scrollArea.classList.add("is-panning");
  });

  window.addEventListener("pointermove", (event) => {
    if (!isDown) return;
    const delta = event.clientX - startX;
    scrollArea.scrollLeft = scrollLeft - delta;
  });

  window.addEventListener("pointerup", () => {
    if (!isDown) return;
    isDown = false;
    scrollArea.classList.remove("is-panning");
  });
}

function setupModalInteractions() {
  if (!document.body.dataset.modalDelegatesReady) {
    document.body.dataset.modalDelegatesReady = "true";
    document.addEventListener("pointerdown", (event) => {
      const row = event.target.closest(".select-row");
      if (row) {
        event.preventDefault();
        const field = row.closest(".select-field");
        if (!field) return;
        document.querySelectorAll(".select-field.open").forEach((openField) => {
          if (openField !== field) openField.classList.remove("open");
        });
        field.classList.toggle("open");
        return;
      }

      const optionButton = event.target.closest(".select-option");
      if (optionButton) {
        event.preventDefault();
        const field = optionButton.closest(".select-field");
        const rowForOption = field?.querySelector(".select-row");
        if (!field || !rowForOption) return;
        const option = JSON.parse(optionButton.dataset.option);
        field.querySelectorAll(".select-option").forEach((item) => item.classList.toggle("active", item === optionButton));
        if (option.type === "team") {
          rowForOption.innerHTML = `
            ${option.people.map((personIndex) => `<img src="${employees[personIndex].img}" alt="">`).join("")}
            <strong>${option.title}</strong><span>${option.meta}</span>${icon("chevron-down")}
          `;
        } else {
          rowForOption.innerHTML = `<img src="${option.img}" alt="">${option.title}<span>${option.meta}</span>${icon("chevron-down")}`;
        }
        field.classList.remove("open");
        lucide.createIcons();
        showToast(`${option.title} selected`);
        return;
      }

      if (event.target.closest(".select-field")) return;
      document.querySelectorAll(".select-field.open").forEach((field) => field.classList.remove("open"));
    });
  }

  const ownerOptions = employees.slice(0, 5).map((person) => ({
    title: person.name,
    meta: person.role,
    img: person.img,
    type: "owner"
  }));
  const teamOptions = [
    { title: "Guest Services", meta: "48 learners", people: [0, 6, 4] },
    { title: "Front Desk", meta: "86 learners", people: [1, 3, 2] },
    { title: "Operations", meta: "42 learners", people: [5, 7, 6] },
    { title: "Leadership", meta: "24 learners", people: [2, 3, 5] }
  ].map((team) => ({ ...team, type: "team" }));

  document.querySelectorAll(".select-row").forEach((row, index) => {
    const field = row.closest("label");
    if (!field || field.dataset.selectReady) return;
    field.dataset.selectReady = "true";
    field.classList.add("select-field");
    row.tabIndex = 0;
    const options = index === 0 ? ownerOptions : teamOptions;
    const menu = document.createElement("div");
    menu.className = "select-menu";
    menu.innerHTML = options.map((option, optionIndex) => {
      const avatar = option.type === "team"
        ? `<span class="cohort-stack">${option.people.map((personIndex) => `<img src="${employees[personIndex].img}" alt="">`).join("")}</span>`
        : `<img src="${option.img}" alt="">`;
      return `
        <button type="button" class="select-option ${optionIndex === 0 ? "active" : ""}" data-option='${JSON.stringify(option)}'>
          ${avatar}
          <span><strong>${option.title}</strong><span>${option.meta}</span></span>
          ${icon(optionIndex === 0 ? "check" : "chevron-right")}
        </button>
      `;
    }).join("");
    field.appendChild(menu);

    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        row.click();
      }
    });
  });

  const range = document.querySelector(".range-row input");
  const rangeValue = document.querySelector(".range-row span");
  const updateRange = () => {
    const hours = Math.round(60 + Number(range.value) * 2.66);
    rangeValue.textContent = `${hours}h`;
  };
  range?.addEventListener("input", () => {
    range.closest(".range-row")?.classList.add("is-sliding");
    updateRange();
  });
  range?.addEventListener("pointerup", () => range.closest(".range-row")?.classList.remove("is-sliding"));
  range?.addEventListener("change", () => range.closest(".range-row")?.classList.remove("is-sliding"));
}

function setupUtilityActions() {
  const actions = [
    [".top-actions [aria-label='Search']", "Global learner and assignment search ready"],
    [".top-actions [aria-label='Inbox']", "HR inbox: 6 manager reviews pending"],
    [".top-actions [aria-label='Notifications']", "Notifications: 12 overdue learners flagged"],
    [".icon-set button:nth-child(1)", "Assignment report exported"],
    [".icon-set button:nth-child(2)", "Training calendar opened"],
    [".icon-set button:nth-child(3)", "Pipeline view expanded"]
  ];

  actions.forEach(([selector, message]) => {
    document.querySelector(selector)?.addEventListener("click", () => showToast(message));
  });
}

function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* ============================================================
   GENERIC INFO MODAL — every button opens a contextual panel
   ============================================================ */

function openInfoModal({ eyebrow = "Detail", title = "Detail", icon: iconName = "info", body = "", primaryLabel = "Got it", onPrimary = null }) {
  const modal = document.querySelector("#infoModal");
  document.querySelector("#infoModalEyebrow").textContent = eyebrow;
  document.querySelector("#infoModalTitle").textContent = title;
  document.querySelector("#infoModalIcon").innerHTML = icon(iconName);
  document.querySelector("#infoModalBody").innerHTML = body;

  const primary = document.querySelector("#infoModalPrimary");
  primary.textContent = primaryLabel;
  const fresh = primary.cloneNode(true);
  primary.replaceWith(fresh);
  fresh.addEventListener("click", () => {
    if (onPrimary) onPrimary();
    else closeInfoModal();
  });

  modal.classList.remove("closing");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-focus");
  lucide.createIcons();
}

function closeInfoModal() {
  closeGenericModal("#infoModal");
}

function closeGenericModal(selector) {
  const modal = document.querySelector(selector);
  if (!modal || !modal.classList.contains("open")) return;
  modal.classList.add("closing");
  if (!document.querySelector(".modal.open:not(.closing)")) document.body.classList.remove("modal-focus");
  setTimeout(() => {
    modal.classList.remove("open", "closing");
    modal.setAttribute("aria-hidden", "true");
  }, 190);
}

function statRows(rows) {
  return `<div class="info-stat-grid">${rows.map((r) => `
    <div class="info-stat"><span>${r[0]}</span><strong>${r[1]}</strong></div>`).join("")}</div>`;
}

function infoList(title, items, iconName = "check-circle") {
  return `<div class="info-section"><h4>${title}</h4><ul class="info-points">${items
    .map((i) => `<li>${icon(iconName)}<span>${i}</span></li>`)
    .join("")}</ul></div>`;
}

/* ---- Contextual content for the library / certificate / etc. ---- */

const contentAssetDetails = {
  PDF: { eyebrow: "Document", primary: "Download PDF", note: "5 pages · last reviewed this quarter · owned by L&D" },
  Manual: { eyebrow: "Handbook", primary: "Open Handbook", note: "Living document · version 3.2 · acknowledgement required" },
  Video: { eyebrow: "Video Module", primary: "Play Video", note: "3 short clips · ~14 min total · captions available" },
  Simulation: { eyebrow: "Scenario Simulation", primary: "Launch Simulation", note: "Voice / text / video branching · supervisor scoring" },
  Quiz: { eyebrow: "Knowledge Check", primary: "Start Quiz", note: "Multiple choice + scenario · passing 80%" },
  Certificate: { eyebrow: "Certificate", primary: "Configure Badge", note: "Auto-issued on pass · renewal reminders enabled" }
};

function openContentAsset(type, name, desc) {
  const meta = contentAssetDetails[type] || { eyebrow: type, primary: "Open", note: "Department training asset" };
  openInfoModal({
    eyebrow: meta.eyebrow,
    title: name,
    icon: "file-text",
    body: `
      <p class="info-lead">${desc}</p>
      ${statRows([["Type", type], ["Status", "Published"], ["Format", meta.eyebrow]])}
      <div class="info-note">${icon("info")}<span>${meta.note}</span></div>
    `,
    primaryLabel: meta.primary,
    onPrimary: () => {
      closeInfoModal();
      if (type === "Quiz" || type === "Simulation") openCourseModal();
      else showToast(`${name} opened`);
    }
  });
}

/* ============================================================
   COURSE CONTENT + ASSESSMENT — "Check-in for Walk-in Guests"
   Local rubric mirrors the reference backend (key_points scoring)
   ============================================================ */

const walkInCourse = {
  id: "course-001",
  title: "Check-in for Walk-in Guests",
  category: "Front Desk Operations",
  instructor: "John Smith · Front Desk Training Manager",
  duration: "22 min",
  modules: 4,
  difficulty: "Beginner",
  description:
    "Walk-in guests have no prior reservation, so they need fast, confident handling — from a warm greeting through availability checks, registration, payment, and a clear room handover. This module covers the full service workflow, PMS steps, and escalation protocol.",
  takeaways: [
    ["Professional Greeting", "Welcome walk-in guests warmly, make eye contact, and ask about their accommodation needs."],
    ["Check Room Availability", "Verify available room types and rates in the PMS before offering options."],
    ["Clear Rate Communication", "Explain room rates, inclusions, and any promotions clearly before registration."],
    ["Efficient Registration", "Collect all required details accurately and promptly to minimise wait time."],
    ["Payment & Handover", "Process payment securely, then explain the room, wifi, and facilities before handing over the key."]
  ],
  passingScore: 75,
  minAnswerLength: 12,
  questions: [
    {
      question: "What is the first thing you should do when a walk-in guest approaches the front desk?",
      keyPoints: ["greet warmly", "smile", "make eye contact", "acknowledge immediately", "put down other tasks", "give full attention"],
      minPoints: 3
    },
    {
      question: "How do you check room availability for a walk-in guest?",
      keyPoints: ["check PMS system", "verify room types available", "check rates", "consider guest preferences", "offer options", "upsell if appropriate"],
      minPoints: 3
    },
    {
      question: "What information must you collect during walk-in registration?",
      keyPoints: ["full name", "ID/passport", "contact number", "payment method", "signature", "expected checkout date", "special requests"],
      minPoints: 4
    },
    {
      question: "How do you handle payment processing for walk-in guests?",
      keyPoints: ["explain rate clearly", "collect deposit/pre-authorization", "offer payment options", "provide receipt", "explain charges", "incidentals hold"],
      minPoints: 3
    },
    {
      question: "What should you explain to the guest before handing over the room key?",
      keyPoints: ["room number and floor", "wifi password", "breakfast timing", "checkout time", "hotel facilities", "how to reach front desk"],
      minPoints: 4
    }
  ]
};

// Synonym map so spoken/typed answers match key points without an LLM
const keyPointMatchers = {
  "greet warmly": ["greet", "welcome", "hello", "warm", "friendly"],
  "smile": ["smile", "smiling"],
  "make eye contact": ["eye contact", "look at"],
  "acknowledge immediately": ["acknowledge", "immediately", "right away", "promptly", "as soon as"],
  "put down other tasks": ["stop what", "put down", "set aside", "pause"],
  "give full attention": ["full attention", "attention", "focus on"],
  "check PMS system": ["pms", "system", "property management", "computer"],
  "verify room types available": ["room type", "available", "availability", "vacancy", "vacant"],
  "check rates": ["rate", "price", "cost"],
  "consider guest preferences": ["preference", "needs", "request", "what they want"],
  "offer options": ["offer", "options", "choices", "alternatives"],
  "upsell if appropriate": ["upsell", "upgrade", "suite", "higher"],
  "full name": ["name", "full name"],
  "ID/passport": ["id", "passport", "identification", "nric", "identity"],
  "contact number": ["contact", "phone", "number", "mobile", "email"],
  "payment method": ["payment", "card", "credit", "cash", "pay"],
  "signature": ["sign", "signature"],
  "expected checkout date": ["checkout", "check out", "departure", "how many nights", "length of stay", "dates"],
  "special requests": ["special request", "special needs", "preferences", "requests"],
  "explain rate clearly": ["explain", "rate", "price", "clearly"],
  "collect deposit/pre-authorization": ["deposit", "pre-auth", "preauthor", "authoriz", "hold"],
  "offer payment options": ["payment option", "cash", "card", "credit", "methods"],
  "provide receipt": ["receipt", "invoice", "proof"],
  "explain charges": ["charges", "what they are paying", "breakdown", "fees"],
  "incidentals hold": ["incidental", "hold", "security deposit"],
  "room number and floor": ["room number", "floor", "which room", "location"],
  "wifi password": ["wifi", "wi-fi", "internet", "password"],
  "breakfast timing": ["breakfast", "dining", "meal"],
  "checkout time": ["checkout time", "check out time", "checkout"],
  "hotel facilities": ["facilities", "pool", "gym", "amenities", "spa"],
  "how to reach front desk": ["front desk", "reach us", "call us", "dial", "assistance", "contact us"]
};

function scoreAnswer(question, answer) {
  const text = (answer || "").toLowerCase();
  if (text.trim().length < walkInCourse.minAnswerLength) {
    return {
      score: 0,
      pass: false,
      covered: [],
      missed: question.keyPoints,
      feedback: "Answer too short. Please give a more detailed response covering the key steps."
    };
  }
  const covered = [];
  const missed = [];
  question.keyPoints.forEach((point) => {
    const matchers = keyPointMatchers[point] || [point];
    const hit = matchers.some((m) => text.includes(m.toLowerCase()));
    (hit ? covered : missed).push(point);
  });

  // Score: proportion of key points covered, scaled so meeting minPoints ≈ passing
  const ratio = covered.length / question.keyPoints.length;
  const minRatio = question.minPoints / question.keyPoints.length;
  let score = Math.round((ratio / minRatio) * walkInCourse.passingScore);
  // small fluency bonus for a substantive answer
  if (text.length > 120 && covered.length > 0) score += 4;
  score = Math.max(0, Math.min(100, score));
  const pass = covered.length >= question.minPoints && score >= walkInCourse.passingScore;

  let feedback;
  if (pass) {
    feedback = `Strong answer — you covered ${covered.length} of the key points clearly.`;
  } else if (covered.length > 0) {
    feedback = `Good start, but you missed a few important points. Aim to cover at least ${question.minPoints} key areas.`;
  } else {
    feedback = "This answer didn't cover the expected key points. Review the course material and try again.";
  }
  return { score, pass, covered, missed, feedback };
}

let assessment = null;

function openCourseModal() {
  const c = walkInCourse;
  const modal = document.querySelector("#courseModal");
  document.querySelector("#courseModalContent").innerHTML = `
    <div class="course-doc">
      <span class="eyebrow">${c.category}</span>
      <h2>${c.title}</h2>
      <p class="info-lead">${c.description}</p>
      <div class="course-meta-row">
        <div class="cmeta">${icon("user")}<span>Instructor</span><strong>${c.instructor.split(" · ")[0]}</strong></div>
        <div class="cmeta">${icon("clock")}<span>Duration</span><strong>${c.duration}</strong></div>
        <div class="cmeta">${icon("book")}<span>Modules</span><strong>${c.modules}</strong></div>
        <div class="cmeta">${icon("signal")}<span>Level</span><strong>${c.difficulty}</strong></div>
      </div>

      <div class="course-media">
        <button class="course-play" id="coursePlay">${icon("play")}</button>
        <div>
          <strong>Training recording — Walk-in check-in walkthrough</strong>
          <span>Audio narration of the full service workflow · ~22 min</span>
        </div>
      </div>

      <h3 class="course-sub">Key Takeaways</h3>
      <ul class="key-takeaways">
        ${c.takeaways.map((t) => `<li>${icon("check-circle")}<div><strong>${t[0]}:</strong> ${t[1]}</div></li>`).join("")}
      </ul>

      <div class="course-action">
        <button class="primary-action" id="startAssessment">${icon("clipboard-check")} Take Assessment</button>
        <p>Complete the 5-question assessment to earn your certificate. Passing score ${c.passingScore}%.</p>
      </div>
    </div>
  `;
  modal.classList.remove("closing");
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-focus");
  document.querySelector("#coursePlay")?.addEventListener("click", (e) => {
    const btn = e.currentTarget;
    btn.classList.toggle("playing");
    btn.innerHTML = icon(btn.classList.contains("playing") ? "pause" : "play");
    showToast(btn.classList.contains("playing") ? "Playing training recording…" : "Recording paused");
    lucide.createIcons();
  });
  document.querySelector("#startAssessment")?.addEventListener("click", startAssessment);
  lucide.createIcons();
}

function closeCourseModal() {
  if (assessment?.recognition) {
    try { assessment.recognition.stop(); } catch (e) {}
  }
  closeGenericModal("#courseModal");
}

function startAssessment() {
  assessment = {
    index: 0,
    scores: [],
    mode: "voice",
    recording: false,
    transcript: "",
    recognition: null
  };
  renderAssessmentQuestion();
}

function initRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return null;
  const rec = new SR();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = "en-US";
  rec.onresult = (event) => {
    let interim = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const t = event.results[i][0].transcript;
      if (event.results[i].isFinal) assessment.transcript += t + " ";
      else interim += t;
    }
    const box = document.querySelector("#transcriptBox");
    if (box) box.innerHTML = `${assessment.transcript}<span class="interim">${interim}</span>` || "Listening…";
    syncAnswerField();
  };
  rec.onerror = (e) => {
    if (e.error === "not-allowed") showToast("Microphone blocked — use the text box instead");
    else if (e.error === "no-speech") showToast("No speech detected, keep talking…");
    stopRecording();
  };
  rec.onend = () => { if (assessment.recording) { try { rec.start(); } catch (e) {} } };
  return rec;
}

function syncAnswerField() {
  const field = document.querySelector("#answerField");
  if (field && assessment.mode === "voice") field.value = assessment.transcript.trim();
}

function renderAssessmentQuestion() {
  const c = walkInCourse;
  const q = c.questions[assessment.index];
  const total = c.questions.length;
  const progress = Math.round((assessment.index / total) * 100);
  document.querySelector("#courseModalContent").innerHTML = `
    <div class="assess">
      <div class="assess-head">
        <span class="eyebrow">Voice / Text Assessment · ${c.title}</span>
        <div class="assess-progress"><span style="width:${progress}%"></span></div>
        <div class="assess-count">Question ${assessment.index + 1} of ${total}</div>
      </div>

      <div class="assess-question">${icon("message-circle")}<p>${q.question}</p></div>

      <div class="assess-modes">
        <button class="mode-pill ${assessment.mode === "voice" ? "active" : ""}" data-mode="voice">${icon("mic")} Voice answer</button>
        <button class="mode-pill ${assessment.mode === "text" ? "active" : ""}" data-mode="text">${icon("keyboard")} Text answer</button>
      </div>

      <div class="voice-stage ${assessment.mode === "voice" ? "" : "hidden"}">
        <button class="record-btn" id="recordBtn">${icon("mic")}<span>Start Answer</span></button>
        <div class="transcript-box" id="transcriptBox">Your spoken response will appear here…</div>
      </div>

      <textarea class="assess-text ${assessment.mode === "text" ? "" : "hidden"}" id="answerField" placeholder="Type your answer here…" rows="5"></textarea>

      <div class="assess-actions">
        <button class="secondary-action" id="repeatQ">${icon("rotate-ccw")} Re-read</button>
        <button class="primary-action" id="submitAnswer">${icon("send")} Submit Answer</button>
        <button class="secondary-action ghost-action" id="skipQ">${icon("chevron-right")} Skip</button>
      </div>
      <div class="assess-result hidden" id="assessResult"></div>
    </div>
  `;
  assessment.transcript = "";
  assessment.recording = false;

  document.querySelectorAll(".mode-pill").forEach((pill) => {
    pill.addEventListener("click", () => setAssessmentMode(pill.dataset.mode));
  });
  document.querySelector("#recordBtn")?.addEventListener("click", toggleRecording);
  document.querySelector("#submitAnswer")?.addEventListener("click", submitAssessmentAnswer);
  document.querySelector("#skipQ")?.addEventListener("click", skipAssessmentQuestion);
  document.querySelector("#repeatQ")?.addEventListener("click", () => showToast("Question re-read"));
  lucide.createIcons();
}

function setAssessmentMode(mode) {
  if (assessment.recording) stopRecording();
  assessment.mode = mode;
  document.querySelectorAll(".mode-pill").forEach((p) => p.classList.toggle("active", p.dataset.mode === mode));
  document.querySelector(".voice-stage")?.classList.toggle("hidden", mode !== "voice");
  document.querySelector("#answerField")?.classList.toggle("hidden", mode !== "text");
  if (mode === "voice") syncAnswerField();
}

function toggleRecording() {
  if (assessment.recording) { stopRecording(); return; }
  if (!assessment.recognition) assessment.recognition = initRecognition();
  if (!assessment.recognition) {
    showToast("Voice not supported in this browser — switching to text");
    setAssessmentMode("text");
    return;
  }
  assessment.recording = true;
  assessment.transcript = "";
  const btn = document.querySelector("#recordBtn");
  btn.classList.add("recording");
  btn.innerHTML = `${icon("square")}<span>Stop Answer</span>`;
  document.querySelector("#transcriptBox").textContent = "Listening…";
  try { assessment.recognition.start(); } catch (e) {}
  lucide.createIcons();
}

function stopRecording() {
  assessment.recording = false;
  const btn = document.querySelector("#recordBtn");
  if (btn) {
    btn.classList.remove("recording");
    btn.innerHTML = `${icon("mic")}<span>Start Answer</span>`;
    lucide.createIcons();
  }
  try { assessment.recognition?.stop(); } catch (e) {}
  syncAnswerField();
}

function submitAssessmentAnswer() {
  if (assessment.recording) stopRecording();
  const field = document.querySelector("#answerField");
  const answer = (assessment.mode === "voice" ? assessment.transcript : field.value).trim();
  if (!answer) { showToast("Please record or type an answer first"); return; }
  const q = walkInCourse.questions[assessment.index];
  const result = scoreAnswer(q, answer);
  assessment.scores.push(result);
  showAnswerResult(result);
}

function showAnswerResult(result) {
  const box = document.querySelector("#assessResult");
  const last = assessment.index === walkInCourse.questions.length - 1;
  document.querySelector(".assess-actions").classList.add("hidden");
  box.classList.remove("hidden");
  box.innerHTML = `
    <div class="result-card ${result.pass ? "pass" : "fail"}">
      <div class="result-top">
        <div class="result-score"><strong>${result.score}</strong><span>/ 100</span></div>
        <div class="result-badge ${result.pass ? "pass" : "fail"}">${icon(result.pass ? "check-circle" : "alert-circle")} ${result.pass ? "Passed" : "Needs Improvement"}</div>
      </div>
      <p class="result-feedback">${result.feedback}</p>
      ${result.covered.length ? `<div class="result-points"><h4>${icon("check")} Points covered</h4><ul>${result.covered.map((p) => `<li>${p}</li>`).join("")}</ul></div>` : ""}
      ${result.missed.length ? `<div class="result-points missed"><h4>${icon("lightbulb")} Consider mentioning</h4><ul>${result.missed.map((p) => `<li>${p}</li>`).join("")}</ul></div>` : ""}
      <button class="primary-action" id="nextQ">${last ? "See Final Result" : "Next Question"} ${icon("arrow-right")}</button>
    </div>
  `;
  document.querySelector("#nextQ").addEventListener("click", () => {
    assessment.index += 1;
    if (assessment.index < walkInCourse.questions.length) renderAssessmentQuestion();
    else showFinalResult();
  });
  lucide.createIcons();
}

function skipAssessmentQuestion() {
  if (assessment.recording) stopRecording();
  assessment.scores.push({ score: 0, pass: false, covered: [], missed: walkInCourse.questions[assessment.index].keyPoints, feedback: "Question skipped." });
  assessment.index += 1;
  if (assessment.index < walkInCourse.questions.length) renderAssessmentQuestion();
  else showFinalResult();
  showToast("Question skipped (0%)");
}

function showFinalResult() {
  const total = walkInCourse.questions.length;
  const avg = Math.round(assessment.scores.reduce((s, r) => s + r.score, 0) / total);
  const passed = avg >= walkInCourse.passingScore;
  const passedCount = assessment.scores.filter((r) => r.pass).length;

  if (passed) launchConfetti();

  document.querySelector("#courseModalContent").innerHTML = `
    <div class="assess-complete">
      <div class="complete-icon ${passed ? "pass" : "fail"}">${icon(passed ? "trophy" : "graduation-cap")}</div>
      <h2>Assessment Complete</h2>
      <div class="final-score ${passed ? "pass" : "fail"}">
        <span class="big">${avg}%</span>
        <span class="status">${passed ? "PASSED" : "NEEDS IMPROVEMENT"}</span>
      </div>
      ${statRows([["Questions", total], ["Passed", `${passedCount} / ${total}`], ["Pass mark", `${walkInCourse.passingScore}%`]])}
      <div class="final-breakdown">
        ${assessment.scores.map((r, i) => `
          <div class="fb-row ${r.pass ? "pass" : "fail"}">
            <span>Q${i + 1}</span>
            <div class="fb-bar"><span style="width:${r.score}%"></span></div>
            <strong>${r.score}%</strong>
          </div>`).join("")}
      </div>
      ${passed
        ? `<div class="cert-block">${icon("award")}<div><strong>Certificate of Completion</strong><span>${walkInCourse.title} · awarded to John Smith · ${avg}%</span></div></div>`
        : `<p class="retry-note">You need ${walkInCourse.passingScore}% to pass. Review the key takeaways and try again.</p>`}
      <div class="assess-actions center">
        <button class="secondary-action" id="reviewCourse">${icon("book-open")} Back to Course</button>
        <button class="primary-action" id="retakeOrDone">${passed ? icon("check") + " Done" : icon("rotate-ccw") + " Retake"}</button>
      </div>
    </div>
  `;
  document.querySelector("#reviewCourse").addEventListener("click", openCourseModal);
  document.querySelector("#retakeOrDone").addEventListener("click", () => {
    if (passed) closeCourseModal();
    else startAssessment();
  });
  lucide.createIcons();
}

function launchConfetti() {
  const container = document.createElement("div");
  container.className = "confetti-container";
  document.body.appendChild(container);
  const colors = ["#88a7dc", "#ee787d", "#f3dc6c", "#8fc4aa"];
  for (let i = 0; i < 80; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "%";
    c.style.background = colors[i % colors.length];
    c.style.animationDelay = Math.random() * 1.5 + "s";
    c.style.animationDuration = Math.random() * 1.5 + 2 + "s";
    container.appendChild(c);
  }
  setTimeout(() => container.remove(), 4500);
}

/* ============================================================
   WIRE EVERY REMAINING BUTTON TO CONTEXTUAL INFO
   ============================================================ */

function wireAllButtons() {
  // Rail utility buttons
  const railInfo = {
    "Calendar": { eyebrow: "Schedule", title: "Training Calendar", icon: "calendar-days", body: `<p class="info-lead">Upcoming cohort sessions and certification deadlines across all departments.</p>${infoList("This week", ["Mon — Front Desk SOP refresher (24 learners)", "Wed — Safety recertification drill", "Fri — Guest recovery practical scoring"], "calendar")}` },
    "Compliance Alerts": { eyebrow: "Compliance", title: "Compliance Alerts", icon: "triangle-alert", body: `${statRows([["Overdue items", "38"], ["Expiring < 30d", "17"], ["At-risk learners", "12"]])}${infoList("Needs attention", ["Safety Briefing Basics — 5 learners overdue", "12 Safety Compliance attestations pending", "Data Privacy renewal expires in 9 days"], "alert-circle")}` },
    "Dim Mode": null, // handled separately (toggle)
    "Settings": { eyebrow: "Workspace", title: "Settings", icon: "settings", body: `${infoList("Preferences", ["Notifications: Email + in-app", "Default cohort view: Pipelines", "Certification reminders: 90 / 30 / 7 days", "Language: English (UK)"], "sliders-horizontal")}` }
  };
  document.querySelectorAll(".rail-button.utility").forEach((btn) => {
    const label = btn.dataset.label;
    if (btn.id === "dimToggle") return;
    const cfg = railInfo[label];
    if (cfg) btn.addEventListener("click", () => openInfoModal(cfg));
  });

  // Top bar avatar
  document.querySelector(".avatar.me")?.addEventListener("click", () => openInfoModal({
    eyebrow: "Signed in", title: "Administrator", icon: "user-cog",
    body: `${statRows([["Role", "L&D Admin"], ["Cohorts owned", "8"], ["Pending reviews", "6"]])}${infoList("Quick actions", ["Manage HR team ownership", "Export compliance report", "Configure certification rules"], "circle-dot")}`,
    primaryLabel: "Manage Profile"
  }));

  // Overview chart download / calendar buttons
  document.querySelector(".chart-card .round-button")?.addEventListener("click", () => openInfoModal({
    eyebrow: "Export", title: "Top Training Drivers", icon: "download",
    body: `<p class="info-lead">Last 30 days of training activity by driver.</p>${statRows([["Front Office SOP", "54%"], ["Safety & Compliance", "27%"], ["Guest Recovery", "19%"]])}`,
    primaryLabel: "Download CSV", onPrimary: () => { closeInfoModal(); showToast("Driver report exported"); }
  }));
  document.querySelectorAll(".chart-card .round-button")[1]?.addEventListener("click", () => openInfoModal({
    eyebrow: "Period", title: "Training Metrics", icon: "calendar",
    body: `${statRows([["Completion", "86%"], ["Avg score", "4.6 / 5"], ["Certified", "92%"]])}<div class="info-note">${icon("info")}<span>Showing the current quarter. Switch period from the report export.</span></div>`
  }));

  // Department edit pencils
  document.addEventListener("click", (e) => {
    const pencil = e.target.closest(".department-card .round-button");
    if (!pencil) return;
    e.stopPropagation();
    const name = pencil.closest(".department-card")?.dataset.department;
    openInfoModal({
      eyebrow: "Edit cohort", title: `${name} Training`, icon: "pencil",
      body: `${infoList("Editable settings", ["Reassign HR owner and responsible team", "Adjust allocated learning hours", "Set certification pass threshold", "Add or retire content from the library"], "circle-dot")}`,
      primaryLabel: "Open Library", onPrimary: () => { closeInfoModal(); openDepartmentDetail(name); }
    });
  });

  // Content library asset cards (delegated — grid is re-rendered)
  document.querySelector("#contentLibraryGrid")?.addEventListener("click", (e) => {
    const card = e.target.closest(".content-asset-card");
    if (!card) return;
    openContentAsset(card.dataset.type, card.dataset.title, card.dataset.desc);
  });

  // "Add Content" buttons
  document.querySelectorAll(".content-detail-hero .primary-action, .content-detail-panel .primary-action").forEach((btn) => {
    btn.addEventListener("click", () => openInfoModal({
      eyebrow: "New asset", title: "Add Content", icon: "plus",
      body: `${infoList("Choose a content type", ["PDF / SOP document", "Handbook or manual", "Video module", "Scenario simulation (voice / text / video)", "Knowledge check quiz", "Certificate & badge"], "circle-dot")}`,
      primaryLabel: "Create Draft", onPrimary: () => { closeInfoModal(); showToast("Draft content created in library"); }
    }));
  });

  // Learner hero "Continue Learning"
  document.querySelector(".learner-hero .primary-action")?.addEventListener("click", openCourseModal);

  // Certificate cards in employee portal
  document.querySelectorAll(".employee-side .certificate-card").forEach((card) => {
    card.addEventListener("click", () => {
      const name = card.querySelector("span")?.textContent || "Certificate";
      const status = card.querySelector("strong")?.textContent || "";
      const isWarn = card.classList.contains("warning");
      openInfoModal({
        eyebrow: "Certificate", title: name, icon: card.classList.contains("certified") ? "badge-check" : "medal",
        body: `${statRows([["Status", status], ["Issued", "John Smith"], ["Type", "Role certification"]])}<div class="info-note">${icon(isWarn ? "clock" : "info")}<span>${isWarn ? "Renewal due soon — complete the practical to extend validity." : "Certificate is valid. Renewal reminders are scheduled automatically."}</span></div>`,
        primaryLabel: isWarn ? "Renew Now" : "View Certificate",
        onPrimary: () => { closeInfoModal(); isWarn ? openCourseModal() : showToast(`${name} certificate opened`); }
      });
    });
  });

  // Analytics cards
  const analyticsDetail = {
    "Assigned Employees": ["Across 8 departments", ["Frontline", "612"], ["Operations", "388"], ["Leadership", "284"]],
    "Completion Rate": ["Trailing 30 days", ["On track", "74%"], ["At risk", "12%"], ["Overdue", "14%"]],
    "Certified Roles": ["Active certifications", ["Front Office", "312"], ["Safety", "248"], ["Service", "352"]],
    "Overdue Items": ["Requires escalation", ["Safety", "14"], ["Privacy", "9"], ["Service", "15"]]
  };
  document.querySelectorAll(".analytics-card").forEach((card) => {
    card.addEventListener("click", () => {
      const label = card.querySelector("span")?.textContent;
      const val = card.querySelector("strong")?.textContent;
      const d = analyticsDetail[label] || ["Breakdown", ["A", "—"]];
      openInfoModal({
        eyebrow: d[0], title: `${label}: ${val}`, icon: "pie-chart",
        body: statRows(d.slice(1))
      });
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderKanban();
  renderDepartments();
  renderAvatars();
  renderJourneySwitcher();
  renderJourneyBuilder();
  renderCourses();
  setupFilters();
  setupUtilityActions();
  setupModalInteractions();

  document.querySelectorAll(".rail-nav").forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.view));
  });

  wireAllButtons();

  document.querySelector("#newAssignment")?.addEventListener("click", openModal);
  document.querySelector("#backToDepartments")?.addEventListener("click", () => switchView("assignments"));
  document.querySelector("#createAssignment")?.addEventListener("click", createAssignment);

  // Generic modal dismissal — routes to whichever modal the control lives in
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".modal-close, .modal-cancel, .modal-backdrop")) return;
    const modal = event.target.closest(".modal");
    if (!modal) return;
    if (modal.id === "assignmentModal") closeModal();
    else if (modal.id === "courseModal") closeCourseModal();
    else closeGenericModal(`#${modal.id}`);
  });

  document.querySelector("#dimToggle")?.addEventListener("click", (e) => {
    document.body.classList.toggle("dimmed");
    showToast(document.body.classList.contains("dimmed") ? "Dim mode on" : "Dim mode off");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const open = document.querySelector(".modal.open:not(.closing)");
    if (!open) return;
    if (open.id === "assignmentModal") closeModal();
    else if (open.id === "courseModal") closeCourseModal();
    else closeGenericModal(`#${open.id}`);
  });

  lucide.createIcons();
});
