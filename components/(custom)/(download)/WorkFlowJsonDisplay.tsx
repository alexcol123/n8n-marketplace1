
//  workflowId :string

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Copy, Check, Code, Eye, EyeOff, FileCode, ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { JsonObject, JsonValue } from "@prisma/client/runtime/library";
import { getFormattedWorkflow } from "@/utils/functions/getFormattedWorkflow";

import { WorkflowJsonDownloadButton } from "./WorkflowJsonDownloadButton";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

interface WorkflowJsonDisplayProps {
  workflowContent: string | JsonObject | JsonValue;
  title?: string;
  workflowId: string
}

const WorkflowJsonDisplay = ({
  workflowContent,
  title = "Workflow",
  workflowId
}: WorkflowJsonDisplayProps) => {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const { isSignedIn } = useAuth();

  // Format the workflow JSON for display
  const formattedWorkflow = getFormattedWorkflow(workflowContent);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedWorkflow);
      setCopied(true);
      toast.success("JSON copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
      toast.error("Failed to copy text");
    }
  };

  // Get workflow metadata for tags only
  const getWorkflowInfo = () => {
    try {
      const data =
        typeof workflowContent === "string"
          ? JSON.parse(workflowContent)
          : workflowContent;

      return {
        name: data.name || "Unnamed Workflow",
        tags: Array.isArray(data.tags) ? data.tags : [],
      };
    } catch (error) {
      console.log(error);
      return {
        name: "Unknown Workflow",
        tags: [],
      };
    }
  };

  const workflowInfo = getWorkflowInfo();

  return (
    <Card className="border-primary/20 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 w-full">
      <CardHeader className="bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border-b border-primary/10 pb-4 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="p-2.5 bg-primary/15 rounded-full shadow-md shrink-0 flex items-center justify-center w-10 h-10">
            <FileCode className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-bold truncate">
              {title}
            </CardTitle>
            <CardDescription className="mt-1 text-xs sm:text-sm text-muted-foreground/90">
              Import this automation into your n8n workflow editor
            </CardDescription>
          </div>
        </div>
        
        {/* Display tags if available */}
        {workflowInfo.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {workflowInfo.tags.map((tag: string, index: number) => (
              <Badge 
                key={index} 
                className="bg-primary/10 text-primary border-primary/20"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-5 px-4 sm:px-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {isSignedIn && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsVisible(!isVisible)}
                className="gap-1 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all duration-200 flex-shrink-0"
              >
                {isVisible ? (
                  <>
                    <EyeOff className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Hide JSON</span>
                    <span className="sm:hidden">Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">View JSON</span>
                    <span className="sm:hidden">View</span>
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="gap-1 border-primary/20 hover:bg-primary/5 hover:text-primary hover:border-primary/40 transition-all duration-200 flex-shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                    <span className="hidden sm:inline">Copied!</span>
                    <span className="sm:hidden">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 flex-shrink-0" />
                    <span className="hidden sm:inline">Copy JSON</span>
                    <span className="sm:hidden">Copy</span>
                  </>
                )}
              </Button>
            </>
          )}

          <WorkflowJsonDownloadButton
            workflowContent={workflowContent}
            title={title}
            workflowId={workflowId}
          />
        </div>

        {isVisible && (
          <div className="border rounded-lg overflow-hidden bg-muted/5 border-primary/10 shadow-md">
            <div className="bg-primary/10 px-4 py-2.5 border-b border-primary/20 flex items-center justify-between">
              <div className="flex items-center">
                <Code className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                <span className="text-sm font-medium">Workflow Definition</span>
              </div>
              <Badge
                variant="outline"
                className="text-xs font-mono bg-primary/5 border-primary/20 ml-2 flex-shrink-0"
              >
                JSON
              </Badge>
            </div>
            <ScrollArea className="h-40 sm:h-72 w-full">
              <pre className="p-4 text-xs sm:text-sm font-mono whitespace-pre overflow-auto bg-gradient-to-b from-transparent to-muted/5 max-w-full">
                {formattedWorkflow}
              </pre>
            </ScrollArea>
            
            {/* Mobile-friendly help text */}
            <div className="py-2 px-3 text-xs text-center text-muted-foreground border-t border-primary/10 sm:hidden">
              <div className="flex items-center justify-center gap-2">
                <ExternalLink className="h-3 w-3" />
                <span>Scroll horizontally to view full code</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkflowJsonDisplay;