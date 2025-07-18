"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles, Zap, ListFilter } from "lucide-react";
import { toast } from "sonner";
import { technologyCategories } from "@/utils/constants";

// Match the name used in CategoriesInput component
const CATEGORY_FIELD_NAME = "category";

export default function WorkflowAIGenerator() {
  // State to track loading states for each generation type
  const [isGenerating, setIsGenerating] = useState({
    title: false,
    description: false,
    category: false,
    all: false,
  });

  // Refs for form elements (removed steps-related refs)
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descriptionTextareaRef = useRef<HTMLTextAreaElement>(null);
  const jsonTextareaRef = useRef<HTMLTextAreaElement>(null);
  const categorySelectRef = useRef<HTMLSelectElement>(null);

  // Set up refs when component mounts
  useEffect(() => {
    // Find the elements in the DOM
    const titleInput = document.querySelector('input[name="title"]');
    const descriptionTextarea = document.querySelector(
      'textarea[name="content"]'
    );
    const jsonTextarea = document.querySelector(
      'textarea[name="workFlowJson"]'
    );
    const categorySelect = document.querySelector(
      `select[name="${CATEGORY_FIELD_NAME}"]`
    );

    // Set the refs
    if (titleInput) titleInputRef.current = titleInput as HTMLInputElement;
    if (descriptionTextarea)
      descriptionTextareaRef.current =
        descriptionTextarea as HTMLTextAreaElement;
    if (jsonTextarea)
      jsonTextareaRef.current = jsonTextarea as HTMLTextAreaElement;
    if (categorySelect)
      categorySelectRef.current = categorySelect as HTMLSelectElement;
  }, []);

  // Helper to validate JSON before sending to API
  const validateJson = () => {
    if (!jsonTextareaRef.current) {
      toast.error("Could not find the workflow JSON field");
      return null;
    }

    const jsonValue = jsonTextareaRef.current.value;

    if (!jsonValue || jsonValue.trim() === "" || jsonValue === "{}") {
      toast.error("Please add workflow JSON first");
      return null;
    }

    try {
      return JSON.parse(jsonValue);
    } catch (error) {
      console.log(error);
      toast.error("Invalid JSON. Please check your workflow data.");
      return null;
    }
  };

  // Function to generate workflow title
  const generateTitle = async () => {
    const workflowJson = validateJson();
    if (!workflowJson) return;

    setIsGenerating((prev) => ({ ...prev, title: true }));

    try {
      const response = await fetch("/api/workflow-analysis/title", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowJson }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();

      if (data.success && data.title && titleInputRef.current) {
        titleInputRef.current.value = data.title;

        // Trigger input event
        const event = new Event("input", { bubbles: true });
        titleInputRef.current.dispatchEvent(event);

        toast.success("Title generated successfully!");
      } else {
        toast.error("Could not generate a title. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate title.");
    } finally {
      setIsGenerating((prev) => ({ ...prev, title: false }));
    }
  };

  // Function to generate workflow description
  const generateDescription = async () => {
    const workflowJson = validateJson();
    if (!workflowJson) return;

    setIsGenerating((prev) => ({ ...prev, description: true }));

    try {
      const response = await fetch("/api/workflow-analysis/description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowJson }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();

      if (data.success && data.description && descriptionTextareaRef.current) {
        descriptionTextareaRef.current.value = data.description;

        // Trigger input event
        const event = new Event("input", { bubbles: true });
        descriptionTextareaRef.current.dispatchEvent(event);

        toast.success("Description generated successfully!");
      } else {
        toast.error("Could not generate a description. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate description.");
    } finally {
      setIsGenerating((prev) => ({ ...prev, description: false }));
    }
  };

  // Function to detect and set the category
  const generateCategory = async () => {
    const workflowJson = validateJson();
    if (!workflowJson) return;

    setIsGenerating((prev) => ({ ...prev, category: true }));

    try {
      // Get context from title and description if they exist
      const contextData = {
        workflowJson,
        title: titleInputRef.current?.value || "",
        description: descriptionTextareaRef.current?.value || "",
      };

      // Call API endpoint for category detection
      const response = await fetch("/api/workflow-analysis/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contextData),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();

      if (data.success && data.category) {
        // Validate that the category is one of our valid options
        const isValidCategory = technologyCategories.some(
          (cat) => cat.label === data.category
        );
        const category = isValidCategory ? data.category : "other";

        // For Shadcn UI Select component, we need a different approach
        // Look for a hidden input field that might be used by the form
        const hiddenInput = document.querySelector(
          `input[name="${CATEGORY_FIELD_NAME}"][type="hidden"]`
        );
        if (hiddenInput) {
          // Set the value directly on the hidden input
          (hiddenInput as HTMLInputElement).value = category;

          // Trigger both input and change events
          hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
          hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
        }

        // Also update the visible trigger text
        const triggerElement = document.querySelector(
          `#${CATEGORY_FIELD_NAME} .select-value, #${CATEGORY_FIELD_NAME} [class*="SelectValue"]`
        );
        if (triggerElement) {
          // Try to update the text content directly
          triggerElement.textContent = category;
        }

        // Force a React state update by creating a custom event
        document.dispatchEvent(
          new CustomEvent("shadcn-select-update", {
            detail: { name: CATEGORY_FIELD_NAME, value: category },
          })
        );

        toast.success(`Category set to: ${category}`);
      } else {
        toast.error("Could not determine category. Please select manually.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to generate category.");
    } finally {
      setIsGenerating((prev) => ({ ...prev, category: false }));
    }
  };

  // Function to generate all content at once (removed steps generation)
  const generateAll = async () => {
    const workflowJson = validateJson();
    if (!workflowJson) return;

    setIsGenerating((prev) => ({ ...prev, all: true }));

    try {
      const response = await fetch("/api/workflow-analysis/generate-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workflowJson }),
      });

      if (!response.ok) throw new Error(`Error: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        // Update title if available
        if (data.title && titleInputRef.current) {
          titleInputRef.current.value = data.title;
          titleInputRef.current.dispatchEvent(
            new Event("input", { bubbles: true })
          );
        }

        // Update description if available
        if (data.description && descriptionTextareaRef.current) {
          descriptionTextareaRef.current.value = data.description;
          descriptionTextareaRef.current.dispatchEvent(
            new Event("input", { bubbles: true })
          );
        }

        // Update category using the same reliable method as in generateCategory
        if (data.category) {
          // Validate the category
          const isValidCategory = technologyCategories.some(
            (cat) => cat.label === data.category
          );
          const category = isValidCategory ? data.category : "other";

          // Look for the hidden input field
          const hiddenInput = document.querySelector(
            `input[name="${CATEGORY_FIELD_NAME}"][type="hidden"]`
          );
          if (hiddenInput) {
            // Set the value directly
            (hiddenInput as HTMLInputElement).value = category;

            // Trigger events
            hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
            hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
          }

          // Update the visible trigger text
          const triggerElement = document.querySelector(
            `#${CATEGORY_FIELD_NAME} .select-value, #${CATEGORY_FIELD_NAME} [class*="SelectValue"]`
          );
          if (triggerElement) {
            triggerElement.textContent = category;
          }

          // Force React state update with custom event
          document.dispatchEvent(
            new CustomEvent("shadcn-select-update", {
              detail: { name: CATEGORY_FIELD_NAME, value: category },
            })
          );
        }

        toast.success("Workflow content generated successfully!");
      } else {
        toast.error("Failed to generate content. Please try again.");
      }
    } catch (err) {
      console.error("Error generating all content:", err);
      toast.error("Failed to generate workflow content.");
    } finally {
      setIsGenerating((prev) => ({ ...prev, all: false }));
    }
  };

  // Component UI with buttons for each generation option
  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium mb-1">
        AI-Powered Content Generation
      </div>
      <div className="flex flex-wrap gap-2">
        {/* Button to generate title */}
        <Button
          type="button"
          onClick={generateTitle}
          disabled={isGenerating.title || isGenerating.all}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {isGenerating.title ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Title
            </>
          )}
        </Button>

        {/* Button to generate description */}
        <Button
          type="button"
          onClick={generateDescription}
          disabled={isGenerating.description || isGenerating.all}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {isGenerating.description ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" />
              Generate Description
            </>
          )}
        </Button>

        {/* Button to detect category */}
        <Button
          type="button"
          onClick={generateCategory}
          disabled={isGenerating.category || isGenerating.all}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          {isGenerating.category ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Detecting...
            </>
          ) : (
            <>
              <ListFilter className="h-4 w-4" />
              Detect Category
            </>
          )}
        </Button>

        {/* Button to generate all content */}
        <Button
          type="button"
          onClick={generateAll}
          disabled={
            isGenerating.title ||
            isGenerating.description ||
            isGenerating.category ||
            isGenerating.all
          }
          variant="default"
          size="sm"
          className="gap-2"
        >
          {isGenerating.all ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Generating All...
            </>
          ) : (
            <>
              <Zap className="h-4 w-4" />
              Generate All Content
            </>
          )}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        Automatically generate content from your workflow JSON. Steps will be generated automatically when the workflow is published.
      </p>
    </div>
  );
}