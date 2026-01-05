import React, { useState } from 'react';
import { generateContextScenario } from '../../services/apiService';
import { ContextScenario } from '../../types';
import { Loader2, Shuffle, ArrowRight, Shield, Users, Coffee, HelpCircle, Check, X } from 'lucide-react';

const ACTIONS = [
  "Interrupting someone immediately",
  "Judging a book by its cover",
  "Running away without looking",
  "Trusting the loudest person",
  "Copying what everyone else is doing",
  "Stereotyping a stranger",
  "Refusing to change a plan",
  "Ignoring contradictory evidence"
];

export const ContextLab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState(ACTIONS[0]);
  const [scenario, setScenario] = useState<ContextScenario | null>(null);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);

  const handleGenerate = async () => {
    setLoading(true);
    setScenario(null);
    setRevealed([false, false, false]);
    try {
      const data = await generateContextScenario(action);
      setScenario(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleReveal = (index: number) => {
    const newRevealed = [...revealed];
    newRevealed[index] = !newRevealed[index];
    setRevealed(newRevealed);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Survival': return <Shield size={24} className="text-emerald-400" />;
      case 'Social': return <Users size={24} className="text-rose-400" />;
      case 'Neutral': return <Coffee size={24} className="text-amber-400" />;
      default: return <HelpCircle size={24} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-6">
        <h1 className="serif text-3xl text-slate-100 flex items-center gap-3">
          <Shuffle className="w-8 h-8 text-amber-500" />
          Context Switcher
        </h1>
        <p className="text-slate-500 mt-1">
          Learn when a bias is actually a useful heuristic.
        </p>
      </div>

      {/* Input Section */}
      <div className="surface p-6 rounded-xl border border-zinc-800 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">
            Target Action / Heuristic
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 pr-12 text-white focus:ring-2 focus:ring-amber-500 outline-none"
            />
            <button 
              onClick={() => setAction(ACTIONS[Math.floor(Math.random() * ACTIONS.length)])}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              title="Randomize"
            >
              <Shuffle size={16} />
            </button>
          </div>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading || !action}
          className="w-full md:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <ArrowRight size={20} />}
          {loading ? 'Analyzing...' : 'Generate Contexts'}
        </button>
      </div>

      {/* Cards Display */}
      {scenario && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700">
          {scenario.contexts.map((ctx, idx) => (
            <div 
              key={idx}
              className={`relative rounded-2xl border transition-all duration-500 overflow-hidden group ${
                revealed[idx] 
                  ? (ctx.type === 'Survival' ? 'bg-emerald-950/20 border-emerald-500/50' : 
                     ctx.type === 'Social' ? 'bg-rose-950/20 border-rose-500/50' : 
                     'bg-amber-950/20 border-amber-500/50')
                  : 'surface border-zinc-800 hover:border-zinc-600 cursor-pointer'
              }`}
              onClick={() => toggleReveal(idx)}
            >
              <div className="p-6 h-full flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-full bg-zinc-900 border border-zinc-800 transition-colors duration-500 ${revealed[idx] ? 'opacity-100' : 'opacity-50 grayscale'}`}>
                    {getIcon(ctx.type)}
                  </div>
                  {revealed[idx] && (
                    <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${
                        ctx.type === 'Survival' ? 'bg-emerald-500/20 text-emerald-400' : 
                        ctx.type === 'Social' ? 'bg-rose-500/20 text-rose-400' : 
                        'bg-amber-500/20 text-amber-400'
                    }`}>
                      {ctx.type}
                    </span>
                  )}
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-1">
                  "{ctx.description}"
                </p>

                <div className={`pt-4 border-t border-white/5 transition-all duration-500 ${revealed[idx] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                   <p className={`font-bold text-lg mb-1 ${
                      ctx.verdict.includes('Useful') ? 'text-emerald-400' : 
                      ctx.verdict.includes('Harmful') ? 'text-rose-400' : 
                      'text-amber-400'
                   }`}>
                     {ctx.verdict}
                   </p>
                   <p className="text-xs text-slate-500 leading-snug">
                     {ctx.explanation}
                   </p>
                </div>

                {!revealed[idx] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-bold text-sm tracking-widest uppercase">Click to Reveal</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
