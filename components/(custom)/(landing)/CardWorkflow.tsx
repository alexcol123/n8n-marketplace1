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
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  Eye,
  Trash2,
  AlertTriangle,
  Edit,
  PlayCircle,
  VideoIcon,
  BookOpen,
  Plus,
  X,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { WorkflowCardTypes, StudentResource, StudentResourcesData } from "@/utils/types";
import {
  deleteWorkflowAction,
  updateWorkflowVideoAction,
  updateWorkflowStudentResourcesAction,
  getWorkflowStudentResourcesAction,
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
  canEditSteps?: boolean;
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
  
  // Student Resources states
  const [isResourcesDialogOpen, setIsResourcesDialogOpen] = useState(false);
  const [isLoadingResources, setIsLoadingResources] = useState(false);
  const [isSavingResources, setIsSavingResources] = useState(false);
  const [studentResources, setStudentResources] = useState<StudentResource[]>([]);
  
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


  // Get description from teaching guide or fallback to default
  const truncatedContent = workflows.WorkflowTeachingGuide?.whatYoullBuildSummary 
    || "Complete full-stack project with n8n automation backend and modern frontend. Perfect for building your portfolio and demonstrating real value to clients.";

  const workflowUrl = `/workflow/${workflows?.slug}`;

  // Load student resources when dialog opens
  const handleResourcesDialogOpen = async (open: boolean) => {
    setIsResourcesDialogOpen(open);
    
    if (open) {
      setIsLoadingResources(true);
      try {
        const result = await getWorkflowStudentResourcesAction(workflows.id);
        
        if (result.success && result.data?.studentResources) {
          const resourcesData = result.data.studentResources as StudentResourcesData;
          setStudentResources(resourcesData.resources || []);
        }
      } catch (error) {
        console.error("Error loading student resources:", error);
        toast.error("Failed to load student resources");
      } finally {
        setIsLoadingResources(false);
      }
    }
  };

  // Add a new resource
  const addNewResource = () => {
    const newResource: StudentResource = {
      name: "",
      url: "",
    };
    setStudentResources([...studentResources, newResource]);
  };

  // Update a resource
  const updateResource = (index: number, field: keyof StudentResource, value: string) => {
    const updated = [...studentResources];
    updated[index] = { ...updated[index], [field]: value };
    setStudentResources(updated);
  };

  // Remove a resource
  const removeResource = (index: number) => {
    setStudentResources(studentResources.filter((_, i) => i !== index));
  };

  // Save student resources
  const handleSaveResources = async () => {
    setIsSavingResources(true);
    
    try {
      const resourcesData: StudentResourcesData = {
        resources: studentResources,
      };
      
      const result = await updateWorkflowStudentResourcesAction(
        workflows.id,
        resourcesData
      );
      
      if (result.success) {
        toast.success("Student resources updated successfully!");
        setIsResourcesDialogOpen(false);
      } else {
        toast.error(result.message || "Failed to update student resources");
      }
    } catch (error) {
      console.error("Error saving student resources:", error);
      toast.error("Failed to save student resources");
    } finally {
      setIsSavingResources(false);
    }
  };

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
        className="max-w-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 border border-primary/20 hover:border-primary/40 pt-0 group bg-gradient-to-b from-card to-card/80 backdrop-blur-sm"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link href={workflowUrl}>
          <div className="relative overflow-hidden h-80 rounded-t-lg">
            <div
              className={`absolute inset-0 bg-cover bg-center transition-transform duration-700 ${
                isHovered ? "scale-110" : "scale-100"
              }`}
              style={{
                backgroundImage: `url(${
                  workflows.creationImage
                    ? workflows.creationImage
                    : workflows.workflowImage
                })`,
              }}
            />
            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
            
            {/* Floating elements */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />


            {/* View count badge - redesigned */}
            <div className="absolute top-4 right-4">
              <Badge
                variant="outline"
                className="bg-black/60 text-white border-white/30 backdrop-blur-md transition-all duration-300 group-hover:bg-black/80"
              >
                <Eye className="h-3 w-3 mr-1.5" />
                <span className="font-medium">{workflows.viewCount || 0}</span>
              </Badge>
            </div>

            {/* Build Now overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-6">
              <div className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full backdrop-blur-sm transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 font-semibold text-lg shadow-xl">
                Build Now
              </div>
            </div>
          </div>
        </Link>

        <CardHeader className="pb-3 pt-6">
          <Link href={workflowUrl}>
            <CardTitle className="text-xl font-bold line-clamp-2 text-foreground hover:text-primary transition-colors duration-300 group-hover:text-primary leading-tight">
              {workflows?.title.replace(/^"(.+)"$/, "$1")}
            </CardTitle>
          </Link>
        </CardHeader>

        <CardContent className="space-y-4">
          <CardDescription className="text-base text-muted-foreground leading-relaxed line-clamp-3">
            {truncatedContent}
          </CardDescription>

          {/* Project metadata */}
          <div className="flex items-center justify-between pt-3">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-xs font-medium px-2 py-1">
                Full-Stack Project
              </Badge>
              <Badge variant="secondary" className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                Portfolio Ready
              </Badge>
            </div>
            
            <div className="flex items-center text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
              <CalendarIcon className="mr-1.5 h-3 w-3" />
              <span className="font-medium">{formatDate(workflows?.createdAt)}</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-2 pb-6">
          <div className="w-full space-y-4">

            {/* Creator Actions Section */}
            {canDelete && (
              <div>
                <Separator className="mt-8" />
                <div className="space-y-4 mt-4 bg-gradient-to-br from-muted/40 to-muted/70 border border-primary/15 p-4 rounded-2xl shadow-sm backdrop-blur-sm">
                  {/* Header with Creator Actions */}
                  <div className="text-center pb-1">
                    <div className="inline-flex items-center gap-2 bg-primary/15 px-4 py-2 rounded-full border border-primary/25 shadow-sm">
                      <Edit className="h-4 w-4 text-primary" />
                      <h5 className="text-xs font-bold text-primary uppercase tracking-wider">
                        Creator Actions
                      </h5>
                    </div>
                  </div>

                  {/* Management Actions */}
                  <div className="space-y-3">
                    <div className="text-center">
                      <h6 className="text-xs font-semibold text-muted-foreground/80 uppercase tracking-wider">
                        Quick Actions
                      </h6>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {/* Update Video Button */}
                      <Dialog
                        open={isUpdateDialogOpen}
                        onOpenChange={handleUpdateDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/50 bg-background/80 backdrop-blur-sm border border-blue-200 dark:border-blue-800/50 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <VideoIcon className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Add Video</span>
                            <span className="sm:hidden">Video</span>
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
                            className="h-10 text-xs font-medium text-destructive hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50 bg-background/80 backdrop-blur-sm border border-red-200 dark:border-red-800/50 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            <span className="hidden sm:inline">Delete</span>
                            <span className="sm:hidden">Remove</span>
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>

                    {/* Student Resources Button - Full Width */}
                    <Dialog
                      open={isResourcesDialogOpen}
                      onOpenChange={handleResourcesDialogOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-10 text-xs font-medium text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/50 bg-background/80 backdrop-blur-sm border border-green-200 dark:border-green-800/50 shadow-sm transition-all duration-200 hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <BookOpen className="h-4 w-4 mr-2" />
                          <span>Student Resources</span>
                        </Button>
                      </DialogTrigger>
                    </Dialog>
                  </div>

     

                  {/* Quick Stats Footer */}
                  <div className="pt-3 border-t border-primary/15">
                    <div className="flex items-center justify-between text-xs text-muted-foreground/70">
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-background/50 rounded-full">
                        <Eye className="h-3 w-3" />
                        <span className="font-medium">
                          {workflows.viewCount || 0} views
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-background/50 rounded-full">
                        <CalendarIcon className="h-3 w-3" />
                        <span className="font-medium">
                          {formatDate(workflows.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
          </div>
            )}
          </div>
        </CardFooter>
      </Card>

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
                Enhance your workflow with a comprehensive video tutorial to
                help others understand and follow your process step-by-step.
                This makes your workflow more accessible and valuable to the
                community.
              </DialogDescription>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-8">
            <div className="space-y-3">
              <Label
                htmlFor="videoUrl"
                className="text-sm font-semibold text-foreground flex items-center gap-2"
              >
                <PlayCircle className="h-4 w-4 text-primary" />
                YouTube Video URL
              </Label>
              <div className="relative">
                <Input
                  id="videoUrl"
                  value={updateFormData.videoUrl}
                  onChange={(e) =>
                    handleInputChange("videoUrl", e.target.value)
                  }
                  placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ or https://youtu.be/dQw4w9WgXcQ"
                  disabled={isUpdating}
                  className="h-12 pl-4 pr-4 text-base border-2 focus:border-primary transition-colors rounded-xl"
                />
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 p-4 rounded-lg">
                <p className="text-sm text-blue-700 dark:text-blue-300 flex items-start gap-2">
                  <PlayCircle className="h-4 w-4 flex-shrink-0 mt-0.5 text-blue-600" />
                  <span>
                    <strong>YouTube URLs only:</strong> Adding a YouTube video
                    tutorial makes your workflow significantly more engaging and
                    easier to follow. Paste a valid YouTube URL (youtube.com or
                    youtu.be) to embed the video directly into your workflow
                    page.
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
                  {workflows?.title.replace(/^"(.+)"$/, "$1")}
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
                    This will permanently delete the workflow, its JSON data,
                    and all associated images. All content will be lost forever.
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

      {/* Student Resources Dialog */}
      <Dialog open={isResourcesDialogOpen} onOpenChange={handleResourcesDialogOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto border-primary border-4 md:py-8 md:px-8">
          <DialogHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                Student Resources
              </DialogTitle>
              <DialogDescription className="text-base text-muted-foreground">
                Add helpful resources for students - templates, sample data, documentation, and learning materials
              </DialogDescription>
            </div>
          </DialogHeader>

          {isLoadingResources ? (
            <div className="flex items-center justify-center py-12">
              <div className="h-8 w-8 border-3 border-primary border-r-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-6 py-6">
              {/* Resources List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-semibold">Resources</Label>
                  <Button
                    onClick={addNewResource}
                    size="sm"
                    variant="outline"
                    className="h-8"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Resource
                  </Button>
                </div>

                {studentResources.length === 0 ? (
                  <div className="text-center py-8 bg-muted/50 rounded-lg border-2 border-dashed">
                    <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                    <p className="text-muted-foreground">No resources added yet</p>
                    <p className="text-sm text-muted-foreground mt-1">Click "Add Resource" to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {studentResources.map((resource, index) => (
                      <div key={index} className="p-4 bg-muted/30 rounded-lg border space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                            <div>
                              <Label className="text-xs">Resource Name</Label>
                              <Input
                                value={resource.name}
                                onChange={(e) => updateResource(index, "name", e.target.value)}
                                placeholder="e.g., Sample Inventory Sheet"
                                className="h-9 mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-xs">Resource URL</Label>
                              <Input
                                value={resource.url}
                                onChange={(e) => updateResource(index, "url", e.target.value)}
                                placeholder="https://docs.google.com/spreadsheets/..."
                                className="h-9 mt-1"
                              />
                            </div>
                          </div>
                          <Button
                            onClick={() => removeResource(index)}
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsResourcesDialogOpen(false)}
              disabled={isSavingResources}
              className="flex-1 h-12 text-base font-medium border-2 hover:border-primary transition-colors rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveResources}
              disabled={isSavingResources}
              className="flex-1 h-12 text-base font-medium bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-xl gap-2"
            >
              {isSavingResources ? (
                <>
                  <div className="h-5 w-5 border-2 border-current border-r-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4" />
                  Save Resources
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
