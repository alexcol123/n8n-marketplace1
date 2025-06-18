import { Button } from "@/components/ui/button";
import { OrderedWorkflowStep } from "@/utils/functions/WorkflowStepsInOrder";
import {
  FileText,
  Globe,
  Info,
  Plus,
  X,
  Flag,
  Edit3,
  Loader2,
  Upload,
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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
}: {
  step: OrderedWorkflowStep;
  onStepUpdated?: (updatedStep: Partial<OrderedWorkflowStep>) => void;
}) => {
  const router = useRouter();

  // State for form fields (removed stepImage from form state)
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

  // Listen for successful image updates
  useEffect(() => {
    const handleImageUpdate = (event: CustomEvent) => {
      if (event.detail.stepId === step.id && event.detail.success) {
        // Update the local state with the new image URL
        setStepImage(event.detail.imageUrl);

        // Also update the parent component if callback is provided
        if (onStepUpdated) {
          onStepUpdated({
            stepImage: event.detail.imageUrl,
          });
        }

        toast.success("Image updated successfully!");
      }
    };

    // Listen for the custom event
    window.addEventListener(
      "stepImageUpdated",
      handleImageUpdate as EventListener
    );

    // Cleanup
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
      // Filter out incomplete links before saving
      const validHelpLinks = helpLinks.filter(
        (link) => link.title.trim() && link.url.trim()
      );

      // Only save text fields, not image (image is handled separately)
      const result = await updateWorkflowStepAction(step.id, {
        stepTitle,
        stepDescription,
        helpText,
        helpLinks: validHelpLinks,
      });

      if (result.success) {
        toast.success(result.message);

        // Option 1: Update parent component with new data (if callback provided)
        if (onStepUpdated) {
          onStepUpdated({
            stepTitle,
            stepDescription,
            helpText,
            helpLinks: validHelpLinks,
          });
        }

        // Option 2: Force a router refresh to get fresh data from server
        router.refresh();

        // Close the dialog on success
        const closeButton = document.querySelector(
          "[data-dialog-close]"
        ) as HTMLButtonElement;
        if (closeButton) {
          closeButton.click();
        }
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

  // Use the current form state values for display instead of original step data
  const displayStepTitle = stepTitle || step.stepTitle;
  const displayStepDescription =
    stepDescription || (step.stepDescription as string);
  const displayHelpText = helpText || (step.helpText as string);
  const displayHelpLinks =
    helpLinks.length > 0 ? helpLinks : (step.helpLinks as HelpLink[]) || [];

  // Use stepImage state for current display, fallback to step.stepImage
  const currentStepImage = stepImage || step.stepImage;

  return (
    <Card className="border-2 border-orange-200 dark:border-orange-800 bg-white dark:bg-slate-950 mb-6 shadow-sm">
      <CardContent className="p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Flag className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Important Information
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Review the details below before proceeding
              </p>
            </div>
          </div>
          <Separator className="bg-orange-200 dark:bg-orange-800" />
        </div>

        {/* Step Description */}
        {displayStepDescription && (
          <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
              {displayStepDescription}
            </p>
          </div>
        )}

        {/* Step Image Section */}
        <div className="space-y-4">
          {currentStepImage ? (
            <div className="relative w-full max-w-md">
              <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                <Image
                  src={currentStepImage as string}
                  alt={(displayStepTitle as string) || "Step illustration"}
                  width={400}
                  height={0}
                  className="w-full h-auto object-cover"
                  sizes="400px"
                />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-md h-48 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-center">
              <div className="text-center space-y-2">
                <div className="mx-auto w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-slate-500 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    No image provided
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Add an image to help illustrate this step
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Text Section */}
        {displayHelpText && (
          <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center">
                  <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100 mb-2">
                  Additional Information
                </h4>
                <p className="text-sm text-amber-800 dark:text-amber-200 leading-relaxed">
                  {displayHelpText}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Help Links Section */}
        {displayHelpLinks && displayHelpLinks.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-slate-600 dark:text-slate-400" />
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Helpful Resources
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {displayHelpLinks.map((link: any, index: number) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-xs border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700"
                >
                  <Link
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    {link.title}
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        )}

        <Separator />

        {/* Update Section */}
        <div className="space-y-4 p-4 bg-orange-50/50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg relative">
          {/* Editable indicator */}
          <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 font-medium">
            <Edit3 className="h-3 w-3" />
            <span>Editable</span>
          </div>
          <h2 className="text-xl font-semibold text-center text-slate-900 dark:text-slate-100">
            Update Card
          </h2>

          {/* Image Update Section */}
          <div className="flex items-center justify-center">
            <ImageInputContainer
              image={currentStepImage as string}
              name={"image"}
              text="Change Image"
              stepId={step.id}
              action={updateWorkflowStepImageAction}
            />
          </div>

          {/* Edit Step Details Button */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white border-0"
                size="lg"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Step Details
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-orange-200 dark:border-orange-800 sm:max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader className="space-y-3">
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Flag className="h-5 w-5 text-orange-600" />
                  Edit Step Details
                </DialogTitle>
                <DialogDescription className="text-base">
                  Customize this workflow step to provide better guidance and
                  context for learners.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Step Title */}
                <div className="space-y-2">
                  <Label htmlFor="stepTitle" className="text-sm font-medium">
                    Step Title
                  </Label>
                  <Input
                    id="stepTitle"
                    value={stepTitle as string}
                    onChange={(e) => setStepTitle(e.target.value)}
                    placeholder="Enter a clear, descriptive title"
                    className="text-base"
                  />
                </div>

                {/* Step Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor="stepDescription"
                    className="text-sm font-medium"
                  >
                    Step Description
                  </Label>
                  <Textarea
                    id="stepDescription"
                    value={stepDescription}
                    onChange={(e) => setStepDescription(e.target.value)}
                    placeholder="Explain what this step accomplishes and any important details..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Help Text */}
                <div className="space-y-2">
                  <Label htmlFor="helpText" className="text-sm font-medium">
                    Additional Information
                  </Label>
                  <Textarea
                    id="helpText"
                    value={helpText}
                    onChange={(e) => setHelpText(e.target.value)}
                    placeholder="Provide helpful tips, troubleshooting advice, or important notes..."
                    rows={4}
                    className="resize-none"
                  />
                </div>

                {/* Help Links */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Helpful Resources
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addHelpLink}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      Add Link
                    </Button>
                  </div>

                  {helpLinks.length === 0 && (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                      <Globe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No resources added yet</p>
                      <p className="text-xs">
                        Add links to helpful documentation and tutorials
                      </p>
                    </div>
                  )}

                  <div className="space-y-3">
                    {helpLinks.map((link, index) => (
                      <div
                        key={index}
                        className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-900/50 space-y-3"
                      >
                        <div className="flex gap-3 items-end">
                          <div className="flex-1 space-y-2">
                            <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              Link Title
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
                          <div className="flex-1 space-y-2">
                            <Label className="text-xs font-medium text-slate-600 dark:text-slate-400">
                              URL
                            </Label>
                            <Input
                              value={link.url}
                              onChange={(e) =>
                                updateHelpLink(index, "url", e.target.value)
                              }
                              placeholder="https://docs.example.com"
                              type="url"
                              className="text-sm"
                            />
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeHelpLink(index)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-6 border-t border-slate-200 dark:border-slate-700">
                <DialogClose asChild>
                  <Button type="button" variant="outline" data-dialog-close>
                    Cancel
                  </Button>
                </DialogClose>

                <Button
                  type="button"
                  variant="default"
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditCardHelp;
