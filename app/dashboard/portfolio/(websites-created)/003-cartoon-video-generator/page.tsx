"use client";

import CredentialSetup from "@/components/(custom)/(credentials-for-portfolio)/CredentialsForm";
import { getUserCredentialsAction } from "@/utils/actions";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CartoonVideoForm from "./CartoonVideoForm";

// 🔥 TYPES FOR CREDENTIALS
interface UserCredentialsResponse {
  success: boolean;
  credentials: Record<string, any> | null;
  isConfigured: boolean;
  message?: string;
}

interface LoadedCredentials {
  [key: string]: string | number | boolean;
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
  const [loadedCredentials, setLoadedCredentials] =
    useState<LoadedCredentials | null>(null);

  // 🔥 AUTOMATIC SITE NAME DETECTION FROM URL
  const siteName = useSiteName();
  const SITE_NAME: string = siteName || "default-site";

  // Load credentials on mount
  useEffect(() => {
    loadCredentials();
  }, [SITE_NAME]);

  const loadCredentials = async (): Promise<void> => {
    try {
      const result: UserCredentialsResponse = await getUserCredentialsAction(
        SITE_NAME
      );
      console.log(result);
      if (result.success && result.credentials) {
        setLoadedCredentials(result.credentials as LoadedCredentials);
      }
    } catch (error) {
      console.error("Error loading credentials:", error);
    }
  };

  // Show setup form if requested
  if (showSetup) {
    return <CredentialSetup siteName={SITE_NAME} />;
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-2xl mx-auto">
        {/* CREDENTIALS PANEL */}
        <div className="bg-yellow-900/20 border border-yellow-800 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-200 mb-3">
            Your Current Credentials for {SITE_NAME}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium text-yellow-300">Status:</span>
              <span
                className={
                  loadedCredentials ? "text-green-400" : "text-orange-400"
                }
              >
                {loadedCredentials ? "✅ Configured" : "⚠️ Using Defaults"}
              </span>
            </div>
            <div className="border-t border-yellow-700 pt-2 space-y-1">
              {loadedCredentials &&
                Object.entries(loadedCredentials).map(
                  ([key, value]: [string, string | number | boolean]) => (
                    <div key={key} className="text-yellow-300">
                      <strong>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </strong>
                      <code className="ml-2 text-xs bg-yellow-800 px-2 py-1 rounded">
                        {String(value) || "Not set"}
                      </code>
                    </div>
                  )
                )}
              {!loadedCredentials && (
                <div className="text-yellow-300">
                  <strong>No credentials loaded</strong>
                </div>
              )}
            </div>
            <div className="text-xs text-yellow-400 pt-2">
              {loadedCredentials
                ? `✅ Real credentials loaded for site: ${SITE_NAME}`
                : `⚠️ No saved credentials for ${SITE_NAME} - using demo URLs`}
            </div>
          </div>
        </div>

        {/* HEADER */}
        <div className="flex justify-between items-center mt-20 mb-6">
          <h1 className="text-3xl font-semibold">🎬 AI Video Generator</h1>
          <button
            onClick={() => setShowSetup(true)}
            className="px-4 py-2 bg-muted border rounded-lg hover:bg-muted/80"
          >
            Configure
          </button>
        </div>

        {/* Website Content FORM */}

        <CartoonVideoForm siteName={SITE_NAME} />
      </div>
    </div>
  );
}
