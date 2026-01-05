import React, { useRef } from 'react';

export interface Highlight {
  start: number;
  end: number;
  type: 'found' | 'revealed';
  label?: string;
}

interface TextCanvasProps {
  text: string;
  highlights: Highlight[];
  onSelection: (text: string, rect: DOMRect | null) => void;
}

export const TextCanvas: React.FC<TextCanvasProps> = ({ text, highlights, onSelection }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      onSelection('', null);
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    
    // Ensure selection is inside our container
    if (containerRef.current && containerRef.current.contains(range.commonAncestorContainer)) {
      onSelection(selection.toString().trim(), rect);
    }
  };

  const renderContent = () => {
    if (!text) return null;
    
    // Sort highlights by start index
    const sorted = [...highlights].sort((a, b) => a.start - b.start);
    const nodes = [];
    let lastIndex = 0;

    sorted.forEach((h, i) => {
      // Text before highlight
      if (h.start > lastIndex) {
        nodes.push(<span key={`text-${i}`}>{text.slice(lastIndex, h.start)}</span>);
      }
      // Highlighted text
      nodes.push(
        <span 
          key={`high-${i}`} 
          className={`px-1 rounded mx-0.5 ${
            h.type === 'found' ? 'bg-emerald-500/20 text-emerald-200 border-b-2 border-emerald-500' : 
            'bg-amber-500/20 text-amber-200 border-b-2 border-dashed border-amber-500'
          }`}
          title={h.label}
        >
          {text.slice(h.start, h.end)}
        </span>
      );
      lastIndex = h.end;
    });

    // Remaining text
    if (lastIndex < text.length) {
      nodes.push(<span key="text-end">{text.slice(lastIndex)}</span>);
    }

    return nodes;
  };

  return (
    <div 
      ref={containerRef}
      onMouseUp={handleMouseUp}
      className="text-lg leading-relaxed text-slate-300 font-serif p-6 bg-zinc-900 rounded-lg shadow-inner border border-zinc-800"
    >
      {renderContent()}
    </div>
  );
};
