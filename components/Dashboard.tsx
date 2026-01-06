
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Activity, Zap, Layers, Trophy, BrainCircuit, Shuffle, Swords, ExternalLink, ShieldAlert, Target, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { AppState, ProgressState, Bias } from '../types';
import { BIASES } from '../constants';
import { CognitiveRadar } from './visualizations/CognitiveRadar';

interface DashboardProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

const Dashboard: React.FC<DashboardProps> = ({ state, setState }) => {
  const navigate = useNavigate();

  // ⚡️ ARCHITECTURAL LOGIC: Daily Focus Selection
  useEffect(() => {
    const today = new Date().toDateString();
    if (!state.dailyFocus || state.dailyFocus.lastUpdated !== today) {
      const allBiases = BIASES;
      const progressMap = state.progress;
      
      // Select bias with lowest mastery or not yet seen
      const candidates = [...allBiases].sort((a, b) => 
        (progressMap[a.id]?.masteryLevel || 0) - (progressMap[b.id]?.masteryLevel || 0)
      );
      
      const newFocus = candidates[0];
      setState(prev => ({
        ...prev,
        dailyFocus: {
          biasId: newFocus.id,
          lastUpdated: today,
          observedToday: false
        }
      }));
    }
  }, [state.dailyFocus, state.progress, setState]);

  const focusBias = useMemo(() => {
    const id = state.dailyFocus?.biasId || BIASES[0].id;
    return BIASES.find(b => b.id === id) || BIASES[0];
  }, [state.dailyFocus]);

  const masteredCount = useMemo(() => {
    return (Object.values(state.progress) as ProgressState[]).filter(p => p.masteryLevel >= 80).length;
  }, [state.progress]);

  const radarData = useMemo(() => {
    const psychScore = (Object.values(state.progress) as ProgressState[]).length * 10;
    const logicScore = (Object.values(state.fallacyProgress || {}) as ProgressState[]).length * 10;
    
    return [
      { subject: 'Psych', A: Math.min(100, psychScore + 20), fullMark: 100 },
      { subject: 'Logic', A: Math.min(100, logicScore + 10), fullMark: 100 },
      { subject: 'Speed', A: Math.min(100, state.totalXp / 50), fullMark: 100 },
      { subject: 'Focus', A: Math.min(100, state.dailyStreak * 5 + 30), fullMark: 100 },
      { subject: 'Defense', A: 40, fullMark: 100 },
      { subject: 'Strategy', A: 65, fullMark: 100 },
    ];
  }, [state]);

  const handleObservePattern = () => {
    setState(prev => ({
      ...prev,
      totalXp: prev.totalXp + 50,
      dailyFocus: prev.dailyFocus ? { ...prev.dailyFocus, observedToday: true } : null
    }));
  };

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

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="surface p-4 rounded-2xl flex flex-col justify-between group relative overflow-hidden h-32 lg:h-40">
           <div className="absolute inset-0 opacity-50 pointer-events-none scale-150">
              <CognitiveRadar data={radarData} />
           </div>
           <div className="relative z-10 flex justify-between items-start">
              <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">Cognitive_Map</div>
              <Activity size={14} className="text-indigo-400" />
           </div>
           <div className="relative z-10 text-right mt-auto">
              <div className="text-2xl font-mono tabular-nums text-white tracking-tighter leading-none">{masteredCount}</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest mt-1">Mastered_Nodes</div>
           </div>
        </div>

        <MetricTile label="Streak" value={`${state.dailyStreak}d`} icon={<Activity size={14} />} color="text-emerald-500" />
        <MetricTile label="Exp" value={state.totalXp} icon={<Zap size={14} />} color="text-indigo-400" />
        <MetricTile label="Core" value={`${masteredCount}/${BIASES.length}`} icon={<Layers size={14} />} color="text-white" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 👁 LENS OF THE DAY: Focus Module */}
        <div className="lg:col-span-2 surface p-12 rounded-[2.5rem] relative overflow-hidden group min-h-[480px] border-indigo-500/10 shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_20px_60px_-10px_rgba(0,0,0,0.6)]">
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
               <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4 text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">
                    <div className="relative flex items-center justify-center">
                       <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_15px_rgba(99,102,241,1)]"></div>
                       <svg className="absolute w-8 h-8 opacity-40" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="10 10" className="animate-[spin_10s_linear_infinite]" />
                       </svg>
                    </div>
                    Lens_Of_The_Day
                  </div>
                  <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                    Neural_Target: {focusBias.id}
                  </div>
               </div>
               
               <h2 className="serif text-6xl md:text-8xl text-white mb-8 leading-[0.85] italic font-light tracking-tighter">{focusBias.name}</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] block">Definition</span>
                    <p className="text-slate-200 text-lg leading-relaxed font-light opacity-90 italic">"{focusBias.definition}"</p>
                  </div>
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-indigo-400/70 uppercase tracking-[0.3em] block">Scan_For_Patterns</span>
                    <div className="flex flex-wrap gap-2">
                       {focusBias.transferCues?.map((cue, i) => (
                         <span key={i} className="px-3 py-2 bg-indigo-500/5 border border-indigo-500/10 rounded-lg text-xs text-indigo-200/80 font-medium">
                           {cue}
                         </span>
                       ))}
                    </div>
                  </div>
               </div>
            </div>
            
            <div className="pt-16 flex items-center gap-8">
              {state.dailyFocus?.observedToday ? (
                <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 px-8 py-5 rounded-2xl animate-fade-in">
                   <CheckCircle2 className="text-emerald-500" size={24} />
                   <div className="text-emerald-100 text-xs font-black uppercase tracking-[0.2em]">Neural_Path_Reinforced (+50 XP)</div>
                </div>
              ) : (
                <button 
                  onClick={handleObservePattern}
                  className="bg-white text-black px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-4 active:scale-95 transition-all shadow-2xl hover:bg-indigo-50 group/btn"
                >
                  <Target size={18} className="group-hover/btn:scale-125 transition-transform" />
                  Pattern_Observed_In_Wild
                </button>
              )}
              <div className="h-px flex-1 bg-white/5"></div>
              <button onClick={() => navigate('/instructor')} className="p-5 rounded-2xl border border-white/5 hover:bg-white/5 transition-all text-slate-500 hover:text-white">
                 <ExternalLink size={20} />
              </button>
            </div>
          </div>
          
          {/* Neural Pulse Background */}
          <div className="absolute -right-20 -bottom-20 w-[600px] h-[600px] pointer-events-none opacity-20">
             <svg viewBox="0 0 200 200" className="w-full h-full">
                <circle cx="100" cy="100" r="80" fill="none" stroke="url(#neuralGradient)" strokeWidth="0.5" className="animate-[pulse_4s_ease-in-out_infinite]" />
                <defs>
                   <radialGradient id="neuralGradient" cx="100" cy="100" r="100" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="rgba(99,102,241,1)" />
                      <stop offset="1" stopColor="transparent" />
                   </radialGradient>
                </defs>
             </svg>
          </div>
          <div className="absolute right-0 top-0 w-96 h-full bg-gradient-to-l from-indigo-500/[0.03] to-transparent pointer-events-none"></div>
        </div>

        {/* Quick Access Sidebar */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-3">
            <NavCard 
              title="Registry" 
              desc="The Library" 
              icon={<Layers size={18} />}
              onClick={() => navigate('/catalog')} 
            />
            <NavCard 
              title="Mirror" 
              desc="Cognitive Coach" 
              icon={<Shuffle size={18} />}
              onClick={() => navigate('/chat')} 
            />
            
            {state.mode === 'psychology' ? (
              <>
                <NavCard 
                  title="Shadow Quiz" 
                  desc="Integrity Test" 
                  icon={<ShieldAlert size={20} className="text-amber-500" />}
                  onClick={() => navigate('/quiz')} 
                />
                <NavCard 
                  title="Flashcards" 
                  desc="Retention" 
                  icon={<Zap size={20} className="text-emerald-500" />}
                  onClick={() => navigate('/flashcards')} 
                />
              </>
            ) : (
              <>
                <NavCard 
                  title="Trainer" 
                  desc="Pattern Deconstructor" 
                  icon={<Binary size={20} className="text-indigo-500" />}
                  onClick={() => navigate('/trainer')} 
                />
                <NavCard 
                  title="Architect" 
                  desc="Decision Auditor" 
                  icon={<Target size={20} className="text-rose-500" />}
                  onClick={() => navigate('/decision')} 
                />
              </>
            )}
          </div>

          <div className="pt-2">
             <div className="text-[8px] font-black uppercase tracking-[0.5em] text-indigo-500/40 mb-3 px-2">Upstream_System</div>
             <a 
               href="https://auraos.space" 
               target="_blank" 
               rel="noopener noreferrer"
               className="surface border-indigo-500/20 bg-indigo-500/5 p-6 rounded-[1.5rem] text-left flex items-center justify-between group active:scale-[0.98] transition-all hover:border-indigo-500/50"
             >
                <div className="flex items-center gap-5">
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-400 group-hover:bg-indigo-500/20 transition-all">
                    <ExternalLink size={24} />
                  </div>
                  <div>
                    <div className="text-indigo-100 font-bold text-[11px] uppercase tracking-[0.2em]">AURA_OS</div>
                    <div className="text-[9px] text-indigo-500/70 mt-1 uppercase tracking-widest font-mono">NEURAL_BRIDGE</div>
                  </div>
                </div>
                <ArrowRight size={16} className="text-indigo-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
             </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricTile: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color: string }> = ({ label, value, icon, color }) => (
  <div className="surface p-8 rounded-2xl flex flex-col justify-between group active:scale-[0.98] transition-all">
    <div className="flex items-center justify-between mb-6">
      <div className={`text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 group-hover:text-slate-300 transition-colors`}>{label}</div>
      <div className={`${color} opacity-40 group-hover:opacity-100 transition-opacity`}>{icon}</div>
    </div>
    <div className="text-4xl font-mono tabular-nums text-white tracking-tighter leading-none">{value}</div>
  </div>
);

const NavCard: React.FC<{ title: string; desc: string; icon: React.ReactNode; onClick: () => void }> = ({ title, desc, icon, onClick }) => (
  <button 
    onClick={onClick}
    className="surface surface-hover p-6 rounded-2xl text-left flex items-center justify-between group flex-1 active:scale-[0.98]"
  >
    <div className="flex items-center gap-5">
      <div className="p-3.5 bg-white/[0.03] border border-white/5 rounded-xl text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 transition-all duration-300">
        {icon}
      </div>
      <div>
        <div className="text-white font-bold text-[11px] uppercase tracking-[0.2em]">{title}</div>
        <div className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest font-medium opacity-80 group-hover:opacity-100 transition-opacity">{desc}</div>
      </div>
    </div>
    <ArrowRight size={14} className="text-slate-700 group-hover:text-white transition-all transform group-hover:translate-x-1" />
  </button>
);

export default Dashboard;
