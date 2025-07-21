// app/dashboard/node-guides/[id]/page.tsx
import { getNodeSetupGuide } from "@/utils/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

import { ArrowLeft, Edit, BookOpen, Key, Video, ExternalLink, AlertTriangle, Play, CheckCircle2, ImageIcon } from "lucide-react";
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

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ViewNodeGuidePage({ params }: PageProps) {
  // Await the params Promise
  const { id } = await params;
  const guide = await getNodeSetupGuide(id);

  if (!guide) {
    notFound();
  }

  console.log("Guide data:", guide);

  // Helper function to get badge color based on host identifier
  function getHostBadgeColor(hostIdentifier: string | null) {
    if (!hostIdentifier) {
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/50 dark:text-purple-200 dark:border-purple-700"; // Direct node
    }
    return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-200 dark:border-blue-700"; // HTTP request
  }

  // Helper function to render links
  const renderLinks = (links: Link[] | null, icon: React.ReactNode, title: string, variant: 'default' | 'secondary' = 'default') => {
    if (!links || !Array.isArray(links) || links.length === 0) {
      return null;
    }

    return (
      <div className="space-y-3">
        <h4 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          {icon}
          {title}
        </h4>
        <div className="space-y-2">
          {links.map((link, index) => (
            <div key={index} className="flex items-center gap-2">
              <Button 
                variant={variant} 
                size="sm" 
                className="border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-900/20" 
                asChild
              >
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
        <h4 className="font-semibold text-amber-800 dark:text-amber-200 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Common Issues & Solutions
        </h4>
        <div className="space-y-4">
          {troubleshooting.map((item, index) => (
            <div key={index} className="border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 bg-white/60 dark:bg-amber-950/20">
              <h5 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-start gap-2">
                <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 mt-0.5">
                  Issue
                </span>
                {item.issue}
              </h5>
              <div className="text-sm text-amber-800 dark:text-amber-200 whitespace-pre-wrap leading-relaxed ml-6">
                {item.solution}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/30 rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-900/20" asChild>
                <Link href="/admin/node-guides">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
            <Button className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800" asChild>
              <Link href={`/admin/node-guides/${guide.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Guide
              </Link>
            </Button>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-emerald-800 dark:text-emerald-200 leading-tight">
                  {guide.title}
                </h1>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">
                    Setup Guide Available
                  </span>
                </div>
              </div>
              <Badge className={getHostBadgeColor(guide.hostIdentifier)}>
                {guide.hostIdentifier ? "HTTP API" : "Direct Node"}
              </Badge>
            </div>
          </div>

          <Separator className="bg-emerald-200 dark:bg-emerald-800 my-4" />
          
          <div className="space-y-2">
            <div className="text-base">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">Service: </span>
              <span className="font-semibold text-emerald-800 dark:text-emerald-200">{guide.serviceName}</span>
            </div>
            {guide.hostIdentifier && (
              <div className="text-base">
                <span className="text-emerald-600 dark:text-emerald-400 font-medium">Host: </span>
                <span className="font-mono text-emerald-700 dark:text-emerald-300">{guide.hostIdentifier}</span>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Description + Node Image */}
          {(guide.description || guide.nodeImage) && (
            <Card className="border-slate-200 bg-white/50 dark:border-slate-800/50 dark:bg-slate-950/10 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <BookOpen className="h-5 w-5" />
                  Service Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {guide.description && (
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3">Description</h4>
                    <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                      {guide.description}
                    </p>
                  </div>
                )}
                
                {guide.nodeImage && (
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Node in n8n
                    </h4>
                    <div className="bg-white/80 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 rounded-lg p-4 max-w-md">
                      <div className="relative">
                        <Image
                          src={guide.nodeImage}
                          alt={`${guide.serviceName} node in n8n`}
                          width={400}
                          height={300}
                          className="rounded-lg shadow-sm"
                          style={{ width: 'auto', height: 'auto', maxWidth: '100%' }}
                        />
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 text-center">
                        How the {guide.serviceName} node appears in n8n
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Credentials Section */}
          {(guide.credentialGuide || guide.credentialVideo || guide.credentialsLinks) && (
            <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800/50 dark:bg-orange-950/20 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                  <Key className="h-5 w-5" />
                  Credentials Setup
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Credential Guide */}
                {guide.credentialGuide && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 flex items-center gap-2">
                      <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-full font-medium">
                        Step-by-step
                      </span>
                      Instructions
                    </h4>
                    <div className="bg-white/80 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/50 rounded-lg p-4">
                      <pre className="text-sm text-orange-900 dark:text-orange-100 whitespace-pre-wrap font-mono leading-relaxed">
                        {guide.credentialGuide}
                      </pre>
                    </div>
                  </div>
                )}

                {/* Credential Video */}
                {guide.credentialVideo && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video Tutorial
                    </h4>
                    <Button 
                      variant="outline" 
                      className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20 h-auto p-3" 
                      asChild
                    >
                      <Link href={guide.credentialVideo} target="_blank" rel="noopener noreferrer">
                        <Play className="h-4 w-4 mr-2" />
                        Watch Setup Tutorial
                      </Link>
                    </Button>
                  </div>
                )}

                {/* Credentials Links */}
                {guide.credentialsLinks && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-800 dark:text-orange-200 flex items-center gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Get Your Credentials
                    </h4>
                    <div className="grid gap-2">
                      {(guide.credentialsLinks as Link[]).map((link, index) => (
                        <Button 
                          key={index} 
                          variant="outline"
                          size="sm" 
                          className="justify-start h-auto p-3 text-left border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20" 
                          asChild
                        >
                          <Link href={link.url} target="_blank" rel="noopener noreferrer">
                            <Key className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span className="truncate">{link.title}</span>
                          </Link>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Setup Instructions */}
          {guide.setupInstructions && (
            <Card className="border-emerald-200 bg-white/50 dark:border-emerald-800/50 dark:bg-emerald-950/10 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
                  <CheckCircle2 className="h-5 w-5" />
                  After Credentials Setup
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-white/80 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/50 rounded-lg p-4">
                  <pre className="text-sm text-emerald-900 dark:text-emerald-100 whitespace-pre-wrap font-mono leading-relaxed">
                    {guide.setupInstructions}
                  </pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Help Links */}
          {guide.helpLinks && (
            <Card className="border-slate-200 bg-white/50 dark:border-slate-800/50 dark:bg-slate-950/10 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <BookOpen className="h-5 w-5" />
                  Additional Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderLinks(
                  guide.helpLinks as Link[],
                  <ExternalLink className="h-4 w-4" />,
                  "Documentation & Guides",
                  "secondary"
                )}
              </CardContent>
            </Card>
          )}

          {/* Video Links */}
          {guide.videoLinks && (
            <Card className="border-slate-200 bg-white/50 dark:border-slate-800/50 dark:bg-slate-950/10 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                  <Video className="h-5 w-5" />
                  Video Tutorials
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderLinks(
                  guide.videoLinks as Link[],
                  <Video className="h-4 w-4" />,
                  "Tutorial Videos",
                  "secondary"
                )}
              </CardContent>
            </Card>
          )}

          {/* Troubleshooting */}
          {guide.troubleshooting && (
            <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800/50 dark:bg-amber-950/20 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                  <AlertTriangle className="h-5 w-5" />
                  Common Issues & Solutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderTroubleshooting(guide.troubleshooting as TroubleshootingItem[])}
              </CardContent>
            </Card>
          )}

          {/* Usage Stats */}
          {guide.usageStats && guide.usageStats.length > 0 && (
            <Card className="border-slate-200 bg-white/50 dark:border-slate-800/50 dark:bg-slate-950/10 shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-slate-800 dark:text-slate-200">Usage Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {guide.usageStats.map((stat: any) => (
                    <div key={stat.id} className="text-center p-4 bg-white/60 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/50 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                        {stat.usageCount}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
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