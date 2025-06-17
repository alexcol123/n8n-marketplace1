// utils/functions/WorkflowStepsInOrder.ts - Enhanced with Connection Information

export interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  parameters?: Record<string, unknown>;
  position: [number, number];
  [key: string]: unknown;
}

export interface WorkflowConnections {
  [nodeName: string]: {
    [outputType: string]: Array<
      Array<{
        node: string;
        type: string;
        index: number;
      }>
    >;
  };
}

export interface ConnectionInfo {
  // What this step connects TO (outgoing connections)
  connectsTo: Array<{
    targetNodeName: string;
    outputType: string; // 'main', 'ai_languageModel', etc.
    outputIndex: number; // Which output port (0, 1, 2...)
    targetInputIndex: number; // Which input port on target
    connectionType: 'main_flow' | 'dependency' | 'conditional'; // Type of connection
  }>;
  
  // What connects TO this step (incoming connections)
  connectsFrom: Array<{
    sourceNodeName: string;
    outputType: string;
    outputIndex: number;
    inputIndex: number;
    connectionType: 'main_flow' | 'dependency' | 'conditional';
  }>;
  
  // Helper text for users
  nextSteps: string[]; // Human-readable next steps
  previousSteps: string[]; // Human-readable previous steps
  connectionInstructions: string; // Specific instructions for this step
}

export interface WorkflowJson {
  nodes: WorkflowNode[];
  connections: WorkflowConnections;
  name?: string;
  active?: boolean;
  settings?: Record<string, unknown>;
  tags?: string[];
  [key: string]: unknown;
}

export interface OrderedWorkflowStep extends WorkflowNode {
  stepNumber: number;
  isTrigger: boolean;
  isMergeNode: boolean;
  isDependency?: boolean;
  isReturnStep?: boolean;
  returnToNodeName?: string;
  connectionInfo: ConnectionInfo; // ✅ NEW: Connection information
}

/**
 * Creates a sequential "build order" for an n8n workflow with detailed connection information.
 */
