import { identifyService } from "./identifyService";

export function extractRequiredApiServices(workflowJson) {
  const services = new Set();
  
  if (workflowJson.nodes && Array.isArray(workflowJson.nodes)) {
    workflowJson.nodes.forEach(node => {
      // Skip sticky notes
      if (node.type && !node.type.includes('stickyNote')) {
        
        // Create a step-like object for identifyService
        const stepLike = {
          nodeType: node.type,
          type: node.type,
          parameters: node.parameters || {}
        };
        
        const serviceInfo = identifyService(stepLike);
        
        // Add raw service name to set (no display conversion)
        if (serviceInfo.serviceName && serviceInfo.serviceName !== 'unknown') {
          services.add(serviceInfo.serviceName);
        }
      }
    });
  }
  
  return Array.from(services); // Returns ["openai", "hedra", "elevenlabs", "google-drive"]
}