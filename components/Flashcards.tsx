
import React, { useState, useEffect } from 'react';
import { Star, Loader2, Shuffle, Type, BookOpen, RotateCw, Target, Send, X, Brain } from 'lucide-react';
import { BIASES } from '../constants';
import { AppState, TransferLog } from '../types';
import { generateHint, generateAIPoweredScenario } from '../services/apiService';
import { TransferTips } from './shared/TransferTips';

interface FlashcardProps {
  state: AppState;
  updateProgress: (biasId: string, quality: number) => void;
  toggleFavorite: (biasId: string) => void;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const Flashcards: React.FC<FlashcardProps> = ({ state, updateProgress, toggleFavorite, setState }) => {
  const [flipped, setFlipped] = useState(false);
  const [sessionQueue, setSessionQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);
  
  // Neural Bridge (Reality Log) State
  const [showBridge, setShowBridge] = useState(false);
  const [logNote, setLogNote] = useState('');
  const [logContext, setLogContext] = useState<TransferLog['context']>('work');
  const [logImpact, setLogImpact] = useState(3);

  const bias = sessionQueue[currentIndex] ? BIASES.find(b => b.id === sessionQueue[currentIndex]) : null;

  const handleGrade = (quality: number) => {
    const currentId = sessionQueue[currentIndex];
    updateProgress(currentId, quality);
    
    // If Acquired (5), offer the Neural Bridge
    if (quality === 5) {
      setShowBridge(true);
    } else {
      advanceCard();
    }
  };

  const advanceCard = () => {
    setFlipped(false);
    setHint(null);
    setDynamicScenario(null);
    setShowBridge(false);
    setLogNote('');
    setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
  };

  const submitRealityLog = () => {
    if (!bias) return;
    const newLog: TransferLog = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      biasId: bias.id,
      context: logContext,
      note: logNote.slice(0, 150),
      impact: logImpact
    };

    setState(prev => ({
      ...prev,
      totalXp: prev.totalXp + 50,
      transferLogs: [newLog, ...prev.transferLogs].slice(0, 50) // Sentinel Pruning
    }));

    advanceCard();
  };

  const bias = sessionQueue[currentIndex] ? BIASES.find(b => b.id === sessionQueue[currentIndex]) : null;
  const currentProgress = bias ? state.progress[bias.id] : null;
  const masteryLevel = currentProgress?.masteryLevel || 0;

