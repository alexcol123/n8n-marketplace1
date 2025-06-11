// app/community/leaderboard/page.tsx
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  GraduationCap,
  Trophy,
  Award,
  ArrowLeft,

  TrendingUp,
  Flame,
  Download,
  BookOpen,
  Crown,
  Star,
  Zap,
  Target,
  Medal,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Leaderboards | n8n-store",
  description:
    "Compete with automation masters worldwide! Climb the rankings as a learner or creator and earn your place among the elite.",
  keywords: [
    "n8n leaderboard",
    "automation competition",
    "workflow ranking",
    "learning challenges",
    "creator rankings",
  ],
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Competition Focus */}
      <div className="bg-gradient-to-b from-primary/15 via-primary/8 to-transparent border-b relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-3 h-3 bg-blue-400 rounded-full animate-bounce"></div>
          <div className="absolute top-60 left-1/4 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-40 right-1/3 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 py-16 relative">
          {/* Back button */}
          <div className="mb-8">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="hover:bg-primary/10"
            >
              <Link href="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Workflows
              </Link>
            </Button>
          </div>

          {/* Competition-focused header */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Crown className="h-16 w-16 text-yellow-500 animate-pulse" />
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
                  <span className="text-white text-xs font-bold">!</span>
                </div>
              </div>
            </div>

            <h1 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-pulse">
              COMPETE & DOMINATE
            </h1>

            <p className="text-xl font-semibold text-foreground mb-4">
              🔥 Climb the Rankings Through Action! 🔥
            </p>

            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Download workflows to master automation skills or create workflows
              to share your expertise. Every action moves you up the{" "}
              <span className="font-bold text-primary">leaderboards!</span>
            </p>

            {/* Live competition stats */}
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-full border-2 border-red-500/30 animate-pulse">
                <Flame className="h-5 w-5 text-red-500" />
                <span className="font-bold text-red-600">LIVE RANKINGS</span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full border-2 border-green-500/30">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="font-bold text-green-600">
                  1,247 ACTIVE COMPETITORS
                </span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full border-2 border-purple-500/30">
                <Trophy className="h-5 w-5 text-purple-500" />
                <span className="font-bold text-purple-600">
                  COMMUNITY GLORY
                </span>
              </div>
            </div>
          </div>

          {/* Main Competition Cards - Larger and More Prominent */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Learning Arena Card */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-4 border-emerald-400/50 hover:border-emerald-400 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-emerald-600/10 hover:scale-105 transform">
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-green-400/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>

              {/* Competition badge */}
              <div className="absolute top-12 right-8 bg-red-500 text-white px-4 py-2 rounded-full rotate-12 font-bold text-sm animate-bounce z-10">
                🔥 HOT!
              </div>

              <CardHeader className="relative text-center pb-8 pt-12">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-emerald-400 to-green-600 p-6 rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <GraduationCap className="h-12 w-12 text-white" />
                    </div>
                    {/* Floating icons around main icon */}
                    <Star className="absolute -top-2 -right-2 h-6 w-6 text-yellow-400 animate-spin" />
                    <Medal className="absolute -bottom-2 -left-2 h-6 w-6 text-orange-400 animate-bounce" />
                  </div>
                </div>

                <CardTitle className="text-3xl font-black text-emerald-700 dark:text-emerald-300 mb-4">
                  🎓 AUTOMATION STUDENTS
                </CardTitle>
                <CardDescription className="text-lg font-semibold text-emerald-800 dark:text-emerald-200">
                  Follow workflow steps • Master automation • Climb student
                  rankings
                </CardDescription>
              </CardHeader>

              <CardContent className="relative px-8 pb-8">
                {/* Challenge metrics */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-emerald-500/20 rounded-lg border border-emerald-400/30">
                    <div className="text-2xl font-black text-emerald-600">
                      847
                    </div>
                    <div className="text-xs font-semibold text-emerald-700">
                      Learning Students
                    </div>
                  </div>
                  <div className="text-center p-4 bg-green-500/20 rounded-lg border border-green-400/30">
                    <div className="text-2xl font-black text-green-600">
                      2.3K
                    </div>
                    <div className="text-xs font-semibold text-green-700">
                      Steps Completed
                    </div>
                  </div>
                </div>

                {/* Competition features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <BookOpen className="h-5 w-5 text-green-500" />
                    <span>Follow Workflow Tutorials</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <Target className="h-5 w-5 text-red-500" />
                    <span>Complete Step-by-Step Guides</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <Zap className="h-5 w-5 text-purple-500" />
                    <span>Build Your Learning Streak</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <Crown className="h-5 w-5 text-orange-500" />
                    <span>Top Student Hall of Fame</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-lg py-6 group-hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  size="lg"
                >
                  <Link
                    href="/leaderboard/students"
                    className="flex items-center justify-center gap-3"
                  >
                    <span>VIEW TOP STUDENTS</span>
                    <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform animate-pulse" />
                  </Link>
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-sm font-bold text-emerald-600">
                    🏆 Top Student:{" "}
                    <span className="text-emerald-800">Sarah_AutoLearner</span>
                  </p>
                  <p className="text-xs text-emerald-600">
                    47 workflow tutorials completed this month!
                  </p>
                </div>
              </CardContent>

              {/* Animated decorative elements */}
              <div className="absolute top-8 right-8 w-24 h-24 bg-emerald-300/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-8 left-8 w-20 h-20 bg-green-300/20 rounded-full blur-lg animate-bounce"></div>
            </Card>

            {/* Creator Battleground Card */}
            <Card className="relative overflow-hidden group hover:shadow-2xl transition-all duration-500 border-4 border-blue-400/50 hover:border-blue-400 bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-purple-600/10 hover:scale-105 transform">
              {/* Animated border glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-indigo-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>

              {/* Competition badge */}
              <div className="absolute top-12 right-8 bg-orange-500 text-white px-4 py-2 rounded-full rotate-12 font-bold text-sm animate-bounce z-10">
                ⚡ LIVE!
              </div>

              <CardHeader className="relative text-center pb-8 pt-12">
                <div className="flex justify-center mb-6">
                  <div className="relative">
                    <div className="bg-gradient-to-br from-blue-400 to-purple-600 p-6 rounded-full shadow-2xl group-hover:scale-110 transition-transform duration-300">
                      <Users className="h-12 w-12 text-white" />
                    </div>
                    {/* Floating icons around main icon */}
                    <Download className="absolute -top-2 -right-2 h-6 w-6 text-green-400 animate-bounce" />
                    <Award className="absolute -bottom-2 -left-2 h-6 w-6 text-yellow-400 animate-pulse" />
                  </div>
                </div>

                <CardTitle className="text-3xl font-black text-blue-700 dark:text-blue-300 mb-4">
                  ⚔️ CREATOR BATTLEGROUND
                </CardTitle>
                <CardDescription className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                  Build workflows • Gain followers • Claim the throne
                </CardDescription>
              </CardHeader>

              <CardContent className="relative px-8 pb-8">
                {/* Challenge metrics */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="text-center p-4 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <div className="text-2xl font-black text-blue-600">432</div>
                    <div className="text-xs font-semibold text-blue-700">
                      Elite Creators
                    </div>
                  </div>
                  <div className="text-center p-4 bg-purple-500/20 rounded-lg border border-purple-400/30">
                    <div className="text-2xl font-black text-purple-600">
                      15K
                    </div>
                    <div className="text-xs font-semibold text-purple-700">
                      Downloads Today
                    </div>
                  </div>
                </div>

                {/* Competition features */}
                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <Award className="h-5 w-5 text-yellow-500" />
                    <span>Create & Share Workflows</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    <span>Rank by Community Impact</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <span>Gain Creator Reputation Points</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-semibold">
                    <Crown className="h-5 w-5 text-purple-500" />
                    <span>Legendary Creator Status</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-black text-lg py-6 group-hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
                  size="lg"
                >
                  <Link
                    href="/leaderboard/creators"
                    className="flex items-center justify-center gap-3"
                  >
                    <span>VIEW TOP CREATORS</span>
                    <ChevronRight className="h-6 w-6 group-hover:translate-x-2 transition-transform animate-pulse" />
                  </Link>
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-sm font-bold text-blue-600">
                    👑 Top Creator:{" "}
                    <span className="text-blue-800">Mike_FlowMaster</span>
                  </p>
                  <p className="text-xs text-blue-600">
                    23 workflows created this month!
                  </p>
                </div>
              </CardContent>

              {/* Animated decorative elements */}
              <div className="absolute top-8 right-8 w-24 h-24 bg-blue-300/20 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-8 left-8 w-20 h-20 bg-purple-300/20 rounded-full blur-lg animate-bounce"></div>
            </Card>
          </div>

          {/* Challenge Call to Action */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-to-r from-yellow-500/20 via-orange-500/20 to-red-500/20 p-10 rounded-3xl border-4 border-yellow-500/30 max-w-4xl mx-auto relative overflow-hidden">
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 via-orange-400/5 to-red-400/5 animate-pulse"></div>

              <div className="relative">
                <div className="flex justify-center mb-6">
                  <Trophy className="h-16 w-16 text-yellow-500 animate-bounce" />
                </div>

                <h3 className="text-4xl font-black mb-4 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                  READY TO PROVE YOURSELF?
                </h3>

                <p className="text-xl font-bold text-foreground mb-2">
                  🎯 Climb the rankings and earn your reputation!
                </p>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of competitors fighting for the top spot. Will
                  you be the next{" "}
                  <span className="font-black text-primary">
                    automation champion?
                  </span>
                </p>

                <div className="flex flex-wrap justify-center gap-6">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-lg px-8 py-4 gap-3 hover:scale-110 transition-all duration-300"
                  >
                    <Link href="/">
                      <BookOpen className="h-6 w-6" />
                      START DOWNLOADING
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-4 border-blue-500 text-blue-600 hover:bg-blue-500 hover:text-white font-black text-lg px-8 py-4 gap-3 hover:scale-110 transition-all duration-300"
                  >
                    <Link href="/dashboard/wf/create">
                      <Zap className="h-6 w-6" />
                      START CREATING
                    </Link>
                  </Button>
                </div>

                <div className="mt-8 text-center">
                  <p className="text-sm font-bold text-orange-600">
                    🔥 Rankings update live - every contribution counts!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced background decoration with more dynamic elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-emerald-500/3 to-purple-500/3 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-10 right-10 w-4 h-4 bg-red-400 rounded-full animate-ping"></div>
        <div className="absolute bottom-20 left-20 w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
      </div>
    </div>
  );
}
