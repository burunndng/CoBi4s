import React, { useState } from 'react';
import { Check, ArrowRight, Loader2, Award, ClipboardCheck, Zap, ShieldAlert, Heart, XCircle } from 'lucide-react';
import { Bias, QuizQuestion, AppState } from '../types';
import { generateQuizQuestion } from '../services/apiService';
import { BIASES, FALLACIES } from '../constants';

interface QuizProps {
  state: AppState;
  updateProgress: (id: string, quality: number) => void;
}

const SESSION_LENGTH = 10;

const Quiz: React.FC<QuizProps> = ({ state, updateProgress }) => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [nextQuestion, setNextQuestion] = useState<QuizQuestion | null>(null); // ⚡️ Pipeline Buffer
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [integrity, setIntegrity] = useState(100);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const getSourceBiases = () => {
    const allBiases = state.mode === 'psychology' ? BIASES : FALLACIES;
    const progressMap = state.mode === 'psychology' ? state.progress : state.fallacyProgress;
    
    let weakBiases = allBiases.filter(b => {
      const p = progressMap[b.id];
      return !p || p.masteryLevel < 70;
    });

    if (weakBiases.length === 0) {
      weakBiases = [...allBiases].sort((a, b) => 
        (progressMap[a.id]?.masteryLevel || 0) - (progressMap[b.id]?.masteryLevel || 0)
      ).slice(0, 10);
    }
    return weakBiases;
  };

  const preFetchNext = async (currentCount: number) => {
    // Stop pre-fetching if we've reached the end
    if (currentCount >= SESSION_LENGTH - 1) return;

    try {
      const weakBiases = getSourceBiases();
      // Architecture Sequencing logic
      const nextCount = currentCount + 1;
      const isScenario = nextCount === 2 || nextCount === 6;
      const isMetacognition = nextCount === 4;
      
      const targetBias = weakBiases[Math.floor(Math.random() * weakBiases.length)];
      const q = await generateQuizQuestion([targetBias] as any[], isScenario, isMetacognition);
      setNextQuestion(q);
    } catch (err) {
      console.error("Background synthesis failed", err);
    }
  };

  const advanceToNext = () => {
    if (nextQuestion) {
      setQuestion(nextQuestion);
      setNextQuestion(null);
      setAnswered(false);
      setSelected(null);
      // Fire background fetch for the FOLLOWING one
      preFetchNext(count);
    } else {
      // Fallback if user is faster than API
      fetchImmediate(count);
    }
  };

  const fetchImmediate = async (currentCount: number) => {
    setLoading(true);
    setAnswered(false);
    setSelected(null);
    setError(null);
    try {
      const weakBiases = getSourceBiases();
      const isScenario = currentCount === 2 || currentCount === 6;
      const isMetacognition = currentCount === 4;
      
      const targetBias = weakBiases[Math.floor(Math.random() * weakBiases.length)];
      const q = await generateQuizQuestion([targetBias] as any[], isScenario, isMetacognition);
      
      setQuestion(q);
      // Warm up the buffer for the next one
      preFetchNext(currentCount);
    } catch (err) {
      console.error(err);
      setError("The logic engine stuttered. Re-initializing...");
    } finally {
      setLoading(false);
    }
  };

  const handleStart = async () => {
    setActive(true);
    setIntegrity(100);
    setCount(0);
    setQuestion(null);
    setNextQuestion(null);
    fetchImmediate(0);
  };

  const handleAnswer = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    
    const isCorrect = option === question?.correctAnswer;
    
    if (isCorrect) {
      updateProgress(question!.biasId, 5);
    } else {
      setIntegrity(prev => Math.max(0, prev - 20)); 
      updateProgress(question!.biasId, 1);
    }
    setCount(c => c + 1);
  };

  if (!active) {
    return (
      <div className="max-w-xl mx-auto py-12 animate-fade-in">
        <div className="surface p-10 md:p-14 rounded-3xl text-center space-y-8 border-rose-500/10">
          <div className="flex justify-center">
            <div className="p-6 rounded-full border border-rose-500/20 bg-rose-500/5 relative animate-pulse">
              <ShieldAlert size={40} className="text-rose-500" />
              <div className="absolute -top-1 -right-1">
                <Zap size={18} className="text-amber-500 fill-amber-500" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <h2 className="serif text-4xl text-white italic">Shadow Quiz</h2>
            <p className="text-slate-500 text-sm max-w-sm mx-auto uppercase tracking-widest leading-relaxed">
              10-Item Adversarial Sequence. <br/> Identify the trap or lose integrity.
            </p>
          </div>
          <button 
            id="start-trap-sequence"
            name="start-trap-sequence"
            onClick={handleStart}
            className="btn-primary w-full py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-rose-900/20 active:scale-95 transition-all"
          >
            INITIALIZE_10_TRAP_SEQUENCE
          </button>
        </div>
      </div>
    );
  }

  if (integrity <= 0 || (count >= SESSION_LENGTH && answered)) {
    const isDefeated = integrity <= 0;
    return (
      <div className="max-w-md mx-auto py-12 text-center animate-fade-in">
        <div className={`surface p-12 rounded-3xl space-y-8 border ${isDefeated ? 'border-rose-500/30' : 'border-emerald-500/30'}`}>
          <div className={`p-6 w-fit mx-auto rounded-full border ${isDefeated ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'}`}>
            {isDefeated ? <XCircle size={48} /> : <Award size={48} />}
          </div>
          <div>
            <h2 className="serif text-5xl text-white italic mb-2">{isDefeated ? 'Overwhelmed' : 'Protocol Clear'}</h2>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-2">
              Final Integrity: {integrity}%
            </p>
          </div>
          <div className="grid gap-3 pt-4">
            <button onClick={handleStart} className="btn-primary w-full py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all">
              Re-Initialize Sequence
            </button>
            <button onClick={() => setActive(false)} className="text-slate-500 hover:text-white py-3 text-[10px] font-bold uppercase tracking-widest transition-colors active:scale-95">
              Retreat to Command
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8 animate-fade-in">
      {/* Integrity HUD */}
      <div className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex items-center gap-6">
           <div>
             <div className="text-[8px] font-mono text-slate-500 uppercase tracking-[0.4em] mb-1">Assessing_Logic</div>
             <div className="text-white font-bold text-lg tracking-tight italic serif">Trap {count + 1} / {SESSION_LENGTH}</div>
           </div>
           <div className="h-10 w-px bg-white/5"></div>
           <div className="w-48 md:w-64">
              <div className="flex justify-between text-[8px] font-mono uppercase tracking-widest mb-1.5">
                 <span className={integrity < 40 ? 'text-rose-500 animate-pulse' : 'text-slate-500'}>Integrity_Matrix</span>
                 <span className="text-white">{integrity}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div 
                   className={`h-full transition-all duration-1000 ${integrity > 60 ? 'bg-emerald-500' : integrity > 30 ? 'bg-amber-500' : 'bg-rose-600'}`}
                   style={{ width: `${integrity}%` }}
                 />
              </div>
           </div>
        </div>
        <div className="flex flex-col items-center">
           <Heart size={20} className={integrity < 40 ? 'text-rose-500 animate-pulse' : 'text-slate-800'} />
           {question?.isScenario && <div className="text-[8px] font-black text-indigo-400 uppercase mt-1 tracking-tighter">SCENARIO_ACTIVE</div>}
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 text-slate-700">
            <Loader2 className="animate-spin" size={32} />
            <span className="text-[10px] font-mono uppercase tracking-[0.5em] animate-pulse">Setting_Trap...</span>
          </div>
        ) : error ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-6 text-rose-500 surface rounded-3xl p-12">
             <ShieldAlert size={48} />
             <p className="text-sm font-mono uppercase tracking-widest">{error}</p>
             <button onClick={fetchNextQuestion} className="px-8 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-[10px] font-bold uppercase tracking-widest active:scale-95 transition-all">Retry Link</button>
          </div>
        ) : question && (
          <div className="space-y-10">
             <div className="surface p-10 rounded-3xl border-l-4 border-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <ShieldAlert size={120} />
                </div>
                <p className="text-xl md:text-2xl text-slate-100 leading-relaxed italic serif relative z-10">"{question.content}"</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {question.options.map((opt, idx) => {
                 const isCorrect = opt === question.correctAnswer;
                 const isSelected = opt === selected;
                 let style = 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10 text-slate-400';
                 
                 if (answered) {
                   if (isCorrect) style = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-100 font-bold shadow-[0_0_20px_rgba(16,185,129,0.1)]';
                   else if (isSelected) style = 'border-rose-500/50 bg-rose-500/10 text-rose-100';
                   else style = 'opacity-20 grayscale border-white/5';
                 }

                 return (
                   <button 
                     key={idx}
                     disabled={answered}
                     onClick={() => handleAnswer(opt)}
                     className={`w-full p-6 rounded-2xl border text-left text-sm transition-all flex items-start gap-4 active:scale-[0.98] ${style}`}
                   >
                     <span className={`w-6 h-6 flex items-center justify-center border rounded-lg font-mono text-[10px] shrink-0 mt-0.5 ${
                        answered && isCorrect ? 'bg-emerald-500 border-emerald-400 text-black' : 'border-white/10 text-slate-600'
                     }`}>
                        {String.fromCharCode(65 + idx)}
                     </span>
                     <span className="leading-snug">{opt}</span>
                   </button>
                 );
               })}
             </div>

             {answered && (
               <div className="surface p-8 rounded-3xl border border-white/5 animate-in slide-in-from-bottom-4 duration-500 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">
                      <Check size={14} className="text-emerald-500" /> System_Rationale
                    </div>
                    <div className={`text-[10px] font-black uppercase tracking-[0.3em] ${selected === question.correctAnswer ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {selected === question.correctAnswer ? '✓ INTEGRITY_MAINTAINED' : '✗ SYSTEM_BREACH'}
                    </div>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed font-light border-l-2 border-white/10 pl-6 italic">"{question.explanation}"</p>
                  <div className="pt-4 flex items-center justify-end gap-4">
                    {!nextQuestion && count < SESSION_LENGTH && (
                      <div className="flex items-center gap-2 text-[8px] font-mono text-slate-600 uppercase tracking-widest animate-pulse">
                        <Loader2 size={10} className="animate-spin" />
                        Buffering_Next_Trap
                      </div>
                    )}
                    <button 
                      onClick={advanceToNext}
                      className="px-10 py-4 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-emerald-50 transition-all active:scale-95 shadow-xl"
                    >
                      Initialize_Next_Trap <ArrowRight size={14} className="inline ml-2" strokeWidth={3} />
                    </button>
                  </div>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;