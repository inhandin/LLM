import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useEffect, useState } from 'react';

interface ModelUsageChartProps {
  provider: string;
}

export const ModelUsageChart = ({ provider }: ModelUsageChartProps) => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate model data based on provider
    const generateModelData = () => {
      switch (provider) {
        case 'openai':
          return [
            { name: 'GPT-4 Turbo', value: 45, percentage: '45%' },
            { name: 'GPT-3.5 Turbo', value: 35, percentage: '35%' },
            { name: 'Text Embedding', value: 15, percentage: '15%' },
            { name: 'Other Models', value: 5, percentage: '5%' }
          ];
        case 'anthropic':
          return [
            { name: 'Claude 3 Opus', value: 40, percentage: '40%' },
            { name: 'Claude 3 Sonnet', value: 35, percentage: '35%' },
            { name: 'Claude 3 Haiku', value: 25, percentage: '25%' }
          ];
        case 'gemini':
          return [
            { name: 'Gemini Pro', value: 50, percentage: '50%' },
            { name: 'Gemini Ultra', value: 35, percentage: '35%' },
            { name: 'Gemini Nano', value: 15, percentage: '15%' }
          ];
        case 'llama':
          return [
            { name: 'Llama 3 70B', value: 45, percentage: '45%' },
            { name: 'Llama 3 8B', value: 30, percentage: '30%' },
            { name: 'Llama 2', value: 25, percentage: '25%' }
          ];
        default:
          return [
            { name: 'Model 1', value: 50, percentage: '50%' },
            { name: 'Model 2', value: 30, percentage: '30%' },
            { name: 'Model 3', value: 20, percentage: '20%' }
          ];
      }
    };
    
    setData(generateModelData());
  }, [provider]);

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#6366F1'];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={70}
          innerRadius={30}
          fill="#8884d8"
          dataKey="value"
          label={({ percentage }) => percentage}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          formatter={(value: number) => [`${value}% of usage`, '']}
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