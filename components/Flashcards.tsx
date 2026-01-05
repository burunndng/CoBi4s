
import React, { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import { BIASES } from '../constants';
import { AppState } from '../types';
import { generateHint } from '../services/apiService';

interface FlashcardProps {
  state: AppState;
  updateProgress: (biasId: string, quality: number) => void;
  toggleFavorite: (biasId: string) => void;
}

const Flashcards: React.FC<FlashcardProps> = ({ state, updateProgress, toggleFavorite }) => {
  const [flipped, setFlipped] = useState(false);
  const [sessionQueue, setSessionQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hint, setHint] = useState<string | null>(null);
  const [loadingHint, setLoadingHint] = useState(false);

  useEffect(() => {
    let queue = BIASES.map(b => b.id);
    if (state.preferences.flashcardsOnlyFavorites) queue = queue.filter(id => state.favorites.includes(id));
    queue.sort((a, b) => (state.progress[a]?.nextReviewDate || 0) - (state.progress[b]?.nextReviewDate || 0));
    setSessionQueue(queue.slice(0, 10));
  }, [state.progress, state.favorites]);

  const handleGrade = (quality: number) => {
    const currentId = sessionQueue[currentIndex];
    updateProgress(currentId, quality);
    setFlipped(false);
    setHint(null);
    setTimeout(() => setCurrentIndex(prev => prev + 1), 300);
  };

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

  const bias = sessionQueue[currentIndex] ? BIASES.find(b => b.id === sessionQueue[currentIndex]) : null;

  if (currentIndex >= sessionQueue.length || !bias) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6 animate-fade-in">
        <h2 className="serif text-2xl text-white mb-2 italic">Practice Complete</h2>
        <p className="text-zinc-500 text-sm mb-6 uppercase tracking-widest font-bold">Metrics Updated</p>
        <button onClick={() => window.location.hash = '#/'} className="btn-primary px-8 py-3 rounded-md text-xs font-bold uppercase tracking-widest">Return to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center px-2">
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Protocol {currentIndex + 1} / {sessionQueue.length}</span>
        <button onClick={() => toggleFavorite(bias.id)} className="text-zinc-500 hover:text-white transition-colors">
          <Star size={18} fill={state.favorites.includes(bias.id) ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="relative h-[400px] cursor-pointer" onClick={() => setFlipped(!flipped)}>
        <div className={`relative w-full h-full transition-transform duration-500 transform-gpu [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
          
          {/* Front */}
          <div className="absolute inset-0 [backface-visibility:hidden] surface rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-2xl">
            <span className="text-[10px] font-mono text-zinc-500 uppercase mb-8 tracking-[0.2em]">Identify</span>
            <h3 className="serif text-4xl text-white tracking-tight leading-tight italic">{bias.name}</h3>
            
            <div className="mt-12">
              {hint ? (
                <p className="text-xs text-zinc-400 font-medium max-w-xs leading-relaxed animate-fade-in">{hint}</p>
              ) : (
                <button 
                  onClick={handleGenerateHint} 
                  disabled={loadingHint}
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-white transition-colors flex items-center gap-2"
                >
                  {loadingHint ? <Loader2 size={12} className="animate-spin" /> : "Request Hint"}
                </button>
              )}
            </div>
          </div>

          {/* Back */}
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] surface rounded-xl p-10 flex flex-col justify-center shadow-2xl bg-[#0b0b0d]">
            <span className="text-[10px] font-mono text-zinc-500 uppercase mb-4 tracking-[0.2em]">Definition</span>
            <p className="text-white text-lg leading-relaxed mb-8 italic">"{bias.definition}"</p>
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-lg">
               <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-2 tracking-widest">Mitigation</span>
               <p className="text-xs text-zinc-300 leading-relaxed font-medium">{bias.counterStrategy}</p>
            </div>
          </div>

        </div>
      </div>

      <div className={`grid grid-cols-3 gap-3 transition-all duration-300 ${flipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <button onClick={(e) => { e.stopPropagation(); handleGrade(1); }} className="py-4 rounded-md border border-zinc-800 text-red-500/80 hover:bg-red-500/5 text-[10px] font-bold uppercase tracking-widest">Failure</button>
        <button onClick={(e) => { e.stopPropagation(); handleGrade(3); }} className="py-4 rounded-md border border-zinc-800 text-zinc-400 hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest">Partial</button>
        <button onClick={(e) => { e.stopPropagation(); handleGrade(5); }} className="py-4 rounded-md border border-zinc-800 text-white hover:bg-white/5 text-[10px] font-bold uppercase tracking-widest">Acquired</button>
      </div>
    </div>
  );
};

export default Flashcards;
