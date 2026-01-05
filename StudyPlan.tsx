
import React, { useMemo } from 'react';
import { AppState } from '../types';
import { BIASES } from '../constants';
import { CheckCircle2 } from 'lucide-react';

interface StudyPlanProps {
  state: AppState;
}

const StudyPlan: React.FC<StudyPlanProps> = ({ state }) => {
  const plan = useMemo(() => {
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const tasks: { date: Date; items: { id: string; name: string }[] }[] = [];
    
    for (let i = 0; i < 7; i++) {
      const d = new Date(today.getTime() + i * 86400000);
      tasks.push({ date: d, items: [] });
    }

    BIASES.forEach(b => {
      const p = state.progress[b.id];
      let reviewDate = p ? new Date(p.nextReviewDate) : new Date();
      if (reviewDate < today) reviewDate = today; // Overdue moves to today
      reviewDate.setHours(0,0,0,0);

      const dayTask = tasks.find(t => t.date.getTime() === reviewDate.getTime());
      if (dayTask) dayTask.items.push({ id: b.id, name: b.name });
    });

    return tasks.filter(t => t.items.length > 0);
  }, [state.progress]);

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12">
      <header>
        <h1 className="serif text-3xl text-white">Schedule</h1>
        <p className="text-slate-500 text-sm">Upcoming spaced repetition tasks.</p>
      </header>

      <div className="space-y-6">
        {plan.map((day, idx) => {
          const isToday = idx === 0 && day.date.toDateString() === new Date().toDateString();
          return (
            <div key={day.date.toISOString()} className="space-y-3">
              <h3 className={`text-sm font-semibold uppercase tracking-wider ${isToday ? 'text-blue-400' : 'text-slate-500'}`}>
                {isToday ? 'Today' : day.date.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
              </h3>
              
              <div className="surface rounded-xl overflow-hidden divide-y divide-white/5 border-white/10">
                 {day.items.map(item => (
                   <div key={item.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                     <span className="text-slate-200 text-sm">{item.name}</span>
                     <div className="w-4 h-4 rounded-full border border-white/20"></div>
                   </div>
                 ))}
              </div>
            </div>
          );
        })}

        {plan.length === 0 && (
          <div className="surface p-12 rounded-xl text-center">
            <CheckCircle2 size={32} className="mx-auto text-emerald-500 mb-4" />
            <h3 className="text-white font-medium">All Caught Up</h3>
            <p className="text-slate-500 text-sm mt-1">No reviews scheduled for the next 7 days.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlan;
