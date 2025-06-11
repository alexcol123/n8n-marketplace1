
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Trophy,
  Award,
  GraduationCap,
  Flame,
  Zap,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";


export const mockTopStudents = [
  {
    userId: "user_1",
    completionCount: 47,
    user: {
      id: "user_1",
      firstName: "Sarah",
      lastName: "Johnson",
      username: "sarah_codes",
      email: "sarah@example.com",
      profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-12-15")
    }
  },
  {
    userId: "user_2", 
    completionCount: 42,
    user: {
      id: "user_2",
      firstName: "Marcus",
      lastName: "Chen",
      username: "marcus_automates",
      email: "marcus@example.com",
      profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date("2024-02-01"),
      updatedAt: new Date("2024-12-14")
    }
  },
  {
    userId: "user_3",
    completionCount: 38,
    user: {
      id: "user_3", 
      firstName: "Elena",
      lastName: "Rodriguez",
      username: "elena_learns",
      email: "elena@example.com",
      profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date("2024-01-20"),
      updatedAt: new Date("2024-12-13")
    }
  },
  {
    userId: "user_4",
    completionCount: 35,
    user: {
      id: "user_4",
      firstName: "David",
      lastName: "Kim", 
      username: "david_workflows",
      email: "david@example.com",
      profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date("2024-02-10"),
      updatedAt: new Date("2024-12-12")
    }
  },
  {
    userId: "user_5",
    completionCount: 32,
    user: {
      id: "user_5",
      firstName: "Priya",
      lastName: "Patel",
      username: "priya_automation",
      email: "priya@example.com",
      profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date("2024-03-01"),
      updatedAt: new Date("2024-12-11")
    }
  },
  {
    userId: "user_6",
    completionCount: 28,
    user: {
      id: "user_6",
      firstName: "James",
      lastName: "Wilson",
      username: "james_tech",
      email: "james@example.com", 
      profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date("2024-03-15"),
      updatedAt: new Date("2024-12-10")
    }
  },
  {
    userId: "user_7",
    completionCount: 25,
    user: {
      id: "user_7",
      firstName: "Sofia",
      lastName: "Andersson",
      username: "sofia_n8n",
      email: "sofia@example.com",
      profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date("2024-04-01"),
      updatedAt: new Date("2024-12-09")
    }
  },
  {
    userId: "user_8", 
    completionCount: 22,
    user: {
      id: "user_8",
      firstName: "Ahmed",
      lastName: "Hassan",
      username: "ahmed_flows",
      email: "ahmed@example.com",
      profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date("2024-04-15"),
      updatedAt: new Date("2024-12-08")
    }
  },
  {
    userId: "user_9",
    completionCount: 19,
    user: {
      id: "user_9",
      firstName: "Lisa",
      lastName: "Thompson",
      username: "lisa_learning",
      email: "lisa@example.com",
      profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date("2024-05-01"),
      updatedAt: new Date("2024-12-07")
    }
  },
  {
    userId: "user_10",
    completionCount: 16,
    user: {
      id: "user_10",
      firstName: "Carlos",
      lastName: "Mendoza",
      username: "carlos_auto",
      email: "carlos@example.com",
      profileImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&h=150&fit=crop&crop=face",
      createdAt: new Date("2024-05-15"),
      updatedAt: new Date("2024-12-06")
    }
  }
];

