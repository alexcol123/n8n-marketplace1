"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Circle,
  Loader2,
  Trophy,
  RotateCcw,
  Sparkles,
  Star,
  PartyPopper,
  Target,
  Award,
  Rocket,
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
import { Badge } from "@/components/ui/badge";
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

  // Motivational messages for completion
  const celebrationMessages = [
    "🎉 Outstanding work! You're becoming an automation master!",
    "🚀 Incredible! Another workflow conquered! You're on fire!",
    "⭐ Fantastic achievement! Your skills are growing stronger!",
    "🎯 Bulls-eye! You've mastered another automation workflow!",
    "💎 Brilliant! You're building an impressive portfolio!",
    "🏆 Champion! Another workflow added to your expertise!",
    "⚡ Superb! You're becoming unstoppable in automation!",
    "🎊 Amazing progress! Your dedication is truly inspiring!",
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
      toast.error("Please sign in to mark workflows as completed");
      return;
    }

    setIsLoading(true);
    try {
      const result = await recordWorkflowCompletion(workflowId);

      if (result.success) {
        setIsCompleted(true);
        setCompletedAt(result.completedAt ? new Date(result.completedAt) : null);
        setJustCompleted(true);
        setShowCelebration(true);

        // Show celebration toast
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

  // Don't render anything if user is not signed in
  if (!isSignedIn) {
    return (
      <div className="text-center p-6 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-xl border border-dashed border-primary/30">
        <div className="mb-4">
          <div className="h-12 w-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Track Your Progress!</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Sign in to mark workflows as completed and build your automation
            portfolio
          </p>
        </div>

        <Button variant="default" asChild>
          <Link
            href="/sign-in"
            className="gap-2  flex items-center justify-center "
          >
            <Rocket className="h-4 w-4 " />
            Sign In to Start
          </Link>
        </Button>
      </div>
    );
  }

  // Show loading state while checking status
  if (isCheckingStatus) {
    return (
      <div className="flex items-center justify-center p-4">
        <Button variant={variant} size={size} className={className} disabled>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Checking status...
        </Button>
      </div>
    );
  }

  // If completed, show completed state with celebration
  if (isCompleted) {
    return (
      <div className="space-y-4">
        {/* Celebration overlay */}
        {showCelebration && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-pink-400/20 to-purple-400/20 animate-pulse" />
            {/* Floating sparkles */}
            {[...Array(8)].map((_, i) => (
              <Sparkles
                key={i}
                className={cn(
                  "absolute h-4 w-4 text-yellow-400 animate-bounce",
                  i % 2 === 0 ? "animation-delay-200" : "",
                  i % 3 === 0 ? "animation-delay-500" : ""
                )}
                style={{
                  left: `${Math.random() * 80 + 10}%`,
                  top: `${Math.random() * 60 + 20}%`,
                  animationDelay: `${Math.random() * 1000}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Main completed status display */}
        <div
          className={cn(
            "relative overflow-hidden rounded-xl transition-all duration-500",
            "bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50",
            "dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30",
            "border-2 border-green-200 dark:border-green-800",
            justCompleted && "animate-pulse shadow-2xl shadow-green-400/25"
          )}
        >
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-full transform rotate-12 scale-150" />
          </div>

          <div className="relative p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div
                    className={cn(
                      "h-16 w-16 rounded-full flex items-center justify-center transition-all duration-500",
                      "bg-gradient-to-br from-green-400 to-emerald-500 shadow-lg",
                      justCompleted &&
                        "animate-bounce shadow-2xl shadow-green-400/40"
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
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-200 mb-1 flex items-center gap-2">
                    <PartyPopper className="h-5 w-5" />
                    Workflow Mastered!
                  </h3>
                  <p className="text-green-700 dark:text-green-300 font-medium">
                    🎯 You&apos;ve successfully completed this automation challenge!
                  </p>
                  {completedAt && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Completed{" "}
                      {formatDistanceToNow(completedAt, { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>

              <Badge
                className={cn(
                  " ml-4 px-4 py-2 text-base font-semibold shadow-lg transition-all duration-300",
                  "bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0",
                  "hover:from-green-600 hover:to-emerald-600",
                  justCompleted && "animate-pulse scale-110"
                )}
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                COMPLETED
              </Badge>
            </div>

            {/* Next Challenge Call-to-Action */}
            <div className="mt-4 p-4 bg-white/50 dark:bg-black/20 rounded-lg border border-green-200/50 dark:border-green-800/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Rocket className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm text-foreground">
                      🚀 Ready for your next challenge?
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Explore more workflows and level up your automation
                      skills!
                    </p>
                  </div>
                </div>

                <Button
                  asChild
                  className={cn(
                    "ml-4 group relative overflow-hidden transition-all duration-300",
                    "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
                    "hover:from-blue-600 hover:via-purple-600 hover:to-pink-600",
                    "shadow-lg hover:shadow-xl hover:shadow-purple-500/25",
                    "transform hover:scale-105 active:scale-95",
                    "text-white font-semibold px-6 py-2 rounded-lg",
                    "animate-pulse hover:animate-none"
                  )}
                >
                  <Link href="/" className="flex items-center gap-2">
                    {/* Button background shine animation */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                    <Target className="h-4 w-4 relative z-10" />
                    <span className="relative z-10">Next Challenge</span>
                    <Sparkles className="h-3 w-3 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Remove completion option */}
        {showRemoveOption && (
          <div className="flex justify-center">
            <Dialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground opacity-70 hover:opacity-100 transition-all"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset completion status
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <RotateCcw className="h-5 w-5" />
                    Reset Completion Status
                  </DialogTitle>
                  <DialogDescription>
                    Are you sure you want to mark &quot;{workflowTitle}&quot; as
                    incomplete? This will remove it from your completed
                    workflows list.
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
                        Reset Status
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

  // Default state - not completed (the exciting call-to-action)
  return (
    <div className="space-y-4">
      {/* Motivational header */}
      <div className="text-center p-4 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 rounded-lg border border-primary/20">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-primary">
            Ready to Master This Workflow?
          </h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Complete this automation challenge and level up your skills! 🚀
        </p>
      </div>

      {/* Main completion button */}
      <Button
        variant={variant}
        size={size}
        className={cn(
          "w-full group relative overflow-hidden transition-all duration-300",
          "bg-gradient-to-r from-primary via-primary to-primary/80",
          "hover:from-primary/90 hover:via-primary hover:to-primary/70",
          "shadow-lg hover:shadow-xl hover:shadow-primary/25",
          "transform hover:scale-[1.02] active:scale-[0.98]",
          "border-0 text-white font-semibold text-lg py-4 px-8",
          className
        )}
        onClick={handleMarkCompleted}
        disabled={isLoading}
      >
        {/* Button background animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

        {/* Button content */}
        <div className="relative flex items-center justify-center gap-3">
          {isLoading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Marking as completed...</span>
            </>
          ) : (
            <>
              <Circle className="h-5 w-5 group-hover:text-green-300 transition-colors duration-300" />
              <span>Mark as Completed</span>
              <Sparkles className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          )}
        </div>
      </Button>

      {/* Encouragement footer */}
      <div className="text-center text-xs text-muted-foreground">
        <p className="flex items-center justify-center gap-1">
          <Award className="h-3 w-3" />
          Join thousands of students mastering automation workflows
        </p>
      </div>
    </div>
  );
}
