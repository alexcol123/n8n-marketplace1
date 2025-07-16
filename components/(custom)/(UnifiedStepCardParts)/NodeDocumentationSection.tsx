import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NodeDocumentation } from "@prisma/client";

// Guide Section Component
const NodeDocumentationSection = ({ guideData }:{guideData: NodeDocumentation}) => {
  // Don't render if no guide data
  if (!guideData) return null;



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
      {guideData.description && guideData.description !== "" && (
        <p className="text-emerald-200 text-sm mb-3 leading-relaxed">
          {guideData.description}
        </p>
      )}

      {/* Credential Guide - Detailed instructions */}
      {guideData.credentialGuide && guideData.credentialGuide !== "" && (
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
      {guideData.credentialsLinks &&
        Array.isArray(guideData.credentialsLinks) &&
        guideData.credentialsLinks.length > 0 && (
          <div className="mb-3">
            <h5 className="text-emerald-300 font-medium mb-2">
              Get Credentials:
            </h5>
            <div className="flex flex-wrap gap-2">
              {guideData.credentialsLinks.map((link, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  onClick={() => window.open(link.url, "_blank")}
                >
                  🔑 {link.title}
                </Button>
              ))}
            </div>
          </div>
        )}

      {/* Credential Video - Single video for credential setup */}
      {guideData.credentialVideo && guideData.credentialVideo !== "" && (
        <div className="mb-3">
          <Button
            size="sm"
            variant="outline"
            className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
            onClick={() => window.open(guideData.credentialVideo, "_blank")}
          >
            🎬 Watch Credential Setup Video
          </Button>
        </div>
      )}

      {/* Setup Instructions - General setup after credentials */}
      {guideData.setupInstructions && guideData.setupInstructions !== "" && (
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
      {guideData.helpLinks &&
        Array.isArray(guideData.helpLinks) &&
        guideData.helpLinks.length > 0 && (
          <div className="mb-3">
            <h5 className="text-emerald-300 font-medium mb-2">
              Help & Documentation:
            </h5>
            <div className="flex flex-wrap gap-2">
              {guideData.helpLinks.map((link, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  onClick={() => window.open(link.url, "_blank")}
                >
                  📚 {link.title}
                </Button>
              ))}
            </div>
          </div>
        )}

      {/* Video Links - Other tutorial videos */}
      {guideData.videoLinks &&
        Array.isArray(guideData.videoLinks) &&
        guideData.videoLinks.length > 0 && (
          <div className="mb-3">
            <h5 className="text-emerald-300 font-medium mb-2">
              Video Tutorials:
            </h5>
            <div className="flex flex-wrap gap-2">
              {guideData.videoLinks.map((video, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant="outline"
                  className="border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  onClick={() => window.open(video.url, "_blank")}
                >
                  🎥 {video.title}
                </Button>
              ))}
            </div>
          </div>
        )}

      {/* Troubleshooting */}
      {guideData.troubleshooting &&
        Array.isArray(guideData.troubleshooting) &&
        guideData.troubleshooting.length > 0 && (
          <div className="mb-3">
            <h5 className="text-emerald-300 font-medium mb-2">
              Troubleshooting:
            </h5>
            <div className="space-y-2">
              {guideData.troubleshooting.map((issue, index) => (
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
