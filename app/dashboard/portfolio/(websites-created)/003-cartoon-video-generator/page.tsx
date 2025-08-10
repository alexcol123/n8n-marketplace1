// "use client";

// import CredentialSetup from "@/components/(custom)/(credentials-for-portfolio)/CredentialsForm";
// import { getAllSitesAction } from "@/utils/actions";
// import { useState, useEffect } from "react";

// export default function VideoGeneratorPage() {
//   const [script, setScript] = useState('');
//   const [showSetup, setShowSetup] = useState(false);
//   const [userCredentials, setUserCredentials] = useState({
//     webhook: "https://hooks.n8n.io/webhook/user-video-123",
//     hedra_api_key: "hedra_demo_key"
//   });
//   const [loadedCredentials, setLoadedCredentials] = useState(null);
//   const [debugSites, setDebugSites] = useState([]);
//   const [loadingSites, setLoadingSites] = useState(true);
//   const [isGenerating, setIsGenerating] = useState(false);

//   const saveCredentials = async (credentials) => {
//     setUserCredentials(credentials);
//     setShowSetup(false);
//     // Reload credentials from database
//     await loadCredentials();
//     alert('Credentials saved! Your video generator is now live.');
//   };

//   // Load sites for debugging AND load real credentials
//   useEffect(() => {
//     loadDebugSites();
//     loadCredentials();
//   }, []);

//   const loadCredentials = async () => {
//     try {
//       const result = await getUserCredentialsAction('003-cartoon-video-generator');
//       console.log('Credentials for 003-cartoon-video-generator:', result); // Debug log
//       if (result.success && result.credentials) {
//         setLoadedCredentials(result.credentials);
//         setUserCredentials(result.credentials);
//       }
//     } catch (error) {
//       console.error('Error loading credentials:', error);
//     }
//   };

//   const loadDebugSites = async () => {
//     setLoadingSites(true);
//     try {
//       const result = await getAllSitesAction();
//       console.log('Sites result:', result);
//       if (result.success) {
//         setDebugSites(result.sites);
//       }
//     } catch (error) {
//       console.error('Error loading sites:', error);
//     } finally {
//       setLoadingSites(false);
//     }
//   };

//   const generateVideo = async () => {
//     if (!script.trim()) return;

//     setIsGenerating(true);

//     try {
//       // Send to user's webhook
//       const response = await fetch(userCredentials.webhook, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           script: script,
//           hedra_key: userCredentials.hedra_api_key,
//           timestamp: new Date().toISOString()
//         })
//       });

//       // Fake response for demo
//       alert(`Video generation started! Using ${userCredentials.webhook}`);

//     } catch (error) {
//       alert('Error: Could not connect to webhook');
//     } finally {
//       setIsGenerating(false);
//     }

//     setScript('');
//   };

//   // Show setup form if requested
//   if (showSetup) {
//     return (
//       <CredentialSetup siteName="002-video-generator" />
//     );
//   }

//   return (
//     <div className="min-h-screen bg-background p-6">
//       <div className="max-w-2xl mx-auto">

//         {/* DEBUG: ALL SITES PANEL */}
//         <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
//           <div className="flex justify-between items-center mb-3">
//             <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">🔍 Debug: All Sites in Database</h3>
//             <button
//               onClick={loadDebugSites}
//               className="text-xs px-2 py-1 border rounded hover:bg-yellow-100 dark:hover:bg-yellow-800"
//             >
//               Refresh
//             </button>
//           </div>

//           {loadingSites ? (
//             <div className="text-sm text-yellow-700 dark:text-yellow-300">Loading sites...</div>
//           ) : (
//             <div className="space-y-2 text-sm">
//               <div className="font-medium text-yellow-800 dark:text-yellow-200">
//                 Found {debugSites.length} sites:
//               </div>

//               {debugSites.length === 0 ? (
//                 <div className="text-yellow-600 dark:text-yellow-400 italic">
//                   No sites found! Go to /admin/websites to add sites first.
//                 </div>
//               ) : (
//                 debugSites.map((site, i) => (
//                   <div key={site.id} className="bg-white dark:bg-gray-800 p-2 rounded border">
//                     <div><strong>#{i + 1} Site Name:</strong> {site.siteName}</div>
//                     <div><strong>Display Name:</strong> {site.name}</div>
//                     <div><strong>Required Credentials:</strong> {JSON.stringify(site.requiredCredentials)}</div>
//                     <div><strong>Status:</strong> {site.status}</div>
//                     <div><strong>siteUrl:</strong> {site.siteUrl}</div>
//                   </div>
//                 ))
//               )}
//             </div>
//           )}
//         </div>

