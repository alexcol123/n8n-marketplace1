import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,

} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

import {
  FileCode,
  PieChart,
  BookOpen,
  Award,
  ChevronRight,
  Rocket,
  Sparkles,
  ArrowRight,
  Plus,
  Target,
  CheckCircle,
  Download,
  Trophy,
  Flame,
  Star,
  Zap,
  Crown,
  Users,
  Heart,
  Gift,
  Compass,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { fetchProfile } from "@/utils/actions";
import { getUserWorkflowStats } from "@/utils/actions";
import { getUserCompletionStats } from "@/utils/actions";
import { fetchUserDownloads } from "@/utils/actions";
import { getCompletionStreaks } from "@/utils/actions";
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

// Get user level based on total activities
function getUserLevel(totalWorkflows: number, totalCompletions: number) {
  const totalActivity = totalWorkflows * 3 + totalCompletions; // Weight workflows more

  if (totalActivity >= 100)
    return {
      level: "Master",
      color: "from-purple-500 to-pink-500",
      icon: Crown,
    };
  if (totalActivity >= 50)
    return {
      level: "Expert",
      color: "from-amber-500 to-orange-500",
      icon: Trophy,
    };
  if (totalActivity >= 20)
    return { level: "Creator", color: "from-blue-500 to-cyan-500", icon: Star };
  if (totalActivity >= 10)
    return {
      level: "Explorer",
      color: "from-green-500 to-emerald-500",
      icon: Compass,
    };
  return { level: "Rookie", color: "from-gray-500 to-slate-500", icon: Target };
}

async function Dashboard() {
  // Fetch all data
  const profile = await fetchProfile();
  const stats = await getUserWorkflowStats();
  const completionStats = await getUserCompletionStats();
  const userDownloads = await fetchUserDownloads();
  const streaks = await getCompletionStreaks();
  const greeting = getGreeting();

  const isAdmin = profile?.clerkId === process.env.ADMIN_USER_ID;

  // Process data
  const { totalWorkflows, categoriesUsed, totalViews } = stats;
  const totalDownloads = Array.isArray(userDownloads)
    ? userDownloads.length
    : 0;

  // Calculate recent activity
  const recentDownloads = Array.isArray(userDownloads)
    ? userDownloads.filter((download) => {
        const downloadDate = new Date(download.downloadedAt);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return downloadDate >= sevenDaysAgo;
      }).length
    : 0;

  // Get user level and next milestone
  const userLevel = getUserLevel(
    totalWorkflows,
    completionStats.totalCompletions
  );
  const totalActivity = totalWorkflows * 3 + completionStats.totalCompletions;

  let nextMilestone: number | null = 10;
  if (totalActivity >= 10) nextMilestone = 20;
  if (totalActivity >= 20) nextMilestone = 50;
  if (totalActivity >= 50) nextMilestone = 100;
  if (totalActivity >= 100) nextMilestone = null;

  const progressToNext = nextMilestone
    ? Math.min(100, (totalActivity / nextMilestone) * 100)
    : 100;

  // Get achievements
  const achievements = [
    {
      name: "First Step",
      description: "Created your first workflow",
      unlocked: totalWorkflows >= 1,
      icon: Sparkles,
      color: "text-blue-500",
    },
    {
      name: "Learner",
      description: "Completed 5 workflows",
      unlocked: completionStats.totalCompletions >= 5,
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      name: "Streak Master",
      description: "3+ day completion streak",
      unlocked: streaks.currentStreak >= 3,
      icon: Flame,
      color: "text-orange-500",
    },
    {
      name: "Popular Creator",
      description: "100+ workflow views",
      unlocked: totalViews >= 100,
      icon: Heart,
      color: "text-pink-500",
    },
  ];

  const unlockedAchievements = achievements.filter((a) => a.unlocked);
  const nextAchievement = achievements.find((a) => !a.unlocked);

  // Motivational messages
  const motivationalMessages = [
    `You're doing amazing! ${completionStats.recentCompletions} completions this week! 🚀`,
    `Your workflows have ${totalViews} views - you're helping others! ✨`,
    `${streaks.currentStreak} day streak - keep the momentum going! 🔥`,
    `${totalDownloads} downloads in your library - what will you build next? 💡`,
    `Ready to share more knowledge with the community? 🌟`,
  ];

  const todayMessage =
    motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ];

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto">
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

              <Button asChild variant="default">
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
      {/* Hero Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-purple/5 to-blue/5 rounded-3xl p-8 border border-primary/10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-purple-600/5"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/10 to-purple/10 rounded-full -translate-y-36 translate-x-36 blur-3xl"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start justify-between gap-8">
          {/* Welcome Content */}
          <div className="flex items-start gap-6">
            <div className="relative">
              <div className="h-20 w-20 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                <Image
                  src={
                    profile?.profileImage || "https://via.placeholder.com/100"
                  }
                  alt={profile?.firstName || "User"}
                  fill
                  className="object-cover"
                />
              </div>
              {streaks.currentStreak > 0 && (
                <div className="absolute -top-2 -right-2 bg-orange-500 text-white rounded-full p-1 shadow-lg">
                  <Flame className="h-4 w-4" />
                </div>
              )}
            </div>

            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
                {greeting}, {profile?.firstName || "Creator"}!
              </h1>
              <p className="text-lg text-muted-foreground mt-2 max-w-lg">
                {todayMessage}
              </p>

              {/* Level Badge */}
              <div className="flex items-center gap-3 mt-4">
                <Badge
                  className={`bg-gradient-to-r ${userLevel.color} text-white px-4 py-2 text-sm font-semibold shadow-lg`}
                >
                  <userLevel.icon className="h-4 w-4 mr-2" />
                  {userLevel.level}
                </Badge>
                {streaks.currentStreak > 0 && (
                  <Badge
                    variant="outline"
                    className="border-orange-200 text-orange-700 dark:border-orange-800 dark:text-orange-300"
                  >
                    <Flame className="h-3 w-3 mr-1" />
                    {streaks.currentStreak} day streak
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-3">
            <CreateNewWorkflowButton />
    
          </div>
        </div>

        {/* Progress to Next Level */}
        {nextMilestone && (
          <div className="relative z-10 mt-8 p-4 bg-white/50 dark:bg-gray-900/50 rounded-2xl backdrop-blur-sm border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">
                Progress to next level
              </span>
              <span className="text-sm text-muted-foreground">
                {totalActivity}/{nextMilestone}
              </span>
            </div>
            <Progress value={progressToNext} className="h-2" />
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Workflows Created */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/30 border-blue-200/50 dark:border-blue-800/30 hover:shadow-lg transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Workflows Created
                </p>
                <p className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                  {totalWorkflows}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  {totalViews} total views
                </p>
              </div>
              <div className="bg-blue-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Rocket className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completions */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/30 border-green-200/50 dark:border-green-800/30 hover:shadow-lg transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Completed
                </p>
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">
                  {completionStats.totalCompletions}
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                  {completionStats.recentCompletions} this week
                </p>
              </div>
              <div className="bg-green-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Downloads */}
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/30 border-purple-200/50 dark:border-purple-800/30 hover:shadow-lg transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-700 dark:text-purple-300">
                  Downloads
                </p>
                <p className="text-3xl font-bold text-purple-900 dark:text-purple-100">
                  {totalDownloads}
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  {recentDownloads} this week
                </p>
              </div>
              <div className="bg-purple-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Download className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Streak */}
        <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/30 border-orange-200/50 dark:border-orange-800/30 hover:shadow-lg transition-all duration-300 group">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-700 dark:text-orange-300">
                  Current Streak
                </p>
                <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                  {streaks.currentStreak}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Best: {streaks.longestStreak} days
                </p>
              </div>
              <div className="bg-orange-500 p-3 rounded-xl group-hover:scale-110 transition-transform">
                <Flame className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements & Next Goal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Achievements */}
        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-b">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-600" />
              <CardTitle>Achievements</CardTitle>
              <Badge variant="secondary">
                {unlockedAchievements.length}/{achievements.length}
              </Badge>
            </div>
            <CardDescription>Your progress milestones</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    achievement.unlocked
                      ? "bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-950/20 dark:to-yellow-950/20 border-amber-200 dark:border-amber-800/50 shadow-sm"
                      : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2 rounded-lg ${
                        achievement.unlocked
                          ? "bg-amber-100 dark:bg-amber-900/30"
                          : "bg-gray-100 dark:bg-gray-800"
                      }`}
                    >
                      <achievement.icon
                        className={`h-5 w-5 ${
                          achievement.unlocked
                            ? achievement.color
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    <div>
                      <h4
                        className={`font-semibold ${
                          achievement.unlocked
                            ? "text-gray-900 dark:text-gray-100"
                            : "text-gray-500"
                        }`}
                      >
                        {achievement.name}
                      </h4>
                      <p
                        className={`text-sm ${
                          achievement.unlocked
                            ? "text-gray-600 dark:text-gray-400"
                            : "text-gray-400"
                        }`}
                      >
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Next Goal */}
        <Card className="bg-gradient-to-br from-primary/5 to-blue/5 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Next Goal</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {nextAchievement ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
                  <nextAchievement.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {nextAchievement.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {nextAchievement.description}
                </p>
                <Button className="w-full" asChild>
                  <Link href="/workflows">
                    Start Working
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-4">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  Achievement Master!
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  You&apos;ve unlocked all achievements! Keep creating amazing
                  workflows.
                </p>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/wf/create">
                    Create Workflow
                    <Plus className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            )}

            <Separator />

            {/* Daily Challenge */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-amber-500" />
                Daily Challenge
              </h4>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/30">
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-2">
                  Complete 1 workflow today
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-amber-600 dark:text-amber-400">
                    {streaks.todayCompletions}/1 completed
                  </span>
                  <Badge
                    variant="outline"
                    className="border-amber-200 text-amber-700"
                  >
                    <Gift className="h-3 w-3 mr-1" />
                    +10 XP
                  </Badge>
                </div>
                <Progress
                  value={Math.min(100, (streaks.todayCompletions / 1) * 100)}
                  className="h-1 mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Access */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Compass className="h-5 w-5 text-primary" />
              <CardTitle>Quick Access</CardTitle>
            </div>
            <CardDescription>
              Jump back into your workflow journey
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4"
                asChild
              >
                <Link href="/dashboard/wf/create">
                  <Plus className="h-5 w-5" />
                  <span className="text-sm">New Workflow</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4"
                asChild
              >

              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4"
                asChild
              >
                <Link href="/leaderboard/students">
                  <Award className="h-5 w-5" />
                  <span className="text-sm">Student Board</span>
                </Link>
              </Button>
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4"
                asChild
              >
                <Link href="/dashboard/mydownloads">
                  <Download className="h-5 w-5" />
                  <span className="text-sm">My Downloads</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                <CardTitle>Your Categories</CardTitle>
              </div>
              {categoriesUsed.length > 0 && (
                <Badge variant="outline">
                  {categoriesUsed.length} categories
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {categoriesUsed.length > 0 ? (
              <div className="space-y-3">
                {categoriesUsed.slice(0, 4).map((category, index) => {
                  const percentage = Math.round(
                    (category.count / totalWorkflows) * 100
                  );
                  const colors = [
                    "bg-blue-500",
                    "bg-amber-500",
                    "bg-green-500",
                    "bg-purple-500",
                  ];

                  return (
                    <div
                      key={category.name}
                      className="flex items-center gap-3"
                    >
                      <div
                        className={`w-3 h-3 rounded-full ${
                          colors[index % colors.length]
                        }`}
                      ></div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium capitalize">
                            {formatCategoryName(category.name)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {category.count} ({percentage}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-1 mt-1" />
                      </div>
                    </div>
                  );
                })}
                {categoriesUsed.length > 4 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2"
                    asChild
                  >
                    <Link href="/dashboard/analytics">
                      View All Categories{" "}
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-12 h-12 mx-auto bg-primary/10 rounded-xl flex items-center justify-center mb-3">
                  <FileCode className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  No workflows yet
                </p>
                <Button size="sm" asChild>
                  <Link href="/dashboard/wf/create">Create Your First</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Motivational Footer */}
      <Card className="bg-gradient-to-r from-primary/5 via-purple/5 to-blue/5 border-primary/20">
        <CardContent className="p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              🚀 Keep Building the Future
            </h3>
            <p className="text-muted-foreground mb-6">
              Every workflow you create helps others automate their work and
              frees up time for what matters most. You&apos;re part of a community
              that&apos;s making the world more efficient, one automation at a time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link
                  href="/dashboard/wf/create"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="h-5 w-5" />
                  Create Something Amazing
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/community" className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Join the Community
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
