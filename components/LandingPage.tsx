import React from 'react';
import { 
  Library, 
  BookOpen, 
  BrainCircuit, 
  ShieldAlert, 
  FlaskConical, 
  Shuffle, 
  MessageSquare, 
  Binary, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Library,
      title: "Registry",
      desc: "The Codex.",
      detail: "Reference the 50 laws of human irrationality."
    },
    {
      icon: BookOpen,
      title: "Flashcards",
      desc: "The Drill.",
      detail: "Spaced repetition for pattern recognition."
    },
    {
      icon: BrainCircuit,
      title: "Simulator",
      desc: "The Sandbox.",
      detail: "Face high-stakes choices and consequences."
    },
    {
      icon: ShieldAlert,
      title: "Detector",
      desc: "The Lens.",
      detail: "Highlight hidden biases/fallacies in text."
    },
    {
      icon: FlaskConical,
      title: "Logic Lab",
      desc: "The Workshop.",
      detail: "Fix broken arguments with steel-manning."
    },
    {
      icon: Shuffle,
      title: "Switcher",
      desc: "The Prism.",
      detail: "Calibrate heuristics for different contexts."
    },
    {
      icon: MessageSquare,
      title: "Mirror",
      desc: "The Coach.",
      detail: "Debug your own thoughts in real-time."
    },
    {
      icon: Binary,
      title: "Trainer",
      desc: "The Compiler.",
      detail: "Program logic to test your understanding."
    }
  ];

  return (
    <div className="max-w-6xl mx-auto pb-32 px-4 animate-fade-in">
      {/* Hero */}
      <div className="py-32 text-center space-y-8">
        <div className="inline-block px-4 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-[0.4em] mb-4">
          The Cognitive Gym
        </div>
        <h1 className="text-7xl md:text-9xl font-serif italic text-white tracking-tighter leading-none">
          Cogni<span className="text-indigo-500">Bias</span>
        </h1>
        <p className="text-xl md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light italic">
          Stop memorizing biases. <span className="text-white">Start engineering your perspective.</span>
        </p>
        
        <div className="pt-12">
          <button 
            onClick={() => navigate('/dashboard')}
            className="group btn-primary bg-white text-black hover:bg-zinc-200 px-12 py-5 rounded-full font-bold tracking-[0.2em] text-[10px] flex items-center gap-4 mx-auto transition-all shadow-2xl shadow-white/10"
          >
            INITIALIZE SYSTEM <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div 
              key={i}
              className="surface p-8 rounded-2xl flex flex-col group h-full"
            >
              <div className="mb-8 p-4 bg-white/[0.03] border border-white/5 rounded-2xl inline-block group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-500">
                <Icon size={28} className="text-indigo-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-1 uppercase tracking-tight">{f.title}</h3>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-4">{f.desc}</p>
                <p className="text-sm text-slate-500 leading-relaxed font-light">{f.detail}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Philosophy */}
      <div className="mt-32 border-t border-white/5 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center md:text-left">
           <div className="space-y-4">
             <div className="flex items-center gap-3 justify-center md:justify-start">
               <TrendingUp size={20} className="text-emerald-500" />
               <h4 className="text-white font-bold uppercase tracking-widest text-xs">Active Transfer</h4>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed">Training designed specifically to bridge the gap between abstract theory and real-world behavior.</p>
           </div>
           <div className="space-y-4">
             <div className="flex items-center gap-3 justify-center md:justify-start">
               <ShieldAlert size={20} className="text-rose-500" />
               <h4 className="text-white font-bold uppercase tracking-widest text-xs">Adversarial Logic</h4>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed">Don't just fix your thoughts; stress-test them against AI unit tests and adversarial scenarios.</p>
           </div>
           <div className="space-y-4">
             <div className="flex items-center gap-3 justify-center md:justify-start">
               <BrainCircuit size={20} className="text-indigo-500" />
               <h4 className="text-white font-bold uppercase tracking-widest text-xs">Architect Mindset</h4>
             </div>
             <p className="text-xs text-slate-500 leading-relaxed">Approach your mind as a codebase: identify bugs, refactor logic, and build robust heuristics.</p>
           </div>
        </div>
      </div>
    </div>
  );
};