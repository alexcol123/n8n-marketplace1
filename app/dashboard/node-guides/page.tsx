// app/dashboard/node-guides/page.tsx
import { fetchNodeUsageStats } from "@/utils/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Plus,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Key,
  Video,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { NodeDocumentation } from "@prisma/client";

// Types for the node guides


// The transformed stat item type
export interface TransformedStat {
  id: string;
  serviceName: string;
  nodeType: string;
  hostIdentifier: string | null; // Allow null since database can have null values
  usageCount: number;
  lastUsedAt: Date; // Database returns Date objects, not strings
  needsGuide: boolean;
  nodeSetupGuide: NodeDocumentation | null;
}

// Array types
export type TransformedStats = TransformedStat[];

// Helper function to get badge color based on host identifier
function getHostBadgeColor(hostIdentifier: string | null) {
  if (!hostIdentifier) {
    return "bg-purple-500/20 text-purple-600 hover:bg-purple-500/30"; // Direct node
  }

  return "bg-blue-500/20 text-blue-600 hover:bg-blue-500/30"; // HTTP request
}

export default async function NodeGuidesPage() {
  const allStats = await fetchNodeUsageStats();



  if (!Array.isArray(allStats)) {
    return <div>Error loading usage stats</div>;
  }

  // Filter stats that need guides (no nodeSetupGuide)
  const statsWithoutGuides = allStats.filter((stat) => !stat.nodeSetupGuide);

  // Filter stats that have documentation
  const statsWithGuides = allStats.filter(
    (stat) => stat.nodeSetupGuide && !stat.needsGuide
  );

  const StatCard = ({ stat }: { stat: (typeof allStats)[0] }) => (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border hover:bg-muted/50 transition-colors">
      <div className="flex-1">
        {/* Service Information */}
        <div className="flex items-center gap-3 mb-2">
          {/* Service Name (Primary) */}
          <h3 className="text-lg font-semibold text-foreground">
            {stat.serviceName}
          </h3>

          {/* Service Type Badge */}
          <Badge className={getHostBadgeColor(stat.hostIdentifier)}>
            {stat.hostIdentifier ? "HTTP API" : "Direct Node"}
          </Badge>

          {/* Host Identifier if available */}
          {stat.hostIdentifier && (
            <Badge variant="outline" className="text-xs">
              {stat.hostIdentifier}
            </Badge>
          )}

          {/* Usage Count */}
          <Badge variant="secondary" className="text-xs">
            {stat.usageCount} uses
          </Badge>

          {/* Documentation Status */}
          {stat.nodeSetupGuide ? (
            <Badge className="bg-emerald-500/20 text-emerald-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Documented
            </Badge>
          ) : (
            <Badge className="bg-red-500/20 text-red-600">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Needs Guide
            </Badge>
          )}
        </div>

        {/* Secondary Info */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Last used {formatDistanceToNow(stat.lastUsedAt)} ago</span>
          <span className="text-xs">Node: {stat.nodeType}</span>
        </div>

        {/* Guide Title and Content Indicators */}
        {stat.nodeSetupGuide && (
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium text-emerald-600">
              📖 {stat.nodeSetupGuide.title}
            </p>

            {/* Content Indicators */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              {stat.nodeSetupGuide.credentialGuide && (
                <div className="flex items-center gap-1">
                  <Key className="h-3 w-3" />
                  <span>Credentials</span>
                </div>
              )}
              {stat.nodeSetupGuide.credentialVideo && (
                <div className="flex items-center gap-1">
                  <Video className="h-3 w-3" />
                  <span>Video</span>
                </div>
              )}
              {stat.nodeSetupGuide.credentialsLinks &&
                Array.isArray(stat.nodeSetupGuide.credentialsLinks) &&
                stat.nodeSetupGuide.credentialsLinks.length > 0 && (
                  <div className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    <span>
                      {stat.nodeSetupGuide.credentialsLinks.length} links
                    </span>
                  </div>
                )}
              {stat.nodeSetupGuide.setupInstructions && (
                <div className="flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  <span>Setup guide</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        {stat.nodeSetupGuide ? (
          <>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/dashboard/node-guides/${stat.nodeSetupGuide.id}`}>
                View
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
              href={`/dashboard/node-guides/create?serviceName=${encodeURIComponent(
                stat.serviceName
              )}&hostIdentifier=${encodeURIComponent(
                stat.hostIdentifier || ""
              )}&nodeType=${encodeURIComponent(stat.nodeType)}`}
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
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                Documentation Dashboard
              </h1>
              <p className="text-muted-foreground">
                Manage credential setup guides for the services you use in your
                workflows
              </p>
            </div>
            <Button asChild>
              <Link href="/dashboard/node-guides/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Guide
              </Link>
            </Button>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              🔐 Credential Documentation
            </h4>
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Services are automatically tracked from your workflow uploads.
              Create credential setup guides for the ones you use most often.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Services
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{allStats.length}</div>
              <p className="text-xs text-muted-foreground">
                Used across workflows
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documented</CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">
                {statsWithGuides.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Credential guides created
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Need Guides</CardTitle>
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">
                {statsWithoutGuides.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Missing credential guides
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Coverage</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {allStats.length > 0
                  ? Math.round((statsWithGuides.length / allStats.length) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-muted-foreground">
                Credential documentation coverage
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services That Need Guides - Priority Section */}
        {statsWithoutGuides.length > 0 && (
          <Card className="mb-8 border-destructive/20 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Services That Need Credential Guides (
                {statsWithoutGuides.length})
              </CardTitle>
              <p className="text-destructive/80">
                These services are used in your workflows but don&apos;t have
                credential setup guides yet
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {statsWithoutGuides.map((stat) => (
                  <StatCard
                    key={`${stat.serviceName}-${stat.hostIdentifier || "null"}`}
                    stat={stat}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Services With Documentation - Completed Section */}
        {statsWithGuides.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-600">
                <CheckCircle className="h-5 w-5" />
                Services With Credential Guides ({statsWithGuides.length})
              </CardTitle>
              <p className="text-muted-foreground">
                Services that have credential setup guides created
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {statsWithGuides.map((stat) => (
                  <StatCard
                    key={`${stat.serviceName}-${stat.hostIdentifier || "null"}`}
                    stat={stat}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Empty State */}
        {allStats.length === 0 && (
          <Card className="text-center py-16">
            <CardContent>
              <Key className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Services Found</h3>
              <p className="text-muted-foreground mb-4">
                Upload some workflows to start tracking services and create
                credential guides
              </p>
              <Button asChild>
                <Link href="/dashboard/workflows/upload">Upload Workflow</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
