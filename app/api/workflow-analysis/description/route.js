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
    
    // Generate a description using OpenAI
    const descriptionSuggestion = await generateDescription(extractedInfo);
    
    // Return the generated description
    return NextResponse.json({
      description: descriptionSuggestion,
      success: true
    });
    
  } catch (error) {
    console.error('Error generating description:', error);
    return NextResponse.json(
      { error: 'Failed to generate description', details: error?.message || 'Unknown error' },
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
  const actionNodes = [];
  
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
      } else if (node.type && node.name) {
        // Store action nodes separately
        actionNodes.push({
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
    actionNodes,
    workflowName,
    workflowDescription,
    nodeCount: workflow.nodes?.length || 0,
    connectionCount: workflow.connections ? Object.keys(workflow.connections).length : 0
  };
}

async function generateDescription(workflowInfo) {
  try {
    // Create a prompt for OpenAI
    const prompt = `
      You are an expert in explaining automation workflows in simple, non-technical language. Based on the following workflow information, write a clear, concise description of what this workflow does and why it's valuable. The description should be understandable to people who aren't technical experts.
      
      Workflow Information:
      ${workflowInfo.workflowName ? `Current name: ${workflowInfo.workflowName}` : 'No current name'}
      ${workflowInfo.workflowDescription ? `Original description: ${workflowInfo.workflowDescription}` : 'No original description provided'}
      Node types used: ${workflowInfo.nodeTypes.join(', ')}
      Trigger nodes: ${workflowInfo.triggerNodes.map(t => `${t.name} (${t.type})`).join(', ') || 'None identified'}
      Action nodes: ${workflowInfo.actionNodes.map(a => `${a.name} (${a.type})`).join(', ')}
      Total nodes: ${workflowInfo.nodeCount}
      Total connections: ${workflowInfo.connectionCount}
      
      Generate a description that:
      1. Is 3-5 sentences long (approximately 100-200 words)
      2. Explains what the workflow does in plain, non-technical language
      3. Explains how this automation saves time or solves a problem
      4. Mentions any services or platforms it connects (like Slack, Gmail, etc.) in user-friendly terms
      5. Does NOT use technical jargon related to n8n or automation
      
      The description should be written in a professional but accessible style.
    `;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // You can use "gpt-3.5-turbo" for a cheaper option
      messages: [
        {
          role: "system",
          content: "You are an expert in explaining technical automation workflows in simple, clear language that non-technical users can understand."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 300, // Allow for a moderate-length description
    });

    // Extract and return the generated description
    const generatedDescription = completion.choices[0].message.content?.trim() || "This workflow automates a series of tasks to save you time and effort.";
    return generatedDescription;
    
  } catch (error) {
    console.error('Error generating description with OpenAI:', error);
    throw new Error('Failed to generate description');
  }
}