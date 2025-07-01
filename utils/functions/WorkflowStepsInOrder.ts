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
    connectionType: "main_flow" | "dependency" | "conditional"; // Type of connection
  }>;

  // What connects TO this step (incoming connections)
  connectsFrom: Array<{
    sourceNodeName: string;
    outputType: string;
    outputIndex: number;
    inputIndex: number;
    connectionType: "main_flow" | "dependency" | "conditional";
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
  connectionInfo?: ConnectionInfo;
}

interface ConnectionDetail {
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
}

/**
 * Creates a sequential "build order" for an n8n workflow with detailed connection information.
 */
export function getWorkflowStepsInOrder(
  workflowJson:
    | WorkflowJson
    | Partial<WorkflowJson>
    | Record<string, unknown>
    | null
    | undefined
): OrderedWorkflowStep[] {
  if (!workflowJson || typeof workflowJson !== "object") {
    console.error(
      "Invalid workflow JSON: workflowJson is null, undefined, or not an object."
    );
    return [];
  }

  // Type guard to ensure we have the required properties
  if (!("nodes" in workflowJson) || !("connections" in workflowJson)) {
    console.error(
      "Invalid workflow JSON: 'nodes' or 'connections' property is missing."
    );
    return [];
  }

  const nodes = workflowJson.nodes;
  const connections = workflowJson.connections;

  if (
    !Array.isArray(nodes) ||
    !connections ||
    typeof connections !== "object"
  ) {
    console.error(
      "Invalid workflow JSON: 'nodes' must be an array and 'connections' must be an object."
    );
    return [];
  }

  // --- 1. Pre-processing ---
  const executableNodes = nodes.filter(
    (node): node is WorkflowNode =>
      node &&
      typeof node === "object" &&
      "type" in node &&
      typeof node.type === "string" &&
      !node.type.includes("StickyNote")
  );

  const nodeMap = new Map<string, WorkflowNode>(
    executableNodes.map((node: WorkflowNode) => [node.id, node])
  );
  const nameToIdMap = new Map<string, string>(
    executableNodes.map((node: WorkflowNode) => [node.name, node.id])
  );

  // --- 2. Build Graph Structures ---
  const mainAdjacencyList = new Map<string, string[]>();
  const parentMap = new Map<string, string[]>();
  const dependencyMap = new Map<string, string[]>();

  const connectionDetails = new Map<string, ConnectionDetail>();

  executableNodes.forEach((node: WorkflowNode) => {
    mainAdjacencyList.set(node.id, []);
    parentMap.set(node.id, []);
    dependencyMap.set(node.id, []);
    connectionDetails.set(node.id, { outgoing: [], incoming: [] });
  });

  // Build connection maps with detailed information
  for (const sourceName in connections) {
    // Type guard to ensure connections has the expected structure
    if (
      !connections ||
      typeof connections !== "object" ||
      !(sourceName in connections)
    ) {
      continue;
    }

    const sourceConnections = (connections as Record<string, unknown>)[
      sourceName
    ];
    if (!sourceConnections || typeof sourceConnections !== "object") continue;

    const sourceId = nameToIdMap.get(sourceName);
    if (!sourceId) continue;

    for (const outputType in sourceConnections as Record<string, unknown>) {
      const outputGroups = (sourceConnections as Record<string, unknown>)[
        outputType
      ];
      if (!Array.isArray(outputGroups)) continue;

      outputGroups.forEach(
        (
          group: Array<{ node: string; type: string; index: number }>,
          outputIndex: number
        ) => {
          if (!Array.isArray(group)) return;

          group.forEach(
            (targetInfo: { node: string; type: string; index: number }) => {
              if (
                !targetInfo ||
                typeof targetInfo !== "object" ||
                !targetInfo.node
              )
                return;

              const targetId = nameToIdMap.get(targetInfo.node);
              if (targetId) {
                // Store detailed connection info
                connectionDetails.get(sourceId)?.outgoing.push({
                  targetId,
                  targetName: targetInfo.node,
                  outputType,
                  outputIndex,
                  targetInputIndex: targetInfo.index || 0,
                });

                connectionDetails.get(targetId)?.incoming.push({
                  sourceId,
                  sourceName,
                  outputType,
                  outputIndex,
                  inputIndex: targetInfo.index || 0,
                });

                // Build adjacency lists
                if (outputType === "main") {
                  mainAdjacencyList.get(sourceId)?.push(targetId);
                  parentMap.get(targetId)?.push(sourceId);
                } else {
                  dependencyMap.get(targetId)?.push(sourceId);
                }
              }
            }
          );
        }
      );
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
      const allParentsVisited = nodeParents.every((pId: string) =>
        visitedMainFlow.has(pId)
      );
      if (!allParentsVisited) return;
    }

    processing.add(nodeId);
    visitedMainFlow.add(nodeId);

    if (!addedToFinalList.has(nodeId)) {
      const connectionInfo = generateConnectionInfo(
        nodeId,
        node,
        connectionDetails
      );

      finalBuildOrder.push({
        ...node,
        stepNumber: 0,
        isTrigger: node.type.includes("Trigger"),
        isMergeNode: nodeParents.length > 1,
        isDependency: false,
        isReturnStep: false,
        connectionInfo,
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
              connectionDetails
            );

            finalBuildOrder.push({
              ...depNode,
              stepNumber: 0,
              isTrigger: false,
              isMergeNode: false,
              isDependency: true,
              isReturnStep: false,
              connectionInfo: depConnectionInfo,
            });
            addedToFinalList.add(depId);
          }
        }
      }
    }

    // Handle branching logic
    const children = mainAdjacencyList.get(nodeId) || [];

    if (children.length > 1) {
      let isTrueBranching = false;

      if (
        node.type === "n8n-nodes-base.if" ||
        node.type === "n8n-nodes-base.switch"
      ) {
        isTrueBranching = true;
      } else {
        for (const sourceName in connections) {
          const sourceId = nameToIdMap.get(sourceName);
          if (sourceId === nodeId) {
            // Type guard to ensure safe access
            if (
              !connections ||
              typeof connections !== "object" ||
              !(sourceName in connections)
            ) {
              continue;
            }

            const sourceConnections = (connections as Record<string, unknown>)[
              sourceName
            ];
            if (!sourceConnections || typeof sourceConnections !== "object")
              continue;

            for (const outputType in sourceConnections as Record<
              string,
              unknown
            >) {
              if (outputType === "main") {
                const groups = (sourceConnections as Record<string, unknown>)[
                  outputType
                ];
                if (!Array.isArray(groups)) continue;

                if (groups.length > 1) {
                  isTrueBranching = true;
                } else if (
                  groups.length === 1 &&
                  Array.isArray(groups[0]) &&
                  groups[0].length > 1
                ) {
                  const indices = groups[0].map(
                    (t: { node: string; type: string; index: number }) =>
                      t && typeof t === "object" && typeof t.index === "number"
                        ? t.index
                        : 0
                  );
                  const allSameIndex = indices.every(
                    (idx: number) => idx === indices[0]
                  );
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
              connectionInfo: returnConnectionInfo,
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
    (node: WorkflowNode) => (parentMap.get(node.id)?.length || 0) === 0
  );

  for (const startNode of startNodes) {
    dfs(startNode.id);
  }

  // Handle remaining unvisited nodes
  let iterationCount = 0;
  const maxIterations = executableNodes.length * 2;

  while (
    visitedMainFlow.size < executableNodes.length &&
    iterationCount < maxIterations
  ) {
    iterationCount++;
    const previousVisitedCount = visitedMainFlow.size;

    for (const node of executableNodes) {
      if (!visitedMainFlow.has(node.id)) {
        const nodeParents = parentMap.get(node.id) || [];
        const canProcess =
          nodeParents.length === 0 ||
          nodeParents.some((parentId: string) => visitedMainFlow.has(parentId));

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
            connectionDetails
          );

          finalBuildOrder.push({
            ...node,
            stepNumber: 0,
            isTrigger: node.type.includes("Trigger"),
            isMergeNode: false,
            isDependency: false,
            isReturnStep: false,
            connectionInfo,
          });
          addedToFinalList.add(node.id);
          visitedMainFlow.add(node.id);
        }
      }
      break;
    }
  }

  return finalBuildOrder.map((step: OrderedWorkflowStep, index: number) => ({
    ...step,
    stepNumber: index + 1,
  }));
}

function generateConnectionInfo(
  nodeId: string,
  node: WorkflowNode,
  connectionDetails: Map<string, ConnectionDetail>
): ConnectionInfo {
  const details = connectionDetails.get(nodeId);
  if (!details) {
    return {
      connectsTo: [],
      connectsFrom: [],
      nextSteps: [],
      previousSteps: [],
      connectionInstructions: "No connections found for this step.",
    };
  }

  const connectsTo = details.outgoing.map(
    (conn: {
      targetId: string;
      targetName: string;
      outputType: string;
      outputIndex: number;
      targetInputIndex: number;
    }) => ({
      targetNodeName: conn.targetName,
      outputType: conn.outputType,
      outputIndex: conn.outputIndex,
      targetInputIndex: conn.targetInputIndex,
      connectionType: getConnectionType(conn.outputType),
    })
  );

  const connectsFrom = details.incoming.map(
    (conn: {
      sourceId: string;
      sourceName: string;
      outputType: string;
      outputIndex: number;
      inputIndex: number;
    }) => ({
      sourceNodeName: conn.sourceName,
      outputType: conn.outputType,
      outputIndex: conn.outputIndex,
      inputIndex: conn.inputIndex,
      connectionType: getConnectionType(conn.outputType),
    })
  );

  const nextSteps = connectsTo.map(
    (conn: {
      targetNodeName: string;
      outputType: string;
      outputIndex: number;
      targetInputIndex: number;
      connectionType: "main_flow" | "dependency" | "conditional";
    }) => {
      const portInfo =
        conn.outputIndex > 0 ? ` (output ${conn.outputIndex})` : "";
      const inputInfo =
        conn.targetInputIndex > 0 ? ` (input ${conn.targetInputIndex})` : "";
      return `Connect${portInfo} to "${conn.targetNodeName}"${inputInfo}`;
    }
  );

  const previousSteps = connectsFrom.map(
    (conn: {
      sourceNodeName: string;
      outputType: string;
      outputIndex: number;
      inputIndex: number;
      connectionType: "main_flow" | "dependency" | "conditional";
    }) => {
      const portInfo =
        conn.outputIndex > 0 ? ` (output ${conn.outputIndex})` : "";
      const inputInfo =
        conn.inputIndex > 0 ? ` (input ${conn.inputIndex})` : "";
      return `Receives connection${inputInfo} from "${conn.sourceNodeName}"${portInfo}`;
    }
  );

  let connectionInstructions = "";
  if (connectsTo.length > 0) {
    if (connectsTo.length === 1) {
      const conn = connectsTo[0];
      connectionInstructions = `Connect the ${getOutputTypeLabel(
        conn.outputType
      )} output of "${node.name}" to "${conn.targetNodeName}"`;
    } else {
      connectionInstructions = `Connect "${
        node.name
      }" to multiple nodes: ${connectsTo
        .map((c: { targetNodeName: string }) => c.targetNodeName)
        .join(", ")}`;
    }
  } else if (connectsFrom.length > 0) {
    connectionInstructions = `This step receives data from: ${connectsFrom
      .map((c: { sourceNodeName: string }) => c.sourceNodeName)
      .join(", ")}`;
  } else {
    connectionInstructions = "This step has no connections (isolated node)";
  }

  return {
    connectsTo,
    connectsFrom,
    nextSteps,
    previousSteps,
    connectionInstructions,
  };
}

function generateReturnStepConnectionInfo(node: WorkflowNode): ConnectionInfo {
  return {
    connectsTo: [],
    connectsFrom: [],
    nextSteps: [`Continue building from "${node.name}"`],
    previousSteps: [`Previous branch from "${node.name}" completed`],
    connectionInstructions: `Navigate back to "${node.name}" in your n8n editor to continue building the next branch of your workflow.`,
  };
}

function getConnectionType(
  outputType: string
): "main_flow" | "dependency" | "conditional" {
  if (outputType === "main") return "main_flow";
  if (outputType.includes("ai_") || outputType.includes("model"))
    return "dependency";
  return "conditional";
}

function getOutputTypeLabel(outputType: string): string {
  const labels: Record<string, string> = {
    main: "main",
    ai_languageModel: "AI model",
    ai_tool: "AI tool",
    ai_memory: "AI memory",
    ai_outputParser: "output parser",
  };
  return labels[outputType] || outputType;
}

export function getWorkflowStats(
  workflowJson:
    | WorkflowJson
    | Partial<WorkflowJson>
    | Record<string, unknown>
    | null
    | undefined
) {
  const orderedSteps = getWorkflowStepsInOrder(workflowJson);
  const actualSteps = orderedSteps.filter(
    (step: OrderedWorkflowStep) => !step.isReturnStep
  );
  const returnSteps = orderedSteps.filter(
    (step: OrderedWorkflowStep) => step.isReturnStep
  );

  return {
    totalSteps: actualSteps.length,
    totalStepsWithReturns: orderedSteps.length,
    returnSteps: returnSteps.length,
    triggerSteps: actualSteps.filter(
      (step: OrderedWorkflowStep) => step.isTrigger
    ).length,
    actionSteps: actualSteps.filter(
      (step: OrderedWorkflowStep) => !step.isTrigger && !step.isDependency
    ).length,
    dependencySteps: actualSteps.filter(
      (step: OrderedWorkflowStep) => step.isDependency
    ).length,
    nodeTypes: [
      ...new Set(actualSteps.map((step: OrderedWorkflowStep) => step.type)),
    ],
    complexity:
      actualSteps.length <= 5
        ? "Beginner Friendly"
        : actualSteps.length <= 15
        ? "Intermediate"
        : "Advanced",
  };
}

export function getWorkflowStepNames(
  workflowJson:
    | WorkflowJson
    | Partial<WorkflowJson>
    | Record<string, unknown>
    | null
    | undefined
): string[] {
  const orderedSteps = getWorkflowStepsInOrder(workflowJson);
  return orderedSteps.map((step: OrderedWorkflowStep) =>
    step.isReturnStep ? `↩️ Return to ${step.returnToNodeName}` : step.name
  );
}

export function getWorkflowTriggers(
  workflowJson:
    | WorkflowJson
    | Partial<WorkflowJson>
    | Record<string, unknown>
    | null
    | undefined
): OrderedWorkflowStep[] {
  const orderedSteps = getWorkflowStepsInOrder(workflowJson);
  return orderedSteps.filter(
    (step: OrderedWorkflowStep) => step.isTrigger && !step.isReturnStep
  );
}

export default getWorkflowStepsInOrder;
