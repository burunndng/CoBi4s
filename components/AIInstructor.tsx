import React, { useState } from 'react';
import { AppState, Bias, SimulationScenario } from '../types';
import { BIASES } from '../constants';
import { generateBranchingScenario } from '../services/apiService';
import { TransferTips } from './shared/TransferTips';
import { BrainCircuit, Loader2, Play, User, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';

interface AIInstructorProps {
  state: AppState;
  updateProgress: (id: string, quality: number) => void;
}

export const AIInstructor: React.FC<AIInstructorProps> = ({ state, updateProgress }) => {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'active' | 'result'>('idle');
  const [scenario, setScenario] = useState<SimulationScenario | null>(null);
  const [selectedChoiceId, setSelectedChoiceId] = useState<string | null>(null);

  const startSimulation = async () => {
    setPhase('loading');
    setScenario(null);
    setSelectedChoiceId(null);

    // Pick a bias (prioritize lowest mastery)
    const sorted = [...BIASES].sort((a, b) => {
      const masteryA = state.progress[a.id]?.masteryLevel || 0;
      const masteryB = state.progress[b.id]?.masteryLevel || 0;
      return masteryA - masteryB;
    });
    const target = sorted[0]; // Simplest selection logic for now

    try {
      const data = await generateBranchingScenario(target);
      setScenario(data);
      setPhase('active');
    } catch (e) {
      console.error(e);
      setPhase('idle');
    }
  };

  const handleChoice = (choiceId: string) => {
    setSelectedChoiceId(choiceId);
    setPhase('result');
    
    if (!scenario) return;
    const choice = scenario.choices.find(c => c.id === choiceId);
    if (!choice) return;

    // Quality: 5 if rational (not trap), 1 if trap
    const quality = choice.isTrap ? 1 : 5;
    updateProgress(scenario.biasId, quality);
  };

  const getTargetBiasName = () => {
    if (!scenario) return '';
    const b = BIASES.find(x => x.id === scenario.biasId);
    return b ? b.name : scenario.biasId;
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <h1 className="serif text-3xl text-slate-100 flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-indigo-400" />
            Simulation Sandbox
          </h1>
          <p className="text-slate-500 mt-1">Live roleplay decisions. Face the consequences.</p>
        </div>
        {(phase === 'active' || phase === 'result') && (
           <div className="px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-bold uppercase tracking-widest">
             Role: {scenario?.role || '...'}
           </div>
        )}
      </div>

      {phase === 'idle' && (
        <div className="h-96 flex flex-col items-center justify-center text-center space-y-6 bg-zinc-900/20 rounded-2xl border border-zinc-800/50">
           <div className="w-20 h-20 bg-indigo-500/10 rounded-full flex items-center justify-center">
              <User size={40} className="text-indigo-400" />
           </div>
           <div>
              <h2 className="text-xl font-medium text-white">Enter the Simulation</h2>
              <p className="text-slate-400 text-sm max-w-md mx-auto mt-2">
                We will generate a high-stakes scenario tailored to your weakest areas.
                You must make a choice. The system will react.
              </p>
           </div>
           <button 
             onClick={startSimulation}
             className="btn-primary bg-indigo-600 hover:bg-indigo-700 px-8 py-3 rounded-xl flex items-center gap-2"
           >
             <Play size={18} fill="currentColor" /> Start Scenario
           </button>
        </div>
      )}

      {phase === 'loading' && (
        <div className="h-96 flex flex-col items-center justify-center text-slate-500 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
          <p className="animate-pulse">Constructing reality...</p>
        </div>
      )}

      {(phase === 'active' || phase === 'result') && scenario && (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
           {/* Narrative Card */}
           <div className="surface p-8 rounded-2xl border border-zinc-800 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4">The Situation</h3>
              <p className="text-xl md:text-2xl font-serif text-slate-200 leading-relaxed">
                "{scenario.situation}"
              </p>
           </div>

           {/* Choices */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenario.choices.map((choice) => {
                const isSelected = selectedChoiceId === choice.id;
                const isRevealed = phase === 'result';
                
                let borderClass = 'border-zinc-800 hover:border-zinc-600';
                if (isRevealed && isSelected) {
                   borderClass = choice.isTrap ? 'border-rose-500 bg-rose-500/10' : 'border-emerald-500 bg-emerald-500/10';
                }

                return (
                  <button
                    key={choice.id}
                    onClick={() => !isRevealed && handleChoice(choice.id)}
                    disabled={isRevealed}
                    className={`text-left p-6 rounded-xl border transition-all duration-300 flex flex-col h-full ${borderClass} ${
                      !isRevealed ? 'bg-zinc-900 hover:bg-zinc-800' : 'cursor-default'
                    } ${isRevealed && !isSelected ? 'opacity-50' : 'opacity-100'}`}
                  >
                    <div className="flex-1">
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Option {choice.id}</span>
                       <p className="text-sm font-medium text-white">{choice.text}</p>
                    </div>
                    {isRevealed && isSelected && (
                       <div className="mt-4 pt-4 border-t border-white/10 animate-in fade-in">
                          <p className={`text-xs font-bold uppercase tracking-widest mb-1 flex items-center gap-2 ${choice.isTrap ? 'text-rose-400' : 'text-emerald-400'}`}>
                             {choice.isTrap ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                             {choice.isTrap ? 'Trap Triggered' : 'Crisis Averted'}
                          </p>
                       </div>
                    )}
                  </button>
                );
              })}
           </div>

           {/* Outcome Reveal */}
           {phase === 'result' && selectedChoiceId && (
             <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 animate-in zoom-in-95 duration-500">
                <div className="flex flex-col md:flex-row gap-8">
                   <div className="flex-1 space-y-4">
                      <h3 className="text-lg font-serif text-white">Consequence</h3>
                      <p className="text-slate-300 leading-relaxed italic">
                        "{scenario.choices.find(c => c.id === selectedChoiceId)?.outcome}"
                      </p>
                      
                      <div className="pt-4">
                         <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Analysis</h4>
                         <p className="text-sm text-slate-400">
                           {scenario.choices.find(c => c.id === selectedChoiceId)?.explanation}
                         </p>
                         <p className="text-xs text-indigo-400 mt-2">
                           Target Concept: <strong>{getTargetBiasName()}</strong>
                         </p>
                      </div>
                   </div>
                   
                   <div className="w-full md:w-1/3 border-l border-zinc-800 pl-8 md:block hidden">
                      <div className="h-full flex flex-col justify-center text-center space-y-4">
                         <p className="text-slate-500 text-xs">Did you learn from this timeline?</p>
                         <button 
                           onClick={startSimulation}
                           className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors"
                         >
                           Next Scenario <ArrowRight size={16} />
                         </button>
                      </div>
                   </div>
                </div>
                
                {/* Mobile Button */}
                <button 
                   onClick={startSimulation}
                   className="w-full mt-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors md:hidden"
                 >
                   Next Scenario <ArrowRight size={16} />
                 </button>
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default AIInstructor;