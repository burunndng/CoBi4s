import React, { useState, useRef, useEffect } from 'react';
import { AppState, ShadowBoxingSession, ShadowBoxingTurn, Fallacy } from '../types';
import { FALLACIES, DEBATE_TOPICS } from '../constants';
import { generateAdversarialStatement, evaluateCallout } from '../services/apiService';
import { Swords, Shield, AlertTriangle, Send, Zap, Brain, Target, RefreshCw, Loader2, ArrowRight, X, Gavel, Ghost, Skull } from 'lucide-react';

interface ShadowBoxingProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

type OpponentType = 'sophist' | 'gaslighter' | 'nihilist';

const OPPONENTS = {
  sophist: {
    name: "The Sophist",
    desc: "Uses complex words to hide weak logic. Master of Strawman and Red Herring.",
    icon: <Gavel size={24} />,
    color: "text-amber-400",
    border: "border-amber-500/20"
  },
  gaslighter: {
    name: "The Gaslighter",
    desc: "Denies objective reality. Attacks your memory and perception.",
    icon: <Ghost size={24} />,
    color: "text-violet-400",
    border: "border-violet-500/20"
  },
  nihilist: {
    name: "The Nihilist",
    desc: "Refuses to accept any value hierarchy. Uses Appeal to Futility.",
    icon: <Skull size={24} />,
    color: "text-rose-400",
    border: "border-rose-500/20"
  }
};

