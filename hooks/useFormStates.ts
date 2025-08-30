"use client";

import { useState } from "react";

export type FormState = 'form' | 'processing' | 'success' | 'error';

interface UseFormStatesReturn {
  state: FormState;
  error: string;
  setForm: () => void;
  setProcessing: () => void;
  setSuccess: () => void;
  setError: (message: string) => void;
  reset: () => void;
  isForm: boolean;
  isProcessing: boolean;
  isSuccess: boolean;
  isError: boolean;
}

export function useFormStates(initialState: FormState = 'form'): UseFormStatesReturn {
  const [state, setState] = useState<FormState>(initialState);
  const [error, setErrorMessage] = useState<string>('');

  const setForm = () => {
    setState('form');
    setErrorMessage('');
  };

  const setProcessing = () => {
    setState('processing');
    setErrorMessage('');
  };

  const setSuccess = () => {
    setState('success');
    setErrorMessage('');
  };

  const setError = (message: string) => {
    setState('error');
    setErrorMessage(message);
  };

  const reset = () => {
    setState('form');
    setErrorMessage('');
  };

  return {
    state,
    error,
    setForm,
    setProcessing,
    setSuccess,
    setError,
    reset,
    // Convenience boolean flags
    isForm: state === 'form',
    isProcessing: state === 'processing',
    isSuccess: state === 'success',
    isError: state === 'error',
  };
}