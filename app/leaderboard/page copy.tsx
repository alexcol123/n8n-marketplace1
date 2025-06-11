// app/community/leaderboard/page.tsx
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  ArrowRight,
  TrendingUp,
  Flame,
  Download,
  BookOpen,
} from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community Leaderboards | n8n-store",
  description:
    "Discover top learners and workflow creators in our community. See who's leading in automation mastery and contribution.",
  keywords: [
    "n8n leaderboard",
    "top learners",
    "workflow creators",
    "automation community",
    "learning champions",
  ],
};

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-primary/10 via-primary/5 to-transparent border-b">
        <div className="container mx-auto px-4 py-12">
          {/* Back button */}
          <div className="mb-6">
            <Button variant="outline" size="sm" asChild>
              <Link href="/" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Workflows
              </Link>
            </Button>
          </div>

          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Community Leaderboards
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Celebrate our amazing community of learners and creators who make
              n8n automation accessible to everyone. Choose your path to explore
              different aspects of our vibrant community.
            </p>

            {/* Quick stats */}
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
                <Trophy className="h-5 w-5 text-primary" />
                <span className="font-medium">Live Rankings</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="font-medium">Real-time Updates</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 rounded-full">
                <Flame className="h-5 w-5 text-red-500" />
                <span className="font-medium">Community Driven</span>
              </div>
            </div>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Students Leaderboard Card */}
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-green-50/30 dark:from-emerald-950/20 dark:to-green-950/10">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-emerald-500 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <GraduationCap className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-red-500 hover:bg-red-600 animate-pulse">
                      HOT
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-emerald-200 text-emerald-700"
                    >
                      Learning
                    </Badge>
                  </div>
                </div>

                <CardTitle className="text-2xl font-bold text-emerald-800 dark:text-emerald-300 mb-2">
                  Learning Champions
                </CardTitle>
                <CardDescription className="text-base">
                  Discover our most dedicated learners and their incredible
                  progress through tutorials and courses
                </CardDescription>
              </CardHeader>

              <CardContent className="relative">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Trophy className="h-4 w-4 text-emerald-600" />
                    <span>All-time top students</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Flame className="h-4 w-4 text-red-500" />
                    <span>Daily, weekly & monthly streaks</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>Achievement badges & progress tracking</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <BookOpen className="h-4 w-4 text-blue-500" />
                    <span>Tutorial completion statistics</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white group-hover:scale-105 transition-all duration-300 shadow-lg"
                  size="lg"
                >
                  <Link
                    href="/leaderboard/students"
                    className="flex items-center justify-center gap-2"
                  >
                    <span>View Learning Champions</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Join{" "}
                    <span className="font-semibold text-emerald-600">
                      500+ active learners
                    </span>{" "}
                    on their automation journey
                  </p>
                </div>
              </CardContent>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-emerald-200/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-green-200/20 rounded-full blur-lg"></div>
            </Card>

            {/* Creators Leaderboard Card */}
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300 border-2 hover:border-blue-200 bg-gradient-to-br from-blue-50/50 to-indigo-50/30 dark:from-blue-950/20 dark:to-indigo-950/10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <CardHeader className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-500 p-3 rounded-full shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-orange-500 hover:bg-orange-600 animate-pulse">
                      TRENDING
                    </Badge>
                    <Badge
                      variant="outline"
                      className="border-blue-200 text-blue-700"
                    >
                      Creating
                    </Badge>
                  </div>
                </div>

                <CardTitle className="text-2xl font-bold text-blue-800 dark:text-blue-300 mb-2">
                  Top Creators
                </CardTitle>
                <CardDescription className="text-base">
                  Meet our most valuable contributors who share amazing
                  workflows and automation solutions
                </CardDescription>
              </CardHeader>

              <CardContent className="relative">
                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Download className="h-4 w-4 text-blue-600" />
                    <span>Most downloaded workflows</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Users className="h-4 w-4 text-purple-500" />
                    <span>Top workflow contributors</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span>Trending creators this month</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Award className="h-4 w-4 text-yellow-500" />
                    <span>Community impact metrics</span>
                  </div>
                </div>

                <Button
                  asChild
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white group-hover:scale-105 transition-all duration-300 shadow-lg"
                  size="lg"
                >
                  <Link
                    href="/leaderboard/creators"
                    className="flex items-center justify-center gap-2"
                  >
                    <span>View Top Creators</span>
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>

                <div className="mt-4 text-center">
                  <p className="text-xs text-muted-foreground">
                    Discover{" "}
                    <span className="font-semibold text-blue-600">
                      200+ amazing creators
                    </span>{" "}
                    sharing their expertise
                  </p>
                </div>
              </CardContent>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-blue-200/20 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-indigo-200/20 rounded-full blur-lg"></div>
            </Card>
          </div>

          {/* Call to Action Section */}
          <div className="mt-16 text-center ">
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-2xl border border-primary/20 max-w-3xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">
                Join Our Growing Community!
              </h3>
              <p className="text-muted-foreground mb-6 text-lg">
                Whether you&apos;re here to learn or to share your expertise,
                there&apos;s a place for you in our community. Start your
                journey today and see your name climb the leaderboards!
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="gap-2">
                  <Link href="/">
                    <BookOpen className="h-5 w-5" />
                    Start Learning
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2">
                  <Link href="/dashboard/wf/create">
                    <Award className="h-5 w-5" />
                    Create Workflow
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-emerald-500/2 to-blue-500/2 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
