import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

const HeroLandingSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20">
      {/* Subtle background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -right-48 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute -top-24 -left-48 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative container mx-auto px-4 py-24 sm:py-32 lg:py-40">
        <div className="text-center max-w-5xl mx-auto">
          {/* Accent badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm font-medium mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>n8n Portfolio Builder</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold mb-8 leading-tight tracking-tight">
            <span className="text-foreground">Build </span>
            <span className="text-green-600 dark:text-green-400">Portfolio</span>
            <br />
            <span className="text-foreground">Earn </span>
            <span className="bg-gradient-to-r from-green-600 via-green-500 to-emerald-600 bg-clip-text text-transparent">$100/hour</span>
          </h1>

          {/* Elegant subheadline */}
          <p className="text-xl sm:text-2xl text-muted-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Master n8n automation by building real workflows.
            <span className="text-foreground/60"> Showcase your skills to clients and command premium rates.</span>
          </p>

          {/* Elegant stats */}
          <div className="flex justify-center mb-16">
            <div className="flex items-center gap-12 text-center">
              <div className="relative">
                <div className="absolute -top-1 -left-1 w-full h-full bg-green-500/10 rounded-lg" />
                <div className="relative bg-background border border-border rounded-lg px-8 py-6">
                  <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-1">
                    $150k+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    earned by students
                  </div>
                </div>
              </div>
              <div className="hidden sm:block w-px h-16 bg-border" />
              <div className="hidden sm:block relative">
                <div className="absolute -top-1 -left-1 w-full h-full bg-primary/10 rounded-lg" />
                <div className="relative bg-background border border-border rounded-lg px-8 py-6">
                  <div className="text-3xl sm:text-4xl font-bold text-primary mb-1">
                    500+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    students enrolled
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button
              asChild
              size="lg"
              className="group relative bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-10 py-6 text-lg font-medium rounded-full"
            >
              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-3"
              >
                <span>Start Building Portfolio</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="group text-muted-foreground hover:text-foreground px-8 py-6 text-lg font-medium"
            >
              <a href="#workflows" className="flex items-center gap-2">
                <span>Browse workflows</span>
                <ArrowRight className="h-4 w-4 rotate-90 group-hover:translate-y-1 transition-transform" />
              </a>
            </Button>
          </div>

          {/* Subtle social proof */}
          <div className="flex justify-center">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/30 px-4 py-2 rounded-full border">
              <Sparkles className="h-4 w-4 text-green-500" />
              <span>Trusted by 2,000+ automation professionals</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
export default HeroLandingSection;
