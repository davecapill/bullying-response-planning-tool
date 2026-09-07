// =====================================================
// BULLYING RESPONSE PLANNING TOOL
// Version 1.2 — Case file + visual/UX prototype
// Complete script.js
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
const addCustomActionButton =
  document.getElementById("addCustomActionButton");
const customActions =
  document.getElementById("customActions");
const monitoringActionsWrap =
  document.getElementById("monitoringActionsWrap");

const openCaseButton =
  document.getElementById("openCaseButton");
const caseFileInput =
  document.getElementById("caseFileInput");
const saveCaseQuestionnaireButton =
  document.getElementById("saveCaseQuestionnaireButton");
const saveCasePlanButton =
  document.getElementById("saveCasePlanButton");

const CASE_FILE_FORMAT = "bullying-response-planning-case";
const CASE_FILE_VERSION = "1.2";

let currentSection = 1;
const totalSections = sections.length;

const appToast = document.getElementById("appToast");
let toastTimer = null;

function showToast(message, type = "success") {
  if (!appToast) return;
  appToast.textContent = message;
  appToast.classList.toggle("is-error", type === "error");
  appToast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function () {
    appToast.classList.remove("is-visible");
  }, 2600);
}

function updateStageNav(sectionNumber) {
  document.querySelectorAll(".stage-item").forEach(function (item) {
    const stage = Number(item.dataset.stage);
    item.classList.toggle("is-current", stage === sectionNumber);
    item.classList.toggle("is-complete", stage < sectionNumber);
    if (stage === sectionNumber) item.setAttribute("aria-current", "step");
    else item.removeAttribute("aria-current");
  });
}


// =====================================================
// INITIAL SETUP
// =====================================================

function setDefaultPlanDate() {
  if (!planDate || planDate.value) {
    return;
  }

  const today = new Date();

  const localDate = new Date(
    today.getTime() -
    today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .split("T")[0];

  planDate.value = localDate;
}


function getCheckedValues(name) {
  return Array.from(
    document.querySelectorAll(
      `input[name="${name}"]:checked`
    )
  ).map(function (input) {
    return input.value;
  });
}


// =====================================================
// EXCLUSIVE CHECKBOX OPTIONS
//
// "No significant..." options cannot be selected
// at the same time as other options in that group.
// =====================================================

function setupExclusiveCheckboxGroups() {

  document
    .querySelectorAll(
      'input[type="checkbox"][data-exclusive]'
    )
    .forEach(function (exclusive) {

      exclusive.addEventListener(
        "change",
        function () {

          const group =
            this.dataset.exclusive;

          const groupInputs =
            document.querySelectorAll(
              `input[name="${group}"]`
            );

          if (this.checked) {

            groupInputs.forEach(
              function (input) {

                if (input !== exclusive) {
                  input.checked = false;
                }

              }
            );

          }

        }
      );

    });


  [
    "impacts",
    "skills",
    "peerDynamics"
  ].forEach(function (group) {

    document
      .querySelectorAll(
        `input[name="${group}"]:not([data-exclusive])`
      )
      .forEach(function (input) {

        input.addEventListener(
          "change",
          function () {

            if (!this.checked) {
              return;
            }

            const exclusive =
              document.querySelector(
                `input[name="${group}"][data-exclusive]`
              );

            if (exclusive) {
              exclusive.checked = false;
            }

          }
        );

      });

  });

}


setDefaultPlanDate();
setupExclusiveCheckboxGroups();


// =====================================================
// START
// =====================================================

if (startButton) {

  startButton.addEventListener(
    "click",
    function () {

      if (landingPage) {
        landingPage.classList.add("hidden");
      }

      if (questionnaire) {
        questionnaire.classList.remove("hidden");
      }

      currentSection = 1;

      showSection(currentSection);

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });

    }
  );

}


// =====================================================
// QUESTIONNAIRE NAVIGATION
// =====================================================

if (nextButton) {

  nextButton.addEventListener(
    "click",
    function () {

      if (!validateCurrentSection()) {
        return;
      }

      if (currentSection < totalSections) {

        currentSection++;

        showSection(currentSection);

      } else {

        generateActionPlan();

      }

    }
  );

}


if (backButton) {

  backButton.addEventListener(
    "click",
    function () {

      if (currentSection > 1) {

        currentSection--;

        showSection(currentSection);

      }

    }
  );

}


