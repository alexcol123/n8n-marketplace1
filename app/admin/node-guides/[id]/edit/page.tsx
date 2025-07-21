// app/admin/node-guides/[id]/edit/page.tsx

import EditNodeGuideForm from "@/components/(custom)/(admin)/edit/EditNodeGuideForm";
import { getNodeSetupGuide } from "@/utils/actions";
import { notFound } from "next/navigation";


interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditNodeGuidePage({ params }: PageProps) {
  // Simply await the params Promise
  const { id } = await params;
  
  const guide = await getNodeSetupGuide(id);
  
  if (!guide) {
    notFound();
  }

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