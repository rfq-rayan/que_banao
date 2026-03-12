import { VIEW, VIEW_MODE_KEY } from "./constants.js";

export function createInitialState() {
  return {
    allQuestions: [],
    displayedQuestions: [],
    currentView: loadSavedView(),
    metadata: {},
    setIndex: 0,
  };
}

function loadSavedView() {
  const savedView = localStorage.getItem(VIEW_MODE_KEY);
  if (savedView === VIEW.QUESTIONS || savedView === VIEW.SOLUTIONS) {
    return savedView;
  }
  return VIEW.QUESTIONS;
}

export function saveView(view) {
  localStorage.setItem(VIEW_MODE_KEY, view);
}
