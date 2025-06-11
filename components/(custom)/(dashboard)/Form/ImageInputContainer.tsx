"use client";

import { Button } from "@/components/ui/button";
import { actionFunction } from "@/utils/types";
import { LucideUser2 } from "lucide-react";
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
};

const ImageInputContainer = (props: ImageInputContainerProps) => {
  const { image, name, action, text } = props;

  const [isUpdateFormVisible, setIsUpdateFormVisible] = useState(false);

  const userIcon = (
    <LucideUser2 className="w-24 h-24 bg-primary rounded-2xl text-white mb-4" />
  );

  return (
    <div className="flex flex-col md:flex-row justify-between gap-6 my-6 border border-gray-200 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col items-center md:items-start">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={100}
            height={100}
            className="object-cover w-24 h-24 rounded-2xl mb-4 shadow-sm"
          />
        ) : (
          userIcon
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsUpdateFormVisible((prev) => !prev)}
          className="flex items-center gap-2 hover:bg-gray-100"
        >
          {isUpdateFormVisible ? "Cancel" : text}
        </Button>
      </div>

      <div className="flex-1">
        {isUpdateFormVisible && (
          <div className="w-full max-w-xl mt-2 ">
            <FormContainer action={action}>
              {props.children}
              <ImageInput />
              <div className="mt-4">
                <SubmitButton size="sm" />
              </div>
            </FormContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageInputContainer;
