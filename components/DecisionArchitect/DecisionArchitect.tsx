import React, { useState } from 'react';
import { AppState, DecisionLog } from '../../types';
import { Plus, History, BrainCircuit } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto space-y-6 pb-24 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="serif text-3xl text-slate-100 flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-rose-500" />
            Decision Architect
          </h1>
          <p className="text-slate-500 mt-1">
            Pre-mortem analysis to identify blind spots before you commit.
          </p>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={() => setView('list')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'list' ? 'bg-zinc-800 text-white' : 'text-slate-400 hover:text-white'}`}
           >
             <History size={18} className="inline mr-2" />
             History
           </button>
           <button 
             onClick={() => { setView('new'); setActiveLogId(null); }}
             className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center"
           >
             <Plus size={18} className="mr-2" />
             New Decision
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
