import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

export const CustomerDistributionChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for customer distribution across providers
    const mockData = [
      { name: 'OpenAI Only', value: 58, percentage: '43%' },
      { name: 'Anthropic Only', value: 32, percentage: '24%' },
      { name: 'Multiple Providers', value: 35, percentage: '26%' },
      { name: 'Other Providers', value: 9, percentage: '7%' },
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
          outerRadius={70}
          fill="#8884d8"
          dataKey="value"
          label={({ percentage }) => `${percentage}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${value} customers`, '']}
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