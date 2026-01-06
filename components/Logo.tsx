import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
}

export const Logo: React.FC<LogoProps> = ({ className = "text-white", size = 24 }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      {/* The Refracted Hexagon - A minimalist symbol of cognitive alignment */}
      <path d="M12 3L4 7.5V16.5L12 21L20 16.5V7.5L12 3Z" className="opacity-50" />
      <path d="M12 3V12" />
      <path d="M12 12L4 7.5" />
      <path d="M12 12L20 7.5" />
      <circle cx="12" cy="12" r="3" className="fill-current opacity-20" />
    </svg>
  );
};
