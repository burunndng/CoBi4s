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
import { NeuralBackground } from './visualizations/NeuralBackground';

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
      <div className="space-y-32 py-20 animate-fade-in pb-32 relative">
        {/* Neural Network Background */}
        <NeuralBackground />

        {/* Hero Section */}
        <section className="text-center space-y-12 max-w-4xl mx-auto px-4 relative z-10">          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/5 text-[10px] font-black uppercase tracking-[0.5em] text-slate-500 mb-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Version_4.1 // Cognitive_Architect
            </div>
            <h1 className="serif text-7xl md:text-8xl font-light text-white italic leading-[0.9] tracking-tighter animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
              Master the <span className="text-indigo-500/80">Architecture</span> <br/> 
              of Your Own <span className="text-rose-500/80">Logic</span>
            </h1>
            <p className="text-slate-500 text-xl md:text-2xl font-light max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
              A high-fidelity instrument for identifying cognitive biases, dismantling fallacies, and calibrating human intuition.
            </p>
          </div>
  
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 animate-in fade-in slide-in-from-bottom-16 duration-1000 delay-300">
            <button 
              onClick={() => navigate('/dashboard')}
              className="group inline-flex items-center gap-4 bg-white text-black px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-indigo-50 transition-all active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)]"
            >
              INITIALIZE_SYSTEM <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            </button>
            
            <div className="flex items-center gap-4 px-6 py-3 rounded-xl border border-white/5 bg-white/[0.02] text-[10px] font-mono text-slate-600 uppercase tracking-widest">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
               Core_Engine: Operational
            </div>
          </div>
        </section>
  
        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {features.map((f, i) => (
            <div 
              key={i} 
              className="surface p-10 rounded-3xl group border-white/[0.03] hover:border-white/10 transition-all duration-500 flex flex-col justify-between min-h-[320px] active:scale-[0.98]"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-400 group-hover:text-white group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-500 mb-8">
                  {f.icon}
                </div>
                <h3 className="text-white font-bold text-lg uppercase tracking-[0.1em] mb-4">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light group-hover:text-slate-400 transition-colors">{f.description}</p>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                 <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">View Module</span>
                 <ArrowRight size={14} className="text-indigo-500" />
              </div>
            </div>
          ))}
        </section>
  };