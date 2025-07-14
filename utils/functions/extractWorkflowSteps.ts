// utils/functions/extractWorkflowSteps.ts
import {
  getWorkflowStepsInOrder,
  WorkflowJson,
  OrderedWorkflowStep,
} from "./WorkflowStepsInOrder";
import { Prisma } from "@prisma/client";
import db from "@/utils/db";
import { identifyService } from "./identifyService";

async function updateNodeUsageStats(orderedSteps: OrderedWorkflowStep[]) {
  console.log("🔄 Updating node usage statistics...");
  console.log(`📊 Total steps received: ${orderedSteps.length}`);

  // Debug: Log all step types first
  console.log(
    "🔍 All step types:",
    orderedSteps.map((s) => ({
      name: s.name,
      type: s.type,
      isReturnStep: s.isReturnStep,
    }))
  );

  // Group services to avoid duplicates within the same workflow
  const serviceMap = new Map<
    string,
    {
      serviceName: string;
      hostIdentifier: string | null;
      nodeType: string;
      count: number;
    }
  >();

  for (const step of orderedSteps) {
    console.log(`🔍 Processing step: ${step.name} (${step.type})`);

    // Skip return steps and sticky notes - they're not real nodes
    if (step.isReturnStep || step.type.includes("StickyNote")) {
      console.log(
        `⏭️ SKIPPED: ${step.name} - isReturnStep: ${step.isReturnStep}, type: ${step.type}`
      );
      continue;
    }

    console.log(`✅ PROCESSING: ${step.name} (${step.type})`);

    // Use your new identifyService function
    const serviceInfo = identifyService(step);
    console.log(`🎯 Service info:`, serviceInfo);

    // Create unique key for this service
    const serviceKey = `${serviceInfo.serviceName}|${
      serviceInfo.hostIdentifier || "null"
    }`;

    if (serviceMap.has(serviceKey)) {
      // Increment count if service already exists in this workflow
      serviceMap.get(serviceKey)!.count++;
      console.log(`📈 Incremented count for: ${serviceInfo.serviceName}`);
    } else {
      // Add new service
      serviceMap.set(serviceKey, {
        serviceName: serviceInfo.serviceName,
        hostIdentifier: serviceInfo.hostIdentifier || null, // Explicit null
        nodeType: serviceInfo.nodeType,
        count: 1,
      });
      console.log(`✨ Added new service: ${serviceInfo.serviceName}`);
    }

    console.log(
      `🎯 Identified service: ${serviceInfo.serviceName} (${
        serviceInfo.hostIdentifier || "direct node"
      })`
    );
  }

  console.log(`📈 Found ${serviceMap.size} unique services to track`);
  console.log("🗺️ Service map:", Array.from(serviceMap.entries()));

  if (serviceMap.size === 0) {
    console.log("⚠️ No trackable services found");
    return [];
  }

  // Batch update all the usage stats
  // Replace the entire upsert section with this:
  const upsertPromises = Array.from(serviceMap.values()).map(
    async ({ serviceName, hostIdentifier, nodeType, count }) => {
      console.log(
        `💾 Tracking: ${serviceName} (used ${count} times in this workflow)`
      );

      // Handle NULL hostIdentifier with findFirst + create/update
      const existingRecord = await db.nodeUsageStats.findFirst({
        where: {
          serviceName,
          hostIdentifier,
        },
      });

      if (existingRecord) {
        // Update existing record
        return db.nodeUsageStats.update({
          where: { id: existingRecord.id },
          data: {
            usageCount: { increment: count },
            lastUsedAt: new Date(),
            nodeType,
          },
        });
      } else {
        // Create new record
        return db.nodeUsageStats.create({
          data: {
            serviceName,
            hostIdentifier,
            nodeType,
            usageCount: count,
            lastUsedAt: new Date(),
            needsGuide: true,
          },
        });
      }
    }
  );

  try {
    const results = await Promise.all(upsertPromises);
    console.log(`✅ Updated ${results.length} service usage stats`);
    return results;
  } catch (error) {
    console.error("❌ Database error:", error);
    console.error("Error details:", error);
    return [];
  }
}

