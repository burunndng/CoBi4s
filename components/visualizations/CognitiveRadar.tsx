import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

interface CognitiveRadarProps {
  data: { subject: string; A: number; fullMark: number }[];
  color?: string;
}

export const CognitiveRadar: React.FC<CognitiveRadarProps> = ({ data, color = '#818cf8' }) => {
  return (
    <div className="w-full h-full min-h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="rgba(255,255,255,0.1)" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#71717a', fontSize: 10, fontFamily: 'JetBrains Mono', letterSpacing: '0.1em' }} 
          />
          <Radar
            name="Mastery"
            dataKey="A"
            stroke={color}
            strokeWidth={2}
            fill={color}
            fillOpacity={0.1}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
