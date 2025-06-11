// app/creators/page.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  Award,
  Download,
  Users,
  Flame,
  Zap,
  Calendar,

  ArrowRight,
  Eye,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

// Enhanced mock data with time-based leaderboards
const mockCreatorsData = {
  // All-time top creators
  allTime: [
    {
      id: "1",
      name: "Sarah Johnson",
      username: "sarah_automation",
      profileImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      workflowCount: 23,
      totalDownloads: 2847,
      totalViews: 15234,
    },
    {
      id: "2",
      name: "Mike Chen",
      username: "mike_dev",
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      workflowCount: 19,
      totalDownloads: 2156,
      totalViews: 12987,
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      username: "emma_workflows",
      profileImage:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      workflowCount: 17,
      totalDownloads: 1823,
      totalViews: 11456,
    },
    {
      id: "4",
      name: "Alex Turner",
      username: "alex_automate",
      profileImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      workflowCount: 15,
      totalDownloads: 1567,
      totalViews: 9876,
    },
    {
      id: "5",
      name: "David Kim",
      username: "david_builder",
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      workflowCount: 14,
      totalDownloads: 1334,
      totalViews: 8765,
    },
    {
      id: "6",
      name: "Lisa Wang",
      username: "lisa_tech",
      profileImage:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face",
      workflowCount: 12,
      totalDownloads: 1156,
      totalViews: 7432,
    },
    {
      id: "7",
      name: "James Wilson",
      username: "james_flow",
      profileImage:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
      workflowCount: 11,
      totalDownloads: 987,
      totalViews: 6543,
    },
    {
      id: "8",
      name: "Rachel Green",
      username: "rachel_systems",
      profileImage:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      workflowCount: 10,
      totalDownloads: 876,
      totalViews: 5789,
    },
    {
      id: "9",
      name: "Tom Anderson",
      username: "tom_creator",
      profileImage:
        "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&h=150&fit=crop&crop=face",
      workflowCount: 9,
      totalDownloads: 743,
      totalViews: 4987,
    },
    {
      id: "10",
      name: "Sofia Martinez",
      username: "sofia_ninja",
      profileImage:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop&crop=face",
      workflowCount: 8,
      totalDownloads: 654,
      totalViews: 4321,
    },
  ],

  // Today's top creators (by new workflows or downloads)
  today: [
    {
      id: "2",
      name: "Mike Chen",
      username: "mike_dev",
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      todayMetric: 3, // workflows created today
      metricType: "workflows",
    },
    {
      id: "1",
      name: "Sarah Johnson",
      username: "sarah_automation",
      profileImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      todayMetric: 2,
      metricType: "workflows",
    },
    {
      id: "5",
      name: "David Kim",
      username: "david_builder",
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      todayMetric: 1,
      metricType: "workflows",
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      username: "emma_workflows",
      profileImage:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      todayMetric: 1,
      metricType: "workflows",
    },
    {
      id: "7",
      name: "James Wilson",
      username: "james_flow",
      profileImage:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face",
      todayMetric: 1,
      metricType: "workflows",
    },
  ],

  // This week's top creators
  week: [
    {
      id: "1",
      name: "Sarah Johnson",
      username: "sarah_automation",
      profileImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      weekMetric: 8,
      metricType: "workflows",
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      username: "emma_workflows",
      profileImage:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      weekMetric: 6,
      metricType: "workflows",
    },
    {
      id: "2",
      name: "Mike Chen",
      username: "mike_dev",
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      weekMetric: 5,
      metricType: "workflows",
    },
    {
      id: "5",
      name: "David Kim",
      username: "david_builder",
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      weekMetric: 4,
      metricType: "workflows",
    },
    {
      id: "4",
      name: "Alex Turner",
      username: "alex_automate",
      profileImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      weekMetric: 3,
      metricType: "workflows",
    },
  ],

  // This month's top creators
  month: [
    {
      id: "1",
      name: "Sarah Johnson",
      username: "sarah_automation",
      profileImage:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      monthMetric: 23,
      metricType: "workflows",
    },
    {
      id: "2",
      name: "Mike Chen",
      username: "mike_dev",
      profileImage:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      monthMetric: 19,
      metricType: "workflows",
    },
    {
      id: "3",
      name: "Emma Rodriguez",
      username: "emma_workflows",
      profileImage:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      monthMetric: 17,
      metricType: "workflows",
    },
    {
      id: "4",
      name: "Alex Turner",
      username: "alex_automate",
      profileImage:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      monthMetric: 15,
      metricType: "workflows",
    },
    {
      id: "5",
      name: "David Kim",
      username: "david_builder",
      profileImage:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      monthMetric: 14,
      metricType: "workflows",
    },
  ],
};

