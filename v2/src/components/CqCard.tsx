import type { CQQuestion } from "../types";
import { toBengaliNum } from "../utils";
import { useExamState } from "../hooks/useExamStore";

/**
 * CqCard – Renders a Creative Question with stem text, optional stem image,
 * and sub-questions (গ, ঘ, etc.) with answers and explanations.
 */
export function CqCard({
  question,
  displayNumber,
}: {
  question: CQQuestion;
  displayNumber: number;
}) {
  const { currentView } = useExamState();
  const isSolution = currentView === "solutions";

  return (
    <div className="question-box break-inside-avoid bg-white">
      {/* Stem */}
      {question.stem ? (
        <div>
          {question.stem.image?.src && (
            <img
              src={question.stem.image.src}
              alt={question.stem.image.alt || "Stem diagram"}
              className="cq-stem-image"
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
            />
          )}
          <p className="m-0">
            <strong>{toBengaliNum(displayNumber)}.</strong>{" "}
            {question.stem.text}
          </p>
        </div>
      ) : (
        <div>
          <strong>{toBengaliNum(displayNumber)}.</strong>
        </div>
      )}

      {/* Sub-questions */}
      {question.questions && question.questions.length > 0 && (
        <div className="mt-1">
          {question.questions.map((sub, idx) => (
            <div key={idx} className="py-0.5">
              <span className="font-bold mr-1.5">({sub.qid})</span>
              {sub.question}

              {/* Answer */}
              {sub.answer && (
                <div
                  className={`ml-5 text-[13px] font-bold mt-0.5 ${
                    isSolution ? "" : "hidden"
                  }`}
                >
                  <b>উত্তর:</b> {sub.answer}
                </div>
              )}

              {/* Explanation */}
              {sub.explanation && (
                <div className={`explanation ml-5 ${isSolution ? "" : "hidden"}`}>
                  <b>ব্যাখ্যা:</b> {sub.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
