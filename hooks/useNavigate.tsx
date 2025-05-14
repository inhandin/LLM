import { useContext } from "react";
import { AppContext } from "@/application/context/AppContext";

export const useNavigate = () => {
  const context = useContext(AppContext);
  
  if (!context) {
    throw new Error("useNavigate must be used within an AppProvider");
  }
  
  const { setActivePage, setActiveProvider, setActiveSettingsTab } = context;
  
  const navigateTo = (page: string, provider?: string) => {
    setActivePage(page);
    
    if (provider) {
      setActiveProvider(provider);
    } else if (page !== "openai" && page !== "anthropic" && page !== "gemini" && page !== "llama") {
      setActiveProvider(null);
    }
    
    if (page === "settings") {
      setActiveSettingsTab("organization");
    }
  };
  
  return { navigateTo };
};