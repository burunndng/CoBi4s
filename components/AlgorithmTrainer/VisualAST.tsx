
import React from 'react';
import { GitCommit, Circle, Workflow } from 'lucide-react';

interface ASTNode {
  type: string;
  value: string;
  children?: ASTNode[];
}

interface VisualASTProps {
  root: ASTNode;
}

export const VisualAST: React.FC<VisualASTProps> = ({ root }) => {
  if (!root) return null;

  return (
    <div className="p-8 bg-zinc-950/50 rounded-3xl border border-white/5 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex items-center gap-3 text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] mb-10">
          <Workflow size={14} /> Compiled_Logic_Circuit
        </div>
        
        <div className="flex flex-col items-center">
          <Node node={root} isRoot />
        </div>
      </div>
      
      {/* Blueprint Grid */}
      <div className="absolute inset-0 pointer-events-none blueprint-grid opacity-[0.02]"></div>
    </div>
  );
};

const Node: React.FC<{ node: ASTNode; isRoot?: boolean }> = ({ node, isRoot }) => {
  return (
    <div className="flex flex-col items-center group">
      <div className={`
        relative px-6 py-4 rounded-2xl border transition-all duration-500
        ${isRoot ? 'bg-white text-black border-white' : 'bg-indigo-500/5 border-indigo-500/20 text-indigo-100'}
        shadow-xl group-hover:shadow-indigo-500/10 group-hover:border-indigo-500/40
      `}>
        <div className="text-[8px] font-mono uppercase tracking-[0.2em] opacity-50 mb-1">{node.type}</div>
        <div className="text-xs font-bold leading-tight max-w-[120px] text-center italic">{node.value}</div>
        
        {/* Connector Line (Bottom) */}
        {node.children && node.children.length > 0 && (
          <div className="absolute left-1/2 bottom-0 w-px h-8 bg-indigo-500/20 translate-y-full"></div>
        )}
      </div>

      {node.children && node.children.length > 0 && (
        <div className="flex gap-8 pt-12 relative">
          {/* Horizontal cross-bar for branches */}
          {node.children.length > 1 && (
            <div className="absolute top-0 left-[15%] right-[15%] h-px bg-indigo-500/20"></div>
          )}
          
          {node.children.map((child, i) => (
            <div key={i} className="relative">
               {/* Vertical drop to node from cross-bar */}
               <div className="absolute left-1/2 top-0 -translate-y-full w-px h-px bg-indigo-500/20"></div>
               <Node node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
