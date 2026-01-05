
import React, { useState } from 'react';
import { Check, ArrowRight, Loader2, Award, ClipboardCheck, Zap } from 'lucide-react';
import { Bias, QuizQuestion } from '../types';
import { generateQuizQuestion } from '../services/apiService';

interface QuizProps {
  biases: Bias[];
  onXpGain: (xp: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ biases, onXpGain }) => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState<QuizQuestion | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [count, setCount] = useState(0);

  const fetchNextQuestion = async () => {
    setLoading(true);
    setAnswered(false);
    setSelected(null);
    try {
      const q = await generateQuizQuestion(biases);
      setQuestion(q);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStart = () => {
    setActive(true);
    setScore(0);
    setCount(0);
    fetchNextQuestion();
  };

  const handleAnswer = (option: string) => {
    if (answered) return;
    setSelected(option);
    setAnswered(true);
    if (option === question?.correctAnswer) {
      setScore(s => s + 1);
      onXpGain(15);
    }
    setCount(c => c + 1);
  };

  if (!active) {
    return (
      <div className="max-w-xl mx-auto py-12 animate-fade-in">
        <div className="surface p-10 md:p-14 rounded-xl text-center space-y-8">
          <div className="flex justify-center">
            <div className="p-4 rounded-full border border-zinc-800 relative">
              <ClipboardCheck size={32} className="text-zinc-500" />
              <div className="absolute -top-1 -right-1">
                <Zap size={14} className="text-blue-500 fill-blue-500" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h2 className="serif text-3xl text-white italic">Assessment</h2>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">System optimized for low-latency scenario generation.</p>
          </div>
          <button 
            onClick={handleStart}
            className="btn-primary w-full py-4 rounded-md text-xs font-bold uppercase tracking-widest"
          >
            Initiate Sequence
          </button>
        </div>
      </div>
    );
  }

  if (count >= 5 && answered) {
    return (
      <div className="max-w-md mx-auto py-12 text-center animate-fade-in">
        <div className="surface p-12 rounded-xl space-y-8">
          <div className="p-4 bg-zinc-900 w-fit mx-auto rounded-full border border-zinc-800">
            <Award size={40} className="text-white" />
          </div>
          <div>
            <div className="text-4xl font-serif text-white italic">{Math.round((score/5)*100)}%</div>
            <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">Precision Metric</p>
          </div>
          <div className="grid gap-3 pt-4">
            <button onClick={handleStart} className="btn-primary w-full py-3 rounded-md text-xs font-bold uppercase tracking-widest">
              Restart Protocol
            </button>
            <button onClick={() => setActive(false)} className="text-zinc-500 hover:text-white py-3 text-xs font-bold uppercase tracking-widest transition-colors">
              Exit Simulator
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-8 space-y-6">
      <div className="flex justify-between items-end border-b border-zinc-800 pb-4">
        <div>
          <h2 className="serif text-xl text-white italic">Assessment</h2>
          <p className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest mt-1">Item {count + 1} of 5</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Score: {score}</div>
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col justify-center">
        {loading ? (
          <div className="flex flex-col items-center gap-4 text-zinc-600 animate-pulse">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-[10px] font-mono uppercase tracking-widest">Synthesizing...</span>
          </div>
        ) : question && (
          <div className="animate-fade-in space-y-10">
             <div className="surface p-8 border-l-2 border-white">
                <p className="text-sm text-zinc-200 leading-relaxed whitespace-pre-wrap italic">"{question.content}"</p>
             </div>

             <div className="grid gap-3">
               {question.options.map((opt, idx) => {
                 const isCorrect = opt === question.correctAnswer;
                 const isSelected = opt === selected;
                 let style = 'border-zinc-800 hover:bg-zinc-900 text-zinc-400';
                 
                 if (answered) {
                   if (isCorrect) style = 'border-white bg-zinc-100 text-black font-semibold';
                   else if (isSelected) style = 'border-red-900 bg-red-950/20 text-red-500';
                   else style = 'opacity-30 border-zinc-900';
                 }

                 return (
                   <button 
                     key={idx}
                     disabled={answered}
                     onClick={() => handleAnswer(opt)}
                     className={`w-full p-4 rounded-md border text-left text-sm transition-all flex items-center gap-4 ${style}`}
                   >
                     <span className={`w-6 h-6 flex items-center justify-center border rounded font-mono text-[10px] ${
                        answered && isCorrect ? 'border-black/20 text-black/40' : 'border-zinc-800 text-zinc-600'
                     }`}>
                        {String.fromCharCode(65 + idx)}
                     </span>
                     {opt}
                   </button>
                 );
               })}
             </div>

             {answered && (
               <div className="surface p-8 border border-zinc-800 animate-fade-in space-y-4">
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    <Check size={12} /> Rationale
                  </div>
                  <p className="text-sm text-zinc-300 leading-relaxed">{question.explanation}</p>
                  <div className="pt-4 flex justify-end">
                    <button 
                      onClick={fetchNextQuestion}
                      className="px-6 py-2 border border-white text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                    >
                      Advance <ArrowRight size={12} className="inline ml-1" />
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
