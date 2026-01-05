import React, { useState, useEffect } from 'react';
import { BIASES, FALLACIES } from '../../constants';
import { generateBiasScenario, generateFallacyScenario } from '../../services/apiService';
import { BiasedSnippet, Bias, Fallacy, AppState } from '../../types';
import { TextCanvas, Highlight } from './TextCanvas';
import { Loader2, AlertCircle, CheckCircle, BrainCircuit, RefreshCw, Eye, ShieldAlert } from 'lucide-react';

interface BiasDetectorProps {
  state: AppState;
  updateProgress: (id: string, quality: number) => void;
}

export const BiasDetector: React.FC<BiasDetectorProps> = ({ state, updateProgress }) => {
  const [loading, setLoading] = useState(false);
  const [snippet, setSnippet] = useState<BiasedSnippet | null>(null);
  const [foundIds, setFoundIds] = useState<string[]>([]);
  const [selection, setSelection] = useState<{text: string, rect: DOMRect} | null>(null);
  const [feedback, setFeedback] = useState<{type: 'success' | 'error', msg: string} | null>(null);
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
    setFeedback({ type: 'success', msg: "Correct! " + targetSegment.explanation });
    
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
    <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6 pb-32">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif italic text-slate-100 flex items-center gap-2">
            {isPsychMode ? (
              <BrainCircuit className="w-8 h-8 text-indigo-400" />
            ) : (
              <ShieldAlert className="w-8 h-8 text-rose-400" />
            )}
            {isPsychMode ? 'Bias Detector' : 'Fallacy Finder'}
          </h1>
          <p className="text-slate-400 mt-1">
            Spot the {isPsychMode ? 'cognitive flaws' : 'logical errors'} in {isPsychMode ? 'scenarios' : 'dialogues'}.
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={context} 
            onChange={e => setContext(e.target.value)}
            className={`bg-zinc-800 border-zinc-700 text-slate-200 rounded px-3 py-2 text-sm focus:ring-2 ${isPsychMode ? 'focus:ring-indigo-500' : 'focus:ring-rose-500'}`}
          >
            <option>Workplace Email</option>
            <option>News Article</option>
            <option>Twitter Thread</option>
            <option>Sales Pitch</option>
            <option>Family Dinner Debate</option>
            {!isPsychMode && <option>Courtroom Cross-Examination</option>}
            {!isPsychMode && <option>Political Talk Show</option>}
          </select>
          <button 
            onClick={startGame}
            disabled={loading}
            className={`p-2 text-white rounded transition-colors disabled:opacity-50 ${isPsychMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-rose-600 hover:bg-rose-700'}`}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
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
        <div className="fixed inset-x-0 bottom-0 p-4 bg-zinc-900 border-t border-zinc-800 shadow-2xl z-50 animate-in slide-in-from-bottom-10">
           <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                 <p className="text-sm text-slate-500 mb-1">Selected text:</p>
                 <p className="text-white font-serif italic truncate max-w-lg">"{selection.text}"</p>
              </div>
              
              <div className="flex items-center gap-3 w-full md:w-auto">
                 <select 
                   className={`flex-1 md:w-64 bg-zinc-800 border-zinc-700 text-slate-200 rounded px-3 py-2 focus:ring-2 ${isPsychMode ? 'focus:ring-indigo-500' : 'focus:ring-rose-500'}`}
                   onChange={(e) => {
                     if (e.target.value) handleGuess(e.target.value);
                   }}
                   value=""
                 >
                   <option value="" disabled>Identify the {isPsychMode ? 'Bias' : 'Fallacy'}...</option>
                   {[...SourceList].sort((a,b) => a.name.localeCompare(b.name)).map(b => (
                     <option key={b.id} value={b.id}>{b.name}</option>
                   ))}
                 </select>
                 <button 
                   onClick={() => setSelection(null)}
                   className="px-3 py-2 text-slate-400 hover:text-slate-200"
                 >
                   Cancel
                 </button>
              </div>
           </div>
        </div>
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

