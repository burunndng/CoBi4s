
import React from 'react';
import { Target, AlertTriangle, Eye, Fingerprint, GripVertical, CheckCircle2, XCircle } from 'lucide-react';

interface Fragment {
  id: string;
  text: string;
  type: 'TRIGGER' | 'DISTORTION' | 'REALITY' | 'NOISE';
}

interface DeconstructionBoardProps {
  scenario: string;
  fragments: Fragment[];
  assignments: Record<string, string | null>; // slot -> fragmentId
  onAssign: (slot: string, fragmentId: string) => void;
  loading: boolean;
  validation?: {
    isCorrect: boolean;
    feedback: string;
  } | null;
}

export const DeconstructionBoard: React.FC<DeconstructionBoardProps> = ({ 
  scenario, 
  fragments, 
  assignments, 
  onAssign, 
  loading,
  validation 
}) => {
  
  if (loading) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center space-y-4 surface rounded-[2.5rem] border border-white/5 bg-zinc-950">
        <Fingerprint className="animate-pulse text-indigo-400" size={48} />
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Analyzing_Crime_Scene...</p>
      </div>
    );
  }

  if (!scenario) return null;

  // Filter out assigned fragments to show in the pool
  const assignedIds = Object.values(assignments);
  const pool = fragments.filter(f => !assignedIds.includes(f.id));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* THE CASE FILE */}
      <div className="surface p-8 rounded-3xl border border-white/5 bg-[#09090b] relative overflow-hidden">
         <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
               <Fingerprint size={18} />
            </div>
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">Case_File_#049</h3>
         </div>
         <p className="text-xl md:text-2xl font-serif italic text-slate-200 leading-relaxed">
            "{scenario}"
         </p>
         <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/5 blur-3xl pointer-events-none"></div>
      </div>

      {/* THE EVIDENCE BOARD (Slots) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <Slot 
            label="THE TRIGGER"
            icon={<Target size={14} className="text-amber-400" />}
            desc="What event started it?"
            slotId="TRIGGER"
            assignedId={assignments['TRIGGER']}
            fragments={fragments}
            onAssign={onAssign}
            accent="amber"
         />
         <Slot 
            label="THE DISTORTION"
            icon={<AlertTriangle size={14} className="text-rose-400" />}
            desc="What is the lie?"
            slotId="DISTORTION"
            assignedId={assignments['DISTORTION']}
            fragments={fragments}
            onAssign={onAssign}
            accent="rose"
         />
         <Slot 
            label="THE REALITY"
            icon={<Eye size={14} className="text-emerald-400" />}
            desc="What is the truth?"
            slotId="REALITY"
            assignedId={assignments['REALITY']}
            fragments={fragments}
            onAssign={onAssign}
            accent="emerald"
         />
      </div>

      {/* EVIDENCE POOL */}
      <div className="bg-black/20 rounded-3xl p-6 border border-white/5 min-h-[120px]">
         <h4 className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-4">Unsorted Evidence</h4>
         <div className="flex flex-wrap gap-3">
            {pool.map(frag => (
               <button
                 key={frag.id}
                 onClick={() => {
                    // Auto-assign to first empty slot for UX speed
                    if (!assignments['TRIGGER']) onAssign('TRIGGER', frag.id);
                    else if (!assignments['DISTORTION']) onAssign('DISTORTION', frag.id);
                    else if (!assignments['REALITY']) onAssign('REALITY', frag.id);
                 }}
                 className="px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-xs text-slate-300 font-medium transition-all active:scale-95 flex items-center gap-2"
               >
                  <GripVertical size={12} className="text-slate-600" />
                  {frag.text}
               </button>
            ))}
            {pool.length === 0 && (
               <span className="text-xs text-slate-600 italic">All evidence assigned.</span>
            )}
         </div>
      </div>

      {/* VALIDATION FEEDBACK */}
      {validation && (
         <div className={`p-6 rounded-2xl border ${validation.isCorrect ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-rose-500/10 border-rose-500/20'} animate-in slide-in-from-bottom-4`}>
            <div className="flex items-center gap-3 mb-2">
               {validation.isCorrect ? <CheckCircle2 size={18} className="text-emerald-400" /> : <XCircle size={18} className="text-rose-400" />}
               <h4 className={`text-xs font-bold uppercase tracking-widest ${validation.isCorrect ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {validation.isCorrect ? 'Analysis Confirmed' : 'Forensic Mismatch'}
               </h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">{validation.feedback}</p>
         </div>
      )}

    </div>
  );
};

const Slot: React.FC<{
  label: string;
  icon: React.ReactNode;
  desc: string;
  slotId: string;
  assignedId: string | null;
  fragments: Fragment[];
  onAssign: (slot: string, fragmentId: string) => void;
  accent: 'amber' | 'rose' | 'emerald';
}> = ({ label, icon, desc, slotId, assignedId, fragments, onAssign, accent }) => {
   const assignedFrag = fragments.find(f => f.id === assignedId);
   
   const accentMap = {
      amber: 'border-amber-500/20 bg-amber-500/5',
      rose: 'border-rose-500/20 bg-rose-500/5',
      emerald: 'border-emerald-500/20 bg-emerald-500/5'
   };

   return (
      <div className={`p-5 rounded-2xl border ${assignedFrag ? accentMap[accent] : 'border-white/5 bg-white/[0.02]'} transition-all min-h-[160px] flex flex-col`}>
         <div className="flex items-center gap-2 mb-2">
            {icon}
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{label}</span>
         </div>
         <p className="text-[10px] text-slate-600 mb-4">{desc}</p>
         
         {assignedFrag ? (
            <button 
               onClick={() => onAssign(slotId, '')} // Unassign
               className="mt-auto bg-black/40 p-3 rounded-xl border border-white/5 text-xs text-white font-medium text-left w-full hover:bg-black/60 transition-colors relative group"
            >
               {assignedFrag.text}
               <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                  <XCircle size={12} className="text-slate-500" />
               </div>
            </button>
         ) : (
            <div className="mt-auto h-12 border border-dashed border-white/10 rounded-xl flex items-center justify-center text-[9px] text-slate-700 uppercase tracking-widest">
               Empty Slot
            </div>
         )}
      </div>
   );
};
