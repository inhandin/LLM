import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

export const RevenueVsCostChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock data for revenue vs. cost comparison
    const generateData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      return months.map((month, idx) => {
        // Only show data up to current month
        if (idx > currentMonth) return { name: month, Revenue: 0, Cost: 0, Profit: 0 };
        
        // Base revenue and cost with some randomization
        const baseRevenue = 10000 + (idx * 1000); // Growing revenue trend
        const randomFactor = 0.2; // 20% random variation
        const revenue = Math.round(baseRevenue * (1 + (Math.random() * randomFactor - randomFactor/2)));
        
        // Cost is roughly 20-35% of revenue
        const costPercentage = 0.2 + (Math.random() * 0.15);
        const cost = Math.round(revenue * costPercentage);
        
        return {
          name: month,
          Revenue: revenue,
          Cost: cost,
          Profit: revenue - cost
        };
      });
    };
    
    setData(generateData());
  }, []);

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
          formatter={(value: number) => [`$${value.toLocaleString()}`, '']} 
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />
        <Legend />
        <Bar dataKey="Revenue" fill="#10B981" />
        <Bar dataKey="Cost" fill="#F43F5E" />
        <Bar dataKey="Profit" fill="#3B82F6" />
      </BarChart>
    </ResponsiveContainer>
  );
};