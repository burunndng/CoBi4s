
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
    <div className="space-y-12 animate-fade-in pb-12">
      <header className="flex justify-between items-end border-b border-white/5 pb-8">
        <div>
          <h1 className="serif text-5xl font-light text-white italic">Blueprint</h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] mt-2 font-bold pl-1">System status & metrics</p>
        </div>
        <div className="text-right hidden md:block">
           <div className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest mb-1">Architecture v4.1</div>
           <div className="text-xs text-slate-600 font-mono">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
        </div>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile label="Mastery" value={`${Math.round((masteredCount / BIASES.length) * 100)}%`} icon={<Trophy size={14} />} color="text-amber-500" />
        <MetricTile label="Streak" value={`${state.dailyStreak}d`} icon={<Activity size={14} />} color="text-emerald-500" />
        <MetricTile label="Exp" value={state.totalXp} icon={<Zap size={14} />} color="text-indigo-400" />
        <MetricTile label="Core" value={`${masteredCount}/${BIASES.length}`} icon={<Layers size={14} />} color="text-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Focus Card */}
        <div className="lg:col-span-2 surface p-10 rounded-2xl relative overflow-hidden group min-h-[400px]">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
               <div className="flex items-center gap-3 text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-8">
                 <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div>
                 Current Focus
               </div>
               <h2 className="serif text-6xl text-white mb-6 leading-tight italic font-light">{focusBias.name}</h2>
               <p className="text-slate-400 text-lg max-w-lg leading-relaxed font-light">{focusBias.definition}</p>
            </div>
            
            <div className="pt-10 flex items-center gap-6">
              <button 
                onClick={() => navigate('/instructor')}
                className="btn-primary px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
              >
                Launch Simulation <ArrowRight size={14} />
              </button>
              <div className="h-px flex-1 bg-white/5"></div>
            </div>
          </div>
          
          {/* Abstract background element */}
          <div className="absolute -right-12 -top-12 w-96 h-96 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-all duration-700"></div>
          <div className="absolute right-0 bottom-0 w-64 h-full bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none"></div>
        </div>

        {/* Quick Access Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
          <NavCard 
            title="Registry" 
            desc="The Library" 
            icon={<Layers size={18} />}
            onClick={() => navigate('/catalog')} 
          />
          <NavCard 
            title="Simulator" 
            desc="Decision Sandbox" 
            icon={<BrainCircuit size={18} />}
            onClick={() => navigate('/instructor')} 
          />
          <NavCard 
            title="Mirror" 
            desc="Cognitive Coach" 
            icon={<Shuffle size={18} />}
            onClick={() => navigate('/chat')} 
          />
          <NavCard 
            title="Practice" 
            desc="Drills" 
            icon={<Zap size={18} />}
            onClick={() => navigate('/flashcards')} 
          />
        </div>
      </div>
    </div>
  );
};

const MetricTile: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="surface p-6 rounded-2xl flex flex-col justify-between group">
    <div className="flex items-center justify-between mb-4">
      <div className={`text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 group-hover:text-slate-300 transition-colors`}>{label}</div>
      <div className={`${color} opacity-40 group-hover:opacity-100 transition-opacity`}>{icon}</div>
    </div>
    <div className="text-3xl font-mono text-white tracking-tighter leading-none">{value}</div>
  </div>
);

const NavCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; onClick: () => void }> = ({ title, desc, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="surface surface-hover p-5 rounded-2xl text-left flex items-center justify-between group flex-1"
  >
    <div className="flex items-center gap-4">
      <div className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-300">
        {icon}
      </div>
      <div>
        <div className="text-white font-bold text-xs uppercase tracking-widest">{title}</div>
        <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">{desc}</div>
      </div>
    </div>
    <ArrowRight size={14} className="text-slate-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
  </button>
);

export default Dashboard;
