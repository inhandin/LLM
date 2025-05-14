import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface RequestVolumeChartProps {
  provider: string;
}

export const RequestVolumeChart = ({ provider }: RequestVolumeChartProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock request volume data
    const generateData = () => {
      const hours = Array.from({ length: 24 }, (_, i) => i);
      
      // Base volume varies by provider
      const baseVolume = provider === 'openai' ? 3500 : 
                         provider === 'anthropic' ? 2800 :
                         provider === 'gemini' ? 1500 :
                         800; // llama or other
                         
      return hours.map(hour => {
        // Create a curve with higher volume during work hours
        let volumeFactor = 1;
        if (hour >= 9 && hour <= 17) {
          // Work hours - higher volume
          volumeFactor = 1.5 + Math.sin((hour - 9) * Math.PI / 8) * 0.5;
        } else if (hour >= 0 && hour <= 6) {
          // Night hours - lower volume
          volumeFactor = 0.3 + Math.random() * 0.2;
        }
        
        const volume = Math.floor(baseVolume * volumeFactor * (0.9 + Math.random() * 0.2));
        
        return {
          hour: `${hour}:00`,
          volume
        };
      });
    };
    
    setData(generateData());
  }, [provider]);

  // Select color based on provider
  const getAreaColor = () => {
    switch(provider) {
      case 'openai': return '#10B981';
      case 'anthropic': return '#6366F1';
      case 'gemini': return '#F59E0B';
      case 'llama': return '#EC4899';
      default: return '#3B82F6';
    }
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => [`${value.toLocaleString()} requests`, 'Volume']}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />
        <Area 
          type="monotone" 
          dataKey="volume" 
          stroke={getAreaColor()} 
          fill={getAreaColor()} 
          fillOpacity={0.2} 
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};