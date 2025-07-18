"use client";

import { Button } from "@/components/ui/button";

import { OrderedWorkflowStep } from "@/utils/functions/WorkflowStepsInOrder";
import {
  Plus,
  BookOpen,
  Edit,
  Loader2,
  ExternalLink,
  Save,
  Lightbulb,
  Link as LinkIcon,
  Trash2,
  Copy,
  Sparkles,
  User,

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

import Link from "next/link";
import Image from "next/image";
import ImageInputContainer from "../(dashboard)/Form/ImageInputContainer";

interface HelpLink {
  title: string;
  url: string;
}

interface UnknownHelpLink {
  title?: unknown;
  url?: unknown;
}

interface EditCardHelpProps {
  step: OrderedWorkflowStep;
  onStepUpdated?: (updatedStep: Partial<OrderedWorkflowStep>) => void;
  canEditSteps?: boolean;
}

const EditCardHelp = ({
  step,
  onStepUpdated,
  canEditSteps = false,
}: EditCardHelpProps) => {
  const router = useRouter();
  const [isEditMode, setIsEditMode] = useState(false);

  const convertToHelpLink = (link: unknown): HelpLink => {
    if (typeof link === "object" && link !== null) {
      const linkObj = link as UnknownHelpLink;
      return {
        title: String(linkObj.title || ""),
        url: String(linkObj.url || ""),
      };
    }
    return { title: "", url: "" };
  };

  const [stepTitle, setStepTitle] = useState(String(step.stepTitle || ""));
  const [stepDescription, setStepDescription] = useState(
    String(step.stepDescription || "")
  );
  const [stepImage, setStepImage] = useState(String(step.stepImage || ""));
  const [helpText, setHelpText] = useState(String(step.helpText || ""));
  const [helpLinks, setHelpLinks] = useState<HelpLink[]>(() => {
    if (Array.isArray(step.helpLinks)) {
      return step.helpLinks.map(convertToHelpLink);
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleImageUpdate = (event: CustomEvent) => {
      if (event.detail.stepId === step.id && event.detail.success) {
        setStepImage(String(event.detail.imageUrl || ""));
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
      i === index ? { ...link, [field]: String(value) } : link
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
        stepTitle: String(stepTitle || ""),
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
    setStepTitle(String(step.stepTitle || ""));
    setStepDescription(String(step.stepDescription || ""));
    setHelpText(String(step.helpText || ""));
    setHelpLinks(() => {
      if (Array.isArray(step.helpLinks)) {
        return step.helpLinks.map(convertToHelpLink);
      }
      return [];
    });
  };

  const handleCancel = () => {
    resetForm();
    setIsEditMode(false);
  };

  const displayTitle = String(stepTitle || step.stepTitle || "Untitled Step");
  const displayDescription = String(
    stepDescription || step.stepDescription || ""
  );
  const displayHelpText = String(helpText || step.helpText || "");
  const displayHelpLinks =
    helpLinks.length > 0
      ? helpLinks
      : Array.isArray(step.helpLinks)
      ? step.helpLinks.map(convertToHelpLink)
      : [];
  const currentImage = String(stepImage || step.stepImage || "");

  if (
    !displayTitle &&
    !displayDescription &&
    !displayHelpText &&
    !currentImage &&
    displayHelpLinks.length === 0
  ) {
    return null;
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20 border border-blue-200/60 dark:border-blue-800/60 rounded-xl shadow-sm">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-transparent rounded-full blur-lg" />

      <div className="relative p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-1">
              {displayTitle}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-sm text-blue-700/70 dark:text-blue-300/70 font-medium">
                Step Guide & Resources
              </p>
              <div className="flex items-center gap-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
                <User className="h-3 w-3" />
                <span>Creator</span>
              </div>
            </div>
            <p className="text-xs text-amber-800 dark:text-amber-200 mt-2 border border-amber-300 dark:border-amber-700 rounded-xl px-3 py-1 w-fit bg-amber-100 dark:bg-amber-900/30 font-medium">
              ⚠️ Custom instructions written by the workflow creator
              specifically for this n8n step
            </p>
          </div>
        </div>

        {/* Description */}
        {displayDescription && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-lg" />
            <div className="relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-blue-200/40 dark:border-blue-800/40 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {displayDescription}
                  </p>
                </div>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(displayDescription)
                  }
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-blue-500 hover:text-blue-600 hover:bg-blue-100/50 dark:hover:bg-blue-900/30 rounded-md transition-all duration-200"
                  title="Copy description"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Image */}
        {currentImage && (
          <div className="relative group">
            <div className="bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-blue-200/40 dark:border-blue-800/40 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Preview
                </span>
              </div>
              <div className="flex justify-center">
                <div className="relative overflow-hidden rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/50 max-w-lg w-full">
                  <Image
                    src={currentImage}
                    alt={displayTitle}
                    width={600}
                    height={300}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pro Tips */}
        {displayHelpText && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-orange-500/5 rounded-lg" />
            <div className="relative bg-gradient-to-br from-amber-50/80 to-orange-50/80 dark:from-amber-950/20 dark:to-orange-950/20 backdrop-blur-sm border border-amber-200/60 dark:border-amber-800/40 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-100 mb-2">
                    💡 Pro Tips
                  </h4>
                  <p className="text-amber-800/90 dark:text-amber-200/90 text-sm leading-relaxed">
                    {displayHelpText}
                  </p>
                </div>
                <button
                  onClick={() => navigator.clipboard.writeText(displayHelpText)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-100/50 dark:hover:bg-amber-900/30 rounded-md transition-all duration-200"
                  title="Copy pro tips"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Help Links */}
        {displayHelpLinks && displayHelpLinks.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">
                📚 Learning Resources
              </h4>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {displayHelpLinks.map((link: HelpLink, index: number) => (
                <div
                  key={index}
                  className="group relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-sm border border-slate-200/60 dark:border-slate-700/60 rounded-lg p-3 hover:bg-indigo-50/70 dark:hover:bg-indigo-950/20 hover:border-indigo-300/60 dark:hover:border-indigo-700/60 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-md flex items-center justify-center">
                      <LinkIcon className="w-3 h-3 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-indigo-700 dark:text-indigo-300 hover:text-indigo-800 dark:hover:text-indigo-200 hover:underline transition-colors duration-200 block"
                      >
                        {link.title}
                      </Link>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {(() => {
                          try {
                            return new URL(link.url).hostname;
                          } catch {
                            return link.url || "Invalid URL";
                          }
                        })()}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(link.url);
                          toast.success("URL copied!");
                        }}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 rounded transition-all duration-200"
                        title="Copy URL"
                      >
                        <Copy className="w-3 h-3" />
                      </button>
                      <Link
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 rounded transition-all duration-200"
                        title="Open link"
                      >
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Edit Controls */}
        {canEditSteps && (
          <div className="pt-4 border-t border-blue-200/40 dark:border-blue-800/40">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ImageInputContainer
                  image={currentImage}
                  name="image"
                  text="Update Image"
                  stepId={step.id}
                  action={updateWorkflowStepImageAction}
                />
                <div className="text-xs text-slate-500 dark:text-slate-400">
                  Add screenshots to help users understand this step
                </div>
              </div>
              <Button
                onClick={() => setIsEditMode(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 w-full sm:w-auto"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit Instructions
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditMode} onOpenChange={setIsEditMode}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Creator Instructions
            </DialogTitle>
            <DialogDescription>
              Add custom guidance, troubleshooting tips, and resources to help
              users complete this n8n workflow step successfully.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
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
                  No resources added yet. Click &quot;Add Resource&quot; to
                  include helpful links.
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
                            value={String(link.title || "")}
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
                            value={String(link.url || "")}
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
    </div>
  );
};

export default EditCardHelp;
