import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Search, ChevronDown, Filter, Eye, Download, ArrowUpDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";
import { CustomerManageModal } from "@/application/components/modals/CustomerManageModal";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

export const CustomersView = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("consumedCredits");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [manageModalOpen, setManageModalOpen] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [allCustomers, setAllCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Generate mock data for all providers
    const loadAllCustomers = () => {
      setLoading(true);
      
      try {
        const providersList = ['openai', 'anthropic', 'gemini', 'llama'];
        const combinedCustomers: Record<string, any> = {};
        
        // Generate data for each provider
        providersList.forEach(provider => {
          const providerData = generateMockData(provider);
          
          providerData.customers.forEach(customer => {
            if (combinedCustomers[customer.name]) {
              // If customer already exists, add this provider
              combinedCustomers[customer.name].providers.push(provider);
              combinedCustomers[customer.name].totalConsumedCredits += customer.consumedCredits;
              combinedCustomers[customer.name].totalConsumedTokens += customer.consumedTokens;
              combinedCustomers[customer.name].providerData[provider] = customer;
            } else {
              // Create new customer entry
              combinedCustomers[customer.name] = {
                id: customer.id,
                name: customer.name,
                providers: [provider],
                totalConsumedCredits: customer.consumedCredits,
                totalConsumedTokens: customer.consumedTokens,
                lastActive: ["Today", "Yesterday", "3 days ago", "Last week"][Math.floor(Math.random() * 4)],
                status: Math.random() > 0.2 ? "active" : "inactive",
                providerData: {
                  [provider]: customer
                }
              };
            }
          });
        });
        
        // Convert to array and sort
        const customersArray = Object.values(combinedCustomers);
        setAllCustomers(customersArray);
        setLoading(false);
      } catch (error) {
        console.error("Error generating customer data:", error);
        setAllCustomers([]);
        setLoading(false);
      }
    };
    
    loadAllCustomers();
  }, []);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };
  
  const handleManageCustomer = (customer: any) => {
    setSelectedCustomer(customer);
    setManageModalOpen(true);
  };

  // Filter and sort customers
  let filteredCustomers = allCustomers
    .filter(customer => 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedProvider === "all" || customer.providers.includes(selectedProvider))
    )
    .sort((a, b) => {
      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];
      
      if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
        <Button>
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>All Customers</CardTitle>
          <CardDescription>
            View and manage all customers across LLM providers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 w-full max-w-sm">
              <div className="relative w-full">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search customers..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Providers</SelectItem>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="gemini">Gemini</SelectItem>
                  <SelectItem value="llama">Llama</SelectItem>
                </SelectContent>
              </Select>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter</span>
                    <ChevronDown className="h-4 w-4 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSortField("totalConsumedCredits")}>
                    Sort by Credits
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortField("totalConsumedTokens")}>
                    Sort by Tokens
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortField("name")}>
                    Sort by Name
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Organization
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Providers</TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("totalConsumedCredits")}
                  >
                    <div className="flex items-center justify-end">
                      Total Credits
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("totalConsumedTokens")}
                  >
                    <div className="flex items-center justify-end">
                      Total Tokens
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                        <span>Loading customers...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredCustomers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No customers found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCustomers.map((customer, index) => (
                    <TableRow key={`customer-row-${customer.id}-${index}`}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <CustomerAvatar name={customer.name} />
                          {customer.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {customer.providers.map((provider: string, providerIndex: number) => (
                            <ProviderLogo key={`provider-logo-${customer.id}-${provider}-${providerIndex}`} provider={provider} className="w-5 h-5" />
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">${customer.totalConsumedCredits.toFixed(2)}</TableCell>
                      <TableCell className="text-right">{customer.totalConsumedTokens.toLocaleString()}</TableCell>
                      <TableCell>{customer.lastActive}</TableCell>
                      <TableCell>
                        <Badge variant={customer.status === "active" ? "success" : "secondary"}>
                          {customer.status === "active" ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          onClick={() => handleManageCustomer(customer)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          <span>Manage</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      {selectedCustomer && (
        <CustomerManageModal
          customer={selectedCustomer.providerData[selectedCustomer.providers[0]]}
          provider={selectedCustomer.providers[0]}
          open={manageModalOpen}
          onOpenChange={setManageModalOpen}
          multiProvider={selectedCustomer.providers.length > 1}
          allProviderData={selectedCustomer.providerData}
        />
      )}
    </div>
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
    <Avatar className="h-8 w-8">
      <AvatarImage src={logoUrl} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};