  const handleGenerateHint = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!bias || loadingHint) return;
    setLoadingHint(true);
    try {
      const h = await generateHint(bias.name);
      setHint(h);
    } catch (e) {
      setHint("Think about the name...");
    } finally {
      setLoadingHint(false);
    }
  };

  const handleRefreshScenario = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!bias || loadingScenario) return;
    setLoadingScenario(true);
    try {
      const scenario = await generateAIPoweredScenario(bias);
      setDynamicScenario(scenario);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingScenario(false);
    }
  };

  if (currentIndex >= sessionQueue.length || !bias) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6 animate-fade-in">
        <h2 className="serif text-2xl text-white mb-2 italic">Practice Complete</h2>
        <p className="text-zinc-500 text-sm mb-6 uppercase tracking-widest font-bold">Metrics Updated</p>
        <button onClick={() => window.location.hash = '#/'} className="btn-primary px-8 py-3 rounded-md text-xs font-bold uppercase tracking-widest">Return to Dashboard</button>
      </div>
    );
  }

  // Content Logic
  const frontContent = cardMode === 'term' ? (
    <>
      <span className="text-[10px] font-mono text-zinc-500 uppercase mb-8 tracking-[0.2em]">Identify</span>
      <h3 className="serif text-4xl text-white tracking-tight leading-tight italic">{bias.name}</h3>
    </>
  ) : (
    <>
       <span className="text-[10px] font-mono text-zinc-500 uppercase mb-6 tracking-[0.2em]">
         {dynamicScenario ? 'Simulated Context' : 'Example Scenario'}
       </span>
       <p className="serif text-xl md:text-2xl text-white italic leading-relaxed max-w-sm">
         "{dynamicScenario || bias.example}"
       </p>
    </>
  );

  const backContent = cardMode === 'term' ? (
    <>
      <span className="text-[10px] font-mono text-zinc-500 uppercase mb-4 tracking-[0.2em]">Definition</span>
      <p className="text-white text-lg leading-relaxed mb-6 italic">"{bias.definition}"</p>
      
      <div className="space-y-3 w-full">
         <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg w-full">
            <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 tracking-widest">Example</span>
            <p className="text-xs text-zinc-300 leading-relaxed font-medium">"{bias.example}"</p>
         </div>
         <TransferTips cues={bias.transferCues} />
      </div>
    </>
  ) : (
    <>
      <span className="text-[10px] font-mono text-zinc-500 uppercase mb-4 tracking-[0.2em]">Concept</span>
      <h3 className="serif text-3xl text-white italic mb-2">{bias.name}</h3>
      <p className="text-zinc-400 text-sm leading-relaxed mb-6">"{bias.definition}"</p>
      <div className="space-y-3 w-full">
        <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg w-full">
           <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1 tracking-widest">Mitigation</span>
           <p className="text-xs text-zinc-300 leading-relaxed font-medium">{bias.counterStrategy}</p>
        </div>
        <TransferTips cues={bias.transferCues} />
      </div>
    </>
  );

  return (
    <div className="max-w-xl mx-auto py-8 space-y-8 animate-fade-in relative">
      {/* ⚡️ NEURAL BRIDGE DRAWER */}
      {showBridge && (
        <div className="absolute inset-x-0 -bottom-8 z-50 animate-in slide-in-from-bottom duration-500">
           <div className="surface p-8 rounded-t-[2rem] border-t border-indigo-500/30 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] space-y-6">
              <div className="flex justify-between items-center">
                 <div className="flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">
                   <Brain size={16} /> Neural_Bridge_Protocol
                 </div>
                 <button onClick={advanceCard} className="text-zinc-500 hover:text-white p-2">
                   <X size={20} />
                 </button>
              </div>

              <div className="space-y-4">
                 <div className="text-white text-lg serif italic leading-tight">
                   Where did you observe "{bias.name}" in the wild today?
                 </div>
                 <textarea 
                   autoFocus
                   value={logNote}
                   onChange={e => setLogNote(e.target.value)}
                   placeholder="Briefly describe the context (max 150 chars)..."
                   className="w-full bg-black/40 border border-white/5 rounded-2xl p-5 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500/50 transition-all h-32 resize-none italic font-light"
                 />
              </div>

              <div className="flex flex-wrap gap-2">
                 {(['work', 'social', 'internal', 'news'] as const).map(ctx => (
                   <button 
                     key={ctx}
                     onClick={() => setLogContext(ctx)}
                     className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border ${
                       logContext === ctx ? 'bg-indigo-500/10 border-indigo-500/40 text-indigo-100' : 'bg-white/5 border-white/5 text-zinc-500'
                     }`}
                   >
                     {ctx}
                   </button>
                 ))}
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-white/5">
                 <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Impact</span>
                    <div className="flex gap-1">
                       {[1,2,3,4,5].map(v => (
                         <button 
                           key={v}
                           onClick={() => setLogImpact(v)}
                           className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-mono transition-all ${
                             logImpact >= v ? 'bg-indigo-500 text-white' : 'bg-white/5 text-zinc-600'
                           }`}
                         >
                           {v}
                         </button>
                       ))}
                    </div>
                 </div>
                 <button 
                   onClick={submitRealityLog}
                   className="bg-white text-black px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 active:scale-95 transition-all shadow-xl"
                 >
                   LOG_CONTEXT (+50 XP) <Send size={14} />
                 </button>
              </div>
           </div>
        </div>
      )}
      <div className="flex justify-between items-center px-2">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-2">Protocol {currentIndex + 1} / {sessionQueue.length}</span>
        
        <div className="flex gap-4">
           {/* Mode Toggle */}
           <div className="flex bg-zinc-900 p-1.5 rounded-xl border border-zinc-800">
              <button 
                onClick={() => setCardMode('term')}
                className={`p-3 rounded-lg transition-all active:scale-90 ${cardMode === 'term' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Term Mode"
              >
                <Type size={18} />
              </button>
              <button 
                onClick={() => setCardMode('scenario')}
                className={`p-3 rounded-lg transition-all active:scale-90 ${cardMode === 'scenario' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                title="Scenario Mode"
              >
                <BookOpen size={18} />
              </button>
           </div>

           <button onClick={() => toggleFavorite(bias.id)} className="text-zinc-500 hover:text-white transition-all p-3.5 -m-1 active:scale-75">
             <Star size={20} fill={state.favorites.includes(bias.id) ? "currentColor" : "none"} />
           </button>
        </div>
      </div>

      <div 
        className="relative h-[420px] cursor-pointer group active:scale-[0.99] transition-transform" 
        style={{ perspective: '1000px' }}
        onClick={() => setFlipped(!flipped)}
      >
        <div 
          className="relative w-full h-full transition-transform duration-500"
          style={{ 
            transformStyle: 'preserve-3d',
            transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
          }}
        >
          
          {/* Front */}
          <div 
            className="absolute inset-0 surface rounded-xl p-10 flex flex-col items-center justify-center text-center shadow-2xl border border-zinc-800/50 group-hover:border-zinc-700/50 transition-colors"
            style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
          >
            
            {/* Mastery Indicator (Front) */}
            <div className="absolute top-6 right-6 flex flex-col items-end">
               <div className="flex items-center gap-2">
                 <div className={`w-1.5 h-1.5 rounded-full ${masteryLevel >= 80 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : masteryLevel >= 50 ? 'bg-amber-500' : 'bg-zinc-700'}`}></div>
                 <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Mastery</span>
               </div>
               <span className="text-xs font-mono text-zinc-300 tabular-nums">{masteryLevel}%</span>
            </div>

            {frontContent}
            
            <div className="mt-12 flex flex-col sm:flex-row gap-4" onClick={e => e.stopPropagation()}>
              {cardMode === 'scenario' && (
                 <button 
                   onClick={handleRefreshScenario}
                   disabled={loadingScenario}
                   className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-indigo-400 transition-all flex items-center justify-center gap-2 px-5 py-3 rounded-xl hover:bg-zinc-900 active:scale-95 border border-transparent hover:border-zinc-800"
                 >
                   {loadingScenario ? <Loader2 size={12} className="animate-spin" /> : <Shuffle size={12} />}
                   New Scenario
                 </button>
              )}

              {hint ? (
                <p className="text-xs text-zinc-400 font-medium max-w-xs leading-relaxed animate-fade-in text-center px-4">{hint}</p>
              ) : (
                <button 
                  onClick={handleGenerateHint} 
                  disabled={loadingHint}
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-amber-400 transition-all flex items-center justify-center gap-2 px-5 py-3 rounded-xl hover:bg-zinc-900 active:scale-95 border border-transparent hover:border-zinc-800"
                >
                  {loadingHint ? <Loader2 size={12} className="animate-spin" /> : "Request Hint"}
                </button>
              )}
            </div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 surface rounded-xl p-10 flex flex-col items-center justify-center text-center shadow-2xl bg-[#0b0b0d] border border-zinc-800"
            style={{ 
              backfaceVisibility: 'hidden', 
              WebkitBackfaceVisibility: 'hidden', 
              transform: 'rotateY(180deg)' 
            }}
          >
            {backContent}
          </div>

        </div>
      </div>

      <div className={`grid grid-cols-3 gap-3 transition-all duration-300 ${flipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button onClick={(e) => { e.stopPropagation(); handleGrade(1); }} className="py-4 rounded-md border border-zinc-800 text-red-500/80 hover:bg-red-500/5 text-[10px] font-bold uppercase tracking-widest transition-colors">Failure</button>
        <button onClick={(e) => { e.stopPropagation(); handleGrade(3); }} className="py-4 rounded-md border border-zinc-800 text-zinc-400 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-colors">Partial</button>
        <button onClick={(e) => { e.stopPropagation(); handleGrade(5); }} className="py-4 rounded-md border border-zinc-800 text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest transition-colors">Acquired</button>
      </div>
    </div>
  );
};

export default Flashcards;
