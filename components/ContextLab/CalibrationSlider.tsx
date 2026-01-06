import React, { useState } from 'react';

interface CalibrationSliderProps {
  userValue: number;
  onChange: (val: number) => void;
  targetRange?: { min: number; max: number };
  isLocked: boolean;
}

export const CalibrationSlider: React.FC<CalibrationSliderProps> = ({ userValue, onChange, targetRange, isLocked }) => {
  const isInside = targetRange && userValue >= targetRange.min && userValue <= targetRange.max;

  return (
    <div className="w-full space-y-4">
      {/* Labels */}
      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <span className="text-rose-500">Harmful Bias</span>
        <span className="text-emerald-500">Useful Heuristic</span>
      </div>

      <div className="relative h-12 flex items-center">
        {/* Track Background */}
        <div className="absolute inset-x-0 h-2 rounded-full bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500 opacity-20"></div>

        {/* Target Zone Overlay (Revealed) */}
        {targetRange && isLocked && (
          <div 
            className="absolute h-4 bg-yellow-400/30 border border-yellow-400/50 rounded z-10 transition-all duration-500 animate-in fade-in"
            style={{ 
              left: `${targetRange.min}%`, 
              width: `${targetRange.max - targetRange.min}%` 
            }}
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-yellow-400 whitespace-nowrap">
              TARGET
            </div>
          </div>
        )}

        {/* Input Range */}
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={userValue}
          onChange={(e) => !isLocked && onChange(Number(e.target.value))}
          disabled={isLocked}
          className="relative w-full h-2 bg-transparent appearance-none cursor-pointer z-20 focus:outline-none 
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:w-6 
            [&::-webkit-slider-thumb]:h-6 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-white 
            [&::-webkit-slider-thumb]:border-2 
            [&::-webkit-slider-thumb]:border-zinc-900 
            [&::-webkit-slider-thumb]:shadow-lg 
            [&::-webkit-slider-thumb]:transition-transform 
            [&::-webkit-slider-thumb]:hover:scale-110"
        />
      </div>

      {/* Value Display */}
      <div className="flex justify-center">
        <div className={`px-4 py-1.5 rounded-lg border text-sm font-mono font-bold transition-colors ${
          isLocked 
            ? (isInside ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-rose-500/20 border-rose-500 text-rose-400')
            : 'bg-zinc-800 border-zinc-700 text-white'
        }`}>
          {isLocked ? (isInside ? 'CALIBRATED' : 'UNCALIBRATED') : `${userValue}%`}
        </div>
      </div>
    </div>
  );
};
