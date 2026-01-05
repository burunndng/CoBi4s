# CogniBias Project Status

## 📅 Last Updated: 2026-01-05

## 🚀 Recent Changes

### AI Architecture Migration
- **Service Transition**: Migrated all AI logic from Google Gemini (`geminiService.ts`) to OpenRouter (`apiService.ts`).
- **Model Selection**: Standardized on `x-ai/grok-4.1-fast` for all dynamic content.
- **Configurability**: Added an **Intelligence** section in the Configuration tab to allow users to securely input their own OpenRouter API key.
- **Parameters**: Set default temperature to `0.6` for balanced reasoning and creative scenario generation.

### Project Restructuring
- **Component Organization**: Moved all UI views into a dedicated `components/` directory.
- **Service Organization**: Moved AI integration logic into a `services/` directory.
- **Cleanup**: Removed the obsolete `geminiService.ts` and non-existent `index.css` references.

### Deployment & CI/CD
- **GitHub Pages**: Configured the project for hosting on GitHub Pages with `base: '/CoBi4s/'`.
- **GitHub Actions**: Created a `.github/workflows/deploy.yml` workflow for automated builds and deployments.
- **Dependency Management**: Added `package-lock.json` to fix CI/CD build issues.

## 📋 Current State
- **Status**: Functional & Deployed.
- **Deployment URL**: [https://burunndng.github.io/CoBi4s/](https://burunndng.github.io/CoBi4s/)
- **Primary Model**: Grok 4.1 Fast (via OpenRouter).
- **Storage**: LocalStorage-centric (Key: `cognibias-storage`, `cognibias-openrouter-key`).

## 🛠 Next Steps
- [ ] Monitor deployment success on GitHub Actions.
- [ ] Implement robust error handling for API quota limits.
- [ ] Enhance simulator scenarios with multi-turn feedback loops.
