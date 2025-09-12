"use client";

import { useState, useEffect, ReactNode } from "react";
import { getUserCredentialsBySiteNameAction, fetchProfile } from "@/utils/actions";
import CredentialSetup from "@/components/(custom)/(credentials-for-portfolio)/CredentialsForm";

interface PortfolioShellProps {
  children: ReactNode;
  slug: string;
  title: string;
  description?: string;
}

interface UserCredentialsResponse {
  success: boolean;
  credentials: Record<string, any> | null;
  isConfigured: boolean;
  error?: string;
}

interface LoadedCredentials {
  [key: string]: string | number | boolean;
}

interface UserProfile {
  clerkId: string;
}

export default function PortfolioShell({
  children,
  slug,
  title,
  description
}: PortfolioShellProps) {
  const [showSetup, setShowSetup] = useState<boolean>(false);
  const [loadedCredentials, setLoadedCredentials] = useState<LoadedCredentials | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Load user profile and credentials on mount
  useEffect(() => {
    loadUserData();
  }, [slug]);

  const loadUserData = async (): Promise<void> => {
    try {
      setLoading(true);
      
      // First get user profile to get userId
      const profileData = await fetchProfile();
      if (!profileData) {
        throw new Error("Failed to load user profile");
      }
      setUserProfile(profileData as UserProfile);

      // Then load credentials using FK-based action
      await loadCredentials(profileData.clerkId);
      
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCredentials = async (userId: string): Promise<void> => {
    try {
      const result = await getUserCredentialsBySiteNameAction(
        userId,
        slug
      );
      
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
    return (
      <CredentialSetup 
        slug={slug} 
        onComplete={() => {
          setShowSetup(false);
          if (userProfile) {
            loadCredentials(userProfile.clerkId);
          }
        }}
        onCancel={() => {
          setShowSetup(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-4xl mx-auto px-6 py-24">
        {/* CREDENTIALS PANEL */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 to-slate-800/20 rounded-xl blur-xl"></div>
          <div className="relative bg-gradient-to-br from-slate-900/95 to-slate-800/95 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 mb-12 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-slate-100 flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-slate-600/30">
                  <span className="text-2xl">🔐</span>
                </div>
                <div>
                  <span className="text-slate-100">Credentials for</span>
                  <span className="block text-lg font-bold text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">
                    {slug}
                  </span>
                </div>
              </h3>
              <button
                onClick={() => setShowSetup(true)}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  loadedCredentials 
                    ? "bg-gradient-to-r from-muted/80 to-muted/60 hover:from-muted hover:to-muted/80 text-muted-foreground hover:text-foreground border border-border shadow-md" 
                    : "bg-gradient-to-r from-destructive to-destructive/80 hover:from-destructive/90 hover:to-destructive/70 text-destructive-foreground shadow-lg hover:shadow-xl"
                }`}
              >
                {loadedCredentials ? "⚙️ Manage Credentials" : "🔧 Setup Required"}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30 shadow-inner">
                <span className="font-medium text-slate-200 flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full shadow-sm ${loadedCredentials ? "bg-green-400 shadow-green-400/50" : "bg-orange-400 animate-pulse shadow-orange-400/50"}`}></div>
                  <span className="text-base">Connection Status</span>
                </span>
                <span className={`font-bold text-base ${
                  loadedCredentials ? "text-green-300" : "text-orange-300"
                }`}>
                  {loadedCredentials ? "✅ Ready & Connected" : "⚠️ Setup Required"}
                </span>
              </div>
              
              {loadedCredentials && (
                <div className="grid gap-3 mt-6">
                  <div className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                    Configured Settings
                  </div>
                  {Object.entries(loadedCredentials).map(
                    ([key, value]: [string, string | number | boolean]) => (
                      <div key={key} className="flex items-center justify-between p-4 bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-lg border border-slate-600/20 hover:border-slate-500/30 transition-colors">
                        <span className="text-slate-200 font-medium capitalize flex items-center gap-2">
                          <span className="w-1 h-1 bg-slate-400 rounded-full"></span>
                          {key.replace('_', ' ')}
                        </span>
                        <code className="text-xs bg-slate-900/50 border border-slate-500/30 px-4 py-2 rounded-lg text-slate-200 font-mono shadow-inner">
                          {key === 'webhook' 
                            ? `${String(value).slice(0, 35)}...` 
                            : String(value) || "Not configured"
                          }
                        </code>
                      </div>
                    )
                  )}
                </div>
              )}
              
              <div className={`p-4 rounded-xl border-2 text-sm flex items-center gap-3 transition-all ${
                loadedCredentials 
                  ? "bg-gradient-to-r from-green-900/30 to-emerald-900/20 border-green-600/40 text-green-200" 
                  : "bg-gradient-to-r from-orange-900/30 to-red-900/20 border-orange-600/40 text-orange-200"
              }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  loadedCredentials ? "bg-green-500/20" : "bg-orange-500/20"
                }`}>
                  <span className="text-lg">
                    {loadedCredentials ? "✅" : "⚠️"}
                  </span>
                </div>
                <div>
                  {loadedCredentials ? (
                    <>
                      <strong className="text-green-100">All systems ready!</strong>
                      <div className="text-green-300 text-xs mt-1">
                        Your {slug} workflow is configured and ready to use
                      </div>
                    </>
                  ) : (
                    <>
                      <strong className="text-orange-100">Setup required</strong>
                      <div className="text-orange-300 text-xs mt-1">
                        Configure your credentials to unlock {slug} functionality
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ELEGANT DIVIDER */}
        <div className="relative mb-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300/30 to-transparent"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-gradient-to-r from-background via-background to-background px-8 py-2 rounded-full border border-slate-200/20">
              <div className="text-base text-slate-600 dark:text-slate-300 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-gradient-to-r from-primary to-primary/60 rounded-full"></span>
                {title}
                <span className="w-2 h-2 bg-gradient-to-r from-primary/60 to-primary rounded-full"></span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN HEADER */}
        <div className="text-center mb-12">
          <div className="mb-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent mb-3 tracking-tight">
              {title}
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-primary/60 to-primary/30 mx-auto rounded-full"></div>
          </div>
          {description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* PORTFOLIO CONTENT - This is where the unique forms/chats go */}
        <div className="relative">
          {children}
        </div>
      </div>
    </div>
  );
}