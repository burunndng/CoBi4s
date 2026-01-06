import React, { useMemo, useState } from 'react';
import { AppState, CustomMilestone, ProgressState } from '../types';
import { BIASES, FALLACIES } from '../constants';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  Brain,
  Milestone
} from 'lucide-react';

interface StudyPlanProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const StudyPlan: React.FC<StudyPlanProps> = ({ state, setState }) => {
  const [newMilestone, setNewMilestone] = useState('');
  const [milestoneType, setMilestoneType] = useState<CustomMilestone['type']>('study');

  const SourceList = [...BIASES, ...FALLACIES];

  // 🧠 ROADMAP LOGIC: Group bias reviews by date
  const groupedTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const tasks: Record<string, { date: Date; items: { id: string; name: string }[] }> = {};
    
    SourceList.forEach(b => {
      const isLogic = state.roadmap.some(() => false); // placeholder
      const pMap = state.progress[b.id] ? state.progress : state.fallacyProgress;
      const p = pMap[b.id];
      if (!p) return;

      let reviewDate = new Date(p.nextReviewDate);
      if (reviewDate < today) reviewDate = today;
      reviewDate.setHours(0,0,0,0);

      const key = reviewDate.toISOString();
      if (!tasks[key]) tasks[key] = { date: reviewDate, items: [] };
      tasks[key].items.push({ id: b.id, name: b.name });
    });

