import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Users, Database, BarChart, PieChart, LineChart, CreditCard, TrendingUp, ArrowUpRight, ArrowDownRight, Zap, Calendar } from "lucide-react";
import { ProviderComparisonChart } from "@/application/components/charts/ProviderComparisonChart";
import { UsageOverTimeChart } from "@/application/components/charts/UsageOverTimeChart";
import { TopCustomersTable } from "@/application/components/tables/TopCustomersTable";
import { ProviderTokensChart } from "@/application/components/charts/ProviderTokensChart";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";
import { RevenueVsCostChart } from "@/application/components/charts/RevenueVsCostChart";
import { BudgetAllocationChart } from "@/application/components/charts/BudgetAllocationChart";
import { ResponseTimeChart } from "@/application/components/charts/ResponseTimeChart";
import { ErrorRateChart } from "@/application/components/charts/ErrorRateChart";
import { CustomerSegmentationChart } from "@/application/components/charts/CustomerSegmentationChart";
import { CustomerDistributionChart } from "@/application/components/charts/CustomerDistributionChart";
import { CustomerRetentionChart } from "@/application/components/charts/CustomerRetentionChart";
import { cn } from "@/lib/utils";
import { useNavigate } from "@/application/hooks/useNavigate";
import { ErrorBoundary } from "@/application/components/ui/ErrorBoundary";

