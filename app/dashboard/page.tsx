import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  ChevronRight,
  CheckCircle,
  Download,
  Sparkles,
  Trophy,
  Clock,
  Zap,
  BarChart,
  Shield,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { fetchProfile } from "@/utils/actions";
import { getUserWorkflowStats } from "@/utils/actions";
import { getUserCompletionStats } from "@/utils/actions";
import { fetchUserDownloads } from "@/utils/actions";


function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

async function Dashboard() {
  const profile = await fetchProfile();
  const stats = await getUserWorkflowStats();
  const completionStats = await getUserCompletionStats();
  const userDownloads = await fetchUserDownloads();
  const greeting = getGreeting();

  const isAdmin = profile?.clerkId === process.env.ADMIN_USER_ID;

  const { totalWorkflows } = stats;
  const totalDownloads = Array.isArray(userDownloads) ? userDownloads.length : 0;

  return (
    <div className="flex flex-col gap-8 pb-12 max-w-7xl mx-auto px-4">
      {isAdmin && (
        <div className="relative overflow-hidden bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-amber-950/30 border border-amber-200/60 dark:border-amber-800/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 group">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg animate-pulse">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-amber-900 dark:text-amber-100 flex items-center gap-2">
                  Administrator Access
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                </h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">Full platform control</p>
              </div>
            </div>
            <Button asChild className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg transition-all hover:scale-105">
              <Link href="/admin" className="flex items-center gap-2">
                Admin Dashboard
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Welcome Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-blue-500/5 to-purple-500/10 rounded-2xl p-8 border border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
        <div className="relative z-10 flex items-start gap-6">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
            <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-3 border-white shadow-xl">
              <Image
                src={profile?.profileImage || ""}
                alt={profile?.firstName || "User"}
                width={80}
                height={80}
                className="object-cover w-20 h-20"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                {greeting}, {profile?.firstName || "Creator"}!
              </h1>
              <Sparkles className="h-6 w-6 text-yellow-500 animate-pulse" />
            </div>
            <p className="text-muted-foreground text-lg flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              Ready to build something amazing today?
            </p>
            <div className="flex gap-3 mt-4">
              <Button asChild variant="default" className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md hover:shadow-lg transition-all hover:scale-105">
                <Link href="/" className="flex items-center gap-2">
                  Browse Workflows
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
             
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">


        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-all hover:scale-[1.02] group">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Completed</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{completionStats.totalCompletions}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Trophy className="h-3 w-3 text-yellow-500" />
                  <p className="text-xs text-muted-foreground">Great progress</p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-all hover:scale-[1.02] group">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Downloads</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{totalDownloads}</p>
                <div className="flex items-center gap-1 mt-2">
                  <Clock className="h-3 w-3 text-blue-500" />
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-all hover:scale-[1.02] group">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Success Rate</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {totalWorkflows > 0 ? Math.round((completionStats.totalCompletions / totalWorkflows) * 100) : 0}%
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <BarChart className="h-3 w-3 text-orange-500" />
                  <p className="text-xs text-muted-foreground">Completion ratio</p>
                </div>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Trophy className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">

        <Button asChild variant="outline" className="h-auto py-4 px-3 flex-col gap-2 hover:bg-green-50 hover:border-green-300 transition-all group">
          <Link href="/dashboard/mydownloads">
            <Download className="h-5 w-5 text-green-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs">Downloads</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 px-3 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all group">
          <Link href="/dashboard/portfolio">
            <BarChart className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs">Portfolio</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 px-3 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all group">
          <Link href="/dashboard/profile">
            <Shield className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs">Profile</span>
          </Link>
        </Button>
      </div>

    </div>
  );
}

export default Dashboard;
