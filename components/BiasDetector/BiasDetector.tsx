import React, { useState, useEffect } from 'react';
import { BIASES, FALLACIES } from '../../constants';
import { generateBiasScenario, generateFallacyScenario } from '../../services/apiService';
import { BiasedSnippet, Bias, Fallacy, AppState } from '../../types';
import { TextCanvas, Highlight } from '../shared/TextCanvas';
import { TransferTips } from '../shared/TransferTips';
import { Loader2, AlertCircle, CheckCircle, BrainCircuit, RefreshCw, Eye, ShieldAlert } from 'lucide-react';
import { BiasHUD } from './BiasHUD';

interface BiasDetectorProps {
  state: AppState;
  updateProgress: (id: string, quality: number) => void;
}

export const BiasDetector: React.FC<BiasDetectorProps> = ({ state, updateProgress }) => {
  const [loading, setLoading] = useState(false);
  const [snippet, setSnippet] = useState<BiasedSnippet | null>(null);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [selection, setSelection] = useState<{text: string, rect: DOMRect} | null>(null);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', msg: string, cues?: string[]} | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [context, setContext] = useState("Workplace Email");

  const isPsychMode = state.mode === 'psychology';
  const accentColor = isPsychMode ? 'indigo' : 'rose';
  const SourceList = isPsychMode ? BIASES : FALLACIES;

  const startGame = async () => {
    setLoading(true);
    setFoundIds([]);
    setSelection(null);
    setShowAnswer(false);
    setFeedback(null);
    setSnippet(null);
    
    const shuffled = [...SourceList].sort(() => 0.5 - Math.random());
    const targets = shuffled.slice(0, 3);
    
    try {
      const data = isPsychMode 
        ? await generateBiasScenario(targets as Bias[], context)
        : await generateFallacyScenario(targets as Fallacy[], context);
      setSnippet(data);
    } catch (e) {
      console.error(e);
      setFeedback({ type: 'error', msg: `Failed to generate ${isPsychMode ? 'bias' : 'fallacy'} scenario. Try again.` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startGame();
  }, [state.mode]); // Restart when mode changes

  const handleSelection = (text: string, rect: DOMRect | null) => {
    setFeedback(null);
    if (!text || !rect) {
      setSelection(null);
      return;
    }
    setSelection({ text, rect });
  };

  const handleGuess = (id: string) => {
    if (!snippet || !selection) return;

    const targetSegment = snippet.segments.find(s => s.biasId === id);
    
    if (!targetSegment) {
       setFeedback({ type: 'error', msg: `That ${isPsychMode ? 'bias' : 'fallacy'} isn't hidden in this text!` });
       return;
    }

    const cleanSelection = selection.text.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanQuote = targetSegment.quote.toLowerCase().replace(/[^a-z0-9]/g, '');

    if (!cleanQuote.includes(cleanSelection) && !cleanSelection.includes(cleanQuote)) {
       setFeedback({ type: 'error', msg: "Right identification, but wrong text selected!" });
       return;
    }

    if (foundIds.includes(id)) {
        setFeedback({ type: 'error', msg: "You already found this one!" });
        return;
    }

    // Success
    setFoundIds(prev => [...prev, id]);
    setSelection(null);
    setFeedback({ 
      type: 'success', 
      msg: "Correct! " + targetSegment.explanation,
      cues: targetSegment.cues 
    });
    
    // Update progress: detecting it correctly in a scenario is high quality (5)
    updateProgress(id, 5);
  };

  const getHighlights = (): Highlight[] => {
    if (!snippet) return [];
    
    return snippet.segments.map(seg => {
      const start = snippet.text.indexOf(seg.quote);
      if (start === -1) return null;
      
      const isFound = foundIds.includes(seg.biasId);
      const isRevealed = showAnswer;
      
      if (!isFound && !isRevealed) return null;

      return {
        start,
        end: start + seg.quote.length,
        type: isFound ? 'found' : 'revealed',
        label: SourceList.find(b => b.id === seg.biasId)?.name
      };
    }).filter(Boolean) as Highlight[];
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="serif text-5xl font-light text-white italic flex items-center gap-4">
            {isPsychMode ? (
              <BrainCircuit className="w-10 h-10 text-indigo-400" />
            ) : (
              <ShieldAlert className="w-10 h-10 text-rose-400" />
            )}
            {isPsychMode ? 'Bias Detector' : 'Fallacy Finder'}
          </h1>
          <p className="text-slate-500 mt-2 text-[10px] uppercase tracking-[0.3em] font-bold">
            Pattern Recognition // {isPsychMode ? 'Cognitive Flaws' : 'Logical Errors'}
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-white/[0.03] p-1 rounded-xl border border-white/5">
          <select 
            value={context} 
            onChange={e => setContext(e.target.value)}
            className="bg-transparent text-slate-300 text-xs font-bold uppercase tracking-wider px-4 py-2 outline-none cursor-pointer hover:text-white"
          >
            <option className="bg-zinc-950">Workplace Email</option>
            <option className="bg-zinc-950">News Article</option>
            <option className="bg-zinc-950">Twitter Thread</option>
            <option className="bg-zinc-950">Sales Pitch</option>
            <option className="bg-zinc-950">Family Dinner Debate</option>
            {!isPsychMode && <option className="bg-zinc-950">Courtroom Cross-Examination</option>}
            {!isPsychMode && <option className="bg-zinc-950">Political Talk Show</option>}
          </select>
          <button 
            onClick={startGame}
            disabled={loading}
            className={`p-2 rounded-lg transition-all ${loading ? 'bg-white/5' : 'bg-white/10 hover:bg-white/20 text-white'}`}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-500 gap-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <p>Generating {isPsychMode ? 'scenario' : 'dialogue'}...</p>
        </div>
      ) : snippet ? (
        <div className="relative">
          <TextCanvas 
            text={snippet.text} 
            highlights={getHighlights()} 
            onSelection={handleSelection} 
          />

          {feedback?.type === 'success' && feedback.cues && (
            <TransferTips cues={feedback.cues} />
          )}
          
          <div className="mt-6 flex flex-wrap gap-4 items-start justify-between">
             <div className="space-y-2">
                <h3 className="text-slate-400 text-sm font-medium uppercase tracking-wider">
                  Hidden {isPsychMode ? 'Biases' : 'Fallacies'}: {foundIds.length} / {snippet.segments.length}
                </h3>
                <div className="flex gap-2">
                   {snippet.segments.map((seg, i) => (
                      <div 
                        key={i} 
                        className={`w-3 h-3 rounded-full ${foundIds.includes(seg.biasId) ? 'bg-green-500' : 'bg-zinc-700'}`}
                      />
                   ))}
                </div>
             </div>

             <div className="flex gap-3">
               <button 
                 onClick={() => setShowAnswer(!showAnswer)}
                 className="flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white transition-colors"
               >
                 <Eye className="w-4 h-4" />
                 {showAnswer ? 'Hide Answers' : 'Reveal Answers'}
               </button>
             </div>
          </div>
        </div>
      ) : null}

      {selection && !loading && !showAnswer && (
        <BiasHUD 
          selection={selection}
          onCancel={() => setSelection(null)}
          onSelect={handleGuess}
          biasList={SourceList as Bias[]}
          accentColor={accentColor}
        />
      )}

      {feedback && (
        <div className={`fixed top-4 right-4 p-4 rounded shadow-lg border z-50 animate-in slide-in-from-right flex items-center gap-3 ${
            feedback.type === 'success' ? 'bg-green-900/90 border-green-700 text-green-100' : 'bg-red-900/90 border-red-700 text-red-100'
        }`}>
            {feedback.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p>{feedback.msg}</p>
        </div>
      )}
    </div>
  );
};

