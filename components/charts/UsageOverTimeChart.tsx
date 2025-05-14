import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface UsageOverTimeChartProps {
  provider?: string;
}

export const UsageOverTimeChart = ({ provider }: UsageOverTimeChartProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate random data for the past 30 days
    const generateData = () => {
      const result = [];
      const now = new Date();
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
        
        if (provider) {
          // Single provider data
          const baseValue = provider === 'openai' ? 120000 : 
                          provider === 'anthropic' ? 85000 : 
                          provider === 'gemini' ? 45000 : 25000;
          
          const randomFactor = 0.25; // 25% random variation
          const value = Math.floor(baseValue * (1 + (Math.random() * randomFactor * 2 - randomFactor)));
          
          result.push({
            date: formattedDate,
            tokens: value,
          });
        } else {
          // All providers data for dashboard
          result.push({
            date: formattedDate,
            OpenAI: Math.floor(120000 * (1 + (Math.random() * 0.3 - 0.15))),
            Anthropic: Math.floor(85000 * (1 + (Math.random() * 0.3 - 0.15))),
            Gemini: Math.floor(45000 * (1 + (Math.random() * 0.3 - 0.15))),
            Llama: Math.floor(25000 * (1 + (Math.random() * 0.3 - 0.15))),
          });
        }
      }
      
      return result;
    };
    
    setData(generateData());
  }, [provider]);

  const COLORS = {
    OpenAI: '#10B981',
    Anthropic: '#6366F1', 
    Gemini: '#F59E0B',
    Llama: '#EC4899',
    tokens: '#3B82F6'
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
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
          formatter={(value: number) => [
            `${value.toLocaleString()} tokens`, 
            provider ? 'Tokens' : ''
          ]}
        />
        <Legend />
        
        {provider ? (
          <Line 
            type="monotone" 
            dataKey="tokens" 
            stroke={COLORS.tokens} 
            strokeWidth={2}
            dot={{ r: 2 }}
            activeDot={{ r: 6 }}
            name="Tokens"
          />
        ) : (
          <>
            <Line 
              type="monotone" 
              dataKey="OpenAI" 
              stroke={COLORS.OpenAI} 
              strokeWidth={2}
              dot={{ r: 1 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="Anthropic" 
              stroke={COLORS.Anthropic} 
              strokeWidth={2}
              dot={{ r: 1 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="Gemini" 
              stroke={COLORS.Gemini} 
              strokeWidth={2}
              dot={{ r: 1 }}
              activeDot={{ r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="Llama" 
              stroke={COLORS.Llama} 
              strokeWidth={2}
              dot={{ r: 1 }}
              activeDot={{ r: 5 }}
            />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};