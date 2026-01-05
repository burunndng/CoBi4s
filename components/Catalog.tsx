
import React, { useState, useMemo } from 'react';
import { Search, Filter, Bookmark, Scale, Brain } from 'lucide-react';
import { BIASES, FALLACIES } from '../constants';
import { AppState, Bias, Category, Fallacy, FallacyType } from '../types';

interface CatalogProps {
  state: AppState;
  toggleFavorite: (id: string) => void;
}

const Catalog: React.FC<CatalogProps> = ({ state, toggleFavorite }) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | FallacyType | 'all'>('all');
  const [activeItem, setActiveItem] = useState<Bias | Fallacy | null>(null);

  const isPsychMode = state.mode === 'psychology';

  const filteredItems = useMemo(() => {
    const source = isPsychMode ? BIASES : FALLACIES;
    return source.filter(item => {
      const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase()) || 
                          item.definition.toLowerCase().includes(query.toLowerCase());
      
      let matchesCategory = selectedCategory === 'all';
      if (!matchesCategory) {
        if (isPsychMode) {
          matchesCategory = (item as Bias).category === selectedCategory;
        } else {
          matchesCategory = (item as Fallacy).type === selectedCategory;
        }
      }
      
      return matchesQuery && matchesCategory;
    }).sort((a, b) => a.name.localeCompare(b.name));
  }, [query, selectedCategory, isPsychMode]);

  const categories = isPsychMode ? Object.values(Category) : Object.values(FallacyType);

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-[#27272a] pb-6">
        <div>
          <h1 className="serif text-3xl text-white flex items-center gap-3">
            {isPsychMode ? <Brain className="text-indigo-400" /> : <Scale className="text-rose-400" />}
            {isPsychMode ? 'Bias Registry' : 'Fallacy Codex'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {isPsychMode ? 'Database of cognitive patterns.' : 'Database of logical errors.'}
          </p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
          <input 
            type="text" 
            placeholder={`Search ${isPsychMode ? 'biases' : 'fallacies'}...`}
            className="w-full bg-[#121215] border border-[#27272a] text-white pl-9 pr-3 py-2.5 text-sm rounded-lg focus:outline-none focus:border-white/20 transition-colors placeholder:text-zinc-700"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors ${
            selectedCategory === 'all' 
              ? 'bg-white text-black' 
              : 'text-slate-500 hover:text-white hover:bg-white/5'
          }`}
        >
          All
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat as any)}
            className={`px-3 py-1.5 rounded-md text-[11px] font-bold uppercase tracking-wider transition-colors ${
              selectedCategory === cat 
                ? (isPsychMode ? 'bg-indigo-500 text-white' : 'bg-rose-500 text-white')
                : 'text-slate-500 hover:text-white hover:bg-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map(item => {
           const progressSource = isPsychMode ? state.progress : state.fallacyProgress;
           const mastery = progressSource[item.id]?.masteryLevel || 0;
           const typeLabel = isPsychMode ? (item as Bias).category : (item as Fallacy).type;

           return (
            <div 
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="surface surface-hover p-6 rounded-xl cursor-pointer group flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">
                  {typeLabel}
                </span>
                {mastery >= 80 && (
                  <div className={`w-1.5 h-1.5 rounded-full ${isPsychMode ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                )}
              </div>

              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-zinc-300 transition-colors">{item.name}</h3>
              <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed mb-6 flex-1">{item.definition}</p>
              
              {/* Mastery Bar */}
              <div className="w-full bg-[#27272a] h-0.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${isPsychMode ? 'bg-indigo-500' : 'bg-rose-500'}`} 
                  style={{ width: `${mastery}%` }}
                ></div>
              </div>
            </div>
           );
        })}
      </div>

      {/* Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setActiveItem(null)}>
          <div className="surface w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-8 border-b border-[#27272a] flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                   {isPsychMode ? (activeItem as Bias).category : (activeItem as Fallacy).type}
                </span>
                <h2 className="serif text-3xl text-white mt-2">{activeItem.name}</h2>
              </div>
              <button onClick={() => toggleFavorite(activeItem.id)} className="text-slate-500 hover:text-white transition-colors">
                <Bookmark size={20} fill={state.favorites.includes(activeItem.id) ? "currentColor" : "none"} />
              </button>
            </div>
            
            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Definition</h4>
                <p className="text-slate-200 leading-relaxed text-sm md:text-base">{activeItem.definition}</p>
              </div>

              {(!isPsychMode && (activeItem as Fallacy).structure) && (
                <div className="bg-rose-950/20 p-4 rounded border border-rose-900/30">
                  <h4 className="text-xs font-bold text-rose-400 uppercase tracking-widest mb-2">Logical Structure</h4>
                  <p className="text-rose-100 font-mono text-xs">{ (activeItem as Fallacy).structure }</p>
                </div>
              )}
              
              <div className="pl-4 border-l-2 border-white/10">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Example</h4>
                <p className="text-slate-300 italic text-sm">"{activeItem.example}"</p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                  {isPsychMode ? 'Mitigation Strategy' : 'Counter Strategy'}
                </h4>
                <p className="text-white font-medium text-sm">{activeItem.counterStrategy}</p>
              </div>
            </div>

            <div className="p-4 border-t border-[#27272a] bg-[#09090b] flex justify-end">
              <button onClick={() => setActiveItem(null)} className="px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Close Panel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Catalog;
