import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NodeDocumentation } from "@prisma/client";
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

  return (
    <div className="mb-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            📖 Setup Guide Available
          </Badge>
        </div>
      </div>

      {/* Title - Always show if exists */}
      {guideData.title && (
        <h4 className="font-semibold text-emerald-300 mb-2">
          {guideData.title}
        </h4>
      )}

      {/* Guide Description */}
      {guideData.description && (
        <p className="text-emerald-200 text-sm mb-3 leading-relaxed">
          {guideData.description}
        </p>
      )}

      {/* Credential Guide - Detailed instructions */}
      {guideData.credentialGuide && (
        <div className="mb-3">
          <h5 className="text-emerald-300 font-medium mb-2">
            Credential Setup Guide:
          </h5>
          <div className="text-emerald-200 text-sm bg-emerald-500/5 p-3 rounded border border-emerald-500/10 whitespace-pre-wrap">
            {guideData.credentialGuide}
          </div>
        </div>
      )}

      {/* Credentials Links - Links to get API keys */}
      {credentialsLinks && credentialsLinks.length > 0 && (
        <div className="mb-3">
          <h5 className="text-emerald-300 font-medium mb-2">
            Get Credentials:
          </h5>
          <div className="flex flex-wrap gap-2">
            {credentialsLinks.map((link, index) => (
              <Link key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                >
                  🔑 {link.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Credential Video - Single video for credential setup */}
      {guideData.credentialVideo && (
        <div className="mb-3">
          <Link href={guideData.credentialVideo} target="_blank" rel="noopener noreferrer">
            <Button
              size="sm"
              variant="outline"
              className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
            >
              🎬 Watch Credential Setup Video
            </Button>
          </Link>
        </div>
      )}

      {/* Setup Instructions - General setup after credentials */}
      {guideData.setupInstructions && (
        <div className="mb-3">
          <h5 className="text-emerald-300 font-medium mb-2">
            Setup Instructions:
          </h5>
          <div className="text-emerald-200 text-sm bg-emerald-500/5 p-3 rounded border border-emerald-500/10 whitespace-pre-wrap">
            {guideData.setupInstructions}
          </div>
        </div>
      )}

      {/* Help Links - General documentation */}
      {helpLinks && helpLinks.length > 0 && (
        <div className="mb-3">
          <h5 className="text-emerald-300 font-medium mb-2">
            Help & Documentation:
          </h5>
          <div className="flex flex-wrap gap-2">
            {helpLinks.map((link, index) => (
              <Link key={index} href={link.url} target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                >
                  📚 {link.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Video Links - Other tutorial videos */}
      {videoLinks && videoLinks.length > 0 && (
        <div className="mb-3">
          <h5 className="text-emerald-300 font-medium mb-2">
            Video Tutorials:
          </h5>
          <div className="flex flex-wrap gap-2">
            {videoLinks.map((video, index) => (
              <Link key={index} href={video.url} target="_blank" rel="noopener noreferrer">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                >
                  🎥 {video.title}
                </Button>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Troubleshooting */}
      {troubleshooting && troubleshooting.length > 0 && (
        <div className="mb-3">
          <h5 className="text-emerald-300 font-medium mb-2">
            Troubleshooting:
          </h5>
          <div className="space-y-2">
            {troubleshooting.map((issue, index) => (
              <div
                key={index}
                className="bg-emerald-500/5 p-3 rounded border border-emerald-500/10"
              >
                <h6 className="text-emerald-300 font-medium text-sm mb-1">
                  {issue.issue || issue.title}
                </h6>
                <p className="text-emerald-200 text-sm">{issue.solution}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeDocumentationSection;