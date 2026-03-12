import {
  OPTION_LABELS,
  QUESTIONS_PER_ANSWER_KEY_ROW,
  VIEW,
} from "./constants.js";
import { toBengaliNum } from "./utils.js";

export function applyViewSettings(state, elements) {
  const { container, answerKeyContainer } = elements;

  if (state.currentView === VIEW.QUESTIONS) {
    container.classList.remove("solution-mode");
    container
      .querySelectorAll(".answer-text")
      .forEach((element) => element.classList.add("hidden"));
    renderAnswerKey(state, answerKeyContainer);
    return;
  }

  container.classList.add("solution-mode");
  container
    .querySelectorAll(".answer-text")
    .forEach((element) => element.classList.remove("hidden"));
  answerKeyContainer.innerHTML = "";
  renderAnswerKey(state, answerKeyContainer);
}

function renderAnswerKey(state, answerKeyContainer) {
  const mcqQuestions = state.displayedQuestions.filter(
    (question) => question.type !== "cq"
  );

  if (mcqQuestions.length === 0) {
    answerKeyContainer.innerHTML = "";
    return;
  }

  const totalRows = Math.ceil(
    mcqQuestions.length / QUESTIONS_PER_ANSWER_KEY_ROW
  );
  let html = '<table class="answer-key-table">';

  for (let row = 0; row < totalRows; row += 1) {
    const startIndex = row * QUESTIONS_PER_ANSWER_KEY_ROW;
    const endIndex = Math.min(
      startIndex + QUESTIONS_PER_ANSWER_KEY_ROW,
      mcqQuestions.length
    );

    html += "<tr>";
    for (let i = startIndex; i < endIndex; i += 1) {
      html += `<th>${toBengaliNum(i + 1)}</th>`;
    }
    for (let i = endIndex; i < startIndex + QUESTIONS_PER_ANSWER_KEY_ROW; i += 1) {
      html += "<th></th>";
    }
    html += "</tr>";

    html += "<tr>";
    for (let i = startIndex; i < endIndex; i += 1) {
      const answerIndex =
        mcqQuestions[i].answer !== undefined && mcqQuestions[i].answer !== null
          ? mcqQuestions[i].answer
          : -1;
      const answerLabel =
        answerIndex !== -1 ? OPTION_LABELS[answerIndex] : "-";
      html += `<td class="answer-cell">${answerLabel}</td>`;
    }
    for (let i = endIndex; i < startIndex + QUESTIONS_PER_ANSWER_KEY_ROW; i += 1) {
      html += "<td></td>";
    }
    html += "</tr>";
  }

  html += "</table>";
  answerKeyContainer.innerHTML = html;
}
