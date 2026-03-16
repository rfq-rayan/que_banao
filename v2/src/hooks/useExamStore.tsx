import {
  createContext,
  useContext,
  useReducer,
  type ReactNode,
  type Dispatch,
} from "react";
import type { Question, Metadata, ViewMode, ExamData } from "../types";
import { shuffleWithGroups } from "../utils";

// ── State Shape ──────────────────────────────────────────────────────────

interface ExamState {
  allQuestions: Question[];
  displayedQuestions: Question[];
  metadata: Metadata;
  currentView: ViewMode;
  setIndex: number;
  questionCount: number;
  shuffleOptions: boolean;
}

const DEFAULT_METADATA: Metadata = {
  chapter: "",
  class: "",
  subject: "",
  totalMarks: 0,
  duration: "",
};

const initialState: ExamState = {
  allQuestions: [],
  displayedQuestions: [],
  metadata: DEFAULT_METADATA,
  currentView:
    (localStorage.getItem("examSystem_viewMode") as ViewMode) || "questions",
  setIndex: 0,
  questionCount: 84,
  shuffleOptions: true,
};

// ── Actions ──────────────────────────────────────────────────────────────

type ExamAction =
  | { type: "LOAD_DATA"; payload: ExamData }
  | { type: "SET_VIEW"; payload: ViewMode }
  | { type: "SET_QUESTION_COUNT"; payload: number }
  | { type: "RANDOMIZE" }
  | { type: "RESET" }
  | { type: "TOGGLE_SHUFFLE_OPTIONS" };

// ── Reducer ──────────────────────────────────────────────────────────────

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case "LOAD_DATA": {
      const { metadata, questions } = action.payload;
      return {
        ...state,
        allQuestions: questions,
        displayedQuestions: [...questions],
        metadata,
        questionCount: questions.length,
        setIndex: 0,
      };
    }

    case "SET_VIEW": {
      localStorage.setItem("examSystem_viewMode", action.payload);
      return { ...state, currentView: action.payload };
    }

    case "SET_QUESTION_COUNT": {
      const count = Math.min(action.payload, state.allQuestions.length);
      return {
        ...state,
        questionCount: count,
        displayedQuestions: state.allQuestions.slice(0, count),
      };
    }

    case "RANDOMIZE": {
      if (state.allQuestions.length === 0) return state;
      const newSetIndex = state.setIndex + 1;
      const shuffled = shuffleWithGroups(
        state.displayedQuestions,
        newSetIndex,
        state.shuffleOptions
      );
      return {
        ...state,
        setIndex: newSetIndex,
        displayedQuestions: shuffled,
      };
    }

    case "RESET": {
      return {
        ...state,
        setIndex: 0,
        displayedQuestions: [...state.allQuestions],
        questionCount: state.allQuestions.length,
      };
    }

    case "TOGGLE_SHUFFLE_OPTIONS": {
      return { ...state, shuffleOptions: !state.shuffleOptions };
    }

    default:
      return state;
  }
}

// ── Context ──────────────────────────────────────────────────────────────

const ExamStateContext = createContext<ExamState | null>(null);
const ExamDispatchContext = createContext<Dispatch<ExamAction> | null>(null);

export function ExamProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(examReducer, initialState);
  return (
    <ExamStateContext.Provider value={state}>
      <ExamDispatchContext.Provider value={dispatch}>
        {children}
      </ExamDispatchContext.Provider>
    </ExamStateContext.Provider>
  );
}

export function useExamState(): ExamState {
  const ctx = useContext(ExamStateContext);
  if (!ctx) throw new Error("useExamState must be used within ExamProvider");
  return ctx;
}

export function useExamDispatch(): Dispatch<ExamAction> {
  const ctx = useContext(ExamDispatchContext);
  if (!ctx)
    throw new Error("useExamDispatch must be used within ExamProvider");
  return ctx;
}
