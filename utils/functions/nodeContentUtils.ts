// utils/functions/nodeContentUtils.ts

import { type OrderedWorkflowStep } from "@/utils/functions/WorkflowStepsInOrder";

export interface AIMessage {
  role?: string;
  type?: string;
  content?: string;
  text?: string;
  message?: string;
}

export interface NestedPrompt {
  path: string;
  content: string;
  type: "system" | "user" | "text";
}

export interface AIPromptsResult {
  system: string;
  user: string;
  text: string;
  messages: AIMessage[];
  nestedPrompts: NestedPrompt[];
}

export interface CodeContentResult {
  language: "python" | "javascript";
  code: string;
  paramKey: string;
}

// Utility function to check if a node is an AI node
export const isAINode = (nodeType: string): boolean => {
  const lowerType = nodeType.toLowerCase();
  return (
    lowerType.includes("openai") ||
    lowerType.includes("anthropic") ||
    lowerType.includes("ai") ||
    lowerType.includes("llm") ||
    lowerType.includes("chatgpt") ||
    lowerType.includes("claude")
  );
};

// Utility function to check if a node is a code node
export const isCodeNode = (nodeType: string): boolean => {
  const lowerType = nodeType.toLowerCase();
  return (
    lowerType.includes("code") ||
    lowerType.includes("function") ||
    lowerType.includes("javascript") ||
    lowerType.includes("python") ||
    lowerType.includes("script")
  );
};

/**
 * Extracts AI prompts from a workflow step's parameters
 * @param step - The workflow step to extract prompts from
 * @returns AI prompts object or null if not applicable
 */
export const getAIPrompts = (step: OrderedWorkflowStep): AIPromptsResult | null => {
  if (!isAINode(step.type) || !step.parameters) return null;

  const prompts: AIPromptsResult = {
    system: "",
    user: "",
    text: "",
    messages: [] as AIMessage[],
    nestedPrompts: [] as NestedPrompt[],
  };

  // Basic parameter extraction
  const systemKeys = ["systemMessage", "system", "instructions"];
  const userKeys = ["prompt", "userMessage", "input", "text"];

  // Check root level parameters first
  systemKeys.forEach((key) => {
    if (step.parameters?.[key]) {
      prompts.system = String(step.parameters[key]);
    }
  });

  userKeys.forEach((key) => {
    if (step.parameters?.[key]) {
      if (key === "text") {
        prompts.text = String(step.parameters[key]);
      } else {
        prompts.user = String(step.parameters[key]);
      }
    }
  });

  // Check nested options for system message (only if options exists)
  if (step.parameters?.options && typeof step.parameters.options === 'object') {
    const options = step.parameters.options as Record<string, unknown>;
    
    systemKeys.forEach((key) => {
      if (options[key]) {
        prompts.system = String(options[key]);
      }
    });

    // Also check for user prompts in options if needed
    userKeys.forEach((key) => {
      if (options[key]) {
        if (key === "text") {
          prompts.text = String(options[key]);
        } else {
          prompts.user = String(options[key]);
        }
      }
    });
  }

  // Handle messages array if it exists (check both root and options)
  const messagesKeys = ["messages", "conversation", "chat_history"];
  messagesKeys.forEach((key) => {
    // Check root level
    if (step.parameters?.[key] && Array.isArray(step.parameters[key])) {
      prompts.messages = step.parameters[key] as AIMessage[];
    }
    // Check options level (only if options exists)
    if (step.parameters?.options && typeof step.parameters.options === 'object') {
      const options = step.parameters.options as Record<string, unknown>;
      if (options[key] && Array.isArray(options[key])) {
        prompts.messages = options[key] as AIMessage[];
      }
    }
  });

  return prompts;
};

/**
 * Extracts code content from a workflow step's parameters
 * @param step - The workflow step to extract code from
 * @returns Code content object or null if not applicable
 */
export const getCodeContent = (step: OrderedWorkflowStep): CodeContentResult | null => {
  if (!isCodeNode(step.type) || !step.parameters) return null;
  
  const codeKeys = ["jsCode", "code", "script", "pythonCode"];

  for (const key of codeKeys) {
    if (step.parameters?.[key] && typeof step.parameters[key] === "string") {
      return {
        language: step.type.toLowerCase().includes("python")
          ? "python"
          : "javascript",
        code: String(step.parameters[key]),
        paramKey: key,
      };
    }
  }
  return null;
};