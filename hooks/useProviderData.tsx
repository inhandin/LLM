import { useQuery } from "react-query";
import { useState, useEffect } from "react";

// List of real company names to use instead of generic ones
const COMPANY_NAMES = [
  'Gong', 'Slack', 'Microsoft', 'Apple', 'Google', 
  'Amazon', 'Netflix', 'Spotify', 'Adobe', 'Acme Inc',
  'Dropbox', 'Airbnb', 'Uber', 'Salesforce', 'Twitter',
  'LinkedIn', 'Facebook', 'IBM', 'Oracle', 'Intel',
  'Cisco', 'Tesla', 'Shopify', 'Zoom', 'PayPal'
];

interface ProviderFactors {
  credits: number;
  tokens: number;
  customers: number;
}

interface CustomerData {
  id: string;
  name: string;
  consumedCredits: number;
  consumedTokens: number;
  monthlyPayment: number;
  averageTokenUsage: number;
  averageCost: number;
  dailyLimit: number;
  monthlyLimit: number;
}

interface ProviderData {
  availableCredits: number;
  consumedCredits: number;
  totalTokens: number;
  consumedTokens: number;
  averageSpentPerCustomer: number;
  customers: CustomerData[];
}

// Mock data generator for each provider
const generateMockData = (provider: string): ProviderData => {
  const PROVIDER_FACTORS: Record<string, ProviderFactors> = {
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
  const customers: CustomerData[] = [];
  
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

export const useProviderData = (provider: string) => {
  const [mockData, setMockData] = useState<ProviderData | null>(null);
  
  useEffect(() => {
    // Generate mock data when provider changes
    try {
      // Ensure provider is a valid string
      const validProvider = typeof provider === 'string' && provider.trim() !== '' 
        ? provider.toLowerCase() 
        : 'openai';
      
      const data = generateMockData(validProvider);
      setMockData(data);
    } catch (error) {
      console.error("Error generating mock data:", error);
      // Provide fallback data instead of null
      const fallbackData = generateMockData('openai');
      setMockData(fallbackData);
    }
  }, [provider]);

  return useQuery<ProviderData, Error>(
    ['provider', provider],
    () => {
      if (!mockData) {
        // If mockData is null, generate it on the fly
        return Promise.resolve(generateMockData(provider));
      }
      return Promise.resolve(mockData);
    },
    {
      initialData: mockData,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: 1,
      onError: (error) => {
        console.error(`Error fetching provider data for ${provider}:`, error);
      }
    }
  );
};