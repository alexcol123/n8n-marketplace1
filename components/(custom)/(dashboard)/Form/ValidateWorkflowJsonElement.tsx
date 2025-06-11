// utils/validation/validateWorkflowJson.ts

import { toast } from "sonner";

// Define types for n8n workflow structure
export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  parameters?: Record<string, unknown>;
  position: [number, number];
  [key: string]: unknown;
}

export interface WorkflowConnections {
  [key: string]: Array<{
    node: string;
    type: string;
    index: number;
  }>;
}

export interface WorkflowData {
  nodes: WorkflowNode[];
  connections: WorkflowConnections;
  name?: string;
  active?: boolean;
  settings?: Record<string, unknown>;
  tags?: string[];
  [key: string]: unknown;
}

export interface ValidationResult {
  isValid: boolean;
  parsedJson: WorkflowData | null;
  message: string;
  isWarning?: boolean;
}

/**
 * Validates if a string is a valid n8n workflow JSON
 * @param jsonValue - The JSON string to validate
 * @param showToasts - Whether to show toast notifications (default: true)
 * @returns An object containing the validation result and parsed JSON if valid
 */
export const validateWorkflowJson = (
  jsonValue: string,
  showToasts: boolean = true
): ValidationResult => {
  // Check if JSON is empty or just "{}"
  if (!jsonValue || jsonValue.trim() === "" || jsonValue === "{}") {
    const message = "Please add a valid n8n workflow JSON";
    if (showToasts) toast.error(message);
    return { isValid: false, parsedJson: null, message };
  }

  // Try to parse the JSON to validate its format
  let parsedJson: WorkflowData;
  try {
    parsedJson = JSON.parse(jsonValue) as WorkflowData;
  } catch (err) {
    console.log(err)
    const message = "Invalid JSON format. Please check your workflow data.";
    if (showToasts) toast.error(message);
    return { isValid: false, parsedJson: null, message };
  }

  // Validate that this is an n8n workflow by checking for required properties
  if (!parsedJson.nodes) {
    const message =
      "This doesn't appear to be a valid n8n workflow. Required 'nodes' property is missing.";
    if (showToasts) toast.error(message);
    return { isValid: false, parsedJson, message };
  }

  if (!Array.isArray(parsedJson.nodes)) {
    const message =
      "The 'nodes' property should be an array in an n8n workflow.";
    if (showToasts) toast.error(message);
    return { isValid: false, parsedJson, message };
  }

  if (parsedJson.nodes.length === 0) {
    const message =
      "This workflow doesn't contain any nodes. A valid workflow should have at least one node.";
    if (showToasts) toast.error(message);
    return { isValid: false, parsedJson, message };
  }

  // Check for connections (not all workflows have connections, but most do)
  if (
    !parsedJson.connections ||
    Object.keys(parsedJson.connections).length === 0
  ) {
    const message =
      "This workflow doesn't contain any connections between nodes. Is this correct?";
    if (showToasts) toast.warning(message);
    // We still consider this valid, but with a warning
    return {
      isValid: true,
      parsedJson,
      message,
      isWarning: true,
    };
  }

  // If we made it here, the JSON is a valid n8n workflow
  const message = "Valid n8n workflow detected!";
  if (showToasts) toast.success(message);
  return { isValid: true, parsedJson, message };
};

/**
 * Validates if a textarea element contains a valid n8n workflow JSON
 * @param textareaElement - The textarea DOM element to validate
 * @param showToasts - Whether to show toast notifications (default: true)
 * @returns An object containing the validation result and parsed JSON if valid
 */
export const validateWorkflowJsonElement = (
  textareaElement: HTMLTextAreaElement | null,
  showToasts: boolean = true
): ValidationResult => {
  if (!textareaElement) {
    const message = "Couldn't find the workflow JSON field";
    if (showToasts) toast.error(message);
    return { isValid: false, parsedJson: null, message };
  }

  return validateWorkflowJson(textareaElement.value, showToasts);
};

export default validateWorkflowJson;
