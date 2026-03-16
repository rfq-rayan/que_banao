import type { MCQuestion } from "../types";
import { toBengaliNum, OPTION_LABELS } from "../utils";
import { useExamState } from "../hooks/useExamStore";

/**
 * McqCard – Renders a single MCQ question with options, answer, and explanation.
 * Handles compact/grid layout, image options, floating question images.
 */
export function McqCard({
  question,
  displayNumber,
}: {
  question: MCQuestion;
  displayNumber: number;
}) {
  const { currentView } = useExamState();
  const isSolution = currentView === "solutions";

  const answerIndex =
    question.answer !== undefined && question.answer !== null
      ? question.answer
      : -1;
  const answerLabel =
    answerIndex !== -1 ? OPTION_LABELS[answerIndex] : "?";

  const hasImageOptions = question.options?.some(
    (opt) => opt && opt.startsWith("img:")
  );

  // Build option list class
  const optionsClass = [
    "options-grid",
    question.compact ? "compact" : "",
    hasImageOptions ? "has-image-options" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={`question-box ${question.image ? "with-image" : ""}`}>
      {/* Floating question image */}
      {question.image && (
        <img
          src={question.image}
          alt={`Question ${displayNumber} diagram`}
          className="question-image"
          referrerPolicy="no-referrer"
          crossOrigin="anonymous"
        />
      )}

      {/* Question text */}
      <div className="font-normal mb-1">
        {toBengaliNum(displayNumber)}. {question.question}
      </div>

      {/* Options */}
      {question.options && question.options.length > 0 && (
        <ul className={optionsClass}>
          {question.options.map((opt, idx) => {
            const label = OPTION_LABELS[idx] || String(idx + 1);
            const isCorrect = idx === answerIndex;

            if (opt && opt.startsWith("img:")) {
              const imgUrl = opt.substring(4);
              return (
                <li
                  key={idx}
                  className={`flex items-center gap-1.5 ${
                    isCorrect && isSolution ? "font-bold" : ""
                  }`}
                >
                  ({label}){" "}
                  <img
                    src={imgUrl}
                    alt={`Option ${label}`}
                    className="option-img"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                  />
                </li>
              );
            }

            return (
              <li
                key={idx}
                className={isCorrect && isSolution ? "font-bold" : ""}
              >
                ({label}) {opt}
              </li>
            );
          })}
        </ul>
      )}

      {/* Answer (hidden in questions mode) */}
      {answerIndex !== -1 && (
        <div className={`font-bold mt-1 ${isSolution ? "" : "hidden"}`}>
          উত্তর: ({answerLabel}){" "}
          {question.options?.[answerIndex]?.startsWith("img:")
            ? `চিত্র ${answerLabel}`
            : question.options?.[answerIndex] ?? ""}
        </div>
      )}

      {/* Explanation (hidden in questions mode) */}
      {question.explanation && (
        <div className={`explanation ${isSolution ? "" : "hidden"}`}>
          <b>ব্যাখ্যা:</b> {question.explanation}
        </div>
      )}
    </div>
  );
}
