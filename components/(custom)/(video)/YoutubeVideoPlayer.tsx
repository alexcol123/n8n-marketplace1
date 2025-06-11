// components/(custom)/(workflow)/YouTubeVideoPlayer.tsx
"use client";

import { useState, useEffect } from "react";
import { ExternalLink, PlayCircle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaYoutube } from "react-icons/fa";

interface YouTubeVideoPlayerProps {
  videoUrl: string | null;
  title: string;
}

const YouTubeVideoPlayer = ({ videoUrl, title }: YouTubeVideoPlayerProps) => {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!videoUrl) {
      setIsLoading(false);
      return;
    }

    try {
      // Extract the video ID from various YouTube URL formats
      const extractYouTubeId = (url: string) => {
        // Regular expressions for different YouTube URL formats
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        
        if (match && match[2].length === 11) {
          return match[2];
        }
        return null;
      };

      const id = extractYouTubeId(videoUrl);
      setVideoId(id);
      setHasError(!id);
    } catch (error) {
      console.error("Error processing YouTube URL:", error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [videoUrl]);

  if (!videoUrl) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="my-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="h-6 w-6 rounded-full bg-primary/20 animate-pulse"></div>
          <div className="h-6 w-48 bg-primary/20 animate-pulse rounded"></div>
        </div>
        <div className="aspect-video w-full rounded-xl bg-muted/30 animate-pulse"></div>
      </section>
    );
  }

  if (hasError || !videoId) {
    return (
      <div className="my-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/30 rounded-lg p-4 text-amber-800 dark:text-amber-200">
        <div className="flex items-start gap-3">
          <FaYoutube className="h-5 w-5 mt-0.5 flex-shrink-0 text-red-500" />
          <div>
            <p className="font-medium">Invalid YouTube URL</p>
            <p className="text-sm mt-1">The workflow includes a YouTube URL that couldn&apos;t be processed.</p>
            {videoUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2 text-xs border-amber-200 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-800/30" 
                onClick={() => window.open(videoUrl, '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1.5" />
                Try opening on YouTube
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="my-10">
      <h2 className="text-2xl font-semibold mb-6 text-primary flex items-center gap-2">
        <FaYoutube className="h-6 w-6 text-red-600 dark:text-red-500" />
        Workflow Demonstration Video
      </h2>
      
      <div 
        className={`bg-gradient-to-tr from-primary/5 via-transparent to-primary/5 p-1 sm:p-2 rounded-xl border ${isHovered ? 'border-red-400 dark:border-red-600' : 'border-primary/20'} shadow-md transition-all duration-300 transform ${isHovered ? 'scale-[1.01] shadow-lg dark:shadow-red-900/20' : ''}`}
      >
        <div 
          className="aspect-video w-full rounded-lg overflow-hidden bg-black relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
            title={`${title} workflow demonstration`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full z-10 relative"
            loading="lazy"
          />
          
          {/* Overlay with play button and pulse effect */}
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 transition-opacity duration-300">
            <div className={`relative ${isHovered ? 'animate-ping opacity-30' : ''}`}>
              <PlayCircle className="h-16 w-16 text-red-500 absolute inset-0" />
            </div>
            <PlayCircle className={`h-16 w-16 ${isHovered ? 'text-red-500 scale-110' : 'text-white'} transition-all duration-300`} />
            <div className={`text-xs flex items-center gap-1.5 px-3 py-1 rounded-full ${isHovered ? 'bg-red-500 text-white scale-110' : 'bg-black/50 text-white/80'} transition-all duration-300 mt-2`}>
              <Volume2 className="h-3 w-3" />
              <span>Click to play with sound</span>
            </div>
          </div>
          
          {/* YouTube branding */}
          <div className="absolute bottom-3 right-3 bg-red-600 dark:bg-red-700 text-white text-xs font-semibold flex items-center gap-1.5 px-2 py-1 rounded-md opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
            <FaYoutube className="h-3 w-3" />
            <span>YouTube</span>
          </div>
          
          {/* Red pulse overlay on hover */}
          {isHovered && (
            <div className="absolute inset-0 bg-gradient-to-tr from-red-500/5 to-red-500/10 pointer-events-none"></div>
          )}
        </div>
      </div>
      
      <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <p className="text-sm text-muted-foreground">
          This video demonstrates how the workflow operates and implementation steps
        </p>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => window.open(videoUrl, '_blank')}
          className={`gap-1.5 text-xs w-full sm:w-auto justify-center border transition-colors duration-300 ${isHovered ? 'bg-red-500 hover:bg-red-600 text-white border-red-600 dark:border-red-700' : 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/30'}`}
        >
          <FaYoutube className={`h-3.5 w-3.5 ${isHovered ? 'text-white' : 'text-red-600 dark:text-red-500'}`} />
          Watch on YouTube
        </Button>
      </div>
    </section>
  );
};

export default YouTubeVideoPlayer;