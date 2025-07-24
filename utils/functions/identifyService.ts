// utils/functions/identifyService.ts

import { ServiceInfo, WorkflowStepLike } from '../types';
import nodeTypeToServiceName from './nodeTypeToServiceName';

// Use a more flexible interface that matches both OrderedWorkflowStep and WorkflowStep


/**
 * Identify service information from a workflow step
 * Handles both direct nodes and HTTP requests
 */
export function identifyService(step: WorkflowStepLike): ServiceInfo {
  // Handle both .type and .nodeType properties - nodeType is primary
  const nodeType = step.nodeType || step.type || '';
  
  // For HTTP requests, try to extract service from URL
  if (nodeType === 'n8n-nodes-base.httpRequest') {
    const hostIdentifier = extractHostFromHttpStep(step);
    const serviceName = hostIdentifier ? extractServiceFromHost(hostIdentifier) : 'http-request';
    
    return {
      serviceName,
      hostIdentifier: hostIdentifier || null,
      nodeType
    };
  }
  
  // For direct nodes, transform the node type
  const serviceName = nodeTypeToServiceName(nodeType);
  
  return {
    serviceName,
    hostIdentifier: null,
    nodeType
  };
}

/**
 * Helper: Extract host from HTTP step parameters
 */
function extractHostFromHttpStep(step: WorkflowStepLike): string | null {
  try {
    const parameters = step?.parameters as { url?: unknown } | undefined;
    const url = parameters?.url;
    if (!url || typeof url !== 'string') return null;
    
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
    
    return null;
  } catch {
    return null;
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