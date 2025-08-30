import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  FileCode,
  ChevronRight,
  Plus,
  CheckCircle,
  Download,
} from "lucide-react";

import Link from "next/link";
import Image from "next/image";
import { fetchProfile } from "@/utils/actions";
import { getUserWorkflowStats } from "@/utils/actions";
import { getUserCompletionStats } from "@/utils/actions";
import { fetchUserDownloads } from "@/utils/actions";
import { CreateNewWorkflowButton } from "@/components/(custom)/(dashboard)/Form/Buttons";

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
    <div className="flex flex-col gap-8 pb-12 max-w-4xl mx-auto">
      {isAdmin && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-amber-900 dark:text-amber-100">Administrator Access</h3>
                <p className="text-sm text-amber-700 dark:text-amber-300">Manage platform settings</p>
              </div>
            </div>
            <Button asChild variant="default">
              <Link href="/admin" className="flex items-center gap-2">
                Admin Dashboard
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-br from-primary/5 to-blue/5 rounded-xl p-8 border border-primary/10">
        <div className="flex items-start gap-6">
          <div className="h-16 w-16 rounded-xl overflow-hidden border-2 border-white shadow-lg">
            <Image
              src={profile?.profileImage || ""}
              alt={profile?.firstName || "User"}
              width={60}
              height={60}
              className="object-cover w-16 h-16"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              {greeting}, {profile?.firstName || "Creator"}!
            </h1>
            <p className="text-muted-foreground mt-2">Ready to build something amazing?</p>
          </div>
        </div>
        <div className="mt-6">
          <CreateNewWorkflowButton />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Workflows Created</p>
                <p className="text-3xl font-bold text-blue-600">{totalWorkflows}</p>
              </div>
              <FileCode className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completionStats.totalCompletions}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Downloads</p>
                <p className="text-3xl font-bold text-purple-600">{totalDownloads}</p>
              </div>
              <Download className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Access</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/dashboard/wf/create">
                <Plus className="h-5 w-5" />
                <span className="text-sm">New Workflow</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto flex-col gap-2 p-4" asChild>
              <Link href="/dashboard/mydownloads">
                <Download className="h-5 w-5" />
                <span className="text-sm">My Downloads</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;
