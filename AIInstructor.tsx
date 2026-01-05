
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, ArrowRight, Terminal, Check, X, Play, RotateCcw } from 'lucide-react';
import { AppState, Bias } from '../types';
import { BIASES } from '../constants';
import { generateSimulatorStep } from '../services/geminiService';

interface Message {
  role: 'user' | 'assistant' | 'system';
  text: string;
  type?: 'text' | 'feedback' | 'lesson';
}

interface StepData {
  scenario: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface AIInstructorProps {
  state: AppState;
  updateProgress: (biasId: string, quality: number) => void;
}

const AIInstructor: React.FC<AIInstructorProps> = ({ state, updateProgress }) => {
  const [phase, setPhase] = useState<'idle' | 'pre-test' | 'teaching' | 'post-test' | 'complete'>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentBias, setCurrentBias] = useState<Bias | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState<StepData | null>(null);
  const [score, setScore] = useState({ pre: false, post: false });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, loading, activeStep]);

  const addMessage = (role: Message['role'], text: string, type: Message['type'] = 'text') => {
    setMessages(prev => [...prev, { role, text, type }]);
  };

  const initSession = async () => {
    setPhase('pre-test');
    setLoading(true);
    setMessages([]);
    setScore({ pre: false, post: false });
    
    // Select bias with lowest mastery
    const target = [...BIASES].sort((a, b) => 
      (state.progress[a.id]?.masteryLevel || 0) - (state.progress[b.id]?.masteryLevel || 0)
    )[0];
    
    setCurrentBias(target);
    addMessage('system', `Protocol Initiated: ${target.name}`);

    try {
      const data = await generateSimulatorStep(target, 'pre');
      setActiveStep(data);
    } catch (err) {
      addMessage('system', "Connection error. Protocol aborted.");
      setPhase('idle');
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (index: number) => {
    if (loading || !activeStep) return;
    setLoading(true);

    const isCorrect = index === activeStep.correctIndex;
    if (phase === 'pre-test') setScore(s => ({ ...s, pre: isCorrect }));
    if (phase === 'post-test') setScore(s => ({ ...s, post: isCorrect }));

    addMessage('user', activeStep.options[index]);
    await new Promise(r => setTimeout(r, 600));

    addMessage('assistant', isCorrect ? "Analysis: Accurate." : "Analysis: Deviation Detected.", 'feedback');
    addMessage('assistant', activeStep.explanation, 'text');

    if (phase === 'pre-test') {
      setPhase('teaching');
      setActiveStep(null);
      if (currentBias) {
        setTimeout(() => {
          addMessage('assistant', `Core Concept: ${currentBias.definition}\n\nMitigation Strategy: ${currentBias.counterStrategy}`, 'lesson');
          setLoading(false);
        }, 800);
      }
    } else {
      completeSession(isCorrect);
    }
  };

  const startPostTest = async () => {
    setPhase('post-test');
    setLoading(true);
    addMessage('system', "Application assessment loading...");
    try {
      if (currentBias) {
        const data = await generateSimulatorStep(currentBias, 'post');
        setActiveStep(data);
      }
    } catch (err) {
      addMessage('system', "Simulation failure.");
    } finally {
      setLoading(false);
    }
  };

  const completeSession = (finalCorrect: boolean) => {
    setPhase('complete');
    setActiveStep(null);
    setLoading(false);
    const quality = (score.pre ? 2 : 0) + (finalCorrect ? 3 : 1);
    if (currentBias) updateProgress(currentBias.id, quality);
  };

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-12rem)] flex flex-col animate-fade-in">
      <header className="flex justify-between items-end border-b border-zinc-800 pb-4 mb-6">
        <div>
          <h1 className="serif text-2xl text-white italic">Simulator</h1>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Active: {currentBias?.name || "Ready"}</p>
        </div>
        <div className="flex gap-1">
          {['Phase 1', 'Phase 2', 'Phase 3'].map((p, i) => (
            <div key={p} className={`px-2 py-1 text-[9px] font-bold uppercase tracking-tighter ${
              (i === 0 && phase === 'pre-test') || (i === 1 && phase === 'teaching') || (i === 2 && phase === 'post-test')
                ? 'bg-white text-black' : 'bg-zinc-900 text-zinc-600'
            }`}>
              {p}
            </div>
          ))}
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-6 pr-4 no-scrollbar">
        {phase === 'idle' ? (
          <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-16 h-16 rounded-full border border-zinc-800 flex items-center justify-center">
              <Terminal size={24} className="text-zinc-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-white font-medium">Training Sequence Required</h3>
              <p className="text-xs text-zinc-500 max-w-xs mx-auto">Initialize simulation to assess and refine cognitive heuristics.</p>
            </div>
            <button onClick={initSession} className="btn-primary px-8 py-3 rounded-md text-xs uppercase tracking-widest flex items-center gap-2">
              <Play size={14} /> Start Protocol
            </button>
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start animate-fade-in'}`}>
                {msg.role === 'system' ? (
                  <div className="w-full text-center border-b border-zinc-900 leading-[0.1em] my-6">
                    <span className="bg-[#09090b] px-4 text-[9px] text-zinc-600 uppercase font-mono tracking-widest">{msg.text}</span>
                  </div>
                ) : (
                  <div className={`max-w-[85%] p-4 text-sm leading-relaxed border ${
                    msg.role === 'user' 
                      ? 'bg-zinc-100 text-black border-zinc-200 rounded-bl-xl rounded-tl-xl rounded-tr-xl' 
                      : 'surface border-zinc-800 rounded-br-xl rounded-tr-xl rounded-tl-xl'
                  }`}>
                    {msg.type === 'lesson' ? (
                      <div className="whitespace-pre-wrap font-medium text-zinc-300">
                        {msg.text.split('\n\n').map((para, pi) => (
                          <p key={pi} className={pi > 0 ? 'mt-4' : ''}>{para}</p>
                        ))}
                      </div>
                    ) : msg.text}
                  </div>
                )}
              </div>
            ))}

            {activeStep && (
              <div className="surface p-6 border-l-2 border-l-white animate-fade-in">
                <p className="text-xs font-mono text-zinc-500 mb-2 uppercase tracking-tight">Environment Scenario</p>
                <p className="text-sm text-zinc-200 italic mb-6 leading-relaxed">"{activeStep.scenario}"</p>
                <p className="text-sm text-white font-semibold mb-6">{activeStep.question}</p>
                <div className="grid gap-2">
                  {activeStep.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelect(idx)}
                      disabled={loading}
                      className="w-full text-left p-4 surface surface-hover text-sm text-zinc-300 flex items-center gap-4 transition-all"
                    >
                      <span className="w-6 h-6 flex items-center justify-center border border-zinc-800 rounded font-mono text-[10px] text-zinc-500">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {phase === 'complete' && (
              <div className="surface p-12 text-center rounded-xl animate-fade-in space-y-6">
                <div className="mx-auto w-12 h-12 rounded-full border border-zinc-800 flex items-center justify-center">
                  <Check size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Protocol Finalized</h3>
                  <p className="text-xs text-zinc-500 mt-2">Neural weight adjustments applied to local registry.</p>
                </div>
                <button onClick={initSession} className="btn-primary px-8 py-3 rounded-md text-xs uppercase tracking-widest flex items-center gap-2 mx-auto">
                  <RotateCcw size={14} /> Next Sequence
                </button>
              </div>
            )}

            {loading && !activeStep && (
              <div className="flex items-center gap-3 text-zinc-600 px-2">
                <Loader2 className="animate-spin" size={14} />
                <span className="text-[10px] font-mono uppercase tracking-widest">Processing Data...</span>
              </div>
            )}
          </>
        )}
      </div>

      {phase === 'teaching' && !loading && (
        <div className="mt-8 pt-6 border-t border-zinc-800">
          <button 
            onClick={startPostTest}
            className="w-full py-4 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-md hover:opacity-90 flex items-center justify-center gap-2"
          >
            Advance to Application <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AIInstructor;
