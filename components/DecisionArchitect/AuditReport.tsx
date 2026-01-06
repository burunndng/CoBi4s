import React, { useState } from 'react';
import { DecisionLog } from '../../types';
import { ArrowLeft, CheckCircle2, AlertTriangle, Save } from 'lucide-react';

interface AuditReportProps {
  log: DecisionLog;
  onUpdate: (log: DecisionLog) => void;
  onBack: () => void;
}

export const AuditReport: React.FC<AuditReportProps> = ({ log, onUpdate, onBack }) => {
  const [conclusion, setConclusion] = useState(log.finalConclusion);

  const handleReflectionChange = (biasIdx: number, text: string) => {
    const key = `bias-${biasIdx}`;
    const updated = {
        ...log,
        userReflections: { ...log.userReflections, [key]: text }
    };
    onUpdate(updated);
  };

  const handleSeverityChange = (biasIdx: number, val: number) => {
    const newBiases = [...log.detectedBiases];
    newBiases[biasIdx] = { ...newBiases[biasIdx], severity: val };
    onUpdate({ ...log, detectedBiases: newBiases });
  };

  const handleFinalize = () => {
    onUpdate({
        ...log,
        finalConclusion: conclusion,
        status: 'finalized'
    });
    onBack();
  };

  const getRiskColor = (severity: number = 0) => {
    if (severity >= 8) return 'border-rose-500 text-rose-500';
    if (severity >= 5) return 'border-amber-500 text-amber-500';
    return 'border-emerald-500 text-emerald-500';
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center gap-6 mb-8 pb-6 border-b border-white/5">
        <button onClick={onBack} className="p-4 -m-4 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-all active:scale-90">
            <ArrowLeft size={24} />
        </button>
        <div className="pl-4">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-1">Dossier</div>
            <h2 className="text-3xl font-serif text-white italic">{log.title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Context Column */}
         <div className="space-y-6">
            <div className="surface p-6 md:p-8 rounded-2xl">
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Brief</h3>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed font-light text-sm">{log.description}</p>
            </div>

            {log.status === 'finalized' && (
                <div className="bg-emerald-900/10 border border-emerald-500/20 p-8 rounded-2xl">
                    <h3 className="text-[10px] font-bold text-emerald-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <CheckCircle2 size={14} /> Approved
                    </h3>
                    <p className="text-emerald-100 whitespace-pre-wrap text-sm leading-relaxed">{log.finalConclusion}</p>
                </div>
            )}
         </div>

         {/* Analysis Column */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-serif text-white flex items-center gap-3 mb-6 italic px-4 md:px-0">
                <AlertTriangle size={20} className="text-rose-500" />
                Detected Threats
            </h3>
            
            {log.detectedBiases.map((bias, idx) => (
                <div key={idx} className={`surface p-6 md:p-8 rounded-2xl border-l-4 transition-colors mx-4 md:mx-0 ${getRiskColor(bias.severity)}`}>
                    <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-6">
                        <h4 className="font-bold text-xl text-white">{bias.biasId}</h4>
                        {log.status !== 'finalized' && (
                           <div className="flex flex-col items-start md:items-end gap-2 w-full md:w-auto">
                              <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Risk Severity: <span className="text-white font-mono ml-1">{bias.severity || 1}/10</span></span>
                              <input 
                                type="range" min="1" max="10" 
                                value={bias.severity || 1} 
                                onChange={(e) => handleSeverityChange(idx, Number(e.target.value))}
                                className="w-full md:w-32 h-8 bg-transparent appearance-none cursor-pointer focus:outline-none 
                                  [&::-webkit-slider-thumb]:appearance-none 
                                  [&::-webkit-slider-thumb]:w-6 
                                  [&::-webkit-slider-thumb]:h-6 
                                  [&::-webkit-slider-thumb]:rounded-full 
                                  [&::-webkit-slider-thumb]:bg-white 
                                  [&::-webkit-slider-runnable-track]:h-1.5
                                  [&::-webkit-slider-runnable-track]:bg-zinc-800
                                  [&::-webkit-slider-runnable-track]:rounded-full"
                              />
                           </div>
                        )}
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-8 leading-relaxed font-light">{bias.reasoning}</p>
                    
                    <div className="bg-white/[0.03] p-6 rounded-xl border border-white/5">
                        <label className="block text-rose-300 font-bold mb-3 text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                            Killer Question
                        </label>
                        <p className="text-white text-lg serif italic mb-4 leading-snug">"{bias.challengingQuestion}"</p>
                        
                        {log.status === 'finalized' ? (
                            <div className="text-slate-300 text-sm italic border-l-2 border-white/10 pl-4 py-1">
                                {log.userReflections[`bias-${idx}`] || "No reflection recorded."}
                            </div>
                        ) : (
                            <textarea 
                                className="w-full bg-transparent border-0 border-b border-white/10 focus:border-rose-500 text-slate-200 focus:ring-0 p-0 text-base mt-2 placeholder:text-zinc-800 resize-none leading-relaxed italic serif"
                                placeholder="Write your defense here..."
                                rows={2}
                                value={log.userReflections[`bias-${idx}`] || ''}
                                onChange={(e) => handleReflectionChange(idx, e.target.value)}
                            />
                        )}
                    </div>
                </div>
            ))}

            {log.status !== 'finalized' && (
                <div className="surface p-6 md:p-8 rounded-2xl mt-12 border-t border-white/5 mx-4 md:mx-0">
                    <h3 className="text-[10px] font-bold text-white mb-6 uppercase tracking-widest">Final Determination</h3>
                    <textarea 
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl p-6 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none text-base md:text-sm leading-relaxed serif italic"
                        rows={4}
                        placeholder="Synthesize the risk analysis into a final decision..."
                        value={conclusion}
                        onChange={(e) => setConclusion(e.target.value)}
                    />
                    <div className="flex justify-end mt-6">
                        <button 
                            onClick={handleFinalize}
                            disabled={!conclusion}
                            className="w-full md:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-900/20 active:scale-95"
                        >
                            <Save size={20} />
                            Seal & Archive Audit
                        </button>
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};
