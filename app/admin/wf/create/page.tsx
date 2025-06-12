"use client";

import { createWorkflowAction } from "@/utils/actions";
import { Separator } from "@/components/ui/separator";
import { SubmitButton } from "@/components/(custom)/(dashboard)/Form/Buttons";
import FormContainer from "@/components/(custom)/(dashboard)/Form/FormContainer";
import FormInput from "@/components/(custom)/(dashboard)/Form/FormInput";
import ImageInput from "@/components/(custom)/(dashboard)/Form/ImageInput";
import TextAreaInput from "@/components/(custom)/(dashboard)/Form/TextAreaInput";
import CategoriesInput from "@/components/(custom)/(dashboard)/Form/CategoriesInput";
import WorkflowJsonInput from "@/components/(custom)/(dashboard)/Form/WorkflowJsonInput";
import StepArrayInput from "@/components/(custom)/(dashboard)/Form/StepsArrayInput";
import { toast } from "sonner";

import { useState } from "react";
import {
  FileCode,
  Upload,
  BrainCircuit,
  ListChecks,
  PenLine,
  CheckCircle2,
  Lock,
  AlertCircle,
  Youtube,  // Added for the YouTube icon
} from "lucide-react";
import WorkflowAIGenerator from "@/components/(custom)/(ai)/WorkflowAiGenerator";
import { validateWorkflowJsonElement } from "@/components/(custom)/(dashboard)/Form/ValidateWorkflowJsonElement";

