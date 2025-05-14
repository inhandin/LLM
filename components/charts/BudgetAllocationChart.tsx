import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

export const BudgetAllocationChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for budget allocation across providers
    const mockData = [
      { name: 'OpenAI', value: 5000, percentage: '45%' },
      { name: 'Anthropic', value: 3200, percentage: '29%' },
      { name: 'Gemini', value: 1800, percentage: '16%' },
      { name: 'Llama', value: 1100, percentage: '10%' },
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
          cy="45%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percentage }) => `${name} ${percentage}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Budget Allocation']}
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