// /app/api/workflow-analysis/steps/route.js
import { handleApiError } from "@/utils/functions/handleAPIError";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    // Parse the incoming JSON request
    const { workflowJson } = await request.json();

    if (!workflowJson) {
      return NextResponse.json(
        { error: "Missing workflow JSON data" },
        { status: 400 }
      );
    }

    // Extract relevant information from the workflow
    const extractedInfo = extractWorkflowInfo(workflowJson);

    // Generate steps using OpenAI
    const stepsSuggestions = await generateSteps(extractedInfo);

    // Return the generated steps
    return NextResponse.json({
      steps: stepsSuggestions,
      success: true,
    });
  } catch (error) {
    return handleApiError(error, "Error generating steps");
  }
}

// Function to extract relevant information from the workflow
function extractWorkflowInfo(workflow) {
  // Initialize variables to store extracted information
  const nodeTypes = new Set();
  const nodeNames = [];
  const nodes = [];
  const connections = [];

  // Extract node information
  if (workflow.nodes && Array.isArray(workflow.nodes)) {
    workflow.nodes.forEach((node) => {
      // Store node type
      if (node.type) {
        nodeTypes.add(node.type);
      }

      // Store node name
      if (node.name) {
        nodeNames.push(node.name);
      }

      // Store full node info
      nodes.push({
        name: node.name,
        type: node.type,
        position: node.position,
      });
    });
  }

  // Extract connection information
  if (workflow.connections && workflow.connections.main) {
    Object.entries(workflow.connections.main).forEach(
      ([sourceNodeId, sourceConnections]) => {
        if (sourceConnections) {
          Object.entries(sourceConnections).forEach(
            ([outputIndex, outputs]) => {
              if (Array.isArray(outputs)) {
                outputs.forEach((output) => {
                  connections.push({
                    sourceNodeId,
                    targetNodeId: output.node,
                    sourceOutputIndex: outputIndex,
                    targetInputIndex: output.index,
                  });
                });
              }
            }
          );
        }
      }
    );
  }

  // Get workflow name if available
  const workflowName = workflow.name || "";

  // Get workflow description if available
  const workflowDescription = workflow.description || "";

  // Sort nodes by position (if available) to get a rough execution order
  const sortedNodes = [...nodes].sort((a, b) => {
    if (a.position && b.position) {
      // Sort primarily by y position (top to bottom)
      if (Math.abs(a.position.y - b.position.y) > 100) {
        return a.position.y - b.position.y;
      }
      // If nodes are roughly on the same "row", sort by x position (left to right)
      return a.position.x - b.position.x;
    }
    return 0;
  });

  // Return the extracted information
  return {
    nodeTypes: Array.from(nodeTypes),
    nodeNames,
    nodes,
    sortedNodes,
    connections,
    workflowName,
    workflowDescription,
    nodeCount: workflow.nodes?.length || 0,
    connectionCount: connections.length || 0,
  };
}

async function generateSteps(workflowInfo) {
  try {
    // Create a prompt for OpenAI
    const prompt = `
      You are an expert in explaining automation workflows in simple, non-technical steps. Based on the following workflow information, create a step-by-step explanation of how this workflow operates. The steps should be understandable to people who aren't technical experts.
      
      Workflow Information:
      ${
        workflowInfo.workflowName
          ? `Workflow name: ${workflowInfo.workflowName}`
          : "No workflow name provided"
      }
      ${
        workflowInfo.workflowDescription
          ? `Workflow description: ${workflowInfo.workflowDescription}`
          : "No description provided"
      }
      
      Node types used: ${workflowInfo.nodeTypes.join(", ")}
      
      Nodes in approximate execution order:
      ${workflowInfo.sortedNodes
        .map(
          (node, index) =>
            `${index + 1}. ${node.name} (${node.type})`
        )
        .join("\n")}
      
      Total nodes: ${workflowInfo.nodeCount}
      Total connections: ${workflowInfo.connectionCount}
      
      Generate 3-7 steps that:
      1. Explain the workflow in plain, accessible language
      2. Focus on what happens at each major stage (not necessarily one step per node)
      3. Avoid technical jargon or n8n-specific terminology
      4. Describe the "what" and "why" of each step, not just the technical "how"
      5. Can be understood by someone who has never used automation tools before
      
      Return ONLY the text for each step, with no step numbering or prefix. Each entry in the array should be a clear, standalone description of one step in the process.
      
      Example format for a 3-step response:
      ["When a new email arrives in your inbox, the system automatically scans it for specific keywords.", 
      "Information from matching emails is extracted and organized into a structured format.", 
      "The collected data is then saved to your spreadsheet, allowing you to track important information without manual data entry."]
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // You can use "gpt-3.5-turbo" for a cheaper option
      messages: [
        {
          role: "system",
          content:
            "You are an expert in explaining technical processes in simple terms. Your task is to create a plain language, step-by-step breakdown of how a workflow operates.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 600, // Allow for detailed steps
    });

    // Get the raw text response
    const responseText = completion.choices[0].message.content || "";

    // Try to extract an array from the text
    let steps = [];

    try {
      // First try: look for a properly formatted JSON array
      // @ts-expect-error: Match may not return a valid JSON array
      const arrayMatch = responseText.match(/\[\s*".*"\s*(?:,\s*".*"\s*)*\]/s);
      if (arrayMatch) {
        steps = JSON.parse(arrayMatch[0]);
      } else {
        // Second try: split by numbered steps if array parsing fails
        const splitSteps = responseText.split(/\d+\.\s+/).filter(Boolean);
        steps = splitSteps.map((step) => step.trim());
      }
    } catch (parseError) {
      console.error("Error parsing steps response:", parseError);

      // Last resort: just split by newlines and clean up
      steps = responseText
        .split("\n")
        .map((line) => line.trim())
        .filter(
          (line) =>
            line.length > 0 &&
            !line.startsWith("[") &&
            !line.startsWith("]") &&
            !line.startsWith('"Steps:')
        );
    }

    // If we still have no steps, provide default ones
    if (steps.length === 0) {
      steps = [
        "The workflow begins by triggering when a specific event occurs.",
        "Data is collected and processed according to predefined rules.",
        "The results are sent to their final destination, completing the automation.",
      ];
    }

    // Clean up steps - remove quotation marks and numbering if any remain
    steps = steps.map((step) =>
      step
        .replace(/^["']|["']$/g, "") // Remove quotes
        .replace(/^\d+\.\s*/, "") // Remove numbering
        .trim()
    );

    return steps;
  } catch (error) {
    console.error("Error generating steps with OpenAI:", error);
    // Return default steps if there's an error
    return [
      "The workflow begins by triggering when a specific event occurs.",
      "Data is collected and processed according to predefined rules.",
      "The results are sent to their final destination, completing the automation.",
    ];
  }
}