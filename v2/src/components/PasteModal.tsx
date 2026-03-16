import { useState } from "react";
import { useExamDispatch } from "../hooks/useExamStore";
import { parseExamData } from "../utils";
import { X } from "lucide-react";
import { Toast } from "./Toast";

/**
 * PasteModal – Allows users to paste raw JSON directly and load it.
 */
export function PasteModal({ onClose }: { onClose: () => void }) {
  const dispatch = useExamDispatch();
  const [toast, setToast] = useState<string | null>(null);

  function handleSubmit() {
    const textarea = document.getElementById(
      "rawJsonInput"
    ) as HTMLTextAreaElement;
    const jsonText = textarea?.value.trim();

    if (!jsonText) {
      alert("অনুগ্রহ করে কিছু JSON কোড পেস্ট করুন।");
      return;
    }

    try {
      const data = parseExamData(jsonText);
      dispatch({ type: "LOAD_DATA", payload: data });
      setToast(
        `✅ পেস্ট করা ডাটা সফলভাবে লোড হয়েছে (${data.questions.length}টি প্রশ্ন)`
      );
      onClose();
    } catch (err) {
      alert("JSON পার্স করতে সমস্যা হয়েছে: " + (err as Error).message);
    }
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="float-right text-slate-400 hover:text-black text-2xl font-bold cursor-pointer bg-transparent border-none"
          >
            <X size={24} />
          </button>

          <h2
            className="border-b-2 border-slate-800 pb-2.5 text-slate-800"
            style={{ fontFamily: "var(--font-bengali)" }}
          >
            📋 Raw JSON পেস্ট করুন
          </h2>

          <p style={{ fontFamily: "var(--font-bengali)" }} className="mt-2">
            আপনার JSON কোড নিচে পেস্ট করুন এবং 'লোড করুন' বাটনে ক্লিক করুন:
          </p>

          <textarea
            id="rawJsonInput"
            className="w-full h-72 p-4 font-mono text-[13px] rounded-md border border-slate-300 bg-white resize-y mt-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder={`{
  "metadata": {...},
  "questions": [...]
}`}
          />

          <button
            onClick={handleSubmit}
            className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-base font-medium cursor-pointer border-none transition-colors"
          >
            লোড করুন (Load Data)
          </button>
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}
