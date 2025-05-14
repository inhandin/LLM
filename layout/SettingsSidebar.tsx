import { Button } from "@/components/ui/button";
import { User, Building2, CreditCard, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface SettingsSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SettingsSidebar = ({ activeTab, setActiveTab }: SettingsSidebarProps) => {
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
    <div className="w-60 h-screen border-r border-border bg-gray-50">
      <div className="p-4 h-16 border-b flex items-center">
        <h2 className="font-semibold text-lg">Settings</h2>
      </div>
      <div className="p-3 space-y-1">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className={cn(
              "w-full justify-start gap-2 px-3",
              activeTab === item.id
                ? "bg-gray-200 text-gray-900 font-medium"
                : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
            )}
            onClick={() => setActiveTab(item.id)}
          >
            {item.icon}
            <span>{item.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};