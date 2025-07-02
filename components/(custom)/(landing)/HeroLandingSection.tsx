import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowDown,
  ChevronDown,
  Clock,
  PlayCircle,
  Sparkles,
  Target,
  Timer,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react";
import Link from "next/link";

const HeroLandingSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-primary/10">
      {/* Background decoration - Hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden hidden sm:block">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-12 sm:py-16 lg:py-24">
        <div className="text-center max-w-4xl mx-auto">
          {/* Trending badge - Hidden on mobile, full design on large screens */}
          <div className="hidden sm:inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 border border-primary/20">
            <TrendingUp className="h-4 w-4" />
            <span>🔥 Join 10,000+ students mastering automation</span>
          </div>

          {/* Main headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent leading-tight">
            Master n8n Automation
            <br />
            <span className="text-primary">One Workflow at a Time</span>
          </h1>

          {/* Subheadline - Full design on large screens */}
          <p className="text-base sm:text-xl lg:text-2xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Learn automation through hands-on practice with real-world
            workflows.
            <span className="text-primary font-semibold hidden sm:inline">
              {" "}
              Start building, start automating, start succeeding.
            </span>
          </p>

          {/* Success indicators - Show on MD+ as in your design */}
          <div className="hidden md:flex flex-wrap justify-center gap-4 lg:gap-8 mb-8 text-sm">
            <Badge
              variant="outline"
              className="px-4 py-2 border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50 transition-colors"
            >
              <Timer className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
              <span className="text-green-800 dark:text-green-200 font-medium">
                ⚡ Average setup: 10 minutes
              </span>
            </Badge>
            <Badge
              variant="outline"
              className="px-4 py-2 border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 hover:bg-blue-100 dark:hover:bg-blue-950/50 transition-colors"
            >
              <Target className="h-4 w-4 text-blue-600 dark:text-blue-400 mr-2" />
              <span className="text-blue-800 dark:text-blue-200 font-medium">
                🎯 94% complete their first workflow
              </span>
            </Badge>
            <Badge
              variant="outline"
              className="px-4 py-2 border-2 border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-950/50 transition-colors"
            >
              <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="text-purple-800 dark:text-purple-200 font-medium">
                💪 3 workflows mastered in first week
              </span>
            </Badge>
          </div>

          {/* Stats row - Mobile compact, desktop full */}
          <div className="flex justify-center gap-4 sm:gap-6 lg:gap-12 mb-6 sm:mb-10">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1">
                50+
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Workflows
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1">
                2k+
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Students
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1">
                95%
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                Success Rate
              </div>
            </div>
          </div>

          {/* CTA buttons - Match your large screen design */}
          <div className="flex flex-col mx-10 gap-3 items-center max-w-sm sm:mx-auto sm:max-w-none sm:flex-row sm:gap-4 sm:justify-center mb-6 sm:mb-12">
            <Button
              asChild
              variant="outline"
              size="lg"
              className=" w-full sm:w-auto group border-2 border-primary/30 hover:border-primary hover:bg-primary/5  px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-lg font-semibold transition-all duration-300"
            >
              <a
                href="#workflows"
                className="flex items-center justify-center gap-2"
              >
                <ArrowDown className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="sm:hidden ">Browse Workflows</span>
                <span className="hidden sm:inline">Browse Workflows Below</span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-y-1" />
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto group relative overflow-hidden bg-gradient-to-r from-primary via-primary to-primary/80 hover:from-primary/90 hover:via-primary hover:to-primary/70 shadow-xl hover:shadow-2xl hover:shadow-primary/25 transform hover:scale-105 transition-all duration-300 px-6 py-3 sm:px-8 sm:py-4 text-sm sm:text-lg font-semibold"
            >
              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-2 sm:gap-3"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <PlayCircle className="h-4 w-4 sm:h-6 sm:w-6 relative z-10" />
                <span className="relative z-10 sm:hidden">Get Started</span>
                <span className="relative z-10 hidden sm:inline">
                  Get Started Free
                </span>
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>
          </div>

          {/* Feature highlights - Mobile optimized, desktop matches your design */}
          <div className="grid grid-cols-3 gap-3 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:border-primary/40 transition-colors">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 sm:mb-4 mx-auto">
                <Target className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-base text-center ">
                Hands-On Learning
              </h3>
              <p className="hidden md:block text-sm text-muted-foreground">
                Practice with real workflows, not just theory
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:border-primary/40 transition-colors">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 sm:mb-4 mx-auto">
                <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-base text-center ">
                Learn at Your Pace
              </h3>
              <p className="hidden md:block text-sm text-muted-foreground">
                Start simple, progress to advanced automation
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:border-primary/40 transition-colors">
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 sm:mb-4 mx-auto">
                <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-base text-center ">
                Track Progress
              </h3>
              <p className="hidden md:block text-sm text-muted-foreground">
                Mark completed workflows and build your portfolio
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
export default HeroLandingSection;
