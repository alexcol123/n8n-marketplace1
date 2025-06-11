import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  FileCode,
  PieChart,
  BookOpen,
  DollarSign,
  Share2,
  Award,
  Coffee,
  ChevronRight,
  Rocket,
  Sparkles,
  ArrowRight,
  Plus,
  Info,
  Target,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { fetchProfile } from "@/utils/actions";
import { getUserWorkflowStats } from "@/utils/actions";
import { CreateNewWorkflowButton } from "@/components/(custom)/(dashboard)/Form/Buttons";

// Helper function to get greeting based on time of day
function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

// Helper to format category names for display
function formatCategoryName(name: string) {
  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function Dashboard() {
  // Fetch profile and stats server-side
  const profile = await fetchProfile();
  const stats = await getUserWorkflowStats();
  const greeting = getGreeting();

  const isAdmin = profile?.clerkId === process.env.ADMIN_USER_ID;

  // Format stats for display
  const { totalWorkflows, categoriesUsed } = stats;

  // Get most popular categories (top 3)
  const topCategories = categoriesUsed.slice(0, 3);

  // Get random motivational quote
  const motivationalQuotes = [
    "Share your knowledge. It's a way to achieve immortality.",
    "Your expertise today becomes someone's inspiration tomorrow.",
    "The best way to predict the future is to create it.",
    "Knowledge increases by sharing but not by saving.",
    "Teaching others is the highest form of understanding.",
    "When you share your knowledge, you gain more than you give.",
    "Great things happen when you share what you know.",
    "Automation liberates human potential for creative work.",
    "Your workflows could be the solution someone is searching for.",
    "The value of knowledge multiplies when shared with others.",
    "Be the guide you wished you had when you started.",
    "Every workflow you share makes the world more efficient.",
    "Expertise shared is expertise squared.",
    "Today's automation is tomorrow's foundation.",
    "Create the tools that make others successful.",
    "Share solutions, not just problems.",
    "Build once, benefit many - that's the power of sharing workflows.",
    "Your knowledge has value - prepare to share and earn.",
    "The best experts don't hoard knowledge; they distribute it.",
    "Today's shared workflow could be tomorrow's game-changer.",
    "In the world of automation, givers gain the most.",
  ];
  const quoteIndex = Math.floor(Math.random() * motivationalQuotes.length);
  const dailyQuote = motivationalQuotes[quoteIndex];

  // Create progress status based on number of workflows
  let progressStatus = {
    level: "Beginner",
    color: "bg-blue-500",
    textColor: "text-blue-500",
    next: 10,
    message: "Create more workflows to reach Explorer status!",
  };

  if (totalWorkflows >= 20) {
    progressStatus = {
      level: "Expert",
      color: "bg-purple-500",
      textColor: "text-purple-500",
      next: 0,
      message: "You've reached Expert status! Keep creating amazing workflows.",
    };
  } else if (totalWorkflows >= 10) {
    progressStatus = {
      level: "Explorer",
      color: "bg-amber-500",
      textColor: "text-amber-500",
      next: 20,
      message: "Keep going to reach Expert status!",
    };
  }

  return (
    <div className="flex flex-col gap-6 pb-12">
{isAdmin && (
        <div className="mb-6">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center shadow-md">
                  <svg 
                    className="h-5 w-5 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                    Administrator Access
                  </h3>
                  <p className="text-sm text-amber-700 dark:text-amber-300">
                    Manage platform settings and user data
                  </p>
                </div>
              </div>
              
              <Button 
                asChild 
                variant="default">
                <Link
                  href="/admin"
                  className="flex items-center gap-2 px-4 py-2"
                  title="Access Admin Dashboard"
                >
                  <span className="font-medium">Admin Dashboard</span>
                  <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Card - Personalized with name, avatar and motivation */}
      <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 overflow-hidden">
        <CardContent className="pt-6 pb-6 relative">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-full overflow-hidden border-2 border-primary/30 shadow-md">
                <Image
                  src={
                    profile?.profileImage || "https://via.placeholder.com/100"
                  }
                  alt={profile?.firstName || "User"}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {greeting}, {profile?.firstName || "there"}
                </h1>
                <p className="text-muted-foreground mt-1">
                  Ready to share your automation expertise with the world?
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {totalWorkflows > 0 && (
                <Badge
                  variant="outline"
                  className={`${progressStatus.textColor} border-current flex items-center gap-1.5 px-3 py-1.5 font-medium`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {progressStatus.level}
                </Badge>
              )}
              <CreateNewWorkflowButton />
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none"></div>
        </CardContent>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Inspiration + Progress */}
        <div className="lg:col-span-1 space-y-6">
          {/* Inspiration Card */}
          <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-primary/20 overflow-hidden">
            <CardHeader className="pb-2 border-b bg-gradient-to-r from-amber-50/50 to-transparent dark:from-amber-950/10">
              <div className="flex items-center gap-2">
                <Coffee className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">Daily Inspiration</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <blockquote className="border-l-4 border-amber-200 dark:border-amber-700/50 pl-4 italic text-muted-foreground">
                &quot;{dailyQuote}&quot;
              </blockquote>
            </CardContent>
          </Card>

          {/* Progress Card - Only show when user has workflows */}
          {totalWorkflows > 0 && (
            <Card className="shadow-sm hover:shadow-md transition-all duration-200 border-primary/20 overflow-hidden">
              <CardHeader className="pb-2 border-b bg-gradient-to-r from-primary/5 to-transparent">
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Creator Status</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{progressStatus.level}</span>
                    {progressStatus.next && (
                      <span className="text-xs text-muted-foreground">
                        {totalWorkflows}/{progressStatus.next} workflows
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  {progressStatus.next && (
                    <div className="w-full bg-muted/30 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 rounded-full transition-all duration-700 ${progressStatus.color}`}
                        style={{
                          width: `${Math.min(
                            100,
                            (totalWorkflows / progressStatus.next) * 100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground">
                    {progressStatus.message}
                  </p>

                  {/* Benefits list */}
                  <div className="pt-2">
                    <h4 className="text-xs font-medium uppercase text-muted-foreground tracking-wider mb-2">
                      {progressStatus.level} Benefits
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <div
                          className={`${progressStatus.color} rounded-full p-0.5 mt-0.5`}
                        >
                          <svg
                            className="h-3 w-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="3"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </div>
                        <span>Featured in category listings</span>
                      </li>
                      {(progressStatus.level === "Explorer" ||
                        progressStatus.level === "Expert") && (
                        <li className="flex items-start gap-2">
                          <div
                            className={`${progressStatus.color} rounded-full p-0.5 mt-0.5`}
                          >
                            <svg
                              className="h-3 w-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span>Creator badge on your profile</span>
                        </li>
                      )}
                      {progressStatus.level === "Expert" && (
                        <li className="flex items-start gap-2">
                          <div
                            className={`${progressStatus.color} rounded-full p-0.5 mt-0.5`}
                          >
                            <svg
                              className="h-3 w-3 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="3"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span>Early access to marketplace features</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Start Card - Center/Right Column */}
        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30 shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
            <CardHeader className="border-b border-primary/10 bg-primary/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-primary/20 p-2 rounded-full">
                  <Rocket className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Share & Earn</CardTitle>
                  <CardDescription className="text-base mt-1">
                    Build your reputation today, monetize tomorrow
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-grow py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3 group">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Share2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    Share Your Knowledge
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Help others automate their work with your expertise
                  </p>
                </div>

                <div className="space-y-3 group">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    Build Authority
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Become recognized in your field of expertise
                  </p>
                </div>

                <div className="space-y-3 group">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    Future Income
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Prepare for upcoming monetization features
                  </p>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Button
                  asChild
                  className="w-full max-w-xs py-6 text-lg gap-2 bg-primary hover:bg-primary/90 shadow-md hover:shadow-lg transition-all duration-200"
                >
                  <Link
                    href="/dashboard/wf/create"
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-5 w-5" />
                    Create New Workflow
                  </Link>
                </Button>
              </div>
            </CardContent>

            <CardFooter className="bg-amber-50 dark:bg-amber-950/20 border-t border-amber-200/50 dark:border-amber-800/20 text-amber-800 dark:text-amber-300 p-3">
              <div className="flex items-center gap-2 w-full text-sm">
                <BookOpen className="h-4 w-4 flex-shrink-0" />
                <p>
                  <span className="font-semibold">Coming Soon:</span> Workflow
                  Marketplace - Sell your automation solutions and earn money!
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Category Insights Section */}
      <Card className="shadow-md overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" />
              <CardTitle>Your Workflow Collection</CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-center justify-center bg-primary/5 rounded-lg px-4 py-2 border border-primary">
                <span className="text-2xl font-bold">{totalWorkflows}</span>
                <span className="text-xs text-muted-foreground mt-1">
                  Total Workflows
                </span>
              </div>
              {categoriesUsed.length > 0 && (
                <Badge
                  variant="outline"
                  className="font-medium px-3 border border-primary"
                >
                  {categoriesUsed.length}{" "}
                  {categoriesUsed.length === 1 ? "Category" : "Categories"}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {categoriesUsed.length > 0 ? (
            <>
              {/* Top Categories Section */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
                  <span className="uppercase tracking-wider">
                    TOP CATEGORIES
                  </span>
                  <Badge variant="secondary" className="font-normal text-xs">
                    Most Used
                  </Badge>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {topCategories.map((category, index) => {
                    const percentage = Math.round(
                      (category.count / totalWorkflows) * 100
                    );
                    const colors = [
                      "bg-blue-500 text-blue-50 border-blue-600",
                      "bg-amber-500 text-amber-50 border-amber-600",
                      "bg-emerald-500 text-emerald-50 border-emerald-600",
                    ];

                    return (
                      <div
                        key={category.name}
                        className={`${colors[index].split(" ")[0]} ${
                          colors[index].split(" ")[1]
                        } rounded-lg p-4 border-l-4 ${
                          colors[index].split(" ")[2]
                        } shadow-sm hover:shadow-md transition-all duration-300 group`}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold capitalize">
                            {formatCategoryName(category.name)}
                          </h4>
                          <Badge className="bg-white/20 text-white border-0">
                            {percentage}%
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm opacity-90">
                          {category.count} workflow
                          {category.count !== 1 ? "s" : ""}
                        </p>
                        <div className="mt-3 pt-3 border-t border-white/20 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="bg-white/20 hover:bg-white/30 text-white w-full text-xs"
                            asChild
                          >
                            <Link href={`/?category=${category.name}`}>
                              <span>View Category</span>
                              <ArrowRight className="h-3 w-3 ml-1" />
                            </Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator className="my-6" />

              {/* All Categories Chart */}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wider">
                  ALL CATEGORIES
                </h3>
                <div className="space-y-4">
                  {categoriesUsed.map((category, index) => {
                    const percentage = Math.round(
                      (category.count / totalWorkflows) * 100
                    );

                    // Generate color based on index position
                    const hue = (index * 137) % 360; // Golden angle approximation for good distribution
                    const saturation = 80;
                    const lightness = 55;

                    return (
                      <div key={category.name} className="space-y-2 group">
                        <div className="flex justify-between items-center">
                          <Link
                            href={`/?category=${category.name}`}
                            className="flex items-center gap-2 hover:text-primary transition-colors"
                          >
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                              }}
                            ></span>
                            <span className="font-medium capitalize">
                              {formatCategoryName(category.name)}
                            </span>
                          </Link>
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-muted-foreground">
                              {category.count}
                            </span>
                            <span className="text-sm font-medium">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden group-hover:h-3 transition-all">
                          <div
                            className="h-full rounded-full transition-all duration-700 ease-in-out"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: `hsl(${hue}, ${saturation}%, ${lightness}%)`,
                            }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insight Box */}
              <div className="mt-8 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 rounded-md p-4 flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">
                    Category Insight
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    You&apos;re most active with{" "}
                    <span className="font-semibold">AI workflows</span> (
                    {Math.round(
                      (categoriesUsed[0].count / totalWorkflows) * 100
                    )}
                    % of total). Consider exploring{" "}
                    <span className="font-semibold">
                      {categoriesUsed.length > 3
                        ? formatCategoryName(
                            categoriesUsed[categoriesUsed.length - 1].name
                          )
                        : "other categories"}
                    </span>{" "}
                    to diversify your portfolio.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-primary/10 mb-4">
                <FileCode className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-2">No workflows yet</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Start creating workflows to see category insights and analytics
              </p>
              <Button
                className="mx-auto bg-primary hover:bg-primary/90"
                asChild
              >
                <Link
                  href="/dashboard/wf/create"
                  className="flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  Create Your First Workflow
                </Link>
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="bg-muted/10 border-t p-4">
          <Button variant="ghost" className="ml-auto" asChild>
            <Link
              href="/dashboard/wf/create"
              className="flex items-center gap-1 text-primary"
            >
              Create new workflow <ChevronRight className="h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

export default Dashboard;
