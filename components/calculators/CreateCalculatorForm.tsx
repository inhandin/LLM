import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Briefcase, Building2, User, AlertCircle, Info, ArrowRight, PlusCircle, Trash2, Percent, Zap } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";
import { Slider } from "@/components/ui/slider";
import { Calculator, CalculatorType, ProviderConfig, ModelDistribution, TokenDistribution } from "@/application/views/CalculatorsView";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CreateCalculatorFormProps {
  onSubmit: (calculator: Omit<Calculator, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

// Mock data for available providers
const availableProviders = [
  { id: "openai", name: "OpenAI", integrated: true },
  { id: "anthropic", name: "Anthropic", integrated: true },
  { id: "gemini", name: "Google Gemini", integrated: true },
  { id: "llama", name: "Meta Llama", integrated: true },
  { id: "mistral", name: "Mistral AI", integrated: false },
  { id: "cohere", name: "Cohere", integrated: false }
];

// Mock data for provider models
const providerModels: Record<string, string[]> = {
  "openai": ["GPT-4.1", "GPT-4.1 mini", "GPT-4.1 nano", "GPT-3.5 Turbo"],
  "anthropic": ["Claude 3 Opus", "Claude 3 Sonnet", "Claude 3 Haiku"],
  "gemini": ["Gemini Pro", "Gemini Ultra", "Gemini Nano"],
  "llama": ["Llama 3 70B", "Llama 3 8B", "Llama 2"]
};

// Mock data for token types by provider
const tokenTypes: Record<string, string[]> = {
  "openai": ["input", "output", "cached"],
  "anthropic": ["input", "output"],
  "gemini": ["input", "output"],
  "llama": ["input", "output"]
};

export const CreateCalculatorForm = ({ onSubmit, onCancel }: CreateCalculatorFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<CalculatorType>("service");
  const [selectedProviders, setSelectedProviders] = useState<ProviderConfig[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle adding a provider
  const handleAddProvider = (providerId: string) => {
    const provider = availableProviders.find(p => p.id === providerId);
    
    if (!provider) return;
    
    if (!provider.integrated) {
      setErrors({ provider: "This provider is not integrated. Please integrate it first." });
      return;
    }
    
    if (selectedProviders.some(p => p.id === providerId)) {
      setErrors({ provider: "This provider is already added." });
      return;
    }
    
    // Get models for this provider
    const models = providerModels[providerId] || [];
    
    // Create default model distribution
    const modelDistributions: ModelDistribution[] = models.map((model, index) => ({
      model,
      percentage: index === 0 ? 100 : 0
    }));
    
    // Create default token distributions for each model
    const tokenDists: Record<string, TokenDistribution[]> = {};
    
    models.forEach(model => {
      const types = tokenTypes[providerId] || ["input", "output"];
      
      tokenDists[model] = types.map((type, index) => ({
        type,
        percentage: 100 / types.length
      }));
    });
    
    const newProvider: ProviderConfig = {
      id: providerId,
      name: provider.name,
      models: modelDistributions,
      tokenDistributions: tokenDists,
      creditMapping: 500, // Default value
      profitPercentage: 0 // Default value
    };
    
    setSelectedProviders([...selectedProviders, newProvider]);
    setErrors({});
  };

  // Handle removing a provider
  const handleRemoveProvider = (providerId: string) => {
    setSelectedProviders(selectedProviders.filter(p => p.id !== providerId));
  };

  // Handle updating a provider's configuration
  const handleUpdateProvider = (updatedProvider: ProviderConfig) => {
    setSelectedProviders(selectedProviders.map(p => 
      p.id === updatedProvider.id ? updatedProvider : p
    ));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!description.trim()) {
      newErrors.description = "Description is required";
    }
    
    if (selectedProviders.length === 0) {
      newErrors.providers = "At least one provider is required";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Submit form
    onSubmit({
      name,
      description,
      type,
      providers: selectedProviders
    });
  };

  // Render step 1: Basic information
  const renderStep1 = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Calculator Name</Label>
          <Input
            id="name"
            placeholder="Enter calculator name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter calculator description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={errors.description ? "border-destructive" : ""}
            rows={3}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
        </div>
        
        <div className="space-y-2">
          <Label>Calculator Type</Label>
          <RadioGroup value={type} onValueChange={(value) => setType(value as CalculatorType)}>
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="service" id="service" />
                <Label htmlFor="service" className="flex items-center gap-2 cursor-pointer">
                  <Briefcase className="h-4 w-4" />
                  <div>
                    <div>Service Level</div>
                    <p className="text-sm text-muted-foreground">
                      Bundle LLM costs into your service pricing
                    </p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="organization" id="organization" />
                <Label htmlFor="organization" className="flex items-center gap-2 cursor-pointer">
                  <Building2 className="h-4 w-4" />
                  <div>
                    <div>Organization Level</div>
                    <p className="text-sm text-muted-foreground">
                      Track consumption across all users in an organization
                    </p>
                  </div>
                </Label>
              </div>
              
              <div className="flex items-center space-x-2 rounded-md border p-3">
                <RadioGroupItem value="user" id="user" />
                <Label htmlFor="user" className="flex items-center gap-2 cursor-pointer">
                  <User className="h-4 w-4" />
                  <div>
                    <div>User Level</div>
                    <p className="text-sm text-muted-foreground">
                      Track consumption for individual users
                    </p>
                  </div>
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
        
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>About {type === "service" ? "Service" : type === "organization" ? "Organization" : "User"} Level Pricing</AlertTitle>
          <AlertDescription>
            {type === "service" && "In this model, LLM costs are bundled into your service pricing. End customers are not charged based on credits."}
            {type === "organization" && "Credits are allocated at the organization level. Consumption is tracked across all users within the organization."}
            {type === "user" && "Credits are allocated to individual users. Consumption is tracked separately for each user."}
          </AlertDescription>
        </Alert>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => setCurrentStep(2)}>
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  // Render step 2: Provider selection and configuration
  const renderStep2 = () => {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Select Providers</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {availableProviders.map((provider) => (
              <Button
                key={provider.id}
                variant="outline"
                className={cn(
                  "flex items-center justify-start gap-2 h-auto py-3",
                  selectedProviders.some(p => p.id === provider.id) && "border-primary",
                  !provider.integrated && "opacity-50"
                )}
                onClick={() => handleAddProvider(provider.id)}
                disabled={!provider.integrated}
              >
                <ProviderLogo provider={provider.id} className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">{provider.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {provider.integrated ? "Integrated" : "Not Integrated"}
                  </div>
                </div>
              </Button>
            ))}
          </div>
          {errors.provider && <p className="text-sm text-destructive">{errors.provider}</p>}
          {errors.providers && <p className="text-sm text-destructive">{errors.providers}</p>}
        </div>
        
        <Separator />
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Selected Providers</h3>
            {selectedProviders.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {selectedProviders.length} provider{selectedProviders.length !== 1 ? "s" : ""} selected
              </div>
            )}
          </div>
          
          {selectedProviders.length === 0 ? (
            <div className="border rounded-md p-8 text-center">
              <p className="text-muted-foreground">No providers selected. Please select at least one provider.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="w-full">
              {selectedProviders.map((provider, index) => (
                <AccordionItem key={provider.id} value={provider.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2">
                      <ProviderLogo provider={provider.id} className="h-5 w-5" />
                      <span>{provider.name}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ProviderConfigForm 
                      provider={provider}
                      onUpdate={handleUpdateProvider}
                      onRemove={() => handleRemoveProvider(provider.id)}
                    />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={() => setCurrentStep(1)}>
            Back
          </Button>
          <Button onClick={handleSubmit}>
            Create Calculator
          </Button>
        </div>
      </div>
    );
  };

  // Render the current step
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              1
            </div>
            <div className="text-sm font-medium">Basic Information</div>
          </div>
          
          <div className="h-0.5 w-8 bg-muted"></div>
          
          <div className="flex items-center gap-2">
            <div className={`rounded-full w-8 h-8 flex items-center justify-center ${currentStep === 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              2
            </div>
            <div className="text-sm font-medium">Provider Configuration</div>
          </div>
        </div>
      </div>
      
      {currentStep === 1 ? renderStep1() : renderStep2()}
    </div>
  );
};

interface ProviderConfigFormProps {
  provider: ProviderConfig;
  onUpdate: (provider: ProviderConfig) => void;
  onRemove: () => void;
}

const ProviderConfigForm = ({ provider, onUpdate, onRemove }: ProviderConfigFormProps) => {
  // Handle updating credit mapping
  const handleCreditMappingChange = (value: number[]) => {
    onUpdate({
      ...provider,
      creditMapping: value[0],
      profitPercentage: calculateProfitPercentage(value[0])
    });
  };

  // Calculate profit percentage based on credit mapping
  const calculateProfitPercentage = (creditMapping: number) => {
    // 500 credits = 0% profit (break-even)
    // Lower credit mapping = higher profit
    return Math.round(((500 - creditMapping) / 500) * 100);
  };

  // Handle updating model distribution
  const handleModelDistributionChange = (model: string, percentage: number) => {
    // Calculate remaining percentage
    const totalOtherPercentage = provider.models
      .filter(m => m.model !== model)
      .reduce((sum, m) => sum + m.percentage, 0);
    
    // If total is 0, set this model to 100%
    if (totalOtherPercentage === 0) {
      const updatedModels = provider.models.map(m => 
        m.model === model ? { ...m, percentage } : { ...m, percentage: 0 }
      );
      
      onUpdate({
        ...provider,
        models: updatedModels
      });
      return;
    }
    
    // Calculate adjustment factor for other models
    const adjustmentFactor = (100 - percentage) / totalOtherPercentage;
    
    // Update all models
    const updatedModels = provider.models.map(m => {
      if (m.model === model) {
        return { ...m, percentage };
      } else {
        return { ...m, percentage: Math.round(m.percentage * adjustmentFactor) };
      }
    });
    
    // Ensure total is 100%
    let total = updatedModels.reduce((sum, m) => sum + m.percentage, 0);
    
    if (total !== 100) {
      // Adjust the last model to make total 100%
      const lastModel = updatedModels.findIndex(m => m.model !== model);
      if (lastModel !== -1) {
        updatedModels[lastModel].percentage += (100 - total);
      }
    }
    
    onUpdate({
      ...provider,
      models: updatedModels
    });
  };

  // Handle updating token distribution
  const handleTokenDistributionChange = (model: string, tokenType: string, percentage: number) => {
    const tokenDists = provider.tokenDistributions[model] || [];
    
    // Calculate remaining percentage
    const totalOtherPercentage = tokenDists
      .filter(t => t.type !== tokenType)
      .reduce((sum, t) => sum + t.percentage, 0);
    
    // If total is 0, set this token type to 100%
    if (totalOtherPercentage === 0) {
      const updatedTokenDists = tokenDists.map(t => 
        t.type === tokenType ? { ...t, percentage } : { ...t, percentage: 0 }
      );
      
      onUpdate({
        ...provider,
        tokenDistributions: {
          ...provider.tokenDistributions,
          [model]: updatedTokenDists
        }
      });
      return;
    }
    
    // Calculate adjustment factor for other token types
    const adjustmentFactor = (100 - percentage) / totalOtherPercentage;
    
    // Update all token types
    const updatedTokenDists = tokenDists.map(t => {
      if (t.type === tokenType) {
        return { ...t, percentage };
      } else {
        return { ...t, percentage: Math.round(t.percentage * adjustmentFactor) };
      }
    });
    
    // Ensure total is 100%
    let total = updatedTokenDists.reduce((sum, t) => sum + t.percentage, 0);
    
    if (total !== 100) {
      // Adjust the last token type to make total 100%
      const lastToken = updatedTokenDists.findIndex(t => t.type !== tokenType);
      if (lastToken !== -1) {
        updatedTokenDists[lastToken].percentage += (100 - total);
      }
    }
    
    onUpdate({
      ...provider,
      tokenDistributions: {
        ...provider.tokenDistributions,
        [model]: updatedTokenDists
      }
    });
  };

  return (
    <div className="space-y-6 pt-2">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Credit Mapping</Label>
          <div className="flex items-center gap-1 text-sm">
            <span className="text-green-600 font-medium">{provider.profitPercentage}% profit</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs">
                    500 credits = break-even (0% profit). Lower credit mapping means higher profit.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Slider
              value={[provider.creditMapping]}
              min={100}
              max={900}
              step={10}
              onValueChange={handleCreditMappingChange}
            />
          </div>
          <div className="w-16 text-center font-medium">
            {provider.creditMapping}
          </div>
        </div>
        
        <div className="flex justify-between text-sm text-muted-foreground">
          <div>Higher Profit</div>
          <div>Lower Profit</div>
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Model Distribution</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Distribute usage across different models. Total must equal 100%.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-3">
          {provider.models.map((model) => (
            <div key={model.model} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="font-medium">{model.model}</div>
                <div className="text-sm">{model.percentage}%</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Slider
                    value={[model.percentage]}
                    min={0}
                    max={100}
                    step={5}
                    onValueChange={(value) => handleModelDistributionChange(model.model, value[0])}
                  />
                </div>
                <div className="w-12 text-center">
                  {model.percentage}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <Separator />
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Token Distribution</Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground" />
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs">
                  Distribute tokens across different types for each model. Total must equal 100%.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div className="space-y-4">
          {provider.models.map((modelDist) => (
            <div key={modelDist.model} className="border rounded-md p-4">
              <div className="font-medium mb-3">{modelDist.model}</div>
              
              <div className="space-y-3">
                {provider.tokenDistributions[modelDist.model]?.map((token) => (
                  <div key={token.type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="capitalize">{token.type} Tokens</div>
                      <div className="text-sm">{token.percentage}%</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <Slider
                          value={[token.percentage]}
                          min={0}
                          max={100}
                          step={5}
                          onValueChange={(value) => handleTokenDistributionChange(modelDist.model, token.type, value[0])}
                        />
                      </div>
                      <div className="w-12 text-center">
                        {token.percentage}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="pt-2">
        <Button variant="destructive" onClick={onRemove}>
          <Trash2 className="mr-2 h-4 w-4" />
          Remove Provider
        </Button>
      </div>
    </div>
  );
};