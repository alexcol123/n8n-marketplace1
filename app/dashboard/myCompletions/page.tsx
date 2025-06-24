// app/dashboard/mycompletions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { fetchUserCompletions, removeWorkflowCompletion } from "@/utils/actions";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  ArrowLeft, 
  Trophy,
  RotateCcw,
  Award
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface WorkflowCompletion {
  id: string;
  workflowId: string;
  userId: string;
  completedAt: string | Date;
  workflow: {
    id: string;
    title: string;
    category: string;
    slug: string;
    workflowImage: string;
    creationImage?: string | null;
    author: {
      firstName: string;
      lastName: string;
    };
  };
}

export default function MyCompletionsPage() {
  const [completions, setCompletions] = useState<WorkflowCompletion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);

  // Fetch completions when component mounts
  useEffect(() => {
    const getCompletions = async () => {
      setIsLoading(true);
      try {
        const result = await fetchUserCompletions();
        
        if (Array.isArray(result)) {
          setCompletions(result as WorkflowCompletion[]);
        } else {
          console.error("Unexpected response format:", result);
        }
      } catch (error) {
        console.error("Error fetching completions:", error);
        toast.error("Failed to load completed workflows");
      } finally {
        setIsLoading(false);
      }
    };
    
    getCompletions();
  }, []);
  
  // Filter completions by title or category
  const filteredCompletions = completions.filter(completion => {
    const title = completion.workflow.title.toLowerCase();
    const category = completion.workflow.category.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return title.includes(search) || category.includes(search);
  });

  console.log("Filtered Completions:", filteredCompletions);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  // Handle removing completion
  const handleRemoveCompletion = async (workflowId: string,) => {
    setRemovingId(workflowId);
    
    try {
      const result = await removeWorkflowCompletion(workflowId);
      
      if (result.success) {
        // Remove from local state
        setCompletions(prev => prev.filter(completion => completion.workflowId !== workflowId));
        toast.success(result.message);
      } else {
        toast.error(result.message || "Failed to remove completion");
      }
    } catch (error) {
      console.error("Error removing completion:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setRemovingId(null);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Trophy className="h-8 w-8 text-primary" />
            My Completed Tutorials
          </h1>
          <p className="text-muted-foreground mt-1">
            Track your learning progress and revisit completed workflows
          </p>
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
      ) : completions.length === 0 ? (
        <div className="text-center py-8 sm:py-12 bg-card rounded-lg border p-4 sm:p-8 shadow-sm">
          <div className="bg-primary/10 rounded-full p-4 sm:p-6 mx-auto w-16 sm:w-24 h-16 sm:h-24 flex items-center justify-center mb-4 sm:mb-6">
            <Award className="h-8 sm:h-12 w-8 sm:w-12 text-primary" />
          </div>
          <h2 className="text-xl sm:text-2xl font-medium mb-2 sm:mb-3">No completed tutorials yet</h2>
          <p className="text-sm text-muted-foreground mb-6 sm:mb-8 max-w-md mx-auto">
            Start learning by exploring workflows and marking them as completed when you finish implementing them.
          </p>
          <Button asChild size="lg" className="px-6">
            <Link href="/">Start Learning</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search completed tutorials..."
                className="pl-10"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {filteredCompletions.length} completed tutorial{filteredCompletions.length !== 1 ? "s" : ""}
              </div>
              <Badge variant="secondary" className="gap-1">
                <Trophy className="h-3 w-3" />
                {completions.length} Total
              </Badge>
            </div>
          </div>

          {filteredCompletions.length === 0 ? (
            <div className="text-center py-8 bg-muted/10 rounded-lg border border-dashed">
              <div className="flex justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No matching tutorials</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Try a different search term or clear your filter
              </p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCompletions.map((completion) => (
                <div 
                  key={completion.id} 
                  className="border rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200 bg-gradient-to-r from-green-50/50 to-transparent dark:from-green-950/20"
                >
                  {/* Top Section - Image and Content */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-4">
                    <div className="w-full sm:w-28 h-32 sm:h-28 relative rounded-md overflow-hidden flex-shrink-0">
                      <Image
                        src={completion.workflow.creationImage ? completion.workflow.creationImage : completion.workflow.workflowImage}   
                        alt={completion.workflow.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-2 right-2 bg-primary/80">
                        {completion.workflow.category}
                      </Badge>
                      <div className="absolute bottom-2 left-2">
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="flex-grow min-w-0">
                      <Link href={`/workflow/${completion.workflow.slug}`} className="hover:text-primary block">
                        <h3 className="font-semibold text-lg line-clamp-1">{completion.workflow.title}</h3>
                      </Link>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm text-muted-foreground">
                          by {completion.workflow.author.firstName} {completion.workflow.author.lastName}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-green-600 mt-2 font-medium">
                        <CheckCircle2 className="h-4 w-4 mr-1.5" />
                        Completed {formatDistanceToNow(new Date(completion.completedAt), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                  </div>
                  
                  {/* Bottom Section - Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border/50">
                    <Button variant="outline" size="sm" asChild className="flex-1">
                      <Link href={`/workflow/${completion.workflow.slug}`}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        <span>Revisit</span>
                      </Link>
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={removingId === completion.workflowId}
                          className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 border-orange-200 flex-1"
                        >
                          {removingId === completion.workflowId ? (
                            <div className="h-4 w-4 mr-2 border-2 border-current border-r-transparent rounded-full animate-spin" />
                          ) : (
                            <RotateCcw className="h-4 w-4 mr-2" />
                          )}
                          <span>Mark Incomplete</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <RotateCcw className="h-5 w-5 text-orange-500" />
                            Mark as Incomplete
                          </DialogTitle>
                          <DialogDescription>
                            Are you sure you want to remove the completion status for{" "}
                            <span className="font-medium">&quot;{completion.workflow.title}&quot;</span>?
                            <br />
                            <br />
                            This will remove it from your completed tutorials list.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogTrigger>
                          <DialogTrigger asChild>
                            <Button
                              variant="secondary"
                              onClick={() => handleRemoveCompletion(completion.workflowId)}
                              disabled={removingId === completion.workflowId}
                              className="gap-2"
                            >
                              {removingId === completion.workflowId ? (
                                <>
                                  <div className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                                  Removing...
                                </>
                              ) : (
                                <>
                                  <RotateCcw className="h-4 w-4" />
                                  Mark Incomplete
                                </>
                              )}
                            </Button>
                          </DialogTrigger>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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