export default function CreatorsLeaderboard() {
  // Use mock data directly
  const creatorsData = mockCreatorsData;
  const hasData = true; // Always true for testing

  if (!hasData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6">Top Creators</h1>
        <div className="max-w-lg mx-auto bg-muted/20 rounded-lg p-10 border">
          <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">No Creator Data Yet</h2>
          <p className="text-muted-foreground mb-6">
            As more workflows are created and shared, creator statistics will
            become available here.
          </p>
          <Button asChild>
            <Link href="/">Browse Workflows</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Top Creators</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our most valuable workflow creators and community champions
        </p>
      </div>

      {/* Top Creators Leaderboard */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-primary" />
            Creator Champions
          </h2>

          {/* Quick stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {creatorsData?.today?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Active Today</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">
                {creatorsData?.week?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">
                {creatorsData?.month?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">This Month</div>
            </div>
          </div>
        </div>

        {/* Tabbed leaderboards */}
        <Tabs defaultValue="alltime" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="alltime" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              <span className="hidden sm:inline">All Time</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger value="today" className="flex items-center gap-2">
              <Flame className="h-4 w-4" />
              <span className="hidden sm:inline">Today</span>
              <Badge variant="destructive" className="ml-1 h-5 px-1.5 text-xs">
                HOT
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="week" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span className="hidden sm:inline">This Week</span>
              <span className="sm:hidden">Week</span>
            </TabsTrigger>
            <TabsTrigger value="month" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">This Month</span>
              <span className="sm:hidden">Month</span>
            </TabsTrigger>
          </TabsList>

          {/* All Time Leaders */}
          <TabsContent value="alltime" className="space-y-8">
            {creatorsData.allTime.length > 0 ? (
              <>
                {/* Top 3 creators - featured cards */}
                {creatorsData.allTime.slice(0, 3).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {creatorsData.allTime.slice(0, 3).map((creator, index) => (
                      <div
                        key={creator.id}
                        className={`rounded-xl p-6 border text-center transition-all duration-300 shadow-md hover:shadow-lg ${
                          index === 0
                            ? "bg-gradient-to-b from-yellow-50 to-yellow-50/20 border-yellow-200 dark:from-yellow-950/20 dark:to-yellow-950/5 dark:border-yellow-900/30"
                            : index === 1
                            ? "bg-gradient-to-b from-gray-50 to-gray-50/20 border-gray-200 dark:from-gray-900/20 dark:to-gray-900/5 dark:border-gray-800/30"
                            : "bg-gradient-to-b from-amber-50 to-amber-50/20 border-amber-200 dark:from-amber-950/20 dark:to-amber-950/5 dark:border-amber-900/30"
                        }`}
                      >
                        <div className="relative flex justify-center mb-4">
                          <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-md">
                            <AvatarImage
                              src={creator.profileImage}
                              alt={creator.name}
                            />
                            <AvatarFallback className="text-2xl">
                              {creator.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>

                          {/* Position badge with trophy */}
                          <div
                            className={`absolute -top-3 -right-3 rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold shadow ${
                              index === 0
                                ? "bg-yellow-400 text-yellow-50"
                                : index === 1
                                ? "bg-gray-400 text-gray-50"
                                : "bg-amber-600 text-amber-50"
                            }`}
                          >
                            {index === 0 ? (
                              <Trophy className="h-5 w-5" />
                            ) : (
                              index + 1
                            )}
                          </div>
                        </div>

                        <h3 className="text-xl font-bold mb-1">
                          {creator.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          @{creator.username}
                        </p>

                        <div className="text-3xl font-bold text-primary mb-2">
                          {creator.workflowCount}
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          Total Workflows
                        </p>

                        {/* Stats row */}
                        <div className="flex justify-between text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {creator.totalDownloads}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {creator.totalViews}
                          </div>
                        </div>

                        {/* Achievement badge */}
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                            index === 0
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : index === 1
                              ? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                          }`}
                        >
                          <Award className="h-3 w-3" />
                          {index === 0
                            ? "Creator Legend"
                            : index === 1
                            ? "Workflow Master"
                            : "Automation Star"}
                        </div>

                        <Button asChild size="sm" className="w-full mt-4">
                          <Link href={`/authors/${creator.username}`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Remaining creators - compact list */}
                {creatorsData.allTime.length > 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {creatorsData.allTime.slice(3, 10).map((creator, index) => (
                      <div
                        key={creator.id}
                        className="p-4 border rounded-lg bg-card hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex items-center">
                          {/* Rank */}
                          <div className="bg-muted flex items-center justify-center h-8 w-8 rounded-full text-sm font-semibold mr-4">
                            {index + 4}
                          </div>

                          {/* Profile */}
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage
                                src={creator.profileImage}
                                alt={creator.name}
                              />
                              <AvatarFallback>
                                {creator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div>
                              <div className="font-medium">{creator.name}</div>
                              <div className="text-xs text-muted-foreground">
                                @{creator.username}
                              </div>
                            </div>
                          </div>

                          {/* Workflow count */}
                          <div className="ml-auto text-center">
                            <div className="font-bold text-primary">
                              {creator.workflowCount}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Workflows
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No creators have shared workflows yet. Be the first!</p>
              </div>
            )}
          </TabsContent>

          {/* Today's Top Creators */}
          <TabsContent value="today" className="space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-lg border border-red-200 dark:border-red-900/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-500 p-2 rounded-full">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-700 dark:text-red-300">
                    🔥 Today&apos;s Creation Streak
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Creators building amazing workflows today!
                  </p>
                </div>
                <Badge className="ml-auto bg-red-500 hover:bg-red-600">
                  LIVE
                </Badge>
              </div>

              {creatorsData?.today?.length > 0 ? (
                <div className="space-y-6">
                  {/* Top 3 Featured Cards */}
                  {creatorsData.today.slice(0, 3).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {creatorsData.today.slice(0, 3).map((creator, index) => (
                        <div
                          key={creator.id}
                          className={`rounded-xl p-4 border text-center transition-all duration-300 shadow-md hover:shadow-lg ${
                            index === 0
                              ? "bg-gradient-to-b from-red-100 to-red-50 border-red-300 dark:from-red-900/30 dark:to-red-900/10 dark:border-red-800/30"
                              : index === 1
                              ? "bg-gradient-to-b from-orange-100 to-orange-50 border-orange-300 dark:from-orange-900/30 dark:to-orange-900/10 dark:border-orange-800/30"
                              : "bg-gradient-to-b from-yellow-100 to-yellow-50 border-yellow-300 dark:from-yellow-900/30 dark:to-yellow-900/10 dark:border-yellow-800/30"
                          }`}
                        >
                          <div className="relative flex justify-center mb-3">
                            <Avatar className="h-16 w-16 border-2 border-white dark:border-gray-800 shadow-md">
                              <AvatarImage
                                src={creator.profileImage}
                                alt={creator.name}
                              />
                              <AvatarFallback className="text-lg">
                                {creator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div
                              className={`absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow ${
                                index === 0
                                  ? "bg-red-500 text-white"
                                  : index === 1
                                  ? "bg-orange-500 text-white"
                                  : "bg-yellow-500 text-white"
                              }`}
                            >
                              {index === 0 ? "🔥" : index + 1}
                            </div>
                          </div>

                          <h4 className="font-bold mb-1">{creator.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            @{creator.username}
                          </p>

                          <div className="text-xl font-bold text-red-600 mb-1">
                            {creator.todayMetric}
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            workflows today
                          </p>

                          <Badge
                            variant="destructive"
                            className="animate-pulse text-xs"
                          >
                            {index === 0
                              ? "Today's Champion!"
                              : index === 1
                              ? "On Fire!"
                              : "Hot Streak!"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Remaining creators - Compact List */}
                  {creatorsData.today.length > 3 && (
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3 text-sm uppercase tracking-wide">
                        Today&apos;s Top Creators
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {creatorsData.today
                          .slice(3, 10)
                          .map((creator, index) => (
                            <div
                              key={creator.id}
                              className="flex items-center gap-3 bg-white dark:bg-gray-800/50 p-3 rounded-lg hover:shadow-md transition-all"
                            >
                              <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold h-8 w-8 rounded-full flex items-center justify-center text-sm">
                                {index + 4}
                              </div>
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={creator.profileImage}
                                  alt={creator.name}
                                />
                                <AvatarFallback className="text-xs">
                                  {creator.name.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {creator.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  @{creator.username}
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {creator.todayMetric} today
                              </Badge>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Flame className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>
                    No workflows created today yet. Start your creation streak!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* This Week's Top Creators */}
          <TabsContent value="week" className="space-y-6">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 dark:from-orange-950/20 dark:to-yellow-950/20 p-6 rounded-lg border border-orange-200 dark:border-orange-900/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-orange-500 p-2 rounded-full">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-orange-700 dark:text-orange-300">
                    ⚡ Weekly Warriors
                  </h3>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    Dominating this week&apos;s creation challenges!
                  </p>
                </div>
              </div>

              {creatorsData?.week?.length > 0 ? (
                <div className="space-y-6">
                  {creatorsData.week.slice(0, 3).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {creatorsData.week.slice(0, 3).map((creator, index) => (
                        <div
                          key={creator.id}
                          className={`rounded-xl p-4 border text-center transition-all duration-300 shadow-md hover:shadow-lg ${
                            index === 0
                              ? "bg-gradient-to-b from-orange-100 to-orange-50 border-orange-300 dark:from-orange-900/30 dark:to-orange-900/10 dark:border-orange-800/30"
                              : index === 1
                              ? "bg-gradient-to-b from-yellow-100 to-yellow-50 border-yellow-300 dark:from-yellow-900/30 dark:to-yellow-900/10 dark:border-yellow-800/30"
                              : "bg-gradient-to-b from-amber-100 to-amber-50 border-amber-300 dark:from-amber-900/30 dark:to-amber-900/10 dark:border-amber-800/30"
                          }`}
                        >
                          <div className="relative flex justify-center mb-3">
                            <Avatar className="h-16 w-16 border-2 border-white dark:border-gray-800 shadow-md">
                              <AvatarImage
                                src={creator.profileImage}
                                alt={creator.name}
                              />
                              <AvatarFallback className="text-lg">
                                {creator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div
                              className={`absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow ${
                                index === 0
                                  ? "bg-orange-500 text-white"
                                  : index === 1
                                  ? "bg-yellow-500 text-white"
                                  : "bg-amber-500 text-white"
                              }`}
                            >
                              {index === 0 ? "👑" : index + 1}
                            </div>
                          </div>

                          <h4 className="font-bold mb-1">{creator.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            @{creator.username}
                          </p>

                          <div className="text-xl font-bold text-orange-600 mb-1">
                            {creator.weekMetric}
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            this week
                          </p>

                          <Badge
                            className={`text-xs ${
                              index === 0
                                ? "bg-orange-500"
                                : index === 1
                                ? "bg-yellow-500"
                                : "bg-amber-500"
                            }`}
                          >
                            {index === 0
                              ? "Weekly Champion!"
                              : index === 1
                              ? "Warrior!"
                              : "Rising!"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Zap className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>
                    No workflows created this week yet. Be the weekly champion!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* This Month's Top Creators */}
          <TabsContent value="month" className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-6 rounded-lg border border-blue-200 dark:border-blue-900/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-500 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300">
                    📅 Monthly Masters
                  </h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    Consistent creators making serious impact!
                  </p>
                </div>
              </div>

              {creatorsData?.month?.length > 0 ? (
                <div className="space-y-6">
                  {creatorsData.month.slice(0, 3).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {creatorsData.month.slice(0, 3).map((creator, index) => (
                        <div
                          key={creator.id}
                          className={`rounded-xl p-4 border text-center transition-all duration-300 shadow-md hover:shadow-lg ${
                            index === 0
                              ? "bg-gradient-to-b from-blue-100 to-blue-50 border-blue-300 dark:from-blue-900/30 dark:to-blue-900/10 dark:border-blue-800/30"
                              : index === 1
                              ? "bg-gradient-to-b from-indigo-100 to-indigo-50 border-indigo-300 dark:from-indigo-900/30 dark:to-indigo-900/10 dark:border-indigo-800/30"
                              : "bg-gradient-to-b from-cyan-100 to-cyan-50 border-cyan-300 dark:from-cyan-900/30 dark:to-cyan-900/10 dark:border-cyan-800/30"
                          }`}
                        >
                          <div className="relative flex justify-center mb-3">
                            <Avatar className="h-16 w-16 border-2 border-white dark:border-gray-800 shadow-md">
                              <AvatarImage
                                src={creator.profileImage}
                                alt={creator.name}
                              />
                              <AvatarFallback className="text-lg">
                                {creator.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            <div
                              className={`absolute -top-2 -right-2 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold shadow ${
                                index === 0
                                  ? "bg-blue-500 text-white"
                                  : index === 1
                                  ? "bg-indigo-500 text-white"
                                  : "bg-cyan-500 text-white"
                              }`}
                            >
                              {index === 0 ? "🏆" : index === 1 ? "🥈" : "🥉"}
                            </div>
                          </div>

                          <h4 className="font-bold mb-1">{creator.name}</h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            @{creator.username}
                          </p>

                          <div className="text-xl font-bold text-blue-600 mb-1">
                            {creator.monthMetric}
                          </div>
                          <p className="text-xs text-muted-foreground mb-3">
                            this month
                          </p>

                          <Badge
                            className={`text-xs ${
                              index === 0
                                ? "bg-blue-500"
                                : index === 1
                                ? "bg-indigo-500"
                                : "bg-cyan-500"
                            }`}
                          >
                            {index === 0
                              ? "Monthly Champion!"
                              : index === 1
                              ? "Monthly Master!"
                              : "Consistent!"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>
                    No workflows created this month yet. Start your monthly
                    streak!
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to action section */}
        <div className="mt-12 bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 rounded-xl border border-primary/20">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/20 p-4 rounded-full">
                <Trophy className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mb-4">
              Join the Creator Revolution! 🚀
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Share your automation expertise with the world. Create workflows,
              build your reputation, and help others automate their work more
              efficiently.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {creatorsData.allTime.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Creators
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {creatorsData.allTime
                    .reduce(
                      (total, creator) => total + creator.totalDownloads,
                      0
                    )
                    .toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Downloads
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">
                  {creatorsData.allTime
                    .reduce((total, creator) => total + creator.totalViews, 0)
                    .toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/dashboard/wf/create">
                  <Award className="h-5 w-5" />
                  Create Your First Workflow
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/dashboard/wf">
                  <ArrowRight className="h-5 w-5" />
                  Manage My Workflows
                </Link>
              </Button>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              💡 <strong>Pro Tip:</strong> Workflows with clear documentation
              and step-by-step guides get 3x more downloads!
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
