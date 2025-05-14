import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

export const ProviderTokensChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for provider token distribution
    const mockData = [
      { name: 'OpenAI', value: 15200000 },
      { name: 'Anthropic', value: 7800000 },
      { name: 'Gemini', value: 3500000 },
      { name: 'Llama', value: 2200000 },
    ];

    setData(mockData);
  }, []);

  const COLORS = ['#10B981', '#6366F1', '#F59E0B', '#EC4899'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          innerRadius={40}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${(value / 1000000).toFixed(2)}M tokens`, 'Tokens']}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />
        <Legend layout="horizontal" verticalAlign="bottom" align="center" />
      </PieChart>
    </ResponsiveContainer>
  );
};