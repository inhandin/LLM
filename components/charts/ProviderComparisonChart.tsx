import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

export const ProviderComparisonChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for provider comparison
    const mockData = [
      {
        name: 'Credits',
        OpenAI: 4200,
        Anthropic: 2100,
        Gemini: 950,
        Llama: 600,
      },
      {
        name: 'Tokens (millions)',
        OpenAI: 15.2,
        Anthropic: 7.8,
        Gemini: 3.5,
        Llama: 2.2,
      },
      {
        name: 'Customers',
        OpenAI: 58,
        Anthropic: 32,
        Gemini: 22,
        Llama: 12,
      },
    ];

    setData(mockData);
  }, []);

  const COLORS = {
    OpenAI: '#10B981',
    Anthropic: '#6366F1', 
    Gemini: '#F59E0B',
    Llama: '#EC4899',
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
          labelStyle={{
            fontWeight: 'bold',
            marginBottom: '8px'
          }}
        />
        <Legend />
        <Bar dataKey="OpenAI" fill={COLORS.OpenAI} name="OpenAI" />
        <Bar dataKey="Anthropic" fill={COLORS.Anthropic} name="Anthropic" />
        <Bar dataKey="Gemini" fill={COLORS.Gemini} name="Gemini" />
        <Bar dataKey="Llama" fill={COLORS.Llama} name="Llama" />
      </BarChart>
    </ResponsiveContainer>
  );
};