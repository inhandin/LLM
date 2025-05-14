import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DollarSign, Percent } from "lucide-react";
import { ProviderConfig, CalculatorType } from "@/application/views/CalculatorsView";
import { cn } from "@/lib/utils";

interface ProviderPricingDetailProps {
  provider: ProviderConfig;
  calculatorType: CalculatorType;
}

export const ProviderPricingDetail = ({ provider, calculatorType }: ProviderPricingDetailProps) => {
  const [activeModel, setActiveModel] = useState<string>(provider.models[0]?.model || "");

  // Calculate pricing for a specific model and token type
  const calculateTokenPricing = (model: string, tokenType: string) => {
    // This is a simplified calculation for demonstration
    // In a real app, this would use actual provider pricing data
    
    // Base costs per 1000 tokens (example values)
    const baseCosts: Record<string, Record<string, number>> = {
      "GPT-4.1": { "input": 0.002, "output": 0.008, "cached": 0.0005 },
      "GPT-4.1 mini": { "input": 0.0015, "output": 0.006, "cached": 0.0004 },
      "GPT-4.1 nano": { "input": 0.001, "output": 0.004, "cached": 0.0003 },
      "GPT-3.5 Turbo": { "input": 0.0005, "output": 0.0015, "cached": 0.0001 },
      "Claude 3 Opus": { "input": 0.0025, "output": 0.0075, "cached": 0 },
      "Claude 3 Sonnet": { "input": 0.0015, "output": 0.005, "cached": 0 },
      "Claude 3 Haiku": { "input": 0.0008, "output": 0.0024, "cached": 0 }
    };
    
    // Default to GPT-3.5 Turbo pricing if model not found
    const modelCosts = baseCosts[model] || baseCosts["GPT-3.5 Turbo"];
    
    // Default to input pricing if token type not found
    const baseCost = modelCosts[tokenType] || modelCosts["input"];
    
    // Calculate price to pay
    const priceToPay = baseCost;
    
    // Calculate price to charge based on profit percentage
    const priceToCharge = priceToPay * (1 + provider.profitPercentage / 100);
    
    // Calculate profit
    const profit = priceToCharge - priceToPay;
    
    return {
      priceToPay,
      priceToCharge,
      profit,
      profitPercentage: provider.profitPercentage
    };
  };

  // Calculate the overall pricing for a model
  const calculateModelPricing = (model: string) => {
    const tokenDistributions = provider.tokenDistributions[model] || [];
    
    if (tokenDistributions.length === 0) {
      return {
        priceToPay: 0,
        priceToCharge: 0,
        profit: 0,
        profitPercentage: 0
      };
    }
    
    let weightedPriceToPay = 0;
    let weightedPriceToCharge = 0;
    
    tokenDistributions.forEach(dist => {
      const pricing = calculateTokenPricing(model, dist.type);
      weightedPriceToPay += pricing.priceToPay * (dist.percentage / 100);
      weightedPriceToCharge += pricing.priceToCharge * (dist.percentage / 100);
    });
    
    const profit = weightedPriceToCharge - weightedPriceToPay;
    const profitPercentage = (profit / weightedPriceToPay) * 100;
    
    return {
      priceToPay: weightedPriceToPay,
      priceToCharge: weightedPriceToCharge,
      profit,
      profitPercentage
    };
  };

  // Calculate the overall pricing for the provider
  const calculateProviderPricing = () => {
    const models = provider.models;
    
    if (models.length === 0) {
      return {
        priceToPay: 0,
        priceToCharge: 0,
        profit: 0,
        profitPercentage: 0
      };
    }
    
    let weightedPriceToPay = 0;
    let weightedPriceToCharge = 0;
    
    models.forEach(modelDist => {
      const pricing = calculateModelPricing(modelDist.model);
      weightedPriceToPay += pricing.priceToPay * (modelDist.percentage / 100);
      weightedPriceToCharge += pricing.priceToCharge * (modelDist.percentage / 100);
    });
    
    const profit = weightedPriceToCharge - weightedPriceToPay;
    const profitPercentage = (profit / weightedPriceToPay) * 100;
    
    return {
      priceToPay: weightedPriceToPay,
      priceToCharge: weightedPriceToCharge,
      profit,
      profitPercentage
    };
  };

  const providerPricing = calculateProviderPricing();

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-1">Price to Pay</div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="text-xl font-bold">${providerPricing.priceToPay.toFixed(4)}</span>
              <span className="text-xs text-muted-foreground ml-2">per 1000 tokens</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-sm font-medium mb-1">Price to Charge</div>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="text-xl font-bold">${providerPricing.priceToCharge.toFixed(4)}</span>
              <span className="text-xs text-muted-foreground ml-2">per 1000 tokens</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <div className="text-sm font-medium text-green-800 mb-1">Profit per 1000 tokens</div>
            <div className="text-xl font-bold text-green-600">${providerPricing.profit.toFixed(4)}</div>
          </div>
          
          <div>
            <div className="text-sm font-medium text-green-800 mb-1">Profit Percentage</div>
            <div className="flex items-center text-green-600">
              <Percent className="h-4 w-4 mr-1" />
              <span className="text-xl font-bold">{providerPricing.profitPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="text-md font-medium mb-2">Model Breakdown</h4>
        
        <Tabs 
          defaultValue={activeModel} 
          onValueChange={setActiveModel}
          className="w-full"
        >
          <TabsList className="w-full grid" style={{ gridTemplateColumns: `repeat(${provider.models.length}, 1fr)` }}>
            {provider.models.map((model) => (
              <TabsTrigger key={model.model} value={model.model}>
                {model.model}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {provider.models.map((model) => (
            <TabsContent key={model.model} value={model.model} className="pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Model usage: {model.percentage}%</span>
                </div>
                
                <div className="space-y-4">
                  {provider.tokenDistributions[model.model]?.map((token) => {
                    const tokenPricing = calculateTokenPricing(model.model, token.type);
                    
                    return (
                      <div key={token.type} className="border rounded-md p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium capitalize">{token.type} Tokens</div>
                          <div className="text-sm">{token.percentage}%</div>
                        </div>
                        
                        <div className="w-full bg-muted rounded-full h-2 mb-4">
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
                        
                        <div className="grid gap-2 md:grid-cols-2">
                          <div>
                            <div className="text-xs text-muted-foreground">Price to Pay</div>
                            <div className="font-medium">${tokenPricing.priceToPay.toFixed(4)}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground">Price to Charge</div>
                            <div className="font-medium">${tokenPricing.priceToCharge.toFixed(4)}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground">Profit</div>
                            <div className="font-medium text-green-600">${tokenPricing.profit.toFixed(4)}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground">Profit Percentage</div>
                            <div className="font-medium text-green-600">{tokenPricing.profitPercentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="p-4 bg-muted rounded-md">
                  <div className="text-sm font-medium mb-2">Model Summary</div>
                  
                  <div className="grid gap-2 md:grid-cols-2">
                    {(() => {
                      const modelPricing = calculateModelPricing(model.model);
                      
                      return (
                        <>
                          <div>
                            <div className="text-xs text-muted-foreground">Price to Pay</div>
                            <div className="font-medium">${modelPricing.priceToPay.toFixed(4)}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground">Price to Charge</div>
                            <div className="font-medium">${modelPricing.priceToCharge.toFixed(4)}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground">Profit</div>
                            <div className="font-medium text-green-600">${modelPricing.profit.toFixed(4)}</div>
                          </div>
                          
                          <div>
                            <div className="text-xs text-muted-foreground">Profit Percentage</div>
                            <div className="font-medium text-green-600">{modelPricing.profitPercentage.toFixed(1)}%</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};