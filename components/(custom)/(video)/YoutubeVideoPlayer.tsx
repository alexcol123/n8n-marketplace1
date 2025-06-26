'use client'
import { useState, useEffect } from "react";
import { ExternalLink, Volume2 } from "lucide-react";
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
  const [showOverlay, setShowOverlay] = useState(false);
  const [overlayClicked, setOverlayClicked] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>("");

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
      
      // Set initial video src without autoplay
      if (id) {
        setVideoSrc(`https://www.youtube.com/embed/${id}?rel=0`);
      }
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
          className="aspect-video w-full rounded-lg overflow-hidden bg-black relative group"
          onMouseEnter={() => {
            setIsHovered(true);
            // Only show overlay if it hasn't been clicked yet
            if (!overlayClicked) {
              setShowOverlay(true);
            }
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            // Only hide overlay if it hasn't been clicked yet
            if (!overlayClicked) {
              setShowOverlay(false);
            }
          }}
          onClick={() => {
            // Hide overlay and start video when clicked
            setOverlayClicked(true);
            setShowOverlay(false);
            
            // Update iframe src to include autoplay
            if (videoId) {
              setVideoSrc(`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`);
            }
          }}
        >
          <iframe
            src={videoSrc}
            title={`${title} workflow demonstration`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full relative"
            loading="lazy"
          />
          
          {/* Ultra-modern cinematic overlay */}
          <div className={`absolute inset-0 transition-all duration-700 z-20 ${overlayClicked ? 'pointer-events-none' : 'pointer-events-auto cursor-pointer'} ${showOverlay ? 'opacity-100' : 'opacity-0'}`}>
            {/* Full screen darkening overlay on hover */}
            <div className={`absolute inset-0 transition-all duration-500 ${isHovered ? 'bg-black/70' : 'bg-transparent'}`}></div>
            
            {/* Animated particles background */}
            <div className="absolute inset-0 overflow-hidden">
              <div className={`absolute top-1/4 left-1/4 w-1 h-1 bg-white/40 rounded-full ${showOverlay ? 'animate-pulse' : ''}`}></div>
              <div className={`absolute top-1/3 right-1/3 w-0.5 h-0.5 bg-red-400/60 rounded-full ${showOverlay ? 'animate-ping' : ''}`}></div>
              <div className={`absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-blue-400/30 rounded-full ${showOverlay ? 'animate-bounce' : ''}`}></div>
              <div className={`absolute top-2/3 right-1/4 w-0.5 h-0.5 bg-white/50 rounded-full ${showOverlay ? 'animate-pulse' : ''}`}></div>
            </div>
            
            {/* Radial gradient background */}
            <div className={`absolute inset-0 transition-all duration-500 ${isHovered ? 'bg-gradient-to-r from-black/60 via-black/50 to-black/90' : 'bg-gradient-to-r from-transparent via-black/20 to-black/80'}`}></div>
            
            {/* Center content container */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              {/* Outer glow ring */}
              <div className={`absolute w-32 h-32 rounded-full transition-all duration-1000 ${showOverlay ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}`}>
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/20 via-pink-500/20 to-red-500/20 animate-spin"></div>
                <div className="absolute inset-2 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 animate-pulse"></div>
              </div>
              
              {/* Main play button container */}
              <div className={`relative z-10 transition-all duration-700 ${showOverlay ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                {/* Pulsing rings */}
                <div className="absolute inset-0 w-24 h-24 rounded-full border-2 border-white/20 animate-ping"></div>
                <div className="absolute inset-0 w-24 h-24 rounded-full border border-red-400/30 animate-pulse"></div>
                
                {/* Play button with premium styling */}
                <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br transition-all duration-500 ${isHovered ? 'from-red-700 via-red-800 to-red-900 shadow-2xl shadow-red-500/60' : 'from-red-500 via-red-600 to-red-700 shadow-2xl shadow-red-500/40'} flex items-center justify-center`}>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent"></div>
                  
                  {/* YouTube play icon */}
                  <div className="relative z-10">
                    <FaYoutube className={`text-white drop-shadow-lg transition-all duration-300 ${isHovered ? 'w-14 h-14' : 'w-12 h-12'}`} />
                  </div>
                  
                  {/* Inner glow */}
                  <div className="absolute inset-1 rounded-full bg-gradient-to-br from-red-400/30 to-transparent animate-pulse"></div>
                </div>
              </div>
              
              {/* Floating text with advanced styling */}
              <div className={`mt-8 transition-all duration-500 delay-200 ${showOverlay ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
                <div className="relative">
                  {/* Background glass effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/5 via-white/10 to-white/5 backdrop-blur-md rounded-2xl border border-white/20"></div>
                  
                  {/* Content */}
                  <div className="relative px-6 py-3 flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                      <span className="text-white font-semibold text-sm tracking-wide">WATCH DEMO</span>
                      <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-red-600 rounded-full animate-pulse shadow-lg shadow-red-500/50"></div>
                    </div>
                    <div className="w-px h-4 bg-white/30"></div>
                    <Volume2 className="w-4 h-4 text-white/80" />
                  </div>
                  
                  {/* Subtle animation line */}
                  <div className={`absolute bottom-0 left-0 h-px bg-gradient-to-r from-transparent via-red-400 to-transparent transition-all duration-1000 ${showOverlay ? 'w-full opacity-100' : 'w-0 opacity-0'}`}></div>
                </div>
              </div>
              
              {/* Floating brand badge */}
              <div className={`absolute bottom-6 right-6 transition-all duration-700 delay-300 ${showOverlay ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-4 opacity-0 scale-90'}`}>
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-700 to-red-800 rounded-xl blur-sm"></div>
                  <div className="relative bg-gradient-to-r from-red-600 to-red-700 px-4 py-2 rounded-xl shadow-2xl shadow-red-600/40 border border-red-500/50">
                    <div className="flex items-center gap-2">
                      <FaYoutube className="w-4 h-4 text-white animate-pulse" />
                      <span className="text-white font-bold text-xs tracking-wider">YOUTUBE</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent rounded-xl"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* YouTube branding */}
          <div className={`absolute bottom-4 right-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-bold flex items-center gap-2 px-3 py-2 rounded-lg shadow-lg transition-all duration-500 ${showOverlay ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-3 scale-95'}`}>
            <FaYoutube className="h-4 w-4" />
            <span>YouTube</span>
          </div>
          
          {/* Ambient glow overlay */}
          {showOverlay && (
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-purple-500/5 to-blue-500/5 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent animate-pulse"></div>
            </div>
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