const CreateWorkflow = () => {
  // State to track if the JSON has been uploaded
  const [jsonUploaded, setJsonUploaded] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string>("");
  const [isValidationWarning, setIsValidationWarning] = useState(false);

  // Function to handle workflow JSON validation
  const handleValidateWorkflowJson = () => {
    setIsValidating(true);

    try {
      // Get the JSON textarea element
      const jsonTextarea = document.querySelector(
        'textarea[name="workFlowJson"]'
      ) as HTMLTextAreaElement;

      // Use the imported validation function
      const validationResult = validateWorkflowJsonElement(jsonTextarea);

      // Update state based on validation result
      setJsonUploaded(validationResult.isValid);
      setValidationMessage(validationResult.message);
      setIsValidationWarning(!!validationResult.isWarning);

      // Optional: Additional actions after successful validation
      if (validationResult.isValid) {
        // Can add any additional actions here after successful validation
      }
    } catch (error) {
      console.error("Error during validation:", error);
      toast.error("An unexpected error occurred during validation");
      setValidationMessage("An unexpected error occurred during validation");
    } finally {
      setIsValidating(false);
    }
  };

  return (
    // Use a container to limit width and add horizontal padding
    <section className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-5xl">
      {/* Main Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4 text-center bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
        Create New Workflow
      </h1>
      <p className="text-center text-muted-foreground text-sm sm:text-base mb-4 sm:mb-8 max-w-2xl mx-auto">
        Share your automation workflows with the community. Follow the steps
        below to create a comprehensive workflow.
      </p>

      {/* Main Form Container Card */}
      <div className="bg-card p-3 sm:p-6 rounded-lg shadow-md border">
        {/* FormContainer is your <form> element wrapper */}
        <FormContainer action={createWorkflowAction}>
          {/* Steps container with styled steps */}
          <div className="space-y-6 sm:space-y-10 mb-6 sm:mb-10">
            {/* Step 1: Upload Workflow JSON */}
            <div className="relative">
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
                <div
                  className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center text-primary-foreground font-bold text-lg ${
                    jsonUploaded ? "bg-green-600" : "bg-primary"
                  }`}
                >
                  {jsonUploaded ? (
                    <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6" />
                  ) : (
                    "1"
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <FileCode className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  <span>Upload Workflow JSON</span>
                </h2>
              </div>

              <div className="pl-0 sm:pl-14">
                <div
                  className={`bg-muted/20 p-3 sm:p-6 rounded-lg border ${
                    jsonUploaded ? "border-green-500/30" : "border-muted"
                  }`}
                >
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-6">
                    Start by uploading your n8n workflow JSON file. This is
                    required to unlock AI-powered features in the next steps.
                  </p>

                  {/* WorkflowJsonInput */}
                  <div className="mb-4 space-y-2">
                    <WorkflowJsonInput
                      name="workFlowJson"
                      labelText="n8n Workflow JSON Code"
                      required
                    />

                    {/* JSON Validation button */}
                    <button
                      type="button"
                      className={`mt-4 px-3 sm:px-4 py-2 rounded-md font-medium text-xs sm:text-sm flex items-center gap-2 w-full sm:w-auto
                        ${
                          isValidating
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : ""
                        }
                        ${
                          jsonUploaded
                            ? isValidationWarning
                              ? "bg-amber-500 text-white hover:bg-amber-600"
                              : "bg-green-600 text-white hover:bg-green-700"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                        }`}
                      onClick={handleValidateWorkflowJson}
                      disabled={isValidating}
                    >
                      {isValidating ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          <span className="sm:inline">Validating...</span>
                        </>
                      ) : jsonUploaded ? (
                        <>
                          {isValidationWarning ? (
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                          ) : (
                            <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                          )}
                          <span>Workflow JSON Validated</span>
                        </>
                      ) : (
                        "Validate JSON to Continue"
                      )}
                    </button>

                    {validationMessage && !jsonUploaded && (
                      <div className="mt-3 flex items-start gap-2 text-red-500 bg-red-500/10 p-2 sm:p-3 rounded-md border border-red-500/20 text-xs sm:text-sm">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <p>{validationMessage}</p>
                      </div>
                    )}

                    {validationMessage &&
                      jsonUploaded &&
                      isValidationWarning && (
                        <div className="mt-3 flex items-start gap-2 text-amber-500 bg-amber-500/10 p-2 sm:p-3 rounded-md border border-amber-500/20 text-xs sm:text-sm">
                          <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                          <p>{validationMessage}</p>
                        </div>
                      )}

                    {!jsonUploaded && !validationMessage && (
                      <div className="mt-3 flex items-start gap-2 text-amber-500 bg-amber-500/10 p-2 sm:p-3 rounded-md border border-amber-500/20 text-xs sm:text-sm">
                        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                        <p>
                          You must validate your n8n workflow JSON before
                          proceeding. Paste your JSON above and click validate.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4 sm:my-8" />

            {/* Step 2: Upload Workflow Image - Only shown when JSON is uploaded */}
            <div
              className={`relative transition-all duration-300 ${
                jsonUploaded ? "opacity-100" : "opacity-50 pointer-events-none"
              }`}
            >
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
                <div
                  className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg ${
                    !jsonUploaded && "bg-muted text-muted-foreground"
                  }`}
                >
                  {!jsonUploaded && <Lock className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {jsonUploaded && "2"}
                </div>
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <Upload
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      jsonUploaded ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span>Add Workflow Image</span>
                </h2>

                {!jsonUploaded && (
                  <span className="text-xs sm:text-sm text-muted-foreground ml-auto">
                    Upload JSON to unlock
                  </span>
                )}
              </div>

              <div className="pl-0 sm:pl-14">
                <div
                  className={`bg-muted/10 p-3 sm:p-6 rounded-lg border border-muted transition-all ${
                    !jsonUploaded && "blur-[2px]"
                  }`}
                >
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-6">
                    Upload an image that represents your workflow. This will be
                    displayed in the workflow card.
                  </p>
                  <ImageInput />
                </div>
              </div>
            </div>

            <Separator className="my-4 sm:my-8" />

            {/* Step 3: AI-Powered Content Generation - Only shown when JSON is uploaded */}
            <div
              className={`relative transition-all duration-300 ${
                jsonUploaded ? "opacity-100" : "opacity-50 pointer-events-none"
              }`}
            >
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
                <div
                  className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg ${
                    !jsonUploaded && "bg-muted text-muted-foreground"
                  }`}
                >
                  {!jsonUploaded && <Lock className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {jsonUploaded && "3"}
                </div>
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <BrainCircuit
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      jsonUploaded ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span className="break-words">AI Content Generation</span>
                </h2>

                {!jsonUploaded && (
                  <span className="text-xs sm:text-sm text-muted-foreground ml-auto">
                    Upload JSON to unlock
                  </span>
                )}
              </div>

              <div className="pl-0 sm:pl-14">
                <div
                  className={`bg-primary/5 p-3 sm:p-6 rounded-lg border border-primary/20 transition-all ${
                    !jsonUploaded && "blur-[2px]"
                  }`}
                >
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-6">
                    Use AI to help you create content for your workflow. The AI
                    will analyze your workflow JSON and generate titles,
                    descriptions, and implementation steps.
                  </p>

                  {/* WorkflowAIGenerator component */}
                  <div className="mb-4 sm:mb-6 p-2 sm:p-4 bg-muted/10 rounded-lg border border-primary/10">
                    <WorkflowAIGenerator />
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4 sm:my-8" />

            {/* Step 4: Manual Content Creation - Only shown when JSON is uploaded */}
            <div
              className={`relative transition-all duration-300 ${
                jsonUploaded ? "opacity-100" : "opacity-50 pointer-events-none"
              }`}
            >
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
                <div
                  className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg ${
                    !jsonUploaded && "bg-muted text-muted-foreground"
                  }`}
                >
                  {!jsonUploaded && <Lock className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {jsonUploaded && "4"}
                </div>
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <PenLine
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      jsonUploaded ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span>Manual Content Creation</span>
                </h2>

                {!jsonUploaded && (
                  <span className="text-xs sm:text-sm text-muted-foreground ml-auto">
                    Upload JSON to unlock
                  </span>
                )}
              </div>

              <div className="pl-0 sm:pl-14">
                <div
                  className={`bg-muted/10 p-3 sm:p-6 rounded-lg border border-muted transition-all ${
                    !jsonUploaded && "blur-[2px]"
                  }`}
                >
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-6">
                    If you prefer to create your own content or edit the
                    AI-generated content, you can do so here:
                  </p>

                  <div className="grid gap-4 sm:gap-6">
                    <FormInput
                      type="text"
                      name="title"
                      label="Workflow Title"
                      placeholder="e.g., Automate Lead Follow-up"
                      required
                      helperText="Choose a clear, descriptive title (100 characters max)"
                    />

                    <TextAreaInput
                      name="content"
                      labelText="Description"
                      placeholder="Describe what this workflow does and why it's useful..."
                      required
                      minLength={100}
                      maxLength={1000}
                      rows={4}
                      helperText="Explain the purpose, benefits, and use cases of your workflow"
                    />

                    <CategoriesInput />

                    <div className="bg-muted/10 p-3 sm:p-5 rounded-lg border border-muted">
                      <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-4 flex items-center gap-2">
                        <ListChecks className="h-4 w-4 text-primary" />
                        Implementation Steps
                      </h3>

                      <StepArrayInput
                        maxSteps={7}
                        placeholder="Describe this step of the workflow in detail..."
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-4 sm:my-8" />

            {/* Step 5: Add YouTube Video (Optional) - Only shown when JSON is uploaded */}
            <div
              className={`relative transition-all duration-300 ${
                jsonUploaded ? "opacity-100" : "opacity-50 pointer-events-none"
              }`}
            >
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
                <div
                  className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg ${
                    !jsonUploaded && "bg-muted text-muted-foreground"
                  }`}
                >
                  {!jsonUploaded && <Lock className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {jsonUploaded && "5"}
                </div>
                <h2 className="text-lg sm:text-xl font-semibold flex items-center gap-2">
                  <Youtube
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      jsonUploaded ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                  <span>Add YouTube Video (Optional)</span>
                </h2>

                {!jsonUploaded && (
                  <span className="text-xs sm:text-sm text-muted-foreground ml-auto">
                    Upload JSON to unlock
                  </span>
                )}
              </div>

              <div className="pl-0 sm:pl-14">
                <div
                  className={`bg-muted/10 p-3 sm:p-6 rounded-lg border border-muted transition-all ${
                    !jsonUploaded && "blur-[2px]"
                  }`}
                >
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-6">
                    Add a YouTube video that demonstrates your workflow in action. This will be embedded on your workflow detail page.
                  </p>

                  <FormInput
                    type="url"
                    name="videoUrl"
                    label="YouTube Video URL"
                    placeholder="https://www.youtube.com/watch?v=..."
                    required={false}
                    helperText="Optional: Add a YouTube video URL that demonstrates your workflow in action"
                  />
                </div>
              </div>
            </div>

            <Separator className="my-4 sm:my-8" />

            {/* Step 6: Submit - Only shown when JSON is uploaded */}
            <div
              className={`relative transition-all duration-300 ${
                jsonUploaded ? "opacity-100" : "opacity-50 pointer-events-none"
              }`}
            >
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 mb-3 sm:mb-6">
                <div
                  className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg ${
                    !jsonUploaded && "bg-muted text-muted-foreground"
                  }`}
                >
                  {!jsonUploaded && <Lock className="h-3 w-3 sm:h-4 sm:w-4" />}
                  {jsonUploaded && "6"}
                </div>
                <h2 className="text-lg sm:text-xl font-semibold">
                  Publish Your Workflow
                </h2>

                {!jsonUploaded && (
                  <span className="text-xs sm:text-sm text-muted-foreground ml-auto">
                    Upload JSON to unlock
                  </span>
                )}
              </div>

              <div className="pl-0 sm:pl-14">
                <div
                  className={`bg-primary/5 p-3 sm:p-6 rounded-lg border border-primary/20 transition-all ${
                    !jsonUploaded && "blur-[2px]"
                  }`}
                >
                  <p className="text-xs sm:text-sm mb-3 sm:mb-6">
                    Review your workflow details before publishing. Once
                    published, your workflow will be available to the community.
                  </p>

                  <SubmitButton
                    className="w-full sm:w-auto bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    text="Publish Workflow"
                  />
                </div>
              </div>
            </div>
          </div>
        </FormContainer>
      </div>
    </section>
  );
};

export default CreateWorkflow;