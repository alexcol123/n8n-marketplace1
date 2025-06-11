

import { Button } from "@/components/ui/button";
import { ArrowLeft, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";
import CreatorsLeaderboard from "@/components/(custom)/(leaderboard)/CreatorLeaderboard";

export const metadata: Metadata = {
  title: "Top Creators Leaderboard | n8n-store",
  description:
    "Discover the most active workflow creators on n8n-store. See who's sharing the most valuable automation templates with the community.",
  keywords: [
    "n8n creators",
    "top contributors",
    "workflow authors",
    "automation experts",
    "creator leaderboard",
  ],
};

export default function CreatorsLeaderboardPage() {
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

            {/* Switch to Students */}
            <Button variant="default" size="sm" asChild>
              <Link href="/leaderboard/students" className="gap-2">
                <GraduationCap className="h-4 w-4" />
                View Students
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <CreatorsLeaderboard />
    </div>
  );
}
