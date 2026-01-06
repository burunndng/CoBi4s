import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutGrid, 
  Library, 
  Zap, 
  BrainCircuit, 
  CalendarDays, 
  Sliders, 
  Menu as MenuIcon, 
  X,
  CheckCircle2,
  GraduationCap,
  Eye,
  Scale,
  ShieldAlert,
  Brain,
  FlaskConical,
  Binary,
  Shuffle,
  MessageSquare,
  HelpCircle,
  Swords,
  ArrowRight
} from 'lucide-react';
import { BIASES, INITIAL_STATE, FALLACIES } from './constants';
import { AppState, LearningMode } from './types';
import { pruneState } from './lib/storageManager';
import Dashboard from './components/Dashboard';
import Catalog from './components/Catalog';
import Flashcards from './components/Flashcards';
import Quiz from './components/Quiz';
import StudyPlan from './components/StudyPlan';
import AppSettings from './components/AppSettings';
import { Logo } from './components/Logo';

// ⚡️ SENTINEL: Lazy-Loaded Heavy Modules
const AIInstructor = React.lazy(() => import('./components/AIInstructor').then(m => ({ default: m.default })));
const BiasDetector = React.lazy(() => import('./components/BiasDetector/BiasDetector').then(m => ({ default: m.BiasDetector })));
const DecisionArchitect = React.lazy(() => import('./components/DecisionArchitect/DecisionArchitect').then(m => ({ default: m.DecisionArchitect })));
const LogicLab = React.lazy(() => import('./components/LogicLab/LogicLab').then(m => ({ default: m.LogicLab })));
const AlgorithmTrainer = React.lazy(() => import('./components/AlgorithmTrainer/AlgorithmTrainer').then(m => ({ default: m.AlgorithmTrainer })));
const ContextLab = React.lazy(() => import('./components/ContextLab/ContextLab').then(m => ({ default: m.ContextLab })));
const ChatInterface = React.lazy(() => import('./components/SocraticChat/ChatInterface').then(m => ({ default: m.ChatInterface })));
const LandingPage = React.lazy(() => import('./components/LandingPage').then(m => ({ default: m.LandingPage })));
const ShadowBoxing = React.lazy(() => import('./components/ShadowBoxing').then(m => ({ default: m.ShadowBoxing })));

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('cognibias-storage');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: Ensure new fields exist
      return {
        ...INITIAL_STATE,
        ...parsed,
        mode: parsed.mode || 'psychology',
        fallacyProgress: parsed.fallacyProgress || {},
        decisionLogs: parsed.decisionLogs || [],
        algorithmTests: parsed.algorithmTests || [],
        shadowBoxingHistory: parsed.shadowBoxingHistory || [],
        chatHistory: parsed.chatHistory || []
      };
    }
    return INITIAL_STATE;
  });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);

  useEffect(() => {
    const safeState = pruneState(state);
    localStorage.setItem('cognibias-storage', JSON.stringify(safeState));
  }, [state]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const updateProgress = useCallback((id: string, quality: number) => {
    setState(prev => {
      const isLogic = prev.mode === 'logic';
      const progressMap = isLogic ? prev.fallacyProgress : prev.progress;
      
      const current = progressMap[id] || {
        biasId: id, interval: 1, repetition: 0, easeFactor: 2.5, nextReviewDate: Date.now(), masteryLevel: 0
      };
      
      let { interval, repetition, easeFactor } = current;
      if (quality >= 3) {
        if (repetition === 0) interval = 1;
        else if (repetition === 1) interval = 6;
        else interval = Math.round(interval * easeFactor);
        repetition += 1;
      } else {
        repetition = 0;
        interval = 1;
      }
      easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
      const nextReviewDate = Date.now() + interval * 24 * 60 * 60 * 1000;
      const masteryLevel = Math.min(100, repetition * 10 + (quality * 5));
      
      const today = new Date().toDateString();
      let newStreak = prev.dailyStreak;
      if (prev.lastStudyDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        newStreak = prev.lastStudyDate === yesterday.toDateString() ? prev.dailyStreak + 1 : 1;
      }

      return {
        ...prev,
        totalXp: prev.totalXp + 15,
        dailyStreak: newStreak,
        lastStudyDate: today,
        [isLogic ? 'fallacyProgress' : 'progress']: { 
          ...progressMap, 
          [id]: { biasId: id, interval, repetition, easeFactor, nextReviewDate, masteryLevel } 
        }
      };
    });
    showToast(`Data Updated`, 'success');
  }, [showToast]);

  return (
    <HashRouter>
      <div className="flex h-[100dvh] bg-transparent text-slate-200">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 border-r border-white/5 bg-white/[0.02] backdrop-blur-xl z-40">
          <div className="p-8 border-b border-white/5 flex items-center gap-4">
            <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20 text-indigo-400">
              <Logo size={28} />
            </div>
            <div>
              <h1 className="serif text-xl font-light text-white tracking-tight italic">CogniBias</h1>
              <p className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-bold">Architect Edition</p>
            </div>
          </div>

          <div className="px-6 py-6">
            <div className="bg-white/[0.03] border border-white/5 rounded-xl p-1 flex shadow-inner">
              <button 
                onClick={() => setState(prev => ({ ...prev, mode: 'psychology' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${
                  state.mode === 'psychology' ? 'bg-white/10 text-white shadow-xl border border-white/10' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <Brain size={12} />
                Psychology
              </button>
              <button 
                onClick={() => setState(prev => ({ ...prev, mode: 'logic' }))}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all ${
                  state.mode === 'logic' ? 'bg-white/10 text-rose-400 shadow-xl border border-white/10' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <ShieldAlert size={12} />
                Logic
              </button>
            </div>
          </div>
          
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar">
            <NavLink to="/dashboard" icon={<LayoutGrid size={18} />} label="Overview" />
            <NavLink to="/catalog" icon={<Library size={18} />} label="Registry" />
            <NavLink to="/chat" icon={<MessageSquare size={18} />} label="Mirror" />
            <NavLink to="/debate" icon={<Swords size={18} />} label="Shadow Boxing" />
            <NavLink to="/trainer" icon={<Binary size={18} />} label="Trainer" />
            <NavLink to="/instructor" icon={<BrainCircuit size={18} />} label="Simulator" />
            <NavLink to="/decision" icon={<Scale size={18} />} label="Architect" />
            <NavLink to="/lab" icon={<FlaskConical size={18} />} label="Lab" />
            <NavLink to="/detector" icon={<Eye size={18} />} label="Detector" />
            <NavLink to="/flashcards" icon={<Zap size={18} />} label="Flashcards" />
            <NavLink to="/quiz" icon={<GraduationCap size={18} />} label="Assessment" />
            <NavLink to="/plan" icon={<CalendarDays size={18} />} label="Schedule" />
          </nav>

          <div className="p-4 border-t border-white/5 space-y-1">
            <NavLink to="/" icon={<HelpCircle size={18} />} label="About" />
            <NavLink to="/settings" icon={<Sliders size={18} />} label="Configuration" />
          </div>

          {/* Neural Bridge: Aura OS Portal */}
          <div className="p-4 border-t border-white/5 mt-auto">
            <div className="px-4 mb-3">
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-indigo-500/50">System_Bridge</span>
            </div>
            <a 
              href="https://auraos.space" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-4 px-5 py-4 rounded-xl transition-all group active:scale-[0.98] border border-indigo-500/10 bg-indigo-500/5 hover:bg-indigo-500/10 hover:border-indigo-500/30"
            >
              <div className="text-indigo-400 group-hover:text-indigo-300 transition-colors">
                <Shuffle size={18} className="animate-pulse" />
              </div>
              <span className="text-sm font-bold tracking-widest text-indigo-100 group-hover:text-white transition-colors">AURA_OS</span>
              <div className="ml-auto flex items-center gap-2">
                 <div className="w-1 h-1 rounded-full bg-indigo-500 shadow-[0_0_8px_indigo]"></div>
                 <ArrowRight size={12} className="text-indigo-500 group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 w-full bg-black/40 backdrop-blur-xl z-30 border-b border-white/5 h-16 flex items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <Logo size={24} className="text-indigo-400" />
            <span className="serif text-xl text-white italic">CogniBias</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-3 -mr-2 text-slate-400 hover:text-white transition-all active:scale-90">
            <MenuIcon size={24} />
          </button>
        </header>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-zinc-950/90 backdrop-blur-2xl border-l border-white/10 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
              <div className="p-6 border-b border-white/10 flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-4 -m-4 active:scale-90"><X size={24} className="text-slate-400 hover:text-white" /></button>
              </div>

              <div className="px-6 py-6 border-b border-white/10">
                <div className="bg-white/[0.03] border border-white/5 rounded-xl p-1.5 flex">
                  <button 
                    onClick={() => setState(prev => ({ ...prev, mode: 'psychology' }))}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all active:scale-95 ${
                      state.mode === 'psychology' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <Brain size={14} />
                    Psychology
                  </button>
                  <button 
                    onClick={() => setState(prev => ({ ...prev, mode: 'logic' }))}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] uppercase tracking-widest font-bold transition-all active:scale-95 ${
                      state.mode === 'logic' ? 'bg-white/10 text-rose-400 shadow-lg border border-white/10' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    <ShieldAlert size={14} />
                    Logic
                  </button>
                </div>
              </div>

              <nav className="flex-1 p-6 space-y-4 overflow-y-auto no-scrollbar">
                <NavLink to="/dashboard" icon={<LayoutGrid size={18} />} label="Overview" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/catalog" icon={<Library size={18} />} label="Registry" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/chat" icon={<MessageSquare size={18} />} label="Mirror" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/debate" icon={<Swords size={18} />} label="Shadow Boxing" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/trainer" icon={<Binary size={18} />} label="Trainer" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/instructor" icon={<BrainCircuit size={18} />} label="Simulator" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/decision" icon={<Scale size={18} />} label="Architect" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/lab" icon={<FlaskConical size={18} />} label="Lab" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/detector" icon={<Eye size={18} />} label="Detector" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/flashcards" icon={<Zap size={18} />} label="Flashcards" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/quiz" icon={<GraduationCap size={18} />} label="Assessment" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/plan" icon={<CalendarDays size={18} />} label="Schedule" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/" icon={<HelpCircle size={18} />} label="About" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/settings" icon={<Sliders size={18} />} label="Configuration" onClick={() => setIsMobileMenuOpen(false)} />
                
                {/* Neural Bridge: Mobile */}
                <div className="pt-6 mt-6 border-t border-white/10">
                  <div className="px-1 mb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-500/50">System_Bridge</span>
                  </div>
                  <a 
                    href="https://auraos.space" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 px-5 py-5 rounded-2xl transition-all group active:scale-95 border border-indigo-500/10 bg-indigo-500/5"
                  >
                    <Shuffle size={20} className="text-indigo-400" />
                    <span className="text-base font-bold tracking-widest text-indigo-100 uppercase">Aura_OS_Portal</span>
                    <ArrowRight size={16} className="ml-auto text-indigo-500" />
                  </a>
                </div>
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto pt-16 lg:pt-0 no-scrollbar bg-transparent">
          <div className="max-w-6xl mx-auto p-6 md:p-10 lg:p-12">
            <React.Suspense fallback={
              <div className="h-[60vh] flex flex-col items-center justify-center text-slate-700 gap-4 animate-pulse">
                <Brain size={48} strokeWidth={1} />
                <span className="text-[10px] font-mono uppercase tracking-[0.5em]">Compiling_Logic...</span>
              </div>
            }>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={<Dashboard state={state} />} />
                <Route path="/catalog" element={<Catalog state={state} toggleFavorite={(id) => {
                   setState(prev => {
                     const isFav = prev.favorites.includes(id);
                     return { ...prev, favorites: isFav ? prev.favorites.filter(f => f !== id) : [...prev.favorites, id] };
                   });
                }} />} />
                <Route path="/chat" element={<ChatInterface state={state} setState={setState} />} />
                <Route path="/debate" element={<ShadowBoxing state={state} setState={setState} />} />
                <Route path="/trainer" element={<AlgorithmTrainer state={state} setState={setState} />} />
                <Route path="/context" element={<ContextLab />} />
                <Route path="/instructor" element={<AIInstructor state={state} updateProgress={updateProgress} />} />
                <Route path="/decision" element={<DecisionArchitect state={state} />} />
                <Route path="/lab" element={<LogicLab state={state} updateProgress={updateProgress} />} />
                <Route path="/detector" element={<BiasDetector state={state} updateProgress={updateProgress} />} />
                <Route path="/flashcards" element={<Flashcards state={state} updateProgress={updateProgress} toggleFavorite={(id) => {
                   setState(prev => {
                     const isFav = prev.favorites.includes(id);
                     return { ...prev, favorites: isFav ? prev.favorites.filter(f => f !== id) : [...prev.favorites, id] };
                   });
                }} />} />
                <Route path="/quiz" element={<Quiz state={state} updateProgress={updateProgress} />} />
                <Route path="/plan" element={<StudyPlan state={state} />} />
                <Route path="/settings" element={<AppSettings state={state} setState={setState} />} />
              </Routes>
            </React.Suspense>
          </div>
        </main>

        {/* Toast Notifications */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="surface px-6 py-4 rounded-xl flex items-center gap-4 shadow-2xl animate-in slide-in-from-right duration-300 pointer-events-auto border-l-4 border-white">
              {toast.type === 'success' ? <CheckCircle2 size={18} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-red-500" />}
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white leading-none">{toast.message}</span>
            </div>
          ))}
        </div>

      </div>
    </HashRouter>
  );
};

const NavLink: React.FC<{ to: string; icon: React.ReactNode; label: string; onClick?: () => void }> = ({ to, icon, label, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all group active:scale-[0.98] ${
        isActive 
          ? 'bg-white/10 text-white' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <div className={`transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
        {icon}
      </div>
      <span className="text-sm font-medium tracking-wide">{label}</span>
      {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_white]"></div>}
    </Link>
  );
};

export default App;