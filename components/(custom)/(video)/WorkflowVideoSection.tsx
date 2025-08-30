'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Youtube } from "lucide-react";
import YouTubeVideoPlayer from "@/components/(custom)/(video)/YoutubeVideoPlayer";

interface WorkflowVideoSectionProps {
  videoUrl: string;
  title: string;
}

const WorkflowVideoSection = ({ videoUrl, title }: WorkflowVideoSectionProps) => {
  const [isVideoVisible, setIsVideoVisible] = useState(true);

  if (!videoUrl) return null;

  return (
    <section className="my-4">
      <div className="mb-4">
        <Button
          onClick={() => setIsVideoVisible(!isVideoVisible)}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isVideoVisible ? (
            <>
              <EyeOff className="h-4 w-4" />
              Hide Tutorial Video
            </>
          ) : (
            <>
              <Youtube className="h-4 w-4 text-red-500" />
              View Tutorial Video
            </>
          )}
        </Button>
      </div>
      
      {isVideoVisible && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl blur-xl opacity-50"></div>
          <div className="relative bg-background/50 backdrop-blur-sm border border-primary/10 rounded-3xl p-2 shadow-xl">
            <YouTubeVideoPlayer
              videoUrl={videoUrl}
              title={title}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default WorkflowVideoSection;