export async function extractAndSaveWorkflowSteps(
  workflowId: string,
  workflowJson: unknown
) {
  try {
    console.log("🚀 Starting workflow step extraction...");

    // Type guard and cast to ensure workflowJson is compatible
    if (!workflowJson || typeof workflowJson !== "object") {
      throw new Error("Invalid workflow JSON: must be a valid object");
    }

    // Cast to the expected type - the function handles validation internally
    const typedWorkflowJson = workflowJson as
      | WorkflowJson
      | Partial<WorkflowJson>
      | Record<string, unknown>;

    // Use your existing function to get ordered steps with full node data
    const orderedSteps = getWorkflowStepsInOrder(typedWorkflowJson);
    console.log(`📋 Found ${orderedSteps.length} total steps`);

    // 🆕 UPDATE USAGE STATISTICS FIRST
    await updateNodeUsageStats(orderedSteps);

    // Delete existing steps (for updates)
    await db.workflowStep.deleteMany({
      where: { workflowId },
    });

    // Filter out sticky notes and prepare the COMPLETE step data for the database
    const stepData = orderedSteps
      .filter((step) => !step.type.includes("StickyNote"))
      .map((step, index) => ({
        workflowId,
        stepNumber: index + 1, // Sequential numbering

        // Basic step info
        stepTitle: step.name,
        stepDescription: generateStepDescription(step),
        helpText: undefined,
        helpLinks: undefined,
        isCustomStep: false, // Auto-generated from workflow JSON

        // Rich n8n node data
        nodeId: step.id,
        nodeType: step.type,
        position: step.position as Prisma.InputJsonValue,
        parameters: (step.parameters || {}) as Prisma.InputJsonValue,
        credentials: undefined,
        typeVersion:
          typeof step.typeVersion === "number" ? step.typeVersion : 1,
        webhookId:
          typeof step.webhookId === "string" ? step.webhookId : undefined,

        // Node classification
        isTrigger: step.isTrigger,
        isMergeNode: step.isMergeNode,
        isDependency: step.isDependency || false,
      }));

    // Save complete step data to WorkflowStep table
    await db.workflowStep.createMany({
      data: stepData,
    });

    console.log(
      `✅ Successfully processed workflow with ${stepData.length} steps`
    );

    return {
      success: true,
      stepsCreated: stepData.length,
      stepData,
      message: `Successfully extracted ${stepData.length} steps with full node data`,
    };
  } catch (error) {
    console.error("❌ Failed to extract workflow steps:", error);
    throw error;
  }
}

