// utils/functions/identifyService.ts
import  nodeTypeToServiceName  from './nodeTypeToServiceName';

interface WorkflowStep {
  id: string;
  name: string;
  type: string;
  nodeType?:string;
  parameters?: any;
  credentials?: any;
  typeVersion?: number;
  position?: [number, number];
}

interface ServiceInfo {
  serviceName: string;
  hostIdentifier: string | null; // Change from string? to string | null
  nodeType: string;
}

/**
 * Identify service information from a workflow step
 * Handles both direct nodes and HTTP requests
 */
export function identifyService(step: WorkflowStep): ServiceInfo {
  const nodeType = step.type || step.nodeType;
  
  // For HTTP requests, try to extract service from URL
  if (nodeType === 'n8n-nodes-base.httpRequest') {
    const hostIdentifier = extractHostFromHttpStep(step);
    const serviceName = hostIdentifier ? extractServiceFromHost(hostIdentifier) : 'http-request';
    
    return {
      serviceName,
      hostIdentifier: hostIdentifier || null, // Explicit null
      nodeType
    };
  }
  
  // For direct nodes, transform the node type
  const serviceName = nodeTypeToServiceName(nodeType);
  
  return {
    serviceName,
    hostIdentifier: null, // Explicit null for direct nodes
    nodeType
  };
}

/**
 * Helper: Extract host from HTTP step parameters
 */
function extractHostFromHttpStep(step: WorkflowStep): string | undefined {
  try {
    const url = step.parameters?.url;
    if (!url || typeof url !== 'string') return undefined;
    
    // Handle n8n template expressions - remove leading = if present
    let cleanUrl = url;
    if (cleanUrl.startsWith('=')) {
      cleanUrl = cleanUrl.substring(1);
    }
    
    // Extract the base URL before any template expressions
    const urlMatch = cleanUrl.match(/https?:\/\/([^\/\{\s]+)/);
    if (urlMatch) {
      return urlMatch[1]; // Return just the hostname
    }
    
    // If no protocol, try to extract hostname directly
    const hostnameMatch = cleanUrl.match(/^([^\/\{\s]+)/);
    if (hostnameMatch) {
      return hostnameMatch[1];
    }
    
    return undefined;
  } catch {
    return undefined;
  }
}

/**
 * Helper: Extract service name from hostname
 * api.openai.com -> openai
 * api.hedra.com -> hedra
 * googleapis.com -> google-apis
 */


function extractServiceFromHost(hostname: string): string {
  // Remove common prefixes
  const serviceName = hostname
    .replace(/^(api\.|www\.|m\.)/, '') // Remove api., www., m. prefixes
    .replace(/\.com$|\.io$|\.net$|\.org$/, ''); // Remove common TLDs
  
  // Handle special cases
  if (serviceName.includes('googleapis')) return 'google-apis';
  if (serviceName.includes('openai')) return 'openai';
  if (serviceName.includes('anthropic')) return 'anthropic';
  if (serviceName.includes('elevenlabs')) return 'elevenlabs';
  
  // Get the main part (e.g., "hedra" from "hedra" or "sub.hedra")
  const parts = serviceName.split('.');
  return parts[parts.length - 1] || serviceName;
}

