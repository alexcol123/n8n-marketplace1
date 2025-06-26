const getWorkflowComplexityFunc = (
  workflowJson: unknown,
  workflowCharactersLength: number
) => {
  let nodeCount = 0;
  try {
    nodeCount =
      typeof workflowJson === "object" &&
      workflowJson !== null &&
      Array.isArray((workflowJson as { nodes: unknown[] }).nodes)
        ? (workflowJson as { nodes: unknown[] }).nodes.length
        : 0;
  } catch {
    nodeCount = 0;
  }

  if (nodeCount >= 13) return "Advanced";
  if (nodeCount >= 7) return "Intermediate";
  if (workflowCharactersLength > 6000) return "Advanced";
  if (workflowCharactersLength > 4000) return "Intermediate";
  return "Basic";
};

export default getWorkflowComplexityFunc;