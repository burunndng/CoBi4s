import React, { useState } from 'react';
import { AppState, AlgorithmTest, Bias, Fallacy } from '../../types';
import { BIASES, FALLACIES } from '../../constants';
import { runAlgorithmTest } from '../../services/apiService';
import { Terminal } from './Terminal';
import { CodeEditor } from './CodeEditor';
import { TestHistory } from './TestHistory';
import { Binary, Plus, History, Play, Loader2 } from 'lucide-react';

interface AlgorithmTrainerProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const AlgorithmTrainer: React.FC<AlgorithmTrainerProps> = ({ state, setState }) => {
  const [view, setView] = useState<'history' | 'new' | 'view'>('history');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<Bias | Fallacy | null>(null);
  const [pseudoCode, setPseudoCode] = useState('');

  const activeTest = selectedId ? state.algorithmTests.find(t => t.id === selectedId) : null;
  const SourceList = state.mode === 'psychology' ? BIASES : FALLACIES;

  const handleStartTest = async () => {
    if (!selectedConcept || !pseudoCode.trim()) return;
    
    setLoading(true);
    try {
      const result = await runAlgorithmTest(selectedConcept.name, selectedConcept.definition, pseudoCode);
      
      const newTest: AlgorithmTest = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        biasId: selectedConcept.id,
        pseudoCode,
        results: result.results,
        overallAssessment: result.overallAssessment,
        status: result.status
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
          <h1 className="serif text-3xl text-slate-100 flex items-center gap-3">
            <Binary className="w-8 h-8 text-indigo-400" />
            Algorithm Trainer
          </h1>
          <p className="text-slate-500 mt-1 italic">
            Convert fuzzy thinking into precise logical code.
          </p>
        </div>
        
        <div className="flex gap-2">
           <button 
             onClick={() => setView('history')}
             className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === 'history' ? 'bg-zinc-800 text-white' : 'text-slate-400 hover:text-white'}`}
           >
             <History size={18} className="inline mr-2" />
             Logs
           </button>
           <button 
             onClick={() => { setView('new'); setSelectedId(null); setPseudoCode(''); }}
             className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center shadow-lg shadow-indigo-900/20"
           >
             <Plus size={18} className="mr-2" />
             New Program
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
                <div className="surface p-6 rounded-xl border border-zinc-800">
                   <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Target Specification</h3>
                   <select 
                     className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none mb-4"
                     onChange={(e) => setSelectedConcept(SourceList.find(b => b.id === e.target.value) || null)}
                     value={selectedConcept?.id || ''}
                   >
                     <option value="" disabled>Select concept to program...</option>
                     {SourceList.map(item => (
                       <option key={item.id} value={item.id}>{item.name}</option>
                     ))}
                   </select>
                   {selectedConcept && (
                     <div className="space-y-4 animate-in fade-in duration-300">
                        <p className="text-slate-400 text-sm leading-relaxed">{selectedConcept.definition}</p>
                        <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                           <p className="text-[10px] text-zinc-600 uppercase font-bold mb-1">Textbook Example</p>
                           <p className="text-xs text-zinc-400 italic">"{selectedConcept.example}"</p>
                        </div>
                     </div>
                   )}
                </div>

                <div className="bg-indigo-900/10 border border-indigo-800/30 p-6 rounded-xl space-y-3">
                   <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                      <Play size={12} /> Execution Instructions
                   </h4>
                   <ul className="text-xs text-indigo-200/70 space-y-2 list-disc pl-4">
                      <li>Use pseudo-code (if/then/else) to describe the logic.</li>
                      <li>Be as precise as possible about the trigger conditions.</li>
                      <li>The compiler will run 3 adversarial test cases.</li>
                   </ul>
                </div>
             </div>

             <div className="lg:col-span-2 space-y-6">
                <CodeEditor 
                  value={pseudoCode} 
                  onChange={setPseudoCode} 
                  disabled={loading}
                />
                
                <div className="flex justify-end">
                   <button 
                     onClick={handleStartTest}
                     disabled={loading || !selectedConcept || !pseudoCode.trim()}
                     className="px-10 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl font-bold flex items-center gap-3 transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-indigo-900/40"
                   >
                     {loading ? <Loader2 className="animate-spin" size={20} /> : <Play size={20} fill="currentColor" />}
                     {loading ? 'Compiling Logic...' : 'Compile & Run Tests'}
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
