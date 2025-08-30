"use client";

import { useState, useCallback, useRef } from "react";

interface SubmitResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  needsSetup?: boolean;
  webhookError?: string;
  [key: string]: any;
}

interface UsePortfolioFormSubmitReturn {
  isSubmitting: boolean;
  submitForm: (
    siteName: string,
    data: Record<string, any>,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => Promise<void>;
}

/**
 * Wrapper hook that provides a simpler interface for form submission
 * to portfolio sites. This hook handles the API communication directly
 * without relying on usePortfolioSubmit.
 */
export function usePortfolioFormSubmit(): UsePortfolioFormSubmitReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const submitForm = useCallback(async (
    siteName: string,
    data: Record<string, any>,
    onSuccess?: () => void,
    onError?: (error: string) => void
  ) => {
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`/api/portfolio/${siteName}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: abortControllerRef.current.signal,
      });

      const result: SubmitResult = await response.json();

      if (response.ok && result.success) {
        onSuccess?.();
      } else {
        const errorMessage = result.error || result.message || "Submission failed";
        onError?.(errorMessage);
      }
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // Request was cancelled, don't call error handler
        return;
      }
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      onError?.(errorMessage);
    } finally {
      setIsSubmitting(false);
      abortControllerRef.current = null;
    }
  }, []);

  return {
    isSubmitting,
    submitForm
  };
}

// Export default for backward compatibility
export default usePortfolioFormSubmit;