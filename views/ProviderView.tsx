import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProviderOverview } from "@/application/components/provider/ProviderOverview";
import { ProviderCustomers } from "@/application/components/provider/ProviderCustomers";
import { CustomerManageModal } from "@/application/components/modals/CustomerManageModal";
import { capitalize } from "@/application/utils/stringUtils";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

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

interface ProviderViewProps {
  provider: string;
}

export const ProviderView = ({ provider }: ProviderViewProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<boolean>(false);
  
  useEffect(() => {
    // Generate mock data when provider changes
    try {
      setLoading(true);
      setError(false);
      // Simulate API call with a small delay
      setTimeout(() => {
        const mockData = generateMockData(provider);
        setData(mockData);
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Error generating provider data:", err);
      setError(true);
      setLoading(false);
    }
  }, [provider]);
  
  const handleManageCustomer = (customerId: string) => {
    setSelectedCustomer(customerId);
    setManageModalOpen(true);
  };

  const getCustomerById = (id: string) => {
    return data?.customers.find((customer: any) => customer.id === id) || null;
  };

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      try {
        const mockData = generateMockData(provider);
        setData(mockData);
        setLoading(false);
      } catch (err) {
        console.error("Error retrying data generation:", err);
        setError(true);
        setLoading(false);
      }
    }, 500);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading {capitalize(provider)} data...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center h-full">
        <Alert className="max-w-md">
          <AlertTitle>Error loading provider data</AlertTitle>
          <AlertDescription>
            <p className="mb-4">Please try again later</p>
            <Button onClick={handleRetry} className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              <span>Retry</span>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ProviderLogo provider={provider} className="w-8 h-8" />
          <h1 className="text-3xl font-bold tracking-tight capitalize">{provider}</h1>
        </div>
      </div>

      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="space-y-4"
      >
        <TabsList className="bg-white border">
          <TabsTrigger 
            value="overview" 
            className={cn(
              "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
              "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
            )}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="customers" 
            className={cn(
              "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
              "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
            )}
          >
            Customers
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <ProviderOverview provider={provider} />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          <ProviderCustomers 
            provider={provider} 
            onManageCustomer={handleManageCustomer} 
          />
        </TabsContent>
      </Tabs>

      {selectedCustomer && (
        <CustomerManageModal
          customer={getCustomerById(selectedCustomer)}
          provider={provider}
          open={manageModalOpen}
          onOpenChange={setManageModalOpen}
        />
      )}
    </div>
  );
};