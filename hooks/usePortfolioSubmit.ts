"use client";

import { useState } from "react";

interface SubmitResult {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  needsSetup?: boolean;
  webhookError?: string;
  [key: string]: any;
}

interface UsePortfolioSubmitReturn {
  submit: (data: FormData | Record<string, any>) => Promise<SubmitResult>;
  loading: boolean;
  result: SubmitResult | null;
  error: string | null;
  reset: () => void;
}

export function usePortfolioSubmit(siteName: string): UsePortfolioSubmitReturn {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: FormData | Record<string, any>): Promise<SubmitResult> => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Prepare the request body
      let body: FormData | string;
      let headers: Record<string, string> = {};

      if (data instanceof FormData) {
        body = data;
        // Don't set Content-Type for FormData - let browser set it with boundary
      } else {
        body = JSON.stringify(data);
        headers['Content-Type'] = 'application/json';
      }

      // Make the API call to the dynamic portfolio endpoint
      const response = await fetch(`/api/portfolio/${siteName}`, {
        method: 'POST',
        headers,
        body,
      });

      const apiResult = await response.json();

      if (response.ok) {
        // Success case
        const successResult: SubmitResult = {
          success: true,
          message: apiResult.message || "Success!",
          data: apiResult.data,
          ...apiResult, // Include any additional fields from the API
        };
        
        setResult(successResult);
        return successResult;
      } else {
        // Error case - handle different types of errors
        let errorResult: SubmitResult;

        if (apiResult.needsSetup) {
          errorResult = {
            success: false,
            message: "Please configure your credentials first.",
            needsSetup: true,
          };
        } else if (apiResult.webhookStatus) {
          errorResult = {
            success: false,
            message: `Workflow returned an error (Status: ${apiResult.webhookStatus}). Please check your workflow configuration.`,
            webhookError: apiResult.webhookError,
          };
        } else {
          errorResult = {
            success: false,
            message: apiResult.error || apiResult.message || "Something went wrong",
            error: apiResult.error,
          };
        }

        setResult(errorResult);
        setError(errorResult.message);
        return errorResult;
      }
    } catch (err) {
      console.error("Error submitting to portfolio:", err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to submit. Please check your connection and try again.";

      const errorResult: SubmitResult = {
        success: false,
        message: errorMessage,
        error: errorMessage,
      };

      setResult(errorResult);
      setError(errorMessage);
      return errorResult;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setResult(null);
    setError(null);
  };

  return {
    submit,
    loading,
    result,
    error,
    reset,
  };
}