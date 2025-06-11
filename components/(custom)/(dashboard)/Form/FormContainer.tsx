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
}: {
  action: actionFunction;
  children: React.ReactNode;
}) {
  //   const [state, formAction, isPending] = useActionState(action, initialState);
  const [state, formAction] = useActionState(action, initialState);


  useEffect(() => {
    if (state?.message) {
      toast(state.message);
    }
  }, [state]);

  return <form action={formAction}>{children}</form>;
}

export default FormContainer;
