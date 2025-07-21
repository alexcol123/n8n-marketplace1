"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
  Play,
  Info,
  BookOpen,
  Edit,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { type OrderedWorkflowStep } from "@/utils/functions/WorkflowStepsInOrder";

import EditCardHelp from "./EditCardHelp";
import NodeDetailsSection from "../(UnifiedStepCardParts)/NodeDetailsSection";
import NodeDocumentationSection from "../(UnifiedStepCardParts)/NodeDocumentationSection";
import { NodeDocumentation } from "@prisma/client";

// Simplified theme configuration
const CATEGORY_THEMES = {
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
    darkGradient: "dark:from-red-950/20 dark:via-red-900/10 dark:to-red-950/30",
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
  error: {
    gradient: "from-red-500/10 via-red-50 to-red-100/50",
    darkGradient: "dark:from-red-950/20 dark:via-red-900/10 dark:to-red-950/30",
    border: "border-red-200 dark:border-red-800",
    accent: "bg-red-500",
    icon: AlertTriangle,
    iconColor: "text-red-500",
    category: "Error",
  },
  trigger: {
    gradient: "from-amber-500/10 via-amber-50 to-amber-100/50",
    darkGradient:
      "dark:from-amber-950/20 dark:via-amber-900/10 dark:to-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
    accent: "bg-amber-500",
    icon: Zap,
    iconColor: "text-amber-500",
    category: "Trigger",
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

interface UnifiedStepCardProps {
  step: OrderedWorkflowStep;
  stepNumber: number;
  onToggleExpanded?: (stepId: string, isExpanded: boolean) => void;
  isMarkedAsViewed?: boolean;
  isExpanded?: boolean;
  canEditSteps?: boolean;
  onExpand?: (stepId: string) => void;
  guideData?: NodeDocumentation;
  isReturnStep?: boolean;
}

// Utility functions
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
    lowerType.includes("llm")
  )
    return "ai";
  if (
    lowerType.includes("code") ||
    lowerType.includes("function") ||
    lowerType.includes("javascript") ||
    lowerType.includes("python")
  )
    return "code";
  if (
    lowerType.includes("mysql") ||
    lowerType.includes("postgres") ||
    lowerType.includes("database") ||
    lowerType.includes("sql")
  )
    return "database";
  if (
    lowerType.includes("email") ||
    lowerType.includes("gmail") ||
    lowerType.includes("mail")
  )
    return "email";
  if (
    lowerType.includes("file") ||
    lowerType.includes("csv") ||
    lowerType.includes("excel") ||
    lowerType.includes("drive")
  )
    return "file";
  if (
    lowerType.includes("slack") ||
    lowerType.includes("discord") ||
    lowerType.includes("telegram") ||
    lowerType.includes("twitter")
  )
    return "social";
  return "default";
};

const getNodeTypeDisplay = (type: string) => {
  const cleanType = type
    .replace(/^n8n-nodes-base\./, "")
    .replace(/([A-Z])/g, " $1")
    .trim();
  return cleanType.charAt(0).toUpperCase() + cleanType.slice(1);
};

const getTheme = (step: OrderedWorkflowStep) => {
  if (step.isDisconnected) return CATEGORY_THEMES.error;
  if (step.isTrigger) return CATEGORY_THEMES.trigger;
  const category = getNodeCategory(step.type);
  return CATEGORY_THEMES[category] || CATEGORY_THEMES.default;
};

