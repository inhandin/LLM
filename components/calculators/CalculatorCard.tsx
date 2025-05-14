import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, PenLine, Trash2, Briefcase, Building2, User, DollarSign, ArrowRightCircle } from "lucide-react";
import { Calculator as CalculatorType } from "@/application/views/CalculatorsView";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";

interface CalculatorCardProps {
  calculator: CalculatorType;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const CalculatorCard = ({ calculator, onClick, onEdit, onDelete }: CalculatorCardProps) => {
  // Get the type icon
  const getTypeIcon = () => {
    switch (calculator.type) {
      case "service":
        return <Briefcase className="h-4 w-4" />;
      case "organization":
        return <Building2 className="h-4 w-4" />;
      case "user":
        return <User className="h-4 w-4" />;
      default:
        return <Calculator className="h-4 w-4" />;
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

  // Calculate the average profit percentage across all providers
  const averageProfitPercentage = calculator.providers.length > 0
    ? calculator.providers.reduce((sum, provider) => sum + provider.profitPercentage, 0) / calculator.providers.length
    : 0;

  return (
    <Card className="overflow-hidden hover:border-primary transition-colors cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="outline" className="mb-2 flex items-center gap-1">
            {getTypeIcon()}
            <span>{getTypeLabel()}</span>
          </Badge>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <PenLine className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onEdit(); }}>
                <PenLine className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => { e.stopPropagation(); onDelete(); }}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <CardTitle className="text-xl">{calculator.name}</CardTitle>
        <CardDescription className="line-clamp-2">{calculator.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-3">
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
          
          <div>
            <div className="text-sm font-medium mb-1">Average Profit</div>
            <div className="flex items-center text-green-600">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="font-bold">{averageProfitPercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between items-center text-xs text-muted-foreground">
        <div>Updated {formatDistanceToNow(new Date(calculator.updatedAt), { addSuffix: true })}</div>
        <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs">
          <span>View</span>
          <ArrowRightCircle className="h-3 w-3" />
        </Button>
      </CardFooter>
    </Card>
  );
};