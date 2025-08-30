import { Badge } from "@/components/ui/badge";

import {
  fetchSingleWorkflow,
  fetchWorkflowGuides,
  fetchWorkflowTeachingGuide,
} from "@/utils/actions";


import { CalendarIcon, Clock, Rocket } from "lucide-react";
import { notFound } from "next/navigation";
import ShareButton from "@/components/(custom)/(landing)/ShareButton";

import { ReturnToWorkflowsBtn } from "@/components/(custom)/(dashboard)/Form/Buttons";

import EmptyList from "@/components/(custom)/EmptyList";
import WorkflowVideoSection from "@/components/(custom)/(video)/WorkflowVideoSection";

import WorkflowStepsViewer from "@/components/(custom)/(coding-steps)/WorkflowStepsViewer";
import { Workflow, Profile, WorkflowStep } from "@prisma/client";

import formatDateFunc from "@/utils/functions/formmatDate";
import readingTimeFunc from "@/utils/functions/readingTimeFunc";
import WorkflowTeachingGuideComponent from "@/components/(custom)/(slug)/WorkflowTeachingGuideComponent";
import ZoomableWorkflowImage from "@/components/(custom)/(coding-steps)/ZoomableWorkflowImage";

type WorkflowWithAuthor = Workflow & {
  author: Profile;
  workflowSteps: WorkflowStep[];
};

const SingleWorkflowPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;
  const result = await fetchSingleWorkflow(slug);

  if (!result) {
    return notFound();
  }

  const workflow = result as WorkflowWithAuthor;
  if (!workflow) return <EmptyList />;

  const workflowTeachingGuide = await fetchWorkflowTeachingGuide(workflow.id);
  const teachingGuideData = workflowTeachingGuide.data?.teachingGuide;

  // Create enhanced guide data with fallbacks
  const createEnhancedGuideData = () => {
    const baseWorkflowData = {
      workflowImage: workflow.creationImage || workflow.workflowImage,
      workflowTitle: workflow.title,
      // workflowCategory: removed category field,
      workflowSteps: workflow.workflowSteps?.length || 0,
      workflowJson: workflow.workFlowJson,
      workflowId: workflow.id,
      isVerified: workflow.verifiedAndTested,

    };

    if (teachingGuideData) {
      // Use existing teaching guide data
      return {
        ...teachingGuideData,
        ...baseWorkflowData,
      };
    } else {
      // Create fallback teaching guide
      return {
        id: workflow.id,
        title: workflow.title,
        whatYoullBuild: `Build a **complete automation system** that transforms manual business processes into a profit-generating machine working 24/7. This comprehensive automation uses **n8n** to orchestrate ${
          workflow.workflowSteps?.length || 0
        } interconnected workflow steps, reducing what typically takes 2-4 hours of manual work down to just 5-10 minutes of automated execution. Your system handles complex data processing, service integrations, and business logic without human intervention—turning operational bottlenecks into competitive advantages. The result is a scalable, professional-grade automation that eliminates repetitive tasks, connects multiple services seamlessly, and operates continuously to generate value while you focus on strategic growth and client acquisition.`,
        possibleMonetization: `Transform this automation into a profitable service business. Charge local businesses $497 for initial setup and implementation, then $197/month for ongoing maintenance and optimization. With just 20-25 clients, you're earning $4,940/month helping businesses automate their operations while you focus on scaling your automation consultancy.`,
        toolsUsed: [
          "n8n - Powerful workflow automation platform that connects any service",
          "Webhooks - Instant triggers that start automations when events happen",
          "HTTP Requests - Universal connector for any web service or API",
          "Custom APIs - Service integrations for seamless data flow",
        ],
        ...baseWorkflowData,
      };
    }
  };

  // Calculate complexity first
  const orderedSteps = workflow.workflowSteps
    ? [...workflow.workflowSteps]
    : [];





  const enhancedGuideData = createEnhancedGuideData();



  const readingTime = readingTimeFunc(
    "", // removed content field
    workflow?.workflowSteps?.map(
      (step) => step.stepDescription || step.stepTitle || ""
    ) || []
  );

  // 2. Fetch guides for this workflow (new)
  const guideLookup = await fetchWorkflowGuides(workflow.workflowSteps);

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back button */}
        <div className="mb-12">
          <ReturnToWorkflowsBtn />
        </div>

        {/* Hero section */}
        <header className="mb-24">
          <div className="space-y-10">
            {/* Top metadata row with improved styling */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              <div className="flex items-center gap-6">
                {/* Enhanced view counter */}
                <div className="group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-full border border-emerald-200/50 dark:border-emerald-700/50 transition-all duration-300 hover:shadow-md hover:scale-105">
                  <div className="relative">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <div className="absolute inset-0 h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                  </div>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {workflow.viewCount.toLocaleString()}
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-500">
                    views
                  </span>
                </div>
              </div>

              {/* Enhanced verified badge */}
              {workflow.verifiedAndTested && (
                <Badge className="group bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/30 dark:to-green-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-700 hover:from-emerald-100 hover:to-green-100 dark:hover:from-emerald-900/40 dark:hover:to-green-900/40 font-semibold px-4 py-2 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105">
                  <svg
                    className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform duration-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Verified & Tested
                </Badge>
              )}
            </div>

            {/* Enhanced title with gradient */}
            <div className="space-y-6">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent">
                  {workflow.title}
                </span>
              </h1>
            </div>

            {/* Enhanced metadata indicators */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Reading time with hover effect */}
                <div className="group inline-flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-muted/60 to-muted/40 hover:from-muted/80 hover:to-muted/60 rounded-xl border border-border/60 hover:border-border transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-default">
                  <Clock className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {readingTime} min read
                  </span>
                </div>

                {/* Date with hover effect */}
                <div className="group inline-flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-muted/60 to-muted/40 hover:from-muted/80 hover:to-muted/60 rounded-xl border border-border/60 hover:border-border transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-default">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {formatDateFunc(workflow.createdAt)}
                  </span>
                </div>

                {/* Steps count indicator */}
                <div className="group inline-flex items-center gap-2.5 px-4 py-2.5 bg-gradient-to-r from-primary/10 to-primary/5 hover:from-primary/20 hover:to-primary/10 rounded-xl border border-primary/20 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:scale-105 cursor-default">
                  <div className="flex items-center gap-1">
                    <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                    <div className="h-2 w-2 rounded-full bg-primary/40"></div>
                    <div className="h-2 w-2 rounded-full bg-primary/20"></div>
                  </div>
                  <span className="text-sm font-semibold text-primary">
                    {workflow.workflowSteps?.length || 0} workflow steps
                  </span>
                </div>
              </div>

              {/* Share button moved to the right */}
              <div className="transform hover:scale-105 transition-transform duration-300">
                <ShareButton
                  propertyId={workflow.slug}
                  name={workflow.title}
                  description="Complete full-stack project with n8n automation backend and modern frontend. Perfect for building your portfolio and demonstrating real value to clients."
                  imageUrl={workflow.creationImage || workflow.workflowImage}
                  variant="default"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="">
          <div className="mb-20">
            <WorkflowTeachingGuideComponent guide={enhancedGuideData} />
          </div>
        </div>

        {/* Call to action */}
        <div className="mt-16 mb-10">
          <div className="inline-flex text-xl items-center justify-center px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
            <Rocket className="h-5 w-5 mr-2" />
            Free Teaching Guide Below, Start Building Your Business Today
            <div className="ml-2 w-2 h-2 bg-primary-foreground rounded-full animate-ping"></div>
          </div>
        </div>

        <ZoomableWorkflowImage
          imageSrc={workflow.workflowImage}
          imageAlt={workflow.title}
        />

        {/* Video */}
        {workflow.videoUrl && (
          <WorkflowVideoSection 
            videoUrl={workflow.videoUrl}
            title={workflow.title}
          />
        )}

        {/* Tutorial sections */}
        {workflow.workFlowJson && (
          <section className="mb-20">
            <WorkflowStepsViewer
              workflowSteps={orderedSteps}
              // workflowJson={workflow.workFlowJson}
              workflowId={workflow.id}
              showStats={true}
              canEditSteps={false}
              guideLookup={guideLookup}
            />
          </section>
        )}
      </div>
    </main>
  );
};

export default SingleWorkflowPage;
