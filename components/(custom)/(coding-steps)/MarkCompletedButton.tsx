"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Trophy,
  RotateCcw,
  Sparkles,
  Star,
  Target,
  Award,
  Rocket,
  BarChart3,
  Zap,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";
import {
  recordWorkflowCompletion,
  checkWorkflowCompletion,
  removeWorkflowCompletion,
} from "@/utils/actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface MarkCompletedButtonProps {
  workflowId: string;
  workflowTitle?: string;
  variant?: "default" | "outline" | "secondary" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  showRemoveOption?: boolean;
}

export default function MarkCompletedButton({
  workflowId,
  workflowTitle = "this workflow",
  variant = "default",
  size = "lg",
  className = "",
  showRemoveOption = true,
}: MarkCompletedButtonProps) {
  const { isSignedIn } = useAuth();

  // Component state
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedAt, setCompletedAt] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);

  // Engaging completion messages that encourage return
  const celebrationMessages = [
    "🎉 Awesome! You're becoming an automation expert!",
    "🚀 Amazing work! Ready to automate even more?",
    "⭐ You're crushing it! Your automation skills are growing!",
    "🎯 Perfect! You're building serious automation expertise!",
    "💪 Incredible progress! You're unstoppable now!",
    "🏆 Outstanding! You're mastering workflow automation!",
    "⚡ Brilliant! Your productivity superpowers are growing!",
    "🔥 You're on fire! Ready for the next automation challenge?",
  ];

  // Check completion status on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (!isSignedIn) {
        setIsCheckingStatus(false);
        return;
      }

      try {
        const result = await checkWorkflowCompletion(workflowId);
        setIsCompleted(result.isCompleted);
        setCompletedAt(
          result.completedAt ? new Date(result.completedAt) : null
        );
      } catch (error) {
        console.error("Error checking completion status:", error);
        toast.error("Failed to check completion status");
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkStatus();
  }, [workflowId, isSignedIn]);

  // Handle marking as completed with celebration
  const handleMarkCompleted = async () => {
    if (!isSignedIn) {
      toast.error("Please sign in to track your progress");
      return;
    }

    setIsLoading(true);
    try {
      const result = await recordWorkflowCompletion(workflowId);

      if (result.success) {
        setIsCompleted(true);
        setCompletedAt(
          result.completedAt ? new Date(result.completedAt) : null
        );
        setJustCompleted(true);
        setShowCelebration(true);

        // Show celebration toast with return encouragement
        const randomMessage =
          celebrationMessages[
            Math.floor(Math.random() * celebrationMessages.length)
          ];
        toast.success(randomMessage, {
          duration: 6000,
          className: "text-base",
        });

        // Hide celebration after animation
        setTimeout(() => {
          setShowCelebration(false);
          setJustCompleted(false);
        }, 3000);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error marking workflow as completed:", error);
      toast.error("Failed to mark workflow as completed");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing completion
  const handleRemoveCompletion = async () => {
    setIsLoading(true);
    try {
      const result = await removeWorkflowCompletion(workflowId);

      if (result.success) {
        setIsCompleted(false);
        setCompletedAt(null);
        setShowRemoveDialog(false);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error removing completion:", error);
      toast.error("Failed to remove completion");
    } finally {
      setIsLoading(false);
    }
  };

  // Enhanced sign-in prompt
  if (!isSignedIn) {
    return (
      <div className="relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl">
          <div className="absolute top-2 right-2 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-2 left-2 w-12 h-12 bg-primary/5 rounded-full blur-lg animate-pulse delay-500" />
        </div>

        <div className="relative text-center p-6 border border-primary/20 rounded-xl backdrop-blur-sm">
          <div className="mb-4">
            <div className="h-12 w-12 mx-auto rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center mb-3 shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Start Your Learning Journey
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sign in to track completions, earn achievements, and build your
              automation portfolio
            </p>
          </div>

          <Button
            variant="default"
            asChild
            className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg"
          >
            <Link
              href="/sign-in"
              className="gap-2 flex items-center justify-center"
            >
              <Rocket className="h-4 w-4" />
              Join & Start Learning
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isCheckingStatus) {
    return (
      <div className="flex items-center justify-center p-6">
        <Button variant={variant} size={size} className={className} disabled>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Loading progress...
        </Button>
      </div>
    );
  }

  // Completed state with enhanced design
  if (isCompleted) {
    return (
      <div className="relative overflow-hidden py-2">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 via-emerald-50/80 to-green-50/80 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-green-950/30 rounded-xl">
          <div className="absolute top-4 right-4 w-20 h-20 bg-green-400/20 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-4 left-4 w-16 h-16 bg-emerald-400/15 rounded-full blur-xl animate-pulse delay-700" />
        </div>

        {/* Celebration overlay */}
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-green-400/20 to-emerald-400/20 animate-pulse" />
            {/* Floating sparkles */}
            {[...Array(6)].map((_, i) => (
              <Sparkles
                key={i}
                className="absolute h-4 w-4 text-yellow-400 animate-bounce"
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${Math.random() * 1000}ms`,
                }}
              />
            ))}
          </div>
        )}

        <div className="relative p-6 border-2 border-green-200/50 dark:border-green-800/50 rounded-xl backdrop-blur-sm">
          <div className="text-center space-y-4">
            {/* Trophy with animation */}
            <div className="relative mx-auto w-fit">
              <div
                className={cn(
                  "h-16 w-16 rounded-full flex items-center justify-center mx-auto",
                  "bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg",
                  justCompleted && "animate-bounce"
                )}
              >
                <Trophy className="h-8 w-8 text-white" />
              </div>
              {justCompleted && (
                <div className="absolute -top-1 -right-1">
                  <Star className="h-6 w-6 text-yellow-400 animate-spin" />
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 dark:from-green-200 dark:to-emerald-200 bg-clip-text text-transparent mb-2">
                🎉 Workflow Mastered!
              </h3>
              <p className="text-green-700 dark:text-green-300 text-sm mb-1">
                Amazing work! You&apos;ve completed this automation tutorial
              </p>
              {completedAt && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  Completed{" "}
                  {formatDistanceToNow(completedAt, { addSuffix: true })}
                </p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg"
              >
                <Link
                  href="/dashboard/myCompletions"
                  className="flex items-center gap-2"
                >
                  <BarChart3 className="h-4 w-4" />
                  View All Progress
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border-primary/20 hover:bg-primary/5"
              >
                <Link href="/" className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Next Challenge
                </Link>
              </Button>
            </div>

            {/* Encouragement message */}
            <div className="text-center bg-green-100/50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200/50">
              <p className="text-xs text-green-700 dark:text-green-300 font-medium">
                🚀 You&apos;re building serious automation skills! Keep the momentum
                going with more tutorials
              </p>
            </div>
          </div>
        </div>

        {/* Reset option - FIXED: Better positioning and styling */}
        {showRemoveOption && (
          <div className="relative z-50 flex justify-center mt-4">
            <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative z-50 bg-background/90 backdrop-blur-sm border-2 border-muted hover:border-primary/50 hover:bg-background text-muted-foreground hover:text-foreground transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <RotateCcw className="h-3 w-3 mr-2" />
                  Reset Status
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    Reset Completion Status
                  </DialogTitle>
                  <DialogDescription>
                    Remove &quot;{workflowTitle}&quot; from your completed
                    workflows? This action will reset your progress for this
                    tutorial.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="ghost"
                    onClick={() => setShowRemoveDialog(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleRemoveCompletion}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Resetting...
                      </>
                    ) : (
                      <>
                        <RotateCcw className="h-4 w-4" />
                        Reset
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    );
  }

  // Default state - not completed
  return (
    <div className="relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl">
        <div className="absolute top-2 right-2 w-16 h-16 bg-primary/10 rounded-full blur-xl animate-pulse" />
        <div className="absolute bottom-2 left-2 w-12 h-12 bg-primary/5 rounded-full blur-lg animate-pulse delay-500" />
      </div>

      <div className="relative space-y-4 p-6 border border-primary/20 rounded-xl backdrop-blur-sm">
        {/* Motivational header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Target className="h-5 w-5 text-primary" />
            <h3 className="font-bold text-primary">Complete This Challenge</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Finish this tutorial and add it to your growing automation skillset!
            🎯
          </p>
        </div>

        {/* Main completion button */}
        <Button
          variant={variant}
          size={size}
          className={cn(
            "w-full group relative overflow-hidden transition-all duration-300",
            "bg-gradient-to-r from-primary to-primary/90",
            "hover:from-primary/90 hover:to-primary",
            "shadow-lg hover:shadow-xl hover:shadow-primary/25",
            "transform hover:scale-[1.02] active:scale-[0.98]",
            "text-white font-semibold text-base py-3 px-6",
            className
          )}
          onClick={handleMarkCompleted}
          disabled={isLoading}
        >
          {/* Button background animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          {/* Button content */}
          <div className="relative flex items-center justify-center gap-2">
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Completing...</span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 group-hover:text-green-300 transition-colors duration-300" />
                <span>Save My Progress</span>
                <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </>
            )}
          </div>
        </Button>

        {/* Encouragement footer */}
        <div className="text-center">
          <p className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Award className="h-3 w-3" />
            Join 5,000+ automation experts building their skills daily
          </p>
        </div>
      </div>
    </div>
  );
}
