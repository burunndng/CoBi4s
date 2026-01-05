# CogniBias Project Context

## 🚀 Project Overview
**CogniBias** is a personal development platform designed to help users identify, understand, and mitigate cognitive biases. It uses a "Architect Edition" theme with a dark, professional UI.

### Core Features
- **AI Simulator (`AIInstructor`)**: Interactive roleplay to diagnose and train specific biases.
- **Spaced Repetition (`Flashcards`)**: Flashcard system with mastery tracking (`SM-2` style algorithm).
- **Assessment (`Quiz`)**: dynamic MCQ generation powered by AI.
- **Registry (`Catalog`)**: Comprehensive database of cognitive biases.
- **Analytics (`Dashboard`)**: Tracking of streaks, XP, and mastery levels.

---

## 🛠 Tech Stack
- **Framework**: React 19 + TypeScript + Vite 6
- **Styling**: Tailwind CSS (Dark mode optimized, Zinc/Slate palette)
- **Routing**: `react-router-dom` (HashRouter)
- **Icons**: `lucide-react`
- **AI**: 
  - Primary: OpenRouter (`apiService.ts` - `x-ai/grok-4.1-fast`)
- **Persistence**: `localStorage` (Key: `cognibias-storage`)

---

## 📂 Architecture & Key Files

### Directory Structure
```
/
├── components/          # UI Logic & Views
│   ├── AIInstructor.tsx # Core AI Simulator (Pre-test -> Teach -> Post-test)
│   ├── Dashboard.tsx    # Main user landing page
│   ├── Flashcards.tsx   # Spaced repetition logic
│   ├── Quiz.tsx         # Assessment module
│   └── ...
├── services/            # External Integrations
│   └── apiService.ts    # OpenRouter/Grok integration (Primary AI Service)
├── types.ts             # TypeScript Interfaces (AppState, Bias, ProgressState)
├── constants.ts         # Static Data (BIASES list, INITIAL_STATE)
├── App.tsx              # Main State Container & Router
└── vite.config.ts       # Vite configuration
```

### Data Flow
1. **State Source**: `App.tsx` holds the single source of truth (`AppState`).
2. **Persistence**: `useEffect` in `App.tsx` syncs state to `localStorage`.
3. **Prop Drilling**: State and updater functions (`updateProgress`, `toggleFavorite`) are passed down to feature components.
4. **AI Services**: Components like `AIInstructor` and `Quiz` call `services/apiService.ts` directly for dynamic content.

---

## 🤖 AI Integration

### OpenRouter Service (`services/apiService.ts`)
- **Model**: `x-ai/grok-4.1-fast` (High reasoning, fast performance).
- **Functions**:
  - `generateSimulatorStep`: Creates scenario/question for Pre/Post tests.
  - `generateQuizQuestion`: Creates MCQs with plausible distractors.
  - `generateHint`: Provides cryptic hints for flashcards.
- **Config**: Temperature set to `0.6` for optimal balance of creativity and structure.


---

## 🧩 Component Deep Dives

### `AIInstructor.tsx` (Simulator)
- **Phases**: `idle` -> `pre-test` -> `teaching` -> `post-test` -> `complete`.
- **Logic**:
  1. Selects bias with lowest mastery.
  2. Generates a "Pre-test" scenario.
  3. If failed, enters "Teaching" phase (Definition + Strategy).
  4. "Post-test" verifies application of knowledge.
  5. Updates mastery score (`updateProgress`).

### `Flashcards.tsx`
- **Queue**: Prioritizes overdue items based on `nextReviewDate`.
- **Algorithm**: Modified SM-2 (SuperMemo) implemented in `App.tsx`'s `updateProgress`.
- **Interactions**: Flip animation, AI Hint generation.

---

## 📏 Development Guidelines

### Styling
- **Theme**: Dark mode only (`bg-[#09090b]`, `text-slate-200`).
- **Components**: Use `surface` class (custom utility likely defined in index.css) for cards/containers.
- **Typography**: Serif for headings (`font-serif italic`), Sans for UI text.

### Type Safety
- **Strict Mode**: Yes.
- **Conventions**: Interfaces defined in `types.ts`. Avoid `any`.
- **Enums**: Use `Category` and `Difficulty` enums for Bias properties.

### State Updates
- Always use functional state updates: `setState(prev => ({ ...prev, ...updates }))`.
- Ensure `localStorage` logic handles quota errors gracefully (though currently simple `setItem`).
