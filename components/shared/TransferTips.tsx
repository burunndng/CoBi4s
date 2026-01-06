import React from 'react';
import { Target, Search } from 'lucide-react';

interface TransferTipsProps {
  cues: string[];
}

export const TransferTips: React.FC<TransferTipsProps> = ({ cues }) => {
  if (!cues || cues.length === 0) return null;

  return (
    <div className="p-5 bg-indigo-500/5 border border-indigo-500/10 rounded-xl w-full text-left space-y-3">
      <div className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
        <Search size={12} /> Real-World_Lens
      </div>
      <div className="flex flex-wrap gap-2">
        {cues.map((cue, i) => (
          <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-black/40 border border-white/5 rounded-lg">
            <div className="w-1 h-1 rounded-full bg-indigo-500"></div>
            <span className="text-[10px] text-zinc-300 font-medium tracking-wide">{cue}</span>
          </div>
        ))}
      </div>
    </div>
  );
};