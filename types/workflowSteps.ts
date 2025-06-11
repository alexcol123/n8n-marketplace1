// types/workflowSteps.ts

/**
 * Unified step data structure for all node types
 */
export interface UnifiedStepData {
  id: string;
  name: string;
  type: string;
  category: 'ai' | 'http' | 'code' | 'generic';
  parameters: Record<string, any>;
  position: [number, number];
  originalNode: any;
  stepNumber: number;
}

export const STEP_THEMES = {
  ai: {
    primary: '#8b5cf6',
    background: '#f3f4f6',
    border: '#8b5cf6',
    text: '#374151'
  },
  http: {
    primary: '#3b82f6',
    background: '#eff6ff',
    border: '#3b82f6',
    text: '#1e40af'
  },
  code: {
    primary: '#10b981',
    background: '#f0fdf4',
    border: '#10b981',
    text: '#065f46'
  },
  generic: {
    primary: '#6b7280',
    background: '#f9fafb',
    border: '#6b7280',
    text: '#374151'
  }
} as const;

/**
 * Theme configuration for different step types
 */
export interface StepTheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  border: string;
  icon: string;
}

/**
 * Step themes for different node types
 */


/**
 * Props for WorkflowStepsViewer component
 */
export interface WorkflowStepsViewerProps {
  steps: UnifiedStepData[];
}

/**
 * Props for BaseStepCard component
 */
export interface BaseStepCardProps {
  step: UnifiedStepData;
  theme: StepTheme;
  icon: React.ReactNode;
  children: React.ReactNode;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

/**
 * Props for specific step card components
 */
export interface AIStepCardProps {
  step: UnifiedStepData;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export interface HttpStepCardProps {
  step: UnifiedStepData;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export interface CodeStepCardProps {
  step: UnifiedStepData;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export interface GenericStepCardProps {
  step: UnifiedStepData;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

/**
 * Props for CodeBlock component
 */
export interface CodeBlockProps {
  code: string;
  title: string;
  language?: string;
  copyId: string;
}

/**
 * Props for step card utilities
 */
export interface StepCardUtilsProps {
  onCopy: (text: string, id: string) => Promise<void>;
  copiedId: string | null;
}

/**
 * HTTP method types
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS';

/**
 * AI provider types
 */
export type AIProvider = 'OpenAI' | 'Anthropic' | 'Google' | 'Mistral' | 'Cohere' | 'HuggingFace' | 'AI';

/**
 * Code language types
 */
export type CodeLanguage = 'javascript' | 'python' | 'typescript' | 'json' | 'text';