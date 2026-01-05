import React from 'react';
import { AlgorithmTest } from '../../types';
import { BIASES, FALLACIES } from '../../constants';
import { ArrowLeft, Terminal as TerminalIcon, CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

interface TerminalProps {
  test: AlgorithmTest;
  onBack: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ test, onBack }) => {
  const concept = [...BIASES, ...FALLACIES].find(b => b.id === test.biasId);

  return (
    <div className="space-y-6 animate-in zoom-in-95 duration-500">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
            <ArrowLeft size={20} />
        </button>
        <div>
            <h2 className="text-xl font-medium text-white flex items-center gap-2">
               Test Results: <span className="text-indigo-400">{concept?.name}</span>
            </h2>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Compiler_Output_Log_{test.id.slice(0, 8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Code Snapshot */}
         <div className="surface rounded-2xl border border-zinc-800 bg-[#09090b] overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-zinc-900/50 border-b border-zinc-800 text-[10px] text-zinc-500 font-mono flex items-center gap-2">
               <TerminalIcon size={12} /> READ_ONLY_SNAPSHOT.pseudo
            </div>
            <pre className="p-6 text-sm font-mono text-indigo-300 leading-relaxed overflow-x-auto">
               {test.pseudoCode}
            </pre>
         </div>

         {/* Assessment */}
         <div className="space-y-4">
            <div className={`p-6 rounded-2xl border ${
               test.status === 'compiled' ? 'bg-emerald-900/10 border-emerald-800/30' : 
               test.status === 'buggy' ? 'bg-amber-900/10 border-amber-800/30' : 
               'bg-rose-900/10 border-rose-800/30'
            }`}>
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Overall Assessment</h3>
               <p className="text-slate-200 text-sm leading-relaxed">{test.overallAssessment}</p>
               <div className="mt-4 flex items-center gap-2">
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                     test.status === 'compiled' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 
                     test.status === 'buggy' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' : 
                     'bg-rose-500/20 border-rose-500/50 text-rose-400'
                  }`}>
                     Status: {test.status.replace('_', ' ')}
                  </div>
               </div>
            </div>

            <div className="space-y-3">
               <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2">Logic unit tests</h3>
               {test.results.map((res, idx) => (
                  <div key={idx} className="surface p-4 rounded-xl border border-zinc-800 flex items-start gap-4">
                     <div className="shrink-0 mt-1">
                        {res.isPass ? <CheckCircle2 className="text-emerald-500" size={18} /> : <XCircle className="text-rose-500" size={18} />}
                     </div>
                     <div className="space-y-2">
                        <div>
                           <p className="text-xs font-bold text-white uppercase tracking-tighter">{res.testCase}</p>
                           <p className="text-xs text-slate-500 mt-0.5">Scenario: {res.scenario}</p>
                        </div>
                        {!res.isPass && (
                           <div className="bg-rose-950/20 p-3 rounded-lg border border-rose-900/30 space-y-2">
                              <p className="text-[11px] text-rose-300 font-mono flex items-center gap-2">
                                 <AlertTriangle size={12} /> {res.error}
                              </p>
                              {res.suggestion && (
                                 <p className="text-[11px] text-emerald-400 font-mono flex items-center gap-2">
                                    <ShieldCheck size={12} /> {res.suggestion}
                                 </p>
                              )}
                           </div>
                        )}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
    </div>
  );
};
