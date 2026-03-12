import { OPTION_LABELS, VIEW } from "./constants.js";
import { toBengaliNum } from "./utils.js";

export function renderHeader(state, elements) {
  const { header, metaInfo } = elements;
  const title =
    state.currentView === VIEW.SOLUTIONS
      ? "সমাধান পত্র (Solution Sheet)"
      : "মডেল টেস্ট পরীক্ষা";

  const setLabel = String.fromCharCode(65 + (state.setIndex % 26));

  if (state.metadata.subject) {
    document.title = `${state.metadata.subject} - Exam System`;
  }

  header.innerHTML = `
    <h1>${title} <span style="font-size: 16px; float: right; border: 1px solid #000; padding: 2px 8px; border-radius: 4px;">সেট: ${setLabel}</span></h1>
    <p>শ্রেণি: ${state.metadata.class || "N/A"} | বিষয়: ${
    state.metadata.subject || "N/A"
  }</p>
    <p>অধ্যায়: ${state.metadata.chapter || "N/A"} </p>
  `;

  const totalMarks = state.displayedQuestions.length;
  if (state.currentView === VIEW.SOLUTIONS) {
    metaInfo.innerHTML = "";
    return;
  }

  metaInfo.innerHTML = `
    <span>পূর্ণমান: ${toBengaliNum(totalMarks)}</span>
    <span>সময়: ${toBengaliNum(totalMarks)} মিনিট</span>
  `;
}

export function renderQuestions(state, elements) {
  const { header, metaInfo, container, stats, answerKeyContainer } = elements;

  if (state.displayedQuestions.length === 0) {
    header.innerHTML = "";
    metaInfo.innerHTML = "";
    container.innerHTML = `
      <div style="text-align: center; padding: 50px; color: #7f8c8d; grid-column: 1 / -1; width: 100%;">
        <h2 style="margin-bottom: 20px;">স্বাগতম! (Welcome!)</h2>
        <p style="font-size: 16px;">শুরু করতে অনুগ্রহ করে উপর থেকে একটি JSON ফাইল (📂 JSON আপলোড) নির্বাচন করুন।</p>
      </div>
    `;
    stats.innerHTML = "";
    answerKeyContainer.innerHTML = "";
    return;
  }

  renderHeader(state, elements);
  container.innerHTML = state.displayedQuestions
    .map((question, index) => createQuestionHTML(question, index + 1))
    .join("");
}

function createQuestionHTML(question, displayNumber) {
  if (question.type === "cq") {
    return createCQHTML(question, displayNumber);
  }

  const answerIndex =
    question.answer !== undefined && question.answer !== null ? question.answer : -1;
  const answerLabel = answerIndex !== -1 ? OPTION_LABELS[answerIndex] : "?";
  const hasImageClass = question.image ? "with-image" : "";
  let html = `<div class="question-box ${hasImageClass}">`;

  if (question.image) {
    html += `<img src="${question.image}" alt="Question ${displayNumber} diagram" class="question-image" referrerpolicy="no-referrer" crossorigin="anonymous">`;
  }

  html += `<div class="question-text">${toBengaliNum(displayNumber)}. ${
    question.question
  }</div>`;

  if (question.options && question.options.length > 0) {
    const compactClass = question.compact ? "compact" : "";
    const hasImageOptions = question.options.some(
      (option) => option && option.startsWith("img:")
    );
    const imageOptionsClass = hasImageOptions ? "has-image-options" : "";
    html += `<ul class="options ${compactClass} ${imageOptionsClass}">`;

    question.options.forEach((option, index) => {
      const label = OPTION_LABELS[index] || index + 1;
      const correctClass = index === answerIndex ? "correct" : "";
      if (option && option.startsWith("img:")) {
        const imageUrl = option.substring(4);
        html += `<li class="${correctClass} option-image">(${label}) <img src="${imageUrl}" alt="Option ${label}" class="option-img" referrerpolicy="no-referrer" crossorigin="anonymous"></li>`;
      } else {
        html += `<li class="${correctClass}">(${label}) ${option}</li>`;
      }
    });

    html += "</ul>";
  }

  if (answerIndex !== -1) {
    const answerOption = question.options ? question.options[answerIndex] : null;
    let answerDisplay = "";
    if (answerOption) {
      answerDisplay = answerOption.startsWith("img:")
        ? `চিত্র ${answerLabel}`
        : answerOption;
    }
    html += `<div class="answer-text">উত্তর: (${answerLabel}) ${answerDisplay}</div>`;
  }

  if (question.explanation) {
    html += `<div class="explanation"><b>ব্যাখ্যা:</b> ${question.explanation}</div>`;
  }

  html += "</div>";
  return html;
}

function createCQHTML(question, displayNumber) {
  let html = '<div class="question-box cq-box">';

  if (question.stem) {
    html += '<div class="cq-stem">';
    if (question.stem.image && question.stem.image.src) {
      html += `<img src="${question.stem.image.src}" alt="${
        question.stem.image.alt || "Stem diagram"
      }" class="cq-stem-image" referrerpolicy="no-referrer" crossorigin="anonymous">`;
    }
    html += `<p><strong>${toBengaliNum(displayNumber)}.</strong> ${
      question.stem.text
    }</p>`;
    html += "</div>";
  } else {
    html += `<div class="cq-header"><strong>${toBengaliNum(
      displayNumber
    )}.</strong></div>`;
  }

  if (question.questions && question.questions.length > 0) {
    html += '<div class="cq-sub-questions">';
    question.questions.forEach((subQuestion) => {
      html += '<div class="cq-sub-question">';
      html += `<span class="cq-label">(${subQuestion.qid})</span> ${subQuestion.question}`;
      if (subQuestion.answer) {
        html += `<div class="answer-text cq-answer"><b>উত্তর:</b> ${subQuestion.answer}</div>`;
      }
      if (subQuestion.explanation) {
        html += `<div class="explanation"><b>ব্যাখ্যা:</b> ${subQuestion.explanation}</div>`;
      }
      html += "</div>";
    });
    html += "</div>";
  }

  html += "</div>";
  return html;
}

export function renderStats(state, statsElement) {
  const totalMarks = state.displayedQuestions.length;
  statsElement.innerHTML = `
    <strong>পরীক্ষার তথ্য:</strong> 
    মোট প্রশ্ন: ${state.displayedQuestions.length} | 
    পূর্ণমান: ${totalMarks} | 
    সময়: ${totalMarks} মিনিট
  `;
}
