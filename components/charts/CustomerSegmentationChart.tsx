import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

export const CustomerSegmentationChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for customer segmentation by usage
    const mockData = [
      { name: 'Enterprise', value: 42, percentage: '31%' },
      { name: 'Growth', value: 55, percentage: '41%' },
      { name: 'Startup', value: 25, percentage: '19%' },
      { name: 'Trial', value: 12, percentage: '9%' },
    ];

    setData(mockData);
  }, []);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#6366F1'];

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
          label={({ name, percentage }) => `${name} ${percentage}`}
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