import { useState } from "react";
import { Check, ChevronDown, FilterX } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";

export type ProviderOption = {
  value: string;
  label: string;
};

interface ProviderFilterProps {
  providers: ProviderOption[];
  selectedProviders: string[];
  onChange: (providers: string[]) => void;
  showLabel?: boolean;
  align?: "start" | "center" | "end";
}

export const ProviderFilter = ({
  providers,
  selectedProviders,
  onChange,
  showLabel = true,
  align = "start"
}: ProviderFilterProps) => {
  const [open, setOpen] = useState(false);
  
  const handleSelect = (currentValue: string) => {
    let updatedSelection: string[];
    
    if (selectedProviders.includes(currentValue)) {
      updatedSelection = selectedProviders.filter(value => value !== currentValue);
    } else {
      updatedSelection = [...selectedProviders, currentValue];
    }
    
    onChange(updatedSelection);
  };
  
  const handleClear = () => {
    onChange([]);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "flex h-9 items-center justify-between",
            !selectedProviders.length && "text-muted-foreground"
          )}
        >
          {showLabel && (
            <span className="mr-1">Providers:</span>
          )}
          {selectedProviders.length > 0 ? (
            <div className="flex items-center gap-1">
              <div className="flex -space-x-2 overflow-hidden">
                {selectedProviders.slice(0, 3).map((provider) => (
                  <ProviderLogo
                    key={provider}
                    provider={provider}
                    className="h-5 w-5 rounded-full border border-background"
                    useColors={true}
                  />
                ))}
              </div>
              {selectedProviders.length > 3 && (
                <Badge className="rounded-sm px-1" variant="secondary">
                  +{selectedProviders.length - 3}
                </Badge>
              )}
            </div>
          ) : (
            <span>All Providers</span>
          )}
          <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align={align}>
        <Command>
          <CommandInput placeholder="Search providers..." />
          <CommandList>
            <CommandEmpty>No provider found.</CommandEmpty>
            <CommandGroup>
              {providers.map((provider) => {
                const isSelected = selectedProviders.includes(provider.value);
                return (
                  <CommandItem
                    key={provider.value}
                    onSelect={() => handleSelect(provider.value)}
                  >
                    <div className={cn(
                      "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                      isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
                    )}>
                      {isSelected && <Check className="h-4 w-4" />}
                    </div>
                    <div className="flex items-center gap-2">
                      <ProviderLogo 
                        provider={provider.value} 
                        className="h-4 w-4" 
                        useColors={true} 
                      />
                      {provider.label}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedProviders.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={handleClear}
                    className="justify-center text-center"
                  >
                    <FilterX className="mr-2 h-4 w-4" />
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};