import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, ArrowRight, Trash2, PenLine, Briefcase, Building2, User, DollarSign, Percent, Copy, CheckCircle2, Info, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calculator as CalculatorType, ProviderConfig } from "@/application/views/CalculatorsView";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProviderPricingDetail } from "@/application/components/calculators/ProviderPricingDetail";
import { EditCalculatorForm } from "@/application/components/calculators/EditCalculatorForm";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface CalculatorDetailProps {
  calculator: CalculatorType;
  onUpdate: (calculator: CalculatorType) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

export const CalculatorDetail = ({ calculator, onUpdate, onDelete, onBack }: CalculatorDetailProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("summary");
  const [activeProvider, setActiveProvider] = useState<string | null>(
    calculator.providers.length > 0 ? calculator.providers[0].id : null
  );
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Get the type icon
  const getTypeIcon = () => {
    switch (calculator.type) {
      case "service":
        return <Briefcase className="h-5 w-5" />;
      case "organization":
        return <Building2 className="h-5 w-5" />;
      case "user":
        return <User className="h-5 w-5" />;
      default:
        return <Calculator className="h-5 w-5" />;
    }
  };

  // Get the type label
  const getTypeLabel = () => {
    switch (calculator.type) {
      case "service":
        return "Service Level";
      case "organization":
        return "Organization Level";
      case "user":
        return "User Level";
      default:
        return "Unknown";
    }
  };

  // Get the type description
  const getTypeDescription = () => {
    switch (calculator.type) {
      case "service":
        return "In this model, LLM costs are bundled into your service pricing. End customers are not charged based on credits.";
      case "organization":
        return "Credits are allocated at the organization level. Consumption is tracked across all users within the organization.";
      case "user":
        return "Credits are allocated to individual users. Consumption is tracked separately for each user.";
      default:
        return "";
    }
  };

  // Calculate the average profit percentage across all providers
  const averageProfitPercentage = calculator.providers.length > 0
    ? calculator.providers.reduce((sum, provider) => sum + provider.profitPercentage, 0) / calculator.providers.length
    : 0;

  // Calculate the average credit mapping across all providers
  const averageCreditMapping = calculator.providers.length > 0
    ? calculator.providers.reduce((sum, provider) => sum + provider.creditMapping, 0) / calculator.providers.length
    : 0;

  // Calculate the overall pricing
  const calculateOverallPricing = () => {
    if (calculator.providers.length === 0) return { toPay: 0, toCharge: 0, profit: 0, profitPercentage: 0 };

    // This is a simplified calculation for demonstration
    // In a real app, this would be more complex based on actual provider pricing
    let totalToPay = 0;
    let totalToCharge = 0;

    calculator.providers.forEach(provider => {
      // Simplified calculation based on credit mapping
      // Lower credit mapping means higher profit
      const baseCost = 0.002; // Base cost per 1000 tokens in dollars
      const toPay = baseCost;
      const toCharge = toPay * (1 + provider.profitPercentage / 100);
      
      totalToPay += toPay;
      totalToCharge += toCharge;
    });

    const avgToPay = totalToPay / calculator.providers.length;
    const avgToCharge = totalToCharge / calculator.providers.length;
    const profit = avgToCharge - avgToPay;
    const profitPercentage = (profit / avgToPay) * 100;

    return {
      toPay: avgToPay,
      toCharge: avgToCharge,
      profit,
      profitPercentage
    };
  };

  const pricing = calculateOverallPricing();

  // Handle copying calculator details
  const handleCopy = () => {
    const details = `
Calculator: ${calculator.name}
Type: ${getTypeLabel()}
Providers: ${calculator.providers.map(p => p.name).join(", ")}
Average Profit: ${averageProfitPercentage.toFixed(1)}%
    `;
    
    navigator.clipboard.writeText(details.trim());
    setCopied(true);
    
    toast({
      title: "Copied to clipboard",
      description: "Calculator details have been copied to clipboard."
    });
    
    setTimeout(() => setCopied(false), 2000);
  };

  // Handle updating the calculator
  const handleUpdate = (updatedCalculator: CalculatorType) => {
    onUpdate(updatedCalculator);
    setIsEditing(false);
  };

  // Render content based on state
  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Calculator</CardTitle>
          <CardDescription>
            Update your pricing calculator configuration
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EditCalculatorForm 
            calculator={calculator}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowRight className="h-4 w-4 rotate-180" />
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">{calculator.name}</h2>
          <Badge variant="outline" className="ml-2 flex items-center gap-1">
            {getTypeIcon()}
            <span>{getTypeLabel()}</span>
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleCopy}>
            {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsEditing(true)}>
            <PenLine className="h-4 w-4" />
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Calculator</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this calculator? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>Cancel</Button>
                <Button variant="destructive" onClick={() => onDelete(calculator.id)}>Delete</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>About {getTypeLabel()} Pricing</AlertTitle>
        <AlertDescription>
          {getTypeDescription()}
        </AlertDescription>
      </Alert>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Price to Pay</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pricing.toPay.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground">Per 1000 tokens (average)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Price to Charge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${pricing.toCharge.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground">Per 1000 tokens (average)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${pricing.profit.toFixed(4)}</div>
            <p className="text-xs text-muted-foreground">Per 1000 tokens (average)</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Profit Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{pricing.profitPercentage.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Average across all providers</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Calculator Details</CardTitle>
          <CardDescription>{calculator.description}</CardDescription>
        </CardHeader>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
          <div className="px-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="providers">Providers</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="summary" className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Overview</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium mb-1">Calculator Type</div>
                    <div className="flex items-center gap-1">
                      {getTypeIcon()}
                      <span>{getTypeLabel()}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Created</div>
                    <div>{formatDistanceToNow(new Date(calculator.createdAt), { addSuffix: true })}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Last Updated</div>
                    <div>{formatDistanceToNow(new Date(calculator.updatedAt), { addSuffix: true })}</div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Providers</div>
                    <div className="flex flex-wrap gap-1">
                      {calculator.providers.map((provider) => (
                        <div key={provider.id} className="flex items-center bg-muted rounded-full px-2 py-1">
                          <ProviderLogo provider={provider.id} className="h-4 w-4 mr-1" />
                          <span className="text-xs">{provider.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-2">Pricing Configuration</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <div className="text-sm font-medium mb-1">Average Credit Mapping</div>
                    <div className="flex items-center">
                      <span className="font-bold">{averageCreditMapping.toFixed(0)} credits</span>
                      <span className="text-xs text-muted-foreground ml-2">per 1000 tokens</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Average Profit</div>
                    <div className="flex items-center text-green-600">
                      <Percent className="h-4 w-4 mr-1" />
                      <span className="font-bold">{averageProfitPercentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Price to Pay</div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="font-bold">${pricing.toPay.toFixed(4)}</span>
                      <span className="text-xs text-muted-foreground ml-2">per 1000 tokens</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm font-medium mb-1">Price to Charge</div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span className="font-bold">${pricing.toCharge.toFixed(4)}</span>
                      <span className="text-xs text-muted-foreground ml-2">per 1000 tokens</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {calculator.type === "user" && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-2">User-Level Tracking</h3>
                    <p className="text-muted-foreground">
                      This calculator tracks consumption at the user level. Each user will be allocated their own credits,
                      and usage will be tracked individually.
                    </p>
                  </div>
                </>
              )}
              
              {calculator.type === "organization" && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Organization-Level Tracking</h3>
                    <p className="text-muted-foreground">
                      This calculator tracks consumption at the organization level. Credits are shared across all users
                      within the organization.
                    </p>
                  </div>
                </>
              )}
              
              {calculator.type === "service" && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium mb-2">Service-Level Pricing</h3>
                    <p className="text-muted-foreground">
                      This calculator is designed for service-level pricing. LLM costs are bundled into your service pricing,
                      and end customers are not charged based on credits.
                    </p>
                  </div>
                </>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="providers" className="p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {calculator.providers.map((provider) => (
                  <Button
                    key={provider.id}
                    variant={activeProvider === provider.id ? "default" : "outline"}
                    className="flex items-center gap-2"
                    onClick={() => setActiveProvider(provider.id)}
                  >
                    <ProviderLogo provider={provider.id} className="h-4 w-4" />
                    <span>{provider.name}</span>
                  </Button>
                ))}
              </div>
              
              <Separator />
              
              {activeProvider && (
                <ProviderDetail 
                  provider={calculator.providers.find(p => p.id === activeProvider)!}
                  calculatorType={calculator.type}
                />
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="pricing" className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Pricing Breakdown</h3>
                <p className="text-muted-foreground mb-4">
                  Detailed pricing breakdown for each provider and model in this calculator.
                </p>
                
                {calculator.providers.map((provider) => (
                  <div key={provider.id} className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                      <ProviderLogo provider={provider.id} className="h-5 w-5" />
                      <h4 className="text-md font-medium">{provider.name}</h4>
                    </div>
                    
                    <ProviderPricingDetail 
                      provider={provider}
                      calculatorType={calculator.type}
                    />
                    
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-2">Overall Pricing</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Price to Pay</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${pricing.toPay.toFixed(4)}</div>
                      <p className="text-xs text-muted-foreground">Per 1000 tokens (average)</p>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Price to Charge</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">${pricing.toCharge.toFixed(4)}</div>
                      <p className="text-xs text-muted-foreground">Per 1000 tokens (average)</p>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <h4 className="text-md font-medium text-green-800">Profit Analysis</h4>
                  </div>
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <div className="text-sm font-medium text-green-800 mb-1">Profit per 1000 tokens</div>
                      <div className="text-xl font-bold text-green-600">${pricing.profit.toFixed(4)}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm font-medium text-green-800 mb-1">Profit Percentage</div>
                      <div className="text-xl font-bold text-green-600">{pricing.profitPercentage.toFixed(1)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

interface ProviderDetailProps {
  provider: ProviderConfig;
  calculatorType: CalculatorType["type"];
}

const ProviderDetail = ({ provider, calculatorType }: ProviderDetailProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">
          <span className="flex items-center gap-2">
            <ProviderLogo provider={provider.id} className="h-5 w-5" />
            {provider.name}
          </span>
        </h3>
        
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm font-medium mb-1">Credit Mapping</div>
            <div className="flex items-center">
              <span className="font-bold">{provider.creditMapping} credits</span>
              <span className="text-xs text-muted-foreground ml-2">per 1000 tokens</span>
            </div>
          </div>
          
          <div>
            <div className="text-sm font-medium mb-1">Profit Percentage</div>
            <div className="flex items-center text-green-600">
              <Percent className="h-4 w-4 mr-1" />
              <span className="font-bold">{provider.profitPercentage}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-md font-medium mb-2">Model Distribution</h3>
        <div className="space-y-3">
          {provider.models.map((model) => (
            <div key={model.model} className="space-y-1">
              <div className="flex justify-between items-center">
                <div className="font-medium">{model.model}</div>
                <div className="text-sm">{model.percentage}%</div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary rounded-full h-2" 
                  style={{ width: `${model.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div>
        <h3 className="text-md font-medium mb-2">Token Distribution</h3>
        <div className="space-y-4">
          {provider.models.map((modelDist) => (
            <div key={modelDist.model}>
              <div className="text-sm font-medium mb-2">{modelDist.model}</div>
              <div className="space-y-3">
                {provider.tokenDistributions[modelDist.model]?.map((token) => (
                  <div key={token.type} className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="capitalize">{token.type} Tokens</div>
                      <div className="text-sm">{token.percentage}%</div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={cn(
                          "rounded-full h-2",
                          token.type === "input" ? "bg-blue-500" : 
                          token.type === "output" ? "bg-green-500" : 
                          "bg-amber-500"
                        )}
                        style={{ width: `${token.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {calculatorType === "user" && (
        <>
          <Separator />
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>User-Level Tracking</AlertTitle>
            <AlertDescription>
              This provider's usage will be tracked at the user level. Each user will be allocated their own credits.
            </AlertDescription>
          </Alert>
        </>
      )}
      
      {calculatorType === "organization" && (
        <>
          <Separator />
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Organization-Level Tracking</AlertTitle>
            <AlertDescription>
              This provider's usage will be tracked at the organization level. Credits are shared across all users.
            </AlertDescription>
          </Alert>
        </>
      )}
      
      {calculatorType === "service" && (
        <>
          <Separator />
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Service-Level Pricing</AlertTitle>
            <AlertDescription>
              This provider's costs are bundled into your service pricing. End customers are not charged based on credits.
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  );
};