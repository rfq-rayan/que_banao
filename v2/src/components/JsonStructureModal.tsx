import { X } from "lucide-react";

/**
 * JsonStructureModal – Shows the JSON schema documentation.
 * The AI prompt section has been removed per user request.
 */
export function JsonStructureModal({ onClose }: { onClose: () => void }) {
  return (
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
          JSON ফাইল স্ট্রাকচার নির্দেশিকা
        </h2>

        <p style={{ fontFamily: "var(--font-bengali)" }} className="mt-2">
          আপনার JSON ফাইলটি অবশ্যই নিচের কাঠামো অনুসরণ করে তৈরি করতে হবে:
        </p>

        <pre className="bg-slate-50 p-4 rounded-md overflow-x-auto whitespace-pre-wrap border border-slate-200 mt-4 text-[13px]">
{`{
  "metadata": {
    "chapter": "অধ্যায়ের নাম",
    "class": "শ্রেণী (যেমন: HSC)",
    "subject": "বিষয়ের নাম",
    "totalMarks": 100,
    "duration": "0 minutes"
  },
  "questions": [
    {
      "id": 1,
      "question": "MCQ প্রশ্ন টেক্সট",
      "compact": true,
      "options": [
        "অপশন ক",
        "অপশন খ",
        "img:https://example.com/image.png",
        "অপশন ঘ"
      ],
      "answer": 0,
      "explanation": "ব্যাখ্যা টেক্সট",
      "image": "https://example.com/question_image.png"
    },
    {
      "id": 2,
      "type": "cq",
      "stem": {
        "text": "উদ্দীপক টেক্সট",
        "image": {
          "src": "https://example.com/stem_image.png",
          "alt": "Image alt text"
        }
      },
      "questions": [
        {
          "qid": "গ",
          "question": "প্রশ্ন",
          "answer": "উত্তর",
          "explanation": "ব্যাখ্যা"
        }
      ]
    }
  ]
}`}
        </pre>
      </div>
    </div>
  );
}
