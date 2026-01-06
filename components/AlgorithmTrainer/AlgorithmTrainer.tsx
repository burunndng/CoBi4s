import React, { useState } from 'react';
import { AppState, AlgorithmTest, Bias, Fallacy } from '../../types';
import { BIASES, FALLACIES } from '../../constants';
import { runAlgorithmTest } from '../../services/apiService';
import { Terminal } from './Terminal';
import { DeconstructionBoard } from './DeconstructionBoard';
import { TestHistory } from './TestHistory';
import { Binary, Plus, History, Play, Loader2, Sparkles, Fingerprint, CheckCircle2 } from 'lucide-react';
import { generateDeconstructionCase } from '../../services/apiService';

interface AlgorithmTrainerProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const AlgorithmTrainer: React.FC<AlgorithmTrainerProps> = ({ state, setState }) => {
  const [view, setView] = useState<'history' | 'new' | 'view'>('history');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatingCase, setGeneratingCase] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<Bias | Fallacy | null>(null);
  
  // Forensic State
  const [forensicCase, setForensicCase] = useState<{ scenario: string, fragments: any[] } | null>(null);
  const [assignments, setAssignments] = useState<Record<string, string | null>>({
    TRIGGER: null,
    DISTORTION: null,
    REALITY: null
  });
  const [validation, setValidation] = useState<{ isCorrect: boolean, feedback: string } | null>(null);

  const activeTest = selectedId ? state.algorithmTests.find(t => t.id === selectedId) : null;
  const SourceList = state.mode === 'psychology' ? BIASES : FALLACIES;

  // 🕵️‍♀️ Generate Forensic Case
  const handleConceptSelect = async (conceptId: string) => {
    const concept = SourceList.find(b => b.id === conceptId) || null;
    setSelectedConcept(concept);
    setAssignments({ TRIGGER: null, DISTORTION: null, REALITY: null });
    setValidation(null);
    setForensicCase(null);
    
    if (concept) {
      setGeneratingCase(true);
      try {
        const c = await generateDeconstructionCase(concept.name, concept.definition);
        setForensicCase(c);
      } catch (e) {
        alert("Forensic generation failed.");
      } finally {
        setGeneratingCase(false);
      }
    }
  };

  const handleAssign = (slot: string, fragmentId: string) => {
    setAssignments(prev => ({ ...prev, [slot]: fragmentId || null }));
    setValidation(null); // Reset validation on change
  };

  const handleValidate = () => {
    if (!forensicCase) return;
    
    // Check correctness
    let isCorrect = true;
    const errors: string[] = [];

    // Map fragment IDs to their types
    const fragMap = new Map(forensicCase.fragments.map(f => [f.id, f.type]));

    if (fragMap.get(assignments.TRIGGER!) !== 'TRIGGER') {
      isCorrect = false;
      errors.push("Incorrect Trigger identified.");
    }
    if (fragMap.get(assignments.DISTORTION!) !== 'DISTORTION') {
      isCorrect = false;
      errors.push("Incorrect Distortion identified.");
    }
    if (fragMap.get(assignments.REALITY!) !== 'REALITY') {
      isCorrect = false;
      errors.push("Incorrect Reality identified.");
    }

    const feedback = isCorrect 
      ? "Perfect analysis. You correctly isolated the cognitive signal from the noise." 
      : `Forensic Mismatch: ${errors[0] || 'Check your assignments.'} Re-examine the evidence.`;

    setValidation({ isCorrect, feedback });

    // If correct, save to history
    if (isCorrect) {
       saveTestResult(feedback);
    }
  };

  const saveTestResult = (feedback: string) => {
    if (!selectedConcept || !forensicCase) return;

    const newTest: AlgorithmTest = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      biasId: selectedConcept.id,
      pseudoCode: `CASE: "${forensicCase.scenario.slice(0, 30)}..."\n[TRIGGER]: ${assignments.TRIGGER}\n[DISTORTION]: ${assignments.DISTORTION}\n[REALITY]: ${assignments.REALITY}`,
      results: [],
      overallAssessment: feedback,
      status: 'compiled',
      ast: undefined // No AST for forensic mode
    };

    setState(prev => ({
      ...prev,
      algorithmTests: [newTest, ...prev.algorithmTests]
    }));
  };

  const deleteTest = (id: string) => {
    setState(prev => ({
      ...prev,
      algorithmTests: prev.algorithmTests.filter(t => t.id !== id)
    }));
    if (selectedId === id) setView('history');
  };

  const isAssignmentIncomplete = !assignments.TRIGGER || !assignments.DISTORTION || !assignments.REALITY;

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-24 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
        <div>
          <h1 className="serif text-5xl font-light text-white italic flex items-center gap-4">
            <Fingerprint className="w-10 h-10 text-indigo-400" />
            Pattern Deconstructor
          </h1>
          <p className="text-slate-500 mt-2 text-[10px] uppercase tracking-[0.3em] font-bold">
            Forensic Analysis // Signal Isolation
          </p>
        </div>
        
        <div className="flex gap-2 bg-white/[0.03] p-1.5 rounded-xl border border-white/5">
           <button 
             onClick={() => setView('history')}
             className={`px-8 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${view === 'history' ? 'bg-white/10 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
           >
             <History size={14} className="inline mr-2 -mt-0.5" />
             Case Files
           </button>
           <button 
             onClick={() => { setView('new'); setSelectedId(null); setAssignments({TRIGGER:null, DISTORTION:null, REALITY:null}); setForensicCase(null); }}
             className={`px-8 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 ${view === 'new' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-900/20' : 'text-slate-500 hover:text-white'}`}
           >
             <Plus size={14} className="inline mr-2 -mt-0.5" />
             New Analysis
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
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Control Panel */}
                <div className="lg:col-span-1 surface p-8 rounded-3xl border border-white/5 relative overflow-hidden group">
                   <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">Target_Profile</h3>
                   <select 
                     className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-indigo-500/50 outline-none mb-6 cursor-pointer hover:bg-black/60 transition-all"
                     onChange={(e) => handleConceptSelect(e.target.value)}
                     value={selectedConcept?.id || ''}
                   >
                     <option value="" disabled>Select pattern to analyze...</option>
                     {SourceList.map(item => (
                       <option key={item.id} value={item.id} className="bg-zinc-950">{item.name}</option>
                     ))}
                   </select>
                   {selectedConcept && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-500">
                        <p className="text-slate-400 text-sm leading-relaxed italic serif">"{selectedConcept.definition}"</p>
                        <div className="p-5 bg-indigo-500/5 rounded-2xl border border-indigo-500/10">
                           <p className="text-[10px] text-indigo-400/70 uppercase font-black tracking-widest mb-2 flex items-center gap-2">
                             <Fingerprint size={10} /> Mission_Brief
                           </p>
                           <p className="text-[10px] text-indigo-200 font-bold uppercase tracking-widest leading-relaxed">
                             Isolate the Trigger, the Distortion, and the Reality from the noise.
                           </p>
                        </div>
                     </div>
                   )}
                </div>

                {/* Deconstruction Board */}
                <div className="lg:col-span-2 space-y-8">
                   <DeconstructionBoard 
                     scenario={forensicCase?.scenario || ''} 
                     fragments={forensicCase?.fragments || []} 
                     assignments={assignments} 
                     onAssign={handleAssign} 
                     loading={generatingCase}
                     validation={validation}
                   />
                   
                   {forensicCase && (
                    <div className="flex justify-end pt-4">
                        <button 
                          onClick={handleValidate}
                          disabled={isAssignmentIncomplete || !!validation?.isCorrect}
                          className="px-12 py-5 bg-white text-black hover:bg-indigo-50 disabled:opacity-50 rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] flex items-center gap-4 transition-all active:scale-95 shadow-xl shadow-indigo-900/20 group"
                        >
                          {validation?.isCorrect ? <CheckCircle2 size={20} className="text-emerald-600" /> : <Fingerprint size={20} className="group-hover:scale-125 transition-transform" />}
                          {validation?.isCorrect ? 'Case_Closed' : 'Verify_Analysis'}
                        </button>
                    </div>
                   )}
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



