import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ComposedChart,
  Area,
  ReferenceLine,
  LabelList
} from 'recharts';
import { ArrowUpRight, BarChart as BarChartIcon, DollarSign, Eye, FileDown, LineChart as LineChartIcon, Share2, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DateRangeFilter } from '../filters/DateRangeFilter';
import { DateRange } from 'react-day-picker';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Monthly revenue vs. cost with forecasting
const generateRevenueVsCostData = (includeForecasting = false) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  // Calculate data up to current month plus forecasts
  const finalMonth = includeForecasting ? 11 : currentMonth;
  
  const data = months.map((month, idx) => {
    // For forecasting months (future), add special flag
    const isForecast = idx > currentMonth;
    const forecastFactor = isForecast ? (1 + (idx - currentMonth) * 0.02) : 1;
    
    // Base revenue and cost with some randomization
    const baseRevenue = 10000 + (idx * 1000); // Growing revenue trend
    const randomFactor = isForecast ? 0.05 : 0.15; // Less randomization for forecasts
    const revenue = Math.round(baseRevenue * forecastFactor * (1 + (Math.random() * randomFactor - randomFactor/2)));
    
    // Cost is roughly 20-35% of revenue
    const costPercentage = 0.2 + (Math.random() * 0.15);
    const cost = Math.round(revenue * costPercentage);
    const profit = revenue - cost;
    const profitMargin = Math.round((profit / revenue) * 100);
    
    // Calculate growth compared to previous month
    let growthRate = null;
    if (idx > 0) {
      // This is a placeholder - in a real implementation, we'd use actual previous data
      const prevMonthRevenue = 10000 + ((idx-1) * 1000);
      growthRate = Math.round(((revenue - prevMonthRevenue) / prevMonthRevenue) * 100);
    }
    
    return {
      name: month,
      Revenue: revenue,
      Cost: cost,
      Profit: profit,
      "Profit Margin": profitMargin,
      "Growth Rate": growthRate,
      isForecast,
    };
  });
  
  // Only return months up to the final month based on whether we include forecasting
  return data.slice(0, finalMonth + 1);
};

// Daily revenue vs. cost with real-time data
const generateDailyRevenueData = () => {
  const days = [];
  const currentDate = new Date();
  
  // Generate data for the last 30 days
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(currentDate.getDate() - i);
    
    const dayOfWeek = date.getDay();
    // Weekend factor - lower on weekends
    const dayFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1;
    
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    const revenue = Math.round(850 * dayFactor * (0.9 + Math.random() * 0.3));
    const cost = Math.round(revenue * (0.2 + Math.random() * 0.1));
    const profit = revenue - cost;
    
    days.push({
      name: formattedDate,
      Revenue: revenue,
      Cost: cost,
      Profit: profit,
      "Profit Margin": Math.round((profit / revenue) * 100),
    });
  }
  
  return days;
};

// Calculate financial metrics
const calculateMetrics = (data: any[]) => {
  const totalRevenue = data.reduce((sum, item) => sum + item.Revenue, 0);
  const totalCost = data.reduce((sum, item) => sum + item.Cost, 0);
  const totalProfit = totalRevenue - totalCost;
  const avgProfitMargin = Math.round((totalProfit / totalRevenue) * 100);
  
  // Calculate growth compared to previous period
  // This is a simplified version - real implementation would compare to actual previous period
  const firstHalfRevenue = data.slice(0, Math.floor(data.length / 2))
    .reduce((sum, item) => sum + item.Revenue, 0);
  const secondHalfRevenue = data.slice(Math.floor(data.length / 2))
    .reduce((sum, item) => sum + item.Revenue, 0);
  const revenueGrowth = Math.round(((secondHalfRevenue - firstHalfRevenue) / firstHalfRevenue) * 100);
  
  return {
    totalRevenue,
    totalCost,
    totalProfit,
    avgProfitMargin,
    revenueGrowth
  };
};

