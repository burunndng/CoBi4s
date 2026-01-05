import React, { useState } from 'react';
import { generateContextScenario } from '../../services/apiService';
import { ContextScenario } from '../../types';
import { CalibrationSlider } from './CalibrationSlider';
import { Loader2, Shuffle, ArrowRight, Shield, Users, Coffee, HelpCircle, Target } from 'lucide-react';

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
  const [userValues, setUserValues] = useState<number[]>([50, 50, 50]);
  const [lockedStates, setLockedStates] = useState<boolean[]>([false, false, false]);

  const handleGenerate = async () => {
    setLoading(true);
    setScenario(null);
    setLockedStates([false, false, false]);
    setUserValues([50, 50, 50]);
    try {
      const data = await generateContextScenario(action);
      setScenario(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSliderChange = (index: number, val: number) => {
    const newValues = [...userValues];
    newValues[index] = val;
    setUserValues(newValues);
  };

  const toggleLock = (index: number) => {
    const newLocked = [...lockedStates];
    newLocked[index] = true;
    setLockedStates(newLocked);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'Survival': return <Shield size={20} className="text-emerald-400" />;
      case 'Social': return <Users size={20} className="text-rose-400" />;
      case 'Neutral': return <Coffee size={20} className="text-amber-400" />;
      default: return <HelpCircle size={20} />;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-24">
      {/* Header */}
      <div className="border-b border-white/5 pb-8">
        <h1 className="serif text-5xl font-light text-white italic flex items-center gap-4">
          <Shuffle className="w-10 h-10 text-amber-500" />
          Context Switcher
        </h1>
        <p className="text-slate-500 mt-2 text-[10px] uppercase tracking-[0.3em] font-bold">
          Calibration Prism // Heuristic vs Bias
        </p>
      </div>

      {/* Input Section */}
      <div className="surface p-8 rounded-2xl flex flex-col md:flex-row gap-6 items-end">
        <div className="flex-1 w-full">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-3 block">
            Target Action / Heuristic
          </label>
          <div className="relative">
            <input 
              type="text" 
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-4 pr-12 text-white focus:ring-2 focus:ring-amber-500/50 outline-none text-lg font-serif italic"
            />
            <button 
              onClick={() => setAction(ACTIONS[Math.floor(Math.random() * ACTIONS.length)])}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
              title="Randomize"
            >
              <Shuffle size={18} />
            </button>
          </div>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading || !action}
          className="w-full md:w-auto px-8 py-4 bg-amber-600 hover:bg-amber-500 text-black rounded-xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 disabled:opacity-50 transition-all shadow-lg shadow-amber-900/20"
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <ArrowRight size={16} />}
          {loading ? 'Analyzing...' : 'Generate Contexts'}
        </button>
      </div>

      {/* Cards Display */}
      {scenario && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700">
          {scenario.contexts.map((ctx, idx) => (
            <div 
              key={ctx.id || idx}
              className="surface rounded-2xl flex flex-col group hover:-translate-y-1 transition-transform duration-500"
            >
              <div className="p-8 flex-1">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    {getIcon(ctx.type)}
                  </div>
                  <span className={`text-[9px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full border ${
                      ctx.type === 'Survival' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
                      ctx.type === 'Social' ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 
                      'bg-amber-500/10 border-amber-500/20 text-amber-400'
                  }`}>
                    {ctx.type}
                  </span>
                </div>

                <h3 className="font-serif text-2xl text-white mb-3 italic">{ctx.setting}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 font-light">
                  "{ctx.description}"
                </p>

                {/* Slider Component */}
                <div className="mb-8">
                   <CalibrationSlider 
                     userValue={userValues[idx]} 
                     onChange={(val) => handleSliderChange(idx, val)}
                     isLocked={lockedStates[idx]}
                     targetRange={ctx.range}
                   />
                </div>

                {/* Commit Button / Reveal */}
                {!lockedStates[idx] ? (
                  <button 
                    onClick={() => toggleLock(idx)}
                    className="w-full py-3 bg-white/[0.05] hover:bg-white/[0.1] border border-white/5 text-slate-300 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group-hover:border-white/20"
                  >
                    <Target size={14} /> Commit Calibration
                  </button>
                ) : (
                  <div className="animate-in fade-in space-y-3 pt-6 border-t border-white/5">
                     <p className="text-[9px] font-bold text-amber-500 uppercase tracking-[0.2em]">AI Analysis</p>
                     <p className="text-xs text-slate-400 leading-relaxed font-mono">{ctx.reasoning}</p>
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