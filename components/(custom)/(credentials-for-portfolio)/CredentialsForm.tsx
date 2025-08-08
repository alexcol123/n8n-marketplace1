'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllSitesAction, getUserCredentialsAction, saveUserCredentialsAction } from '@/utils/actions';

export default function CredentialSetup({ siteName }) {
  const [credentials, setCredentials] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [siteData, setSiteData] = useState(null);
  const [loadingSite, setLoadingSite] = useState(true);
  const router = useRouter();

  const credentialLabels = {
    webhook: "Main Webhook URL",
    endwebhook: "End Session Webhook",
    openai_api_key: "OpenAI API Key",
    stripe_key: "Stripe API Key",
    hedra_api_key: "Hedra API Key"
  };

  const credentialPlaceholders = {
    webhook: "https://hooks.n8n.io/webhook/your-webhook",
    endwebhook: "https://hooks.n8n.io/webhook/end-session",
    openai_api_key: "sk-...",
    stripe_key: "sk_live_...",
    hedra_api_key: "hedra_..."
  };

  // Load site data and existing credentials
  useEffect(() => {
    loadSiteData();
  }, [siteName]);

  const loadSiteData = async () => {
    setLoadingSite(true);
    try {
      // Get all sites and find the one we need
      const sitesResult = await getAllSitesAction();
      if (sitesResult.success) {
        const site = sitesResult.sites.find(s => s.siteName === siteName);
        setSiteData(site);
        
        if (site) {
          // Load existing user credentials for this site
          const credsResult = await getUserCredentialsAction(siteName);
          if (credsResult.success && credsResult.credentials) {
            setCredentials(credsResult.credentials);
          }
        }
      }
    } catch (error) {
      console.error('Error loading site data:', error);
    } finally {
      setLoadingSite(false);
    }
  };

  const handleSubmit = async () => {
    if (!siteData?.requiredCredentials) return;
    
    setIsLoading(true);
    
    // Check if all required credentials are filled
    const missingCredentials = siteData.requiredCredentials.filter(
      cred => !credentials[cred] || credentials[cred].trim() === ''
    );
    
    if (missingCredentials.length > 0) {
      alert(`Please fill in: ${missingCredentials.join(', ')}`);
      setIsLoading(false);
      return;
    }

    try {
      const result = await saveUserCredentialsAction(siteName, credentials);
      
      if (result.success) {
        alert('Credentials saved successfully!');
        // Redirect back to the site
        router.push(`/dashboard/portfolio/${siteName}`);
      } else {
        alert(result.message);
      }
    } catch (error) {
      alert('Error saving credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (loadingSite) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-card border rounded-lg p-6 text-center">
          <div className="text-muted-foreground">Loading site configuration...</div>
        </div>
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-card border rounded-lg p-6 text-center">
          <div className="text-red-600">Site not found: {siteName}</div>
          <button 
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 border rounded-lg hover:bg-muted"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-card border rounded-lg p-6">
        {/* Site Info */}
        <div className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">
            Configure {siteData.name}
          </h2>
          <p className="text-muted-foreground mb-3">
            {siteData.description}
          </p>
          <div className="bg-muted/50 p-3 rounded-lg text-sm">
            <strong>Required credentials for this site:</strong> {siteData.requiredCredentials.join(', ')}
          </div>
        </div>

        <div className="space-y-4">
          {siteData.requiredCredentials.map((credType) => (
            <div key={credType}>
              <label className="block text-sm font-medium mb-2">
                {credentialLabels[credType] || credType} *
              </label>
              <input
                type={credType.includes('key') ? 'password' : 'url'}
                value={credentials[credType] || ''}
                onChange={(e) => setCredentials(prev => ({
                  ...prev,
                  [credType]: e.target.value
                }))}
                onKeyPress={handleKeyPress}
                placeholder={credentialPlaceholders[credType] || `Enter ${credType}`}
                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          ))}

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !siteData?.requiredCredentials}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {isLoading ? 'Saving...' : 'Save & Go Live'}
            </button>
            
            <button
              className="border px-6 py-2 rounded-lg hover:bg-muted"
              onClick={() => router.back()}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}