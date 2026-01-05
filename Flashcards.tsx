
import React, { useState, useEffect } from 'react';
import { RefreshCw, Star, RotateCw } from 'lucide-react';
import { BIASES } from '../constants';
import { AppState } from '../types';
import { callOpenRouter } from '../services/apiService';

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

  const generateHint = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!bias) return;
    try {
      const response = await callOpenRouter([
        { role: "system", content: "Hint generator." },
        { role: "user", content: `Hint for "${bias.name}" max 10 words.` }
      ]);
      setHint(response.trim());
    } catch (e) {
      setHint("Think about the name...");
    }
  };

  const bias = sessionQueue[currentIndex] ? BIASES.find(b => b.id === sessionQueue[currentIndex]) : null;

  if (currentIndex >= sessionQueue.length || !bias) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center p-6 animate-fade-in">
        <h2 className="serif text-2xl text-white mb-2">Session Complete</h2>
        <p className="text-slate-400 text-sm mb-6">Queue cleared. Review updated.</p>
        <button onClick={() => window.location.hash = '#/'} className="px-6 py-2 bg-white text-black font-semibold rounded-lg">Return to Overview</button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-8 space-y-8 animate-fade-in">
      <div className="flex justify-between items-center px-2">
        <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Card {currentIndex + 1} / {sessionQueue.length}</span>
        <button onClick={() => toggleFavorite(bias.id)} className="text-slate-500 hover:text-yellow-500">
          <Star size={18} fill={state.favorites.includes(bias.id) ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="relative h-[400px] cursor-pointer perspective-1000" onClick={() => setFlipped(!flipped)}>
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${flipped ? 'rotate-y-180' : ''}`}>
          
          {/* Front */}
          <div className="absolute inset-0 backface-hidden surface rounded-xl p-12 flex flex-col items-center justify-center text-center shadow-2xl border-white/10">
            <span className="text-xs font-mono text-slate-500 uppercase mb-6">Concept</span>
            <h3 className="serif text-3xl text-white tracking-tight leading-tight">{bias.name}</h3>
            {hint && <p className="mt-8 text-sm text-blue-400 font-medium">{hint}</p>}
            {!hint && <button onClick={generateHint} className="mt-8 text-xs text-slate-600 hover:text-white transition-colors">Request Hint</button>}
          </div>

          {/* Back */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 surface rounded-xl p-10 flex flex-col justify-center shadow-2xl bg-[#09090b]">
            <span className="text-xs font-mono text-slate-500 uppercase mb-4">Definition</span>
            <p className="text-white text-lg leading-relaxed mb-6">{bias.definition}</p>
            <div className="p-4 bg-white/5 rounded-lg border border-white/5">
               <span className="text-xs font-mono text-slate-500 uppercase block mb-1">Strategy</span>
               <p className="text-sm text-slate-300">{bias.counterStrategy}</p>
            </div>
          </div>

        </div>
      </div>

      <div className={`grid grid-cols-3 gap-4 transition-opacity duration-300 ${flipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <button onClick={() => handleGrade(1)} className="py-3 rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 text-sm font-medium">Missed</button>
        <button onClick={() => handleGrade(3)} className="py-3 rounded-lg border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 text-sm font-medium">Hard</button>
        <button onClick={() => handleGrade(5)} className="py-3 rounded-lg border border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/10 text-sm font-medium">Easy</button>
      </div>
    </div>
  );
};

export default Flashcards;
