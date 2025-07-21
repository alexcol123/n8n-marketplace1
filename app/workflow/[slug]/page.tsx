import { Badge } from "@/components/ui/badge";

import { fetchSingleWorkflow, fetchWorkflowGuides } from "@/utils/actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  CalendarIcon,
  Clock,
  CheckCircle,
  FileText,
  Info,
  Download,
  Star,
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
import ZoomableWorkflowImage from "@/components/(custom)/(coding-steps)/ZoomableWorkflowImage";
import CreatorCard from "@/components/(custom)/(coding-steps)/CreatorCard";

import getWorkflowComplexityFunc from "@/utils/functions/getWorkflowComplexityFunc";
import getWorkflowComplexityColorFunc from "@/utils/functions/getWorkflowComplexityColorFunc";
import formatDateFunc from "@/utils/functions/formmatDate";
import getNodeCountFunc from "@/utils/functions/getNodeCountFunc";
import readingTimeFunc from "@/utils/functions/readingTimeFunc";

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




  const orderedSteps = workflow.workflowSteps
    ? [...workflow.workflowSteps]
    : [];

  const workflowCharactersLength = JSON.stringify(
    workflow?.workFlowJson
  ).length;
  

  const nodeCount = getNodeCountFunc(workflow.workFlowJson);
  const complexity = getWorkflowComplexityFunc(
    workflow.workFlowJson,
    workflowCharactersLength
  );

  const contentParagraphs = workflow?.content?.split(/\n+/) || [];

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`;
  };

  const readingTime = readingTimeFunc(
    workflow?.content,
    // REMOVED: Array.isArray(workflow?.steps) ? workflow.steps : []
    // Now using workflowSteps array instead of old steps field
    workflow?.workflowSteps?.map(
      (step) => step.stepDescription || step.stepTitle || ""
    ) || []
  );

  // 2. Fetch guides for this workflow (new)
  const guideLookup = await fetchWorkflowGuides(workflow.workflowSteps);



  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back button */}
        <div className="mb-8">
          <ReturnToWorkflowsBtn />
        </div>

        {/* Hero section */}
        <header className="mb-12">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              variant="secondary"
              className="text-xs font-medium px-2 py-1"
            >
              {workflow.category}
            </Badge>
            <span className="text-muted-foreground text-sm">•</span>
            <span className="text-sm text-muted-foreground">
              {workflow.viewCount.toLocaleString()} views
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-8 leading-tight">
            {workflow.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-4 bg-muted/30 rounded-xl border border-primary/10">
            <Link
              href={`/authors/${workflow.author.username}`}
              className="flex items-center gap-4 hover:opacity-80 transition-opacity group"
            >
              <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-md group-hover:border-primary/40 transition-colors">
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
              <div className="space-y-1">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                  {workflow.author.firstName} {workflow.author.lastName}
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    <span>{formatDateFunc(workflow.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{readingTime} min</span>
                  </div>
                </div>
              </div>
            </Link>

            <ShareButton
              propertyId={workflow.slug}
              name={workflow.title}
              description={workflow.content}
              imageUrl={workflow.creationImage || workflow.workflowImage}
              variant="default"
            />
          </div>
        </header>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Featured image */}
          <div className="lg:col-span-2">
            <figure className="relative aspect-video rounded-2xl overflow-hidden shadow-xl border border-primary/10 group">
              <Image
                src={workflow.creationImage || workflow.workflowImage}
                alt={workflow.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"></div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-green-600 text-white shadow-lg border-0">
                  <Star className="h-3 w-3 mr-1" />
                  Ready to Use
                </Badge>
              </div>
            </figure>
          </div>

          {/* Quick stats */}
          <Card className="border-primary/20 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-background to-muted/20 sticky top-8">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold">
                <Info className="h-4 w-4 text-primary" />
                Quick Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/10">
                <div className="text-2xl font-bold text-primary">
                  {nodeCount}
                </div>
                <div className="text-sm text-muted-foreground">
                  Workflow Nodes
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Platform</span>
                  <span className="font-medium">n8n</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Difficulty</span>
                  <Badge
                    variant="outline"
                    className={`text-xs font-medium ${getWorkflowComplexityColorFunc(
                      complexity
                    )}`}
                  >
                    {complexity}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Category</span>
                  <span className="font-medium">{workflow.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3 text-green-600" />
                    <span className="font-medium text-green-600 text-xs">
                      Verified
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-primary/10">
                <WorkflowJsonDownloadButton
                  workflowContent={workflow.workFlowJson}
                  workflowId={workflow.id}
                  title={workflow.title}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FileText className="h-6 w-6 text-primary" />
            What This Workflow Does
          </h2>
          <Card className="border-primary/20 shadow-md">
            <CardContent className="p-8">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {contentParagraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-foreground/90 leading-relaxed mb-4 last:mb-0"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Video */}
        {workflow.videoUrl && (
          <section className="mb-16">
            <YouTubeVideoPlayer
              videoUrl={workflow.videoUrl}
              title={workflow.title}
            />
          </section>
        )}

        {/* Automation steps */}

        {/* Download section */}
        {workflow.workFlowJson && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-primary mb-3 flex items-center justify-center gap-3">
                <Download className="h-8 w-8" />
                Get This Automation
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Ready-to-use JSON file that you can import directly into your
                n8n instance
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-xl"></div>
              <div className="relative bg-background border border-primary/20 rounded-2xl p-1 shadow-xl">
                <WorkflowJsonDisplay
                  workflowContent={workflow.workFlowJson}
                  workflowId={workflow.id}
                  title={workflow.title}
                />
              </div>
            </div>
          </section>
        )}

        {/* Workflow image */}
        <section className="mb-16">
          <ZoomableWorkflowImage
            imageSrc={workflow.workflowImage}
            imageAlt="Workflow Diagram"
            className="rounded-2xl shadow-xl"
          />
        </section>

        {/* Tutorial sections */}
        {workflow.workFlowJson && (
          <section className="mb-16">
            <WorkflowStepsViewer
              workflowSteps={orderedSteps}
              workflowJson={workflow.workFlowJson}
              workflowId={workflow.id}
              showStats={true}
              canEditSteps={false}
              guideLookup={guideLookup}
            />
          </section>
        )}

        {/* Author section */}

        <CreatorCard
          username={workflow.author.username}
          profileImage={workflow.author.profileImage}
          firstName={workflow.author.firstName}
          lastName={workflow.author.lastName}
          bio={workflow.author.bio ?? undefined}
          email={workflow.author.email}
        />
      </div>
    </main>
  );
};

export default SingleWorkflowPage;
