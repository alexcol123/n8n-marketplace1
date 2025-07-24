// app/admin/node-guides/[id]/edit/page.tsx

import EditNodeGuideForm from "@/components/(custom)/(admin)/edit/EditNodeGuideForm";
import { getNodeSetupGuide } from "@/utils/actions";
import { notFound } from "next/navigation";

import { parseJsonArray } from "@/utils/jsonHelpers";

interface PageProps {
  params: Promise<{ id: string }>;
}



export default async function EditNodeGuidePage({ params }: PageProps) {
  // Simply await the params Promise
  const { id } = await params;

  const guideData = await getNodeSetupGuide(id);

  if (!guideData) {
    notFound();
  }

  // Transform the data to match EditNodeGuideForm expectations
  const guide = {
    id: guideData.id,
    serviceName: guideData.serviceName,
    hostIdentifier: guideData.hostIdentifier,
    title: guideData.title,
    description: guideData.description,
    credentialGuide: guideData.credentialGuide,
    credentialVideo: guideData.credentialVideo,
    setupInstructions: guideData.setupInstructions,
    nodeImage: guideData.nodeImage,
    
    // Transform JsonValue fields to expected array types
    credentialsLinks: parseJsonArray<{ title: string; url: string }>(guideData.credentialsLinks),
    helpLinks: parseJsonArray<{ title: string; url: string }>(guideData.helpLinks),
    videoLinks: parseJsonArray<{ title: string; url: string }>(guideData.videoLinks),
    troubleshooting: parseJsonArray<{ issue: string; solution: string }>(guideData.troubleshooting),
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Node Setup Guide</h1>
          <p className="text-muted-foreground mt-2">
            Update the setup guide for {guide.serviceName}
          </p>
        </div>

        <EditNodeGuideForm guide={guide} />
      </div>
    </div>
  );
}