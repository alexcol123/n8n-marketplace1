// components/(custom)/(workflow)/WorkflowStepsViewer.tsx
"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UnifiedStepCard from "./UnifiedStepCard";
import { type WorkflowJson } from "@/utils/functions/WorkflowStepsInOrder";
import {
  Eye,
  EyeOff,
  AlertTriangle,
  Workflow,
  Clock,
  ChevronLeft,
  ChevronRight,
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

interface HelpLink {
  title: string;
  url: string;
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
  // 🚫 FILTER OUT STICKY NOTES HERE TOO (belt and suspenders approach)
  const orderedSteps: OrderedWorkflowStep[] = useMemo(() => {
    return localWorkflowSteps
      .filter((step) => {
        // Multiple ways to filter sticky notes to be extra sure
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
        // Additional useful properties from your API
        stepDescription: step.stepDescription,
        credentials: step.credentials,
        typeVersion: step.typeVersion,
        webhookId: step.webhookId,
        isCustomStep: step.isCustomStep,
        // Additional fields for UnifiedStepCard
        stepTitle: step.stepTitle,
        stepImage: step.stepImage,
        helpText: step.helpText,
        helpLinks: step.helpLinks,
        // Mark disconnected steps if they exist (you can add logic here)
        isDisconnected: false, // Add your logic for detecting disconnected steps
        // Original API step data for reference
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
      // If clicking the same step, close it
      setExpandedStepId(null);
    } else {
      // Open the new step and close any previously opened step
      setExpandedStepId(stepId);
      // Mark as viewed when opened
      setViewedSteps((prev) => {
        const newSet = new Set([...prev, stepId]);
        return newSet;
      });
    }
  };

  // Navigation handlers
  const goToNextStep = () => {
    if (currentStepIndex < displayedSteps.length - 1) {
      // Mark current step as viewed when moving to next
      const currentStep = displayedSteps[currentStepIndex];
      if (currentStep) {
        setViewedSteps((prev) => new Set([...prev, currentStep.id]));
      }
      setCurrentStepIndex(currentStepIndex + 1);
    } else if (currentStepIndex === displayedSteps.length - 1) {
      // Always allow moving to completion step from last step
      setCurrentStepIndex(displayedSteps.length);
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  // Calculate stats directly from database workflowSteps
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
    const triggerSteps = filteredSteps.filter((step) => step.isTrigger).length;
    const actionSteps = filteredSteps.filter(
      (step) => !step.isTrigger && !step.isDependency
    ).length;
    const dependencySteps = filteredSteps.filter(
      (step) => step.isDependency
    ).length;
    const nodeTypes = [...new Set(filteredSteps.map((step) => step.nodeType))];

    const complexity =
      totalSteps <= 5
        ? "Beginner Friendly"
        : totalSteps <= 15
        ? "Intermediate"
        : "Advanced";

    return {
      totalSteps,
      triggerSteps,
      actionSteps,
      dependencySteps,
      nodeTypes,
      complexity,
    };
  }, [localWorkflowSteps]);

  // Always show all steps - no more limiting
  const displayedSteps = showDisconnected
    ? orderedSteps
    : orderedSteps.filter((step) => !step.isDisconnected);

  const disconnectedSteps = orderedSteps.filter((step) => step.isDisconnected);

  // Get current step for display
  const currentStep = displayedSteps[currentStepIndex];

  // Check if all steps are completed
  const allStepsCompleted =
    displayedSteps.length > 0 &&
    displayedSteps.every((step) => viewedSteps.has(step.id));

  // Always allow completion step access - users need to reach it to complete
  const isOnCompletionStep = currentStepIndex === displayedSteps.length;

  // Always include completion step in total count - it's always accessible
  const totalStepsWithCompletion = displayedSteps.length + 1;

  // Also automatically mark current step as viewed when it's the current step or expanded
  const isCurrentStepViewed =
    currentStep &&
    (viewedSteps.has(currentStep.id) ||
      expandedStepId === currentStep.id ||
      currentStepIndex === displayedSteps.length - 1);

  const completionPercentage =
    displayedSteps.length > 0
      ? Math.round(
          ((isOnCompletionStep ? displayedSteps.length : viewedSteps.size) /
            displayedSteps.length) *
            100
        )
      : 0;

  // Helper to determine if we should show green (only on completion step)
  const shouldShowGreen = isOnCompletionStep;

  if (!orderedSteps || orderedSteps.length === 0) {
    return (
      <Card className={cn("border-destructive/30 ", className)}>
        <CardContent className="pt-6">
          <div className="text-center py-4">
            <AlertTriangle className="h-8 w-8 text-destructive mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">
              No workflow steps found or invalid workflow structure
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden py-0", className)}>
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b pt-4 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" />
            Workflow Execution Order
          </CardTitle>

          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              {stats.complexity}
            </Badge>

            {disconnectedSteps.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDisconnected(!showDisconnected)}
                className="gap-1 text-xs"
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
      </CardHeader>

      <CardContent className="p-0">
        {/* Workflow Stats */}
        {showStats && (
          <div className="p-4 bg-muted/20 border-b">
            {/* Progress bar */}
            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-in-out",
                  shouldShowGreen
                    ? "bg-gradient-to-r from-green-500 to-green-400"
                    : "bg-gradient-to-r from-primary to-primary/70"
                )}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Navigation Bar - Positioned right above the step content */}
        <div className="px-4 py-3 bg-gradient-to-r from-muted/30 to-transparent border-b border-border/50">
          <div className="flex items-center justify-between">
            {/* Current Step Title */}
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground truncate">
                {isOnCompletionStep
                  ? "🎉 Complete Your Learning Journey"
                  : currentStep?.stepTitle || "Loading..."}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Step {currentStepIndex + 1} of {totalStepsWithCompletion}
              </p>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousStep}
                disabled={currentStepIndex === 0}
                className="gap-1 px-3"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {/* Progress dots - compact version */}
              <div className="flex gap-1 px-2">
                {Array.from(
                  { length: Math.min(5, totalStepsWithCompletion) },
                  (_, idx) => {
                    const startIndex = Math.max(0, currentStepIndex - 2);
                    const actualIndex = startIndex + idx;
                    const isCompletionDot =
                      actualIndex === displayedSteps.length;

                    return (
                      <div
                        key={actualIndex}
                        className={cn(
                          "w-1.5 h-1.5 rounded-full transition-colors",
                          actualIndex === currentStepIndex
                            ? isCompletionDot
                              ? "bg-green-500"
                              : "bg-primary"
                            : actualIndex < currentStepIndex
                            ? "bg-green-500"
                            : "bg-muted"
                        )}
                      />
                    );
                  }
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={goToNextStep}
                disabled={currentStepIndex >= totalStepsWithCompletion - 1}
                className="gap-1 px-3"
              >
                {currentStepIndex === displayedSteps.length - 1
                  ? "Complete"
                  : "Next"}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Current Step Display OR Completion Step */}
        {isOnCompletionStep ? (
          /* Completion Step Display */
          <div className="p-4">
            <div className="p-6 border border-green-200 rounded-lg bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-green-950/30">
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-2">
                    🎉 Ready to Master This Workflow?
                  </h3>
                  <p className="text-green-700 dark:text-green-300 mb-4 max-w-md mx-auto">
                    Complete this automation challenge and level up your skills!
                    Join thousands of students mastering automation workflows.
                  </p>
                </div>
                <div className="flex justify-center">
                  <MarkCompletedButton workflowId={workflowId} />
                </div>
                <p className="text-xs text-green-600 dark:text-green-400">
                  🔥 Join thousands of students mastering automation workflows
                </p>
              </div>
            </div>
          </div>
        ) : currentStep ? (
          /* Regular Step Display */
          <div className="p-4">
            <UnifiedStepCard
              key={currentStep.id}
              step={currentStep}
              stepNumber={currentStepIndex + 1}
              onToggleExpanded={handleStepToggleExpanded}
              isMarkedAsViewed={isCurrentStepViewed}
              isExpanded={expandedStepId === currentStep.id}
              onExpand={handleStepExpand}
            />
          </div>
        ) : (
          /* Fallback for undefined currentStep */
          <div className="p-4">
            <div className="text-center py-8">
              <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">
                Step not found. Please use the navigation buttons to go to a
                valid step.
              </p>
            </div>
          </div>
        )}

        {/* Disconnected Steps Warning */}
        {disconnectedSteps.length > 0 && !showDisconnected && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200 dark:border-amber-800">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">
                {disconnectedSteps.length} disconnected step
                {disconnectedSteps.length !== 1 ? "s" : ""} found
              </span>
              <Button
                variant="link"
                onClick={() => setShowDisconnected(true)}
                className="h-auto p-0 text-amber-800 dark:text-amber-200 underline"
              >
                Show them
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
