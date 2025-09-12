"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getAllSitesAction,
  getUserCredentialsBySiteNameAction,
  saveUserSiteCredentialsAction,
  fetchProfile,
} from "@/utils/actions";

interface CredentialSetupProps {
  slug: string;
  onComplete?: () => void;
  onCancel?: () => void;
}

interface UserProfile {
  clerkId: string;
  firstName: string;
  lastName: string;
}

interface Site {
  id: string;
  slug: string;
  name: string;
  description: string;
  requiredCredentials: string[] | null;
  category?: string | null;
  difficulty?: string | null;
}

export default function CredentialSetup({
  slug,
  onComplete,
  onCancel,
}: CredentialSetupProps) {
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [siteData, setSiteData] = useState<Site | null>(null);
  const [loadingSite, setLoadingSite] = useState(true);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [hasConfiguredCredentials, setHasConfiguredCredentials] = useState(false);
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
    discord_webhook: "Discord Webhook URL",
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
    discord_webhook: "https://discord.com/api/webhooks/...",
  };

  // Load user profile and site data on mount
  useEffect(() => {
    loadUserAndSiteData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const loadUserAndSiteData = async () => {
    setLoadingSite(true);
    try {
      // First get user profile
      const profileData = await fetchProfile();
      setUserProfile(profileData as UserProfile);

      // Get all sites and find the one we need
      const sitesResult = await getAllSitesAction();


      if (sitesResult.success) {
        const site = sitesResult.sites.find(
          (s: any) => s.slug === slug
        );
        setSiteData((site as Site) || null);

        if (site && profileData) {
          // Load existing user credentials using NEW FK-based action
          const credsResult = await getUserCredentialsBySiteNameAction(
            profileData.clerkId,
            slug
          );

          if (credsResult.success && credsResult.credentials) {
            setCredentials(credsResult.credentials);
            // Check if user already has credentials configured
            const hasCredentials = site.requiredCredentials && Array.isArray(site.requiredCredentials) 
              ? site.requiredCredentials.some((cred) => credsResult.credentials[cred])
              : false;
            setHasConfiguredCredentials(hasCredentials);
            setIsMinimized(hasCredentials);
          }
        }
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoadingSite(false);
    }
  };

  const handleSubmit = async () => {
    if (!siteData?.requiredCredentials || !Array.isArray(siteData.requiredCredentials) || !userProfile) return;

    setIsLoading(true);

    // Check if all required credentials are filled
    const missingCredentials = siteData.requiredCredentials.filter(
      (cred) => !credentials[cred] || credentials[cred].trim() === ""
    );

    if (missingCredentials.length > 0) {
      alert(`Please fill in: ${missingCredentials.join(", ")}`);
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
        alert("Credentials saved successfully! 🎉");
        setHasConfiguredCredentials(true);
        setIsMinimized(true);

        // Call completion callback if provided
        if (onComplete) {
          onComplete();
        } else {
          // Redirect back to the site
          router.push(`/dashboard/portfolio/${slug}`);
        }
      } else {
        alert(result.error || "Failed to save credentials");
      }
    } catch (error) {
      console.error("Error saving credentials:", error);
      alert("Error saving credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (loadingSite) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-card border rounded-lg p-6 text-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-muted-foreground">
            Loading site configuration...
          </div>
        </div>
      </div>
    );
  }

  if (!siteData) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-card border rounded-lg p-6 text-center">
          <div className="text-red-600 mb-4">
            ❌ Site not found: <strong>{slug}</strong>
          </div>
          <p className="text-muted-foreground mb-4">
            This automation site doesn&apos;t exist or may have been removed.
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

  // If credentials are configured and form is minimized, show floating button
  if (isMinimized && hasConfiguredCredentials) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="group bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-6 py-3 rounded-full shadow-lg hover:shadow-primary/25 hover:-translate-y-1 transform transition-all duration-200 flex items-center gap-3 font-semibold"
        >
          <div className="w-8 h-8 bg-primary-foreground/20 rounded-full flex items-center justify-center">
            <span className="text-lg">🔧</span>
          </div>
          Update Credentials
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card/95 backdrop-blur-sm border-2 border-primary/20 rounded-2xl shadow-2xl overflow-hidden">
          {/* Enhanced Header */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 border-b border-primary/20">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center border border-primary/30">
                  <span className="text-2xl">🔧</span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Configure {siteData.name}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    {siteData.category && (
                      <span className="px-3 py-1 bg-primary/15 text-primary text-sm rounded-full border border-primary/20 font-medium">
                        {siteData.category}
                      </span>
                    )}
                    {siteData.difficulty && (
                      <span className="px-3 py-1 bg-secondary text-secondary-foreground text-sm rounded-full font-medium">
                        {siteData.difficulty}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {hasConfiguredCredentials && (
                <button
                  onClick={() => setIsMinimized(true)}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 border rounded-lg flex items-center gap-2 text-sm font-medium transition-colors"
                  title="Minimize credentials form"
                >
                  <span>−</span>
                  Minimize
                </button>
              )}
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {siteData.description}
            </p>

            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-5 rounded-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-amber-600">🔑</span>
                </div>
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 text-lg">
                  Required Credentials
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {siteData.requiredCredentials && Array.isArray(siteData.requiredCredentials) && siteData.requiredCredentials.map((cred) => (
                  <span
                    key={cred}
                    className="px-3 py-2 bg-amber-500/20 text-amber-800 dark:text-amber-200 text-sm rounded-lg border border-amber-500/30 font-medium"
                  >
                    {credentialLabels[cred] || cred}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Enhanced Form */}
          <div className="p-8">
            <div className="space-y-8">
              {siteData.requiredCredentials && Array.isArray(siteData.requiredCredentials) && siteData.requiredCredentials.map((credType) => (
                <div key={credType} className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    {credentialLabels[credType] || credType}
                    <span className="text-red-500 text-base">*</span>
                    {credentials[credType] && (
                      <div className="ml-auto flex items-center gap-1 text-green-600 text-xs bg-green-50 dark:bg-green-950/50 px-2 py-1 rounded-full">
                        <span>✅</span>
                        Configured
                      </div>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type={credType.includes("key") ? "password" : "url"}
                      value={credentials[credType] || ""}
                      onChange={(e) =>
                        setCredentials((prev) => ({
                          ...prev,
                          [credType]: e.target.value,
                        }))
                      }
                      onKeyDown={handleKeyDown}
                      placeholder={
                        credentialPlaceholders[credType] || `Enter ${credType}`
                      }
                      className="w-full px-4 py-4 border-2 border-border rounded-xl bg-background/50 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-200 placeholder:text-muted-foreground/60 text-foreground font-mono text-sm group-hover:border-primary/30"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Enhanced Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-10 mt-8 border-t-2 border-border">
              <button
                onClick={handleSubmit}
                disabled={isLoading || !siteData?.requiredCredentials || !Array.isArray(siteData.requiredCredentials)}
                className="flex-1 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground px-8 py-4 rounded-xl hover:from-primary/90 hover:to-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold text-lg shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 transform"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin"></div>
                    Saving Configuration...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <span className="text-xl">🚀</span>
                    Save & Go Live
                  </span>
                )}
              </button>

              <button
                className="border-2 border-border px-8 py-4 rounded-xl hover:bg-muted/50 hover:border-primary/30 transition-all duration-200 font-semibold text-lg hover:-translate-y-0.5 transform"
                onClick={() => {
                  if (onCancel) {
                    onCancel();
                  } else {
                    router.back();
                  }
                }}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>

            {/* Enhanced Help Section */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200/50 dark:border-blue-800/50 rounded-xl">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-blue-600 text-lg">💡</span>
                </div>
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Pro Tips for Success
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 leading-relaxed">
                    <li>
                      • Ensure your webhooks are active and properly configured
                      in n8n
                    </li>
                    <li>
                      • Verify API keys have the necessary permissions for your
                      workflow
                    </li>
                    <li>
                      • Test your credentials before going live to avoid issues
                    </li>
                    <li>
                      • You can always return here to update these settings
                      later
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
