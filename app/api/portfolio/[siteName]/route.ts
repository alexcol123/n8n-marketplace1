// app/api/portfolio/[siteName]/route.ts
// THE CORE ENGINE OF YOUR ENTIRE PLATFORM! 🔥🚀
// 
// This is a DYNAMIC API route that handles ALL portfolio sites.
// The [siteName] in the filename makes this route dynamic - it captures
// whatever comes after /api/portfolio/ in the URL.
// 
// Examples:
// - POST /api/portfolio/chatbot → params.siteName = "chatbot"
// - POST /api/portfolio/video-generator → params.siteName = "video-generator"
// - POST /api/portfolio/anything → params.siteName = "anything"

import { NextRequest, NextResponse } from "next/server";
import { getAuthUser, getUserCredentialsBySiteNameAction } from "@/utils/actions";

export async function POST(request: NextRequest, props: { params: Promise<{ siteName: string }> }) {
  const params = await props.params;
  try {
    // Log every request for debugging and monitoring
    console.log(`🔥 API CALL: Processing ${params.siteName} request`);

    // ==================================================
    // STEP 1: AUTHENTICATE THE USER
    // ==================================================
    // We must verify the user is logged in before doing ANYTHING.
    // This prevents unauthorized access to anyone's webhooks or data.
    // getAuthUser() returns the Clerk user object or throws an error if not logged in.
    const user = await getAuthUser();
    if (!user) {
      // If no user is found, return 401 Unauthorized
      // The frontend should redirect to login when it sees this error
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // ==================================================
    // STEP 2: GET USER'S SITE-SPECIFIC CREDENTIALS
    // ==================================================
    // Each user can have different credentials for each site type.
    // For example:
    // - User John's "chatbot" site uses webhook A + OpenAI key X
    // - User John's "video-generator" site uses webhook B + Hedra key Y
    // - User Mary's "chatbot" site uses webhook C + OpenAI key Z
    // 
    // getUserCredentialsAction looks up the current user's credentials
    // for the specific siteName (from the URL parameter)
    const credentialsResult = await getUserCredentialsBySiteNameAction( user.id, params.siteName);
    
    // Check if the user has configured credentials for this site
    if (!credentialsResult.success || !credentialsResult.credentials) {
      // This means the user hasn't set up this site yet
      // Frontend can use the "needsSetup: true" flag to show a setup form
      return NextResponse.json(
        { 
          error: `No credentials configured for ${params.siteName}. Please configure your site first.`,
          needsSetup: true  // Special flag for frontend to know to show setup
        },
        { status: 400 }
      );
    }

    // Extract the credentials object (contains webhook, API keys, etc.)
    const userCredentials = credentialsResult.credentials;
    console.log(`✅ Found credentials for ${params.siteName}:`, Object.keys(userCredentials));

    // ==================================================
    // STEP 3: VALIDATE WEBHOOK EXISTS
    // ==================================================
    // Every site needs at least a webhook URL to function.
    // The webhook is where we'll send the user's data for processing.
    if (!userCredentials.webhook) {
      return NextResponse.json(
        { error: "Webhook URL not configured for this site" },
        { status: 400 }
      );
    }

    // ==================================================
    // STEP 4: EXTRACT AND PARSE REQUEST DATA
    // ==================================================
    // The frontend can send data in different formats:
    // 1. JSON - for simple data (chat messages, form data)
    // 2. FormData - for file uploads (images, videos, documents)
    // 
    // We need to handle both formats properly
    const contentType = request.headers.get("content-type") || "";
    let requestData: any;

    if (contentType.includes("multipart/form-data")) {
      // This is FormData - typically used for file uploads
      // FormData can contain both text fields and binary files
      requestData = await request.formData();
      console.log("📦 Handling FormData request (likely file upload)");
    } else if (contentType.includes("application/json")) {
      // This is JSON - typically used for simple data
      // JSON is easier to work with but can't contain binary files directly
      requestData = await request.json();
      console.log("📦 Handling JSON request");
    } else {
      // We don't support other content types (like plain text, XML, etc.)
      return NextResponse.json(
        { error: "Unsupported content type. Use JSON or FormData." },
        { status: 400 }
      );
    }

    console.log(`📦 Received data type: ${contentType.includes("multipart") ? "FormData" : "JSON"}`);

    // ==================================================
    // STEP 5: PREPARE DATA FOR USER'S N8N WEBHOOK
    // ==================================================
    // We need to combine the user's original data with their credentials
    // and some metadata, then format it properly for their n8n webhook.
    let forwardData: FormData | string;

    if (contentType.includes("multipart/form-data")) {
      // FOR FORMDATA REQUESTS (file uploads):
      // We create a new FormData object and copy everything over,
      // then add the user's credentials and metadata as additional fields
      forwardData = new FormData();
      
      // Copy ALL original form fields (including files) to the new FormData
      (requestData as FormData).forEach((value, key) => {
        (forwardData as FormData).append(key, value);
      });
      
      // Add user's credentials (excluding webhook to avoid confusion in n8n)
      // We destructure to separate webhook from other credentials
      const { webhook, ...credentialsForN8N } = userCredentials;
      
      // Add credentials as a JSON string - n8n can parse this
      (forwardData as FormData).append('user_credentials', JSON.stringify(credentialsForN8N));
      
      // Add useful metadata that n8n workflows might need
      (forwardData as FormData).append('site_name', params.siteName);  // "chatbot", "video-generator", etc.
      (forwardData as FormData).append('user_id', user.id);            // Unique user identifier
      
    } else {
      // FOR JSON REQUESTS:
      // We merge the original JSON data with credentials and metadata
      // into a single JSON object
      const { webhook, ...credentialsForN8N } = userCredentials;
      
      const enrichedData = {
        ...requestData,                           // Original data from frontend
        user_credentials: credentialsForN8N,      // User's API keys, settings, etc.
        site_name: params.siteName,               // Which site this is for
        user_id: user.id,                         // Who this belongs to
        timestamp: new Date().toISOString()       // When this happened
      };
      
      // Convert the enriched object back to JSON string for sending
      forwardData = JSON.stringify(enrichedData);
    }

    console.log(`🚀 Forwarding to user's webhook: ${userCredentials.webhook}`);

    // ==================================================
    // STEP 6: FORWARD REQUEST TO USER'S N8N WEBHOOK
    // ==================================================
    // This is the MAGIC MOMENT! We take the user's data + credentials
    // and send it to THEIR specific n8n workflow, not ours.
    // This means:
    // - They pay for their own API usage (OpenAI, Hedra, etc.)
    // - They control their own workflow logic
    // - We just provide the frontend and routing
    const webhookResponse = await fetch(userCredentials.webhook, {
      method: "POST",
      body: forwardData,
      headers: contentType.includes("application/json") ? {
        "Content-Type": "application/json"
      } : undefined, // For FormData, let the browser set the Content-Type with boundary
    });

    console.log(`📡 Webhook response status: ${webhookResponse.status}`);

    // Check if the user's n8n workflow had any errors
    if (!webhookResponse.ok) {
      // The user's webhook failed - this could be:
      // - Their n8n workflow has bugs
      // - Their API keys are invalid
      // - Their webhook URL is wrong
      // - Their n8n instance is down
      console.error(`❌ Webhook failed: ${webhookResponse.status} ${webhookResponse.statusText}`);
      return NextResponse.json(
        { 
          error: "Your n8n workflow returned an error. Please check your workflow configuration.",
          webhookStatus: webhookResponse.status,     // HTTP status code from their webhook
          webhookError: webhookResponse.statusText   // Error message from their webhook
        },
        { status: 500 }
      );
    }

    // ==================================================
    // STEP 7: PROCESS THE N8N RESPONSE
    // ==================================================
    // The user's n8n workflow can return different types of responses:
    // - JSON (most common) - structured data
    // - Text - simple messages
    // - Binary files - images, videos, documents
    // - Empty responses
    // 
    // We need to handle all these cases gracefully
    let n8nResult: any;
    const responseContentType = webhookResponse.headers.get("content-type") || "";

    try {
      if (responseContentType.includes("application/json")) {
        // The response is JSON - parse it normally
        n8nResult = await webhookResponse.json();
        console.log("✅ Received JSON response from n8n");
      } else {
        // The response is NOT JSON (could be text, html, binary, etc.)
        // We'll treat it as text and wrap it in an object
        const responseText = await webhookResponse.text();
        n8nResult = { 
          response: responseText, 
          contentType: responseContentType 
        };
        console.log(`✅ Received non-JSON response: ${responseContentType}`);
      }
    } catch (parseError) {
      // If we can't parse the response (corrupted JSON, etc.)
      // fall back to treating it as plain text
      console.warn("⚠️ Could not parse webhook response as JSON, treating as text");
      const responseText = await webhookResponse.text();
      n8nResult = { response: responseText };
    }

    console.log(`✅ Successfully processed ${params.siteName} request`);

    // ==================================================
    // STEP 8: RETURN ENHANCED RESPONSE TO FRONTEND
    // ==================================================
    // We take the n8n response and enhance it with additional metadata
    // that our frontend might find useful. We also standardize the format
    // so the frontend knows what to expect.
    return NextResponse.json({
      success: true,                                    // Always include success indicator
      message: `${params.siteName} request processed successfully`,  // Human-readable message
      data: n8nResult,                                  // The actual response from user's n8n
      siteName: params.siteName,                        // Which site this was for
      timestamp: new Date().toISOString(),              // When we processed this
      
      // SMART FIELD EXTRACTION:
      // If the n8n response contains common fields, we extract them
      // to the top level for easier frontend access
      ...(n8nResult.image_generated && { imageGenerated: n8nResult.image_generated }),
      ...(n8nResult.file_url && { fileUrl: n8nResult.file_url }),
      ...(n8nResult.download_link && { downloadLink: n8nResult.download_link }),
    });

  } catch (error) {
    // ==================================================
    // GLOBAL ERROR HANDLER
    // ==================================================
    // If ANYTHING goes wrong in our code (not the user's webhook),
    // we catch it here and return a proper error response.
    // This prevents the API from crashing and gives useful debugging info.
    console.error(`💥 API ERROR for ${params.siteName}:`, error);
    
    return NextResponse.json(
      {
        error: "Internal server error",                                   // Generic error message for users
        message: error instanceof Error ? error.message : "Unknown error occurred",  // Detailed error for debugging
        siteName: params.siteName,                                        // Context about what was being processed
      },
      { status: 500 }
    );
  }
}

// ==================================================
// HANDLE CORS PREFLIGHT REQUESTS
// ==================================================
// Some browsers send an OPTIONS request before the actual POST request
// to check if the request is allowed (CORS preflight).
// We need to respond with appropriate headers to allow the request.
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",                    // Allow requests from any origin
      "Access-Control-Allow-Methods": "POST, OPTIONS",       // Allow POST and OPTIONS methods
      "Access-Control-Allow-Headers": "Content-Type, Authorization",  // Allow these headers
    },
  });
}

