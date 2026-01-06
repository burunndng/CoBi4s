
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
  Milestone,
  ChevronRight,
  ChevronLeft,
  Layout
} from 'lucide-react';

interface StudyPlanProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const StudyPlan: React.FC<StudyPlanProps> = ({ state, setState }) => {
  const [newMilestone, setNewMilestone] = useState('');
  const [milestoneType, setMilestoneType] = useState<CustomMilestone['type']>('study');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const SourceList = [...BIASES, ...FALLACIES];

  const groupedTasks = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const tasks: Record<string, { date: Date; items: { id: string; name: string }[] }> = {};
    
    SourceList.forEach(b => {
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
    setState(prev => ({ ...prev, roadmap: [milestone, ...(prev.roadmap || [])] }));
    setNewMilestone('');
  };

  const toggleMilestone = (id: string) => {
    setState(prev => ({
      ...prev,
      roadmap: (prev.roadmap || []).map(m => m.id === id ? { ...m, completed: !m.completed } : m)
    }));
  };

  const deleteMilestone = (id: string) => {
    setState(prev => ({
      ...prev,
      roadmap: (prev.roadmap || []).filter(m => m.id !== id)
    }));
  };

  const deferTask = (id: string) => {
    setState(prev => {
      const isLogic = FALLACIES.some(f => f.id === id);
      const pMap = isLogic ? { ...prev.fallacyProgress } : { ...prev.progress };
      const current = pMap[id];
      if (!current) return prev;
      pMap[id] = { ...current, nextReviewDate: Date.now() + (3 * 24 * 60 * 60 * 1000) };
      return { ...prev, [isLogic ? 'fallacyProgress' : 'progress']: pMap };
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-fade-in pb-32 relative">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="serif text-5xl font-light text-white italic">Schedule</h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] mt-2 font-bold pl-1">Strategy & Neural Evolution</p>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center gap-3 text-[10px] font-mono text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-5 py-3 rounded-xl border border-indigo-500/30 hover:bg-indigo-500/20 transition-all active:scale-95 will-change-transform shadow-lg shadow-indigo-900/20"
        >
           <Layout size={14} />
           {isSidebarOpen ? 'Hide_Roadmap' : 'Show_Roadmap'}
        </button>
      </header>

      <div className="flex flex-col lg:flex-row gap-12 items-start transition-all duration-500 ease-in-out">
        
        {/* Main: Interactive Timeline */}
        <div className={`flex-1 space-y-10 transition-all duration-500 ${isSidebarOpen ? 'lg:w-2/3' : 'w-full'}`}>
           <section>
              <h2 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                <Clock size={14} /> Scheduled_Synchronization
              </h2>
              
              <div className="space-y-12 relative">
                 <div className="absolute left-4 top-2 bottom-2 w-px bg-gradient-to-b from-indigo-500/20 via-white/5 to-transparent"></div>

                 {groupedTasks.map((day, idx) => {
                   const isToday = day.date.toDateString() === new Date().toDateString();
                   return (
                     <div key={idx} className="relative pl-12 group">
                        <div className={`absolute left-2.5 top-1 w-3.5 h-3.5 rounded-full border-2 bg-[#070708] transition-all duration-500 ${
                          isToday ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.8)] scale-110' : 'border-zinc-800'
                        }`}></div>

                        <div className="space-y-5">
                           <div className="flex items-center justify-between">
                              <h3 className={`text-xs font-bold uppercase tracking-widest ${isToday ? 'text-white' : 'text-slate-500'}`}>
                                {isToday ? 'Operational: Today' : day.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                              </h3>
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              {day.items.map(item => (
                                <div key={item.id} className="surface p-5 rounded-2xl border border-white/5 flex items-center justify-between group/card hover:border-white/10 transition-all bg-[#0d0d0f] shadow-xl">
                                   <span className="text-sm text-slate-300 font-medium italic serif">"{item.name}"</span>
                                   <button 
                                     onClick={() => deferTask(item.id)}
                                     title="Defer 3 Days"
                                     className="p-2.5 bg-white/5 rounded-lg text-slate-600 hover:text-amber-400 hover:bg-amber-400/10 transition-all opacity-0 group-hover/card:opacity-100 active:scale-90"
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

        {/* Right: Custom Roadmap Sidebar */}
        <aside 
          className={`
            transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
            ${isSidebarOpen ? 'w-full lg:w-80 opacity-100 translate-x-0' : 'w-0 lg:w-0 opacity-0 translate-x-12 overflow-hidden pointer-events-none'}
          `}
        >
           <div className="space-y-10 min-w-[320px]">
              <section className="surface p-8 rounded-[2.5rem] border border-white/10 bg-[#09090b] shadow-2xl relative overflow-hidden">
                 <div className="relative z-10">
                    <h2 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-8 flex items-center gap-3">
                      <Milestone size={14} /> Strategic_Roadmap
                    </h2>

                    <form onSubmit={addMilestone} className="space-y-4 mb-10">
                       <div className="flex gap-2 p-1.5 bg-black/40 border border-white/5 rounded-xl mb-4">
                          {(['study', 'practice', 'real-world'] as const).map(t => (
                            <button 
                              key={t}
                              type="button"
                              onClick={() => setMilestoneType(t)}
                              className={`flex-1 py-2 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all ${
                                milestoneType === t ? 'bg-white/10 text-white border border-white/10 shadow-lg' : 'text-slate-600 hover:text-slate-400'
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
                            placeholder="Add objective..."
                            className="w-full bg-black/20 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-xs text-white focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
                          />
                          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-white text-black rounded-xl hover:bg-indigo-50 transition-all active:scale-90">
                             <Plus size={16} strokeWidth={3} />
                          </button>
                       </div>
                    </form>

                    <div className="space-y-4">
                       {state.roadmap?.map(milestone => (
                         <div key={milestone.id} className="flex items-center gap-4 group/item animate-in fade-in slide-in-from-right-4 duration-300">
                            <button onClick={() => toggleMilestone(milestone.id)} className="shrink-0 transition-transform active:scale-75">
                               {milestone.completed ? (
                                 <CheckCircle2 size={20} className="text-emerald-500" />
                               ) : (
                                 <Circle size={20} className="text-slate-700 group-hover/item:text-indigo-400 transition-colors" />
                               )}
                            </button>
                            <div className="flex-1 flex items-center justify-between">
                               <span className={`text-xs font-medium transition-all duration-500 ${milestone.completed ? 'text-slate-600 line-through opacity-50' : 'text-slate-200'}`}>
                                 {milestone.label}
                               </span>
                               <button 
                                 onClick={() => deleteMilestone(milestone.id)}
                                 className="opacity-0 group-hover/item:opacity-100 p-2 text-slate-700 hover:text-rose-500 transition-all active:scale-90"
                               >
                                 <Trash2 size={14} />
                               </button>
                            </div>
                         </div>
                       ))}
                       {(!state.roadmap || state.roadmap.length === 0) && (
                         <div className="text-center py-12 space-y-4">
                            <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/5">
                               <Plus size={20} className="text-slate-700" />
                            </div>
                            <p className="text-[10px] text-slate-600 uppercase tracking-widest font-bold">No objectives defined</p>
                         </div>
                       )}
                    </div>
                 </div>
                 <div className="absolute inset-0 pointer-events-none blueprint-grid opacity-[0.03]"></div>
              </section>

              <div className="surface p-8 rounded-3xl border border-white/5 opacity-40 hover:opacity-80 transition-opacity duration-500 bg-[#070708]">
                 <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-6">Mastery_Projection</h3>
                 <div className="flex items-end gap-2.5 h-24">
                    {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group/bar">
                         <div className="absolute bottom-0 w-full bg-indigo-500/20 group-hover/bar:bg-indigo-500/50 transition-all rounded-t-sm" style={{ height: `${h}%` }}></div>
                      </div>
                    ))}
                 </div>
                 <div className="flex justify-between mt-4">
                    <p className="text-[9px] text-slate-600 uppercase tracking-widest font-bold">Growth_Velocity</p>
                    <p className="text-[9px] text-indigo-400 font-mono tracking-tighter">STABLE_0.84</p>
                 </div>
              </div>
           </div>
        </aside>

      </div>
    </div>
  );
};

export default StudyPlan;
