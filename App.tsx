import { useState, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MainLayout } from "@/application/layout/MainLayout";
import { InsightsView } from "@/application/views/InsightsView";
import { ProviderView } from "@/application/views/ProviderView";
import { SettingsView } from "@/application/views/Settings";
import { AppProvider } from "@/application/context/AppContext";
import { CustomersView } from "@/application/views/CustomersView";
import { ImplementationGuideView } from "@/application/views/ImplementationGuideView";
import { ErrorBoundary } from "@/application/components/ui/ErrorBoundary";
import { CalculatorsView } from "@/application/views/CalculatorsView";

// Create a client with default options
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      suspense: false,
      useErrorBoundary: true,
    },
  },
});

const App = () => {
  const [activePage, setActivePage] = useState<string>("insights");
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [activeSettingsTab, setActiveSettingsTab] = useState<string>("organization");
  const [activeCalculator, setActiveCalculator] = useState<string | null>(null);

  const renderContent = () => {
    if (activePage === "insights") {
      return <InsightsView />;
    } else if (activePage === "settings") {
      return <SettingsView activeTab={activeSettingsTab} setActiveTab={setActiveSettingsTab} />;
    } else if (activePage === "customers") {
      return <CustomersView />;
    } else if (activePage === "implementation-guide") {
      return <ImplementationGuideView />;
    } else if (activePage === "calculators") {
      return <CalculatorsView activeCalculator={activeCalculator} setActiveCalculator={setActiveCalculator} />;
    } else if (["openai", "anthropic", "gemini", "llama"].includes(activePage)) {
      return <ProviderView provider={activePage} />;
    }
    return <InsightsView />;
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppProvider>
          <style
            dangerouslySetInnerHTML={{
              __html: `
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
              
              html, body {
                font-family: 'Inter', sans-serif;
              }
            `,
            }}
          />
          <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
            <MainLayout
              activePage={activePage}
              setActivePage={setActivePage}
              activeProvider={activeProvider}
              setActiveProvider={setActiveProvider}
              setActiveSettingsTab={setActiveSettingsTab}
              activeSettingsTab={activeSettingsTab}
            >
              {renderContent()}
            </MainLayout>
          </Suspense>
        </AppProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;