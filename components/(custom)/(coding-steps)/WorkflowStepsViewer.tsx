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
  Settings,
  Zap,
  Check,
  Trophy,
  Edit3,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MarkCompletedButton from "./MarkCompletedButton";
import { WorkflowStep } from "@prisma/client";
import { toast } from "sonner";

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
  onUpdateHelpContent?: (stepId: string, helpText: string, helpLinks: HelpLink[]) => Promise<void>; // Callback for updates
}

export default function WorkflowStepsViewer({
  workflowJson,
  workflowId,
  className,
  showStats = true,
  workflowSteps,
  onUpdateHelpContent,
}: WorkflowStepsViewerProps) {
  const [showDisconnected, setShowDisconnected] = useState(false);
  const [viewedSteps, setViewedSteps] = useState<Set<string>>(new Set());
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [editingSteps, setEditingSteps] = useState<Set<string>>(new Set());
  const [localWorkflowSteps, setLocalWorkflowSteps] = useState<WorkflowStep[]>(workflowSteps);

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

  // Handle help content updates
  const handleUpdateHelpContent = async (
    stepId: string,
    helpText: string,
    helpLinks: HelpLink[]
  ) => {
    try {
      // Call the provided callback if available
      if (onUpdateHelpContent) {
        await onUpdateHelpContent(stepId, helpText, helpLinks);
      }

      // Update local state optimistically
      setLocalWorkflowSteps(prevSteps =>
        prevSteps.map(step =>
          step.nodeId === stepId
            ? { ...step, helpText, helpLinks }
            : step
        )
      );

      // Remove step from editing state
      setEditingSteps(prev => {
        const newSet = new Set(prev);
        newSet.delete(stepId);
        return newSet;
      });

      toast.success("Help content updated successfully!");
    } catch (error) {
      console.error("Failed to update help content:", error);
      toast.error("Failed to update help content. Please try again.");
      throw error; // Re-throw to let the component handle loading states
    }
  };

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
      setViewedSteps((prev) => new Set([...prev, stepId]));
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

  // Check if all steps are completed
  const allStepsCompleted =
    displayedSteps.length > 0 &&
    displayedSteps.every((step) => viewedSteps.has(step.id));
  const completionPercentage =
    displayedSteps.length > 0
      ? Math.round((viewedSteps.size / displayedSteps.length) * 100)
      : 0;

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
      <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b pt-4 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" />
            Workflow Execution Order
          </CardTitle>

          <div className="flex items-center gap-2">
            {/* Edit Mode Indicator - Always shown */}
            <Badge
              variant="outline"
              className="text-xs bg-blue-50 text-blue-600 border-blue-300"
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Edit Mode
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

            <Badge variant="outline" className="text-xs">
              {displayedSteps.length} steps
            </Badge>

            {/* Progress indicator for viewed steps */}
            {viewedSteps.size > 0 && (
              <Badge
                className={cn(
                  "text-xs text-white",
                  allStepsCompleted
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                )}
              >
                {allStepsCompleted && <Trophy className="h-3 w-3 mr-1" />}
                {viewedSteps.size}/{displayedSteps.length} viewed
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className=" p-0 ">
        {/* Workflow Stats */}
        {showStats && (
          <div className="p-4 bg-muted/20 border-b">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Workflow className="h-4 w-4 text-primary" />
                <span>
                  <strong>{stats.totalSteps}</strong> total steps
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                <span>
                  <strong>{stats.triggerSteps}</strong> triggers
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-primary" />
                <span>
                  <strong>{stats.actionSteps}</strong> actions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>
                  <strong>{stats.complexity}</strong> complexity
                </span>
              </div>
            </div>

            {/* Edit Mode Instructions - Always shown */}
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-start gap-2">
                <Edit3 className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-1">
                    Edit Mode Active
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Click on any step to expand it, then use the "Edit Help" button to modify help text and links.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Steps List */}
        <div className="p-4 space-y-4">
          {displayedSteps.map((step, index) => {
            const isLastStep = index === displayedSteps.length - 1;
            const isViewed = viewedSteps.has(step.id);

            return (
              <div key={step.id} className="relative">
                {/* Step Number and Connection Line */}
                <div className="flex items-start gap-4">
                  {/* Step Number Circle */}
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={cn(
                        "flex items-center justify-center h-10 w-10 rounded-full font-bold text-sm z-10 shadow-md transition-all duration-300",
                        isViewed
                          ? step.isTrigger
                            ? "bg-amber-600 text-white ring-2 ring-amber-300"
                            : step.isDisconnected
                            ? "bg-destructive text-white ring-2 ring-destructive/30"
                            : "bg-primary text-primary-foreground ring-2 ring-primary/30"
                          : step.isTrigger
                          ? "bg-amber-500 text-white"
                          : step.isDisconnected
                          ? "bg-destructive text-white"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      {isViewed ? (
                        <Check className="h-5 w-5" />
                      ) : (
                        step.stepNumber
                      )}
                    </div>

                    {/* Connection Line */}
                    {!isLastStep && (
                      <div
                        className={cn(
                          "w-px h-8 mt-2 transition-colors duration-300",
                          isViewed ? "bg-primary" : "bg-border"
                        )}
                      />
                    )}
                  </div>

                  {/* Step Content - Unified Card with Editing */}
                  <div className="flex-1 min-w-0">
                    <UnifiedStepCard
                      key={step.id}
                      step={step}
                      stepNumber={index + 1}
                      onToggleExpanded={handleStepToggleExpanded}
                      isMarkedAsViewed={viewedSteps.has(step.id)}
                      isExpanded={expandedStepId === step.id}
                      onExpand={handleStepExpand}
               
                      onUpdateHelpContent={handleUpdateHelpContent}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mark All Completed Section */}
        {displayedSteps.length > 0 && (
          <div className="p-4 border-t bg-gradient-to-r from-muted/30 to-transparent">
            {/* Progress bar */}
            <div className="mt-3 w-full bg-muted/30 rounded-full h-2 overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-700 ease-in-out",
                  allStepsCompleted
                    ? "bg-gradient-to-r from-green-500 to-green-400"
                    : "bg-gradient-to-r from-primary to-primary/70"
                )}
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center p-4 border-t bg-gradient-to-r from-muted/30 to-transparent">
          <MarkCompletedButton workflowId={workflowId} />
        </div>

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