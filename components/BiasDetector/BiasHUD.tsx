import React, { useState, useMemo } from 'react';
import { Bias, Category, FallacyType } from '../../types';
import { Search, X, Grid, Brain, Zap, Users, Database } from 'lucide-react';

interface BiasHUDProps {
  selection: { text: string, rect: DOMRect };
  onCancel: () => void;
  onSelect: (id: string) => void;
  biasList: Bias[];
  accentColor: 'indigo' | 'rose';
}

export const BiasHUD: React.FC<BiasHUDProps> = ({ selection, onCancel, onSelect, biasList, accentColor }) => {
  const [filter, setFilter] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Group biases by category
  const categories = useMemo(() => {
    const groups: Record<string, Bias[]> = {};
    biasList.forEach(b => {
      // Fallback for Fallacies which use 'type' instead of 'category'
      // @ts-ignore
      const cat = b.category || b.type || 'Other';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(b);
    });
    return groups;
  }, [biasList]);

  const filteredBiases = useMemo(() => {
    if (activeCategory) return categories[activeCategory] || [];
    if (filter) return biasList.filter(b => b.name.toLowerCase().includes(filter.toLowerCase()));
    return [];
  }, [activeCategory, filter, biasList, categories]);

  const getCategoryIcon = (cat: string) => {
    const lower = cat.toLowerCase();
    if (lower.includes('social') || lower.includes('rhetorical')) return <Users size={16} />;
    if (lower.includes('decision') || lower.includes('formal')) return <Zap size={16} />;
    if (lower.includes('memory')) return <Database size={16} />;
    return <Brain size={16} />;
  };

  const accentClass = accentColor === 'indigo' ? 'text-indigo-400 border-indigo-500/30' : 'text-rose-400 border-rose-500/30';
  const hoverClass = accentColor === 'indigo' ? 'hover:bg-indigo-500/10 hover:border-indigo-500/50' : 'hover:bg-rose-500/10 hover:border-rose-500/50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#09090b]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Selection Context */}
        <div className="p-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Analyzing Selection</p>
              <p className="text-white font-serif italic text-lg line-clamp-2 border-l-2 border-slate-700 pl-4">
                "{selection.text}"
              </p>
            </div>
            <button onClick={onCancel} className="text-slate-500 hover:text-white transition-all p-4 -m-4 active:scale-90">
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Command Bar */}
        <div className="p-4 border-b border-white/5 bg-black/20 flex items-center gap-3">
          <Search size={18} className="text-slate-500" />
          <input 
            autoFocus
            type="text" 
            placeholder="Type to filter patterns..." 
            className="bg-transparent border-none outline-none text-white w-full placeholder:text-slate-600 font-mono text-base"
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setActiveCategory(null); }}
          />
        </div>

        {/* Grid Content */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Sidebar: Categories */}
          {!filter && (
            <div className="w-full md:w-48 border-b md:border-b-0 md:border-r border-white/5 bg-white/[0.01] overflow-x-auto md:overflow-y-auto p-2 flex md:flex-col gap-1 no-scrollbar">
              {Object.keys(categories).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`flex-shrink-0 text-left px-5 py-4 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 transition-all active:scale-95 ${
                    activeCategory === cat 
                      ? `bg-white/5 text-white ${accentClass} border` 
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {getCategoryIcon(cat)}
                  <span className="whitespace-nowrap">{cat.replace(/_/g, ' ')}</span>
                </button>
              ))}
            </div>
          )}

          {/* Main: Biases List */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#050505]">
            {!activeCategory && !filter ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 py-12 space-y-4">
                <Grid size={32} className="opacity-20" />
                <p className="text-xs uppercase tracking-widest font-bold text-center">Select a Category to begin analysis</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {filteredBiases.map(bias => (
                  <button
                    key={bias.id}
                    onClick={() => onSelect(bias.id)}
                    className={`text-left p-5 rounded-xl border border-white/5 bg-white/[0.02] group transition-all duration-200 active:scale-[0.97] ${hoverClass}`}
                  >
                    <h4 className="text-white font-bold text-sm mb-1 group-hover:text-white transition-colors">{bias.name}</h4>
                    <p className="text-[10px] text-slate-500 leading-tight line-clamp-2 group-hover:text-slate-400">
                      {bias.definition}
                    </p>
                  </button>
                ))}
                {filteredBiases.length === 0 && (
                  <p className="col-span-full text-center text-slate-500 text-xs py-8">No matches found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
