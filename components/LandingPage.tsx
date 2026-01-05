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
      icon: <Library className="text-indigo-400" />,
      title: "Registry",
      desc: "The Codex.",
      detail: "Reference the 50 laws of human irrationality."
    },
    {
      icon: <BookOpen className="text-indigo-400" />,
      title: "Flashcards",
      desc: "The Drill.",
      detail: "Spaced repetition for pattern recognition."
    },
    {
      icon: <BrainCircuit className="text-indigo-400" />,
      title: "Simulator",
      desc: "The Sandbox.",
      detail: "Face high-stakes choices and consequences."
    },
    {
      icon: <ShieldAlert className="text-rose-400" />,
      title: "Detector",
      desc: "The Lens.",
      detail: "Highlight hidden biases/fallacies in text."
    },
    {
      icon: <FlaskConical className="text-rose-400" />,
      title: "Logic Lab",
      desc: "The Workshop.",
      detail: "Fix broken arguments with steel-manning."
    },
    {
      icon: <Shuffle className="text-amber-400" />,
      title: "Switcher",
      desc: "The Prism.",
      detail: "Calibrate heuristics for different contexts."
    },
    {
      icon: <MessageSquare className="text-indigo-400" />,
      title: "Mirror",
      desc: "The Coach.",
      detail: "Debug your own thoughts in real-time."
    },
    {
      icon: <Binary className="text-emerald-400" />,
      title: "Trainer",
      desc: "The Compiler.",
      detail: "Program logic to test your understanding."
    }
  ];

  return (
    <div className="max-w-5xl mx-auto pb-24 px-4 animate-fade-in">
      {/* Hero */}
      <div className="py-20 text-center space-y-6">
        <h1 className="text-5xl md:text-7xl font-serif italic text-white tracking-tight">
          Cogni<span className="text-indigo-500">Bias</span>
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Don't just learn definitions. <span className="text-white font-medium">Re-wire your brain.</span>
          <br/>
          The complete toolkit for the cognitive architect.
        </p>
        
        <div className="pt-8">
          <button 
            onClick={() => navigate('/')}
            className="group btn-primary bg-white text-black hover:bg-zinc-200 px-10 py-4 rounded-full font-bold tracking-widest text-sm flex items-center gap-3 mx-auto transition-all transform hover:scale-105"
          >
            ENTER THE GYM <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((f, i) => (
          <div 
            key={i}
            className="surface p-6 rounded-2xl border border-zinc-800/50 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all group"
          >
            <div className="mb-4 p-3 bg-zinc-950 rounded-xl inline-block border border-zinc-900 group-hover:border-zinc-800 transition-colors">
              {React.cloneElement(f.icon as React.ReactElement, { size: 24 })}
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{f.title}</h3>
            <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-3">{f.desc}</p>
            <p className="text-sm text-slate-500 leading-snug">{f.detail}</p>
          </div>
        ))}
      </div>

      {/* Philosophy */}
      <div className="mt-20 border-t border-zinc-800 pt-12 text-center">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-[0.2em] mb-4">Philosophy</p>
        <div className="flex flex-wrap justify-center gap-8 text-slate-400 text-sm">
           <span className="flex items-center gap-2"><TrendingUp size={16} className="text-emerald-500" /> Active Transfer</span>
           <span className="flex items-center gap-2"><ShieldAlert size={16} className="text-rose-500" /> Adversarial Testing</span>
           <span className="flex items-center gap-2"><BrainCircuit size={16} className="text-indigo-500" /> Cognitive Architecture</span>
        </div>
      </div>
    </div>
  );
};
