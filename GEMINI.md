# CogniBias Project Context

## 🚀 Project Overview
**CogniBias** is a "Dual-Core" personal development platform designed to help users identify, understand, and mitigate cognitive biases and logical fallacies. It utilizes a **"Cognitive Brutalism"** aesthetic—a high-fidelity, editorial dark-mode theme designed for the "Cognitive Architect."

### Core Engines (The Toolkit)
- **The Library (Registry)**: Polymorphic database supporting both **Biases** (Psychology) and **Fallacies** (Logic).
- **The Drill (Flashcards 2.0)**: Contextual spaced repetition featuring **Scenario Mode** for pattern recognition.
- **The Sandbox (Simulator)**: Branching "Choose Your Own Adventure" scenarios with real-time consequences.
- **The Lens (Detector)**: Interactive pattern-recognition tool for spotting flaws in realistic text and dialogues.
- **The Workshop (Logic Lab)**: Advanced "Argument Repair" module with steel-manning, repair chips, and granular AI metrics.
- **The Prism (Switcher)**: Nuance calibration tool using a **Range-Vibe Hybrid** slider to distinguish biases from heuristics.
- **The Coach (Mirror)**: Persistent Socratic chatbot for real-time cognitive debugging and thought auditing.
- **The Compiler (Trainer)**: Pseudo-code IDE for "programming" concepts to test structural understanding.
- **The Auditor (Architect)**: Structured "pre-mortem" tool for auditing high-stakes real-life decisions.

---

## 🛠 Tech Stack
- **Framework**: React 19 + TypeScript 5.6 + Vite 6
- **Styling**: Tailwind CSS + "Cognitive Brutalism" (Blueprint grid, Noise texture, Glassmorphism).
- **Routing**: `react-router-dom` (HashRouter)
- **Icons**: `lucide-react`
- **AI**: 
  - Primary: OpenRouter (`apiService.ts` - `x-ai/grok-4.1-fast`)
- **Persistence**: `localStorage` (Key: `cognibias-storage`) - Strict "No DB, No Auth" architecture.

---

## 📂 Architecture & Key Files

### Directory Structure
```
/
├── components/          # UI Logic & Views
│   ├── SocraticChat/    # Mirror (Rationality Coach)
│   ├── LogicLab/        # Workshop (Argument Repair)
│   ├── ContextLab/      # Switcher (Calibration Slider)
│   ├── AlgorithmTrainer/# Compiler (Pseudo-code IDE)
│   ├── shared/          # Unified Interaction Components (TextCanvas, TransferTips)
│   └── ...
├── services/            # AI Integration (OpenRouter/Grok)
├── types.ts             # Strict Schema (AppState, SimulationScenario, BiasedSnippet)
├── constants.ts         # Logic Core (BIASES, FALLACIES, INITIAL_STATE)
└── App.tsx              # Main State Container, Routing & Migration
```

### Data Flow
1. **State Source**: `App.tsx` holds the single source of truth (`AppState`).
2. **Persistence**: `useEffect` in `App.tsx` syncs state to `localStorage`.
3. **Architecture**: **Dual-Core**. Global `mode` state switches the entire app's registry, icons, and accents (Indigo for Psych, Rose for Logic).
4. **Interactive Primitives**: Shared components like `TextCanvas` (highlighting) and `TransferTips` (cues) ensure cross-module consistency.

---

## 🤖 AI Integration

### OpenRouter Service (`services/apiService.ts`)
- **Model**: `x-ai/grok-4.1-fast` (High reasoning, low latency).
- **Key Functions**:
  - `sendChatMessage`: Socratic coaching with user-context injection (weak biases).
  - `generateBranchingScenario`: Creates decision trees with narrative consequences.
  - `evaluateRepair`: Grades argument repairs using granular logic/intent/clarity metrics.
  - `generateContextScenario`: Creates multi-context utility ranges (0-100).
  - `runAlgorithmTest`: Runs adversarial unit tests against user pseudo-code.
  - `generateAIPoweredScenario`: Generates fresh scenarios for contextual flashcards.

---

## 🧩 Component Deep Dives

### `LogicLab.tsx` (The Workshop)
- **Workflow**: Fuzzy Identify (word-overlap) -> Repair (Strategy Chips) -> Result (Score Breakdown).
- **Pedagogy**: Active reconstruction of arguments rather than passive selection.

### `AIInstructor.tsx` (The Sandbox)
- **Concept**: Consequences > Definitions.
- **Workflow**: Enter Situation -> Choose Action -> See Consequence -> Analyze Bias.

### `ContextLab.tsx` (The Prism)
- **Concept**: Calibration of heuristics.
- **Workflow**: Action -> 3 Contexts (Survival, Social, Neutral) -> Slider Calibration -> Target Reveal.

### `Flashcards.tsx` (The Drill)
- **Hybrid Modes**: **Term Mode** (Memory) vs **Scenario Mode** (Recognition).
- **AI Refresh**: Fetch unique AI-generated examples for any card to prevent "memorizing the answer."

---

## 📏 Engineering Standards & Protocols

**"The Plan" (Prompt Engineering Discipline)**
Follows the frameworks defined in `.gemini/The Plan Prompt Engineering.txt`.

**Subagents & Personas**
- **The Cognitive Architect** (`.gemini/The Cognitive Architect.md`): 
  - **Prime Directive**: "The Transfer Test" (Does this help the user spot patterns in real life?).
  - **Philosophy**: Active over Passive. Concrete over Abstract. Friction as a Learning Tool.

### Styling System
- **Theme**: "Cognitive Brutalism" (Dark mode).
- **Components**: `surface` (Glassmorphism), `serif` (Editorial Type), `mono` (Industrial Instrument).
- **Texture**: SVG Fractal Noise + Blueprint Grid background.

---

## 📜 Project Evolution
- **STATUS.md**: Detailed log of all modifications and upcoming roadmap.