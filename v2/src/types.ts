// ── Data Types for Exam JSON ─────────────────────────────────────────────

export interface Metadata {
  chapter: string;
  class: string;
  subject: string;
  totalMarks: number;
  duration: string;
}

export interface MCQuestion {
  id: number;
  type?: undefined; // MCQs don't have type field (or it's absent)
  topic?: string;
  question: string;
  compact: boolean;
  options: string[]; // Can include "img:..." prefixed strings for image options
  answer: number; // 0-based index of correct option
  explanation?: string;
  image?: string; // URL for question diagram
  group_id?: string; // Shared ID to keep linked questions together when shuffled
  _originalIndex?: number; // Internal: tracks original position for shuffle logic
}

export interface CQSubQuestion {
  qid: string; // Bengali label: "গ", "ঘ", etc.
  question: string;
  answer: string;
  explanation?: string;
}

export interface CQQuestion {
  id: number;
  type: "cq";
  compact: boolean;
  stem: {
    text: string;
    image?: { src: string; alt: string } | null;
  };
  questions: CQSubQuestion[];
  group_id?: string;
  _originalIndex?: number;
}

export type Question = MCQuestion | CQQuestion;

export interface ExamData {
  metadata: Metadata;
  questions: Question[];
}

// ── Type Guards ──────────────────────────────────────────────────────────

export function isCQ(q: Question): q is CQQuestion {
  return q.type === "cq";
}

export function isMCQ(q: Question): q is MCQuestion {
  return q.type !== "cq";
}

// ── View Modes ───────────────────────────────────────────────────────────

export type ViewMode = "questions" | "solutions";
