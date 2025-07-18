import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NodeDocumentation } from "@prisma/client";
import { BookOpen, Key, Video, ExternalLink, AlertTriangle, Play, CheckCircle2 } from "lucide-react";
import Link from "next/link";

// Since NodeDocumentation is a Prisma type, let's create a type for the link objects
interface CredentialLink {
  title: string;
  url: string;
}

interface HelpLink {
  title: string;
  url: string;
}

interface VideoLink {
  title: string;
  url: string;
}

interface TroubleshootingItem {
  issue?: string;
  title?: string;
  solution: string;
}

// Guide Section Component
const NodeDocumentationSection = ({ guideData }: { guideData: NodeDocumentation }) => {
  // Don't render if no guide data
  if (!guideData) return null;

  // Type assertions for JSON fields from Prisma
  const credentialsLinks = guideData.credentialsLinks as CredentialLink[] | null;
  const helpLinks = guideData.helpLinks as HelpLink[] | null;
  const videoLinks = guideData.videoLinks as VideoLink[] | null;
  const troubleshooting = guideData.troubleshooting as TroubleshootingItem[] | null;

  // Helper function to render links with better styling
  const renderLinks = (links: CredentialLink[] | HelpLink[] | VideoLink[] | null, icon: React.ReactNode, title: string, variant: 'default' | 'secondary' = 'default') => {
    if (!links || !Array.isArray(links) || links.length === 0) {
      return null;
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon}
          {title}
        </div>
        <div className="grid gap-2">
          {links.map((link, index) => (
            <Button 
              key={index} 
              variant={variant} 
              size="sm" 
              className="justify-start h-auto p-3 text-left" 
              asChild
            >
              <Link href={link.url} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2 flex-shrink-0" />
                <span className="truncate">{link.title}</span>
              </Link>
            </Button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/20 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/30 rounded-xl p-6 shadow-sm">
      <div className="space-y-6">
        {/* Header with Service Info */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-200 leading-tight">
                {guideData.title}
              </h1>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                  Setup Guide Available
                </span>
              </div>
            </div>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/50 dark:text-emerald-200 dark:border-emerald-700 flex-shrink-0">
              {guideData.hostIdentifier ? "HTTP API" : "Direct Node"}
            </Badge>
          </div>
          
          {guideData.description && (
            <p className="text-emerald-700 dark:text-emerald-300 leading-relaxed">
              {guideData.description}
            </p>
          )}
        </div>

        <Separator className="bg-emerald-200 dark:bg-emerald-800" />

        {/* Credentials Section - Most Important */}
        {(guideData.credentialGuide || guideData.credentialVideo || credentialsLinks) && (
          <Card className="border-orange-200 bg-orange-50/50 dark:border-orange-800/50 dark:bg-orange-950/20 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
                <Key className="h-5 w-5" />
                Credentials Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Credential Guide */}
              {guideData.credentialGuide && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 flex items-center gap-2">
                    <span className="bg-orange-100 dark:bg-orange-900/50 text-orange-800 dark:text-orange-200 text-xs px-2 py-1 rounded-full font-medium">
                      Step-by-step
                    </span>
                    Instructions
                  </h4>
                  <div className="bg-white/80 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800/50 rounded-lg p-4">
                    <pre className="text-sm text-orange-900 dark:text-orange-100 whitespace-pre-wrap font-mono leading-relaxed">
                      {guideData.credentialGuide}
                    </pre>
                  </div>
                </div>
              )}

              {/* Credential Video */}
              {guideData.credentialVideo && (
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
                    <Link href={guideData.credentialVideo} target="_blank" rel="noopener noreferrer">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Setup Tutorial
                    </Link>
                  </Button>
                </div>
              )}

              {/* Credentials Links */}
              {credentialsLinks && credentialsLinks.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200 flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Get Your Credentials
                  </h4>
                  <div className="grid gap-2">
                    {credentialsLinks.map((link, index) => (
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
        {guideData.setupInstructions && (
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
                  {guideData.setupInstructions}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Resources */}
        {((helpLinks && helpLinks.length > 0) || (videoLinks && videoLinks.length > 0)) && (
          <Card className="border-slate-200 bg-white/50 dark:border-slate-800/50 dark:bg-slate-950/10 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-slate-200">
                <BookOpen className="h-5 w-5" />
                Additional Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Help Links */}
              {helpLinks && helpLinks.length > 0 && (
                renderLinks(
                  helpLinks,
                  <ExternalLink className="h-4 w-4" />,
                  "Documentation & Guides",
                  "secondary"
                )
              )}

              {/* Video Links */}
              {videoLinks && videoLinks.length > 0 && (
                renderLinks(
                  videoLinks,
                  <Video className="h-4 w-4" />,
                  "Video Tutorials",
                  "secondary"
                )
              )}
            </CardContent>
          </Card>
        )}

        {/* Troubleshooting */}
        {troubleshooting && troubleshooting.length > 0 && (
          <Card className="border-amber-200 bg-amber-50/50 dark:border-amber-800/50 dark:bg-amber-950/20 shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
                <AlertTriangle className="h-5 w-5" />
                Common Issues & Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {troubleshooting.map((item, index) => (
                  <div key={index} className="border border-amber-200 dark:border-amber-800/50 rounded-lg p-4 bg-white/60 dark:bg-amber-950/20">
                    <h5 className="font-semibold text-amber-900 dark:text-amber-100 mb-2 flex items-start gap-2">
                      <span className="bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 mt-0.5">
                        Issue
                      </span>
                      {item.issue || item.title}
                    </h5>
                    <div className="text-sm text-amber-800 dark:text-amber-200 whitespace-pre-wrap leading-relaxed ml-6">
                      {item.solution}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NodeDocumentationSection;