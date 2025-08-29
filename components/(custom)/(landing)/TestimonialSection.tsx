import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Star, Target, Trophy, Zap } from "lucide-react";

const TestimonialSection = () => {
  return (
<section className="py-16 sm:py-24 bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm font-medium mb-6">
              <Trophy className="h-4 w-4" />
              <span>Student Success Stories</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              From Learning to
              <br />
              <span className="text-green-600 dark:text-green-400">Earning</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              See how students built their portfolios and started earning with n8n automation skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Testimonial 1 - First Client */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-card border-2 border-green-500/20 rounded-2xl p-6 hover:border-green-500/40 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                    <DollarSign className="h-3 w-3 mr-1" />
                    $3,200
                  </Badge>
                </div>
                <p className="text-base mb-6 font-medium">
                  &quot;Built my first n8n automation portfolio and landed a $3,200 client project within 6 weeks. The customer support automation I learned here was exactly what they needed.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-sm font-bold text-green-600">
                    S
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Chen</div>
                    <div className="text-sm text-muted-foreground">Freelance Developer</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 - Career Boost */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-card border-2 border-blue-500/20 rounded-2xl p-6 hover:border-blue-500/40 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                    <Zap className="h-3 w-3 mr-1" />
                    +$25k/yr
                  </Badge>
                </div>
                <p className="text-base mb-6 font-medium">
                  &quot;My n8n portfolio got me promoted to Senior Operations Manager with a $25k salary increase. Having working automation examples made all the difference in interviews.&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                    M
                  </div>
                  <div>
                    <div className="font-semibold">Marcus Rodriguez</div>
                    <div className="text-sm text-muted-foreground">Senior Operations Manager</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 - Consulting Business */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
              <div className="relative bg-card border-2 border-purple-500/20 rounded-2xl p-6 hover:border-purple-500/40 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    <Trophy className="h-3 w-3 mr-1" />
                    $120/hr
                  </Badge>
                </div>
                <p className="text-base mb-6 font-medium">
                  &quot;Started my automation consulting business using projects from here as portfolio pieces. Now charging $120/hour and booked solid for 3 months ahead!&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-sm font-bold text-purple-600">
                    J
                  </div>
                  <div>
                    <div className="font-semibold">Jamie Liu</div>
                    <div className="text-sm text-muted-foreground">Automation Consultant</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Portfolio CTA */}
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-8 border">
              <h3 className="text-2xl font-bold mb-4">Ready to Build Your Success Story?</h3>
              <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join hundreds of students who turned their n8n skills into real income and career opportunities.
              </p>
              <Button
                asChild
                size="lg"
                className="bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-4 text-lg"
              >
                <a href="#projects" className="flex items-center gap-3">
                  <Target className="h-5 w-5" />
                  <span>Start Building Your Portfolio</span>
                  <ArrowRight className="h-5 w-5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
  );
};
export default TestimonialSection;
