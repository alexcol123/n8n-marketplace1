import { Button } from "@/components/ui/button";

import { OrderedWorkflowStep } from "@/utils/functions/WorkflowStepsInOrder";
import {
  Globe,
  Plus,
  BookOpen,
  Edit,
  Loader2,
  ExternalLink,
  Save,
  Lightbulb,
  Link as LinkIcon,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  updateWorkflowStepAction,
  updateWorkflowStepImageAction,
} from "@/utils/actions";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import Link from "next/link";
import Image from "next/image";
import ImageInputContainer from "../(dashboard)/Form/ImageInputContainer";

interface HelpLink {
  title: string;
  url: string;
}

const EditCardHelp = ({
  step,
  onStepUpdated,
  canEditSteps = false,
}: {
  step: OrderedWorkflowStep;
  onStepUpdated?: (updatedStep: Partial<OrderedWorkflowStep>) => void;
  canEditSteps: boolean;
}) => {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);

  // Form state
  const [stepTitle, setStepTitle] = useState(step.stepTitle || "");
  const [stepDescription, setStepDescription] = useState(
    (step.stepDescription as string) || ""
  );
  const [stepImage, setStepImage] = useState(step.stepImage || "");
  const [helpText, setHelpText] = useState((step.helpText as string) || "");
  const [helpLinks, setHelpLinks] = useState<HelpLink[]>(
    (step.helpLinks as HelpLink[]) || []
  );
  const [isLoading, setIsLoading] = useState(false);

  // Listen for image updates
  useEffect(() => {
    const handleImageUpdate = (event: CustomEvent) => {
      if (event.detail.stepId === step.id && event.detail.success) {
        setStepImage(event.detail.imageUrl);
        if (onStepUpdated) {
          onStepUpdated({ stepImage: event.detail.imageUrl });
        }
        toast.success("Image updated successfully!");
      }
    };

    window.addEventListener(
      "stepImageUpdated",
      handleImageUpdate as EventListener
    );
    return () => {
      window.removeEventListener(
        "stepImageUpdated",
        handleImageUpdate as EventListener
      );
    };
  }, [step.id, onStepUpdated]);

  const addHelpLink = () => {
    setHelpLinks([...helpLinks, { title: "", url: "" }]);
  };

  const removeHelpLink = (index: number) => {
    setHelpLinks(helpLinks.filter((_, i) => i !== index));
  };

  const updateHelpLink = (
    index: number,
    field: "title" | "url",
    value: string
  ) => {
    const updatedLinks = helpLinks.map((link, i) =>
      i === index ? { ...link, [field]: value } : link
    );
    setHelpLinks(updatedLinks);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const validHelpLinks = helpLinks.filter(
        (link) => link.title.trim() && link.url.trim()
      );

      const result = await updateWorkflowStepAction(step.id, {
        stepTitle,
        stepDescription,
        helpText,
        helpLinks: validHelpLinks,
      });

      if (result.success) {
        toast.success("Tutorial updated successfully!");
        if (onStepUpdated) {
          onStepUpdated({
            stepTitle,
            stepDescription,
            helpText,
            helpLinks: validHelpLinks,
          });
        }
        router.refresh();
        setIsEditMode(false);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error saving step:", error);
      toast.error("Failed to save changes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStepTitle(step.stepTitle || "");
    setStepDescription((step.stepDescription as string) || "");
    setHelpText((step.helpText as string) || "");
    setHelpLinks((step.helpLinks as HelpLink[]) || []);
  };

  const handleCancel = () => {
    resetForm();
    setIsEditMode(false);
  };

  const displayTitle = String(stepTitle || step.stepTitle || "Untitled Step");
  const displayDescription =
    stepDescription || (step.stepDescription as string) || "";
  const displayHelpText = helpText || (step.helpText as string) || "";
  const displayHelpLinks =
    helpLinks.length > 0 ? helpLinks : (step.helpLinks as HelpLink[]) || [];
  const currentImage = stepImage || step.stepImage;

  return (
    <Card className="group relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all duration-300">
      {/* Header */}
      <CardHeader className="relative pb-3">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
            <BookOpen className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white leading-tight">
              {displayTitle}
            </h3>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Description */}
        {displayDescription && (
          <div className="prose prose-sm max-w-none border p-3 rounded-lg bg-muted">
            <p className="text-slate-900 dark:text-slate-100 leading-relaxed">
              {displayDescription}
            </p>
          </div>
        )}

        {/* Image Section */}
        <div className="space-y-3">
          {typeof currentImage === "string" && currentImage && (
            <div className="relative">
              <div className="overflow-hidden  max-w-2xl mx-auto rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-sm">
                <Image
                  src={currentImage}
                  alt={String(displayTitle)}
                  width={800}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        {displayHelpText && (
          <div className="p-4 bg-primary/20 border border-amber-200 dark:border-slate-600 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <Lightbulb className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-amber-900 dark:text-slate-200 mb-2">
                  Pro Tips
                </h4>
                <p className="text-sm text-amber-800 dark:text-slate-300 leading-relaxed">
                  {displayHelpText}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Links */}
        {displayHelpLinks && displayHelpLinks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center  justify-center mt-12 gap-2">
              <LinkIcon className="h-4 w-4 text-slate-600 dark:text-slate-100" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 ">
                Additional Resources (click to visit)
              </h4> 
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {displayHelpLinks.map((link: any, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  asChild
                  className="justify-start h-auto p-3 border-blue-200 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-800 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 group/link"
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="no-underline hover:no-underline"
                  >
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover/link:bg-blue-100 dark:group-hover/link:bg-blue-900 transition-colors">
                        <Globe className="h-4 w-4 text-slate-600 dark:text-slate-400 group-hover/link:text-blue-600 dark:group-hover/link:text-blue-400" />
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                          {link.title}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-200 truncate">
                          {link.url}
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-slate-400 group-hover/link:text-blue-500 transition-colors" />
                    </div>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}

        {canEditSteps && (
          <div>
            {/* Edit Mode Toggle */}
            {!isEditMode && (
              <div className="pt-4 border-t border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageInputContainer
                      image={currentImage as string}
                      name="image"
                      text="Update Image"
                      stepId={step.id}
                      action={updateWorkflowStepImageAction}
                    />
                  </div>
                  <Button
                    variant="default"
                    onClick={() => setIsEditMode(true)}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-sm"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Details
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>

      {/* Edit Mode Dialog */}
      <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Tutorial Step
            </DialogTitle>
            <DialogDescription>
              Customize this tutorial step to provide better guidance and
              context.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Step Title
              </Label>
              <Input
                id="title"
                value={stepTitle}
                onChange={(e) => setStepTitle(e.target.value)}
                placeholder="Enter a clear, descriptive title"
                className="text-base"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Step Description
              </Label>
              <Textarea
                id="description"
                value={stepDescription}
                onChange={(e) => setStepDescription(e.target.value)}
                placeholder="Explain what this step teaches or accomplishes..."
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Help Text */}
            <div className="space-y-2">
              <Label htmlFor="helpText" className="text-sm font-medium">
                Pro Tips & Additional Info
              </Label>
              <Textarea
                id="helpText"
                value={helpText}
                onChange={(e) => setHelpText(e.target.value)}
                placeholder="Share helpful tips, troubleshooting advice, or important notes..."
                rows={3}
                className="resize-none"
              />
            </div>

            {/* Help Links */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  Learning Resources
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addHelpLink}
                  className="h-8"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Resource
                </Button>
              </div>

              {helpLinks.length === 0 ? (
                <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
                  No resources added yet. Click "Add Resource" to include
                  helpful links.
                </div>
              ) : (
                <div className="space-y-3">
                  {helpLinks.map((link, index) => (
                    <div
                      key={index}
                      className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          Resource #{index + 1}
                        </h4>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeHelpLink(index)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            Title
                          </Label>
                          <Input
                            value={link.title}
                            onChange={(e) =>
                              updateHelpLink(index, "title", e.target.value)
                            }
                            placeholder="e.g., Official Documentation"
                            className="text-sm"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                            URL
                          </Label>
                          <Input
                            value={link.url}
                            onChange={(e) =>
                              updateHelpLink(index, "url", e.target.value)
                            }
                            placeholder="https://example.com"
                            type="url"
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="pt-6 border-t border-slate-200 dark:border-slate-600">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default EditCardHelp;
