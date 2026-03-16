import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useExamDispatch } from "../hooks/useExamStore";
import { parseExamData } from "../utils";
import { Upload, FileJson, Info, ClipboardPaste } from "lucide-react";
import { Toast } from "./Toast";

/**
 * ControlPanel – JSON upload zone, question count, shuffle toggle,
 *                and buttons to open the instruction/paste modals.
 */
export function ControlPanel({
  onOpenInstructions,
  onOpenPaste,
}: {
  onOpenInstructions: () => void;
  onOpenPaste: () => void;
}) {
  const dispatch = useExamDispatch();
  const [toast, setToast] = useState<string | null>(null);

  const processFile = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = parseExamData(e.target?.result as string);
          dispatch({ type: "LOAD_DATA", payload: data });
          setToast(`✅ ${file.name} সফলভাবে লোড হয়েছে (${data.questions.length}টি প্রশ্ন)`);
        } catch (err) {
          alert("JSON পার্স করতে সমস্যা হয়েছে: " + (err as Error).message);
        }
      };
      reader.readAsText(file, "UTF-8");
    },
    [dispatch]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/json": [".json"] },
    multiple: false,
    onDrop: (files) => {
      if (files[0]) processFile(files[0]);
    },
  });

  return (
    <>
      <div className="no-print bg-white p-5 mx-5 mt-5 rounded-lg shadow-sm border border-slate-200 flex flex-wrap gap-5 items-end">
        {/* Upload Zone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">
            JSON আপলোড:
          </label>
          <div className="flex items-center gap-2 flex-wrap">
            <div
              {...getRootProps()}
              className={`px-4 py-2 rounded-md text-sm font-medium text-white transition-all cursor-pointer flex items-center gap-1.5 ${
                isDragActive
                  ? "bg-violet-700 ring-2 ring-violet-400 ring-offset-2"
                  : "bg-violet-600 hover:bg-violet-700 hover:shadow-md"
              }`}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <>
                  <FileJson size={16} />
                  ড্রপ করুন...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  📂 JSON আপলোড
                </>
              )}
            </div>

            <button
              onClick={onOpenInstructions}
              className="px-4 py-2 rounded-md text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Info size={16} />
              JSON স্ট্রাকচার
            </button>

            <button
              onClick={onOpenPaste}
              className="px-4 py-2 rounded-md text-sm font-medium bg-amber-500 hover:bg-amber-600 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ClipboardPaste size={16} />
              Text পেস্ট
            </button>
          </div>
        </div>

        {/* Question Count */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="questionCount"
            className="text-sm font-semibold text-slate-700"
          >
            প্রশ্ন সংখ্যা:
          </label>
          <input
            type="number"
            id="questionCount"
            defaultValue={84}
            min={1}
            max={200}
            onChange={(e) =>
              dispatch({
                type: "SET_QUESTION_COUNT",
                payload: parseInt(e.target.value) || 1,
              })
            }
            className="w-20 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Shuffle Options Toggle */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="shuffleOptions"
            className="text-sm font-semibold text-slate-700 cursor-pointer"
          >
            অপশন শাফল:
          </label>
          <input
            type="checkbox"
            id="shuffleOptions"
            defaultChecked
            onChange={() => dispatch({ type: "TOGGLE_SHUFFLE_OPTIONS" })}
            className="w-6 h-6 cursor-pointer accent-blue-600"
          />
        </div>
      </div>

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}
