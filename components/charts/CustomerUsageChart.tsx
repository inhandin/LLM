import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface CustomerUsageChartProps {
  customer: any;
  timeframe: 'daily' | 'monthly';
}

export const CustomerUsageChart = ({ customer, timeframe }: CustomerUsageChartProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate random data based on customer average usage
    const generateData = () => {
      const result = [];
      const now = new Date();
      const baseValue = customer.averageTokenUsage;
      const randomFactor = 0.4; // 40% random variation
      
      if (timeframe === 'daily') {
        // Generate daily data for the past 30 days
        for (let i = 29; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          
          const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
          const value = Math.floor(baseValue * (1 + (Math.random() * randomFactor * 2 - randomFactor)));
          
          // Add some patterns to make it look realistic
          let adjustedValue = value;
          
          // Weekend drop (if day is Sat or Sun)
          const dayOfWeek = date.getDay();
          if (dayOfWeek === 0 || dayOfWeek === 6) {
            adjustedValue = Math.floor(value * 0.6);
          }
          
          result.push({
            date: formattedDate,
            tokens: adjustedValue,
          });
        }
      } else {
        // Generate monthly data for the past 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(date.getMonth() - i);
          
          const formattedDate = `${date.toLocaleString('default', { month: 'short' })}`;
          const monthlyBase = baseValue * 30; // Approximate monthly usage
          const value = Math.floor(monthlyBase * (1 + (Math.random() * randomFactor * 2 - randomFactor)));
          
          result.push({
            date: formattedDate,
            tokens: value,
          });
        }
      }
      
      return result;
    };
    
    setData(generateData());
  }, [customer, timeframe]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{
          top: 10,
          right: 10,
          left: 10,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip 
          formatter={(value: number) => [`${value.toLocaleString()} tokens`, 'Usage']}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />
        <Bar 
          dataKey="tokens" 
          fill="hsl(var(--primary))" 
          name="Token Usage" 
        />
      </BarChart>
    </ResponsiveContainer>
  );
};