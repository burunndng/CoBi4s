import React, { useState, useRef, useEffect } from 'react';
import { AppState, ChatMessage, ProgressState } from '../../types';
import { BIASES } from '../../constants';
import { streamChatMessage } from '../../services/apiService';
import { MessageBubble } from './MessageBubble';
import { Send, MessageSquare, Trash2, Loader2, Octagon, Sparkles } from 'lucide-react';

interface ChatInterfaceProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ state, setState }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [secretMode, setSecretMode] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

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
    }
  };

  const accentColor = secretMode ? 'text-violet-400' : 'text-indigo-400';
  const ringColor = secretMode ? 'focus:ring-violet-500/50' : 'focus:ring-indigo-500/50';
  const buttonColor = secretMode ? 'bg-violet-600 hover:bg-violet-700' : 'bg-indigo-600 hover:bg-indigo-700';

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-fade-in relative">
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
  );
};