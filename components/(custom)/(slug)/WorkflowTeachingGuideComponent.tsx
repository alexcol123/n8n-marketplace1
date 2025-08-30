import React from "react";
import Image from "next/image";
import {
  Gem,
  Wrench,
  Key,
  Zap,

  Sparkles,

  Star,
  Download,
  CheckCircle,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { WorkflowJsonDownloadButton } from "@/components/(custom)/(download)/WorkflowJsonDownloadButton";

// Enhanced TeachingGuide interface with workflow integration
export interface TeachingGuide {
  id: string;
  title: string;
  whatYoullBuild: string;
  possibleMonetization: string;
  toolsUsed: string[];
  
  // Workflow-specific data for integration
  workflowImage: string;
  workflowTitle: string;
  // workflowCategory: removed category field
  workflowSteps: number;
  workflowJson: any;
  workflowId: string;
  isVerified: boolean;
  complexity: string;
}

interface WorkflowHeroProps {
  guide: TeachingGuide;
}

// Enhanced section headers with better styling
const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div className="max-w-4xl mx-auto text-center mb-20">
    <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary text-sm font-medium mb-6">
      <Sparkles className="h-4 w-4 mr-2" />
      Premium Content
    </div>
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold  tracking-tight leading-tight mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
      {title}
    </h2>
    {subtitle && (
      <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
        {subtitle}
      </p>
    )}
  </div>
);

// Helper to format text with **bold** syntax
const formatBoldText = (text: string) => {
  return text.replace(
    /\*\*(.*?)\*\*/g,
    '<strong class="font-semibold text-primary">$1</strong>'
  );
};

