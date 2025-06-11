import { Header } from "@/components/(custom)/(dashboard)/(nav)/Header";
import { Sidebar } from "@/components/(custom)/(dashboard)/(nav)/Sidebar";
import CreateProfileComponent from "@/components/(custom)/(dashboard)/CreateProfileComponent";
import { currentUser } from "@clerk/nextjs/server";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "n8n-store | The Ultimate n8n Workflow Marketplace",
    template: "%s | n8n-store"
  },
  description: "n8n-store is your one-stop marketplace to discover, share, and download ready-to-use n8n automation workflows. Build your automation ecosystem faster with expert-crafted templates for marketing, sales, DevOps, and more. Save hours of development time with our community-powered workflow library.",
  keywords: ["n8n workflows", "automation templates", "n8n marketplace", "n8n automation", "workflow library", "no-code automation", "automation store", "workflow templates"],
  authors: [{ name: "n8n-store Team" }],
  creator: "n8n-store",
  publisher: "n8n-store",
  robots: "index, follow",
  alternates: {
    canonical: "https://n8n-store.com",
  },
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await currentUser();
  const hasProfile = user?.privateMetadata.hasProfile;

  if (!hasProfile) {
    return <CreateProfileComponent />;
  } else
    return (
      <div className="min-h-screen bg-background">
        {/* Main layout container */}
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar component - fixed on the left */}
          {/* <Sidebar /> */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top header with user info, notifications, etc. */}
            {/* <Header /> */}
            <Header />

            {/* Main scrollable content */}
            <main className="flex-1 overflow-y-auto p-6">
              {/* Dashboard content will be injected here */}
              {children}
            </main>
          </div>
        </div>
      </div>
    );
}
