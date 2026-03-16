import { useExamState } from "../hooks/useExamStore";
import { toBengaliNum, OPTION_LABELS } from "../utils";
import { isMCQ } from "../types";

/**
 * AnswerKeyTable – Renders the answer key grid at the bottom of the page.
 * Shows 20 questions per row with Bengali question numbers and answer labels.
 * Only includes MCQ questions (filters out CQs).
 */
export function AnswerKeyTable() {
  const { displayedQuestions } = useExamState();

  // Filter only MCQ questions
  const mcqQuestions = displayedQuestions.filter(isMCQ);

  if (mcqQuestions.length === 0) return null;

  const questionsPerRow = 20;
  const totalRows = Math.ceil(mcqQuestions.length / questionsPerRow);

  // Build all rows as a flat array of <tr> elements
  const rows: React.ReactNode[] = [];

  for (let row = 0; row < totalRows; row++) {
    const startIdx = row * questionsPerRow;
    const endIdx = Math.min(startIdx + questionsPerRow, mcqQuestions.length);
    const emptyCells = startIdx + questionsPerRow - endIdx;

    // Question numbers row
    rows.push(
      <tr key={`num-${row}`}>
        {Array.from({ length: endIdx - startIdx }).map((_, i) => (
          <th key={i}>{toBengaliNum(startIdx + i + 1)}</th>
        ))}
        {Array.from({ length: emptyCells }).map((_, i) => (
          <th key={`empty-${i}`}></th>
        ))}
      </tr>
    );

    // Answers row
    rows.push(
      <tr key={`ans-${row}`}>
        {Array.from({ length: endIdx - startIdx }).map((_, i) => {
          const q = mcqQuestions[startIdx + i];
          const answerIndex =
            q.answer !== undefined && q.answer !== null ? q.answer : -1;
          const answerLabel =
            answerIndex !== -1 ? OPTION_LABELS[answerIndex] : "-";
          return (
            <td key={i} className="font-bold">
              {answerLabel}
            </td>
          );
        })}
        {Array.from({ length: emptyCells }).map((_, i) => (
          <td key={`empty-${i}`}></td>
        ))}
      </tr>
    );
  }

  return (
    <div className="mt-5 pt-2.5 border-t-2 border-black">
      <table className="answer-key-table" style={{ tableLayout: "fixed" }}>
        <tbody>{rows}</tbody>
      </table>
    </div>
  );
}