export default function FinalWorkflowPage({ guide }: WorkflowHeroProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ======================= 1. ENHANCED HERO WITH INTEGRATED IMAGE ======================= */}
        <section className="pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 text-primary text-sm font-medium mb-8 shadow-lg backdrop-blur-sm animate-pulse">
              <Zap className="h-4 w-4 mr-2" />
              Professional Workflow Guide
              <div className="ml-2 w-2 h-2 bg-primary rounded-full animate-ping"></div>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-foreground via-primary/90 to-foreground bg-clip-text text-transparent leading-tight mb-8 drop-shadow-sm">
              {guide.title.replace(/🚀 |💰 /g, "")}
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-primary to-secondary mx-auto rounded-full mb-16"></div>
          </div>

          {/* Featured Workflow Image */}
          <div className="max-w-5xl mx-auto">
            <figure className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl border border-primary/20 group">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 blur-sm"></div>
              <Image
                src={guide.workflowImage}
                alt={guide.workflowTitle}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20"></div>
              
              {/* Overlay badges */}
              <div className="absolute top-6 right-6 flex gap-3">
                {guide.isVerified && (
                  <Badge className="bg-green-600 text-white shadow-xl border-0 backdrop-blur-sm">
                    <Star className="h-3 w-3 mr-1" />
                    Verified & Ready
                  </Badge>
                )}
                <Badge className="bg-primary/90 text-primary-foreground shadow-xl border-0 backdrop-blur-sm">
                  <Activity className="h-3 w-3 mr-1" />
                  {guide.workflowSteps} Steps
                </Badge>
              </div>

              {/* Bottom info overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-sm font-medium opacity-90 mb-1">Project Type</p>
                    <p className="text-lg font-bold">Portfolio Project</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium opacity-90 mb-1">Complexity</p>
                    <Badge 
                      variant="outline" 
                      className="text-white border-white/30 bg-white/10 backdrop-blur-sm"
                    >
                      {guide.complexity}
                    </Badge>
                  </div>
                </div>
              </div>
            </figure>
          </div>
        </section>

        {/* ======================= 2. ENHANCED WHAT YOU'LL BUILD ======================= */}
        <section className="py-24">
          <SectionHeader
            title="Your Complete Automation System"
            subtitle="Build a professional-grade workflow that delivers immediate business value and recurring revenue opportunities."
          />
          
          <div className="relative">
            {/* Glass morphism container */}
            <div className="absolute inset-0 bg-gradient-to-r from-card/40 via-card/60 to-card/40 backdrop-blur-sm border border-primary/10 rounded-3xl shadow-2xl"></div>
            <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-md border border-primary/20 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl">
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                {/* What You'll Build Card */}
                <div className="group">
                  <div className="flex items-center mb-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                      <div className="relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 backdrop-blur-sm flex items-center justify-center border border-primary/20 shadow-lg">
                        <Wrench className="h-7 w-7 text-primary" />
                      </div>
                    </div>
                    <h3 className="ml-6 text-2xl md:text-3xl font-bold text-foreground">
                      What You&apos;ll Build
                    </h3>
                  </div>
                  
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-transparent rounded-2xl"></div>
                    <div className="relative bg-gradient-to-br from-muted/10 to-muted/5 backdrop-blur-sm border border-muted-foreground/10 rounded-2xl p-6 shadow-lg">
                      <p 
                        className="text-muted-foreground leading-relaxed text-lg font-medium"
                        dangerouslySetInnerHTML={{
                          __html: formatBoldText(guide.whatYoullBuild),
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* API Services Card */}
                <div className="group">
                  <div className="flex items-center mb-10">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-secondary to-accent rounded-xl blur-lg opacity-30 group-hover:opacity-50 transition-all duration-300"></div>
                      <div className="relative flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-r from-secondary/20 to-secondary/10 backdrop-blur-sm flex items-center justify-center border border-secondary/20 shadow-lg">
                        <Key className="h-7 w-7 text-secondary" />
                      </div>
                    </div>
                    <h3 className="ml-6 text-2xl md:text-3xl font-bold text-foreground">
                      Required Tools
                    </h3>
                  </div>
                  
                  <div className="space-y-4">
                    {guide.toolsUsed.map((tool, index) => {
                      const [toolName, toolDescription] = tool.split(" - ");
                      return (
                        <div 
                          key={index}
                          className="group/tool relative overflow-hidden"
                        >
                          {/* Animated background */}
                          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-xl opacity-0 group-hover/tool:opacity-100 transition-all duration-300"></div>
                          
                          <div className="relative flex items-start p-5 bg-gradient-to-br from-card/60 to-card/40 backdrop-blur-sm border border-primary/10 rounded-xl hover:border-primary/30 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 flex items-center justify-center mr-4 border border-primary/20">
                              <Key className="h-4 w-4 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-foreground text-base mb-1 group-hover/tool:text-primary transition-colors duration-200">
                                {toolName}
                              </div>
                              <div className="text-sm text-muted-foreground leading-relaxed">
                                {toolDescription}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= 3. WORKFLOW DETAILS & DOWNLOAD SECTION ======================= */}
        <section className="py-24">
          <SectionHeader
            title="Get This Workflow Now"
            subtitle="Download the complete automation and start building your profitable system today."
          />
          
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              {/* Glass morphism container */}
              <div className="absolute inset-0 bg-gradient-to-r from-card/40 via-card/60 to-card/40 backdrop-blur-sm border border-primary/10 rounded-3xl shadow-2xl"></div>
              <div className="relative bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-md border border-primary/20 rounded-3xl p-8 md:p-12 lg:p-16 shadow-2xl">
                
                {/* Quick Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Activity className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      {guide.workflowSteps}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Workflow Steps
                    </div>
                  </div>

                  <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border border-primary/20 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Zap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-primary mb-1">
                      n8n
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Platform
                    </div>
                  </div>

  

                  <div className="text-center p-6 bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm border border-green-500/20 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-green-500/20 to-green-500/10 flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    </div>
                    <div className="text-2xl font-bold text-green-500 mb-1">
                      {guide.isVerified ? "Yes" : "No"}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Verified
                    </div>
                  </div>
                </div>

                {/* Download Section */}
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/30 shadow-xl mb-6">
                    <Download className="h-8 w-8 text-primary" />
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">
                    Ready to Transform Your Business?
                  </h3>
                  
                  <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
                    Download this complete automation workflow and start building your profitable system in minutes, not months.
                  </p>

                  {/* Download Button */}
                  <div className="inline-block">
                    <WorkflowJsonDownloadButton
                      workflowContent={guide.workflowJson}
                      workflowId={guide.workflowId}
                      title={guide.workflowTitle}
                    />
                  </div>

                  <p className="text-sm text-muted-foreground mt-6 opacity-70">
                    Compatible with n8n • Ready to deploy • No coding required
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= 4. ENHANCED MONETIZATION OPPORTUNITY ======================= */}
        <section className="py-24 mb-20">
          <SectionHeader
            title="Your Revenue Opportunity"
            subtitle="Transform your automation skills into a profitable business serving clients who need these exact solutions."
          />
          
          <div className="relative">
            {/* Enhanced background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5 rounded-3xl blur-sm"></div>
            <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-r from-primary/10 to-transparent rounded-full blur-3xl transform -translate-x-48 -translate-y-48 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-secondary/10 to-transparent rounded-full blur-3xl transform translate-x-48 translate-y-48 animate-pulse delay-1000"></div>
            
            <div className="relative bg-gradient-to-br from-card/50 via-card/40 to-card/30 backdrop-blur-md border border-primary/20 rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-2xl overflow-hidden">
              
              {/* Header with icon */}
              <div className="relative mb-10">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/30 shadow-xl mb-8">
                  <Gem className="h-10 w-10 text-primary" />
                </div>
              </div>
              
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
                Ready-to-Sell Business Solution
              </h3>
              
              <div className="max-w-4xl mx-auto mb-12">
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                  {guide.possibleMonetization.replace("🚀 BUSINESS OPPORTUNITY: ", "")}
                </p>
              </div>
              


            </div>
          </div>
        </section>
      </div>
    </div>
  );
}