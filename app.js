import { VIEW, RANDOM_SEED_BASE } from "./constants.js";
import { createInitialState, saveView } from "./state.js";
import { parseQuestionPayload } from "./json-service.js";
import { fisherYatesShuffle, mulberry32 } from "./utils.js";
import { renderHeader, renderQuestions, renderStats } from "./question-renderer.js";
import { applyViewSettings } from "./answer-key-renderer.js";

const state = createInitialState();

const elements = {
  btnQuestions: document.getElementById("btnQuestions"),
  btnSolutions: document.getElementById("btnSolutions"),
  btnRandomize: document.getElementById("btnRandomize"),
  btnPrint: document.getElementById("btnPrint"),
  btnReset: document.getElementById("btnReset"),
  btnUploadTrigger: document.getElementById("btnUploadTrigger"),
  btnInstructionModal: document.getElementById("btnInstructionModal"),
  btnOpenPaste: document.getElementById("btnOpenPaste"),
  btnSubmitPaste: document.getElementById("btnSubmitPaste"),
  instructionModalClose: document.getElementById("instructionModalClose"),
  pasteModalClose: document.getElementById("pasteModalClose"),
  jsonFileInput: document.getElementById("jsonFileInput"),
  questionCount: document.getElementById("questionCount"),
  shuffleOptions: document.getElementById("shuffleOptions"),
  rawJsonInput: document.getElementById("rawJsonInput"),
  aiPromptTextarea: document.getElementById("aiPromptTextarea"),
  uploadToast: document.getElementById("uploadToast"),
  instructionModal: document.getElementById("instructionModal"),
  pasteModal: document.getElementById("pasteModal"),
  optionsPanel: document.querySelector(".options-panel"),
  header: document.getElementById("header"),
  metaInfo: document.getElementById("metaInfo"),
  container: document.getElementById("container"),
  stats: document.getElementById("stats"),
  answerKeyContainer: document.getElementById("answerKeyContainer"),
};

function init() {
  bindEvents();
  updateViewButtons();
  renderQuestions(state, elements);
}

function bindEvents() {
  elements.btnQuestions.addEventListener("click", () => setView(VIEW.QUESTIONS));
  elements.btnSolutions.addEventListener("click", () => setView(VIEW.SOLUTIONS));
  elements.btnRandomize.addEventListener("click", randomizeQuestions);
  elements.btnPrint.addEventListener("click", () => window.print());
  elements.btnReset.addEventListener("click", resetQuestions);

  elements.btnUploadTrigger.addEventListener("click", () => {
    elements.jsonFileInput.click();
  });
  elements.jsonFileInput.addEventListener("change", handleJsonUpload);
  elements.questionCount.addEventListener("change", filterQuestions);

  elements.btnInstructionModal.addEventListener("click", openInstructionModal);
  elements.btnOpenPaste.addEventListener("click", openPasteModal);
  elements.btnSubmitPaste.addEventListener("click", handleRawJsonSubmit);
  elements.instructionModalClose.addEventListener("click", closeInstructionModal);
  elements.pasteModalClose.addEventListener("click", closePasteModal);
  elements.aiPromptTextarea.addEventListener("click", copyPromptText);

  window.addEventListener("click", handleOutsideModalClick);
  bindDragDrop();
}

function handleJsonUpload(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  processFileUpload(file);
  event.target.value = "";
}

function processFileUpload(file) {
  if (!file.name.endsWith(".json")) {
    alert("অনুগ্রহ করে একটি বৈধ .json ফাইল বেছে নিন।");
    return;
  }

  const reader = new FileReader();
  reader.onload = (readerEvent) => {
    processJsonData(readerEvent.target.result, file.name);
  };
  reader.readAsText(file, "UTF-8");
}

function processJsonData(jsonString, sourceName) {
  try {
    const parsed = parseQuestionPayload(jsonString);
    state.allQuestions = parsed.questions;
    state.metadata = parsed.metadata;
    state.displayedQuestions = [...state.allQuestions];

    elements.questionCount.value = state.allQuestions.length;
    filterQuestions();
    setView(state.currentView);

    showToast(
      `✅ ${sourceName} সফলভাবে লোড হয়েছে (${state.allQuestions.length}টি প্রশ্ন)`
    );
  } catch (error) {
    alert(`JSON পার্স করতে সমস্যা হয়েছে: ${error.message}`);
    console.error("JSON parse error:", error);
  }
}

function handleRawJsonSubmit() {
  const jsonText = elements.rawJsonInput.value.trim();
  if (!jsonText) {
    alert("অনুগ্রহ করে কিছু JSON কোড পেস্ট করুন।");
    return;
  }

  processJsonData(jsonText, "পেস্ট করা ডাটা");
  closePasteModal();
  elements.rawJsonInput.value = "";
}

function showToast(message) {
  elements.uploadToast.textContent = message;
  elements.uploadToast.style.display = "block";
  setTimeout(() => {
    elements.uploadToast.style.display = "none";
  }, 3500);
}

