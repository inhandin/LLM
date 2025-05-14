import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

export const ErrorRateChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock data for error rates
    const mockData = [
      { name: 'OpenAI', rate: 0.42 },
      { name: 'Anthropic', rate: 0.67 },
      { name: 'Gemini', rate: 1.23 },
      { name: 'Llama', rate: 1.89 },
    ];

    setData(mockData);
  }, []);

  const COLORS = {
    rate: '#F43F5E'
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        layout="vertical"
        margin={{
          top: 20,
          right: 30,
          left: 60,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false} />
        <XAxis 
          type="number" 
          label={{ value: 'Error Rate (%)', position: 'insideBottom', offset: -5 }}
          domain={[0, 2]}
        />
        <YAxis dataKey="name" type="category" />
        <Tooltip 
          formatter={(value: number) => [`${value.toFixed(2)}%`, 'Error Rate']}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />
        <Legend />
        <Bar dataKey="rate" fill={COLORS.rate} name="Error Rate (%)" />
      </BarChart>
    </ResponsiveContainer>
  );
};