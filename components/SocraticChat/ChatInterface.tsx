import React, { useState, useRef, useEffect } from 'react';
import { AppState, ChatMessage, ProgressState } from '../../types';
import { BIASES, FALLACIES } from '../../constants';
import { streamChatMessage } from '../../services/apiService';
import { MessageBubble } from './MessageBubble';
import { Send, MessageSquare, Trash2, Loader2, Octagon, Sparkles, Target, Zap, X } from 'lucide-react';

interface ChatInterfaceProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ state, setState }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [secretMode, setSecretMode] = useState(false);
  const [detectedPatterns, setDetectedPatterns] = useState<string[]>([]);
  const [isHudOpen, setIsHudOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ⚡️ HACKODER: Live Pattern Scanner
  useEffect(() => {
    const lastMsg = state.chatHistory[state.chatHistory.length - 1];
    if (lastMsg && lastMsg.role === 'assistant') {
      const content = lastMsg.content.toLowerCase();
      const allTerms = [...BIASES, ...FALLACIES];
      
      allTerms.forEach(term => {
        if (content.includes(term.name.toLowerCase()) && !detectedPatterns.includes(term.id)) {
          setDetectedPatterns(prev => [...prev, term.id]);
        }
      });
    }
  }, [state.chatHistory, detectedPatterns]);

  // ⚡️ HACKODER: Advanced Scroll Anchoring
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      if (isNearBottom || loading) {
        scrollRef.current.scrollTop = scrollHeight;
      }
    }
  }, [state.chatHistory, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: Date.now()
    };

    const aiMsgId = crypto.randomUUID();
    const aiMsgPlaceholder: ChatMessage = {
      id: aiMsgId,
      role: 'assistant',
      content: '', 
      timestamp: Date.now()
    };

    // Atomic Push
    setState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMsg, aiMsgPlaceholder]
    }));
    
    setInput('');
    setLoading(true);

    try {
      const weakBiases = Object.values(state.progress)
        .filter((p: ProgressState) => p.masteryLevel < 40)
        .map(p => BIASES.find(b => b.id === p.biasId)?.name)
        .filter(Boolean) as string[];

      const historyPayload = state.chatHistory.concat(userMsg).map(m => ({
        role: m.role,
        content: m.content
      }));

      // 🌊 COMMENCE STREAM
      await streamChatMessage(
        historyPayload, 
        weakBiases, 
        secretMode, 
        (token) => {
          setState(prev => ({
            ...prev,
            chatHistory: prev.chatHistory.map(msg => 
              msg.id === aiMsgId ? { ...msg, content: msg.content + token } : msg
            )
          }));
        }
      );
    } catch (e) {
      console.error("Mirror Stream Error:", e);
      setState(prev => ({
        ...prev,
        chatHistory: prev.chatHistory.map(msg => 
          msg.id === aiMsgId ? { ...msg, content: "ERROR: NEURAL_LINK_FAILED. Verify API Key in Configuration." } : msg
        )
      }));
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Purge local history? This action is irreversible.")) {
        setState(prev => ({ ...prev, chatHistory: [] }));
        setDetectedPatterns([]);
    }
  };

  const accentColor = secretMode ? 'text-violet-400' : 'text-indigo-400';
  const ringColor = secretMode ? 'focus:ring-violet-500/50' : 'focus:ring-indigo-500/50';
  const buttonColor = secretMode ? 'bg-violet-600 hover:bg-violet-700' : 'bg-indigo-600 hover:bg-indigo-700';

  return (
    <div className="max-w-6xl mx-auto h-[calc(100vh-140px)] flex gap-8 animate-fade-in relative">
      {/* ⚡️ MAIN TERMINAL */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header: Architectural Readout */}
        <div className="flex justify-between items-center pb-8 border-b border-white/5">
          <div>
            <h1 className="serif text-4xl text-white flex items-center gap-4 italic font-light">
              {secretMode ? <Octagon size={28} className={accentColor} /> : <MessageSquare size={28} className={accentColor} />}
              {secretMode ? 'The Void' : 'Socratic Mirror'}
            </h1>
            <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-bold mt-2 pl-1">
              {secretMode ? 'PROTOCOL_ALPHA // UNRESTRICTED' : 'Neural_Diagnostics // Analysis_Mode'}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Mobile HUD Toggle */}
             <button 
               onClick={() => setIsHudOpen(!isHudOpen)}
               className="xl:hidden p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-amber-500 hover:text-amber-400 transition-all relative"
               title="Toggle Diagnostics"
             >
               <Target size={18} />
               {detectedPatterns.length > 0 && (
                 <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-black text-[8px] font-bold rounded-full flex items-center justify-center animate-pulse">
                   {detectedPatterns.length}
                 </span>
               )}
             </button>

             <button 
               onClick={() => setSecretMode(!secretMode)}
               className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-zinc-800 hover:text-violet-500 transition-all hover:border-violet-500/30"
               title="Initialize Secret Protocol"
             >
               <Octagon size={14} />
             </button>
             <button 
               onClick={clearChat}
               className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-slate-600 hover:text-rose-500 transition-all hover:border-rose-500/30"
               title="Purge Memory"
             >
               <Trash2 size={18} />
             </button>
          </div>
        </div>

        {/* Neural Log: The Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-8 py-8 pr-4 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent no-scrollbar"
        >
          {state.chatHistory.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-800 space-y-6 opacity-40">
               {secretMode ? <Octagon size={64} className="animate-pulse text-violet-900" /> : <MessageSquare size={64} />}
               <div className="text-center space-y-2">
                  <p className="text-[10px] uppercase tracking-[0.5em] font-black">System Ready</p>
                  <p className="text-xs font-mono italic">Awaiting cognitive input...</p>
               </div>
            </div>
          ) : (
            state.chatHistory.map(msg => (
              <MessageBubble key={msg.id} message={msg} />
            ))
          )}
          
          {loading && state.chatHistory[state.chatHistory.length - 1]?.content === '' && (
            <div className="flex gap-4 animate-in fade-in duration-500">
               <div className={`w-10 h-10 rounded-xl ${secretMode ? 'bg-violet-500/10 text-violet-400' : 'bg-indigo-500/10 text-indigo-400'} flex items-center justify-center border border-white/5`}>
                  <Sparkles size={16} />
               </div>
               <div className="bg-white/[0.02] rounded-2xl px-6 py-4 text-[10px] uppercase tracking-widest text-slate-500 flex items-center gap-3 border border-white/5">
                  <Loader2 size={14} className="animate-spin" /> 
                  Compiling_Logic...
               </div>
            </div>
          )}
        </div>

        {/* Input Terminal */}
        <div className="pt-6 pb-2">
          <div className="relative group">
            <input 
              type="text" 
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder={secretMode ? "Query the void..." : "Log your internal state..."}
              disabled={loading}
              className={`w-full bg-white/[0.02] border border-white/10 rounded-2xl py-6 pl-8 pr-20 text-white focus:ring-1 ${ringColor} outline-none transition-all placeholder:text-zinc-800 font-light text-lg italic serif`}
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-4 ${buttonColor} text-white rounded-xl transition-all shadow-2xl shadow-black/50 disabled:opacity-0 disabled:translate-x-8`}
            >
              <Send size={20} />
            </button>
          </div>
          <div className="flex justify-between px-4 mt-3">
             <span className="text-[8px] font-mono text-slate-700 uppercase tracking-[0.3em]">End_to_End_Encryption: Active</span>
             <span className="text-[8px] font-mono text-slate-700 uppercase tracking-[0.3em]">Neural_Sync: {loading ? 'Active' : 'Standby'}</span>
          </div>
        </div>
      </div>

      {/* ⚡️ DIAGNOSTIC HUD: PATTERN HARVESTER */}
      <aside className={`
        fixed xl:relative inset-y-0 right-0 z-50 xl:z-auto
        w-80 bg-[#070708] xl:bg-transparent
        border-l border-white/5 pl-8 pr-4 xl:pr-0 py-4
        transform transition-transform duration-500 ease-in-out
        ${isHudOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full xl:translate-x-0'}
        flex flex-col
      `}>
        {/* Mobile Close Handle */}
        <button 
          onClick={() => setIsHudOpen(false)}
          className="xl:hidden absolute left-0 top-1/2 -translate-x-full bg-white/5 border border-white/5 border-r-0 p-2 rounded-l-xl text-slate-500"
        >
          <X size={20} />
        </button>

        <div className="mb-8">
           <h3 className="text-[10px] font-bold text-white uppercase tracking-[0.4em] mb-2">Diagnostic_Capture</h3>
           <p className="text-[10px] text-slate-600 uppercase tracking-widest leading-relaxed">
             Real-time pattern extraction from neural stream.
           </p>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 no-scrollbar">
           {detectedPatterns.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/5 rounded-2xl opacity-20">
                <Target size={24} className="mb-4" />
                <p className="text-[8px] uppercase tracking-widest">No Patterns Hooked</p>
             </div>
           ) : (
             detectedPatterns.map(id => {
               const pattern = [...BIASES, ...FALLACIES].find(p => p.id === id);
               if (!pattern) return null;
               const isLogic = 'type' in pattern;
               return (
                 <div 
                   key={id} 
                   className={`p-5 rounded-2xl border bg-white/[0.02] animate-in zoom-in-95 duration-500 transition-all hover:bg-white/[0.05] cursor-pointer group ${isLogic ? 'border-rose-500/20 hover:border-rose-500/50' : 'border-indigo-500/20 hover:border-indigo-500/50'}`}
                   onClick={() => {
                     setState(prev => ({ ...prev, mode: isLogic ? 'logic' : 'psychology' }));
                     window.location.hash = '#/catalog';
                   }}
                 >
                    <div className="flex justify-between items-start mb-3">
                       <span className={`text-[8px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${isLogic ? 'text-rose-400 border-rose-500/30 bg-rose-500/5' : 'text-indigo-400 border-indigo-500/30 bg-indigo-500/5'}`}>
                         {isLogic ? 'Fallacy' : 'Bias'}
                       </span>
                       <Zap size={10} className={`${isLogic ? 'text-rose-500' : 'text-indigo-500'} animate-pulse shadow-[0_0_8px_currentColor]`} />
                    </div>
                    <h4 className="text-white text-xs font-bold uppercase tracking-tight mb-1">{pattern.name}</h4>
                    <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">{pattern.definition}</p>
                 </div>
               );
             })
           )}
        </div>

        <div className="mt-8 pt-8 border-t border-white/5">
           <div className="flex items-center justify-between text-[8px] font-mono text-slate-700 uppercase tracking-widest">
              <span>Patterns_Logged</span>
              <span className="text-white font-bold">{detectedPatterns.length}</span>
           </div>
        </div>
      </aside>
    </div>
  );
};
