import { OrganizationSettings } from "@/application/components/settings/OrganizationSettings";
import { PersonalSettings } from "@/application/components/settings/PersonalSettings";
import { BillingSettings } from "@/application/components/settings/BillingSettings";
import { IntegrationSettings } from "@/application/components/settings/IntegrationSettings";
import { Building2, User, CreditCard, ArrowRightLeft } from "lucide-react";

interface SettingsViewProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SettingsView = ({ activeTab, setActiveTab }: SettingsViewProps) => {
  const renderContent = () => {
    switch (activeTab) {
      case "organization":
        return <OrganizationSettings />;
      case "personal":
        return <PersonalSettings />;
      case "billing":
        return <BillingSettings />;
      case "integrations":
        return <IntegrationSettings />;
      default:
        return <OrganizationSettings />;
    }
  };

  const getHeaderIcon = () => {
    switch (activeTab) {
      case "organization":
        return <Building2 className="h-6 w-6 mr-2" />;
      case "personal":
        return <User className="h-6 w-6 mr-2" />;
      case "billing":
        return <CreditCard className="h-6 w-6 mr-2" />;
      case "integrations":
        return <ArrowRightLeft className="h-6 w-6 mr-2" />;
      default:
        return <Building2 className="h-6 w-6 mr-2" />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "organization":
        return "Organization Settings";
      case "personal":
        return "Personal Settings";
      case "billing":
        return "Billing Settings";
      case "integrations":
        return "Integration Settings";
      default:
        return "Settings";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center">
        {getHeaderIcon()}
        <h1 className="text-3xl font-bold tracking-tight">{getHeaderTitle()}</h1>
      </div>

      {renderContent()}
    </div>
  );
};