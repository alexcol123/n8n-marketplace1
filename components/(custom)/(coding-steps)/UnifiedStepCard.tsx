"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Separator } from "@/components/ui/separator";
import {
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
  Check,
  Download,
  ArrowRight,
  Play,
  Sparkles,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { type OrderedWorkflowStep } from "@/utils/functions/WorkflowStepsInOrder";
import { getDefaultNodeImage } from "@/utils/functions/getDefaultNodeImage";
import EditCardHelp from "./EditCardHelp";
import NodeDetailsSection from "../(UnifiedStepCardParts)/NodeDetailsSection";
import NodeDocumentationSection from "../(UnifiedStepCardParts)/NodeDocumentationSection";

// Mock interfaces to match the original
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
  isExpanded?: boolean;
  canEditSteps?: boolean;
  onExpand?: (stepId: string) => void;
  guideData?: any;
}

export default function UnifiedStepCard({
  step,
  stepNumber,
  canEditSteps,
  onToggleExpanded,
  isMarkedAsViewed = false,
  isExpanded = false,
  onExpand,
  guideData,
}: UnifiedStepCardProps) {
  const [nodeCopied, setNodeCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const nodeImage = getDefaultNodeImage(step.type);

  // Handle expansion toggle
  const handleToggleExpanded = () => {
    if (isExpanded) {
      if (onExpand) onExpand(step.id);
      if (onToggleExpanded) onToggleExpanded(step.id, false);
    } else {
      if (onExpand) onExpand(step.id);
      if (onToggleExpanded) onToggleExpanded(step.id, true);
    }
  };

  // Copy node data functionality
  const copyNodeData = async () => {
    const nodeData: Record<string, unknown> = {
      parameters: step.parameters || {},
      type: step.type,
      typeVersion: step.typeVersion || 1,
      position: step.position || [0, 0],
      id: step.id,
      name: step.name,
    };

    if (step.webhookId) nodeData.webhookId = step.webhookId;
    if (step.credentials) nodeData.credentials = step.credentials;

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
      if (onToggleExpanded) onToggleExpanded(step.id, true);
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

  // Get node category
  const getNodeCategory = (type: string) => {
    const lowerType = type.toLowerCase();
    if (
      lowerType.includes("http") ||
      lowerType.includes("webhook") ||
      lowerType.includes("api")
    )
      return "http";
    if (
      lowerType.includes("openai") ||
      lowerType.includes("anthropic") ||
      lowerType.includes("ai") ||
      lowerType.includes("llm") ||
      lowerType.includes("chatgpt") ||
      lowerType.includes("claude")
    )
      return "ai";
    if (
      lowerType.includes("code") ||
      lowerType.includes("function") ||
      lowerType.includes("javascript") ||
      lowerType.includes("python") ||
      lowerType.includes("script")
    )
      return "code";
    if (
      lowerType.includes("mysql") ||
      lowerType.includes("postgres") ||
      lowerType.includes("mongo") ||
      lowerType.includes("database") ||
      lowerType.includes("sql") ||
      lowerType.includes("redis")
    )
      return "database";
    if (
      lowerType.includes("email") ||
      lowerType.includes("gmail") ||
      lowerType.includes("outlook") ||
      lowerType.includes("smtp") ||
      lowerType.includes("mail")
    )
      return "email";
    if (
      lowerType.includes("file") ||
      lowerType.includes("csv") ||
      lowerType.includes("excel") ||
      lowerType.includes("google drive") ||
      lowerType.includes("dropbox") ||
      lowerType.includes("s3")
    )
      return "file";
    if (
      lowerType.includes("slack") ||
      lowerType.includes("discord") ||
      lowerType.includes("telegram") ||
      lowerType.includes("whatsapp") ||
      lowerType.includes("twitter") ||
      lowerType.includes("teams")
    )
      return "social";
    return "default";
  };

  // Get category colors and themes (enhanced version)
  const getCategoryTheme = () => {
    const category = getNodeCategory(step.type);

    if (step.isDisconnected) {
      return {
        gradient: "from-red-500/10 via-red-50 to-red-100/50",
        darkGradient:
          "dark:from-red-950/20 dark:via-red-900/10 dark:to-red-950/30",
        border: "border-red-200 dark:border-red-800",
        accent: "bg-red-500",
        icon: AlertTriangle,
        iconColor: "text-red-500",
        category: "Error",
      };
    }

    if (step.isTrigger) {
      return {
        gradient: "from-amber-500/10 via-amber-50 to-amber-100/50",
        darkGradient:
          "dark:from-amber-950/20 dark:via-amber-900/10 dark:to-amber-950/30",
        border: "border-amber-200 dark:border-amber-800",
        accent: "bg-amber-500",
        icon: Zap,
        iconColor: "text-amber-500",
        category: "Trigger",
      };
    }

    const themes = {
      http: {
        gradient: "from-blue-500/10 via-blue-50 to-blue-100/50",
        darkGradient:
          "dark:from-blue-950/20 dark:via-blue-900/10 dark:to-blue-950/30",
        border: "border-blue-200 dark:border-blue-800",
        accent: "bg-blue-500",
        icon: Globe,
        iconColor: "text-blue-500",
        category: "API",
      },
      ai: {
        gradient: "from-purple-500/10 via-purple-50 to-purple-100/50",
        darkGradient:
          "dark:from-purple-950/20 dark:via-purple-900/10 dark:to-purple-950/30",
        border: "border-purple-200 dark:border-purple-800",
        accent: "bg-purple-500",
        icon: Brain,
        iconColor: "text-purple-500",
        category: "AI",
      },
      code: {
        gradient: "from-green-500/10 via-green-50 to-green-100/50",
        darkGradient:
          "dark:from-green-950/20 dark:via-green-900/10 dark:to-green-950/30",
        border: "border-green-200 dark:border-green-800",
        accent: "bg-green-500",
        icon: Code,
        iconColor: "text-green-500",
        category: "Code",
      },
      database: {
        gradient: "from-orange-500/10 via-orange-50 to-orange-100/50",
        darkGradient:
          "dark:from-orange-950/20 dark:via-orange-900/10 dark:to-orange-950/30",
        border: "border-orange-200 dark:border-orange-800",
        accent: "bg-orange-500",
        icon: Database,
        iconColor: "text-orange-500",
        category: "Database",
      },
      email: {
        gradient: "from-red-500/10 via-red-50 to-red-100/50",
        darkGradient:
          "dark:from-red-950/20 dark:via-red-900/10 dark:to-red-950/30",
        border: "border-red-200 dark:border-red-800",
        accent: "bg-red-500",
        icon: Mail,
        iconColor: "text-red-500",
        category: "Email",
      },
      file: {
        gradient: "from-indigo-500/10 via-indigo-50 to-indigo-100/50",
        darkGradient:
          "dark:from-indigo-950/20 dark:via-indigo-900/10 dark:to-indigo-950/30",
        border: "border-indigo-200 dark:border-indigo-800",
        accent: "bg-indigo-500",
        icon: FileText,
        iconColor: "text-indigo-500",
        category: "File",
      },
      social: {
        gradient: "from-pink-500/10 via-pink-50 to-pink-100/50",
        darkGradient:
          "dark:from-pink-950/20 dark:via-pink-900/10 dark:to-pink-950/30",
        border: "border-pink-200 dark:border-pink-800",
        accent: "bg-pink-500",
        icon: MessageCircle,
        iconColor: "text-pink-500",
        category: "Social",
      },
      default: {
        gradient: "from-slate-500/10 via-slate-50 to-slate-100/50",
        darkGradient:
          "dark:from-slate-950/20 dark:via-slate-900/10 dark:to-slate-950/30",
        border: "border-slate-200 dark:border-slate-800",
        accent: "bg-slate-500",
        icon: Settings,
        iconColor: "text-slate-500",
        category: "Tool",
      },
    };

    return themes[category] || themes.default;
  };

  // Check if AI node
  const isAINode = () => getNodeCategory(step.type) === "ai";
  const isCodeNode = () => getNodeCategory(step.type) === "code";

  // Extract and format AI prompts (enhanced for nested structures)
  const getAIPrompts = () => {
    if (!isAINode() || !step.parameters) return null;

    interface NestedPrompt {
      path: string;
      content: string;
      type: "system" | "user" | "text";
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
        prompts.messages = step.parameters[key] as AIMessage[];
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

  // Format AI prompt display
  const formatAIPrompt = (text: string) => {
    if (!text) return "";
    return text.replace(/\n\s*\n/g, "\n").trim();
  };

  // Get code content
  const getCodeContent = () => {
    if (!isCodeNode() || !step.parameters) return null;

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

  const theme = getCategoryTheme();
  const hasParameters =
    step.parameters && Object.keys(step.parameters).length > 0;
  const parameterCount =
    hasParameters && step.parameters ? Object.keys(step.parameters).length : 0;

  const IconComponent = theme.icon;

  return (
    <div
      className={cn(
        "group relative transition-all duration-500 ease-out",
        isExpanded && "z-10"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glow effect for completed/viewed items */}
      {(isMarkedAsViewed || isExpanded) && (
        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 via-blue-400/20 to-purple-400/20 rounded-2xl blur-xl opacity-60" />
      )}

      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-500 ease-out border-2",
          "bg-gradient-to-br",
          theme.gradient,
          theme.darkGradient,
          theme.border,
          "shadow-lg hover:shadow-xl",
          isExpanded && "shadow-2xl scale-[1.02]",
          (isMarkedAsViewed || isExpanded) && [
            "bg-gradient-to-br from-emerald-50/80 via-blue-50/40 to-purple-50/80",
            "dark:from-emerald-950/40 dark:via-blue-950/20 dark:to-purple-950/40",
            "border-emerald-300/60 dark:border-emerald-700/60",
            "shadow-emerald-500/25 dark:shadow-emerald-400/15",
          ]
        )}
      >
        {/* Accent strip */}
        <div
          className={cn("absolute top-0 left-0 right-0 h-1", theme.accent)}
        />

        {/* Step number indicator */}
        <div className="absolute top-3 left-3 z-20">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg",
              theme.accent
            )}
          >
            {stepNumber}
          </div>
        </div>

        {/* Completion indicator */}
        {(isMarkedAsViewed || isExpanded) && (
          <div className="absolute top-3 right-3 z-20">
            <div className="relative">
              <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                <Check className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-40" />
            </div>
          </div>
        )}

        <CardHeader className="pb-4 pt-6 pl-14 pr-4">
          <div className="flex items-start gap-4">
            {/* Icon and category indicator */}
            <div className="relative flex-shrink-0">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300",
                  "bg-white/80 dark:bg-slate-800/80 shadow-lg border-2 border-white/60 dark:border-slate-700/60",
                  isHovered && "scale-110 shadow-xl"
                )}
              >
                <IconComponent className={cn("w-7 h-7", theme.iconColor)} />
              </div>

              {/* Category badge */}
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white shadow-md",
                  theme.accent
                )}
              >
                {theme.category}
              </div>
            </div>

            {/* Main content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate mb-1">
                    {step.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                    {typeof step.stepDescription === "string"
                      ? (step.stepDescription as string)
                      : ""}
                  </p>

                  {/* Enhanced badges section - moved right under subtitle */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className="text-sm font-medium bg-white/60 dark:bg-slate-800/60"
                    >
                      {getNodeTypeDisplay(step.type)}
                    </Badge>

                    {Boolean(step.isStartingNode) && !step.isTrigger && (
                      <Badge className="text-xs bg-emerald-500 text-white">
                        <Play className="w-3 h-3 mr-1" />
                        Entry
                      </Badge>
                    )}

                    {hasParameters ? (
                      <Badge
                        variant="secondary"
                        className="text-xs bg-white/40 dark:bg-slate-700/40"
                      >
                        <Settings className="w-3 h-3 mr-1" />
                        {parameterCount} config{parameterCount !== 1 ? "s" : ""}
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-xs text-slate-500"
                      >
                        <Check className="w-3 h-3 mr-1" />
                        No config needed
                      </Badge>
                    )}

                    {/* AI token estimate */}
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
                                <Sparkles className="w-3 h-3 mr-1" />~
                                {estimatedTokens.toLocaleString()} tokens
                              </Badge>
                            );
                          }
                        }
                        return null;
                      })()}

                    {/* Code lines count */}
                    {isCodeNode() &&
                      (() => {
                        const codeContent = getCodeContent();
                        if (codeContent) {
                          const lines = codeContent.code.split("\n").length;
                          return (
                            <Badge variant="outline" className="text-xs">
                              <Activity className="w-3 h-3 mr-1" />
                              {lines} lines
                            </Badge>
                          );
                        }
                        return null;
                      })()}
                  </div>
                </div>

                {/* Node image in right corner */}
                <div className="flex-shrink-0">
                  <div className="flex flex-col gap-3">
                    {nodeImage ? (
                      <div
                        className={cn(
                          "relative w-60 h-32 rounded-xl overflow-hidden transition-all duration-500 ease-out group",
                          nodeCopied
                            ? "ring-3 ring-green-400/60 shadow-2xl shadow-green-500/30 scale-105 bg-green-500/10"
                            : "border border-border bg-muted/30 shadow-sm hover:shadow-lg hover:border-primary/60 hover:ring-2 hover:ring-primary/20 hover:scale-105 hover:bg-muted/50"
                        )}
                      >
                        <Image
                          src={nodeImage}
                          alt={`${step.name} node`}
                          width={400}
                          height={200}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out"
                        />
                        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    ) : (
                      <div
                        className={cn(
                          "relative w-60 h-32 rounded-xl overflow-hidden transition-all duration-500 ease-out group",
                          nodeCopied
                            ? "bg-green-500/10 ring-3 ring-green-400/60 shadow-2xl shadow-green-500/30 scale-105"
                            : "border border-border bg-muted/30 hover:bg-muted/50 shadow-sm hover:shadow-lg hover:border-primary/60 hover:ring-2 hover:ring-primary/20 hover:scale-105"
                        )}
                      >
                        <div className="relative w-full h-full flex flex-col items-center justify-center p-4 text-center">
                          <div className="flex flex-col items-center gap-2 relative z-10">
                            {nodeCopied ? (
                              <>
                                <div className="relative">
                                  <Check className="h-8 w-8 text-green-500 animate-bounce" />
                                  <div className="absolute inset-0 h-8 w-8 bg-green-500/20 rounded-full animate-ping" />
                                </div>
                                <span className="text-sm font-bold text-foreground">
                                  Node Ready!
                                </span>
                              </>
                            ) : (
                              <>
                                <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                  <Download className="h-6 w-6 text-primary" />
                                </div>
                                <span className="text-sm font-bold text-foreground">
                                  {step.name}
                                </span>
                              </>
                            )}
                          </div>
                          <div
                            className={cn(
                              "absolute inset-0 transition-all duration-500 ease-out",
                              nodeCopied
                                ? "bg-green-500/5 opacity-100"
                                : "bg-primary/5 opacity-0 group-hover:opacity-100"
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {/* Footer Export Button */}
                    <div className="w-60">
                      <Button
                        onClick={copyNodeData}
                        className={cn(
                          "w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-300 ease-out",
                          nodeCopied
                            ? "bg-green-500 text-white shadow-lg shadow-green-500/25 transform scale-105"
                            : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:transform hover:scale-105"
                        )}
                        title="Click to copy this node configuration to your clipboard"
                      >
                        <div className="flex items-center justify-center gap-2">
                          {nodeCopied ? (
                            <>
                              <Check className="h-4 w-4 animate-bounce" />
                              <span>Ready to paste in n8n!</span>
                            </>
                          ) : (
                            <>
                              <Download className="h-4 w-4" />
                              <span>Copy to n8n</span>
                            </>
                          )}
                        </div>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Connection info */}
              {!isExpanded &&
                step.connectionInfo &&
                (step.connectionInfo.nextSteps.length > 0 ||
                  step.connectionInfo.previousSteps.length > 0) && (
                  <div className="mt-3 p-3 bg-white/50 dark:bg-slate-800/50 rounded-lg border border-white/60 dark:border-slate-700/60">
                    <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <ArrowRight className="w-3 h-3" />
                      <span className="font-medium">Flow:</span>
                      {step.connectionInfo.previousSteps.length > 0 && (
                        <span>
                          ← {step.connectionInfo.previousSteps.length} input
                          {step.connectionInfo.previousSteps.length !== 1
                            ? "s"
                            : ""}
                        </span>
                      )}
                      {step.connectionInfo.nextSteps.length > 0 && (
                        <span>
                          → {step.connectionInfo.nextSteps.length} output
                          {step.connectionInfo.nextSteps.length !== 1
                            ? "s"
                            : ""}
                        </span>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {guideData && (
            <div>
              <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                📖 Setup Guide Available
              </Badge>
            </div>
          )}

          {/* Action buttons - only view details button now */}
          <div className="mt-6">
            <div className="flex items-center gap-3">
              <Button
                onClick={handleToggleExpanded}
                variant="outline"
                size="sm"
                className="flex-1 h-10 bg-slate-800/60  hover:bg-slate-700/80  border-slate-600/60"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="w-4 h-4 mr-2" />
                    Hide Developer Guide
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-4 h-4 mr-2" />
                    View Developer Guide
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Expanded content */}
        {isExpanded && (
          <CardContent className="pt-0 pb-6">
            <Separator className="mb-6 text-primary" />

            <div className="border-4 border-primary/60 p-3 rounded-2xl    bg-neutral-950  overflow-hidden">
              {/* Edit card help */}

              <div>
                {/* 🆕 Setup Guide Section - Dark Theme */}
                {guideData && (
                  <NodeDocumentationSection guideData={guideData} />
                )}
              </div>

              <Separator className="my-5" />

              <EditCardHelp step={step} canEditSteps={canEditSteps} />

              <Separator className="my-5" />

              <NodeDetailsSection
                step={step}
                isAINode={isAINode}
                isCodeNode={isCodeNode}
                getCodeContent={getCodeContent}
                getAIPrompts={getAIPrompts}
                formatAIPrompt={formatAIPrompt}
              />
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