export const ShadowBoxing: React.FC<ShadowBoxingProps> = ({ state, setState }) => {
  const [phase, setPhase] = useState<'setup' | 'active'>('setup');
  const [opponent, setOpponent] = useState<OpponentType>('sophist');
  const [topic, setTopic] = useState('');
  
  const [session, setSession] = useState<ShadowBoxingSession | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [calloutFeedback, setCalloutFeedback] = useState<{ isCorrect: boolean; explanation: string } | null>(null);
  const [isArsenalOpen, setIsArsenalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [session?.history, loading]);

  const startSession = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setPhase('active');
    
    try {
      // ⚡️ ADVERSARY INJECTION: Inject Persona into initial prompt
      const response = await generateAdversarialStatement(topic, [], FALLACIES);
      const firstTurn: ShadowBoxingTurn = {
        id: crypto.randomUUID(),
        role: 'adversary',
        content: response.content,
        timestamp: Date.now(),
        fallacyInjected: response.fallacyId
      };

      const newSession: ShadowBoxingSession = {
        id: crypto.randomUUID(),
        topic,
        integrityPoints: 100,
        history: [firstTurn],
        status: 'active',
        startTime: Date.now()
      };

      setSession(newSession);
      setIsArsenalOpen(false);
    } catch (e) {
      console.error(e);
      setPhase('setup'); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || !session || loading) return;

    const userTurn: ShadowBoxingTurn = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    setSession(prev => prev ? {
      ...prev,
      history: [...prev.history, userTurn]
    } : null);

    setInput('');
    setLoading(true);

    try {
      const historyPayload = session.history.concat(userTurn).map(h => ({
        role: h.role === 'adversary' ? 'assistant' : 'user',
        content: h.content
      }));

      const response = await generateAdversarialStatement(session.topic, historyPayload, FALLACIES);
      
      const aiTurn: ShadowBoxingTurn = {
        id: crypto.randomUUID(),
        role: 'adversary',
        content: response.content,
        timestamp: Date.now(),
        fallacyInjected: response.fallacyId
      };

      // Check if user missed previous fallacies
      let damage = 0;
      const missedFallacies = session.history.filter(h => h.role === 'adversary' && h.fallacyInjected && !h.calloutDetected);
      if (missedFallacies.length > 2) {
        damage = 15;
      }

      setSession(prev => {
        if (!prev) return null;
        const newIntegrity = Math.max(0, prev.integrityPoints - damage);
        return {
          ...prev,
          integrityPoints: newIntegrity,
          history: [...prev.history, aiTurn],
          status: newIntegrity <= 0 ? 'defeated' : 'active'
        };
      });

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCallout = async (fallacyId: string) => {
    if (!session || loading) return;
    
    const lastAdversaryTurnIndex = [...session.history].reverse().findIndex(h => h.role === 'adversary' && !h.calloutDetected);
    if (lastAdversaryTurnIndex === -1) {
      setIsArsenalOpen(false);
      return;
    }
    
    const actualIndex = session.history.length - 1 - lastAdversaryTurnIndex;
    const turn = session.history[actualIndex];
    
    setLoading(true);
    try {
      const fallacy = FALLACIES.find(f => f.id === fallacyId);
      const result = await evaluateCallout(turn.content, fallacyId, turn.fallacyInjected || '', fallacy?.name || '');
      
      setCalloutFeedback(result);
      if (window.innerWidth < 1024) setIsArsenalOpen(false);

      setSession(prev => {
        if (!prev) return null;
        const newHistory = [...prev.history];
        newHistory[actualIndex] = {
          ...turn,
          calloutDetected: {
            fallacyId,
            isCorrect: result.isCorrect,
            explanation: result.explanation
          }
        };

        return {
          ...prev,
          integrityPoints: Math.min(100, prev.integrityPoints + (result.isCorrect ? 10 : -10)),
          history: newHistory
        };
      });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (phase === 'setup' || !session) {
    return (
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in pb-32">
        <div className="text-center space-y-4 pt-10">
           <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
              <Swords size={40} className="text-rose-500" />
           </div>
           <h1 className="serif text-5xl font-light text-white italic">Shadow Boxing</h1>
           <p className="text-slate-500 text-sm max-w-lg mx-auto leading-relaxed">
             Select an opponent and a topic. Your goal is to defend your position against an AI trained to use logical fallacies and manipulation.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {(Object.keys(OPPONENTS) as OpponentType[]).map(key => (
             <button 
               key={key}
               onClick={() => setOpponent(key)}
               className={`p-6 rounded-2xl border text-left transition-all active:scale-95 ${
                 opponent === key ? `bg-zinc-900 ${OPPONENTS[key].border} ring-1 ring-white/20` : 'bg-zinc-950 border-white/5 hover:bg-zinc-900'
               }`}
             >
                <div className={`mb-4 ${OPPONENTS[key].color}`}>{OPPONENTS[key].icon}</div>
                <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-2">{OPPONENTS[key].name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{OPPONENTS[key].desc}</p>
             </button>
           ))}
        </div>

        <div className="surface p-8 rounded-3xl border border-white/5 space-y-6">
           <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">The_Contention</h3>
           
           <div className="flex flex-wrap gap-3">
              {DEBATE_TOPICS.map((t, i) => (
                <button 
                  key={i} 
                  onClick={() => setTopic(t)}
                  className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                    topic === t ? 'bg-white text-black font-bold' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {t}
                </button>
              ))}
           </div>

           <div className="relative">
              <input 
                type="text" 
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="Or type your own topic..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white focus:border-rose-500/50 outline-none"
              />
           </div>

           <div className="flex justify-end pt-4">
              <button 
                onClick={startSession}
                disabled={!topic || loading}
                className="bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-xl shadow-rose-900/20 active:scale-95"
              >
                {loading ? <Loader2 className="animate-spin" /> : <ArrowRight size={14} />}
                {loading ? 'INITIALIZING...' : 'ENTER_ARENA'}
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex flex-col gap-4 md:gap-6 animate-fade-in relative px-4 md:px-0">
      {/* HUD: Combat Metrics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/[0.02] border border-white/5 rounded-2xl p-4 md:p-6 backdrop-blur-xl gap-4">
        <div className="flex items-center gap-4 md:gap-6 w-full sm:w-auto">
           <button onClick={() => setPhase('setup')} className="p-2 hover:bg-white/5 rounded-lg text-slate-500 hover:text-white transition-colors">
              <X size={20} />
           </button>
           <div>
             <div className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.4em] mb-1">Combatant_User</div>
             <div className="text-white font-bold text-base md:text-lg tracking-tight">Logical Defenses</div>
           </div>
           <div className="h-10 w-px bg-white/5 hidden sm:block"></div>
           <div className="flex-1 sm:w-64">
              <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest mb-1">
                 <span className="text-rose-400">Integrity_Critical</span>
                 <span className="text-white">{session.integrityPoints}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div 
                   className={`h-full transition-all duration-1000 ${session.integrityPoints > 50 ? 'bg-indigo-500' : session.integrityPoints > 20 ? 'bg-amber-500' : 'bg-rose-600'}`}
                   style={{ width: `${session.integrityPoints}%` }}
                 />
              </div>
           </div>
        </div>

        <div className="text-left sm:text-right flex sm:block items-center justify-between w-full sm:w-auto">
           <div className={`text-[8px] font-mono uppercase tracking-[0.4em] mb-1 animate-pulse ${OPPONENTS[opponent].color}`}>Adversary_Active</div>
           <div className="serif italic text-lg md:text-xl text-white">"{OPPONENTS[opponent].name}"</div>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden relative">
        {/* Arena Log */}
        <div className="flex-1 flex flex-col min-w-0">
          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto space-y-8 p-4 md:p-6 surface rounded-2xl mb-4 scrollbar-thin scrollbar-thumb-white/5 no-scrollbar"
          >
            {session.history.map(turn => (
              <div key={turn.id} className={`flex gap-4 ${turn.role === 'user' ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${
                  turn.role === 'user' ? 'bg-white/5 border-white/10 text-white' : `bg-rose-500/10 ${OPPONENTS[opponent].border} ${OPPONENTS[opponent].color}`
                }`}>
                  {turn.role === 'user' ? <Shield size={16} /> : OPPONENTS[opponent].icon}
                </div>
                <div className={`max-w-[90%] md:max-w-[80%] p-4 md:p-6 rounded-2xl relative ${
                  turn.role === 'user' 
                    ? 'bg-white/[0.03] border border-white/5 text-white italic font-light serif text-base md:text-lg' 
                    : `bg-rose-950/10 ${OPPONENTS[opponent].border} text-rose-100 font-mono text-xs md:text-sm leading-relaxed`
                }`}>
                  {turn.content}
                  
                  {turn.calloutDetected && (
                    <div className={`mt-4 p-4 rounded-xl border text-[10px] md:text-[11px] font-sans ${
                      turn.calloutDetected.isCorrect ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                    }`}>
                       <div className="font-bold uppercase tracking-widest mb-1">
                         {turn.calloutDetected.isCorrect ? '✓ Counter-Strike Successful' : '✗ Counter-Strike Failed'}
                       </div>
                       {turn.calloutDetected.explanation}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-4 animate-pulse">
                <div className="w-10 h-10 rounded-xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin text-rose-500" />
                </div>
                <div className="bg-rose-950/5 border border-rose-500/10 rounded-2xl px-6 py-4 text-[10px] uppercase tracking-widest text-rose-800">
                  {OPPONENTS[opponent].name} is plotting...
                </div>
              </div>
            )}
          </div>

          <div className="relative flex gap-2">
            <button 
              onClick={() => setIsArsenalOpen(!isArsenalOpen)}
              className="lg:hidden p-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl active:scale-95"
            >
              <Target size={24} />
            </button>
            <div className="relative flex-1">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder={`Defend against ${OPPONENTS[opponent].name}...`}
                disabled={loading || session.status !== 'active'}
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-5 md:py-6 pl-6 md:pl-8 pr-16 md:pr-20 text-white focus:ring-1 focus:ring-rose-500/50 outline-none transition-all placeholder:text-zinc-800 serif italic text-base md:text-lg"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading || session.status !== 'active'}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-3.5 md:p-4 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all shadow-2xl disabled:opacity-0 active:scale-95"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Callout HUD (Arsenal) */}
        <aside className={`
          fixed lg:relative inset-y-0 right-0 z-50 lg:z-auto
          w-80 bg-[#070708] lg:bg-transparent
          border-l border-white/5 pl-8 pr-4 lg:pr-0 py-4
          transform transition-transform duration-500 ease-in-out
          ${isArsenalOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full lg:translate-x-0'}
          flex flex-col gap-6
        `}>
          {/* Mobile Close Handle */}
          <button 
            onClick={() => setIsArsenalOpen(false)}
            className="lg:hidden absolute left-0 top-1/2 -translate-x-full bg-white/5 border border-white/5 border-r-0 p-4 rounded-l-2xl text-slate-500 active:scale-90"
          >
            <X size={24} />
          </button>

          <div className="surface p-6 rounded-2xl flex-1 flex flex-col">
             <div className="mb-6">
                <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.4em] mb-2 flex items-center gap-2">
                  <Target size={14} className="text-rose-500" /> Strike_Arsenal
                </h3>
                <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-relaxed">Identify the injected fallacy.</p>
             </div>

             <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
                {FALLACIES.map(fallacy => (
                  <button
                    key={fallacy.id}
                    onClick={() => handleCallout(fallacy.id)}
                    disabled={loading || session.status !== 'active'}
                    className="w-full text-left p-4 md:p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/40 hover:bg-indigo-500/5 transition-all group active:scale-95"
                  >
                    <div className="text-[11px] md:text-xs text-white font-bold group-hover:text-indigo-400 transition-colors">{fallacy.name}</div>
                  </button>
                ))}
             </div>
          </div>

          <button 
            onClick={() => setSession(null)}
            className="p-4 md:p-5 rounded-xl border border-white/5 bg-white/[0.02] text-[10px] uppercase tracking-[0.4em] text-slate-500 hover:text-white hover:bg-rose-600/10 hover:border-rose-600/20 transition-all flex items-center justify-center gap-3 active:scale-95"
          >
            <RefreshCw size={14} /> Retreat_&_Refactor
          </button>
        </aside>
      </div>

      {/* Game Over Overlays */}
      {session.status !== 'active' && (
        <div className="absolute inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-500">
           <div className="max-w-md w-full surface p-12 rounded-3xl text-center border-rose-500/30">
              {session.status === 'defeated' ? (
                <>
                  <AlertTriangle size={64} className="mx-auto text-rose-500 mb-6 animate-bounce" />
                  <h2 className="serif text-5xl text-white mb-4 italic">Defeated</h2>
                  <p className="text-slate-400 font-light leading-relaxed mb-8">
                    Your cognitive defenses were overwhelmed. Integrity depleted.
                  </p>
                </>
              ) : (
                <>
                  < Zap size={64} className="mx-auto text-amber-500 mb-6 animate-pulse" />
                  <h2 className="serif text-5xl text-white mb-4 italic">Victory</h2>
                  <p className="text-slate-400 font-light leading-relaxed mb-8">
                    You've dismantled the adversary's logic.
                  </p>
                </>
              )}
              <button 
                onClick={() => setSession(null)}
                className="w-full btn-primary py-4 rounded-xl flex items-center justify-center gap-2"
              >
                Return to Arena Selection <ArrowRight size={16} />
              </button>
           </div>
        </div>
      )}
    </div>
  );
};
