"use client";

import CredentialSetup from "@/components/(custom)/(credentials-for-portfolio)/CredentialsForm";
import { getAllSitesAction } from "@/utils/actions";
import { useState , useEffect} from "react";

export default function ChatbotPage() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [showSetup, setShowSetup] = useState(false);
  const [userCredentials, setUserCredentials] = useState({
    webhook: "https://hooks.n8n.io/webhook/user-chat-123",
    endwebhook: "https://hooks.n8n.io/webhook/user-end-456"
  });
  const [debugSites, setDebugSites] = useState([]);
  const [loadingSites, setLoadingSites] = useState(true);

  const saveCredentials = async (credentials) => {
    // Save credentials (fake for now)
    setUserCredentials(credentials);
    setShowSetup(false);
    alert('Credentials saved! Your chatbot is now live.');
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

  const sendMessage = async () => {
    if (!message.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { type: 'user', text: message }]);
    
    try {
      // Send to user's webhook
      const response = await fetch(userCredentials.webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: message,
          timestamp: new Date().toISOString()
        })
      });
      
      // Fake response for demo
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: `Response from ${userCredentials.webhook}` 
      }]);
      
    } catch (error) {
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'Error: Could not connect to webhook' 
      }]);
    }
    
    setMessage('');
  };

  // Show setup form if requested
  if (showSetup) {
    return (
      <CredentialSetup siteName="001-chatbot" />
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
              <div><strong>End Webhook:</strong> 
                <code className="ml-2 text-xs bg-muted px-2 py-1 rounded">
                  {userCredentials.endwebhook}
                </code>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-semibold">AI Customer Support</h1>
          <button 
            onClick={() => setShowSetup(true)}
            className="px-4 py-2 bg-muted border rounded-lg hover:bg-muted/80"
          >
            Configure
          </button>
        </div>
        
        <div className="bg-card border rounded-lg h-96 p-4 mb-4 overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`mb-3 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block p-3 rounded-lg max-w-xs ${
                msg.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-foreground'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-3 py-2 border rounded-lg bg-background"
          />
          <button 
            onClick={sendMessage}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}