"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, CalendarIcon, Eye, Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { WorkflowCardTypes } from "@/utils/types";
import { deleteWorkflowAction } from "@/utils/actions";
import { useRouter } from "next/navigation";
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

interface CardWorkflowProps {
  workflows: WorkflowCardTypes;
  canDelete?: boolean;
  onDeleteWorkflow?: (id: string) => Promise<void>;
}

export default function CardWorkflow({
  workflows,
  canDelete = false,
  onDeleteWorkflow
}: CardWorkflowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  // Format date to readable string
  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Get author's initials for avatar fallback
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };

  // Extract first name and truncate content
  const truncatedContent =
    workflows?.content?.length > 120
      ? `${workflows.content.substring(0, 120)}...`
      : workflows?.content;

  const workflowUrl = `/workflow/${workflows?.slug}`;

  // Handle delete workflow
  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Call the server action directly
      const result = await deleteWorkflowAction({} as Record<string, unknown>, {
        workflowId: workflows.id
      });
      
      if (result.success) {
        // Close the dialog
        setIsDialogOpen(false);
        
        // Show success toast
        toast.success(result.message);
        
        // If onDeleteWorkflow callback is provided, call it
        if (onDeleteWorkflow) {
          await onDeleteWorkflow(workflows.id);
        } else {
          // Otherwise refresh the page to show updated list
          router.refresh();
        }
      } else {
        // Show error toast
        toast.error(result.message || "Failed to delete workflow");
      }
    } catch (error) {
      console.error("Error deleting workflow:", error);
      toast.error("An unexpected error occurred while deleting the workflow");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Card
        className="max-w-md overflow-hidden transition-all duration-300 hover:shadow-lg border-primary/10 pt-0 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={workflowUrl}>
          <div className="relative overflow-hidden h-60">
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-500 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              style={{
                backgroundImage: `url(${workflows?.workflowImage})`,
              }}
            />
            {/* Improved gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Category badge with improved positioning */}
            <div className="absolute bottom-4 left-4">
              <Badge
                variant="secondary"
                className="bg-primary text-primary-foreground hover:bg-primary/90 font-medium px-3 py-1 shadow-md transition-all duration-300 group-hover:translate-y-[-2px]"
              >
                {workflows?.category}
              </Badge>
            </div>

            {/* View count badge - Added */}
            <div className="absolute top-4 right-4">
              <Badge
                variant="outline"
                className="bg-black/50 text-white border-transparent backdrop-blur-sm"
              >
                <Eye className="h-3 w-3 mr-1" />
                {workflows.viewCount || 0}
              </Badge>
            </div>
          </div>
        </Link>

        <CardHeader className="pb-2 pt-4">
          <Link href={workflowUrl}>
            <CardTitle className="text-xl font-bold line-clamp-2 text-foreground hover:text-primary transition-colors group-hover:text-primary">
              {workflows?.title.replace(/^"(.+)"$/, "$1")}
            </CardTitle>
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">
          <CardDescription className="text-sm text-muted-foreground/90 line-clamp-3">
            {truncatedContent}
          </CardDescription>

          <div className="flex items-center justify-between pt-2 group ">
            <Link href={`/authors/${workflows.author.username}`
            } className="flex items-center space-x-2 border border-muted p-1 rounded hover:border-primary">
              <Avatar className="h-8 w-8 border border-primary/10 ">
                <AvatarImage
                  src={workflows?.author?.profileImage}
                  alt={`${workflows?.author?.firstName} ${workflows?.author?.lastName}`}
                />
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(
                    workflows?.author?.firstName,
                    workflows?.author?.lastName
                  )}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-foreground">
                {workflows?.author?.firstName} {workflows?.author?.lastName}
              </span>
            </Link>

            <div className="flex items-center text-xs text-muted-foreground">
              <CalendarIcon className="mr-1 h-3 w-3" />
              <span>{formatDate(workflows?.author?.createdAt)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-0 pb-4">
          <div className="w-full flex justify-between items-center">
            {canDelete && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-destructive hover:text-destructive-foreground hover:bg-destructive border-destructive/20 hover:border-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </DialogTrigger>
              </Dialog>
            )}
            
            <div className={canDelete ? "ml-auto" : "w-full flex justify-end"}>
              <Link href={workflowUrl} className="flex items-center">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-primary hover:text-white hover:bg-primary h-auto px-3 py-1.5 rounded-full transition-all duration-300 group-hover:bg-primary/90 border-primary/20 group-hover:border-primary"
                >
                  View workflow{" "}
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Confirm Workflow Deletion
            </DialogTitle>
            <DialogDescription className="pt-2">
              Are you sure you want to delete <span className="font-medium text-foreground">&quot;{workflows?.title.replace(/^"(.+)"$/, "$1")}&quot;</span>?
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-muted/50 p-4 rounded-md border border-border my-2">
            <p className="text-sm text-destructive flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
              <span>This action <strong>cannot be undone</strong>. This will permanently delete the workflow, its JSON data, and its associated images.</span>
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              variant="ghost"
              onClick={() => setIsDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="gap-2"
            >
              {isDeleting ? (
                <>
                  <span className="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4" />
                  Delete Workflow
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}