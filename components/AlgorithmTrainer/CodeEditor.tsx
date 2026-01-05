import React from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="relative group rounded-2xl overflow-hidden border border-zinc-800 bg-[#0d0d0f] shadow-2xl transition-all focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-zinc-800">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50"></div>
        </div>
        <div className="text-[10px] text-zinc-500 font-mono font-bold tracking-widest uppercase">
          Logic_Buffer.pseudo
        </div>
      </div>

      <div className="flex">
        {/* Line Numbers */}
        <div className="w-12 bg-zinc-950 text-zinc-700 font-mono text-[11px] text-right pt-4 pr-3 select-none border-r border-zinc-900/50">
          {Array.from({ length: 15 }).map((_, i) => (
            <div key={i} className="leading-6">{i + 1}</div>
          ))}
        </div>

        {/* Text Area */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          spellCheck={false}
          className="flex-1 bg-transparent text-indigo-100 font-mono text-sm leading-6 p-4 outline-none resize-none min-h-[360px] placeholder:text-zinc-800"
          placeholder={`// Example: Sunk Cost
IF (investment_exists) AND (future_value < cost_to_continue) THEN
  IF (focus_on_past_loss) THEN
    RETURN "Stay the course"
  END IF
END IF`}
        />
      </div>
      
      {/* Glow Effect */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-indigo-500/[0.02] to-transparent"></div>
    </div>
  );
};
