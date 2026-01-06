# CogniBias Project Context

| **Agents** | 11 specialized agents in `.gemini/` |
| **Last Updated** | 2026-01-06 (PWA & Performance Sentinel added) |
| **Status** | Production-ready with mobile-touch + Neural Bridge |

---

## Project Summary

React 19 + TypeScript + Vite personal development platform.  Uses localStorage for all persistence, Grok/Gemini for AI features.  No active database or auth. 

```bash
npm run dev          # Frontend (port 3000)
npm run dev:api      # Backend (port 3001)
npm run type-check   # TypeScript validation
npm run build        # Production build
npm run test         # Run tests
```

**Environment** (create `.env` from `.env.example`):
- `VITE_OPENROUTER_API_KEY` - Required (Grok)
- `VITE_GEMINI_API_KEY` - Required (fallback)
- `VITE_LMNT_API_KEY` - Optional (TTS)

---

## Agent Delegation

**You are a Swarm Lead.** Delegate to specialists in `.gemini/`:

| Task | Delegate To |
|------|-------------|
| PWA/Performance/SW | `The PWA & Performance Sentinel` |
| Minimalist UI/SaaS Design | `The Design Principle Architect` |
| Design System Enforcer | `The Theme Architect` |
| New module/component | `The Module Builder` |
| TypeScript/State integrity | `The Schema Guardian` |
| OpenRouter/Prompt tuning | `The Prompt Engineer` |
| High-ROI rapid coding | `The Allmighty Hackoder AI` |
| Visualizations/D3 | `The Data Viz Expert` |
| UI/UX Polish | `The UI Polisher` |
| Chief Learning Architect | `The Cognitive Architect` |

---

## 📂 Architecture & Key Files

### Directory Structure
```
/
├── components/          # UI Logic & Views
│   ├── SocraticChat/    # Mirror (Streaming Neural Hub)
│   ├── LogicLab/        # Workshop (Argument Repair)
│   ├── ContextLab/      # Switcher (Calibration Slider)
│   ├── AlgorithmTrainer/# Compiler (Pseudo-code IDE)
│   ├── shared/          # Unified Interaction Components (TextCanvas, TransferTips)
│   └── ...
├── services/            # AI Integration (SSE Streaming / Grok)
├── lib/                 # System Utilities (Storage Management)
├── types.ts             # Strict Schema (AppState, SimulationScenario, BiasedSnippet)
├── constants.ts         # Logic Core (BIASES, FALLACIES, INITIAL_STATE)
└── App.tsx              # Main State Container, Routing & Migration
```

### Data Flow
1. **State Source**: `App.tsx` holds the single source of truth (`AppState`).
2. **Persistence**: `useEffect` in `App.tsx` syncs state to `localStorage` via **`lib/storageManager.ts`** pruning logic.
3. **Architecture**: **Dual-Core**. Global `mode` state switches the entire app's registry, icons, and accents (Indigo for Psych, Rose for Logic).
4. **Interactive Primitives**: Shared components like `TextCanvas` (highlighting) and `TransferTips` (cues) ensure cross-module consistency.

---

## 🤖 AI Integration

### OpenRouter Service (`services/apiService.ts`)
- **Model**: `x-ai/grok-4.1-fast` (High reasoning, low latency).
- **Key Functions**:
  - `streamChatMessage`: Real-time token ingestion with live pattern harvesting.
  - `generateBranchingScenario`: Creates decision trees with narrative consequences.
  - `evaluateRepair`: Grades argument repairs using granular logic/intent/clarity metrics.
  - `generateContextScenario`: Creates multi-context utility ranges (0-100).
  - `runAlgorithmTest`: Runs adversarial unit tests against user pseudo-code.
  - `generateAIPoweredScenario`: Generates fresh scenarios for contextual flashcards.

---

## 🧩 Component Deep Dives

### `SocraticChat.tsx` (The Mirror)
- **Architecture**: **Reactive Streaming Hub**. Uses a double-buffer SSE loop to materialize tokens instantly.
- **Pattern Harvester**: Live-scans stream content to hook and pin mentioned biases to a side-panel.

### `LogicLab.tsx` (The Workshop)
- **Workflow**: Fuzzy Identify (word-overlap) -> Repair (Strategy Chips) -> Result (Score Breakdown).
- **Pedagogy**: Active reconstruction of arguments rather than passive selection.

### `AIInstructor.tsx` (The Sandbox)
- **Concept**: Consequences > Definitions.
- **Workflow**: Enter Situation -> Choose Action -> See Consequence -> Analyze Bias.

### `DecisionArchitect.tsx` (The Auditor)
- **Concept**: Triage risk.
- **Workflow**: Context -> AI Audit -> User Severity Rating (1-10) -> Mitigation Reflection.

---

## 📏 Engineering Standards & Protocols

**"The Plan" (Prompt Engineering Discipline)**
Follows the frameworks defined in `.gemini/The Plan Prompt Engineering.txt`.

**Subagents & Personas**
- **The Cognitive Architect** (`.gemini/The Cognitive Architect.md`): Chief Learning Architect.
- **The Theme Architect** (`.gemini/The Theme Architect.md`): Design system and PWA enforcer.
- **The Allmighty Hackoder AI** (`.gemini/The Allmighty Hackoder AI.md`): Chaotic high-ROI implementation engine.
- **The Prompt Engineer**: OpenRouter/Grok tuning specialist.
- **The Schema Guardian**: TypeScript and State integrity protector.

### Styling System
- **Theme**: "Cognitive Brutalism" (Blueprint grid + SVG Noise + Glassmorphism).
- **Typography**: Editorial Serif (Cormorant) + Technical Mono (JetBrains).

---

## 📜 Project Evolution
- **STATUS.md**: Detailed log of all modifications and upcoming roadmap.
