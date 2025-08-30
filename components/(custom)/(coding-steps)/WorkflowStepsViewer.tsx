// components/(custom)/(coding-steps)/WorkflowStepsViewer.tsx
"use client";

import { useState, useMemo, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UnifiedStepCard from "./UnifiedStepCard";
import { ConnectionInfo } from "@/utils/functions/WorkflowStepsInOrder";
import {
  AlertTriangle,
  Workflow,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import MarkCompletedButton from "./MarkCompletedButton";
import { NodeDocumentation, WorkflowStep } from "@prisma/client";
import { JsonValue } from "@prisma/client/runtime/library";
import { identifyService } from "@/utils/functions/identifyService";
import { WorkflowStepLike } from "@/utils/types";

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
  connectionInfo?: ConnectionInfo;
  [key: string]: unknown;
}

interface SetupGuideData {
  serviceName: string;
  hostIdentifier: string | null;
  title: string | null;
  description: string | null;
  credentialGuide: string | null;
  credentialVideo: string | null;
  credentialsLinks: unknown;
  setupInstructions: string | null;
  helpLinks: unknown;
  videoLinks: unknown;
  troubleshooting: string | null;
  // Add these fields to satisfy your existing usage
  usageCount?: number;
  lastUsedAt?: Date | string;
}

interface WorkflowStepsViewerProps {
  workflowId: string;
  className?: string;
  showStats?: boolean;
  workflowSteps: WorkflowStep[];
  canEditSteps?: boolean;
  guideLookup?: Record<string, SetupGuideData>;
  guide?: string; // Make optional
  usageCount?: number; // Make optional
  lastUsedAt?: Date;
}

const createDefaultConnectionInfo = (): ConnectionInfo => ({
  connectsTo: [],
  connectsFrom: [],
  nextSteps: [],
  previousSteps: [],
  connectionInstructions: "No connection information available.",
});

export default function WorkflowStepsViewer({
  workflowId,
  className,
  canEditSteps = false,
  workflowSteps,
  guideLookup,
}: WorkflowStepsViewerProps) {
  const [viewedSteps, setViewedSteps] = useState<Set<string>>(new Set());
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  // Transform API workflow steps to OrderedWorkflowStep format
  const orderedSteps: OrderedWorkflowStep[] = useMemo(() => {
    const convertPosition = (position: JsonValue): [number, number] => {
      if (Array.isArray(position) && position.length >= 2) {
        const [x, y] = position;
        return [typeof x === "number" ? x : 0, typeof y === "number" ? y : 0];
      }
      return [0, 0];
    };

    return workflowSteps

      .sort((a, b) => a.stepNumber - b.stepNumber) // Sort by existing stepNumber
      .map((step) => ({
        id: step.id,
        name: step.stepTitle || "Untitled Step",
        type: step.nodeType,
        parameters:
          step.parameters &&
          typeof step.parameters === "object" &&
          !Array.isArray(step.parameters)
            ? (step.parameters as Record<string, unknown>)
            : {},
        position: convertPosition(step.position),
        stepNumber: step.stepNumber, // Use the existing stepNumber from DB
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
        helpLinks: step.helpLinks as { label: string; url: string }[] | null,
        isDisconnected: false,
        isReturnStep: step.nodeId.includes("_return_") as boolean,
        originalApiStep: step,

        connectionInfo: createDefaultConnectionInfo(),
      }));
  }, [workflowSteps]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalSteps = workflowSteps.length;
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
  }, [workflowSteps]);

  const displayedSteps = orderedSteps;
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

  // Helper function to extract guide identifiers from a step
  const extractGuideIdentifiers = (step: WorkflowStepLike | undefined) => {
    // Add null check for step
    if (!step) {
      return null;
    }

    // Use the same identifyService function that's used elsewhere
    const service = identifyService(step);

    // Build the key to match guideLookup format
    if (service.serviceName) {
      // For HTTP nodes with hostIdentifier, use "serviceName|hostIdentifier" format
      if (service.hostIdentifier) {
        return `${service.serviceName}|${service.hostIdentifier}`;
      }
      // For native nodes (no hostIdentifier), just use serviceName
      return service.serviceName;
    }

    return null;
  };

  // Now currentStep is safely checked before being passed to extractGuideIdentifiers
  const guideKey = extractGuideIdentifiers(currentStep);

  const guideData = guideKey ? guideLookup?.[guideKey] : null;

  // Handle step expansion tracking
  const handleStepToggleExpanded = useCallback((stepId: string, isExpanded: boolean) => {
    if (isExpanded) {
      setViewedSteps((prev) => new Set([...prev, stepId]));
    }
  }, []);

  const handleStepExpand = useCallback((stepId: string) => {
    if (expandedStepId === stepId) {
      setExpandedStepId(null);
    } else {
      setExpandedStepId(stepId);
      setViewedSteps((prev) => new Set([...prev, stepId]));
    }
  }, [expandedStepId]);

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

  // Early return if no steps
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
      <Card className="flex-1 overflow-hidden border-border shadow-sm">
        {/* Simplified Header */}
        <div className="border-b border-border bg-card">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              {/* Left: Simple Tutorial Badge */}
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-xs px-2 py-1">
                  <Workflow className="h-3 w-3 mr-1" />
                  Tutorial
                </Badge>
                <div className="text-sm text-muted-foreground">
                  {stats.totalSteps} Steps
                </div>
              </div>

              {/* Right: Simple Progress */}
              <div className="text-sm text-muted-foreground">
                {isOnCompletionStep
                  ? "Complete! 🎉"
                  : `Step ${currentStepIndex + 1} of ${displayedSteps.length} (${completionPercentage}%)`}
              </div>
            </div>
          </div>

          {/* Simple Navigation */}
          <div className="px-4 py-3 border-t border-border">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousStep}
                disabled={currentStepIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>

              {/* Center: Current Step Title */}
              <div className="text-center px-4 hidden sm:block">
                <div className="text-sm font-medium truncate max-w-[300px]">
                  {isOnCompletionStep
                    ? "All Steps Complete!"
                    : currentStep?.stepTitle || currentStep?.name || "Loading..."}
                </div>
              </div>

              <Button
                size="sm"
                onClick={goToNextStep}
                disabled={currentStepIndex >= totalStepsWithCompletion - 1}
                className={currentStepIndex === displayedSteps.length - 1 ? "bg-green-600 hover:bg-green-700" : ""}
              >
                {currentStepIndex === displayedSteps.length - 1 ? "Complete" : "Next"}
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <CardContent className="p-2 flex-1">
          {isOnCompletionStep ? (
            /* Completion Step */
            <MarkCompletedButton workflowId={workflowId} />
          ) : currentStep ? (
            /* Current Step */
            <UnifiedStepCard
              key={currentStep.id}
              step={currentStep}
              stepNumber={currentStepIndex + 1}
              onToggleExpanded={handleStepToggleExpanded}
              isMarkedAsViewed={viewedSteps.has(currentStep.id)}
              isExpanded={expandedStepId === currentStep.id}
              onExpand={handleStepExpand}
              canEditSteps={canEditSteps}
              guideData={guideData as NodeDocumentation | undefined}
              isReturnStep={currentStep.isReturnStep === true}
            />
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
        </CardContent>
      </Card>
    </div>
  );
}
