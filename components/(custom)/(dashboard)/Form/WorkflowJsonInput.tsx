"use client";

import { useState, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  AlertCircle,
  CheckCircle,
  Upload,
  Trash2,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type WorkflowJsonInputProps = {
  name: string;
  labelText?: string;
  defaultValue?: string;
  required?: boolean;
  className?: string;
};

function WorkflowJsonInput({
  name,
  labelText = "n8n Workflow JSON",
  defaultValue = "",
  required = false,
  className = "",
}: WorkflowJsonInputProps) {
  const [jsonInput, setJsonInput] = useState(defaultValue);
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateJson = (input: string) => {
    if (!input.trim() && required) {
      setIsValid(false);
      setValidationMessage("Workflow JSON is required");
      return false;
    }

    if (!input.trim() || input === "{}") {
      setIsValid(true);
      setValidationMessage("");
      return true;
    }

    try {
      JSON.parse(input);
      setIsValid(true);
      setValidationMessage("Valid workflow JSON");
      return true;
    } catch (error) {
      setIsValid(false);
      setValidationMessage(
        `Invalid JSON format: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setJsonInput(value);

    // Only validate if there's substantial content
    if (value.length > 10) {
      validateJson(value);
    } else if (value.trim() === "" || value === "{}") {
      setIsValid(true);
      setValidationMessage("");
    }
  };

  // Format the JSON for better readability
  const formatJson = () => {
    try {
      if (!jsonInput.trim() || jsonInput === "{}") {
        return;
      }
      const parsed = JSON.parse(jsonInput);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonInput(formatted);
      validateJson(formatted);
    } catch (error) {
      // If can't format, show validation error
      console.log(error)
      validateJson(jsonInput);
    }
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a JSON file
    if (!file.name.endsWith(".json") && file.type !== "application/json") {
      setIsValid(false);
      setValidationMessage("Please upload a valid JSON file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        // Validate the JSON content
        JSON.parse(content); // This will throw if invalid
        setJsonInput(content);
        setIsValid(true);
        setValidationMessage("Workflow JSON loaded successfully");
      } catch (error) {
        setIsValid(false);
        setValidationMessage(
          `Invalid JSON in uploaded file: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    };
    reader.onerror = () => {
      setIsValid(false);
      setValidationMessage("Error reading the file");
    };

    reader.readAsText(file);
  };

  // Clear the input
  const clearInput = () => {
    setJsonInput("{}");
    setIsValid(true);
    setValidationMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="capitalize">
          {labelText}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs"
          >
            <Upload className="h-3 w-3 mr-1" />
            Upload
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={formatJson}
            className="text-xs"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Format
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearInput}
            className="text-xs"
          >
            <Trash2 className="h-3 w-3 mr-1" />
            Clear
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            accept=".json,application/json"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      <Textarea
        id={name}
        name={name}
        value={jsonInput}
        onChange={handleInputChange}
        rows={10}
        required={required}
        className={cn(
          "font-mono text-sm max-h-96 m-2 p-8",
          isValid ? "border-input" : "border-destructive",
          className
        )}
        placeholder={`Paste your n8n workflow JSON here or use the Upload button.`}
      />

      {validationMessage && (
        <Alert
          className={
            isValid
              ? "py-2 bg-green-700 text-white"
              : "py-2 bg-red-700 text-white"
          }
        >
          <div className="flex items-center gap-2 min-h-10">
            {isValid ? (
              <CheckCircle className="h-4 w-4 flex-shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
            )}
            <AlertDescription className="text-white font-semibold whitespace-nowrap ">
              {validationMessage}
            </AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
}

export default WorkflowJsonInput;
