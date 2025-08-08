"use client";

import CredentialSetup from "@/components/(custom)/(credentials-for-portfolio)/CredentialsForm";
import { getAllSitesAction } from "@/utils/actions";
import { useState, useEffect } from "react";

export default function VideoGeneratorPage() {
  const [script, setScript] = useState('');
  const [showSetup, setShowSetup] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    webhook: "https://hooks.n8n.io/webhook/user-video-123",
    hedra_api_key: "hedra_demo_key"
  });
  const [debugSites, setDebugSites] = useState([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);

  const saveCredentials = async (credentials) => {
    setUserCredentials(credentials);
    setShowSetup(false);
    alert('Credentials saved! Your video generator is now live.');
  };

  // Load sites for debugging
  useEffect(() => {
    loadDebugSites();
  }, []);

  const loadDebugSites = async () => {
    setLoadingSites(true);
    try {
      const result = await getAllSitesAction();
      console.log('Sites result:', result);
      if (result.success) {
        setDebugSites(result.sites);
      }
    } catch (error) {
      console.error('Error loading sites:', error);
    } finally {
      setLoadingSites(false);
    }
  };

  const generateVideo = async () => {
    if (!script.trim()) return;
    
    setIsGenerating(true);
    
    try {
      // Send to user's webhook
      const response = await fetch(userCredentials.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          script: script,
          hedra_key: userCredentials.hedra_api_key,
          timestamp: new Date().toISOString()
        })
      });
      
      // Fake response for demo
      alert(`Video generation started! Using ${userCredentials.webhook}`);
      
    } catch (error) {
      alert('Error: Could not connect to webhook');
    } finally {
      setIsGenerating(false);
    }
    
    setScript('');
  };

  // Show setup form if requested
  if (showSetup) {
    return (
      <CredentialSetup siteName="002-video-generator" />
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        
        {/* DEBUG: ALL SITES PANEL */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">🔍 Debug: All Sites in Database</h3>
            <button 
              onClick={loadDebugSites}
              className="text-xs px-2 py-1 border rounded hover:bg-yellow-100 dark:hover:bg-yellow-800"
            >
              Refresh
            </button>
          </div>
          
          {loadingSites ? (
            <div className="text-sm text-yellow-700 dark:text-yellow-300">Loading sites...</div>
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
                  <div key={site.id} className="bg-white dark:bg-gray-800 p-2 rounded border">
                    <div><strong>#{i + 1} Site Name:</strong> {site.siteName}</div>
                    <div><strong>Display Name:</strong> {site.name}</div>
                    <div><strong>Required Credentials:</strong> {JSON.stringify(site.requiredCredentials)}</div>
                    <div><strong>Status:</strong> {site.status}</div>
                    <div><strong>siteUrl:</strong> {site.siteUrl}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* CREDENTIALS DISPLAY PANEL */}
        <div className="bg-card border rounded-lg p-4 mb-6">
          <h3 className="font-semibold mb-3">Your Current Credentials</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className="text-green-600">✅ Configured</span>
            </div>
            <div className="border-t pt-2 space-y-1">
              <div><strong>Webhook:</strong> 
                <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                  {userCredentials.webhook}
                </code>
              </div>
              <div><strong>Hedra API Key:</strong> 
                <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                  {userCredentials.hedra_api_key}
                </code>
              </div>
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
          <h3 className="text-lg font-semibold mb-4">Generate Your Video</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Video Script</label>
              <textarea
                value={script}
                onChange={(e) => setScript(e.target.value)}
                placeholder="Enter your video script here..."
                rows={4}
                className="w-full px-3 py-2 border rounded-lg bg-background"
              />
            </div>
            
            <button
              onClick={generateVideo}
              disabled={isGenerating || !script.trim()}
              className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isGenerating ? 'Generating Video...' : '🎬 Generate Video'}
            </button>
          </div>
        </div>

        <div className="bg-muted/50 border rounded-lg p-4 text-center">
          <p className="text-sm text-muted-foreground">
            Demo video generator site. Configure your credentials to connect to your n8n workflow.
          </p>
        </div>
      </div>
    </div>
  );
}
