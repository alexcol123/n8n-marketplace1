// utils/nodeImages.ts
export function getDefaultNodeImage(nodeType: string): string {
  const baseUrl = "/nodeImages";

  // Direct mapping from node type to image
  const nodeTypeImages: Record<string, string> = {
    // Langchain Nodes
    "@n8n/n8n-nodes-langchain.agent": `${baseUrl}/@n8n:n8n-nodes-langchain.agent.png`,
    "@n8n/n8n-nodes-langchain.lmChatOpenAi": `${baseUrl}/@n8n:n8n-nodes-langchain.lmChatOpenAi.png`,
    "@n8n/n8n-nodes-langchain.openAi": `${baseUrl}/@n8n:n8n-nodes-langchain.openAi.png`,

    // Base Nodes
    "n8n-nodes-base.code": `${baseUrl}/n8n-nodes-base.code.png`,
    "n8n-nodes-base.convertToFile": `${baseUrl}/n8n-nodes-base.convertToFile.png`,
    "n8n-nodes-base.formTrigger": `${baseUrl}/n8n-nodes-base.formTrigger.png`,
    "n8n-nodes-base.gmail": `${baseUrl}/n8n-nodes-base.gmail.png`,
    "n8n-nodes-base.googleDrive": `${baseUrl}/n8n-nodes-base.googleDrive.png`,
    "n8n-nodes-base.httpRequest": `${baseUrl}/n8n-nodes-base.httpRequest.png`,
    "n8n-nodes-base.if": `${baseUrl}/n8n-nodes-base.if.png`,
    "n8n-nodes-base.merge": `${baseUrl}/n8n-nodes-base.merge.png`,
    "n8n-nodes-base.wait": `${baseUrl}/n8n-nodes-base.wait.png`,
  };

  // Return specific image or fallback to default
  return nodeTypeImages[nodeType] || "";
}