export function getWorkflowStepsInOrder(
  workflowJson: WorkflowJson | any
): OrderedWorkflowStep[] {
  if (!workflowJson || !workflowJson.nodes || !workflowJson.connections) {
    console.error(
      "Invalid workflow JSON: 'nodes' or 'connections' property is missing."
    );
    return [];
  }

  const { nodes, connections } = workflowJson;

  // --- 1. Pre-processing ---
  const executableNodes = nodes.filter(
    (node: WorkflowNode) => !node.type.includes("StickyNote")
  );
  const nodeMap = new Map<string, WorkflowNode>(
    executableNodes.map((node) => [node.id, node])
  );
  const nameToIdMap = new Map<string, string>(
    executableNodes.map((node) => [node.name, node.id])
  );

  // --- 2. Build Graph Structures ---
  const mainAdjacencyList = new Map<string, string[]>();
  const parentMap = new Map<string, string[]>();
  const dependencyMap = new Map<string, string[]>();
  
  // ✅ NEW: Connection details tracking
  const connectionDetails = new Map<string, {
    outgoing: Array<{
      targetId: string;
      targetName: string;
      outputType: string;
      outputIndex: number;
      targetInputIndex: number;
    }>;
    incoming: Array<{
      sourceId: string;
      sourceName: string;
      outputType: string;
      outputIndex: number;
      inputIndex: number;
    }>;
  }>();

  executableNodes.forEach((node) => {
    mainAdjacencyList.set(node.id, []);
    parentMap.set(node.id, []);
    dependencyMap.set(node.id, []);
    connectionDetails.set(node.id, { outgoing: [], incoming: [] });
  });

  // ✅ ENHANCED: Build connection maps with detailed information
  for (const sourceName in connections) {
    const sourceId = nameToIdMap.get(sourceName);
    if (!sourceId) continue;

    for (const outputType in connections[sourceName]) {
      const outputGroups = connections[sourceName][outputType];
      
      outputGroups.forEach((group, outputIndex) => {
        group.forEach((targetInfo) => {
          const targetId = nameToIdMap.get(targetInfo.node);
          if (targetId) {
            // Store detailed connection info
            connectionDetails.get(sourceId)?.outgoing.push({
              targetId,
              targetName: targetInfo.node,
              outputType,
              outputIndex,
              targetInputIndex: targetInfo.index
            });
            
            connectionDetails.get(targetId)?.incoming.push({
              sourceId,
              sourceName,
              outputType,
              outputIndex,
              inputIndex: targetInfo.index
            });

            // Build adjacency lists
            if (outputType === "main") {
              mainAdjacencyList.get(sourceId)?.push(targetId);
              parentMap.get(targetId)?.push(sourceId);
            } else {
              dependencyMap.get(targetId)?.push(sourceId);
            }
          }
        });
      });
    }
  }

  // --- 3. Enhanced DFS with Connection Information ---
  const finalBuildOrder: OrderedWorkflowStep[] = [];
  const visitedMainFlow = new Set<string>();
  const addedToFinalList = new Set<string>();
  const processing = new Set<string>();

  const dfs = (nodeId: string): void => {
    if (visitedMainFlow.has(nodeId) || processing.has(nodeId)) return;

    const node = nodeMap.get(nodeId);
    if (!node) return;

    const nodeParents = parentMap.get(nodeId) || [];
    if (nodeParents.length > 1) {
      const allParentsVisited = nodeParents.every((pId) =>
        visitedMainFlow.has(pId)
      );
      if (!allParentsVisited) return;
    }

    processing.add(nodeId);
    visitedMainFlow.add(nodeId);

    if (!addedToFinalList.has(nodeId)) {
      // ✅ NEW: Generate connection information for this step
      const connectionInfo = generateConnectionInfo(
        nodeId, 
        node, 
        connectionDetails, 
        nodeMap
      );

      finalBuildOrder.push({
        ...node,
        stepNumber: 0,
        isTrigger: node.type.includes("Trigger"),
        isMergeNode: nodeParents.length > 1,
        isDependency: false,
        isReturnStep: false,
        connectionInfo // ✅ NEW: Add connection info
      });
      addedToFinalList.add(nodeId);

      // Add dependencies
      const dependencies = dependencyMap.get(nodeId) || [];
      for (const depId of dependencies) {
        if (!addedToFinalList.has(depId)) {
          const depNode = nodeMap.get(depId);
          if (depNode) {
            const depConnectionInfo = generateConnectionInfo(
              depId, 
              depNode, 
              connectionDetails, 
              nodeMap
            );

            finalBuildOrder.push({
              ...depNode,
              stepNumber: 0,
              isTrigger: false,
              isMergeNode: false,
              isDependency: true,
              isReturnStep: false,
              connectionInfo: depConnectionInfo
            });
            addedToFinalList.add(depId);
          }
        }
      }
    }

    // Handle branching logic (same as before)
    const children = mainAdjacencyList.get(nodeId) || [];
    
    if (children.length > 1) {
      let isTrueBranching = false;
      
      if (node.type === "n8n-nodes-base.if" || node.type === "n8n-nodes-base.switch") {
        isTrueBranching = true;
      } else {
        for (const sourceName in connections) {
          const sourceId = nameToIdMap.get(sourceName);
          if (sourceId === nodeId) {
            for (const outputType in connections[sourceName]) {
              if (outputType === "main") {
                const groups = connections[sourceName][outputType];
                if (groups.length > 1) {
                  isTrueBranching = true;
                } else if (groups.length === 1 && groups[0].length > 1) {
                  const indices = groups[0].map(t => t.index);
                  const allSameIndex = indices.every(idx => idx === indices[0]);
                  if (allSameIndex && indices[0] === 0) {
                    isTrueBranching = true;
                  }
                }
              }
            }
          }
        }
      }
      
      if (isTrueBranching) {
        for (let i = 0; i < children.length; i++) {
          const childId = children[i];
          dfs(childId);
          
          if (i < children.length - 1) {
            // ✅ NEW: Return step with connection info
            const returnConnectionInfo = generateReturnStepConnectionInfo(node);
            
            finalBuildOrder.push({
              ...node,
              id: `${nodeId}_return_${i}`,
              name: node.name,
              type: node.type,
              position: node.position,
              stepNumber: 0,
              isTrigger: false,
              isMergeNode: false,
              isDependency: false,
              isReturnStep: true,
              returnToNodeName: node.name,
              connectionInfo: returnConnectionInfo
            });
          }
        }
      } else {
        for (const childId of children) {
          dfs(childId);
        }
      }
    } else if (children.length === 1) {
      dfs(children[0]);
    }

    processing.delete(nodeId);
  };

  // Start DFS from trigger/starting nodes
  const startNodes = executableNodes.filter(
    (node) => (parentMap.get(node.id)?.length || 0) === 0
  );
  
  for (const startNode of startNodes) {
    dfs(startNode.id);
  }

  // Handle remaining unvisited nodes
  let iterationCount = 0;
  const maxIterations = executableNodes.length * 2;
  
  while (visitedMainFlow.size < executableNodes.length && iterationCount < maxIterations) {
    iterationCount++;
    const previousVisitedCount = visitedMainFlow.size;
    
    for (const node of executableNodes) {
      if (!visitedMainFlow.has(node.id)) {
        const nodeParents = parentMap.get(node.id) || [];
        const canProcess = nodeParents.length === 0 || 
          nodeParents.some(parentId => visitedMainFlow.has(parentId));
        
        if (canProcess) {
          dfs(node.id);
        }
      }
    }
    
    if (visitedMainFlow.size === previousVisitedCount) {
      for (const node of executableNodes) {
        if (!visitedMainFlow.has(node.id)) {
          const connectionInfo = generateConnectionInfo(
            node.id, 
            node, 
            connectionDetails, 
            nodeMap
          );

          finalBuildOrder.push({
            ...node,
            stepNumber: 0,
            isTrigger: node.type.includes("Trigger"),
            isMergeNode: false,
            isDependency: false,
            isReturnStep: false,
            connectionInfo
          });
          addedToFinalList.add(node.id);
          visitedMainFlow.add(node.id);
        }
      }
      break;
    }
  }

  return finalBuildOrder.map((step, index) => ({
    ...step,
    stepNumber: index + 1,
  }));
}

