"use client";

import { useActionState, useEffect } from "react";
import { actionFunction } from "@/utils/types";
import { toast } from "sonner";

// Define the state type with index signature to match Record<string, unknown>
interface FormState extends Record<string, unknown> {
  message: string;
  success?: boolean;
  imageUrl?: string;
  stepId?: string;
}

const initialState: FormState = {
  message: "",
};

interface FormContainerProps {
  action: actionFunction;
  children: React.ReactNode;
  setIsUpdateFormVisible?: (visible: boolean) => void;
}

function FormContainer({
  action,
  children,
  setIsUpdateFormVisible
}: FormContainerProps) {
  // Wrap the action to log form data
  const wrappedAction = async (prevState: FormState, formData: FormData): Promise<FormState> => {
    // Console log all form inputs
    console.log("=== FORM SUBMISSION ===");
    console.log("FormData entries:");
    
    for (const [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    
    // Convert to object for easier viewing
    const formObject = Object.fromEntries(formData.entries());
    console.log("Form data as object:", formObject);
    
    // Call the original action
    return await action(prevState, formData);
  };

  const [state, formAction] = useActionState(wrappedAction, initialState);

  useEffect(() => {
    if (state?.message) {
      toast(state.message);
      
      if (state.success && state.imageUrl && state.stepId) {
        setIsUpdateFormVisible?.(false);
        window.dispatchEvent(
          new CustomEvent('stepImageUpdated', {
            detail: {
              success: true,
              imageUrl: state.imageUrl,
              stepId: state.stepId,
            },
          })
        );
      }
    }
  }, [state, setIsUpdateFormVisible]); // Added setIsUpdateFormVisible to dependencies

  return <form action={formAction}>{children}</form>;
}

export default FormContainer;