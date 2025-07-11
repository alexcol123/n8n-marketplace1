// api/workflow-analysis/generate-all/route.js
import { handleApiError } from "@/utils/functions/handleAPIError";
import {  NextResponse } from "next/server";
import OpenAI from "openai";

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

    // Generate content (title and description only - no steps)
    const generatedContent = await generateContent(extractedInfo);

    // Generate category separately
    const categoryData = await getCategoryForWorkflow(
      workflowJson,
      generatedContent.title,
      generatedContent.description
    );

    // Return the combined generated content (without steps)
    return NextResponse.json({
      ...generatedContent,
      category: categoryData.category,
      success: true,
    });
  } catch (error) {
    return handleApiError(error, "Failed to generate workflow content");
  }
}

// Helper function to get category
async function getCategoryForWorkflow(
  workflowJson,
  title,
  description
) {
  try {
    // Use the same logic as the category endpoint
    const categories = [
      "ai",
      "secops",
      "sales",
      "it_ops",
      "marketing",
      "engineering",
      "devops",
      "building_blocks",
      "design",
      "finance",
      "hr",
      "other",
      "product",
      "support",
    ];

    // Create a description of the workflow based on the JSON
    const nodeTypes = (workflowJson.nodes || [])
      .map((node) => node.type || "")
      .filter(Boolean);
    const uniqueNodeTypes = [...new Set(nodeTypes)];

    // Create context for the AI to analyze
    const analysisContext = {
      title: title || "Untitled Workflow",
      description: description || "",
      nodeTypes: uniqueNodeTypes,
      nodeCount: (workflowJson.nodes || []).length,
      connectionCount: Object.keys(workflowJson.connections || {}).length,
      availableCategories: categories,
    };

    // Call OpenAI directly instead of making another HTTP request
    const openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4o-mini", // Use the same model as the category endpoint
      messages: [
        {
          role: "system",
          content: `You are an expert workflow analyzer. Your task is to analyze workflow data and determine the most appropriate category from a predetermined list. Respond with only the category name, nothing else.`,
        },
        {
          role: "user",
          content: `Here is information about a workflow. Please analyze it and determine the most appropriate category from this list: ${categories.join(
            ", "
          )}

Workflow Title: ${analysisContext.title}
Workflow Description: ${analysisContext.description}
Node Types Used: ${analysisContext.nodeTypes.join(", ")}
Number of Nodes: ${analysisContext.nodeCount}
Number of Connections: ${analysisContext.connectionCount}

Respond with only the category name from the list, nothing else.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 20,
    });

    // Get the category from the response
    const category = completion.choices[0]?.message?.content
      ?.trim()
      .toLowerCase();

    // Validate that the category is in our list
    if (category && categories.includes(category)) {
      return { category };
    } else {
      return { category: "other" };
    }
  } catch (error) {
     return handleApiError(error, "Error getting category in generateAll");
  }
}

// Function to extract relevant information from the workflow
function extractWorkflowInfo(workflow) {
  // Initialize variables to store extracted information
  const nodeTypes = new Set();
  const nodeNames = [];
  const triggerNodes = [];
  const actionNodes = [];
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

      // Categorize as trigger or action node
      if (node.type && isTriggerNode(node.type)) {
        triggerNodes.push({ name: node.name, type: node.type });
      } else if (node.type) {
        actionNodes.push({ name: node.name, type: node.type });
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

  // Determine workflow execution order (simplified)
  const sortedNodes = [...nodes].sort((a, b) => {
    // Sort by Y position first (top to bottom)
    if (a.position && b.position) {
      if (a.position[1] !== b.position[1]) {
        return a.position[1] - b.position[1];
      }
      // Then by X position (left to right)
      return a.position[0] - b.position[0];
    }
    return 0;
  });

  return {
    workflowName: workflow.name || null,
    workflowDescription: workflow.meta?.description || null,
    nodeTypes: Array.from(nodeTypes),
    nodeNames,
    triggerNodes,
    actionNodes,
    nodes,
    connections,
    sortedNodes,
    nodeCount: nodes.length,
    connectionCount: connections.length,
  };
}

// Helper function to determine if a node type is a trigger
function isTriggerNode(nodeType) {
  const triggerTypes = [
    "n8n-nodes-base.cronTrigger",
    "n8n-nodes-base.intervalTrigger", 
    "n8n-nodes-base.httpTrigger",
    "n8n-nodes-base.webhook",
    "n8n-nodes-base.manualTrigger",
    "n8n-nodes-base.scheduleTrigger",
    "n8n-nodes-base.emailReadImap",
    "n8n-nodes-base.formTrigger",
  ];

  return triggerTypes.includes(nodeType) || nodeType.toLowerCase().includes('trigger');
}

// Function to generate workflow content using OpenAI (title and description only)
async function generateContent(workflowInfo) {
  try {
    // Create a descriptive prompt for OpenAI
    const prompt = `
Based on the following workflow information from n8n, generate a complete set of user-friendly content including a title and description only.
      
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
      
      Trigger nodes: ${
        workflowInfo.triggerNodes
          ?.map((t) => `${t.name} (${t.type})`)
          .join(", ") || "None identified"
      }
      
      Action nodes: ${
        workflowInfo.actionNodes
          ?.map((a) => `${a.name} (${a.type})`)
          .join(", ") || ""
      }
      
      Nodes in approximate execution order:
      ${workflowInfo.sortedNodes
        .map(
          (node, index) =>
            `${index + 1}. ${node.name} (${node.type})`
        )
        .join("\n")}
      
      Total nodes: ${workflowInfo.nodeCount}
      Total connections: ${workflowInfo.connectionCount}
      
      Generate the following:
      
      1. Title: A concise, descriptive title (5-8 words) that explains what this workflow does. Use action verbs and plain language.
      
      2. Description: A brief description (3-5 sentences, around 100-200 words) that explains what the workflow does, what problem it solves, and its benefits. Use plain, non-technical language that anyone can understand.
    `;

    // Call OpenAI API
    const openaiClient = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openaiClient.chat.completions.create({
      model: "gpt-4", // You can use "gpt-3.5-turbo" for a cheaper option
      messages: [
        {
          role: "system",
          content:
            "You are an expert in explaining technical processes in simple terms. You focus on creating clear, human-friendly content that non-technical users can understand.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500, // Reduced since we're not generating steps
    });

    const responseText = completion.choices[0].message.content || "";

    // Parse the response to extract title and description
    let title = "";
    let description = "";

    // Extract title (likely at the beginning, before any "Description:" tag)
    const titleMatch = responseText.match(/(?:Title:?\s*)(.*?)(?:\n|$)/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    }

    // Extract description (after "Description:")
    const descriptionMatch = responseText.match(
      /(?:Description:?\s*)([\s\S]*?)(?:$)/i
    );
    if (descriptionMatch && descriptionMatch[1]) {
      description = descriptionMatch[1].trim();
    }

    // If we couldn't extract properly, try a more generic approach
    if (!title || !description) {
      const paragraphs = responseText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      if (paragraphs.length >= 2) {
        // Assume first paragraph is title if we didn't find one
        if (!title) {
          title = paragraphs[0];
        }

        // Assume second paragraph is description if we didn't find one
        if (!description) {
          description = paragraphs[1];
        }
      }
    }

    // Final fallbacks
    if (!title) {
      title = "Automated Workflow Process";
    }

    if (!description) {
      description =
        "This workflow automates a series of tasks to save time and reduce manual effort. It collects data from various sources, processes it according to predefined rules, and delivers the results to their intended destination.";
    }

    return {
      title,
      description,
    };
  } catch (error) {
    console.error("Error generating content with OpenAI:", error);
    // Return default content
    return {
      title: "Automated Workflow Process",
      description:
        "This workflow automates a series of tasks to save time and reduce manual effort. It collects data from various sources, processes it according to predefined rules, and delivers the results to their intended destination.",
    };
  }
}