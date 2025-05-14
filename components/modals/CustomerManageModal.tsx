import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Clock, DollarSign, Link, LineChart } from "lucide-react";
import { useState } from "react";
import { CustomerUsageChart } from "@/application/components/charts/CustomerUsageChart";
import { capitalize } from "@/application/utils/stringUtils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface CustomerManageModalProps {
  customer: any;
  provider: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  multiProvider?: boolean;
  allProviderData?: Record<string, any>;
}

export const CustomerManageModal = ({ 
  customer, 
  provider, 
  open, 
  onOpenChange,
  multiProvider = false,
  allProviderData = {}
}: CustomerManageModalProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [dailyLimit, setDailyLimit] = useState(customer?.dailyLimit || 10000);
  const [monthlyLimit, setMonthlyLimit] = useState(customer?.monthlyLimit || 300000);

  if (!customer) return null;

  // Replace with real company name if using generic name
  const companyNames = [
    'Gong', 'Slack', 'Microsoft', 'Apple', 'Google', 
    'Amazon', 'Netflix', 'Spotify', 'Adobe', 'Acme Inc'
  ];
  
  // Assign a real company name based on ID (this would connect to real data in a real app)
  const customerNameIndex = parseInt(customer.id.split('-').pop() || '0') % companyNames.length;
  const customerName = companyNames[customerNameIndex];

  // Calculate total usage across all providers if multiProvider is true
  let totalCredits = customer.consumedCredits;
  let totalTokens = customer.consumedTokens;
  
  if (multiProvider && allProviderData) {
    totalCredits = Object.values(allProviderData).reduce((sum: number, providerData: any) => 
      sum + providerData.consumedCredits, 0);
    
    totalTokens = Object.values(allProviderData).reduce((sum: number, providerData: any) => 
      sum + providerData.consumedTokens, 0);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] flex flex-col">
        <DialogHeader className="flex flex-row items-center space-y-0 space-x-4">
          <div className="flex-shrink-0">
            <CustomerAvatar name={customerName} size="lg" />
          </div>
          <div className="flex-1">
            <DialogTitle className="text-2xl flex items-center gap-2">
              {customerName}
              <div className="flex items-center gap-1 text-sm font-normal text-muted-foreground">
                {multiProvider ? (
                  <div className="flex gap-1">
                    {Object.keys(allProviderData).map(providerKey => (
                      <ProviderLogo key={providerKey} provider={providerKey} className="w-4 h-4" />
                    ))}
                    <span>Multiple Providers</span>
                  </div>
                ) : (
                  <>
                    <ProviderLogo provider={provider} className="w-4 h-4" />
                    <span>{capitalize(provider)}</span>
                  </>
                )}
              </div>
            </DialogTitle>
            <DialogDescription>
              Customer usage details and management
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden flex flex-col"
        >
          <TabsList className="w-full justify-start mb-4 bg-white border">
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
              value="usage" 
              className={cn(
                "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
                "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
              )}
            >
              Usage Details
            </TabsTrigger>
            <TabsTrigger 
              value="limits" 
              className={cn(
                "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
                "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
              )}
            >
              Usage Limits
            </TabsTrigger>
            <TabsTrigger 
              value="embedding" 
              className={cn(
                "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
                "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
              )}
            >
              Embed Analytics
            </TabsTrigger>
          </TabsList>
          
          <div className="overflow-auto flex-1">
            <TabsContent value="overview" className="h-full">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Monthly Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${multiProvider ? 
                      (totalCredits * 1.5).toFixed(2) : 
                      customer.monthlyPayment.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">Current billing cycle</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Annual Payment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${multiProvider ? 
                      (totalCredits * 1.5 * 12).toFixed(2) : 
                      (customer.monthlyPayment * 12).toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">Projected annual</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Average Token Usage
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{multiProvider ? 
                      Math.round(totalTokens / 30).toLocaleString() : 
                      customer.averageTokenUsage.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground">Tokens per day</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="h-4 w-4" />
                      Average Cost
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${multiProvider ? 
                      (totalCredits / 30).toFixed(2) : 
                      customer.averageCost.toFixed(2)}
                    </div>
                    <p className="text-xs text-muted-foreground">Average daily cost</p>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>Daily Usage (Last 30 Days)</CardTitle>
                  <CardDescription>Token consumption over the past month</CardDescription>
                </CardHeader>
                <CardContent className="h-60">
                  <CustomerUsageChart customer={customer} timeframe="daily" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Usage (Last 6 Months)</CardTitle>
                  <CardDescription>Token consumption over the past 6 months</CardDescription>
                </CardHeader>
                <CardContent className="h-60">
                  <CustomerUsageChart customer={customer} timeframe="monthly" />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="usage" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Statistics</CardTitle>
                  <CardDescription>Detailed usage statistics for {customerName}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="font-medium mb-1">Current Period Usage</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>Total Tokens:</span>
                            <span className="font-medium">{multiProvider ? 
                              totalTokens.toLocaleString() : 
                              customer.consumedTokens.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Billed Amount:</span>
                            <span className="font-medium">${multiProvider ? 
                              totalCredits.toFixed(2) : 
                              customer.consumedCredits.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Average Cost per 1K Tokens:</span>
                            <span className="font-medium">
                              ${multiProvider ? 
                                (totalCredits / (totalTokens / 1000)).toFixed(4) : 
                                (customer.consumedCredits / (customer.consumedTokens / 1000)).toFixed(4)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-1">Usage Breakdown</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>Prompt Tokens:</span>
                            <span className="font-medium">
                              {multiProvider ? 
                                Math.round(totalTokens * 0.3).toLocaleString() : 
                                Math.round(customer.consumedTokens * 0.3).toLocaleString()} 
                              <span className="text-muted-foreground text-xs ml-1">(30%)</span>
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Completion Tokens:</span>
                            <span className="font-medium">
                              {multiProvider ? 
                                Math.round(totalTokens * 0.7).toLocaleString() : 
                                Math.round(customer.consumedTokens * 0.7).toLocaleString()} 
                              <span className="text-muted-foreground text-xs ml-1">(70%)</span>
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span>Average Response Time:</span>
                            <span className="font-medium">1.2s</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-1">Model Usage</h3>
                      <div className="grid grid-cols-4 gap-2">
                        <Card className="p-3">
                          <div className="text-xs text-muted-foreground">{capitalize(provider)}</div>
                          <div className="text-sm font-medium">gpt-4-turbo</div>
                          <div className="text-xs">{Math.round(customer.consumedTokens * 0.45).toLocaleString()} tokens</div>
                        </Card>
                        <Card className="p-3">
                          <div className="text-xs text-muted-foreground">{capitalize(provider)}</div>
                          <div className="text-sm font-medium">gpt-3.5-turbo</div>
                          <div className="text-xs">{Math.round(customer.consumedTokens * 0.35).toLocaleString()} tokens</div>
                        </Card>
                        <Card className="p-3">
                          <div className="text-xs text-muted-foreground">{capitalize(provider)}</div>
                          <div className="text-sm font-medium">text-embedding-3</div>
                          <div className="text-xs">{Math.round(customer.consumedTokens * 0.15).toLocaleString()} tokens</div>
                        </Card>
                        <Card className="p-3">
                          <div className="text-xs text-muted-foreground">{capitalize(provider)}</div>
                          <div className="text-sm font-medium">whisper</div>
                          <div className="text-xs">{Math.round(customer.consumedTokens * 0.05).toLocaleString()} tokens</div>
                        </Card>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Usage Reports</CardTitle>
                  <CardDescription>Generate and download detailed usage reports</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-center justify-center">
                    <Calendar className="h-10 w-10 mb-2 text-muted-foreground" />
                    <span>Current Month Report</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-center justify-center">
                    <LineChart className="h-10 w-10 mb-2 text-muted-foreground" />
                    <span>Usage Trend Analysis</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-4 px-4 flex flex-col items-center justify-center">
                    <DollarSign className="h-10 w-10 mb-2 text-muted-foreground" />
                    <span>Cost Breakdown</span>
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="limits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Usage Limits</CardTitle>
                  <CardDescription>Set usage limits for this customer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="daily-limit">Daily Token Limit</Label>
                    <div className="flex items-center gap-4">
                      <Input 
                        id="daily-limit"
                        type="number" 
                        value={dailyLimit}
                        onChange={(e) => setDailyLimit(parseInt(e.target.value))} 
                        min="1000"
                      />
                      <Button>Update</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Current usage: {multiProvider ? 
                        Math.round(totalTokens / 30).toLocaleString() : 
                        Math.round(customer.averageTokenUsage).toLocaleString()} tokens/day
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="monthly-limit">Monthly Token Limit</Label>
                    <div className="flex items-center gap-4">
                      <Input 
                        id="monthly-limit"
                        type="number" 
                        value={monthlyLimit}
                        onChange={(e) => setMonthlyLimit(parseInt(e.target.value))} 
                        min="10000"
                      />
                      <Button>Update</Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Current usage: ~{multiProvider ? 
                        totalTokens.toLocaleString() : 
                        Math.round(customer.averageTokenUsage * 30).toLocaleString()} tokens/month
                    </p>
                  </div>
                  
                  <div className="pt-4 space-y-2">
                    <h3 className="font-medium">Limit Actions</h3>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="notify" />
                        <label htmlFor="notify" className="text-sm">
                          Notify when usage reaches 80% of limit
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="pause" />
                        <label htmlFor="pause" className="text-sm">
                          Pause service when limit is reached
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="auto-increase" />
                        <label htmlFor="auto-increase" className="text-sm">
                          Automatically increase limit by 10% when reached
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Budget Controls</CardTitle>
                  <CardDescription>Set spending limits and alerts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="monthly-budget">Monthly Budget</Label>
                    <div className="flex gap-4">
                      <Input
                        id="monthly-budget"
                        type="number"
                        defaultValue={multiProvider ? 
                          Math.ceil(totalCredits * 1.5) : 
                          Math.ceil(customer.monthlyPayment)}
                        min="10"
                        placeholder="Enter monthly budget"
                      />
                      <Button>Set Budget</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Alert Thresholds</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="alert-50" defaultChecked />
                        <label htmlFor="alert-50" className="text-sm">
                          Alert at 50% of budget
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="alert-80" defaultChecked />
                        <label htmlFor="alert-80" className="text-sm">
                          Alert at 80% of budget
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="alert-100" defaultChecked />
                        <label htmlFor="alert-100" className="text-sm">
                          Alert at 100% of budget
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="embedding" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Embed Analytics</CardTitle>
                  <CardDescription>
                    Embed real-time usage analytics in your customer's dashboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Embeddable Link</h3>
                    <div className="flex items-center gap-2">
                      <Input 
                        readOnly 
                        value={`https://api.llm-tracker.com/embed/${multiProvider ? 'all' : provider}/${customer.id}`} 
                      />
                      <Button variant="outline" size="icon">
                        <Link className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Share this link with your customer to embed analytics.
                    </p>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Embed Code</h3>
                    <div className="bg-muted p-3 rounded-md overflow-x-auto">
                      <pre className="text-sm">
                        {`<iframe
  src="https://api.llm-tracker.com/embed/${multiProvider ? 'all' : provider}/${customer.id}"
  width="100%" 
  height="600" 
  frameborder="0">
</iframe>`}
                      </pre>
                    </div>
                    <Button variant="outline" className="mt-2">
                      Copy Code
                    </Button>
                  </div>
                  
                  <div className="pt-4">
                    <h3 className="font-medium mb-2">Customization</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="show-tokens" defaultChecked />
                        <label htmlFor="show-tokens" className="text-sm">
                          Show token usage
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="show-cost" defaultChecked />
                        <label htmlFor="show-cost" className="text-sm">
                          Show cost information
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="show-charts" defaultChecked />
                        <label htmlFor="show-charts" className="text-sm">
                          Show usage charts
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="show-limits" defaultChecked />
                        <label htmlFor="show-limits" className="text-sm">
                          Show usage limits
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>Preview of the embeddable analytics</CardDescription>
                </CardHeader>
                <CardContent className="h-96 p-0 overflow-hidden rounded-b-lg">
                  <div className="bg-white text-gray-900 h-full overflow-auto p-6">
                    <div className="max-w-5xl mx-auto">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <CustomerAvatar name={customerName} size="md" />
                          <div>
                            <h1 className="text-xl font-bold">{customerName} Analytics</h1>
                            <p className="text-sm text-gray-500">Powered by LLM Tracker</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {multiProvider ? (
                            <div className="flex gap-1 items-center">
                              <ProviderLogo provider="openai" className="w-5 h-5" />
                              <ProviderLogo provider="anthropic" className="w-5 h-5" />
                              <span className="text-sm font-medium">Multiple Providers</span>
                            </div>
                          ) : (
                            <>
                              <ProviderLogo provider={provider} className="w-5 h-5" />
                              <span className="text-sm font-medium capitalize">{provider}</span>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <MetricCardEmbed
                          title="Token Usage"
                          value={multiProvider ? totalTokens.toLocaleString() : customer.consumedTokens.toLocaleString()}
                          description="Total tokens consumed"
                        />
                        <MetricCardEmbed
                          title="Cost"
                          value={`$${multiProvider ? totalCredits.toFixed(2) : customer.consumedCredits.toFixed(2)}`}
                          description="Total cost"
                        />
                        <MetricCardEmbed
                          title="Daily Average"
                          value={multiProvider ? 
                            Math.round(totalTokens / 30).toLocaleString() : 
                            customer.averageTokenUsage.toLocaleString()}
                          description="Tokens per day"
                        />
                      </div>
                      
                      <div className="mb-6">
                        <div className="mb-2">
                          <h2 className="text-lg font-semibold">Usage Over Time</h2>
                          <p className="text-sm text-gray-500">Last 30 days</p>
                        </div>
                        <div className="bg-gray-50 rounded-lg p-4 h-64">
                          <CustomerUsageChart customer={customer} timeframe="daily" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        <div>
                          <div className="mb-2">
                            <h2 className="text-lg font-semibold">Usage Limits</h2>
                            <p className="text-sm text-gray-500">Current limits and usage</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">Daily Limit</span>
                                  <span className="text-sm">{customer.dailyLimit.toLocaleString()} tokens</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${Math.min(100, (customer.averageTokenUsage / customer.dailyLimit) * 100)}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                  <span>Current: {customer.averageTokenUsage.toLocaleString()} tokens</span>
                                  <span>{Math.round((customer.averageTokenUsage / customer.dailyLimit) * 100)}% used</span>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">Monthly Limit</span>
                                  <span className="text-sm">{customer.monthlyLimit.toLocaleString()} tokens</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div 
                                    className="bg-blue-600 h-2.5 rounded-full" 
                                    style={{ width: `${Math.min(100, ((customer.averageTokenUsage * 30) / customer.monthlyLimit) * 100)}%` }}
                                  ></div>
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-gray-500">
                                  <span>Current: {(customer.averageTokenUsage * 30).toLocaleString()} tokens</span>
                                  <span>{Math.round(((customer.averageTokenUsage * 30) / customer.monthlyLimit) * 100)}% used</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="mb-2">
                            <h2 className="text-lg font-semibold">Model Usage</h2>
                            <p className="text-sm text-gray-500">Distribution by model</p>
                          </div>
                          <div className="bg-gray-50 rounded-lg p-4 h-full flex flex-col justify-center">
                            <div className="space-y-3">
                              <ModelUsageBar 
                                model="gpt-4-turbo" 
                                percentage={45} 
                                tokens={Math.round(customer.consumedTokens * 0.45).toLocaleString()} 
                              />
                              <ModelUsageBar 
                                model="gpt-3.5-turbo" 
                                percentage={35} 
                                tokens={Math.round(customer.consumedTokens * 0.35).toLocaleString()} 
                              />
                              <ModelUsageBar 
                                model="text-embedding-3" 
                                percentage={15} 
                                tokens={Math.round(customer.consumedTokens * 0.15).toLocaleString()} 
                              />
                              <ModelUsageBar 
                                model="whisper" 
                                percentage={5} 
                                tokens={Math.round(customer.consumedTokens * 0.05).toLocaleString()} 
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center text-xs text-gray-400 pt-6 border-t border-gray-100">
                        Powered by LLM Tracker | Data updated 5 minutes ago
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

interface CustomerAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const CustomerAvatar = ({ name, size = "sm" }: CustomerAvatarProps) => {
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
  
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  }[size];
  
  return (
    <Avatar className={sizeClass}>
      <AvatarImage src={logoUrl} alt={name} />
      <AvatarFallback>{initials}</AvatarFallback>
    </Avatar>
  );
};

// Moved these components inside the file to avoid hooks errors
const MetricCardEmbed = ({ title, value, description }: { title: string, value: string, description: string }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="font-medium text-sm text-gray-600">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      <div className="text-xs text-gray-500 mt-1">{description}</div>
    </div>
  );
};

const ModelUsageBar = ({ model, percentage, tokens }: { model: string, percentage: number, tokens: string }) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium">{model}</span>
        <span className="text-sm">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <div className="text-xs text-gray-500 mt-1">{tokens} tokens</div>
    </div>
  );
};