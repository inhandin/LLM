import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

export const CustomerRetentionChart = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock data for customer retention rates
    const generateData = () => {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const currentMonth = new Date().getMonth();
      
      // Only show data up to current month
      const relevantMonths = months.slice(0, currentMonth + 1);
      
      return relevantMonths.map((month) => {
        // Relatively high retention rates with slight variations
        const baseRate = 94 + Math.random() * 4;
        
        return {
          name: month,
          rate: parseFloat(baseRate.toFixed(1))
        };
      });
    };
    
    setData(generateData());
  }, []);

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
          domain={[90, 100]} 
          label={{ value: 'Retention %', angle: -90, position: 'insideLeft' }} 
        />
        <Tooltip 
          formatter={(value: number) => [`${value}%`, 'Retention Rate']}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="rate" 
          stroke="#3B82F6" 
          activeDot={{ r: 8 }} 
          name="Retention Rate"
        />
      </LineChart>
    </ResponsiveContainer>
  );
};