/*
🔥 THIS API ROUTE IS THE HEART OF YOUR PLATFORM! 🔥

WHAT IT DOES:
This single API route handles ALL portfolio sites on your platform.
Instead of creating separate API routes for each site type (chatbot, video-generator, etc.),
this ONE route dynamically handles them all based on the URL parameter.

HOW IT WORKS:
1. User interacts with their portfolio site (e.g., submits a chat message)
2. Frontend sends data to /api/portfolio/[siteName] (e.g., /api/portfolio/chatbot)
3. API authenticates the user and looks up their credentials for that site
4. API forwards the request + credentials to the user's personal n8n webhook
5. User's n8n workflow processes the request using their own API keys
6. API receives the response and forwards it back to the frontend
7. User pays for their own API usage (OpenAI, Hedra, etc.)
8. You get subscription revenue without infrastructure costs!

KEY FEATURES:
✅ ONE API handles unlimited site types
✅ Automatic user authentication and authorization
✅ User-specific credential injection
✅ Supports both JSON and file uploads
✅ Handles any type of n8n response
✅ Rich error handling and logging
✅ User isolation (can't access other users' data)
✅ Future-proof (works with any site you build)

USAGE EXAMPLES:
- POST /api/portfolio/chatbot → Routes to user's chatbot webhook
- POST /api/portfolio/video-generator → Routes to user's video webhook  
- POST /api/portfolio/ecommerce → Routes to user's store webhook
- POST /api/portfolio/quiz-maker → Routes to user's quiz webhook
- POST /api/portfolio/anything → Routes to user's anything webhook

DATA FLOW:
Frontend → Your API → User's n8n → User's API providers → Back through the chain

BUSINESS MODEL:
- Users pay YOU for the platform access
- Users pay THEMSELVES for the API usage
- You provide the interface, they provide the infrastructure
- Perfect scalability with no infrastructure costs!

This architecture will scale to millions of users and unlimited site types! 🚀💪
*/



/* 
==================================================
RECOMMENDED N8N RESPONSE FORMAT
==================================================

For the best user experience, configure your n8n workflows to return
JSON responses in this standardized format:

{
  "success": true,
  "message": "Video created successfully!",
  "data": {
    "video_url": "https://storage.googleapis.com/bucket/video.mp4",
    "thumbnail": "https://storage.googleapis.com/bucket/thumb.jpg",
    "duration": 30,
    "file_size": "5.2MB"
  },
  "file_url": "https://download-link-for-large-files...",
  "image_generated": "data:image/jpeg;base64,/9j/4AAQSkZJ...",
  "download_link": "https://temporary-download-url...",
  "metadata": {
    "processing_time": "45 seconds",
    "cost": "$0.12",
    "model_used": "gpt-4"
  }
}

FIELD EXPLANATIONS:
- success: Boolean indicating if the operation succeeded
- message: Human-readable message for the user
- data: Main response data (structured object)
- file_url: URL for large files (videos, documents)
- image_generated: Base64 encoded images for small/quick previews
- download_link: Temporary download URLs with expiration
- metadata: Additional info about the operation

The API will automatically extract common fields like image_generated,
file_url, and download_link to the top level of the response for
easier frontend access.
*/