    return Object.values(tasks).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [state.progress, state.fallacyProgress]);

  // CRUD: Add Milestone
  const addMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestone.trim()) return;

    const milestone: CustomMilestone = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      label: newMilestone,
      completed: false,
      type: milestoneType
    };

    setState(prev => ({
      ...prev,
      roadmap: [milestone, ...(prev.roadmap || [])]
    }));
    setNewMilestone('');
  };

  // CRUD: Toggle Milestone
  const toggleMilestone = (id: string) => {
    setState(prev => ({
      ...prev,
      roadmap: (prev.roadmap || []).map(m => m.id === id ? { ...m, completed: !m.completed } : m)
    }));
  };

  // CRUD: Delete Milestone
  const deleteMilestone = (id: string) => {
    setState(prev => ({
      ...prev,
      roadmap: (prev.roadmap || []).filter(m => m.id !== id)
    }));
  };

  // DEFER LOGIC: Push a bias review back by 3 days
  const deferTask = (id: string) => {
    setState(prev => {
      const isLogic = FALLACIES.some(f => f.id === id);
      const pMap = isLogic ? { ...prev.fallacyProgress } : { ...prev.progress };
      const current = pMap[id];
      if (!current) return prev;

      pMap[id] = {
        ...current,
        nextReviewDate: Date.now() + (3 * 24 * 60 * 60 * 1000)
      };

      return { ...prev, [isLogic ? 'fallacyProgress' : 'progress']: pMap };
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-32">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="serif text-5xl font-light text-white italic">The Journey</h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] mt-2 font-bold pl-1">Strategy & Neural Evolution</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] font-mono text-indigo-400 uppercase tracking-widest bg-indigo-500/5 px-4 py-2 rounded-full border border-indigo-500/10">
           < TrendingUp size={12} />
           Active_Growth_Path
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left: Interactive Timeline */}
        <div className="lg:col-span-2 space-y-10">
           <section>
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <Clock size={14} /> Scheduled_Synchronization
              </h2>
              
              <div className="space-y-8 relative">
                 {/* Timeline Line */}
                 <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500/20 via-white/5 to-transparent"></div>

                 {groupedTasks.map((day, idx) => {
                   const isToday = day.date.toDateString() === new Date().toDateString();
                   return (
                     <div key={idx} className="relative pl-12 group">
                        {/* Pulse Node */}
                        <div className={`absolute left-2.5 top-1 w-3 h-3 rounded-full border-2 bg-zinc-950 transition-all ${
                          isToday ? 'border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : 'border-zinc-800'
                        }`}></div>

                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <h3 className={`text-xs font-bold uppercase tracking-widest ${isToday ? 'text-white' : 'text-slate-500'}`}>
                                {isToday ? 'Operational: Today' : day.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                              </h3>
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {day.items.map(item => (
                                <div key={item.id} className="surface p-4 rounded-xl border border-white/5 flex items-center justify-between group/card hover:border-white/10 transition-all">
                                   <span className="text-sm text-slate-300 font-medium italic serif">"{item.name}"</span>
                                   <button 
                                     onClick={() => deferTask(item.id)}
                                     title="Defer 3 Days"
                                     className="p-2 text-slate-600 hover:text-amber-400 transition-colors opacity-0 group-hover/card:opacity-100"
                                   >
                                     <ArrowUpRight size={14} />
                                   </button>
                                </div>
                              ))}
                           </div>
                        </div>
                     </div>
                   );
                 })}

                 {groupedTasks.length === 0 && (
                   <div className="pl-12 text-slate-600 text-sm italic">No active sync points scheduled.</div>
                 )}
              </div>
           </section>
        </div>

        {/* Right: Custom Roadmap */}
        <aside className="space-y-10">
           <section className="surface p-8 rounded-[2rem] border-indigo-500/10 bg-indigo-500/5 shadow-2xl">
              <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <Milestone size={14} /> Strategic_Roadmap
              </h2>

              <form onSubmit={addMilestone} className="space-y-4 mb-10">
                 <div className="flex gap-2 p-1 bg-black/40 border border-white/5 rounded-xl mb-4">
                    {(['study', 'practice', 'real-world'] as const).map(t => (
                      <button 
                        key={t}
                        type="button"
                        onClick={() => setMilestoneType(t)}
                        className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                          milestoneType === t ? 'bg-white/10 text-white border border-white/10' : 'text-slate-600'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                 </div>
                 <div className="relative">
                    <input 
                      type="text"
                      value={newMilestone}
                      onChange={e => setNewMilestone(e.target.value)}
                      placeholder="Add custom objective..."
                      className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-5 pr-12 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                    />
                    <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all">
                       <Plus size={16} />
                    </button>
                 </div>
              </form>

              <div className="space-y-3">
                 {state.roadmap?.map(milestone => (
                   <div key={milestone.id} className="flex items-center gap-4 group">
                      <button onClick={() => toggleMilestone(milestone.id)} className="shrink-0">
                         {milestone.completed ? (
                           <CheckCircle2 size={18} className="text-emerald-500" />
                         ) : (
                           <Circle size={18} className="text-slate-700 hover:text-indigo-400 transition-colors" />
                         )}
                      </button>
                      <div className="flex-1 flex items-center justify-between">
                         <span className={`text-xs font-medium transition-all ${milestone.completed ? 'text-slate-600 line-through' : 'text-slate-200'}`}>
                           {milestone.label}
                         </span>
                         <button 
                           onClick={() => deleteMilestone(milestone.id)}
                           className="opacity-0 group-hover:opacity-100 p-2 text-slate-700 hover:text-rose-500 transition-all"
                         >
                           <Trash2 size={14} />
                         </button>
                      </div>
                   </div>
                 ))}
                 {(!state.roadmap || state.roadmap.length === 0) && (
                   <p className="text-[10px] text-slate-600 uppercase tracking-widest text-center py-8">No custom objectives set</p>
                 )}
              </div>
           </section>

           <div className="surface p-8 rounded-3xl border border-white/5 opacity-50">
              <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Mastery_Projection</h3>
              <div className="flex items-end gap-2 h-20">
                 {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                   <div key={i} className="flex-1 bg-white/5 rounded-t-sm relative group">
                      <div className="absolute bottom-0 w-full bg-indigo-500/20 group-hover:bg-indigo-500/40 transition-all" style={{ height: `${h}%` }}></div>
                   </div>
                 ))}
              </div>
              <p className="text-[9px] text-slate-600 mt-4 uppercase tracking-widest">Growth_Velocity: Stable</p>
           </div>
        </aside>

      </div>
    </div>
  );
};

export default StudyPlan;