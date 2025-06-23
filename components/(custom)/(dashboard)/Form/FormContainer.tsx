"use client";

import { useActionState, useEffect } from "react";
import { actionFunction } from "@/utils/types";
import { toast } from "sonner";

const initialState = {
  message: "",
};

function FormContainer({
  action,
  children,
  setIsUpdateFormVisible
}: {
  action: actionFunction;
  children: React.ReactNode;
  setIsUpdateFormVisible?: (visible: boolean) => void;
}) {
  // Wrap the action to log form data
  const wrappedAction = async (prevState: any, formData: FormData) => {
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
  }, [state]);

  return <form action={formAction}>{children}</form>;
}

export default FormContainer;