import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sparkles,
  ExternalLink,
  ArrowDown,
  FileCode,
  LifeBuoy,
  Download,
  Copy,
  Check,
  FileJson,
  Server,
  Workflow,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type WorkflowDownloadDialogProps = {
  workflow: unknown; // Your workflow JSON or object
  title?: string;
  className?: string;
};

export function WorkflowDownloadDialog({
  workflow,
  title = "n8n Workflow",
}: WorkflowDownloadDialogProps) {
  const [copied, setCopied] = useState(false);


  // Format the workflow JSON for display
  const getFormattedWorkflow = () => {
    try {
      // If it's already a string, try to parse and re-stringify for formatting
      if (typeof workflow === "string") {
        const parsed = JSON.parse(workflow);
        return JSON.stringify(parsed, null, 2);
      }
      // If it's an object, stringify it with formatting
      return JSON.stringify(workflow, null, 2);
    } catch (error) {
      console.log(error);
      // If there's an error, return as is
      return typeof workflow === "string" ? workflow : JSON.stringify(workflow);
    }
  };

  const formattedWorkflow = getFormattedWorkflow();

  // Get workflow metadata
  const getWorkflowInfo = () => {
    try {
      const data =
        typeof workflow === "string" ? JSON.parse(workflow) : workflow;

      return {
        name: data.name || "Unnamed Workflow",
        nodeCount: Array.isArray(data.nodes) ? data.nodes.length : 0,
        connectionCount: Array.isArray(data.connections)
          ? data.connections.length
          : 0,
        hasConnections: !!data.connections,
        tags: Array.isArray(data.tags) ? data.tags : [],
        nodes: Array.isArray(data.nodes) ? data.nodes : [],
        description: data.description || "No description available",
      };
    } catch (error) {
      console.log(error);
      return {
        name: "Unknown Workflow",
        nodeCount: 0,
        connectionCount: 0,
        hasConnections: false,
        tags: [],
        nodes: [],
        description: "No description available",
      };
    }
  };

  const workflowInfo = getWorkflowInfo();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedWorkflow);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  // Download the workflow as a JSON file
  const handleDownload = () => {
    const blob = new Blob([formattedWorkflow], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `n8n-workflow-${title
      .replace(/\s+/g, "-")
      .toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Group nodes by type
  const getNodeTypes = () => {
    interface Node {
      type?: string;
    }

    const nodeTypes: Record<string, number> = {};

    workflowInfo.nodes.forEach((node: Node) => {
      const type = node.type || "Unknown";
      nodeTypes[type] = (nodeTypes[type] || 0) + 1;
    });
    return nodeTypes;
  };

  const nodeTypes = getNodeTypes();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="default"
          size="lg"
          className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 scale-100 hover:scale-105"
        >
          <span className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary/30 to-primary/10 opacity-0 blur group-hover:opacity-100 transition duration-700 group-hover:duration-200" />
          <Download className="h-4 w-4 mr-2 animate-pulse" />
          <span className="relative">Download Workflow</span>
          <ArrowDown className="h-3 w-3 ml-2 opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-0 group-hover:translate-y-1 duration-300" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl shadow-xl border-primary/80 border-4 p-0 overflow-hidden rounded-xl bg-background/95 backdrop-blur-sm">
        <div className="flex flex-col h-full">
          {/* Enhanced header with better gradient background */}
          <DialogHeader className="p-6 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent border-b border-primary/20">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-foreground flex items-center">
                <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20 mr-3">
                  <Workflow className="h-5 w-5 text-primary" />
                </div>
                <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {title || "Download n8n Workflow"}
                </span>
              </DialogTitle>
            </div>
          </DialogHeader>

          {/* Content area with improved background */}
          <div className="flex-1 p-4 max-h-[75vh] overflow-auto bg-gradient-to-b from-card/30 to-background/80">
            <Tabs
              defaultValue="preview"
              className="w-full"
      
            >
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="preview">Workflow Preview</TabsTrigger>
                <TabsTrigger value="json">JSON Code</TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="space-y-4">
                <div className="mb-6 bg-primary/5 border border-primary/10 rounded-lg p-4">
                  <h3 className="flex items-center text-sm font-medium text-primary mb-2">
                    <FileCode className="h-4 w-4 mr-2" />
                    {workflowInfo.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {workflowInfo.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-primary/5 rounded-lg p-4 flex items-center gap-3 border border-primary/10">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Server className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Nodes
                      </p>
                      <p className="text-lg font-bold">
                        {workflowInfo.nodeCount}
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4 flex items-center gap-3 border border-primary/10">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <FileJson className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Connections
                      </p>
                      <p className="text-lg font-bold">
                        {workflowInfo.connectionCount}
                      </p>
                    </div>
                  </div>

                  <div className="bg-primary/5 rounded-lg p-4 flex items-center gap-3 border border-primary/10">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Sparkles className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Compatible
                      </p>
                      <p className="text-lg font-bold">n8n</p>
                    </div>
                  </div>
                </div>

                {workflowInfo.tags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Tags:</p>
                    <div className="flex flex-wrap gap-1">
                        {workflowInfo.tags.map((tag: string, index: number) => (
                        <Badge
                          key={index}
                          className="bg-primary/20 text-primary hover:bg-primary/30"
                        >
                          {tag}
                        </Badge>
                        ))}
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-sm font-medium mb-2">Node Types:</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(nodeTypes).map(([type, count], index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-muted/20 rounded border border-primary/10"
                      >
                        <span className="text-sm">{type}</span>
                        <Badge variant="outline">{count}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleDownload}
                    className="w-full max-w-md mt-4 gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                    size="lg"
                  >
                    <Download className="h-5 w-5 mr-1" />
                    Download Workflow
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="json">
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex items-center">
                    <FileJson className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-sm font-medium">Workflow JSON</h3>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="gap-1.5 border-primary/20"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          <span>Copy Code</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                      className="gap-1.5 border-primary/20"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>

                <div className="border border-primary/10 rounded-lg overflow-hidden bg-muted/5">
                  <ScrollArea className="h-[350px] w-full">
                    <pre className="p-4 text-sm font-mono whitespace-pre overflow-auto">
                      {formattedWorkflow}
                    </pre>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Enhanced footer with better styling and more information */}
          <DialogFooter className="flex justify-between items-center p-4 border-t border-primary/10 bg-gradient-to-r from-muted/30 to-transparent">
            <div className="hidden items-center mr-auto sm:flex">
              <LifeBuoy className="h-4 w-4 text-primary/60 mr-2" />
              <p className="text-xs text-muted-foreground">
                Need help?{" "}
                <a
                  href="#"
                  className="text-primary underline hover:text-primary/80 inline-flex items-center"
                >
                  View Documentation <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </p>
            </div>
            <div className="flex gap-2">
              <a
                href="#"
                className="text-xs text-primary hover:text-primary/80 underline mr-4 hidden sm:inline-flex items-center"
              >
                How to import in n8n <ExternalLink className="h-3 w-3 ml-1" />
              </a>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50 transition-colors"
                >
                  Close
                </Button>
              </DialogClose>
            </div>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
