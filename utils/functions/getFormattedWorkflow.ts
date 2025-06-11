import {  JsonObject, JsonValue } from "@prisma/client/runtime/library";

// First, let's define the WorkflowObject interface that was missing
interface WorkflowObject {
    [key: string]: unknown;
  }
  
  // For getFormattedWorkflow
  export const getFormattedWorkflow = (
    workflowContent: string | JsonObject | JsonValue
  ): string => {
    try {
      // If it's already a string, try to parse and re-stringify for formatting
      if (typeof workflowContent === "string") {
        const parsed: WorkflowObject = JSON.parse(workflowContent);
        return JSON.stringify(parsed, null, 2);
      }
      // If it's an object, stringify it with formatting
      return JSON.stringify(workflowContent, null, 2);
    } catch (error) {
      console.log(error);
      // If there's an error, return as is
      return typeof workflowContent === "string" ? workflowContent : JSON.stringify(workflowContent || "");
    }
  };