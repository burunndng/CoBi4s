
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Zap, Layers, Trophy, Target, Scale, FlaskConical, Binary, Shuffle } from 'lucide-react';
import { AppState, ProgressState } from '../types';
import { BIASES } from '../constants';

interface DashboardProps {
  state: AppState;
}

const Dashboard: React.FC<DashboardProps> = ({ state }) => {
  const navigate = useNavigate();

  const masteredCount = useMemo(() => {
    return (Object.values(state.progress) as ProgressState[]).filter(p => p.masteryLevel >= 80).length;
  }, [state.progress]);

  const focusBias = useMemo(() => {
    const now = Date.now();
    const overdue = BIASES.filter(b => state.progress[b.id] && state.progress[b.id].nextReviewDate <= now);
    if (overdue.length > 0) return overdue[0];
    const lowMastery = BIASES.filter(b => (state.progress[b.id]?.masteryLevel || 0) < 50);
    if (lowMastery.length > 0) return lowMastery[Math.floor(Math.random() * lowMastery.length)];
    return BIASES[Math.floor(Math.random() * BIASES.length)];
  }, [state.progress]);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <header>
        <h1 className="serif text-3xl text-white">Overview</h1>
        <p className="text-slate-500 text-sm mt-1">System status and learning metrics.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile label="Mastery" value={`${Math.round((masteredCount / BIASES.length) * 100)}%`} icon={<Trophy size={16} />} />
        <MetricTile label="Streak" value={`${state.dailyStreak}d`} icon={<Activity size={16} />} />
        <MetricTile label="Experience" value={state.totalXp} icon={<Zap size={16} />} />
        <MetricTile label="Acquired" value={`${masteredCount}/${BIASES.length}`} icon={<Layers size={16} />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Focus Card */}
        <div className="lg:col-span-2 surface p-8 rounded-xl relative overflow-hidden group">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
               <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider mb-6">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 Priority Focus
               </div>
               <h2 className="serif text-4xl text-white mb-4 leading-none">{focusBias.name}</h2>
               <p className="text-slate-400 text-sm max-w-lg leading-relaxed">{focusBias.definition}</p>
            </div>
            
            <div className="pt-8">
              <button 
                onClick={() => navigate('/instructor')}
                className="btn-primary px-6 py-3 rounded-lg text-sm flex items-center gap-2"
              >
                Start Simulation <ArrowRight size={16} />
              </button>
            </div>
          </div>
          
          {/* Abstract background element */}
          <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-white/[0.03] to-transparent pointer-events-none"></div>
        </div>

        {/* Quick Access */}
        <div className="flex flex-col gap-3">
          <NavCard 
            title="Registry" 
            desc="Browse Database" 
            icon={<Layers size={18} />}
            onClick={() => navigate('/catalog')} 
          />
          <NavCard 
            title="Algorithm Trainer" 
            desc="Code Your Logic" 
            icon={<Binary size={18} />}
            onClick={() => navigate('/trainer')} 
          />
          <NavCard 
            title="Context Switcher" 
            desc="Heuristic vs Bias" 
            icon={<Shuffle size={18} />}
            onClick={() => navigate('/context')} 
          />
          <NavCard 
            title="Decision Architect" 
            desc="Audit Decisions" 
            icon={<Scale size={18} />}
            onClick={() => navigate('/decision')} 
          />
          <NavCard 
            title="Logic Lab" 
            desc="Repair Arguments" 
            icon={<FlaskConical size={18} />}
            onClick={() => navigate('/lab')} 
          />
          <NavCard 
            title="Detector" 
            desc="Spot Flaws" 
            icon={<Activity size={18} />}
            onClick={() => navigate('/detector')} 
          />
          <NavCard 
            title="Practice" 
            desc="Spaced Repetition" 
            icon={<Target size={18} />}
            onClick={() => navigate('/flashcards')} 
          />
          <NavCard 
            title="Assessment" 
            desc="Evaluate Skills" 
            icon={<Zap size={18} />}
            onClick={() => navigate('/quiz')} 
          />
        </div>
      </div>
    </div>
  );
};

const MetricTile: React.FC<{ label: string; value: string | number; icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="surface p-5 rounded-xl flex items-center justify-between">
    <div>
      <div className="text-2xl font-semibold text-white tracking-tight">{value}</div>
      <div className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">{label}</div>
    </div>
    <div className="text-slate-600">{icon}</div>
  </div>
);

const NavCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; onClick: () => void }> = ({ title, desc, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="surface surface-hover p-5 rounded-xl text-left flex items-center justify-between group flex-1 transition-all"
  >
    <div className="flex items-center gap-4">
      <div className="p-2 bg-white/5 rounded-lg text-slate-400 group-hover:text-white transition-colors">
        {icon}
      </div>
      <div>
        <div className="text-white font-medium text-sm">{title}</div>
        <div className="text-xs text-slate-500">{desc}</div>
      </div>
    </div>
    <ArrowRight size={16} className="text-slate-700 group-hover:text-white transition-colors" />
  </button>
);

export default Dashboard;
