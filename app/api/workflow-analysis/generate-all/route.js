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

    // Generate content (title, description, steps)
    const generatedContent = await generateAllContent(extractedInfo);

    // Generate category separately (important - this calls the category endpoint)
    const categoryData = await getCategoryForWorkflow(
      workflowJson,
      generatedContent.title,
      generatedContent.description
    );

    // Return the combined generated content
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

      // Identify trigger nodes
      if (
        node.type &&
        (node.type.includes("Trigger") ||
          node.type.includes("webhook") ||
          node.type.startsWith("n8n-nodes-base.webhook"))
      ) {
        triggerNodes.push({
          name: node.name,
          type: node.type,
        });
      } else {
        // Store action nodes separately
        actionNodes.push({
          name: node.name,
          type: node.type,
        });
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
    triggerNodes,
    actionNodes,
    connections,
    workflowName,
    workflowDescription,
    nodeCount: workflow.nodes?.length || 0,
    connectionCount: connections.length || 0,
  };
}

async function generateAllContent(workflowInfo) {
  try {
    // Create a prompt for OpenAI
    const prompt = `
      You are an expert in explaining automation workflows to non-technical audiences. Based on the following workflow information from n8n, generate a complete set of user-friendly content including a title, description, and step-by-step guide.
      
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
      
      3. Steps: 3-7 clear steps that explain how the workflow operates. Each step should be 1-3 sentences long and focus on what happens at each major stage. Avoid technical jargon and explain things in a way that someone who has never used automation tools would understand. Do not include step numbers in the text.
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
      max_tokens: 1000, // Allow for comprehensive content
    });

    const responseText = completion.choices[0].message.content || "";

    // Parse the response to extract title, description, and steps
    let title = "";
    let description = "";
    let steps = [];

    // Extract title (likely at the beginning, before any "Description:" tag)
    const titleMatch = responseText.match(/(?:Title:?\s*)(.*?)(?:\n|$)/i);
    if (titleMatch && titleMatch[1]) {
      title = titleMatch[1].trim();
    }

    // Extract description (likely between "Description:" and "Steps:")
    const descriptionMatch = responseText.match(
      /(?:Description:?\s*)([\s\S]*?)(?:(?:Steps:|$))/i
    );
    if (descriptionMatch && descriptionMatch[1]) {
      description = descriptionMatch[1].trim();
    }

    // Extract steps (likely after "Steps:")
    const stepsMatch = responseText.match(/(?:Steps:?\s*)([\s\S]*?)(?:$)/i);
    if (stepsMatch && stepsMatch[1]) {
      // Split by numbered bullets (1., 2., etc.) or bullet points (•, -, *)
      steps = stepsMatch[1]
        .split(/(?:\d+\.|\*|-|•)\s+/)
        .map((step) => step.trim())
        .filter((step) => step.length > 0);
    }

    // If we couldn't extract properly, try a more generic approach
    if (!title || !description || steps.length === 0) {
      const paragraphs = responseText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      if (paragraphs.length >= 3) {
        // Assume first paragraph is title if we didn't find one
        if (!title) {
          title = paragraphs[0];
        }

        // Assume second paragraph is description if we didn't find one
        if (!description) {
          description = paragraphs[1];
        }

        // Assume remaining paragraphs are steps if we didn't find any
        if (steps.length === 0) {
          steps = paragraphs.slice(2);
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

    if (steps.length === 0) {
      steps = [
        "The workflow begins by triggering when a specific event occurs.",
        "Data is collected and processed according to predefined rules.",
        "The results are sent to their final destination, completing the automation.",
      ];
    }

    return {
      title,
      description,
      steps,
    };
  } catch (error) {
    console.error("Error generating content with OpenAI:", error);
    // Return default content
    return {
      title: "Automated Workflow Process",
      description:
        "This workflow automates a series of tasks to save time and reduce manual effort. It collects data from various sources, processes it according to predefined rules, and delivers the results to their intended destination.",
      steps: [
        "The workflow begins by triggering when a specific event occurs.",
        "Data is collected and processed according to predefined rules.",
        "The results are sent to their final destination, completing the automation.",
      ],
    };
  }
}