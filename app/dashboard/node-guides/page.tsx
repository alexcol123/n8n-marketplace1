// app/dashboard/node-guides/page.tsx
import { fetchNodeUsageStats, fetchStatsWithoutGuides } from "@/utils/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, BookOpen, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function NodeGuidesPage() {
  const allStats = await fetchNodeUsageStats();
  const statsWithoutGuides = await fetchStatsWithoutGuides();

  if (!Array.isArray(allStats)) {
    return <div>Error loading usage stats</div>;
  }

  if (!Array.isArray(statsWithoutGuides)) {
    return <div>Error loading stats without guides</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Node Setup Guides</h1>
          <p className="text-muted-foreground">
            Create helpful setup guides for the APIs and services you use most
            often
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total APIs Used
              </CardTitle>
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
              <CardTitle className="text-sm font-medium">
                Guides Created
              </CardTitle>
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
              <div className="text-2xl font-bold">
                {statsWithoutGuides.length}
              </div>
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
                These are your most-used APIs that don't have setup guides yet
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {statsWithoutGuides.slice(0, 5).map((stat) => (
                  <div
                    key={`${stat.nodeType}-${stat.hostIdentifier}-${stat.authType}`}
                    className="flex items-center justify-between p-4 bg-card rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-foreground">
                          {stat.hostIdentifier}
                        </h3>
                        <Badge variant="secondary">{stat.authType}</Badge>
                        <Badge variant="outline">
                          Used {stat.usageCount} times
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Last used{" "}
                        {formatDistanceToNow(new Date(stat.lastUsedAt))} ago
                      </p>
                    </div>
                    <Button asChild size="sm">
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
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Usage Stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>All API Usage Stats</CardTitle>
              <p className="text-muted-foreground">
                Complete overview of your API usage patterns
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
              {allStats.map((stat) => (
                <div
                  key={`${stat.nodeType}-${stat.hostIdentifier}-${stat.authType}`}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-foreground">
                        {stat.hostIdentifier}
                      </h3>
                      <Badge variant="secondary">{stat.authType}</Badge>
                      <Badge variant="outline">
                        Used {stat.usageCount} times
                      </Badge>
                      {stat.nodeSetupGuide && (
                        <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30">
                          Has Guide
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>
                        Last used{" "}
                        {formatDistanceToNow(new Date(stat.lastUsedAt))} ago
                      </span>
                      <span>
                        Node: {stat.nodeType.replace("n8n-nodes-base.", "")}
                      </span>
                    </div>
                    {stat.nodeSetupGuide && (
                      <p className="text-sm font-medium text-emerald-600 mt-1">
                        📖 {stat.nodeSetupGuide.guideTitle}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {stat.nodeSetupGuide ? (
                      <>
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/dashboard/node-guides/${stat.nodeSetupGuide.id}`}
                          >
                            View Guide
                          </Link>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={`/dashboard/node-guides/${stat.nodeSetupGuide.id}/edit`}
                          >
                            Edit
                          </Link>
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" asChild>
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
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
