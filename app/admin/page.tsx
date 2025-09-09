"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Users,
  FileCode,
  RefreshCw,
  Activity,
  Plus,
  TrendingUp,
  Clock,
  BarChart3,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

// Simplified interface for admin stats
interface AdminStats {
  totalUsers: number;
  totalWorkflows: number;
  recentActivity: Array<{
    type: "user" | "workflow" | "download" | "issue" | "completion";
    message: string;
    timestamp: Date;
    user?: string;
  }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [, setLastRefresh] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const { fetchAdminDashboardStats } = await import("@/utils/actions");
      const adminStats = await fetchAdminDashboardStats();
      setStats(adminStats);
      setLastRefresh(new Date());
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user":
        return <Users className="h-4 w-4 text-blue-500" />;
      case "workflow":
        return <FileCode className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <Button onClick={loadDashboardData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Platform overview and management
            </p>
          </div>
          <div className="flex gap-3">
            <Button onClick={loadDashboardData} variant="outline" size="sm" className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button asChild className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg">
              <Link href="/admin/wf/create">
                <Plus className="h-4 w-4" />
                New Workflow
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <Button asChild variant="outline" className="h-auto py-4 px-3 flex-col gap-2 hover:bg-primary/5 hover:border-primary/50 transition-all group">
          <Link href="/admin/wf">
            <FileCode className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
            <span className="text-xs">Manage Workflows</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 px-3 flex-col gap-2 hover:bg-blue-50 hover:border-blue-300 transition-all group">
          <Link href="/admin/users">
            <Users className="h-5 w-5 text-blue-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs">View Users</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 px-3 flex-col gap-2 hover:bg-purple-50 hover:border-purple-300 transition-all group">
          <Link href="/admin/portfolio-manager">
            <BarChart3 className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs">Portfolios</span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto py-4 px-3 flex-col gap-2 hover:bg-orange-50 hover:border-orange-300 transition-all group">
          <Link href="/admin/issues">
            <Activity className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform" />
            <span className="text-xs">Issues</span>
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Users</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{stats.totalUsers}</p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  Active community
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Workflows</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.totalWorkflows}</p>
                <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-green-500" />
                  Growing library
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                <FileCode className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Today</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">
                  {stats.recentActivity.filter(a => {
                    const hoursDiff = (new Date().getTime() - new Date(a.timestamp).getTime()) / (1000 * 60 * 60);
                    return hoursDiff < 24;
                  }).length}
                </p>
                <p className="text-xs text-muted-foreground mt-2">Last 24 hours</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 hover:shadow-lg transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Engagement Rate</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">
                  {stats.totalUsers > 0 ? Math.round((stats.totalWorkflows / stats.totalUsers) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-2">Workflows per user</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Card */}
      <Card className="shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="bg-gradient-to-r from-muted/50 to-transparent">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Activity className="h-4 w-4 text-primary" />
              </div>
              <span>Recent Activity</span>
            </div>
            <span className="text-xs text-muted-foreground font-normal">
              Last 10 activities
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-2">
            {stats.recentActivity.slice(0, 10).map((activity, index) => (
              <div 
                key={index} 
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-all hover:scale-[1.01] group"
              >
                <div className="mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground/90 group-hover:text-foreground transition-colors">
                    {activity.message}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                    </p>
                    {activity.user && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <p className="text-xs text-muted-foreground truncate">
                          {activity.user}
                        </p>
                      </>
                    )}
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          {stats.recentActivity.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent activity</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;