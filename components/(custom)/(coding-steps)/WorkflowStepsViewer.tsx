// components/(custom)/(workflow)/WorkflowStepsViewer.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UnifiedStepCard from "./UnifiedStepCard";
import {
  getWorkflowStepsInOrder,
  getWorkflowStats,
  type WorkflowJson,
} from "@/utils/functions/WorkflowStepsInOrder";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import MarkCompletedButton from "./MarkCompletedButton";

interface WorkflowStepsViewerProps {
  workflowJson: WorkflowJson | unknown;
  workflowId: string;
  className?: string;
  showStats?: boolean;

}

export default function WorkflowStepsViewer({
  workflowJson,
  workflowId,
  className,
  showStats = true,
}: WorkflowStepsViewerProps) {
  const [showDisconnected, setShowDisconnected] = useState(false);
  const [viewedSteps, setViewedSteps] = useState<Set<string>>(new Set());
  const [expandedStepId, setExpandedStepId] = useState<string | null>(null);

  // Handle step expansion tracking
  const handleStepToggleExpanded = (stepId: string, isExpanded: boolean) => {
    if (isExpanded) {
      setViewedSteps((prev) => new Set([...prev, stepId]));
    }
  };

  // Handle step expansion (only one at a time)
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



  // Get ordered steps and stats
  const orderedSteps = getWorkflowStepsInOrder(workflowJson);


  const stats = getWorkflowStats(workflowJson);

  console.log('ordered steps ===========================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================================')
console.log(orderedSteps)
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

                  {/* Step Content - Unified Card */}
                  <div className="flex-1 min-w-0">
                    <UnifiedStepCard
                      step={step}
                      stepNumber={step.stepNumber}
                      onToggleExpanded={handleStepToggleExpanded}
                      isMarkedAsViewed={viewedSteps.has(step.id)}
                      isExpanded={expandedStepId === step.id}
                      onExpand={handleStepExpand}
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