export const Dashboard = () => {
  const { navigateTo } = useNavigate();
  
  const globalData = {
    totalAvailableCredits: 12500,
    totalConsumedCredits: 7850,
    totalTokens: 45000000,
    consumedTokens: 28700000,
    totalCustomers: 134,
    averageSpentPerCustomer: 58.58,
    monthlyRevenue: 24500,
    monthlyGrowth: 12.5,
    activeUsers: 98,
    customerGrowth: 8.3,
    avgResponseTime: 1.2,
    errorRate: 0.42
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
      </div>
      
      <Tabs defaultValue="financials" className="space-y-4">
        <TabsList className="bg-white border">
          <TabsTrigger 
            value="financials" 
            className={cn(
              "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
              "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
            )}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Financials
          </TabsTrigger>
          <TabsTrigger 
            value="usage" 
            className={cn(
              "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
              "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
            )}
          >
            <BarChart className="h-4 w-4 mr-2" />
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
        
        <TabsContent value="financials" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Monthly Revenue"
              value={`$${globalData.monthlyRevenue.toLocaleString()}`}
              description={`${globalData.monthlyGrowth}% from last month`}
              icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
              trend="up"
            />
            <MetricCard
              title="Available Credits"
              value={`$${globalData.totalAvailableCredits.toLocaleString()}`}
              description="Total credits available across all providers"
              icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
            />
            <MetricCard
              title="Consumed Credits"
              value={`$${globalData.totalConsumedCredits.toLocaleString()}`}
              description="Total credits consumed across all providers"
              icon={<CreditIcon />}
              trend="up"
            />
            <MetricCard
              title="Average Spend per Customer"
              value={`$${globalData.averageSpentPerCustomer.toFixed(2)}`}
              description="Average spend per customer"
              icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Provider Spending</span>
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Credit consumption by provider
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ErrorBoundary>
                  <ProviderComparisonChart />
                </ErrorBoundary>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Revenue vs. Cost</span>
                  <TrendingUp className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Monthly revenue compared to LLM costs
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ErrorBoundary>
                  <RevenueVsCostChart />
                </ErrorBoundary>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Budget Allocation</span>
                  <PieChart className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Budget allocation across different LLM providers
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ErrorBoundary>
                  <BudgetAllocationChart />
                </ErrorBoundary>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Financial Highlights</CardTitle>
                <CardDescription>Key metrics this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Cost Efficiency</p>
                      <p className="text-sm text-muted-foreground">Cost per 1K tokens</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">$0.0023</p>
                      <div className="text-xs text-green-600 flex items-center">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>12%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Profit Margin</p>
                      <p className="text-sm text-muted-foreground">Revenue - Cost</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">68%</p>
                      <div className="text-xs text-green-600 flex items-center">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>3%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">MRR</p>
                      <p className="text-sm text-muted-foreground">Monthly Recurring Revenue</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">$22,450</p>
                      <div className="text-xs text-green-600 flex items-center">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>8%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">ARPU</p>
                      <p className="text-sm text-muted-foreground">Average Revenue Per User</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">$167.54</p>
                      <div className="text-xs text-green-600 flex items-center">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>5%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="usage" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Tokens"
              value={`${(globalData.totalTokens / 1000000).toFixed(2)}M`}
              description="Total tokens across all providers"
              icon={<Database className="h-6 w-6 text-muted-foreground" />}
            />
            <MetricCard
              title="Consumed Tokens"
              value={`${(globalData.consumedTokens / 1000000).toFixed(2)}M`}
              description="Total tokens consumed across all providers"
              icon={<Database className="h-6 w-6 text-muted-foreground" />}
              trend="up"
            />
            <MetricCard
              title="Avg. Response Time"
              value={`${globalData.avgResponseTime}s`}
              description="Average API response time"
              icon={<Zap className="h-6 w-6 text-muted-foreground" />}
              trend="down"
            />
            <MetricCard
              title="Error Rate"
              value={`${globalData.errorRate}%`}
              description="Average API error rate"
              icon={<BarChart className="h-6 w-6 text-muted-foreground" />}
              trend="down"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Token Distribution</span>
                  <div className="flex gap-2">
                    {['openai', 'anthropic', 'gemini', 'llama'].map(provider => (
                      <ProviderLogo key={`token-dist-${provider}`} provider={provider} className="w-5 h-5 text-muted-foreground" />
                    ))}
                  </div>
                </CardTitle>
                <CardDescription>
                  Token consumption by provider
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ErrorBoundary>
                  <ProviderTokensChart />
                </ErrorBoundary>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Usage Over Time</span>
                  <LineChart className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Daily token consumption across all providers
                </CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ErrorBoundary>
                  <UsageOverTimeChart />
                </ErrorBoundary>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Response Time</span>
                  <Zap className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Average response time by provider
                </CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <ErrorBoundary>
                  <ResponseTimeChart />
                </ErrorBoundary>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Error Rates</span>
                  <BarChart className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  API error rates by provider
                </CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <ErrorBoundary>
                  <ErrorRateChart />
                </ErrorBoundary>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Usage Insights</CardTitle>
              <CardDescription>Key usage metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider="openai" className="w-5 h-5" />
                      <span className="font-medium">OpenAI</span>
                    </div>
                    <span className="text-sm font-bold">15.2M tokens</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '53%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>53% of total</span>
                    <span>+12% from last month</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider="anthropic" className="w-5 h-5" />
                      <span className="font-medium">Anthropic</span>
                    </div>
                    <span className="text-sm font-bold">7.8M tokens</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-indigo-500 h-2.5 rounded-full" style={{ width: '27%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>27% of total</span>
                    <span>+18% from last month</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider="gemini" className="w-5 h-5" />
                      <span className="font-medium">Gemini</span>
                    </div>
                    <span className="text-sm font-bold">3.5M tokens</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2.5">
                    <div className="bg-amber-500 h-2.5 rounded-full" style={{ width: '12%' }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>12% of total</span>
                    <span>+32% from last month</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Customers"
              value={globalData.totalCustomers.toString()}
              description="Number of customers across all providers"
              icon={<Users className="h-6 w-6 text-muted-foreground" />}
              onClick={() => navigateTo('customers')}
            />
            <MetricCard
              title="Active Customers"
              value={globalData.activeUsers.toString()}
              description="Customers active in the last 7 days"
              icon={<Users className="h-6 w-6 text-muted-foreground" />}
              trend="up"
              onClick={() => navigateTo('customers')}
            />
            <MetricCard
              title="Customer Growth"
              value={`+${globalData.customerGrowth}%`}
              description="Growth rate in the last 30 days"
              icon={<LineChart className="h-6 w-6 text-muted-foreground" />}
              trend="up"
            />
            <MetricCard
              title="Avg. Tokens per Customer"
              value="214K"
              description="Average monthly token usage per customer"
              icon={<Database className="h-6 w-6 text-muted-foreground" />}
            />
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Top Customers</span>
                <Users className="h-5 w-5 text-muted-foreground" />
              </CardTitle>
              <CardDescription>
                Customers with highest consumption across all providers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ErrorBoundary>
                <TopCustomersTable global={true} />
              </ErrorBoundary>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Customer Segmentation</span>
                  <PieChart className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Customers segmented by consumption level
                </CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <ErrorBoundary>
                  <CustomerSegmentationChart />
                </ErrorBoundary>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Customer Distribution</span>
                  <PieChart className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Distribution of customers across providers
                </CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <ErrorBoundary>
                  <CustomerDistributionChart />
                </ErrorBoundary>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Customer Retention</span>
                  <LineChart className="h-5 w-5 text-muted-foreground" />
                </CardTitle>
                <CardDescription>
                  Monthly customer retention rate
                </CardDescription>
              </CardHeader>
              <CardContent className="h-60">
                <ErrorBoundary>
                  <CustomerRetentionChart />
                </ErrorBoundary>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Insights</CardTitle>
                <CardDescription>Key customer metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Activation Rate</p>
                      <p className="text-sm text-muted-foreground">New customers using the API</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">87%</p>
                      <div className="text-xs text-green-600 flex items-center">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>5%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">Churn Rate</p>
                      <p className="text-sm text-muted-foreground">Monthly customer loss</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">3.2%</p>
                      <div className="text-xs text-red-600 flex items-center">
                        <ArrowDownRight className="h-3 w-3" />
                        <span>0.5%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">NPS Score</p>
                      <p className="text-sm text-muted-foreground">Net Promoter Score</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">72</p>
                      <div className="text-xs text-green-600 flex items-center">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>3</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">LTV</p>
                      <p className="text-sm text-muted-foreground">Lifetime Value</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-lg font-bold">$2,450</p>
                      <div className="text-xs text-green-600 flex items-center">
                        <ArrowUpRight className="h-3 w-3" />
                        <span>8%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const CreditIcon = () => (
  <div className="rounded-md bg-primary/10 p-1">
    <DollarSign className="h-5 w-5 text-primary" />
  </div>
);

interface MetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: "up" | "down";
  onClick?: () => void;
}

const MetricCard = ({ title, value, description, icon, trend, onClick }: MetricCardProps) => {
  return (
    <Card className={onClick ? "cursor-pointer hover:border-primary transition-colors" : ""} onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="flex items-center">
          <div className="text-2xl font-bold">{value}</div>
          {trend && (
            <div className={cn(
              "ml-2 text-xs flex items-center",
              trend === "up" ? "text-green-600" : "text-red-600"
            )}>
              {trend === "up" ? (
                <ArrowUpRight className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDownRight className="h-3 w-3 mr-1" />
              )}
            </div>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};