// ✅ NEW: Generate connection information for a step
function generateConnectionInfo(
  nodeId: string,
  node: WorkflowNode,
  connectionDetails: Map<string, any>,
  nodeMap: Map<string, WorkflowNode>
): ConnectionInfo {
  const details = connectionDetails.get(nodeId);
  if (!details) {
    return {
      connectsTo: [],
      connectsFrom: [],
      nextSteps: [],
      previousSteps: [],
      connectionInstructions: "No connections found for this step."
    };
  }

  // Build connectsTo array
  const connectsTo = details.outgoing.map((conn: any) => ({
    targetNodeName: conn.targetName,
    outputType: conn.outputType,
    outputIndex: conn.outputIndex,
    targetInputIndex: conn.targetInputIndex,
    connectionType: getConnectionType(conn.outputType)
  }));

  // Build connectsFrom array
  const connectsFrom = details.incoming.map((conn: any) => ({
    sourceNodeName: conn.sourceName,
    outputType: conn.outputType,
    outputIndex: conn.outputIndex,
    inputIndex: conn.inputIndex,
    connectionType: getConnectionType(conn.outputType)
  }));

  // Generate human-readable instructions
  const nextSteps = connectsTo.map(conn => {
    const portInfo = conn.outputIndex > 0 ? ` (output ${conn.outputIndex})` : '';
    const inputInfo = conn.targetInputIndex > 0 ? ` (input ${conn.targetInputIndex})` : '';
    return `Connect${portInfo} to "${conn.targetNodeName}"${inputInfo}`;
  });

  const previousSteps = connectsFrom.map(conn => {
    const portInfo = conn.outputIndex > 0 ? ` (output ${conn.outputIndex})` : '';
    const inputInfo = conn.inputIndex > 0 ? ` (input ${conn.inputIndex})` : '';
    return `Receives connection${inputInfo} from "${conn.sourceNodeName}"${portInfo}`;
  });

  // Generate specific instructions
  let connectionInstructions = "";
  if (connectsTo.length > 0) {
    if (connectsTo.length === 1) {
      const conn = connectsTo[0];
      connectionInstructions = `Connect the ${getOutputTypeLabel(conn.outputType)} output of "${node.name}" to "${conn.targetNodeName}"`;
    } else {
      connectionInstructions = `Connect "${node.name}" to multiple nodes: ${connectsTo.map(c => c.targetNodeName).join(', ')}`;
    }
  } else if (connectsFrom.length > 0) {
    connectionInstructions = `This step receives data from: ${connectsFrom.map(c => c.sourceNodeName).join(', ')}`;
  } else {
    connectionInstructions = "This step has no connections (isolated node)";
  }

  return {
    connectsTo,
    connectsFrom,
    nextSteps,
    previousSteps,
    connectionInstructions
  };
}

