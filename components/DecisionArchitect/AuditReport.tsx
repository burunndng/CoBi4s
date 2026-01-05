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
    // We use index as key since biasId might not be unique or standard ID
    const key = `bias-${biasIdx}`;
    const updated = {
        ...log,
        userReflections: { ...log.userReflections, [key]: text }
    };
    onUpdate(updated);
  };

  const handleFinalize = () => {
    onUpdate({
        ...log,
        finalConclusion: conclusion,
        status: 'finalized'
    });
    onBack();
  };

  return (
    <div className="animate-fade-in space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white">
            <ArrowLeft size={20} />
        </button>
        <div>
            <h2 className="text-2xl font-serif text-white">{log.title}</h2>
            <p className="text-slate-500 text-sm">{new Date(log.timestamp).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Context Column */}
         <div className="space-y-6">
            <div className="surface p-6 rounded-xl border border-zinc-800">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Original Context</h3>
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{log.description}</p>
            </div>

            {log.status === 'finalized' && (
                <div className="bg-emerald-900/20 border border-emerald-800 p-6 rounded-xl">
                    <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <CheckCircle2 size={14} /> Final Decision
                    </h3>
                    <p className="text-emerald-100 whitespace-pre-wrap">{log.finalConclusion}</p>
                </div>
            )}
         </div>

         {/* Analysis Column */}
         <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-serif text-rose-400 flex items-center gap-2">
                <AlertTriangle size={20} />
                Risk Analysis
            </h3>
            
            {log.detectedBiases.map((bias, idx) => (
                <div key={idx} className="surface p-6 rounded-xl border-l-4 border-rose-500">
                    <div className="flex justify-between items-start mb-4">
                        <h4 className="font-bold text-lg text-white">{bias.biasId}</h4>
                    </div>
                    
                    <p className="text-slate-400 text-sm mb-6">{bias.reasoning}</p>
                    
                    <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                        <label className="block text-rose-300 font-medium mb-2 text-sm">
                            Killer Question: {bias.challengingQuestion}
                        </label>
                        {log.status === 'finalized' ? (
                            <p className="text-slate-300 text-sm mt-2 italic border-l-2 border-zinc-700 pl-3">
                                {log.userReflections[`bias-${idx}`] || "No reflection recorded."}
                            </p>
                        ) : (
                            <textarea 
                                className="w-full bg-transparent border-0 border-b border-zinc-800 focus:border-rose-500 text-slate-200 focus:ring-0 p-0 text-sm mt-2 placeholder:text-zinc-600"
                                placeholder="Your answer..."
                                rows={2}
                                value={log.userReflections[`bias-${idx}`] || ''}
                                onChange={(e) => handleReflectionChange(idx, e.target.value)}
                            />
                        )}
                    </div>
                </div>
            ))}

            {log.status !== 'finalized' && (
                <div className="surface p-6 rounded-xl mt-8 border-t border-zinc-800">
                    <h3 className="text-sm font-bold text-white mb-4">Conclusion</h3>
                    <textarea 
                        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none"
                        rows={4}
                        placeholder="Based on this analysis, what is your decision?"
                        value={conclusion}
                        onChange={(e) => setConclusion(e.target.value)}
                    />
                    <div className="flex justify-end mt-4">
                        <button 
                            onClick={handleFinalize}
                            disabled={!conclusion}
                            className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                        >
                            <Save size={18} />
                            Finalize Decision
                        </button>
                    </div>
                </div>
            )}
         </div>
      </div>
    </div>
  );
};
