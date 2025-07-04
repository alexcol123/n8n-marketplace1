import CategoriesList from "@/components/(custom)/CategoriesList";
import CardsContainer from "@/components/(custom)/(landing)/CardsContainer";
import Navbar from "@/components/(custom)/(landing)/Navbar";
import Footer from "@/components/(custom)/(landing)/Footer";
import LoadingCards from "@/components/(custom)/(landing)/LoadingCards";

import { Badge } from "@/components/ui/badge";

import { Suspense } from "react";
import { fetchWorkflows } from "@/utils/actions";

import HeroLandingSection from "@/components/(custom)/(landing)/HeroLandingSection";
import TestimonialSection from "@/components/(custom)/(landing)/TestimonialSection";
import FeaturedWorkflowCard from "@/components/(custom)/(landing)/FeaturedWorkflowCard";
import { Flame } from "lucide-react";

// Get featured/popular workflows
async function getFeaturedWorkflows() {
  // Get top 4 most viewed workflows
  const popularWorkflows = await fetchWorkflows({});
  return popularWorkflows.sort((a, b) => b.viewCount - a.viewCount).slice(0, 4);
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category: string; search: string }>;
}) {
  const category = (await searchParams).category;
  const search = (await searchParams).search;

  // Get featured content
  const popularWorkflows = await getFeaturedWorkflows();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}

      <HeroLandingSection />

      {/* Featured Workflows Section - Simplified for mobile */}
      {popularWorkflows.length > 0 && (
        <section className="py-8 sm:py-16 bg-muted/40 ">
          <div className="container mx-auto px-4">
            {/* Popular Workflows */}
            <div className="space-y-8 sm:space-y-12">
              <div>
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 sm:h-5 sm:w-5 text-orange-500" />
                    <h3 className="text-lg sm:text-xl font-bold">
                      🔥{" "}
                      <span className="hidden sm:inline">
                        Most Popular This Week
                      </span>
                      <span className="sm:hidden">Popular</span>
                    </h3>
                  </div>
                  <Badge className="bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 text-xs">
                    Trending
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {popularWorkflows.map((workflow) => (
                    <FeaturedWorkflowCard
                      key={workflow.id}
                      workflow={workflow}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main content */}
      <div className="flex-grow" id="workflows">
        {/* Section header */}
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-4">
              Choose Your Learning Path
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore workflows by category and start building your automation
              expertise today
            </p>
          </div>
        </div>

        {/* Categories */}
        <CategoriesList category={category} search={search} />

        {/* Workflows grid with Suspense */}
        <div className="container mx-auto px-4 pb-8 sm:pb-12">
          <Suspense fallback={<LoadingCards />}>
            <CardsContainer category={category} search={search} />
          </Suspense>
        </div>
      </div>

      {/* Testimonial Section*/}
      <TestimonialSection />
      <Footer />
    </div>
  );
}
