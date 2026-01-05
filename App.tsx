
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
  Scale
} from 'lucide-react';
import { BIASES, INITIAL_STATE } from './constants';
import { AppState } from './types';
import Dashboard from './components/Dashboard';
import Catalog from './components/Catalog';
import Flashcards from './components/Flashcards';
import Quiz from './components/Quiz';
import StudyPlan from './components/StudyPlan';
import AppSettings from './components/AppSettings';
import AIInstructor from './components/AIInstructor';
import { BiasDetector } from './components/BiasDetector/BiasDetector';
import { DecisionArchitect } from './components/DecisionArchitect/DecisionArchitect';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('cognibias-storage');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Migration: Ensure new fields exist
      return {
        ...INITIAL_STATE,
        ...parsed,
        decisionLogs: parsed.decisionLogs || []
      };
    }
    return INITIAL_STATE;
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toasts, setToasts] = useState<{ id: number; message: string; type: 'success' | 'error' }[]>([]);

  useEffect(() => {
    localStorage.setItem('cognibias-storage', JSON.stringify(state));
  }, [state]);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  }, []);

  const updateProgress = useCallback((biasId: string, quality: number) => {
    setState(prev => {
      const current = prev.progress[biasId] || {
        biasId, interval: 1, repetition: 0, easeFactor: 2.5, nextReviewDate: Date.now(), masteryLevel: 0
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
        progress: { ...prev.progress, [biasId]: { biasId, interval, repetition, easeFactor, nextReviewDate, masteryLevel } }
      };
    });
    showToast(`Data Updated`, 'success');
  }, [showToast]);

  return (
    <HashRouter>
      <div className="flex h-[100dvh] bg-[#09090b] text-slate-200">
        
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-72 border-r border-[#27272a] bg-[#09090b] z-40">
          <div className="p-6 border-b border-[#27272a]">
            <h1 className="serif text-2xl font-medium text-white tracking-tight italic">CogniBias</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Architect Edition</p>
          </div>
          
          <nav className="flex-1 p-4 space-y-1">
            <NavLink to="/" icon={<LayoutGrid size={18} />} label="Overview" />
            <NavLink to="/catalog" icon={<Library size={18} />} label="Registry" />
            <NavLink to="/instructor" icon={<BrainCircuit size={18} />} label="Simulator" />
            <NavLink to="/decision" icon={<Scale size={18} />} label="Architect" />
            <NavLink to="/detector" icon={<Eye size={18} />} label="Detector" />
            <NavLink to="/flashcards" icon={<Zap size={18} />} label="Practice" />
            <NavLink to="/quiz" icon={<GraduationCap size={18} />} label="Assessment" />
            <NavLink to="/plan" icon={<CalendarDays size={18} />} label="Schedule" />
          </nav>

          <div className="p-4 border-t border-[#27272a]">
            <NavLink to="/settings" icon={<Sliders size={18} />} label="Configuration" />
          </div>
        </aside>

        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 w-full bg-[#09090b]/90 backdrop-blur-md z-30 border-b border-[#27272a] h-16 flex items-center justify-between px-5">
          <span className="serif text-xl text-white italic">CogniBias</span>
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 text-slate-400 hover:text-white transition-colors">
            <MenuIcon size={20} />
          </button>
        </header>

        {/* Mobile Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-[#09090b] border-l border-[#27272a] flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl">
              <div className="p-6 border-b border-[#27272a] flex justify-between items-center">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Navigation</span>
                <button onClick={() => setIsMobileMenuOpen(false)}><X size={20} className="text-slate-400 hover:text-white" /></button>
              </div>
              <nav className="flex-1 p-6 space-y-4">
                <NavLink to="/" icon={<LayoutGrid size={18} />} label="Overview" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/catalog" icon={<Library size={18} />} label="Registry" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/instructor" icon={<BrainCircuit size={18} />} label="Simulator" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/decision" icon={<Scale size={18} />} label="Architect" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/detector" icon={<Eye size={18} />} label="Detector" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/flashcards" icon={<Zap size={18} />} label="Practice" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/quiz" icon={<GraduationCap size={18} />} label="Assessment" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/plan" icon={<CalendarDays size={18} />} label="Schedule" onClick={() => setIsMobileMenuOpen(false)} />
                <NavLink to="/settings" icon={<Sliders size={18} />} label="Configuration" onClick={() => setIsMobileMenuOpen(false)} />
              </nav>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 h-full overflow-y-auto pt-16 lg:pt-0 no-scrollbar bg-[#09090b]">
          <div className="max-w-6xl mx-auto p-6 md:p-10 lg:p-12">
            <Routes>
              <Route path="/" element={<Dashboard state={state} />} />
              <Route path="/catalog" element={<Catalog state={state} toggleFavorite={(id) => {
                 setState(prev => {
                   const isFav = prev.favorites.includes(id);
                   return { ...prev, favorites: isFav ? prev.favorites.filter(f => f !== id) : [...prev.favorites, id] };
                 });
              }} />} />
              <Route path="/instructor" element={<AIInstructor state={state} updateProgress={updateProgress} />} />
              <Route path="/decision" element={<DecisionArchitect state={state} setState={setState} />} />
              <Route path="/detector" element={<BiasDetector />} />
              <Route path="/flashcards" element={<Flashcards state={state} updateProgress={updateProgress} toggleFavorite={(id) => {
                setState(prev => {
                  const isFav = prev.favorites.includes(id);
                  return { ...prev, favorites: isFav ? prev.favorites.filter(f => f !== id) : [...prev.favorites, id] };
                });
              }} />} />
              <Route path="/quiz" element={<Quiz biases={BIASES} onXpGain={(xp) => setState(prev => ({...prev, totalXp: prev.totalXp + xp}))} />} />
              <Route path="/plan" element={<StudyPlan state={state} />} />
              <Route path="/settings" element={<AppSettings state={state} setState={setState} />} />
            </Routes>
          </div>
        </main>

        {/* Toast Notifications */}
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
          {toasts.map(toast => (
            <div key={toast.id} className="surface px-5 py-3 rounded-lg flex items-center gap-3 shadow-2xl animate-in slide-in-from-right duration-300 pointer-events-auto border-l-2 border-l-white">
              {toast.type === 'success' ? <CheckCircle2 size={16} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-red-500" />}
              <span className="text-xs font-bold uppercase tracking-wider text-white">{toast.message}</span>
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
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
        isActive 
          ? 'bg-white/10 text-white' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <div className={`transition-colors ${isActive ? 'text-white' : 'text-slate-500 group-hover:text-white'}`}>
        {icon}
      </div>
      <span className="text-sm font-medium">{label}</span>
      {isActive && <div className="ml-auto w-1 h-1 rounded-full bg-white"></div>}
    </Link>
  );
};

export default App;
