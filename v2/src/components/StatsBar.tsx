import { useExamState } from "../hooks/useExamStore";

/**
 * StatsBar – Displays exam statistics (total questions, marks, time).
 */
export function StatsBar() {
  const { displayedQuestions } = useExamState();

  if (displayedQuestions.length === 0) return null;

  const totalMarks = displayedQuestions.length;

  return (
    <div className="no-print bg-slate-100 px-5 py-2.5 rounded mx-5 mt-2 text-sm text-slate-700">
      <strong>পরীক্ষার তথ্য:</strong> মোট প্রশ্ন: {displayedQuestions.length} |
      পূর্ণমান: {totalMarks} | সময়: {totalMarks} মিনিট
    </div>
  );
}
