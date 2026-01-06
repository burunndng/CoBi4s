import React, { useState, useEffect } from 'react';
import { FALLACIES } from '../../constants';
import { generateLabStatement, evaluateRepair } from '../../services/apiService';
import { Fallacy, AppState, BiasedSnippet } from '../../types';
import { TextCanvas, Highlight } from '../shared/TextCanvas';
import { TransferTips } from '../shared/TransferTips';
import { 
  Loader2, 
  FlaskConical, 
  ChevronRight, 
  CheckCircle, 
  AlertCircle, 
  RotateCcw, 
  Wand2, 
  ArrowRight
} from 'lucide-react';

interface LogicLabProps {
  state: AppState;
  updateProgress: (id: string, quality: number) => void;
}

type LabPhase = 'setup' | 'identify' | 'repair' | 'result';

export const LogicLab: React.FC<LogicLabProps> = ({ state, updateProgress }) => {
  const [phase, setPhase] = useState<LabPhase>('setup');
  const [loading, setLoading] = useState(false);
  const [targetFallacy, setTargetFallacy] = useState<Fallacy | null>(null);
  const [snippet, setSnippet] = useState<BiasedSnippet | null>(null);
  const [selection, setSelection] = useState<{text: string, rect: DOMRect} | null>(null);
  const [userRepair, setUserRepair] = useState('');
  const [evaluation, setEvaluation] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const startLab = async () => {
    setLoading(true);
    setError(null);
    setPhase('setup');
    setSelection(null);
    setUserRepair('');
    setEvaluation(null);
    
    const shuffled = [...FALLACIES].sort(() => 0.5 - Math.random());
    const target = shuffled[0];
    setTargetFallacy(target);

    try {
      const data = await generateLabStatement(target);
      setSnippet(data);
      setPhase('identify');
    } catch (err) {
      setError("Failed to start lab. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelection = (text: string, rect: DOMRect | null) => {
    setError(null);
    if (!text || !rect) {
      setSelection(null);
      return;
    }
    setSelection({ text, rect });
  };

  const handleIdentify = () => {
    if (!snippet || !selection || !targetFallacy) return;

    const targetSegment = snippet.segments[0];
    const userText = selection.text.toLowerCase().trim();
    const targetQuote = targetSegment.quote.toLowerCase().trim();

    // Check for significant overlap or containment
    // 1. Exact or substring match (already handled but repeated for clarity)
    const isSubstring = targetQuote.includes(userText) || userText.includes(targetQuote);
    
    // 2. Word overlap check (for fuzzy matching)
    const userWords = userText.split(/\s+/).filter(w => w.length > 3);
    const targetWords = targetQuote.split(/\s+/).filter(w => w.length > 3);
    const commonWords = userWords.filter(w => targetWords.some(tw => tw.includes(w) || w.includes(tw)));
    
    const overlapRatio = commonWords.length / Math.max(targetWords.length, 1);
    
    // Allow if user found at least 40% of the significant words
    if (isSubstring || overlapRatio > 0.4) {
      setPhase('repair');
    } else {
      setError("Not quite. You're looking for the specific part that contains the logical error.");
    }
  };

  const getHighlights = (): Highlight[] => {
    if (!snippet || !targetFallacy) return [];
    
    // Only show highlight AFTER successful ID (in repair phase or later)
    if (phase === 'identify' || phase === 'setup') return [];

    const targetSegment = snippet.segments[0];
    const start = snippet.text.indexOf(targetSegment.quote);
    if (start === -1) return [];

    return [{
      start,
      end: start + targetSegment.quote.length,
      type: 'found',
      label: targetFallacy.name
    }];
  };

  const handleRepairSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await evaluateRepair(snippet!.text, targetFallacy!.name, userRepair);
      setEvaluation(result);
      setPhase('result');
      
      const quality = Math.ceil(result.score / 20); 
      updateProgress(targetFallacy!.id, quality);
    } catch (err) {
      setError("AI evaluation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStrategies = () => {
    if (!targetFallacy) return [];
    // Generic strategies based on fallacy type could be expanded
    return [
      { label: "Steel Man", text: "If I understand correctly, your strongest point is..." },
      { label: "Focus on Logic", text: "Setting aside the emotional content, the logical claim is..." },
      { label: "Grant Premise", text: "Even if we accept that premise, it doesn't follow that..." },
      { label: "Ask for Evidence", text: "What specific evidence supports the claim that..." }
    ];
  };

  const addStrategy = (text: string) => {
    setUserRepair(prev => prev ? prev + " " + text : text);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-24">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
        <div>
          <h1 className="serif text-3xl text-slate-100 flex items-center gap-3">
            <FlaskConical className="w-8 h-8 text-rose-500" />
            Logic Lab
          </h1>
          <p className="text-slate-500 mt-1">Practice the art of 'Argument Repair'.</p>
        </div>
        
        {phase === 'result' && (
          <button 
            onClick={startLab}
            className="flex items-center gap-2 px-5 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-all active:scale-95"
          >
            <RotateCcw size={16} /> New Experiment
          </button>
        )}
      </div>

      {loading && phase === 'setup' ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Preparing logical specimen...</p>
        </div>
      ) : phase === 'setup' ? (
        <div className="surface p-8 md:p-12 text-center rounded-2xl border border-zinc-800 space-y-6 mx-4 md:mx-0">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto">
            <FlaskConical className="w-10 h-10 text-rose-500" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-white">Ready to dismantle fallacies?</h2>
            <p className="text-slate-400 mt-2 max-w-sm mx-auto text-sm">
              We'll give you a broken argument. You identify the flaw and rebuild it to be logically sound.
            </p>
          </div>
          <button 
            onClick={startLab}
            className="btn-primary bg-rose-600 hover:bg-rose-700 px-10 py-4 rounded-2xl active:scale-95 transition-all shadow-xl shadow-rose-900/20"
          >
            Initialize Lab
          </button>
        </div>
      ) : null}

      {/* Identify Phase */}
      {phase === 'identify' && snippet && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 px-4 md:px-0">
          <div className="relative">
             <h3 className="text-[10px] font-bold text-rose-500 uppercase tracking-[0.3em] mb-4 pl-1">
               Protocol: Find the "{targetFallacy?.name}"
             </h3>
             <TextCanvas 
               text={snippet.text} 
               highlights={getHighlights()} 
               onSelection={handleSelection} 
             />
          </div>

          <div className="bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800 text-sm text-slate-400">
             <p className="mb-2">Highlight the specific part of the statement that commits the <strong>{targetFallacy?.name}</strong>.</p>
             <p className="text-xs text-slate-500 italic">Hint: {targetFallacy?.definition}</p>
          </div>

          {/* Selection Modal */}
          {selection && (
            <div className="fixed inset-x-0 bottom-0 p-6 bg-zinc-900 border-t border-zinc-800 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] z-50 animate-in slide-in-from-bottom-10">
               <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex-1 w-full">
                     <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-2">Selected text segment:</p>
                     <p className="text-white font-serif italic line-clamp-2 md:line-clamp-3">"{selection.text}"</p>
                  </div>
                  
                  <div className="flex gap-4 w-full md:w-auto">
                     <button 
                       onClick={() => setSelection(null)}
                       className="flex-1 md:flex-none px-6 py-4 text-slate-400 hover:text-white active:scale-95 transition-all font-bold uppercase text-[10px] tracking-widest"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={handleIdentify}
                       className="flex-1 md:flex-none btn-primary bg-rose-600 hover:bg-rose-700 px-8 py-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg shadow-rose-900/20"
                     >
                       Confirm Logic Flaw <ChevronRight size={18} />
                     </button>
                  </div>
               </div>
            </div>
          )}

          {error && (
            <div className="fixed top-4 left-4 right-4 md:left-auto md:w-96 p-5 bg-rose-900 border border-rose-700 text-rose-100 rounded-xl shadow-2xl z-[60] animate-in slide-in-from-top md:slide-in-from-right flex items-start gap-4">
               <AlertCircle size={24} className="shrink-0 text-rose-300" /> 
               <p className="text-sm font-medium">{error}</p>
            </div>
          )}
        </div>
      )}

      {/* Repair Phase */}
      {phase === 'repair' && snippet && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 px-4 md:px-0">
           <div className="bg-emerald-900/10 border border-emerald-800/30 p-5 rounded-2xl flex items-start gap-4">
              <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-emerald-200 text-sm font-bold">Detection Confirmed.</p>
                <p className="text-emerald-500/70 text-xs mt-1 uppercase tracking-widest">Initialization: Repair Sequence</p>
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 ml-1">Repairing logical structure</label>
              
              <div className="bg-zinc-900/30 rounded-3xl border border-zinc-800 overflow-hidden">
                 <div className="p-6 border-b border-zinc-800 bg-zinc-900/50">
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-3">Isolate Flaw</p>
                    <TextCanvas 
                      text={snippet.text} 
                      highlights={getHighlights()} 
                      onSelection={() => {}} 
                    />
                 </div>
                 
                 <div className="p-6 md:p-8">
                    <div className="flex flex-wrap gap-2 mb-6">
                       {getStrategies().map((strat, i) => (
                         <button 
                           key={i}
                           onClick={() => addStrategy(strat.text)}
                           className="px-5 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-[11px] font-bold text-indigo-300 hover:bg-indigo-900/30 hover:border-indigo-500/50 transition-all active:scale-90"
                         >
                           {strat.label}
                         </button>
                       ))}
                    </div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-3">Steel Man Reconstruction</p>
                    <textarea 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl p-6 text-white focus:ring-1 focus:ring-rose-500 outline-none h-48 resize-none text-base font-serif italic"
                      placeholder="Rewrite the argument to be logically sound..."
                      value={userRepair}
                      onChange={e => setUserRepair(e.target.value)}
                    />
                 </div>
              </div>
           </div>

           <div className="flex justify-end gap-3 pt-4">
              <button 
                onClick={handleRepairSubmit}
                disabled={loading || userRepair.length < 10}
                className="w-full md:w-auto btn-primary bg-rose-600 hover:bg-rose-700 px-10 py-5 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95 transition-all shadow-xl shadow-rose-900/40"
              >
                {loading ? <Loader2 className="animate-spin" size={24} /> : <Wand2 size={24} />}
                <span className="font-bold">SUBMIT FOR EVALUATION</span>
              </button>
           </div>
        </div>
      )}

      {/* Result Phase */}
      {phase === 'result' && evaluation && snippet && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
           <div className="text-center space-y-4">
              <div className="inline-block px-4 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-widest">
                Lab Report
              </div>
              <h2 className="text-5xl font-serif text-white">{evaluation.score}%</h2>
              
              <div className="flex justify-center gap-8 pt-2">
                 <MetricItem label="Logic" value={evaluation.breakdown?.logic || 0} color="rose" />
                 <MetricItem label="Intent" value={evaluation.breakdown?.intent || 0} color="indigo" />
                 <MetricItem label="Clarity" value={evaluation.breakdown?.clarity || 0} color="emerald" />
              </div>
           </div>

           {evaluation.cues && <TransferTips cues={evaluation.cues} />}

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="surface p-6 rounded-2xl border border-zinc-800 space-y-4">
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Professor's Feedback</h4>
                 <p className="text-slate-200 leading-relaxed text-sm">{evaluation.feedback}</p>
              </div>

              <div className="surface p-6 rounded-2xl border border-rose-900/30 bg-rose-950/5 space-y-4">
                 <h4 className="text-xs font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2">
                   <CheckCircle size={14} /> The Master Repair
                 </h4>
                 <p className="text-slate-200 leading-relaxed italic text-sm">"{evaluation.improvedVersion}"</p>
              </div>
           </div>

           <div className="surface p-8 rounded-2xl border border-zinc-800">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">Process Comparison</h4>
              <div className="space-y-4">
                 <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center shrink-0 text-[10px] font-bold">1</div>
                    <div className="flex-1">
                       <p className="text-xs text-slate-500 uppercase font-bold mb-1">Original (Broken)</p>
                       <p className="text-slate-400 text-sm italic">"{snippet.text}"</p>
                    </div>
                 </div>
                 <div className="h-8 border-l-2 border-zinc-800 ml-3"></div>
                 <div className="flex items-start gap-4">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center shrink-0 text-[10px] font-bold">2</div>
                    <div className="flex-1">
                       <p className="text-xs text-slate-500 uppercase font-bold mb-1">Your Repair</p>
                       <p className="text-slate-200 text-sm">"{userRepair}"</p>
                    </div>
                 </div>
              </div>
           </div>

           <div className="pt-8 text-center">
              <button 
                onClick={startLab}
                className="btn-primary bg-rose-600 hover:bg-rose-700 px-12 py-4 rounded-2xl font-bold shadow-xl shadow-rose-900/20 flex items-center gap-2 mx-auto"
              >
                Next Experiment <ArrowRight size={20} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

const MetricItem: React.FC<{ label: string; value: number; color: 'rose' | 'indigo' | 'emerald' }> = ({ label, value, color }) => {
  const colorMap = {
    rose: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
  };

  const barColor = {
    rose: 'bg-rose-500',
    indigo: 'bg-indigo-500',
    emerald: 'bg-emerald-500'
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`px-3 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-tighter ${colorMap[color]}`}>
        {label}
      </div>
      <div className="text-xl font-mono text-white">{value}%</div>
      <div className="w-16 h-1 bg-zinc-800 rounded-full overflow-hidden">
        <div className={`h-full transition-all duration-1000 ${barColor[color]}`} style={{ width: `${value}%` }}></div>
      </div>
    </div>
  );
};
