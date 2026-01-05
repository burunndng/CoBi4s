import React from 'react';
import { Lightbulb } from 'lucide-react';

interface TransferTipsProps {
  cues: string[];
}

export const TransferTips: React.FC<TransferTipsProps> = ({ cues }) => {
  if (!cues || cues.length === 0) return null;

  return (
    <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mt-4 animate-in fade-in slide-in-from-bottom-2">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-4 h-4 text-amber-400" />
        <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Transfer Cues</h4>
      </div>
      <ul className="space-y-1">
        {cues.map((cue, i) => (
          <li key={i} className="text-xs text-amber-200/70 flex items-start gap-2">
            <span className="text-amber-500">•</span>
            {cue}
          </li>
        ))}
      </ul>
      <p className="text-[9px] text-amber-500/50 mt-3 italic">
        Watch for these specific triggers in your next conversation.
      </p>
    </div>
  );
};
