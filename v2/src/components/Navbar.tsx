import { useExamState, useExamDispatch } from "../hooks/useExamStore";
import { Shuffle, RotateCcw, Printer, BookOpen, FileCheck } from "lucide-react";

/**
 * Navbar – Top navigation bar with view toggle and action buttons.
 * Uses a dark background (slate-800) with white text.
 */
export function Navbar() {
  const { currentView } = useExamState();
  const dispatch = useExamDispatch();

  return (
    <nav className="no-print bg-slate-800 text-white px-6 py-4 flex justify-between items-center flex-wrap gap-4 shadow-md">
      <h1 className="text-xl font-bold flex items-center gap-2">
        📚 Exam System
      </h1>

      <div className="flex gap-2 flex-wrap">
        {/* View Toggle Buttons */}
        <button
          onClick={() => dispatch({ type: "SET_VIEW", payload: "questions" })}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            currentView === "questions"
              ? "bg-blue-700 text-white shadow-inner"
              : "bg-slate-700 text-slate-200 hover:bg-slate-600"
          }`}
        >
          <BookOpen size={16} />
          প্রশ্নপত্র
        </button>

        <button
          onClick={() => dispatch({ type: "SET_VIEW", payload: "solutions" })}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
            currentView === "solutions"
              ? "bg-blue-700 text-white shadow-inner"
              : "bg-slate-700 text-slate-200 hover:bg-slate-600"
          }`}
        >
          <FileCheck size={16} />
          সমাধান পত্র
        </button>

        {/* Action Buttons */}
        <button
          onClick={() => dispatch({ type: "RANDOMIZE" })}
          className="px-4 py-2 rounded-md text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Shuffle size={16} />
          র‍্যান্ডমাইজ
        </button>

        <button
          onClick={() => window.print()}
          className="px-4 py-2 rounded-md text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <Printer size={16} />
          প্রিন্ট
        </button>

        <button
          onClick={() => dispatch({ type: "RESET" })}
          className="px-4 py-2 rounded-md text-sm font-medium bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw size={16} />
          রিসেট
        </button>
      </div>
    </nav>
  );
}
