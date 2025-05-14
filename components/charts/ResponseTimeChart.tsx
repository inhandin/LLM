import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

export const ResponseTimeChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock data for response time comparison
    const generateData = () => {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      
      return days.map(day => {
        return {
          name: day,
          OpenAI: parseFloat((0.8 + Math.random() * 0.4).toFixed(2)),
          Anthropic: parseFloat((1.2 + Math.random() * 0.5).toFixed(2)),
          Gemini: parseFloat((0.9 + Math.random() * 0.5).toFixed(2)),
          Llama: parseFloat((1.5 + Math.random() * 0.7).toFixed(2)),
        };
      });
    };
    
    setData(generateData());
  }, []);

  const COLORS = {
    OpenAI: '#10B981',
    Anthropic: '#6366F1', 
    Gemini: '#F59E0B',
    Llama: '#EC4899',
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" />
        <YAxis 
          label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} 
        />
        <Tooltip 
          formatter={(value: string) => [`${value}s`, '']}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />
        <Legend />
        <Line type="monotone" dataKey="OpenAI" stroke={COLORS.OpenAI} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Anthropic" stroke={COLORS.Anthropic} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Gemini" stroke={COLORS.Gemini} activeDot={{ r: 8 }} />
        <Line type="monotone" dataKey="Llama" stroke={COLORS.Llama} activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};