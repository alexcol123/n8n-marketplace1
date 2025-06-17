"use client";

import { useActionState, useEffect } from "react";
import { actionFunction } from "@/utils/types";
import { toast } from "sonner";
import { set } from "date-fns";

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
  setIsUpdateFormVisible
}) {
  const [state, formAction] = useActionState(action, initialState);

  useEffect(() => {
    if (state?.message) {
      toast(state.message);
      
      // If this is a successful step image update, dispatch custom event
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