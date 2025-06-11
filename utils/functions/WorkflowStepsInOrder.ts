// utils/functions/WorkflowStepsInOrder.ts

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
  isDependency?: boolean; // True if this node is a dependency like an AI Model
}

/**
 * Creates a sequential "build order" for an n8n workflow, ideal for teaching.
 * It performs a Depth-First Search on the main data flow, then intelligently inserts
 * dependency nodes (like AI Models) immediately after the node that uses them,
 * ensuring each node appears only once.
 *
 * @param workflowJson The n8n workflow JSON object.
 * @returns An array of nodes in a sequential, human-friendly build order.
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

  // --- 2. Build Separate Graph Structures for Main Flow and Dependencies ---
  const mainAdjacencyList = new Map<string, string[]>();
  const parentMap = new Map<string, string[]>();
  const dependencyMap = new Map<string, string[]>();

  executableNodes.forEach((node) => {
    mainAdjacencyList.set(node.id, []);
    parentMap.set(node.id, []);
    dependencyMap.set(node.id, []);
  });

  for (const sourceName in connections) {
    const sourceId = nameToIdMap.get(sourceName);
    if (!sourceId) continue;

    for (const outputType in connections[sourceName]) {
      for (const group of connections[sourceName][outputType]) {
        for (const targetInfo of group) {
          const targetId = nameToIdMap.get(targetInfo.node);
          if (targetId) {
            if (outputType === "main") {
              mainAdjacencyList.get(sourceId)?.push(targetId);
              parentMap.get(targetId)?.push(sourceId);
            } else {
              dependencyMap.get(targetId)?.push(sourceId);
            }
          }
        }
      }
    }
  }

  // --- 3. DFS Traversal on the MAIN flow ONLY ---
  const mainFlowOrder: WorkflowNode[] = [];
  const visitedMainFlow = new Set<string>();

  const dfs = (nodeId: string) => {
    if (visitedMainFlow.has(nodeId)) return;

    const node = nodeMap.get(nodeId);
    if (!node) return;

    const nodeParents = parentMap.get(nodeId) || [];
    if (nodeParents.length > 1) {
      const allParentsVisited = nodeParents.every((pId) =>
        visitedMainFlow.has(pId)
      );
      if (!allParentsVisited) return;
    }

    visitedMainFlow.add(nodeId);
    mainFlowOrder.push(node);

    const children = mainAdjacencyList.get(nodeId) || [];
    for (const childId of children) {
      dfs(childId);
    }
  };

  const startNodes = executableNodes.filter(
    (node) => (parentMap.get(node.id)?.length || 0) === 0
  );
  for (const startNode of startNodes) {
    dfs(startNode.id);
  }

  let previouslyVisitedCount;
  do {
    previouslyVisitedCount = visitedMainFlow.size;
    const currentOrderIds = mainFlowOrder.map((n) => n.id);
    for (const nodeId of currentOrderIds) {
      const children = mainAdjacencyList.get(nodeId) || [];
      for (const childId of children) {
        dfs(childId);
      }
    }
  } while (visitedMainFlow.size > previouslyVisitedCount);

  // --- 4. Final Assembly: Insert Dependencies and Prevent Duplicates ---
  const finalBuildOrder: OrderedWorkflowStep[] = [];
  const addedToFinalList = new Set<string>(); // THE CRITICAL FIX

  for (const node of mainFlowOrder) {
    // Add the main flow node if it hasn't been added yet
    if (!addedToFinalList.has(node.id)) {
      finalBuildOrder.push({
        ...node,
        stepNumber: 0,
        isTrigger: node.type.includes("Trigger"),
        isMergeNode: (parentMap.get(node.id)?.length || 0) > 1,
        isDependency: false,
      });
      addedToFinalList.add(node.id);
    }

    // Check if this node has dependencies and insert them immediately after
    const dependencies = dependencyMap.get(node.id) || [];
    for (const depId of dependencies) {
      // ONLY add the dependency if it has NOT been added to the final list before
      if (!addedToFinalList.has(depId)) {
        const depNode = nodeMap.get(depId);
        if (depNode) {
          finalBuildOrder.push({
            ...depNode,
            stepNumber: 0,
            isTrigger: false,
            isMergeNode: false,
            isDependency: true,
          });
          addedToFinalList.add(depId); // Mark it as added
        }
      }
    }
  }

  // Return the final list with corrected, sequential step numbers.
  return finalBuildOrder.map((step, index) => ({
    ...step,
    stepNumber: index + 1,
  }));
}

/**
 * Gets workflow execution statistics.
 */
 
export function getWorkflowStats(workflowJson: WorkflowJson | any) {
  const orderedSteps = getWorkflowStepsInOrder(workflowJson);
  
  return {
    totalSteps: orderedSteps.length,
    triggerSteps: orderedSteps.filter(step => step.isTrigger).length,
    actionSteps: orderedSteps.filter(step => !step.isTrigger).length,
    disconnectedSteps: orderedSteps.filter(step => step.isDisconnected).length,
    startingSteps: orderedSteps.filter(step => step.isStartingNode).length,
    nodeTypes: [...new Set(orderedSteps.map(step => step.type))],
   complexity: orderedSteps.length <= 5 ? 'Beginner Friendly' : orderedSteps.length <= 15 ? 'Intermediate' : 'Advanced'
  };
}

/**
 * Gets a simplified array of step names in their correct build order.
 */
export function getWorkflowStepNames(
  workflowJson: WorkflowJson | any
): string[] {
  const orderedSteps = getWorkflowStepsInOrder(workflowJson);
  return orderedSteps.map((step) => step.name);
}

/**
 * Gets only the trigger nodes from a workflow.
 */
export function getWorkflowTriggers(
  workflowJson: WorkflowJson | any
): OrderedWorkflowStep[] {
  const orderedSteps = getWorkflowStepsInOrder(workflowJson);
  return orderedSteps.filter((step) => step.isTrigger);
}

// Export as default
export default getWorkflowStepsInOrder;
