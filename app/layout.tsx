import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/providers";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "n8n-community | The Ultimate n8n Workflow Marketplace",
    template: "%s | n8n-community",
  },
  description:
    "n8n-community is your one-stop marketplace to discover, share, and download ready-to-use n8n automation workflows. Build your automation ecosystem faster with expert-crafted templates for marketing, sales, DevOps, and more. Save hours of development time with our community-powered workflow library.",
  keywords: [
    "n8n workflows",
    "automation templates",
    "n8n marketplace",
    "n8n automation",
    "workflow library",
    "no-code automation",
    "automation store",
    "workflow templates",
  ],
  authors: [{ name: "n8n-community Team" }],
  creator: "n8n-community",
  publisher: "n8n-community",
  robots: "index, follow",
  alternates: {
    canonical: "https://n8n-community.com",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://n8n-community.com",
    title: "n8n-community | The Ultimate n8n Workflow Marketplace",
    description:
      "Discover, share and download pre-built n8n automation workflows. n8n-community helps you automate faster with community-created templates for marketing, sales, DevOps and more.",
    siteName: "n8n-community",
    images: [
      {
        url: "https://n8n-community.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "n8n-community - The Ultimate n8n Workflow Marketplace",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "n8n-community | The Ultimate n8n Workflow Marketplace",
    description:
      "Build your automation ecosystem faster with n8n-community. Browse, download and share workflow templates created by the n8n community.",
    images: ["https://n8n-community.com/twitter-image.jpg"],
    creator: "@n8nstore",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <Providers>{children}</Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
