import {  NextResponse } from 'next/server';
import OpenAI from 'openai';

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
        { error: 'Missing workflow JSON data' },
        { status: 400 }
      );
    }

    // Extract relevant information from the workflow
    const extractedInfo = extractWorkflowInfo(workflowJson);
    
    // Generate a title using OpenAI
    const titleSuggestion = await generateTitle(extractedInfo);
    
    // Return the generated title
    return NextResponse.json({
      title: titleSuggestion,
      success: true
    });
    
  } catch (error) {
    console.error('Error analyzing workflow:', error);
    return NextResponse.json(
      { error: 'Failed to analyze workflow', details: error.message },
      { status: 500 }
    );
  }
}

// Function to extract relevant information from the workflow
function extractWorkflowInfo(workflow) {
  // Initialize variables to store extracted information
  const nodeTypes = new Set();
  const nodeNames = [];
  const triggerNodes = [];
  
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
      if (node.type && (
        node.type.includes('Trigger') || 
        node.type.includes('webhook') ||
        node.type.startsWith('n8n-nodes-base.webhook')
      )) {
        triggerNodes.push({
          name: node.name,
          type: node.type
        });
      }
    });
  }
  
  // Get workflow name if available
  const workflowName = workflow.name || '';
  
  // Get workflow description if available
  const workflowDescription = workflow.description || '';
  
  // Return the extracted information
  return {
    nodeTypes: Array.from(nodeTypes),
    nodeNames,
    triggerNodes,
    workflowName,
    workflowDescription,
    nodeCount: workflow.nodes?.length || 0,
    connectionCount: workflow.connections?.length || 0
  };
}

async function generateTitle(workflowInfo) {
  try {
    // Create a prompt for OpenAI
    const prompt = `
      You are an expert in n8n automation workflows. Based on the following workflow information, suggest a clear, concise, and descriptive title that explains what this workflow does. The title should be understandable to people who aren't n8n experts.
      
      Workflow Information:
      ${workflowInfo.workflowName ? `Current name: ${workflowInfo.workflowName}` : 'No current name'}
      ${workflowInfo.workflowDescription ? `Description: ${workflowInfo.workflowDescription}` : 'No description provided'}
      Node types used: ${workflowInfo.nodeTypes.join(', ')}
      Node names: ${workflowInfo.nodeNames.join(', ')}
      Trigger nodes: ${workflowInfo.triggerNodes.map(t => `${t.name} (${t.type})`).join(', ') || 'None identified'}
      Total nodes: ${workflowInfo.nodeCount}
      Total connections: ${workflowInfo.connectionCount}
      
      Generate a title that:
      1. Is concise (5-8 words)
      2. Describes the main purpose of the workflow in plain language
      3. Uses action verbs
      4. Is specific but not technical
      5. Would make sense to someone who doesn't know what n8n is
      
      Provide just the title without any quotes or explanations.
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4",  // You can use "gpt-3.5-turbo" for a cheaper option
      messages: [
        {
          role: "system",
          content: "You are an expert in creating concise, descriptive titles for automation workflows that are understandable to non-technical users."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 50, // Limit token usage since we only need a short title
    });

    // Extract and return the generated title
    const generatedTitle = completion.choices[0].message.content?.trim() || "Automated Workflow";
    return generatedTitle;
    
  } catch (error) {
    console.error('Error generating title with OpenAI:', error);
    throw new Error('Failed to generate title');
  }
}