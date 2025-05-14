import { useState } from "react";
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
import { Search, ChevronDown, Filter, Eye } from "lucide-react";
import { useProviderData } from "@/application/hooks/useProviderData";
import { capitalize } from "@/application/utils/stringUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";

interface ProviderCustomersProps {
  provider: string;
  onManageCustomer: (customerId: string) => void;
}

export const ProviderCustomers = ({ provider, onManageCustomer }: ProviderCustomersProps) => {
  const { data } = useProviderData(provider);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState<string>("consumedCredits");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  if (!data) {
    return <div>Loading...</div>;
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Filter and sort customers
  const filteredCustomers = data.customers
    .filter(customer => 
      customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const fieldA = a[sortField as keyof typeof a];
      const fieldB = b[sortField as keyof typeof b];
      
      if (fieldA < fieldB) return sortOrder === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <ProviderLogo provider={provider} className="w-6 h-6 mr-2" />
          <div>
            <CardTitle>Customers - {capitalize(provider)}</CardTitle>
            <CardDescription>
              Manage customers using {capitalize(provider)} models
            </CardDescription>
          </div>
        </div>
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setSortField("consumedCredits")}>
                  Sort by Credits
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortField("consumedTokens")}>
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
                  Organization {sortField === "name" && (sortOrder === "asc" ? "▲" : "▼")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-right"
                  onClick={() => handleSort("consumedCredits")}
                >
                  Consumed Credits {sortField === "consumedCredits" && (sortOrder === "asc" ? "▲" : "▼")}
                </TableHead>
                <TableHead 
                  className="cursor-pointer text-right"
                  onClick={() => handleSort("consumedTokens")}
                >
                  Consumed Tokens {sortField === "consumedTokens" && (sortOrder === "asc" ? "▲" : "▼")}
                </TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No customers found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer, index) => (
                  <TableRow key={`provider-customer-${customer.id}-${index}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <CustomerAvatar name={customer.name} />
                        {customer.name}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${customer.consumedCredits.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{customer.consumedTokens.toLocaleString()}</TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        onClick={() => onManageCustomer(customer.id)}
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