import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { DateRange } from "react-day-picker";

interface DateRangeFilterProps {
  onChange: (dateRange: DateRange | undefined) => void;
  dateRange?: DateRange;
  align?: "start" | "center" | "end";
}

export const DateRangeFilter = ({ 
  onChange, 
  dateRange,
  align = "end"
}: DateRangeFilterProps) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (range: DateRange | undefined) => {
    onChange(range);
    if (range?.from && range?.to) {
      setOpen(false);
    }
  };
  
  // Predefined ranges
  const handleSelectPredefined = (days: number) => {
    const to = new Date();
    const from = new Date();
    from.setDate(from.getDate() - days);
    
    const newRange = { from, to };
    onChange(newRange);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "justify-start text-left font-normal",
            !dateRange && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "LLL dd, y")} -{" "}
                {format(dateRange.to, "LLL dd, y")}
              </>
            ) : (
              format(dateRange.from, "LLL dd, y")
            )
          ) : (
            <span>Date range</span>
          )}
          <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align={align}>
        <div className="flex flex-col sm:flex-row gap-2 p-3 border-b">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => handleSelectPredefined(7)}
          >
            Last 7 days
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleSelectPredefined(30)}
          >
            Last 30 days
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => handleSelectPredefined(90)}
          >
            Last 90 days
          </Button>
        </div>
        <Calendar
          initialFocus
          mode="range"
          defaultMonth={dateRange?.from}
          selected={dateRange}
          onSelect={handleSelect}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};