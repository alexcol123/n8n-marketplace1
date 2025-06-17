"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { type OrderedWorkflowStep } from "@/utils/functions/WorkflowStepsInOrder";
import {
  Eye,
  EyeOff,
  Info,
  AlertTriangle,
  Settings,
  ChevronDown,
  ChevronUp,
  Zap,
  Hash,
  Code,
  Globe,
  Brain,
  Database,
  Mail,
  FileText,
  MessageCircle,
  User,
  Bot,
  MessageSquare,
  Check,
  Copy,
  Download,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import EditCardHelp from "./EditCardHelp";

interface AIMessage {
  role?: string;
  type?: string;
  content?: string;
  text?: string;
  message?: string;
}

interface UnifiedStepCardProps {
  step: OrderedWorkflowStep;
  stepNumber: number;
  onToggleExpanded?: (stepId: string, isExpanded: boolean) => void;
  isMarkedAsViewed?: boolean;
  isExpanded?: boolean; // Add external control of expanded state
  onExpand?: (stepId: string) => void; // Add callback for when this card wants to expand
}

export default function UnifiedStepCard({
  step,
  stepNumber,
  onToggleExpanded,
  isMarkedAsViewed = false,
  isExpanded = false, // Use external expanded state
  onExpand, // Callback for expansion requests
}: UnifiedStepCardProps) {
  const [showRawData, setShowRawData] = useState(false);
  const [copied, setCopied] = useState(false);
  const [nodeCopied, setNodeCopied] = useState(false);

  // Handle expansion toggle - this now requests expansion from parent
  const handleToggleExpanded = () => {
    if (isExpanded) {
      // If currently expanded, close it

      if (onExpand) {
        onExpand(step.id);
      }

      if (onToggleExpanded) {
        onToggleExpanded(step.id, false);
      }
    } else {
      // If currently closed, request to expand

      if (onExpand) {
        onExpand(step.id);
      }

      if (onToggleExpanded) {
        onToggleExpanded(step.id, true);
      }
    }
  };

  // Generate cURL command for HTTP nodes
  const generateCurlCommand = (): string => {
    if (!isHTTPNode() || !hasParameters) return "";

    const params = step.parameters;
    if (!params) return "";

    // Extract HTTP details from n8n HTTP node parameters
    const method = params.method || "GET";
    const url = params.url || "";
    const options = params.options || {};

    // Handle different body types in n8n
    let body = null;

    if (params.sendBody) {
      switch (params.specifyBody) {
        case "json":
          body = params.jsonBody;
          break;
        case "form":
          body = params.formData;
          break;
        case "string":
          body = params.bodyData;
          break;
        case "formData":
          body = params.multipartData;
          break;
        default:
          body = params.body || params.jsonBody;
      }
    }

    if (!url) return "";

    // Clean up n8n expression syntax in URL (={{ }} expressions)
    let cleanUrl = String(url).replace(/^=/, ""); // Remove leading = from expressions

    // Add query parameters from options
    if (options.qs && typeof options.qs === "object") {
      const queryString = new URLSearchParams(
        Object.entries(options.qs).reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      if (queryString) {
        cleanUrl += cleanUrl.includes("?")
          ? `&${queryString}`
          : `?${queryString}`;
      }
    }

    // Start building curl command
    let curl = "";

    // Only add method if it's not GET
    if (String(method).toUpperCase() !== "GET") {
      curl = `curl -X ${String(method).toUpperCase()} "${cleanUrl}"`;
    } else {
      curl = `curl "${cleanUrl}"`;
    }

    // Add headers from options
    if (options.headers && typeof options.headers === "object") {
      Object.entries(options.headers).forEach(([key, value]) => {
        if (value) {
          curl += ` \\\n  -H "${key}: ${String(value)}"`;
        }
      });
    }

    // Add Content-Type header if sending body and not already specified
    const bodyMethods = ["POST", "PUT", "PATCH"];
    if (body && bodyMethods.includes(String(method).toUpperCase())) {
      const hasContentType =
        options.headers &&
        Object.keys(options.headers).some(
          (key) => key.toLowerCase() === "content-type"
        );

      if (!hasContentType) {
        curl += ` \\\n  -H "Content-Type: application/json"`;
      }
    }

    // --- START OF MODIFIED SECTION ---

    // Add authentication placeholder based on type
    if (params.authentication && params.authentication !== "none") {
      if (
        params.genericAuthType === "httpHeaderAuth" ||
        params.genericAuthType === "httpCustomAuth"
      ) {
        // We ALWAYS use a clear, instructional placeholder for Authorization.
        curl += ` \\\n  -H "Authorization:  IMPORTANT_YOUR_REAL_API_KEY"`;
      } else if (params.genericAuthType === "httpBasicAuth") {
        curl += ` \\\n  -u "YOUR_USERNAME:YOUR_PASSWORD"`;
      } else if (params.genericAuthType === "oAuth2Api") {
        curl += ` \\\n  -H "Authorization:  IMPORTANT_YOUR_OAUTH_ACCESS_TOKEN"`;
      } else {
        // Generic auth placeholder
        curl += ` \\\n  -H "Authorization:  IMPORTANT_YOUR_REAL_API_KEY"`;
      }
    }

    // --- END OF MODIFIED SECTION ---

    // Add body for applicable methods
    if (body && bodyMethods.includes(String(method).toUpperCase())) {
      let bodyString = "";

      if (params.specifyBody === "formData" && typeof body === "object") {
        Object.entries(body).forEach(([key, value]) => {
          curl += ` \\\n  -F "${key}=${String(value)}"`;
        });
      } else if (params.specifyBody === "form" && typeof body === "object") {
        const formString = new URLSearchParams(
          Object.entries(body).reduce((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
          }, {} as Record<string, string>)
        ).toString();
        curl += ` \\\n  -d "${formString}"`;
      } else {
        if (typeof body === "string") {
          bodyString = body.replace(/^=/, "");
          try {
            const parsed = JSON.parse(bodyString);
            bodyString = JSON.stringify(parsed, null, 2);
          } catch {
            /* not valid JSON, leave as is */
          }
        } else {
          bodyString = JSON.stringify(body, null, 2);
        }

        // Use single quotes for the body to handle JSON double quotes easily
        curl += ` \\\n  -d '${bodyString}'`;
      }
    }

    return curl;
  };

  // Copy cURL to clipboard
  const copyToClipboard = async () => {
    const curlCommand = generateCurlCommand();
    if (!curlCommand) return;

    try {
      await navigator.clipboard.writeText(curlCommand);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  // Copy node data in n8n workflow format
  const copyNodeData = async () => {
    // Create single node in n8n workflow format
    const nodeData = {
      parameters: step.parameters || {},
      type: step.type,
      typeVersion: step.typeVersion || 1,
      position: step.position || [0, 0],
      id: step.id,
      name: step.name,
      ...(step.webhookId && { webhookId: step.webhookId }),
      ...(step.credentials && { credentials: step.credentials }),
    };

    // Wrap in n8n workflow format
    const workflowFormat = {
      nodes: [nodeData],
      connections: {},
      pinData: {},
      meta: {
        templateCredsSetupCompleted: true,
        instanceId: "copied-from-workflow-analyzer",
      },
    };

    try {
      await navigator.clipboard.writeText(
        JSON.stringify(workflowFormat, null, 2)
      );
      setNodeCopied(true);
      setTimeout(() => setNodeCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy node data to clipboard:", err);
    }
  };

  // Get clean node type display name
  const getNodeTypeDisplay = (type: string) => {
    const cleanType = type
      .replace(/^n8n-nodes-base\./, "")
      .replace(/([A-Z])/g, " $1")
      .trim();
    return cleanType.charAt(0).toUpperCase() + cleanType.slice(1);
  };

  // Get node category based on type
  const getNodeCategory = (type: string) => {
    const lowerType = type.toLowerCase();

    // HTTP/API nodes
    if (
      lowerType.includes("http") ||
      lowerType.includes("webhook") ||
      lowerType.includes("api")
    ) {
      return "http";
    }

    // AI/LLM nodes
    if (
      lowerType.includes("openai") ||
      lowerType.includes("anthropic") ||
      lowerType.includes("ai") ||
      lowerType.includes("llm") ||
      lowerType.includes("chatgpt") ||
      lowerType.includes("claude")
    ) {
      return "ai";
    }

    // Code/Function nodes
    if (
      lowerType.includes("code") ||
      lowerType.includes("function") ||
      lowerType.includes("javascript") ||
      lowerType.includes("python") ||
      lowerType.includes("script")
    ) {
      return "code";
    }

    // Database nodes
    if (
      lowerType.includes("mysql") ||
      lowerType.includes("postgres") ||
      lowerType.includes("mongo") ||
      lowerType.includes("database") ||
      lowerType.includes("sql") ||
      lowerType.includes("redis")
    ) {
      return "database";
    }

    // Email nodes
    if (
      lowerType.includes("email") ||
      lowerType.includes("gmail") ||
      lowerType.includes("outlook") ||
      lowerType.includes("smtp") ||
      lowerType.includes("mail")
    ) {
      return "email";
    }

    // File/Storage nodes
    if (
      lowerType.includes("file") ||
      lowerType.includes("csv") ||
      lowerType.includes("excel") ||
      lowerType.includes("google drive") ||
      lowerType.includes("dropbox") ||
      lowerType.includes("s3")
    ) {
      return "file";
    }

    // Social/Communication nodes
    if (
      lowerType.includes("slack") ||
      lowerType.includes("discord") ||
      lowerType.includes("telegram") ||
      lowerType.includes("whatsapp") ||
      lowerType.includes("twitter") ||
      lowerType.includes("teams")
    ) {
      return "social";
    }

    return "default";
  };

  // Check if this is an HTTP node
  const isHTTPNode = () => {
    return getNodeCategory(step.type) === "http";
  };

  // Get step color classes based on type, state, and viewed status
  const getStepColors = () => {
    // Base colors for viewed/completed state
    if (isMarkedAsViewed || isExpanded) {
      if (step.isDisconnected)
        return {
          border: "border-destructive/40",
          bg: "bg-destructive/10",
          headerBg: "bg-destructive/20",
          text: "text-destructive",
          category: "disconnected",
          isViewed: true,
        };

      if (step.isTrigger)
        return {
          border: "border-amber-500/40",
          bg: "bg-amber-500/10",
          headerBg: "bg-amber-500/20",
          text: "text-amber-600",
          category: "trigger",
          isViewed: true,
        };

      const category = getNodeCategory(step.type);

      switch (category) {
        case "http":
          return {
            border: "border-blue-500/40",
            bg: "bg-blue-500/10",
            headerBg: "bg-blue-500/20",
            text: "text-blue-600",
            category: "http",
            isViewed: true,
          };
        case "ai":
          return {
            border: "border-purple-500/40",
            bg: "bg-purple-500/10",
            headerBg: "bg-purple-500/20",
            text: "text-purple-600",
            category: "ai",
            isViewed: true,
          };
        case "code":
          return {
            border: "border-green-500/40",
            bg: "bg-green-500/10",
            headerBg: "bg-green-500/20",
            text: "text-green-600",
            category: "code",
            isViewed: true,
          };
        case "database":
          return {
            border: "border-orange-500/40",
            bg: "bg-orange-500/10",
            headerBg: "bg-orange-500/20",
            text: "text-orange-600",
            category: "database",
            isViewed: true,
          };
        case "email":
          return {
            border: "border-red-500/40",
            bg: "bg-red-500/10",
            headerBg: "bg-red-500/20",
            text: "text-red-600",
            category: "email",
            isViewed: true,
          };
        case "file":
          return {
            border: "border-indigo-500/40",
            bg: "bg-indigo-500/10",
            headerBg: "bg-indigo-500/20",
            text: "text-indigo-600",
            category: "file",
            isViewed: true,
          };
        case "social":
          return {
            border: "border-pink-500/40",
            bg: "bg-pink-500/10",
            headerBg: "bg-pink-500/20",
            text: "text-pink-600",
            category: "social",
            isViewed: true,
          };
        default:
          return {
            border: "border-primary/40",
            bg: "bg-primary/10",
            headerBg: "bg-primary/20",
            text: "text-primary",
            category: "default",
            isViewed: true,
          };
      }
    }

    // Default (non-viewed) colors - more subtle
    if (step.isDisconnected)
      return {
        border: "border-destructive/20",
        bg: "bg-destructive/5",
        headerBg: "bg-destructive/10",
        text: "text-destructive",
        category: "disconnected",
        isViewed: false,
      };

    if (step.isTrigger)
      return {
        border: "border-amber-500/20",
        bg: "bg-amber-500/5",
        headerBg: "bg-amber-500/10",
        text: "text-amber-600",
        category: "trigger",
        isViewed: false,
      };

    const category = getNodeCategory(step.type);

    switch (category) {
      case "http":
        return {
          border: "border-blue-500/20",
          bg: "bg-blue-500/5",
          headerBg: "bg-blue-500/10",
          text: "text-blue-600",
          category: "http",
          isViewed: false,
        };
      case "ai":
        return {
          border: "border-purple-500/20",
          bg: "bg-purple-500/5",
          headerBg: "bg-purple-500/10",
          text: "text-purple-600",
          category: "ai",
          isViewed: false,
        };
      case "code":
        return {
          border: "border-green-500/20",
          bg: "bg-green-500/5",
          headerBg: "bg-green-500/10",
          text: "text-green-600",
          category: "code",
          isViewed: false,
        };
      case "database":
        return {
          border: "border-orange-500/20",
          bg: "bg-orange-500/5",
          headerBg: "bg-orange-500/10",
          text: "text-orange-600",
          category: "database",
          isViewed: false,
        };
      case "email":
        return {
          border: "border-red-500/20",
          bg: "bg-red-500/5",
          headerBg: "bg-red-500/10",
          text: "text-red-600",
          category: "email",
          isViewed: false,
        };
      case "file":
        return {
          border: "border-indigo-500/20",
          bg: "bg-indigo-500/5",
          headerBg: "bg-indigo-500/10",
          text: "text-indigo-600",
          category: "file",
          isViewed: false,
        };
      case "social":
        return {
          border: "border-pink-500/20",
          bg: "bg-pink-500/5",
          headerBg: "bg-pink-500/10",
          text: "text-pink-600",
          category: "social",
          isViewed: false,
        };
      default:
        return {
          border: "border-primary/20",
          bg: "bg-primary/5",
          headerBg: "bg-primary/10",
          text: "text-primary",
          category: "default",
          isViewed: false,
        };
    }
  };

  // Get icon based on step type and category
  const getStepIcon = () => {
    if (step.isTrigger) return <Zap className="h-4 w-4 text-amber-500" />;
    if (step.isDisconnected)
      return <AlertTriangle className="h-4 w-4 text-destructive" />;

    const category = getNodeCategory(step.type);

    switch (category) {
      case "http":
        return <Globe className="h-4 w-4 text-blue-500" />;
      case "ai":
        return <Brain className="h-4 w-4 text-purple-500" />;
      case "code":
        return <Code className="h-4 w-4 text-green-500" />;
      case "database":
        return <Database className="h-4 w-4 text-orange-500" />;
      case "email":
        return <Mail className="h-4 w-4 text-red-500" />;
      case "file":
        return <FileText className="h-4 w-4 text-indigo-500" />;
      case "social":
        return <MessageCircle className="h-4 w-4 text-pink-500" />;
      default:
        return <Settings className="h-4 w-4 text-primary" />;
    }
  };

  // Check if this is an AI/LLM node for special prompt handling
  const isAINode = () => {
    return getNodeCategory(step.type) === "ai";
  };

  // Extract and format AI prompts (enhanced for nested structures)
  const getAIPrompts = () => {
    if (!isAINode() || !hasParameters) return null;

    interface NestedPrompt {
      path: string;
      content: string;
      type: "system" | "user" | "text";
    }

    interface AIMessage {
      role?: string;
      type?: string;
      content?: string;
      text?: string;
      message?: string;
    }

    const prompts = {
      system: "",
      user: "",
      assistant: "",
      messages: [] as AIMessage[],
      text: "",
      nestedPrompts: [] as NestedPrompt[],
    };

    // Function to recursively search for prompts in nested objects
    const findPromptsRecursively = (obj: unknown, path: string = "") => {
      if (typeof obj === "string" && obj.length > 50) {
        // Check if this looks like a prompt (long text content)
        const lowerPath = path.toLowerCase();
        if (lowerPath.includes("system") || lowerPath.includes("instruction")) {
          if (!prompts.system) prompts.system = obj;
        } else if (
          lowerPath.includes("user") ||
          lowerPath.includes("prompt") ||
          lowerPath.includes("text")
        ) {
          if (!prompts.user && !prompts.text) {
            if (lowerPath.includes("text")) {
              prompts.text = obj;
            } else {
              prompts.user = obj;
            }
          }
        }
        // Store all significant text content as nested prompts
        prompts.nestedPrompts.push({
          path: path || "root",
          content: obj,
          type: lowerPath.includes("system")
            ? "system"
            : lowerPath.includes("user") ||
              lowerPath.includes("prompt") ||
              lowerPath.includes("text")
            ? "user"
            : "text",
        });
      } else if (typeof obj === "object" && obj !== null) {
        Object.entries(obj).forEach(([key, value]) => {
          const newPath = path ? `${path}.${key}` : key;
          findPromptsRecursively(value, newPath);
        });
      }
    };

    // Common parameter names for different AI services
    const systemPromptKeys = [
      "systemMessage",
      "system_message",
      "systemPrompt",
      "system",
      "instructions",
    ];
    const userPromptKeys = [
      "prompt",
      "userMessage",
      "user_message",
      "input",
      "query",
      "text",
    ];
    const messagesKeys = ["messages", "conversation", "chat_history"];

    // First, try direct parameter extraction
    for (const key of systemPromptKeys) {
      if (step.parameters && step.parameters[key]) {
        prompts.system = String(step.parameters[key]);
        break;
      }
    }

    for (const key of userPromptKeys) {
      if (step.parameters && step.parameters[key]) {
        if (key === "text") {
          prompts.text = String(step.parameters[key]);
        } else {
          prompts.user = String(step.parameters[key]);
        }
        break;
      }
    }

    for (const key of messagesKeys) {
      if (
        step.parameters &&
        step.parameters[key] &&
        Array.isArray(step.parameters[key])
      ) {
        prompts.messages = step.parameters[key];
        break;
      }
    }

    // Then search recursively for nested prompts
    findPromptsRecursively(step.parameters);

    // Remove duplicates from nestedPrompts
    prompts.nestedPrompts = prompts.nestedPrompts.filter(
      (prompt, index, self) =>
        index === self.findIndex((p) => p.content === prompt.content)
    );

    return prompts;
  };

  // Format AI prompt display (show full text for tutorials)
  const formatAIPrompt = (text: string) => {
    if (!text) return "";
    return text.replace(/\n\s*\n/g, "\n").trim();
  };

  // Check if this is a code node
  const isCodeNode = () => {
    return getNodeCategory(step.type) === "code";
  };

  // Extract code content
  const getCodeContent = () => {
    if (!isCodeNode() || !hasParameters) return null;

    const codeKeys = [
      "jsCode",
      "code",
      "script",
      "pythonCode",
      "javascript",
      "workflowCode",
      "functionCode",
    ];

    for (const key of codeKeys) {
      if (
        step.parameters &&
        step.parameters[key] &&
        typeof step.parameters[key] === "string"
      ) {
        return {
          language: step.type.toLowerCase().includes("python")
            ? "python"
            : "javascript",
          code: String(step.parameters[key]),
          paramKey: key,
        };
      }
    }
    return null;
  };

  const colors = getStepColors();
  const hasParameters =
    step.parameters && Object.keys(step.parameters).length > 0;
  const parameterCount =
    hasParameters && step.parameters ? Object.keys(step.parameters).length : 0;

  return (
    <Card
      className={cn(
        "transition-all duration-300 pt-0",
        colors.border,
        colors.bg,
        colors.isViewed && "ring-2 ring-primary/20 shadow-md"
      )}
    >
      {/* Card Header - Always Visible */}
      <CardHeader className={cn("pb-3", colors.headerBg)}>
        <div className="flex items-start justify-between gap-3 mt-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {getStepIcon()}
              <h4 className="font-semibold text-lg truncate">{step.name}</h4>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className={cn("text-xs", colors.text)}>
                {getNodeTypeDisplay(step.type)}
              </Badge>

              {/* Viewed/Completed Status Badge */}
              {(isMarkedAsViewed || isExpanded) && (
                <Badge className="text-xs bg-green-500 hover:bg-green-600 text-white">
                  <Check className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              )}

              {/* Category Badge */}
              {colors.category !== "default" &&
                colors.category !== "trigger" &&
                colors.category !== "disconnected" && (
                  <Badge
                    className={cn("text-xs text-white capitalize", {
                      "bg-blue-500 hover:bg-blue-600":
                        colors.category === "http",
                      "bg-purple-500 hover:bg-purple-600":
                        colors.category === "ai",
                      "bg-green-500 hover:bg-green-600":
                        colors.category === "code",
                      "bg-orange-500 hover:bg-orange-600":
                        colors.category === "database",
                      "bg-red-500 hover:bg-red-600":
                        colors.category === "email",
                      "bg-indigo-500 hover:bg-indigo-600":
                        colors.category === "file",
                      "bg-pink-500 hover:bg-pink-600":
                        colors.category === "social",
                    })}
                  >
                    {colors.category}
                  </Badge>
                )}

              {step.isTrigger && (
                <Badge className="text-xs bg-amber-500 hover:bg-amber-600">
                  Trigger
                </Badge>
              )}

              {step.isStartingNode && !step.isTrigger && (
                <Badge className="text-xs bg-green-500 hover:bg-green-600">
                  Start
                </Badge>
              )}

              {step.isDisconnected && (
                <Badge variant="destructive" className="text-xs">
                  Disconnected
                </Badge>
              )}

              {hasParameters && (
                <Badge variant="secondary" className="text-xs">
                  {parameterCount} parameter{parameterCount !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isHTTPNode() && hasParameters && (
              <Button
                variant="destructive"
                size="sm"
                onClick={copyToClipboard}
                className="gap-1 text-xs"
                title="Copy as cURL command for testing"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    Copy cURL
                  </>
                )}
              </Button>
            )}

            {/* Export Node Button - Always show */}
            <Button
              variant="secondary"
              size="sm"
              onClick={copyNodeData}
              className="gap-2 text-xs font-medium bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-200 text-blue-700 shadow-sm"
              title="Copy this node to use in your own n8n workflow"
            >
              {nodeCopied ? (
                <>
                  <Check className="h-3 w-3" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Download className="h-3 w-3" />
                  Export Node
                </>
              )}
            </Button>

            {/* Copy cURL Button - Only show for HTTP steps */}

            {/* Show Details Button */}
            <Button
              variant="default"
              size="sm"
              onClick={handleToggleExpanded}
              className="transition-all duration-200"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3" />
                  Hide Details
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3" />
                  Show Details
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      {/* Card Content - Only Show When Expanded */}
      {isExpanded && (
        <CardContent className="pt-3">
          {/* Step Information Section =================>>>>>>>>>>>> */}

          <EditCardHelp step={step} />

          {/* Basic Information */}
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Node ID:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {step.id}
                </code>
              </div>

              <div className="flex items-center gap-2">
                <Code className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Type:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  {step.type}
                </code>
              </div>
            </div>

            {step.position && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Position:</span>
                <code className="bg-muted px-2 py-1 rounded text-xs">
                  x: {step.position[0]}, y: {step.position[1]}
                </code>
              </div>
            )}
          </div>

          {isHTTPNode() && hasParameters && copied && (
            <div>
              <Separator className="my-4" />
              <div className="space-y-3">
                <h5 className="font-medium flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-500" />
                  Generated cURL Command
                </h5>

                <div className="bg-slate-950 dark:bg-slate-900 p-4 rounded-lg border border-slate-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400"></div>
                      <span className="text-xs text-slate-400 font-mono">
                        HTTP Request
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(generateCurlCommand());
                      }}
                      className="h-6 px-2 text-xs text-slate-400 hover:text-slate-200"
                    >
                      Copy
                    </Button>
                  </div>

                  <ScrollArea className="h-40 w-full">
                    <pre className="text-sm text-slate-100 font-mono leading-relaxed whitespace-pre overflow-x-auto">
                      <code>{generateCurlCommand()}</code>
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </div>
          )}

          {/* Disconnected Warning */}
          {step.isDisconnected && (
            <div className="mt-3 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm font-medium">Disconnected Node</span>
              </div>
              <p className="text-xs text-destructive/80 mt-1">
                This node is not connected to the main workflow execution path
              </p>
            </div>
          )}

          {/* Code Section (Special handling for Code nodes) */}
          {isCodeNode() &&
            (() => {
              const codeContent = getCodeContent();
              return codeContent ? (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <h5 className="font-medium flex items-center gap-2">
                      <Code className="h-4 w-4 text-green-500" />
                      {codeContent.language === "python"
                        ? "Python Code"
                        : "JavaScript Code"}
                    </h5>

                    <div className="bg-slate-950 dark:bg-slate-900 p-4 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={cn("w-2 h-2 rounded-full", {
                              "bg-yellow-400":
                                codeContent.language === "javascript",
                              "bg-blue-400": codeContent.language === "python",
                            })}
                          ></div>
                          <span className="text-xs text-slate-400 font-mono">
                            {codeContent.paramKey} ({codeContent.language})
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(codeContent.code);
                          }}
                          className="h-6 px-2 text-xs text-slate-400 hover:text-slate-200"
                        >
                          Copy
                        </Button>
                      </div>

                      <ScrollArea className="h-80 w-full">
                        <pre className="text-sm text-slate-100 font-mono leading-relaxed whitespace-pre overflow-x-auto">
                          <code>{codeContent.code}</code>
                        </pre>
                      </ScrollArea>
                    </div>
                  </div>
                </>
              ) : null;
            })()}

          {/* AI Prompts Section (Special handling for AI nodes) */}
          {isAINode() &&
            (() => {
              const prompts = getAIPrompts();
              return prompts &&
                (prompts.system ||
                  prompts.user ||
                  prompts.text ||
                  prompts.messages.length > 0 ||
                  prompts.nestedPrompts.length > 0) ? (
                <>
                  <Separator className="my-4" />
                  <div className="space-y-3">
                    <h5 className="font-medium flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      AI Prompts & Messages
                    </h5>

                    <div className="space-y-3">
                      {/* System Message */}
                      {prompts.system && (
                        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-2">
                              <Settings className="h-3 w-3 text-slate-600 dark:text-slate-400" />
                              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                System Message
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {prompts.system.length} chars
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigator.clipboard.writeText(prompts.system)
                              }
                              className="h-6 px-2 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                            >
                              Copy
                            </Button>
                          </div>
                          <ScrollArea className="h-64 w-full">
                            <div className="p-4">
                              <pre className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans break-words">
                                {formatAIPrompt(prompts.system)}
                              </pre>
                            </div>
                          </ScrollArea>
                        </div>
                      )}

                      {/* User Prompt */}
                      {prompts.user && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 bg-blue-100 dark:bg-blue-900/40 border-b border-blue-200 dark:border-blue-800">
                            <div className="flex items-center gap-2">
                              <User className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                User Prompt
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {prompts.user.length} chars
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigator.clipboard.writeText(prompts.user)
                              }
                              className="h-6 px-2 text-xs text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                            >
                              Copy
                            </Button>
                          </div>
                          <ScrollArea className="h-64 w-full">
                            <div className="p-4">
                              <pre className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed whitespace-pre-wrap font-sans break-words">
                                {formatAIPrompt(prompts.user)}
                              </pre>
                            </div>
                          </ScrollArea>
                        </div>
                      )}

                      {/* Text Field (for nodes that use 'text' parameter) */}
                      {prompts.text && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg overflow-hidden">
                          <div className="flex items-center justify-between px-3 py-2 bg-emerald-100 dark:bg-emerald-900/40 border-b border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-2">
                              <FileText className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                                Text/Prompt Content
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {prompts.text.length} chars
                              </Badge>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigator.clipboard.writeText(prompts.text)
                              }
                              className="h-6 px-2 text-xs text-emerald-500 hover:text-emerald-700 dark:hover:text-emerald-300"
                            >
                              Copy
                            </Button>
                          </div>
                          <ScrollArea className="h-64 w-full">
                            <div className="p-4">
                              <pre className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed whitespace-pre-wrap font-sans break-words">
                                {formatAIPrompt(prompts.text)}
                              </pre>
                            </div>
                          </ScrollArea>
                        </div>
                      )}

                      {/* Nested Prompts (for complex parameter structures) */}
                      {prompts.nestedPrompts.length > 0 &&
                        !prompts.system &&
                        !prompts.user &&
                        !prompts.text && (
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <Brain className="h-3 w-3 text-purple-600" />
                              <span className="text-sm font-medium text-purple-600">
                                Detected Prompts ({prompts.nestedPrompts.length}
                                )
                              </span>
                            </div>

                            {prompts.nestedPrompts.map(
                              (nestedPrompt, index) => (
                                <div
                                  key={index}
                                  className={cn(
                                    "border rounded-lg overflow-hidden",
                                    {
                                      "bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700":
                                        nestedPrompt.type === "system",
                                      "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800":
                                        nestedPrompt.type === "user",
                                      "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800":
                                        nestedPrompt.type === "text",
                                    }
                                  )}
                                >
                                  <div className="flex items-center justify-between px-3 py-2 border-b border-current/10">
                                    <div className="flex items-center gap-2">
                                      {nestedPrompt.type === "system" && (
                                        <Settings className="h-3 w-3" />
                                      )}
                                      {nestedPrompt.type === "user" && (
                                        <User className="h-3 w-3" />
                                      )}
                                      {nestedPrompt.type === "text" && (
                                        <FileText className="h-3 w-3" />
                                      )}
                                      <span className="text-sm font-medium capitalize">
                                        {nestedPrompt.type} Content
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {nestedPrompt.path}
                                      </Badge>
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        {nestedPrompt.content.length} chars
                                      </Badge>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        navigator.clipboard.writeText(
                                          nestedPrompt.content
                                        )
                                      }
                                      className="h-6 px-2 text-xs opacity-70 hover:opacity-100"
                                    >
                                      Copy
                                    </Button>
                                  </div>
                                  <ScrollArea className="h-64 w-full">
                                    <div className="p-4">
                                      <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans break-words">
                                        {formatAIPrompt(nestedPrompt.content)}
                                      </pre>
                                    </div>
                                  </ScrollArea>
                                </div>
                              )
                            )}
                          </div>
                        )}

                      {/* Messages Array */}
                      {prompts.messages.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-3 w-3 text-purple-600" />
                              <span className="text-xs font-medium text-purple-600">
                                Conversation ({prompts.messages.length}{" "}
                                messages)
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                navigator.clipboard.writeText(
                                  JSON.stringify(prompts.messages, null, 2)
                                )
                              }
                              className="h-6 px-2 text-xs text-purple-500 hover:text-purple-700"
                            >
                              Copy All
                            </Button>
                          </div>

                          <div className="bg-gradient-to-b from-purple-50 to-purple-25 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-lg overflow-hidden">
                            <ScrollArea className="h-64 w-full">
                              <div className="p-3 space-y-3">
                                {prompts.messages.map(
                                  (message: AIMessage, index: number) => {
                                    const role =
                                      message.role || message.type || "unknown";
                                    const content =
                                      message.content ||
                                      message.text ||
                                      message.message ||
                                      String(message);

                                    return (
                                      <div
                                        key={index}
                                        className={cn("relative group", {
                                          "bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700":
                                            role === "system",
                                          "bg-blue-100 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700":
                                            role === "user",
                                          "bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-700":
                                            role === "assistant",
                                          "bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700":
                                            ![
                                              "system",
                                              "user",
                                              "assistant",
                                            ].includes(role),
                                        })}
                                      >
                                        <div className="flex items-center justify-between p-2 border-b border-current/10">
                                          <div className="flex items-center gap-2">
                                            {role === "system" && (
                                              <Settings className="h-3 w-3" />
                                            )}
                                            {role === "user" && (
                                              <User className="h-3 w-3" />
                                            )}
                                            {role === "assistant" && (
                                              <Bot className="h-3 w-3" />
                                            )}
                                            <span className="text-xs font-medium capitalize">
                                              {role}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                              #{index + 1}
                                            </span>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                              navigator.clipboard.writeText(
                                                String(content)
                                              )
                                            }
                                            className="h-5 px-1.5 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                          >
                                            Copy
                                          </Button>
                                        </div>
                                        <div className="p-3">
                                          <pre className="text-xs leading-relaxed whitespace-pre-wrap font-sans break-words">
                                            {formatAIPrompt(
                                              typeof content === "string"
                                                ? content
                                                : JSON.stringify(content)
                                            )}
                                          </pre>
                                        </div>
                                      </div>
                                    );
                                  }
                                )}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : null;
            })()}

          {/* Parameters Section */}
          {hasParameters && (
            <>
              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h5 className="font-medium flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    {isAINode()
                      ? "Configuration Parameters"
                      : "Node Parameters"}{" "}
                    ({parameterCount})
                  </h5>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRawData(!showRawData)}
                    className="gap-1 text-xs"
                  >
                    {showRawData ? (
                      <>
                        <EyeOff className="h-3 w-3" />
                        Hide Raw
                      </>
                    ) : (
                      <>
                        <Eye className="h-3 w-3" />
                        Show Raw
                      </>
                    )}
                  </Button>
                </div>

                {/* For AI nodes, filter out prompt-related parameters from the main view */}
                {(() => {
                  let filteredParams = step.parameters;

                  if (isAINode()) {
                    const promptKeys = [
                      "systemMessage",
                      "system_message",
                      "systemPrompt",
                      "system",
                      "instructions",
                      "prompt",
                      "userMessage",
                      "user_message",
                      "input",
                      "query",
                      "text",
                      "messages",
                      "conversation",
                      "chat_history",
                    ];
                    filteredParams = Object.fromEntries(
                      Object.entries(step.parameters || {}).filter(
                        ([key]) =>
                          !promptKeys.some((promptKey) =>
                            key.toLowerCase().includes(promptKey.toLowerCase())
                          )
                      )
                    );
                  } else if (isCodeNode()) {
                    // Filter out code-related parameters from the main parameters view
                    const codeKeys = [
                      "jsCode",
                      "code",
                      "script",
                      "pythonCode",
                      "javascript",
                      "workflowCode",
                      "functionCode",
                    ];
                    filteredParams = Object.fromEntries(
                      Object.entries(step.parameters || {}).filter(
                        ([key]) =>
                          !codeKeys.some((codeKey) =>
                            key.toLowerCase().includes(codeKey.toLowerCase())
                          )
                      )
                    );
                  }

                  const filteredParamCount = Object.keys(
                    filteredParams || {}
                  ).length;

                  if (filteredParamCount === 0) {
                    return (
                      <div className="text-center py-3 text-muted-foreground">
                        <Info className="h-5 w-5 mx-auto mb-2" />
                        <p className="text-sm">
                          {isAINode()
                            ? "All parameters are displayed in the AI prompts section above"
                            : isCodeNode()
                            ? "All parameters are displayed in the code section above"
                            : "No additional parameters configured"}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {showRawData ? (
                        // Raw JSON view
                        <div className="bg-muted/20 p-4 rounded-lg border">
                          <pre className="text-xs text-foreground overflow-x-auto whitespace-pre-wrap">
                            {JSON.stringify(
                              isAINode() ? filteredParams : step.parameters,
                              null,
                              2
                            )}
                          </pre>
                        </div>
                      ) : (
                        // Formatted view
                        <div className="space-y-2">
                          {Object.entries(filteredParams || {}).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="bg-muted/20 p-3 rounded border"
                              >
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <code className="text-xs font-medium bg-muted px-2 py-1 rounded">
                                    {key}
                                  </code>
                                  <Badge variant="outline" className="text-xs">
                                    {typeof value}
                                  </Badge>
                                </div>

                                <div className="mt-2">
                                  {typeof value === "object" &&
                                  value !== null ? (
                                    <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap">
                                      {JSON.stringify(value, null, 2)}
                                    </pre>
                                  ) : (
                                    <p className="text-xs text-foreground break-all">
                                      {String(value)}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </>
          )}

          {/* No Parameters Section - Show even when no parameters */}
          {!hasParameters && (
            <>
              <Separator className="my-4" />
              <div className="text-center py-6 text-muted-foreground">
                <Info className="h-8 w-8 mx-auto mb-3 opacity-50" />
                <h6 className="font-medium mb-1">No Configuration Required</h6>
                <p className="text-sm">
                  This node doesn&apos;t require any additional parameters to
                  function.
                </p>
              </div>
            </>
          )}

          {/* Additional Metadata */}
          <Separator className="my-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-muted-foreground">
            <div>
              <span className="font-medium">Step:</span> #{stepNumber}
            </div>
            <div>
              <span className="font-medium">Trigger:</span>{" "}
              {step.isTrigger ? "Yes" : "No"}
            </div>
            <div>
              <span className="font-medium">Connected:</span>{" "}
              {step.isDisconnected ? "No" : "Yes"}
            </div>
            <div>
              <span className="font-medium">Starting:</span>{" "}
              {step.isStartingNode ? "Yes" : "No"}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
