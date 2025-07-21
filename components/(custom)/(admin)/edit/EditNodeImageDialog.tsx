// components/(custom)/(node-guides)/EditNodeImageDialog.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, ImageIcon, Loader2 } from "lucide-react";
import { updateNodeGuideImageAction, getNodeSetupGuide } from "@/utils/actions";
import ImageInputContainer from "@/components/(custom)/(dashboard)/Form/ImageInputContainer";

interface EditNodeImageDialogProps {
  guide: {
    id: string;
    serviceName: string;
  };
  onImageUpdated?: (newImageUrl: string) => void;
}

export default function EditNodeImageDialog({
  guide: initialGuide,
  onImageUpdated,
}: EditNodeImageDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [fullGuide, setFullGuide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !fullGuide) {
      const fetchGuide = async () => {
        setIsLoading(true);
        try {
          const guideData = await getNodeSetupGuide(initialGuide.id);
          setFullGuide(guideData);
        } catch (error) {
          console.error("Error fetching guide:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchGuide();
    }
  }, [isOpen, fullGuide, initialGuide.id]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Edit className="h-4 w-4" />
          Edit Image
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Edit Node Image:{" "}
            <span className="font-bold text-primary uppercase">
              {initialGuide.serviceName}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Upload a screenshot showing how the {initialGuide.serviceName} node
            appears in n8n. This helps users identify the correct node when
            following the setup guide.
          </p>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading guide data...</span>
            </div>
          ) : fullGuide ? (
            <ImageInputContainer
              image={fullGuide.nodeImage || ""}
              name="image"
              action={updateNodeGuideImageAction}
              stepId={fullGuide.id}
              text="Update Node Screenshot"
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              Failed to load guide data
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
