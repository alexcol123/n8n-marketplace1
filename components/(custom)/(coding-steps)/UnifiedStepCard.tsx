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
  ArrowRight,
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
  canEditSteps?: boolean;
  onExpand?: (stepId: string) => void; // Add callback for when this card wants to expand
}

export default function UnifiedStepCard({
  step,

  canEditSteps ,
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
  // Copy node data in n8n workflow format AND mark as completed
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

      // Mark step as completed when successfully exported
      if (onToggleExpanded) {
        onToggleExpanded(step.id, true); // Mark as viewed/completed
      }
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
        "transition-all duration-300 pt-0 relative overflow-hidden py-0 ",
        colors.border,
        colors.bg,
        colors.isViewed && "ring-2 ring-primary/20 shadow-md",
        // Completion styling - apply to entire card for proper coverage
        (isMarkedAsViewed || isExpanded) && [
          "bg-gradient-to-br from-green-50 via-emerald-50 to-green-50",
          "dark:from-green-950/30 dark:via-emerald-950/30 dark:to-green-950/30",
          "border-2 border-green-400/60 shadow-xl shadow-green-500/25",
          "dark:border-green-500/50 dark:shadow-green-400/15",
          // ✅ Removed the flashing animation lines
        ]
      )}
    >
      {/* Card Header - Always Visible */}
      <CardHeader
        className={cn(
          "pb-2 transition-all duration-300 relative z-10 py-4",
          colors.headerBg
        )}
      >
        <div className="flex flex-col gap-3">
          {/* Main Content Row */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div className="flex-1 min-w-0 order-2 sm:order-1">
              <div className="flex items-center gap-3 mb-2">
                {getStepIcon()}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-lg truncate">
                    {step.name}
                  </h4>
                  {/* Add helpful description based on node type */}
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {(() => {
                      const category = getNodeCategory(step.type);
                      switch (category) {
                        case "ai":
                          return "Processes text using AI/LLM models for chat, completion, or analysis";
                        case "http":
                          return "Makes HTTP requests to APIs and external services";
                        case "code":
                          return "Executes custom JavaScript or Python code logic";
                        case "database":
                          return "Connects to and queries databases for data operations";
                        case "email":
                          return "Sends, receives, or processes email messages";
                        case "file":
                          return "Handles file operations, uploads, downloads, and processing";
                        case "social":
                          return "Integrates with social platforms and messaging services";
                        default:
                          if (step.isTrigger) {
                            return "Starts the workflow when specific conditions are met";
                          }
                          return "Performs specialized workflow operations";
                      }
                    })()}
                  </p>
                </div>
              </div>

              {/* Enhanced Badge Row with Better Organization */}
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                {/* Primary Type Badge - Always First */}
                <Badge
                  variant="outline"
                  className={cn("text-xs font-medium", colors.text)}
                >
                  {getNodeTypeDisplay(step.type)}
                </Badge>

                {/* Category Badge - Second Priority */}
                {colors.category !== "default" &&
                colors.category !== "trigger" &&
                colors.category !== "disconnected" ? (
                  <Badge
                    className={cn("text-xs text-white capitalize font-medium", {
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
                ) : null}

                {/* Status Badges - High Priority Alerts */}
                {step.isTrigger ? (
                  <Badge className="text-xs bg-amber-500 hover:bg-amber-600 text-white font-medium">
                    <Zap className="h-3 w-3 mr-1" />
                    Trigger
                  </Badge>
                ) : null}

                {step.isDisconnected ? (
                  <Badge variant="destructive" className="text-xs font-medium">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Disconnected
                  </Badge>
                ) : null}

                {step.isStartingNode && !step.isTrigger ? (
                  <Badge className="text-xs bg-green-500 hover:bg-green-600 text-white font-medium">
                    <ArrowRight className="h-3 w-3 mr-1" />
                    Entry Point
                  </Badge>
                ) : null}

                {/* Configuration Info - Lower Priority */}
                {hasParameters ? (
                  <Badge variant="secondary" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    {parameterCount} config{parameterCount !== 1 ? "s" : ""}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="text-xs text-muted-foreground"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    No config needed
                  </Badge>
                )}

                {/* Add complexity indicator for AI and Code nodes */}
                {isAINode() &&
                  (() => {
                    const prompts = getAIPrompts();
                    if (
                      prompts &&
                      (prompts.system || prompts.user || prompts.text)
                    ) {
                      const totalChars =
                        (prompts.system?.length || 0) +
                        (prompts.user?.length || 0) +
                        (prompts.text?.length || 0);
                      const estimatedTokens = Math.ceil(totalChars / 4);
                      if (estimatedTokens > 0) {
                        return (
                          <Badge variant="outline" className="text-xs">
                            <Brain className="h-3 w-3 mr-1" />~
                            {estimatedTokens.toLocaleString()} tokens
                          </Badge>
                        );
                      }
                    }
                    return null;
                  })()}

                {isCodeNode() &&
                  (() => {
                    const codeContent = getCodeContent();
                    if (codeContent) {
                      const lines = codeContent.code.split("\n").length;
                      return (
                        <Badge variant="outline" className="text-xs">
                          <Code className="h-3 w-3 mr-1" />
                          {lines} lines
                        </Badge>
                      );
                    }
                    return null;
                  })()}
              </div>
            </div>
          </div>

          <Separator className="my-2" />

          {/* Enhanced Action Buttons with Better Hierarchy */}

          <div className="flex flex-col gap-2 order-1 sm:order-2 sm:flex-row sm:justify-end">
            <div className="flex gap-2 sm:gap-4 flex-wrap justify-stretch sm:justify-end">
              {/* Primary Action - Most Important */}
              {isHTTPNode() && hasParameters ? (
                <Button
                  variant="default"
                  size="sm"
                  onClick={copyToClipboard}
                  className="gap-2 text-xs bg-blue-600 hover:bg-blue-700 text-white min-w-[100px] flex-1 sm:flex-none"
                  title="Copy as cURL command for testing this HTTP request"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">Copied cURL!</span>
                    </>
                  ) : (
                    <>
                      <Globe className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">
                        <span className="hidden sm:inline">Test with </span>cURL
                      </span>
                    </>
                  )}
                </Button>
              ) : null}

              {/* Secondary Action - Export Node */}
              <Button
                variant="secondary"
                size="sm"
                onClick={copyNodeData}
                className="gap-2 text-xs font-medium bg-gradient-to-r from-emerald-50 to-green-50 hover:from-emerald-100 hover:to-green-100 border-emerald-200 text-emerald-700 shadow-sm min-w-[100px] flex-1 sm:flex-none"
                title="Copy this node configuration to use in your own n8n workflow"
              >
                {nodeCopied ? (
                  <>
                    <Check className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">Exported!</span>
                  </>
                ) : (
                  <>
                    <Download className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">
                      Export<span className="hidden sm:inline"> Node</span>
                    </span>
                  </>
                )}
              </Button>

              {/* Tertiary Action - Expand/Collapse */}
              <Button
                variant="destructive"
                size="sm"
                onClick={handleToggleExpanded}
                className="transition-all duration-200 gap-2 hover:bg-muted/50 min-w-[90px] flex-1 sm:flex-none"
                title={
                  isExpanded
                    ? "Hide detailed configuration"
                    : "Show detailed configuration and code"
                }
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">
                      Hide<span className="hidden sm:inline"> Details</span>
                    </span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">
                      View<span className="hidden sm:inline"> Details</span>
                    </span>
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Add Connection Hints for Better Workflow Building */}
          {!isExpanded &&
          step.connectionInfo &&
          (step.connectionInfo.nextSteps.length > 0 ||
            step.connectionInfo.previousSteps.length > 0) ? (
            <div className="mt-2 p-2 bg-muted/30 rounded-lg border border-muted/50">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <ArrowRight className="h-3 w-3" />
                <span className="font-medium">Connections:</span>
                {step.connectionInfo.previousSteps.length > 0 && (
                  <span>
                    ← {step.connectionInfo.previousSteps.length} input
                    {step.connectionInfo.previousSteps.length !== 1 ? "s" : ""}
                  </span>
                )}
                {step.connectionInfo.nextSteps.length > 0 && (
                  <span>
                    → {step.connectionInfo.nextSteps.length} output
                    {step.connectionInfo.nextSteps.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </CardHeader>

      {/* Card Content - Only Show When Expanded */}
      {isExpanded ? (
        <CardContent className="py-6">
          {/* Step Information Section =================>>>>>>>>>>>> */}

          <EditCardHelp step={step}  canEditSteps={canEditSteps} />

          {/* Basic Information section removed - users don't need to see technical IDs and positions */}

          {/* cURL Command Section - Enhanced Visibility */}
          {isHTTPNode() && hasParameters && copied ? (
            <div className="mt-6">
              <Separator className="my-4" />
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h5 className="font-semibold text-base">
                      Generated cURL Command
                    </h5>
                    <p className="text-xs text-muted-foreground">
                      Ready to test in your terminal
                    </p>
                  </div>
                </div>

                <div className="bg-slate-950 dark:bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-900 dark:bg-slate-800 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        Terminal
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(generateCurlCommand());
                      }}
                      className="h-7 px-3 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                    >
                      <Copy className="h-3 w-3 mr-1" />
                      Copy
                    </Button>
                  </div>

                  <ScrollArea className="h-48 w-full">
                    <pre className="p-4 text-sm text-slate-100 font-mono leading-relaxed whitespace-pre overflow-x-auto">
                      <code>{generateCurlCommand()}</code>
                    </pre>
                  </ScrollArea>
                </div>
              </div>
            </div>
          ) : null}

          {/* Disconnected Warning - Enhanced Alert */}
          {step.isDisconnected ? (
            <div className="mt-6">
              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-xl">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                  </div>
                  <div className="space-y-1">
                    <h6 className="font-semibold text-destructive">
                      Disconnected Node
                    </h6>
                    <p className="text-sm text-destructive/80">
                      This node is not connected to the main workflow execution
                      path. It won't run unless you connect it properly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Code Section - Enhanced Code Display */}
          {isCodeNode()
            ? (() => {
                const codeContent = getCodeContent();
                return codeContent ? (
                  <div className="mt-6">
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                          <Code className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-base">
                            {codeContent.language === "python"
                              ? "Python Code"
                              : "JavaScript Code"}
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            Custom code execution in {codeContent.language}
                          </p>
                        </div>
                      </div>

                      <div className="bg-slate-950 dark:bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 dark:bg-slate-800 border-b border-slate-700">
                          <div className="flex items-center gap-3">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div
                                className={cn("w-2 h-2 rounded-full", {
                                  "bg-yellow-400":
                                    codeContent.language === "javascript",
                                  "bg-blue-400":
                                    codeContent.language === "python",
                                })}
                              ></div>
                              <span className="text-xs text-slate-400 font-mono">
                                {codeContent.paramKey}.
                                {codeContent.language === "python"
                                  ? "py"
                                  : "js"}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(codeContent.code);
                            }}
                            className="h-7 px-3 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors"
                          >
                            <Copy className="h-3 w-3 mr-1" />
                            Copy
                          </Button>
                        </div>

                        <ScrollArea className="h-96 w-full">
                          <pre className="p-4 text-sm text-slate-100 font-mono leading-relaxed whitespace-pre overflow-x-auto">
                            <code>{codeContent.code}</code>
                          </pre>
                        </ScrollArea>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()
            : null}

          {/* AI Prompts Section - Enhanced AI Content Display */}
          {isAINode()
            ? (() => {
                const prompts = getAIPrompts();
                return prompts &&
                  (prompts.system ||
                    prompts.user ||
                    prompts.text ||
                    prompts.messages.length > 0 ||
                    prompts.nestedPrompts.length > 0) ? (
                  <div className="mt-6">
                    <Separator className="my-4" />
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                          <Brain className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h5 className="font-semibold text-base">
                            AI Prompts & Messages
                          </h5>
                          <p className="text-xs text-muted-foreground">
                            System instructions and user prompts for AI
                            processing
                          </p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {/* System Message - Enhanced Card */}
                        {prompts.system ? (
                          <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/50 dark:to-slate-800/30 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-100/70 dark:bg-slate-800/70 border-b border-slate-200 dark:border-slate-700">
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg">
                                  <Settings className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                    System Instructions
                                  </span>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <Badge
                                      variant="outline"
                                      className="text-xs h-5"
                                    >
                                      {prompts.system.length.toLocaleString()}{" "}
                                      chars
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs h-5"
                                    >
                                      {Math.ceil(prompts.system.length / 4)}{" "}
                                      tokens
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigator.clipboard.writeText(prompts.system)
                                }
                                className="h-7 px-3 text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <ScrollArea className="h-80 w-full">
                              <div className="p-4">
                                <pre className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap font-sans break-words">
                                  {formatAIPrompt(prompts.system)}
                                </pre>
                              </div>
                            </ScrollArea>
                          </div>
                        ) : null}

                        {/* User Prompt - Enhanced Card */}
                        {prompts.user ? (
                          <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/10 border border-blue-200 dark:border-blue-800 rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-blue-100/70 dark:bg-blue-900/40 border-b border-blue-200 dark:border-blue-800">
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-blue-200 dark:bg-blue-800 rounded-lg">
                                  <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                    User Prompt
                                  </span>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <Badge
                                      variant="outline"
                                      className="text-xs h-5"
                                    >
                                      {prompts.user.length.toLocaleString()}{" "}
                                      chars
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs h-5"
                                    >
                                      {Math.ceil(prompts.user.length / 4)}{" "}
                                      tokens
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigator.clipboard.writeText(prompts.user)
                                }
                                className="h-7 px-3 text-xs text-blue-600 hover:text-blue-700 dark:hover:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <ScrollArea className="h-80 w-full">
                              <div className="p-4">
                                <pre className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed whitespace-pre-wrap font-sans break-words">
                                  {formatAIPrompt(prompts.user)}
                                </pre>
                              </div>
                            </ScrollArea>
                          </div>
                        ) : null}

                        {/* Text Field - Enhanced Card */}
                        {prompts.text ? (
                          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-800/10 border border-emerald-200 dark:border-emerald-800 rounded-xl overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-emerald-100/70 dark:bg-emerald-900/40 border-b border-emerald-200 dark:border-emerald-800">
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-emerald-200 dark:bg-emerald-800 rounded-lg">
                                  <FileText className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                                    Text Content
                                  </span>
                                  <div className="flex items-center gap-2 mt-0.5">
                                    <Badge
                                      variant="outline"
                                      className="text-xs h-5"
                                    >
                                      {prompts.text.length.toLocaleString()}{" "}
                                      chars
                                    </Badge>
                                    <Badge
                                      variant="outline"
                                      className="text-xs h-5"
                                    >
                                      {Math.ceil(prompts.text.length / 4)}{" "}
                                      tokens
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigator.clipboard.writeText(prompts.text)
                                }
                                className="h-7 px-3 text-xs text-emerald-600 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy
                              </Button>
                            </div>
                            <ScrollArea className="h-80 w-full">
                              <div className="p-4">
                                <pre className="text-sm text-emerald-700 dark:text-emerald-300 leading-relaxed whitespace-pre-wrap font-sans break-words">
                                  {formatAIPrompt(prompts.text)}
                                </pre>
                              </div>
                            </ScrollArea>
                          </div>
                        ) : null}

                        {/* Messages Array - Enhanced Conversation View */}
                        {prompts.messages.length > 0 ? (
                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                              <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-purple-200 dark:bg-purple-800 rounded-lg">
                                  <MessageSquare className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <div>
                                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                    Conversation History
                                  </span>
                                  <p className="text-xs text-purple-600 dark:text-purple-400">
                                    {prompts.messages.length} messages
                                  </p>
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    JSON.stringify(prompts.messages, null, 2)
                                  )
                                }
                                className="h-7 px-3 text-xs text-purple-600 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-800 transition-colors"
                              >
                                <Copy className="h-3 w-3 mr-1" />
                                Copy All
                              </Button>
                            </div>

                            <div className="bg-gradient-to-b from-purple-50 to-purple-25 dark:from-purple-900/20 dark:to-purple-900/10 border border-purple-200 dark:border-purple-800 rounded-xl overflow-hidden">
                              <ScrollArea className="h-80 w-full">
                                <div className="p-4 space-y-3">
                                  {prompts.messages.map(
                                    (message: AIMessage, index: number) => {
                                      const role =
                                        message.role ||
                                        message.type ||
                                        "unknown";
                                      const content =
                                        message.content ||
                                        message.text ||
                                        message.message ||
                                        String(message);

                                      return (
                                        <div
                                          key={index}
                                          className={cn(
                                            "relative group rounded-lg border overflow-hidden",
                                            {
                                              "bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700":
                                                role === "system",
                                              "bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-700":
                                                role === "user",
                                              "bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-700":
                                                role === "assistant",
                                              "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700":
                                                ![
                                                  "system",
                                                  "user",
                                                  "assistant",
                                                ].includes(role),
                                            }
                                          )}
                                        >
                                          <div className="flex items-center justify-between p-3 border-b border-current/10">
                                            <div className="flex items-center gap-2">
                                              {role === "system" ? (
                                                <Settings className="h-3.5 w-3.5" />
                                              ) : null}
                                              {role === "user" ? (
                                                <User className="h-3.5 w-3.5" />
                                              ) : null}
                                              {role === "assistant" ? (
                                                <Bot className="h-3.5 w-3.5" />
                                              ) : null}
                                              <span className="text-sm font-medium capitalize">
                                                {role}
                                              </span>
                                              <Badge
                                                variant="outline"
                                                className="text-xs h-5"
                                              >
                                                #{index + 1}
                                              </Badge>
                                            </div>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              onClick={() =>
                                                navigator.clipboard.writeText(
                                                  String(content)
                                                )
                                              }
                                              className="h-6 px-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                              <Copy className="h-3 w-3" />
                                            </Button>
                                          </div>
                                          <div className="p-3">
                                            <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans break-words">
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
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null;
              })()
            : null}

          {/* Parameters Section - Enhanced Layout */}
          {hasParameters ? (
            <div className="mt-6">
              <Separator className="my-4" />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Settings className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h5 className="font-semibold text-base">
                        {isAINode()
                          ? "Configuration Parameters"
                          : "Node Parameters"}
                      </h5>
                      <p className="text-xs text-muted-foreground">
                        {parameterCount} parameter
                        {parameterCount !== 1 ? "s" : ""} configured
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowRawData(!showRawData)}
                    className="gap-2 text-xs h-8 px-3"
                  >
                    {showRawData ? (
                      <>
                        <EyeOff className="h-3.5 w-3.5" />
                        Hide Raw
                      </>
                    ) : (
                      <>
                        <Eye className="h-3.5 w-3.5" />
                        Show Raw
                      </>
                    )}
                  </Button>
                </div>

                {/* Parameters Content */}
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
                      <div className="text-center py-8 text-muted-foreground">
                        <div className="p-3 bg-muted/30 rounded-lg w-fit mx-auto mb-3">
                          <Info className="h-6 w-6 opacity-50" />
                        </div>
                        <h6 className="font-medium mb-1">
                          All Parameters Displayed Above
                        </h6>
                        <p className="text-sm">
                          {isAINode()
                            ? "All parameters are shown in the AI prompts section"
                            : isCodeNode()
                            ? "All parameters are shown in the code section"
                            : "No additional parameters configured"}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div className="space-y-3">
                      {showRawData ? (
                        <div className="bg-slate-950 dark:bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-3 bg-slate-900 dark:bg-slate-800 border-b border-slate-700">
                            <div className="flex items-center gap-2">
                              <Code className="h-4 w-4 text-slate-400" />
                              <span className="text-sm font-medium text-slate-300">
                                Raw JSON
                              </span>
                            </div>
                          </div>
                          <ScrollArea className="h-80 w-full">
                            <pre className="p-4 text-sm text-slate-100 overflow-x-auto whitespace-pre-wrap font-mono">
                              {JSON.stringify(
                                isAINode() ? filteredParams : step.parameters,
                                null,
                                2
                              )}
                            </pre>
                          </ScrollArea>
                        </div>
                      ) : (
                        <div className="grid gap-3">
                          {Object.entries(filteredParams || {}).map(
                            ([key, value]) => (
                              <div
                                key={key}
                                className="p-4 bg-muted/30 rounded-lg border border-muted/50 hover:bg-muted/40 transition-colors"
                              >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <div className="flex items-center gap-2">
                                    <code className="text-sm font-semibold bg-primary/10 text-primary px-2 py-1 rounded">
                                      {key}
                                    </code>
                                    <Badge
                                      variant="outline"
                                      className="text-xs h-5"
                                    >
                                      {typeof value}
                                    </Badge>
                                  </div>
                                </div>

                                <div className="mt-2">
                                  {typeof value === "object" &&
                                  value !== null ? (
                                    <ScrollArea className="h-32 w-full">
                                      <pre className="text-xs text-muted-foreground overflow-x-auto whitespace-pre-wrap font-mono p-2 bg-muted/50 rounded border">
                                        {JSON.stringify(value, null, 2)}
                                      </pre>
                                    </ScrollArea>
                                  ) : (
                                    <div className="p-2 bg-muted/50 rounded border">
                                      <p className="text-sm text-foreground break-all font-mono">
                                        {String(value)}
                                      </p>
                                    </div>
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
            </div>
          ) : null}

          {/* No Parameters Section - Enhanced Empty State */}
          {!hasParameters ? (
            <div className="mt-6">
              <Separator className="my-4" />
              <div className="text-center py-8 text-muted-foreground">
                <div className="p-4 bg-muted/30 rounded-xl w-fit mx-auto mb-4">
                  <Info className="h-8 w-8 opacity-50" />
                </div>
                <h6 className="font-semibold mb-2">
                  No Configuration Required
                </h6>
                <p className="text-sm max-w-md mx-auto">
                  This node works out of the box without any additional
                  parameters or configuration.
                </p>
              </div>
            </div>
          ) : null}

          {/* Additional Metadata section removed - users don't need to see technical node status info */}
        </CardContent>
      ) : null}
    </Card>
  );
}
