"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Users,
  FileCode,
  Download,
  AlertCircle,
  TrendingUp,
  Eye,
  Award,
  RefreshCw,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  Activity,
  Star,
  Zap,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Define interfaces for our data
interface AdminStats {
  totalUsers: number;
  totalWorkflows: number;
  totalDownloads: number;
  totalIssues: number;
  totalViews: number;
  totalCompletions: number;
  todayStats: {
    newUsers: number;
    newWorkflows: number;
    newDownloads: number;
    newIssues: number;
    newCompletions: number;
  };
  issuesByStatus: {
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
  };
  recentActivity: Array<{
    type: "user" | "workflow" | "download" | "issue" | "completion";
    message: string;
    timestamp: Date;
    user?: string;
  }>;
  topWorkflows: Array<{
    id: string;
    title: string;
    author: string;
    downloads: number;
    views: number;
  }>;
  topUsers: Array<{
    id: string;
    name: string;
    workflowCount: number;
    totalDownloads: number;
  }>;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Import the function at the top of your file
      const { fetchAdminDashboardStats } = await import("@/utils/actions");
      
      // Call the real server action
      const adminStats = await fetchAdminDashboardStats();
      
      setStats(adminStats);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error loading dashboard data:", error);
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
      case "download":
        return <Download className="h-4 w-4 text-purple-500" />;
      case "issue":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "completion":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Platform overview and key metrics
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            Last updated: {formatDistanceToNow(lastRefresh, { addSuffix: true })}
          </div>
          <Button onClick={loadDashboardData} variant="outline" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Users */}
        <Card className="border-blue-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.todayStats.newUsers} today
                </p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Total Workflows */}
        <Card className="border-green-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Workflows</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalWorkflows}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.todayStats.newWorkflows} today
                </p>
              </div>
              <FileCode className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        {/* Total Downloads */}
        <Card className="border-purple-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
                <p className="text-3xl font-bold text-purple-600">{stats.totalDownloads}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.todayStats.newDownloads} today
                </p>
              </div>
              <Download className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        {/* Total Issues */}
        <Card className="border-red-200 hover:shadow-md transition-shadow">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Open Issues</p>
                <p className="text-3xl font-bold text-red-600">{stats.totalIssues}</p>
                <p className="text-xs text-red-600 mt-1">
                  +{stats.todayStats.newIssues} today
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Views */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Views</p>
                <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
              </div>
              <Eye className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Total Completions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Completions</p>
                <p className="text-2xl font-bold">{stats.totalCompletions.toLocaleString()}</p>
                <p className="text-xs text-green-600 mt-1">
                  +{stats.todayStats.newCompletions} today
                </p>
              </div>
              <Award className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>

        {/* Average Downloads per Workflow */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Downloads/Workflow</p>
                <p className="text-2xl font-bold">
                  {Math.round(stats.totalDownloads / stats.totalWorkflows)}
                </p>
              </div>
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Issues Status Breakdown */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Issues Status Breakdown
          </CardTitle>
          <CardDescription>Current status distribution of all issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <AlertCircle className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Open</p>
                <p className="text-xl font-bold text-blue-600">{stats.issuesByStatus.open}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-xl font-bold text-yellow-600">{stats.issuesByStatus.inProgress}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Resolved</p>
                <p className="text-xl font-bold text-green-600">{stats.issuesByStatus.resolved}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-950/20 rounded-lg">
              <XCircle className="h-8 w-8 text-gray-600" />
              <div>
                <p className="text-sm text-muted-foreground">Closed</p>
                <p className="text-xl font-bold text-gray-600">{stats.issuesByStatus.closed}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bottom Grid - Top Performers and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Workflows */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Top Workflows
            </CardTitle>
            <CardDescription>Most downloaded workflows</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topWorkflows.map((workflow, index) => (
                <div key={workflow.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{workflow.title}</p>
                      <p className="text-xs text-muted-foreground">by {workflow.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{workflow.downloads} downloads</p>
                    <p className="text-xs text-muted-foreground">{workflow.views} views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Contributors */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Top Contributors
            </CardTitle>
            <CardDescription>Most active workflow creators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.topUsers.map((user, index) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                      {index + 1}
                    </Badge>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.workflowCount} workflows</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{user.totalDownloads} downloads</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <CardDescription>Latest platform activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 p-3 hover:bg-muted/30 rounded-lg transition-colors">
                {getActivityIcon(activity.type)}
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;