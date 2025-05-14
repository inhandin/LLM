import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Database, Activity, Zap } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { UsageOverTimeChart } from "@/application/components/charts/UsageOverTimeChart";
import { TopCustomersTable } from "@/application/components/tables/TopCustomersTable";
import { capitalize } from "@/application/utils/stringUtils";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";
import { ModelUsageChart } from "@/application/components/charts/ModelUsageChart";
import { RequestVolumeChart } from "@/application/components/charts/RequestVolumeChart";
import { TokenDistributionChart } from "@/application/components/charts/TokenDistributionChart";
import { CostTrendChart } from "@/application/components/charts/CostTrendChart";

// List of real company names to use instead of generic ones
const COMPANY_NAMES = [
  'Gong', 'Slack', 'Microsoft', 'Apple', 'Google', 
  'Amazon', 'Netflix', 'Spotify', 'Adobe', 'Acme Inc',
  'Dropbox', 'Airbnb', 'Uber', 'Salesforce', 'Twitter',
  'LinkedIn', 'Facebook', 'IBM', 'Oracle', 'Intel',
  'Cisco', 'Tesla', 'Shopify', 'Zoom', 'PayPal'
];

// Mock data generator for each provider
const generateMockData = (provider: string) => {
  const PROVIDER_FACTORS: Record<string, { credits: number, tokens: number, customers: number }> = {
    openai: { credits: 1.0, tokens: 1.0, customers: 1.0 },
    anthropic: { credits: 0.65, tokens: 0.70, customers: 0.75 },
    gemini: { credits: 0.35, tokens: 0.40, customers: 0.50 },
    llama: { credits: 0.25, tokens: 0.30, customers: 0.40 },
  };
  
  const factor = PROVIDER_FACTORS[provider] || PROVIDER_FACTORS.openai;
  
  const baseAvailableCredits = 5000;
  const baseConsumedCredits = 3500;
  const baseTotalTokens = 25000000;
  const baseConsumedTokens = 15600000;
  
  // Generate customer data
  const customerCount = Math.floor(60 * factor.customers);
  const customers = [];
  
  for (let i = 1; i <= customerCount; i++) {
    const customerTokens = Math.floor((baseConsumedTokens / customerCount) * (0.5 + Math.random()));
    const customerCredits = Math.floor((baseConsumedCredits / customerCount) * (0.5 + Math.random()));
    const companyName = COMPANY_NAMES[(i - 1) % COMPANY_NAMES.length];
    
    customers.push({
      id: `customer-${provider}-${i}`,
      name: companyName,
      consumedCredits: customerCredits,
      consumedTokens: customerTokens,
      monthlyPayment: customerCredits * (1.5 + Math.random()),
      averageTokenUsage: Math.floor(customerTokens / 30),
      averageCost: (customerCredits / 30),
      dailyLimit: 10000 + Math.floor(Math.random() * 5000),
      monthlyLimit: 300000 + Math.floor(Math.random() * 100000),
    });
  }
  
  // Sort customers by consumed credits (high to low)
  customers.sort((a, b) => b.consumedCredits - a.consumedCredits);
  
  return {
    availableCredits: baseAvailableCredits * factor.credits,
    consumedCredits: baseConsumedCredits * factor.credits,
    totalTokens: baseTotalTokens * factor.tokens,
    consumedTokens: baseConsumedTokens * factor.tokens,
    averageSpentPerCustomer: (baseConsumedCredits * factor.credits) / customerCount,
    customers
  };
};

interface ProviderOverviewProps {
  provider: string;
}

