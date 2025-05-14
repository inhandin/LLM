import { Button } from "@/components/ui/button";
import { User, Building2, CreditCard, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsMenuProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SettingsMenu = ({ activeTab, setActiveTab }: SettingsMenuProps) => {
  const menuItems = [
    {
      id: "organization",
      label: "Organization",
      icon: <Building2 className="h-4 w-4" />,
    },
    {
      id: "personal",
      label: "Personal",
      icon: <User className="h-4 w-4" />,
    },
    {
      id: "billing",
      label: "Billing",
      icon: <CreditCard className="h-4 w-4" />,
    },
    {
      id: "integrations",
      label: "Integrations",
      icon: <ArrowRightLeft className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-1">
      {menuItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className={cn(
            "w-full justify-start gap-2 px-3",
            activeTab === item.id
              ? "bg-gray-800 text-white"
              : "text-gray-300 hover:bg-gray-800 hover:text-white"
          )}
          onClick={() => setActiveTab(item.id)}
        >
          {item.icon}
          <span>{item.label}</span>
        </Button>
      ))}
    </div>
  );
};