// Mock function for getRecentCompletionLeaderboards()
export const mockRecentCompletionData = {
  today: [
    {
      userId: "user_2",
      completionCount: 8,
      user: {
        id: "user_2",
        firstName: "Marcus",
        lastName: "Chen", 
        username: "marcus_automates",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_1",
      completionCount: 6,
      user: {
        id: "user_1",
        firstName: "Sarah",
        lastName: "Johnson",
        username: "sarah_codes",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_5",
      completionCount: 5,
      user: {
        id: "user_5",
        firstName: "Priya",
        lastName: "Patel", 
        username: "priya_automation",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_3",
      completionCount: 4,
      user: {
        id: "user_3",
        firstName: "Elena",
        lastName: "Rodriguez",
        username: "elena_learns",
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_7",
      completionCount: 3,
      user: {
        id: "user_7",
        firstName: "Sofia",
        lastName: "Andersson",
        username: "sofia_n8n",
        profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_4",
      completionCount: 3,
      user: {
        id: "user_4",
        firstName: "David",
        lastName: "Kim",
        username: "david_workflows", 
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_8",
      completionCount: 2,
      user: {
        id: "user_8",
        firstName: "Ahmed",
        lastName: "Hassan",
        username: "ahmed_flows",
        profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_9",
      completionCount: 2,
      user: {
        id: "user_9",
        firstName: "Lisa",
        lastName: "Thompson",
        username: "lisa_learning",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_6",
      completionCount: 1,
      user: {
        id: "user_6",
        firstName: "James",
        lastName: "Wilson",
        username: "james_tech",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_10",
      completionCount: 1,
      user: {
        id: "user_10",
        firstName: "Carlos",
        lastName: "Mendoza",
        username: "carlos_auto",
        profileImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&h=150&fit=crop&crop=face"
      }
    }
  ],
  week: [
    {
      userId: "user_1",
      completionCount: 23,
      user: {
        id: "user_1",
        firstName: "Sarah",
        lastName: "Johnson",
        username: "sarah_codes",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_3",
      completionCount: 19,
      user: {
        id: "user_3",
        firstName: "Elena",
        lastName: "Rodriguez",
        username: "elena_learns",
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_2",
      completionCount: 17,
      user: {
        id: "user_2",
        firstName: "Marcus",
        lastName: "Chen",
        username: "marcus_automates",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_5",
      completionCount: 15,
      user: {
        id: "user_5",
        firstName: "Priya",
        lastName: "Patel",
        username: "priya_automation",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_4",
      completionCount: 13,
      user: {
        id: "user_4",
        firstName: "David",
        lastName: "Kim",
        username: "david_workflows",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_7",
      completionCount: 11,
      user: {
        id: "user_7",
        firstName: "Sofia",
        lastName: "Andersson",
        username: "sofia_n8n",
        profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_6",
      completionCount: 9,
      user: {
        id: "user_6",
        firstName: "James",
        lastName: "Wilson",
        username: "james_tech",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_8",
      completionCount: 8,
      user: {
        id: "user_8",
        firstName: "Ahmed",
        lastName: "Hassan",
        username: "ahmed_flows",
        profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_9",
      completionCount: 6,
      user: {
        id: "user_9",
        firstName: "Lisa",
        lastName: "Thompson",
        username: "lisa_learning",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_10",
      completionCount: 4,
      user: {
        id: "user_10",
        firstName: "Carlos",
        lastName: "Mendoza",
        username: "carlos_auto",
        profileImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&h=150&fit=crop&crop=face"
      }
    }
  ],
  month: [
    {
      userId: "user_1",
      completionCount: 47,
      user: {
        id: "user_1",
        firstName: "Sarah",
        lastName: "Johnson",
        username: "sarah_codes",
        profileImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_2",
      completionCount: 42,
      user: {
        id: "user_2",
        firstName: "Marcus",
        lastName: "Chen",
        username: "marcus_automates",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_3",
      completionCount: 38,
      user: {
        id: "user_3",
        firstName: "Elena",
        lastName: "Rodriguez",
        username: "elena_learns",
        profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_4",
      completionCount: 35,
      user: {
        id: "user_4",
        firstName: "David",
        lastName: "Kim",
        username: "david_workflows",
        profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_5",
      completionCount: 32,
      user: {
        id: "user_5",
        firstName: "Priya",
        lastName: "Patel",
        username: "priya_automation",
        profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_6",
      completionCount: 28,
      user: {
        id: "user_6",
        firstName: "James",
        lastName: "Wilson",
        username: "james_tech",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_7",
      completionCount: 25,
      user: {
        id: "user_7",
        firstName: "Sofia",
        lastName: "Andersson",
        username: "sofia_n8n",
        profileImage: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_8",
      completionCount: 22,
      user: {
        id: "user_8",
        firstName: "Ahmed",
        lastName: "Hassan",
        username: "ahmed_flows",
        profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_9",
      completionCount: 19,
      user: {
        id: "user_9",
        firstName: "Lisa",
        lastName: "Thompson",
        username: "lisa_learning",
        profileImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face"
      }
    },
    {
      userId: "user_10",
      completionCount: 16,
      user: {
        id: "user_10",
        firstName: "Carlos",
        lastName: "Mendoza",
        username: "carlos_auto",
        profileImage: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=150&h=150&fit=crop&crop=face"
      }
    }
  ]
};



export default async function StudentsLeaderboard() {
  // Fetch completion leaderboards
  const topStudents = mockTopStudents;
  const recentCompletionData = mockRecentCompletionData;

  const hasData = true; // Always true for testing

  if (!hasData) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold mb-6">Learning Champions</h1>
        <div className="max-w-lg mx-auto bg-muted/20 rounded-lg p-10 border">
          <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center">
            <GraduationCap className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-3">
            No Learning Data Yet
          </h2>
          <p className="text-muted-foreground mb-6">
            As students complete tutorials, learning statistics and leaderboards
            will become available here.
          </p>
          <Button asChild>
            <Link href="/">Start Learning</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Learning Champions</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover our most dedicated learners and their incredible progress
        </p>
      </div>

      {/* Top Students (Completion Leaderboard) */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            Learning Champions
          </h2>

          {/* Quick stats */}
          <div className="hidden md:flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-primary">
                {recentCompletionData?.today?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">Today</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-500">
                {recentCompletionData?.week?.length || 0}
              </div>
              <div className="text-xs text-muted-foreground">This Week</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-500">
                {recentCompletionData?.month?.length || 0}
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
              <Badge
                variant="destructive"
                className="ml-1 h-5 px-1.5 text-xs"
              >
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
            {topStudents.length > 0 ? (
              <>
                {/* Top 3 students - featured cards */}
                {topStudents.slice(0, 3).length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {topStudents.slice(0, 3).map((student, index) => {
                      if (!student.user) return null;

                      return (
                        <div
                          key={student.userId}
                          className={`rounded-xl p-6 border text-center transition-all duration-300 shadow-md hover:shadow-lg ${
                            index === 0
                              ? "bg-gradient-to-b from-emerald-50 to-emerald-50/20 border-emerald-200 dark:from-emerald-950/20 dark:to-emerald-950/5 dark:border-emerald-900/30"
                              : index === 1
                              ? "bg-gradient-to-b from-blue-50 to-blue-50/20 border-blue-200 dark:from-blue-900/20 dark:to-blue-900/5 dark:border-blue-800/30"
                              : "bg-gradient-to-b from-purple-50 to-purple-50/20 border-purple-200 dark:from-purple-950/20 dark:to-purple-950/5 dark:border-purple-900/30"
                          }`}
                        >
                          <div className="relative flex justify-center mb-4">
                            <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-md">
                              <AvatarImage
                                src={student.user.profileImage}
                                alt={`${student.user.firstName} ${student.user.lastName}`}
                              />
                              <AvatarFallback className="text-2xl">
                                {student.user.firstName?.charAt(0)}
                                {student.user.lastName?.charAt(0)}
                              </AvatarFallback>
                            </Avatar>

                            {/* Position badge with trophy */}
                            <div
                              className={`absolute -top-3 -right-3 rounded-full w-9 h-9 flex items-center justify-center text-lg font-bold shadow ${
                                index === 0
                                  ? "bg-emerald-500 text-white"
                                  : index === 1
                                  ? "bg-blue-500 text-white"
                                  : "bg-purple-500 text-white"
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
                            {student.user.firstName} {student.user.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            @{student.user.username}
                          </p>

                          <div className="text-3xl font-bold text-primary mb-2">
                            {student.completionCount}
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Total Completed
                          </p>

                          {/* Achievement badge */}
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
                              index === 0
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                                : index === 1
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                            }`}
                          >
                            <Award className="h-3 w-3" />
                            {index === 0
                              ? "Learning Legend"
                              : index === 1
                              ? "Study Master"
                              : "Rising Star"}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Remaining students - compact list */}
                {topStudents.length > 3 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {topStudents.slice(3, 10).map((student, index) => {
                      if (!student.user) return null;

                      return (
                        <div
                          key={student.userId}
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
                                  src={student.user.profileImage}
                                  alt={`${student.user.firstName} ${student.user.lastName}`}
                                />
                                <AvatarFallback>
                                  {student.user.firstName?.charAt(0)}
                                  {student.user.lastName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>

                              <div>
                                <div className="font-medium">
                                  {student.user.firstName}{" "}
                                  {student.user.lastName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  @{student.user.username}
                                </div>
                              </div>
                            </div>

                            {/* Completion count */}
                            <div className="ml-auto text-center">
                              <div className="font-bold text-primary">
                                {student.completionCount}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Completed
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>No students have completed tutorials yet. Be the first!</p>
              </div>
            )}
          </TabsContent>

          {/* Today's Top Completers */}
          <TabsContent value="today" className="space-y-6">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/20 dark:to-orange-950/20 p-6 rounded-lg border border-red-200 dark:border-red-900/30">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-500 p-2 rounded-full">
                  <Flame className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-red-700 dark:text-red-300">
                    🔥 Today&apos;s Learning Streak
                  </h3>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Students crushing their goals today!
                  </p>
                </div>
                <Badge className="ml-auto bg-red-500 hover:bg-red-600">
                  LIVE
                </Badge>
              </div>

              {recentCompletionData?.today?.length > 0 ? (
                <div className="space-y-6">
                  {/* Top 3 Featured Cards */}
                  {recentCompletionData.today.slice(0, 3).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {recentCompletionData.today
                        .slice(0, 3)
                        .map((student, index) => (
                          <div
                            key={student.userId}
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
                                  src={student.user?.profileImage}
                                  alt={student.user?.firstName}
                                />
                                <AvatarFallback className="text-lg">
                                  {student.user?.firstName?.charAt(0)}
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

                            <h4 className="font-bold mb-1">
                              {student.user?.firstName}{" "}
                              {student.user?.lastName}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              @{student.user?.username}
                            </p>

                            <div className="text-xl font-bold text-red-600 mb-1">
                              {student.completionCount}
                            </div>
                            <p className="text-xs text-muted-foreground mb-3">
                              completed today
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

                  {/* Ranks 4-10 - Compact List */}
                  {recentCompletionData.today.length > 3 && (
                    <div>
                      <h4 className="font-semibold text-red-700 dark:text-red-300 mb-3 text-sm uppercase tracking-wide">
                        Today&apos;s Top 10
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {recentCompletionData.today
                          .slice(3, 10)
                          .map((student, index) => (
                            <div
                              key={student.userId}
                              className="flex items-center gap-3 bg-white dark:bg-gray-800/50 p-3 rounded-lg hover:shadow-md transition-all"
                            >
                              <div className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 font-bold h-8 w-8 rounded-full flex items-center justify-center text-sm">
                                {index + 4}
                              </div>
                              <Avatar className="h-8 w-8">
                                <AvatarImage
                                  src={student.user?.profileImage}
                                  alt={student.user?.firstName}
                                />
                                <AvatarFallback className="text-xs">
                                  {student.user?.firstName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {student.user?.firstName}{" "}
                                  {student.user?.lastName}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  @{student.user?.username}
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {student.completionCount} today
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
                  <p>No completions today yet. Start your learning streak!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* This Week's Top Completers */}
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
                    Dominating this week&apos;s learning challenges!
                  </p>
                </div>
              </div>

              {recentCompletionData?.week?.length > 0 ? (
                <div className="space-y-6">
                  {/* Similar structure for weekly data */}
                  {recentCompletionData.week.slice(0, 3).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {recentCompletionData.week
                        .slice(0, 3)
                        .map((student, index) => (
                          <div
                            key={student.userId}
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
                                  src={student.user?.profileImage}
                                  alt={student.user?.firstName}
                                />
                                <AvatarFallback className="text-lg">
                                  {student.user?.firstName?.charAt(0)}
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

                            <h4 className="font-bold mb-1">
                              {student.user?.firstName}{" "}
                              {student.user?.lastName}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              @{student.user?.username}
                            </p>

                            <div className="text-xl font-bold text-orange-600 mb-1">
                              {student.completionCount}
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
                  <p>No completions this week yet. Be the weekly champion!</p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* This Month's Top Completers */}
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
                    Consistent learners making serious progress!
                  </p>
                </div>
              </div>

              {recentCompletionData?.month?.length > 0 ? (
                <div className="space-y-6">
                  {/* Similar structure for monthly data */}
                  {recentCompletionData.month.slice(0, 3).length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      {recentCompletionData.month
                        .slice(0, 3)
                        .map((student, index) => (
                          <div
                            key={student.userId}
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
                                  src={student.user?.profileImage}
                                  alt={student.user?.firstName}
                                />
                                <AvatarFallback className="text-lg">
                                  {student.user?.firstName?.charAt(0)}
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
                                {index === 0
                                  ? "🏆"
                                  : index === 1
                                  ? "🥈"
                                  : "🥉"}
                              </div>
                            </div>

                            <h4 className="font-bold mb-1">
                              {student.user?.firstName}{" "}
                              {student.user?.lastName}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-2">
                              @{student.user?.username}
                            </p>

                            <div className="text-xl font-bold text-blue-600 mb-1">
                              {student.completionCount}
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
                    No completions this month yet. Start your monthly streak!
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
              Join the Learning Revolution! 🚀
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              Complete tutorials to climb the leaderboards and showcase your
              automation mastery. Earn bragging rights, build your portfolio,
              and become an n8n expert!
            </p>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">
                  {topStudents.length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Active Learners
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-500">
                  {recentCompletionData?.week?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Weekly Completions
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">
                  {recentCompletionData?.today?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">
                  Learning Today
                </div>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/">
                  <GraduationCap className="h-5 w-5" />
                  Start Learning Now
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/dashboard/mycompletions">
                  <Trophy className="h-5 w-5" />
                  View My Progress
                </Link>
              </Button>
            </div>

            <div className="mt-6 text-sm text-muted-foreground">
              💡 <strong>Pro Tip:</strong> Complete 3+ tutorials in a day to
              unlock the &quot;Daily Destroyer&quot; badge!
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}