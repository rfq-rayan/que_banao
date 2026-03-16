import type { Question, ExamData, Metadata } from "./types";

// ── Bengali Numerals ─────────────────────────────────────────────────────

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBengaliNum(num: number): string {
  return String(num)
    .split("")
    .map((d) => BENGALI_DIGITS[parseInt(d)] ?? d)
    .join("");
}

// ── Bengali Option Labels ────────────────────────────────────────────────

export const OPTION_LABELS = ["ক", "খ", "গ", "ঘ"] as const;

// ── Seeded PRNG (Mulberry32) ─────────────────────────────────────────────
// Deterministic random number generator so that "Set B" is always the same
// shuffle regardless of when it's generated.

export function mulberry32(seed: number): () => number {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Group-Aware Shuffle ──────────────────────────────────────────────────
// Shuffles questions while keeping grouped questions (sharing a group_id)
// together and in their original relative order.

export function shuffleWithGroups(
  questions: Question[],
  setIndex: number,
  shouldShuffleOptions: boolean
): Question[] {
  const rng = mulberry32(setIndex + 1000);

  const questionsByGroup: Record<string, Question[]> = {};
  const ungroupedQuestions: Question[] = [];

  questions.forEach((originalQ, idx) => {
    const originalIndex =
      originalQ._originalIndex !== undefined ? originalQ._originalIndex : idx;

    // Clone to avoid mutating master list
    const newQ = { ...originalQ, _originalIndex: originalIndex };

    // Shuffle MCQ options deterministically
    if (
      shouldShuffleOptions &&
      "options" in newQ &&
      newQ.options &&
      newQ.options.length > 0
    ) {
      const indices = newQ.options.map((_: string, i: number) => i);

      // Fisher-Yates with seeded RNG
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(rng() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      newQ.options = indices.map((i: number) => originalQ.options![i]);

      if (
        originalQ.answer !== undefined &&
        originalQ.answer !== null &&
        originalQ.answer !== -1
      ) {
        (newQ as Question & { answer: number }).answer = indices.indexOf(
          (originalQ as Question & { answer: number }).answer
        );
      }
    }

    if (newQ.group_id) {
      if (!questionsByGroup[newQ.group_id]) {
        questionsByGroup[newQ.group_id] = [];
      }
      questionsByGroup[newQ.group_id].push(newQ);
    } else {
      ungroupedQuestions.push(newQ);
    }
  });

  // Sort within groups to maintain logical order
  Object.values(questionsByGroup).forEach((group) => {
    group.sort((a, b) => {
      const idxA = a._originalIndex ?? 0;
      const idxB = b._originalIndex ?? 0;
      return idxA - idxB;
    });
  });

  // Combine into shuffleable items (individual questions + question groups)
  const itemsToShuffle: (Question | Question[])[] = [
    ...ungroupedQuestions,
    ...Object.values(questionsByGroup),
  ];

  // Fisher-Yates shuffle the items
  for (let i = itemsToShuffle.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [itemsToShuffle[i], itemsToShuffle[j]] = [
      itemsToShuffle[j],
      itemsToShuffle[i],
    ];
  }

  // Flatten back into a question list
  return itemsToShuffle.flat();
}

// ── JSON Parser with Validation ──────────────────────────────────────────

const DEFAULT_METADATA: Metadata = {
  chapter: "",
  class: "",
  subject: "",
  totalMarks: 0,
  duration: "",
};

export function parseExamData(jsonString: string): ExamData {
  const data = JSON.parse(jsonString);

  // Accept both {questions, metadata} and bare arrays
  if (Array.isArray(data)) {
    return {
      metadata: DEFAULT_METADATA,
      questions: data as Question[],
    };
  }

  if (data.questions) {
    return {
      metadata: { ...DEFAULT_METADATA, ...(data.metadata || {}) },
      questions: data.questions as Question[],
    };
  }

  throw new Error(
    "JSON ফাইলের গঠন সঠিক নয়। questions অ্যারে থাকতে হবে।"
  );
}

// ── cn utility (Tailwind class merging) ──────────────────────────────────

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
