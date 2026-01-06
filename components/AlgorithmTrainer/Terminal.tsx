import React from 'react';
import { AlgorithmTest } from '../../types';
import { BIASES, FALLACIES } from '../../constants';
import { ArrowLeft, Terminal as TerminalIcon, CheckCircle2, XCircle, AlertTriangle, ShieldCheck, Workflow } from 'lucide-react';
import { VisualAST } from './VisualAST';

interface TerminalProps {
  test: AlgorithmTest;
  onBack: () => void;
}

export const Terminal: React.FC<TerminalProps> = ({ test, onBack }) => {
  const concept = [...BIASES, ...FALLACIES].find(b => b.id === test.biasId);

  return (
    <div className="space-y-8 animate-in zoom-in-95 duration-500">
      <div className="flex items-center gap-6">
        <button onClick={onBack} className="p-4 -m-4 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-all active:scale-90">
            <ArrowLeft size={24} />
        </button>
        <div>
            <h2 className="text-3xl font-serif text-white italic">
               Synthesis Results: <span className="text-indigo-400">{concept?.name}</span>
            </h2>
            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.4em] mt-1">Compiler_Build_Log_{test.id.slice(0, 8)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         {/* Visual AST or Source Description */}
         <div className="space-y-6">
            {test.ast ? (
              <VisualAST root={test.ast.root} />
            ) : (
              <div className="surface rounded-3xl border border-white/5 bg-zinc-950 overflow-hidden flex flex-col p-8">
                 <div className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase mb-6 flex items-center gap-2">
                    <Workflow size={12} /> Source_Description
                 </div>
                 <p className="text-lg serif italic text-slate-300 leading-relaxed">
                    "{test.pseudoCode}"
                 </p>
              </div>
            )}

            <div className="surface rounded-3xl p-8 border border-white/5 bg-white/[0.01]">
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-6 pl-1">Unit_Tests</h3>
               <div className="space-y-4">
                  {test.results.map((res, idx) => (
                     <div key={idx} className="bg-black/20 p-5 rounded-2xl border border-white/5 flex items-start gap-5 group hover:border-white/10 transition-colors">
                        <div className="shrink-0 mt-1">
                           {res.isPass ? <CheckCircle2 className="text-emerald-500" size={20} /> : <XCircle className="text-rose-500" size={20} />}
                        </div>
                        <div className="space-y-2">
                           <p className="text-sm font-bold text-white uppercase tracking-tight">{res.testCase}</p>
                           <p className="text-xs text-slate-500 font-medium leading-relaxed italic">"{res.scenario}"</p>
                           {!res.isPass && (
                              <div className="bg-rose-500/5 p-4 rounded-xl border border-rose-500/10 space-y-2 mt-2">
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

         {/* Assessment Column */}
         <div className="space-y-6">
            <div className={`p-10 rounded-[2.5rem] border relative overflow-hidden ${
               test.status === 'compiled' ? 'bg-emerald-500/5 border-emerald-500/20' : 
               test.status === 'buggy' ? 'bg-amber-500/5 border-amber-500/20' : 
               'bg-rose-500/5 border-rose-500/20'
            }`}>
               <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8">System_Verdict</h3>
               <p className="text-xl md:text-2xl font-serif italic text-slate-100 leading-relaxed mb-10">"{test.overallAssessment}"</p>
               
               <div className="flex items-center gap-4">
                  <div className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border ${
                     test.status === 'compiled' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 
                     test.status === 'buggy' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 
                     'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>
                     {test.status.replace('_', ' ')}
                  </div>
                  <div className="h-px flex-1 bg-white/5"></div>
               </div>

               {/* Background visual flair */}
               <div className="absolute top-0 right-0 p-8 opacity-5">
                  <Workflow size={120} />
               </div>
            </div>

            {/* In-the-Wild Context */}
            {concept && (
               <div className="surface p-8 rounded-3xl border border-white/5 bg-indigo-500/5">
                  <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-4">Neural_Lens</h3>
                  <div className="flex flex-wrap gap-2">
                     {concept.transferCues?.map((cue, i) => (
                        <span key={i} className="px-3 py-1.5 bg-black/40 border border-white/5 rounded-lg text-[10px] text-indigo-200/70 font-medium tracking-wide">
                           {cue}
                        </span>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>
    </div>
  );
};
