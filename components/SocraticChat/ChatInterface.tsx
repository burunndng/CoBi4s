import React, { useState, useRef, useEffect } from 'react';
import { AppState, ChatMessage, ProgressState } from '../../types';
import { BIASES } from '../../constants';
import { sendChatMessage } from '../../services/apiService';
import { MessageBubble } from './MessageBubble';
import { Send, MessageSquare, Trash2, Loader2 } from 'lucide-react';

interface ChatInterfaceProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ state, setState }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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

      const response = await sendChatMessage(historyPayload, weakBiases);

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

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-140px)] flex flex-col animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center pb-4 border-b border-zinc-800">
        <div>
          <h1 className="serif text-2xl text-slate-100 flex items-center gap-3">
            <MessageSquare className="w-6 h-6 text-indigo-400" />
            Socratic Mirror
          </h1>
          <p className="text-slate-500 text-xs mt-1">
            Vent about a problem. I'll help you find the distortion.
          </p>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 text-slate-600 hover:text-red-400 transition-colors"
          title="Clear History"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Chat Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 py-4 pr-2 scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent"
      >
        {state.chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 opacity-50">
             <MessageSquare size={48} />
             <p className="text-sm">Start by describing a recent conflict or decision.</p>
          </div>
        ) : (
          state.chatHistory.map(msg => (
            <MessageBubble key={msg.id} message={msg} />
          ))
        )}
        {loading && (
          <div className="flex gap-3">
             <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Sparkles size={16} />
             </div>
             <div className="bg-zinc-900/50 rounded-2xl px-4 py-3 text-sm text-slate-400 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin" /> Thinking...
             </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="pt-4 mt-2">
        <div className="relative">
          <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Type your thought here..."
            disabled={loading}
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-4 pl-5 pr-14 text-white focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all placeholder:text-zinc-600"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-0 disabled:pointer-events-none"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Import Sparkles icon locally since it's used in this file too
import { Sparkles } from 'lucide-react'; 
