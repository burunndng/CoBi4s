import React, { useState } from 'react';
import { AppState, AlgorithmTest, Bias, Fallacy } from '../../types';
import { BIASES, FALLACIES } from '../../constants';
import { runAlgorithmTest } from '../../services/apiService';
import { Terminal } from './Terminal';
import { LogicCanvas } from './LogicCanvas';
import { TestHistory } from './TestHistory';
import { Binary, Plus, History, Play, Loader2, Sparkles, Wand2 } from 'lucide-react';

interface AlgorithmTrainerProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const AlgorithmTrainer: React.FC<AlgorithmTrainerProps> = ({ state, setState }) => {
  const [view, setView] = useState<'history' | 'new' | 'view'>('history');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<Bias | Fallacy | null>(null);
  const [logicMap, setLogicMap] = useState('');

  const activeTest = selectedId ? state.algorithmTests.find(t => t.id === selectedId) : null;
  const SourceList = state.mode === 'psychology' ? BIASES : FALLACIES;

  const handleStartTest = async () => {
    if (!selectedConcept || !logicMap.trim()) return;
    
    setLoading(true);
    try {
      const result = await runAlgorithmTest(selectedConcept.name, selectedConcept.definition, logicMap);
      
      const newTest: AlgorithmTest = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        biasId: selectedConcept.id,
        pseudoCode: logicMap, // Storing description in existing field
        results: result.results,
        overallAssessment: result.overallAssessment,
        status: result.status,
        ast: result.ast
      };

      setState(prev => ({
        ...prev,
        algorithmTests: [newTest, ...prev.algorithmTests]
      }));
      
      setSelectedId(newTest.id);
      setView('view');
    } catch (e) {
      alert("Compiler error: Failed to connect to logic engine.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTest = (id: string) => {
    setState(prev => ({
      ...prev,
      algorithmTests: prev.algorithmTests.filter(t => t.id !== id)
    }));
    if (selectedId === id) setView('history');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="serif text-5xl font-light text-white italic flex items-center gap-4">
            <Binary className="w-10 h-10 text-indigo-400" />
            Algorithm Trainer
          </h1>
          <p className="text-slate-500 mt-2 text-[10px] uppercase tracking-[0.3em] font-bold">
            Logic Synthesis // Cognitive Deconstruction
          </p>
        </div>
        
        <div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-xl border border-white/5">
           <button 
             onClick={() => setView('history')}
             className={`px-8 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${view === 'history' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
           >
             <History size={14} className="inline mr-2 -mt-0.5" />
             Archived
           </button>
           <button 
             onClick={() => { setView('new'); setSelectedId(null); setLogicMap(''); }}
             className={`px-8 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${view === 'new' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' : 'text-slate-500 hover:text-white'}`}
           >
             <Plus size={14} className="inline mr-2 -mt-0.5" />
             New Build
           </button>
        </div>
      </div>

      <div className="min-h-[500px]">
        {view === 'history' && (
          <TestHistory 
            tests={state.algorithmTests} 
            onSelect={(id) => { setSelectedId(id); setView('view'); }} 
            onDelete={deleteTest}
          />
        )}

        {view === 'new' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-4 duration-500">
             <div className="space-y-6">
                <div className="surface p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Concept_Core</h3>
                   <select 
                     className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-indigo-500/50 outline-none mb-6 cursor-pointer hover:bg-black/60 transition-all"
                     onChange={(e) => setSelectedConcept(SourceList.find(b => b.id === e.target.value) || null)}
                     value={selectedConcept?.id || ''}
                   >
                     <option value="" disabled>Target Cognitive Concept...</option>
                     {SourceList.map(item => (
                       <option key={item.id} value={item.id} className="bg-zinc-950">{item.name}</option>
                     ))}
                   </select>
                   {selectedConcept && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                        <p className="text-slate-400 text-sm leading-relaxed italic serif">"{selectedConcept.definition}"</p>
                        <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                           <p className="text-[10px] text-indigo-400/70 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                             <Sparkles size={10} /> Pattern_Anchor
                           </p>
                           <p className="text-xs text-indigo-100 font-medium leading-relaxed italic">"{selectedConcept.example}"</p>
                        </div>
                     </div>
                   )}
                   <div className="absolute right-0 bottom-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none"></div>
                </div>

                <div className="bg-indigo-950/10 border border-indigo-500/10 p-8 rounded-3xl space-y-4">
                   <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] flex items-center gap-2">
                      <Wand2 size={14} /> Mapping_Rules
                   </h4>
                   <ul className="text-xs text-indigo-200/60 space-y-3 font-medium">
                      <li className="flex gap-3"><span className="text-indigo-500 font-mono">01</span> Describe your logic in plain, honest English.</li>
                      <li className="flex gap-3"><span className="text-indigo-500 font-mono">02</span> Identify the "If/Then" triggers in your mind.</li>
                      <li className="flex gap-3"><span className="text-indigo-500 font-mono">03</span> The compiler will extract your Logic Circuit.</li>
                   </ul>
                </div>
             </div>

             <div className="lg:col-span-2 space-y-8">
                <LogicCanvas 
                  value={logicMap} 
                  onChange={setLogicMap} 
                  disabled={loading}
                />
                
                <div className="flex justify-end pt-4">
                   <button 
                     onClick={handleStartTest}
                     disabled={loading || !selectedConcept || !logicMap.trim()}
                     className="px-12 py-5 bg-white text-black hover:bg-indigo-50 disabled:opacity-50 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-4 transition-all active:scale-95 shadow-2xl shadow-indigo-900/20 group"
                   >
                     {loading ? <Loader2 className="animate-spin" size={20} /> : <Binary size={20} className="group-hover:scale-125 transition-transform" />}
                     {loading ? 'Synthesizing Circuit...' : 'Compile Logic Map'}
                   </button>
                </div>
             </div>
          </div>
        )}

        {view === 'view' && activeTest && (
          <Terminal test={activeTest} onBack={() => setView('history')} />
        )}
      </div>
    </div>
  );
};

