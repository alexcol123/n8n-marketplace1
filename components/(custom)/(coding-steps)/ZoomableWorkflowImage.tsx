/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize2,
  Image as ImageIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ZoomableWorkflowImageProps {
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
}

const ZoomableWorkflowImage: React.FC<ZoomableWorkflowImageProps> = ({
  imageSrc = "/workflow-sample.png",
  imageAlt = "Workflow Diagram",
  className,
}) => {
  const [scale, setScale] = useState(0.75);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imageDimensions, setImageDimensions] = useState({
    width: 1400,
    height: 600,
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = () => {
    if (imageRef.current) {
      setImageDimensions({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  };

  const handleImageError = () => {
    console.error("Failed to load image:", imageSrc);
  };

  const resetZoom = () => {
    setScale(1.0);
    setTranslateX(0);
    setTranslateY(0);
  };

  const fitToContainer = () => {
    if (!containerRef.current) return;

    const container = containerRef.current.getBoundingClientRect();
    const containerWidth = container.width - 64;
    const containerHeight = container.height - 64;

    const scaleX = containerWidth / imageDimensions.width;
    const scaleY = containerHeight / imageDimensions.height;
    const optimalScale = Math.min(scaleX, scaleY);

    const zoomLevels = [0.5, 0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
    const closestZoom = zoomLevels.reduce((prev, curr) =>
      Math.abs(curr - optimalScale) < Math.abs(prev - optimalScale)
        ? curr
        : prev
    );

    setScale(closestZoom);
    setTranslateX(0);
    setTranslateY(0);
  };

  const zoomIn = () => {
    if (scale === 0.5) setScale(0.75);
    else if (scale === 0.75) setScale(1.0);
    else if (scale === 1.0) setScale(1.25);
    else if (scale === 1.25) setScale(1.5);
    else if (scale === 1.5) setScale(1.75);
    else if (scale === 1.75) setScale(2.0);
  };

  const zoomOut = () => {
    if (scale === 2.0) setScale(1.75);
    else if (scale === 1.75) setScale(1.5);
    else if (scale === 1.5) setScale(1.25);
    else if (scale === 1.25) setScale(1.0);
    else if (scale === 1.0) setScale(0.75);
    else if (scale === 0.75) setScale(0.5);
  };

  const getZoomColor = () => {
    if (scale <= 0.75) return "text-orange-600";
    if (scale >= 1.5) return "text-blue-600";
    return "text-green-600";
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - translateX,
      y: e.clientY - translateY,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setTranslateX(e.clientX - dragStart.x);
    setTranslateY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - translateX,
        y: touch.clientY - translateY,
      });
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();

    const touch = e.touches[0];
    setTranslateX(touch.clientX - dragStart.x);
    setTranslateY(touch.clientY - dragStart.y);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseup", handleMouseUp);
    container.addEventListener("mouseleave", handleMouseUp);
    container.addEventListener("touchmove", handleTouchMove, {
      passive: false,
    });
    container.addEventListener("touchend", handleTouchEnd);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseup", handleMouseUp);
      container.removeEventListener("mouseleave", handleMouseUp);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, dragStart]);

  return (
    <Card className={cn("w-full overflow-hidden", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-primary" />
            <span>Workflow Overview</span>
          </div>
          <div
            className={cn(
              "text-sm font-mono px-2 py-1 rounded-md bg-muted",
              getZoomColor()
            )}
          >
            {Math.round(scale * 100)}%
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg border">
          <div className="flex items-center gap-2">
            <Button
              onClick={zoomOut}
              variant="outline"
              size="sm"
              disabled={scale <= 0.5}
              className="h-9 px-3"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2 px-3 py-1 bg-background rounded-md border min-w-[80px] justify-center">
              <span className={cn("text-sm font-medium", getZoomColor())}>
                {Math.round(scale * 100)}%
              </span>
            </div>

            <Button
              onClick={zoomIn}
              variant="outline"
              size="sm"
              disabled={scale >= 2.0}
              className="h-9 px-3"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={fitToContainer}
              variant="outline"
              size="sm"
              className="h-9 px-3"
            >
              <Maximize2 className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Fit to View</span>
            </Button>

            <Button
              onClick={resetZoom}
              variant="outline"
              size="sm"
              className="h-9 px-3"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Reset</span>
            </Button>
          </div>
        </div>

        <div
          ref={containerRef}
          className="relative w-full h-[500px] bg-gradient-to-br from-muted/30 to-muted/60 rounded-xl overflow-hidden border-2 border-border/50 shadow-inner"
          style={{
            cursor: isDragging ? "grabbing" : "grab",
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          <div
            style={{
              transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.2s ease-out",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt={imageAlt}
              className="max-w-none select-none rounded-lg shadow-lg"
              onLoad={handleImageLoad}
              onError={handleImageError}
              draggable={false}
              style={{
                width: imageDimensions.width,
                height: imageDimensions.height,
              }}
            />
          </div>

          <div className="absolute bottom-3 left-3 flex gap-2">
            <Button
              onClick={zoomOut}
              variant="outline"
              size="sm"
              disabled={scale <= 0.5}
              className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm border-primary/70 hover:border-primary hover:bg-primary/10 shadow-md"
            >
              <ZoomOut className="w-4 h-4 text-primary" />
            </Button>
            <Button
              onClick={zoomIn}
              variant="outline"
              size="sm"
              disabled={scale >= 2.0}
              className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm border-primary/70 hover:border-primary hover:bg-primary/10 shadow-md"
            >
              <ZoomIn className="w-4 h-4 text-primary" />
            </Button>
            <Button
              onClick={fitToContainer}
              variant="outline"
              size="sm"
              className="h-8 w-8 p-0 bg-background/90 backdrop-blur-sm border-primary/70 hover:border-primary hover:bg-primary/10 shadow-md"
            >
              <Maximize2 className="w-4 h-4 text-primary" />
            </Button>
          </div>

          <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm border text-xs px-2 py-1 rounded-md text-muted-foreground">
            <span className="hidden sm:inline">Drag to pan around</span>
            <span className="sm:hidden">Drag to pan</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ZoomableWorkflowImage;