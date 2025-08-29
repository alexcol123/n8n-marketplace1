import { Badge } from "@/components/ui/badge";

import {
  fetchSingleWorkflow,
  fetchWorkflowGuides,
  fetchWorkflowTeachingGuide,
} from "@/utils/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { CalendarIcon, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ShareButton from "@/components/(custom)/(landing)/ShareButton";

import { ReturnToWorkflowsBtn } from "@/components/(custom)/(dashboard)/Form/Buttons";

import EmptyList from "@/components/(custom)/EmptyList";
import YouTubeVideoPlayer from "@/components/(custom)/(video)/YoutubeVideoPlayer";

import WorkflowStepsViewer from "@/components/(custom)/(coding-steps)/WorkflowStepsViewer";
import { Workflow, Profile, WorkflowStep } from "@prisma/client";

import getWorkflowComplexityFunc from "@/utils/functions/getWorkflowComplexityFunc";
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
      complexity: complexity,
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

  const workflowCharactersLength = JSON.stringify(
    workflow?.workFlowJson
  ).length;

  const complexity = getWorkflowComplexityFunc(
    workflow.workFlowJson,
    workflowCharactersLength
  );

  const enhancedGuideData = createEnhancedGuideData();

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };

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
        <header className="mb-20">
          <div className="space-y-8">
            {/* Top metadata row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <Badge
                  variant="outline"
                  className="text-sm font-medium px-3 py-1.5 bg-background border-border/60 hover:border-border transition-colors"
                >
                  Portfolio Project
                </Badge>

                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                    <span className="font-medium">
                      {workflow.viewCount.toLocaleString()} views
                    </span>
                  </div>
                </div>
              </div>

              {workflow.verifiedAndTested && (
                <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-medium px-3 py-1.5 shadow-none">
                  <svg
                    className="w-3 h-3 mr-1.5"
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

            {/* Main title */}
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-foreground">
                {workflow.title}
              </h1>

              {/* Workflow description */}
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-4xl">
                Complete full-stack project with n8n automation backend and modern frontend. Perfect for building your portfolio and demonstrating real value to clients.
              </p>
            </div>

            {/* Metadata indicators */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border/50">
                <div
                  className={`h-2 w-2 rounded-full ${
                    complexity === "Basic"
                      ? "bg-emerald-500"
                      : complexity === "Intermediate"
                      ? "bg-amber-500"
                      : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm font-medium text-muted-foreground">
                  {complexity} Level
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border/50">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {readingTime} min read
                </span>
              </div>

              <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-lg border border-border/50">
                <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {formatDateFunc(workflow.createdAt)}
                </span>
              </div>
            </div>

            {/* Author and actions row */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pt-4 border-t border-border/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                  <AvatarImage
                    src={workflow.author.profileImage}
                    alt={`${workflow.author.firstName} ${workflow.author.lastName}`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {getInitials(
                      workflow.author.firstName,
                      workflow.author.lastName
                    )}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-foreground">
                    {workflow.author.firstName} {workflow.author.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Workflow Creator
                  </p>
                </div>
              </div>

              <ShareButton
                propertyId={workflow.slug}
                name={workflow.title}
                description="Complete full-stack project with n8n automation backend and modern frontend. Perfect for building your portfolio and demonstrating real value to clients."
                imageUrl={workflow.creationImage || workflow.workflowImage}
                variant="default"
              />
            </div>
          </div>
        </header>

        <div className="mb-20">
          <WorkflowTeachingGuideComponent guide={enhancedGuideData} />
        </div>

        {/* Video */}
        {workflow.videoUrl && (
          <section className="mb-20">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 rounded-3xl blur-xl opacity-50"></div>
              <div className="relative bg-background/50 backdrop-blur-sm border border-primary/10 rounded-3xl p-2 shadow-xl">
                <YouTubeVideoPlayer
                  videoUrl={workflow.videoUrl}
                  title={workflow.title}
                />
              </div>
            </div>
          </section>
        )}

        <ZoomableWorkflowImage
          imageSrc={workflow.workflowImage}
          imageAlt={workflow.title}
        />

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
