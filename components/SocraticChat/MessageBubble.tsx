import React from 'react';
import { ChatMessage } from '../../types';
import { User, Sparkles } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'} animate-in slide-in-from-bottom-2 duration-300`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
        isUser ? 'bg-zinc-800 text-slate-300' : 'bg-indigo-500/20 text-indigo-400'
      }`}>
        {isUser ? <User size={16} /> : <Sparkles size={16} />}
      </div>
      
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
        isUser 
          ? 'bg-zinc-800 text-white rounded-tr-sm' 
          : 'bg-indigo-900/10 border border-indigo-500/20 text-indigo-100 rounded-tl-sm'
      }`}>
        {message.content}
        <div className={`text-[10px] mt-1 opacity-50 ${isUser ? 'text-right' : 'text-left'}`}>
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};
