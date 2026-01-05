import React, { useState, useRef, useEffect } from 'react';
import { AppState, ChatMessage, ProgressState } from '../../types';
import { BIASES } from '../../constants';
import { sendChatMessage } from '../../services/apiService';
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

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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

    // Optimistic update
    setState(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, userMsg]
    }));
    setInput('');
    setLoading(true);

    try {
      // Calculate weak biases
      const weakBiases = Object.values(state.progress)
        .filter((p: ProgressState) => p.masteryLevel < 40)
        .map(p => BIASES.find(b => b.id === p.biasId)?.name)
        .filter(Boolean) as string[];

      // Prepare history for API
      const historyPayload = state.chatHistory.concat(userMsg).map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await sendChatMessage(historyPayload, weakBiases, secretMode);

      const aiMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response,
        timestamp: Date.now()
      };

      setState(prev => ({
        ...prev,
        chatHistory: [...prev.chatHistory, aiMsg]
      }));
    } catch (e) {
      console.error(e);
      // Optional: Add error message to chat
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    if (confirm("Clear conversation history?")) {
        setState(prev => ({ ...prev, chatHistory: [] }));
    }
  };

  const accentColor = secretMode ? 'text-violet-400' : 'text-indigo-400';
  const ringColor = secretMode ? 'focus:ring-violet-500/50' : 'focus:ring-indigo-500/50';
  const buttonColor = secretMode ? 'bg-violet-600 hover:bg-violet-700' : 'bg-indigo-600 hover:bg-indigo-700';

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-fade-in relative">
      {/* Header */}
      <div className="flex justify-between items-center pb-6 border-b border-white/5">
        <div>
          <h1 className="serif text-3xl text-white flex items-center gap-3 italic">
            {secretMode ? <Octagon size={24} className={accentColor} /> : <MessageSquare size={24} className={accentColor} />}
            {secretMode ? 'The Void' : 'Socratic Mirror'}
          </h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-2">
            {secretMode ? 'Unknown Protocol // Experimental' : 'Cognitive Debugging Interface'}
          </p>
        </div>
        
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setSecretMode(!secretMode)}
             className="p-2 text-zinc-800 hover:text-zinc-600 transition-colors opacity-50 hover:opacity-100"
             title="???"
           >
             <Octagon size={12} />
           </button>
           <button 
             onClick={clearChat}
             className="p-2 text-slate-600 hover:text-red-400 transition-colors"
             title="Clear History"
           >
             <Trash2 size={18} />
           </button>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-6 py-6 pr-2 scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent"
      >
        {state.chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-700 space-y-4 opacity-50">
             {secretMode ? <Octagon size={48} className="text-violet-900" /> : <MessageSquare size={48} />}
             <p className="text-xs uppercase tracking-widest font-bold">
               {secretMode ? 'System Listening...' : 'State your premise'}
             </p>
          </div>
        ) : (
          state.chatHistory.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        {loading && (
          <div className="flex gap-4">
             <div className={`w-8 h-8 rounded-full ${secretMode ? 'bg-violet-500/10 text-violet-400' : 'bg-indigo-500/10 text-indigo-400'} flex items-center justify-center border border-white/5`}>
                <Sparkles size={14} />
             </div>
             <div className="bg-white/[0.03] rounded-2xl px-6 py-4 text-xs text-slate-400 flex items-center gap-3 border border-white/5">
                <Loader2 size={12} className="animate-spin" /> 
                {secretMode ? 'Decoding...' : 'Analyzing Logic...'}
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="pt-4 mt-2">
        <div className="relative group">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder={secretMode ? "Speak into the void..." : "Describe the situation..."}
            disabled={loading}
            className={`w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-6 pr-16 text-white focus:ring-1 ${ringColor} outline-none transition-all placeholder:text-zinc-700 font-light`}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-3 ${buttonColor} text-white rounded-xl transition-all shadow-lg shadow-black/50 disabled:opacity-0 disabled:translate-x-4`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Import Sparkles icon locally since it's used in this file too
import { Sparkles } from 'lucide-react'; 
