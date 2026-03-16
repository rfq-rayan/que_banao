# Que Banao - Question Management System

Web application for making questions (MCQ & CQ).

## Architecture (v2)
- **Frontend**: React, TypeScript, Vite.
- **Math Rendering**: KaTeX (LaTeX support).
- **Styling**: Tailwind CSS + custom print styles for A4 paper (to print to  take exam).
- **State Management**: React Context + useReducer.

## Deployment
Configured for Netlify via `netlify.toml` in the root.
- **Build**: `npm run build`
- **Source**: `v2/` folder.
- **Output**: `v2/dist/`.

## Local Setup
```bash
cd v2
npm install
npm run dev
```

## Data Format
JSON-based question sets. The schema supports MCQ (with option shuffling) and CQ (creative questions with sub-parts). JSON files are stored in `v2/public/data/`.