export const EnhancedRevenueVsCostChart = () => {
  const [timeframe, setTimeframe] = useState<string>("monthly");
  const [chartType, setChartType] = useState<string>("bar");
  const [includeForecast, setIncludeForecast] = useState<boolean>(true);
  
  // Date range filter state
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: thirtyDaysAgo,
    to: today
  });
  
  // Generate data based on selected timeframe
  const data = timeframe === 'monthly' 
    ? generateRevenueVsCostData(includeForecast) 
    : generateDailyRevenueData();
  
  // Calculate metrics
  const metrics = calculateMetrics(data);
  
  // Format number to currency
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };
  
  // Render the chart based on type
  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis yAxisId="left" orientation="left" stroke="#3B82F6" />
            <YAxis yAxisId="right" orientation="right" stroke="#10B981" />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === "Profit Margin" || name === "Growth Rate") return [`${value}%`, name];
                return [formatCurrency(value), name];
              }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
              itemStyle={{ padding: '2px 0' }}
            />
            <Legend />
            <Bar 
              yAxisId="left" 
              dataKey="Revenue" 
              fill="#3B82F6" 
              radius={[4, 4, 0, 0]}
              fillOpacity={(entry) => entry.isForecast ? 0.5 : 1}
            />
            <Bar 
              yAxisId="left" 
              dataKey="Cost" 
              fill="#F43F5E" 
              radius={[4, 4, 0, 0]}
              fillOpacity={(entry) => entry.isForecast ? 0.5 : 1}
            />
            <Bar 
              yAxisId="left" 
              dataKey="Profit" 
              fill="#10B981" 
              radius={[4, 4, 0, 0]}
              fillOpacity={(entry) => entry.isForecast ? 0.5 : 1}
            >
              <LabelList 
                dataKey="Profit Margin" 
                position="top" 
                formatter={(value) => `${value}%`}
                style={{ fontSize: 10, fill: '#10B981' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis 
              yAxisId="left"
              orientation="left"
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', offset: -5 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              label={{ value: 'Percentage (%)', angle: 90, position: 'insideRight', offset: 5 }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === "Profit Margin" || name === "Growth Rate") return [`${value}%`, name];
                return [formatCurrency(value), name];
              }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="Revenue" 
              stroke="#3B82F6" 
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
              strokeDasharray={(entry) => entry.isForecast ? "5 5" : "0"}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="Cost" 
              stroke="#F43F5E" 
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
              strokeDasharray={(entry) => entry.isForecast ? "5 5" : "0"}
            />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="Profit" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
              strokeDasharray={(entry) => entry.isForecast ? "5 5" : "0"}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="Profit Margin" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
              strokeDasharray={(entry) => entry.isForecast ? "5 5" : "0"}
            />
            {includeForecast && (
              <ReferenceLine 
                x={data.findIndex(item => item.isForecast) > 0 ? 
                  data[data.findIndex(item => item.isForecast) - 1].name : undefined} 
                stroke="#6b7280" 
                strokeDasharray="3 3" 
                label={{ value: "Forecast →", position: "insideTopRight", fill: "#6b7280" }} 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    } else {
      // Area chart
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis 
              yAxisId="left"
              orientation="left"
              label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', offset: -5 }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              label={{ value: 'Margin (%)', angle: 90, position: 'insideRight', offset: 5 }}
            />
            <Tooltip 
              formatter={(value: number, name: string) => {
                if (name === "Profit Margin" || name === "Growth Rate") return [`${value}%`, name];
                return [formatCurrency(value), name];
              }}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="Revenue" 
              fill="#3B82F6" 
              stroke="#3B82F6"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="Cost" 
              fill="#F43F5E" 
              stroke="#F43F5E"
              fillOpacity={0.2}
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
            />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="Profit" 
              fill="#10B981" 
              stroke="#10B981"
              fillOpacity={0.3}
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="Profit Margin" 
              stroke="#8884d8" 
              strokeWidth={2}
              dot={{ r: 2 }}
              activeDot={{ r: 6 }}
            />
            <ReferenceLine 
              y={0} 
              stroke="#6b7280" 
              strokeDasharray="3 3" 
              yAxisId="left" 
            />
            {includeForecast && (
              <ReferenceLine 
                x={data.findIndex(item => item.isForecast) > 0 ? 
                  data[data.findIndex(item => item.isForecast) - 1].name : undefined} 
                stroke="#6b7280" 
                strokeDasharray="3 3" 
                label={{ value: "Forecast →", position: "insideTopRight", fill: "#6b7280" }} 
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      );
    }
  };
  
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              Revenue vs. Cost Analysis
            </CardTitle>
            <CardDescription>
              Financial performance with forecasting and trend analysis
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <DateRangeFilter 
              dateRange={dateRange} 
              onChange={setDateRange}
              align="end"
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Eye className="mr-2 h-4 w-4" />
                  Forecast
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIncludeForecast(!includeForecast)}>
                  {includeForecast ? 'Hide Forecast' : 'Show Forecast'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <FileDown className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export as PDF
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export as Image
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Button variant="outline" size="sm" className="h-9">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              title="Total Revenue" 
              value={formatCurrency(metrics.totalRevenue)}
              change={metrics.revenueGrowth}
              trend={metrics.revenueGrowth > 0}
            />
            <MetricCard 
              title="Total Cost" 
              value={formatCurrency(metrics.totalCost)}
              change={Math.round((metrics.totalCost / metrics.totalRevenue) * 100)}
              isPercentage={true}
              trend={false}
              trendLabel="of revenue"
            />
            <MetricCard 
              title="Total Profit" 
              value={formatCurrency(metrics.totalProfit)}
              change={Math.round((metrics.totalProfit / metrics.totalCost) * 100)}
              isPercentage={true}
              trend={true}
              trendLabel="ROI"
            />
            <MetricCard 
              title="Avg Profit Margin" 
              value={`${metrics.avgProfitMargin}%`}
              change={2.5}
              trend={true}
            />
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-4">
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Select timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              
              <Tabs defaultValue={chartType} onValueChange={setChartType} className="w-auto">
                <TabsList>
                  <TabsTrigger value="bar" className="flex items-center gap-1">
                    <BarChartIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Bar</span>
                  </TabsTrigger>
                  <TabsTrigger value="line" className="flex items-center gap-1">
                    <LineChartIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Line</span>
                  </TabsTrigger>
                  <TabsTrigger value="area" className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span className="hidden sm:inline">Area</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="h-[400px] w-full mt-4">
            {renderChart()}
          </div>
          
          <div className="flex justify-between flex-wrap gap-2 text-sm text-muted-foreground mt-2">
            <div>
              {includeForecast && (
                <div className="flex items-center">
                  <span className="inline-block w-3 h-0 border-t-2 border-dashed border-gray-400 mr-2"></span>
                  Forecast data beyond current month
                </div>
              )}
            </div>
            <div>
              Data updated {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  trend?: boolean;
  isPercentage?: boolean;
  trendLabel?: string;
}

const MetricCard = ({ title, value, change, trend = true, isPercentage = false, trendLabel = "from previous" }: MetricCardProps) => {
  return (
    <div className="bg-muted/50 rounded-lg p-4">
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {change !== undefined && (
        <div className="flex items-center text-xs mt-1">
          <span className={cn(
            "flex items-center",
            trend ? "text-green-600" : "text-red-600"
          )}>
            {trend ? 
              <ArrowUpRight className="h-3 w-3 mr-1" /> : 
              <ArrowUpRight className="h-3 w-3 mr-1 transform rotate-90" />
            }
            <span>{isPercentage ? `${change}%` : `${change > 0 ? '+' : ''}${change}%`}</span>
          </span>
          <span className="text-muted-foreground ml-1">{trendLabel}</span>
        </div>
      )}
    </div>
  );
};