import React from "react";
import {
  Users,
  Clock,
  AlertTriangle,
  Gem,
  Wrench,
  CheckCircle,
  Key,
  Zap,
  Target,
} from "lucide-react";

// Updated TeachingGuide interface without requiredApiServices
export interface TeachingGuide {
  id: string;
  title: string;
  description: string;
  projectIntro: string;
  idealFor: string;
  timeToValue: string;
  howItWorks: string;
  realCostOfNotHaving: string;
  whatYoullBuild: string;
  possibleMonetization: string;
  toolsUsed: string[];
}

interface WorkflowHeroProps {
  guide: TeachingGuide;
}

// A dedicated component for section headers
const SectionHeader = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => (
  <div className="max-w-4xl mx-auto text-center mb-16">
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight mb-4">
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
    '<strong class="font-semibold text-foreground">$1</strong>'
  );
};

export default function FinalWorkflowPage({ guide }: WorkflowHeroProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ======================= 1. HERO HEADER ======================= */}
        <section className="text-center pt-20 pb-16 sm:pt-28 sm:pb-20">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/5 border border-primary/20 text-primary text-sm font-medium mb-8">
            <Zap className="h-4 w-4 mr-2" />
            Professional Workflow Guide
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text text-transparent leading-tight mb-8">
            {guide.title.replace(/🚀 /g, "")}
          </h1>
          <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-muted-foreground leading-relaxed">
            {guide.description}
          </p>
        </section>

        {/* ======================= 2. THE CORE PROBLEM & VALUE PROPOSITION ======================= */}
        <section className="py-20 mb-20">
          <div className="relative p-8 md:p-12 lg:p-16 bg-card/30 border border-primary/20 rounded-3xl shadow-xl overflow-hidden hover:border-primary/40 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                  The Bottleneck in Your Business.
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {guide.projectIntro}
                </p>
              </div>
              <div className="space-y-10">
                <div className="flex items-start space-x-4 p-6 rounded-xl bg-card/30 border border-primary/20">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Perfect For
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {guide.idealFor
                        .replace(/🎯 /g, "")
                        .replace(/ 🎯 /g, ", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-6 rounded-xl bg-card/30 border border-primary/20">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center">
                    <Clock className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Time Investment
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {guide.timeToValue.replace(/⚡ |\*\*/g, "")}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-6 rounded-xl bg-card/30 border border-primary/20">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="h-6 w-6 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Cost of Inaction
                    </h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {guide.realCostOfNotHaving}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= 3. THE SOLUTION (What You'll Build & How) ======================= */}
        <section className="py-24">
          <SectionHeader
            title="The Automated Solution."
            subtitle="This comprehensive blueprint guides you through building a powerful, end-to-end automation system."
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="group p-8 lg:p-12 bg-card/30 rounded-2xl border border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/40">
              <div className="flex items-center mb-10">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <h3 className="ml-4 text-2xl font-bold text-foreground">
                  What You'll Build
                </h3>
              </div>
              <ul className="space-y-6">
                {guide.whatYoullBuild
                  .split("\\n")
                  .filter((item) => item.trim())
                  .map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-4 text-muted-foreground leading-relaxed"
                    >
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center mt-1">
                        <CheckCircle className="h-4 w-4 text-primary" />
                      </div>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: formatBoldText(item.replace("• ", "")),
                        }}
                      />
                    </li>
                  ))}
              </ul>
            </div>
            <div className="group p-8 lg:p-12 bg-card/30 rounded-2xl border border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/40">
              <div className="flex items-center mb-10">
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center group-hover:bg-green-100 transition-colors">
                  <Zap className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="ml-4 text-2xl font-bold text-foreground">
                  How It Works
                </h3>
              </div>
              <ul className="space-y-6">
                {guide.howItWorks
                  .split("\\n")
                  .filter((item) => item.trim())
                  .map((item, index) => (
                    <li
                      key={index}
                      className="flex items-start space-x-4 text-muted-foreground leading-relaxed"
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center mt-0.5">
                        <span className="text-sm font-bold text-background">
                          {index + 1}
                        </span>
                      </div>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: formatBoldText(item.replace("✅ ", "")),
                        }}
                      />
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ======================= 4. THE OPPORTUNITY (Monetization & Tools) ======================= */}
        <section className="py-24 mb-20">
          <SectionHeader
            title="Turn Expertise into Revenue."
            subtitle="This isn't just a technical exercise—it's a valuable business asset you can monetize immediately."
          />
          <div className="relative bg-card/30 border border-primary/20 rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-xl overflow-hidden hover:border-primary/40 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10"></div>
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl transform -translate-x-36 -translate-y-36"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl transform translate-x-36 translate-y-36"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Gem className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Your Business Opportunity
              </h3>
              <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-12 leading-relaxed">
                {guide.possibleMonetization.replace(
                  "🚀 BUSINESS OPPORTUNITY: ",
                  ""
                )}
              </p>
              <div className="bg-primary/10 rounded-2xl p-8 border border-primary/20">
                <h4 className="flex items-center justify-center text-xl font-semibold mb-6 text-foreground">
                  <Key className="h-5 w-5 mr-3 text-primary" />
                  Required API Services & Integrations
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guide.toolsUsed.map((tool, index) => {
                    const [toolName, toolDescription] = tool.split(" - ");
                    return (
                      <div
                        key={index}
                        className="inline-flex items-center text-left px-4 py-3 bg-card/50 border border-primary/20 text-foreground font-medium hover:border-primary/40 transition-all duration-200 rounded-lg shadow-sm"
                      >
                        <Key className="h-4 w-4 mr-2 text-primary flex-shrink-0" />
                        <div>
                          <div className="font-semibold">{toolName}</div>
                          <div className="text-xs text-muted-foreground">
                            {toolDescription}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= 5. TECHNOLOGIES & TOOLS SECTION (DETAILED) ======================= */}
        <section className="py-12 mb-20">
          <div className="group p-8 lg:p-12 bg-card/30 rounded-2xl border border-primary/20 shadow-sm hover:shadow-lg transition-all duration-300 hover:border-primary/40">
            <div className="flex items-center mb-10">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Wrench className="h-6 w-6 text-primary" />
              </div>
              <h3 className="ml-4 text-2xl font-bold text-foreground">
                Complete Technology Stack
              </h3>
            </div>
            <ul className="space-y-6">
              {guide.toolsUsed.map((tool, index) => {
                const [toolName, toolDescription] = tool.split(" - ");
                return (
                  <li
                    key={index}
                    className="flex items-start space-x-4 text-muted-foreground leading-relaxed"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center mt-0.5">
                      <span className="text-sm font-bold text-background">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-foreground">
                        {toolName}
                      </span>
                      <span className="text-muted-foreground">
                        {" "}
                        - {toolDescription}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
