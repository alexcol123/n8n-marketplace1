'use client';

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

function LoadingCards() {
  // Create an array to render multiple cards
  const skeletonCards = Array.from({ length: 6 }).map((_, index) => (
    <SkeletonCard key={index} />
  ));

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {skeletonCards}
    </div>
  );
}

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border-primary/10 h-full flex flex-col">
      {/* Skeleton for workflow image area */}
      <div className="relative h-60 bg-muted/40 overflow-hidden">
        {/* Category badge skeleton */}
        <div className="absolute bottom-4 left-4">
          <Skeleton className="h-6 w-24 rounded-full bg-primary/20" />
        </div>
        
        {/* View count badge skeleton */}
        <div className="absolute top-4 right-4">
          <Skeleton className="h-6 w-14 rounded-full bg-black/20" />
        </div>
      </div>

      <CardHeader className="pb-2 pt-4">
        {/* Title skeleton - two lines for longer titles */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow">
        {/* Description skeleton: 3 lines */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        <div className="flex items-center justify-between pt-2">
          {/* Author info skeleton */}
          <div className="flex items-center space-x-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>

          {/* Date skeleton */}
          <Skeleton className="h-4 w-20" />
        </div>
      </CardContent>

      <CardFooter className="pt-0 pb-4">
        <div className="w-full flex justify-end">
          {/* View workflow button skeleton */}
          <Skeleton className="h-9 w-36 rounded-full bg-primary/20" />
        </div>
      </CardFooter>
    </Card>
  );
}

export default LoadingCards;