// ✅ NEW: Generate connection info for return steps
function generateReturnStepConnectionInfo(node: WorkflowNode): ConnectionInfo {
  return {
    connectsTo: [],
    connectsFrom: [],
    nextSteps: [`Continue building from "${node.name}"`],
    previousSteps: [`Previous branch from "${node.name}" completed`],
    connectionInstructions: `Navigate back to "${node.name}" in your n8n editor to continue building the next branch of your workflow.`
  };
}

// ✅ NEW: Helper functions
function getConnectionType(outputType: string): 'main_flow' | 'dependency' | 'conditional' {
  if (outputType === 'main') return 'main_flow';
  if (outputType.includes('ai_') || outputType.includes('model')) return 'dependency';
  return 'conditional';
}

function getOutputTypeLabel(outputType: string): string {
  const labels: Record<string, string> = {
    'main': 'main',
    'ai_languageModel': 'AI model',
    'ai_tool': 'AI tool',
    'ai_memory': 'AI memory',
    'ai_outputParser': 'output parser'
  };
  return labels[outputType] || outputType;
}

// Export existing functions with connection info
export function getWorkflowStats(workflowJson: WorkflowJson | any) {
  const orderedSteps = getWorkflowStepsInOrder(workflowJson);
  const actualSteps = orderedSteps.filter(step => !step.isReturnStep);
  const returnSteps = orderedSteps.filter(step => step.isReturnStep);

  return {
    totalSteps: actualSteps.length,
    totalStepsWithReturns: orderedSteps.length,
    returnSteps: returnSteps.length,
    triggerSteps: actualSteps.filter((step) => step.isTrigger).length,
    actionSteps: actualSteps.filter((step) => !step.isTrigger && !step.isDependency).length,
    dependencySteps: actualSteps.filter((step) => step.isDependency).length,
    nodeTypes: [...new Set(actualSteps.map((step) => step.type))],
    complexity:
      actualSteps.length <= 5
        ? "Beginner Friendly"
        : actualSteps.length <= 15
        ? "Intermediate"
        : "Advanced",
  };
}

export function getWorkflowStepNames(workflowJson: WorkflowJson | any): string[] {
  const orderedSteps = getWorkflowStepsInOrder(workflowJson);
  return orderedSteps.map((step) => 
    step.isReturnStep 
      ? `↩️ Return to ${step.returnToNodeName}` 
      : step.name
  );
}

export function getWorkflowTriggers(workflowJson: WorkflowJson | any): OrderedWorkflowStep[] {
  const orderedSteps = getWorkflowStepsInOrder(workflowJson);
  return orderedSteps.filter((step) => step.isTrigger && !step.isReturnStep);
}

export default getWorkflowStepsInOrder;