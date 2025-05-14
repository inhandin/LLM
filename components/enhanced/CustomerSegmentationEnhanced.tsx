import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip,
  Treemap,
  Sector,
  RadialBarChart,
  RadialBar,
  Label
} from 'recharts';
import { ChartPie, Eye, FileDown, Network, Share2, SlidersHorizontal, Gauge, Users } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label as UILabel } from "@/components/ui/label";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

// Enhanced customer segmentation data with multiple dimensions
const generateCustomerSegmentationData = () => {
  // Core segmentation data
  const usageSegmentation = [
    { 
      name: 'Enterprise', 
      value: 42, 
      percentage: '31%',
      avgSpend: 2450,
      avgTokens: 1200000,
      retention: 96,
      growth: 8,
      color: '#3B82F6'
    },
    { 
      name: 'Growth', 
      value: 55, 
      percentage: '41%',
      avgSpend: 950,
      avgTokens: 480000,
      retention: 88,
      growth: 15,
      color: '#10B981'
    },
    { 
      name: 'Startup', 
      value: 25, 
      percentage: '19%',
      avgSpend: 420,
      avgTokens: 210000,
      retention: 78,
      growth: 22,
      color: '#F59E0B'
    },
    { 
      name: 'Trial', 
      value: 12, 
      percentage: '9%',
      avgSpend: 80,
      avgTokens: 40000,
      retention: 45,
      growth: 35,
      color: '#6366F1'
    },
  ];

  // Industry segmentation
  const industrySegmentation = [
    { name: 'Technology', value: 38, color: '#3B82F6' },
    { name: 'Financial Services', value: 24, color: '#10B981' },
    { name: 'Healthcare', value: 18, color: '#F59E0B' },
    { name: 'E-commerce', value: 14, color: '#6366F1' },
    { name: 'Education', value: 10, color: '#EC4899' },
    { name: 'Manufacturing', value: 8, color: '#8B5CF6' },
    { name: 'Media', value: 8, color: '#14B8A6' },
    { name: 'Other', value: 14, color: '#6B7280' },
  ];

  // Treemap data (hierarchical nesting of usage by industry)
  const treemapData = [
    {
      name: 'Enterprise',
      children: [
        { name: 'Technology', value: 15, color: '#3B82F6' },
        { name: 'Financial', value: 12, color: '#10B981' },
        { name: 'Healthcare', value: 8, color: '#F59E0B' },
        { name: 'Others', value: 7, color: '#6366F1' },
      ],
    },
    {
      name: 'Growth',
      children: [
        { name: 'Technology', value: 18, color: '#3B82F6' },
        { name: 'E-commerce', value: 12, color: '#EC4899' },
        { name: 'Media', value: 8, color: '#14B8A6' },
        { name: 'Manufacturing', value: 6, color: '#8B5CF6' },
        { name: 'Others', value: 11, color: '#6366F1' },
      ],
    },
    {
      name: 'Startup',
      children: [
        { name: 'Technology', value: 10, color: '#3B82F6' },
        { name: 'Healthcare', value: 6, color: '#F59E0B' },
        { name: 'Education', value: 5, color: '#EC4899' },
        { name: 'Others', value: 4, color: '#6366F1' },
      ],
    },
    {
      name: 'Trial',
      children: [
        { name: 'Mixed', value: 12, color: '#6B7280' },
      ],
    },
  ];

  // Retention metrics by segment
  const retentionData = usageSegmentation.map(segment => ({
    name: segment.name,
    value: segment.retention,
    fill: segment.color
  }));

  return {
    usageSegmentation,
    industrySegmentation,
    treemapData,
    retentionData
  };
};

// For the active shape in PieChart
const renderActiveShape = (props: any) => {
  const { 
    cx, cy, innerRadius, outerRadius, startAngle, endAngle,
    fill, payload, percent, value 
  } = props;

  return (
    <g>
      <text x={cx} y={cy} dy={-20} textAnchor="middle" fill={fill} className="text-lg font-medium">
        {payload.name}
      </text>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill="#999" className="text-sm">
        {`${value} customers (${(percent * 100).toFixed(1)}%)`}
      </text>
      <text x={cx} y={cy} dy={25} textAnchor="middle" fill="#999" className="text-xs">
        {`Avg spend: $${payload.avgSpend}`}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
    </g>
  );
};

// Custom tree map content
const CustomizedContent = (props: any) => {
  const { x, y, width, height, name, value, fill } = props;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill,
          stroke: '#fff',
          strokeWidth: 2,
          fillOpacity: 0.85,
        }}
      />
      {width > 60 && height > 25 ? (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 7}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight="bold"
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 10}
            textAnchor="middle"
            fill="#fff"
            fontSize={10}
          >
            {value} customers
          </text>
        </>
      ) : null}
    </g>
  );
};

