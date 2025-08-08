import React from "react";
import {

  Clock,
  AlertTriangle,
  Gem,
  Wrench,
  CheckCircle,
  Key,
  Zap,
  Target,
  DollarSign,
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

        {/* ======================= 2. KEY METRICS & VALUE ======================= */}
        <section className="py-16 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-card/30 border border-primary/20 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Perfect For</h3>
              <p className="text-sm text-muted-foreground">
                {guide.idealFor.replace(/🎯 /g, "").replace(/ 🎯 /g, ", ")}
              </p>
            </div>
            <div className="text-center p-6 bg-card/30 border border-primary/20 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Time to Value</h3>
              <p className="text-sm text-muted-foreground">
                {guide.timeToValue.replace(/⚡ |\*\*/g, "")}
              </p>
            </div>
            <div className="text-center p-6 bg-card/30 border border-primary/20 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-amber-500" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">Revenue Potential</h3>
              <p className="text-sm text-muted-foreground">
                Monetize immediately with proven pricing model
              </p>
            </div>
          </div>
        </section>

        {/* ======================= 3. THE PROBLEM & SOLUTION ======================= */}
        <section className="py-20 mb-20">
          <div className="relative p-8 md:p-12 lg:p-16 bg-card/30 border border-primary/20 rounded-3xl shadow-xl overflow-hidden hover:border-primary/40 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-primary/10"></div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
            <div className="relative">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-tight mb-6">
                  The Hidden Cost of Manual Work
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto">
                  {guide.projectIntro}
                </p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-16">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-6 rounded-xl bg-card/50 border border-red-200 shadow-sm">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mt-1">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">The Real Cost</h4>
                      <p className="text-foreground/80 text-sm leading-relaxed">
                        {guide.realCostOfNotHaving}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-6 rounded-xl bg-card/50 border border-green-200 shadow-sm">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mt-1">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground mb-2">The Solution</h4>
                      <div className="space-y-3">
                        {guide.howItWorks
                          .split("\\n")
                          .filter((item) => item.trim())
                          .map((item, index) => (
                            <p 
                              key={index}
                              className="text-foreground/80 text-sm leading-relaxed"
                              dangerouslySetInnerHTML={{
                                __html: formatBoldText(item.replace("✅ ", "")),
                              }}
                            />
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= 4. WHAT YOU'LL BUILD ======================= */}
        <section className="py-24">
          <SectionHeader
            title="Your Complete Automation System"
            subtitle="Build a professional-grade workflow that delivers immediate business value and recurring revenue opportunities."
          />
          <div className="bg-card/30 border border-primary/20 rounded-3xl p-8 md:p-12 lg:p-16 shadow-lg">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <div className="flex items-center mb-8">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Wrench className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="ml-4 text-2xl font-bold text-foreground">
                    Complete System Components
                  </h3>
                </div>
                <ul className="space-y-4">
                  {guide.whatYoullBuild
                    .split("\\n")
                    .filter((item) => item.trim())
                    .map((item, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-3 text-muted-foreground leading-relaxed"
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
              
              <div>
                <div className="flex items-center mb-8">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="ml-4 text-2xl font-bold text-foreground">
                    Required API Services
                  </h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {guide.toolsUsed.map((tool, index) => {
                    const [toolName, toolDescription] = tool.split(" - ");
                    return (
                      <div 
                        key={index}
                        className="flex items-center p-4 bg-card/50 border border-primary/20 rounded-lg hover:border-primary/40 transition-all duration-200"
                      >
                        <Key className="h-4 w-4 mr-3 text-primary flex-shrink-0" />
                        <div>
                          <div className="font-semibold text-foreground text-sm">{toolName}</div>
                          <div className="text-xs text-muted-foreground">{toolDescription}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================= 5. MONETIZATION OPPORTUNITY ======================= */}
        <section className="py-24 mb-20">
          <SectionHeader
            title="Your Revenue Opportunity"
            subtitle="Transform your new skills into a profitable automation business serving local companies."
          />
          <div className="relative bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-3xl p-8 md:p-12 lg:p-16 text-center shadow-xl overflow-hidden">
            <div className="absolute top-0 left-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl transform -translate-x-36 -translate-y-36"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl transform translate-x-36 translate-y-36"></div>
            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
                <Gem className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
                Ready-to-Sell Business Solution
              </h3>
              <p className="max-w-4xl mx-auto text-lg text-muted-foreground mb-8 leading-relaxed">
                {guide.possibleMonetization.replace("🚀 BUSINESS OPPORTUNITY: ", "")}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="p-6 bg-card/50 border border-primary/20 rounded-xl">
                  <DollarSign className="h-8 w-8 text-green-500 mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Setup Fee</h4>
                  <p className="text-2xl font-bold text-primary">$397-$497</p>
                  <p className="text-sm text-muted-foreground">One-time implementation</p>
                </div>
                <div className="p-6 bg-card/50 border border-primary/20 rounded-xl">
                  <Clock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Monthly Service</h4>
                  <p className="text-2xl font-bold text-primary">$99-$250</p>
                  <p className="text-sm text-muted-foreground">Recurring maintenance</p>
                </div>
                <div className="p-6 bg-card/50 border border-primary/20 rounded-xl">
                  <Target className="h-8 w-8 text-purple-500 mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-2">Monthly Potential</h4>
                  <p className="text-2xl font-bold text-primary">$4,400+</p>
                  <p className="text-sm text-muted-foreground">With 25-30 clients</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}