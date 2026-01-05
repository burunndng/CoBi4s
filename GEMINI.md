# CogniBias Project Context

## For Coding AI:
Do ask questions when you require clarification or lack context. Do not overwhelm users with questions, but do ask in order to improve the quality of your output.

## 🚀 Project Overview
**CogniBias** is a personal development platform designed to help users identify, understand, and mitigate cognitive biases. It uses a "Architect Edition" theme with a dark, professional UI.

### Core Features
- **AI Simulator (`AIInstructor`)**: Interactive roleplay to diagnose and train specific biases.
- **Logic Lab (`LogicLab`)**: Advanced "Argument Repair" workshop for steel-manning and fixing fallacies.
- **Bias Detector (`BiasDetector`)**: Interactive pattern-recognition tool to identify biases in realistic text.
- **Decision Architect (`DecisionArchitect`)**: Structured "pre-mortem" tool for auditing real-life decisions.
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
  - `generateBiasScenario`: Writes realistic text with embedded biases.
  - `generateFallacyScenario`: Writes dialogues with embedded logical fallacies.
  - `auditDecision`: Analyzes user reasoning for blind spots.
  - `generateLabStatement`: Creates fallacious statements for repair practice.
  - `evaluateRepair`: Grades user's attempt to fix a logical error.
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

### `BiasDetector.tsx`
- **Pattern Recognition**: Generates realistic text via `apiService` with hidden biases.
- **Interactivity**: Users highlight text to "catch" the bias.
- **Validation**: Fuzzy-match selection against AI-provided quotes.

### `DecisionArchitect.tsx`
- **Application**: Audits real-life user decisions.
- **AI Feedback**: AI identifies top 3 risks and asks "Killer Questions".
- **Reflection**: Users must record answers to the AI's challenges before finalizing.

### `LogicLab.tsx`
- **Pedagogy**: "Evaluation & Creation" (Bloom's Taxonomy).
- **Phases**: Setup -> Identify -> Repair -> Result.
- **AI Role**: "Logic Professor" that grades arguments on a 0-100 scale and provides feedback.

---

## 📏 Development Guidelines

### Engineering Standards & Protocols
**"The Plan" (Prompt Engineering Discipline)**
We utilize the frameworks defined in `.gemini/The Plan Prompt Engineering.txt`.

**Core Mental Models:**
1.  **Prompts are Code**: Treat instructions as software specifications. Version control them.
2.  **Sandboxing**: Use delimiters (`<xml>`, `"""`) to separate data from instructions.
3.  **Vibe Coding**: Use "Scaffold → Fill → Refine" for rapid iteration.
4.  **Role/Context/Constraints**: Structure every major request as a JSON-like object.

**Key Patterns:**
- **The Architect**: For feature generation (Chain of Thought + Strict Constraints).
- **The Modernizer**: For refactoring (Before vs. After).
- **The Sherlock**: For root cause analysis (Context Injection + Hypothesis).

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

---

## 📜 Project Evolution
- **STATUS.md**: Refer to this file for a detailed log of all modifications, current status, and next steps.
