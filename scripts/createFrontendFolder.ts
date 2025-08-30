#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

/**
 * Creates a frontend folder with a coming soon page
 * Usage: npm run create-frontend "00001-video-generator" "Video Generator"
 */

const [siteName, title] = process.argv.slice(2);

if (!siteName || !title) {
  console.error('Usage: npm run create-frontend "00001-video-generator" "Video Generator"');
  process.exit(1);
}

const folderPath = path.join(
  process.cwd(),
  'app',
  'dashboard',
  'portfolio',
  '(websites-created)',
  siteName
);

// Create the coming soon page content
const pageContent = `"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Rocket, Sparkles } from "lucide-react";

export default function ${title.replace(/\s+/g, '')}Page() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const target = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      const diff = target.getTime() - now.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      
      setTimeLeft(\`\${days} days, \${hours} hours\`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-primary/10 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-primary/20">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Rocket className="h-10 w-10 text-primary animate-pulse" />
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            ${title} - Coming Soon!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-6">
              We're building something amazing! This frontend is currently under development.
            </p>
            
            <div className="bg-primary/5 rounded-lg p-6 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="text-sm font-semibold text-primary">Estimated Launch</span>
              </div>
              <p className="text-2xl font-bold">{timeLeft}</p>
            </div>

            <div className="grid gap-4 mt-8">
              <div className="flex items-start gap-3 text-left">
                <div className="h-8 w-8 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="h-4 w-4 text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">What's Coming</h3>
                  <p className="text-sm text-muted-foreground">
                    A fully functional frontend connected to your n8n workflow, ready to deploy and monetize.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left">
                <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Stay Tuned</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll notify you as soon as this frontend is ready. Check back soon!
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t">
            <p className="text-center text-xs text-muted-foreground">
              Frontend ID: <code className="bg-muted px-2 py-1 rounded">${siteName}</code>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
`;

// Create the folder if it doesn't exist
if (!fs.existsSync(folderPath)) {
  fs.mkdirSync(folderPath, { recursive: true });
}

// Create the page.tsx file
const pageFilePath = path.join(folderPath, 'page.tsx');
if (!fs.existsSync(pageFilePath)) {
  fs.writeFileSync(pageFilePath, pageContent);
}

// Frontend scaffold created successfully