export const ProviderOverview = ({ provider }: ProviderOverviewProps) => {
  const [timeRange, setTimeRange] = useState("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Generate mock data when provider changes
    try {
      setLoading(true);
      // Simulate API call with a small delay
      setTimeout(() => {
        const mockData = generateMockData(provider);
        setData(mockData);
        setLoading(false);
      }, 300);
    } catch (err) {
      console.error("Error generating provider data:", err);
      setLoading(false);
    }
  }, [provider]);

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading {capitalize(provider)} data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ProviderLogo provider={provider} className="w-6 h-6" />
          <h2 className="text-xl font-bold">{capitalize(provider)} Overview</h2>
        </div>
        <Select defaultValue={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 3 months</SelectItem>
            <SelectItem value="180d">Last 6 months</SelectItem>
            <SelectItem value="365d">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <MetricCard
          title="Available Credits"
          value={`$${data.availableCredits.toLocaleString()}`}
          description="Total credits available for this provider"
          icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
        />
        <MetricCard
          title="Consumed Credits"
          value={`$${data.consumedCredits.toLocaleString()}`}
          description="Total credits consumed for this provider"
          icon={<CreditIcon />}
        />
        <MetricCard
          title="Total Tokens"
          value={`${(data.totalTokens / 1000000).toFixed(2)}M`}
          description="Total tokens for this provider"
          icon={<Database className="h-6 w-6 text-muted-foreground" />}
        />
        <MetricCard
          title="Consumed Tokens"
          value={`${(data.consumedTokens / 1000000).toFixed(2)}M`}
          description="Total tokens consumed for this provider"
          icon={<Database className="h-6 w-6 text-muted-foreground" />}
        />
        <MetricCard
          title="Total Customers"
          value={data.customers.length.toString()}
          description="Number of customers for this provider"
          icon={<Users className="h-6 w-6 text-muted-foreground" />}
        />
        <MetricCard
          title="Avg. Spend per Customer"
          value={`$${data.averageSpentPerCustomer.toFixed(2)}`}
          description="Average spend per customer"
          icon={<DollarSign className="h-6 w-6 text-muted-foreground" />}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0">
            <div className="flex-1">
              <CardTitle>Usage Over Time</CardTitle>
              <CardDescription>
                Daily token consumption for {capitalize(provider)}
              </CardDescription>
            </div>
            <ProviderLogo provider={provider} className="w-8 h-8 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-80">
            <UsageOverTimeChart provider={provider} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0">
            <div className="flex-1">
              <CardTitle>Model Usage Distribution</CardTitle>
              <CardDescription>
                Token usage by model type
              </CardDescription>
            </div>
            <ProviderLogo provider={provider} className="w-8 h-8 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-80">
            <ModelUsageChart provider={provider} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center space-y-0">
            <div className="flex-1">
              <CardTitle>Request Volume</CardTitle>
              <CardDescription>
                API requests over time
              </CardDescription>
            </div>
            <Activity className="w-6 h-6 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-72">
            <RequestVolumeChart provider={provider} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center space-y-0">
            <div className="flex-1">
              <CardTitle>Prompt vs. Completion</CardTitle>
              <CardDescription>
                Distribution of token types
              </CardDescription>
            </div>
            <Zap className="w-6 h-6 text-muted-foreground" />
          </CardHeader>
          <CardContent className="h-72">
            <TokenDistributionChart provider={provider} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0">
          <div className="flex-1">
            <CardTitle>Cost Trend</CardTitle>
            <CardDescription>
              Daily cost for {capitalize(provider)} (Last 30 days)
            </CardDescription>
          </div>
          <DollarSign className="w-6 h-6 text-muted-foreground" />
        </CardHeader>
        <CardContent className="h-72">
          <CostTrendChart provider={provider} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center space-y-0">
          <div className="flex-1">
            <CardTitle>Top Customers</CardTitle>
            <CardDescription>
              Customers with highest consumption for {capitalize(provider)}
            </CardDescription>
          </div>
          <ProviderLogo provider={provider} className="w-8 h-8 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-10 px-4 text-left align-middle font-medium w-[50px]">#</th>
                  <th className="h-10 px-4 text-left align-middle font-medium">Organization</th>
                  <th className="h-10 px-4 text-right align-middle font-medium">Consumed Credits</th>
                  <th className="h-10 px-4 text-right align-middle font-medium">Consumed Tokens</th>
                  <th className="h-10 px-4 text-right align-middle font-medium w-[100px]">Details</th>
                </tr>
              </thead>
              <tbody>
                {data.customers.slice(0, 5).map((customer: any, index: number) => (
                  <tr key={`top-customer-${customer.id}`} className="border-b">
                    <td className="p-4 align-middle font-medium">{index + 1}</td>
                    <td className="p-4 align-middle">
                      <div className="flex items-center gap-2">
                        <CustomerAvatar name={customer.name} />
                        {customer.name}
                      </div>
                    </td>
                    <td className="p-4 align-middle text-right">${customer.consumedCredits.toFixed(2)}</td>
                    <td className="p-4 align-middle text-right">{customer.consumedTokens.toLocaleString()}</td>
                    <td className="p-4 align-middle text-right">
                      <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3 py-2">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-2 text-xs text-muted-foreground text-right">
            {timeRange === '7d' ? 'Last 7 days' : 
             timeRange === '30d' ? 'Last 30 days' : 
             timeRange === '90d' ? 'Last 3 months' : 
             timeRange === '180d' ? 'Last 6 months' : 'Last year'}
          </div>
        </CardContent>
      </Card>
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
}

const MetricCard = ({ title, value, description, icon }: MetricCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

interface CustomerAvatarProps {
  name: string;
}

const CustomerAvatar = ({ name }: CustomerAvatarProps) => {
  // Real company logos
  const companyLogos: Record<string, string> = {
    'Gong': 'https://logo.clearbit.com/gong.io',
    'Slack': 'https://logo.clearbit.com/slack.com',
    'Microsoft': 'https://logo.clearbit.com/microsoft.com',
    'Apple': 'https://logo.clearbit.com/apple.com',
    'Google': 'https://logo.clearbit.com/google.com',
    'Amazon': 'https://logo.clearbit.com/amazon.com',
    'Netflix': 'https://logo.clearbit.com/netflix.com',
    'Spotify': 'https://logo.clearbit.com/spotify.com',
    'Adobe': 'https://logo.clearbit.com/adobe.com',
    'Acme Inc': 'https://ui-avatars.com/api/?name=Acme&background=0D8ABC&color=fff',
    'Dropbox': 'https://logo.clearbit.com/dropbox.com',
    'Airbnb': 'https://logo.clearbit.com/airbnb.com',
    'Uber': 'https://logo.clearbit.com/uber.com',
    'Salesforce': 'https://logo.clearbit.com/salesforce.com',
    'Twitter': 'https://logo.clearbit.com/twitter.com',
    'LinkedIn': 'https://logo.clearbit.com/linkedin.com',
    'Facebook': 'https://logo.clearbit.com/facebook.com',
    'IBM': 'https://logo.clearbit.com/ibm.com',
    'Oracle': 'https://logo.clearbit.com/oracle.com',
    'Intel': 'https://logo.clearbit.com/intel.com',
    'Cisco': 'https://logo.clearbit.com/cisco.com',
    'Tesla': 'https://logo.clearbit.com/tesla.com',
    'Shopify': 'https://logo.clearbit.com/shopify.com',
    'Zoom': 'https://logo.clearbit.com/zoom.us',
    'PayPal': 'https://logo.clearbit.com/paypal.com',
  };
  
  // Generate initials from the name as fallback
  const initials = name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
  
  // If we have a predefined logo, use it
  const logoUrl = companyLogos[name] || `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=random&color=fff`;
  
  return (
    <div className="flex h-8 w-8 items-center justify-center rounded-full overflow-hidden bg-muted">
      <img src={logoUrl} alt={name} className="h-full w-full object-cover" />
    </div>
  );
};