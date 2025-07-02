import { Button } from "@/components/ui/button";
import { Star, Target } from "lucide-react";

const TestimonialSection = () => {
  return (
<section className="hidden md:block bg-muted/30 border-t">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Join Thousands Learning n8n Automation
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Real results from real users who transformed their workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial cards */}
            <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm mb-4 italic group-hover:text-foreground transition-colors">
                &quot;Finally understood n8n! The step-by-step approach made complex automation simple. Built my first workflow in 30 minutes.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-semibold">
                  S
                </div>
                <div>
                  <div className="font-medium text-sm">Sarah M.</div>
                  <div className="text-xs text-muted-foreground">
                    Marketing Specialist
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm mb-4 italic group-hover:text-foreground transition-colors">
                &quot;Saved 15 hours per week automating my sales pipeline. These workflows pay for themselves instantly.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-semibold">
                  M
                </div>
                <div>
                  <div className="font-medium text-sm">Mike R.</div>
                  <div className="text-xs text-muted-foreground">
                    Sales Manager
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border rounded-xl p-6 shadow-sm hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 cursor-pointer group">
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm mb-4 italic group-hover:text-foreground transition-colors">
                &quot;Went from automation newbie to building complex workflows for my entire team. The learning curve is so smooth!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-sm font-semibold">
                  J
                </div>
                <div>
                  <div className="font-medium text-sm">Jessica L.</div>
                  <div className="text-xs text-muted-foreground">
                    Operations Manager
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4"
            >
              <a href="#workflows" className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <span>Start Your First Workflow</span>
              </a>
            </Button>
          </div>
        </div>
      </section>
  );
};
export default TestimonialSection;
