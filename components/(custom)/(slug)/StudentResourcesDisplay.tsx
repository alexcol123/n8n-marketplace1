"use client";

import React from "react";
import { BookOpen, ExternalLink,  } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StudentResourcesData, StudentResource } from "@/utils/types";

interface StudentResourcesDisplayProps {
  resources: StudentResourcesData | null;
}

export default function StudentResourcesDisplay({ resources }: StudentResourcesDisplayProps) {
  if (!resources || !resources.resources || resources.resources.length === 0) {
    return null;
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary/10 via-primary/5 to-transparent dark:from-primary/5 dark:via-primary/[0.02] dark:to-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 text-green-600 dark:text-green-400 text-sm font-medium mb-6">
            <BookOpen className="h-4 w-4 mr-2" />
            Student Resources
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-4">
            Everything You Need to Get Started
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access templates, sample data, and learning materials to help you build this project successfully
          </p>
        </div>

        {/* Resources List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.resources.map((resource, index) => (
            <ResourceCard key={index} resource={resource} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Resource Card Component
function ResourceCard({ 
  resource 
}: { 
  resource: StudentResource;
}) {
  return (
    <div className="group relative bg-card hover:bg-accent/5 border border-border hover:border-primary/30 rounded-xl p-6 transition-all duration-200">
      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-200">
          🔗
        </div>
        <div className="space-y-3">
          <h4 className="font-semibold text-lg text-foreground">
            {resource.name}
          </h4>
          {resource.description && (
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {resource.description}
            </p>
          )}
          <div className="pt-2">
            <Button
              asChild
              size="sm"
              variant="outline"
              className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
            >
              <a 
                href={resource.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="gap-2"
              >
                <span>Access Resource</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}