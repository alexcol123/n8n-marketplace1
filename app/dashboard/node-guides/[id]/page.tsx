// app/dashboard/node-guides/[id]/page.tsx
import { getNodeSetupGuide } from "@/utils/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { ArrowLeft, Edit, BookOpen, Key, Video, ExternalLink, AlertTriangle, Play } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

// Types for the links
interface Link {
  title: string;
  url: string;
}

interface TroubleshootingItem {
  issue: string;
  solution: string;
}

export default async function ViewNodeGuidePage({
  params,
}: {
  params: { id: string };
}) {
  const guide = await getNodeSetupGuide(params.id);

  if (!guide) {
    notFound();
  }

  // Helper function to get badge color based on host identifier
  function getHostBadgeColor(hostIdentifier: string | null) {
    if (!hostIdentifier) {
      return "bg-purple-500/20 text-purple-600 hover:bg-purple-500/30"; // Direct node
    }
    return "bg-blue-500/20 text-blue-600 hover:bg-blue-500/30"; // HTTP request
  }

  // Helper function to render links
  const renderLinks = (links: Link[] | null, icon: React.ReactNode, title: string) => {
    if (!links || !Array.isArray(links) || links.length === 0) {
      return null;
    }

    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          {icon}
          {title}
        </h4>
        <div className="space-y-2">
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href={link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  {link.title}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Helper function to render troubleshooting
  const renderTroubleshooting = (troubleshooting: TroubleshootingItem[] | null) => {
    if (!troubleshooting || !Array.isArray(troubleshooting) || troubleshooting.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4">
        <h4 className="font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Troubleshooting
        </h4>
        <div className="space-y-4">
          {troubleshooting.map((item, index) => (
            <div key={index} className="border rounded-lg p-4 bg-muted/30">
              <h5 className="font-medium text-foreground mb-2">{item.issue}</h5>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                {item.solution}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/dashboard/node-guides">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <Button asChild>
              <Link href={`/dashboard/node-guides/${guide.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Guide
              </Link>
            </Button>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-3xl font-bold">{guide.title}</h1>
            <Badge className={getHostBadgeColor(guide.hostIdentifier)}>
              {guide.hostIdentifier ? "HTTP API" : "Direct Node"}
            </Badge>
          </div>
          
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Service: <strong>{guide.serviceName}</strong></span>
            {guide.hostIdentifier && (
              <span>Host: <strong>{guide.hostIdentifier}</strong></span>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Description */}
          {guide.description && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-foreground whitespace-pre-wrap">
                  {guide.description}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Credentials Section */}
          {(guide.credentialGuide || guide.credentialVideo || guide.credentialsLinks) && (
            <Card className="border-blue-500/20 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Credentials Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Credential Guide */}
                {guide.credentialGuide && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">
                      Step-by-step Instructions
                    </h4>
                    <div className="bg-background/60 border rounded-lg p-4">
                      <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                        {guide.credentialGuide}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Credential Video */}
                {guide.credentialVideo && (
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Setup Video
                    </h4>
                    <Button variant="outline" asChild>
                      <Link href={guide.credentialVideo} target="_blank" rel="noopener noreferrer">
                        <Play className="h-4 w-4 mr-2" />
                        Watch Video Tutorial
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Credentials Links */}
                {renderLinks(
                  guide.credentialsLinks as Link[],
                  <ExternalLink className="h-4 w-4" />,
                  "Credential Links"
                )}
              </CardContent>
            </Card>
          )}

          {/* Setup Instructions */}
          {guide.setupInstructions && (
            <Card>
              <CardHeader>
                <CardTitle>General Setup Instructions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/30 border rounded-lg p-4">
                  <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">
                    {guide.setupInstructions}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Links */}
          {guide.helpLinks && (
            <Card>
              <CardHeader>
                <CardTitle>Help Links</CardTitle>
              </CardHeader>
              <CardContent>
                {renderLinks(
                  guide.helpLinks as Link[],
                  <ExternalLink className="h-4 w-4" />,
                  "Documentation & Resources"
                )}
              </CardContent>
            </Card>
          )}

          {/* Video Links */}
          {guide.videoLinks && (
            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
              </CardHeader>
              <CardContent>
                {renderLinks(
                  guide.videoLinks as Link[],
                  <Video className="h-4 w-4" />,
                  "Tutorial Videos"
                )}
              </CardContent>
            </Card>
          )}

          {/* Troubleshooting */}
          {guide.troubleshooting && (
            <Card>
              <CardHeader>
                <CardTitle>Troubleshooting</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTroubleshooting(guide.troubleshooting as TroubleshootingItem[])}
              </CardContent>
            </Card>
          )}

          {/* Usage Stats */}
          {guide.usageStats && guide.usageStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {guide.usageStats.map((stat: any) => (
                    <div key={stat.id} className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {stat.usageCount}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        uses in workflows
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}