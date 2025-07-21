// app/dashboard/node-guides/page.tsx
import { fetchNodeUsageStats } from "@/utils/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  BookOpen,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Key,
  Video,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { NodeDocumentation } from "@prisma/client";
import EditNodeImageDialog from "@/components/(custom)/(admin)/edit/EditNodeImageDialog";



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
    return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700"; // Direct node
  }

  return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700"; // HTTP request
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
    <div className="flex items-center justify-between p-4 bg-white/60 dark:bg-slate-950/20 rounded-lg border border-slate-200 dark:border-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-950/30 transition-all duration-200 shadow-sm">
      <div className="flex-1">
        {/* Service Information */}
        <div className="flex items-center gap-3 mb-2">
          {/* Service Name (Primary) */}
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
            {stat.serviceName}
          </h3>

          {/* Service Type Badge */}
          <Badge className={getHostBadgeColor(stat.hostIdentifier)}>
            {stat.hostIdentifier ? "HTTP API" : "Direct Node"}
          </Badge>

          {/* Host Identifier if available */}
          {stat.hostIdentifier && (
            <Badge
              variant="outline"
              className="text-xs border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400"
            >
              {stat.hostIdentifier}
            </Badge>
          )}

          {/* Usage Count */}
          <Badge
            variant="secondary"
            className="text-xs bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
          >
            {stat.usageCount} uses
          </Badge>

          {/* Documentation Status */}
          {stat.nodeSetupGuide ? (
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700">
              <CheckCircle className="h-3 w-3 mr-1" />
              Documented
            </Badge>
          ) : (
            <Badge className="bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-200 dark:border-red-700">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Needs Guide
            </Badge>
          )}
        </div>

        {/* Secondary Info */}
        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span>Last used {formatDistanceToNow(stat.lastUsedAt)} ago</span>
          <span className="text-xs">Node: {stat.nodeType}</span>
        </div>

        {/* Guide Title and Content Indicators */}
        {stat.nodeSetupGuide && (
          <div className="mt-2 space-y-1">
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              📖 {stat.nodeSetupGuide.title}
            </p>

            {/* Content Indicators */}
            <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
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
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900/20"
              asChild
            >
              <Link href={`/admin/node-guides/${stat.nodeSetupGuide.id}`}>
                View
              </Link>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900/20"
              asChild
            >
              <Link href={`/admin/node-guides/${stat.nodeSetupGuide.id}/edit`}>
                Edit
              </Link>
            </Button>
            <EditNodeImageDialog
              guide={{
                id: stat.nodeSetupGuide.id,
                serviceName: stat.serviceName,
         
              }}
       
            />
          </>
        ) : (
          <Button
            size="sm"
            className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
            asChild
          >
            <Link
              href={`/admin/node-guides/create?serviceName=${encodeURIComponent(
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/30 rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-3">
              <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200 leading-tight">
                Documentation Dashboard
              </h1>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                  Manage credential setup guides for your workflows
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-emerald-200 dark:bg-emerald-800 my-4" />

          <div className="bg-white/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-lg p-4">
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200 mb-2 flex items-center gap-2">
              <Key className="h-4 w-4" />
              🔐 Credential Documentation
            </h4>
            <p className="text-sm text-emerald-700 dark:text-emerald-300">
              Services are automatically tracked from your workflow uploads.
              Create credential setup guides for the ones you use most often.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-slate-200 bg-white/50 dark:border-slate-800/50 dark:bg-slate-950/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Total Services
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {allStats.length}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Used across workflows
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-950/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                Documented
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">
                {statsWithGuides.length}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                Credential guides created
              </p>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50/50 dark:border-red-800/50 dark:bg-red-950/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-800 dark:text-red-200">
                Need Guides
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {statsWithoutGuides.length}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400">
                Missing credential guides
              </p>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white/50 dark:border-slate-800/50 dark:bg-slate-950/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-800 dark:text-slate-200">
                Coverage
              </CardTitle>
              <Key className="h-4 w-4 text-slate-600 dark:text-slate-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {allStats.length > 0
                  ? Math.round((statsWithGuides.length / allStats.length) * 100)
                  : 0}
                %
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Credential documentation coverage
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Services That Need Guides - Priority Section */}
        {statsWithoutGuides.length > 0 && (
          <Card className="mb-8 border-red-200 bg-red-50/50 dark:border-red-800/50 dark:bg-red-950/20 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                <AlertTriangle className="h-5 w-5" />
                Services That Need Credential Guides (
                {statsWithoutGuides.length})
              </CardTitle>
              <p className="text-red-700 dark:text-red-300 mt-2">
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
          <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-800/50 dark:bg-emerald-950/10 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                <CheckCircle className="h-5 w-5" />
                Services With Credential Guides ({statsWithGuides.length})
              </CardTitle>
              <p className="text-emerald-700 dark:text-emerald-300 mt-2">
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
          <Card className="text-center py-16 border-slate-200 bg-white/50 dark:border-slate-800/50 dark:bg-slate-950/10 shadow-sm">
            <CardContent>
              <Key className="h-16 w-16 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-200">
                No Services Found
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Upload some workflows to start tracking services and create
                credential guides
              </p>
              <Button
                className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800"
                asChild
              >
                <Link href="/dashboard/workflows/upload">Upload Workflow</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}