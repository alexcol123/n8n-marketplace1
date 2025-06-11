// api/workflow-analysis/category/route.js
import { NextResponse } from "next/server";
import { OpenAI } from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { workflowJson, title, description } = await req.json();

    if (!workflowJson) {
      return NextResponse.json(
        {
          success: false,
          message: "Workflow JSON is required",
        },
        { status: 400 }
      );
    }

    // Get the list of available categories
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

    // Use OpenAI to determine the most appropriate category
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
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
      return NextResponse.json({
        success: true,
        category,
      });
    } else {
      // Default to "other" if no valid category was determined
      return NextResponse.json({
        success: true,
        category: "other",
      });
    }
  } catch (error) {
    console.error("Error analyzing workflow category:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to analyze workflow category",
      },
      { status: 500 }
    );
  }
}