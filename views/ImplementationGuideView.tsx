import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProviderLogo } from "@/application/components/ui/ProviderLogo";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Copy, RefreshCw, ExternalLink, ArrowRight, Check, Code, BookOpen, Bookmark, Shield } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export const ImplementationGuideView = () => {
  const [selectedProvider, setSelectedProvider] = useState<string>("openai");
  const [selectedOperation, setSelectedOperation] = useState<string>("text-generation");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("node");
  const [apiKey, setApiKey] = useState<string>("llm-tracker-sk_f9e87c6b38fc34a27dcefa84");
  const [copied, setCopied] = useState<boolean>(false);
  const [keyRegenerated, setKeyRegenerated] = useState<boolean>(false);
  const { toast } = useToast();

  const providers = [
    { id: "openai", name: "OpenAI", operations: ["text-generation", "embeddings", "image-generation", "audio-transcription"] },
    { id: "anthropic", name: "Anthropic", operations: ["text-generation", "embeddings"] },
    { id: "gemini", name: "Google Gemini", operations: ["text-generation", "embeddings", "image-understanding"] },
    { id: "llama", name: "Meta Llama", operations: ["text-generation", "embeddings"] }
  ];

  const operations: Record<string, string> = {
    "text-generation": "Text Generation",
    "embeddings": "Embeddings",
    "image-generation": "Image Generation",
    "image-understanding": "Image Understanding",
    "audio-transcription": "Audio Transcription"
  };

  const generateRandomApiKey = () => {
    const prefix = "llm-tracker-sk_";
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let result = prefix;
    for (let i = 0; i < 24; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setApiKey(result);
    setKeyRegenerated(true);
    setTimeout(() => setKeyRegenerated(false), 2000);
    
    toast({
      title: "API Key Regenerated",
      description: "Your new API key has been generated. Make sure to update it in your applications.",
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied to clipboard",
      description: "Content has been copied to your clipboard.",
    });
  };

  const getCodeSample = () => {
    const codeSnippets = {
      node: `const { LLMTracker } = require('llm-tracker');

// Initialize the client
const client = new LLMTracker({
  apiKey: '${apiKey}',
});

// Example usage for ${operations[selectedOperation]} with ${providers.find(p => p.id === selectedProvider)?.name}
async function example() {
  try {
    const response = await client.${selectedProvider}.${selectedOperation.replace(/-/g, '')}({
      // Request parameters
      ${getParametersForOperation()}
    });
    
    console.log(response);
    return response;
  } catch (error) {
    console.error('Error:', error);
  }
}

example();`,
      python: `import llm_tracker

# Initialize the client
client = llm_tracker.LLMTracker(api_key='${apiKey}')

# Example usage for ${operations[selectedOperation]} with ${providers.find(p => p.id === selectedProvider)?.name}
def example():
    try:
        response = client.${selectedProvider}.${selectedOperation.replace(/-/g, '_')}(
            # Request parameters
            ${getParametersForOperationPython()}
        )
        
        print(response)
        return response
    except Exception as e:
        print(f"Error: {e}")

example()`,
      java: `import com.llmtracker.LLMTracker;
import com.llmtracker.${selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)}Client;
import com.llmtracker.models.*;

public class Example {
    public static void main(String[] args) {
        // Initialize the client
        LLMTracker client = new LLMTracker("${apiKey}");
        
        // Example usage for ${operations[selectedOperation]} with ${providers.find(p => p.id === selectedProvider)?.name}
        try {
            ${getJavaResponseType()} response = client.${selectedProvider}().${selectedOperation.replace(/-/g, '')}(
                // Request parameters
                ${getParametersForOperationJava()}
            );
            
            System.out.println(response);
        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
        }
    }
}`,
      csharp: `using LLMTracker;
using LLMTracker.Models;
using System;
using System.Threading.Tasks;

class Program
{
    static async Task Main()
    {
        // Initialize the client
        var client = new LLMTrackerClient("${apiKey}");
        
        // Example usage for ${operations[selectedOperation]} with ${providers.find(p => p.id === selectedProvider)?.name}
        try
        {
            var response = await client.${selectedProvider.charAt(0).toUpperCase() + selectedProvider.slice(1)}.${selectedOperation.replace(/-/g, '')}Async(
                // Request parameters
                ${getParametersForOperationCSharp()}
            );
            
            Console.WriteLine(response);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }
}`
    };

    return codeSnippets[selectedLanguage as keyof typeof codeSnippets] || codeSnippets.node;
  };

  const getParametersForOperation = () => {
    switch (selectedOperation) {
      case "text-generation":
        return `prompt: "Write a short story about an AI that helps humanity solve climate change.",
maxTokens: 500,
temperature: 0.7`;
      case "embeddings":
        return `text: "This is a sentence to embed for semantic search and analysis."`;
      case "image-generation":
        return `prompt: "A futuristic city with flying cars and skyscrapers covered in vegetation",
n: 1,
size: "1024x1024"`;
      case "image-understanding":
        return `image: "https://example.com/image.jpg",
prompt: "Describe the contents of this image in detail."`;
      case "audio-transcription":
        return `audioFile: "https://example.com/audio.mp3",
language: "en"`;
      default:
        return `// Parameters depend on the operation`;
    }
  };

  const getParametersForOperationPython = () => {
    switch (selectedOperation) {
      case "text-generation":
        return `prompt="Write a short story about an AI that helps humanity solve climate change.",
max_tokens=500,
temperature=0.7`;
      case "embeddings":
        return `text="This is a sentence to embed for semantic search and analysis."`;
      case "image-generation":
        return `prompt="A futuristic city with flying cars and skyscrapers covered in vegetation",
n=1,
size="1024x1024"`;
      case "image-understanding":
        return `image="https://example.com/image.jpg",
prompt="Describe the contents of this image in detail."`;
      case "audio-transcription":
        return `audio_file="https://example.com/audio.mp3",
language="en"`;
      default:
        return `# Parameters depend on the operation`;
    }
  };

  const getParametersForOperationJava = () => {
    switch (selectedOperation) {
      case "text-generation":
        return `new TextGenerationRequest.Builder()
                .prompt("Write a short story about an AI that helps humanity solve climate change.")
                .maxTokens(500)
                .temperature(0.7)
                .build()`;
      case "embeddings":
        return `new EmbeddingsRequest.Builder()
                .text("This is a sentence to embed for semantic search and analysis.")
                .build()`;
      case "image-generation":
        return `new ImageGenerationRequest.Builder()
                .prompt("A futuristic city with flying cars and skyscrapers covered in vegetation")
                .n(1)
                .size("1024x1024")
                .build()`;
      case "image-understanding":
        return `new ImageUnderstandingRequest.Builder()
                .image("https://example.com/image.jpg")
                .prompt("Describe the contents of this image in detail.")
                .build()`;
      case "audio-transcription":
        return `new AudioTranscriptionRequest.Builder()
                .audioFile("https://example.com/audio.mp3")
                .language("en")
                .build()`;
      default:
        return `// Parameters depend on the operation`;
    }
  };

  const getParametersForOperationCSharp = () => {
    switch (selectedOperation) {
      case "text-generation":
        return `new TextGenerationRequest
            {
                Prompt = "Write a short story about an AI that helps humanity solve climate change.",
                MaxTokens = 500,
                Temperature = 0.7
            }`;
      case "embeddings":
        return `new EmbeddingsRequest
            {
                Text = "This is a sentence to embed for semantic search and analysis."
            }`;
      case "image-generation":
        return `new ImageGenerationRequest
            {
                Prompt = "A futuristic city with flying cars and skyscrapers covered in vegetation",
                N = 1,
                Size = "1024x1024"
            }`;
      case "image-understanding":
        return `new ImageUnderstandingRequest
            {
                Image = "https://example.com/image.jpg",
                Prompt = "Describe the contents of this image in detail."
            }`;
      case "audio-transcription":
        return `new AudioTranscriptionRequest
            {
                AudioFile = "https://example.com/audio.mp3",
                Language = "en"
            }`;
      default:
        return `// Parameters depend on the operation`;
    }
  };

  const getJavaResponseType = () => {
    switch (selectedOperation) {
      case "text-generation":
        return "TextGenerationResponse";
      case "embeddings":
        return "EmbeddingsResponse";
      case "image-generation":
        return "ImageGenerationResponse";
      case "image-understanding":
        return "ImageUnderstandingResponse";
      case "audio-transcription":
        return "AudioTranscriptionResponse";
      default:
        return "Response";
    }
  };

  const getAvailableOperations = () => {
    const provider = providers.find(p => p.id === selectedProvider);
    return provider ? provider.operations : [];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight">Implementation Guide</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => window.open("https://docs.example.com/api", "_blank")}>
            <BookOpen className="h-4 w-4" />
            <span>API Documentation</span>
          </Button>
          <Button className="flex items-center gap-2" onClick={() => window.open("https://docs.example.com/guide", "_blank")}>
            <ExternalLink className="h-4 w-4" />
            <span>Full Implementation Guide</span>
          </Button>
        </div>
      </div>
      
      <Alert className="bg-primary/10 border-primary">
        <Shield className="h-4 w-4" />
        <AlertTitle>Important API Security Notice</AlertTitle>
        <AlertDescription>
          Keep your API keys secure and never expose them in client-side code. Use environment variables or secure vaults to store your keys.
        </AlertDescription>
      </Alert>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            API Authentication
          </CardTitle>
          <CardDescription>
            Use this API key to authenticate your requests to the LLM Tracker API. Keep this key secure.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="api-key">Your API Key</Label>
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Input 
                    id="api-key" 
                    type="text" 
                    value={apiKey} 
                    readOnly 
                    className="pr-10 font-mono text-sm"
                  />
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className={`absolute right-0 top-0 h-full px-3 ${copied ? 'text-green-500' : ''}`}
                    onClick={() => copyToClipboard(apiKey)}
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
                <Button 
                  variant="outline" 
                  className={`${keyRegenerated ? 'bg-green-50 text-green-700 border-green-200' : ''}`}
                  onClick={generateRandomApiKey}
                >
                  {keyRegenerated ? (
                    <span className="flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Regenerated
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </span>
                  )}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                This key provides full access to all LLM Tracker API endpoints.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bookmark className="h-5 w-5" />
            API Wrapper Code Samples
          </CardTitle>
          <CardDescription>
            Get started quickly with code samples that demonstrate how to integrate with the LLM Tracker API.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="provider">LLM Provider</Label>
                <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                  <SelectTrigger id="provider" className="w-full">
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    {providers.map(provider => (
                      <SelectItem key={provider.id} value={provider.id} className="flex items-center">
                        <div className="flex items-center gap-2">
                          <ProviderLogo provider={provider.id} className="w-4 h-4" />
                          <span>{provider.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="operation">Operation</Label>
                <Select 
                  value={selectedOperation} 
                  onValueChange={setSelectedOperation}
                >
                  <SelectTrigger id="operation" className="w-full">
                    <SelectValue placeholder="Select operation" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableOperations().map(operation => (
                      <SelectItem key={operation} value={operation}>
                        {operations[operation]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="language">Programming Language</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger id="language" className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="node">Node.js</SelectItem>
                    <SelectItem value="python">Python</SelectItem>
                    <SelectItem value="java">Java</SelectItem>
                    <SelectItem value="csharp">C#</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-6">
              <Tabs defaultValue="code" className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="code" className={cn(
                    "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
                    "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
                  )}>Code Sample</TabsTrigger>
                  <TabsTrigger value="usage" className={cn(
                    "data-[state=active]:bg-gray-900 data-[state=active]:text-white",
                    "data-[state=inactive]:bg-white data-[state=inactive]:text-gray-900"
                  )}>Usage Instructions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="code" className="mt-4">
                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 relative font-mono text-sm">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className={`absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white ${copied ? 'text-green-400' : ''}`}
                      onClick={() => copyToClipboard(getCodeSample())}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <pre className="whitespace-pre-wrap overflow-auto max-h-96">
                      {getCodeSample()}
                    </pre>
                  </div>
                </TabsContent>
                
                <TabsContent value="usage" className="mt-4">
                  <Card className="border p-4">
                    <h3 className="text-lg font-medium mb-2">Installation</h3>
                    
                    <div className="bg-gray-900 text-gray-100 rounded-lg p-3 mb-4 font-mono text-sm">
                      {selectedLanguage === "node" && "npm install llm-tracker"}
                      {selectedLanguage === "python" && "pip install llm-tracker"}
                      {selectedLanguage === "java" && "maven: com.llmtracker:llm-tracker:1.0.0"}
                      {selectedLanguage === "csharp" && "dotnet add package LLMTracker"}
                    </div>
                    
                    <h3 className="text-lg font-medium mb-2">Basic Usage Steps</h3>
                    <ol className="list-decimal list-inside space-y-2 mb-4 ml-4 text-muted-foreground">
                      <li>Install the library as shown above</li>
                      <li>Initialize the client with your API key</li>
                      <li>Use the appropriate client methods to interact with different LLM providers</li>
                      <li>Handle responses and errors as shown in the sample code</li>
                      <li>Monitor your usage in this dashboard</li>
                    </ol>
                    
                    <h3 className="text-lg font-medium mb-2">Tips for {operations[selectedOperation]}</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                      {selectedOperation === "text-generation" && (
                        <>
                          <li>Use a clear, specific prompt for better results</li>
                          <li>Adjust temperature (0.0-1.0) to control creativity vs. determinism</li>
                          <li>Set a reasonable max_tokens limit to control response length</li>
                        </>
                      )}
                      
                      {selectedOperation === "embeddings" && (
                        <>
                          <li>Embeddings are useful for semantic search, clustering, and similarity detection</li>
                          <li>Store embeddings in a vector database for efficient retrieval</li>
                          <li>Normalize embeddings for better comparison results</li>
                        </>
                      )}
                      
                      {selectedOperation === "image-generation" && (
                        <>
                          <li>Use detailed, descriptive prompts for better image generation</li>
                          <li>Specify style details like "photorealistic" or "anime style" in your prompt</li>
                          <li>Different providers have different size options and capabilities</li>
                        </>
                      )}
                      
                      {selectedOperation === "image-understanding" && (
                        <>
                          <li>Provide high-quality images for better analysis</li>
                          <li>Ask specific questions about the image for more directed responses</li>
                          <li>Image URLs must be publicly accessible</li>
                        </>
                      )}
                      
                      {selectedOperation === "audio-transcription" && (
                        <>
                          <li>Provide high-quality audio for better transcription</li>
                          <li>Specify the language when known for improved accuracy</li>
                          <li>For multi-speaker audio, consider using diarization options if available</li>
                        </>
                      )}
                    </ul>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2">
              <ProviderLogo provider={selectedProvider} className="w-4 h-4 mr-1" />
              {providers.find(p => p.id === selectedProvider)?.name}
            </Badge>
            <Badge variant="outline">
              {operations[selectedOperation]}
            </Badge>
          </div>
          <Button variant="outline" onClick={() => window.open("https://docs.example.com/wrapper", "_blank")}>
            <span className="flex items-center gap-1">
              View API Wrapper Docs
              <ArrowRight className="h-4 w-4" />
            </span>
          </Button>
        </CardFooter>
      </Card>
      
      <div className="flex justify-center">
        <Button variant="default" size="lg" className="mt-4 px-8" onClick={() => window.open("https://docs.example.com/examples", "_blank")}>
          <BookOpen className="h-5 w-5 mr-2" />
          <span>Browse Complete Code Examples</span>
        </Button>
      </div>
    </div>
  );
};