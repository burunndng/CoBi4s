import React, { useState } from 'react';
import { AppState, DecisionLog } from '../../types';
import { Plus, History, Scale } from 'lucide-react';
import { InputForm } from './InputForm';
import { AuditReport } from './AuditReport';
import { DecisionHistory } from './DecisionHistory';

interface DecisionArchitectProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const DecisionArchitect: React.FC<DecisionArchitectProps> = ({ state, setState }) => {
  const [view, setView] = useState<'list' | 'new' | 'view'>('list');
  const [activeLogId, setActiveLogId] = useState<string | null>(null);

  const activeLog = activeLogId ? state.decisionLogs.find(l => l.id === activeLogId) : null;

  const handleCreate = (log: DecisionLog) => {
    setState(prev => ({
      ...prev,
      decisionLogs: [log, ...prev.decisionLogs]
    }));
    setActiveLogId(log.id);
    setView('view');
  };

  const handleUpdate = (updatedLog: DecisionLog) => {
    setState(prev => ({
      ...prev,
      decisionLogs: prev.decisionLogs.map(l => l.id === updatedLog.id ? updatedLog : l)
    }));
  };

  const handleDelete = (id: string) => {
     setState(prev => ({
      ...prev,
      decisionLogs: prev.decisionLogs.filter(l => l.id !== id)
    }));
    if (activeLogId === id) {
        setView('list');
        setActiveLogId(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-32 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-white/5 pb-8">
        <div>
          <h1 className="serif text-5xl font-light text-white italic flex items-center gap-4">
            <Scale className="w-10 h-10 text-rose-500" />
            Decision Audit
          </h1>
          <p className="text-slate-500 mt-2 text-[10px] uppercase tracking-[0.3em] font-bold">
            Risk Assessment // Pre-Mortem Protocol
          </p>
        </div>
        
        <div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-xl border border-white/5">
           <button 
             onClick={() => setView('list')}
             className={`px-8 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${
               view === 'list' ? 'bg-white/10 text-white shadow-lg border border-white/10' : 'text-slate-500 hover:text-slate-300'
             }`}
           >
             <History size={14} className="inline mr-2 -mt-0.5" />
             Log
           </button>
           <button 
             onClick={() => { setView('new'); setActiveLogId(null); }}
             className={`px-8 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${
               view === 'new' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : 'text-slate-500 hover:text-white hover:bg-white/5'
             }`}
           >
             <Plus size={14} className="inline mr-2 -mt-0.5" />
             New Audit
           </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {view === 'list' && (
          <DecisionHistory 
            logs={state.decisionLogs} 
            onSelect={(id) => { setActiveLogId(id); setView('view'); }} 
            onDelete={handleDelete}
          />
        )}

        {view === 'new' && (
          <InputForm 
            onComplete={handleCreate} 
            onCancel={() => setView('list')}
          />
        )}

        {view === 'view' && activeLog && (
          <AuditReport 
            log={activeLog} 
            onUpdate={handleUpdate}
            onBack={() => setView('list')}
          />
        )}
      </div>
    </div>
  );
};
