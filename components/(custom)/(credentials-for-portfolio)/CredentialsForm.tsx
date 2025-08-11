'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  getAllSitesAction, 
  getUserCredentialsBySiteNameAction, 
  saveUserSiteCredentialsAction,
  fetchProfile 
} from '@/utils/actions';

interface CredentialSetupProps {
  siteName: string;
  onComplete?: () => void;
}

interface UserProfile {
  clerkId: string;
  firstName: string;
  lastName: string;
}

interface Site {
  id: string;
  siteName: string;
  name: string;
  description: string;
  requiredCredentials: string[];
  category?: string;
  difficulty?: string;
}

export default function CredentialSetup({ siteName, onComplete }: CredentialSetupProps) {
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [siteData, setSiteData] = useState<Site | null>(null);
  const [loadingSite, setLoadingSite] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const router = useRouter();

  const credentialLabels: Record<string, string> = {
    webhook: "Main Webhook URL",
    endwebhook: "End Session Webhook",
    openai_api_key: "OpenAI API Key",
    stripe_key: "Stripe API Key",
    hedra_api_key: "Hedra API Key",
    airtable_api_key: "Airtable API Key",
    notion_api_key: "Notion API Key",
    slack_webhook: "Slack Webhook URL",
    discord_webhook: "Discord Webhook URL"
  };

  const credentialPlaceholders: Record<string, string> = {
    webhook: "https://hooks.n8n.io/webhook/your-webhook",
    endwebhook: "https://hooks.n8n.io/webhook/end-session",
    openai_api_key: "sk-...",
    stripe_key: "sk_live_...",
    hedra_api_key: "hedra_...",
    airtable_api_key: "pat...",
    notion_api_key: "secret_...",
    slack_webhook: "https://hooks.slack.com/services/...",
    discord_webhook: "https://discord.com/api/webhooks/..."
  };

  // Load user profile and site data on mount
  useEffect(() => {
    loadUserAndSiteData();
  }, [siteName]);

  const loadUserAndSiteData = async () => {
    setLoadingSite(true);
    try {
      // First get user profile
      const profileData = await fetchProfile();
      setUserProfile(profileData as UserProfile);

      // Get all sites and find the one we need
      const sitesResult = await getAllSitesAction();
      if (sitesResult.success) {
        const site = sitesResult.sites.find((s: Site) => s.siteName === siteName);
        setSiteData(site || null);
        
        if (site && profileData) {
          // Load existing user credentials using NEW FK-based action
          const credsResult = await getUserCredentialsBySiteNameAction(
            profileData.clerkId, 
            siteName
          );
          
          if (credsResult.success && credsResult.credentials) {
            setCredentials(credsResult.credentials);
          }
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoadingSite(false);
    }
  };

  const handleSubmit = async () => {
    if (!siteData?.requiredCredentials || !userProfile) return;
    
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
      // 🚀 USE NEW FK-BASED ACTION
      const result = await saveUserSiteCredentialsAction(
        userProfile.clerkId,
        siteData.id, // Use site ID instead of siteName
        credentials
      );
      
      if (result.success) {
        alert('Credentials saved successfully! 🎉');
        
        // Call completion callback if provided
        if (onComplete) {
          onComplete();
        } else {
          // Redirect back to the site
          router.push(`/dashboard/portfolio/${siteName}`);
        }
      } else {
        alert(result.error || 'Failed to save credentials');
      }
    } catch (error) {
      console.error('Error saving credentials:', error);
      alert('Error saving credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  if (loadingSite) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-card border rounded-lg p-6 text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-muted-foreground">Loading site configuration...</div>
        </div>
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-card border rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            ❌ Site not found: <strong>{siteName}</strong>
          </div>
          <p className="text-muted-foreground mb-4">
            This automation site doesn't exist or may have been removed.
          </p>
          <button 
            onClick={() => router.back()}
            className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-card border rounded-lg p-6">
        {/* Site Info Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-2xl font-semibold">
              🔧 Configure {siteData.name}
            </h2>
            {siteData.category && (
              <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {siteData.category}
              </span>
            )}
            {siteData.difficulty && (
              <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                {siteData.difficulty}
              </span>
            )}
          </div>
          
          <p className="text-muted-foreground mb-4">
            {siteData.description}
          </p>
          
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-primary">🔑</span>
              <strong className="text-primary">Required credentials for this site:</strong>
            </div>
            <div className="flex flex-wrap gap-2">
              {siteData.requiredCredentials.map(cred => (
                <span key={cred} className="px-2 py-1 bg-primary/20 text-primary text-sm rounded">
                  {credentialLabels[cred] || cred}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Credentials Form */}
        <div className="space-y-4">
          {siteData.requiredCredentials.map((credType) => (
            <div key={credType}>
              <label className="block text-sm font-medium mb-2">
                {credentialLabels[credType] || credType} 
                <span className="text-red-500 ml-1">*</span>
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
                className="w-full px-3 py-2 border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
              {credentials[credType] && (
                <div className="mt-1 text-xs text-green-600 flex items-center gap-1">
                  <span>✅</span>
                  Configured
                </div>
              )}
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !siteData?.requiredCredentials}
              className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                  Saving...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  🚀 Save & Go Live
                </span>
              )}
            </button>
            
            <button
              className="border px-6 py-3 rounded-lg hover:bg-muted transition-colors"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>

          {/* Help Text */}
          <div className="text-xs text-muted-foreground pt-2 bg-muted/30 p-3 rounded">
            <strong>💡 Pro Tip:</strong> Make sure your webhooks are active and API keys have the necessary permissions. 
            You can always come back and update these credentials later.
          </div>
        </div>
      </div>
    </div>
  );
}