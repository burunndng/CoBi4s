# CogniBias Project Status

## 📅 Last Updated: 2026-01-05

## 🚀 Recent Changes

- **Socratic Mirror (Real-time Neural Hub)**:
    - **Streaming Core**: Migrated to a raw UTF-8 `ReadableStream` architecture for zero-latency token ingestion.
    - **"The Razor" Persona**: Overhauled the system prompt to be surgical, analytical, and direct.
    - **Pattern Harvester HUD**: Added a real-time diagnostic side-panel that "hooks" mentioned biases/fallacies during chat.
    - **Secret Mode (The Void)**: Implemented a hidden "Easter Egg" mode accessible via a subtle Octagon trigger.
    - **Mobile Optimization**: Converted HUD to a responsive slide-out drawer with notification badges.
- **Shadow Boxing (Adversarial Logic Arena)**:
    - **Combat Core**: Implemented a "Debate Arena" where users face a hostile AI ("The Sophist") that intentionally uses logical fallacies.
    - **Integrity Mechanics**: Users have an "Integrity Meter" (100 HP). Correct fallacy callouts heal/protect integrity; missing them or misidentifying causes damage.
    - **Real-time Evaluation**: AI logic professor judges user callouts in real-time, providing immediate feedback on logical strikes.
    - **Combat HUD**: Created a high-contrast debate interface with health bars, adversarial logs, and a "Fallacy Arsenal" command palette.
- **Android PWA & Mobile Polish**:
    - **Service Worker 2.0**: Implemented a robust `sw.js` with stale-while-revalidate caching and versioning to enable offline use.
    - **Native Feel**: Disabled Android's "pull-to-refresh" gesture to maintain immersion; implemented `active:scale-95` haptic-visuals for all buttons.
    - **Adaptive Iconry**: Enhanced `manifest.json` with a high-res maskable icon and theme-color synchronization for a "native app" look on Android.
    - **Touch Precision**: Added `touch-action: none` to critical inputs like the Calibration Slider to prevent gesture collisions.
- **System Stability & Build Quality**:
    - **Import Sanitization**: Resolved critical `ReferenceError` crashes (`Target`, `Shuffle`, `BrainCircuit`) by auditing and fixing missing icon imports across all components.
    - **App.tsx Refactor**: Repaired codebase corruption and duplicate imports introduced during rapid feature iterations.
    - **Bundler Optimization**: Removed redundant `importmap` from `index.html` to give Vite exclusive control over dependency resolution, ensuring production stability.
    - **Storage Management**: Implemented `lib/storageManager.ts` to calculate real-time `localStorage` usage and automatically prune old history to prevent `QuotaExceededError`.
- **Cognitive Brutalism Aesthetic**:
    - **Blueprint Style**: Injected a global geometric grid and SVG fractal noise texture for a tactile, industrial feel.
    - **Glassmorphism**: Overhauled all surfaces to use `backdrop-blur-xl` and translucent borders.
    - **Editorial Typography**: Implemented a high-contrast typographic system using Cormorant Garamond (Serif) and JetBrains Mono.
- **Contextual Flashcards (Scenario Mode)**:
    - **Dual-Mode Drill**: Added a toggle between "Term Mode" (Name ↔ Def) and "Scenario Mode" (Context ↔ Name).
    - **AI Refresh**: Integrated real-time AI scenario generation to provide fresh practice examples for every card.
- **AI Simulator (Simulation Sandbox)**:
    - **Branching Logic**: Revamped the legacy quiz-style simulator into a "Choose Your Own Adventure" engine with narrative consequences.
- **Decision Audit (Red Team Report)**:
    - **Risk Matrix**: Users now rate the severity (1-10) of detected biases before finalizing audits.
    - **Visual Triage**: Color-coded risk indicators based on severity.
- **Bias Detector (Command Palette)**:
    - **HUD Interaction**: Replaced standard dropdowns with a categorized "Heads-Up Display" for faster, mental-model-based tagging.
- **Algorithm Trainer (`AlgorithmTrainer`)**:
    - **Adversarial Testing**: The AI runs 3 unit tests (Happy Path, Edge Case, Counter-Example) against the user's logic.
    - **Integrated IDE**: Includes a code editor, terminal output, and test history.
- **Context Switcher (`ContextLab`)**:
    - **Range-Vibe Hybrid**: Calibration tool using a gradient slider to reveal AI-determined utility target zones.

### Logic Domain Expansion (Dual-Core Architecture)
- **Codex (Poly-Registry)**: Polymorphic support for both **Biases** and **Fallacies** with mode-specific theming.
- **Logic Lab (`LogicLab`)**: Advanced "Argument Repair" module with fuzzy identification and repair strategy chips.

### Deployment & CI/CD
- **GitHub Pages**: Configured the project for hosting on GitHub Pages with `base: '/CoBi4s/'`.
- **GitHub Actions**: Automated deployment workflow.

### Agent Customization
- **Subagent Roster**: Formalized a library of 6 specialized agents in `.gemini/` (Cognitive Architect, Theme Architect, Module Builder, Schema Guardian, Prompt Engineer, UI Polisher).

## 📋 Current State
- **Status**: Production-ready, High-Fidelity.
- **Deployment URL**: [https://burunndng.github.io/CoBi4s/](https://burunndng.github.io/CoBi4s/)
- **Primary Model**: Grok 4.1 Fast (via OpenRouter).
- **Storage**: LocalStorage-centric (No DB/Auth).

## 🛠 Next Steps
- [ ] Implement Session-Ghosting (Compression for chat history).
- [ ] Visual AST (Abstract Syntax Tree) visualization for the Algorithm Trainer.
- [ ] Mobile-specific touch optimization for the HUD and Sliders.