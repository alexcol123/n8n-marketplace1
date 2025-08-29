import Navbar from "@/components/(custom)/(landing)/Navbar";
import Footer from "@/components/(custom)/(landing)/Footer";
import HeroLandingSection from "@/components/(custom)/(landing)/HeroLandingSection";
import TestimonialSection from "@/components/(custom)/(landing)/TestimonialSection";
import CardsContainer from "@/components/(custom)/(landing)/CardsContainer";
import LoadingCards from "@/components/(custom)/(landing)/LoadingCards";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function Home() {

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}

      <HeroLandingSection />

      {/* Full-Stack Projects Section */}
      <section className="py-16 sm:py-24" id="projects">
        <div className="container mx-auto px-4">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-sm font-medium mb-6">
              <Code className="h-4 w-4" />
              <span>Full-Stack Portfolio Projects</span>
            </div>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Build Complete Projects
              <br />
              <span className="text-green-600 dark:text-green-400">For Your Portfolio</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Choose from our collection of full-stack applications. Each project combines n8n automation 
              with modern frontend frameworks to create portfolio-ready solutions.
            </p>
          </div>

          {/* Projects Cards using existing CardsContainer */}
          <Suspense fallback={<LoadingCards />}>
            <CardsContainer />
          </Suspense>


        </div>
      </section>

      {/* Testimonial Section*/}
      <TestimonialSection />
      <Footer />
    </div>
  );
}
