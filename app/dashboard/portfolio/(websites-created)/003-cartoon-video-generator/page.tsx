"use client";

import CredentialSetup from "@/components/(custom)/(credentials-for-portfolio)/CredentialsForm";
import { getUserCredentialsBySiteNameAction, fetchProfile } from "@/utils/actions";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CartoonVideoForm from "./CartoonVideoForm";

// 🔥 UPDATED TYPES FOR NEW FK SYSTEM
interface UserCredentialsResponse {
  success: boolean;
  credentials: Record<string, any> | null;
  isConfigured: boolean;
  credential?: any;
  site?: any;
  error?: string;
}

interface LoadedCredentials {
  [key: string]: string | number | boolean;
}

interface UserProfile {
  clerkId: string;
  // ... other profile fields
}

// 🔥 DYNAMIC SITE NAME EXTRACTION HOOK
const useSiteName = (): string | null => {
  const pathname = usePathname();

  // Extract siteName from URL: /dashboard/portfolio/[siteName]
  const pathSegments = pathname.split("/");
  const portfolioIndex = pathSegments.indexOf("portfolio");

  if (portfolioIndex !== -1 && pathSegments[portfolioIndex + 1]) {
    return pathSegments[portfolioIndex + 1];
  }

  return null;
};

export default function VideoGeneratorPage() {
  const [showSetup, setShowSetup] = useState<boolean>(false);
  const [loadedCredentials, setLoadedCredentials] = useState<LoadedCredentials | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔥 AUTOMATIC SITE NAME DETECTION FROM URL
  const siteName = useSiteName();
  const SITE_NAME: string = siteName || "default-site";

  // Load user profile and credentials on mount
  useEffect(() => {
    loadUserData();
  }, [SITE_NAME]);

  const loadUserData = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // First get user profile to get userId
      const profileData = await fetchProfile();
      setUserProfile(profileData as UserProfile);

      // Then load credentials using NEW FK-based action
      await loadCredentials(profileData.clerkId);
      
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCredentials = async (userId: string): Promise<void> => {
    try {
      // 🚀 USING NEW FK-BASED ACTION
      const result: UserCredentialsResponse = await getUserCredentialsBySiteNameAction(
        userId,
        SITE_NAME
      );
      
      console.log("✅ NEW FK-based credentials result:", result);
      
      if (result.success && result.credentials) {
        setLoadedCredentials(result.credentials as LoadedCredentials);
      } else if (result.error) {
        console.warn("⚠️ Credentials error:", result.error);
      }
    } catch (error) {
      console.error("❌ Error loading credentials:", error);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading credentials...</p>
        </div>
      </div>
    );
  }

  // Show setup form if requested
  if (showSetup) {
    return <CredentialSetup siteName={SITE_NAME} onComplete={() => {
      setShowSetup(false);
      if (userProfile) {
        loadCredentials(userProfile.clerkId);
      }
    }} />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* CREDENTIALS PANEL - ENHANCED */}
        <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-800/50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-200 mb-3 flex items-center gap-2">
            <span>🔐</span>
            Your Current Credentials for {SITE_NAME}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="font-medium text-yellow-300">Status:</span>
              <span className={`flex items-center gap-1 ${
                loadedCredentials ? "text-green-400" : "text-orange-400"
              }`}>
                {loadedCredentials ? (
                  <>
                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                    Configured & Ready
                  </>
                ) : (
                  <>
                    <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                    Setup Required
                  </>
                )}
              </span>
            </div>
            
            {loadedCredentials && (
              <div className="border-t border-yellow-700/50 pt-2 space-y-2">
                {Object.entries(loadedCredentials).map(
                  ([key, value]: [string, string | number | boolean]) => (
                    <div key={key} className="flex justify-between items-center">
                      <span className="text-yellow-300 font-medium">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </span>
                      <code className="text-xs bg-yellow-800/50 border border-yellow-700/50 px-2 py-1 rounded text-yellow-100">
                        {String(value) || "Not set"}
                      </code>
                    </div>
                  )
                )}
              </div>
            )}
            
            <div className="border-t border-yellow-700/50 pt-2">
              <div className={`text-xs flex items-center gap-2 ${
                loadedCredentials ? "text-green-300" : "text-orange-300"
              }`}>
                {loadedCredentials ? (
                  <>
                    <span>✅</span>
                    Real credentials loaded for site: <strong>{SITE_NAME}</strong>
                  </>
                ) : (
                  <>
                    <span>⚠️</span>
                    No saved credentials for <strong>{SITE_NAME}</strong> - configure to get started
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-semibold">🎬 AI Video Generator</h1>
            <p className="text-muted-foreground mt-1">
              Create engaging cartoon videos with AI automation
            </p>
          </div>
          <button
            onClick={() => setShowSetup(true)}
            className={`px-4 py-2 border rounded-lg transition-colors ${
              loadedCredentials 
                ? "bg-muted hover:bg-muted/80 text-foreground" 
                : "bg-primary hover:bg-primary/90 text-primary-foreground"
            }`}
          >
            {loadedCredentials ? "⚙️ Reconfigure" : "🔧 Setup Required"}
          </button>
        </div>

        {/* Website Content FORM */}
        <CartoonVideoForm 
          siteName={SITE_NAME} 
          credentials={loadedCredentials}
          isConfigured={!!loadedCredentials}
        />
      </div>
    </div>
  );
}