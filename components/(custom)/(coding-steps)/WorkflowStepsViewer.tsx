// components/(custom)/(workflow)/WorkflowStepsViewer.tsx
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import UnifiedStepCard from "./UnifiedStepCard";
import { type WorkflowJson } from "@/utils/functions/WorkflowStepsInOrder";
import {
  Eye,
  EyeOff,
  AlertTriangle,
  Workflow,
  ChevronLeft,
  ChevronRight,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MarkCompletedButton from "./MarkCompletedButton";
import { WorkflowStep } from "@prisma/client";

// Define the OrderedWorkflowStep interface locally
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
  // Additional fields from database
  stepDescription?: string;
  credentials?: any;
  typeVersion?: number;
  webhookId?: string;
  isCustomStep?: boolean;
  stepTitle?: string;
  stepImage?: string;
  helpText?: string;
  helpLinks?: any;
  originalApiStep?: WorkflowStep;
}

interface WorkflowStepsViewerProps {
  workflowJson: WorkflowJson | unknown;
  workflowId: string;
  className?: string;
  showStats?: boolean;
  workflowSteps: WorkflowStep[];
}

export default function WorkflowStepsViewer({
  workflowJson,
  workflowId,
  className,
  showStats = true,
  workflowSteps,
}: WorkflowStepsViewerProps) {
  const [showDisconnected, setShowDisconnected] = useState(false);
  const [viewedSteps, setViewedSteps] = useState<Set<string>>(new Set());
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [localWorkflowSteps, setLocalWorkflowSteps] =
    useState<WorkflowStep[]>(workflowSteps);


  // Step navigation state
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Transform API workflow steps to OrderedWorkflowStep format
  const orderedSteps: OrderedWorkflowStep[] = useMemo(() => {
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
        name: step.stepTitle,
        type: step.nodeType,
        parameters: step.parameters || {},
        position: step.position,
        stepNumber: step.stepNumber,
        isTrigger: step.isTrigger,
        isMergeNode: step.isMergeNode,
        isDependency: step.isDependency,
        stepDescription: step.stepDescription,
        credentials: step.credentials,
        typeVersion: step.typeVersion,
        webhookId: step.webhookId,
        isCustomStep: step.isCustomStep,
        stepTitle: step.stepTitle,
        stepImage: step.stepImage,
        helpText: step.helpText,
        helpLinks: step.helpLinks,
        isDisconnected: false,
        originalApiStep: step,
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
          <div className="text-center py-8">
            <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No Workflow Steps Found
            </h3>
            <p className="text-sm text-muted-foreground">
              Unable to parse workflow structure or no valid steps detected
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "overflow-hidden border-primary/20 shadow-lg py-0 ",
        className
      )}
    >
      {/* Header */}
      <CardHeader className="py-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border-b border-primary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-primary to-primary/80 rounded-lg shadow-lg">
              <Workflow className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">
                Step-by-Step Tutorial
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {stats.totalSteps}min Est. Time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className={cn(
                "text-xs px-3 py-1 shadow-sm",
                stats.complexity === "Beginner" &&
                  "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200",
                stats.complexity === "Intermediate" &&
                  "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200",
                stats.complexity === "Advanced" &&
                  "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200"
              )}
            >
              {stats.complexity} Level
            </Badge>

            {disconnectedSteps.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDisconnected(!showDisconnected)}
                className="gap-2"
              >
                {showDisconnected ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                Disconnected ({disconnectedSteps.length})
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Navigation with Progress Bar */}
        <div className="px-4 py-3 border-b border-primary/10">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold">
                {isOnCompletionStep
                  ? "🎉 Tutorial Complete!"
                  : `Step ${currentStepIndex + 1}: ${
                      currentStep?.stepTitle || "Loading..."
                    }`}
              </h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="destructive" className="text-xs">
                  {currentStepIndex + 1} of {totalStepsWithCompletion}
                </Badge>
                {!isOnCompletionStep && currentStep && (
                  <div className="hidden sm:flex">
                    <span className="text-primary/50">•</span>
                    <span className="font-mono text-xs bg-muted/50 px-2 py-1 rounded">
                      {currentStep.type}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousStep}
                disabled={currentStepIndex === 0}
                className="gap-2 min-w-[100px] font-medium"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <Button
                variant={isOnCompletionStep ? "default" : "default"}
                size="sm"
                onClick={goToNextStep}
                disabled={currentStepIndex >= totalStepsWithCompletion - 1}
                className={cn(
                  "gap-2 min-w-[100px] font-medium transition-all duration-300",
                  isOnCompletionStep
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    : "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary"
                )}
              >
                {currentStepIndex === displayedSteps.length - 1
                  ? "Complete"
                  : "Next"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress Bar with Percentage */}
          <div className="relative">
            <Progress
              value={completionPercentage}
              className="h-3 bg-muted/40"
            />

            {/* Percentage Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-foreground bg-background/80 px-2 py-0.5 rounded-full shadow-sm">
                {completionPercentage}%
              </span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {isOnCompletionStep ? (
            /* Completion Step */
            <div className="text-center space-y-6 py-8">
              <div className="relative">
                <MarkCompletedButton workflowId={workflowId} />
              </div>
            </div>
          ) : currentStep ? (
            /* Current Step */
            <div className="space-y-4">
              <UnifiedStepCard
                key={currentStep.id}
                step={currentStep}
                stepNumber={currentStepIndex + 1}
                onToggleExpanded={handleStepToggleExpanded}
                isMarkedAsViewed={viewedSteps.has(currentStep.id)}
                isExpanded={expandedStepId === currentStep.id}
                onExpand={handleStepExpand}
              />
            </div>
          ) : (
            /* Error State */
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Step Not Found
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Unable to load this step.
              </p>
              <Button
                variant="outline"
                onClick={() => setCurrentStepIndex(0)}
              >
                Return to First Step
              </Button>
            </div>
          )}
        </div>

        {/* Disconnected Steps Warning */}
        {disconnectedSteps.length > 0 && !showDisconnected && (
          <div className="p-4 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 border-t border-amber-200/50 dark:border-amber-800/50">
            <div className="flex items-center gap-3">
              <div className="p-1 bg-amber-500/20 rounded-full">
                <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                  {disconnectedSteps.length} disconnected step
                  {disconnectedSteps.length !== 1 ? "s" : ""} detected
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowDisconnected(true)}
                className="text-amber-800 dark:text-amber-200 hover:bg-amber-100/50 dark:hover:bg-amber-900/20"
              >
                <ArrowRight className="h-4 w-4 mr-1" />
                Show Details
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}