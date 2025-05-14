import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Users, Database, BarChart, PieChart, LineChart, Filter, ChevronDown, ArrowRight, RefreshCw, Network, ChartBar, ChartPie, ChartLine, TrendingDown, TrendingUp, Info, Activity } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangeFilter } from "@/application/components/filters/DateRangeFilter";
import { DateRange } from "react-day-picker";
import { ProviderFilter, ProviderOption } from "@/application/components/filters/ProviderFilter";
import { ComparativeProviderChart } from "@/application/components/enhanced/ComparativeProviderChart";
import { EnhancedRevenueVsCostChart } from "@/application/components/enhanced/EnhancedRevenueVsCostChart";
import { EnhancedUsageTrackingChart } from "@/application/components/enhanced/EnhancedUsageTrackingChart";
import { CustomerSegmentationEnhanced } from "@/application/components/enhanced/CustomerSegmentationEnhanced";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const InsightsView = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date()
  });
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  
  // Define available providers for filter
  const providerOptions: ProviderOption[] = [
    { value: 'OpenAI', label: 'OpenAI' },
    { value: 'Anthropic', label: 'Anthropic' },
    { value: 'Gemini', label: 'Gemini' },
    { value: 'Llama', label: 'Llama' }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Insights</h1>
          <p className="text-muted-foreground">
            Comprehensive view of your LLM usage with advanced analytics and predictions
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <DateRangeFilter 
            dateRange={dateRange} 
            onChange={setDateRange}
          />
          
          <ProviderFilter 
            providers={providerOptions}
            selectedProviders={selectedProviders}
            onChange={setSelectedProviders}
          />
          
          <Button variant="outline" size="sm" className="h-9">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Data
          </Button>
        </div>
      </div>
      
      <Tabs
        defaultValue={activeTab}
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <div className="flex justify-between items-center">
          <TabsList className="bg-card border">
            <TabsTrigger 
              value="overview" 
              className={cn(
                "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
                "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
              )}
            >
              <Activity className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="comparative" 
              className={cn(
                "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
                "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
              )}
            >
              <ChartBar className="h-4 w-4 mr-2" />
              Comparative Analysis
            </TabsTrigger>
            <TabsTrigger 
              value="financial" 
              className={cn(
                "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
                "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
              )}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Financial
            </TabsTrigger>
            <TabsTrigger 
              value="usage" 
              className={cn(
                "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
                "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
              )}
            >
              <Database className="h-4 w-4 mr-2" />
              Usage
            </TabsTrigger>
            <TabsTrigger 
              value="customers" 
              className={cn(
                "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
                "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
              )}
            >
              <Users className="h-4 w-4 mr-2" />
              Customers
            </TabsTrigger>
          </TabsList>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-blue-50 text-blue-600 border border-blue-200 rounded-md px-3 py-1 text-sm flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  Advanced Analytics
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-[250px] text-sm">
                  This dashboard features advanced analytics with predictive capabilities,
                  comparative analysis, and interactive filtering.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        {/* Overview Tab Content */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardMetric
              icon={<DollarSign className="h-6 w-6" />}
              title="Total Revenue"
              value="$178,430"
              change="+12.3%"
              trend="up"
              description="vs. previous period"
            />
            <DashboardMetric
              icon={<Database className="h-6 w-6" />}
              title="Total Tokens"
              value="248.5M"
              change="+8.7%"
              trend="up"
              description="vs. previous period"
            />
            <DashboardMetric
              icon={<Users className="h-6 w-6" />}
              title="Active Customers"
              value="132"
              change="+5"
              trend="up"
              description="new this period"
            />
            <DashboardMetric
              icon={<ChartPie className="h-6 w-6" />}
              title="Avg. Profit Margin"
              value="67.8%"
              change="+2.5%"
              trend="up"
              description="vs. previous period"
            />
          </div>
          
          <EnhancedRevenueVsCostChart />
          
          <div className="grid gap-4 md:grid-cols-2">
            <CustomerSegmentationEnhanced />
            <ComparativeProviderChart />
          </div>
          
          <EnhancedUsageTrackingChart />
        </TabsContent>
        
        {/* Comparative Analysis Tab Content */}
        <TabsContent value="comparative" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardMetric
              icon={<BarChart className="h-6 w-6" />}
              title="Market Share"
              value="42.3%"
              change="+3.5%"
              trend="up"
              description="vs. previous period"
            />
            <DashboardMetric
              icon={<TrendingUp className="h-6 w-6" />}
              title="Growth Rate"
              value="18.7%"
              change="+2.1%"
              trend="up"
              description="vs. previous period"
            />
            <DashboardMetric
              icon={<Network className="h-6 w-6" />}
              title="Provider Count"
              value="4"
              change="0"
              trend="neutral"
              description="active providers"
            />
            <DashboardMetric
              icon={<ChartLine className="h-6 w-6" />}
              title="Cost Efficiency"
              value="$0.0021"
              change="-8.2%"
              trend="down"
              description="per token (better)"
            />
          </div>
          
          <ComparativeProviderChart />
        </TabsContent>
        
        {/* Financial Tab Content */}
        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardMetric
              icon={<DollarSign className="h-6 w-6" />}
              title="MRR"
              value="$24,850"
              change="+14.3%"
              trend="up"
              description="monthly recurring revenue"
            />
            <DashboardMetric
              icon={<DollarSign className="h-6 w-6" />}
              title="Total Costs"
              value="$8,240"
              change="+7.2%"
              trend="up"
              description="all providers"
            />
            <DashboardMetric
              icon={<ChartLine className="h-6 w-6" />}
              title="Profit"
              value="$16,610"
              change="+18.5%"
              trend="up"
              description="monthly net profit"
            />
            <DashboardMetric
              icon={<ChartPie className="h-6 w-6" />}
              title="ROI"
              value="301%"
              change="+12.4%"
              trend="up"
              description="return on investment"
            />
          </div>
          
          <EnhancedRevenueVsCostChart />
        </TabsContent>
        
        {/* Usage Tab Content */}
        <TabsContent value="usage" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardMetric
              icon={<Database className="h-6 w-6" />}
              title="Total Tokens"
              value="248.5M"
              change="+8.7%"
              trend="up"
              description="vs. previous period"
            />
            <DashboardMetric
              icon={<ChartLine className="h-6 w-6" />}
              title="Avg Daily Usage"
              value="8.3M"
              change="+5.2%"
              trend="up"
              description="tokens per day"
            />
            <DashboardMetric
              icon={<TrendingDown className="h-6 w-6" />}
              title="Error Rate"
              value="0.42%"
              change="-0.18%"
              trend="down"
              description="better than before"
            />
            <DashboardMetric
              icon={<Activity className="h-6 w-6" />}
              title="Avg Response Time"
              value="1.2s"
              change="-0.3s"
              trend="down"
              description="better than before"
            />
          </div>
          
          <EnhancedUsageTrackingChart />
        </TabsContent>
        
        {/* Customers Tab Content */}
        <TabsContent value="customers" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <DashboardMetric
              icon={<Users className="h-6 w-6" />}
              title="Total Customers"
              value="132"
              change="+5"
              trend="up"
              description="new this period"
            />
            <DashboardMetric
              icon={<ChartLine className="h-6 w-6" />}
              title="Retention Rate"
              value="94.3%"
              change="+1.8%"
              trend="up"
              description="vs. previous period"
            />
            <DashboardMetric
              icon={<DollarSign className="h-6 w-6" />}
              title="ARPU"
              value="$188.25"
              change="+$12.40"
              trend="up"
              description="avg revenue per user"
            />
            <DashboardMetric
              icon={<Users className="h-6 w-6" />}
              title="Churn Rate"
              value="3.2%"
              change="-0.5%"
              trend="down"
              description="better than before"
            />
          </div>
          
          <CustomerSegmentationEnhanced />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Dashboard Metric Card Component
interface DashboardMetricProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  description: string;
}

const DashboardMetric = ({ icon, title, value, change, trend, description }: DashboardMetricProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={cn("p-1", 
          trend === "up" ? "text-green-600" : 
          trend === "down" ? "text-red-600" : 
          "text-gray-600")}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs mt-1">
          <span className={cn(
            "flex items-center font-medium",
            trend === "up" ? "text-green-600" : 
            trend === "down" ? "text-red-600" : 
            "text-gray-600"
          )}>
            {trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : 
             trend === "down" ? <TrendingDown className="h-3 w-3 mr-1" /> : 
             <ArrowRight className="h-3 w-3 mr-1" />}
            {change}
          </span>
          <span className="text-muted-foreground ml-1">{description}</span>
        </div>
      </CardContent>
    </Card>
  );
};