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
import {
  ArrowRight,
  CalendarIcon,
  Eye,
  Trash2,
  AlertTriangle,
  Edit,
  PlayCircle,
  VideoIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { WorkflowCardTypes } from "@/utils/types";
import {
  deleteWorkflowAction,
  updateWorkflowVideoAction,
} from "@/utils/actions";
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
  onUpdateWorkflow?: (
    id: string,
    data: { title: string; videoUrl: string }
  ) => Promise<void>;
}

export default function CardWorkflow({
  workflows,
  canDelete = false,
  onDeleteWorkflow,
  onUpdateWorkflow,
}: CardWorkflowProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateFormData, setUpdateFormData] = useState({
    title: workflows?.title?.replace(/^"(.+)"$/, "$1") || "",
    videoUrl: workflows?.videoUrl || "",
  });
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
        workflowId: workflows.id,
      });

      if (result.success) {
        // Close the dialog
        setIsDeleteDialogOpen(false);

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

  // Handle update workflow video
  const handleUpdate = async () => {
    try {
      setIsUpdating(true);

      // Validate YouTube URL if provided
      if (updateFormData.videoUrl.trim()) {
        const youtubeRegex =
          /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)/;

        if (!youtubeRegex.test(updateFormData.videoUrl.trim())) {
          toast.error(
            "Please provide a valid YouTube URL (youtube.com or youtu.be)"
          );
          return;
        }
      }

      // Call the server action directly
      const result = await updateWorkflowVideoAction(
        {} as Record<string, unknown>,
        {
          workflowId: workflows.id,
          videoUrl: updateFormData.videoUrl.trim(),
        }
      );

      if (result.success) {
        // Close the dialog
        setIsUpdateDialogOpen(false);

        // Show success toast
        toast.success(result.message);

        // If onUpdateWorkflow callback is provided, call it
        if (onUpdateWorkflow) {
          await onUpdateWorkflow(workflows.id, {
            title: workflows.title, // Keep existing title
            videoUrl: updateFormData.videoUrl.trim(),
          });
        } else {
          // Otherwise refresh the page to show updated list
          router.refresh();
        }
      } else {
        // Show error toast
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error updating workflow video:", error);
      toast.error("An unexpected error occurred while updating the video");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (field: string, value: string) => {
    setUpdateFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset form when dialog opens
  const handleUpdateDialogOpen = (open: boolean) => {
    if (open) {
      setUpdateFormData({
        title: workflows?.title?.replace(/^"(.+)"$/, "$1") || "",
        videoUrl: workflows?.videoUrl || "",
      });
    }
    setIsUpdateDialogOpen(open);
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
            <Link
              href={`/authors/${workflows.author.username}`}
              className="flex items-center space-x-2 border border-muted p-1 rounded hover:border-primary"
            >
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
          <div className="w-full space-y-3">
            {/* View Workflow Button */}
            <div className="w-full flex justify-end">
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

            {/* Actions Section */}
            {canDelete && (
              <div className="space-y-4">
                <Separator decorative className="bg-primary/30 mt-8" />
                <h5 className="text-center text-sm font-medium text-muted-foreground">
                  Actions
                </h5>

                <div className="flex gap-3 justify-center px-2">
                  {/* Update Workflow Button */}
                  <Dialog
                    open={isUpdateDialogOpen}
                    onOpenChange={handleUpdateDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 bg-card border-2 border-blue-200 dark:border-blue-800/50 shadow-sm transition-all duration-200"
                      >
                        <VideoIcon className="h-4 w-4 mr-2" />
                        Add Video
                      </Button>
                    </DialogTrigger>
                  </Dialog>

                  {/* Delete Workflow Button */}
                  <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 text-destructive hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 bg-card border-2 border-red-200 dark:border-red-800/50 shadow-sm transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </div>
            )}
          </div>
        </CardFooter>
      </Card>




{/* Update Workflow Dialog */}
      {/* <Dialog open={isUpdateDialogOpen} onOpenChange={handleUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md border-primary border-4 md:py-20 md:px-8">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Edit className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                Update Video
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Enhance your workflow with a video tutorial to help others follow along.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-8">
            <div className="space-y-3">
              <Label htmlFor="videoUrl" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-primary" />
                Video URL
              </Label>
              <div className="relative">
                <Input
                  id="videoUrl"
                  value={updateFormData.videoUrl}
                  onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  disabled={isUpdating}
                  className="h-12 pl-4 pr-4 text-base border-2 focus:border-primary transition-colors rounded-xl"
                />
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                  <PlayCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-600" />
                  <span>
                    Adding a video tutorial makes your workflow more engaging and easier to follow. 
                    Paste a YouTube URL to embed the video.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsUpdateDialogOpen(false)}
              disabled={isUpdating}
              className="flex-1 h-12 text-base font-medium border-2 hover:border-primary transition-colors rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="h-5 w-5 border-2 border-current border-r-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Update Workflow
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}

      {/* Delete Confirmation Dialog */}
      {/* <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md border-primary border-4 md:py-20 md:px-8">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                Delete Workflow
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  &quot;{workflows?.title.replace(/^"(.+)"$/, "$1")}&quot;
                </span>
                ?
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="py-6">
            <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 border-2 border-red-200 dark:border-red-800/50 p-6 rounded-xl">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 text-base">
                    This action cannot be undone
                  </h4>
                  <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
                    This will permanently delete the workflow, its JSON data, and all 
                    associated images. All content will be lost forever.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="flex-1 h-12 text-base font-medium border-2 hover:border-primary transition-colors rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="h-5 w-5 border-2 border-current border-r-transparent rounded-full animate-spin" />
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
      </Dialog> */}

{/* Update Workflow Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={handleUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md border-primary border-4 md:py-20 md:px-8">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Edit className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                Update Workflow
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Enhance your workflow with a comprehensive video tutorial to help others understand and follow your process step-by-step. This makes your workflow more accessible and valuable to the community.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-8">
            <div className="space-y-3">
              <Label htmlFor="videoUrl" className="text-sm font-semibold text-foreground flex items-center gap-2">
                <PlayCircle className="h-4 w-4 text-primary" />
                YouTube Video URL
              </Label>
              <div className="relative">
                <Input
                  id="videoUrl"
                  value={updateFormData.videoUrl}
                  onChange={(e) => handleInputChange("videoUrl", e.target.value)}
                  placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ"
                  disabled={isUpdating}
                  className="h-12 pl-4 pr-4 text-base border-2 focus:border-primary transition-colors rounded-xl"
                />
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                  <PlayCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-600" />
                  <span>
                    <strong>YouTube URLs only:</strong> Adding a YouTube video tutorial makes your workflow significantly more engaging and easier to follow. 
                    Paste a valid YouTube URL (youtube.com or youtu.be) to embed the video directly into your workflow page.
                  </span>
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsUpdateDialogOpen(false)}
              disabled={isUpdating}
              className="flex-1 h-12 text-base font-medium border-2 hover:border-primary transition-colors rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl gap-2"
            >
              {isUpdating ? (
                <>
                  <div className="h-5 w-5 border-2 border-current border-r-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Update Workflow
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md border-primary border-4 md:py-20 md:px-8">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
              <AlertTriangle className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                Delete Workflow
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-foreground">
                  "{workflows?.title.replace(/^"(.+)"$/, "$1")}"
                </span>
                ?
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="py-6">
            <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/30 border-2 border-red-200 dark:border-red-800/50 p-6 rounded-xl">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-white" />
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-red-800 dark:text-red-200 text-base">
                    This action cannot be undone
                  </h4>
                  <p className="text-red-700 dark:text-red-300 text-sm leading-relaxed">
                    This will permanently delete the workflow, its JSON data, and all 
                    associated images. All content will be lost forever.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
              className="flex-1 h-12 text-base font-medium border-2 hover:border-primary transition-colors rounded-xl"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl gap-2"
            >
              {isDeleting ? (
                <>
                  <div className="h-5 w-5 border-2 border-current border-r-transparent rounded-full animate-spin" />
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
