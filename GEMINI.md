# CogniBias Project Context

| **Status** | Production-ready with S-Rank Transfer Bridge + Sentinel Perf |

---

## Project Summary

React 19 + TypeScript + Vite personal development platform.  Uses localStorage for all persistence, Grok (primary) + Gemini (fallback) for AI features. No active database or auth. 

```bash
npm run dev          # Frontend (port 3000)
npm run build        # Production build (manual chunking active)
npm run preview      # Local preview of dist
```

**Environment** (create `.env` from `.env.example`):
- `VITE_OPENROUTER_API_KEY` - Required (Grok-4.1-fast)
- `VITE_GEMINI_API_KEY` - Required (Fallback)

---

## Agent Delegation

**You are a Swarm Lead.** Delegate to specialists in `.gemini/`:

| Task | Delegate To |
|------|-------------|
| Feature Ranking/Evaluation | `The Critique Agent` |
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
│   ├── ...
│   └── shared/          # TransferTips, TextCanvas
├── services/            # AI Integration (Grok / Caching Layer)
├── lib/                 # System Utilities (Storage Management / Pruning)
├── types.ts             # Strict Schema (AppState, TransferLog, ProgressState)
├── constants.ts         # Logic Core (BIASES, FALLACIES, INITIAL_STATE)
└── App.tsx              # Lazy-Loaded Container & Navigation
```

### Data Flow
1. **State Source**: `App.tsx` holds the single source of truth (`AppState`).
2. **Persistence**: `useEffect` in `App.tsx` syncs state to `localStorage` via **`lib/storageManager.ts`** pruning logic (4.5MB threshold).
3. **Architecture**: **Dual-Core**. Global `mode` state switches the entire app's registry, icons, and accents (Indigo for Psych, Rose for Logic).
4. **Interactive Primitives**: `will-change` hardware acceleration on all nav elements for low INP.

---

## 🤖 AI Integration

### OpenRouter Service (`services/apiService.ts`)
- **Model**: `x-ai/grok-4.1-fast` (High reasoning, low latency).
- **Caching**: Session-level `trapCache` eliminates generation latency for repeated concepts.
- **Key Functions**:
  - `streamChatMessage`: Real-time token ingestion with live pattern harvesting.
  - `generateQuizQuestion`: Adversarial logic traps with <25 word scenarios.
  - `generateAIPoweredScenario`: High-velocity contextual examples for drills.

---

## 🧩 Component Deep Dives

### `ShadowQuiz.tsx` (The Gauntlet)
- **Concept**: Adversarial survival.
- **Mechanics**: 10-item sequence with 2 scenarios and 1 metacognition trap. Breach results in -20% Integrity (HP).
- **Adaptive**: Targets biases with <70% mastery via `Neural Pressure`.

### `TransferBridge` (The Lens)
- **Daily Focus**: Dashboard anchor that algorithmically filters reality through a specific cognitive lens.
- **Reality Logs**: Neural Bridge drawer for logging "In-the-Wild" observations (+50 XP).
- **Pruning**: Automated storage management keeping only the last 30 logs to prevent bloat.

### `SocraticChat.tsx` (The Mirror)
- **Architecture**: **Reactive Streaming Hub**. Uses a double-buffer SSE loop to materialize tokens instantly.
- **Pattern Harvester**: Live-scans stream content to hook and pin mentioned biases to a side-panel.

---

## 📏 Engineering Standards & Protocols

**"The Plan" (Prompt Engineering Discipline)**
Follows the frameworks defined in `.gemini/The Plan Prompt Engineering.txt`.

**Subagents & Personas**
- **The Critique Agent**: Evaluates pedagogical ROI vs Technical Debt.
- **The PWA Sentinel**: Manages SW lifecycle and hardware acceleration.
- **The Design Architect**: Enforces 4px grid and high-fidelity SaaS aesthetics.

### Styling System
- **Theme**: "Cognitive Brutalism" (Blueprint grid + SVG Noise + Glassmorphism).
- **Performance**: Full lazy-loading of all routes; 63% bundle size reduction active.

---

## 📜 Project Evolution
- **STATUS.md**: Detailed log of all modifications and upcoming roadmap.