export const CustomerSegmentationEnhanced = () => {
  const [chartType, setChartType] = useState<string>("pie");
  const [segmentationType, setSegmentationType] = useState<string>("usage");
  const [showValues, setShowValues] = useState<boolean>(true);
  const [showPercentages, setShowPercentages] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  
  // Get data
  const data = generateCustomerSegmentationData();
  
  // Handle mouse enter for active segment
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  // Render the chart based on type and segmentation
  const renderChart = () => {
    // Choose data based on segmentation type
    const chartData = segmentationType === 'usage' 
      ? data.usageSegmentation 
      : data.industrySegmentation;
    
    if (chartType === 'pie') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={0}
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
              onMouseEnter={onPieEnter}
              label={showValues || showPercentages ? ({name, percent, value}) => {
                if (showValues && showPercentages) return `${name} (${(percent * 100).toFixed(0)}%)`;
                if (showValues) return `${name}`;
                if (showPercentages) return `${(percent * 100).toFixed(0)}%`;
                return '';
              } : false}
              labelLine={showValues || showPercentages}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              formatter={(value: number) => [`${value} customers`, 'Count']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    } else if (chartType === 'treemap') {
      return (
        <ResponsiveContainer width="100%" height="100%">
          <Treemap
            data={data.treemapData}
            dataKey="value"
            stroke="#fff"
            fill="#8884d8"
            content={<CustomizedContent />}
          >
            <Tooltip 
              formatter={(value: number) => [`${value} customers`, 'Count']}
              contentStyle={{ 
                backgroundColor: 'hsl(var(--card))', 
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            />
          </Treemap>
        </ResponsiveContainer>
      );
    } else {
      // Radial bar chart for retention metrics
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="20%" 
            outerRadius="90%" 
            barSize={20} 
            data={data.retentionData}
            startAngle={180}
            endAngle={0}
          >
            <RadialBar
              label={{ position: 'insideStart', fill: '#fff' }}
              background
              dataKey="value"
            >
              {data.retentionData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label 
                position="center" 
                content={<CustomizedLabel segment={data.usageSegmentation[activeIndex]} />} 
              />
            </RadialBar>
            <Legend 
              iconSize={10} 
              layout="vertical" 
              verticalAlign="middle" 
              align="right" 
              wrapperStyle={{ paddingLeft: '10px' }}
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
          </RadialBarChart>
        </ResponsiveContainer>
      );
    }
  };
  
  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              Customer Segmentation Analysis
            </CardTitle>
            <CardDescription>
              Multi-dimensional customer segmentation and analysis
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
                  <Eye className="mr-2 h-4 w-4" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  View full screen
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Compare with previous period
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8">
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
            
            <Button variant="outline" size="sm" className="h-8">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="flex flex-wrap gap-4">
              <Select value={segmentationType} onValueChange={setSegmentationType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select segmentation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usage">By Usage Tier</SelectItem>
                  <SelectItem value="industry">By Industry</SelectItem>
                </SelectContent>
              </Select>
              
              <Tabs defaultValue={chartType} onValueChange={setChartType} className="w-auto">
                <TabsList>
                  <TabsTrigger value="pie" className="flex items-center gap-1">
                    <ChartPie className="h-4 w-4" />
                    <span className="hidden sm:inline">Pie</span>
                  </TabsTrigger>
                  <TabsTrigger value="treemap" className="flex items-center gap-1">
                    <Network className="h-4 w-4" />
                    <span className="hidden sm:inline">Treemap</span>
                  </TabsTrigger>
                  <TabsTrigger value="radial" className="flex items-center gap-1">
                    <Gauge className="h-4 w-4" />
                    <span className="hidden sm:inline">Retention</span>
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
                          id="show-values" 
                          checked={showValues} 
                          onCheckedChange={(checked) => setShowValues(checked as boolean)}
                        />
                        <UILabel htmlFor="show-values">Show segment names</UILabel>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox 
                          id="show-percentages" 
                          checked={showPercentages} 
                          onCheckedChange={(checked) => setShowPercentages(checked as boolean)}
                        />
                        <UILabel htmlFor="show-percentages">Show percentages</UILabel>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="h-[450px] w-full">
            {renderChart()}
          </div>
          
          {chartType === 'pie' && segmentationType === 'usage' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              {data.usageSegmentation.map((segment, index) => (
                <div
                  key={`segment-card-${index}`}
                  className={cn(
                    "p-4 rounded-lg border",
                    activeIndex === index ? "border-primary bg-primary/5" : "border-border"
                  )}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: segment.color }}
                    ></div>
                    <h3 className="font-medium text-sm">{segment.name}</h3>
                  </div>
                  <div className="mt-2">
                    <div className="text-xs text-muted-foreground">Average spend</div>
                    <div className="font-bold">${segment.avgSpend}</div>
                  </div>
                  <div className="mt-1">
                    <div className="text-xs text-muted-foreground">Tokens/month</div>
                    <div className="font-bold">{(segment.avgTokens / 1000).toFixed(0)}K</div>
                  </div>
                  <div className="mt-1">
                    <div className="text-xs text-muted-foreground">Growth rate</div>
                    <div className="font-bold">{segment.growth}%</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

// Custom label for RadialChart
const CustomizedLabel = ({ segment, viewBox, ...rest }: any) => {
  const { cx, cy } = viewBox;
  
  return (
    <g>
      <text x={cx} y={cy - 20} textAnchor="middle" dominantBaseline="middle" className="text-xl font-bold">
        {segment?.name || 'Segment'}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" dominantBaseline="middle" className="text-lg font-semibold">
        {segment?.retention || 0}%
      </text>
      <text x={cx} y={cy + 35} textAnchor="middle" dominantBaseline="middle" className="text-xs">
        Retention Rate
      </text>
    </g>
  );
};