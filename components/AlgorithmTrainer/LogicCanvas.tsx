import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

interface LogicCanvasProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const LogicCanvas: React.FC<LogicCanvasProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="relative group rounded-[2rem] overflow-hidden border border-white/5 bg-zinc-950 shadow-2xl transition-all focus-within:border-indigo-500/30 focus-within:ring-1 focus-within:ring-indigo-500/20">
      {/* Canvas Header */}
      <div className="flex items-center justify-between px-8 py-5 bg-white/[0.02] border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Brain size={16} className="text-indigo-400" />
          </div>
          <div className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase">
            Neural_Logic_Buffer
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/5 rounded-full border border-indigo-500/10">
           <Sparkles size={10} className="text-indigo-400" />
           <span className="text-[9px] text-indigo-300/70 font-black uppercase tracking-widest">Natural_Parsing_Active</span>
        </div>
      </div>

      <div className="p-8">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          spellCheck={true}
          className="w-full bg-transparent text-slate-200 font-serif italic text-xl md:text-2xl leading-relaxed outline-none resize-none min-h-[320px] placeholder:text-zinc-800"
          placeholder="Describe the hidden logic of this bias in plain English. 

e.g. 'If I see two people whispering, I immediately assume they are talking about me because I am feeling insecure about my recent presentation...'"
        />
      </div>
      
      {/* Blueprint Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none blueprint-grid opacity-[0.03]"></div>
      
      {/* Footer Instructions */}
      <div className="px-8 py-4 bg-white/[0.01] border-t border-white/5 flex justify-between items-center">
         <span className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">Compiler v4.1 // Zero_Code_Protocol</span>
         <span className="text-[9px] text-slate-600 font-mono uppercase tracking-widest">{value.length} characters</span>
      </div>
    </div>
  );
};
