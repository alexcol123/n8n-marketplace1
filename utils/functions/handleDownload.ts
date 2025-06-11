// For handleDownload

export const handleDownload = (
  formattedWorkflow: string,
  title: string = "Workflow"
): void => {
  const blob = new Blob([formattedWorkflow], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `n8n-workflow-${title.replace(/\s+/g, "-").toLowerCase()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
