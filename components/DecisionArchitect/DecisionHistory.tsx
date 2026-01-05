import React from 'react';
import { DecisionLog } from '../../types';
import { Calendar, ChevronRight, Trash2 } from 'lucide-react';

interface DecisionHistoryProps {
  logs: DecisionLog[];
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export const DecisionHistory: React.FC<DecisionHistoryProps> = ({ logs, onSelect, onDelete }) => {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/50">
        <p>No decision logs yet.</p>
        <p className="text-sm">Click "New Decision" to start.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {logs.map(log => (
        <div 
          key={log.id}
          className="group surface p-5 rounded-xl border border-transparent hover:border-zinc-700 transition-all cursor-pointer relative"
          onClick={() => onSelect(log.id)}
        >
          <div className="flex justify-between items-start">
            <div>
               <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    {log.title}
                  </h3>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      log.status === 'finalized' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                  }`}>
                    {log.status}
                  </span>
               </div>
               <p className="text-sm text-slate-500 line-clamp-2 pr-12">{log.description}</p>
            </div>
            
            <ChevronRight className="text-slate-600 group-hover:text-slate-300 transition-colors" />
          </div>

          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 text-xs text-slate-500">
             <div className="flex items-center gap-1">
                <Calendar size={12} />
                {new Date(log.timestamp).toLocaleDateString()}
             </div>
             <div>
                {log.detectedBiases.length} Risks Identified
             </div>
          </div>

          <button 
             onClick={(e) => { e.stopPropagation(); onDelete(log.id); }}
             className="absolute top-4 right-4 p-2 text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
             <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};
