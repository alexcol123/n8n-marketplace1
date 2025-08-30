import { identifyService } from "./identifyService";

export function extractRequiredApiServices(workflowJson) {

  // Safety check - return empty array if no valid workflowJson
  if (!workflowJson || typeof workflowJson !== "object") {
    return [];
  }

  const services = new Set();

  // Define n8n built-in nodes that don't require external APIs
  const builtInNodes = [
    "wait",
    "if",
    "code",
    "merge",
    "set",
    "filter",
    "sort",
    "switch",
    "split-in-batches",
    "item-lists",
    "aggregate",
    "convert-to-file",
    "no-op",
    "stop-and-error",
    "form-trigger",
    "manual-trigger",
    "cron-trigger",
    "interval-trigger",
    "webhook",
    "respond-to-webhook",
    "http-request",
    "edit-image",
    "xml",
    "html",
    "markdown",
    "crypto",
    "date-time",
    "rss",
  ];

  // Also check if nodes exists and is an array
  if (workflowJson.nodes && Array.isArray(workflowJson.nodes)) {
    workflowJson.nodes.forEach((node) => {
      // Skip sticky notes and built-in nodes
      if (node.type && !node.type.includes("stickyNote")) {
        const stepLike = {
          nodeType: node.type,
          type: node.type,
          parameters: node.parameters || {},
        };

        const serviceInfo = identifyService(stepLike);

        // Only add external API services (skip built-in n8n nodes)
        if (
          serviceInfo.serviceName &&
          serviceInfo.serviceName !== "unknown" &&
          !builtInNodes.includes(serviceInfo.serviceName)
        ) {
          services.add(serviceInfo.serviceName);
        }
      }
    });
  }

  return Array.from(services);
}
