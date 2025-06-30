import CategoriesList from "@/components/(custom)/CategoriesList";
import CardsContainer from "@/components/(custom)/(landing)/CardsContainer";
import Navbar from "@/components/(custom)/(landing)/Navbar";
import Footer from "@/components/(custom)/(landing)/Footer";
import LoadingCards from "@/components/(custom)/(landing)/LoadingCards";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap,
  Trophy,
  Users,
  PlayCircle,
  Star,
  Target,
  Clock,
  Sparkles,
  TrendingUp,
  ChevronDown,
  Timer,
  ArrowDown,
  Flame,
} from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Suspense } from "react";
import { fetchWorkflows } from "@/utils/actions";
import Image from "next/image";

// Get featured/popular workflows
async function getFeaturedWorkflows() {
  // Get top 4 most viewed workflows
  const popularWorkflows = await fetchWorkflows({});
  return popularWorkflows.sort((a, b) => b.viewCount - a.viewCount).slice(0, 4);
}

// Get beginner-friendly workflows
async function getBeginnerWorkflows() {
  const workflows = await fetchWorkflows({});
  // You can modify this logic based on your categorization
  return workflows
    .filter(
      (workflow) =>
        workflow.category === "building_blocks" ||
        workflow.category === "ai" ||
        workflow.title.toLowerCase().includes("simple") ||
        workflow.title.toLowerCase().includes("basic")
    )
    .slice(0, 4);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category: string; search: string }>;
}) {
  const category = (await searchParams).category;
  const search = (await searchParams).search;

  // Get featured content
  const [popularWorkflows, beginnerWorkflows] = await Promise.all([
    getFeaturedWorkflows(),
    getBeginnerWorkflows(),
  ]);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
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
              Learn automation through hands-on practice with real-world workflows.
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
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1">500+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Workflows</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1">10k+</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Students</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-1">95%</div>
                <div className="text-xs sm:text-sm text-muted-foreground">Success Rate</div>
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
                <a href="#workflows" className="flex items-center justify-center gap-2">
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
                  <span className="relative z-10 sm:hidden">Start Learning</span>
                  <span className="relative z-10 hidden sm:inline">Start Learning Now</span>
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
                <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-base text-center sm:text-left">Hands-On Learning</h3>
                <p className="hidden md:block text-sm text-muted-foreground">
                  Practice with real workflows, not just theory
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:border-primary/40 transition-colors">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 sm:mb-4 mx-auto">
                  <Clock className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-base text-center sm:text-left">Learn at Your Pace</h3>
                <p className="hidden md:block text-sm text-muted-foreground">
                  Start simple, progress to advanced automation
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm border border-primary/20 rounded-lg sm:rounded-xl p-3 sm:p-6 hover:border-primary/40 transition-colors">
                <div className="w-8 h-8 sm:w-12 sm:h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2 sm:mb-4 mx-auto">
                  <Trophy className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-1 sm:mb-2 text-xs sm:text-base text-center sm:text-left">Track Progress</h3>
                <p className="hidden md:block text-sm text-muted-foreground">
                  Mark completed workflows and build your portfolio
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Workflows Section - Simplified for mobile */}
      {(popularWorkflows.length > 0 || beginnerWorkflows.length > 0) && (
        <section className="py-8 sm:py-16 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2 sm:mb-4">
                🚀 Start Your Journey Here
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
                Handpicked workflows to get you started or challenge your skills
              </p>
            </div>

            <div className="space-y-8 sm:space-y-12">
              {/* Popular Workflows */}
              {popularWorkflows.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2">
                      <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                      <h3 className="text-lg sm:text-xl font-bold">
                        🔥 <span className="hidden sm:inline">Most Popular This Week</span>
                        <span className="sm:hidden">Popular</span>
                      </h3>
                    </div>
                    <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs">
                      Trending
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {popularWorkflows.map((workflow) => (
                      <Card
                        key={workflow.id}
                        className="group overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-primary/30"
                      >
                        <div className="relative">
                          <Image
                            src={workflow.creationImage !== null ? workflow.creationImage : workflow.workflowImage}
                            alt={workflow.title}
                            width={400}
                            height={200}
                            className="w-full h-32 sm:h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                          />

                          <Badge className="absolute top-2 right-2 bg-black/70 text-white hover:bg-black/80 text-xs">
                            <Users className="h-3 w-3 mr-1" />
                            {workflow.viewCount}
                          </Badge>
                        </div>
                        <div className="p-3 sm:p-4 h-28 sm:h-32 flex flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-xs sm:text-sm mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                              {workflow.title}
                            </h4>
                          </div>
                          <div className="flex items-center justify-between mt-auto">
                            <Badge variant="outline" className="text-xs">
                              {workflow.category.replace("_", " ")}
                            </Badge>
                            <Link
                              href={`/workflow/${workflow.slug}`}
                              className="text-xs text-primary hover:underline font-medium"
                            >
                              Try it →
                            </Link>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Main content */}
      <div className="flex-grow" id="workflows">
        {/* Section header */}
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore workflows by category and start building your automation expertise today
            </p>
          </div>
        </div>

        {/* Categories */}
        <CategoriesList category={category} search={search} />

        {/* Workflows grid with Suspense */}
        <div className="container mx-auto px-4 pb-8 sm:pb-12">
          <Suspense fallback={<LoadingCards />}>
            <CardsContainer category={category} search={search} />
          </Suspense>
        </div>
      </div>

      {/* Social proof section - Hidden on mobile, visible from md */}
      <section className="hidden md:block bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Join the Automation Revolution
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See what students are saying about their learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial cards */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm mb-4 italic">
                &quot;This platform made learning n8n so much easier. The
                step-by-step workflows are perfect for beginners!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-semibold">
                  S
                </div>
                <div>
                  <div className="font-medium text-sm">Sarah M.</div>
                  <div className="text-xs text-muted-foreground">
                    Marketing Specialist
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm mb-4 italic">
                &quot;I&apos;ve automated my entire sales process thanks to
                these workflows. Game changer for my productivity!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-semibold">
                  M
                </div>
                <div>
                  <div className="font-medium text-sm">Mike R.</div>
                  <div className="text-xs text-muted-foreground">
                    Sales Manager
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm mb-4 italic">
                &quot;From zero to automation hero in just a few weeks. The
                hands-on approach really works!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-semibold">
                  J
                </div>
                <div>
                  <div className="font-medium text-sm">Jessica L.</div>
                  <div className="text-xs text-muted-foreground">
                    Operations Manager
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4"
            >
              <a href="#workflows" className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <span>Pick Your First Workflow</span>
              </a>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}