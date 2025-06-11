// app/community/leaderboard/students/page.tsx

import { Button } from "@/components/ui/button";
import { ArrowLeft, Users } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import StudentsLeaderboard from "@/components/(custom)/(leaderboard)/StudentLeaderboard";

export const metadata: Metadata = {
  title: "Learning Champions Leaderboard | n8n-store",
  description: "Discover our top learners and their incredible progress through n8n automation tutorials and courses. See who's leading in learning achievements.",
  keywords: ["n8n learning", "top students", "tutorial completion", "learning leaderboard", "automation education"],
};

export default function StudentsLeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Back navigation */}
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/leaderboard" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Leaderboards
                </Link>
              </Button>
            </div>

            {/* Switch to Creators */}
            <Button variant="default" size="sm" asChild>
              <Link href="/leaderboard/creators" className="gap-2">
                <Users className="h-4 w-4" />
                View Creators
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <StudentsLeaderboard/>
    </div>
  );
}