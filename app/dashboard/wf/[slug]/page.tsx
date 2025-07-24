import { fetchSingleWorkflow, fetchWorkflowGuides } from "@/utils/actions";
import { notFound } from "next/navigation";
import EmptyList from "@/components/(custom)/EmptyList";
import WorkflowStepsViewer from "@/components/(custom)/(coding-steps)/WorkflowStepsViewer";
import { Workflow, Profile, WorkflowStep } from "@prisma/client";

import {
  ChevronDown,
  Edit,
  Info,
  Upload,
  BookOpen,
  Zap,
  CheckCircle,
} from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";

type WorkflowWithAuthor = Workflow & {
  author: Profile;
  workflowSteps: WorkflowStep[];
};

const EditWorkflowSteps = async ({
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

  const user = await currentUser();
  const isCreator = user?.id === workflow.author.clerkId;
  const isAdmin = user?.id === process.env.ADMIN_USER_ID;

  const canEditSteps = isCreator || isAdmin;

  // 2. Fetch guides for this workflow (new)
  // 2. Fetch guides for this workflow (new)
  const guideLookup = await fetchWorkflowGuides(workflow.workflowSteps);



  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-5xl">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-card rounded-xl shadow-sm border p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Edit className="h-6 w-6 text-primary" />
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold mb-2">
                  Edit Steps for : {workflow.title}
                </h1>
                <p className="text-muted-foreground leading-relaxed">
                  Add detailed instructions, screenshots, and helpful resources
                  to make your workflow easier to follow.
                </p>

                <div className="flex items-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span>{orderedSteps.length} steps</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>Creator mode</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tutorial Guide */}
        <div className="mb-8 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0 w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>

            <div className="flex-1">
              <h2 className="text-lg font-semibold text-amber-900 dark:text-amber-100 mb-3">
                How to enhance your workflow
              </h2>

              <p className="text-amber-800 dark:text-amber-200 mb-4">
                Click{" "}
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded text-xs font-medium">
                  <ChevronDown className="h-3 w-3" />
                  View Details
                </span>{" "}
                on any step below to start adding helpful content.
              </p>

              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 mb-4 border border-blue-200 dark:border-blue-800">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Smart approach
                </h3>
                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                  Focus on complex steps with APIs, configurations, or common
                  errors. Simple steps often work fine as-is.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="font-medium mb-3 text-green-700 dark:text-green-300">
                    What you can add:
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Step explanations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>API information</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Screenshots</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                      <span>Troubleshooting tips</span>
                    </li>
                  </ul>

                  <div className="flex gap-2 mt-3">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded text-orange-800 dark:text-orange-200 text-xs">
                      <Upload className="h-3 w-3" />
                      Update Image
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded text-blue-800 dark:text-blue-200 text-xs">
                      <Edit className="h-3 w-3" />
                      Edit Details
                    </span>
                  </div>
                </div>

                <div className="bg-card rounded-lg p-4 border">
                  <h3 className="font-medium mb-3 text-purple-700 dark:text-purple-300">
                    Priority steps:
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span>API integrations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span>Complex setups</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span>Authentication</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span>Error-prone steps</span>
                    </li>
                  </ul>

                  <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-950/30 rounded border border-purple-200 dark:border-purple-800">
                    <p className="text-xs text-purple-800 dark:text-purple-200">
                      <strong>💡 Tip:</strong> A few well-documented steps are
                      better than editing everything.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Divider */}
        <div className="relative my-12">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-card px-6 py-4 border rounded-xl shadow-sm">
              <h2 className="text-xl font-semibold text-center mb-2 flex items-center justify-center gap-2">
                <Edit className="h-5 w-5 text-primary" />
                Edit Your Steps
              </h2>
              <p className="text-muted-foreground text-center text-sm">
                Click any step below to enhance it
              </p>
              <div className="flex justify-center mt-2">
                <ChevronDown className="h-5 w-5 text-primary animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Workflow Steps */}
        {workflow.workFlowJson && (
          <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
            <div className="p-4 border-b bg-muted/30">
              <h2 className="font-semibold flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Workflow Steps
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                Click on any step to add tutorials and helpful content
              </p>
            </div>

            <div className="p-4">
              <WorkflowStepsViewer
                workflowSteps={orderedSteps}
         
                workflowId={workflow.id}
                showStats={true}
                canEditSteps={canEditSteps}
            guideLookup={guideLookup}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditWorkflowSteps;
