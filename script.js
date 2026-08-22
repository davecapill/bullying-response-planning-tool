// =====================================================
// BULLYING RESPONSE PLANNING TOOL
// Complete script.js
// =====================================================


// =====================================================
// ELEMENTS / STATE
// =====================================================

const landingPage = document.getElementById("landingPage");
const startButton = document.getElementById("startButton");

const questionnaire = document.getElementById("questionnaire");
const sections = document.querySelectorAll(".form-section");
const nextButton = document.getElementById("nextButton");
const backButton = document.getElementById("backButton");
const progressBar = document.getElementById("progressBar");

const actionPlan = document.getElementById("actionPlan");
const printButton = document.getElementById("printButton");
const restartButton = document.getElementById("restartButton");
const editResponsesButton = document.getElementById("editResponsesButton");
const selectedCount = document.getElementById("selectedCount");
const planDate = document.getElementById("planDate");

let currentSection = 1;
const totalSections = sections.length;


// =====================================================
// INITIAL SETUP
// =====================================================

function setDefaultPlanDate() {
  if (!planDate || planDate.value) {
    return;
  }

  const today = new Date();
  const localDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  planDate.value = localDate;
}

setDefaultPlanDate();


// =====================================================
// START
// =====================================================

if (startButton) {
  startButton.addEventListener("click", function () {
    if (landingPage) {
      landingPage.classList.add("hidden");
    }

    questionnaire.classList.remove("hidden");
    currentSection = 1;
    showSection(currentSection);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
}


// =====================================================
// QUESTIONNAIRE NAVIGATION
// =====================================================

if (nextButton) {
  nextButton.addEventListener("click", function () {
    if (!validateCurrentSection()) {
      return;
    }

    if (currentSection < totalSections) {
      currentSection++;
      showSection(currentSection);
    } else {
      generateActionPlan();
    }
  });
}


if (backButton) {
  backButton.addEventListener("click", function () {
    if (currentSection > 1) {
      currentSection--;
      showSection(currentSection);
    }
  });
}


function showSection(sectionNumber) {
  sections.forEach(function (section) {
    section.classList.remove("active-section");
  });

  const selectedSection = document.querySelector(
    `.form-section[data-section="${sectionNumber}"]`
  );

  if (selectedSection) {
    selectedSection.classList.add("active-section");
  }

  if (progressBar && totalSections > 0) {
    progressBar.style.width =
      `${(sectionNumber / totalSections) * 100}%`;
  }

  if (backButton) {
    backButton.style.visibility =
      sectionNumber === 1 ? "hidden" : "visible";
  }

  if (nextButton) {
    nextButton.textContent =
      sectionNumber === totalSections
        ? "Generate Action Plan"
        : "Next";
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// =====================================================
// VALIDATION
// =====================================================

function validateCurrentSection() {
  const current =
    document.querySelector(
      `.form-section[data-section="${currentSection}"]`
    );

  if (!current) {
    return true;
  }

  const selects = current.querySelectorAll("select");

  for (const select of selects) {
    if (!select.value) {
      alert(
        "Please complete all questions in this section before continuing."
      );

      select.focus();
      return false;
    }
  }

  return true;
}


// =====================================================
// COLLECT ANSWERS
// =====================================================

function getAnswers() {
  return {
    pattern: document.getElementById("pattern").value,
    power: document.getElementById("power").value,
    context: document.getElementById("context").value,

    safety: document.getElementById("safety").value,
    impact: document.getElementById("impact").value,

    behaviourUnderstanding:
      document.getElementById("behaviourUnderstanding").value,

    skills:
      document.getElementById("skills").value,

    environment:
      document.getElementById("environment").value,

    adjustments:
      document.getElementById("adjustments").value,

    peers:
      document.getElementById("peers").value,

    belonging:
      document.getElementById("belonging").value,

    family:
      document.getElementById("family").value,

    supports:
      document.getElementById("supports").value,

    previousResponse:
      document.getElementById("previousResponse").value,

    monitoring:
      document.getElementById("monitoring").value
  };
}


// =====================================================
// BUILD DECISION PROFILE
// =====================================================

function buildDecisionProfile(answers) {
  const profile = {
    SAFETY: 0,
    PERSISTENCE: 0,
    IMPACT: 0,
    BEHAVIOUR_NEED: 0,
    ENVIRONMENT: 0,
    PEER: 0,
    WELLBEING_CONNECTION: 0,
    RESPONSE_HISTORY: 0,
    FAMILY: 0,
    ADJUSTMENTS: 0,
    COORDINATION: 0,
    POWER: 0
  };


  // Pattern / persistence
  if (answers.pattern === "emerging") {
    profile.PERSISTENCE = 1;
  }

  if (answers.pattern === "repeated") {
    profile.PERSISTENCE = 2;
  }

  if (answers.pattern === "persistent") {
    profile.PERSISTENCE = 2;
    profile.RESPONSE_HISTORY = 2;
  }


  // Power imbalance
  if (answers.power === "some") {
    profile.POWER = 1;
  }

  if (answers.power === "clear") {
    profile.POWER = 2;
  }


  // Safety
  if (answers.safety === "some") {
    profile.SAFETY = 1;
  }

  if (answers.safety === "significant") {
    profile.SAFETY = 2;
  }


  // Impact
  if (answers.impact === "moderate") {
    profile.IMPACT = 1;
    profile.WELLBEING_CONNECTION = 1;
  }

  if (answers.impact === "significant") {
    profile.IMPACT = 2;
    profile.WELLBEING_CONNECTION = 2;
  }


  // Behaviour understanding
  if (answers.behaviourUnderstanding === "partial") {
    profile.BEHAVIOUR_NEED = Math.max(
      profile.BEHAVIOUR_NEED,
      1
    );
  }

  if (answers.behaviourUnderstanding === "unclear") {
    profile.BEHAVIOUR_NEED = Math.max(
      profile.BEHAVIOUR_NEED,
      2
    );
  }


  // Skill need
  if (answers.skills === "some") {
    profile.BEHAVIOUR_NEED = Math.max(
      profile.BEHAVIOUR_NEED,
      1
    );
  }

  if (answers.skills === "significant") {
    profile.BEHAVIOUR_NEED = Math.max(
      profile.BEHAVIOUR_NEED,
      2
    );
  }


  // Environment
  if (answers.environment === "some") {
    profile.ENVIRONMENT = 1;
  }

  if (answers.environment === "multiple") {
    profile.ENVIRONMENT = 2;
  }


  // Adjustments
  if (answers.adjustments === "review") {
    profile.ADJUSTMENTS = 1;
  }

  if (answers.adjustments === "significant") {
    profile.ADJUSTMENTS = 2;
  }


  // Peers
  if (answers.peers === "some") {
    profile.PEER = 1;
  }

  if (answers.peers === "significant") {
    profile.PEER = 2;
  }


  // Belonging
  if (answers.belonging === "some") {
    profile.WELLBEING_CONNECTION = Math.max(
      profile.WELLBEING_CONNECTION,
      1
    );
  }

  if (answers.belonging === "significant") {
    profile.WELLBEING_CONNECTION = 2;
  }


  // Family
  if (answers.family === "partial") {
    profile.FAMILY = 1;
  }

  if (answers.family === "complex") {
    profile.FAMILY = 2;
  }


  // Coordination
  if (answers.supports === "some") {
    profile.COORDINATION = 1;
  }

  if (answers.supports === "significant") {
    profile.COORDINATION = 2;
  }


  // Previous response
  if (answers.previousResponse === "partial") {
    profile.RESPONSE_HISTORY = Math.max(
      profile.RESPONSE_HISTORY,
      1
    );
  }

  if (answers.previousResponse === "notWorking") {
    profile.RESPONSE_HISTORY = 2;
  }


  return profile;
}


// =====================================================
// DETERMINE RESPONSE TIERS
//
// Tier 1 always remains active.
// Tier 2 and Tier 3 add to Tier 1 rather than replacing it.
// =====================================================

function determineTiers(profile) {
  let tier2 = false;
  let tier3 = false;

  const domainScores = [
    profile.SAFETY,
    profile.PERSISTENCE,
    profile.IMPACT,
    profile.BEHAVIOUR_NEED,
    profile.ENVIRONMENT,
    profile.PEER,
    profile.WELLBEING_CONNECTION,
    profile.RESPONSE_HISTORY,
    profile.FAMILY,
    profile.ADJUSTMENTS,
    profile.COORDINATION,
    profile.POWER
  ];

  const moderateDomains =
    domainScores.filter(function (score) {
      return score >= 1;
    }).length;

  const highDomains =
    domainScores.filter(function (score) {
      return score === 2;
    }).length;


  // Targeted support
  if (
    moderateDomains >= 2 ||
    profile.PERSISTENCE > 0 ||
    profile.IMPACT > 0 ||
    profile.BEHAVIOUR_NEED > 0 ||
    profile.RESPONSE_HISTORY > 0 ||
    profile.POWER === 2
  ) {
    tier2 = true;
  }


  // Intensive support
  if (
    profile.SAFETY === 2 ||
    highDomains >= 3 ||
    (
      profile.IMPACT === 2 &&
      (
        profile.PERSISTENCE === 2 ||
        profile.BEHAVIOUR_NEED === 2 ||
        profile.COORDINATION === 2 ||
        profile.ADJUSTMENTS === 2 ||
        profile.PEER === 2
      )
    )
  ) {
    tier3 = true;
    tier2 = true;
  }


  return {
    tier1: true,
    tier2: tier2,
    tier3: tier3
  };
}


// =====================================================
// CONTINUUM ACTION BANK
// =====================================================

const actionBank = {

  tier1: {

    core: [
      {
        action: "Immediate assessment of safety and ongoing risk",
        domain: "Safety, reporting and immediate response"
      },
      {
        action: "Clear expectations and proportionate consequences",
        domain: "Safety, reporting and immediate response"
      },
      {
        action: "Consistent implementation of the Student Code of Conduct",
        domain: "Individual behaviour assessment, planning and accountability"
      },
      {
        action: "Consistent documentation in OneSchool",
        domain: "Leadership, systems, documentation and review"
      },
      {
        action: "Explicit teaching of respectful relationships",
        domain: "Explicit teaching and social-emotional skill development"
      }
    ],


    safety: [
      {
        action: "Active supervision in identified locations",
        domain: "Safety, reporting and immediate response"
      },
      {
        action: "Protection from retaliation",
        domain: "Safety, reporting and immediate response"
      }
    ],


    environment: [
      {
        action: "Map bullying hotspots and vulnerable times",
        domain: "Environment, supervision and opportunity reduction"
      },
      {
        action: "Review seating, grouping and transitions",
        domain: "Environment, supervision and opportunity reduction"
      }
    ],


    online: [
      {
        action: "Explicit teaching of digital citizenship and safe online conduct",
        domain: "Explicit teaching and social-emotional skill development"
      },
      {
        action: "Reinforce clear digital behaviour expectations",
        domain: "Environment, supervision and opportunity reduction"
      }
    ],


    behaviour: [
      {
        action: "Classroom correction and re-teaching",
        domain: "Individual behaviour assessment, planning and accountability"
      },
      {
        action: "Reinforce appropriate replacement behaviour",
        domain: "Individual behaviour assessment, planning and accountability"
      }
    ],


    peers: [
      {
        action: "Reinforce peer norms that discourage bullying and harmful reinforcement",
        domain: "Peer-group, bystander and community response"
      },
      {
        action: "Monitor group and cohort dynamics",
        domain: "Peer-group, bystander and community response"
      }
    ],


    belonging: [
      {
        action: "Connect the student with at least one trusted adult",
        domain: "Positive school culture, belonging and protective experiences"
      },
      {
        action: "Provide strengths-based opportunities for success and contribution",
        domain: "Positive school culture, belonging and protective experiences"
      }
    ],


    adjustments: [
      {
        action: "Review reasonable adjustments based on functional need",
        domain: "Disability adjustments"
      },
      {
        action: "Review predictable routines and manageable task demands",
        domain: "Disability adjustments"
      }
    ],


    wellbeing: [
      {
        action: "Ensure access to school wellbeing staff",
        domain: "Wellbeing, mental health and student support services"
      },
      {
        action: "Provide regular wellbeing check-ins",
        domain: "Wellbeing, mental health and student support services"
      }
    ],


    family: [
      {
        action: "Provide clear information to family about expectations and processes",
        domain: "Family partnership and capability building"
      },
      {
        action: "Maintain positive family contact beyond incident communication",
        domain: "Family partnership and capability building"
      }
    ]

  },


  tier2: {

    safety: [
      {
        action: "Schedule follow-up with affected students",
        domain: "Safety, reporting and immediate response"
      },
      {
        action: "Develop an individual safety and support plan",
        domain: "Safety, reporting and immediate response"
      },
      {
        action: "Identify safe locations and staff contacts",
        domain: "Safety, reporting and immediate response"
      },
      {
        action: "Complete a short-cycle review of whether harm has stopped",
        domain: "Safety, reporting and immediate response"
      }
    ],


    persistence: [
      {
        action: "Analyse patterns in frequency, location, peers, triggers and impact",
        domain: "Safety, reporting and immediate response"
      },
      {
        action: "Establish baseline measures and measurable goals",
        domain: "Leadership, systems, documentation and review"
      }
    ],


    behaviour: [
      {
        action: "Establish individual behaviour goals and progress monitoring",
        domain: "Individual behaviour assessment, planning and accountability"
      },
      {
        action: "Develop a targeted Behaviour Support Plan",
        domain: "Individual behaviour assessment, planning and accountability"
      },
      {
        action: "Assess triggers and factors maintaining the behaviour",
        domain: "Individual behaviour assessment, planning and accountability"
      },
      {
        action: "Collect and analyse ABC data",
        domain: "Individual behaviour assessment, planning and accountability"
      },
      {
        action: "Implement Check In/Check Out linked to expectations",
        domain: "Individual behaviour assessment, planning and accountability"
      }
    ],


    teaching: [
      {
        action: "Provide individual or small-group teaching of identified skill gaps",
        domain: "Explicit teaching and social-emotional skill development"
      },
      {
        action: "Use behaviour rehearsal, modelling and role-play",
        domain: "Explicit teaching and social-emotional skill development"
      },
      {
        action: "Teach emotional regulation and impulse-control strategies",
        domain: "Explicit teaching and social-emotional skill development"
      },
      {
        action: "Use pre-correction before predictable high-risk situations",
        domain: "Explicit teaching and social-emotional skill development"
      }
    ],


    environment: [
      {
        action: "Target monitoring across relevant classes, breaks, transport and transitions",
        domain: "Safety, reporting and immediate response"
      },
      {
        action: "Increase supervision during identified high-risk times",
        domain: "Environment, supervision and opportunity reduction"
      },
      {
        action: "Develop an individual seating and grouping plan",
        domain: "Environment, supervision and opportunity reduction"
      },
      {
        action: "Provide supported transitions between classes or locations",
        domain: "Environment, supervision and opportunity reduction"
      }
    ],


    online: [
      {
        action: "Temporarily adjust access to devices, platforms or group chats where appropriate",
        domain: "Environment, supervision and opportunity reduction"
      },
      {
        action: "Provide digital behaviour coaching and supervised technology use",
        domain: "Explicit teaching and social-emotional skill development"
      }
    ],


    peers: [
      {
        action: "Provide targeted intervention for peers reinforcing the behaviour",
        domain: "Peer-group, bystander and community response"
      },
      {
        action: "Undertake peer-group work where broader dynamics maintain the behaviour",
        domain: "Peer-group, bystander and community response"
      },
      {
        action: "Use strategic regrouping where appropriate",
        domain: "Peer-group, bystander and community response"
      },
      {
        action: "Follow up rumours, retaliation and social exclusion",
        domain: "Peer-group, bystander and community response"
      }
    ],


    belonging: [
      {
        action: "Implement daily or scheduled Check In/Check Out",
        domain: "Positive school culture, belonging and protective experiences"
      },
      {
        action: "Allocate a trusted adult, mentor or year-level contact",
        domain: "Positive school culture, belonging and protective experiences"
      },
      {
        action: "Establish individual belonging and engagement goals",
        domain: "Positive school culture, belonging and protective experiences"
      },
      {
        action: "Plan opportunities for safe peer success",
        domain: "Positive school culture, belonging and protective experiences"
      }
    ],


    adjustments: [
      {
        action: "Review personalised learning and adjustment plans",
        domain: "Disability adjustments"
      },
      {
        action: "Reduce cognitive or sensory overload during high-risk periods",
        domain: "Disability adjustments"
      },
      {
        action: "Schedule movement, sensory or regulation breaks",
        domain: "Disability adjustments"
      },
      {
        action: "Consult HOSES, inclusion staff or specialist teachers",
        domain: "Disability adjustments"
      }
    ],


    wellbeing: [
      {
        action: "Seek Guidance Officer consultation or referral",
        domain: "Wellbeing, mental health and student support services"
      },
      {
        action: "Develop an individual emotional regulation or coping plan",
        domain: "Wellbeing, mental health and student support services"
      },
      {
        action: "Schedule frequent positive wellbeing checks",
        domain: "Wellbeing, mental health and student support services"
      }
    ],


    family: [
      {
        action: "Schedule family contact and progress updates",
        domain: "Family partnership and capability building"
      },
      {
        action: "Establish shared goals and consistent language across home and school",
        domain: "Family partnership and capability building"
      },
      {
        action: "Nominate a dedicated school contact or case coordinator",
        domain: "Family partnership and capability building"
      }
    ],


    coordination: [
      {
        action: "Nominate a case coordinator",
        domain: "Leadership, systems, documentation and review"
      },
      {
        action: "Convene a Team Around the Student / case meeting",
        domain: "Leadership, systems, documentation and review"
      },
      {
        action: "Develop a documented intervention plan across relevant domains",
        domain: "Leadership, systems, documentation and review"
      },
      {
        action: "Coordinate communication across relevant staff",
        domain: "Leadership, systems, documentation and review"
      }
    ],


    responseHistory: [
      {
        action: "Check whether agreed supports were implemented as intended",
        domain: "Leadership, systems, documentation and review"
      },
      {
        action: "Review whether frequency, severity and impact have reduced",
        domain: "Leadership, systems, documentation and review"
      },
      {
        action: "Set escalation criteria if targeted support is ineffective",
        domain: "Leadership, systems, documentation and review"
      }
    ]

  },


  tier3: {

    core: [
      {
        action: "Establish formal multidisciplinary case management",
        domain: "Leadership, systems, documentation and review"
      },
      {
        action: "Conduct a complex case review with assigned actions",
        domain: "Leadership, systems, documentation and review"
      },
      {
        action: "Implement intensive implementation and outcome monitoring",
        domain: "Leadership, systems, documentation and review"
      }
    ],


    safety: [
      {
        action: "Develop a comprehensive risk and safety plan",
        domain: "Safety, reporting and immediate response"
      },
      {
        action: "Establish immediate senior leadership oversight and case management",
        domain: "Safety, reporting and immediate response"
      },
      {
        action: "Implement supervised arrival, departure, movement and transitions",
        domain: "Safety, reporting and immediate response"
      },
      {
        action: "Establish formal multi-agency safety planning where required",
        domain: "Safety, reporting and immediate response"
      }
    ],


    behaviour: [
      {
        action: "Complete a comprehensive Functional Behaviour Assessment",
        domain: "Individual behaviour assessment, planning and accountability"
      },
      {
        action: "Develop an Individual Behaviour Support Plan through a multidisciplinary team",
        domain: "Individual behaviour assessment, planning and accountability"
      },
      {
        action: "Seek specialist behaviour, inclusion or disability consultation",
        domain: "Individual behaviour assessment, planning and accountability"
      },
      {
        action: "Implement intensive data collection and fidelity monitoring",
        domain: "Individual behaviour assessment, planning and accountability"
      }
    ],


    teaching: [
      {
        action: "Implement an intensive individual skills program informed by assessment",
        domain: "Explicit teaching and social-emotional skill development"
      },
      {
        action: "Teach functional communication and replacement skills",
        domain: "Explicit teaching and social-emotional skill development"
      },
      {
        action: "Provide repeated practice across settings with adult coaching",
        domain: "Explicit teaching and social-emotional skill development"
      }
    ],


    environment: [
      {
        action: "Modify class, subject, timetable, transport or playground arrangements where required",
        domain: "Environment, supervision and opportunity reduction"
      },
      {
        action: "Implement individual escort or direct handover arrangements",
        domain: "Environment, supervision and opportunity reduction"
      },
      {
        action: "Implement an intensive adult supervision plan",
        domain: "Environment, supervision and opportunity reduction"
      },
      {
        action: "Complete a formal review before reducing protective arrangements",
        domain: "Environment, supervision and opportunity reduction"
      }
    ],


    peers: [
      {
        action: "Implement intensive intervention for entrenched peer-group dynamics",
        domain: "Peer-group, bystander and community response"
      },
      {
        action: "Establish multi-student case coordination",
        domain: "Peer-group, bystander and community response"
      },
      {
        action: "Use structured separation and gradual reintegration where required",
        domain: "Peer-group, bystander and community response"
      },
      {
        action: "Monitor retaliation and coercion over time",
        domain: "Peer-group, bystander and community response"
      }
    ],


    belonging: [
      {
        action: "Provide intensive relational mentoring or case management",
        domain: "Positive school culture, belonging and protective experiences"
      },
      {
        action: "Develop wraparound planning with family and agencies",
        domain: "Positive school culture, belonging and protective experiences"
      },
      {
        action: "Develop a re-engagement plan following disengagement or suspension",
        domain: "Positive school culture, belonging and protective experiences"
      }
    ],


    adjustments: [
      {
        action: "Complete a comprehensive review of disability adjustments and access",
        domain: "Disability adjustments"
      },
      {
        action: "Seek specialist assessment of communication, sensory, executive-function or learning needs",
        domain: "Disability adjustments"
      },
      {
        action: "Develop an individualised timetable, curriculum or environment",
        domain: "Disability adjustments"
      },
      {
        action: "Seek regional inclusion or complex-case support",
        domain: "Disability adjustments"
      }
    ],


    wellbeing: [
      {
        action: "Seek immediate wellbeing or mental health assessment where risk is elevated",
        domain: "Wellbeing, mental health and student support services"
      },
      {
        action: "Develop safety planning for co-occurring risks",
        domain: "Wellbeing, mental health and student support services"
      },
      {
        action: "Establish coordinated school-health case planning",
        domain: "Wellbeing, mental health and student support services"
      }
    ],


    family: [
      {
        action: "Undertake intensive family planning and case conferencing",
        domain: "Family partnership and capability building"
      },
      {
        action: "Nominate a dedicated school contact or case manager",
        domain: "Family partnership and capability building"
      },
      {
        action: "Develop a coordinated family-school-agency plan",
        domain: "Family partnership and capability building"
      }
    ],


    coordination: [
      {
        action: "Seek regional or central-office consultation",
        domain: "Leadership, systems, documentation and review"
      },
      {
        action: "Establish executive oversight of risk and procedural compliance",
        domain: "Leadership, systems, documentation and review"
      },
      {
        action: "Consider brokerage application where appropriate",
        domain: "Leadership, systems, documentation and review"
      }
    ]

  },


  review: [
    {
      action: "Set a scheduled review date",
      domain: "Leadership, systems, documentation and review"
    },
    {
      action: "Confirm whether agreed actions were implemented",
      domain: "Leadership, systems, documentation and review"
    },
    {
      action: "Review whether frequency, severity and impact have reduced",
      domain: "Leadership, systems, documentation and review"
    },
    {
      action: "Confirm whether safety, engagement and belonging have improved",
      domain: "Leadership, systems, documentation and review"
    }
  ]

};


// =====================================================
// GENERATE ACTION PLAN
// =====================================================

function generateActionPlan() {
  const answers = getAnswers();

  const unanswered =
    Object.values(answers).some(function (value) {
      return value === "";
    });

  if (unanswered) {
    alert(
      "Please complete all questions before generating the action plan."
    );
    return;
  }

  const profile = buildDecisionProfile(answers);
  const tiers = determineTiers(profile);

  buildActionPlan(answers, profile, tiers);

  questionnaire.classList.add("hidden");
  actionPlan.classList.remove("hidden");

  setDefaultPlanDate();
  updateSelectedCount();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// =====================================================
// ACTION ROW CREATION
// =====================================================

function addAction(container, action, domain) {
  if (!container) {
    return;
  }

  // Avoid duplicates within a section.
  const existingActions =
    Array.from(
      container.querySelectorAll(".action-content strong")
    ).map(function (element) {
      return element.textContent.trim();
    });

  if (existingActions.includes(action)) {
    return;
  }

  const row = document.createElement("tr");

  const selectCell = document.createElement("td");
  selectCell.className = "check-cell";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "action-checkbox";
  checkbox.setAttribute(
    "aria-label",
    `Select action: ${action}`
  );

  checkbox.addEventListener(
    "change",
    updateSelectedCount
  );

  selectCell.appendChild(checkbox);


  const actionCell = document.createElement("td");
  actionCell.className = "action-content";

  const strong = document.createElement("strong");
  strong.textContent = action;

  const domainText = document.createElement("span");
  domainText.textContent =
    `Continuum domain: ${domain}`;

  actionCell.appendChild(strong);
  actionCell.appendChild(domainText);


  const responsibleCell =
    document.createElement("td");

  const responsibleInput =
    document.createElement("input");

  responsibleInput.type = "text";
  responsibleInput.className = "plan-input";
  responsibleInput.placeholder = "Name / role";
  responsibleInput.setAttribute(
    "aria-label",
    `Responsible person for ${action}`
  );

  responsibleCell.appendChild(
    responsibleInput
  );


  const dateCell =
    document.createElement("td");

  const dateInput =
    document.createElement("input");

  dateInput.type = "date";
  dateInput.className =
    "plan-input date-input";

  dateInput.setAttribute(
    "aria-label",
    `Due date for ${action}`
  );

  dateCell.appendChild(dateInput);


  row.appendChild(selectCell);
  row.appendChild(actionCell);
  row.appendChild(responsibleCell);
  row.appendChild(dateCell);

  container.appendChild(row);
}


function addActionGroup(container, actions) {
  actions.forEach(function (item) {
    addAction(
      container,
      item.action,
      item.domain
    );
  });
}


// =====================================================
// CLEAR GENERATED PLAN
// =====================================================

function clearActionPlan() {
  [
    "safetyActions",
    "tier1Actions",
    "tier2Actions",
    "tier3Actions",
    "reviewActions"
  ].forEach(function (id) {
    const container =
      document.getElementById(id);

    if (container) {
      container.innerHTML = "";
    }
  });


  const safetySection =
    document.getElementById("safetySection");

  const tier2Section =
    document.getElementById("tier2Section");

  const tier3Section =
    document.getElementById("tier3Section");


  if (safetySection) {
    safetySection.classList.add("hidden");
  }

  if (tier2Section) {
    tier2Section.classList.add("hidden");
  }

  if (tier3Section) {
    tier3Section.classList.add("hidden");
  }
}


// =====================================================
// BUILD GENERATED PLAN
// =====================================================

function buildActionPlan(answers, profile, tiers) {
  clearActionPlan();

  const safetyActions =
    document.getElementById("safetyActions");

  const tier1Actions =
    document.getElementById("tier1Actions");

  const tier2Actions =
    document.getElementById("tier2Actions");

  const tier3Actions =
    document.getElementById("tier3Actions");

  const reviewActions =
    document.getElementById("reviewActions");


  // ===================================================
  // IMMEDIATE SAFETY
  // ===================================================

  if (profile.SAFETY > 0) {
    const safetySection =
      document.getElementById("safetySection");

    safetySection.classList.remove("hidden");

    addAction(
      safetyActions,
      "Immediate assessment of safety and ongoing risk",
      "Safety, reporting and immediate response"
    );

    addAction(
      safetyActions,
      "Protection from retaliation",
      "Safety, reporting and immediate response"
    );


    if (profile.SAFETY === 2) {
      addAction(
        safetyActions,
        "Develop a comprehensive risk and safety plan",
        "Safety, reporting and immediate response"
      );

      addAction(
        safetyActions,
        "Establish immediate senior leadership oversight and case management",
        "Safety, reporting and immediate response"
      );
    }
  }


  // ===================================================
  // TIER 1
  // ===================================================

  addActionGroup(
    tier1Actions,
    actionBank.tier1.core
  );


  if (profile.SAFETY > 0) {
    addActionGroup(
      tier1Actions,
      actionBank.tier1.safety
    );
  }


  if (
    profile.ENVIRONMENT > 0 ||
    answers.context === "multiple" ||
    answers.context === "mixed"
  ) {
    addActionGroup(
      tier1Actions,
      actionBank.tier1.environment
    );
  }


  if (
    answers.context === "online" ||
    answers.context === "mixed"
  ) {
    addActionGroup(
      tier1Actions,
      actionBank.tier1.online
    );
  }


  if (profile.BEHAVIOUR_NEED > 0) {
    addActionGroup(
      tier1Actions,
      actionBank.tier1.behaviour
    );
  }


  if (profile.PEER > 0) {
    addActionGroup(
      tier1Actions,
      actionBank.tier1.peers
    );
  }


  if (profile.WELLBEING_CONNECTION > 0) {
    addActionGroup(
      tier1Actions,
      actionBank.tier1.belonging
    );

    addActionGroup(
      tier1Actions,
      actionBank.tier1.wellbeing
    );
  }


  if (profile.ADJUSTMENTS > 0) {
    addActionGroup(
      tier1Actions,
      actionBank.tier1.adjustments
    );
  }


  if (profile.FAMILY > 0) {
    addActionGroup(
      tier1Actions,
      actionBank.tier1.family
    );
  }


  // ===================================================
  // TIER 2
  // ===================================================

  if (tiers.tier2) {
    document
      .getElementById("tier2Section")
      .classList.remove("hidden");


    if (
      profile.SAFETY > 0 ||
      profile.IMPACT > 0
    ) {
      addActionGroup(
        tier2Actions,
        actionBank.tier2.safety
      );
    }


    if (profile.PERSISTENCE > 0) {
      addActionGroup(
        tier2Actions,
        actionBank.tier2.persistence
      );
    }


    if (profile.BEHAVIOUR_NEED > 0) {
      addActionGroup(
        tier2Actions,
        actionBank.tier2.behaviour
      );

      addActionGroup(
        tier2Actions,
        actionBank.tier2.teaching
      );
    }


    if (
      profile.ENVIRONMENT > 0 ||
      answers.context === "multiple" ||
      answers.context === "mixed"
    ) {
      addActionGroup(
        tier2Actions,
        actionBank.tier2.environment
      );
    }


    if (
      answers.context === "online" ||
      answers.context === "mixed"
    ) {
      addActionGroup(
        tier2Actions,
        actionBank.tier2.online
      );
    }


    if (profile.PEER > 0) {
      addActionGroup(
        tier2Actions,
        actionBank.tier2.peers
      );
    }


    if (profile.WELLBEING_CONNECTION > 0) {
      addActionGroup(
        tier2Actions,
        actionBank.tier2.belonging
      );

      addActionGroup(
        tier2Actions,
        actionBank.tier2.wellbeing
      );
    }


    if (profile.ADJUSTMENTS > 0) {
      addActionGroup(
        tier2Actions,
        actionBank.tier2.adjustments
      );
    }


    if (profile.FAMILY > 0) {
      addActionGroup(
        tier2Actions,
        actionBank.tier2.family
      );
    }


    if (profile.COORDINATION > 0) {
      addActionGroup(
        tier2Actions,
        actionBank.tier2.coordination
      );
    }


    if (profile.RESPONSE_HISTORY > 0) {
      addActionGroup(
        tier2Actions,
        actionBank.tier2.responseHistory
      );
    }
  }


  // ===================================================
  // TIER 3
  // ===================================================

  if (tiers.tier3) {
    document
      .getElementById("tier3Section")
      .classList.remove("hidden");


    addActionGroup(
      tier3Actions,
      actionBank.tier3.core
    );


    if (
      profile.SAFETY === 2 ||
      profile.IMPACT === 2
    ) {
      addActionGroup(
        tier3Actions,
        actionBank.tier3.safety
      );
    }


    if (profile.BEHAVIOUR_NEED === 2) {
      addActionGroup(
        tier3Actions,
        actionBank.tier3.behaviour
      );

      addActionGroup(
        tier3Actions,
        actionBank.tier3.teaching
      );
    }


    if (profile.ENVIRONMENT === 2) {
      addActionGroup(
        tier3Actions,
        actionBank.tier3.environment
      );
    }


    if (profile.PEER === 2) {
      addActionGroup(
        tier3Actions,
        actionBank.tier3.peers
      );
    }


    if (profile.WELLBEING_CONNECTION === 2) {
      addActionGroup(
        tier3Actions,
        actionBank.tier3.belonging
      );

      addActionGroup(
        tier3Actions,
        actionBank.tier3.wellbeing
      );
    }


    if (profile.ADJUSTMENTS === 2) {
      addActionGroup(
        tier3Actions,
        actionBank.tier3.adjustments
      );
    }


    if (profile.FAMILY === 2) {
      addActionGroup(
        tier3Actions,
        actionBank.tier3.family
      );
    }


    if (
      profile.COORDINATION === 2 ||
      profile.RESPONSE_HISTORY === 2
    ) {
      addActionGroup(
        tier3Actions,
        actionBank.tier3.coordination
      );
    }
  }


  // ===================================================
  // REVIEW
  // ===================================================

  addActionGroup(
    reviewActions,
    actionBank.review
  );


  if (
    answers.monitoring === "partial" ||
    answers.monitoring === "no"
  ) {
    addAction(
      reviewActions,
      "Strengthen monitoring arrangements and identify who will collect progress information",
      "Leadership, systems, documentation and review"
    );
  }


  if (
    answers.previousResponse === "partial" ||
    answers.previousResponse === "notWorking"
  ) {
    addAction(
      reviewActions,
      "Set escalation criteria if current supports are ineffective",
      "Leadership, systems, documentation and review"
    );
  }
}


// =====================================================
// LIVE SELECTED ACTION COUNT
// =====================================================

function updateSelectedCount() {
  if (!selectedCount) {
    return;
  }

  const count =
    document.querySelectorAll(
      ".action-checkbox:checked"
    ).length;

  selectedCount.textContent =
    count === 1
      ? "1 action selected"
      : `${count} actions selected`;
}


// =====================================================
// BACK TO RESPONSES
// =====================================================

if (editResponsesButton) {
  editResponsesButton.addEventListener(
    "click",
    function () {
      actionPlan.classList.add("hidden");
      questionnaire.classList.remove("hidden");

      // Return to the final section so the leader
      // can work backwards through their responses.
      currentSection = totalSections;
      showSection(currentSection);
    }
  );
}


// =====================================================
// PRINT PREPARATION
// =====================================================

function prepareSelectedActionsForPrint() {
  const rows =
    document.querySelectorAll(
      ".action-table tbody tr"
    );

  rows.forEach(function (row) {
    const checkbox =
      row.querySelector(".action-checkbox");

    if (checkbox && !checkbox.checked) {
      row.classList.add("hide-for-print");
    }
  });


  const planSections =
    document.querySelectorAll(".plan-section");

  planSections.forEach(function (section) {
    const selectedRows =
      Array.from(
        section.querySelectorAll(
          ".action-table tbody tr"
        )
      ).filter(function (row) {
        const checkbox =
          row.querySelector(".action-checkbox");

        return checkbox && checkbox.checked;
      });

    if (selectedRows.length === 0) {
      section.classList.add(
        "hide-section-for-print"
      );
    }
  });
}


function restoreActionsAfterPrint() {
  document
    .querySelectorAll(".hide-for-print")
    .forEach(function (row) {
      row.classList.remove("hide-for-print");
    });

  document
    .querySelectorAll(
      ".hide-section-for-print"
    )
    .forEach(function (section) {
      section.classList.remove(
        "hide-section-for-print"
      );
    });
}


function getSelectedActionCount() {
  return document.querySelectorAll(
    ".action-checkbox:checked"
  ).length;
}


// =====================================================
// PRINT
// =====================================================

if (printButton) {
  printButton.addEventListener(
    "click",
    function () {
      const count =
        getSelectedActionCount();

      if (count === 0) {
        alert(
          "Please select at least one action before printing or saving the action plan."
        );
        return;
      }

      prepareSelectedActionsForPrint();

      window.print();

      // Backup restoration for browsers where
      // afterprint is unreliable.
      setTimeout(
        restoreActionsAfterPrint,
        1000
      );
    }
  );
}


window.addEventListener(
  "afterprint",
  restoreActionsAfterPrint
);


// =====================================================
// RESTART
// =====================================================

if (restartButton) {
  restartButton.addEventListener(
    "click",
    function () {
      const confirmed =
        window.confirm(
          "Start a new plan? Your current responses and selected actions will be cleared."
        );

      if (confirmed) {
        window.location.reload();
      }
    }
  );
}


// =====================================================
// INITIAL DISPLAY
// =====================================================

showSection(1);