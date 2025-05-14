import { createContext, useContext, ReactNode, useState } from "react";

type AppContextType = {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
  activeProvider: string | null;
  setActiveProvider: (provider: string | null) => void;
  activeSettingsTab: string;
  setActiveSettingsTab: (tab: string) => void;
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState<string>("insights");
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>("organization");

  return (
    <AppContext.Provider value={{ 
      sidebarOpen, 
      setSidebarOpen,
      activePage,
      setActivePage,
      activeProvider,
      setActiveProvider,
      activeSettingsTab,
      setActiveSettingsTab
    }}>
      {children}
    </AppContext.Provider>
  );
}