import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

interface TokenDistributionChartProps {
  provider: string;
}

export const TokenDistributionChart = ({ provider }: TokenDistributionChartProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Distribution varies slightly by provider
    const promptPercentage = provider === 'openai' ? 30 : 
                            provider === 'anthropic' ? 35 :
                            provider === 'gemini' ? 25 :
                            32; // llama or other
    
    const completionPercentage = 100 - promptPercentage;
    
    const mockData = [
      { name: 'Prompt Tokens', value: promptPercentage, percentage: `${promptPercentage}%` },
      { name: 'Completion Tokens', value: completionPercentage, percentage: `${completionPercentage}%` },
    ];

    setData(mockData);
  }, [provider]);

  const COLORS = ['#6366F1', '#10B981'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={70}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percentage }) => `${name}: ${percentage}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${value}%`, '']}
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