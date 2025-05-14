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
  ReferenceLine,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Activity, BarChart as BarChartIcon, ChartPie, LineChart as LineChartIcon, Maximize2, SlidersHorizontal } from 'lucide-react';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ProviderFilter, ProviderOption } from "../filters/ProviderFilter";
import { DateRangeFilter } from "../filters/DateRangeFilter";
import { DateRange } from "react-day-picker";

// Mock data generator for provider comparison
const generateComparisonData = (currentPeriod = true) => {
  // Use a factor to create difference between current and previous period
  const periodFactor = currentPeriod ? 1 : 0.85;
  
  return [
    {
      name: 'Credits',
      OpenAI: Math.round(4200 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))),
      Anthropic: Math.round(2100 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))),
      Gemini: Math.round(950 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))),
      Llama: Math.round(600 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))),
    },
    {
      name: 'Tokens (millions)',
      OpenAI: parseFloat((15.2 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))).toFixed(1)),
      Anthropic: parseFloat((7.8 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))).toFixed(1)),
      Gemini: parseFloat((3.5 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))).toFixed(1)),
      Llama: parseFloat((2.2 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))).toFixed(1)),
    },
    {
      name: 'Customers',
      OpenAI: Math.round(58 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))),
      Anthropic: Math.round(32 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))),
      Gemini: Math.round(22 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))),
      Llama: Math.round(12 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))),
    },
    {
      name: 'Growth (%)',
      OpenAI: parseFloat((12.5 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.2))).toFixed(1)),
      Anthropic: parseFloat((18.2 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.2))).toFixed(1)),
      Gemini: parseFloat((22.7 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.2))).toFixed(1)),
      Llama: parseFloat((8.3 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.2))).toFixed(1)),
    },
    {
      name: 'Avg Response (s)',
      OpenAI: parseFloat((0.8 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))).toFixed(2)),
      Anthropic: parseFloat((1.2 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))).toFixed(2)),
      Gemini: parseFloat((0.9 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))).toFixed(2)),
      Llama: parseFloat((1.5 * periodFactor * (1 + (currentPeriod ? 0 : Math.random() * 0.1))).toFixed(2)),
    },
  ];
};

// Generate market share data
const generateMarketShareData = () => {
  return [
    { name: 'OpenAI', value: 46, color: '#10B981' },
    { name: 'Anthropic', value: 28, color: '#6366F1' },
    { name: 'Gemini', value: 17, color: '#F59E0B' },
    { name: 'Llama', value: 9, color: '#EC4899' },
  ];
};

// Generate revenue trend data
const generateRevenueTrendData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  
  return months.map((month, idx) => {
    if (idx > currentMonth) return { name: month, OpenAI: 0, Anthropic: 0, Gemini: 0, Llama: 0 };
    
    return {
      name: month,
      OpenAI: Math.round(3000 + idx * 200 + Math.random() * 500),
      Anthropic: Math.round(1500 + idx * 120 + Math.random() * 300),
      Gemini: Math.round(700 + idx * 80 + Math.random() * 200),
      Llama: Math.round(400 + idx * 40 + Math.random() * 150),
    };
  }).slice(0, currentMonth + 1);
};

