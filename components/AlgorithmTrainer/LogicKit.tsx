
import React from 'react';
import { Zap, Brain, Lightbulb, Loader2 } from 'lucide-react';

interface LogicKitProps {
  pieces: {
    triggers: string[];
    leaps: string[];
    alternatives: string[];
  } | null;
  selection: { trigger: string, leap: string, alternative: string };
  onSelect: (field: string, val: string) => void;
  loading: boolean;
}

export const LogicKit: React.FC<LogicKitProps> = ({ pieces, selection, onSelect, loading }) => {
  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center space-y-4 surface rounded-[2.5rem] border border-white/5 bg-zinc-950">
        <Loader2 className="animate-spin text-indigo-400" size={32} />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Generating_Logic_Pieces</p>
      </div>
    );
  }

  if (!pieces) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Section 
        label="Trigger" 
        icon={<Zap size={14} className="text-amber-400" />}
        options={pieces.triggers}
        selected={selection.trigger}
        onSelect={(v) => onSelect('trigger', v)}
        accent="amber"
      />
      <Section 
        label="Logic Leap" 
        icon={<Brain size={14} className="text-rose-400" />}
        options={pieces.leaps}
        selected={selection.leap}
        onSelect={(v) => onSelect('leap', v)}
        accent="rose"
      />
      <Section 
        label="Alternative" 
        icon={<Lightbulb size={14} className="text-emerald-400" />}
        options={pieces.alternatives}
        selected={selection.alternative}
        onSelect={(v) => onSelect('alternative', v)}
        accent="emerald"
      />
    </div>
  );
};

const Section: React.FC<{
  label: string;
  icon: React.ReactNode;
  options: string[];
  selected: string;
  onSelect: (v: string) => void;
  accent: 'amber' | 'rose' | 'emerald';
}> = ({ label, icon, options, selected, onSelect, accent }) => {
  const accentMap = {
    amber: 'border-amber-500/20 text-amber-100 bg-amber-500/5',
    rose: 'border-rose-500/20 text-rose-100 bg-rose-500/5',
    emerald: 'border-emerald-500/20 text-emerald-100 bg-emerald-500/5'
  };

  const selectedClass = {
    amber: 'bg-amber-500/20 border-amber-400 ring-2 ring-amber-400/20',
    rose: 'bg-rose-500/20 border-rose-400 ring-2 ring-rose-400/20',
    emerald: 'bg-emerald-500/20 border-emerald-400 ring-2 ring-emerald-400/20'
  };

  return (
    <div className="space-y-4">
      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] flex items-center gap-2 px-2">
        {icon} {label}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onSelect(opt)}
            className={`
              p-5 rounded-2xl border text-left text-xs font-medium leading-relaxed transition-all active:scale-[0.97]
              ${selected === opt ? selectedClass[accent] : 'bg-zinc-950 border-white/5 text-slate-400 hover:border-white/10 hover:bg-zinc-900'}
            `}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};