function showSection(sectionNumber) {

  sections.forEach(
    function (section) {
      section.classList.remove(
        "active-section"
      );
    }
  );


  const selectedSection =
    document.querySelector(
      `.form-section[data-section="${sectionNumber}"]`
    );


  if (selectedSection) {
    selectedSection.classList.add(
      "active-section"
    );
  }


  updateStageNav(sectionNumber);


  if (
    progressBar &&
    totalSections > 0
  ) {

    progressBar.style.width =
      `${(sectionNumber / totalSections) * 100}%`;

  }


  if (backButton) {

    backButton.style.visibility =
      sectionNumber === 1
        ? "hidden"
        : "visible";

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


  const selects =
    current.querySelectorAll("select");


  for (const select of selects) {

    if (!select.value) {

      alert(
        "Please complete all questions in this section before continuing."
      );

      select.focus();

      return false;

    }

  }


  const requiredCheckboxGroups = {

    1: ["contexts"],

    2: ["impacts"],

    3: ["skills"],

    5: ["peerDynamics"]

  };


  const groups =
    requiredCheckboxGroups[currentSection] ||
    [];


  for (const group of groups) {

    if (
      getCheckedValues(group).length === 0
    ) {

      alert(
        "Please select at least one response for each multi-select question before continuing."
      );

      const first =
        current.querySelector(
          `input[name="${group}"]`
        );

      if (first) {
        first.focus();
      }

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

    pattern:
      document.getElementById(
        "pattern"
      ).value,

    power:
      document.getElementById(
        "power"
      ).value,

    contexts:
      getCheckedValues(
        "contexts"
      ),

    safety:
      document.getElementById(
        "safety"
      ).value,

    impacts:
      getCheckedValues(
        "impacts"
      ),

    behaviourUnderstanding:
      document.getElementById(
        "behaviourUnderstanding"
      ).value,

    skills:
      getCheckedValues(
        "skills"
      ),

    environment:
      document.getElementById(
        "environment"
      ).value,

    adjustments:
      document.getElementById(
        "adjustments"
      ).value,

    peerDynamics:
      getCheckedValues(
        "peerDynamics"
      ),

    trustedAdult:
      document.getElementById(
        "trustedAdult"
      ).value,

    family:
      document.getElementById(
        "family"
      ).value,

    coordination:
      document.getElementById(
        "coordination"
      ).value,

    previousResponse:
      document.getElementById(
        "previousResponse"
      ).value,

    monitoring:
      document.getElementById(
        "monitoring"
      ).value

  };

}


// =====================================================
// CANONICAL ACTION BANK
//
// One ID = one action.
// This allows overlapping triggers to be merged,
// strengthened or removed before display.
// =====================================================

const ACTIONS = {


  // ---------------------------------------------------
  // PATTERN / UNDERSTANDING
  // ---------------------------------------------------

  clarifySituation: {

    id: "clarifySituation",

    tier: 1,

    text:
      "Gather further information from relevant students, staff and available records to clarify the nature, pattern and context of the behaviour."

  },


  shortMonitoring: {

    id: "shortMonitoring",

    tier: 1,

    text:
      "Establish short-term monitoring to determine whether a repeated pattern of bullying behaviour is developing."

  },


  patternAnalysis: {

    id: "patternAnalysis",

    tier: 2,

    text:
      "Analyse and monitor patterns in the behaviour, including frequency, timing, location, students involved and contributing factors."

  },


  coordinatedMonitoring: {

    id: "coordinatedMonitoring",

    tier: 2,

    text:
      "Establish coordinated monitoring across relevant settings to track whether the frequency, severity and impact of the behaviour reduces over time."

  },


  // ---------------------------------------------------
  // DIGITAL CONTEXT
  // ---------------------------------------------------

  digitalResponse: {

    id: "digitalResponse",

    tier: 1,

    text:
      "Address the identified online behaviour through clear expectations, appropriate digital-safety education and communication with relevant students and families."

  },


  // ---------------------------------------------------
  // SAFETY
  // ---------------------------------------------------

  practicalSafety: {

    id: "practicalSafety",

    tier: 2,

    text:
      "Identify and implement practical arrangements to reduce the student's exposure to further bullying behaviour, retaliation or continued harm."

  },


  trustedAdult: {

    id: "trustedAdult",

    tier: 2,

    text:
      "Identify a trusted staff member the student can readily approach for support and establish regular check-ins while concerns remain."

  },


  safetyPlan: {

    id: "safetyPlan",

    tier: 3,

    text:
      "Develop and document an individual safety plan identifying current risks, protective actions, safe locations, trusted adults and arrangements for seeking immediate support."

  },


  intensiveProtection: {

    id: "intensiveProtection",

    tier: 3,

    text:
      "Implement increased supervision or other protective arrangements during identified high-risk times and locations, with senior leadership oversight until immediate risk has reduced."

  },


  // ---------------------------------------------------
  // IMPACT
  // ---------------------------------------------------

  emotionalSupport: {

    id: "emotionalSupport",

    tier: 2,

    text:
      "Schedule regular wellbeing check-ins and monitor changes in the student's emotional wellbeing and sense of safety."

  },


  engagementSupport: {

    id: "engagementSupport",

    tier: 2,

    text:
      "Develop strategies to support the student's safe participation and re-engagement in affected learning or school activities."

  },


  avoidanceSupport: {

    id: "avoidanceSupport",

    tier: 2,

    text:
      "Identify the students, locations or situations being avoided and implement arrangements that support safe access and participation."

  },


  attendanceSupport: {

    id: "attendanceSupport",

    tier: 2,

    text:
      "Develop an attendance and re-engagement response that addresses safety concerns contributing to school avoidance or reduced attendance."

  },


  peerConnection: {

    id: "peerConnection",

    tier: 2,

    text:
      "Create safe opportunities to strengthen positive peer connection, belonging and participation for the student experiencing bullying."

  },


  wellbeingReferral: {

    id: "wellbeingReferral",

    tier: 3,

    text:
      "Coordinate appropriate school-based wellbeing or specialist support where significant or escalating wellbeing concerns are identified."

  },


  // ---------------------------------------------------
  // BEHAVIOUR ASSESSMENT
  // ---------------------------------------------------

  behaviourInfo: {

    id: "behaviourInfo",

    tier: 2,

    text:
      "Gather and analyse information about when, where and with whom the behaviour occurs, including likely triggers and factors reinforcing or maintaining it."

  },


  structuredBehaviourAssessment: {

    id: "structuredBehaviourAssessment",

    tier: 2,

    text:
      "Undertake a structured assessment of the behaviour using incident information, observations and relevant student and staff input to identify triggers, patterns and maintaining factors."

  },


  intensiveBehaviourAssessment: {

    id: "intensiveBehaviourAssessment",

    tier: 3,

    text:
      "Undertake a comprehensive assessment of the behaviour and consider specialist behaviour consultation or Functional Behaviour Assessment to inform an individualised response."

  },


  // ---------------------------------------------------
  // SKILL DEVELOPMENT
  // ---------------------------------------------------

  respectfulSkills: {

    id: "respectfulSkills",

    tier: 1,

    text:
      "Explicitly teach, model and practise respectful communication and interaction in the situations where difficulties are occurring."

  },


  conflictSkills: {

    id: "conflictSkills",

    tier: 1,

    text:
      "Teach and rehearse appropriate strategies for managing disagreement and conflict without intimidation, aggression or exclusion."

  },


  regulationSkills: {

    id: "regulationSkills",

    tier: 2,

    text:
      "Teach and practise emotional regulation and impulse-control strategies and plan how these will be used in identified high-risk situations."

  },


  perspectiveSkills: {

    id: "perspectiveSkills",

    tier: 1,

    text:
      "Use structured teaching and reflection to strengthen understanding of the impact of behaviour on others and identify appropriate alternative responses."

  },


  connectionSkills: {

    id: "connectionSkills",

    tier: 2,

    text:
      "Teach and reinforce appropriate ways of gaining peer attention, status or connection without harming, intimidating or excluding others."

  },


  problemSolvingSkills: {

    id: "problemSolvingSkills",

    tier: 1,

    text:
      "Explicitly teach and rehearse problem-solving strategies for challenging social situations."

  },


  digitalSkills: {

    id: "digitalSkills",

    tier: 2,

    text:
      "Provide targeted teaching and coaching in appropriate digital communication and online conduct."

  },


  otherSkill: {

    id: "otherSkill",

    tier: 1,

    text:
      "Identify the replacement behaviour required and explicitly teach, practise and reinforce it in the situations where it is needed."

  },


  // ---------------------------------------------------
  // ENVIRONMENT
  // ---------------------------------------------------

  classroomEnvironment: {

    id: "classroomEnvironment",

    tier: 2,

    text:
      "Review classroom routines, seating, grouping and supervision arrangements and make targeted changes to reduce opportunities for further bullying behaviour."

  },


  playgroundEnvironment: {

    id: "playgroundEnvironment",

    tier: 2,

    text:
      "Strengthen active supervision and monitoring during identified high-risk break times and playground locations."

  },


  transitionEnvironment: {

    id: "transitionEnvironment",

    tier: 2,

    text:
      "Review transition, arrival/departure or transport arrangements and implement targeted supervision or other protective arrangements where required."

  },


  coordinatedEnvironment: {

    id: "coordinatedEnvironment",

    tier: 3,

    text:
      "Develop a coordinated supervision and environmental plan across identified high-risk settings and times, including targeted changes to routines, grouping, transitions and supervision arrangements."

  },


  // ---------------------------------------------------
  // ADJUSTMENTS
  // ---------------------------------------------------

  adjustmentsInform: {

    id: "adjustmentsInform",

    tier: 1,

    text:
      "Ensure the planned response is consistent with the student's identified needs and existing reasonable adjustments."

  },


  adjustmentsReview: {

    id: "adjustmentsReview",

    tier: 2,

    text:
      "Review reasonable adjustments and individual support planning to ensure identified communication, regulation, sensory, learning or participation needs are adequately supported."

  },


  adjustmentsConsult: {

    id: "adjustmentsConsult",

    tier: 2,

    text:
      "Consult relevant staff and existing student information to determine whether individual needs or reasonable adjustments should inform the response."

  },


  // ---------------------------------------------------
  // PEER / GROUP DYNAMICS
  // ---------------------------------------------------

  peerReinforcement: {

    id: "peerReinforcement",

    tier: 2,

    text:
      "Identify and address peer responses that are reinforcing the bullying behaviour, including attention, encouragement or audience behaviour."

  },


  peerParticipation: {

    id: "peerParticipation",

    tier: 2,

    text:
      "Follow up individually with students participating in or joining the behaviour and establish clear expectations for future behaviour."

  },


  exclusionResponse: {

    id: "exclusionResponse",

    tier: 2,

    text:
      "Develop a targeted response to identified social exclusion, rumours or group pressure and monitor whether these behaviours continue."

  },


  safeReporting: {

    id: "safeReporting",

    tier: 1,

    text:
      "Reinforce safe and accessible ways for students to report bullying concerns and seek adult assistance."

  },


  entrenchedPeers: {

    id: "entrenchedPeers",

    tier: 3,

    text:
      "Develop a coordinated intervention for entrenched peer-group dynamics, with clear expectations, monitoring and follow-up across relevant settings."

  },


  // ---------------------------------------------------
  // FAMILY
  // ---------------------------------------------------

  familyRoutine: {

    id: "familyRoutine",

    tier: 1,

    text:
      "Inform relevant parent/carer/s of the concern, the school's response and how progress will be monitored, consistent with school processes."

  },


  familyPlanned: {

    id: "familyPlanned",

    tier: 2,

    text:
      "Establish an agreed schedule for family communication and provide updates on implementation, progress and emerging concerns."

  },


  familyCoordinated: {

    id: "familyCoordinated",

    tier: 2,

    text:
      "Develop shared goals and agreed actions with the family and identify a consistent school contact for ongoing communication and coordination."

  },


  // ---------------------------------------------------
  // COORDINATION
  // ---------------------------------------------------

  targetedCoordination: {

    id: "targetedCoordination",

    tier: 2,

    text:
      "Nominate a staff member to coordinate the response and ensure relevant staff understand their responsibilities and agreed actions across settings."

  },


  multidisciplinaryCoordination: {

    id: "multidisciplinaryCoordination",

    tier: 3,

    text:
      "Convene a multidisciplinary case-planning meeting to coordinate assessment, intervention, responsibilities and review arrangements."

  },


  // ---------------------------------------------------
  // PREVIOUS RESPONSE / REVIEW
  // ---------------------------------------------------

  reviewPartial: {

    id: "reviewPartial",

    tier: 2,

    text:
      "Review the current response to identify which strategies are having an impact and strengthen or adjust those that are not yet effective."

  },


  reviewIneffective: {

    id: "reviewIneffective",

    tier: 2,

    text:
      "Check whether agreed actions have been implemented consistently and use current monitoring information to identify why the response has not achieved the intended outcome."

  },


  escalatedReview: {

    id: "escalatedReview",

    tier: 3,

    text:
      "Convene a case review to reassess safety, impact and the effectiveness of current interventions and determine what additional or more intensive supports are required."

  },


  monitoringClarify: {

    id: "monitoringClarify",

    tier: 1,

    text:
      "Clarify what will be monitored, who will collect the information and when progress will be reviewed."

  },


  monitoringEstablish: {

    id: "monitoringEstablish",

    tier: 2,

    text:
      "Establish clear monitoring measures and responsibilities to determine whether the behaviour, safety concerns and identified impacts are reducing."

  }

};


// =====================================================
// ACTION COLLECTION / DEDUPLICATION
// =====================================================

function createActionState() {

  return new Map();

}


function addCandidate(
  state,
  actionKey
) {

  const action =
    ACTIONS[actionKey];


  if (!action) {
    return;
  }


  const existing =
    state.get(action.id);


  if (
    !existing ||
    action.tier > existing.tier
  ) {

    state.set(
      action.id,
      { ...action }
    );

  }

}


function removeCandidate(
  state,
  actionKey
) {

  const action =
    ACTIONS[actionKey];


  if (action) {
    state.delete(action.id);
  }

}


function supersede(
  state,
  strongerKey,
  weakerKeys
) {

  addCandidate(
    state,
    strongerKey
  );


  weakerKeys.forEach(
    function (key) {

      removeCandidate(
        state,
        key
      );

    }
  );

}


// =====================================================
// BUILD SUGGESTED ACTIONS
// =====================================================

function buildSuggestedActions(
  answers
) {

  const state =
    createActionState();


  // ===================================================
  // Q1 — PATTERN
  // ===================================================

  if (
    answers.pattern === "emerging"
  ) {

    addCandidate(
      state,
      "shortMonitoring"
    );

  }


  if (
    answers.pattern === "repeated"
  ) {

    addCandidate(
      state,
      "patternAnalysis"
    );

  }


  if (
    answers.pattern === "sustained"
  ) {

    addCandidate(
      state,
      "coordinatedMonitoring"
    );

  }


  // ===================================================
  // Q2 — POWER
  // ===================================================

  if (
    answers.power === "unclear"
  ) {

    addCandidate(
      state,
      "clarifySituation"
    );

  }


  // ===================================================
  // Q3 — CONTEXT
  // ===================================================

  if (
    answers.contexts.includes(
      "online"
    )
  ) {

    addCandidate(
      state,
      "digitalResponse"
    );

  }


  // ===================================================
  // Q4 — SAFETY
  // ===================================================

  if (
    answers.safety === "some"
  ) {

    addCandidate(
      state,
      "practicalSafety"
    );

    addCandidate(
      state,
      "trustedAdult"
    );

  }


  if (
    answers.safety === "significant"
  ) {

    addCandidate(
      state,
      "safetyPlan"
    );

    addCandidate(
      state,
      "intensiveProtection"
    );

    removeCandidate(
      state,
      "practicalSafety"
    );

  }


  // ===================================================
  // Q5 — IMPACT
  // ===================================================

  if (
    !answers.impacts.includes(
      "none"
    )
  ) {

    if (
      answers.impacts.includes(
        "emotional"
      )
    ) {

      addCandidate(
        state,
        "emotionalSupport"
      );

    }


    if (
      answers.impacts.includes(
        "engagement"
      )
    ) {

      addCandidate(
        state,
        "engagementSupport"
      );

    }


    if (
      answers.impacts.includes(
        "avoidance"
      )
    ) {

      addCandidate(
        state,
        "avoidanceSupport"
      );

    }


    if (
      answers.impacts.includes(
        "attendance"
      )
    ) {

      addCandidate(
        state,
        "attendanceSupport"
      );

    }


    if (
      answers.impacts.includes(
        "isolation"
      )
    ) {

      addCandidate(
        state,
        "peerConnection"
      );

    }


    if (
      answers.impacts.includes(
        "wellbeing"
      )
    ) {

      addCandidate(
        state,
        "wellbeingReferral"
      );

    }

  }


  // ===================================================
  // Q6 — UNDERSTANDING BEHAVIOUR
  // ===================================================

  if (
    answers.behaviourUnderstanding ===
    "partial"
  ) {

    addCandidate(
      state,
      "behaviourInfo"
    );

  }


  if (
    answers.behaviourUnderstanding ===
    "unclear"
  ) {

    addCandidate(
      state,
      "structuredBehaviourAssessment"
    );

  }


  // ===================================================
  // Q7 — SKILLS
  // ===================================================

  if (
    !answers.skills.includes(
      "none"
    )
  ) {

    if (
      answers.skills.includes(
        "respectful"
      )
    ) {

      addCandidate(
        state,
        "respectfulSkills"
      );

    }


    if (
      answers.skills.includes(
        "conflict"
      )
    ) {

      addCandidate(
        state,
        "conflictSkills"
      );

    }


    if (
      answers.skills.includes(
        "regulation"
      )
    ) {

      addCandidate(
        state,
        "regulationSkills"
      );

    }


    if (
      answers.skills.includes(
        "perspective"
      )
    ) {

      addCandidate(
        state,
        "perspectiveSkills"
      );

    }


    if (
      answers.skills.includes(
        "connection"
      )
    ) {

      addCandidate(
        state,
        "connectionSkills"
      );

    }


    if (
      answers.skills.includes(
        "problemSolving"
      )
    ) {

      addCandidate(
        state,
        "problemSolvingSkills"
      );

    }


    if (
      answers.skills.includes(
        "digital"
      )
    ) {

      addCandidate(
        state,
        "digitalSkills"
      );

    }


    if (
      answers.skills.includes(
        "other"
      )
    ) {

      addCandidate(
        state,
        "otherSkill"
      );

    }

  }


  // ===================================================
  // Q8 — ENVIRONMENT + Q3 CONTEXT
  // ===================================================

  if (
    answers.environment !== "none"
  ) {

    const physicalContexts =
      answers.contexts.filter(
        function (value) {

          return [
            "classroom",
            "playground",
            "transitions"
          ].includes(value);

        }
      );


    if (
      answers.environment ===
        "significant" &&
      physicalContexts.length >= 2
    ) {

      supersede(
        state,
        "coordinatedEnvironment",
        [
          "classroomEnvironment",
          "playgroundEnvironment",
          "transitionEnvironment"
        ]
      );

    } else {

      if (
        answers.contexts.includes(
          "classroom"
        )
      ) {

        addCandidate(
          state,
          "classroomEnvironment"
        );

      }


      if (
        answers.contexts.includes(
          "playground"
        )
      ) {

        addCandidate(
          state,
          "playgroundEnvironment"
        );

      }


      if (
        answers.contexts.includes(
          "transitions"
        )
      ) {

        addCandidate(
          state,
          "transitionEnvironment"
        );

      }

    }

  }


  // ===================================================
  // Q9 — ADJUSTMENTS
  // ===================================================

  if (
    answers.adjustments === "inform"
  ) {

    addCandidate(
      state,
      "adjustmentsInform"
    );

  }


  if (
    answers.adjustments === "review"
  ) {

    addCandidate(
      state,
      "adjustmentsReview"
    );

  }


  if (
    answers.adjustments === "unclear"
  ) {

    addCandidate(
      state,
      "adjustmentsConsult"
    );

  }


  // ===================================================
  // Q10 — PEER DYNAMICS
  // ===================================================

  if (
    !answers.peerDynamics.includes(
      "none"
    )
  ) {

    if (
      answers.peerDynamics.includes(
        "reinforcement"
      )
    ) {

      addCandidate(
        state,
        "peerReinforcement"
      );

    }


    if (
      answers.peerDynamics.includes(
        "participation"
      )
    ) {

      addCandidate(
        state,
        "peerParticipation"
      );

    }


    if (
      answers.peerDynamics.includes(
        "exclusion"
      )
    ) {

      addCandidate(
        state,
        "exclusionResponse"
      );

    }


    if (
      answers.peerDynamics.includes(
        "reporting"
      )
    ) {

      addCandidate(
        state,
        "safeReporting"
      );

    }


    if (
      answers.peerDynamics.includes(
        "entrenched"
      )
    ) {

      addCandidate(
        state,
        "entrenchedPeers"
      );

    }

  }


  // ===================================================
  // Q11 — TRUSTED ADULT
  // ===================================================

  if (
    answers.trustedAdult === "partial" ||
    answers.trustedAdult === "no"
  ) {

    addCandidate(
      state,
      "trustedAdult"
    );

  }


  // ===================================================
  // Q12 — FAMILY
  // ===================================================

  if (
    answers.family === "routine"
  ) {

    addCandidate(
      state,
      "familyRoutine"
    );

  }


  if (
    answers.family === "planned"
  ) {

    addCandidate(
      state,
      "familyPlanned"
    );

  }


  if (
    answers.family === "coordinated"
  ) {

    addCandidate(
      state,
      "familyCoordinated"
    );

  }


  // ===================================================
  // Q13 — COORDINATION
  // ===================================================

  if (
    answers.coordination ===
    "targeted"
  ) {

    addCandidate(
      state,
      "targetedCoordination"
    );

  }


  if (
    answers.coordination ===
    "multidisciplinary"
  ) {

    addCandidate(
      state,
      "multidisciplinaryCoordination"
    );

  }


  // ===================================================
  // Q14 — PREVIOUS RESPONSE
  // ===================================================

  if (
    answers.previousResponse ===
    "partial"
  ) {

    addCandidate(
      state,
      "reviewPartial"
    );

  }


  if (
    answers.previousResponse ===
    "ineffective"
  ) {

    addCandidate(
      state,
      "reviewIneffective"
    );

  }


  if (
    answers.previousResponse ===
    "escalated"
  ) {

    addCandidate(
      state,
      "escalatedReview"
    );

  }


  // ===================================================
  // Q15 — MONITORING
  // ===================================================

  if (
    answers.monitoring === "partial"
  ) {

    addCandidate(
      state,
      "monitoringClarify"
    );

  }


  if (
    answers.monitoring === "no"
  ) {

    addCandidate(
      state,
      "monitoringEstablish"
    );

  }


  // ===================================================
  // CROSS-QUESTION ESCALATION
  // ===================================================

  const responseNotWorking =
    [
      "ineffective",
      "escalated"
    ].includes(
      answers.previousResponse
    );


  // Sustained + poorly understood + unsuccessful
  // intervention warrants stronger assessment.

  if (
    answers.pattern === "sustained" &&
    answers.behaviourUnderstanding ===
      "unclear" &&
    responseNotWorking
  ) {

    supersede(
      state,
      "intensiveBehaviourAssessment",
      [
        "behaviourInfo",
        "structuredBehaviourAssessment",
        "patternAnalysis"
      ]
    );

  }


  // Significant environmental conditions across
  // several physical settings warrant one coordinated
  // environmental plan rather than several duplicates.

  const physicalContexts =
    answers.contexts.filter(
      function (value) {

        return [
          "classroom",
          "playground",
          "transitions"
        ].includes(value);

      }
    );


  if (
    answers.environment ===
      "significant" &&
    physicalContexts.length >= 2
  ) {

    supersede(
      state,
      "coordinatedEnvironment",
      [
        "classroomEnvironment",
        "playgroundEnvironment",
        "transitionEnvironment"
      ]
    );

  }


  // ===================================================
  // CONSOLIDATION / REMOVE REPETITION
  // ===================================================


  // Comprehensive safety planning already includes
  // identification of trusted supports unless the
  // principal has explicitly identified that no trusted
  // adult currently exists.

  if (
    state.has("safetyPlan") &&
    answers.trustedAdult !== "no"
  ) {

    removeCandidate(
      state,
      "trustedAdult"
    );

  }


  // Stronger pattern monitoring replaces emerging
  // short-term monitoring.

  if (
    state.has("coordinatedMonitoring")
  ) {

    removeCandidate(
      state,
      "shortMonitoring"
    );

  }


  if (
    state.has("patternAnalysis")
  ) {

    removeCandidate(
      state,
      "shortMonitoring"
    );

  }


  // Intensive behaviour assessment replaces weaker
  // assessment versions.

  if (
    state.has(
      "intensiveBehaviourAssessment"
    )
  ) {

    removeCandidate(
      state,
      "behaviourInfo"
    );

    removeCandidate(
      state,
      "structuredBehaviourAssessment"
    );

  }


  // Family actions should escalate rather than repeat.

  if (
    state.has("familyCoordinated")
  ) {

    removeCandidate(
      state,
      "familyRoutine"
    );

    removeCandidate(
      state,
      "familyPlanned"
    );

  } else if (
    state.has("familyPlanned")
  ) {

    removeCandidate(
      state,
      "familyRoutine"
    );

  }


  // Multidisciplinary coordination replaces ordinary
  // targeted coordination.

  if (
    state.has(
      "multidisciplinaryCoordination"
    )
  ) {

    removeCandidate(
      state,
      "targetedCoordination"
    );

  }


  // A comprehensive safety plan should already deal
  // with safe access/avoidance arrangements.

  if (
    state.has("safetyPlan") &&
    answers.impacts.includes(
      "avoidance"
    )
  ) {

    removeCandidate(
      state,
      "avoidanceSupport"
    );

  }


  // Significant wellbeing support supersedes a generic
  // emotional check-in action.

  if (
    state.has("wellbeingReferral")
  ) {

    removeCandidate(
      state,
      "emotionalSupport"
    );

  }


  // Entrenched peer-group work absorbs generic peer
  // reinforcement work. Specific exclusion or individual
  // participation actions can remain.

  if (
    state.has("entrenchedPeers")
  ) {

    removeCandidate(
      state,
      "peerReinforcement"
    );

  }


  // ===================================================
  // RETURN ACTIONS
  // ===================================================

  return Array.from(
    state.values()
  ).sort(
    function (a, b) {
      return a.tier - b.tier;
    }
  );

}


// =====================================================
// GENERATE ACTION PLAN
// =====================================================

function generateActionPlan() {

  const answers =
    getAnswers();


  const actions =
    buildSuggestedActions(
      answers
    );


  buildActionPlan(
    actions,
    answers
  );


  if (questionnaire) {
    questionnaire.classList.add(
      "hidden"
    );
  }


  if (actionPlan) {
    actionPlan.classList.remove(
      "hidden"
    );
  }


  setDefaultPlanDate();

  updateSelectedCount();


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// =====================================================
// CREATE SUGGESTED ACTION ROW
// =====================================================

function addSuggestedAction(
  container,
  action
) {

  if (!container) {
    return;
  }


  const row =
    document.createElement("tr");


  row.dataset.actionId =
    action.id;


  // SELECT

  const selectCell =
    document.createElement("td");

  selectCell.className =
    "check-cell";


  const checkbox =
    document.createElement("input");

  checkbox.type =
    "checkbox";

  checkbox.className =
    "action-checkbox";

  checkbox.setAttribute(
    "aria-label",
    `Select action: ${action.text}`
  );

  checkbox.addEventListener(
    "change",
    updateSelectedCount
  );


  selectCell.appendChild(
    checkbox
  );


  // ACTION

  const actionCell =
    document.createElement("td");

  actionCell.className =
    "action-content";


  const strong =
    document.createElement("strong");

  strong.textContent =
    action.text;


  actionCell.appendChild(
    strong
  );


  // RESPONSIBLE

  const responsibleCell =
    document.createElement("td");


  const responsibleInput =
    document.createElement("input");

  responsibleInput.type =
    "text";

  responsibleInput.className =
    "plan-input";

  responsibleInput.placeholder =
    "Name / role";

  responsibleInput.setAttribute(
    "aria-label",
    `Responsible person for ${action.text}`
  );


  responsibleCell.appendChild(
    responsibleInput
  );


  // DATE

  const dateCell =
    document.createElement("td");


  const dateInput =
    document.createElement("input");

  dateInput.type =
    "date";

  dateInput.className =
    "plan-input date-input";

  dateInput.setAttribute(
    "aria-label",
    `Due date for ${action.text}`
  );


  dateCell.appendChild(
    dateInput
  );


  // ROW

  row.appendChild(
    selectCell
  );

  row.appendChild(
    actionCell
  );

  row.appendChild(
    responsibleCell
  );

  row.appendChild(
    dateCell
  );


  container.appendChild(
    row
  );

}


// =====================================================
// CLEAR GENERATED ACTIONS
// =====================================================

function clearGeneratedActions() {

  [
    "tier1Actions",
    "tier2Actions",
    "tier3Actions",
    "reviewActions"
  ].forEach(
    function (id) {

      const element =
        document.getElementById(id);

      if (element) {
        element.innerHTML = "";
      }

    }
  );


  [
    "tier1Section",
    "tier2Section",
    "tier3Section"
  ].forEach(
    function (id) {

      const element =
        document.getElementById(id);

      if (element) {
        element.classList.add(
          "hidden"
        );
      }

    }
  );


  if (monitoringActionsWrap) {

    monitoringActionsWrap.classList.add(
      "hidden"
    );

  }

}


// =====================================================
// BUILD ACTION PLAN
// =====================================================

function buildActionPlan(
  actions,
  answers
) {

  clearGeneratedActions();


  const tier1Actions =
    document.getElementById(
      "tier1Actions"
    );

  const tier2Actions =
    document.getElementById(
      "tier2Actions"
    );

  const tier3Actions =
    document.getElementById(
      "tier3Actions"
    );

  const reviewActions =
    document.getElementById(
      "reviewActions"
    );


  const reviewIds =
    new Set([
      "reviewPartial",
      "reviewIneffective",
      "escalatedReview",
      "monitoringClarify",
      "monitoringEstablish"
    ]);


  actions.forEach(
    function (action) {

      if (
        reviewIds.has(
          action.id
        )
      ) {

        addSuggestedAction(
          reviewActions,
          action
        );

        return;

      }


      if (action.tier === 1) {

        addSuggestedAction(
          tier1Actions,
          action
        );

      }


      if (action.tier === 2) {

        addSuggestedAction(
          tier2Actions,
          action
        );

      }


      if (action.tier === 3) {

        addSuggestedAction(
          tier3Actions,
          action
        );

      }

    }
  );


  toggleSectionByRows(
    "tier1Section",
    tier1Actions
  );


  toggleSectionByRows(
    "tier2Section",
    tier2Actions
  );


  toggleSectionByRows(
    "tier3Section",
    tier3Actions
  );


  if (
    reviewActions &&
    reviewActions.children.length > 0 &&
    monitoringActionsWrap
  ) {

    monitoringActionsWrap.classList.remove(
      "hidden"
    );

  }


  // When previous response is effective and monitoring
  // is already clear, no unnecessary review action is
  // displayed. The universal review date/outcome fields
  // remain available.

  if (
    answers.previousResponse ===
      "effective" &&
    answers.monitoring === "yes"
  ) {

    if (monitoringActionsWrap) {

      monitoringActionsWrap.classList.add(
        "hidden"
      );

    }

  }

}


function toggleSectionByRows(
  sectionId,
  tbody
) {

  const section =
    document.getElementById(
      sectionId
    );


  if (
    !section ||
    !tbody
  ) {
    return;
  }


  if (
    tbody.children.length > 0
  ) {

    section.classList.remove(
      "hidden"
    );

  } else {

    section.classList.add(
      "hidden"
    );

  }

}


// =====================================================
// ADDITIONAL SCHOOL-IDENTIFIED ACTIONS
// =====================================================

function addCustomActionRow() {

  if (!customActions) {
    return;
  }


  const row =
    document.createElement("tr");

  row.className =
    "custom-action-row";


  // ACTION

  const actionCell =
    document.createElement("td");


  const actionInput =
    document.createElement(
      "textarea"
    );

  actionInput.className =
    "custom-action-input";

  actionInput.placeholder =
    "Enter school-identified action";

  actionInput.setAttribute(
    "aria-label",
    "Additional school-identified action"
  );


  actionCell.appendChild(
    actionInput
  );


  // RESPONSIBLE

  const responsibleCell =
    document.createElement("td");


  const responsibleInput =
    document.createElement("input");

  responsibleInput.type =
    "text";

  responsibleInput.className =
    "plan-input";

  responsibleInput.placeholder =
    "Name / role";


  responsibleCell.appendChild(
    responsibleInput
  );


  // DUE DATE

  const dateCell =
    document.createElement("td");


  const dateInput =
    document.createElement("input");

  dateInput.type =
    "date";

  dateInput.className =
    "plan-input date-input";


  dateCell.appendChild(
    dateInput
  );


  // REMOVE

  const removeCell =
    document.createElement("td");

  removeCell.className =
    "no-print";


  const removeButton =
    document.createElement("button");

  removeButton.type =
    "button";

  removeButton.className =
    "remove-action-button";

  removeButton.textContent =
    "Remove";


  removeButton.addEventListener(
    "click",
    function () {

      row.remove();

    }
  );


  removeCell.appendChild(
    removeButton
  );


  row.appendChild(
    actionCell
  );

  row.appendChild(
    responsibleCell
  );

  row.appendChild(
    dateCell
  );

  row.appendChild(
    removeCell
  );


  customActions.appendChild(
    row
  );

}


if (addCustomActionButton) {

  addCustomActionButton.addEventListener(
    "click",
    addCustomActionRow
  );

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
      ? "1 suggested action selected"
      : `${count} suggested actions selected`;

}


// =====================================================
// BACK TO RESPONSES
// =====================================================

if (editResponsesButton) {

  editResponsesButton.addEventListener(
    "click",
    function () {

      if (actionPlan) {

        actionPlan.classList.add(
          "hidden"
        );

      }


      if (questionnaire) {

        questionnaire.classList.remove(
          "hidden"
        );

      }


      currentSection =
        totalSections;


      showSection(
        currentSection
      );

    }
  );

}


// =====================================================
// VERSION 1.2 — SAVE / OPEN CASE FILES
//
// Case files are JSON documents stored by the user.
// They contain the questionnaire state and current plan,
// allowing a case to be reopened and continued later.
// =====================================================

function getCurrentView() {

  if (
    actionPlan &&
    !actionPlan.classList.contains("hidden")
  ) {
    return "actionPlan";
  }

  if (
    questionnaire &&
    !questionnaire.classList.contains("hidden")
  ) {
    return "questionnaire";
  }

  return "landing";

}


function getInputValue(id) {

  const element =
    document.getElementById(id);

  return element
    ? element.value
    : "";

}


function getSuggestedActionState() {

  const result = {};

  document
    .querySelectorAll(
      ".action-table tbody tr[data-action-id]"
    )
    .forEach(
      function (row) {

        const actionId =
          row.dataset.actionId;

        const checkbox =
          row.querySelector(
            ".action-checkbox"
          );

        const inputs =
          row.querySelectorAll(
            ".plan-input"
          );

        result[actionId] = {
          selected:
            checkbox
              ? checkbox.checked
              : false,
          responsible:
            inputs[0]
              ? inputs[0].value
              : "",
          dueDate:
            inputs[1]
              ? inputs[1].value
              : ""
        };

      }
    );

  return result;

}


function getCustomActionState() {

  return Array.from(
    document.querySelectorAll(
      ".custom-action-row"
    )
  ).map(
    function (row) {

      const action =
        row.querySelector(
          "textarea"
        );

      const inputs =
        row.querySelectorAll(
          ".plan-input"
        );

      return {
        action:
          action
            ? action.value
            : "",
        responsible:
          inputs[0]
            ? inputs[0].value
            : "",
        dueDate:
          inputs[1]
            ? inputs[1].value
            : ""
      };

    }
  ).filter(
    function (item) {

      return (
        item.action.trim() ||
        item.responsible.trim() ||
        item.dueDate
      );

    }
  );

}


function buildCaseFileData() {

  return {
    _format:
      CASE_FILE_FORMAT,
    _version:
      CASE_FILE_VERSION,
    savedAt:
      new Date().toISOString(),
    view:
      getCurrentView(),
    currentSection:
      currentSection,
    answers:
      getAnswers(),
    plan: {
      schoolName:
        getInputValue("schoolName"),
      studentReference:
        getInputValue("studentReference"),
      planDate:
        getInputValue("planDate"),
      planLead:
        getInputValue("planLead"),
      suggestedActions:
        getSuggestedActionState(),
      customActions:
        getCustomActionState(),
      reviewDate:
        getInputValue("reviewDate"),
      reviewLead:
        getInputValue("reviewLead"),
      reviewOutcomes:
        getCheckedValues(
          "reviewOutcome"
        )
    }
  };

}


function safeFilePart(value) {

  return String(value || "")
    .trim()
    .replace(/[^a-z0-9-_]+/gi, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60);

}


function downloadCaseFile() {

  const data =
    buildCaseFileData();

  const json =
    JSON.stringify(
      data,
      null,
      2
    );

  const blob =
    new Blob(
      [json],
      {
        type:
          "application/json"
      }
    );

  const url =
    URL.createObjectURL(
      blob
    );

  const link =
    document.createElement("a");

  const reference =
    safeFilePart(
      data.plan.studentReference
    );

  const date =
    data.plan.planDate ||
    new Date()
      .toISOString()
      .slice(0, 10);

  link.href = url;
  link.download =
    `Bullying_Response_Case_${reference ? reference + "_" : ""}${date}.json`;

  document.body.appendChild(
    link
  );

  link.click();
  link.remove();

  URL.revokeObjectURL(
    url
  );

  showToast("Case file saved to your device.");

}


function setSelectValue(
  id,
  value
) {

  const element =
    document.getElementById(id);

  if (
    element &&
    value !== undefined &&
    value !== null
  ) {
    element.value = value;
  }

}


function setCheckboxGroup(
  name,
  values
) {

  const selected =
    new Set(
      Array.isArray(values)
        ? values
        : []
    );

  document
    .querySelectorAll(
      `input[name="${name}"]`
    )
    .forEach(
      function (input) {
        input.checked =
          selected.has(
            input.value
          );
      }
    );

}


function restoreAnswers(answers) {

  if (!answers) {
    return;
  }

  setSelectValue(
    "pattern",
    answers.pattern
  );
  setSelectValue(
    "power",
    answers.power
  );
  setCheckboxGroup(
    "contexts",
    answers.contexts
  );
  setSelectValue(
    "safety",
    answers.safety
  );
  setCheckboxGroup(
    "impacts",
    answers.impacts
  );
  setSelectValue(
    "behaviourUnderstanding",
    answers.behaviourUnderstanding
  );
  setCheckboxGroup(
    "skills",
    answers.skills
  );
  setSelectValue(
    "environment",
    answers.environment
  );
  setSelectValue(
    "adjustments",
    answers.adjustments
  );
  setCheckboxGroup(
    "peerDynamics",
    answers.peerDynamics
  );
  setSelectValue(
    "trustedAdult",
    answers.trustedAdult
  );
  setSelectValue(
    "family",
    answers.family
  );
  setSelectValue(
    "coordination",
    answers.coordination
  );
  setSelectValue(
    "previousResponse",
    answers.previousResponse
  );
  setSelectValue(
    "monitoring",
    answers.monitoring
  );

}


function setElementValue(
  id,
  value
) {

  const element =
    document.getElementById(id);

  if (element) {
    element.value =
      value || "";
  }

}


function restoreSuggestedActionState(
  suggestedActions
) {

  if (!suggestedActions) {
    return;
  }

  Object.entries(
    suggestedActions
  ).forEach(
    function ([actionId, saved]) {

      const row =
        document.querySelector(
          `tr[data-action-id="${actionId}"]`
        );

      if (!row) {
        return;
      }

      const checkbox =
        row.querySelector(
          ".action-checkbox"
        );

      const inputs =
        row.querySelectorAll(
          ".plan-input"
        );

      if (checkbox) {
        checkbox.checked =
          Boolean(
            saved.selected
          );
      }

      if (inputs[0]) {
        inputs[0].value =
          saved.responsible || "";
      }

      if (inputs[1]) {
        inputs[1].value =
          saved.dueDate || "";
      }

    }
  );

}


function clearCustomActionRows() {

  if (customActions) {
    customActions.innerHTML = "";
  }

}


function restoreCustomActions(
  actions
) {

  clearCustomActionRows();

  if (!Array.isArray(actions)) {
    return;
  }

  actions.forEach(
    function (saved) {

      addCustomActionRow();

      const row =
        customActions.lastElementChild;

      if (!row) {
        return;
      }

      const textarea =
        row.querySelector("textarea");

      const inputs =
        row.querySelectorAll(
          ".plan-input"
        );

      if (textarea) {
        textarea.value =
          saved.action || "";
      }

      if (inputs[0]) {
        inputs[0].value =
          saved.responsible || "";
      }

      if (inputs[1]) {
        inputs[1].value =
          saved.dueDate || "";
      }

    }
  );

}


function validateCaseFile(data) {

  if (
    !data ||
    typeof data !== "object"
  ) {
    throw new Error(
      "This file does not contain a valid saved case."
    );
  }

  if (
    data._format !==
    CASE_FILE_FORMAT
  ) {
    throw new Error(
      "This JSON file is not a Bullying Response Planning Tool case file."
    );
  }

  if (
    data._version !==
    CASE_FILE_VERSION
  ) {
    throw new Error(
      `This case was created with version ${data._version || "unknown"}. This prototype currently opens Version ${CASE_FILE_VERSION} case files only.`
    );
  }

  if (
    !data.answers ||
    typeof data.answers !== "object"
  ) {
    throw new Error(
      "The saved case is missing questionnaire responses."
    );
  }

}


function restoreCaseFile(data) {

  validateCaseFile(data);

  restoreAnswers(
    data.answers
  );

  const plan =
    data.plan || {};

  setElementValue(
    "schoolName",
    plan.schoolName
  );
  setElementValue(
    "studentReference",
    plan.studentReference
  );
  setElementValue(
    "planDate",
    plan.planDate
  );
  setElementValue(
    "planLead",
    plan.planLead
  );
  setElementValue(
    "reviewDate",
    plan.reviewDate
  );
  setElementValue(
    "reviewLead",
    plan.reviewLead
  );

  setCheckboxGroup(
    "reviewOutcome",
    plan.reviewOutcomes
  );

  if (
    data.view === "actionPlan"
  ) {

    const actions =
      buildSuggestedActions(
        data.answers
      );

    buildActionPlan(
      actions,
      data.answers
    );

    restoreSuggestedActionState(
      plan.suggestedActions
    );

    restoreCustomActions(
      plan.customActions
    );

    if (landingPage) {
      landingPage.classList.add(
        "hidden"
      );
    }

    if (questionnaire) {
      questionnaire.classList.add(
        "hidden"
      );
    }

    if (actionPlan) {
      actionPlan.classList.remove(
        "hidden"
      );
    }

    updateSelectedCount();

  } else {

    if (landingPage) {
      landingPage.classList.add(
        "hidden"
      );
    }

    if (actionPlan) {
      actionPlan.classList.add(
        "hidden"
      );
    }

    if (questionnaire) {
      questionnaire.classList.remove(
        "hidden"
      );
    }

    const requestedSection =
      Number(
        data.currentSection
      );

    currentSection =
      Number.isInteger(
        requestedSection
      ) &&
      requestedSection >= 1 &&
      requestedSection <= totalSections
        ? requestedSection
        : 1;

    showSection(
      currentSection
    );

  }

  setDefaultPlanDate();
  showToast("Case file opened successfully.");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


async function openSelectedCaseFile(
  file
) {

  if (!file) {
    return;
  }

  try {

    const text =
      await file.text();

    const data =
      JSON.parse(text);

    restoreCaseFile(data);

  } catch (error) {

    const message = error && error.message
      ? error.message
      : "The case file could not be opened.";
    showToast(message, "error");

  } finally {

    if (caseFileInput) {
      caseFileInput.value = "";
    }

  }

}


if (
  openCaseButton &&
  caseFileInput
) {

  openCaseButton.addEventListener(
    "click",
    function () {
      caseFileInput.click();
    }
  );

  caseFileInput.addEventListener(
    "change",
    function () {
      openSelectedCaseFile(
        this.files &&
        this.files[0]
      );
    }
  );

}


[
  saveCaseQuestionnaireButton,
  saveCasePlanButton
].forEach(
  function (button) {

    if (!button) {
      return;
    }

    button.addEventListener(
      "click",
      downloadCaseFile
    );

  }
);


// =====================================================
// PRINT PREPARATION
// =====================================================

function prepareSelectedActionsForPrint() {

  // Hide unselected suggested actions.

  document
    .querySelectorAll(
      ".action-table tbody tr"
    )
    .forEach(
      function (row) {

        const checkbox =
          row.querySelector(
            ".action-checkbox"
          );


        if (
          checkbox &&
          !checkbox.checked
        ) {

          row.classList.add(
            "hide-for-print"
          );

        }

      }
    );


  // Hide tier sections with no selected actions.

  [
    "tier1Section",
    "tier2Section",
    "tier3Section"
  ].forEach(
    function (id) {

      const section =
        document.getElementById(id);


      if (
        !section ||
        section.classList.contains(
          "hidden"
        )
      ) {
        return;
      }


      const selectedRows =
        Array.from(
          section.querySelectorAll(
            "tbody tr"
          )
        ).filter(
          function (row) {

            const checkbox =
              row.querySelector(
                ".action-checkbox"
              );


            return (
              checkbox &&
              checkbox.checked
            );

          }
        );


      if (
        selectedRows.length === 0
      ) {

        section.classList.add(
          "hide-section-for-print"
        );

      }

    }
  );


  // Review action table is optional.
  // Review date/outcome fields always remain.

  if (
    monitoringActionsWrap &&
    !monitoringActionsWrap.classList.contains(
      "hidden"
    )
  ) {

    const selectedReviewRows =
      Array.from(
        document.querySelectorAll(
          "#reviewActions tr"
        )
      ).filter(
        function (row) {

          const checkbox =
            row.querySelector(
              ".action-checkbox"
            );


          return (
            checkbox &&
            checkbox.checked
          );

        }
      );


    if (
      selectedReviewRows.length === 0
    ) {

      monitoringActionsWrap.classList.add(
        "hide-for-print"
      );

    }

  }


  // Hide blank custom-action rows.

  document
    .querySelectorAll(
      ".custom-action-row"
    )
    .forEach(
      function (row) {

        const textarea =
          row.querySelector(
            "textarea"
          );


        if (
          !textarea ||
          !textarea.value.trim()
        ) {

          row.classList.add(
            "hide-for-print"
          );

        }

      }
    );


  // Hide custom-action section entirely if no
  // school-created actions have been entered.

  const customSection =
    document.getElementById(
      "customActionsSection"
    );


  if (customSection) {

    const completedCustomActions =
      Array.from(
        document.querySelectorAll(
          ".custom-action-row textarea"
        )
      ).filter(
        function (textarea) {

          return (
            textarea.value.trim()
              .length > 0
          );

        }
      );


    if (
      completedCustomActions.length === 0
    ) {

      customSection.classList.add(
        "hide-section-for-print"
      );

    }

  }

}


// =====================================================
// RESTORE AFTER PRINT
// =====================================================

function restoreAfterPrint() {

  document
    .querySelectorAll(
      ".hide-for-print"
    )
    .forEach(
      function (element) {

        element.classList.remove(
          "hide-for-print"
        );

      }
    );


  document
    .querySelectorAll(
      ".hide-section-for-print"
    )
    .forEach(
      function (element) {

        element.classList.remove(
          "hide-section-for-print"
        );

      }
    );

}


// =====================================================
// PRINT COUNTS
// =====================================================

function getSelectedSuggestedActionCount() {

  return document.querySelectorAll(
    ".action-checkbox:checked"
  ).length;

}


function getCompletedCustomActionCount() {

  return Array.from(
    document.querySelectorAll(
      ".custom-action-row textarea"
    )
  ).filter(
    function (textarea) {

      return (
        textarea.value.trim()
          .length > 0
      );

    }
  ).length;

}


// =====================================================
// PRINT
// =====================================================

if (printButton) {

  printButton.addEventListener(
    "click",
    function () {

      const selectedSuggested =
        getSelectedSuggestedActionCount();


      const customCount =
        getCompletedCustomActionCount();


      if (
        selectedSuggested === 0 &&
        customCount === 0
      ) {

        alert(
          "Please select at least one suggested action or add a school-identified action before printing the plan."
        );

        return;

      }


      prepareSelectedActionsForPrint();


      window.print();


      // Backup restoration for browsers where
      // afterprint does not fire reliably.

      setTimeout(
        restoreAfterPrint,
        1000
      );

    }
  );

}


window.addEventListener(
  "afterprint",
  restoreAfterPrint
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
          "Start a new plan? Your current responses, selected actions and plan details will be cleared."
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