function openInstructionModal() {
  elements.instructionModal.style.display = "block";
}

function closeInstructionModal() {
  elements.instructionModal.style.display = "none";
}

function openPasteModal() {
  elements.pasteModal.style.display = "block";
}

function closePasteModal() {
  elements.pasteModal.style.display = "none";
}

function handleOutsideModalClick(event) {
  if (event.target === elements.instructionModal) {
    closeInstructionModal();
  }
  if (event.target === elements.pasteModal) {
    closePasteModal();
  }
}

function copyPromptText() {
  elements.aiPromptTextarea.select();
  document.execCommand("copy");
  showToast("✅ প্রম্পট কপি হয়েছে!");
}

function bindDragDrop() {
  elements.optionsPanel.addEventListener("dragover", (event) => {
    event.preventDefault();
    elements.optionsPanel.classList.add("drag-over");
  });

  elements.optionsPanel.addEventListener("dragleave", () => {
    elements.optionsPanel.classList.remove("drag-over");
  });

  elements.optionsPanel.addEventListener("drop", (event) => {
    event.preventDefault();
    elements.optionsPanel.classList.remove("drag-over");

    const file = event.dataTransfer.files[0];
    if (file) {
      processFileUpload(file);
    }
  });
}

function filterQuestions() {
  const count = Number.parseInt(elements.questionCount.value, 10) || 40;
  state.displayedQuestions = state.allQuestions.slice(
    0,
    Math.min(count, state.allQuestions.length)
  );
  renderStats(state, elements.stats);
  renderAll();
}

function renderAll() {
  renderQuestions(state, elements);
  applyViewSettings(state, elements);
  renderMath();
}

function renderMath() {
  if (typeof renderMathInElement === "undefined") {
    return;
  }

  renderMathInElement(elements.container, {
    delimiters: [
      { left: "\\(", right: "\\)", display: false },
      { left: "\\[", right: "\\]", display: true },
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false },
    ],
    throwOnError: false,
  });
}

function setView(view) {
  state.currentView = view;
  saveView(view);
  updateViewButtons();
  applyViewSettings(state, elements);
  renderHeader(state, elements);
}

function updateViewButtons() {
  elements.btnQuestions.classList.toggle(
    "active",
    state.currentView === VIEW.QUESTIONS
  );
  elements.btnSolutions.classList.toggle(
    "active",
    state.currentView === VIEW.SOLUTIONS
  );
}

function randomizeQuestions() {
  if (state.allQuestions.length === 0) {
    return;
  }

  state.setIndex += 1;
  const shouldShuffleOptions = elements.shuffleOptions.checked;
  const rng = mulberry32(state.setIndex + RANDOM_SEED_BASE);

  const questionsByGroup = {};
  const ungroupedQuestions = [];

  state.displayedQuestions.forEach((originalQuestion) => {
    const originalIndex =
      originalQuestion._originalIndex !== undefined
        ? originalQuestion._originalIndex
        : state.allQuestions.indexOf(originalQuestion);

    const randomizedQuestion = {
      ...originalQuestion,
      _originalIndex: originalIndex,
    };

    if (
      shouldShuffleOptions &&
      randomizedQuestion.options &&
      randomizedQuestion.options.length > 0
    ) {
      const indices = randomizedQuestion.options.map((_, index) => index);
      fisherYatesShuffle(indices, rng);

      randomizedQuestion.options = indices.map(
        (index) => originalQuestion.options[index]
      );

      if (
        originalQuestion.answer !== undefined &&
        originalQuestion.answer !== null &&
        originalQuestion.answer !== -1
      ) {
        randomizedQuestion.answer = indices.indexOf(originalQuestion.answer);
      }
    }

    if (randomizedQuestion.group_id) {
      if (!questionsByGroup[randomizedQuestion.group_id]) {
        questionsByGroup[randomizedQuestion.group_id] = [];
      }
      questionsByGroup[randomizedQuestion.group_id].push(randomizedQuestion);
    } else {
      ungroupedQuestions.push(randomizedQuestion);
    }
  });

  Object.values(questionsByGroup).forEach((group) => {
    group.sort((a, b) => {
      const indexA = a._originalIndex !== undefined ? a._originalIndex : 0;
      const indexB = b._originalIndex !== undefined ? b._originalIndex : 0;
      return indexA - indexB;
    });
  });

  const itemsToShuffle = [
    ...ungroupedQuestions,
    ...Object.values(questionsByGroup),
  ];
  fisherYatesShuffle(itemsToShuffle, rng);

  state.displayedQuestions = itemsToShuffle.flat();
  renderAll();
}

function resetQuestions() {
  state.setIndex = 0;
  state.displayedQuestions = [...state.allQuestions];
  elements.questionCount.value = state.allQuestions.length;
  filterQuestions();
}

document.addEventListener("DOMContentLoaded", init);
