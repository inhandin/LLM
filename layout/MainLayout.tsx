import { PropsWithChildren } from "react";
import { NavigationSidebar } from "@/application/layout/NavigationSidebar";
import { Toaster } from "@/components/ui/toaster";
import { SettingsSidebar } from "@/application/layout/SettingsSidebar";

interface MainLayoutProps {
  activePage: string;
  setActivePage: (page: string) => void;
  activeProvider: string | null;
  setActiveProvider: (provider: string | null) => void;
  setActiveSettingsTab: (tab: string) => void;
  activeSettingsTab: string;
}

export const MainLayout = ({ 
  children, 
  activePage, 
  setActivePage,
  activeProvider,
  setActiveProvider,
  setActiveSettingsTab,
  activeSettingsTab
}: PropsWithChildren<MainLayoutProps>) => {
  return (
    <div className="min-h-screen bg-background flex">
      <NavigationSidebar 
        activePage={activePage} 
        setActivePage={setActivePage}
        activeProvider={activeProvider}
        setActiveProvider={setActiveProvider}
        setActiveSettingsTab={setActiveSettingsTab}
      />
      
      {activePage === "settings" && (
        <SettingsSidebar 
          activeTab={activeSettingsTab} 
          setActiveTab={setActiveSettingsTab} 
        />
      )}

      <main className="flex-1 p-6 overflow-auto h-screen">
        {children}
      </main>
      <Toaster />
    </div>
  );
};