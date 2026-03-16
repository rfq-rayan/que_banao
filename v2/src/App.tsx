import { useState } from "react";
import { ExamProvider, useExamState } from "./hooks/useExamStore";
import { isCQ } from "./types";

import { Navbar } from "./components/Navbar";
import { ControlPanel } from "./components/ControlPanel";
import { StatsBar } from "./components/StatsBar";
import { ExamHeader } from "./components/ExamHeader";
import { McqCard } from "./components/McqCard";
import { CqCard } from "./components/CqCard";
import { AnswerKeyTable } from "./components/AnswerKeyTable";
import { MathRenderer } from "./components/MathRenderer";
import { JsonStructureModal } from "./components/JsonStructureModal";
import { PasteModal } from "./components/PasteModal";

import type { MCQuestion, CQQuestion } from "./types";

function ExamApp() {
  const { displayedQuestions, currentView } = useExamState();
  const [showInstructions, setShowInstructions] = useState(false);
  const [showPaste, setShowPaste] = useState(false);

  const hasQuestions = displayedQuestions.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <ControlPanel
        onOpenInstructions={() => setShowInstructions(true)}
        onOpenPaste={() => setShowPaste(true)}
      />

      <StatsBar />

      {/* A4 Exam Page */}
      <div className="a4-page">
        {hasQuestions ? (
          <>
            <ExamHeader />
            <MathRenderer>
              <div
                className={`question-container ${
                  currentView === "solutions" ? "solution-mode" : ""
                }`}
              >
                {displayedQuestions.map((q, index) =>
                  isCQ(q) ? (
                    <CqCard
                      key={`${q.id}-${index}`}
                      question={q as CQQuestion}
                      displayNumber={index + 1}
                    />
                  ) : (
                    <McqCard
                      key={`${q.id}-${index}`}
                      question={q as MCQuestion}
                      displayNumber={index + 1}
                    />
                  )
                )}
              </div>
            </MathRenderer>
          </>
        ) : (
          <EmptyState />
        )}
      </div>

      {/* Answer Key (only in solutions view) */}
      {hasQuestions && currentView === "solutions" && (
        <div className="w-[210mm] mx-auto bg-white shadow-sm rounded-lg p-[15mm] mb-5">
          <AnswerKeyTable />
        </div>
      )}

      {/* Modals */}
      {showInstructions && (
        <JsonStructureModal onClose={() => setShowInstructions(false)} />
      )}
      {showPaste && <PasteModal onClose={() => setShowPaste(false)} />}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-slate-400">
      <div className="text-6xl mb-6">📚</div>
      <h2 className="text-xl font-semibold mb-3 text-slate-500">
        স্বাগতম! (Welcome!)
      </h2>
      <p className="text-base text-slate-400">
        শুরু করতে অনুগ্রহ করে উপর থেকে একটি JSON ফাইল (📂 JSON আপলোড) নির্বাচন
        করুন।
      </p>
    </div>
  );
}

export default function App() {
  return (
    <ExamProvider>
      <ExamApp />
    </ExamProvider>
  );
}
