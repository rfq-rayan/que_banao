# Que Banao v2 — Modern Rebuild Walkthrough

## What Was Built

Rebuilt the monolithic [index.html](file:///c:/Users/RfqDesk/Desktop/experiments/que_banao/index.html) (1458 lines, all-in-one CSS + HTML + JS) into a **modular React + TypeScript application** in the `v2/` subfolder.

## Architecture

```
v2/src/
├── types.ts              # TypeScript interfaces (MCQ, CQ, Metadata)
├── utils.ts              # Bengali numerals, Mulberry32 RNG, shuffle, JSON parser
├── hooks/
│   └── useExamStore.tsx  # State management (context + useReducer)
├── components/
│   ├── Navbar.tsx        # Top nav with view toggle + action buttons
│   ├── ControlPanel.tsx  # File upload (react-dropzone), settings
│   ├── McqCard.tsx       # MCQ question renderer
│   ├── CqCard.tsx        # Creative Question renderer
│   ├── ExamHeader.tsx    # Exam title, subject, set label
│   ├── AnswerKeyTable.tsx # Answer grid (20 per row)
│   ├── MathRenderer.tsx  # KaTeX auto-render wrapper
│   ├── StatsBar.tsx      # Question/marks/time stats
│   ├── Toast.tsx         # Notification component
│   ├── JsonStructureModal.tsx # JSON schema docs
│   └── PasteModal.tsx    # Raw JSON paste input
├── App.tsx               # Root assembly
├── main.tsx              # Entry point
└── index.css             # Design tokens + print styles
```

## Key Improvements Over Original

| Area | Before | After |
|---|---|---|
| **Structure** | 1 file, 1458 lines | 15+ focused files |
| **Type Safety** | None (plain JS) | Full TypeScript with interfaces |
| **State** | Global variables + manual DOM | React context + useReducer |
| **Upload** | Basic file input | react-dropzone with drag-and-drop |
| **Styling** | 700 lines custom CSS | Tailwind CSS utilities + minimal custom |
| **Math** | Script tag defer loading | React component with useEffect |
| **Icons** | Emoji only | Lucide React icon library |

## Screenshots

### Empty State (Welcome)
![Initial load with welcome message](initial_page_load_1773679892535.png)

### Questions View (Loaded Data)
![Questions rendered with KaTeX math in 2-column layout](questions_view_1773680053629.png)

### Solutions View
![Solutions with answers and explanations visible](solutions_view_1773680064488.png)

## Verification Results

| Test | Result |
|---|---|
| TypeScript compilation (`tsc --noEmit`) | ✅ Zero errors |
| Dev server startup | ✅ Starts on port 5174 |
| Browser console errors | ✅ None |
| JSON paste + load | ✅ Questions render correctly |
| KaTeX math rendering | ✅ Fractions, superscripts, symbols all render |
| View toggle (questions ↔ solutions) | ✅ Answers/explanations show/hide |
| Exam header (title, set label, metadata) | ✅ Renders correctly |
| Stats bar | ✅ Shows correct counts |

## How to Run

```bash
cd v2
npm install
npm run dev
# Opens at http://localhost:5173 (or next available port)
```

## Demo Recording

![Browser test recording](json_load_test_1773679940231.webp)