// Helper to create readable step descriptions
function generateStepDescription(step: OrderedWorkflowStep): string {
  const nodeTypeDescriptions: Record<string, string> = {
    // Triggers
    "n8n-nodes-base.formTrigger":
      "Receives form submissions and triggers the workflow",
    "n8n-nodes-base.webhook":
      "Receives incoming webhook requests from external services",
    "n8n-nodes-base.manualTrigger": "Manually starts the workflow execution",
    "n8n-nodes-base.cronTrigger":
      "Triggers workflow on a scheduled basis using cron expressions",
    "n8n-nodes-base.intervalTrigger":
      "Triggers workflow at regular time intervals",
    "n8n-nodes-base.emailTrigger": "Triggers workflow when emails are received",
    "n8n-nodes-base.executeWorkflowTrigger":
      "Triggers when called by another workflow",
    "@n8n/n8n-nodes-langchain.chatTrigger":
      "Creates an interactive chat interface for AI conversations",

    // HTTP & API
    "n8n-nodes-base.httpRequest":
      "Makes HTTP requests to external APIs or services",
    "n8n-nodes-base.httpRequestWebhook":
      "Creates webhook endpoints to receive HTTP requests",
    "n8n-nodes-base.respondToWebhook":
      "Sends responses back to incoming webhook requests",

    // Google Services
    "n8n-nodes-base.googleDrive":
      "Uploads, downloads, or manages files in Google Drive",
    "n8n-nodes-base.googleSheets":
      "Reads from and writes to Google Sheets spreadsheets",
    "n8n-nodes-base.gmail": "Sends emails and manages Gmail messages",
    "n8n-nodes-base.googleCalendar":
      "Creates and manages events in Google Calendar",
    "n8n-nodes-base.googleDocs": "Creates and manages Google Documents",
    "n8n-nodes-base.googleAnalytics":
      "Retrieves website analytics data from Google Analytics",

    // Microsoft Services
    "n8n-nodes-base.microsoftExcel":
      "Reads from and writes to Microsoft Excel files",
    "n8n-nodes-base.microsoftOutlook":
      "Sends emails and manages Outlook messages and calendar events",
    "n8n-nodes-base.microsoftTeams":
      "Sends messages and manages Microsoft Teams",
    "n8n-nodes-base.oneDrive":
      "Uploads, downloads, or manages files in Microsoft OneDrive",

    // Communication & Social
    "n8n-nodes-base.slack":
      "Sends messages and manages Slack channels and users",
    "n8n-nodes-base.discord":
      "Sends messages and manages Discord servers and channels",
    "n8n-nodes-base.telegram": "Sends messages via Telegram bot",
    "n8n-nodes-base.whatsApp": "Sends WhatsApp messages through API",
    "n8n-nodes-base.twitter": "Posts tweets and manages Twitter interactions",

    // AI & Language Models
    "@n8n/n8n-nodes-langchain.agent":
      "Uses AI agent to process and generate intelligent responses",
    "@n8n/n8n-nodes-langchain.lmChatOpenAi":
      "Connects to OpenAI language models for AI processing",
    "@n8n/n8n-nodes-langchain.openAi":
      "Integrates with OpenAI services for content generation",
    "@n8n/n8n-nodes-langchain.memoryBufferWindow":
      "Provides conversation memory for AI chat sessions",
    "@n8n/n8n-nodes-langchain.toolHttpRequest":
      "Creates AI tools that can make HTTP requests",
    "@n8n/n8n-nodes-langchain.toolWorkflow":
      "Creates AI tools that can execute other workflows",
    "n8n-nodes-base.openAi":
      "Integrates with OpenAI API for text and image generation",

    // Database
    "n8n-nodes-base.postgres": "Connects to and queries PostgreSQL databases",
    "n8n-nodes-base.mysql": "Connects to and queries MySQL databases",
    "n8n-nodes-base.mongoDb": "Connects to and queries MongoDB databases",
    "n8n-nodes-base.redis": "Stores and retrieves data from Redis cache",
    "n8n-nodes-base.sqlite": "Connects to and queries SQLite databases",

    // File Management
    "n8n-nodes-base.convertToFile":
      "Converts data into file format for download or storage",
    "n8n-nodes-base.readBinaryFile": "Reads binary files from the file system",
    "n8n-nodes-base.writeBinaryFile": "Writes binary data to files",
    "n8n-nodes-base.ftp": "Uploads and downloads files via FTP protocol",
    "n8n-nodes-base.sftp": "Uploads and downloads files via SFTP protocol",

    // Data Processing
    "n8n-nodes-base.code":
      "Executes custom JavaScript code for data processing",
    "n8n-nodes-base.set": "Sets or modifies data values in the workflow",
    "n8n-nodes-base.merge":
      "Combines and merges data from multiple workflow branches",
    "n8n-nodes-base.sort": "Sorts data items based on specified criteria",
    "n8n-nodes-base.filter": "Filters data items based on specified conditions",
    "n8n-nodes-base.aggregate": "Aggregates and summarizes data collections",
    "n8n-nodes-base.itemLists": "Splits or combines arrays of data items",
    "n8n-nodes-base.splitInBatches":
      "Splits large datasets into smaller batches",

    // Control Flow
    "n8n-nodes-base.if":
      "Creates conditional logic and branching in the workflow",
    "n8n-nodes-base.switch":
      "Routes data through different paths based on multiple conditions",
    "n8n-nodes-base.wait": "Pauses workflow execution for a specified duration",
    "n8n-nodes-base.stopAndError":
      "Stops workflow execution and throws an error",
    "n8n-nodes-base.noOp": "Does nothing - used for workflow organization",

    // E-commerce & Payment
    "n8n-nodes-base.stripe":
      "Processes payments and manages Stripe transactions",
    "n8n-nodes-base.shopify": "Manages Shopify store data and orders",
    "n8n-nodes-base.wooCommerce": "Integrates with WooCommerce stores",
    "n8n-nodes-base.payPal": "Processes PayPal payments and transactions",

    // CRM & Sales
    "n8n-nodes-base.hubspot": "Manages contacts and deals in HubSpot CRM",
    "n8n-nodes-base.salesforce": "Integrates with Salesforce CRM system",
    "n8n-nodes-base.pipedrive": "Manages deals and contacts in Pipedrive",
    "n8n-nodes-base.airtable": "Reads from and writes to Airtable databases",
    "n8n-nodes-base.notion": "Creates and manages content in Notion workspace",

    // Marketing & Analytics
    "n8n-nodes-base.mailchimp":
      "Manages email campaigns and subscribers in Mailchimp",
    "n8n-nodes-base.sendGrid":
      "Sends transactional emails via SendGrid service",
    "n8n-nodes-base.facebookGraphApi": "Interacts with Facebook Graph API",

    // Project Management
    "n8n-nodes-base.trello": "Creates and manages Trello boards and cards",
    "n8n-nodes-base.asana": "Manages tasks and projects in Asana",
    "n8n-nodes-base.jira": "Creates and manages issues in Jira",
    "n8n-nodes-base.linear": "Manages issues and projects in Linear",
    "n8n-nodes-base.github": "Interacts with GitHub repositories and issues",

    // Utilities
    "n8n-nodes-base.xml": "Converts between XML and JSON data formats",
    "n8n-nodes-base.html": "Extracts data from HTML content",
    "n8n-nodes-base.markdown": "Converts between Markdown and HTML formats",
    "n8n-nodes-base.crypto": "Performs cryptographic operations on data",
    "n8n-nodes-base.dateTime": "Manipulates and formats date and time values",
    "n8n-nodes-base.editImage": "Edits and manipulates image files",
    "n8n-nodes-base.rss": "Reads and parses RSS feed content",
    "n8n-nodes-base.stickyNote":
      "Adds documentation notes to workflows (non-executable)",

    // Cloud Storage
    "n8n-nodes-base.awsS3":
      "Uploads, downloads, and manages files in Amazon S3",
    "n8n-nodes-base.dropbox": "Manages files and folders in Dropbox",
    "n8n-nodes-base.box": "Manages files and folders in Box cloud storage",

    // Monitoring & Logging
    "n8n-nodes-base.sentry":
      "Sends error reports and monitoring data to Sentry",
    "n8n-nodes-base.elasticsearch":
      "Indexes and searches data in Elasticsearch",
  };

  return nodeTypeDescriptions[step.type] || `Executes ${step.name} operation`;
}