export default function UnifiedStepCard({
  step,
  stepNumber,
  canEditSteps,
  onToggleExpanded,
  isMarkedAsViewed = false,
  isExpanded = false,
  onExpand,
  guideData,
  isReturnStep = false,
}: UnifiedStepCardProps) {
  const [nodeCopied, setNodeCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("details");

  const nodeImage = guideData?.nodeImage || null;

  const theme = getTheme(step);
  const hasParameters =
    step.parameters && Object.keys(step.parameters).length > 0;
  const parameterCount = hasParameters
    ? Object.keys(step.parameters).length
    : 0;
  const IconComponent = theme.icon;

  // Handle expansion
  const handleToggleExpanded = () => {
    if (onExpand) onExpand(step.id);
    if (onToggleExpanded) onToggleExpanded(step.id, !isExpanded);
  };

  // Copy node data
  const copyNodeData = async () => {
    const nodeData = {
      parameters: step.parameters || {},
      type: step.type,
      typeVersion: step.typeVersion || 1,
      position: step.position || [0, 0],
      id: step.id,
      name: step.name,
      // ...(step.webhookId && { webhookId: step.webhookId }),
      // ...(step.credentials && { credentials: step.credentials }),
    };

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
      console.error("Failed to copy:", err);
    }
  };

  const isAINode = () => getNodeCategory(step.type) === "ai";
  const isCodeNode = () => getNodeCategory(step.type) === "code";

  // Simplified AI prompt extraction
  const getAIPrompts = () => {
    if (!isAINode() || !step.parameters) return null;
    const prompts = { system: "", user: "", text: "", messages: [] };

    // Basic parameter extraction
    const systemKeys = ["systemMessage", "system", "instructions"];
    const userKeys = ["prompt", "userMessage", "input", "text"];

    systemKeys.forEach((key) => {
      if (step.parameters?.[key]) prompts.system = String(step.parameters[key]);
    });

    userKeys.forEach((key) => {
      if (step.parameters?.[key]) {
        if (key === "text") prompts.text = String(step.parameters[key]);
        else prompts.user = String(step.parameters[key]);
      }
    });

    return prompts;
  };

  const getCodeContent = () => {
    if (!isCodeNode() || !step.parameters) return null;
    const codeKeys = ["jsCode", "code", "script", "pythonCode"];

    for (const key of codeKeys) {
      if (step.parameters?.[key] && typeof step.parameters[key] === "string") {
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

  const formatAIPrompt = (text: string) =>
    text?.replace(/\n\s*\n/g, "\n").trim() || "";

  return (
    <div
      className={cn(
        "group relative transition-all duration-500",
        isExpanded && "z-10"
      )}
    >
      {/* Glow effect */}
      {(isMarkedAsViewed || isExpanded) && (
        <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 via-blue-400/20 to-purple-400/20 rounded-2xl blur-xl opacity-60" />
      )}

      <Card
        className={cn(
          "relative overflow-hidden transition-all duration-500 border-2 bg-gradient-to-br shadow-lg hover:shadow-xl",
          theme.gradient,
          theme.darkGradient,
          theme.border,
          isExpanded && "shadow-2xl scale-[1.02]",
          (isMarkedAsViewed || isExpanded) && [
            "from-emerald-50/80 via-blue-50/40 to-purple-50/80",
            "dark:from-emerald-950/40 dark:via-blue-950/20 dark:to-purple-950/40",
            "border-emerald-300/60 dark:border-emerald-700/60",
          ]
        )}
      >
        {/* Accent strip */}
        <div
          className={cn("absolute top-0 left-0 right-0 h-1", theme.accent)}
        />

        {/* Step number */}
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
            {/* Icon */}
            <div className="relative flex-shrink-0">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 bg-white/80 dark:bg-slate-800/80 shadow-lg border-2 border-white/60 dark:border-slate-700/60 hover:scale-110 shadow-xl"
                )}
              >
                <IconComponent className={cn("w-7 h-7", theme.iconColor)} />
              </div>
              <div
                className={cn(
                  "absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white shadow-md",
                  theme.accent
                )}
              >
                {theme.category}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0 flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate mb-1">
                    {step.name}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mb-2">
                    {typeof step.stepDescription === "string"
                      ? step.stepDescription
                      : ""}
                  </p>

                  {/* Badges */}
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
                  </div>

                  <div>
                    {guideData && (
                      <div className="mt-8 inline-flex items-center">
                        <Badge className="text-sm bg-gradient-to-r from-green-800/50 to-emerald-700/50 text-green-100 border border-green-500/50 px-5 py-1 rounded-full font-semibold shadow-lg shadow-green-500/25 backdrop-blur-md  hover:shadow-green-400/30 hover:shadow-xl transition-all duration-300">
                          <span
                            className="mr-2 text-base"
                            role="img"
                            aria-label="book"
                          >
                            📖
                          </span>
                          <span className="hidden sm:inline">Setup Guide</span>
                          <span className="sm:hidden">Guide</span>
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Return step indicator */}
                {isReturnStep && (
                  <div className="flex items-center gap-2 bg-black border-l-3 border-l-amber-600 px-3 py-2 rounded-r-lg shadow-lg">
                    <ArrowLeft className="w-3.5 h-3.5 text-white" />
                    <span className="text-primary text-sm">Return Step</span>
                  </div>
                )}

                {/* Node image and copy button */}
                <div className="flex flex-col gap-3">
                  <div
                    className={cn(
                      "relative w-60 h-32 rounded-xl overflow-hidden transition-all duration-500",
                      nodeCopied
                        ? "ring-3 ring-green-400/60 shadow-2xl scale-105 bg-green-500/10"
                        : "border border-border bg-muted/30 hover:shadow-lg hover:scale-105"
                    )}
                  >
                    {nodeImage ? (
                      <Image
                        src={nodeImage}
                        alt={`${step.name} node`}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        {nodeCopied ? (
                          <>
                            <Check className="h-8 w-8 text-green-500 animate-bounce" />
                            <span className="text-sm font-bold">
                              Node Ready!
                            </span>
                          </>
                        ) : (
                          <>
                            <Download className="h-6 w-6 text-primary" />
                            <span className="text-sm font-bold">
                              {step.name}
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={copyNodeData}
                    className={cn(
                      "w-60 py-3 font-semibold transition-all duration-300",
                      nodeCopied
                        ? "bg-green-500 text-white scale-105"
                        : "bg-primary hover:bg-primary/90 hover:scale-105"
                    )}
                  >
                    {nodeCopied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Ready to paste in n8n!
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Copy to n8n
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Expand button */}
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleToggleExpanded}
              className="w-full max-w-xs flex items-center justify-center gap-2 text-sm font-semibold"
              variant={"outline"}
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
        </CardHeader>

        {/* Expanded content */}
        {isExpanded && (
          <CardContent className="pt-0 pb-6">
            <Separator className="mb-6" />

            <div className="border-4 border-primary/60 p-3 rounded-2xl bg-neutral-950 overflow-hidden">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger
                    value="details"
                    className="flex items-center gap-2"
                  >
                    <Info className="w-4 h-4" />
                    Node Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="guide"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4" />
                    Setup Guide
                  </TabsTrigger>
                  <TabsTrigger value="help" className="flex items-center gap-2">
                    <Edit className="w-4 h-4" />
                    Edit Help
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="guide" className="mt-0">
                  {guideData ? (
                    <NodeDocumentationSection guideData={guideData} />
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-semibold mb-2">
                        No Setup Guide Available
                      </h3>
                      <p className="text-sm">
                        This node doesn&apos;t have a specific setup guide yet.
                      </p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="details" className="mt-0">
                  <NodeDetailsSection
                    step={step}
                    isAINode={isAINode}
                    isCodeNode={isCodeNode}
                    getCodeContent={getCodeContent}
                    getAIPrompts={getAIPrompts}
                    formatAIPrompt={formatAIPrompt}
                  />
                </TabsContent>

                <TabsContent value="help" className="mt-0">
                  <EditCardHelp step={step} canEditSteps={canEditSteps} />
                </TabsContent>
              </Tabs>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
