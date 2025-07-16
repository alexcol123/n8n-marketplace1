export default function nodeTypeToServiceName(nodeType: string): string {
  const nodeName = nodeType.split(".").pop() || nodeType;
  return nodeName.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}


