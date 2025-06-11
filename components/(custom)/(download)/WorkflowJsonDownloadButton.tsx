// // components/(custom)/(download)/WorkflowJsonDownloadButton.tsx
// "use client";

// import { getFormattedWorkflow } from "@/utils/functions/getFormattedWorkflow";
// import { Button } from "@/components/ui/button";
// import { Download } from "lucide-react";
// import { handleDownload } from "@/utils/functions/handleDownload";
// import { JsonObject, JsonValue } from "@prisma/client/runtime/library";
// import { recordWorkflowDownload } from "@/utils/actions";
// import { toast } from "sonner";

// interface WorkflowJsonDownloadButtonProps {
//   workflowContent: string | JsonValue | JsonObject;
//   workflowId: string; // Add this parameter
//   title?: string;
// }

// export const WorkflowJsonDownloadButton = ({
//   workflowContent,
//   workflowId, // Accept the workflow ID
//   title = "n8n-Workflow",
// }: WorkflowJsonDownloadButtonProps) => {
//   const formattedWorkflow = getFormattedWorkflow(workflowContent);

//   // Updated function to handle download and record it
//   const handleDownloadAndRecord = async () => {
//     // First handle the actual download
//     handleDownload(formattedWorkflow, title);

//     // Then record the download in the database
//     try {
//       const result = await recordWorkflowDownload(workflowId);
//       if (result.message) {
//         toast.success("Workflow added to your downloads");
//       }
//     } catch (error) {
//       console.error("Failed to record download:", error);
//       // Still allow the download even if recording fails
//     }
//   };

//   return (
//     <Button
//       variant="default"
//       size="sm"
//       onClick={handleDownloadAndRecord}
//       className="gap-1.5 ml-auto"
//     >
//       <Download className="h-4 w-4" />
//       <span>Download Workflow</span>
//     </Button>
//   );
// };

// components/(custom)/(download)/WorkflowJsonDownloadButton.tsx
"use client";

import { getFormattedWorkflow } from "@/utils/functions/getFormattedWorkflow";
import { Button } from "@/components/ui/button";
import { Download, LogIn } from "lucide-react";
import { handleDownload } from "@/utils/functions/handleDownload";
import { JsonObject, JsonValue } from "@prisma/client/runtime/library";
import { recordWorkflowDownload } from "@/utils/actions";
import { toast } from "sonner";
import { useAuth, SignInButton } from "@clerk/nextjs";

interface WorkflowJsonDownloadButtonProps {
  workflowContent: string | JsonValue | JsonObject;
  workflowId: string;
  title?: string;
}

export const WorkflowJsonDownloadButton = ({
  workflowContent,
  workflowId,
  title = "n8n-Workflow",
}: WorkflowJsonDownloadButtonProps) => {
  const { isSignedIn } = useAuth();
  const formattedWorkflow = getFormattedWorkflow(workflowContent);

  // Updated function to handle download and record it
  const handleDownloadAndRecord = async () => {
    // First handle the actual download
    handleDownload(formattedWorkflow, title);

    // Then record the download in the database
    try {
      const result = await recordWorkflowDownload(workflowId);
      if (result.message) {
        toast.success("Workflow added to your downloads");
      }
    } catch (error) {
      console.error("Failed to record download:", error);
      // Still allow the download even if recording fails
    }
  };

  // If user is not signed in, show sign in button
  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 ml-auto border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-colors"
        >
          <LogIn className="h-4 w-4" />
          <span>Sign In to Download</span>
        </Button>
      </SignInButton>
    );
  }

  // If user is signed in, show download button
  return (
    <Button
      variant="default"
      size="sm"
      onClick={handleDownloadAndRecord}
      className="gap-1.5 ml-auto"
    >
      <Download className="h-4 w-4" />
      <span>Download Workflow</span>
    </Button>
  );
};
