import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useProviderData } from "@/application/hooks/useProviderData";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";
import { capitalize } from "@/application/utils/stringUtils";

interface TopCustomersTableProps {
  provider?: string;
  global?: boolean;
  timeRange?: string;
}

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

// Assign real company names to customers (this would connect to real data in a real app)
const companyNames = [
  'Gong', 'Slack', 'Microsoft', 'Apple', 'Google', 
  'Amazon', 'Netflix', 'Spotify', 'Adobe', 'Acme Inc',
  'Dropbox', 'Airbnb', 'Uber', 'Salesforce', 'Twitter',
  'LinkedIn', 'Facebook', 'IBM', 'Oracle', 'Intel',
  'Cisco', 'Tesla', 'Shopify', 'Zoom', 'PayPal'
];

export const TopCustomersTable = ({ provider, global = false, timeRange = "30d" }: TopCustomersTableProps) => {
  let topCustomers: any[] = [];
  
  if (global) {
    // Create combined list of top customers across providers
    const providersList = ['openai', 'anthropic', 'gemini', 'llama'];
    const allCustomers: Record<string, any> = {};
    
    providersList.forEach(p => {
      const { data } = useProviderData(p);
      if (data) {
        data.customers.forEach(customer => {
          if (allCustomers[customer.id]) {
            allCustomers[customer.id].consumedCredits += customer.consumedCredits;
            allCustomers[customer.id].consumedTokens += customer.consumedTokens;
          } else {
            allCustomers[customer.id] = { ...customer, provider: p };
          }
        });
      }
    });
    
    topCustomers = Object.values(allCustomers)
      .sort((a, b) => b.consumedCredits - a.consumedCredits)
      .slice(0, 10);
  } else if (provider) {
    const { data } = useProviderData(provider);
    topCustomers = data?.customers
      .sort((a, b) => b.consumedCredits - a.consumedCredits)
      .slice(0, 5) || [];
  }

  const getTimeRangeText = () => {
    switch (timeRange) {
      case '7d': return 'Last 7 days';
      case '30d': return 'Last 30 days';
      case '90d': return 'Last 3 months';
      case '180d': return 'Last 6 months';
      case '365d': return 'Last year';
      default: return 'Last 30 days';
    }
  };

  // Assign real company names to customers
  topCustomers = topCustomers.map((customer, index) => ({
    ...customer,
    name: companyNames[index % companyNames.length]
  }));

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Organization</TableHead>
              {global && <TableHead>Top Provider</TableHead>}
              <TableHead className="text-right">Consumed Credits</TableHead>
              <TableHead className="text-right">Consumed Tokens</TableHead>
              {!global && <TableHead className="text-right">Details</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {topCustomers.map((customer, index) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CustomerAvatar name={customer.name} />
                    {customer.name}
                  </div>
                </TableCell>
                {global && (
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider={customer.provider} className="w-4 h-4" />
                      <span className="capitalize">{customer.provider}</span>
                    </div>
                  </TableCell>
                )}
                <TableCell className="text-right">${customer.consumedCredits.toFixed(2)}</TableCell>
                <TableCell className="text-right">{customer.consumedTokens.toLocaleString()}</TableCell>
                {!global && (
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="space-x-1">
                      <span>View</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-2 text-xs text-muted-foreground text-right">
        {getTimeRangeText()}
      </div>
    </div>
  );
};

interface CustomerAvatarProps {
  name: string;
}

const CustomerAvatar = ({ name }: CustomerAvatarProps) => {
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
    <Avatar className="h-8 w-8">
      <AvatarImage src={logoUrl} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};