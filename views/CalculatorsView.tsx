import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, PlusCircle, Search, Briefcase, Building2, User, ArrowRight, Trash2, PenLine, LayoutDashboard, ActivitySquare, BarChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CreateCalculatorForm } from "@/application/components/calculators/CreateCalculatorForm";
import { CalculatorDetail } from "@/application/components/calculators/CalculatorDetail";
import { CalculatorCard } from "@/application/components/calculators/CalculatorCard";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

// Types for calculator
export type CalculatorType = "service" | "organization" | "user";

export interface TokenDistribution {
  type: string;
  percentage: number;
}

export interface ModelDistribution {
  model: string;
  percentage: number;
}

export interface ProviderConfig {
  id: string;
  name: string;
  models: ModelDistribution[];
  tokenDistributions: Record<string, TokenDistribution[]>;
  creditMapping: number;
  profitPercentage: number;
}

export interface Calculator {
  id: string;
  name: string;
  description: string;
  type: CalculatorType;
  providers: ProviderConfig[];
  createdAt: string;
  updatedAt: string;
}

interface CalculatorsViewProps {
  activeCalculator: string | null;
  setActiveCalculator: (id: string | null) => void;
}

export const CalculatorsView = ({ activeCalculator, setActiveCalculator }: CalculatorsViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [calculators, setCalculators] = useState<Calculator[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("all");
  const { toast } = useToast();

  // Load mock calculators
  useEffect(() => {
    // In a real app, this would be an API call
    const mockCalculators: Calculator[] = [
      {
        id: "calc-1",
        name: "Enterprise SaaS Pricing",
        description: "Pricing calculator for enterprise customers with service-level billing",
        type: "service",
        providers: [
          {
            id: "openai",
            name: "OpenAI",
            models: [
              { model: "GPT-4.1", percentage: 30 },
              { model: "GPT-4.1 mini", percentage: 40 },
              { model: "GPT-4.1 nano", percentage: 30 }
            ],
            tokenDistributions: {
              "GPT-4.1": [
                { type: "input", percentage: 30 },
                { type: "output", percentage: 60 },
                { type: "cached", percentage: 10 }
              ],
              "GPT-4.1 mini": [
                { type: "input", percentage: 40 },
                { type: "output", percentage: 50 },
                { type: "cached", percentage: 10 }
              ],
              "GPT-4.1 nano": [
                { type: "input", percentage: 50 },
                { type: "output", percentage: 40 },
                { type: "cached", percentage: 10 }
              ]
            },
            creditMapping: 400,
            profitPercentage: 20
          }
        ],
        createdAt: "2023-10-15T10:30:00Z",
        updatedAt: "2023-10-20T14:45:00Z"
      },
      {
        id: "calc-2",
        name: "Team Collaboration Tool",
        description: "Organization-level pricing for team collaboration platform",
        type: "organization",
        providers: [
          {
            id: "anthropic",
            name: "Anthropic",
            models: [
              { model: "Claude 3 Opus", percentage: 20 },
              { model: "Claude 3 Sonnet", percentage: 50 },
              { model: "Claude 3 Haiku", percentage: 30 }
            ],
            tokenDistributions: {
              "Claude 3 Opus": [
                { type: "input", percentage: 40 },
                { type: "output", percentage: 60 }
              ],
              "Claude 3 Sonnet": [
                { type: "input", percentage: 45 },
                { type: "output", percentage: 55 }
              ],
              "Claude 3 Haiku": [
                { type: "input", percentage: 50 },
                { type: "output", percentage: 50 }
              ]
            },
            creditMapping: 350,
            profitPercentage: 30
          }
        ],
        createdAt: "2023-11-05T09:15:00Z",
        updatedAt: "2023-11-10T16:20:00Z"
      },
      {
        id: "calc-3",
        name: "AI Writing Assistant",
        description: "User-level pricing for AI writing assistant",
        type: "user",
        providers: [
          {
            id: "openai",
            name: "OpenAI",
            models: [
              { model: "GPT-4.1", percentage: 20 },
              { model: "GPT-3.5 Turbo", percentage: 80 }
            ],
            tokenDistributions: {
              "GPT-4.1": [
                { type: "input", percentage: 30 },
                { type: "output", percentage: 70 }
              ],
              "GPT-3.5 Turbo": [
                { type: "input", percentage: 40 },
                { type: "output", percentage: 60 }
              ]
            },
            creditMapping: 450,
            profitPercentage: 25
          },
          {
            id: "anthropic",
            name: "Anthropic",
            models: [
              { model: "Claude 3 Haiku", percentage: 100 }
            ],
            tokenDistributions: {
              "Claude 3 Haiku": [
                { type: "input", percentage: 40 },
                { type: "output", percentage: 60 }
              ]
            },
            creditMapping: 400,
            profitPercentage: 20
          }
        ],
        createdAt: "2023-12-01T11:45:00Z",
        updatedAt: "2023-12-15T13:30:00Z"
      }
    ];
    
    setCalculators(mockCalculators);
  }, []);

  // Handle creating a new calculator
  const handleCreateCalculator = (calculator: Omit<Calculator, "id" | "createdAt" | "updatedAt">) => {
    const newCalculator: Calculator = {
      ...calculator,
      id: `calc-${calculators.length + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCalculators([...calculators, newCalculator]);
    setIsCreating(false);
    setActiveCalculator(newCalculator.id);
    
    toast({
      title: "Calculator created",
      description: `${newCalculator.name} has been created successfully.`
    });
  };

  // Handle updating a calculator
  const handleUpdateCalculator = (updatedCalculator: Calculator) => {
    const updatedCalculators = calculators.map(calc => 
      calc.id === updatedCalculator.id ? {...updatedCalculator, updatedAt: new Date().toISOString()} : calc
    );
    
    setCalculators(updatedCalculators);
    
    toast({
      title: "Calculator updated",
      description: `${updatedCalculator.name} has been updated successfully.`
    });
  };

  // Handle deleting a calculator
  const handleDeleteCalculator = (id: string) => {
    setCalculators(calculators.filter(calc => calc.id !== id));
    
    if (activeCalculator === id) {
      setActiveCalculator(null);
    }
    
    toast({
      title: "Calculator deleted",
      description: "The calculator has been deleted successfully."
    });
  };

  // Filter calculators based on search query and active tab
  const filteredCalculators = calculators.filter(calculator => {
    const matchesSearch = calculator.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         calculator.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTab = activeTab === "all" || 
                      (activeTab === "service" && calculator.type === "service") ||
                      (activeTab === "organization" && calculator.type === "organization") ||
                      (activeTab === "user" && calculator.type === "user");
    
    return matchesSearch && matchesTab;
  });

  // Get the active calculator
  const currentCalculator = calculators.find(calc => calc.id === activeCalculator);

  // Render content based on state
  const renderContent = () => {
    if (isCreating) {
      return (
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Create New Calculator</CardTitle>
            <CardDescription>
              Configure a new pricing calculator for your customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CreateCalculatorForm 
              onSubmit={handleCreateCalculator}
              onCancel={() => setIsCreating(false)}
            />
          </CardContent>
        </Card>
      );
    }
    
    if (currentCalculator) {
      return (
        <CalculatorDetail 
          calculator={currentCalculator}
          onUpdate={handleUpdateCalculator}
          onDelete={handleDeleteCalculator}
          onBack={() => setActiveCalculator(null)}
        />
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">Pricing Calculators</h2>
            <p className="text-muted-foreground">
              Create and manage pricing calculators for different customer billing models
            </p>
          </div>
          <Button onClick={() => setIsCreating(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Create Calculator
          </Button>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search calculators..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-auto">
            <TabsList>
              <TabsTrigger value="all" className="flex items-center gap-1">
                <LayoutDashboard className="h-4 w-4" />
                <span>All</span>
              </TabsTrigger>
              <TabsTrigger value="service" className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>Service</span>
              </TabsTrigger>
              <TabsTrigger value="organization" className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                <span>Organization</span>
              </TabsTrigger>
              <TabsTrigger value="user" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>User</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        {filteredCalculators.length === 0 ? (
          <Card className="flex flex-col items-center justify-center p-8 text-center">
            <Calculator className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No calculators found</h3>
            <p className="text-muted-foreground mt-2 mb-4">
              {searchQuery ? "Try adjusting your search query" : "Create your first pricing calculator to get started"}
            </p>
            <Button onClick={() => setIsCreating(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Calculator
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredCalculators.map((calculator) => (
              <CalculatorCard
                key={calculator.id}
                calculator={calculator}
                onClick={() => setActiveCalculator(calculator.id)}
                onEdit={() => setActiveCalculator(calculator.id)}
                onDelete={() => handleDeleteCalculator(calculator.id)}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {renderContent()}
    </div>
  );
};