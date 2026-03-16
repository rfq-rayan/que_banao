import { useExamState } from "../hooks/useExamStore";
import { toBengaliNum } from "../utils";

/**
 * ExamHeader – Renders the exam title, subject/class info, chapter,
 *              set label, marks, and time. Adapts for questions vs solutions view.
 */
export function ExamHeader() {
  const { metadata, currentView, setIndex, displayedQuestions } =
    useExamState();

  if (displayedQuestions.length === 0) return null;

  const title =
    currentView === "solutions"
      ? "সমাধান পত্র (Solution Sheet)"
      : "মডেল টেস্ট পরীক্ষা";

  const setLabel = String.fromCharCode(65 + (setIndex % 26));
  const totalMarks = displayedQuestions.length;

  return (
    <>
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-2.5 mb-5">
        <h1 className="text-2xl font-bold m-0 relative">
          {title}
          <span className="text-sm absolute right-0 top-1/2 -translate-y-1/2 border border-black px-2 py-0.5 rounded">
            সেট: {setLabel}
          </span>
        </h1>
        <p className="mt-1 text-base">
          শ্রেণি: {metadata.class || "N/A"} | বিষয়:{" "}
          {metadata.subject || "N/A"}
        </p>
        <p className="text-base">অধ্যায়: {metadata.chapter || "N/A"}</p>
      </div>

      {/* Meta Info */}
      {currentView === "questions" && (
        <div className="flex justify-between font-bold mb-4 border-b border-slate-300 pb-1.5 px-0">
          <span>পূর্ণমান: {toBengaliNum(totalMarks)}</span>
          <span>সময়: {toBengaliNum(totalMarks)} মিনিট</span>
        </div>
      )}
    </>
  );
}
