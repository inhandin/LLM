import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";

export const IntegrationSettings = () => {
  const connectedIntegrations = [
    {
      id: "openai",
      name: "OpenAI",
      description: "GPT-4, GPT-3.5 Turbo, and other models",
      connected: true,
      lastSynced: "2 hours ago",
    },
    {
      id: "anthropic",
      name: "Anthropic",
      description: "Claude and other models",
      connected: true,
      lastSynced: "3 hours ago",
    },
    {
      id: "gemini",
      name: "Google Gemini",
      description: "Gemini Pro, Gemini Ultra models",
      connected: true,
      lastSynced: "1 hour ago",
    },
    {
      id: "llama",
      name: "Meta Llama",
      description: "Llama 2, Llama 3 models",
      connected: true,
      lastSynced: "4 hours ago",
    },
  ];
  
  const availableIntegrations = [
    { id: "azure-openai", name: "Azure OpenAI", description: "Microsoft's OpenAI deployment" },
    { id: "mistral", name: "Mistral AI", description: "Mistral models including Mixtral" },
    { id: "cohere", name: "Cohere", description: "Command and other models" },
    { id: "ai21", name: "AI21 Labs", description: "Jurassic models" },
    { id: "aleph-alpha", name: "Aleph Alpha", description: "Luminous models" },
    { id: "nvidia", name: "NVIDIA AI", description: "Various NeMo models" },
    { id: "huggingface", name: "Hugging Face", description: "Inference API" },
    { id: "stability", name: "Stability AI", description: "Stable Diffusion and other models" },
    { id: "together", name: "Together AI", description: "Various open source models" },
    { id: "replicate", name: "Replicate", description: "Open source model hosting" },
    { id: "baidu", name: "Baidu ERNIE", description: "ERNIE-Bot and other models" },
    { id: "deepinfra", name: "DeepInfra", description: "Hosted model inference" },
    { id: "perplexity", name: "Perplexity AI", description: "pplx-* models" },
    { id: "ibm", name: "IBM watsonx.ai", description: "Foundation models and tools" },
    { id: "runpod", name: "RunPod", description: "GPU cloud for AI" },
    { id: "forefront", name: "Forefront", description: "End-to-end LLM API" },
    { id: "deepseek", name: "DeepSeek", description: "DeepSeek models" },
    { id: "inflection", name: "Inflection AI", description: "Pi assistant and models" },
    { id: "groq", name: "Groq", description: "High-performance inference" },
    { id: "anyscale", name: "Anyscale", description: "Ray-based AI deployment" },
    { id: "moonshot", name: "Moonshot", description: "Chinese language models" },
    { id: "databricks", name: "Databricks DBRX", description: "DBRX and other models" },
    { id: "writer", name: "Writer", description: "Palwiki and other models" },
    { id: "steamship", name: "Steamship", description: "LLM agent deployment" },
    { id: "textsynth", name: "TextSynth", description: "API for language models" },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>LLM Provider Integrations</CardTitle>
          <CardDescription>
            Connect your LLM providers to track usage and costs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {connectedIntegrations.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Connected Providers</h3>
                <div className="grid grid-cols-1 gap-4">
                  {connectedIntegrations.map((integration) => (
                    <IntegrationCard key={integration.id} integration={integration} />
                  ))}
                </div>
              </div>
            )}
            
            <Separator />
            
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-muted-foreground">Available Providers</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableIntegrations.map((integration) => (
                  <IntegrationCard key={integration.id} integration={{...integration, connected: false}} />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" className="gap-1">
            <Plus className="h-4 w-4" />
            Add Custom Provider
          </Button>
          <Button variant="outline" className="gap-1">
            <ExternalLink className="h-4 w-4" />
            Provider Documentation
          </Button>
        </CardFooter>
      </Card>

      <Alert>
        <AlertTitle>Need Additional Providers?</AlertTitle>
        <AlertDescription>
          We're constantly adding new LLM providers. If you don't see the provider you need, please contact our support team.
        </AlertDescription>
      </Alert>
    </div>
  );
};

interface IntegrationCardProps {
  integration: {
    id: string;
    name: string;
    description: string;
    connected: boolean;
    lastSynced?: string;
  };
}

const IntegrationCard = ({ integration }: IntegrationCardProps) => {
  return (
    <Card className="overflow-hidden">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-muted rounded-md p-2 flex-shrink-0">
            <ProviderLogo provider={integration.id} className="h-10 w-10" />
          </div>
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              {integration.name}
              {integration.connected && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Connected
                </Badge>
              )}
            </h3>
            <p className="text-sm text-muted-foreground">{integration.description}</p>
            {integration.connected && integration.lastSynced && (
              <p className="text-xs text-muted-foreground mt-1">Last synced: {integration.lastSynced}</p>
            )}
          </div>
        </div>
        <Button variant={integration.connected ? "outline" : "default"}>
          {integration.connected ? "Manage" : "Connect"}
        </Button>
      </div>
      
      {integration.connected && (
        <>
          <Separator />
          <div className="p-4 bg-muted/20">
            <h4 className="font-medium mb-2">Integration Settings</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">API Key</p>
                  <p className="text-xs text-muted-foreground">Used for API authentication</p>
                </div>
                <Button variant="outline" size="sm">Update</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Sync Frequency</p>
                  <p className="text-xs text-muted-foreground">Currently set to hourly</p>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Webhook URL</p>
                  <p className="text-xs text-muted-foreground">For real-time updates</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};