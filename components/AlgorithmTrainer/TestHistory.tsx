import React from 'react';
import { AlgorithmTest } from '../../types';
import { BIASES, FALLACIES } from '../../constants';
import { Calendar, ChevronRight, Trash2, Code2 } from 'lucide-react';

interface TestHistoryProps {
  tests: AlgorithmTest[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TestHistory: React.FC<TestHistoryProps> = ({ tests, onSelect, onDelete }) => {
  if (tests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
        <Code2 size={40} className="mb-4 text-zinc-800" />
        <p className="font-medium">No logic logs detected.</p>
        <p className="text-xs text-slate-600 mt-1 italic">Initialize a "New Program" to begin testing.</p>
      </div>
    );
  }

  const getConceptName = (id: string) => {
    return [...BIASES, ...FALLACIES].find(b => b.id === id)?.name || id;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {tests.map(test => (
        <div 
          key={test.id}
          className="group surface p-5 rounded-2xl border border-transparent hover:border-zinc-700 transition-all cursor-pointer relative flex flex-col active:scale-[0.98]"
          onClick={() => onSelect(test.id)}
        >
          <div className="flex justify-between items-start mb-3">
            <div>
               <h3 className="font-bold text-slate-200 group-hover:text-white transition-colors">
                 {getConceptName(test.biasId)}
               </h3>
               <p className="text-xs text-slate-500 font-mono mt-1 italic uppercase">STATUS: {test.status.toUpperCase()}</p>
            </div>
            <div className={`w-2 h-2 rounded-full mt-1.5 ${
               test.status === 'compiled' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
               test.status === 'buggy' ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]' : 
               'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]'
            }`} />
          </div>

          <div className="bg-zinc-950/50 p-3 rounded-lg border border-zinc-900 mb-4 flex-1">
             <pre className="text-[10px] text-zinc-600 font-mono line-clamp-3 whitespace-pre-wrap">
                {test.pseudoCode}
             </pre>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-500 border-t border-white/5 pt-3">
             <div className="flex items-center gap-1">
                <Calendar size={10} />
                {new Date(test.timestamp).toLocaleDateString()}
             </div>
             <div className="flex items-center gap-1 group-hover:text-indigo-400 transition-colors uppercase tracking-widest font-bold">
                View Trace <ChevronRight size={10} />
             </div>
          </div>

          <button 
             onClick={(e) => { e.stopPropagation(); onDelete(test.id); }}
             className="absolute top-4 right-4 p-4 -m-4 text-slate-700 hover:text-red-400 lg:opacity-0 lg:group-hover:opacity-100 transition-all active:scale-90"
          >
             <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
