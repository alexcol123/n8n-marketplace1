"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import CredentialSetup from "@/components/(custom)/(credentials-for-portfolio)/CredentialsForm";
import AutoFormGenerator from "@/components/(custom)/AutoFormGenerator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fetchWorkflowBySlug, fetchWorkflowById } from "@/utils/actions";

interface WorkflowListItem {
  id: string;
  title: string;
  workflowImage: string;
  creationImage: string | null;
  createdAt: Date;
  authorId: string;
  slug: string;
  viewCount: number;
  author: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    profileImage: string;
  };
  WorkflowTeachingGuide: {
    whatYoullBuildSummary: string | null;
  } | null;
}

interface WorkflowData {
  id: string;
  title: string;
  workFlowJson: Record<string, unknown>;
  slug: string;
}

export default function CartoonVideoGeneratorPage() {
  const pathname = usePathname();
  const [workflows, setWorkflows] = useState<WorkflowListItem[]>([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingWorkflow, setLoadingWorkflow] = useState(false);

  // Fetch workflow that matches this portfolio site by slug
  useEffect(() => {
    const loadWorkflows = async () => {
      try {
        // Extract slug from pathname: "/dashboard/portfolio/00001-never-miss-a-customer-query-again" -> "00001-never-miss-a-customer-query-again"
        const slug = pathname.split('/').pop() || '';
        if (slug) {
          const workflowList = await fetchWorkflowBySlug(slug);
          setWorkflows(workflowList);
        }
      } catch (error) {
        console.error("Error loading workflows:", error);
      } finally {
        setLoading(false);
      }
    };

    loadWorkflows();
  }, [pathname]);

  // Handle workflow selection
  const handleWorkflowSelect = async (workflowId: string) => {
    setLoadingWorkflow(true);
    try {
      const workflowData = await fetchWorkflowById(workflowId);
      if (workflowData) {
        setSelectedWorkflow({
          ...workflowData,
          workFlowJson: workflowData.workFlowJson as Record<string, unknown>
        });
      }
    } catch (error) {
      console.error("Error loading workflow:", error);
    } finally {
      setLoadingWorkflow(false);
    }
  };

  const handleBackToList = () => {
    setSelectedWorkflow(null);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading workflows...</div>
      </div>
    );
  }

  // Extract slug for use in component
  const slug = pathname.split('/').pop() || '';

  return (
    <div className="container mx-auto px-4 py-8">
      <CredentialSetup slug={slug} />
      
      {!selectedWorkflow ? (
        // Workflow Selection View
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Select a Workflow to Generate Form</CardTitle>
            <p className="text-sm text-gray-600">
              Choose a workflow from the list below to generate an interactive form based on its trigger nodes.
            </p>
          </CardHeader>
          <CardContent>
            {workflows.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No workflows found. Create a workflow first to generate forms.
              </p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {workflows.map((workflow) => (
                  <Card 
                    key={workflow.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-blue-300"
                    onClick={() => handleWorkflowSelect(workflow.id)}
                  >
                    <CardHeader className="pb-2">
                      <img
                        src={workflow.workflowImage}
                        alt={workflow.title}
                        className="w-full h-32 object-cover rounded-md mb-2"
                      />
                      <CardTitle className="text-lg line-clamp-2">
                        {workflow.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <div className="space-y-2">
                        {workflow.WorkflowTeachingGuide?.whatYoullBuildSummary && (
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {workflow.WorkflowTeachingGuide.whatYoullBuildSummary}
                          </p>
                        )}
                        <div className="flex justify-between items-center text-xs text-gray-500">
                          <span>By {workflow.author.firstName} {workflow.author.lastName}</span>
                          <span>{workflow.viewCount} views</span>
                        </div>
                        <Button 
                          size="sm" 
                          className="w-full mt-2"
                          disabled={loadingWorkflow}
                        >
                          Generate Form
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        // Form Generation View
        <div className="mt-8">
          <div className="mb-4">
            <Button 
              variant="outline" 
              onClick={handleBackToList}
              className="mb-4"
            >
              ← Back to Workflow List
            </Button>
            <h2 className="text-2xl font-bold text-gray-900">
              Form for: {selectedWorkflow.title}
            </h2>
          </div>
          
          {loadingWorkflow ? (
            <div className="text-center py-8">
              <p>Loading workflow data...</p>
            </div>
          ) : (
            <AutoFormGenerator workflowJson={selectedWorkflow.workFlowJson} slug={slug} />
          )}
        </div>
      )}
    </div>
  );
}
