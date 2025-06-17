"use client";

import { Button } from "@/components/ui/button";
import { actionFunction } from "@/utils/types";
import { LucideUser2, Camera, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import FormContainer from "./FormContainer";
import ImageInput from "./ImageInput";
import { SubmitButton } from "./Buttons";

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

  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);

  const userIcon = (
    <div className="w-16 h-16 bg-gradient-to-br from-primary/80 to-primary rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300">
      <LucideUser2 className="w-8 h-8 text-white" />
    </div>
  );

  return (
    <div className="space-y-3 border-2 border-primary/20 rounded-lg p-4 transition-colors duration-300 group">
      {/* Compact Button Design */}
      <div className="inline-flex items-center gap-3">
        {/* Image Preview */}
        <div className="relative">
          {image ? (
            <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-border/50 shadow-md group-hover:shadow-lg transition-all duration-300">
              <Image
                src={image}
                alt={name}
                width={64}
                height={64}
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Camera className="w-4 h-4 text-white" />
              </div>
            </div>
          ) : (
            userIcon
          )}
        </div>

        {/* Action Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsUpdateFormVisible((prev) => !prev)}
          className={`flex items-center gap-2 transition-all duration-300 border-0 p-0 ${
            isUpdateFormVisible
              ? "bg-transparent hover:bg-transparent"
              : "bg-transparent hover:bg-transparent"
          }`}
        >
          {isUpdateFormVisible ? (
            <>
              <span className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center gap-2">
                <X className="w-3 h-3" />
                Cancel
              </span>
            </>
          ) : (
            <>
              <span className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-md transition-colors duration-300 flex items-center gap-2">
                <Upload className="w-3 h-3" />
                {text}
              </span>
            </>
          )}
        </Button>
      </div>

      {/* Inline Form Container */}
      {isUpdateFormVisible && (
        <div className="mt-3 p-4 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
          <FormContainer
            action={action}
            setIsUpdateFormVisible={setIsUpdateFormVisible}
          >
            {/* Hidden input to include stepId in form data */}
            {stepId && <input type="hidden" name="stepId" value={stepId} />}
            {props.children}
            <ImageInput />
            <div className="mt-3 flex justify-end">
              <SubmitButton size="sm" />
            </div>
          </FormContainer>
        </div>
      )}
    </div>
  );
};

export default ImageInputContainer;