export const ComparativeProviderChart = () => {
  const [chartType, setChartType] = useState<string>("bar");
  const [metric, setMetric] = useState<string>("Credits");
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [showMetrics, setShowMetrics] = useState<string[]>(["OpenAI", "Anthropic", "Gemini", "Llama"]);
  
  // Date range filter state
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: thirtyDaysAgo,
    to: today
  });
  
  // Generate data based on selected metric
  const currentData = generateComparisonData(true);
  const previousData = generateComparisonData(false);
  
  const selectedMetricData = currentData.find(item => item.name === metric) || currentData[0];
  const prevSelectedMetricData = previousData.find(item => item.name === metric) || previousData[0];
  
  // Format the data for the selected chart type
  const formatComparisonData = () => {
    if (chartType === "pie") {
      return generateMarketShareData();
    } else if (chartType === "line") {
      return generateRevenueTrendData();
    } else {
      // Bar chart data
      const formattedData = [];
      
      // Only include selected providers
      for (const provider of showMetrics) {
        if (selectedMetricData[provider] !== undefined) {
          const currentValue = selectedMetricData[provider];
          let prevValue = null;
          let percentChange = null;
          
          if (compareMode && prevSelectedMetricData[provider] !== undefined) {
            prevValue = prevSelectedMetricData[provider];
            percentChange = ((currentValue - prevValue) / prevValue * 100).toFixed(1);
          }
          
          formattedData.push({
            name: provider,
            value: currentValue,
            prevValue: prevValue,
            percentChange: percentChange,
            color: getProviderColor(provider)
          });
        }
      }
      
      return formattedData;
    }
  };
  
  const getProviderColor = (provider: string) => {
    switch(provider) {
      case 'OpenAI': return '#10B981';
      case 'Anthropic': return '#6366F1';
      case 'Gemini': return '#F59E0B';
      case 'Llama': return '#EC4899';
      default: return '#3B82F6';
    }
  };
  
  const formattedData = formatComparisonData();
  
  // Define available providers for filter
  const providerOptions: ProviderOption[] = [
    { value: 'OpenAI', label: 'OpenAI' },
    { value: 'Anthropic', label: 'Anthropic' },
    { value: 'Gemini', label: 'Gemini' },
    { value: 'Llama', label: 'Llama' }
  ];
  
  // Format tooltip value based on metric
  const formatTooltipValue = (value: number) => {
    if (metric === 'Credits') return `$${value.toLocaleString()}`;
    if (metric === 'Tokens (millions)') return `${value}M`;
    if (metric === 'Growth (%)' || metric === 'Error Rate (%)') return `${value}%`;
    if (metric === 'Avg Response (s)') return `${value}s`;
    return value.toLocaleString();
  };
  
  // Handle provider filter change
  const handleProviderFilterChange = (providers: string[]) => {
    setShowMetrics(providers.length ? providers : ["OpenAI", "Anthropic", "Gemini", "Llama"]);
  };
  
  // Render the chart based on type
  const renderChart = () => {
    if (chartType === 'bar') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={formattedData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" />
            <YAxis 
              dataKey="name" 
              type="category" 
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => [formatTooltipValue(value), metric]}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
              labelStyle={{ fontWeight: 'bold' }}
            />
            <Legend />
            <Bar 
              dataKey="value" 
              name={`Current ${metric}`}
              fill="#3B82F6"
              label={compareMode ? {
                position: 'right',
                formatter: (item: any) => item.percentChange ? `${item.percentChange}%` : '',
                fill: (item: any) => parseFloat(item.percentChange) >= 0 ? '#10B981' : '#EF4444',
                fontSize: 12
              } : undefined}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
            {compareMode && (
              <Bar 
                dataKey="prevValue" 
                name={`Previous ${metric}`} 
                fill="#94A3B8" 
                opacity={0.5}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={formattedData}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Market Share']}
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
    } else {
      // Line chart
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="name" />
            <YAxis 
              label={{ value: metric, angle: -90, position: 'insideLeft', offset: -5 }}
            />
            <Tooltip 
              formatter={(value: number) => [formatTooltipValue(value), '']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
            {showMetrics.includes('OpenAI') && (
              <Line type="monotone" dataKey="OpenAI" stroke="#10B981" activeDot={{ r: 8 }} name="OpenAI" />
            )}
            {showMetrics.includes('Anthropic') && (
              <Line type="monotone" dataKey="Anthropic" stroke="#6366F1" activeDot={{ r: 8 }} name="Anthropic" />
            )}
            {showMetrics.includes('Gemini') && (
              <Line type="monotone" dataKey="Gemini" stroke="#F59E0B" activeDot={{ r: 8 }} name="Gemini" />
            )}
            {showMetrics.includes('Llama') && (
              <Line type="monotone" dataKey="Llama" stroke="#EC4899" activeDot={{ r: 8 }} name="Llama" />
            )}
            {compareMode && (
              <ReferenceLine 
                y={formattedData.reduce((sum, item) => sum + (item.OpenAI || 0), 0) / formattedData.length} 
                stroke="#10B981" 
                strokeDasharray="3 3" 
                label={{ value: "Avg", position: "right", fill: "#10B981" }} 
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    }
  };
  
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              {chartType === 'bar' ? <BarChartIcon className="h-5 w-5 text-muted-foreground" /> :
               chartType === 'pie' ? <ChartPie className="h-5 w-5 text-muted-foreground" /> :
               <LineChartIcon className="h-5 w-5 text-muted-foreground" />}
              Provider Comparison
            </CardTitle>
            <CardDescription>
              Comparative analysis across LLM providers
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <DateRangeFilter 
              dateRange={dateRange} 
              onChange={setDateRange}
            />
            
            <ProviderFilter 
              providers={providerOptions}
              selectedProviders={showMetrics}
              onChange={handleProviderFilterChange}
              showLabel={false}
              align="end"
            />
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <SlidersHorizontal className="mr-2 h-4 w-4" />
                  Options
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Display Options</h4>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="compare-mode" 
                        checked={compareMode} 
                        onCheckedChange={() => setCompareMode(!compareMode)}
                      />
                      <Label htmlFor="compare-mode">Compare with previous period</Label>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <Maximize2 className="mr-2 h-4 w-4" />
                  Expand
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  View full screen
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export as PNG
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Export data as CSV
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <Select value={metric} onValueChange={setMetric}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Credits">Credits ($)</SelectItem>
                <SelectItem value="Tokens (millions)">Tokens</SelectItem>
                <SelectItem value="Customers">Customers</SelectItem>
                <SelectItem value="Growth (%)">Growth Rate</SelectItem>
                <SelectItem value="Avg Response (s)">Response Time</SelectItem>
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
                <TabsTrigger value="pie" className="flex items-center gap-1">
                  <ChartPie className="h-4 w-4" />
                  <span className="hidden sm:inline">Pie</span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="h-[400px] w-full mt-4">
            {renderChart()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};