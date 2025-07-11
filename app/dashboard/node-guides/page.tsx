// app/dashboard/node-guides/page.tsx
import { fetchNodeUsageStats, fetchStatsWithoutGuides } from "@/utils/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// Helper function to get auth type badge color
function getAuthTypeBadgeColor(authType: string) {
  switch (authType) {
    case "apiKey":
      return "bg-blue-500/20 text-blue-600 hover:bg-blue-500/30";
    case "oauth":
      return "bg-green-500/20 text-green-600 hover:bg-green-500/30";
    case "httpHeaderAuth":
      return "bg-orange-500/20 text-orange-600 hover:bg-orange-500/30";
    default:
      return "bg-gray-500/20 text-gray-600 hover:bg-gray-500/30";
  }
}



export default async function NodeGuidesPage() {
  const allStats = await fetchNodeUsageStats();
  const statsWithoutGuides = await fetchStatsWithoutGuides();

  console.log('allstats', allStats)
  console.log('statsWithoutGuides', statsWithoutGuides)

  if (!Array.isArray(allStats)) {
    return <div>Error loading usage stats</div>;
  }

  if (!Array.isArray(statsWithoutGuides)) {
    return <div>Error loading stats without guides</div>;
  }

  const StatCard = ({ stat, showCreateButton = false }: { stat: any, showCreateButton?: boolean }) => (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border hover:bg-muted/50">
      <div className="flex-1">
        {/* Priority Order: Host → Auth Type (removed nodeType for cleaner view) */}
        <div className="flex items-center gap-4 mb-2">
          {/* 1st Priority: Host Identifier (Large & Bold) */}
          <h3 className="text-lg font-bold text-foreground">
            {stat.hostIdentifier}
          </h3>
          
          {/* 2nd Priority: Auth Type (Colored Badge) */}
          <Badge className={getAuthTypeBadgeColor(stat.authType)}>
            🔐 {stat.authType}
          </Badge>
          
          {/* Usage Count */}
          <Badge variant="outline">
            📊 Used {stat.usageCount} times
          </Badge>
          
          {/* Has Guide Status */}
          {stat.nodeSetupGuide && (
            <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30">
              ✅ Has Guide
            </Badge>
          )}
        </div>
        
        {/* Secondary Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-1">
          <span>
            Last used {formatDistanceToNow(new Date(stat.lastUsedAt))} ago
          </span>
        </div>
        
        {/* Guide Title if exists */}
        {stat.nodeSetupGuide && (
          <p className="text-sm font-medium text-emerald-600 mt-1">
            📖 {stat.nodeSetupGuide.guideTitle}
          </p>
        )}
      </div>
      
      {/* Action Buttons */}
      <div className="flex gap-2">
        {stat.nodeSetupGuide ? (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/node-guides/${stat.nodeSetupGuide.id}`}>
                View Guide
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/node-guides/${stat.nodeSetupGuide.id}/edit`}>
                Edit
              </Link>
            </Button>
            <Button variant="secondary" size="sm" asChild>
              <Link
                href={`/dashboard/node-guides/create?nodeType=${encodeURIComponent(
                  stat.nodeType
                )}&hostIdentifier=${encodeURIComponent(
                  stat.hostIdentifier
                )}&authType=${encodeURIComponent(stat.authType)}`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Guide
              </Link>
            </Button>
          </>
        ) : (
          <Button size={showCreateButton ? "sm" : "sm"} asChild>
            <Link
              href={`/dashboard/node-guides/create?nodeType=${encodeURIComponent(
                stat.nodeType
              )}&hostIdentifier=${encodeURIComponent(
                stat.hostIdentifier
              )}&authType=${encodeURIComponent(stat.authType)}`}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Guide
            </Link>
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Node Setup Guides</h1>
          <p className="text-muted-foreground">
            Create helpful setup guides for the APIs and services you use most often
          </p>
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Tracking Priority Order:</h4>
            <div className="flex items-center gap-4 text-sm text-blue-800 dark:text-blue-200">
              <span className="flex items-center gap-1">
                <span className="font-bold">1st:</span> 
                <span className="font-semibold">Service URL</span> 
                <span className="text-xs">(which API)</span>
              </span>
              <span>→</span>
              <span className="flex items-center gap-1">
                <span className="font-bold">2nd:</span> 
                <span className="font-semibold">Auth Method</span>
                <span className="text-xs">(how to connect)</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total APIs Used</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allStats.length}</div>
              <p className="text-xs text-muted-foreground">
                Across all your workflows
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Guides Created</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allStats.filter((stat) => stat.nodeSetupGuide).length}
              </div>
              <p className="text-xs text-muted-foreground">
                Setup guides available
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Need Guides</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsWithoutGuides.length}</div>
              <p className="text-xs text-muted-foreground">
                APIs without setup guides
              </p>
            </CardContent>
          </Card>
        </div>

        {/* APIs Without Guides - Priority Section */}
        {statsWithoutGuides.length > 0 && (
          <Card className="mb-8 border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                APIs That Need Setup Guides
              </CardTitle>
              <p className="text-destructive/80">
                These are your most-used APIs that don&apos;t have setup guides yet
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {statsWithoutGuides.map((stat) => (
                  <StatCard 
                    key={`${stat.nodeType}-${stat.hostIdentifier}-${stat.authType}`}
                    stat={stat} 
                    showCreateButton={true}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* APIs With Guides - Completed Section */}
        {allStats.filter((stat) => stat.nodeSetupGuide).length > 0 && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-emerald-600">
                  <BookOpen className="h-5 w-5" />
                  APIs With Setup Guides
                </CardTitle>
                <p className="text-muted-foreground">
                  APIs that already have setup guides created
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/node-guides/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Guide
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allStats
                  .filter((stat) => stat.nodeSetupGuide)
                  .map((stat) => (
                    <StatCard 
                      key={`${stat.nodeType}-${stat.hostIdentifier}-${stat.authType}`}
                      stat={stat}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}