//         {/* CREDENTIALS DISPLAY PANEL */}
//         <div className="bg-card border rounded-lg p-4 mb-6">
//           <h3 className="font-semibold mb-3">Your Current Credentials for 003-cartoon-video-generator</h3>
//           <div className="space-y-2 text-sm">
//             <div className="flex justify-between">
//               <span className="font-medium">Status:</span>
//               <span className={loadedCredentials ? 'text-green-600' : 'text-orange-600'}>
//                 {loadedCredentials ? '✅ Configured' : '⚠️ Using Defaults'}
//               </span>
//             </div>
//             <div className="border-t pt-2 space-y-1">
//               <div><strong>Webhook:</strong>
//                 <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
//                   {userCredentials.webhook}
//                 </code>
//               </div>
//               <div><strong>Hedra API Key:</strong>
//                 <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
//                   {userCredentials.hedra_api_key || 'Not set'}
//                 </code>
//               </div>
//             </div>
//             <div className="text-xs text-muted-foreground pt-2">
//               {loadedCredentials
//                 ? `✅ Real credentials loaded for site: 003-cartoon-video-generator`
//                 : `⚠️ No saved credentials for 003-cartoon-video-generator - using demo URLs`
//               }
//             </div>
//           </div>
//         </div>

//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-3xl font-semibold">🎬 AI Video Generator</h1>
//           <button
//             onClick={() => setShowSetup(true)}
//             className="px-4 py-2 bg-muted border rounded-lg hover:bg-muted/80"
//           >
//             Configure
//           </button>
//         </div>

//         {/* Add site here - */}
//         <div className="bg-card border rounded-lg p-6 mb-6">
//           <h3 className="text-lg font-semibold mb-4">Generate Your Video</h3>

//           <div className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium mb-2">Video Script</label>
//               <textarea
//                 value={script}
//                 onChange={(e) => setScript(e.target.value)}
//                 placeholder="Enter your video script here..."
//                 rows={4}
//                 className="w-full px-3 py-2 border rounded-lg bg-background"
//               />
//             </div>

//             <button
//               onClick={generateVideo}
//               disabled={isGenerating || !script.trim()}
//               className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50"
//             >
//               {isGenerating ? 'Generating Video...' : '🎬 Generate Video'}
//             </button>
//           </div>
//         </div>

//         <div className="bg-muted/50 border rounded-lg p-4 text-center">
//           <p className="text-sm text-muted-foreground">
//             Demo video generator site. Configure your credentials to connect to your n8n workflow.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import CredentialSetup from "@/components/(custom)/(credentials-for-portfolio)/CredentialsForm";
import { getAllSitesAction, getUserCredentialsAction } from "@/utils/actions"; // 🔥 ADD IMPORT
import { useState, useEffect } from "react";
import CartoonVideoForm from "./CartoonVideoForm";

