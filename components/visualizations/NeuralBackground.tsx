import React, { useEffect, useRef, useState } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const NeuralBackground: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const requestRef = useRef<number>();

  useEffect(() => {
    // Initialize random nodes
    const initialNodes = Array.from({ length: 20 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.05,
      vy: (Math.random() - 0.5) * 0.05
    }));
    setNodes(initialNodes);

    const animate = () => {
      setNodes(prevNodes => prevNodes.map(node => {
        let newX = node.x + node.vx;
        let newY = node.y + node.vy;

        // Bounce off walls
        if (newX < 0 || newX > 100) node.vx *= -1;
        if (newY < 0 || newY > 100) node.vy *= -1;

        return { ...node, x: newX, y: newY };
      }));
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current!);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Connections */}
        {nodes.map((node, i) => 
          nodes.slice(i + 1).map((other, j) => {
            const dist = Math.hypot(node.x - other.x, node.y - other.y);
            if (dist > 25) return null; // Only connect close nodes
            return (
              <line 
                key={`${i}-${j}`}
                x1={node.x} y1={node.y}
                x2={other.x} y2={other.y}
                stroke="white"
                strokeWidth="0.1"
                strokeOpacity={1 - dist / 25}
              />
            );
          })
        )}
        {/* Nodes */}
        {nodes.map((node, i) => (
          <circle 
            key={i} 
            cx={node.x} cy={node.y} 
            r="0.3" 
            fill="white" 
            fillOpacity="0.5" 
          />
        ))}
      </svg>
    </div>
  );
};
