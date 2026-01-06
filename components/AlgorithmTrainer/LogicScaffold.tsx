
import React from 'react';
import { Brain, ArrowRight, Zap, Lightbulb } from 'lucide-react';

interface LogicScaffoldProps {
  scaffold: { trigger: string, leap: string, alternative: string };
  onChange: (field: string, val: string) => void;
  disabled?: boolean;
}

export const LogicScaffold: React.FC<LogicScaffoldProps> = ({ scaffold, onChange, disabled }) => {
  return (
    <div className="relative space-y-6">
      {/* TRIGGER NODE */}
      <ScaffoldNode 
        label="TRIGGER"
        icon={<Zap size={14} className="text-amber-400" />}
        prefix="If I observe..."
        placeholder="e.g. someone checking their phone while I talk"
        value={scaffold.trigger}
        onChange={(v) => onChange('trigger', v)}
        disabled={disabled}
      />

      {/* THE LEAP */}
      <div className="flex justify-center py-2">
         <div className="w-px h-8 bg-indigo-500/20"></div>
      </div>

      <ScaffoldNode 
        label="LOGIC LEAP"
        icon={<Brain size={14} className="text-rose-400" />}
        prefix="I immediately assume..."
        placeholder="e.g. they are bored and don't respect my time"
        value={scaffold.leap}
        onChange={(v) => onChange('leap', v)}
        disabled={disabled}
        accent="rose"
      />

      {/* THE ALTERNATIVE */}
      <div className="flex justify-center py-2">
         <div className="w-px h-8 bg-indigo-500/20"></div>
      </div>

      <ScaffoldNode 
        label="IGNORED ALTERNATIVE"
        icon={<Lightbulb size={14} className="text-emerald-400" />}
        prefix="Instead of considering..."
        placeholder="e.g. they might be expecting an urgent family call"
        value={scaffold.alternative}
        onChange={(v) => onChange('alternative', v)}
        disabled={disabled}
        accent="emerald"
      />
    </div>
  );
};

const ScaffoldNode: React.FC<{
  label: string;
  icon: React.ReactNode;
  prefix: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  accent?: 'indigo' | 'rose' | 'emerald';
}> = ({ label, icon, prefix, placeholder, value, onChange, disabled, accent = 'indigo' }) => {
  const accentMap = {
    indigo: 'border-indigo-500/20 focus-within:border-indigo-500/50 bg-indigo-500/5',
    rose: 'border-rose-500/20 focus-within:border-rose-500/50 bg-rose-500/5',
    emerald: 'border-emerald-500/20 focus-within:border-emerald-500/50 bg-emerald-500/5'
  };

  return (
    <div className={`surface p-6 rounded-3xl border transition-all duration-500 ${accentMap[accent]} group`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 group-hover:text-slate-300">
          {icon}
          {label}
        </div>
      </div>
      <div className="space-y-2">
        <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest block">{prefix}</span>
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="w-full bg-transparent text-white font-serif italic text-lg md:text-xl outline-none placeholder:text-zinc-800"
        />
      </div>
    </div>
  );
};