export default function VideoGeneratorPage() {
  const [script, setScript] = useState("");
  const [showSetup, setShowSetup] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    webhook: "https://hooks.n8n.io/webhook/user-video-123",
    hedra_api_key: "hedra_demo_key",
  });
  const [loadedCredentials, setLoadedCredentials] = useState(null);
  const [debugSites, setDebugSites] = useState([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState(null);

  // 🔥 THIS CAN BE ANY SITE NAME - your API is dynamic!
  const SITE_NAME = "003-cartoon-video-generator"; // This will be captured by [siteName] parameter
  const saveCredentials = async (credentials) => {
    setUserCredentials(credentials);
    setShowSetup(false);
    // Reload credentials from database
    await loadCredentials();
    alert("Credentials saved! Your video generator is now live.");
  };

  // Load sites for debugging AND load real credentials
  useEffect(() => {
    loadDebugSites();
    loadCredentials();
  }, []);

  const loadCredentials = async () => {
    try {
      // 🔥 USE THE CORRECT SITE NAME
      const result = await getUserCredentialsAction(SITE_NAME);
      console.log(`Credentials for ${SITE_NAME}:`, result); // Debug log
      if (result.success && result.credentials) {
        setLoadedCredentials(result.credentials);
        setUserCredentials(result.credentials);
      }
    } catch (error) {
      console.error("Error loading credentials:", error);
    }
  };

  const loadDebugSites = async () => {
    setLoadingSites(true);
    try {
      const result = await getAllSitesAction();
      console.log("Sites result:", result);
      if (result.success) {
        setDebugSites(result.sites);
      }
    } catch (error) {
      console.error("Error loading sites:", error);
    } finally {
      setLoadingSites(false);
    }
  };

  // 🔥 NEW: Use your dynamic API instead of direct webhook calls
  const generateVideo = async () => {
    if (!script.trim()) return;

    setIsGenerating(true);
    setResult(null);

    try {
      // 🔥 CREATE FORM DATA (your API expects this format)
      const formData = new FormData();
      formData.append("Face_Photo", new Blob(), "demo.jpg"); // Placeholder file
      formData.append("Spoken_Text_Topic", script);
      formData.append("Gender", "male"); // Default values
      formData.append("Scene_Setting", "studio");
      formData.append("Character_Style", "cartoon");
      formData.append("Famous_Face_Blend", "none");
      formData.append("Email", "demo@example.com");

      // 🔥 SEND TO YOUR DYNAMIC PORTFOLIO API
      const response = await fetch(`/api/portfolio/${SITE_NAME}`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: result.message,
          data: result.data,
          imageGenerated: result.imageGenerated,
          fileUrl: result.fileUrl,
          downloadLink: result.downloadLink,
          siteName: result.siteName,
          timestamp: result.timestamp,
        });
      } else {
        // Handle different error types
        if (result.needsSetup) {
          setResult({
            success: false,
            message:
              "Please configure your cartoon video generator credentials first.",
            needsSetup: true,
            siteName: SITE_NAME,
          });
        } else if (result.webhookStatus) {
          setResult({
            success: false,
            message: `Your n8n workflow returned an error (Status: ${result.webhookStatus}). Please check your workflow configuration.`,
            webhookError: result.webhookError,
          });
        } else {
          setResult({
            success: false,
            message: result.error || "Something went wrong",
          });
        }
      }
    } catch (error) {
      console.error("Video generation error:", error);
      setResult({
        success: false,
        message:
          "Failed to generate video. Please check your connection and try again.",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // Show setup form if requested
  if (showSetup) {
    return <CredentialSetup siteName={SITE_NAME} />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* DEBUG: ALL SITES PANEL */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
              🔍 Debug: All Sites in Database
            </h3>
            <button
              onClick={loadDebugSites}
              className="text-xs px-2 py-1 border rounded hover:bg-yellow-100 dark:hover:bg-yellow-800"
            >
              Refresh
            </button>
          </div>

          {loadingSites ? (
            <div className="text-sm text-yellow-700 dark:text-yellow-300">
              Loading sites...
            </div>
          ) : (
            <div className="space-y-2 text-sm">
              <div className="font-medium text-yellow-800 dark:text-yellow-200">
                Found {debugSites.length} sites:
              </div>

              {debugSites.length === 0 ? (
                <div className="text-yellow-600 dark:text-yellow-400 italic">
                  No sites found! Go to /admin/websites to add sites first.
                </div>
              ) : (
                debugSites.map((site, i) => (
                  <div
                    key={site.id}
                    className="bg-white dark:bg-gray-800 p-2 rounded border"
                  >
                    <div>
                      <strong>#{i + 1} Site Name:</strong> {site.siteName}
                    </div>
                    <div>
                      <strong>Display Name:</strong> {site.name}
                    </div>
                    <div>
                      <strong>Required Credentials:</strong>{" "}
                      {JSON.stringify(site.requiredCredentials)}
                    </div>
                    <div>
                      <strong>Status:</strong> {site.status}
                    </div>
                    <div>
                      <strong>siteUrl:</strong> {site.siteUrl}
                    </div>
                  </div>
                ))
              )}

              {/* 🔥 ADD SITE HERE - Dynamic API supports any site name */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded p-3 mt-4">
                <div className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                  🎯 Current Site: {SITE_NAME}
                </div>
                <div className="text-blue-600 dark:text-blue-400">
                  ✅ Using dynamic API: <code>/api/portfolio/{SITE_NAME}</code>
                </div>
                <div className="text-xs text-blue-500 dark:text-blue-400 mt-1">
                  Your dynamic API can handle any site name automatically!
                </div>
              </div>
            </div>
          )}
        </div>

        {/* CREDENTIALS DISPLAY PANEL */}
        <div className="bg-card border rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">
            Your Current Credentials for {SITE_NAME}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span
                className={
                  loadedCredentials ? "text-green-600" : "text-orange-600"
                }
              >
                {loadedCredentials ? "✅ Configured" : "⚠️ Using Defaults"}
              </span>
            </div>
            <div className="border-t pt-2 space-y-1">
              <div>
                <strong>Webhook:</strong>
                <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                  {userCredentials.webhook}
                </code>
              </div>
              <div>
                <strong>Hedra API Key:</strong>
                <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                  {userCredentials.hedra_api_key || "Not set"}
                </code>
              </div>
            </div>
            <div className="text-xs text-muted-foreground pt-2">
              {loadedCredentials
                ? `✅ Real credentials loaded for site: ${SITE_NAME}`
                : `⚠️ No saved credentials for ${SITE_NAME} - using demo URLs`}
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">🎬 AI Video Generator</h1>
          <button
            onClick={() => setShowSetup(true)}
            className="px-4 py-2 bg-muted border rounded-lg hover:bg-muted/80"
          >
            Configure
          </button>
        </div>

    <div className="bg-card border rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">🎬 Create Cartoon Video</h3>
          
          <CartoonVideoForm />
        </div>


        {/* 🔥 ENHANCED RESULT DISPLAY */}
        {result && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              result.success
                ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
            }`}
          >
            <div
              className={`font-medium ${
                result.success
                  ? "text-green-800 dark:text-green-200"
                  : "text-red-800 dark:text-red-200"
              }`}
            >
              {result.success ? "✅ Success!" : "❌ Error"}
            </div>
            <div
              className={`text-sm mt-1 ${
                result.success
                  ? "text-green-700 dark:text-green-300"
                  : "text-red-700 dark:text-red-300"
              }`}
            >
              {result.message}
            </div>

            {/* Setup Required Notice */}
            {result.needsSetup && (
              <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Setup Required:</strong> You need to configure your
                  credentials for the cartoon video generator.
                </p>
                <button
                  onClick={() => setShowSetup(true)}
                  className="mt-2 text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                >
                  → Configure Now
                </button>
              </div>
            )}

            {/* Workflow Error Details */}
            {result.webhookError && (
              <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded">
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  <strong>Workflow Error:</strong> {result.webhookError}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                  Check your n8n workflow configuration and API credentials.
                </p>
              </div>
            )}

            {/* Success Results */}
            {result.success && (
              <div className="mt-4 space-y-3">
                {/* Generated Preview */}
                {result.imageGenerated && (
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Generated Preview:
                    </p>
                    <img
                      src={result.imageGenerated}
                      alt="Generated preview"
                      className="max-w-full h-auto rounded-lg border"
                    />
                  </div>
                )}

                {/* File Download */}
                {result.fileUrl && (
                  <div>
                    <p className="text-sm font-medium mb-2">Video File:</p>
                    <a
                      href={result.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
                    >
                      📥 Download Video
                    </a>
                  </div>
                )}

                {/* Download Link */}
                {result.downloadLink && (
                  <div>
                    <p className="text-sm font-medium mb-2">
                      Temporary Download:
                    </p>
                    <a
                      href={result.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
                    >
                      🔗 Open Download Link
                    </a>
                  </div>
                )}

                {/* Processing Info */}
                {result.data && (
                  <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      <strong>Site:</strong> {result.siteName} •
                      <strong>Processed:</strong>{" "}
                      {result.timestamp
                        ? new Date(result.timestamp).toLocaleString()
                        : "Just now"}
                    </p>
                    {result.data.processing_time && (
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        <strong>Processing Time:</strong>{" "}
                        {result.data.processing_time}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="bg-muted/50 border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Demo video generator site. Configure your credentials to connect to
            your n8n workflow.
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            API Endpoint: <code>/api/portfolio/{SITE_NAME}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
