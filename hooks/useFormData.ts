"use client";

import { useState, ChangeEvent } from "react";

type FormValue = string | number | boolean | File | null;
type FormData = Record<string, FormValue>;

interface UseFormDataReturn {
  states: FormData;
  handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: any } }) => void;
  resetForm: () => void;
}

export function useFormData(initialData: FormData): UseFormDataReturn {
  const [states, setStates] = useState<FormData>(initialData);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement> | { target: { name: string; value: any } }) => {
    const { name, value, type } = e.target;
    
    // Handle different input types
    let finalValue: FormValue = value;
    
    if (type === 'checkbox') {
      finalValue = (e.target as HTMLInputElement).checked;
    } else if (type === 'number' || type === 'range') {
      finalValue = value === '' ? 0 : Number(value);
    } else if (type === 'file') {
      const files = (e.target as HTMLInputElement).files;
      finalValue = files && files.length > 0 ? files[0] : null;
    }

    setStates(prevStates => ({
      ...prevStates,
      [name]: finalValue
    }));
  };

  const resetForm = () => {
    setStates(initialData);
  };

  return {
    states,
    handleInputChange,
    resetForm
  };
}