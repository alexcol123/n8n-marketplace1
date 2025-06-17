import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchSingleWorkflow } from "@/utils/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  CalendarIcon,
  Clock,
  Eye,
  BarChart,
  Users,
  CheckCircle,
  Briefcase,
  Zap,
  Code,
  FileText,
  Info,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import WorkflowJsonDisplay from "@/components/(custom)/(download)/WorkFlowJsonDisplay";
import { WorkflowJsonDownloadButton } from "@/components/(custom)/(download)/WorkflowJsonDownloadButton";
import ShareButton from "@/components/(custom)/(landing)/ShareButton";

import { ReturnToWorkflowsBtn } from "@/components/(custom)/(dashboard)/Form/Buttons";

import EmptyList from "@/components/(custom)/EmptyList";
import YouTubeVideoPlayer from "@/components/(custom)/(video)/YoutubeVideoPlayer";

import WorkflowStepsViewer from "@/components/(custom)/(coding-steps)/WorkflowStepsViewer";
import { Workflow, Profile, WorkflowStep } from "@prisma/client";
// Import the YouTube player component

type WorkflowWithAuthor = Workflow & {
  author: Profile;
  workflowSteps: WorkflowStep[]; // Add this line
};

interface ErrorResponse {
  message: string;
  success: boolean;
}

function isErrorResponse(obj: unknown): obj is ErrorResponse {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "message" in obj &&
    "success" in obj &&
    typeof (obj as ErrorResponse).message === "string" &&
    typeof (obj as ErrorResponse).success === "boolean"
  );
}

// Helper function to calculate workflow complexity - moved outside component for reuse in metadata
const getWorkflowComplexity = (
  workflowJson: unknown,
  workflowCharactersLength: number
) => {
  // Get the node count
  let nodeCount = 0;
  try {
    nodeCount =
      typeof workflowJson === "object" &&
      workflowJson !== null &&
      Array.isArray((workflowJson as { nodes: unknown[] }).nodes)
        ? Array.isArray((workflowJson as { nodes: unknown[] }).nodes)
          ? (workflowJson as { nodes: unknown[] }).nodes.length
          : 0
        : 0;
  } catch {
    nodeCount = 0;
  }

  // First consider node count
  if (nodeCount >= 13) return "Advanced";
  if (nodeCount >= 7) return "Intermediate";

  // If node count is low, fallback to character length
  if (workflowCharactersLength > 6000) return "Advanced";
  if (workflowCharactersLength > 4000) return "Intermediate";

  // Default to Basic
  return "Basic";
};

const SingleWorkflowPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>;
}) => {
  const { slug } = await params;

  const result = await fetchSingleWorkflow(slug);

  const orderedSteps = [...result.workflowSteps];



  // Check if result is an error response
  if (!result || isErrorResponse(result)) {
    return notFound();
  }

  const workflowId = result.id;

  // At this point, TypeScript knows result must be a WorkflowWithAuthor
  const workflow = result as WorkflowWithAuthor;

  if (!workflow) {
    return <EmptyList />;
  }

  const workflowCharactersLength = JSON.stringify(
    workflow?.workFlowJson
  ).length;

  // Get the number of nodes in the workflow
  const getNodeCount = () => {
    try {
      const data = workflow.workFlowJson;
      return data &&
        typeof data === "object" &&
        "nodes" in data &&
        Array.isArray(data.nodes)
        ? data.nodes.length
        : 0;
    } catch {
      return 0;
    }
  };

  const nodeCount = getNodeCount();

  // Use the shared complexity function
  const complexity = getWorkflowComplexity(
    workflow.workFlowJson,
    workflowCharactersLength
  );

  // Format the content into paragraphs for better readability
  const contentParagraphs = workflow?.content?.split(/\n+/) || [];

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };

  // Improved reading time calculation
  const wordsPerMinute = 200;

  // Count words in main content
  const wordsContentLength = workflow?.content?.split(/\s+/).length || 0;

  // Count words in steps, properly handling each step

  const wordStepsLength = workflow?.steps
    ? // @ts-expect-error: Steps may contain non-string values, handled safely
      workflow.steps.reduce((total, step) => {
        return (
          total + (typeof step === "string" ? step.split(/\s+/).length : 0)
        );
      }, 0)
    : 0;

  // Add both counts together
  const wordsTotal = wordsContentLength + wordStepsLength;

  // Calculate reading time, minimum 1 minute
  const readingTime = Math.max(1, Math.ceil(wordsTotal / wordsPerMinute));

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      {/* Add JSON-LD Schema for SEO */}

      {/* Back button */}
      <div className="mb-6">
        <ReturnToWorkflowsBtn />
      </div>

      {/* Hero section with improved spacing and animations */}
      <div className="space-y-5 mb-10">
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-primary/90 text-primary-foreground px-4 py-1 hover:bg-primary shadow-sm transition-all">
            {workflow.category}
          </Badge>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
          {workflow.title}  
        </h1>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 pt-2">
          <Link
            href={`/authors/${workflow.author.username}`}
            className="flex items-center space-x-4 "
          >
            <Avatar className="h-12 w-12 border-2 border-background shadow-md ">
              <AvatarImage
                src={workflow.author.profileImage}
                alt={`${workflow.author.firstName} ${workflow.author.lastName}`}
              />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {getInitials(
                  workflow.author.firstName,
                  workflow.author.lastName
                )}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1  text-foreground  hover:text-primary">
              <h3 className="text-sm font-medium">
                {workflow.author.firstName} {workflow.author.lastName}
              </h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="mr-1 h-3 w-3" aria-hidden="true" />
                <span>{formatDate(workflow.createdAt)}</span>
                <span className="mx-2 text-primary/30">•</span>
                <Clock className="mr-1 h-3 w-3" aria-hidden="true" />
                <span>{readingTime} min read</span>
                <span className="mx-2 text-primary/30">•</span>
                <Eye className="mr-1 h-3 w-3" aria-hidden="true" />
                <span>{workflow.viewCount.toLocaleString()} views</span>
              </div>
            </div>
          </Link>

          <div className="flex space-x-2 mt-3 sm:mt-0">
            <ShareButton
              propertyId={workflow.slug}
              name={workflow.title}
              description={workflow.content}
              imageUrl={workflow.workflowImage}
              variant="default"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Featured image with enhanced styling */}
        <figure className="relative aspect-video rounded-xl overflow-hidden bg-muted md:col-span-2 shadow-md border border-primary/10 transform hover:scale-[1.01] transition-transform duration-300">
          <Image
            src={workflow.workflowImage}
            alt={workflow.title}
            fill
            priority
            sizes="(max-width: 896px) 100vw, 66vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-70"></div>

          {/* "Ready to use" badge for better UX */}
          <div className="absolute top-4 right-4">
            <Badge className="bg-primary text-primary-foreground shadow-lg">
              Ready to Use
            </Badge>
          </div>
        </figure>

        {/* Quick stats card with improved styling */}
        <Card className="py-1 h-full flex flex-col justify-between border-primary/20 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-primary/10">
            <CardTitle className="text-xl font-bold flex items-center gap-2 mt-1">
              <Info className="h-5 w-5 text-primary " />
              Automation Specifications
            </CardTitle>
            <CardDescription>
              Technical details about this workflow
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Node Count field */}
            <div className="flex items-center gap-3 p-2 rounded-md bg-primary/5 border border-primary/10">
              <BarChart className="h-5 w-5 text-primary" />
              <span className="text-sm">
                <strong className="mr-2 text-primary/80">Nodes:</strong>{" "}
                {nodeCount}
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md bg-primary/5 border border-primary/10">
              <Code className="h-5 w-5 text-primary" />
              <span className="text-sm">
                <strong className="mr-2 text-primary/80">Platform:</strong> n8n
                Workflow
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md bg-primary/5 border border-primary/10">
              <Zap className="h-5 w-5 text-primary" />
              <span className="text-sm">
                <strong className="mr-2 text-primary/80">
                  Difficulty Level:
                </strong>{" "}
                {complexity}
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md bg-primary/5 border border-primary/10">
              <Briefcase className="h-5 w-5 text-primary" />
              <span className="text-sm">
                <strong className="mr-2 text-primary/80">Business Use:</strong>{" "}
                {workflow.category}
              </span>
            </div>
            <div className="flex items-center gap-3 p-2 rounded-md bg-primary/5 border border-primary/10">
              <CheckCircle className="h-5 w-5 text-primary" />
              <span className="text-sm">
                <strong className="mr-2 text-primary/80">
                  Tested & Verified:
                </strong>{" "}
                {"Yes"}
              </span>
            </div>
          </CardContent>
          <div className="mt-auto p-6 pt-0">
            <WorkflowJsonDownloadButton
              workflowContent={workflow.workFlowJson}
              workflowId={workflow.id}
              title={workflow.title}
            />
          </div>
        </Card>
      </div>

      {/* Overview section with improved styling */}
      <section className="mb-14">
        <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
          <FileText className="h-6 w-6" />
          What This Workflow Does
        </h2>
        <Card className="border-primary/20 shadow-md overflow-hidden">
          <CardContent className="p-6">
            <article className="prose prose-lg dark:prose-invert max-w-none space-y-4">
              {contentParagraphs.map((paragraph, index) => (
                <p key={index} className="text-foreground leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </article>
          </CardContent>
        </Card>
      </section>

      {/* Add YouTube Video Player section - right after the description */}
      {workflow.videoUrl && (
        <YouTubeVideoPlayer
          videoUrl={workflow.videoUrl}
          title={workflow.title}
        />
      )}

      {workflow?.steps &&
        Array.isArray(workflow.steps) &&
        workflow.steps.length > 0 && (
          <section className="mb-14 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-primary text-center">
              Automation Process
            </h2>

            <Card className="overflow-hidden border-primary/20 shadow-lg pt-0 rounded-xl bg-gradient-to-b from-background to-muted/20 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/15 to-transparent border-b border-primary/20 py-4 sm:py-6">
                <CardTitle className="text-lg sm:text-xl font-bold text-center flex items-center justify-center gap-2">
                  <BarChart className="h-4 w-4 sm:h-5 sm:w-5 text-primary/80 flex-shrink-0" />
                  <span>What This Workflow Automates</span>
                </CardTitle>
                <CardDescription className="text-center pt-1 sm:pt-2 text-xs sm:text-sm">
                  Follow this sequence to understand what this n8n workflow will
                  do for you
                </CardDescription>
              </CardHeader>

              <CardContent className="p-0">
                {workflow.steps.map((step, index) => (
                  <div
                    key={index}
                    className="border-b border-primary/10 last:border-0"
                  >
                    <div className="flex gap-3 sm:gap-5 items-start p-3 sm:p-5 hover:bg-primary/5 transition-all duration-200">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-8 w-8 sm:h-12 sm:w-12 rounded-full bg-gradient-to-br from-primary to-primary/70 text-primary-foreground font-bold text-base sm:text-xl shadow-md transform hover:scale-105 transition-transform">
                          {index + 1}
                        </div>
                      </div>
                      <div className="flex-grow pt-1 sm:pt-2">
                        <p className="text-muted-foreground/90 leading-relaxed text-sm sm:text-base">
                          {typeof step === "object"
                            ? JSON.stringify(step, null, 2)
                            : step}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>

              <div className="p-3 sm:p-5 bg-primary/5 border-t border-primary/10">
                <p className="text-xs sm:text-sm text-center text-muted-foreground">
                  Download this workflow to automate these steps in your own n8n
                  instance
                </p>
              </div>
            </Card>
          </section>
        )}

      {/* Use this Workflow section with improved styling */}
      {workflow.workFlowJson && (
        <section className="mt-14 mb-14">
          <Separator className="my-8 opacity-50" />
          <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
            <Code className="h-6 w-6" />
            Download This Automation
          </h2>
          <p className="text-muted-foreground mb-6">
            Copy the workflow JSON below or download the file to import directly
            into your n8n instance. This automation is ready to use with minimal
            configuration.
          </p>
          <div className="p-1 border rounded-xl bg-gradient-to-r from-primary/30 via-primary/20 to-primary/10 shadow-md">
            <WorkflowJsonDisplay
              workflowContent={workflow.workFlowJson}
              workflowId={workflow.id}
              title={workflow.title}
            />
          </div>
        </section>
      )}

      {/* tutorial sections */}

      {workflow.workFlowJson && (
        <section className="mb-14">
          <h2 className="text-2xl font-semibold mb-6 text-primary text-center">
            Workflow Execution Flow
          </h2>
          <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
            See how this n8n workflow executes step by step, showing the actual
            node sequence and connections.
          </p>

          <div className="max-w-4xl mx-auto">
            <WorkflowStepsViewer
              workflowSteps={orderedSteps}
              workflowJson={workflow.workFlowJson}
              workflowId={workflowId}
              showStats={true}
              className="shadow-lg border-primary/20"
            />
          </div>
        </section>
      )}

      {/* Author section with improved styling */}
      <section className="mb-12 mt-14">
        <Separator className="my-8 opacity-50" />
        <h2 className="text-2xl font-semibold mb-4 text-primary flex items-center gap-2">
          <Users className="h-6 w-6" />
          Workflow Creator
        </h2>
        <section className="flex flex-col items-start gap-6 p-8 bg-primary/5 rounded-xl border border-primary/15 shadow-md">
          <Link
            href={`/authors/${workflow.author.username}`}
            className="flex items-center gap-4 border border-muted/0 rounded-3xl px-1 hover:border-primary"
          >
            <div className="rounded-full p-1 bg-gradient-to-r from-primary/30 to-primary/10">
              <Image
                width={72}
                height={72}
                src={workflow.author.profileImage}
                alt={`${workflow.author.firstName} ${workflow.author.lastName}`}
                className="rounded-full object-cover border-2 border-background"
              />
            </div>
            <h3 className="text-lg font-medium text-foreground">
              Created By:{" "}
              <span className="text-primary font-semibold">
                {workflow.author.firstName} {workflow.author.lastName}
              </span>
            </h3>
          </Link>

          <div className="space-y-3 pl-2">
            <p className="text-muted-foreground leading-relaxed">
              {workflow.author.bio ||
                "This creator specializes in building automation workflows that save time and increase productivity."}
            </p>
            <Link href={`/authors/${workflow.author.username}`}>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 border-primary/20 hover:bg-primary/5 hover:border-primary/40 transition-colors"
              >
                See More Workflows by This Creator
              </Button>
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
};

export default SingleWorkflowPage;
