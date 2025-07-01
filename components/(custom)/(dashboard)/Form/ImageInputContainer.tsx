"use client";

import { Button } from "@/components/ui/button";
import { actionFunction } from "@/utils/types";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import FormContainer from "./FormContainer";
import ImageInput from "./ImageInput";
import { SubmitButton } from "./Buttons";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type ImageInputContainerProps = {
  image: string;
  name: string;
  action: actionFunction;
  text: string;
  children?: React.ReactNode;
  stepId?: string;
};

const ImageInputContainer = (props: ImageInputContainerProps) => {
  const { image, name, action, text, stepId } = props;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-orange-200 dark:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-orange-700 dark:text-orange-300 hover:text-orange-800 dark:hover:text-orange-200"
          size="sm"
        >
          <Upload className="w-3 h-3 mr-2" />
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent className="border-2 border-orange-200 dark:border-orange-800 sm:max-w-md">
        <DialogHeader className="space-y-3">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5 text-orange-600" />
            Update Image
          </DialogTitle>
          <DialogDescription className="text-sm">
            Upload a new image for this step. Supported formats: JPG, PNG, GIF,
            SVG.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Image Preview */}
          {image && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Current image:
              </p>
              <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-sm">
                  <Image
                    src={image}
                    alt={name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    This image will be replaced with your new upload
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Upload Form */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Choose new image:
            </p>
            <FormContainer
              action={action}
              setIsUpdateFormVisible={setIsDialogOpen}
            >
              {/* Hidden input to include stepId in form data */}
              {stepId && <input type="hidden" name="stepId" value={stepId} />}
              {props.children}
              <ImageInput />

              {/* Submit and Cancel buttons inside FormContainer */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-700 dark:text-red-300"
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <SubmitButton size="sm" />
                </div>
              </div>
            </FormContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageInputContainer;
