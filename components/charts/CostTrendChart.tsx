import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useEffect, useState } from 'react';

interface CostTrendChartProps {
  provider: string;
}

export const CostTrendChart = ({ provider }: CostTrendChartProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock cost trend data for the last 30 days
    const generateData = () => {
      const result = [];
      const now = new Date();
      
      // Base cost varies by provider
      const baseCost = provider === 'openai' ? 140 : 
                      provider === 'anthropic' ? 110 :
                      provider === 'gemini' ? 60 :
                      35; // llama or other
      
      // Slight upward trend factor
      const trendFactor = 1.005;
      
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
        
        // Cost with randomization and slight upward trend
        const randomFactor = 0.3; // 30% random variation
        const dayOfWeek = date.getDay();
        
        // Weekend dip
        let dayFactor = 1;
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          dayFactor = 0.7;
        }
        
        // Calculate cost with trend, randomization and weekend effect
        const dayCost = baseCost * Math.pow(trendFactor, 29-i) * dayFactor * (1 + (Math.random() * randomFactor - randomFactor/2));
        
        result.push({
          date: formattedDate,
          cost: parseFloat(dayCost.toFixed(2))
        });
      }
      
      return result;
    };
    
    setData(generateData());
  }, [provider]);

  // Select color based on provider
  const getLineColor = () => {
    switch(provider) {
      case 'openai': return '#10B981';
      case 'anthropic': return '#6366F1';
      case 'gemini': return '#F59E0B';
      case 'llama': return '#EC4899';
      default: return '#3B82F6';
    }
  };

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
        <XAxis 
          dataKey="date" 
          interval={6} // Show fewer x-axis labels for clarity
        />
        <YAxis 
          label={{ value: 'Cost ($)', angle: -90, position: 'insideLeft' }} 
        />
        <Tooltip 
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Daily Cost']}
          contentStyle={{ 
            backgroundColor: 'hsl(var(--card))', 
            borderColor: 'hsl(var(--border))',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
          }}
        />
        <Line 
          type="monotone" 
          dataKey="cost" 
          stroke={getLineColor()} 
          dot={false}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};