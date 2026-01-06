import React from 'react';
import { ChatMessage } from '../../types';
import { User, Terminal } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-6 ${isUser ? 'flex-row-reverse' : 'flex-row'} group animate-in slide-in-from-bottom-4 duration-700`}>
      {/* ⚡️ NEURAL NODE: AVATAR */}
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-700 ${
        isUser 
          ? 'bg-white/5 border-white/10 text-white group-hover:border-white/20 group-hover:bg-white/[0.08]' 
          : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400 shadow-[0_0_25px_rgba(99,102,241,0.15)] group-hover:shadow-[0_0_40px_rgba(99,102,241,0.3)] group-hover:border-indigo-500/50'
      }`}>
        {isUser ? <User size={20} strokeWidth={1.5} /> : <Terminal size={20} strokeWidth={1.5} />}
      </div>
      
      {/* ⚡️ DATA PLATE: CONTENT */}
      <div className={`relative max-w-[85%] rounded-3xl p-8 transition-all duration-700 ${
        isUser 
          ? 'bg-white/[0.02] backdrop-blur-md border border-white/5 text-white font-light text-lg leading-relaxed serif italic' 
          : 'bg-indigo-950/10 backdrop-blur-2xl border border-indigo-500/20 text-indigo-50 font-mono text-[13px] leading-relaxed tracking-tight shadow-xl'
      }`}>
        {/* 💀 HACKODER TEXTURE: SCANLINE ENGINE */}
        {!isUser && (
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] rounded-3xl overflow-hidden">
             <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%),linear-gradient(90deg,rgba(255,0,0,0.08),rgba(0,255,0,0.03),rgba(0,0,118,0.08))] bg-[length:100%_3px,4px_100%]"></div>
          </div>
        )}
        
        <span className="relative z-20 whitespace-pre-wrap">{message.content}</span>
        
        {/* ⚡️ DYNAMIC BIT-CURSOR */}
        {!isUser && message.content.length > 0 && !message.content.endsWith('.') && (
          <span className="inline-block w-2 h-5 bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,1)] animate-pulse ml-3 align-middle"></span>
        )}

        {/* ⚡️ METADATA READOUT */}
        <div className={`flex items-center gap-4 mt-6 pt-4 border-t border-white/5 ${isUser ? 'justify-end' : 'justify-start'}`}>
           <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-slate-600">
             PID: {message.id.slice(0, 8)}
           </span>
           <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-slate-600">
             TS: {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
           </span>
           {!isUser && (
             <span className="text-[8px] font-mono uppercase tracking-[0.3em] text-indigo-500 animate-pulse">
               Stream_Stable
             </span>
           )}
        </div>
      </div>
    </div>
  );
};