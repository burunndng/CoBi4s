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
  MessageSquareQuote,
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

    // Check if selection matches quote (fuzzy match)
    const targetSegment = snippet.segments[0];
    const cleanSelection = selection.text.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanQuote = targetSegment.quote.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (cleanQuote.includes(cleanSelection) || cleanSelection.includes(cleanQuote)) {
      setPhase('repair');
    } else {
      setError("Incorrect part selected. Where is the logical error?");
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
            className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm transition-colors"
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
        <div className="surface p-12 text-center rounded-2xl border border-zinc-800 space-y-6">
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
            className="btn-primary bg-rose-600 hover:bg-rose-700 px-8 py-3 rounded-xl"
          >
            Initialize Lab
          </button>
        </div>
      ) : null}

      {/* Identify Phase */}
      {phase === 'identify' && snippet && (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
          <div className="relative">
             <h3 className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-2 pl-1">
               Find the "{targetFallacy?.name}"
             </h3>
             <TextCanvas 
               text={snippet.text} 
               highlights={getHighlights()} 
               onSelection={handleSelection} 
             />
          </div>

          <div className="bg-zinc-900/50 p-4 rounded-xl border border-zinc-800 text-sm text-slate-400">
             <p>Highlight the specific part of the statement that commits the <strong>{targetFallacy?.name}</strong>.</p>
             <p className="text-xs text-slate-500 mt-1 italic">Hint: {targetFallacy?.definition}</p>
          </div>

          {/* Selection Modal */}
          {selection && (
            <div className="fixed inset-x-0 bottom-0 p-4 bg-zinc-900 border-t border-zinc-800 shadow-2xl z-50 animate-in slide-in-from-bottom-10">
               <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex-1">
                     <p className="text-sm text-slate-500 mb-1">Selected text:</p>
                     <p className="text-white font-serif italic truncate max-w-lg">"{selection.text}"</p>
                  </div>
                  
                  <div className="flex gap-3">
                     <button 
                       onClick={() => setSelection(null)}
                       className="px-4 py-2 text-slate-400 hover:text-white"
                     >
                       Cancel
                     </button>
                     <button 
                       onClick={handleIdentify}
                       className="btn-primary bg-rose-600 hover:bg-rose-700 px-6 py-2 rounded-lg flex items-center gap-2"
                     >
                       Confirm Logic Flaw <ChevronRight size={18} />
                     </button>
                  </div>
               </div>
            </div>
          )}

          {error && (
            <div className="fixed top-4 right-4 p-4 bg-rose-900/90 border border-rose-700 text-rose-100 rounded-lg shadow-xl z-50 animate-in slide-in-from-right flex items-center gap-3">
               <AlertCircle size={20} /> {error}
            </div>
          )}
        </div>
      )}

      {/* Repair Phase */}
      {phase === 'repair' && snippet && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
           <div className="bg-emerald-900/10 border border-emerald-800/30 p-4 rounded-xl flex items-start gap-3">
              <CheckCircle className="text-emerald-500 shrink-0 mt-0.5" size={18} />
              <div>
                <p className="text-emerald-200 text-sm font-bold">Spot on! You found the logical flaw.</p>
                <p className="text-emerald-500/70 text-xs mt-1">Now, let's fix it.</p>
              </div>
           </div>

           <div className="space-y-4">
              <label className="text-sm font-medium text-slate-400">Your Challenge: Repair the Argument</label>
              
              <div className="bg-zinc-900/30 rounded-2xl border border-zinc-800 overflow-hidden">
                 <div className="p-4 border-b border-zinc-800 bg-zinc-900/50">
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-2">Analysis</p>
                    <TextCanvas 
                      text={snippet.text} 
                      highlights={getHighlights()} 
                      onSelection={() => {}} 
                    />
                 </div>
                 
                 <div className="p-6">
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-widest mb-3">Steel Man Version</p>
                    <textarea 
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-rose-500 outline-none h-32 resize-none"
                      placeholder="Rewrite the argument to be logically sound but keep the core point..."
                      value={userRepair}
                      onChange={e => setUserRepair(e.target.value)}
                    />
                    <p className="text-[10px] text-slate-600 mt-3">
                        Tip: Remove character attacks, emotional manipulation, or structural errors. Focus on verifiable premises.
                    </p>
                 </div>
              </div>
           </div>

           <div className="flex justify-end gap-3">
              <button 
                onClick={handleRepairSubmit}
                disabled={loading || userRepair.length < 10}
                className="btn-primary bg-rose-600 hover:bg-rose-700 px-8 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Wand2 size={20} />}
                Submit for Evaluation
              </button>
           </div>
        </div>
      )}

      {/* Result Phase */}
      {phase === 'result' && evaluation && snippet && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
           <div className="text-center space-y-2">
              <div className="inline-block px-4 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold uppercase tracking-widest">
                Lab Report
              </div>
              <h2 className="text-4xl font-serif text-white">Repair Score: {evaluation.score}%</h2>
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
