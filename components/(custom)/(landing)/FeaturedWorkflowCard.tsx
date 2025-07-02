import { Badge } from "@/components/ui/badge";
import { Users, Tag } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface FeaturedWorkflowCardProps {
  workflow: {
    id: string;
    title: string;
    slug: string;
    category: string;
    viewCount: number;
    creationImage: string | null;
    workflowImage: string;
  };
}

const FeaturedWorkflowCard = ({ workflow }: FeaturedWorkflowCardProps) => {
  const formatViewCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl hover:shadow-primary/25 transition-all duration-500 hover:border-primary/50 hover:-translate-y-2 hover:scale-[1.03] cursor-pointer bg-gradient-to-br from-background to-muted/20">
      <Link href={`/workflow/${workflow.slug}`} className="block">
        <div className="relative overflow-hidden">
          {/* Enhanced gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 z-10" />
          
          {/* Shimmer effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 z-10" />

          <Image
            src={
              workflow.creationImage !== null
                ? workflow.creationImage
                : workflow.workflowImage
            }
            alt={workflow.title}
            width={400}
            height={200}
            className="w-full h-36 sm:h-44 object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
            loading="lazy"
          />

          {/* Enhanced badges */}
          <div className="absolute top-3 right-3 flex gap-2 z-20">
            <Badge
              variant="secondary"
              className="bg-black/50 text-white border-white/20 backdrop-blur-sm hover:bg-black/70 transition-colors"
            >
              <Users className="h-3 w-3 mr-1" />
              {formatViewCount(workflow.viewCount)}
            </Badge>
          </div>

          {/* Category badge */}
          <Badge
            variant="outline"
            className="absolute top-3 left-3 bg-primary/90 text-primary-foreground border-primary/50 backdrop-blur-sm z-20"
          >
            <Tag className="h-3 w-3 mr-1" />
            {workflow.category}
          </Badge>

          {/* Enhanced floating "Try it" button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 z-20">
            <div className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 rounded-xl text-sm font-semibold shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-110 backdrop-blur-sm border border-primary/20">
              Try it now →
            </div>
          </div>
        </div>

        {/* Enhanced content section */}
        <div className="p-5 min-h-[4.5rem] flex flex-col justify-center relative">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <h4 className="font-semibold text-base line-clamp-2 group-hover:text-primary transition-all duration-300 leading-snug relative z-10 group-hover:transform group-hover:translate-x-1">
            {workflow.title}
          </h4>
          
          {/* Subtle progress indicator */}
          <div className="mt-2 h-0.5 w-0 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-500 ease-out" />
        </div>
      </Link>
    </Card>
  );
};

export default FeaturedWorkflowCard;