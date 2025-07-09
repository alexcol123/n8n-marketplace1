// components/(custom)/(workflow)/WorkflowStepsViewer.tsx
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import UnifiedStepCard from "./UnifiedStepCard";
import { ConnectionInfo, type WorkflowJson } from "@/utils/functions/WorkflowStepsInOrder";
import {
  Eye,
  EyeOff,
  AlertTriangle,
  Workflow,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Clock,
  BarChart3,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MarkCompletedButton from "./MarkCompletedButton";
import { WorkflowStep } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";

// ✅ FIXED: Update local interface to match the imported one (including index signature)
interface OrderedWorkflowStep {
  id: string;
  name: string;
  type: string;
  parameters?: Record<string, unknown>;
  position: [number, number];
  stepNumber: number;
  isTrigger: boolean;
  isMergeNode: boolean;
  isDependency: boolean;
  isDisconnected?: boolean;
  // Additional fields from database - Fixed null handling
  stepDescription?: string | null;
  credentials?: unknown;
  typeVersion?: number;
  webhookId?: string | null;
  isCustomStep?: boolean;
  stepTitle?: string | null;
  stepImage?: string | null;
  helpText?: string | null;
  helpLinks?: { label: string; url: string }[] | null;
  originalApiStep?: WorkflowStep;
  connectionInfo?: ConnectionInfo; // ✅ FIXED: Make this optional to match imported type
  [key: string]: unknown; // ✅ FIXED: Add index signature to match WorkflowNode
}

interface WorkflowStepsViewerProps {
  workflowJson: WorkflowJson | unknown;
  workflowId: string;
  className?: string;
  showStats?: boolean;
  workflowSteps: WorkflowStep[];
  canEditSteps?: boolean;
}

// ✅ NEW: Helper function to create default ConnectionInfo
const createDefaultConnectionInfo = (): ConnectionInfo => ({
  connectsTo: [],
  connectsFrom: [],
  nextSteps: [],
  previousSteps: [],
  connectionInstructions: "No connection information available."
});

export default function WorkflowStepsViewer({
  workflowId,
  className,
  canEditSteps = false,
  workflowSteps,
}: WorkflowStepsViewerProps) {
  const [showDisconnected, setShowDisconnected] = useState(false);
  const [viewedSteps, setViewedSteps] = useState<Set<string>>(new Set());
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [localWorkflowSteps] = useState<WorkflowStep[]>(workflowSteps);



  // Step navigation state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Transform API workflow steps to OrderedWorkflowStep format
  const orderedSteps: OrderedWorkflowStep[] = useMemo(() => {
    // Helper function to safely convert position
    const convertPosition = (position: JsonValue): [number, number] => {
      if (Array.isArray(position) && position.length >= 2) {
        const [x, y] = position;
        return [typeof x === "number" ? x : 0, typeof y === "number" ? y : 0];
      }
      return [0, 0]; // Default position if invalid or null
    };

    return localWorkflowSteps
      .filter((step) => {
        const nodeType = step.nodeType.toLowerCase();
        return (
          !nodeType.includes("stickynote") &&
          !nodeType.includes("sticky-note") &&
          !nodeType.includes("note") &&
          !step.nodeType.includes("StickyNote")
        );
      })
      .map((step) => ({
        id: step.id,
        name: step.stepTitle || "Untitled Step", // Handle null stepTitle
        type: step.nodeType,
        parameters:
          step.parameters &&
          typeof step.parameters === "object" &&
          !Array.isArray(step.parameters)
            ? (step.parameters as Record<string, unknown>)
            : {},
        position: convertPosition(step.position), // Safe conversion
        stepNumber: step.stepNumber,
        isTrigger: step.isTrigger,
        isMergeNode: step.isMergeNode,
        isDependency: step.isDependency,
        // Fixed: Keep null values as null, don't convert to undefined
        stepDescription: step.stepDescription,
        credentials: step.credentials,
        typeVersion: step.typeVersion,
        webhookId: step.webhookId,
        isCustomStep: step.isCustomStep,
        stepTitle: step.stepTitle,
        stepImage: step.stepImage,
        helpText: step.helpText,
        helpLinks: step.helpLinks as { label: string; url: string }[] | null,
        isDisconnected: false,
        originalApiStep: step,
        // ✅ FIXED: Provide default connectionInfo or use optional chaining
        connectionInfo: createDefaultConnectionInfo(),
      }));
  }, [localWorkflowSteps]);

  // Handle step expansion tracking
  const handleStepToggleExpanded = (stepId: string, isExpanded: boolean) => {
    if (isExpanded) {
      setViewedSteps((prev) => new Set([...prev, stepId]));
    }
  };

  const handleStepExpand = (stepId: string) => {
    if (expandedStepId === stepId) {
      setExpandedStepId(null);
    } else {
      setExpandedStepId(stepId);
      setViewedSteps((prev) => new Set([...prev, stepId]));
    }
  };

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStepIndex < displayedSteps.length - 1) {
      const currentStep = displayedSteps[currentStepIndex];
      if (currentStep) {
        setViewedSteps((prev) => new Set([...prev, currentStep.id]));
      }
      setCurrentStepIndex(currentStepIndex + 1);
    } else if (currentStepIndex === displayedSteps.length - 1) {
      setCurrentStepIndex(displayedSteps.length);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Calculate stats
  const stats = useMemo(() => {
    const filteredSteps = localWorkflowSteps.filter((step) => {
      const nodeType = step.nodeType.toLowerCase();
      return (
        !nodeType.includes("stickynote") &&
        !nodeType.includes("sticky-note") &&
        !nodeType.includes("note") &&
        !step.nodeType.includes("StickyNote")
      );
    });

    const totalSteps = filteredSteps.length;
    const complexity =
      totalSteps <= 5
        ? "Beginner"
        : totalSteps <= 15
        ? "Intermediate"
        : "Advanced";

    return {
      totalSteps,
      complexity,
    };
  }, [localWorkflowSteps]);

  const displayedSteps = showDisconnected
    ? orderedSteps
    : orderedSteps.filter((step) => !step.isDisconnected);

  const disconnectedSteps = orderedSteps.filter((step) => step.isDisconnected);
  const currentStep = displayedSteps[currentStepIndex];
  const isOnCompletionStep = currentStepIndex === displayedSteps.length;
  const totalStepsWithCompletion = displayedSteps.length + 1;

  const completionPercentage =
    displayedSteps.length > 0
      ? Math.round(
          ((isOnCompletionStep ? displayedSteps.length : viewedSteps.size) /
            displayedSteps.length) *
            100
        )
      : 0;

  if (!orderedSteps || orderedSteps.length === 0) {
    return (
      <Card className={cn("border-destructive/30", className)}>
        <CardContent className="pt-6">
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-xl font-semibold mb-3">
              No Workflow Steps Found
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              Unable to parse workflow structure or no valid steps detected.
              Please check your workflow configuration.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={cn("flex flex-col", className)}>
      <Card className="flex-1 overflow-hidden border-primary/20 shadow-lg">
        {/* Top Navigation & Progress Section */}
        <div className="border-b border-border/50 bg-gradient-to-r from-primary/5 via-background to-primary/5">
          {/* Progress Bar & Stats Row */}
          <div className="px-6 pt-4 pb-3">
            <div className="flex items-center justify-between mb-4">
              {/* Left: Progress Info */}
              <div className="flex items-center gap-4">
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary border border-primary/20 text-xs px-2 py-1 font-medium"
                >
                  <Workflow className="h-3 w-3 mr-1" />
                  Tutorial
                </Badge>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="hidden md:flex items-center gap-1  ">
                    <Clock className="h-4 w-4" />
                    <span>{stats.totalSteps}min</span>
                  </div>
                  <div className="hidden md:flex   items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    <span>{stats.totalSteps} Steps</span>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      "text-xs px-2 py-1",
                      stats.complexity === "Beginner" &&
                        "border-emerald-200 text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800",
                      stats.complexity === "Intermediate" &&
                        "border-amber-200 text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800",
                      stats.complexity === "Advanced" &&
                        "border-rose-200 text-rose-700 bg-rose-50 dark:bg-rose-900/20 dark:text-rose-300 dark:border-rose-800"
                    )}
                  >
                    {stats.complexity}
                  </Badge>
                </div>
              </div>

              {/* Right: Current Step & Controls */}
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {isOnCompletionStep
                      ? "Tutorial Complete!"
                      : `Step ${currentStepIndex + 1} of ${
                          displayedSteps.length
                        }`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {viewedSteps.size} viewed • {completionPercentage}% complete
                  </div>
                </div>

                {disconnectedSteps.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowDisconnected(!showDisconnected)}
                    className="gap-2 text-xs"
                  >
                    {showDisconnected ? (
                      <EyeOff className="h-3 w-3" />
                    ) : (
                      <Eye className="h-3 w-3" />
                    )}
                    Disconnected ({disconnectedSteps.length})
                  </Button>
                )}
              </div>
            </div>

            {/* Enhanced Progress Bar */}
            <div className="relative">
              <Progress
                value={completionPercentage}
                className="h-3 bg-muted/40"
              />
              {/* Progress step indicators */}
              <div className="absolute top-0 left-0 right-0 flex justify-between items-center h-3">
                {Array.from({ length: displayedSteps.length }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-4 h-4 rounded-full border-2 border-background -mt-0.5 transition-all duration-300 shadow-sm",
                      i < viewedSteps.size || isOnCompletionStep
                        ? "bg-primary shadow-primary/30"
                        : i === currentStepIndex
                        ? "bg-primary/60 ring-2 ring-primary/30 scale-110"
                        : "bg-muted hover:bg-muted/80"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="px-6 py-3 border-t border-border/30 bg-background/50">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="default"
                onClick={goToPreviousStep}
                disabled={currentStepIndex === 0}
                className={cn(
                  "gap-2 min-w-[120px] font-medium transition-all",
                  currentStepIndex === 0 && "opacity-50 cursor-not-allowed"
                )}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {/* Center: Current Step Title */}
              <div className="text-center px-4 hidden sm:block">
                <div className="text-sm font-medium truncate max-w-[300px]">
                  {isOnCompletionStep
                    ? "🎉 All Steps Complete!"
                    : currentStep?.stepTitle ||
                      currentStep?.name ||
                      "Loading..."}
                </div>
                {!isOnCompletionStep && currentStep && (
                  <div className="text-xs text-muted-foreground mt-1">
                    {currentStep.type}
                  </div>
                )}
              </div>

              <Button
                size="default"
                onClick={goToNextStep}
                disabled={currentStepIndex >= totalStepsWithCompletion - 1}
                className={cn(
                  "gap-2 min-w-[120px] font-medium transition-all duration-300",
                  currentStepIndex === displayedSteps.length - 1
                    ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-lg"
                    : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-md"
                )}
              >
                {currentStepIndex === displayedSteps.length - 1
                  ? "Complete"
                  : "Next"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <CardContent className="p-0 flex-1">
          <div className="p-1">
            {isOnCompletionStep ? (
              /* Completion Step */
              <MarkCompletedButton workflowId={workflowId} />
            ) : currentStep ? (
              /* Current Step */
              <div className="space-y-2">
                {/* Step Content */}
                <div className="bg-card/50 p-1">
                  <UnifiedStepCard
                    key={currentStep.id}
                    step={currentStep}
                    stepNumber={currentStepIndex + 1}
                    onToggleExpanded={handleStepToggleExpanded}
                    isMarkedAsViewed={viewedSteps.has(currentStep.id)}
                    isExpanded={expandedStepId === currentStep.id}
                    onExpand={handleStepExpand}
                    canEditSteps={canEditSteps}
                  />
                </div>
              </div>
            ) : (
              /* Error State */
              <div className="text-center py-16">
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
                  <AlertTriangle className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Step Not Found</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  We couldn&#39;t load this step. This might be a temporary
                  issue or the step may have been removed.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setCurrentStepIndex(0)}
                  className="gap-2"
                >
                  <ArrowRight className="h-4 w-4" />
                  Return to First Step
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}