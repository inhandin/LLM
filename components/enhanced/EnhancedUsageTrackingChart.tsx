import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart, Label, ReferenceLine, ReferenceArea } from 'recharts';
import { AlertTriangle, ArrowRight, Database, FileDown, Link, ChartLine, Info, Network, Share2, Zap, SlidersHorizontal } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DateRangeFilter } from '../filters/DateRangeFilter';
import { DateRange } from 'react-day-picker';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Switch } from "@/components/ui/switch";
import { Label as UILabel } from "@/components/ui/label";
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ProviderFilter, ProviderOption } from '../filters/ProviderFilter';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Generate usage data with anomalies and forecasting
const generateUsageData = (includeForecasting = false, detectAnomalies = false) => {
  const days = [];
  const now = new Date();
  
  // Past data (30 days)
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    const dayOfWeek = date.getDay();
    // Weekend factor - lower on weekends
    const dayFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1;
    
    // Generate anomaly for demo purposes on day 12
    const isAnomaly = detectAnomalies && i === 12;
    const anomalyFactor = isAnomaly ? 2.5 : 1; // Spike for anomaly
    
    const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
    const baseValue = 150000 * dayFactor;
    const randomFactor = 0.2; // 20% random variation
    
    days.push({
      date: formattedDate,
      actual: Math.round(baseValue * anomalyFactor * (1 + (Math.random() * randomFactor - randomFactor/2))),
      upper: null,
      lower: null,
      forecast: null,
      OpenAI: Math.round(baseValue * 0.6 * anomalyFactor * (1 + (Math.random() * randomFactor - randomFactor/2))),
      Anthropic: Math.round(baseValue * 0.3 * anomalyFactor * (1 + (Math.random() * randomFactor - randomFactor/2))),
      Gemini: Math.round(baseValue * 0.1 * anomalyFactor * (1 + (Math.random() * randomFactor - randomFactor/2))),
      isAnomaly,
    });
  }
  
  // Add future forecast data
  if (includeForecasting) {
    for (let i = 1; i <= 7; i++) {
      const date = new Date();
      date.setDate(now.getDate() + i);
      
      const dayOfWeek = date.getDay();
      const dayFactor = (dayOfWeek === 0 || dayOfWeek === 6) ? 0.6 : 1;
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}`;
      
      // Forecast with increasing confidence interval
      const baseForecast = 150000 * dayFactor;
      const uncertainty = 0.1 + (i * 0.02); // Increasing uncertainty over time
      
      const forecast = Math.round(baseForecast * (1 + (i * 0.01))); // Slight upward trend
      const upper = Math.round(forecast * (1 + uncertainty));
      const lower = Math.round(forecast * (1 - uncertainty));
      
      days.push({
        date: formattedDate,
        actual: null,
        forecast,
        upper,
        lower,
        OpenAI: Math.round(forecast * 0.6),
        Anthropic: Math.round(forecast * 0.3),
        Gemini: Math.round(forecast * 0.1),
        isForecast: true,
      });
    }
  }
  
  return days;
};

// Format large numbers
const formatNumber = (num: number) => {
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  } else if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
};

export const EnhancedUsageTrackingChart = () => {
  const [timeframe, setTimeframe] = useState<string>("30d");
  const [chartType, setChartType] = useState<string>("line");
  const [showForecasting, setShowForecasting] = useState<boolean>(true);
  const [detectAnomalies, setDetectAnomalies] = useState<boolean>(true);
  const [showProviderBreakdown, setShowProviderBreakdown] = useState<boolean>(true);
  const [selectedProviders, setSelectedProviders] = useState<string[]>(["OpenAI", "Anthropic", "Gemini"]);
  
  // Refreshable data
  const [data, setData] = useState<any[]>([]);
  
  // Update data when settings change
  useEffect(() => {
    setData(generateUsageData(showForecasting, detectAnomalies));
  }, [showForecasting, detectAnomalies]);
  
  // Date range filter state
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: thirtyDaysAgo,
    to: today
  });
  
  // Define available providers for filter
  const providerOptions: ProviderOption[] = [
    { value: 'OpenAI', label: 'OpenAI' },
    { value: 'Anthropic', label: 'Anthropic' },
    { value: 'Gemini', label: 'Gemini' },
  ];
  
  // Get the forecast start date
  const forecastStartIndex = data.findIndex(item => item.isForecast);
  const forecastStartDate = forecastStartIndex !== -1 ? data[forecastStartIndex].date : null;
  
  // Find anomalies
  const anomalies = data.filter(item => item.isAnomaly);
  
  // Handle refresh data
  const handleRefreshData = () => {
    setData(generateUsageData(showForecasting, detectAnomalies));
  };
  
  // Render the chart based on type
  const renderChart = () => {
    if (chartType === 'line') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              tick={{ fill: '#888', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#888', fontSize: 12 }}
              tickFormatter={formatNumber}
              label={{
                value: 'Tokens',
                angle: -90,
                position: 'insideLeft',
                offset: -5,
              }}
            />
            <Tooltip
              formatter={(value: number) => [value ? value.toLocaleString() : '-', 'Tokens']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
            
            {/* Actual usage */}
            <Line
              type="monotone"
              dataKey="actual"
              name="Actual Usage"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: (entry) => entry.isAnomaly ? 6 : 2, fill: (entry) => entry.isAnomaly ? '#EF4444' : '#3B82F6' }}
              activeDot={{ r: 6 }}
            />
            
            {/* Forecast */}
            {showForecasting && (
              <>
                <Line
                  type="monotone"
                  dataKey="forecast"
                  name="Forecast"
                  stroke="#6b7280"
                  strokeDasharray="4 4"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="upper"
                  name="Upper Bound"
                  stroke="#d1d5db"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="lower"
                  name="Lower Bound"
                  stroke="#d1d5db"
                  strokeDasharray="2 2"
                  strokeWidth={1}
                  dot={false}
                />
                
                {forecastStartDate && (
                  <ReferenceLine
                    x={forecastStartDate}
                    stroke="#6b7280"
                    strokeDasharray="3 3"
                    label={{ value: "Forecast →", position: "insideTopRight", fill: "#6b7280" }}
                  />
                )}
              </>
            )}
            
            {/* Provider breakdown */}
            {showProviderBreakdown && (
              <>
                {selectedProviders.includes('OpenAI') && (
                  <Line
                    type="monotone"
                    dataKey="OpenAI"
                    name="OpenAI"
                    stroke="#10B981"
                    strokeWidth={1.5}
                    dot={{ r: 1 }}
                  />
                )}
                {selectedProviders.includes('Anthropic') && (
                  <Line
                    type="monotone"
                    dataKey="Anthropic"
                    name="Anthropic"
                    stroke="#6366F1"
                    strokeWidth={1.5}
                    dot={{ r: 1 }}
                  />
                )}
                {selectedProviders.includes('Gemini') && (
                  <Line
                    type="monotone"
                    dataKey="Gemini"
                    name="Gemini"
                    stroke="#F59E0B"
                    strokeWidth={1.5}
                    dot={{ r: 1 }}
                  />
                )}
              </>
            )}
            
            {/* Anomaly highlights */}
            {detectAnomalies && anomalies.map((anomaly, index) => (
              <ReferenceLine
                key={`anomaly-${index}`}
                x={anomaly.date}
                stroke="#EF4444"
                strokeDasharray="3 3"
                label={{
                  value: "!",
                  position: "top",
                  fill: "#EF4444",
                  fontSize: 12,
                }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'area') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={formatNumber}
              label={{
                value: 'Tokens',
                angle: -90,
                position: 'insideLeft',
                offset: -5,
              }}
            />
            <Tooltip
              formatter={(value: number) => [value ? value.toLocaleString() : '-', 'Tokens']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
            
            {/* Provider breakdown */}
            {showProviderBreakdown ? (
              <>
                {selectedProviders.includes('OpenAI') && (
                  <Area
                    type="monotone"
                    dataKey="OpenAI"
                    name="OpenAI"
                    stackId="1"
                    stroke="#10B981"
                    fill="#10B981"
                    fillOpacity={0.5}
                  />
                )}
                {selectedProviders.includes('Anthropic') && (
                  <Area
                    type="monotone"
                    dataKey="Anthropic"
                    name="Anthropic"
                    stackId="1"
                    stroke="#6366F1"
                    fill="#6366F1"
                    fillOpacity={0.5}
                  />
                )}
                {selectedProviders.includes('Gemini') && (
                  <Area
                    type="monotone"
                    dataKey="Gemini"
                    name="Gemini"
                    stackId="1"
                    stroke="#F59E0B"
                    fill="#F59E0B"
                    fillOpacity={0.5}
                  />
                )}
              </>
            ) : (
              <>
                <Area
                  type="monotone"
                  dataKey="actual"
                  name="Actual Usage"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.5}
                />
                {showForecasting && (
                  <Area
                    type="monotone"
                    dataKey="forecast"
                    name="Forecast"
                    stroke="#6b7280"
                    fill="#6b7280"
                    fillOpacity={0.2}
                    strokeDasharray="3 3"
                  />
                )}
              </>
            )}
            
            {/* Forecast reference line */}
            {showForecasting && forecastStartDate && (
              <ReferenceLine
                x={forecastStartDate}
                stroke="#6b7280"
                strokeDasharray="3 3"
                label={{ value: "Forecast →", position: "insideTopRight", fill: "#6b7280" }}
              />
            )}
            
            {/* Forecast confidence area */}
            {showForecasting && !showProviderBreakdown && (
              <Area
                dataKey="upper"
                name="Confidence Interval"
                stroke="transparent"
                fill="#6b7280"
                fillOpacity={0.1}
              />
            )}
            
            {/* Anomaly highlights */}
            {detectAnomalies && anomalies.map((anomaly, index) => (
              <ReferenceLine
                key={`anomaly-${index}`}
                x={anomaly.date}
                stroke="#EF4444"
                strokeDasharray="3 3"
                label={{
                  value: "!",
                  position: "top",
                  fill: "#EF4444",
                  fontSize: 12,
                }}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      );
    } else {
      // Bar chart
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
            <XAxis dataKey="date" />
            <YAxis
              tickFormatter={formatNumber}
              label={{
                value: 'Tokens',
                angle: -90,
                position: 'insideLeft',
                offset: -5,
              }}
            />
            <Tooltip
              formatter={(value: number) => [value ? value.toLocaleString() : '-', 'Tokens']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
            
            {/* Provider breakdown or combined */}
            {showProviderBreakdown ? (
              <>
                {selectedProviders.includes('OpenAI') && (
                  <Bar
                    dataKey="OpenAI"
                    name="OpenAI"
                    stackId="provider"
                    fill="#10B981"
                    radius={[4, 4, 0, 0]}
                  />
                )}
                {selectedProviders.includes('Anthropic') && (
                  <Bar
                    dataKey="Anthropic"
                    name="Anthropic"
                    stackId="provider"
                    fill="#6366F1"
                    radius={[4, 4, 0, 0]}
                  />
                )}
                {selectedProviders.includes('Gemini') && (
                  <Bar
                    dataKey="Gemini"
                    name="Gemini"
                    stackId="provider"
                    fill="#F59E0B"
                    radius={[4, 4, 0, 0]}
                  />
                )}
              </>
            ) : (
              <>
                <Bar
                  dataKey="actual"
                  name="Actual Usage"
                  fill="#3B82F6"
                  radius={[4, 4, 0, 0]}
                />
                {showForecasting && (
                  <Bar
                    dataKey="forecast"
                    name="Forecast"
                    fill="#6b7280"
                    radius={[4, 4, 0, 0]}
                    fillOpacity={0.7}
                  />
                )}
              </>
            )}
            
            {/* Forecast reference line */}
            {showForecasting && forecastStartDate && (
              <ReferenceLine
                x={forecastStartDate}
                stroke="#6b7280"
                strokeDasharray="3 3"
                label={{ value: "Forecast →", position: "insideTopRight", fill: "#6b7280" }}
              />
            )}
            
            {/* Anomaly highlights */}
            {detectAnomalies && anomalies.map((anomaly, index) => (
              <ReferenceLine
                key={`anomaly-${index}`}
                x={anomaly.date}
                stroke="#EF4444"
                strokeDasharray="3 3"
                label={{
                  value: "!",
                  position: "top",
                  fill: "#EF4444",
                  fontSize: 12,
                }}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      );
    }
  };
  
  // Anomaly detection info
  const anomalyInfo = anomalies.length > 0 ? (
    <div className="flex items-center mt-2 text-sm text-red-500">
      <AlertTriangle className="h-4 w-4 mr-1" />
      <span>Anomaly detected on {anomalies.map(a => a.date).join(', ')} - Usage spike above expected pattern</span>
    </div>
  ) : null;
  
  // Calculate total tokens and trend
  const totalTokens = data
    .filter(d => d.actual !== null)
    .reduce((sum, item) => sum + item.actual, 0);
  
  // Calculate tokens for last 7 days vs previous 7 days
  const last7Days = data
    .filter(d => d.actual !== null)
    .slice(-7)
    .reduce((sum, item) => sum + item.actual, 0);
  
  const previous7Days = data
    .filter(d => d.actual !== null)
    .slice(-14, -7)
    .reduce((sum, item) => sum + item.actual, 0);
  
  const weeklyTrend = previous7Days > 0 
    ? ((last7Days - previous7Days) / previous7Days * 100).toFixed(1)
    : '0';
  
  return (
    <Card className="col-span-full">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-muted-foreground" />
              Usage Tracking & Forecasting
            </CardTitle>
            <CardDescription>
              Token usage trends with predictive analytics and anomaly detection
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <Select value={timeframe} onValueChange={setTimeframe}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="ytd">Year to date</SelectItem>
              </SelectContent>
            </Select>
            
            <DateRangeFilter 
              dateRange={dateRange} 
              onChange={setDateRange}
              align="end"
            />
            
            <ProviderFilter 
              providers={providerOptions}
              selectedProviders={selectedProviders}
              onChange={setSelectedProviders}
              showLabel={false}
              align="end"
            />
            
            <Button variant="outline" size="sm" className="h-9" onClick={handleRefreshData}>
              <Link className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Refresh</span>
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-9">
                  <FileDown className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
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
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm font-medium text-muted-foreground">Total Tokens</div>
              <div className="text-2xl font-bold mt-1">{formatNumber(totalTokens)}</div>
              <div className="text-xs text-muted-foreground mt-1">
                Last 30 days
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm font-medium text-muted-foreground">Weekly Trend</div>
              <div className="flex items-center text-2xl font-bold mt-1">
                {weeklyTrend}%
                <span className={cn(
                  "ml-1 text-xs",
                  parseFloat(weeklyTrend) >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {parseFloat(weeklyTrend) >= 0 ? "↑" : "↓"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                vs previous 7 days
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm font-medium text-muted-foreground">Daily Average</div>
              <div className="text-2xl font-bold mt-1">
                {formatNumber(totalTokens / Math.min(30, data.filter(d => d.actual !== null).length))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Tokens per day
              </div>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="text-sm font-medium text-muted-foreground">Forecast</div>
              <div className="text-2xl font-bold mt-1">
                {formatNumber(data.filter(d => d.forecast !== null)
                  .reduce((sum, item) => sum + item.forecast, 0))}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Next 7 days projected
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="flex flex-wrap gap-4">
              <Tabs defaultValue={chartType} onValueChange={setChartType} className="w-auto">
                <TabsList>
                  <TabsTrigger value="line" className="flex items-center gap-1">
                    <ChartLine className="h-4 w-4" />
                    <span className="hidden sm:inline">Line</span>
                  </TabsTrigger>
                  <TabsTrigger value="area" className="flex items-center gap-1">
                    <Network className="h-4 w-4" />
                    <span className="hidden sm:inline">Area</span>
                  </TabsTrigger>
                  <TabsTrigger value="bar" className="flex items-center gap-1">
                    <BarChart className="h-4 w-4" />
                    <span className="hidden sm:inline">Bar</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Options
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="start">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Display Options</h4>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="show-providers" 
                          checked={showProviderBreakdown} 
                          onCheckedChange={(checked) => setShowProviderBreakdown(checked as boolean)}
                        />
                        <UILabel htmlFor="show-providers">Show provider breakdown</UILabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="show-forecast" 
                          checked={showForecasting} 
                          onCheckedChange={(checked) => setShowForecasting(checked as boolean)}
                        />
                        <UILabel htmlFor="show-forecast">Show usage forecasting</UILabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="detect-anomalies" 
                          checked={detectAnomalies} 
                          onCheckedChange={(checked) => setDetectAnomalies(checked as boolean)}
                        />
                        <UILabel htmlFor="detect-anomalies">Detect usage anomalies</UILabel>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            
            {showForecasting && (
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="bg-slate-100">
                  <Zap className="h-3 w-3 mr-1 text-blue-500" />
                  Predictive Analytics
                </Badge>
              </div>
            )}
          </div>
          
          <div className="h-[400px] w-full">
            {renderChart()}
          </div>
          
          {detectAnomalies && anomalyInfo}
          
          <div className="flex flex-col sm:flex-row justify-between gap-4 text-sm text-muted-foreground">
            <div className="flex flex-col gap-2">
              {showForecasting && (
                <div className="flex items-center">
                  <span className="inline-block w-4 h-0 border-t-2 border-dashed border-gray-500 mr-2"></span>
                  <span>Forecast data for next 7 days (±{Math.round(10 + (7 * 2))}% confidence)</span>
                </div>
              )}
              {detectAnomalies && (
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 rounded-full bg-red-500 mr-2"></span>
                  <span>Anomaly detection highlights unusual usage patterns</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-2 items-center">
              <Info className="h-4 w-4" />
              <span>Data last refreshed: {new Date().toLocaleString()}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};