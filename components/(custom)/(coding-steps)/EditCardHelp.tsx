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

  // State for form fields
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
    window.addEventListener('stepImageUpdated', handleImageUpdate as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('stepImageUpdated', handleImageUpdate as EventListener);
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
    <Card className="border-primary border-4 bg-black/90 mb-6 shadow-lg">
      <CardContent className="p-6 space-y-6">
        {/* Simple Important Header */}
        <div>
          <h3 className="text-lg font-semibold text-amber-700 dark:text-amber-300 flex items-center gap-2 mb-3">
            <Flag className="h-5 w-5 text-red-500 fill-red-500" />
            Important Information
          </h3>
          <div className="h-1 w-56 bg-amber-500 rounded-full"></div>
        </div>

        {/* Step Description */}
        {displayStepDescription && (
          <div className="prose prose-sm max-w-none">
            <p className="text-sm text-muted-foreground leading-relaxed m-0">
              {displayStepDescription}
            </p>
          </div>
        )}

        {/* Step Image Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
              <FileText className="h-4 w-4 text-muted-foreground" />
              Step Illustration
            </h4>
            <ImageInputContainer
              image={currentStepImage as string}
              name={"image"}
              text="Change Image"
              stepId={step.id}
              action={updateWorkflowStepImageAction}
            />
          </div>
          
          {currentStepImage ? (
            <div className="group">
              <div className="relative w-full max-w-[400px] rounded-xl overflow-hidden border-2 border-border/50 bg-gradient-to-br from-muted/20 to-muted/10 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src={currentStepImage as string}
                  alt={(displayStepTitle as string) || "Step illustration"}
                  width={400}
                  height={0}
                  className="w-full h-auto object-cover transition-all duration-300 group-hover:scale-[1.02]"
                  sizes="400px"
                />
              </div>
            </div>
          ) : (
            <div className="w-full max-w-[400px] h-48 rounded-xl border-2 border-dashed border-muted-foreground/30 bg-gradient-to-br from-muted/10 to-muted/5 flex items-center justify-center group hover:border-muted-foreground/50 hover:bg-muted/20 transition-all duration-300">
              <div className="text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-muted/30 flex items-center justify-center group-hover:bg-muted/40 transition-colors duration-300">
                  <FileText className="h-6 w-6 text-muted-foreground group-hover:text-muted-foreground/80 transition-colors duration-300" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    No image provided
                  </p>
                  <p className="text-xs text-muted-foreground/70">
                    Add an image to help illustrate this step
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Help Text */}
        {displayHelpText && (
          <>
            <Separator className="my-4" />
            <div className="bg-red-50/50 dark:bg-red-950/20 border border-red-200/50 dark:border-red-800/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                    <Info className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                    Additional Information
                  </h4>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-sm text-red-800/90 dark:text-red-200/90 leading-relaxed m-0">
                      {displayHelpText}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Help Links */}
        {displayHelpLinks && displayHelpLinks.length > 0 && (
          <>
            <Separator className="my-4" />
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Helpful Resources
              </h4>
              <div className="flex flex-wrap gap-2">
                {displayHelpLinks.map((link: any, index: number) => (
                  <Button
                    key={index}
                    variant="default"
                    size="sm"
                    asChild
                    className="text-xs bg-red-600 hover:bg-red-700 transition-all duration-200 hover:shadow-md"
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
          </>
        )}

        {/* Edit Step */}
        <div className="pt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="default"
                className="w-full group hover:shadow-lg transition-all duration-200"
                size="lg"
              >
                <Edit3 className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-200" />
                Edit Step Details
              </Button>
            </DialogTrigger>
            <DialogContent className="border-2 border-primary  sm:max-w-2xl max-h-[85vh] overflow-y-auto">
              <DialogHeader className="space-y-3">
                <DialogTitle className="flex items-center gap-2 text-xl">
                  <Flag className="h-5 w-5 text-amber-600" />
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

                {/* Step Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="stepImage" className="text-sm font-medium">
                    Step Image URL
                  </Label>
                  <Input
                    id="stepImage"
                    value={stepImage as string}
                    onChange={(e) => setStepImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    type="url"
                  />
                  {stepImage && (
                    <div className="mt-3 p-3 bg-muted/50 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-2 font-medium">
                        Preview:
                      </p>
                      <div className="relative w-full h-32 rounded border overflow-hidden">
                        <Image
                          src={stepImage as string}
                          alt="Preview"
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      </div>
                    </div>
                  )}
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
                    <div className="text-center py-8 text-muted-foreground">
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
                        className="p-4 border rounded-lg bg-muted/20 space-y-3"
                      >
                        <div className="flex gap-3 items-end">
                          <div className="flex-1 space-y-2">
                            <Label className="text-xs font-medium text-muted-foreground">
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
                            <Label className="text-xs font-medium text-muted-foreground">
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
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-6 border-t">
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
                  className="bg-amber-600 hover:bg-amber-700 transition-colors"
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