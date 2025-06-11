// app/dashboard/mydownloads/page.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchUserDownloads } from "@/utils/actions";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { Download, ExternalLink, Search, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { WorkflowJsonDownloadButton } from "@/components/(custom)/(download)/WorkflowJsonDownloadButton";
import { JsonObject, JsonValue } from "@prisma/client/runtime/library";

interface WorkflowDownload {
  id: string;
  workflowId: string;
  userId: string;
  downloadedAt: string | Date;
  workflow: {
    id: string;
    title: string;
    content: string;
    workflowImage: string;
    slug: string;
    authorId: string;
    category: string;
    viewCount: number;
    workFlowJson: string | JsonValue | JsonObject // You can define a more specific type if needed
    author: {
      id: string;
      clerkId: string;
      firstName: string;
      lastName: string;
      username: string;
      email: string;
      profileImage: string;
      bio: string | null;
      createdAt: Date | string;
      updatedAt: Date | string;
    };
  };
}


export default function MyDownloadsPage() {
const [downloads, setDownloads] = useState<WorkflowDownload[]>([]);



  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch downloads when component mounts
  useEffect(() => {
    const getDownloads = async () => {
      setIsLoading(true);
      try {
        const result = await fetchUserDownloads();

        if (Array.isArray(result)) {
          setDownloads(result as WorkflowDownload[]);
        } else {
          console.error("Unexpected response format:", result);
        }
      } catch (error) {
        console.error("Error fetching downloads:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getDownloads();
  }, []);
  
  // Filter downloads by title or category
  const filteredDownloads = downloads.filter(download => {
    const title = download.workflow.title.toLowerCase();
    const category = download.workflow.category.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return title.includes(search) || category.includes(search);
  });
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">My Downloads</h1>
        </div>
        <Button variant="outline" size="sm" asChild className="gap-1 self-start sm:self-auto">
          <Link href="/">
            <ArrowLeft className="h-4 w-4" />
            <span>Browse Workflows</span>
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 rounded-full bg-primary/20"></div>
            <div className="mt-4 h-4 w-32 bg-primary/20 rounded"></div>
          </div>
        </div>
      ) : downloads.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-card rounded-lg border p-4 sm:p-8 shadow-sm">
          <div className="bg-primary/10 rounded-full p-4 sm:p-6 mx-auto w-16 sm:w-24 h-16 sm:h-24 flex items-center justify-center mb-4 sm:mb-6">
            <Download className="h-8 sm:h-12 w-8 sm:w-12 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">No downloads yet</h2>
          <p className="text-sm text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto">
            When you download workflows, they&apos;ll appear here for easy access.
          </p>
          <Button asChild size="lg" className="px-6">
            <Link href="/">Discover Workflows</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by title or category..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="text-sm text-muted-foreground whitespace-nowrap">
              {filteredDownloads.length} workflow{filteredDownloads.length !== 1 ? "s" : ""}
            </div>
          </div>

          {filteredDownloads.length === 0 ? (
            <div className="text-center py-8 bg-muted/10 rounded-lg border border-dashed">
              <div className="flex justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No matching workflows</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try a different search term or clear your filter
              </p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredDownloads.map((download) => (
                <div 
                  key={download.id} 
                  className="flex flex-col sm:flex-row gap-4 border rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                >
                  <div className="w-full sm:w-28 h-32 sm:h-28 relative rounded-md overflow-hidden flex-shrink-0">
                    <Image
                      src={download.workflow.workflowImage}
                      alt={download.workflow.title}
                      fill
                      className="object-cover"
                    />
                    <Badge className="absolute top-2 right-2 bg-primary/80">
                      {download.workflow.category}
                    </Badge>
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <Link href={`/workflow/${download.workflow.slug}`} className="hover:text-primary block">
                      <h3 className="font-semibold text-lg line-clamp-1">{download.workflow.title}</h3>
                    </Link>
                    
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-6 h-6 rounded-full overflow-hidden bg-muted flex-shrink-0">
                        <Image 
                          src={download.workflow.author.profileImage} 
                          alt={download.workflow.author.firstName}
                          width={24}
                          height={24}
                        />
                      </div>
                      <span className="text-sm">
                        {download.workflow.author.firstName} {download.workflow.author.lastName}
                      </span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                      <Download className="h-4 w-4 mr-1.5" />
                      {formatDistanceToNow(new Date(download.downloadedAt), {
                        addSuffix: true,
                      })}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2 mt-4">
                      <WorkflowJsonDownloadButton
                        workflowContent={download.workflow.workFlowJson}
                        workflowId={download.id}
                        title={download.workflow.title}
                      />
                      
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/workflow/${download.workflow.slug}`}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          <span>View</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}