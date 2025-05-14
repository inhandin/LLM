import { Settings, BarChart, Users, Bell, LogOut, User, Plus, Code, BookOpen, ChartPie, Activity, Calculator } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { BusterystageLogo } from "@/application/components/ui/BusterystageLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useNavigate } from "@/application/hooks/useNavigate";

interface NavigationSidebarProps {
  activePage: string;
  setActivePage: (page: string) => void;
  activeProvider: string | null;
  setActiveProvider: (provider: string | null) => void;
  setActiveSettingsTab: (tab: string) => void;
}

export const NavigationSidebar = ({ 
  activePage, 
  setActivePage,
  activeProvider,
  setActiveProvider,
  setActiveSettingsTab,
}: NavigationSidebarProps) => {
  const { navigateTo } = useNavigate();
  
  const providers = [
    { id: "openai", name: "OpenAI" },
    { id: "anthropic", name: "Anthropic" },
    { id: "gemini", name: "Gemini" },
    { id: "llama", name: "Llama" },
  ];

  const handleProviderClick = (providerId: string) => {
    setActivePage(providerId);
    setActiveProvider(providerId);
  };

  const handleSettingsClick = () => {
    setActivePage("settings");
    setActiveSettingsTab("organization");
  };
  
  const handleAddProviderClick = () => {
    setActivePage("settings");
    setActiveSettingsTab("integrations");
  };

  const unreadNotifications = 3;

  return (
    <div className="w-18 h-screen border-r border-border flex flex-col z-10 bg-gray-900 text-white">
      <div className="p-3 flex justify-center items-center h-16">
        <BusterystageLogo className="w-9 h-9 text-white" />
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <TooltipProvider>
          <nav className="space-y-1 p-2">
            <NavItem 
              icon={<Activity size={18} />} 
              label="Insights" 
              active={activePage === "insights"}
              onClick={() => setActivePage("insights")}
            />
            
            <NavItem 
              icon={<Users size={18} />} 
              label="Customers" 
              active={activePage === "customers"}
              onClick={() => setActivePage("customers")}
            />
            
            <NavItem 
              icon={<Calculator size={18} />} 
              label="Calculators" 
              active={activePage === "calculators"}
              onClick={() => setActivePage("calculators")}
            />
            
            <div className="pt-3">
              <p className="text-[8px] font-medium text-gray-400 uppercase text-center mb-1">
                Providers
              </p>
              {providers.map((provider) => (
                <NavItem 
                  key={provider.id}
                  icon={<ProviderLogo provider={provider.id} className="w-5 h-5" />} 
                  label={provider.name} 
                  active={activePage === provider.id}
                  onClick={() => handleProviderClick(provider.id)}
                />
              ))}
              
              <NavItem 
                icon={<Plus size={18} />} 
                label="Add Provider" 
                active={false}
                onClick={handleAddProviderClick}
              />
            </div>
            
            <Separator className="my-3 bg-gray-700" />
            
            <NavItem 
              icon={<Code size={18} />} 
              label="Implementation Guide" 
              active={activePage === "implementation-guide"}
              onClick={() => setActivePage("implementation-guide")}
            />
          </nav>
        </TooltipProvider>
      </div>
      
      <div className="mt-auto">
        <Separator className="my-2 bg-gray-700" />
        
        <TooltipProvider>
          <nav className="space-y-1 p-2 pb-3">
            <NavItem 
              icon={<Settings size={18} />} 
              label="Settings" 
              active={activePage === "settings"}
              onClick={handleSettingsClick}
            />
            
            <NavItem 
              icon={<Bell size={18} />} 
              label="Notifications" 
              badge={unreadNotifications}
              active={false}
              onClick={() => {}}
            />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div>
                  <NavItem 
                    icon={<Avatar className="h-5 w-5"><AvatarFallback className="text-[10px] bg-gray-700">JD</AvatarFallback></Avatar>}
                    label="Profile"
                    active={false}
                    onClick={() => {}}
                  />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">John Doe</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      john.doe@example.com
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSettingsClick}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </TooltipProvider>
      </div>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: number;
}

const NavItem = ({ icon, label, active, onClick, badge }: NavItemProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onClick}
            className={cn(
              "flex items-center w-full rounded-md transition-colors p-2.5 justify-center",
              active 
                ? "bg-primary text-primary-foreground"
                : "text-gray-300 hover:bg-gray-800 hover:text-white"
            )}
          >
            <span className="relative">
              {icon}
              {badge && (
                <span className="absolute top-0 right-0 h-4 w-4 rounded-full bg-destructive text-destructive-foreground text-[10px] flex items-center justify-center transform translate-x-1 -translate-y-1">
                  {badge}
                </span>
              )}
            </span>
          </button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};